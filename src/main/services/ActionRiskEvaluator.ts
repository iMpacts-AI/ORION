import * as fs from 'fs';
import * as path from 'path';
import { ComputerActionType, ActionRiskLevel } from '../../shared/types/action';

export type ToolEffectCategory =
  | 'READ_ONLY'
  | 'LOCAL_REVERSIBLE_MODIFICATION'
  | 'EXTERNAL_SIDE_EFFECT'
  | 'DESTRUCTIVE_OR_SENSITIVE'
  | 'UNKNOWN_OR_UNSUPPORTED';

export class ActionRiskEvaluator {
  /**
   * Classifies a registered tool's actual side-effect category and maps it to an
   * authoritative ComputerActionType for risk evaluation (eliminating the legacy 'WAIT' fallback).
   */
  public classifyToolEffect(
    toolId: string,
    tool?: { permissionLevel?: string; isReadOnly?: boolean; requiresApproval?: boolean; isDangerous?: boolean } | null,
    args?: Record<string, any> | null
  ): { category: ToolEffectCategory; mappedActionType: ComputerActionType } {
    if (!toolId || typeof toolId !== 'string') {
      return { category: 'UNKNOWN_OR_UNSUPPORTED', mappedActionType: 'UNKNOWN_ACTION' as any };
    }

    const nestedAction = args?.action;
    if (toolId === 'computer.execute_action') {
      if (nestedAction && typeof nestedAction === 'object' && typeof nestedAction.type === 'string' && nestedAction.type.trim()) {
        const t = nestedAction.type.trim() as ComputerActionType;
        const isRead = ['OBSERVE_SCREEN', 'TAKE_SCREENSHOT', 'READ_FILE', 'NAVIGATE_FILESYSTEM', 'WAIT'].includes(t);
        return {
          category: isRead ? 'READ_ONLY' : t === 'WRITE_FILE' ? 'DESTRUCTIVE_OR_SENSITIVE' : 'EXTERNAL_SIDE_EFFECT',
          mappedActionType: t
        };
      }
      return { category: 'UNKNOWN_OR_UNSUPPORTED', mappedActionType: 'UNKNOWN_ACTION' as any };
    }

    if (toolId === 'file.write_text') {
      return { category: 'LOCAL_REVERSIBLE_MODIFICATION', mappedActionType: 'WRITE_FILE' };
    }
    if (toolId === 'file.read_text') {
      return { category: 'READ_ONLY', mappedActionType: 'READ_FILE' };
    }
    if (toolId === 'file.list_directory') {
      return { category: 'READ_ONLY', mappedActionType: 'NAVIGATE_FILESYSTEM' };
    }
    if (toolId === 'computer.observe') {
      return { category: 'READ_ONLY', mappedActionType: 'OBSERVE_SCREEN' };
    }
    if (toolId === 'computer.plan_task') {
      return { category: 'READ_ONLY', mappedActionType: 'WAIT' };
    }
    if (toolId === 'computer.natural_language_command') {
      return { category: 'EXTERNAL_SIDE_EFFECT', mappedActionType: 'OPEN_APP' };
    }
    if (toolId === 'browser.click') {
      return { category: 'EXTERNAL_SIDE_EFFECT', mappedActionType: 'MOUSE_CLICK' };
    }
    if (toolId === 'browser.type') {
      return { category: 'EXTERNAL_SIDE_EFFECT', mappedActionType: 'KEYBOARD_INPUT' };
    }
    if (toolId === 'browser.navigate' || toolId === 'browser.search' || toolId === 'info.weather' || toolId === 'info.prayers') {
      return { category: 'READ_ONLY', mappedActionType: 'READ_FILE' };
    }
    if (toolId === 'system.control' && args?.action === 'lock') {
      return { category: 'DESTRUCTIVE_OR_SENSITIVE', mappedActionType: 'UNKNOWN_ACTION' as any };
    }

    if (!tool) {
      return { category: 'UNKNOWN_OR_UNSUPPORTED', mappedActionType: 'UNKNOWN_ACTION' as any };
    }

    if (tool.permissionLevel === 'CRITICAL' || tool.permissionLevel === 'HIGH' || tool.requiresApproval || tool.isDangerous) {
      return { category: 'DESTRUCTIVE_OR_SENSITIVE', mappedActionType: 'UNKNOWN_ACTION' as any };
    }

    if (tool.isReadOnly === true) {
      return { category: 'READ_ONLY', mappedActionType: 'READ_FILE' };
    }

    return { category: 'EXTERNAL_SIDE_EFFECT', mappedActionType: 'OPEN_APP' };
  }

