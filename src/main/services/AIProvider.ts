import { ToolCall, ToolResult } from '../../shared/types';

export interface AIProviderConfig {
  apiKey?: string;
  modelName?: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export interface IntentClassification {
  intent: 'FAST_PATH' | 'SYSTEM_QUERY' | 'FILE_OPERATION' | 'TOOL_EXECUTION' | 'CONVERSATION' | 'VISION' | 'CODING' | 'UNKNOWN';
  confidence: number;
  extractedCommand?: string;
  suggestedTools?: string[];
  fastPathMatch?: {
    toolId: string;
    args?: Record<string, any>;
  };
}

export interface AIPlanStep {
  stepNumber: number;
  actionDescription: string;
  toolToCall?: string;
  toolArguments?: Record<string, any>;
  prerequisites?: number[]; // Step numbers that must complete first
  isReadOnly?: boolean;     // Whether this step is safe to execute concurrently
  outputKey?: string;       // Key name under which result is stored in context
}

export interface AIPlan {
  goal: string;
  steps: AIPlanStep[];
}

export type TaskCategory =
  | 'FAST_CHAT'
  | 'GENERAL_CHAT'
  | 'TOOL_USE'
  | 'CODING'
  | 'COMPLEX_REASONING'
  | 'VISION'
  | 'OCR'
  | 'PLANNING'
  | 'SUMMARIZATION'
  | 'STRUCTURED_OUTPUT';

export interface ProviderCapabilities {
  supportsTools: boolean;
  supportsVision: boolean;
  supportsStreaming: boolean;
  maxContextTokens: number;
  taskCategories: TaskCategory[];
}

export interface ProviderStatus {
  id: string;
  displayName: string;
  isConfigured: boolean;
  isHealthy: boolean;
  lastObservedLatencyMs: number;
  lastObservedTtftMs?: number;
  lastErrorCode?: string;
  consecutiveFailures: number;
  cooldownUntil: number;
  totalRequests: number;
  totalErrors: number;
  currentModel: string;
  capabilities: ProviderCapabilities;
}

export interface IAIProvider {
  id: string;
  name: string;
  isConfigured: boolean;
  getStatus(): ProviderStatus;

  chat(prompt: string, conversationHistory?: Array<{ role: string; content: string }>): Promise<string>;
  stream?(
    prompt: string,
    onToken: (token: string) => void,
    conversationHistory?: Array<{ role: string; content: string }>,
    timeouts?: import('./SSEParser').StreamTimeoutConfig,
    externalSignal?: AbortSignal
  ): Promise<string>;
  classifyIntent(prompt: string): Promise<IntentClassification>;
  plan(prompt: string, availableTools: string[]): Promise<AIPlan>;
  analyzeImage?(
    prompt: string,
    imageDataUrl: string,
    conversationHistory?: Array<{ role: string; content: string }>,
    externalSignal?: AbortSignal
  ): Promise<string>;
}

/**
 * Local Deterministic Rule-Based Fallback Handler
 * Provides safe offline fast-path routing and deterministic tool triggers without simulating a false neural network.
 */
export class LocalHeuristicAIProvider implements IAIProvider {
  public id = 'local-heuristic';
  public name = 'ORION Offline Rule-Based Fallback Router';
  public isConfigured = true;

  public getStatus(): ProviderStatus {
    return {
      id: this.id,
      displayName: this.name,
      isConfigured: true,
      isHealthy: true,
      lastObservedLatencyMs: 1,
      lastObservedTtftMs: 1,
      consecutiveFailures: 0,
      cooldownUntil: 0,
      totalRequests: 0,
      totalErrors: 0,
      currentModel: 'offline-rule-router',
      capabilities: {
        supportsTools: true,
        supportsVision: false,
        supportsStreaming: true,
        maxContextTokens: 4096,
        taskCategories: ['FAST_CHAT', 'TOOL_USE']
      }
    };
  }

