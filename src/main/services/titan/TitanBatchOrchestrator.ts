import { TitanClosedLoopPipeline } from './TitanClosedLoopPipeline';
import {
  TitanBatchTarget,
  TitanBatchState,
  TitanBatchProgress,
  TitanBatchResult,
  TitanBatchEvent,
  TitanBatchTargetResult,
  TitanEventSeverity
} from '../../../shared/types';
import path from 'path';
import os from 'os';

export interface BatchExecutionOptions {
  targets: string[];
  titanRootDir?: string;
  hasExplicitRenderApproval?: boolean;
}

export class TitanBatchOrchestrator {
  private pipeline: TitanClosedLoopPipeline;
  private titanRootDir: string;
  private state: TitanBatchState = 'IDLE';
  private events: TitanBatchEvent[] = [];
  private currentBatchResult: TitanBatchResult | null = null;
  private activeTargets: TitanBatchTarget[] = [];
  private currentTargetIndex: number = 0;
  private batchStartTime: number = 0;
  private isProcessing: boolean = false;

  public static readonly ALLOWED_TARGETS: TitanBatchTarget[] = ['Video_001', 'Video_002', 'Video_003'];
  public static readonly MIN_RAM_MB = 512;

  constructor(pipeline?: TitanClosedLoopPipeline, titanRootDir = process.env.TITAN_ROOT || path.join(os.homedir(), 'Project_Titan')) {
    this.pipeline = pipeline || new TitanClosedLoopPipeline();
    this.titanRootDir = path.resolve(titanRootDir);
  }

  public getState(): TitanBatchState {
    return this.state;
  }

  public getEvents(): TitanBatchEvent[] {
    return [...this.events];
  }

  public getCurrentResult(): TitanBatchResult | null {
    return this.currentBatchResult ? { ...this.currentBatchResult } : null;
  }

  private isPathWithinTitanRoot(targetPath: string, rootDir: string): boolean {
    const resolvedTarget = path.resolve(targetPath);
    const resolvedRoot = path.resolve(rootDir);
    return resolvedTarget.startsWith(resolvedRoot) && !resolvedTarget.includes('..');
  }

