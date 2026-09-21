export interface BrowserObservation {
  timestamp: number;
  url: string;
  title: string;
  contentSummary: string;
  extractedText?: string;
  links: Array<{ text: string; href: string }>;
}

export interface BrowserActionResult {
  actionId: string;
  success: boolean;
  preconditionsMet: boolean;
  postconditionsVerified: boolean;
  observation?: BrowserObservation;
  error?: string;
  timestamp: number;
}

export interface IBrowserProvider {
  observe(): Promise<BrowserObservation>;
  navigate(url: string): Promise<BrowserActionResult>;
  click(selector: string): Promise<BrowserActionResult>;
  typeText(selector: string, text: string): Promise<BrowserActionResult>;
}
