import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
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
  ownerTaskId?: string;
  isDetachedUserApp?: boolean;
}

export interface ManagedCommandOptions extends SpawnOptions {
  ownerTaskId?: string;
  isDetachedUserApp?: boolean;
  externalSignal?: AbortSignal;
}

export class ProcessSupervisor {
  private static instance: ProcessSupervisor;
  private activeProcesses: Map<string, TrackedProcess> = new Map();
  private estopActive: boolean = false;
  private lastEstopReason?: string;
  private lastEstopTimestamp?: number;
  private lastResetTimestamp?: number;
  private estopStatePath: string;

  constructor(customEstopStatePath?: string) {
    this.estopStatePath =
      customEstopStatePath || path.join(process.cwd(), '.orion_memory', 'estop_state.json');
    this.loadPersistedEstopState();
  }

  public static getInstance(): ProcessSupervisor {
    if (!ProcessSupervisor.instance) {
      ProcessSupervisor.instance = new ProcessSupervisor();
    }
    return ProcessSupervisor.instance;
  }

  private loadPersistedEstopState(): void {
    try {
      if (fs.existsSync(this.estopStatePath)) {
        const parsed = JSON.parse(fs.readFileSync(this.estopStatePath, 'utf8'));
        if (parsed && typeof parsed.active === 'boolean') {
          this.estopActive = parsed.active;
          this.lastEstopReason = parsed.reason;
          this.lastEstopTimestamp = parsed.activatedAt;
          this.lastResetTimestamp = parsed.lastResetAt;
        }
      }
    } catch {}
  }

