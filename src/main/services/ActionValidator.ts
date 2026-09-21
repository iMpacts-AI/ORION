import { ActionPreconditions, ActionPostconditions, ComputerObservation } from '../../shared/types/action';
import { EnvironmentState } from '../../shared/types/environment';
import fs from 'fs';
import path from 'path';

export class ActionValidator {
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
      if (!newObservation.activeWindow.processName.toLowerCase().includes(postconditions.verifyActiveApp.toLowerCase())) {
        return {
          verified: false,
          reason: `Postcondition Failed: Active app is '${newObservation.activeWindow.processName}', expected '${postconditions.verifyActiveApp}'.`
        };
      }
    }

    if (postconditions.verifyActiveWindow && newObservation) {
      const matchTitle = newObservation.activeWindow.title.toLowerCase().includes(postconditions.verifyActiveWindow.toLowerCase());
      const matchProc = newObservation.activeWindow.processName.toLowerCase().includes(postconditions.verifyActiveWindow.toLowerCase());
      if (!matchTitle && !matchProc) {
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
