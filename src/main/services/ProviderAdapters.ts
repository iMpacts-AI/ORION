import path from 'path';
import fs from 'fs';
import os from 'os';
import dotenv from 'dotenv';

// Load .env file from project root, resources path, or explicit folder
const possibleEnvPaths = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(process.resourcesPath || '', '.env'),
  path.resolve(path.dirname(process.execPath || ''), '.env'),
  path.resolve(os.homedir(), 'Downloads/ORION/.env')
];
const envPath = possibleEnvPaths.find(p => fs.existsSync(p)) || path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

import {
  IAIProvider,
  ProviderStatus,
  TaskCategory,
  IntentClassification,
  AIPlan,
  LocalHeuristicAIProvider
} from './AIProvider';
import { SSEParser, StreamTimeoutConfig, DEFAULT_STREAM_TIMEOUTS } from './SSEParser';
import {
  classifyConversationalTurn,
  isExplicitFileOperationQuery,
  isExplicitSystemSpecQuery
} from '../../shared/branding/OrionEngineIdentity';

const ORION_CONVERSATIONAL_SYSTEM_PROMPT =
  "You are ORION, a warm, helpful, and capable desktop AI assistant. Match the user's tone naturally: reply warmly and concisely to greetings and casual conversation without hardware specs or internal metadata, and be clear, accurate, and grounded in verified results for technical tasks. Never output internal IDs (such as mem_*), system headers, raw local model names, or personal filesystem paths.";

export type ErrorClassification =
  | 'NOT_CONFIGURED'
  | 'INVALID_KEY'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'MODEL_UNAVAILABLE'
  | 'BAD_REQUEST'
  | 'TIMEOUT'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export interface ProviderAdapterConfig {
  id: string;
  displayName: string;
  envKeyName: string;
  envAccountKeyName?: string;
  baseUrl: string;
  defaultModel: string;
  visionModel?: string;
  codingModel?: string;
  capabilities: {
    supportsTools: boolean;
    supportsVision: boolean;
    supportsStreaming: boolean;
    maxContextTokens: number;
    taskCategories: TaskCategory[];
  };
}

export abstract class BaseCloudProviderAdapter implements IAIProvider {
  public id: string;
  public name: string;
  public isConfigured = false;
  protected apiKey: string | null = null;
  protected accountId: string | null = null;

  protected status: ProviderStatus;

  constructor(protected config: ProviderAdapterConfig) {
    this.id = config.id;
    this.name = config.displayName;
    this.reloadCredentials();

    this.status = {
      id: this.id,
      displayName: this.name,
      isConfigured: this.isConfigured,
      isHealthy: true,
      lastObservedLatencyMs: 0,
      lastObservedTtftMs: 0,
      consecutiveFailures: 0,
      cooldownUntil: 0,
      totalRequests: 0,
      totalErrors: 0,
      currentModel: config.defaultModel,
      capabilities: config.capabilities
    };
  }

  public reloadCredentials(): void {
    this.apiKey = process.env[this.config.envKeyName] || null;
    if (this.config.envAccountKeyName) {
      this.accountId = process.env[this.config.envAccountKeyName] || null;
    }
    this.isConfigured = !!this.apiKey;
    if (this.status) {
      this.status.isConfigured = this.isConfigured;
    }
  }

  public getStatus(): ProviderStatus {
    this.reloadCredentials();
    // Check if cooldown has expired
    if (!this.status.isHealthy && this.status.cooldownUntil > 0 && Date.now() > this.status.cooldownUntil) {
      this.status.isHealthy = true;
      this.status.consecutiveFailures = 0;
      this.status.cooldownUntil = 0;
    }
    return { ...this.status };
  }

  public recordSuccess(latencyMs: number, ttftMs = 0): void {
    this.status.totalRequests++;
    this.status.lastObservedLatencyMs = latencyMs;
    if (ttftMs > 0) this.status.lastObservedTtftMs = ttftMs;
    this.status.consecutiveFailures = 0;
    this.status.isHealthy = true;
  }

  public classifyError(error: any): ErrorClassification {
    const msg = String(error?.message || '').toLowerCase();
    const status = error?.status || 0;

    if (!this.isConfigured || !this.apiKey) return 'NOT_CONFIGURED';
    if (status === 401 || msg.includes('unauthorized') || msg.includes('invalid api key')) return 'INVALID_KEY';
    if (status === 403 || msg.includes('forbidden')) return 'FORBIDDEN';
    if (status === 429 || msg.includes('429') || msg.includes('rate limit') || msg.includes('quota')) return 'RATE_LIMITED';
    if (status === 404 || msg.includes('model_not_found') || msg.includes('does not exist')) return 'MODEL_UNAVAILABLE';
    if (msg.includes('abort') || msg.includes('timeout')) return 'TIMEOUT';
    if (msg.includes('fetch failed') || msg.includes('econnrefused') || msg.includes('network')) return 'NETWORK_ERROR';
    if (status >= 500) return 'SERVER_ERROR';
    return 'UNKNOWN_ERROR';
  }

  public recordFailure(error: any): ErrorClassification {
    this.status.totalRequests++;
    this.status.totalErrors++;
    this.status.consecutiveFailures++;

    const classification = this.classifyError(error);
    this.status.lastErrorCode = classification;

    // Inspect Retry-After header or default
    let cooldownMs = 30000;
    if (classification === 'RATE_LIMITED') {
      const retryAfterHeader = error?.retryAfter;
      if (retryAfterHeader && !isNaN(Number(retryAfterHeader))) {
        cooldownMs = Number(retryAfterHeader) * 1000;
      } else {
        cooldownMs = 60000; // 60s default
      }
    } else if (classification === 'INVALID_KEY' || classification === 'NOT_CONFIGURED' || classification === 'FORBIDDEN' || classification === 'UNAUTHORIZED') {
      cooldownMs = 3600000; // 1 hour for bad credentials / expired OAuth tokens
    } else if (classification === 'NETWORK_ERROR') {
      cooldownMs = 30000; // 30s cooldown when endpoint is unreachable
    }

    if (
      this.status.consecutiveFailures >= 2 ||
      classification === 'RATE_LIMITED' ||
      classification === 'INVALID_KEY' ||
      classification === 'FORBIDDEN' ||
      classification === 'UNAUTHORIZED' ||
      classification === 'NETWORK_ERROR'
    ) {
      this.status.isHealthy = false;
      this.status.cooldownUntil = Date.now() + cooldownMs;
    }

    return classification;
  }

