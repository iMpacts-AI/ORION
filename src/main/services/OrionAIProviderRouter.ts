import {
  IAIProvider,
  ProviderStatus,
  IntentClassification,
  AIPlan,
  TaskCategory,
  LocalHeuristicAIProvider
} from './AIProvider';
import {
  GroqProvider,
  GeminiProvider,
  GitHubModelsProvider,
  CerebrasProvider,
  MistralProvider,
  NVIDIAProvider,
  DeepSeekProvider,
  CloudflareProvider,
  OpenRouterProvider,
  OrcaRouterProvider
} from './ProviderAdapters';
import { eventBus } from '../../shared/events';

export type RoutingStrategy = 'SPEED_FIRST' | 'BALANCED' | 'QUALITY_FIRST' | 'VISION' | 'CODING' | 'AGENT' | 'OFFLINE';

export interface ModelRegistryEntry {
  providerId: string;
  modelId: string;
  displayName: string;
  supportsTools: boolean;
  supportsVision: boolean;
  supportsStreaming: boolean;
  maxContextTokens: number;
  freeTierStatus: 'FREE' | 'FREE TIER' | 'PAID / DISABLED BY DEFAULT' | 'UNKNOWN';
  isAvailable: boolean;
}

export class ModelRegistry {
  private entries: ModelRegistryEntry[] = [
    {
      providerId: 'openrouter',
      modelId: 'meta-llama/llama-3.3-70b-instruct',
      displayName: 'Llama 3.3 70B Instruct (OpenRouter)',
      supportsTools: true,
      supportsVision: true,
      supportsStreaming: true,
      maxContextTokens: 128000,
      freeTierStatus: 'FREE TIER',
      isAvailable: true
    },
    {
      providerId: 'groq',
      modelId: 'openai/gpt-oss-120b',
      displayName: 'GPT OSS 120B (Groq LPU 500 tok/s)',
      supportsTools: true,
      supportsVision: false,
      supportsStreaming: true,
      maxContextTokens: 131072,
      freeTierStatus: 'FREE TIER',
      isAvailable: true
    },
    {
      providerId: 'gemini',
      modelId: 'gemini-2.0-flash',
      displayName: 'Gemini 2.0 Flash',
      supportsTools: true,
      supportsVision: true,
      supportsStreaming: true,
      maxContextTokens: 1048576,
      freeTierStatus: 'FREE TIER',
      isAvailable: true
    },
    {
      providerId: 'github-models',
      modelId: 'gpt-4o-mini',
      displayName: 'GPT-4o Mini (GitHub Models)',
      supportsTools: true,
      supportsVision: true,
      supportsStreaming: true,
      maxContextTokens: 128000,
      freeTierStatus: 'FREE TIER',
      isAvailable: true
    },
    {
      providerId: 'cerebras',
      modelId: 'llama3.1-8b',
      displayName: 'Llama 3.1 8B (Cerebras Wafer)',
      supportsTools: true,
      supportsVision: false,
      supportsStreaming: true,
      maxContextTokens: 8192,
      freeTierStatus: 'FREE TIER',
      isAvailable: true
    },
    {
      providerId: 'mistral',
      modelId: 'mistral-small-latest',
      displayName: 'Mistral Small Latest',
      supportsTools: true,
      supportsVision: false,
      supportsStreaming: true,
      maxContextTokens: 32768,
      freeTierStatus: 'FREE TIER',
      isAvailable: true
    },
    {
      providerId: 'nvidia',
      modelId: 'meta/llama-3.3-70b-instruct',
      displayName: 'Llama 3.3 70B Instruct (NVIDIA NIM)',
      supportsTools: true,
      supportsVision: false,
      supportsStreaming: true,
      maxContextTokens: 128000,
      freeTierStatus: 'FREE TIER',
      isAvailable: true
    },
    {
      providerId: 'deepseek',
      modelId: 'deepseek-chat',
      displayName: 'DeepSeek V3 Chat',
      supportsTools: true,
      supportsVision: false,
      supportsStreaming: true,
      maxContextTokens: 64000,
      freeTierStatus: 'FREE TIER',
      isAvailable: true
    },
    {
      providerId: 'cloudflare',
      modelId: '@cf/meta/llama-3.1-8b-instruct',
      displayName: 'Llama 3.1 8B Instruct (Cloudflare Workers)',
      supportsTools: false,
      supportsVision: false,
      supportsStreaming: true,
      maxContextTokens: 8192,
      freeTierStatus: 'FREE TIER',
      isAvailable: true
    },
    {
      providerId: 'orcarouter',
      modelId: 'orcarouter/free',
      displayName: 'OrcaRouter Free Multi-Model Gateway',
      supportsTools: true,
      supportsVision: false,
      supportsStreaming: true,
      maxContextTokens: 64000,
      freeTierStatus: 'FREE TIER',
      isAvailable: true
    }
  ];

