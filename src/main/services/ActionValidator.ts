import {
  ActionPreconditions,
  ActionPostconditions,
  ComputerAction,
  ComputerActionType,
  ComputerObservation
} from '../../shared/types/action';
import { EnvironmentState } from '../../shared/types/environment';
import fs from 'fs';
import path from 'path';

const VALID_COMPUTER_ACTION_TYPES = new Set<ComputerActionType>([
  'OBSERVE_SCREEN',
  'TAKE_SCREENSHOT',
  'FOCUS_WINDOW',
  'OPEN_APP',
  'CLOSE_WINDOW',
  'MINIMIZE_WINDOW',
  'MAXIMIZE_WINDOW',
  'RESTORE_WINDOW',
  'NAVIGATE_FILESYSTEM',
  'READ_FILE',
  'WRITE_FILE',
  'MOUSE_MOVE',
  'MOUSE_CLICK',
  'MOUSE_DOUBLE_CLICK',
  'MOUSE_RIGHT_CLICK',
  'MOUSE_DOWN',
  'MOUSE_UP',
  'SCROLL',
  'DRAG',
  'KEYBOARD_INPUT',
  'KEY_DOWN',
  'KEY_UP',
  'PRESS_KEY',
  'HOTKEY',
  'WAIT',
  'RECOVER_STATE'
]);

export class ActionValidator {
  /**
   * Schema Validation Gate: Validates typed ComputerAction structure and parameter bounds
   * before permission consumption or OS input execution.
   */
  public validateActionSchema(action: ComputerAction): { valid: boolean; reason?: string } {
    if (!action || typeof action !== 'object') {
      return { valid: false, reason: 'SCHEMA VALIDATION FAILED: Action must be a non-null object.' };
    }
    if (!action.id || typeof action.id !== 'string' || !action.id.trim()) {
      return { valid: false, reason: 'SCHEMA VALIDATION FAILED: Action "id" must be a non-empty string.' };
    }
    if (!action.type || !VALID_COMPUTER_ACTION_TYPES.has(action.type)) {
      return {
        valid: false,
        reason: `SCHEMA VALIDATION FAILED: Unsupported or invalid action type '${String((action as any).type)}'.`
      };
    }

    const params = action.parameters || {};
    const checkCoord = (val: unknown, label: string): string | null => {
      if (typeof val !== 'number' || !Number.isFinite(val) || val < -10000 || val > 20000) {
        return `SCHEMA VALIDATION FAILED: Parameter '${label}' must be a finite screen coordinate within [-10000, 20000].`;
      }
      return null;
    };

    switch (action.type) {
      case 'MOUSE_MOVE': {
        if (!action.selector) {
          if (params.x !== undefined) {
            const errX = checkCoord(params.x, 'x');
            if (errX) return { valid: false, reason: errX };
          }
          if (params.y !== undefined) {
            const errY = checkCoord(params.y, 'y');
            if (errY) return { valid: false, reason: errY };
          }
        }
        break;
      }
      case 'MOUSE_CLICK':
      case 'MOUSE_DOUBLE_CLICK':
      case 'MOUSE_RIGHT_CLICK': {
        if (params.x !== undefined) {
          const errX = checkCoord(params.x, 'x');
          if (errX) return { valid: false, reason: errX };
        }
        if (params.y !== undefined) {
          const errY = checkCoord(params.y, 'y');
          if (errY) return { valid: false, reason: errY };
        }
        if (
          params.button !== undefined &&
          !['left', 'right', 'middle'].includes(String(params.button))
        ) {
          return {
            valid: false,
            reason: `SCHEMA VALIDATION FAILED: Invalid mouse button '${String(params.button)}'.`
          };
        }
        break;
      }
      case 'DRAG': {
        const from = params.from;
        const to = params.to;
        if (!from || !to || typeof from !== 'object' || typeof to !== 'object') {
          return {
            valid: false,
            reason: 'SCHEMA VALIDATION FAILED: DRAG requires "from" and "to" ScreenPoint objects.'
          };
        }
        const e1 = checkCoord(from.x, 'from.x') || checkCoord(from.y, 'from.y');
        if (e1) return { valid: false, reason: e1 };
        const e2 = checkCoord(to.x, 'to.x') || checkCoord(to.y, 'to.y');
        if (e2) return { valid: false, reason: e2 };
        break;
      }
      case 'SCROLL': {
        if (params.amount !== undefined && (typeof params.amount !== 'number' || !Number.isFinite(params.amount))) {
          return {
            valid: false,
            reason: 'SCHEMA VALIDATION FAILED: SCROLL "amount" must be a finite number.'
          };
        }
        break;
      }
      case 'KEYBOARD_INPUT': {
        if (typeof params.text !== 'string') {
          return {
            valid: false,
            reason: 'SCHEMA VALIDATION FAILED: KEYBOARD_INPUT requires a string "text" parameter.'
          };
        }
        break;
      }
      case 'PRESS_KEY':
      case 'KEY_DOWN':
      case 'KEY_UP': {
        if (typeof params.key !== 'string' || !params.key.trim()) {
          return {
            valid: false,
            reason: `SCHEMA VALIDATION FAILED: ${action.type} requires a non-empty string "key" parameter.`
          };
        }
        break;
      }
      case 'HOTKEY': {
        if (!Array.isArray(params.keys) || params.keys.length === 0 || params.keys.some((k: any) => typeof k !== 'string' || !k.trim())) {
          return {
            valid: false,
            reason: 'SCHEMA VALIDATION FAILED: HOTKEY requires a non-empty string[] "keys" parameter.'
          };
        }
        break;
      }
      default:
        break;
    }

    return { valid: true };
  }
  /**
   * Precondition Check: Ensures desktop environment matches expectations before executing action.
   */
  public async validatePreconditions(
    preconditions?: ActionPreconditions,
    currentEnv?: EnvironmentState,
    observation?: ComputerObservation
  ): Promise<{ valid: boolean; reason?: string }> {
    if (!preconditions) return { valid: true };

    if (preconditions.expectedActiveApp && currentEnv?.activeApp) {
      if (currentEnv.activeApp.toLowerCase() !== preconditions.expectedActiveApp.toLowerCase()) {
        return {
          valid: false,
          reason: `Precondition Failed: Active app is '${currentEnv.activeApp}', expected '${preconditions.expectedActiveApp}'.`
        };
      }
    }

    if (preconditions.expectedActiveWindow) {
      const currentTitle = currentEnv?.activeWindow?.title || observation?.activeWindow?.title || '';
      if (!currentTitle.toLowerCase().includes(preconditions.expectedActiveWindow.toLowerCase())) {
        return {
          valid: false,
          reason: `Precondition Failed: Active window title is '${currentTitle}', expected to contain '${preconditions.expectedActiveWindow}'.`
        };
      }
    }

    if (preconditions.requiredFilePath) {
      const resolved = path.resolve(preconditions.requiredFilePath);
      if (!fs.existsSync(resolved)) {
        return {
          valid: false,
          reason: `Precondition Failed: Required path does not exist at '${resolved}'.`
        };
      }
    }

    if (preconditions.requiredElement && observation) {
      const match = observation.interactiveElements.find(el => {
        if (preconditions.requiredElement?.text && !el.text.toLowerCase().includes(preconditions.requiredElement.text.toLowerCase())) return false;
        if (preconditions.requiredElement?.role && el.role !== preconditions.requiredElement.role) return false;
        return true;
      });

      if (!match) {
        return {
          valid: false,
          reason: `Precondition Failed: Required UI element '${preconditions.requiredElement.text || preconditions.requiredElement.role}' not visible on screen.`
        };
      }
    }

    return { valid: true };
  }

