import { ComputerAction, ComputerObservation } from '../../../shared/types/action';
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
        const rawExpected = String(
          action.target ||
          action.payload?.appName ||
          action.parameters?.appName ||
          action.parameters?.title ||
          ''
        )
          .toLowerCase()
          .replace(/\.exe$/i, '')
          .trim();

        const resolvedDisplay = String(action.parameters?._resolvedDisplayName || '')
          .toLowerCase()
          .trim();
        const resolvedProcs: string[] = Array.isArray(action.parameters?._resolvedProcessNames)
          ? action.parameters!._resolvedProcessNames.map((p: any) =>
              String(p || '').toLowerCase().replace(/\.exe$/i, '').trim()
            )
          : [];

        const candidates = Array.from(
          new Set([rawExpected, resolvedDisplay, ...resolvedProcs].filter(Boolean))
        );

        const activeTitle = (postObservation.activeWindow?.title || '').toLowerCase();
        const activeProc = (postObservation.activeWindow?.processName || '')
          .toLowerCase()
          .replace(/\.exe$/i, '');

        const matchesActive =
          candidates.length === 0 ||
          candidates.some(
            c =>
              activeTitle.includes(c) ||
              activeProc.includes(c) ||
              (c.length >= 3 && activeProc === c)
          );

        const visibleMatch =
          candidates.length > 0 && Array.isArray((postObservation as any).visibleWindows)
            ? (postObservation as any).visibleWindows.some((w: any) => {
                const wTitle = (w?.title || '').toLowerCase();
                const wProc = (w?.processName || '').toLowerCase().replace(/\.exe$/i, '');
                return candidates.some(c => wTitle.includes(c) || wProc.includes(c));
              })
            : false;

        if (!matchesActive && !(action.type === 'OPEN_APP' && visibleMatch)) {
          return {
            verified: false,
            confidence: 0.4,
            reason: `Target window '${resolvedDisplay || rawExpected}' did not become active or visible (current: '${postObservation.activeWindow?.title || 'Unknown'}').`
          };
        }
        return { verified: true, confidence: 0.95 };
      }

      case 'CLOSE_WINDOW': {
        const target = String(action.target || action.parameters?.title || '').toLowerCase().trim();
        const stillActive = target && (postObservation.activeWindow?.title || '').toLowerCase().includes(target);
        if (stillActive) {
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
        return { verified: true, confidence: 0.92 };
      }

      default:
        return { verified: true, confidence: 0.9 };
    }
  }
}