  /**
   * Normalizes a ComputerAction or raw payload object into a unified parameter map
   * so permission checks inspect payload, parameters, and top-level target consistently.
   */
  public normalizeActionPayload(
    payloadOrAction?: Record<string, any> | null,
    parameters?: Record<string, any> | null,
    topLevelTarget?: string
  ): Record<string, any> {
    const safePayload = payloadOrAction && typeof payloadOrAction === 'object' ? payloadOrAction : {};
    const safeParams = parameters && typeof parameters === 'object' ? parameters : {};
    const merged: Record<string, any> = {
      ...safeParams,
      ...safePayload
    };
    if (topLevelTarget && !merged.target && !merged.filePath && !merged.path) {
      merged.target = topLevelTarget;
    }
    return merged;
  }

  /**
   * Detects conflicting non-empty target fields between `payload`, `parameters`, `topLevelTarget`,
   * and nested `action` objects, including cross-key path conflicts (e.g. `payload.filePath` vs `parameters.path`).
   * Prevents parameter-shadowing attacks where e.g. `payload.filePath = "safe.txt"` masks
   * `parameters.path = "C:\\Windows\\System32\\evil.dll"`.
   */
  public hasConflictingTargets(
    payloadOrAction?: Record<string, any> | null,
    parameters?: Record<string, any> | null,
    topLevelTarget?: string
  ): boolean {
    const safePayload = payloadOrAction && typeof payloadOrAction === 'object' ? payloadOrAction : {};
    const safeParams = parameters && typeof parameters === 'object' ? parameters : {};
    const targetKeys = ['filePath', 'path', 'dirPath', 'target', 'command', 'appName', 'url', 'selector'];

    for (const key of targetKeys) {
      const pVal = typeof safePayload[key] === 'string' ? safePayload[key].trim() : '';
      const paramVal = typeof safeParams[key] === 'string' ? safeParams[key].trim() : '';
      if (pVal && paramVal && pVal.toLowerCase() !== paramVal.toLowerCase()) {
        return true;
      }
    }

    // Collect all non-empty path-like values across payload, parameters, topLevelTarget, and nested action objects
    const pathKeys = ['filePath', 'path', 'dirPath', 'target'];
    const distinctPathValues = new Set<string>();
    const collectPathValues = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      for (const k of pathKeys) {
        if (typeof obj[k] === 'string' && obj[k].trim().length > 0) {
          distinctPathValues.add(obj[k].trim().toLowerCase());
        }
      }
      if (obj.action && typeof obj.action === 'object') {
        if (typeof obj.action.target === 'string' && obj.action.target.trim().length > 0) {
          distinctPathValues.add(obj.action.target.trim().toLowerCase());
        }
        collectPathValues(obj.action.payload);
        collectPathValues(obj.action.parameters);
      }
    };

    collectPathValues(safePayload);
    collectPathValues(safeParams);
    if (typeof topLevelTarget === 'string' && topLevelTarget.trim().length > 0) {
      distinctPathValues.add(topLevelTarget.trim().toLowerCase());
    }

    if (distinctPathValues.size > 1) {
      return true;
    }