  /**
   * Postcondition Check: Verification Engine assertion check to confirm action actually mutated state.
   */
  public async verifyPostconditions(
    postconditions?: ActionPostconditions,
    newObservation?: ComputerObservation
  ): Promise<{ verified: boolean; reason?: string }> {
    if (!postconditions) return { verified: true };

    if (postconditions.verifyFileExists) {
      const resolved = path.resolve(postconditions.verifyFileExists);
      if (!fs.existsSync(resolved)) {
        return {
          verified: false,
          reason: `Postcondition Verification Failed: Target file '${resolved}' was not created.`
        };
      }
      if (postconditions.verifyMinFileSize !== undefined) {
        const stat = fs.statSync(resolved);
        if (stat.size < postconditions.verifyMinFileSize) {
          return {
            verified: false,
            reason: `Postcondition Verification Failed: File size (${stat.size} bytes) below minimum expected (${postconditions.verifyMinFileSize} bytes).`
          };
        }
      }
    }

    if (postconditions.verifyActiveApp && newObservation) {
      const expected = postconditions.verifyActiveApp.toLowerCase();
      const activeMatch =
        newObservation.activeWindow.processName.toLowerCase().includes(expected) ||
        newObservation.activeWindow.title.toLowerCase().includes(expected);
      const visibleMatch = Array.isArray((newObservation as any).visibleWindows)
        ? (newObservation as any).visibleWindows.some(
            (w: any) =>
              (w?.processName || '').toLowerCase().includes(expected) ||
              (w?.title || '').toLowerCase().includes(expected)
          )
        : false;
      if (!activeMatch && !visibleMatch) {
        return {
          verified: false,
          reason: `Postcondition Failed: Active app is '${newObservation.activeWindow.processName}', expected '${postconditions.verifyActiveApp}'.`
        };
      }
    }

    if (postconditions.verifyActiveWindow && newObservation) {
      const expected = postconditions.verifyActiveWindow.toLowerCase();
      const matchTitle = newObservation.activeWindow.title.toLowerCase().includes(expected);
      const matchProc = newObservation.activeWindow.processName.toLowerCase().includes(expected);
      const visibleMatch = Array.isArray((newObservation as any).visibleWindows)
        ? (newObservation as any).visibleWindows.some(
            (w: any) =>
              (w?.processName || '').toLowerCase().includes(expected) ||
              (w?.title || '').toLowerCase().includes(expected)
          )
        : false;
      if (!matchTitle && !matchProc && !visibleMatch) {
        return {
          verified: false,
          reason: `Postcondition Failed: Active window title is '${newObservation.activeWindow.title}', expected to contain '${postconditions.verifyActiveWindow}'.`
        };
      }
    }

    if (postconditions.verifyTextVisible && newObservation) {
      const textFound = newObservation.visibleText.some(t => t.toLowerCase().includes(postconditions.verifyTextVisible!.toLowerCase())) ||
        newObservation.interactiveElements.some(el => el.text.toLowerCase().includes(postconditions.verifyTextVisible!.toLowerCase()));

      if (!textFound) {
        return {
          verified: false,
          reason: `Postcondition Failed: Expected text '${postconditions.verifyTextVisible}' is not visible on screen.`
        };
      }
    }

    if (postconditions.verifyElementDisappeared && newObservation) {
      const elStillPresent = newObservation.interactiveElements.some(el => {
        if (postconditions.verifyElementDisappeared?.text && el.text.toLowerCase().includes(postconditions.verifyElementDisappeared.text.toLowerCase())) return true;
        return false;
      });

      if (elStillPresent) {
        return {
          verified: false,
          reason: `Postcondition Failed: Element '${postconditions.verifyElementDisappeared.text}' is still visible on screen.`
        };
      }
    }

    return { verified: true };
  }
}
