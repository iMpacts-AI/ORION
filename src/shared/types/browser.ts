export interface BrowserDomElementSummary {
  tagName: string;
  id?: string;
  name?: string;
  type?: string;
  role?: string;
  text?: string;
  value?: string;
  href?: string;
  disabled?: boolean;
  selector: string;
}

export interface BrowserBlockerInfo {
  type:
    | 'LOGIN_REQUIRED'
    | 'ACCOUNT_CHOOSER'
    | 'TWO_FACTOR_AUTH'
    | 'CAPTCHA'
    | 'PERMISSION_PROMPT'
    | 'UNEXPECTED_DIALOG';
  detail: string;
}

export interface BrowserTabSummary {
  id: string;
  url: string;
  title: string;
  active?: boolean;
}

export interface BrowserObservation {
  timestamp: number;
  url: string;
  title: string;
  contentSummary: string;
  extractedText?: string;
  links: Array<{ text: string; href: string }>;
  interactiveElements?: BrowserDomElementSummary[];
  adapterMode?: 'CDP_HEADLESS' | 'PLAYWRIGHT' | 'HTTP_FETCH';
  readyState?: string;
  tabs?: BrowserTabSummary[];
  blockers?: BrowserBlockerInfo[];
  dialogHandled?: { type: string; message: string; action: 'dismissed' | 'accepted' };
  visibleChromePid?: number;
  visibleWindowVerified?: boolean;
  profileDirectory?: string;
}

export interface BrowserNavigateOptions {
  openInExternalBrowser?: boolean;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
  waitForSelector?: string;
  timeoutMs?: number;
  useCdpAdapter?: boolean;
  visibleWindow?: boolean;
  executableOverride?: string;
  profileDirectory?: string;
}

export interface BrowserInteractionOptions {
  timeoutMs?: number;
  explicitAuthorization?: boolean;
  allowSensitiveField?: boolean;
  submitForm?: boolean;
}

export interface BrowserActionResult {
  actionId: string;
  success: boolean;
  preconditionsMet: boolean;
  postconditionsVerified: boolean;
  observation?: BrowserObservation;
  error?: string;
  errorCode?:
    | 'PROTOCOL_BLOCKED'
    | 'TIMEOUT'
    | 'NAVIGATION_ERROR'
    | 'ELEMENT_NOT_FOUND'
    | 'STALE_ELEMENT'
    | 'AUTHORIZATION_REQUIRED'
    | 'SENSITIVE_FIELD_BLOCKED'
    | 'UNEXPECTED_STATE'
    | 'BROWSER_UNAVAILABLE'
    | 'CANCELLED'
    | 'ESTOPPED'
    | 'BLOCKER_DETECTED'
    | 'PAUSED_FOR_USER_AUTH';
  timestamp: number;
  durationMs?: number;
}

export type BrowserClosedLoopStage =
  | 'OBSERVE'
  | 'UNDERSTAND'
  | 'PLAN'
  | 'VALIDATE'
  | 'AUTHORIZE'
  | 'EXECUTE'
  | 'OBSERVE_AGAIN'
  | 'VERIFY'
  | 'RECOVER_OR_REPORT'
  | 'COMPLETED'
  | 'FAILED'
  | 'BLOCKED'
  | 'CANCELLED';

export interface BrowserClosedLoopStepLog {
  stage: BrowserClosedLoopStage;
  timestamp: number;
  detail: string;
  verified?: boolean;
}

export interface BrowserClosedLoopReport {
  taskId: string;
  goal: string;
  status: 'COMPLETED' | 'FAILED' | 'BLOCKED' | 'AWAITING_APPROVAL' | 'CANCELLED' | 'ESTOPPED';
  success: boolean;
  postconditionsVerified: boolean;
  summary: string;
  url?: string;
  title?: string;
  searchResults?: Array<{ title: string; url: string; snippet: string }>;
  observation?: BrowserObservation;
  pendingApprovalId?: string;
  error?: string;
  errorCode?: BrowserActionResult['errorCode'];
  steps: BrowserClosedLoopStepLog[];
  durationMs: number;
}

export interface IBrowserProvider {
  observe(): Promise<BrowserObservation>;
  navigate(url: string, optionsOrExternal?: boolean | BrowserNavigateOptions): Promise<BrowserActionResult>;
  click(selector: string, options?: BrowserInteractionOptions): Promise<BrowserActionResult>;
  typeText(selector: string, text: string, options?: BrowserInteractionOptions): Promise<BrowserActionResult>;
  close?(): Promise<void>;
}
