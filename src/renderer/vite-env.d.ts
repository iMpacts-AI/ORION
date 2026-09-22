import { SystemSnapshot, ToolCall, ToolResult, VisionResult, VoiceState, MemoryItem } from '../shared/types';

export interface ProviderStatusDTO {
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
  capabilities: {
    supportsTools: boolean;
    supportsVision: boolean;
    supportsStreaming: boolean;
    maxContextTokens: number;
    taskCategories: string[];
  };
}

export interface OrionElectronApi {
  getSystemSnapshot: () => Promise<SystemSnapshot>;
  getTools: () => Promise<any[]>;
  executeTool: (toolCall: ToolCall) => Promise<ToolResult>;
  processCommand: (query: string, source?: 'TEXT' | 'VOICE') => Promise<any>;
  getAIRouterStatus: () => Promise<ProviderStatusDTO>;
  getAllProviderStatuses: () => Promise<ProviderStatusDTO[]>;
  setAIRoutingStrategy: (strategy: string) => Promise<boolean>;
  saveProviderKeys: (keys: Record<string, string>) => Promise<boolean>;
  runLiveQualificationTest: () => Promise<Record<string, any>>;
  controlVoice: (action: 'start' | 'stop') => Promise<VoiceState>;
  stopSpeaking: () => Promise<boolean>;
  captureVision: (source: 'CAMERA' | 'SCREENSHOT') => Promise<VisionResult>;
  captureScreen: () => Promise<string | null>;
  getMemories: () => Promise<MemoryItem[]>;
  saveMemory: (item: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<MemoryItem>;
  deleteMemory: (id: string) => Promise<boolean>;
  clearConversation?: () => Promise<boolean>;
  getSupervisorTasks?: () => Promise<any[]>;
  getEnvironmentState?: () => Promise<any>;
  getTrace?: (traceId: string) => Promise<any>;
  executeComputerAction?: (action: any) => Promise<any>;
  runTitanPipeline?: (options?: any) => Promise<any>;
  approveTitanRender?: (options?: { target?: string }) => Promise<any>;
  getTitanPipelineStatus?: () => Promise<any>;
  resetTitanPipeline?: () => Promise<any>;
  getTitanOutputPreview?: (options?: { target?: string }) => Promise<any>;
  onTitanPipelineUpdated?: (callback: (data: any) => void) => () => void;
  runTitanBatch?: (options?: any) => Promise<any>;
  approveTitanBatchTarget?: () => Promise<any>;
  getTitanBatchStatus?: () => Promise<any>;
  resetTitanBatch?: () => Promise<any>;
  onTitanBatchUpdated?: (callback: (data: any) => void) => () => void;
  packageTitanRelease?: (options: { target: string; forceOverwrite?: boolean }) => Promise<any>;
  validateTitanRelease?: (options: { target: string }) => Promise<any>;
  getTitanReleaseManifest?: (options: { target: string }) => Promise<any>;
  getComputerObservation?: () => Promise<any>;
  planComputerTask?: (command: string) => Promise<any>;
  executeComputerPlan?: (plan: any) => Promise<any>;
  executeComputerCommand?: (command: string) => Promise<any>;
  emergencyStopComputer?: () => Promise<void>;
  resetEmergencyStopComputer?: () => Promise<void>;
  onComputerTaskUpdated?: (callback: (data: any) => void) => () => void;
  unifiedMemoryAdd?: (item: { type: string; content: string; tags?: string[]; trustLevel?: string }) => Promise<any>;
  unifiedMemoryQuery?: (query: string, limit?: number) => Promise<any[]>;
  unifiedMemoryClear?: (type?: string) => Promise<boolean>;
  developerInspectRepo?: (targetPath: string) => Promise<any>;
  developerSearchCode?: (targetPath: string, query: string) => Promise<any[]>;
  developerExecuteBuild?: (targetPath: string, command: string) => Promise<any>;
  browserObserve?: () => Promise<any>;
  browserNavigate?: (url: string, openInExternal?: boolean) => Promise<any>;
  browserClick?: (selector: string) => Promise<any>;
  browserType?: (selector: string, text: string) => Promise<any>;
  getDemoHealthCheck?: () => Promise<any>;
  resetDemo?: () => Promise<any>;
}




declare global {
  interface Window {
    orionApi?: OrionElectronApi;
    arvisApi?: OrionElectronApi;
  }
}
