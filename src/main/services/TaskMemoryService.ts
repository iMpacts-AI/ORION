export interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  stepsTotal: number;
  stepsCompleted: number;
  checkpointData?: any;
}

export class TaskMemoryService {
  private activeTasks: Map<string, AgentTask> = new Map();
  private currentTaskId: string | null = null;

  public createTask(title: string, description: string, stepsTotal = 1): AgentTask {
    const task: AgentTask = {
      id: 'task_' + Math.random().toString(36).substring(2, 9),
      title,
      description,
      status: 'IN_PROGRESS',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      stepsTotal,
      stepsCompleted: 0
    };

    this.activeTasks.set(task.id, task);
    this.currentTaskId = task.id;
    return task;
  }

  public getCurrentTask(): AgentTask | undefined {
    return this.currentTaskId ? this.activeTasks.get(this.currentTaskId) : undefined;
  }

  public updateTaskProgress(taskId: string, stepsCompleted: number, checkpointData?: any): void {
    const task = this.activeTasks.get(taskId);
    if (task) {
      task.stepsCompleted = stepsCompleted;
      task.updatedAt = Date.now();
      if (checkpointData) task.checkpointData = checkpointData;
      if (task.stepsCompleted >= task.stepsTotal) {
        task.status = 'COMPLETED';
        task.completedAt = Date.now();
      }
    }
  }

  public completeCurrentTask(): void {
    if (this.currentTaskId) {
      const task = this.activeTasks.get(this.currentTaskId);
      if (task) {
        task.status = 'COMPLETED';
        task.completedAt = Date.now();
        task.updatedAt = Date.now();
      }
    }
  }

  public cancelCurrentTask(): void {
    if (this.currentTaskId) {
      const task = this.activeTasks.get(this.currentTaskId);
      if (task) {
        task.status = 'CANCELLED';
        task.updatedAt = Date.now();
      }
    }
  }

  public getTasks(): AgentTask[] {
    return Array.from(this.activeTasks.values());
  }

  public clearTasks(): void {
    this.activeTasks.clear();
    this.currentTaskId = null;
  }
}