  public async classifyIntent(prompt: string): Promise<IntentClassification> {
    const lower = prompt.toLowerCase().trim();
    if (LocalHeuristicAIProvider.detectUnsupportedCapability(prompt).unsupported) {
      return { intent: 'CONVERSATION', confidence: 0.99 };
    }

    const turnClass = classifyConversationalTurn(prompt);
    if (turnClass.isGreetingOrSmallTalk) {
      return { intent: 'CONVERSATION', confidence: 0.99 };
    }

    if (/^(?:fix\s+it|do\s+it|run\s+that|open\s+it|open\s+that|change\s+it|update\s+it)[.!?]*$/i.test(lower)) {
      return { intent: 'CONVERSATION', confidence: 0.95 };
    }

    const urlInPrompt = prompt.match(/https?:\/\/[^\s"'<>]+/i);
    if (
      urlInPrompt &&
      (lower.includes('open ') || lower.includes('navigate ') || lower.includes('go to ') || lower.includes('visit ') || lower.includes('in chrome'))
    ) {
      const cleanUrl = urlInPrompt[0].replace(/[.,;]+$/, '');
      const openInChromeWindow = lower.includes('in chrome') || lower.includes('open chrome');
      return {
        intent: 'FAST_PATH',
        confidence: 0.99,
        suggestedTools: ['browser.navigate'],
        fastPathMatch: {
          toolId: 'browser.navigate',
          args: { url: cleanUrl, openInChromeWindow }
        }
      };
    }

    if (
      lower.includes('open the official repository') ||
      lower.includes('open official repository') ||
      (lower.includes('official') && lower.includes('orion') && lower.includes('summarize'))
    ) {
      return {
        intent: 'FAST_PATH',
        confidence: 0.99,
        suggestedTools: ['browser.navigate'],
        fastPathMatch: {
          toolId: 'browser.navigate',
          args: { url: 'https://github.com/iMpacts-AI/ORION' }
        }
      };
    }

    if (
      lower.startsWith('search ') ||
      lower.includes('search in chrome') ||
      lower.includes('search for ') ||
      lower.includes('search the web')
    ) {
      const openInChromeWindow =
        lower.includes('in chrome') ||
        lower.includes('open chrome') ||
        lower.includes('using chrome') ||
        lower.includes('visibly');
      const searchQuery = prompt
        .replace(/^search\s+(?:in\s+chrome\s+|the\s+web\s+)?(?:for\s+)?/i, '')
        .replace(/\s+in\s+chrome$/i, '')
        .replace(/\s+and\s+show\s+me\s+the\s+result.*$/i, '')
        .replace(/[.,;]+$/, '')
        .trim();
      return {
        intent: 'FAST_PATH',
        confidence: 0.99,
        suggestedTools: ['browser.search'],
        fastPathMatch: {
          toolId: 'browser.search',
          args: { query: searchQuery || prompt, openInChromeWindow }
        }
      };
    }

    // Kinetic Computer Use & Desktop OS Automation Intent
    if (
      lower.startsWith('open ') ||
      lower.startsWith('try and open ') ||
      lower.startsWith('launch ') ||
      lower.startsWith('start ') ||
      lower.includes('open notepad') ||
      lower.includes('open calculator') ||
      lower.includes('open calc') ||
      lower.includes('open chrome') ||
      lower.includes('open vs code') ||
      lower.includes('open vscode') ||
      lower.includes('open explorer') ||
      lower.includes('open files') ||
      lower.includes('open terminal') ||
      lower.includes('open powershell') ||
      lower.includes('open cmd') ||
      lower.includes('open paint') ||
      lower.includes('open task manager') ||
      lower.startsWith('type ') ||
      lower.startsWith('write ') ||
      lower.startsWith('click ') ||
      lower.startsWith('press ') ||
      lower.startsWith('scroll ') ||
      lower.includes('move cursor') ||
      lower.includes('move mouse') ||
      lower.includes('close window') ||
      lower.includes('close app') ||
      lower.includes('close notepad')
    ) {
      return {
        intent: 'AUTOMATION',
        confidence: 0.99,
        suggestedTools: ['computer.natural_language_command'],
        fastPathMatch: {
          toolId: 'computer.natural_language_command',
          args: { command: prompt }
        }
      };
    }

    if (
      lower.includes('brightness') ||
      lower.includes('backlight') ||
      (lower.includes('screen') && (lower.includes('bright') || lower.includes('dim'))) ||
      (lower.includes('display') && (lower.includes('bright') || lower.includes('dim')))
    ) {
      const pctMatch = lower.match(/(\d{1,3})\s*(?:%|percent)?/);
      const isMutation =
        /\b(set|make|change|adjust|turn|put|increase|decrease|raise|lower|up|down|brighter|dimmer|max|full|minimum)\b/i.test(lower) ||
        (pctMatch !== null && !/\b(is\s+it|check\s+if|whether)\b/i.test(lower));
      if (isMutation && pctMatch) {
        return {
          intent: 'FAST_PATH',
          confidence: 0.99,
          suggestedTools: ['system.set_brightness'],
          fastPathMatch: { toolId: 'system.set_brightness', args: { level: Number(pctMatch[1]) } }
        };
      }
      if (isMutation && /\b(up|increase|raise|brighter|higher)\b/i.test(lower)) {
        return {
          intent: 'FAST_PATH',
          confidence: 0.99,
          suggestedTools: ['system.control'],
          fastPathMatch: { toolId: 'system.control', args: { action: 'brightness_up' } }
        };
      }
      if (isMutation && /\b(down|decrease|lower|dimmer|dim)\b/i.test(lower)) {
        return {
          intent: 'FAST_PATH',
          confidence: 0.99,
          suggestedTools: ['system.control'],
          fastPathMatch: { toolId: 'system.control', args: { action: 'brightness_down' } }
        };
      }
      return {
        intent: 'FAST_PATH',
        confidence: 0.99,
        suggestedTools: ['system.get_brightness'],
        fastPathMatch: { toolId: 'system.get_brightness', args: {} }
      };
    }

    if (isExplicitSystemSpecQuery(prompt)) {
      return {
        intent: 'SYSTEM_QUERY',
        confidence: 0.95,
        suggestedTools:
          lower.includes('spec') ||
          lower.includes('diagnostic') ||
          lower.includes('computer') ||
          lower.includes('machine') ||
          lower.includes('overview') ||
          lower.includes('hardware')
            ? ['system.get_info', 'system.get_cpu_usage', 'system.get_memory_usage', 'system.get_disk_usage']
            : lower.includes('cpu') && (lower.includes('ram') || lower.includes('memory'))
              ? ['system.get_cpu_usage', 'system.get_memory_usage']
              : lower.includes('cpu')
                ? ['system.get_cpu_usage']
                : lower.includes('ram') || lower.includes('memory')
                  ? ['system.get_memory_usage']
                  : lower.includes('disk') || lower.includes('storage')
                    ? ['system.get_disk_usage']
                    : lower.includes('network') || lower.includes('ip')
                      ? ['system.get_network_status']
                      : lower.includes('time') || lower.includes('clock')
                        ? ['system.get_current_time']
                        : ['system.get_info']
      };
    }

    if (isExplicitFileOperationQuery(prompt)) {
      const isRead = /\b(?:read|summarize)\b/i.test(lower) && !/\b(?:list|find\s+the\s+largest)\b/i.test(lower);
      return {
        intent: 'FILE_OPERATION',
        confidence: 0.9,
        suggestedTools: isRead ? ['file.read_text'] : ['file.list_directory']
      };
    }

    return { intent: 'CONVERSATION', confidence: 0.8 };
  }

  public async plan(prompt: string, availableTools: string[]): Promise<AIPlan> {
    const classification = await this.classifyIntent(prompt);
    if (classification.fastPathMatch) {
      return {
        goal: `Process: "${prompt}"`,
        steps: [{
          stepNumber: 1,
          actionDescription: `Execute ${classification.fastPathMatch.toolId}`,
          toolToCall: classification.fastPathMatch.toolId,
          toolArguments: classification.fastPathMatch.args || {}
        }]
      };
    }

    const steps = (classification.suggestedTools || []).map((toolId, i) => ({
      stepNumber: i + 1,
      actionDescription: `Execute tool ${toolId}`,
      toolToCall: toolId,
      toolArguments: toolId === 'file.list_directory' ? { dirPath: '.' } : {}
    }));

    return { goal: `Process: "${prompt}"`, steps };
  }

  public abstract chat(
    prompt: string,
    conversationHistory?: Array<{ role: string; content: string }>,
    externalSignal?: AbortSignal
  ): Promise<string>;

  public async stream(
    prompt: string,
    onToken: (token: string) => void,
    conversationHistory?: Array<{ role: string; content: string }>,
    timeouts: StreamTimeoutConfig = DEFAULT_STREAM_TIMEOUTS,
    externalSignal?: AbortSignal
  ): Promise<string> {
    if (externalSignal?.aborted) {
      throw new Error('Operation cancelled by AbortSignal.');
    }
    const fullText = await this.chat(prompt, conversationHistory, externalSignal);
    if (externalSignal?.aborted) {
      throw new Error('Operation cancelled by AbortSignal.');
    }
    onToken(fullText);
    return fullText;
  }
}

/**
 * Generic OpenAI-Compatible HTTP Provider Adapter
 * Works for Groq, Gemini OpenAI Gateway, GitHub Models, Mistral, Cerebras, NVIDIA, DeepSeek, Cloudflare
 */
export class OpenAICompatibleAdapter extends BaseCloudProviderAdapter {
  public async stream(
    prompt: string,
    onToken: (token: string) => void,
    conversationHistory?: Array<{ role: string; content: string }>,
    timeouts: StreamTimeoutConfig = DEFAULT_STREAM_TIMEOUTS,
    externalSignal?: AbortSignal
  ): Promise<string> {
    this.reloadCredentials();
    if (!this.isConfigured || !this.apiKey) {
      throw new Error(`Provider ${this.name} is NOT CONFIGURED. Missing environment key: ${this.config.envKeyName}`);
    }

    const start = Date.now();
    let ttftMs = 0;
    let fullResponse = '';

    const messages = [
      { role: 'system', content: ORION_CONVERSATIONAL_SYSTEM_PROMPT },
      ...(conversationHistory || []),
      { role: 'user', content: prompt }
    ];

    const url = this.config.baseUrl.endsWith('/chat/completions')
      ? this.config.baseUrl
      : `${this.config.baseUrl}/chat/completions`;

    const controller = new AbortController();

    // Link external cancellation signal if provided
    const onExternalAbort = () => controller.abort(new Error('Aborted by signal'));
    if (externalSignal) {
      if (externalSignal.aborted) {
        controller.abort(new Error('Aborted by signal'));
      } else {
        externalSignal.addEventListener('abort', onExternalAbort, { once: true });
      }
    }

    let timeoutId: NodeJS.Timeout | null = null;

    const resetTimeout = (ms: number, reason: string) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        controller.abort(new Error(`ORION Stream Timeout (${reason}) after ${ms}ms`));
      }, ms);
    };

