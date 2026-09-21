import {
  ComputerAction,
  ActionResult,
  ComputerTaskPlan,
  ComputerObservation,
  ComputerActionAuditEntry
} from '../../../shared/types/action';
import { ScreenUnderstandingService } from './ScreenUnderstandingService';
import { InputControlService } from './InputControlService';
import { WindowManagerService } from './WindowManagerService';
import { ComputerPermissionService } from './ComputerPermissionService';
import { ComputerActionVerifier } from './ComputerActionVerifier';
import { ComputerRecoveryService } from './ComputerRecoveryService';
import { ComputerActionPlanner } from './ComputerActionPlanner';
import { TaskStateStore } from './TaskStateStore';
import { TaskStateMachine } from './TaskStateMachine';
import { ProcessSupervisor } from './ProcessSupervisor';
import { eventBus } from '../../../shared/events';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class ComputerActionExecutor {
  private screenUnderstanding: ScreenUnderstandingService;
  private inputControl: InputControlService;
  private windowManager: WindowManagerService;
  private permissionService: ComputerPermissionService;
  private verifier: ComputerActionVerifier;
  private recoveryService: ComputerRecoveryService;
  private planner?: ComputerActionPlanner;
  private stateStore: TaskStateStore;
  private activePlanLock: boolean = false;

  constructor(
    screenUnderstanding?: ScreenUnderstandingService,
    inputControl?: InputControlService,
    windowManager?: WindowManagerService,
    permissionService?: ComputerPermissionService,
    verifier?: ComputerActionVerifier,
    recoveryService?: ComputerRecoveryService,
    planner?: ComputerActionPlanner,
    stateStore?: TaskStateStore
  ) {
    this.screenUnderstanding = screenUnderstanding || new ScreenUnderstandingService();
    this.inputControl = inputControl || new InputControlService();
    this.windowManager = windowManager || new WindowManagerService();
    this.permissionService = permissionService || new ComputerPermissionService();
    this.verifier = verifier || new ComputerActionVerifier();
    this.recoveryService = recoveryService || new ComputerRecoveryService();
    this.planner = planner;
    this.stateStore = stateStore || new TaskStateStore();
  }

  public getStateStore(): TaskStateStore {
    return this.stateStore;
  }

  public async executePlan(
    plan: ComputerTaskPlan,
    onProgress?: (plan: ComputerTaskPlan) => void
  ): Promise<ComputerTaskPlan> {
    if (this.activePlanLock) {
      plan.status = 'FAILED';
      plan.completionReport = 'Execution BLOCKED: Concurrent desktop task execution is prohibited.';
      eventBus.logActivity('ERROR_EVENT', `Concurrent task execution conflict for task ${plan.taskId}`);
      return plan;
    }

    this.activePlanLock = true;
    const planStartTime = Date.now();
    const stateMachine = new TaskStateMachine(plan.taskId, (plan.status as any) || 'IDLE');
    stateMachine.transition('EXECUTING', 'Beginning plan execution loop');
    plan.status = stateMachine.getState();
    if (!plan.stateTransitions) plan.stateTransitions = [];
    if (!plan.replanHistory) plan.replanHistory = [];
    if (!plan.timingMetrics) plan.timingMetrics = {};
    await this.stateStore.saveCheckpoint(plan);

    let replanCount = 0;
    const maxReplans = 2;

    try {
      for (let i = plan.currentActionIndex; i < plan.actions.length; i++) {
        plan.currentActionIndex = i;
        const action = plan.actions[i];

        // Check emergency stop
        if (this.permissionService.isEmergencyStopped()) {
          stateMachine.transition('ESTOPPED', 'Emergency stop triggered during workflow');
          plan.status = stateMachine.getState();
          plan.cancellationState = { isCancelled: true, reason: 'ESTOPPED', cancelledAt: Date.now() };
          break;
        }

        // Check cancellation
        if (plan.cancellationState?.isCancelled) {
          stateMachine.transition('CANCELLED', 'Task cancelled by caller');
          plan.status = stateMachine.getState();
          break;
        }

        if (onProgress) onProgress(plan);

        const result = await this.executeAction(action, plan.taskId, plan.isDryRun);
        const isBlocked = !result.preconditionsMet && !result.success && Boolean(result.error?.includes('blocked') || result.error?.includes('prohibited') || result.error?.includes('Emergency Stop'));

        const auditEntry: ComputerActionAuditEntry = {
          timestamp: Date.now(),
          taskId: plan.taskId,
          actionId: action.id,
          application: result.observedState?.activeWindow?.processName || 'System',
          action: action.type,
          target: action.target || action.selector?.text,
          confidence: action.confidence !== undefined ? action.confidence : 0.9,
          risk: action.riskLevel,
          approval: result.preconditionsMet ? 'APPROVED' : (isBlocked ? 'DENIED' : 'PENDING'),
          result: result.ambiguityDetected ? 'AMBIGUOUS' : (isBlocked ? 'BLOCKED' : (result.success ? (result.recovered ? 'RECOVERED' : 'SUCCESS') : 'FAILURE')),
          verification: result.postconditionsVerified ? 'VERIFIED' : 'FAILED',
          durationMs: result.executionTimeMs || 0,
          isDryRun: plan.isDryRun,
          error: result.error
        };
        plan.auditLog.push(auditEntry);
        plan.currentObservationId = result.observedState?.observationId;
        await this.stateStore.saveCheckpoint(plan);

        if (!result.success) {
          stateMachine.transition('RECOVERING', `Action ${action.type} failed: ${result.error || 'unknown'}`);
          plan.status = stateMachine.getState();

          // Phase 10 & 13 Adaptive Replanning Attempt
          if (!isBlocked && this.planner && replanCount < maxReplans && !result.ambiguityDetected) {
            replanCount++;
            eventBus.logActivity('PROCESSING', `Adaptive Replanning triggered (attempt ${replanCount}/${maxReplans}) for failed action: ${action.type}`);
            plan.replanHistory.push({
              failedActionId: action.id,
              reason: result.error || 'Action execution/verification failure',
              timestamp: Date.now()
            });

            const remaining = plan.actions.slice(i + 1);
            const currentObs = (result.observedState as ComputerObservation) || (await this.screenUnderstanding.captureObservation());
            const newActions = await this.planner.replanFromFailure(
              action,
              result.error || 'Verification failure',
              currentObs,
              remaining
            );

            if (newActions && newActions.length > 0) {
              plan.actions = [...plan.actions.slice(0, i), ...newActions];
              i--; // Rewind index to execute newly synthesized actions
              stateMachine.transition('EXECUTING', 'Resuming plan with newly synthesized actions');
              plan.status = stateMachine.getState();
              await this.stateStore.saveCheckpoint(plan);
              continue;
            }
          }

          stateMachine.transition('FAILED', result.error || 'Execution failure');
          plan.status = stateMachine.getState();
          break;
        }
      }

      if (plan.status === 'EXECUTING') {
        stateMachine.transition('COMPLETED', 'All actions successfully executed and verified');
        plan.status = stateMachine.getState();
      }
    } finally {
      this.activePlanLock = false;
    }

    plan.stateTransitions = stateMachine.getTransitions();
    plan.totalSteps = plan.actions.length;
    plan.recoveryCount = replanCount;

    // Structured completion timing & report
    const totalDuration = Date.now() - planStartTime;
    const actionDuration = plan.auditLog.reduce((acc, curr) => acc + curr.durationMs, 0);
    plan.timingMetrics = {
      actionExecutionMs: actionDuration,
      totalDurationMs: totalDuration
    };

    const totalActions = plan.actions.length;
    const verifiedActions = plan.auditLog.filter(a => a.verification === 'VERIFIED').length;
    const failedActions = plan.auditLog.filter(a => a.result === 'FAILURE').length;

    plan.completionReport = [
      `=== ORION WORKFLOW EXECUTION REPORT ===`,
      `Task ID: ${plan.taskId}`,
      `Command: "${plan.naturalLanguageCommand}"`,
      `Intent: ${plan.intent}`,
      `Status: ${plan.status}`,
      `Dry Run: ${plan.isDryRun === true ? 'YES (Preview Mode)' : 'NO (Live Execution)'}`,
      `Total Steps: ${totalActions}`,
      `Verified Steps: ${verifiedActions}`,
      `Failed Steps: ${failedActions}`,
      `Replans Executed: ${plan.replanHistory.length}`,
      `Total Execution Duration: ${totalDuration}ms (Action time: ${actionDuration}ms)`,
      `Step Verification Integrity: ${(verifiedActions / (totalActions || 1) * 100).toFixed(1)}%`,
      `Audit Log Entries: ${plan.auditLog.length}`
    ].join('\n');

    await this.stateStore.saveCheckpoint(plan);
    if (onProgress) onProgress(plan);
    return plan;
  }

  public async executeAction(action: ComputerAction, taskId: string = 'task_standalone', isDryRunOverride?: boolean): Promise<ActionResult> {
    const startTime = Date.now();
    const isDryRun = isDryRunOverride ?? action.isDryRun ?? false;

    // 1. Permission & Emergency Stop Evaluation
    const perm = this.permissionService.evaluateActionPermission(action);
    if (!perm.allowed) {
      return {
        actionId: action.id,
        success: false,
        preconditionsMet: false,
        postconditionsVerified: false,
        error: perm.reason || 'Action blocked by permission gate.',
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }

    // 2. Initial Screen Observation
    const priorObservation = await this.screenUnderstanding.captureObservation();

    // 3. Action Execution via Subsystems
    let execSuccess = true;
    let execError: string | undefined;
    let targetPoint: { x: number; y: number } | undefined;
    let isAmbiguous = false;
    let ambiguityCandidates: any[] | undefined;

    try {
      if (action.selector) {
        const located = this.screenUnderstanding.locateElement(priorObservation, action.selector);
        if (located.ambiguous) {
          isAmbiguous = true;
          ambiguityCandidates = located.candidates;
          throw new Error(`Target ambiguity detected: Multiple elements matched selector '${action.selector.text || action.selector.role}' with high confidence. Execution paused to avoid mis-click.`);
        } else if (located.confidence >= (action.selector.minConfidence || 0.6) && located.centerPoint) {
          targetPoint = located.centerPoint;
        } else if (!action.parameters?.fallbackCoordinates) {
          throw new Error(`Unable to locate UI element matching selector '${action.selector.text || action.selector.role}' (confidence: ${located.confidence}).`);
        }
      }

      if (isDryRun) {
        // DRY-RUN PREVIEW MODE: Do not dispatch physical input
        eventBus.logActivity('PROCESSING', `[DRY-RUN PREVIEW] Action: ${action.type} -> Target: ${action.target || action.selector?.text || 'Screen'}`);
      } else {
        switch (action.type) {
          case 'OBSERVE_SCREEN':
          case 'TAKE_SCREENSHOT':
            // Pure read action
            break;

          case 'FOCUS_WINDOW':
            if (action.target) {
              await this.windowManager.focusWindow(action.target);
            }
            break;

          case 'OPEN_APP':
            if (action.parameters?.appName) {
              const rawApp = action.parameters.appName.trim();
              // BLOCKER-02 Security Allowlist & Sanitization
              const ALLOWED_APPS = new Map<string, string>([
                ['notepad', 'notepad.exe'],
                ['chrome', 'chrome.exe'],
                ['code', 'code.cmd'],
                ['explorer', 'explorer.exe'],
                ['calc', 'calc.exe']
              ]);
              const baseName = rawApp.toLowerCase().replace(/\.exe$/, '');
              const sanitizedExe = ALLOWED_APPS.get(baseName);
              if (!sanitizedExe) {
                throw new Error(`[SECURITY BLOCKED] Disallowed or unregistered application: '${rawApp}'. Application launch must be in authorized whitelist.`);
              }
              if (process.platform === 'win32' && !this.inputControl.getDriver().constructor.name.includes('Mock')) {
                try {
                  const args = action.parameters.path ? [action.parameters.path] : [];
                  await ProcessSupervisor.getInstance().runManagedCommand(sanitizedExe, args, { detached: true }, 5000);
                  await new Promise(r => setTimeout(r, 600));
                  await this.windowManager.focusWindow(sanitizedExe);
                } catch (e: any) {
                  // Ignore launch errors if process already started
                }
              }
            }
            break;

          case 'CLOSE_WINDOW':
            if (action.target) {
              await this.windowManager.closeWindow(action.target);
            }
            break;

          case 'MINIMIZE_WINDOW':
            if (action.target) {
              await this.windowManager.minimizeWindow(action.target);
            }
            break;

          case 'MAXIMIZE_WINDOW':
            if (action.target) {
              await this.windowManager.maximizeWindow(action.target);
            }
            break;

          case 'MOUSE_MOVE':
            const moveX = targetPoint ? targetPoint.x : action.parameters?.x || 960;
            const moveY = targetPoint ? targetPoint.y : action.parameters?.y || 540;
            await this.inputControl.moveCursor(moveX, moveY);
            break;

          case 'MOUSE_CLICK':
            const clickX = targetPoint ? targetPoint.x : action.parameters?.x;
            const clickY = targetPoint ? targetPoint.y : action.parameters?.y;
            await this.inputControl.click(clickX, clickY, action.parameters?.button || 'left');
            break;

          case 'MOUSE_DOUBLE_CLICK':
            const dX = targetPoint ? targetPoint.x : action.parameters?.x;
            const dY = targetPoint ? targetPoint.y : action.parameters?.y;
            await this.inputControl.doubleClick(dX, dY);
            break;

          case 'MOUSE_RIGHT_CLICK':
            const rX = targetPoint ? targetPoint.x : action.parameters?.x;
            const rY = targetPoint ? targetPoint.y : action.parameters?.y;
            await this.inputControl.rightClick(rX, rY);
            break;

          case 'SCROLL':
            await this.inputControl.scroll(action.parameters?.amount || -3);
            break;

          case 'DRAG':
            if (action.parameters?.from && action.parameters?.to) {
              await this.inputControl.drag(action.parameters.from, action.parameters.to);
            }
            break;

          case 'KEYBOARD_INPUT':
            if (action.parameters?.text) {
              await this.inputControl.type(action.parameters.text);
            }
            break;

          case 'PRESS_KEY':
          case 'KEY_DOWN':
            if (action.parameters?.key) {
              await this.inputControl.pressKey(action.parameters.key);
            }
            break;

          case 'HOTKEY':
            if (action.parameters?.keys) {
              await this.inputControl.hotkey(action.parameters.keys);
            }
            break;

          case 'WAIT':
            await new Promise(r => setTimeout(r, action.parameters?.ms || 500));
            break;

          default:
            break;
        }
      }
    } catch (err: any) {
      execSuccess = false;
      execError = err.message || 'Error executing action';
    }

    // 4. Post-Action Screen Observation
    const postObservation = await this.screenUnderstanding.captureObservation();

    // 5. Verification Phase (In dry run, always simulated as verified if preconditions met)
    const verification = isDryRun
      ? { verified: true, confidence: 0.95 }
      : await this.verifier.verifyExecution(action, priorObservation, postObservation);

    if (!execSuccess || !verification.verified) {
      // 6. Recovery Strategy
      const recoveryPlan = await this.recoveryService.formulateRecovery(
        action,
        execError || verification.reason || 'Verification failure',
        0,
        postObservation
      );

      if (recoveryPlan.shouldRetry && recoveryPlan.recoveryActions.length > 0) {
        for (const recAct of recoveryPlan.recoveryActions) {
          const recRes = await this.executeAction(recAct, taskId);
          if (recRes.success && recRes.postconditionsVerified) {
            return {
              actionId: action.id,
              success: true,
              preconditionsMet: true,
              postconditionsVerified: true,
              observedState: postObservation,
              recovered: true,
              recoveryAttempts: 1,
              timestamp: Date.now(),
              executionTimeMs: Date.now() - startTime
            };
          }
        }
      }

      return {
        actionId: action.id,
        success: false,
        preconditionsMet: true,
        postconditionsVerified: false,
        observedState: postObservation,
        error: execError || verification.reason || 'Execution or verification failed',
        ambiguityDetected: isAmbiguous,
        ambiguityCandidates,
        isDryRun,
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }

    return {
      actionId: action.id,
      success: true,
      preconditionsMet: true,
      postconditionsVerified: true,
      observedState: postObservation,
      isDryRun,
      timestamp: Date.now(),
      executionTimeMs: Date.now() - startTime
    };
  }
}