  public getModels(): ModelRegistryEntry[] {
    return [...this.entries];
  }
}

export class OrionAIProviderRouter implements IAIProvider {
  public id = 'orion-omni-router';
  public name = 'ORION Omni-Brain Router';
  public isConfigured = true;

  private providers: IAIProvider[] = [];
  private fallbackProvider: IAIProvider;
  private currentActiveProvider: IAIProvider;
  private activeStrategy: RoutingStrategy = 'SPEED_FIRST';
  private modelRegistry: ModelRegistry;

  constructor() {
    this.fallbackProvider = new LocalHeuristicAIProvider();
    this.modelRegistry = new ModelRegistry();

    // Register all legitimate provider adapters (OpenRouter as Primary Sovereign Brain)
    const cloudAdapters: IAIProvider[] = [
      new OpenRouterProvider(),
      new GroqProvider(),
      new GeminiProvider(),
      new GitHubModelsProvider(),
      new CerebrasProvider(),
      new MistralProvider(),
      new NVIDIAProvider(),
      new DeepSeekProvider(),
      new CloudflareProvider(),
      new OrcaRouterProvider()
    ];

    this.providers = cloudAdapters;
    this.currentActiveProvider = this.selectBestProvider('GENERAL_CHAT') || this.fallbackProvider;

    eventBus.logActivity(
      'SYSTEM_EVENT',
      `ORION Omni-Brain Router initialized (${this.getConfiguredProviders().length} cloud providers configured)`
    );
  }

  public getStatus(): ProviderStatus {
    const active = this.currentActiveProvider.getStatus();
    const configuredCount = this.getConfiguredProviders().length;
    return {
      ...active,
      displayName: `ORION Omni-Brain (${active.displayName})`,
      currentModel: `${active.currentModel} [Backups: ${configuredCount}]`
    };
  }

  public getAllProviderStatuses(): ProviderStatus[] {
    const statuses = this.providers.map(p => p.getStatus());
    statuses.unshift(this.fallbackProvider.getStatus());
    return statuses;
  }

  public getConfiguredProviders(): IAIProvider[] {
    return this.providers.filter(p => p.isConfigured);
  }

  public setRoutingStrategy(strategy: RoutingStrategy): void {
    this.activeStrategy = strategy;
    eventBus.logActivity('SYSTEM_EVENT', `ORION Routing strategy changed to: ${strategy}`);
  }