    try {
      // Stage 1: Connection Timeout
      resetTimeout(timeouts.connectionTimeoutMs, 'CONNECTION_TIMEOUT');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.defaultModel,
          messages,
          temperature: 0.3,
          max_tokens: 1024,
          stream: true
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        if (timeoutId) clearTimeout(timeoutId);
        const errorText = await response.text();
        const retryAfter = response.headers.get('retry-after');
        const errorObj = { status: response.status, message: `HTTP ${response.status}: ${errorText}`, retryAfter };
        this.recordFailure(errorObj);
        throw new Error(`[${this.name} API Stream Error ${response.status}] Redacted Error Message`);
      }

      if (!response.body) {
        if (timeoutId) clearTimeout(timeoutId);
        throw new Error(`[${this.name}] Response body is null; readable stream unavailable.`);
      }

      // Stage 2: Waiting for First Token (TTFT)
      resetTimeout(timeouts.ttftTimeoutMs, 'TTFT_TIMEOUT');

      const parser = new SSEParser();
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let isFirstToken = true;

      try {
        while (true) {
          if (controller.signal.aborted || externalSignal?.aborted) {
            const reason = controller.signal.reason || externalSignal?.reason;
            throw reason instanceof Error ? reason : new Error(String(reason || 'Aborted by signal'));
          }
          const { done, value } = await Promise.race([
            reader.read(),
            new Promise<never>((_resolve, reject) => {
              const rejectAbort = () => {
                const reason = controller.signal.reason || externalSignal?.reason;
                reject(reason instanceof Error ? reason : new Error(String(reason || 'Aborted by signal')));
              };
              if (controller.signal.aborted || externalSignal?.aborted) {
                rejectAbort();
                return;
              }
              controller.signal.addEventListener('abort', rejectAbort, { once: true });
              externalSignal?.addEventListener('abort', rejectAbort, { once: true });
            })
          ]);
          if (done) break;

          const chunkStr = decoder.decode(value, { stream: true });
          const events = parser.parseChunk(chunkStr);

          for (const ev of events) {
            if (ev.data === '[DONE]') continue;

            try {
              const json = JSON.parse(ev.data);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) {
                if (isFirstToken) {
                  ttftMs = Date.now() - start;
                  isFirstToken = false;
                }

                // Stage 3: Reset Stream Idle / Token Gap Timeout upon receiving valid token
                resetTimeout(timeouts.idleStreamTimeoutMs, 'STREAM_IDLE_TIMEOUT');

                fullResponse += delta;
                onToken(delta);
              }
            } catch (e) {
              // Ignore partial or non-JSON telemetry frames silently
            }
          }
        }

