import fs from 'fs';
import path from 'path';
import { ComputerTaskPlan } from '../../../shared/types/action';

export interface TaskStateCheckpoint {
  taskId: string;
  timestamp: number;
  plan: ComputerTaskPlan;
  environmentSnapshot?: Record<string, any>;
}

export class TaskStateStore {
  private storeDir: string;
  private inMemoryCache: Map<string, TaskStateCheckpoint> = new Map();

  constructor(customStoreDir?: string) {
    this.storeDir = customStoreDir || path.resolve(process.cwd(), '.orion_task_state');
    if (!fs.existsSync(this.storeDir)) {
      try {
        fs.mkdirSync(this.storeDir, { recursive: true });
      } catch (e) {}
    }
  }

  public async saveCheckpoint(plan: ComputerTaskPlan, envSnapshot?: Record<string, any>): Promise<string> {
    const checkpointId = `chk_${plan.taskId}_${Date.now()}`;
    plan.checkpointId = checkpointId;
    plan.updatedAt = Date.now();

    const checkpoint: TaskStateCheckpoint = {
      taskId: plan.taskId,
      timestamp: Date.now(),
      plan: JSON.parse(JSON.stringify(plan)),
      environmentSnapshot: envSnapshot
    };

    this.inMemoryCache.set(plan.taskId, checkpoint);

    try {
      const filePath = path.join(this.storeDir, `${plan.taskId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(checkpoint, null, 2), 'utf8');
    } catch (e) {}

    return checkpointId;
  }

  public async loadCheckpoint(taskId: string): Promise<TaskStateCheckpoint | undefined> {
    if (this.inMemoryCache.has(taskId)) {
      return this.inMemoryCache.get(taskId);
    }

    try {
      const filePath = path.join(this.storeDir, `${taskId}.json`);
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(data) as TaskStateCheckpoint;
        this.inMemoryCache.set(taskId, parsed);
        return parsed;
      }
    } catch (e) {}

    return undefined;
  }

  public async clearTask(taskId: string): Promise<void> {
    this.inMemoryCache.delete(taskId);
    try {
      const filePath = path.join(this.storeDir, `${taskId}.json`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {}
  }
}
