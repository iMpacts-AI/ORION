export * from './environment';
export * from './action';
export * from './taskSupervisor';
export * from './browser';
export * from './eventDriven';
export * from './developerAgent';
export * from './memoryManager';

// Core ORION Assistant & Agent Loop States
export type AssistantState =
  | 'STANDBY'
  | 'IDLE'
  | 'LISTENING'
  | 'UNDERSTANDING'
  | 'PLANNING'
  | 'EXECUTING'
  | 'OBSERVING'
  | 'REASONING'
  | 'REPLANNING'
  | 'VERIFYING'
  | 'RESPONDING'
  | 'SPEAKING'
  | 'WAITING'
  | 'CANCELLED'
  | 'FAILED'
  | 'THINKING'
  | 'VISION'
  | 'ERROR';

// ORION Navigation & HUD Modes
export type OrionMode =
  | 'COMMAND'
  | 'SYSTEM'
  | 'VISION'
  | 'COMPUTER'
  | 'NETWORK'
  | 'WORLD'
  | 'TASK'
  | 'MEMORY'
  | 'TITAN'
  | 'DEMO';


export type ArvisMode = OrionMode;

// Privacy & Hardware States
export interface PrivacyState {
  micActive: boolean;
  cameraActive: boolean;
  screenCaptureActive: boolean;
  userConfirmationRequired: boolean;
}

// User Request Payload
export interface AssistantRequest {
  id: string;
  timestamp: number;
  type: 'TEXT' | 'VOICE' | 'VISION' | 'SYSTEM';
  query: string;
  context?: {
    currentMode?: OrionMode;
    activeWindow?: string;
    clipboardText?: string;
    imageDataUrl?: string;
  };
}

// Conversation Memory Data Structures
export interface ConversationTurn {
  id: string;
  timestamp: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  visionSummary?: string;
  tokensEstimate?: number;
}

export interface ConversationMemoryConfig {
  maxTurns: number;
  maxTotalTokens: number;
  maxTotalChars: number;
}

// Latency & Observability Metrics
export interface CommandTelemetryMetrics {
  totalCommandLatencyMs: number;
  intentClassificationLatencyMs: number;
  planningLatencyMs: number;
  toolExecutionLatencyMs: number;
  visionCaptureLatencyMs: number;
  visionAnalysisLatencyMs: number;
  aiTtftMs: number;
  aiTotalGenerationLatencyMs: number;
  failoverCount: number;
  retryCount: number;
  replanningCount: number;
}

// Assistant Response Payload
export interface AssistantResponse {
  requestId: string;
  timestamp: number;
  text: string;
  state: AssistantState;
  suggestedMode?: OrionMode;
  toolCalls?: ToolCall[];
  executionResults?: ToolResult[];
  voiceAudioUrl?: string;
  metrics?: CommandTelemetryMetrics;
}

// Tool Definition & Architecture
export type PermissionLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ToolParameterSchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
  enum?: string[];
}

export type VerificationStatus = 'EXECUTED' | 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'FAILED' | 'UNKNOWN';

export interface Observation {
  executionId: string;
  toolCallId: string;
  timestamp: number;
  source: string;
  trustLevel: 'UNTRUSTED_EXTERNAL' | 'TRUSTED_LOCAL_SYSTEM' | 'SYSTEM_INTERNAL';
  data: any;
  summary: string;
  verificationStatus: VerificationStatus;
  warnings?: string[];
}

export interface Tool {
  id: string;
  name: string;
  category: 'COMPUTER' | 'BROWSER' | 'TERMINAL' | 'FILE' | 'SCREENSHOT' | 'CAMERA' | 'SYSTEM' | 'DEVELOPER' | 'AUTOMATION';
  description: string;
  permissionLevel: PermissionLevel;
  parameters: Record<string, ToolParameterSchema>;
  isReadOnly?: boolean;
  isMutating?: boolean;
  isDangerous?: boolean;
  isIdempotent?: boolean;
  requiresApproval?: boolean;
  timeoutMs?: number;
  supportsCancellation?: boolean;
  verificationStrategy?: string;
  outputSchemaDescription?: string;
  isDevelopmentMock?: boolean;
}

