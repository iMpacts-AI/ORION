import {
  ComputerObservation,
  ComputerTaskPlan,
  ComputerAction,
  ActionResult,
  ElementTargetSelector
} from '../../../shared/types/action';
import { ScreenCaptureService } from './ScreenCaptureService';
import { ScreenUnderstandingService } from './ScreenUnderstandingService';
import { InputControlService, IInputDriver, MockInputDriver } from './InputControlService';
import { WindowManagerService } from './WindowManagerService';
import { MockWindowProvider } from '../../platform/WindowProvider';
import { ComputerPermissionService } from './ComputerPermissionService';
import { ComputerActionPlanner } from './ComputerActionPlanner';
import { ComputerActionExecutor } from './ComputerActionExecutor';
import { ComputerActionVerifier } from './ComputerActionVerifier';
import { ComputerRecoveryService } from './ComputerRecoveryService';
import { ProcessSupervisor } from './ProcessSupervisor';
import { eventBus } from '../../../shared/events';

export class ComputerUseService {
  private screenCapture: ScreenCaptureService;
  private screenUnderstanding: ScreenUnderstandingService;
  private inputControl: InputControlService;
  private windowManager: WindowManagerService;
  private permissionService: ComputerPermissionService;
  private planner: ComputerActionPlanner;
  private executor: ComputerActionExecutor;
  private verifier: ComputerActionVerifier;
  private recoveryService: ComputerRecoveryService;
  private activePlan?: ComputerTaskPlan;

  constructor(customDriver?: IInputDriver, aiProvider?: import('../AIProvider').IAIProvider) {
    const isMock = Boolean(customDriver instanceof MockInputDriver);
    this.screenCapture = new ScreenCaptureService();
    this.windowManager = new WindowManagerService(isMock ? new MockWindowProvider() : undefined);
    this.inputControl = new InputControlService(customDriver);
    this.screenUnderstanding = new ScreenUnderstandingService(this.screenCapture, this.windowManager, isMock);
    this.permissionService = new ComputerPermissionService();
    this.verifier = new ComputerActionVerifier();
    this.recoveryService = new ComputerRecoveryService(this.windowManager, this.screenUnderstanding, this.inputControl);
    this.planner = new ComputerActionPlanner(undefined, aiProvider);
    this.executor = new ComputerActionExecutor(
      this.screenUnderstanding,
      this.inputControl,
      this.windowManager,
      this.permissionService,
      this.verifier,
      this.recoveryService,
      this.planner
    );
  }

  public getStateStore() {
    return this.executor.getStateStore();
  }

  public getScreenUnderstanding(): ScreenUnderstandingService {
    return this.screenUnderstanding;
  }

  public getInputControl(): InputControlService {
    return this.inputControl;
  }

  public getWindowManager(): WindowManagerService {
    return this.windowManager;
  }

  public getPermissionService(): ComputerPermissionService {
    return this.permissionService;
  }

  public getPlanner(): ComputerActionPlanner {
    return this.planner;
  }

  public getExecutor(): ComputerActionExecutor {
    return this.executor;
  }

  public async observeScreen(): Promise<ComputerObservation> {
    return await this.screenUnderstanding.captureObservation();
  }

  public async planTask(naturalLanguageCommand: string, options?: { isDryRun?: boolean }): Promise<ComputerTaskPlan> {
    const plan = await this.planner.planTask(naturalLanguageCommand, options);
    this.activePlan = plan;
    return plan;
  }

  public async executePlan(
    plan: ComputerTaskPlan,
    onProgress?: (plan: ComputerTaskPlan) => void
  ): Promise<ComputerTaskPlan> {
    this.activePlan = plan;
    eventBus.logActivity('PROCESSING', `Starting Computer-Use Plan Execution (${plan.isDryRun ? 'DRY-RUN' : 'LIVE'}): "${plan.naturalLanguageCommand}"`);
    const finalPlan = await this.executor.executePlan(plan, onProgress);
    eventBus.logActivity(
      finalPlan.status === 'COMPLETED' ? 'TASK_COMPLETE' : 'ERROR_EVENT',
      `Computer-Use Plan Status: ${finalPlan.status}`
    );
    return finalPlan;
  }

  public async executeSingleAction(action: ComputerAction, isDryRun?: boolean): Promise<ActionResult> {
    return await this.executor.executeAction(action, 'task_standalone', isDryRun);
  }

  public async executeNaturalLanguageCommand(
    command: string,
    onProgress?: (plan: ComputerTaskPlan) => void,
    options?: { isDryRun?: boolean }
  ): Promise<ComputerTaskPlan> {
    const plan = await this.planTask(command, options);
    if (plan.requiresUserApproval && !options?.isDryRun) {
      plan.status = 'AWAITING_APPROVAL';
      if (onProgress) onProgress(plan);
      return plan;
    }
    return await this.executePlan(plan, onProgress);
  }

  public cancelActiveTask(reason: string = 'User cancelled task'): boolean {
    if (this.activePlan) {
      this.activePlan.cancellationState = {
        isCancelled: true,
        reason,
        cancelledAt: Date.now()
      };
      this.activePlan.status = 'CANCELLED';
      eventBus.logActivity('SYSTEM_EVENT', `Task ${this.activePlan.taskId} cancellation signaled: ${reason}`);
      return true;
    }
    return false;
  }

  public async emergencyStop(): Promise<void> {
    this.permissionService.triggerEmergencyStop();
    await ProcessSupervisor.getInstance().triggerEstop();
    if (this.activePlan) {
      this.activePlan.status = 'ESTOPPED';
      this.activePlan.cancellationState = {
        isCancelled: true,
        reason: 'Emergency Stop Activated',
        cancelledAt: Date.now()
      };
    }
    eventBus.logActivity('ERROR_EVENT', 'COMPUTER-USE EMERGENCY STOP ACTIVATED: Process trees terminated.');
  }

  public isEmergencyStopped(): boolean {
    return this.permissionService.isEmergencyStopped();
  }

  public resetEmergencyStop(): void {
    this.permissionService.resetEmergencyStop();
    ProcessSupervisor.getInstance().resetEstop();
    eventBus.logActivity('SYSTEM_EVENT', 'Computer-Use Emergency Stop reset to normal operations.');
  }
}
