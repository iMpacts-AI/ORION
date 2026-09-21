import { ComputerAction, ComputerObservation } from '../../../shared/types/action';
import { WindowManagerService } from './WindowManagerService';
import { ScreenUnderstandingService } from './ScreenUnderstandingService';
import { InputControlService } from './InputControlService';

export interface RecoveryPlan {
  shouldRetry: boolean;
  recoveryActions: ComputerAction[];
  reason: string;
}

export class ComputerRecoveryService {
  private windowManager: WindowManagerService;
  private screenUnderstanding: ScreenUnderstandingService;
  private inputControl: InputControlService;
  private maxRecoveryAttempts: number = 2;

  constructor(
    windowManager?: WindowManagerService,
    screenUnderstanding?: ScreenUnderstandingService,
    inputControl?: InputControlService
  ) {
    this.windowManager = windowManager || new WindowManagerService();
    this.screenUnderstanding = screenUnderstanding || new ScreenUnderstandingService();
    this.inputControl = inputControl || new InputControlService();
  }

  public async formulateRecovery(
    failedAction: ComputerAction,
    failureReason: string,
    currentAttempt: number,
    observation: ComputerObservation
  ): Promise<RecoveryPlan> {
    if (currentAttempt >= this.maxRecoveryAttempts) {
      return {
        shouldRetry: false,
        recoveryActions: [],
        reason: `Maximum recovery limit (${this.maxRecoveryAttempts}) reached for action '${failedAction.type}'. Halting execution.`
      };
    }

    const recoveryActions: ComputerAction[] = [];

    // Strategy 1: If element was not found, re-observe or re-focus target window
    if (failedAction.selector || failedAction.type === 'MOUSE_CLICK') {
      if (failedAction.selector?.windowTitle || failedAction.selector?.application) {
        recoveryActions.push({
          id: `rec_focus_${Date.now()}`,
          type: 'FOCUS_WINDOW',
          target: failedAction.selector.windowTitle || failedAction.selector.application,
          confidence: 0.9,
          riskLevel: 'LOW_RISK',
          reason: 'Recovery Strategy 1: Re-focus target application window.'
        });
      }

      // Strategy 2: Dismiss unexpected modal dialog by pressing Escape
      recoveryActions.push({
        id: `rec_esc_${Date.now()}`,
        type: 'PRESS_KEY',
        parameters: { key: 'escape' },
        confidence: 0.85,
        riskLevel: 'MODERATE_RISK',
        reason: 'Recovery Strategy 2: Dismiss unexpected overlay or modal with Escape key.'
      });

      // Strategy 3: Re-try original action with re-observed element
      // If the action failed due to unlocatable selector and has no application context, recovery cannot succeed blindly
      if (failureReason.toLowerCase().includes('unable to locate') && !failedAction.selector?.windowTitle) {
        return {
          shouldRetry: false,
          recoveryActions: [],
          reason: `No recovery possible for unlocatable selector '${failedAction.selector?.text || failedAction.selector?.role}'. Halting execution.`
        };
      }

      recoveryActions.push({
        ...failedAction,
        id: `rec_retry_${failedAction.id}_${currentAttempt + 1}`,
        reason: `Recovery Strategy 3: Bounded retry attempt ${currentAttempt + 1}.`
      });

      return {
        shouldRetry: true,
        recoveryActions,
        reason: `Generated ${recoveryActions.length} recovery step(s) for failed action.`
      };
    }

    return {
      shouldRetry: false,
      recoveryActions: [],
      reason: `No automatic recovery strategy available for '${failedAction.type}': ${failureReason}`
    };
  }
}