export interface ToolCall {
  id: string;
  toolId: string;
  toolName: string;
  arguments: Record<string, any>;
  timestamp: number;
  requiresUserApproval: boolean;
}

export interface ToolResult {
  toolCallId: string;
  toolId: string;
  success: boolean;
  verificationStatus: VerificationStatus;
  verified?: boolean;
  data?: any;
  error?: string;
  observation?: Observation;
  timestamp: number;
  executionTimeMs: number;
}

// System Snapshots & Telemetry
export interface CpuCoreStats {
  id: number;
  usagePercent: number;
  frequencyGHz: number;
}

export interface SystemSnapshot {
  timestamp: number;
  isMock: boolean;
  cpu: {
    usagePercent: number;
    cores: CpuCoreStats[];
    temperatureCelsius: number | null; // N/A if null
    model: string;
  };
  gpu: {
    name: string;
    usagePercent: number | null;
    memoryUsedMB: number | null;
    memoryTotalMB: number | null;
    temperatureCelsius: number | null;
  };
  memory: {
    totalBytes: number;
    usedBytes: number;
    freeBytes: number;
    usagePercent: number;
  };
  storage: {
    driveLabel: string;
    totalBytes: number;
    usedBytes: number;
    freeBytes: number;
    usagePercent: number;
  }[];
  network: {
    downloadKbps: number;
    uploadKbps: number;
    pingMs: number;
    interfaceName: string;
    ipAddress: string;
  };
  battery?: {
    percent: number;
    isCharging: boolean;
    timeRemainingMins: number | null;
  };
}

// Vision Service Interfaces
export interface FrameAnalysis {
  timestamp: number;
  source: 'CAMERA' | 'SCREENSHOT';
  detectedObjects: Array<{ label: string; confidence: number; bbox: [number, number, number, number] }>;
  extractedText?: string;
  sceneSummary: string;
}

export interface VisionResult {
  timestamp: number;
  analysis: FrameAnalysis;
  isMock: boolean;
}

// Voice Service Interfaces
export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  wakeWordDetected: boolean;
  audioLevel: number; // 0 to 100 waveform magnitude
  transcriptBuffer: string;
}

// Tasks & Activities
export interface TaskState {
  id: string;
  title: string;
  status: 'PENDING' | 'RUNNING' | 'WAITING_APPROVAL' | 'COMPLETED' | 'FAILED';
  progressPercent: number;
  currentAction: string;
  startedAt: number;
  completedAt?: number;
  logs: string[];
}

export interface ActivityEvent {
  id: string;
  timestamp: number;
  type: 'VOICE_INPUT' | 'PROCESSING' | 'TOOL_EXECUTION' | 'SYSTEM_EVENT' | 'TASK_COMPLETE' | 'ERROR_EVENT';
  message: string;
  details?: Record<string, any>;
  mode?: OrionMode;
}

// Explicit Memory Storage
export interface MemoryItem {
  id: string;
  createdAt: number;
  updatedAt: number;
  category: 'PREFERENCE' | 'FACT' | 'AUTOMATION' | 'WORKFLOW' | 'SYSTEM_NOTE';
  key: string;
  value: string;
  source: 'USER_EXPLICIT' | 'ASSISTANT_DERIVED';
}

// Phase 5 Operator Status & Pipeline Event Models
export type OrionOperatorStatus =
  | 'SYSTEM ONLINE'
  | 'SYSTEM STARTING'
  | 'SYSTEM DEGRADED'
  | 'SYSTEM ERROR'
  | 'TITAN IDLE'
  | 'TITAN INSPECTING'
  | 'TITAN PLANNING'
  | 'TITAN VOICE READY'
  | 'TITAN AWAITING APPROVAL'
  | 'TITAN RENDERING'
  | 'TITAN QA ANALYSIS'
  | 'TITAN GATE PASSED'
  | 'TITAN GATE FAILED';

export type TitanEventSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';

export interface TitanPipelineEvent {
  id: string;
  timestamp: number;
  stage: string;
  eventType: string;
  message: string;
  severity: TitanEventSeverity;
  artifactPath?: string;
  data?: any;
}

// Phase 6 Multi-Target Batch Orchestration Models
export type TitanBatchTarget = 'Video_001' | 'Video_002' | 'Video_003';

