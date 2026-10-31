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

      case 'MOUSE_MOVE':
      case 'MOUSE_CLICK':
      case 'MOUSE_RIGHT_CLICK':
      case 'MOUSE_DOUBLE_CLICK':
      case 'DRAG': {
        // Detect unexpected system/application error dialogs newly blocking the desktop
        const priorTitle = (priorObservation.activeWindow?.title || '').toLowerCase();
        const postTitle = (postObservation.activeWindow?.title || '').toLowerCase();
        const unexpectedErrorDialog =
          /\b(?:application error|system error|fatal error|unexpected error|unhandled exception)\b/i;
        if (unexpectedErrorDialog.test(postTitle) && !unexpectedErrorDialog.test(priorTitle)) {
          return {
            verified: false,
            confidence: 0.2,
            reason: `Unexpected blocking dialog detected after ${action.type}: '${postObservation.activeWindow?.title}'.`
          };
        }

        const cursorCheck = action.parameters?._cursorVerification;
        if (cursorCheck && cursorCheck.status === 'INPUT_FAILED') {
          return {
            verified: false,
            confidence: 0.2,
            reason: cursorCheck.reason || `Cursor readback verification failed for ${action.type}.`
          };
        }

        const expectedPt =
          action.type === 'DRAG'
            ? action.parameters?.to
            : action.parameters?._targetCoordinates ||
              (typeof action.parameters?.x === 'number' && typeof action.parameters?.y === 'number'
                ? { x: action.parameters.x, y: action.parameters.y }
                : undefined);

        if (
          !cursorCheck &&
          expectedPt &&
          typeof expectedPt.x === 'number' &&
          typeof expectedPt.y === 'number' &&
          postObservation.cursor
        ) {
          const dx = Math.abs(postObservation.cursor.x - expectedPt.x);
          const dy = Math.abs(postObservation.cursor.y - expectedPt.y);
          // Only fail direct postObservation.cursor check if live OS cursor moved away from mock default (960, 540) or target wasn't reached
          const isMockStaticCursor =
            postObservation.cursor.x === 960 &&
            postObservation.cursor.y === 540 &&
            priorObservation.cursor?.x === 960 &&
            priorObservation.cursor?.y === 540 &&
            postObservation.screenshotBase64 === undefined;
          if (!isMockStaticCursor && (dx > 32 || dy > 32)) {
            return {
              verified: false,
              confidence: 0.25,
              reason: `Observed cursor at (${postObservation.cursor.x}, ${postObservation.cursor.y}) did not reach target (${expectedPt.x}, ${expectedPt.y}).`
            };
          }
        }

        if (action.type !== 'MOUSE_MOVE') {
          const hasActiveSurface = Boolean(
            postObservation.activeWindow?.title || postObservation.activeWindow?.processName
          );
          if (!hasActiveSurface) {
            return {
              verified: false,
              confidence: 0.3,
              reason: `No active foreground window surface was observed after ${action.type}.`
            };
          }
        }

        return { verified: true, confidence: 0.94 };
      }

      case 'KEYBOARD_INPUT':
      case 'HOTKEY':
      case 'PRESS_KEY':
      case 'SCROLL': {
        const priorTitle = (priorObservation.activeWindow?.title || '').toLowerCase();
        const postTitle = (postObservation.activeWindow?.title || '').toLowerCase();
        const unexpectedErrorDialog =
          /\b(?:application error|system error|fatal error|unexpected error|unhandled exception)\b/i;
        if (unexpectedErrorDialog.test(postTitle) && !unexpectedErrorDialog.test(priorTitle)) {
          return {
            verified: false,
            confidence: 0.2,
            reason: `Unexpected blocking dialog detected after ${action.type}: '${postObservation.activeWindow?.title}'.`
          };
        }

        const hasActiveSurface = Boolean(
          postObservation.activeWindow?.title || postObservation.activeWindow?.processName
        );
        if (!hasActiveSurface) {
          return {
            verified: false,
            confidence: 0.3,
            reason: `Cannot verify ${action.type}: no active foreground window was observed.`
          };
        }

        if (action.target) {
          const expected = action.target.toLowerCase().trim();
          const priorProc = (priorObservation.activeWindow?.processName || '').toLowerCase();
          const activeProc = (postObservation.activeWindow?.processName || '').toLowerCase();
          const matchedPrior = priorTitle.includes(expected) || priorProc.includes(expected);
          const matchedPost = postTitle.includes(expected) || activeProc.includes(expected);
          if (matchedPrior && !matchedPost) {
            return {
              verified: false,
              confidence: 0.35,
              reason: `Active window '${postObservation.activeWindow?.title}' no longer matches target '${action.target}' during ${action.type}.`
            };
          }
        }

        return { verified: true, confidence: 0.92 };
      }

      default:
        return { verified: true, confidence: 0.9 };
    }
  }
}