        // Flush remaining buffer
        const remainingEvents = parser.flush();
        for (const ev of remainingEvents) {
          if (ev.data === '[DONE]') continue;
          try {
            const json = JSON.parse(ev.data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              fullResponse += delta;
              onToken(delta);
            }
          } catch (e) {}
        }

      } finally {
        try {
          reader.releaseLock();
        } catch {}
      }

      if (timeoutId) clearTimeout(timeoutId);
      this.recordSuccess(Date.now() - start, ttftMs);
      return fullResponse || 'No response stream generated.';

    } catch (err: any) {
      if (timeoutId) clearTimeout(timeoutId);
      this.recordFailure(err);
      throw err;
    } finally {
      if (externalSignal) {
        externalSignal.removeEventListener('abort', onExternalAbort);
      }
    }
  }

  public async analyzeImage(
    prompt: string,
    imageDataUrl: string,
    conversationHistory?: Array<{ role: string; content: string }>,
    externalSignal?: AbortSignal
  ): Promise<string> {
    this.reloadCredentials();
    if (!this.isConfigured || !this.apiKey) {
      throw new Error(`Provider ${this.name} is NOT CONFIGURED. Missing environment key: ${this.config.envKeyName}`);
    }

    if (!this.config.capabilities.supportsVision) {
      throw new Error(`Provider ${this.name} does NOT support multimodal vision capabilities.`);
    }

    if (!imageDataUrl || typeof imageDataUrl !== 'string' || !imageDataUrl.startsWith('data:image/')) {
      throw new Error(`[${this.name}] Invalid or malformed image data URL provided.`);
    }

    // Safety limit check (e.g. max 10MB base64 string)
    if (imageDataUrl.length > 15 * 1024 * 1024) {
      throw new Error(`[${this.name}] Image payload length (${imageDataUrl.length} chars) exceeds maximum safety limit.`);
    }

    const start = Date.now();
    const modelToUse = this.config.visionModel || this.config.defaultModel;

    const messages = [
      { role: 'system', content: 'You are ORION — Vision Optical Analysis Engine. Analyze screen and visual inputs accurately and technically.' },
      ...(conversationHistory || []),
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt || 'Analyze what is visible on this screen image.' },
          { type: 'image_url', image_url: { url: imageDataUrl } }
        ]
      }
    ];

    const url = this.config.baseUrl.endsWith('/chat/completions')
      ? this.config.baseUrl
      : `${this.config.baseUrl}/chat/completions`;

    const controller = new AbortController();
    const onExternalAbort = () => controller.abort();
    if (externalSignal) {
      if (externalSignal.aborted) controller.abort();
      else externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    }

    const timeoutId = setTimeout(() => controller.abort(new Error(`ORION Vision Request Timeout (15s)`)), 15000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: modelToUse,
          messages,
          max_tokens: 1024,
          temperature: 0.2
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        const retryAfter = response.headers.get('retry-after');
        const errorObj = { status: response.status, message: `HTTP ${response.status}: ${errorText}`, retryAfter };
        this.recordFailure(errorObj);
        throw new Error(`[${this.name} Vision API Error ${response.status}] Redacted Error Message`);
      }

      const json = await response.json();
      const choice = json.choices?.[0]?.message?.content || 'No vision analysis returned.';
      this.recordSuccess(Date.now() - start);
      return choice;

    } catch (err: any) {
      clearTimeout(timeoutId);
      this.recordFailure(err);
      throw err;
    } finally {
      if (externalSignal) {
        externalSignal.removeEventListener('abort', onExternalAbort);
      }
    }
  }

  public async chat(
    prompt: string,
    conversationHistory?: Array<{ role: string; content: string }>,
    externalSignal?: AbortSignal
  ): Promise<string> {
    if (externalSignal?.aborted) {
      throw new Error('Operation cancelled by AbortSignal.');
    }
    this.reloadCredentials();
    if (!this.isConfigured || !this.apiKey) {
      throw new Error(`Provider ${this.name} is NOT CONFIGURED. Missing environment key: ${this.config.envKeyName}`);
    }

    const start = Date.now();
    const controller = new AbortController();
    const onExternalAbort = () => controller.abort(new Error('Operation cancelled by AbortSignal.'));
    if (externalSignal) {
      if (externalSignal.aborted) {
        controller.abort(new Error('Operation cancelled by AbortSignal.'));
      } else {
        externalSignal.addEventListener('abort', onExternalAbort, { once: true });
      }
    }
    const timeoutLimitMs = this.id === 'ollama' ? 12000 : 10000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutLimitMs);

    try {
      const messages = [
        { role: 'system', content: ORION_CONVERSATIONAL_SYSTEM_PROMPT },
        ...(conversationHistory || []),
        { role: 'user', content: prompt }
      ];

      const url = this.config.baseUrl.endsWith('/chat/completions')
        ? this.config.baseUrl
        : `${this.config.baseUrl}/chat/completions`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.defaultModel,
          messages,
          temperature: 0.2,
          max_tokens: this.id === 'ollama' ? 320 : 600
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        const retryAfter = response.headers.get('retry-after');
        const errorObj = { status: response.status, message: `HTTP ${response.status}: ${errorText}`, retryAfter };
        this.recordFailure(errorObj);
        throw new Error(`[${this.name} API Error ${response.status}] Redacted Error Message`);
      }

      const json = await response.json();
      const msgObj = json.choices?.[0]?.message;
      const choice = msgObj?.content || msgObj?.reasoning || msgObj?.reasoning_content || 'No response content returned.';
      this.recordSuccess(Date.now() - start);
      return choice;

    } catch (err: any) {
      clearTimeout(timeoutId);
      if (externalSignal?.aborted) {
        throw new Error('Operation cancelled by AbortSignal.');
      }
      this.recordFailure(err);
      throw err;
    } finally {
      if (externalSignal) {
        externalSignal.removeEventListener('abort', onExternalAbort);
      }
    }
  }
}

// 1. Groq Provider
export class GroqProvider extends OpenAICompatibleAdapter {
  constructor() {
    const defaultModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
    const codingModel = process.env.GROQ_CODING_MODEL || 'qwen/qwen3.8-27b';
    super({
      id: 'groq',
      displayName: 'Groq Cloud LPU',
      envKeyName: 'GROQ_API_KEY',
      baseUrl: 'https://api.groq.com/openai/v1',
      defaultModel,
      codingModel,
      capabilities: {
        supportsTools: true,
        supportsVision: false,
        supportsStreaming: true,
        maxContextTokens: 128000,
        taskCategories: ['FAST_CHAT', 'GENERAL_CHAT', 'TOOL_USE', 'CODING', 'PLANNING']
      }
    });
  }
}

// 2. Gemini Provider (Native OpenAI API compatibility endpoint)
export class GeminiProvider extends OpenAICompatibleAdapter {
  constructor() {
    super({
      id: 'gemini',
      displayName: 'Google Gemini AI',
      envKeyName: 'GEMINI_API_KEY',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
      defaultModel: 'gemini-2.0-flash',
      visionModel: 'gemini-2.0-flash',
      capabilities: {
        supportsTools: true,
        supportsVision: true,
        supportsStreaming: true,
        maxContextTokens: 1048576,
        taskCategories: ['FAST_CHAT', 'GENERAL_CHAT', 'TOOL_USE', 'VISION', 'OCR', 'PLANNING']
      }
    });
  }
}

// 3. GitHub Models Provider
export class GitHubModelsProvider extends OpenAICompatibleAdapter {
  constructor() {
    super({
      id: 'github-models',
      displayName: 'GitHub Models Free Tier',
      envKeyName: 'GITHUB_TOKEN',
      baseUrl: 'https://models.inference.ai.azure.com',
      defaultModel: 'gpt-4o-mini',
      visionModel: 'gpt-4o-mini',
      capabilities: {
        supportsTools: true,
        supportsVision: true,
        supportsStreaming: true,
        maxContextTokens: 128000,
        taskCategories: ['FAST_CHAT', 'GENERAL_CHAT', 'TOOL_USE', 'CODING', 'VISION']
      }
    });
  }
}

// 4. Cerebras Provider
export class CerebrasProvider extends OpenAICompatibleAdapter {
  constructor() {
    super({
      id: 'cerebras',
      displayName: 'Cerebras Ultra-Fast Wafer Engine',
      envKeyName: 'CEREBRAS_API_KEY',
      baseUrl: 'https://api.cerebras.ai/v1',
      defaultModel: 'llama3.1-8b',
      capabilities: {
        supportsTools: true,
        supportsVision: false,
        supportsStreaming: true,
        maxContextTokens: 8192,
        taskCategories: ['FAST_CHAT', 'TOOL_USE']
      }
    });
  }
}