    return false;
  }

  /**
   * Extracts all candidate target strings from payload, parameters, and topLevelTarget
   * without allowing one object to overwrite or mask another.
   */
  private extractAllTargetCandidates(
    payload?: Record<string, any> | null,
    parameters?: Record<string, any> | null,
    topLevelTarget?: string
  ): string[] {
    const candidates: string[] = [];
    const collectFromObj = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      const fields = [
        obj.filePath,
        obj.target,
        obj.path,
        obj.dirPath,
        obj.command,
        obj.text,
        obj.appName,
        obj.url,
        obj.selector
      ];
      for (const f of fields) {
        if (typeof f === 'string' && f.trim().length > 0) {
          candidates.push(f.trim());
        }
      }
      if (obj.action && typeof obj.action === 'object') {
        collectFromObj(obj.action.payload);
        collectFromObj(obj.action.parameters);
        if (typeof obj.action.target === 'string' && obj.action.target.trim().length > 0) {
          candidates.push(obj.action.target.trim());
        }
      }
    };

    collectFromObj(payload);
    collectFromObj(parameters);
    if (typeof topLevelTarget === 'string' && topLevelTarget.trim().length > 0) {
      candidates.push(topLevelTarget.trim());
    }
    return candidates;
  }

  /**
   * Runtime Authoritative Risk Rating Calculation Engine
   * Independent of LLM reasoning.
   */
  public evaluateRisk(
    actionType: ComputerActionType,
    payload?: Record<string, any> | null,
    parameters?: Record<string, any> | null,
    topLevelTarget?: string
  ): ActionRiskLevel {
    if (!actionType || typeof actionType !== 'string') {
      return 'CRITICAL';
    }

    // 0. Conflicting target fields between payload and parameters -> fail closed as CRITICAL
    if (this.hasConflictingTargets(payload, parameters, topLevelTarget)) {
      return 'CRITICAL';
    }

    const merged = this.normalizeActionPayload(payload, parameters, topLevelTarget);

    // 1. Strict Protection of Project Titan Protected 4K Masters, System Directories, and Sensitive Credentials/Dotfiles
    // Inspect ALL candidate strings from both payload and parameters independently
    const targetCandidates = this.extractAllTargetCandidates(payload, parameters, topLevelTarget);

    for (const rawTargetPath of targetCandidates) {
      let decodedTarget = rawTargetPath;
      if (rawTargetPath.includes('%')) {
        try {
          decodedTarget = decodeURIComponent(rawTargetPath);
        } catch {}
      }
      const targetPath = decodedTarget;
      let resolvedLower = '';
      let realPathLower = '';
      if (
        targetPath.includes('..') ||
        targetPath.startsWith('.') ||
        targetPath.includes('\\') ||
        targetPath.includes('/')
      ) {
        try {
          const resolved = path.resolve(targetPath);
          resolvedLower = resolved.toLowerCase();
          if (fs.existsSync(resolved)) {
            realPathLower = fs.realpathSync(resolved).toLowerCase();
          } else {
            const parentDir = path.dirname(resolved);
            if (fs.existsSync(parentDir)) {
              const realParent = fs.realpathSync(parentDir);
              realPathLower = path.join(realParent, path.basename(resolved)).toLowerCase();
            }
          }
        } catch {}
      }
      const lowerTarget = targetPath.toLowerCase();
      const baseName = lowerTarget.split(/[\\/]/).pop() || '';
      const resolvedBaseName = resolvedLower ? (resolvedLower.split(/[\\/]/).pop() || '') : '';
      const realBaseName = realPathLower ? (realPathLower.split(/[\\/]/).pop() || '') : '';
      const isMutatingAction =
        actionType === 'WRITE_FILE' ||
        (merged.action && typeof merged.action === 'object' && merged.action.type === 'WRITE_FILE');

      if (
        /^(\\\\|\/\/)[^\\/]+[\\/]+[^\\/]+/.test(targetPath) ||
        /^\\\\[?.]\\/.test(targetPath) ||
        targetPath.includes('5_Render_Exports') ||
        targetPath.includes('Video_001_Nvidia_CUDA_Moat_Master_4K.mp4') ||
        targetPath.includes('Video_002_3Person_1M_Agency_Master_4K.mp4') ||
        targetPath.includes('Video_003_Gigafactory_Automation_Master_4K.mp4') ||
        lowerTarget.includes('c:\\windows') ||
        lowerTarget.includes('c:/windows') ||
        resolvedLower.includes('c:\\windows') ||
        realPathLower.includes('c:\\windows') ||
        lowerTarget.includes('c:\\program files') ||
        lowerTarget.includes('c:/program files') ||
        resolvedLower.includes('c:\\program files') ||
        realPathLower.includes('c:\\program files') ||
        lowerTarget.includes('system32') ||
        resolvedLower.includes('system32') ||
        realPathLower.includes('system32') ||
        lowerTarget.includes('/etc/') ||
        lowerTarget.startsWith('/etc') ||
        lowerTarget.includes('do_not_enter') ||
        lowerTarget.includes('restricted') ||
        lowerTarget.includes('classified') ||
        baseName === '.env' ||
        baseName.startsWith('.env.') ||
        resolvedBaseName === '.env' ||
        resolvedBaseName.startsWith('.env.') ||
        realBaseName === '.env' ||
        realBaseName.startsWith('.env.') ||
        lowerTarget.endsWith('\\.env') ||
        lowerTarget.endsWith('/.env') ||
        lowerTarget.includes('\\.ssh\\') ||
        lowerTarget.includes('/.ssh/') ||
        lowerTarget.endsWith('\\.ssh') ||
        lowerTarget.endsWith('/.ssh') ||
        resolvedLower.includes('\\.ssh') ||
        realPathLower.includes('\\.ssh') ||
        lowerTarget.includes('\\.aws\\') ||
        lowerTarget.includes('/.aws/') ||
        lowerTarget.endsWith('\\.aws') ||
        lowerTarget.endsWith('/.aws') ||
        resolvedLower.includes('\\.aws') ||
        realPathLower.includes('\\.aws') ||
        lowerTarget.includes('\\.gnupg\\') ||
        lowerTarget.includes('/.gnupg/') ||
        resolvedLower.includes('\\.gnupg') ||
        realPathLower.includes('\\.gnupg') ||
        baseName === 'credentials.json' ||
        baseName === 'gmail_token.json' ||
        baseName === 'id_rsa' ||
        baseName === 'id_ed25519' ||
        resolvedBaseName === 'credentials.json' ||
        resolvedBaseName === 'gmail_token.json' ||
        resolvedBaseName === 'id_rsa' ||
        resolvedBaseName === 'id_ed25519' ||
        realBaseName === 'credentials.json' ||
        realBaseName === 'gmail_token.json' ||
        realBaseName === 'id_rsa' ||
        realBaseName === 'id_ed25519' ||
        (isMutatingAction && (
          lowerTarget.includes('.git\\hooks') ||
          lowerTarget.includes('.git/hooks') ||
          resolvedLower.includes('.git\\hooks') ||
          lowerTarget.includes('orion-protected-policy') ||
          resolvedLower.includes('orion-protected-policy')
        )) ||
        /\brm\s+-[rRfF]+\s+\S/i.test(targetPath) ||
        /\b(format\s+[a-z]:|del\s+.*\/[fqs]|remove-item\s+.*(-recurse|-force)|reg\s+delete|bcdedit|cipher\s+\/w:|diskpart|powershell\s+.*-(enc|encodedcommand))\b/i.test(targetPath)
      ) {
        return 'CRITICAL';
      }
    }

    const effectiveActionType =
      (merged.action && typeof merged.action === 'object' && typeof merged.action.type === 'string')
        ? merged.action.type
        : actionType;

    switch (effectiveActionType) {
      case 'OBSERVE_SCREEN':
      case 'TAKE_SCREENSHOT':
      case 'READ_FILE':
      case 'NAVIGATE_FILESYSTEM':
      case 'WAIT':
        return 'READ_ONLY';

      case 'MOUSE_MOVE':
      case 'SCROLL':
      case 'FOCUS_WINDOW':
      case 'MINIMIZE_WINDOW':
      case 'MAXIMIZE_WINDOW':
      case 'RESTORE_WINDOW':
      case 'RECOVER_STATE':
        return 'LOW_RISK';

      case 'MOUSE_CLICK':
      case 'MOUSE_DOUBLE_CLICK':
      case 'MOUSE_RIGHT_CLICK':
      case 'MOUSE_DOWN':
      case 'MOUSE_UP':
      case 'DRAG':
      case 'KEYBOARD_INPUT':
      case 'KEY_DOWN':
      case 'KEY_UP':
      case 'PRESS_KEY':
      case 'HOTKEY':
      case 'OPEN_APP':
      case 'CLOSE_WINDOW':
        // If typing sensitive commands or modifying files, escalate risk
        if (
          merged?.isDestructive ||
          merged?.dangerFlag ||
          merged?.action?.payload?.isDestructive ||
          merged?.action?.parameters?.isDestructive
        ) {
          return 'HIGH_RISK';
        }
        return 'MODERATE_RISK';

      case 'WRITE_FILE':
        if (targetCandidates.length === 0) {
          return 'CRITICAL';
        }
        return 'HIGH_RISK';

      default:
        return 'HIGH_RISK';
    }
  }
}
