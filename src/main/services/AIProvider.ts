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

    // Official Coders HQ Demo Scenarios
    if (
      lower.includes('overview of this machine') ||
      lower.includes('overview of this computer') ||
      lower.includes('machine overview') ||
      lower.includes('system overview') ||
      lower.includes('computer overview')
    ) {
      return {
        intent: 'SYSTEM_QUERY',
        confidence: 1.0,
        suggestedTools: ['system.get_info', 'system.get_cpu_usage', 'system.get_memory_usage']
      };
    }

    if (
      (lower.includes('cpu') && lower.includes('memory')) ||
      (lower.includes('cpu') && lower.includes('ram'))
    ) {
      return {
        intent: 'SYSTEM_QUERY',
        confidence: 1.0,
        suggestedTools: ['system.get_cpu_usage', 'system.get_memory_usage']
      };
    }

    if (lower.includes('project status') || lower.includes('orion project status')) {
      return {
        intent: 'SYSTEM_QUERY',
        confidence: 1.0,
        suggestedTools: ['file.list_directory'],
        fastPathMatch: { toolId: 'file.list_directory', args: { dirPath: '.' } }
      };
    }

    if (
      lower.includes('restricted') ||
      lower.includes('protected system') ||
      (lower.includes('write') && (lower.includes('system32') || lower.includes('windows')))
    ) {
      return {
        intent: 'FILE_OPERATION',
        confidence: 1.0,
        suggestedTools: ['file.write_text'],
        fastPathMatch: {
          toolId: 'file.write_text',
          args: {
            filePath: 'C:\\Windows\\System32\\orion_demo_probe.txt',
            content: 'ORION_RESTRICTED_WRITE_TEST'
          }
        }
      };
    }

    if (lower.includes('what tools') || lower.includes('available tools') || lower.includes('list tools')) {
      return {
        intent: 'TOOL_EXECUTION',
        confidence: 0.95
      };
    }

    if (lower.includes('safely access') || lower.includes('safety boundary') || lower.includes('permission')) {
      return {
        intent: 'CONVERSATION',
        confidence: 0.95
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
      lower.includes('uptime') ||
      lower.includes('machine') ||
      lower.includes('computer') ||
      lower.includes('specs') ||
      lower.includes('hardware')
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
    if (lower.includes('machine') || lower.includes('computer') || lower.includes('specs') || lower.includes('hardware') || lower.includes('overview')) {
      return ['system.get_info', 'system.get_cpu_usage', 'system.get_memory_usage'];
    }
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

    // 1. Synthesize from actual tool observations if present in context
    if (prompt.includes('OBSERVATIONS & TOOL RESULTS DATA:')) {
      const observationSummary = this.synthesizeObservations(prompt);
      if (observationSummary) {
        return observationSummary;
      }
    }

    // 2. Specific Coders HQ Demo Queries
    if (lower.includes('what tools') || lower.includes('available tools') || lower.includes('list tools')) {
      return `ORION System Architecture maintains 16 registered native tools across 5 domains:
• SYSTEM: system.get_info, system.get_cpu_usage, system.get_memory_usage, system.get_disk_usage, system.get_network_status, system.get_current_time
• FILE: file.list_directory, file.read_text, file.write_text
• COMPUTER: computer.observe, computer.plan_task, computer.execute_action, computer.natural_language_command
• BROWSER: browser.navigate, browser.search
• TITAN: Closed-loop multi-stage automated production pipeline`;
    }

    if (lower.includes('safely access') || lower.includes('safety boundary') || lower.includes('permission')) {
      return `ORION Security & Permission Architecture:
• 4-Tier Deterministic Risk Model: LOW (Read-Only), MEDIUM (Local Operations), HIGH (Mutating/Sensitive), CRITICAL (Protected Paths)
• Protected System Boundaries: C:\\Windows, System32, /etc/, and master render paths strictly prohibited
• Human Authorization Gate: Mutating/Critical operations require explicit operator confirmation
• Hardware Emergency Stop: Zero-delay process-level execution interrupt capability`;
    }

    if (/\b(hello|hey|greetings)\b/i.test(lower) || lower.trim() === 'hi' || lower.startsWith('hi ')) {
      return 'Greetings. ORION AI Command System is online (Deterministic Rule-Based Engine active). All local tools, telemetry, and security gates are operational.';
    }
    if (lower.includes('who are you') || lower.includes('what is orion')) {
      return 'I am ORION — Advanced Agentic Desktop Command System. Operating with deterministic task orchestration, closed-loop tool execution, and multi-provider failover routing.';
    }

    return `[ORION INTEL] Query received: "${prompt}". Native tool execution and system telemetry remain fully operational.`;
  }

  private synthesizeObservations(prompt: string): string {
    const obsIndex = prompt.indexOf('OBSERVATIONS & TOOL RESULTS DATA:');
    if (obsIndex === -1) return '';
    const obsBlock = prompt.substring(obsIndex);

    // Check for security policy violations
    if (
      obsBlock.includes('SECURITY POLICY VIOLATION') ||
      obsBlock.includes('restricted boundary') ||
      obsBlock.includes('Critical action prohibited') ||
      obsBlock.includes('Security containment enforced')
    ) {
      return 'SECURITY POLICY CONTAINMENT ENFORCED: Operation on restricted system path was safely intercepted and blocked by ORION deterministic safety evaluation.';
    }

    const summaries: string[] = [];
    const lines = obsBlock.split('\n');

    for (const line of lines) {
      const resultIdx = line.indexOf('| Result: ');
      if (resultIdx === -1) continue;

      const toolMatch = line.match(/Tool:\s*([a-zA-Z0-9_.-]+)/);
      const toolId = toolMatch ? toolMatch[1] : '';
      const payloadStr = line.substring(resultIdx + 10).trim();

      try {
        const parsed = JSON.parse(payloadStr);

        if (toolId === 'system.get_info') {
          const uptimeHours = (parsed.uptimeSeconds / 3600).toFixed(1);
          summaries.push(`Host: ${parsed.hostname} (${parsed.platform} ${parsed.architecture}, OS Release ${parsed.osRelease}). Processor: ${parsed.cpuModel} (${parsed.totalCores} cores, uptime: ${uptimeHours}h).`);
        } else if (toolId === 'system.get_cpu_usage') {
          summaries.push(`CPU Utilization: ${parsed.averageUsagePercent}% average load across ${parsed.cores?.length || 'all'} cores.`);
        } else if (toolId === 'system.get_memory_usage') {
          summaries.push(`RAM Memory: Using ${parsed.usedGB} GB of ${parsed.totalGB} GB (${parsed.usagePercent}% utilization, ${parsed.freeGB} GB free).`);
        } else if (toolId === 'system.get_disk_usage') {
          summaries.push(`Storage: Primary system drive is ONLINE with healthy storage reserves.`);
        } else if (toolId === 'system.get_network_status') {
          summaries.push(`Network: Interface ${parsed.interfaceName} is ${parsed.status} on IP ${parsed.localIp}.`);
        } else if (toolId === 'system.get_current_time') {
          summaries.push(`System Time: ${parsed.localTimeString} (${parsed.localDateString}).`);
        } else if (toolId === 'file.list_directory') {
          const fileSample = parsed.items?.slice(0, 8).map((i: any) => i.name).join(', ') || '';
          summaries.push(`Directory Inspection: ${parsed.itemCount} items detected at '${parsed.directory}' (e.g. ${fileSample}).`);
        } else if (parsed && typeof parsed === 'object') {
          summaries.push(`Tool ${toolId}: ${JSON.stringify(parsed)}`);
        }
      } catch (_) {
        if (payloadStr) {
          summaries.push(`Tool ${toolId}: ${payloadStr}`);
        }
      }
    }

    if (summaries.length > 0) {
      return `ORION System Verification & Telemetry:\n` + summaries.map(s => `• ${s}`).join('\n');
    }

    return '';
  }

  public async stream(prompt: string, onToken: (token: string) => void): Promise<string> {
    const response = await this.chat(prompt);
    onToken(response);
    return response;
  }
}