// 5. Mistral Provider
export class MistralProvider extends OpenAICompatibleAdapter {
  constructor() {
    super({
      id: 'mistral',
      displayName: 'Mistral AI Cloud',
      envKeyName: 'MISTRAL_API_KEY',
      baseUrl: 'https://api.mistral.ai/v1',
      defaultModel: 'mistral-small-latest',
      capabilities: {
        supportsTools: true,
        supportsVision: false,
        supportsStreaming: true,
        maxContextTokens: 32768,
        taskCategories: ['GENERAL_CHAT', 'CODING', 'SUMMARIZATION']
      }
    });
  }
}

// 6. NVIDIA NIM Provider
export class NVIDIAProvider extends OpenAICompatibleAdapter {
  constructor() {
    super({
      id: 'nvidia',
      displayName: 'NVIDIA NIM Free Catalog',
      envKeyName: 'NVIDIA_API_KEY',
      baseUrl: 'https://integrate.api.nvidia.com/v1',
      defaultModel: 'meta/llama-3.3-70b-instruct',
      capabilities: {
        supportsTools: true,
        supportsVision: false,
        supportsStreaming: true,
        maxContextTokens: 128000,
        taskCategories: ['COMPLEX_REASONING', 'CODING', 'PLANNING']
      }
    });
  }
}

// 7. DeepSeek Provider
export class DeepSeekProvider extends OpenAICompatibleAdapter {
  constructor() {
    super({
      id: 'deepseek',
      displayName: 'DeepSeek AI Cloud',
      envKeyName: 'DEEPSEEK_API_KEY',
      baseUrl: 'https://api.deepseek.com/v1',
      defaultModel: 'deepseek-chat',
      capabilities: {
        supportsTools: true,
        supportsVision: false,
        supportsStreaming: true,
        maxContextTokens: 64000,
        taskCategories: ['CODING', 'COMPLEX_REASONING', 'GENERAL_CHAT']
      }
    });
  }
}

// 8. Cloudflare Workers AI Provider
export class CloudflareProvider extends OpenAICompatibleAdapter {
  constructor() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || 'account_id';
    super({
      id: 'cloudflare',
      displayName: 'Cloudflare Workers AI',
      envKeyName: 'CLOUDFLARE_API_TOKEN',
      envAccountKeyName: 'CLOUDFLARE_ACCOUNT_ID',
      baseUrl: `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1`,
      defaultModel: '@cf/meta/llama-3.1-8b-instruct',
      capabilities: {
        supportsTools: false,
        supportsVision: false,
        supportsStreaming: true,
        maxContextTokens: 8192,
        taskCategories: ['FAST_CHAT', 'GENERAL_CHAT']
      }
    });
  }
}

// 9. OpenRouter AI Provider (Master AI Brain)
export class OpenRouterProvider extends OpenAICompatibleAdapter {
  constructor() {
    const defaultModel = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct';
    super({
      id: 'openrouter',
      displayName: 'OpenRouter AI Cloud',
      envKeyName: 'OPENROUTER_API_KEY',
      baseUrl: 'https://openrouter.ai/api/v1',
      defaultModel,
      capabilities: {
        supportsTools: true,
        supportsVision: true,
        supportsStreaming: true,
        maxContextTokens: 128000,
        taskCategories: ['COMPLEX_REASONING', 'CODING', 'PLANNING', 'GENERAL_CHAT', 'FAST_CHAT', 'VISION', 'SUMMARIZATION']
      }
    });
  }

  public override async classifyIntent(prompt: string): Promise<IntentClassification> {
    this.reloadCredentials();
    if (!this.isConfigured || !this.apiKey) {
      return super.classifyIntent(prompt);
    }

    try {
      const systemPrompt = `You are the Intent Classification Engine for ORION Desktop AI Command Center.
Classify the user prompt into one of: 'SYSTEM_QUERY', 'FILE_OPERATION', 'APPLICATION_CONTROL', 'VISION', 'TITAN_PIPELINE', 'CONVERSATION', or 'FAST_PATH'.
Output ONLY valid JSON in the format:
{"intent": "SYSTEM_QUERY"|"FILE_OPERATION"|"APPLICATION_CONTROL"|"VISION"|"TITAN_PIPELINE"|"CONVERSATION"|"FAST_PATH", "confidence": 0.95, "suggestedTools": ["tool_id"]}`;

      const url = `${this.config.baseUrl}/chat/completions`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.defaultModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 256
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content?.trim() || '';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.intent) {
            return {
              intent: parsed.intent,
              confidence: parsed.confidence || 0.9,
              suggestedTools: parsed.suggestedTools || []
            };
          }
        }
      }
    } catch (err) {
      // Fallback to heuristic
    }
    return super.classifyIntent(prompt);
  }

  public override async plan(prompt: string, availableTools: string[]): Promise<AIPlan> {
    this.reloadCredentials();
    if (!this.isConfigured || !this.apiKey) {
      return super.plan(prompt, availableTools);
    }

    try {
      const systemPrompt = `You are the Autonomous Task Planner for ORION.
Available Tools: [${availableTools.join(', ')}]
Plan the necessary steps to satisfy the user's goal. If no tools are required, output empty steps.
Prerequisites must strictly be an array of integers representing earlier step numbers (e.g. [1]), NEVER strings.
Output ONLY valid JSON matching this schema:
{
  "goal": "Description of the goal",
  "steps": [
    {
      "stepNumber": 1,
      "actionDescription": "what step does",
      "toolToCall": "one_tool_from_available_tools",
      "toolArguments": {},
      "prerequisites": []
    }
  ]
}`;

      const url = `${this.config.baseUrl}/chat/completions`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.defaultModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 512
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content?.trim() || '';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.goal && Array.isArray(parsed.steps)) {
            // Validate tools belong to availableTools and sanitize prerequisites to strictly valid numbers
            const validSteps = parsed.steps
              .filter((s: any) => availableTools.includes(s.toolToCall))
              .map((s: any, idx: number) => {
                const stepNum = typeof s.stepNumber === 'number' ? s.stepNumber : idx + 1;
                const safePrereqs: number[] = Array.isArray(s.prerequisites)
                  ? s.prerequisites
                      .map((p: any) => (typeof p === 'number' ? p : parseInt(String(p).replace(/\D/g, ''), 10)))
                      .filter((p: number) => !isNaN(p) && p < stepNum)
                  : [];
                return {
                  ...s,
                  stepNumber: stepNum,
                  prerequisites: safePrereqs
                };
              });

            if (validSteps.length > 0) {
              return {
                goal: parsed.goal,
                steps: validSteps
              };
            }
          }
        }
      }
    } catch (err) {
      // Fallback
    }
    return super.plan(prompt, availableTools);
  }
}