  public async classifyIntent(prompt: string): Promise<IntentClassification> {
    const lower = prompt.toLowerCase().trim();

    // Fast Deterministic Path Detection
    if (lower === 'cpu' || lower === "what's my cpu?" || lower === 'cpu usage' || lower === 'what is my cpu usage?') {
      return {
        intent: 'FAST_PATH',
        confidence: 1.0,
        suggestedTools: ['system.get_cpu_usage'],
        fastPathMatch: { toolId: 'system.get_cpu_usage' }
      };
    }

    if (lower === 'ram' || lower === 'memory' || lower === "how much ram am i using?" || lower === 'ram usage') {
      return {
        intent: 'FAST_PATH',
        confidence: 1.0,
        suggestedTools: ['system.get_memory_usage'],
        fastPathMatch: { toolId: 'system.get_memory_usage' }
      };
    }

    if (lower === 'time' || lower === "what's the current time?" || lower === 'what time is it?' || lower === 'clock') {
      return {
        intent: 'FAST_PATH',
        confidence: 1.0,
        suggestedTools: ['system.get_current_time'],
        fastPathMatch: { toolId: 'system.get_current_time' }
      };
    }

    if (lower === 'ip' || lower === "what's my ip?" || lower === 'network status' || lower === 'show network status') {
      return {
        intent: 'FAST_PATH',
        confidence: 1.0,
        suggestedTools: ['system.get_network_status'],
        fastPathMatch: { toolId: 'system.get_network_status' }
      };
    }

    if (lower === 'disk' || lower === 'storage' || lower === "what's my disk usage?") {
      return {
        intent: 'FAST_PATH',
        confidence: 1.0,
        suggestedTools: ['system.get_disk_usage'],
        fastPathMatch: { toolId: 'system.get_disk_usage' }
      };
    }

    if (lower === 'system' || lower === 'show system' || lower === 'system info') {
      return {
        intent: 'FAST_PATH',
        confidence: 1.0,
        suggestedTools: ['system.get_info'],
        fastPathMatch: { toolId: 'system.get_info' }
      };
    }

    if (lower === 'list files' || lower === 'list directory' || lower === 'show files') {
      return {
        intent: 'FAST_PATH',
        confidence: 1.0,
        suggestedTools: ['file.list_directory'],
        fastPathMatch: { toolId: 'file.list_directory', args: { dirPath: '.' } }
      };
    }

    // General Heuristic Intents
    if (
      lower.includes('cpu') ||
      lower.includes('ram') ||
      lower.includes('memory') ||
      lower.includes('system') ||
      lower.includes('disk') ||
      lower.includes('storage') ||
      lower.includes('network') ||
      lower.includes('time') ||
      lower.includes('clock') ||
      lower.includes('uptime')
    ) {
      return {
        intent: 'SYSTEM_QUERY',
        confidence: 0.95,
        suggestedTools: this.inferSystemTools(lower)
      };
    }

    if (
      lower.includes('list') ||
      lower.includes('files') ||
      lower.includes('directory') ||
      lower.includes('read') ||
      lower.includes('inspect')
    ) {
      return {
        intent: 'FILE_OPERATION',
        confidence: 0.90,
        suggestedTools: lower.includes('read') ? ['file.read_text'] : ['file.list_directory']
      };
    }

    return {
      intent: 'CONVERSATION',
      confidence: 0.80
    };
  }

  private inferSystemTools(lower: string): string[] {
    const tools: string[] = [];
    if (lower.includes('cpu')) tools.push('system.get_cpu_usage');
    if (lower.includes('ram') || lower.includes('memory')) tools.push('system.get_memory_usage');
    if (lower.includes('disk') || lower.includes('storage')) tools.push('system.get_disk_usage');
    if (lower.includes('network') || lower.includes('ip')) tools.push('system.get_network_status');
    if (lower.includes('time') || lower.includes('clock')) tools.push('system.get_current_time');
    if (lower.includes('system') && tools.length === 0) tools.push('system.get_info');
    return tools.length > 0 ? tools : ['system.get_info'];
  }

  public async plan(prompt: string, availableTools: string[]): Promise<AIPlan> {
    const classification = await this.classifyIntent(prompt);
    const steps: AIPlanStep[] = [];

    if (classification.fastPathMatch) {
      steps.push({
        stepNumber: 1,
        actionDescription: `Fast-path execution for ${classification.fastPathMatch.toolId}`,
        toolToCall: classification.fastPathMatch.toolId,
        toolArguments: classification.fastPathMatch.args || {}
      });
    } else if (classification.suggestedTools && classification.suggestedTools.length > 0) {
      classification.suggestedTools.forEach((toolId, index) => {
        steps.push({
          stepNumber: index + 1,
          actionDescription: `Execute telemetry/read tool ${toolId}`,
          toolToCall: toolId,
          toolArguments: toolId === 'file.list_directory' ? { dirPath: '.' } : {}
        });
      });
    }

    return {
      goal: `Process user query: "${prompt}"`,
      steps
    };
  }

  public async chat(prompt: string, conversationHistory?: Array<{ role: string; content: string }>): Promise<string> {
    const lower = prompt.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi')) {
      return 'Greetings. ORION AI Command System is online (Offline Rule-Based Fallback Mode active). Configure an AI Provider API key for neural generation.';
    }
    if (lower.includes('who are you')) {
      return 'I am ORION — AI Command Center Assistant (running offline fallback router).';
    }
    return `[OFFLINE MODE] Query received: "${prompt}". No neural LLM API key configured; telemetry and tool functions remain operational.`;
  }

  public async stream(prompt: string, onToken: (token: string) => void): Promise<string> {
    const response = await this.chat(prompt);
    onToken(response);
    return response;
  }
}
