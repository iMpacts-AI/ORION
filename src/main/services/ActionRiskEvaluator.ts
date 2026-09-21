import { ComputerActionType, ActionRiskLevel } from '../../shared/types/action';

export class ActionRiskEvaluator {
  /**
   * Runtime Authoritative Risk Rating Calculation Engine
   * Independent of LLM reasoning.
   */
  public evaluateRisk(actionType: ComputerActionType, payload?: Record<string, any>): ActionRiskLevel {
    // 1. Strict Protection of Project Titan Protected 4K Masters and System Directories
    const targetPath = (payload?.filePath || payload?.target || payload?.path || '') as string;
    if (
      targetPath.includes('5_Render_Exports') ||
      targetPath.includes('Video_001_Nvidia_CUDA_Moat_Master_4K.mp4') ||
      targetPath.includes('Video_002_3Person_1M_Agency_Master_4K.mp4') ||
      targetPath.includes('Video_003_Gigafactory_Automation_Master_4K.mp4') ||
      targetPath.includes('C:\\Windows') ||
      targetPath.includes('System32') ||
      targetPath.includes('/etc/') ||
      targetPath.toLowerCase().includes('do_not_enter') ||
      targetPath.toLowerCase().includes('restricted')
    ) {
      return 'CRITICAL';
    }

    switch (actionType) {
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
        if (payload?.isDestructive || payload?.dangerFlag) {
          return 'HIGH_RISK';
        }
        return 'MODERATE_RISK';

      case 'WRITE_FILE':
        return 'HIGH_RISK';

      default:
        return 'HIGH_RISK';
    }
  }
}