// 10. OrcaRouter AI Provider (Multi-Model Gateway & Free Tier Router)
export class OrcaRouterProvider extends OpenAICompatibleAdapter {
  constructor() {
    const defaultModel = process.env.ORCAROUTER_MODEL || 'orcarouter/free';
    super({
      id: 'orcarouter',
      displayName: 'OrcaRouter AI Gateway',
      envKeyName: 'ORCA_API_KEY',
      baseUrl: 'https://api.orcarouter.ai/v1',
      defaultModel,
      capabilities: {
        supportsTools: true,
        supportsVision: false,
        supportsStreaming: true,
        maxContextTokens: 64000,
        taskCategories: ['FAST_CHAT', 'GENERAL_CHAT', 'TOOL_USE', 'CODING', 'PLANNING']
      }
    });
  }
}

// 11. Ollama Local Sovereign AI Provider (Local Inference Hub)
export interface InstalledOllamaModelInfo {
  name: string;
  sizeBytes: number;
  parameterSize: string;
  quantizationLevel: string;
  family: string;
  contextLength: number;
  capabilities: string[];
  supportsTools: boolean;
  supportsVision: boolean;
  supportsThinking: boolean;
}

export class OllamaProvider extends OpenAICompatibleAdapter {
  private static cachedProbeResult: { reachable: boolean; checkedAt: number } | null = null;
  private static cachedModels: InstalledOllamaModelInfo[] = [];
  private static probePromise: Promise<boolean> | null = null;
  private static readonly PROBE_TTL_MS = 30000;