  /**
   * Autonomous Speed & Capability Router Scoring Model
   */
  public selectBestProvider(category: TaskCategory, requiresVision = false, requiresTools = false): IAIProvider | null {
    const healthyConfigured = this.providers.filter(p => {
      const s = p.getStatus();
      if (!s.isConfigured || !s.isHealthy) return false;
      if (requiresVision && !s.capabilities.supportsVision) return false;
      if (requiresTools && !s.capabilities.supportsTools) return false;
      return true;
    });

    if (healthyConfigured.length === 0) {
      return null; // Fallback to local heuristic engine
    }

    // Dynamic Scoring Engine
    const scored = healthyConfigured.map(p => {
      const s = p.getStatus();
      let score = 100;

      // Deduct score for observed latency & TTFT
      if (s.lastObservedLatencyMs > 0) {
        score -= Math.min(60, Math.floor(s.lastObservedLatencyMs / 50));
      }
      if (s.lastObservedTtftMs && s.lastObservedTtftMs > 0) {
        score -= Math.min(30, Math.floor(s.lastObservedTtftMs / 30));
      }

      // Deduct for failure history
      score -= s.totalErrors * 5;

      // Routing Strategy Alignment
      if (this.activeStrategy === 'OFFLINE') {
        return { provider: p, score: -9999 };
      } else if (this.activeStrategy === 'AGENT') {
        // AGENT strategy prioritizes tool support, reliability, and low error counts
        if (s.capabilities.supportsTools) score += 40;
        if (p.id === 'openrouter') score += 50;
        score += Math.max(0, 30 - s.totalErrors * 10);
      } else if (this.activeStrategy === 'SPEED_FIRST') {
        if (p.id === 'openrouter') score += 60;
        if (p.id === 'groq' || p.id === 'cerebras') score += 50;
      } else if (this.activeStrategy === 'QUALITY_FIRST') {
        if (p.id === 'openrouter') score += 60;
        if (p.id === 'github-models' || p.id === 'nvidia' || p.id === 'gemini') score += 40;
      } else if (this.activeStrategy === 'VISION' || requiresVision) {
        if (p.id === 'openrouter') score += 50;
        if (p.id === 'gemini' || p.id === 'github-models') score += 60;
      } else if (this.activeStrategy === 'CODING' || category === 'CODING') {
        if (p.id === 'openrouter') score += 50;
        if (p.id === 'deepseek' || p.id === 'groq' || p.id === 'github-models') score += 45;
      } else {
        if (p.id === 'openrouter') score += 40;
      }

      // Task Capability Match Bonus
      if (s.capabilities.taskCategories.includes(category)) {
        score += 25;
      }

      return { provider: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.provider || null;
  }

  public async classifyIntent(prompt: string): Promise<IntentClassification> {
    // 0ms Local Deterministic Fast-Path & Pattern Classification (Saves 5-8s network roundtrip per command)
    return await this.fallbackProvider.classifyIntent(prompt);
  }

  public async plan(prompt: string, availableTools: string[]): Promise<AIPlan> {
    const selected = this.selectBestProvider('PLANNING', false, true);
    if (selected) {
      try {
        return await selected.plan(prompt, availableTools);
      } catch (e) {
        eventBus.logActivity('SYSTEM_EVENT', `Planner error on ${selected.name}, falling back to local planner.`);
      }
    }

    return await this.fallbackProvider.plan(prompt, availableTools);
  }

  public async chat(prompt: string, conversationHistory?: Array<{ role: string; content: string }>): Promise<string> {
    const isVision = prompt.toLowerCase().includes('screen') || prompt.toLowerCase().includes('look at');
    const category: TaskCategory = isVision ? 'VISION' : 'GENERAL_CHAT';

    eventBus.emit('ai.request.started', { prompt, category });

    const candidates = this.providers.filter(p => {
      const s = p.getStatus();
      if (!s.isConfigured || !s.isHealthy) return false;
      if (isVision && !s.capabilities.supportsVision) return false;
      return true;
    });

    if (candidates.length === 0) {
      this.currentActiveProvider = this.fallbackProvider;
      eventBus.logActivity('SYSTEM_EVENT', 'No active cloud AI providers configured/healthy. Using Local Heuristic Engine.');
      return await this.fallbackProvider.chat(prompt, conversationHistory);
    }

    // Sort candidates using dynamic capability & latency scoring
    const bestProvider = this.selectBestProvider(category, isVision);
    if (bestProvider) {
      candidates.sort((a, b) => {
        if (a.id === bestProvider.id) return -1;
        if (b.id === bestProvider.id) return 1;
        return 0;
      });
    }

    // Autonomous Failover Loop
    let lastError: any = null;
    for (const candidate of candidates) {
      this.currentActiveProvider = candidate;
      const status = candidate.getStatus();

      eventBus.emit('ai.provider.selected', { providerId: candidate.id, model: status.currentModel });
      eventBus.logActivity(
        'PROCESSING',
        `Routing request to [${status.displayName}] (${status.currentModel})`
      );

      try {
        const response = await candidate.chat(prompt, conversationHistory);
        return response;
      } catch (err: any) {
        lastError = err;
        eventBus.emit('ai.provider.failed', { providerId: candidate.id, error: err.message });
        eventBus.emit('ai.failover.started', { failedProviderId: candidate.id });
        eventBus.logActivity(
          'ERROR_EVENT',
          `Provider [${candidate.name}] failed. Initiating automatic failover...`,
          { error: err.message }
        );
      }
    }

    // Fall back to offline local provider if all candidates fail
    this.currentActiveProvider = this.fallbackProvider;
    eventBus.emit('ai.failover.completed', { activeProviderId: this.fallbackProvider.id });
    eventBus.logActivity('SYSTEM_EVENT', 'All cloud AI failover options exhausted. Using Local Offline Fallback.');
    return await this.fallbackProvider.chat(prompt, conversationHistory);
  }

  public async stream(
    prompt: string,
    onToken: (token: string) => void,
    conversationHistory?: Array<{ role: string; content: string }>,
    timeouts?: import('./SSEParser').StreamTimeoutConfig,
    externalSignal?: AbortSignal
  ): Promise<string> {
    const isVision = prompt.toLowerCase().includes('screen') || prompt.toLowerCase().includes('look at');
    const candidates = this.providers.filter(p => {
      const s = p.getStatus();
      if (!s.isConfigured || !s.isHealthy) return false;
      if (isVision && !s.capabilities.supportsVision) return false;
      if (!s.capabilities.supportsStreaming) return false;
      return true;
    });

    if (candidates.length === 0) {
      eventBus.logActivity('SYSTEM_EVENT', 'No active cloud streaming providers configured. Falling back to chat.');
      return await this.chat(prompt, conversationHistory);
    }

    // Sort candidates using dynamic capability & latency scoring
    const bestProvider = this.selectBestProvider(isVision ? 'VISION' : 'FAST_CHAT', isVision);
    if (bestProvider) {
      candidates.sort((a, b) => {
        if (a.id === bestProvider.id) return -1;
        if (b.id === bestProvider.id) return 1;
        return 0;
      });
    }

    for (const candidate of candidates) {
      if (!candidate.stream) continue;
      this.currentActiveProvider = candidate;
      const status = candidate.getStatus();

      let emittedTokens = false;
      const safeTokenWrapper = (token: string) => {
        emittedTokens = true;
        eventBus.emit('ai.stream.delta', { token });
        onToken(token);
      };

      try {
        eventBus.emit('ai.request.started', { prompt, category: isVision ? 'VISION' : 'FAST_CHAT' });
        eventBus.emit('ai.provider.selected', { providerId: candidate.id, model: status.currentModel });
        eventBus.emit('ai.stream.started', { providerId: candidate.id });

        const result = await candidate.stream(prompt, safeTokenWrapper, conversationHistory, timeouts, externalSignal);
        
        eventBus.emit('ai.stream.completed', { providerId: candidate.id });
        return result;
      } catch (err: any) {
        eventBus.emit('ai.provider.failed', { providerId: candidate.id, error: err.message });

        if (emittedTokens) {
          // If partial tokens were already sent to client, failover could produce duplicate text
          eventBus.logActivity(
            'ERROR_EVENT',
            `Streaming interrupted on [${candidate.name}] after emitting output. Stream terminated.`,
            { error: err.message }
          );
          throw err;
        }

        eventBus.logActivity(
          'ERROR_EVENT',
          `Stream connect failed on [${candidate.name}]. Initiating provider failover...`,
          { error: err.message }
        );
      }
    }

    eventBus.emit('ai.failover.completed', { activeProviderId: this.fallbackProvider.id });
    return await this.fallbackProvider.chat(prompt, conversationHistory);
  }

  public async analyzeImage(
    prompt: string,
    imageDataUrl: string,
    conversationHistory?: Array<{ role: string; content: string }>,
    externalSignal?: AbortSignal
  ): Promise<string> {
    if (!imageDataUrl || typeof imageDataUrl !== 'string' || !imageDataUrl.startsWith('data:image/')) {
      throw new Error('Invalid or malformed image data URL.');
    }
    if (imageDataUrl.length > 10 * 1024 * 1024) {
      throw new Error('Image payload exceeds maximum safety limit (10MB).');
    }

    eventBus.emit('ai.request.started', { prompt: prompt || 'Vision Analysis', category: 'VISION' });

    // Strict Vision Filtering: Must supportVision === true, be configured, and be healthy
    const visionCandidates = this.providers.filter(p => {
      const s = p.getStatus();
      return s.isConfigured && s.isHealthy && s.capabilities.supportsVision && typeof p.analyzeImage === 'function';
    });

    if (visionCandidates.length === 0) {
      eventBus.logActivity('SYSTEM_EVENT', 'No configured/healthy vision providers available (Gemini or GitHub Models required).');
      throw new Error('VISION NOT CONFIGURED: No cloud providers with multimodal vision capability are configured or healthy.');
    }

    let lastError: any = null;

    for (const candidate of visionCandidates) {
      this.currentActiveProvider = candidate;
      const status = candidate.getStatus();

      eventBus.emit('ai.provider.selected', { providerId: candidate.id, model: status.currentModel });
      eventBus.logActivity('PROCESSING', `Routing multimodal vision request to [${status.displayName}] (${status.currentModel})`);

      try {
        const analysis = await candidate.analyzeImage!(prompt, imageDataUrl, conversationHistory, externalSignal);
        return analysis;
      } catch (err: any) {
        lastError = err;
        eventBus.emit('ai.provider.failed', { providerId: candidate.id, error: err.message });
        eventBus.emit('ai.failover.started', { failedProviderId: candidate.id });
        eventBus.logActivity(
          'ERROR_EVENT',
          `Vision provider [${candidate.name}] failed. Initiating automatic vision failover...`,
          { error: err.message }
        );
      }
    }

    eventBus.emit('ai.failover.completed', { activeProviderId: this.fallbackProvider.id });
    throw new Error(`All vision-capable AI provider options failed. Last error: ${lastError?.message || 'Unknown failure'}`);
  }

  public async runLiveQualificationTest(): Promise<Record<string, any>> {
    const results: Record<string, any> = {};
    for (const provider of this.providers) {
      const status = provider.getStatus();
      if (!status.isConfigured) {
        results[provider.id] = { status: 'NOT CONFIGURED', latencyMs: 0 };
        continue;
      }
      try {
        const start = Date.now();
        await provider.chat('ORION system ping check.');
        const latency = Date.now() - start;
        results[provider.id] = { status: 'READY', latencyMs: latency };
      } catch (err: any) {
        results[provider.id] = { status: status.lastErrorCode || 'ERROR', latencyMs: 0, error: err.message };
      }
    }
    return results;
  }
}
