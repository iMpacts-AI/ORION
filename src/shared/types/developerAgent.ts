export interface CodeRepositorySummary {
  rootPath: string;
  totalFiles: number;
  languagesDetected: string[];
  hasPackageJson: boolean;
}

export interface CodeSearchResult {
  filePath: string;
  lineNumber: number;
  lineContent: string;
}

export interface BuildExecutionResult {
  command: string;
  success: boolean;
  exitCode: number;
  output: string;
  durationMs: number;
}

export interface IDeveloperAgentProvider {
  inspectRepository(targetPath: string): Promise<CodeRepositorySummary>;
  searchCode(targetPath: string, query: string): Promise<CodeSearchResult[]>;
  executeBuild(targetPath: string, command: string): Promise<BuildExecutionResult>;
}
