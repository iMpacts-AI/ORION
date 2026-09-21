import { BackgroundTaskRecord, TaskPriority, TaskSupervisorStatus } from '../../shared/types/taskSupervisor';
import { eventBus } from '../../shared/events';

export class TaskSupervisor {
  private tasks: Map<string, BackgroundTaskRecord> = new Map();

  public createTask(
    title: string,
    description: string,
    priority: TaskPriority = 'MEDIUM',
    deadlineMs?: number,
    retryBudgetMax = 3
  ): BackgroundTaskRecord {
    const record: BackgroundTaskRecord = {
      taskId: 'sup_task_' + Math.random().toString(36).substring(2, 9),
      executionId: 'exec_' + Math.random().toString(36).substring(2, 9),
      title,
      description,
      status: 'QUEUED',
      priority,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deadlineMs: deadlineMs ? Date.now() + deadlineMs : undefined,
      retryBudgetMax,
      retriesAttempted: 0,
      progressPercent: 0,
      verificationVerified: false
    };

    this.tasks.set(record.taskId, record);
    eventBus.logActivity('SYSTEM_EVENT', `Background Task '${title}' [${record.taskId}] QUEUED (Priority: ${priority})`);
    return record;
  }

  public startTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task || task.status === 'CANCELLED' || task.status === 'COMPLETED') return false;

    task.status = 'RUNNING';
    task.startedAt = Date.now();
    task.updatedAt = Date.now();
    eventBus.logActivity('SYSTEM_EVENT', `Background Task '${task.title}' [${taskId}] RUNNING`);
    return true;
  }

  public updateProgress(taskId: string, progressPercent: number, checkpointData?: any): void {
    const task = this.tasks.get(taskId);
    if (task && task.status === 'RUNNING') {
      task.progressPercent = Math.min(100, Math.max(0, progressPercent));
      task.updatedAt = Date.now();
      if (checkpointData) task.checkpointData = checkpointData;
      if (task.progressPercent >= 100) {
        task.status = 'COMPLETED';
        task.completedAt = Date.now();
        task.verificationVerified = true;
      }
    }
  }

  public handleTaskFailure(taskId: string, reason: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    task.failureReason = reason;
    task.updatedAt = Date.now();

    if (task.retriesAttempted < task.retryBudgetMax) {
      task.retriesAttempted++;
      task.status = 'RETRYING';
      eventBus.logActivity('ERROR_EVENT', `Background Task '${task.title}' failed (${reason}). Initiating retry #${task.retriesAttempted}/${task.retryBudgetMax}...`);
      return true; // Will retry
    } else {
      task.status = 'FAILED';
      eventBus.logActivity('ERROR_EVENT', `Background Task '${task.title}' FAILED permanently. Retry budget exhausted.`);
      return false; // Permanently failed
    }
  }

  public cancelTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    task.status = 'CANCELLED';
    task.updatedAt = Date.now();
    eventBus.logActivity('SYSTEM_EVENT', `Background Task '${task.title}' [${taskId}] CANCELLED by operator.`);
    return true;
  }

  public getTask(taskId: string): BackgroundTaskRecord | undefined {
    return this.tasks.get(taskId);
  }

  public getAllTasks(): BackgroundTaskRecord[] {
    return Array.from(this.tasks.values());
  }

  public checkDeadlines(): void {
    const now = Date.now();
    for (const task of this.tasks.values()) {
      if (task.status === 'RUNNING' && task.deadlineMs && now > task.deadlineMs) {
        task.status = 'FAILED';
        task.failureReason = 'Task execution deadline exceeded.';
        task.updatedAt = now;
        eventBus.logActivity('ERROR_EVENT', `Background Task '${task.title}' [${task.taskId}] FAILED: Deadline exceeded.`);
      }
    }
  }
}
