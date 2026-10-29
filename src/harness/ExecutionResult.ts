import { PermissionLevel, TaskOutcomeStatus, VerificationStatus } from '../shared/types';

export type HarnessExecutionStatus =
  | 'COMPLETED'
  | 'LAUNCHED_UNVERIFIED'
  | 'PARTIALLY_COMPLETED'
  | 'FAILED'
  | 'BLOCKED'
  | 'AWAITING_APPROVAL'
  | 'CANCELLED'
  | 'TIMED_OUT'
  | 'UNAVAILABLE';

export type HarnessPermissionTier = 'TIER_1_READ_ONLY' | 'TIER_2_CONFIRMATION' | 'TIER_3_STRICT_OR_BLOCKED';

export type HarnessMode = 'Build' | 'Plan' | 'Chat';

export type HarnessEffortLevel = 'low' | 'medium' | 'high' | 'max';

export interface StructuredToolCallProposal {
  actionId: string;
  toolName: string;
  arguments: Record<string, any>;
  taskId: string;
  sessionId: string;
  permissionLevel: PermissionLevel;
  permissionTier: HarnessPermissionTier;
  requiresApproval: boolean;
  approvalStatus: 'NOT_REQUIRED' | 'PENDING' | 'APPROVED' | 'DENIED';
  approvalId?: string;
  approvalToken?: string;
  timeoutMs: number;
  signal?: AbortSignal;
}

export interface StructuredToolExecutionResult<T = any> {
  actionId: string;
  toolName: string;
  taskId: string;
  sessionId: string;
  status: HarnessExecutionStatus;
  permissionTier: HarnessPermissionTier;
  startedAt: number;
  completedAt: number;
  durationMs: number;
  verificationStatus: VerificationStatus;
  verified: boolean;
  outcomeStatus?: TaskOutcomeStatus;
  output?: T;
  error?: string;
  errorCode?: string;
  approvalId?: string;
  checkpointId?: string;
}

export type HarnessLifecycleStage =
  | 'UNDERSTAND'
  | 'PLAN'
  | 'VALIDATE'
  | 'AUTHORIZE'
  | 'EXECUTE'
  | 'OBSERVE'
  | 'VERIFY'
  | 'RECOVER_OR_REPORT';

export interface HarnessStageTrace {
  stage: HarnessLifecycleStage;
  timestamp: number;
  detail: string;
  status: 'OK' | 'WARN' | 'ERROR';
}

export interface HarnessLoopReport {
  taskId: string;
  sessionId: string;
  goal: string;
  mode: HarnessMode;
  effort: HarnessEffortLevel;
  activeModel: string;
  activeProvider: string;
  status: HarnessExecutionStatus;
  outcomeStatus?: TaskOutcomeStatus;
  verified: boolean;
  iterationsUsed: number;
  maxIterations: number;
  stages: HarnessStageTrace[];
  toolResults: StructuredToolExecutionResult[];
  finalResponse: string;
  checkpointId?: string;
  pendingApprovalId?: string;
  startedAt: number;
  completedAt: number;
  durationMs: number;
  error?: string;
}
