import fs from 'fs';
import path from 'path';
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
  OrcaRouterProvider,
  OllamaProvider,
  AnthropicProvider
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
    },
    {
      providerId: 'ollama',
      modelId: 'llama3.1:8b',
      displayName: 'Llama 3.1 8B (Local Fast & Tool Execution)',
      supportsTools: true,
      supportsVision: false,
      supportsStreaming: true,
      maxContextTokens: 131072,
      freeTierStatus: 'FREE',
      isAvailable: true
    },
    {
      providerId: 'ollama',
      modelId: 'qwen2.5-coder:7b',
      displayName: 'Qwen 2.5 Coder 7B (Local Fast Coding)',
      supportsTools: true,
      supportsVision: false,
      supportsStreaming: true,
      maxContextTokens: 32768,
      freeTierStatus: 'FREE',
      isAvailable: true
    },
    {
      providerId: 'ollama',
      modelId: 'deepseek-r1:14b',
      displayName: 'DeepSeek R1 14B (Local Reasoning & Verification)',
      supportsTools: true,
      supportsVision: false,
      supportsStreaming: true,
      maxContextTokens: 131072,
      freeTierStatus: 'FREE',
      isAvailable: true
    },
    {
      providerId: 'ollama',
      modelId: 'gpt-oss:20b',
      displayName: 'GPT-OSS 20B (Local General & Agent Synthesis)',
      supportsTools: true,
      supportsVision: false,
      supportsStreaming: true,
      maxContextTokens: 131072,
      freeTierStatus: 'FREE',
      isAvailable: true
    },
    {
      providerId: 'ollama',
      modelId: 'gemma4:26b',
      displayName: 'Gemma 4 26B (Local Multimodal Vision & Reasoning)',
      supportsTools: true,
      supportsVision: true,
      supportsStreaming: true,
      maxContextTokens: 262144,
      freeTierStatus: 'FREE',
      isAvailable: true
    },
    {
      providerId: 'ollama',
      modelId: 'qwen3-coder:30b',
      displayName: 'Qwen 3 Coder 30B (Local Deep Coding & Architecture)',
      supportsTools: true,
      supportsVision: false,
      supportsStreaming: true,
      maxContextTokens: 262144,
      freeTierStatus: 'FREE',
      isAvailable: true
    },
    {
      providerId: 'anthropic',
      modelId: 'claude-haiku-4-5-20251001',
      displayName: 'Claude Haiku 4.5 (Saif — Fast Tier)',
      supportsTools: true,
      supportsVision: true,
      supportsStreaming: true,
      maxContextTokens: 200000,
      freeTierStatus: 'PAID / DISABLED BY DEFAULT',
      isAvailable: true
    },
    {
      providerId: 'anthropic',
      modelId: 'claude-sonnet-4-6',
      displayName: 'Claude Sonnet 4.6 (Nur — Balanced Tier)',
      supportsTools: true,
      supportsVision: true,
      supportsStreaming: true,
      maxContextTokens: 200000,
      freeTierStatus: 'PAID / DISABLED BY DEFAULT',
      isAvailable: true
    },
    {
      providerId: 'anthropic',
      modelId: 'claude-opus-4-7',
      displayName: 'Claude Opus 4.7 (Hikmah — Deep Reasoning Tier)',
      supportsTools: true,
      supportsVision: true,
      supportsStreaming: true,
      maxContextTokens: 200000,
      freeTierStatus: 'PAID / DISABLED BY DEFAULT',
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
  private static readonly DEFAULT_MODEL_CHAIN = [
    'llama3.1:8b',
    'qwen2.5-coder:7b',
    'deepseek-r1:14b',
    'gpt-oss:20b',
    'gemma4:26b',
    'qwen3-coder:30b'
  ];
  private modelChain: string[] = [...OrionAIProviderRouter.DEFAULT_MODEL_CHAIN];
  private modelChainPath: string;

  constructor() {
    this.fallbackProvider = new LocalHeuristicAIProvider();
    this.modelRegistry = new ModelRegistry();
    this.modelChainPath = path.join(process.cwd(), '.orion_memory', 'model_chain.json');

    // Register all legitimate provider adapters (OpenRouter and Local Ollama)
    const cloudAdapters: IAIProvider[] = [
      new OllamaProvider(),
      new OpenRouterProvider(),
      new GroqProvider(),
      new GeminiProvider(),
      new GitHubModelsProvider(),
      new CerebrasProvider(),
      new MistralProvider(),
      new NVIDIAProvider(),
      new DeepSeekProvider(),
      new CloudflareProvider(),
      new OrcaRouterProvider(),
      new AnthropicProvider()
    ];

    this.providers = cloudAdapters;
    this.loadPersistedModelChain();
    this.currentActiveProvider = this.selectBestProvider('GENERAL_CHAT') || this.fallbackProvider;

    eventBus.logActivity(
      'SYSTEM_EVENT',
      `ORION Omni-Brain Router initialized (${this.getConfiguredProviders().length} AI providers configured)`
    );
  }

  public async ensureInitialized(timeoutMs = 1500): Promise<void> {
    if (this.activeStrategy === 'OFFLINE') return;
    const ollama = this.getOllamaProvider();
    if (ollama) {
      let ok = await ollama.probeHealth(timeoutMs);
      if (!ok && timeoutMs >= 1000) {
        OllamaProvider.resetProbeCache();
        ok = await ollama.probeHealth(timeoutMs);
      }
    }
    if (this.currentActiveProvider.id === 'local-heuristic') {
      const best = this.selectBestProvider('GENERAL_CHAT');
      if (best) {
        this.currentActiveProvider = best;
      }
    }
  }

  private loadPersistedModelChain(): void {
    try {
      if (fs.existsSync(this.modelChainPath)) {
        const raw = JSON.parse(fs.readFileSync(this.modelChainPath, 'utf8'));
        if (Array.isArray(raw?.chain) && raw.chain.length > 0) {
          const valid = raw.chain.map(String).filter(Boolean);
          if (valid.length > 0) {
            this.modelChain = valid;
            const ollama = this.getOllamaProvider();
            if (ollama) {
              ollama.setModel(this.modelChain[0]);
            }
          }
        }
      }
    } catch {}
  }

  public getModelChain(): string[] {
    return [...this.modelChain];
  }

  public setModelChain(models: string[]): { valid: boolean; chain: string[]; error?: string } {
    const cleaned = (models || []).map(m => String(m || '').trim()).filter(Boolean);
    if (cleaned.length === 0) {
      return { valid: false, chain: [...this.modelChain], error: 'Model chain cannot be empty.' };
    }
    const knownModels = new Set(this.modelRegistry.getModels().map(m => m.modelId));
    const ollama = this.getOllamaProvider();
    for (const m of ollama?.getInstalledModels() || []) {
      knownModels.add(m.name);
    }
    for (const def of OrionAIProviderRouter.DEFAULT_MODEL_CHAIN) {
      knownModels.add(def);
    }
    const unknown = cleaned.filter(m => !knownModels.has(m));
    if (unknown.length > 0) {
      return {
        valid: false,
        chain: [...this.modelChain],
        error: `Unknown or unconfigured model(s): ${unknown.join(', ')}. Allowed local models: ${OrionAIProviderRouter.DEFAULT_MODEL_CHAIN.join(', ')}`
      };
    }

    this.modelChain = cleaned;
    if (ollama) {
      ollama.setModel(this.modelChain[0]);
      if (ollama.isConfigured) {
        this.currentActiveProvider = ollama;
      }
    }
    try {
      const dir = path.dirname(this.modelChainPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        this.modelChainPath,
        JSON.stringify({ chain: this.modelChain, updatedAt: new Date().toISOString() }, null, 2),
        'utf8'
      );
    } catch {}
    return { valid: true, chain: [...this.modelChain] };
  }

  public resetModelChain(): string[] {
    this.modelChain = [...OrionAIProviderRouter.DEFAULT_MODEL_CHAIN];
    const ollama = this.getOllamaProvider();
    if (ollama) {
      ollama.setModel(this.modelChain[0]);
    }
    try {
      if (fs.existsSync(this.modelChainPath)) {
        fs.unlinkSync(this.modelChainPath);
      }
    } catch {}
    return [...this.modelChain];
  }

  private getSectorInfo(providerId: string): { sectorName: string; engineClass: string } {
    switch (providerId) {
      case 'ollama':
        return { sectorName: 'SECTOR 09 // OLLAMA SOVEREIGN LOCAL CORE', engineClass: 'Local On-Device Neural Engine' };
      case 'groq':
        return { sectorName: 'SECTOR 01 // HYPERION LPU CORE', engineClass: 'Sub-Second Quantum LPU Engine' };
      case 'gemini':
        return { sectorName: 'SECTOR 02 // AETHER PERCEPTION MESH', engineClass: 'Deep Multimodal Synapse Core' };
      case 'openrouter':
        return { sectorName: 'SECTOR 03 // POLARIS SOVEREIGN NEXUS', engineClass: 'Autonomous Agentic Cluster' };
      case 'github-models':
        return { sectorName: 'SECTOR 04 // CHRONOS SYNTHESIS HUB', engineClass: 'High-Fidelity Reasoning Engine' };
      case 'cerebras':
        return { sectorName: 'SECTOR 05 // QUANTUM WAFER FABRIC', engineClass: 'Ultra-Throughput Compute Layer' };
      case 'mistral':
        return { sectorName: 'SECTOR 06 // VORTEX COMPILER MATRIX', engineClass: 'Algorithmic Systems Engine' };
      case 'nvidia':
        return { sectorName: 'SECTOR 07 // TITAN ACCELERATED CORE', engineClass: 'Tensor Parallel Intelligence' };
      case 'deepseek':
        return { sectorName: 'SECTOR 08 // ECLIPSE DEEP REASONING', engineClass: 'Cognitive Architecture' };
      case 'anthropic':
        return { sectorName: 'SECTOR 10 // HIKMAH CLAUDE CORE', engineClass: 'Anthropic Sovereign Reasoning Engine' };
      default:
        return { sectorName: 'SECTOR 00 // KERNEL AUTONOMOUS CORE', engineClass: 'Zero-Latency Micro-Kernel Engine' };
    }
  }

  public getStatus(): ProviderStatus {
    const active = this.currentActiveProvider.getStatus();
    return {
      ...active,
      displayName: active.displayName || active.id,
      currentModel: active.currentModel
    };
  }

  public getOllamaProvider(): OllamaProvider | undefined {
    return this.providers.find(p => p.id === 'ollama') as OllamaProvider | undefined;
  }

  /**
   * Task-Aware Local Ollama Model Selector (Section 4).
   * Selects from the 6 installed local Ollama models based on task category, capability metadata,
   * and VRAM-friendly defaults without loading all models simultaneously.
   */
  public selectLocalModelForTask(
    category: TaskCategory,
    options?: {
      requiresVision?: boolean;
      requiresTools?: boolean;
      preferDeepCoding?: boolean;
      preferDeepReasoning?: boolean;
    }
  ): {
    selectedModel: string;
    fallbackChain: string[];
    reason: string;
  } {
    const ollama = this.getOllamaProvider();
    const discovered = ollama?.getInstalledModels() || [];
    const hasModel = (id: string) => discovered.length === 0 || discovered.some(m => m.name === id);

    if (options?.requiresVision || category === 'VISION' || category === 'OCR' || this.activeStrategy === 'VISION') {
      const primary = hasModel('gemma4:26b') ? 'gemma4:26b' : 'llama3.1:8b';
      return {
        selectedModel: primary,
        fallbackChain: ['gemma4:26b', 'llama3.1:8b'],
        reason: 'Task requires multimodal vision capability (gemma4:26b declares vision+tools+thinking).'
      };
    }

    if (category === 'CODING' || this.activeStrategy === 'CODING') {
      const primary =
        options?.preferDeepCoding || this.activeStrategy === 'QUALITY_FIRST'
          ? (hasModel('qwen3-coder:30b') ? 'qwen3-coder:30b' : 'qwen2.5-coder:7b')
          : (hasModel('qwen2.5-coder:7b') ? 'qwen2.5-coder:7b' : 'qwen3-coder:30b');
      return {
        selectedModel: primary,
        fallbackChain: [primary, 'qwen2.5-coder:7b', 'llama3.1:8b'],
        reason: `Coding/repository task routed to ${primary} (100% GPU VRAM fit for 7B; 30B MoE for deep architecture).`
      };
    }

    if (category === 'COMPLEX_REASONING' || options?.preferDeepReasoning || this.activeStrategy === 'QUALITY_FIRST') {
      const primary = hasModel('deepseek-r1:14b')
        ? 'deepseek-r1:14b'
        : hasModel('gpt-oss:20b')
          ? 'gpt-oss:20b'
          : 'llama3.1:8b';
      return {
        selectedModel: primary,
        fallbackChain: [primary, 'gpt-oss:20b', 'llama3.1:8b'],
        reason: `Complex reasoning/audit task routed to ${primary} (supports thinking + tools).`
      };
    }

    if (category === 'SUMMARIZATION' || (category === 'GENERAL_CHAT' && this.activeStrategy === 'BALANCED')) {
      const primary = hasModel('gpt-oss:20b') ? 'gpt-oss:20b' : 'llama3.1:8b';
      return {
        selectedModel: primary,
        fallbackChain: [primary, 'llama3.1:8b', 'qwen2.5-coder:7b'],
        reason: `Balanced general/synthesis task routed to ${primary}.`
      };
    }

    // Default for FAST_CHAT, TOOL_USE, PLANNING, and SPEED_FIRST: llama3.1:8b (4.9GB, 100% in 16GB VRAM, fast tool calling)
    return {
      selectedModel: hasModel('llama3.1:8b') ? 'llama3.1:8b' : 'qwen2.5-coder:7b',
      fallbackChain: ['llama3.1:8b', 'qwen2.5-coder:7b', 'deepseek-r1:14b'],
      reason: 'Fast interactive/tool-execution task routed to llama3.1:8b (100% GPU VRAM fit, low TTFT).'
    };
  }

  public setActiveLocalModel(modelId: string): boolean {
    const ollama = this.getOllamaProvider();
    if (!ollama) return false;
    ollama.setModel(modelId);
    this.currentActiveProvider = ollama;
    return true;
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

  public getRoutingStrategy(): RoutingStrategy {
    return this.activeStrategy;
  }

  /**
   * Al-Hikmah Intelligence Mode Tier Profile Selector (Saif / Nur / Hikmah / Auto)
   */
  public setHikmahMode(mode: 'saif' | 'nur' | 'hikmah' | 'auto'): { mode: string; strategy: RoutingStrategy; anthropicModel: string } {
    const anthropic = this.providers.find(p => p.id === 'anthropic') as AnthropicProvider | undefined;
    let strategy: RoutingStrategy = 'BALANCED';
    let anthropicModel = 'claude-sonnet-4-6';

    if (mode === 'saif') {
      strategy = 'SPEED_FIRST';
      anthropicModel = 'claude-haiku-4-5-20251001';
    } else if (mode === 'nur') {
      strategy = 'BALANCED';
      anthropicModel = 'claude-sonnet-4-6';
    } else if (mode === 'hikmah') {
      strategy = 'QUALITY_FIRST';
      anthropicModel = 'claude-opus-4-7';
    } else {
      strategy = 'SPEED_FIRST';
      anthropicModel = 'claude-sonnet-4-6';
    }

    if (anthropic) {
      anthropic.setModel(anthropicModel);
    }
    this.setRoutingStrategy(strategy);
    return { mode, strategy, anthropicModel };
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

    if (this.activeStrategy === 'OFFLINE' || healthyConfigured.length === 0) {
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

      // Routing Strategy Alignment (Sovereign Local-First Priority for Ollama)
      if (p.id === 'ollama') {
        score += 75;
      }

      if (this.activeStrategy === 'OFFLINE') {
        return { provider: p, score: -9999 };
      } else if (this.activeStrategy === 'AGENT') {
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
    await this.ensureInitialized(1200);
    // 0ms Deterministic Fast-Path Tool Plan when local classifier identifies explicit system/file/computer tools
    const fallbackPlan = await this.fallbackProvider.plan(prompt, availableTools);
    if (fallbackPlan.steps.length > 0) {
      return fallbackPlan;
    }

    const selected = this.selectBestProvider('PLANNING', false, true);
    if (selected) {
      try {
        const plan = await selected.plan(prompt, availableTools);
        if (plan.steps.length > 0) {
          return plan;
        }
      } catch (e) {
        eventBus.logActivity('SYSTEM_EVENT', `Planner error on ${selected.name}, falling back to local planner.`);
      }
    }

    return fallbackPlan;
  }

  public async chat(
    prompt: string,
    conversationHistory?: Array<{ role: string; content: string }>,
    externalSignal?: AbortSignal
  ): Promise<string> {
    if (externalSignal?.aborted) {
      throw new Error('Operation cancelled by AbortSignal.');
    }
    if (this.activeStrategy === 'OFFLINE') {
      this.currentActiveProvider = this.fallbackProvider;
      return await this.fallbackProvider.chat(prompt, conversationHistory, externalSignal);
    }
    await this.ensureInitialized(1500);
    if (externalSignal?.aborted) {
      throw new Error('Operation cancelled by AbortSignal.');
    }
    const userQueryMatch = prompt.match(/USER OPERATOR QUERY:\s*"([\s\S]*?)"(?:\n\n|$)/);
    const effectivePrompt = (userQueryMatch ? userQueryMatch[1] : prompt).toLowerCase();
    const isVision =
      (effectivePrompt.includes('screenshot') || effectivePrompt.includes('look at my screen') || effectivePrompt.includes('analyze image')) &&
      !effectivePrompt.includes('brightness');
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
        const response = await candidate.chat(prompt, conversationHistory, externalSignal);
        if (externalSignal?.aborted) {
          throw new Error('Operation cancelled by AbortSignal.');
        }
        if (
          candidate.id === 'ollama' &&
          (prompt.includes('UNTRUSTED OBSERVATIONS DATA & TOOL RESULTS:') ||
            prompt.includes('OBSERVATIONS & TOOL RESULTS DATA:')) &&
          prompt.includes('[system.get_info]') &&
          (!response.includes('Host:') || !response.includes('CPU'))
        ) {
          return await this.fallbackProvider.chat(prompt, conversationHistory, externalSignal);
        }
        return response;
      } catch (err: any) {
        if (externalSignal?.aborted || /cancelled by abortsignal|aborted by signal/i.test(String(err?.message || ''))) {
          throw new Error('Operation cancelled by AbortSignal.');
        }
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

    if (externalSignal?.aborted) {
      throw new Error('Operation cancelled by AbortSignal.');
    }
    // Fall back to offline local provider if all candidates fail
    this.currentActiveProvider = this.fallbackProvider;
    eventBus.emit('ai.failover.completed', { activeProviderId: this.fallbackProvider.id });
    eventBus.logActivity('SYSTEM_EVENT', 'All cloud AI failover options exhausted. Using Local Offline Fallback.');
    return await this.fallbackProvider.chat(prompt, conversationHistory, externalSignal);
  }

  public async stream(
    prompt: string,
    onToken: (token: string) => void,
    conversationHistory?: Array<{ role: string; content: string }>,
    timeouts?: import('./SSEParser').StreamTimeoutConfig,
    externalSignal?: AbortSignal
  ): Promise<string> {
    if (externalSignal?.aborted) {
      throw new Error('Stream cancelled by AbortSignal.');
    }
    if (this.activeStrategy === 'OFFLINE') {
      this.currentActiveProvider = this.fallbackProvider;
      return await this.fallbackProvider.stream!(prompt, onToken, conversationHistory, timeouts, externalSignal);
    }
    await this.ensureInitialized(1500);
    if (externalSignal?.aborted) {
      throw new Error('Stream cancelled by AbortSignal.');
    }
    const userQueryMatch = prompt.match(/USER OPERATOR QUERY:\s*"([\s\S]*?)"(?:\n\n|$)/);
    const effectivePrompt = (userQueryMatch ? userQueryMatch[1] : prompt).toLowerCase();
    const isVision =
      (effectivePrompt.includes('screenshot') || effectivePrompt.includes('look at my screen') || effectivePrompt.includes('analyze image')) &&
      !effectivePrompt.includes('brightness');
    const candidates = this.providers.filter(p => {
      const s = p.getStatus();
      if (!s.isConfigured || !s.isHealthy) return false;
      if (isVision && !s.capabilities.supportsVision) return false;
      if (!s.capabilities.supportsStreaming) return false;
      return true;
    });

    if (candidates.length === 0) {
      eventBus.logActivity('SYSTEM_EVENT', 'No active cloud streaming providers configured. Falling back to chat.');
      return await this.chat(prompt, conversationHistory, externalSignal);
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
        if (!result || result.trim().length === 0) {
          throw new Error(`EMPTY_RESPONSE: Provider [${candidate.name}] returned an empty stream without content.`);
        }
        if (
          candidate.id === 'ollama' &&
          (prompt.includes('UNTRUSTED OBSERVATIONS DATA & TOOL RESULTS:') ||
            prompt.includes('OBSERVATIONS & TOOL RESULTS DATA:')) &&
          prompt.includes('[system.get_info]') &&
          (!result.includes('Host:') || !result.includes('CPU'))
        ) {
          return await this.fallbackProvider.chat(prompt, conversationHistory);
        }

        eventBus.emit('ai.stream.completed', { providerId: candidate.id });
        return result;
      } catch (err: any) {
        if (externalSignal?.aborted || /cancelled by abortsignal|aborted by signal/i.test(String(err?.message || ''))) {
          throw new Error('Stream cancelled by AbortSignal.');
        }
        eventBus.emit('ai.provider.failed', { providerId: candidate.id, error: err.message });

        if (emittedTokens) {
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

    if (externalSignal?.aborted) {
      throw new Error('Stream cancelled by AbortSignal.');
    }
    eventBus.emit('ai.failover.completed', { activeProviderId: this.fallbackProvider.id });
    return await this.fallbackProvider.chat(prompt, conversationHistory, externalSignal);
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
