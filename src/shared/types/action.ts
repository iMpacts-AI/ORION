import { PermissionLevel } from './index';

export type ActionRiskLevel = 'READ_ONLY' | 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' | 'CRITICAL';

export type ComputerActionType =
  | 'OBSERVE_SCREEN'
  | 'TAKE_SCREENSHOT'
  | 'FOCUS_WINDOW'
  | 'OPEN_APP'
  | 'CLOSE_WINDOW'
  | 'MINIMIZE_WINDOW'
  | 'MAXIMIZE_WINDOW'
  | 'RESTORE_WINDOW'
  | 'NAVIGATE_FILESYSTEM'
  | 'READ_FILE'
  | 'WRITE_FILE'
  | 'MOUSE_MOVE'
  | 'MOUSE_CLICK'
  | 'MOUSE_DOUBLE_CLICK'
  | 'MOUSE_RIGHT_CLICK'
  | 'MOUSE_DOWN'
  | 'MOUSE_UP'
  | 'SCROLL'
  | 'DRAG'
  | 'KEYBOARD_INPUT'
  | 'KEY_DOWN'
  | 'KEY_UP'
  | 'PRESS_KEY'
  | 'HOTKEY'
  | 'WAIT'
  | 'RECOVER_STATE';

export interface ScreenPoint {
  x: number;
  y: number;
}

export interface ScreenBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UIElementNode {
  id: string;
  role: 'button' | 'input' | 'text' | 'link' | 'window' | 'menu' | 'tab' | 'checkbox' | 'image' | 'unknown';
  text: string;
  bounds: ScreenBounds;
  enabled: boolean;
  visible: boolean;
  focused?: boolean;
  confidence: number;
  source: 'ACCESSIBILITY' | 'OCR' | 'VISUAL_HEURISTIC';
}

export type ComputerTaskState =
  | 'IDLE'
  | 'UNDERSTANDING'
  | 'OBSERVING'
  | 'PLANNING'
  | 'AWAITING_APPROVAL'
  | 'EXECUTING'
  | 'VERIFYING'
  | 'RECOVERING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'ESTOPPED';

export interface ComputerObservation {
  observationId?: string;
  timestamp: number;
  screen: {
    width: number;
    height: number;
    scaleFactor: number;
  };
  activeWindow: {
    title: string;
    processName: string;
    processId: number;
    bounds: ScreenBounds;
  };
  visibleWindows?: Array<{
    title: string;
    processName: string;
    processId: number;
    bounds: ScreenBounds;
  }>;
  cursor: ScreenPoint;
  visibleText: string[];
  interactiveElements: UIElementNode[];
  applications: string[];
  screenshotBase64?: string;
  confidence: number;
}

export interface ElementTargetSelector {
  text?: string;
  normalizedText?: string;
  role?: string;
  application?: string;
  windowTitle?: string;
  approximateLocation?: ScreenPoint;
  exactBounds?: ScreenBounds;
  minConfidence?: number;
  controlType?: string;
  nearbyLabels?: string[];
  spatialContext?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export interface ActionPreconditions {
  expectedActiveApp?: string;
  expectedActiveWindow?: string;
  requiredFilePath?: string;
  maxObservationAgeMs?: number;
  requiredElement?: ElementTargetSelector;
}

export interface ActionPostconditions {
  verifyFileExists?: string;
  verifyActiveApp?: string;
  verifyActiveWindow?: string;
  verifyTextVisible?: string;
  verifyElementDisappeared?: ElementTargetSelector;
  verifyMinFileSize?: number;
}

export interface ComputerAction {
  id: string;
  type: ComputerActionType;
  target?: string;
  selector?: ElementTargetSelector;
  parameters?: Record<string, any>;
  payload?: Record<string, any>;
  reason?: string;
  confidence?: number;
  riskLevel: ActionRiskLevel;
  requiresApproval?: boolean;
  expectedResult?: string;
  preconditions?: ActionPreconditions;
  postconditions?: ActionPostconditions;
  isDryRun?: boolean;
  timeoutMs?: number;
  maxRetries?: number;
}

export interface ActionResult {
  actionId: string;
  success: boolean;
  preconditionsMet: boolean;
  postconditionsVerified: boolean;
  observedState?: Partial<ComputerObservation>;
  data?: any;
  error?: string;
  recovered?: boolean;
  recoveryAttempts?: number;
  timestamp: number;
  executionTimeMs?: number;
  isDryRun?: boolean;
  ambiguityDetected?: boolean;
  ambiguityCandidates?: UIElementNode[];
}

export interface TaskStateTransition {
  fromState: ComputerTaskState;
  toState: ComputerTaskState;
  timestamp: number;
  reason?: string;
  actionId?: string;
}

export interface ExecutionTimingMetrics {
  understandingMs?: number;
  observationMs?: number;
  planningMs?: number;
  groundingMs?: number;
  actionExecutionMs?: number;
  verificationMs?: number;
  recoveryMs?: number;
  totalDurationMs?: number;
}

export interface ComputerTaskPlan {
  taskId: string;
  parentTaskId?: string;
  naturalLanguageCommand: string;
  intent: string;
  targetApp?: string;
  actions: ComputerAction[];
  overallRisk: ActionRiskLevel;
  requiresUserApproval: boolean;
  status: ComputerTaskState | 'PENDING' | 'RUNNING'; // Backwards compatibility union
  currentActionIndex: number;
  totalSteps?: number;
  recoveryCount?: number;
  verificationResult?: 'VERIFIED' | 'FAILED' | 'PARTIAL';
  cancellationState?: {
    isCancelled: boolean;
    reason?: string;
    cancelledAt?: number;
  };
  auditLog: ComputerActionAuditEntry[];
  stateTransitions?: TaskStateTransition[];
  timingMetrics?: ExecutionTimingMetrics;
  completionReport?: string;
  replanHistory?: Array<{ failedActionId: string; reason: string; timestamp: number }>;
  taskContext?: Record<string, any>;
  checkpointId?: string;
  currentObservationId?: string;
  isDryRun?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ComputerActionAuditEntry {
  timestamp: number;
  taskId: string;
  actionId: string;
  application: string;
  action: ComputerActionType;
  target?: string;
  confidence: number;
  risk: ActionRiskLevel;
  approval: 'APPROVED' | 'AUTO_AUTHORIZED' | 'PENDING' | 'DENIED';
  result: 'SUCCESS' | 'FAILURE' | 'RECOVERED' | 'BLOCKED' | 'AMBIGUOUS';
  verification: 'VERIFIED' | 'FAILED' | 'SKIPPED';
  durationMs: number;
  isDryRun?: boolean;
  error?: string;
}