export type TitanBatchState =
  | 'IDLE'
  | 'VALIDATING_TARGETS'
  | 'RUNNING_TARGET'
  | 'AWAITING_TARGET_APPROVAL'
  | 'TARGET_QA'
  | 'TARGET_PASSED'
  | 'TARGET_FAILED'
  | 'BATCH_PAUSED'
  | 'BATCH_COMPLETED'
  | 'BATCH_FAILED'
  | 'ERROR';

export interface TitanBatchEvent {
  id: string;
  timestamp: number;
  batchId: string;
  target?: TitanBatchTarget;
  state: TitanBatchState;
  eventType: string;
  message: string;
  severity: TitanEventSeverity;
  data?: any;
}

export interface TitanBatchTargetResult {
  target: TitanBatchTarget;
  gatePassed: boolean;
  qaScore?: number;
  renderAttempts: number;
  state: string;
  artifactPath?: string;
  failureReasons?: string[];
  recommendedCorrectiveActions?: string[];
}

export interface TitanBatchProgress {
  batchId: string;
  state: TitanBatchState;
  currentTarget?: TitanBatchTarget;
  currentTargetIndex: number;
  totalTargets: number;
  completedTargets: number;
  passedTargets: number;
  failedTargets: number;
  currentQA?: number;
  availableRamMB: number;
  batchStartTime: number;
  targetStartTime: number;
  elapsedTimeMs: number;
  pendingApprovalTarget?: TitanBatchTarget;
}

export interface TitanBatchResult {
  batchId: string;
  state: TitanBatchState;
  allPassed: boolean;
  totalTargets: number;
  passedTargets: number;
  failedTargets: number;
  targetResults: Record<string, TitanBatchTargetResult>;
  progress: TitanBatchProgress;
  events: TitanBatchEvent[];
  error?: string;
}

// Phase 8 B2B Revenue & Prospect Intelligence Types
export type ProspectNiche = 'AI_STARTUP' | 'DEV_TOOLS' | 'AI_INFRASTRUCTURE' | 'OTHER';

export interface ProspectProfile {
  id: string;
  companyName: string;
  website: string;
  niche: ProspectNiche;
  technicalSubject: string;
  technicalMoatDescription: string;
  targetAudience: 'ENGINEERS' | 'FOUNDERS' | 'ENTERPRISE_BUYERS' | 'INVESTORS';
  contactPerson?: {
    name: string;
    role: string;
    email?: string;
    linkedin?: string;
  };
  fundingStage?: 'SEED' | 'SERIES_A' | 'SERIES_B_PLUS' | 'BOOTSTRAPPED';
  notes?: string;
}

export interface LeadQualificationResult {
  prospectId: string;
  companyName: string;
  totalScore: number; // 0 to 100
  qualificationTier: 'HIGH_PRIORITY' | 'MEDIUM_PRIORITY' | 'LOW_PRIORITY' | 'UNQUALIFIED';
  breakdown: {
    technicalComplexityScore: number; // /30
    budgetLikelihoodScore: number;    // /25
    moatCommunicationPain: number;   // /25
    distributionReadiness: number;   // /20
  };
  recommendedServiceTier: 'TIER_1_SINGLE' | 'TIER_2_MONTHLY' | 'TIER_3_ENTERPRISE';
  recommendedOutreachAngle: string;
  suggestedHookThesis: string;
}

export interface ClientOnboardingWorkflowState {
  workflowId: string;
  prospect: ProspectProfile;
  qualification: LeadQualificationResult;
  selectedTier: 'TIER_1_SINGLE' | 'TIER_2_MONTHLY' | 'TIER_3_ENTERPRISE';
  priceUsd: number;
  estimatedTurnaroundDays: number;
  intakeCompleted: boolean;
  intakeAnswers?: Record<string, string>;
  titanTargetKey?: TitanBatchTarget;
  deliveryChecklistState: Record<string, boolean>;
  status: 'PROSPECT' | 'QUALIFIED' | 'OUTREACH_PENDING' | 'INTAKE_SUBMITTED' | 'TITAN_EXECUTING' | 'QA_PASSED' | 'READY_FOR_DELIVERY' | 'DELIVERED';
  createdAt: number;
  updatedAt: number;
}