  private persistEstopState(): void {
    try {
      const dir = path.dirname(this.estopStatePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(
        this.estopStatePath,
        JSON.stringify(
          {
            active: this.estopActive,
            reason: this.lastEstopReason,
            activatedAt: this.lastEstopTimestamp,
            lastResetAt: this.lastResetTimestamp
          },
          null,
          2
        ),
        'utf8'
      );
    } catch {}
  }

  public isEstopActive(): boolean {
    return this.estopActive;
  }

  public getEstopMetadata(): {
    active: boolean;
    reason?: string;
    activatedAt?: number;
    lastResetAt?: number;
  } {
    return {
      active: this.estopActive,
      reason: this.lastEstopReason,
      activatedAt: this.lastEstopTimestamp,
      lastResetAt: this.lastResetTimestamp
    };
  }

  public registerProcess(
    id: string,
    command: string,
    proc?: ChildProcess,
    abortController?: AbortController,
    isEstoppable: boolean = true,
    meta?: { ownerTaskId?: string; isDetachedUserApp?: boolean }
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
      isEstoppable,
      ownerTaskId: meta?.ownerTaskId,
      isDetachedUserApp: meta?.isDetachedUserApp
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

  /**
   * Cancels and terminates ORION-owned active task processes for task cancellation
   * (e.g., Escape-to-Cancel) WITHOUT activating global Emergency Stop lockdown and
   * WITHOUT killing already-detached user desktop applications.
   */
  public async cancelActiveProcesses(
    reason: string = 'Operator Escape-to-Cancel',
    ownerTaskId?: string
  ): Promise<{ terminatedCount: number; errors: string[] }> {
    eventBus.logActivity(
      'SYSTEM_EVENT',
      `[PROCESS SUPERVISOR] Cancelling active task processes (${reason}).`
    );

    let terminatedCount = 0;
    const errors: string[] = [];
    const removedIds: string[] = [];

    for (const [id, tracked] of this.activeProcesses.entries()) {
      // Never kill an already-detached user desktop application from an unrelated task
      if (tracked.isDetachedUserApp && (!ownerTaskId || tracked.ownerTaskId !== ownerTaskId)) {
        continue;
      }
      if (ownerTaskId && tracked.ownerTaskId && tracked.ownerTaskId !== ownerTaskId) {
        continue;
      }

      try {
        if (tracked.abortController) {
          tracked.abortController.abort(new Error(reason));
        }

        if (tracked.pid) {
          await this.killProcessTree(tracked.pid);
          terminatedCount++;
        } else if (tracked.process) {
          tracked.process.kill('SIGKILL');
          terminatedCount++;
        }
        removedIds.push(id);
      } catch (err: any) {
        errors.push(`Failed to terminate process ${id} (PID ${tracked.pid}): ${err.message}`);
        removedIds.push(id);
      }
    }

    for (const id of removedIds) {
      this.activeProcesses.delete(id);
    }
    return { terminatedCount, errors };
  }

  public async triggerEstop(reason: string = 'Operator Emergency Stop'): Promise<{ terminatedCount: number; errors: string[] }> {
    this.estopActive = true;
    this.lastEstopReason = reason;
    this.lastEstopTimestamp = Date.now();
    this.persistEstopState();
    eventBus.logActivity('ERROR_EVENT', `[PROCESS SUPERVISOR] EMERGENCY STOP ACTIVATED (${reason}). Terminating all active process trees.`);

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

  public resetEstop(reason: string = 'Explicit operator reset'): void {
    this.estopActive = false;
    this.lastResetTimestamp = Date.now();
    this.persistEstopState();
    eventBus.logActivity('SYSTEM_EVENT', `[PROCESS SUPERVISOR] Emergency Stop reset (${reason}). New process spawning permitted.`);
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
    options: ManagedCommandOptions = {},
    timeoutMs: number = 30000
  ): Promise<{ stdout: string; stderr: string; exitCode: number; pid?: number }> {
    if (this.estopActive) {
      throw new Error(`[ESTOP REJECTION] Cannot execute '${command}'. System is in EMERGENCY STOP state.`);
    }

    if (!command || typeof command !== 'string' || !command.trim()) {
      throw new Error(`[INVALID COMMAND] Process command must be a non-empty string.`);
    }

    if (options.externalSignal?.aborted) {
      throw new Error(`[CANCELLED] Process '${command}' aborted before spawn via AbortSignal.`);
    }

    const processId = `proc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const abortController = new AbortController();
    const isDetachedUserApp = options.isDetachedUserApp ?? Boolean(options.detached);

    return new Promise((resolve, reject) => {
      let child: ChildProcess;
      let stdoutData = '';
      let stderrData = '';
      let settled = false;

      const onExternalAbort = () => {
        if (settled) return;
        if (child && child.pid) {
          this.killProcessTree(child.pid).catch(() => {});
        } else {
          abortController.abort();
        }
        settleReject(new Error(`[CANCELLED] Process '${command}' terminated due to task cancellation.`));
      };

      if (options.externalSignal) {
        options.externalSignal.addEventListener('abort', onExternalAbort, { once: true });
      }

      const cleanupSignal = () => {
        if (options.externalSignal) {
          options.externalSignal.removeEventListener('abort', onExternalAbort);
        }
      };

      const settleResolve = (val: { stdout: string; stderr: string; exitCode: number; pid?: number }) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        cleanupSignal();
        // Once a detached user desktop application has cleanly spawned and survived its startup grace window,
        // release it from active task cancellation tracking so later Escape presses never kill the user's open app!
        if (isDetachedUserApp) {
          this.unregisterProcess(processId);
        }
        resolve(val);
      };

      const settleReject = (err: Error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        cleanupSignal();
        this.unregisterProcess(processId);
        reject(err);
      };

      const timer = setTimeout(() => {
        if (child && child.pid) {
          this.killProcessTree(child.pid);
        } else {
          abortController.abort();
        }
        settleReject(
          new Error(
            `[TIMEOUT] Process '${command}' exceeded execution limit of ${timeoutMs}ms${stderrData ? ': ' + stderrData.trim() : ''}.`
          )
        );
      }, timeoutMs);

      const { ownerTaskId, isDetachedUserApp: _detachedFlag, externalSignal: _extSig, ...spawnOpts } = options;

      try {
        child = spawn(command, args, {
          ...spawnOpts,
          // Do not bind Node's AbortSignal onto detached user desktop apps so unref'd apps aren't killed after handoff
          ...(options.detached ? {} : { signal: abortController.signal }),
          shell: false
        });
      } catch (err: any) {
        return settleReject(err instanceof Error ? err : new Error(String(err)));
      }

      try {
        this.registerProcess(processId, `${command} ${args.join(' ')}`, child, abortController, true, {
          ownerTaskId,
          isDetachedUserApp
        });
      } catch (regErr: any) {
        return settleReject(regErr instanceof Error ? regErr : new Error(String(regErr)));
      }

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

      // Attach error handler BEFORE any detached resolution so ENOENT / EACCES rejects properly
      child.on('error', (err) => {
        settleReject(err);
      });

      if (options.detached) {
        child.once('spawn', () => {
          const detachGraceTimer = setTimeout(() => {
            if (settled) return;
            if (typeof child.unref === 'function') {
              child.unref();
            }
            settleResolve({
              stdout: stdoutData,
              stderr: stderrData,
              exitCode: 0,
              pid: child.pid
            });
          }, 150);

          child.once('exit', (code) => {
            clearTimeout(detachGraceTimer);
            this.unregisterProcess(processId);
            if (code !== null && code !== 0) {
              settleReject(
                new Error(
                  `[DETACHED LAUNCH FAILED] Process '${command}' exited immediately with code ${code}${stderrData ? ': ' + stderrData.trim() : ''}`
                )
              );
            } else {
              settleResolve({
                stdout: stdoutData,
                stderr: stderrData,
                exitCode: code ?? 0,
                pid: child.pid
              });
            }
          });
        });
        return;
      }

      child.on('close', (code) => {
        this.unregisterProcess(processId);
        settleResolve({
          stdout: stdoutData,
          stderr: stderrData,
          exitCode: code ?? 0,
          pid: child.pid
        });
      });
    });
  }
}
