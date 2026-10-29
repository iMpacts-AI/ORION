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
  cancelCommand?: (reason?: string) => Promise<any>;
  onStreamToken?: (callback: (payload: { token: string }) => void) => () => void;
  onOrchestratorStateChanged?: (callback: (payload: { state: string; detail: string }) => void) => () => void;
  onToolStarted?: (callback: (toolCall: any) => void) => () => void;
  onToolCompleted?: (callback: (result: any) => void) => () => void;
  onToolFailed?: (callback: (payload: any) => void) => () => void;
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
  getTasks?: () => Promise<any[]>;
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
  planComputerTask?: (command: string, options?: any) => Promise<any>;
  executeComputerPlan?: (plan: any) => Promise<any>;
  executeComputerCommand?: (command: string, options?: any) => Promise<any>;
  cancelComputerTask?: (reason?: string) => Promise<any>;
  emergencyStopComputer?: () => Promise<any>;
  resetEmergencyStopComputer?: () => Promise<any>;
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
  browserOpenChrome?: (options?: { url?: string; visibleWindow?: boolean; useCdp?: boolean }) => Promise<any>;
  browserSearch?: (query: string, useCdpAdapter?: boolean) => Promise<any>;
  browserOpenTabs?: (urls: string[], useCdpAdapter?: boolean) => Promise<any>;
  browserFillForm?: (payload: {
    fields: Record<string, string>;
    submitSelector?: string;
    submitForm?: boolean;
    explicitAuthorization?: boolean;
  }) => Promise<any>;
  browserExecuteClosedLoop?: (payload: {
    goal: string;
    explicitAuthorization?: boolean;
    useCdpAdapter?: boolean;
    visibleWindow?: boolean;
    formFields?: Record<string, string>;
    submitSelector?: string;
    submitForm?: boolean;
  }) => Promise<any>;
  browserClose?: () => Promise<any>;
  onBrowserStageChanged?: (callback: (payload: { stage: string; detail: string; timestamp: number }) => void) => () => void;
  getActiveAppsState?: (forceRefresh?: boolean) => Promise<any>;
  focusOrOpenApp?: (appId: string, url?: string) => Promise<any>;
  getAgentsRoster?: () => Promise<any>;
  setActiveAgent?: (agentId: string) => Promise<any>;
  runAgentTask?: (payload: {
    agentId: string;
    title?: string;
    prompt: string;
    toolCallsToRun?: Array<{ toolId: string; arguments?: Record<string, any> }>;
  }) => Promise<any>;
  delegateAgentGoal?: (goal: string, targetFile?: string) => Promise<any>;
  cancelAgentTask?: (taskId: string, reason?: string) => Promise<any>;
  getSecurityStatus?: () => Promise<any>;
  getPendingApprovals?: () => Promise<any[]>;
  approvePendingRequest?: (approvalId?: string) => Promise<any>;
  denyPendingRequest?: (approvalId?: string) => Promise<any>;
  getDemoHealthCheck?: () => Promise<any>;
  resetDemo?: () => Promise<any>;
  getInitialMode?: () => Promise<string>;
}

declare global {
  interface Window {
    orionApi?: OrionElectronApi;
    arvisApi?: OrionElectronApi;
  }
}