  private recordEvent(
    batchId: string,
    state: TitanBatchState,
    eventType: string,
    message: string,
    severity: TitanEventSeverity,
    target?: TitanBatchTarget,
    data?: any
  ): void {
    this.state = state;
    const evt: TitanBatchEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      batchId,
      target,
      state,
      eventType,
      message,
      severity,
      data
    };
    this.events.push(evt);
  }

  /**
   * Resets batch orchestrator state cleanly back to IDLE while preserving audit history.
   */
  public reset(): TitanBatchResult {
    this.state = 'IDLE';
    this.activeTargets = [];
    this.currentTargetIndex = 0;
    this.isProcessing = false;
    const batchId = `batch_reset_${Date.now()}`;

    this.recordEvent(batchId, 'IDLE', 'BATCH_RESET', 'Operator reset batch orchestrator to IDLE. Audit history preserved.', 'INFO');

    const result: TitanBatchResult = {
      batchId,
      state: 'IDLE',
      allPassed: false,
      totalTargets: 0,
      passedTargets: 0,
      failedTargets: 0,
      targetResults: {},
      progress: {
        batchId,
        state: 'IDLE',
        currentTargetIndex: 0,
        totalTargets: 0,
        completedTargets: 0,
        passedTargets: 0,
        failedTargets: 0,
        availableRamMB: Math.round(os.freemem() / (1024 * 1024)),
        batchStartTime: Date.now(),
        targetStartTime: Date.now(),
        elapsedTimeMs: 0
      },
      events: this.getEvents()
    };

    this.currentBatchResult = result;
    return result;
  }

  /**
   * Initiates or resumes sequential multi-target batch execution across Project Titan.
   */
  public async executeBatch(options: BatchExecutionOptions): Promise<TitanBatchResult> {
    const batchId = this.currentBatchResult?.batchId || `titan_batch_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const titanPath = options.titanRootDir ? path.resolve(options.titanRootDir) : this.titanRootDir;
    const hasApproval = options.hasExplicitRenderApproval === true;

    // Security Gate 1: Path Traversal & Workspace Boundary Enforcement
    if (!this.isPathWithinTitanRoot(titanPath, this.titanRootDir)) {
      const err = `SECURITY VIOLATION: Workspace path '${titanPath}' escapes Titan root workspace.`;
      this.recordEvent(batchId, 'ERROR', 'PATH_VIOLATION', err, 'ERROR');
      const errRes: TitanBatchResult = {
        batchId,
        state: 'ERROR',
        allPassed: false,
        totalTargets: options.targets?.length || 0,
        passedTargets: 0,
        failedTargets: 0,
        targetResults: {},
        progress: {
          batchId,
          state: 'ERROR',
          currentTargetIndex: 0,
          totalTargets: options.targets?.length || 0,
          completedTargets: 0,
          passedTargets: 0,
          failedTargets: 0,
          availableRamMB: Math.round(os.freemem() / (1024 * 1024)),
          batchStartTime: Date.now(),
          targetStartTime: Date.now(),
          elapsedTimeMs: 0
        },
        events: this.getEvents(),
        error: err
      };
      this.currentBatchResult = errRes;
      return errRes;
    }

    // Validation Gate 2: Empty Batch Rejection
    if (!options.targets || !Array.isArray(options.targets) || options.targets.length === 0) {
      const err = 'VALIDATION ERROR: Batch targets array is empty or undefined.';
      this.recordEvent(batchId, 'ERROR', 'EMPTY_BATCH', err, 'ERROR');
      const errRes: TitanBatchResult = {
        batchId,
        state: 'ERROR',
        allPassed: false,
        totalTargets: 0,
        passedTargets: 0,
        failedTargets: 0,
        targetResults: {},
        progress: {
          batchId,
          state: 'ERROR',
          currentTargetIndex: 0,
          totalTargets: 0,
          completedTargets: 0,
          passedTargets: 0,
          failedTargets: 0,
          availableRamMB: Math.round(os.freemem() / (1024 * 1024)),
          batchStartTime: Date.now(),
          targetStartTime: Date.now(),
          elapsedTimeMs: 0
        },
        events: this.getEvents(),
        error: err
      };
      this.currentBatchResult = errRes;
      return errRes;
    }

    // Validation Gate 3: Target Allowlist Enforcement
    for (const t of options.targets) {
      if (!TitanBatchOrchestrator.ALLOWED_TARGETS.includes(t as TitanBatchTarget)) {
        const err = `VALIDATION ERROR: Target '${t}' is not in allowlist (${TitanBatchOrchestrator.ALLOWED_TARGETS.join(', ')}).`;
        this.recordEvent(batchId, 'ERROR', 'INVALID_TARGET', err, 'ERROR');
        const errRes: TitanBatchResult = {
          batchId,
          state: 'ERROR',
          allPassed: false,
          totalTargets: options.targets.length,
          passedTargets: 0,
          failedTargets: 0,
          targetResults: {},
          progress: {
            batchId,
            state: 'ERROR',
            currentTargetIndex: 0,
            totalTargets: options.targets.length,
            completedTargets: 0,
            passedTargets: 0,
            failedTargets: 0,
            availableRamMB: Math.round(os.freemem() / (1024 * 1024)),
            batchStartTime: Date.now(),
            targetStartTime: Date.now(),
            elapsedTimeMs: 0
          },
          events: this.getEvents(),
          error: err
        };
        this.currentBatchResult = errRes;
        return errRes;
      }
    }

    // Concurrency Lock: Prevent multiple concurrent batch executions
    if (this.isProcessing) {
      const msg = 'Batch already running in sequential mode.';
      return this.currentBatchResult!;
    }
    this.isProcessing = true;

    // Initialize or Resume Batch Setup
    if (this.state === 'IDLE' || this.state === 'BATCH_COMPLETED' || this.state === 'BATCH_FAILED' || this.state === 'ERROR') {
      this.activeTargets = options.targets as TitanBatchTarget[];
      this.currentTargetIndex = 0;
      this.batchStartTime = Date.now();
      this.recordEvent(batchId, 'VALIDATING_TARGETS', 'BATCH_STARTED', `Initiated batch production run for [${this.activeTargets.join(', ')}]`, 'INFO');
    }

    const targetResults: Record<string, TitanBatchTargetResult> = this.currentBatchResult?.targetResults || {};
    let passedCount = Object.values(targetResults).filter(r => r.gatePassed).length;
    let failedCount = Object.values(targetResults).filter(r => !r.gatePassed && r.state !== 'AWAITING_APPROVAL').length;

    // SEQUENTIAL EXECUTION LOOP (Resource-safe: strictly one target at a time)
    while (this.currentTargetIndex < this.activeTargets.length) {
      const currentTarget = this.activeTargets[this.currentTargetIndex];
      const targetStartTime = Date.now();

      // RAM Safety Precondition Check
      const freeRamMB = Math.round(os.freemem() / (1024 * 1024));
      if (freeRamMB < TitanBatchOrchestrator.MIN_RAM_MB) {
        const err = `RESOURCE ERROR: Available RAM (${freeRamMB}MB) below minimum safety requirement (${TitanBatchOrchestrator.MIN_RAM_MB}MB). Pausing batch.`;
        this.recordEvent(batchId, 'BATCH_PAUSED', 'RAM_LOW', err, 'WARNING', currentTarget);
        this.isProcessing = false;
        const pausedRes: TitanBatchResult = {
          batchId,
          state: 'BATCH_PAUSED',
          allPassed: false,
          totalTargets: this.activeTargets.length,
          passedTargets: passedCount,
          failedTargets: failedCount,
          targetResults,
          progress: {
            batchId,
            state: 'BATCH_PAUSED',
            currentTarget,
            currentTargetIndex: this.currentTargetIndex + 1,
            totalTargets: this.activeTargets.length,
            completedTargets: passedCount + failedCount,
            passedTargets: passedCount,
            failedTargets: failedCount,
            availableRamMB: freeRamMB,
            batchStartTime: this.batchStartTime,
            targetStartTime,
            elapsedTimeMs: Date.now() - this.batchStartTime
          },
          events: this.getEvents(),
          error: err
        };
        this.currentBatchResult = pausedRes;
        return pausedRes;
      }

      this.recordEvent(batchId, 'RUNNING_TARGET', 'TARGET_STARTED', `Starting sequential processing for target ${currentTarget} (${this.currentTargetIndex + 1}/${this.activeTargets.length})`, 'INFO', currentTarget);

      // Execute Target via Closed-Loop Pipeline
      const runResult = await this.pipeline.executePipeline({
        target: currentTarget,
        titanRootDir: titanPath,
        hasExplicitRenderApproval: hasApproval
      });

      // Handle Approval Pausing
      if (runResult.state === 'AWAITING_RENDER_APPROVAL') {
        this.recordEvent(batchId, 'AWAITING_TARGET_APPROVAL', 'APPROVAL_REQUIRED', `Target ${currentTarget} requires explicit user approval before rendering. Batch paused.`, 'WARNING', currentTarget);
        this.isProcessing = false;

        targetResults[currentTarget] = {
          target: currentTarget,
          gatePassed: false,
          renderAttempts: 0,
          state: 'AWAITING_APPROVAL',
          failureReasons: ['Awaiting explicit human approval to render']
        };

        const approvalRes: TitanBatchResult = {
          batchId,
          state: 'AWAITING_TARGET_APPROVAL',
          allPassed: false,
          totalTargets: this.activeTargets.length,
          passedTargets: passedCount,
          failedTargets: failedCount,
          targetResults,
          progress: {
            batchId,
            state: 'AWAITING_TARGET_APPROVAL',
            currentTarget,
            currentTargetIndex: this.currentTargetIndex + 1,
            totalTargets: this.activeTargets.length,
            completedTargets: passedCount + failedCount,
            passedTargets: passedCount,
            failedTargets: failedCount,
            availableRamMB: freeRamMB,
            batchStartTime: this.batchStartTime,
            targetStartTime,
            elapsedTimeMs: Date.now() - this.batchStartTime,
            pendingApprovalTarget: currentTarget
          },
          events: this.getEvents()
        };
        this.currentBatchResult = approvalRes;
        return approvalRes;
      }

      // Handle QA Gate Outcome
      if (runResult.state === 'GATE_PASSED' && runResult.gatePassed) {
        passedCount++;
        this.recordEvent(batchId, 'TARGET_PASSED', 'QA_GATE_PASSED', `Target ${currentTarget} PASSED QA Gate with score ${runResult.qaScore}/100`, 'SUCCESS', currentTarget, runResult.qaMetrics);

        targetResults[currentTarget] = {
          target: currentTarget,
          gatePassed: true,
          qaScore: runResult.qaScore,
          renderAttempts: runResult.renderAttempts,
          state: 'GATE_PASSED',
          artifactPath: runResult.artifacts?.renderedDraftPath
        };

        // Advance to next target in sequence
        this.currentTargetIndex++;
      } else {
        // Target Failed or Error Encountered
        failedCount++;
        const failMsg = `Target ${currentTarget} FAILED QA Gate (Score: ${runResult.qaScore || 0}/100). Halting batch execution safely.`;
        this.recordEvent(batchId, 'TARGET_FAILED', 'QA_GATE_FAILED', failMsg, 'ERROR', currentTarget, {
          failureReasons: runResult.failureReasons,
          recommendedCorrectiveActions: runResult.recommendedCorrectiveActions
        });

        targetResults[currentTarget] = {
          target: currentTarget,
          gatePassed: false,
          qaScore: runResult.qaScore,
          renderAttempts: runResult.renderAttempts,
          state: runResult.state,
          failureReasons: runResult.failureReasons,
          recommendedCorrectiveActions: runResult.recommendedCorrectiveActions
        };

        // Stop Batch Safely on Failure (Fail-safe: do not blindly continue to next video)
        this.isProcessing = false;
        this.recordEvent(batchId, 'BATCH_FAILED', 'BATCH_HALTED', `Batch halted due to failure in target ${currentTarget}`, 'ERROR');

        const failedBatchRes: TitanBatchResult = {
          batchId,
          state: 'BATCH_FAILED',
          allPassed: false,
          totalTargets: this.activeTargets.length,
          passedTargets: passedCount,
          failedTargets: failedCount,
          targetResults,
          progress: {
            batchId,
            state: 'BATCH_FAILED',
            currentTarget,
            currentTargetIndex: this.currentTargetIndex + 1,
            totalTargets: this.activeTargets.length,
            completedTargets: passedCount + failedCount,
            passedTargets: passedCount,
            failedTargets: failedCount,
            currentQA: runResult.qaScore,
            availableRamMB: freeRamMB,
            batchStartTime: this.batchStartTime,
            targetStartTime,
            elapsedTimeMs: Date.now() - this.batchStartTime
          },
          events: this.getEvents(),
          error: failMsg
        };
        this.currentBatchResult = failedBatchRes;
        return failedBatchRes;
      }
    }

    // All Targets Completed Successfully
    this.isProcessing = false;
    this.recordEvent(batchId, 'BATCH_COMPLETED', 'BATCH_FINISHED', `All ${this.activeTargets.length} batch targets completed and passed QA gate (>= 90/100).`, 'SUCCESS');

    const completedRes: TitanBatchResult = {
      batchId,
      state: 'BATCH_COMPLETED',
      allPassed: true,
      totalTargets: this.activeTargets.length,
      passedTargets: passedCount,
      failedTargets: 0,
      targetResults,
      progress: {
        batchId,
        state: 'BATCH_COMPLETED',
        currentTargetIndex: this.activeTargets.length,
        totalTargets: this.activeTargets.length,
        completedTargets: this.activeTargets.length,
        passedTargets: passedCount,
        failedTargets: 0,
        availableRamMB: Math.round(os.freemem() / (1024 * 1024)),
        batchStartTime: this.batchStartTime,
        targetStartTime: Date.now(),
        elapsedTimeMs: Date.now() - this.batchStartTime
      },
      events: this.getEvents()
    };
    this.currentBatchResult = completedRes;
    return completedRes;
  }

  /**
   * Approves the pending target in the batch and resumes execution.
   */
  public async approveBatchTarget(titanRootDir?: string): Promise<TitanBatchResult> {
    if (this.state !== 'AWAITING_TARGET_APPROVAL' || this.activeTargets.length === 0) {
      return this.currentBatchResult || this.reset();
    }

    return await this.executeBatch({
      targets: this.activeTargets,
      titanRootDir: titanRootDir || this.titanRootDir,
      hasExplicitRenderApproval: true
    });
  }
}
