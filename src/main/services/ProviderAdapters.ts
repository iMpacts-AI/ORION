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
  AIPlan
} from './AIProvider';
import { SSEParser, StreamTimeoutConfig, DEFAULT_STREAM_TIMEOUTS } from './SSEParser';

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
    } else if (classification === 'INVALID_KEY' || classification === 'NOT_CONFIGURED') {
      cooldownMs = 3600000; // 1 hour for bad credentials
    }

    if (this.status.consecutiveFailures >= 2 || classification === 'RATE_LIMITED' || classification === 'INVALID_KEY') {
      this.status.isHealthy = false;
      this.status.cooldownUntil = Date.now() + cooldownMs;
    }

    return classification;
  }

  public async classifyIntent(prompt: string): Promise<IntentClassification> {
    const lower = prompt.toLowerCase().trim();

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

    if (lower.includes('cpu') || lower.includes('ram') || lower.includes('memory') || lower.includes('system') || lower.includes('disk') || lower.includes('network') || lower.includes('time')) {
      return {
        intent: 'SYSTEM_QUERY',
        confidence: 0.9,
        suggestedTools: lower.includes('cpu') ? ['system.get_cpu_usage'] : lower.includes('ram') ? ['system.get_memory_usage'] : ['system.get_info']
      };
    }

    if (lower.includes('list files') || lower.includes('read file') || lower.includes('directory')) {
      return {
        intent: 'FILE_OPERATION',
        confidence: 0.9,
        suggestedTools: lower.includes('read') ? ['file.read_text'] : ['file.list_directory']
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

  public abstract chat(prompt: string, conversationHistory?: Array<{ role: string; content: string }>): Promise<string>;

  public async stream(
    prompt: string,
    onToken: (token: string) => void,
    conversationHistory?: Array<{ role: string; content: string }>,
    timeouts: StreamTimeoutConfig = DEFAULT_STREAM_TIMEOUTS,
    externalSignal?: AbortSignal
  ): Promise<string> {
    const fullText = await this.chat(prompt, conversationHistory);
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
      { role: 'system', content: 'You are ORION — Autonomous AI Command Center Assistant. Be concise, technical, and precise.' },
      ...(conversationHistory || []),
      { role: 'user', content: prompt }
    ];

    const url = this.config.baseUrl.endsWith('/chat/completions')
      ? this.config.baseUrl
      : `${this.config.baseUrl}/chat/completions`;

    const controller = new AbortController();

    // Link external cancellation signal if provided
    const onExternalAbort = () => controller.abort();
    if (externalSignal) {
      if (externalSignal.aborted) {
        controller.abort();
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
          const { done, value } = await reader.read();
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
        reader.releaseLock();
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

  public async chat(prompt: string, conversationHistory?: Array<{ role: string; content: string }>): Promise<string> {
    this.reloadCredentials();
    if (!this.isConfigured || !this.apiKey) {
      throw new Error(`Provider ${this.name} is NOT CONFIGURED. Missing environment key: ${this.config.envKeyName}`);
    }

    const start = Date.now();
    try {
      const messages = [
        { role: 'system', content: 'You are ORION — Autonomous AI Command Center Assistant. Be concise, technical, and precise.' },
        ...(conversationHistory || []),
        { role: 'user', content: prompt }
      ];

      const url = this.config.baseUrl.endsWith('/chat/completions')
        ? this.config.baseUrl
        : `${this.config.baseUrl}/chat/completions`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s connection/chat limit

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
          max_tokens: 600
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
      const choice = json.choices?.[0]?.message?.content || 'No response content returned.';
      this.recordSuccess(Date.now() - start);
      return choice;

    } catch (err: any) {
      this.recordFailure(err);
      throw err;
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