  private static normalizeOllamaBaseUrl(rawHost?: string): string {
    let cleaned = (rawHost || 'http://127.0.0.1:11434').trim().replace(/\/+$/, '');
    if (!cleaned) cleaned = 'http://127.0.0.1:11434';
    if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
      cleaned = `http://${cleaned}`;
    }
    // Convert wildcard daemon bind address 0.0.0.0 to loopback 127.0.0.1 for client requests on Windows
    cleaned = cleaned.replace(/^(https?:\/\/)0\.0\.0\.0(?=[/:]|$)/i, '$1127.0.0.1');
    // Ensure default Ollama port 11434 when host has no explicit port
    if (/^https?:\/\/(?:127\.0\.0\.1|localhost)(?:\/|$)/i.test(cleaned)) {
      cleaned = cleaned.replace(/^(https?:\/\/(?:127\.0\.0\.1|localhost))(\/.*)?$/i, '$1:11434$2');
    }
    return cleaned.endsWith('/v1') ? cleaned : `${cleaned}/v1`;
  }

  constructor() {
    const defaultModel = process.env.OLLAMA_MODEL || 'llama3.1:8b';
    const hostEnv = process.env.OLLAMA_BASE_URL || process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
    const baseUrl = OllamaProvider.normalizeOllamaBaseUrl(hostEnv);

    super({
      id: 'ollama',
      displayName: 'Ollama Local Sovereign Engine',
      envKeyName: 'OLLAMA_API_KEY',
      baseUrl,
      defaultModel,
      codingModel: 'qwen2.5-coder:7b',
      visionModel: 'gemma4:26b',
      capabilities: {
        supportsTools: true,
        supportsVision: true,
        supportsStreaming: true,
        maxContextTokens: 131072,
        taskCategories: ['FAST_CHAT', 'GENERAL_CHAT', 'TOOL_USE', 'CODING', 'PLANNING', 'COMPLEX_REASONING', 'VISION']
      }
    });
    this.reloadCredentials();
    // Kick off nonblocking bounded background probe unless explicitly disabled
    if (process.env.OLLAMA_ENABLED !== 'false' && process.env.OLLAMA_ENABLED !== '0') {
      void this.probeHealth(1500);
    }
  }

  public setModel(modelId: string): void {
    this.config.defaultModel = modelId;
    if (this.status) {
      this.status.currentModel = modelId;
      const meta = OllamaProvider.cachedModels.find(m => m.name === modelId);
      if (meta) {
        this.status.capabilities = {
          ...this.status.capabilities,
          supportsTools: meta.supportsTools,
          supportsVision: meta.supportsVision,
          maxContextTokens: meta.contextLength
        };
      }
    }
  }

  public getActiveModel(): string {
    return this.config.defaultModel;
  }

  public getInstalledModels(): InstalledOllamaModelInfo[] {
    return [...OllamaProvider.cachedModels];
  }

  public override reloadCredentials(): void {
    const enabledEnv = (process.env.OLLAMA_ENABLED || '').trim().toLowerCase();
    if (enabledEnv === 'false' || enabledEnv === '0') {
      this.apiKey = null;
      this.isConfigured = false;
      if (this.status) {
        this.status.isConfigured = false;
      }
      return;
    }

    const explicitlyConfigured =
      enabledEnv === 'true' ||
      enabledEnv === '1' ||
      Boolean(process.env.OLLAMA_API_KEY) ||
      Boolean(process.env.OLLAMA_HOST) ||
      Boolean(process.env.OLLAMA_BASE_URL);

    const cacheReachable =
      OllamaProvider.cachedProbeResult !== null &&
      Date.now() - OllamaProvider.cachedProbeResult.checkedAt < OllamaProvider.PROBE_TTL_MS &&
      OllamaProvider.cachedProbeResult.reachable;

    this.apiKey = process.env.OLLAMA_API_KEY || 'ollama-local';
    this.isConfigured = explicitlyConfigured || cacheReachable;
    if (this.status) {
      this.status.isConfigured = this.isConfigured;
      if (OllamaProvider.cachedProbeResult && !OllamaProvider.cachedProbeResult.reachable && !explicitlyConfigured) {
        this.status.isHealthy = false;
      }
    }
  }

  /**
   * Bounded, nonblocking health check against the local Ollama daemon.
   * Caches result for PROBE_TTL_MS (30s) so dead endpoints are never probed repeatedly on every request.
   */
  public async probeHealth(timeoutMs: number = 350, externalSignal?: AbortSignal): Promise<boolean> {
    const enabledEnv = (process.env.OLLAMA_ENABLED || '').trim().toLowerCase();
    if (enabledEnv === 'false' || enabledEnv === '0') {
      OllamaProvider.cachedProbeResult = { reachable: false, checkedAt: Date.now() };
      this.reloadCredentials();
      return false;
    }

    if (
      OllamaProvider.cachedProbeResult &&
      Date.now() - OllamaProvider.cachedProbeResult.checkedAt < OllamaProvider.PROBE_TTL_MS
    ) {
      this.reloadCredentials();
      return OllamaProvider.cachedProbeResult.reachable;
    }

    if (OllamaProvider.probePromise) {
      return OllamaProvider.probePromise;
    }

    OllamaProvider.probePromise = (async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const onAbort = () => controller.abort();
      if (externalSignal) {
        if (externalSignal.aborted) controller.abort();
        else externalSignal.addEventListener('abort', onAbort, { once: true });
      }

      try {
        const tagsUrl = this.config.baseUrl.replace(/\/v1\/?$/, '') + '/api/tags';
        const res = await fetch(tagsUrl, { method: 'GET', signal: controller.signal });
        clearTimeout(timer);
        const ok = res.ok;
        if (ok) {
          try {
            const json: any = await res.json();
            if (Array.isArray(json?.models)) {
              OllamaProvider.cachedModels = json.models.map((m: any) => {
                const modelName = String(m.name || m.model || '');
                const knownProfiles: Record<string, { contextLength: number; capabilities: string[] }> = {
                  'llama3.1:8b': { contextLength: 131072, capabilities: ['completion', 'tools'] },
                  'qwen2.5-coder:7b': { contextLength: 32768, capabilities: ['completion', 'tools', 'insert'] },
                  'deepseek-r1:14b': { contextLength: 131072, capabilities: ['completion', 'tools', 'thinking'] },
                  'gpt-oss:20b': { contextLength: 131072, capabilities: ['completion', 'tools', 'thinking'] },
                  'gemma4:26b': { contextLength: 262144, capabilities: ['completion', 'vision', 'tools', 'thinking'] },
                  'qwen3-coder:30b': { contextLength: 262144, capabilities: ['completion', 'tools'] }
                };
                const profile = knownProfiles[modelName];
                const caps: string[] = Array.isArray(m.capabilities) ? m.capabilities.map(String) : (profile?.capabilities || ['completion', 'tools']);
                return {
                  name: String(m.name || m.model || ''),
                  sizeBytes: Number(m.size || 0),
                  parameterSize: String(m.details?.parameter_size || ''),
                  quantizationLevel: String(m.details?.quantization_level || ''),
                  family: String(m.details?.family || ''),
                  contextLength: Number(m.details?.context_length || profile?.contextLength || 32768),
                  capabilities: caps,
                  supportsTools: caps.includes('tools'),
                  supportsVision: caps.includes('vision'),
                  supportsThinking: caps.includes('thinking')
                };
              });
            }
          } catch {}
        }
        OllamaProvider.cachedProbeResult = { reachable: ok, checkedAt: Date.now() };
        this.isConfigured = ok;
        if (this.status) {
          this.status.isConfigured = ok;
          this.status.isHealthy = ok;
        }
        return ok;
      } catch {
        clearTimeout(timer);
        OllamaProvider.cachedProbeResult = { reachable: false, checkedAt: Date.now() };
        this.isConfigured = false;
        if (this.status) {
          this.status.isConfigured = false;
          this.status.isHealthy = false;
        }
        return false;
      } finally {
        if (externalSignal) {
          externalSignal.removeEventListener('abort', onAbort);
        }
        OllamaProvider.probePromise = null;
      }
    })();

    return OllamaProvider.probePromise;
  }

  public static resetProbeCache(): void {
    OllamaProvider.cachedProbeResult = null;
    OllamaProvider.probePromise = null;
  }

  /**
   * Local LLM-assisted structured tool planner fallback when deterministic fast-path does not match.
   */
  public override async plan(prompt: string, availableTools: string[]): Promise<AIPlan> {
    if (LocalHeuristicAIProvider.detectUnsupportedCapability(prompt).unsupported) {
      return { goal: `Unsupported: "${prompt}"`, steps: [] };
    }
    const fastPlan = await super.plan(prompt, availableTools);
    if (fastPlan.steps.length > 0) {
      return fastPlan;
    }

    const turnClass = classifyConversationalTurn(prompt);
    const looksConversational =
      turnClass.isGreetingOrSmallTalk ||
      turnClass.isPureConversational ||
      /^(hi|hello|hey|good\s+(?:morning|afternoon|evening|night)|how\s+are\s+you|what'?s\s+up|who\s+are\s+you|what\s+is\s+orion|what\s+can\s+you\s+do|explain|summarize|describe|tell\s+me\s+about|thank\s+you|thanks|my\s+name\s+is|what\s+is\s+my\s+name|what\s+did\s+i)\b/i.test(
        prompt.toLowerCase().trim()
      ) ||
      availableTools.length === 0;
    if (looksConversational) {
      return fastPlan;
    }

    await this.probeHealth(1000);
    if (!this.isConfigured || !this.status.isHealthy) {
      return fastPlan;
    }

    try {
      const toolGuide = [
        'system.get_info: {} (hardware/OS specs)',
        'system.get_cpu_usage: {} (CPU load)',
        'system.get_memory_usage: {} (RAM usage)',
        'system.get_disk_usage: {} (disk storage)',
        'system.get_network_status: {} (IP/network status)',
        'system.get_current_time: {} (local time/date)',
        'system.get_brightness: {} (read display brightness %)',
        'system.set_brightness: {"level": 0..100} (set display brightness %)',
        'system.volume: {"level": "0..100|up|down|mute|unmute"}',
        'system.control: {"action": "mute|unmute|show_desktop|task_view|brightness_up|brightness_down|lock"}',
        'file.list_directory: {"dirPath": "."}',
        'file.read_text: {"filePath": "<relative_path>"}',
        'file.write_text: {"filePath": "<relative_path>", "content": "<text>"}',
        'computer.natural_language_command: {"command": "<open app / desktop action>"}',
        'info.weather: {"city": "<city>"}',
        'info.prayers: {"city": "<city>", "country": "UAE"}',
        'media.status: {}',
        'media.control: {"action": "play|pause|next|previous|toggle"}',
        'media.play_spotify: {"query": "<song_or_artist>"}'
      ].filter(entry => availableTools.includes(entry.split(':')[0].trim()));

      if (toolGuide.length === 0) {
        return fastPlan;
      }

      const plannerPrompt =
        `Select the best tool(s) for the user request from the allowed list below, or return {"steps":[]} if no tool applies or if the request asks for an unsupported capability.\n` +
        `Allowed tools:\n${toolGuide.map(t => `- ${t}`).join('\n')}\n\n` +
        `User request: ${JSON.stringify(prompt)}\n` +
        `Respond ONLY with valid JSON matching: {"steps":[{"toolToCall":"<tool_id>","toolArguments":{}}]}`;

      const raw = await this.chat(plannerPrompt);
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed?.steps)) {
          const validSteps = parsed.steps
            .filter((s: any) => s && typeof s.toolToCall === 'string' && availableTools.includes(s.toolToCall))
            .slice(0, 4)
            .map((s: any, idx: number) => ({
              stepNumber: idx + 1,
              actionDescription: `Execute ${s.toolToCall}`,
              toolToCall: s.toolToCall,
              toolArguments: s.toolArguments && typeof s.toolArguments === 'object' ? s.toolArguments : {}
            }));
          if (validSteps.length > 0) {
            return {
              goal: `Process: "${prompt}"`,
              steps: validSteps
            };
          }
        }
      }
    } catch {}

    return fastPlan;
  }

  public override async chat(
    prompt: string,
    conversationHistory?: Array<{ role: string; content: string }>,
    externalSignal?: AbortSignal
  ): Promise<string> {
    if (externalSignal?.aborted) {
      throw new Error('Operation cancelled by AbortSignal.');
    }
    const reachable = await this.probeHealth(350);
    if (!reachable && process.env.OLLAMA_ENABLED !== 'true' && !process.env.OLLAMA_API_KEY) {
      this.recordFailure(new Error('Ollama local daemon is offline (ECONNREFUSED)'));
      throw new Error('Ollama local daemon is not reachable on ' + this.config.baseUrl);
    }
    return super.chat(prompt, conversationHistory, externalSignal);
  }
}




