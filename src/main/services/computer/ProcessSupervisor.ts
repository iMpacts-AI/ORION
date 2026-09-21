import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import { exec } from 'child_process';
import { promisify } from 'util';
import { eventBus } from '../../../shared/events';

const execAsync = promisify(exec);

export interface TrackedProcess {
  id: string;
  pid?: number;
  command: string;
  startedAt: number;
  process?: ChildProcess;
  abortController?: AbortController;
  isEstoppable: boolean;
}

export class ProcessSupervisor {
  private static instance: ProcessSupervisor;
  private activeProcesses: Map<string, TrackedProcess> = new Map();
  private estopActive: boolean = false;

  public static getInstance(): ProcessSupervisor {
    if (!ProcessSupervisor.instance) {
      ProcessSupervisor.instance = new ProcessSupervisor();
    }
    return ProcessSupervisor.instance;
  }

  public isEstopActive(): boolean {
    return this.estopActive;
  }

  public registerProcess(
    id: string,
    command: string,
    proc?: ChildProcess,
    abortController?: AbortController,
    isEstoppable: boolean = true
  ): TrackedProcess {
    if (this.estopActive && isEstoppable) {
      if (proc && proc.pid) {
        this.killProcessTree(proc.pid);
      }
      if (abortController) {
        abortController.abort();
      }
      throw new Error(`[ESTOP REJECTION] Cannot spawn process '${command}'. System is in EMERGENCY STOP state.`);
    }

    const tracked: TrackedProcess = {
      id,
      pid: proc?.pid,
      command,
      startedAt: Date.now(),
      process: proc,
      abortController,
      isEstoppable
    };

    this.activeProcesses.set(id, tracked);

    if (proc) {
      proc.on('exit', () => {
        this.activeProcesses.delete(id);
      });
      proc.on('error', () => {
        this.activeProcesses.delete(id);
      });
    }

    return tracked;
  }

  public unregisterProcess(id: string): void {
    this.activeProcesses.delete(id);
  }

  public getActiveProcessCount(): number {
    return this.activeProcesses.size;
  }

  public getActiveProcesses(): TrackedProcess[] {
    return Array.from(this.activeProcesses.values());
  }

  public async triggerEstop(): Promise<{ terminatedCount: number; errors: string[] }> {
    this.estopActive = true;
    eventBus.logActivity('ERROR_EVENT', '[PROCESS SUPERVISOR] EMERGENCY STOP ACTIVATED. Terminating all active process trees.');

    let terminatedCount = 0;
    const errors: string[] = [];

    for (const [id, tracked] of this.activeProcesses.entries()) {
      if (!tracked.isEstoppable) continue;

      try {
        if (tracked.abortController) {
          tracked.abortController.abort();
        }

        if (tracked.pid) {
          await this.killProcessTree(tracked.pid);
          terminatedCount++;
        } else if (tracked.process) {
          tracked.process.kill('SIGKILL');
          terminatedCount++;
        }
      } catch (err: any) {
        errors.push(`Failed to kill process ${id} (PID ${tracked.pid}): ${err.message}`);
      }
    }

    this.activeProcesses.clear();
    return { terminatedCount, errors };
  }

  public resetEstop(): void {
    this.estopActive = false;
    eventBus.logActivity('SYSTEM_EVENT', '[PROCESS SUPERVISOR] Emergency Stop reset. New process spawning permitted.');
  }

  public async killProcessTree(pid: number): Promise<void> {
    if (!pid || pid <= 0) return;

    if (process.platform === 'win32') {
      try {
        // /F = force, /T = terminate tree of child processes
        await execAsync(`taskkill /F /T /PID ${pid}`);
      } catch (err: any) {
        // Process might have already exited
      }
    } else {
      try {
        process.kill(-pid, 'SIGKILL');
      } catch (e) {
        try {
          process.kill(pid, 'SIGKILL');
        } catch {}
      }
    }
  }

  public async runManagedCommand(
    command: string,
    args: string[] = [],
    options: SpawnOptions = {},
    timeoutMs: number = 30000
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    if (this.estopActive) {
      throw new Error(`[ESTOP REJECTION] Cannot execute '${command}'. System is in EMERGENCY STOP state.`);
    }

    const processId = `proc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const abortController = new AbortController();

    return new Promise((resolve, reject) => {
      let child: ChildProcess;
      let stdoutData = '';
      let stderrData = '';

      const timer = setTimeout(() => {
        if (child && child.pid) {
          this.killProcessTree(child.pid);
        }
        reject(new Error(`[TIMEOUT] Process '${command}' exceeded execution limit of ${timeoutMs}ms.`));
      }, timeoutMs);

      try {
        child = spawn(command, args, {
          ...options,
          signal: abortController.signal,
          shell: false
        });
      } catch (err) {
        clearTimeout(timer);
        return reject(err);
      }

      this.registerProcess(processId, `${command} ${args.join(' ')}`, child, abortController, true);

      if (child.stdout) {
        child.stdout.on('data', (chunk) => {
          stdoutData += chunk.toString();
        });
      }

      if (child.stderr) {
        child.stderr.on('data', (chunk) => {
          stderrData += chunk.toString();
        });
      }

      child.on('close', (code) => {
        clearTimeout(timer);
        this.unregisterProcess(processId);
        resolve({
          stdout: stdoutData,
          stderr: stderrData,
          exitCode: code ?? 0
        });
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        this.unregisterProcess(processId);
        reject(err);
      });
    });
  }
}
