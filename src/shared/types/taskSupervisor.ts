export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TaskSupervisorStatus =
  | 'QUEUED'
  | 'RUNNING'
  | 'PAUSED'
  | 'WAITING'
  | 'RETRYING'
  | 'BLOCKED'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface BackgroundTaskRecord {
  taskId: string;
  executionId: string;
  title: string;
  description: string;
  status: TaskSupervisorStatus;
  priority: TaskPriority;
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  completedAt?: number;
  deadlineMs?: number;
  retryBudgetMax: number;
  retriesAttempted: number;
  checkpointData?: any;
  progressPercent: number;
  failureReason?: string;
  verificationVerified: boolean;
}
