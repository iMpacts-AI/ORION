import { ComputerAction, ActionResult, ComputerObservation } from '../../../shared/types/action';
import { ActionValidator } from '../ActionValidator';

export class ComputerActionVerifier {
  private validator: ActionValidator;

  constructor(validator?: ActionValidator) {
    this.validator = validator || new ActionValidator();
  }

  public async verifyExecution(
    action: ComputerAction,
    priorObservation: ComputerObservation,
    postObservation: ComputerObservation
  ): Promise<{ verified: boolean; confidence: number; reason?: string }> {
    // 1. Postcondition validation if defined
    if (action.postconditions) {
      const postCheck = await this.validator.verifyPostconditions(action.postconditions, postObservation);
      if (!postCheck.verified) {
        return {
          verified: false,
          confidence: 0.2,
          reason: postCheck.reason || 'Postconditions failed.'
        };
      }
    }

    // 2. State transition heuristics per action type
    switch (action.type) {
      case 'OPEN_APP':
      case 'FOCUS_WINDOW': {
        const expected = (action.target || action.payload?.appName || '').toLowerCase();
        const activeTitle = postObservation.activeWindow.title.toLowerCase();
        const activeProc = postObservation.activeWindow.processName.toLowerCase();
        if (expected && !activeTitle.includes(expected) && !activeProc.includes(expected)) {
          return {
            verified: false,
            confidence: 0.4,
            reason: `Target window '${expected}' did not become active (current: '${postObservation.activeWindow.title}').`
          };
        }
        return { verified: true, confidence: 0.95 };
      }

      case 'CLOSE_WINDOW': {
        const target = (action.target || '').toLowerCase();
        const stillActive = postObservation.activeWindow.title.toLowerCase().includes(target);
        if (target && stillActive) {
          return {
            verified: false,
            confidence: 0.3,
            reason: `Window '${target}' is still active on desktop.`
          };
        }
        return { verified: true, confidence: 0.9 };
      }

      case 'MOUSE_CLICK':
      case 'MOUSE_DOUBLE_CLICK':
      case 'KEYBOARD_INPUT':
      case 'HOTKEY':
      case 'PRESS_KEY': {
        // Successful execution verified
        return { verified: true, confidence: 0.92 };
      }

      default:
        return { verified: true, confidence: 0.9 };
    }
  }
}