export const ALLOWED_PROVIDER_ENV_KEYS = new Set<string>([
  'OPENROUTER_API_KEY',
  'OPENROUTER_MODEL',
  'GROQ_API_KEY',
  'GROQ_MODEL',
  'GROQ_CODING_MODEL',
  'GEMINI_API_KEY',
  'GITHUB_TOKEN',
  'CEREBRAS_API_KEY',
  'MISTRAL_API_KEY',
  'NVIDIA_API_KEY',
  'DEEPSEEK_API_KEY',
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_ACCOUNT_ID',
  'ORCA_API_KEY',
  'ORCAROUTER_MODEL',
  'OLLAMA_ENABLED',
  'OLLAMA_HOST',
  'OLLAMA_BASE_URL',
  'OLLAMA_MODEL',
  'OLLAMA_API_KEY',
  'ANTHROPIC_API_KEY',
  'ANTHROPIC_MODEL',
  'OPENAI_API_KEY',
  'GLM_API_KEY'
]);

/**
 * Validates and persists provider environment keys safely to a .env file.
 * Rejects unknown keys, non-object payloads, non-string values, or newline injection attempts.
 * Never logs raw secret values.
 */
export function validateAndSaveProviderKeys(
  keys: unknown,
  targetEnvPath: string = envPath
): { success: boolean; savedKeys: string[]; rejectedKeys: string[]; error?: string } {
  if (!keys || typeof keys !== 'object' || Array.isArray(keys)) {
    return {
      success: false,
      savedKeys: [],
      rejectedKeys: [],
      error: 'Invalid payload: keys must be a non-null key-value object.'
    };
  }

  const entries = Object.entries(keys as Record<string, unknown>);
  const savedKeys: string[] = [];
  const rejectedKeys: string[] = [];
  const sanitizedUpdates: Record<string, string> = {};

  for (const [rawKey, rawVal] of entries) {
    const key = String(rawKey).trim();
    if (!ALLOWED_PROVIDER_ENV_KEYS.has(key)) {
      rejectedKeys.push(key);
      continue;
    }
    if (typeof rawVal !== 'string') {
      rejectedKeys.push(key);
      continue;
    }
    // Reject newline or carriage-return characters to prevent .env line injection
    if (/[\r\n\0]/.test(rawVal)) {
      rejectedKeys.push(key);
      continue;
    }
    const trimmedVal = rawVal.trim();
    if (trimmedVal.length > 0 && trimmedVal.length <= 512) {
      sanitizedUpdates[key] = trimmedVal;
      savedKeys.push(key);
    }
  }

  if (rejectedKeys.length > 0) {
    return {
      success: false,
      savedKeys: [],
      rejectedKeys,
      error: `Rejected unauthorized or malformed provider key(s): ${rejectedKeys.join(', ')}`
    };
  }

  try {
    const envContent = fs.existsSync(targetEnvPath) ? fs.readFileSync(targetEnvPath, 'utf-8') : '';
    const lines = envContent.split(/\r?\n/);
    const envMap: Record<string, string> = {};

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx > 0) {
          envMap[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1);
        }
      }
    }

    for (const [k, v] of Object.entries(sanitizedUpdates)) {
      process.env[k] = v;
      envMap[k] = v;
    }

    const newEnvLines = Object.entries(envMap).map(([k, v]) => `${k}=${v}`);
    fs.writeFileSync(targetEnvPath, newEnvLines.join('\n'), 'utf-8');
    return { success: true, savedKeys, rejectedKeys: [] };
  } catch (err: any) {
    return {
      success: false,
      savedKeys: [],
      rejectedKeys,
      error: err?.message || 'Failed to persist provider keys.'
    };
  }
}

// 12. Anthropic Claude Native Provider (Saif / Nur / Hikmah Intelligence Tiers)
export class AnthropicProvider extends BaseCloudProviderAdapter {
  constructor() {
    const defaultModel = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
    super({
      id: 'anthropic',
      displayName: 'Anthropic Claude API',
      envKeyName: 'ANTHROPIC_API_KEY',
      baseUrl: 'https://api.anthropic.com/v1',
      defaultModel,
      visionModel: 'claude-sonnet-4-6',
      codingModel: 'claude-opus-4-7',
      capabilities: {
        supportsTools: true,
        supportsVision: true,
        supportsStreaming: true,
        maxContextTokens: 200000,
        taskCategories: ['FAST_CHAT', 'GENERAL_CHAT', 'TOOL_USE', 'CODING', 'PLANNING', 'COMPLEX_REASONING', 'VISION', 'SUMMARIZATION', 'STRUCTURED_OUTPUT']
      }
    });
  }

  public setModel(modelId: string): void {
    this.config.defaultModel = modelId;
    if (this.status) {
      this.status.currentModel = modelId;
    }
  }

  public async chat(prompt: string, conversationHistory?: Array<{ role: string; content: string }>): Promise<string> {
    this.reloadCredentials();
    if (!this.isConfigured || !this.apiKey) {
      throw new Error(`Provider ${this.name} is NOT CONFIGURED. Missing environment key: ${this.config.envKeyName}`);
    }

    const start = Date.now();
    const messages = [
      ...(conversationHistory || [])
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: prompt }
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${this.config.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.config.defaultModel,
          max_tokens: 1024,
          system: ORION_CONVERSATIONAL_SYSTEM_PROMPT,
          messages
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        this.recordFailure({ status: response.status, message: errText });
        throw new Error(`[${this.name} API Error ${response.status}] Redacted Error Message`);
      }

      const data = await response.json();
      const text = (data.content || [])
        .filter((b: any) => b.type === 'text')
        .map((b: any) => b.text)
        .join('');
      const latency = Date.now() - start;
      this.recordSuccess(latency, latency);
      return text || 'No response content returned from Anthropic.';
    } catch (err: any) {
      clearTimeout(timeoutId);
      this.recordFailure(err);
      throw err;
    }
  }

  public async analyzeImage(
    prompt: string,
    imageDataUrl: string,
    conversationHistory?: Array<{ role: string; content: string }>,
    externalSignal?: AbortSignal
  ): Promise<string> {
    this.reloadCredentials();
    if (!this.isConfigured || !this.apiKey) {
      throw new Error(`Provider ${this.name} is NOT CONFIGURED.`);
    }

    const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
      throw new Error('Invalid imageDataUrl format for Anthropic vision.');
    }
    const mediaType = match[1];
    const base64Data = match[2];

    const start = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    if (externalSignal) {
      externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.config.visionModel || this.config.defaultModel,
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: mediaType,
                    data: base64Data
                  }
                },
                {
                  type: 'text',
                  text: prompt || 'Analyze this screen capture.'
                }
              ]
            }
          ]
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        this.recordFailure({ status: response.status, message: errText });
        throw new Error(`[${this.name} Vision Error ${response.status}]`);
      }

      const data = await response.json();
      const text = (data.content || [])
        .filter((b: any) => b.type === 'text')
        .map((b: any) => b.text)
        .join('');
      const latency = Date.now() - start;
      this.recordSuccess(latency, latency);
      return text;
    } catch (err: any) {
      clearTimeout(timeoutId);
      this.recordFailure(err);
      throw err;
    }
  }
}
