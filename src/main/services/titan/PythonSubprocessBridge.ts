import { spawn, ChildProcess } from 'child_process';
import path from 'path';

export interface PythonExecutionOptions {
  scriptPath: string;
  args?: string[];
  cwd?: string;
  timeoutMs?: number;
  inactivityTimeoutMs?: number;
  onStdout?: (chunk: string) => void;
  onStderr?: (chunk: string) => void;
  env?: Record<string, string>;
}

export interface PythonExecutionResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  durationMs: number;
}

export class PythonSubprocessBridge {
  public static readonly DEFAULT_TIMEOUT_MS = 60000;
  public static readonly PRODUCTION_RENDER_TIMEOUT_MS = 1800000; // 30 minutes hard safety ceiling for heavy 4K renders

  /**
   * Sanitizes text to prevent API keys or secrets from being logged or exposed.
   */
  public static sanitizeOutput(text: string): string {
    if (!text) return '';
    // Pattern to scrub potential API keys or tokens (e.g., sk-..., gsk_..., AIza...)
    return text
      .replace(/(sk-[a-zA-Z0-9_-]{20,})/g, '[REDACTED_API_KEY]')
      .replace(/(gsk_[a-zA-Z0-9_-]{20,})/g, '[REDACTED_GROQ_KEY]')
      .replace(/(AIza[a-zA-Z0-9_-]{30,})/g, '[REDACTED_GEMINI_KEY]')
      .replace(/(bearer\s+[a-zA-Z0-9._-]{20,})/gi, 'Bearer [REDACTED_TOKEN]');
  }

  /**
   * Safely executes a Python script using explicit array arguments (no shell string execution).
   */
  public async executeScript(options: PythonExecutionOptions): Promise<PythonExecutionResult> {
    const startTime = Date.now();
    const scriptPath = path.resolve(options.scriptPath);
    const args = options.args || [];
    const cwd = options.cwd ? path.resolve(options.cwd) : path.dirname(scriptPath);
    const timeoutMs = options.timeoutMs || PythonSubprocessBridge.DEFAULT_TIMEOUT_MS;
    const inactivityTimeoutMs = options.inactivityTimeoutMs || 0;

    // Sanitize environment: strip out sensitive credentials when launching subprocess unless strictly needed
    const safeEnv = { ...process.env, ...(options.env || {}) };
    delete safeEnv.GROQ_API_KEY;
    delete safeEnv.GEMINI_API_KEY;
    delete safeEnv.OPENAI_API_KEY;
    delete safeEnv.ANTHROPIC_API_KEY;

    return new Promise<PythonExecutionResult>((resolve) => {
      let stdoutData = '';
      let stderrData = '';
      let timedOut = false;
      let child: ChildProcess | null = null;
      let hardTimer: NodeJS.Timeout | null = null;
      let inactivityTimer: NodeJS.Timeout | null = null;

      const clearAllTimers = () => {
        if (hardTimer) {
          clearTimeout(hardTimer);
          hardTimer = null;
        }
        if (inactivityTimer) {
          clearTimeout(inactivityTimer);
          inactivityTimer = null;
        }
      };

      const killProcess = () => {
        timedOut = true;
        if (child && !child.killed) {
          child.kill('SIGTERM');
          setTimeout(() => {
            if (child && !child.killed) {
              child.kill('SIGKILL');
            }
          }, 2000);
        }
      };

      const resetInactivityTimer = () => {
        if (inactivityTimeoutMs > 0) {
          if (inactivityTimer) clearTimeout(inactivityTimer);
          inactivityTimer = setTimeout(() => {
            killProcess();
          }, inactivityTimeoutMs);
        }
      };

      try {
        // Use 'python' executable with explicit array arguments for secure execution
        child = spawn('python', [scriptPath, ...args], {
          cwd,
          env: safeEnv,
          shell: false // Prevents shell injection vulnerabilities
        });

        if (timeoutMs > 0) {
          hardTimer = setTimeout(() => {
            killProcess();
          }, timeoutMs);
        }

        resetInactivityTimer();

        child.stdout?.on('data', (chunk) => {
          const str = chunk.toString();
          stdoutData += str;
          resetInactivityTimer();
          if (options.onStdout) {
            try {
              options.onStdout(str);
            } catch {}
          }
        });

        child.stderr?.on('data', (chunk) => {
          const str = chunk.toString();
          stderrData += str;
          resetInactivityTimer();
          if (options.onStderr) {
            try {
              options.onStderr(str);
            } catch {}
          }
        });

        child.on('error', (err) => {
          clearAllTimers();
          const durationMs = Date.now() - startTime;
          resolve({
            exitCode: -1,
            stdout: PythonSubprocessBridge.sanitizeOutput(stdoutData),
            stderr: PythonSubprocessBridge.sanitizeOutput(`Process spawn error: ${err.message}\n${stderrData}`),
            timedOut: false,
            durationMs
          });
        });

        child.on('close', (code) => {
          clearAllTimers();
          const durationMs = Date.now() - startTime;
          resolve({
            exitCode: code,
            stdout: PythonSubprocessBridge.sanitizeOutput(stdoutData),
            stderr: PythonSubprocessBridge.sanitizeOutput(stderrData),
            timedOut,
            durationMs
          });
        });
      } catch (err: any) {
        clearAllTimers();
        const durationMs = Date.now() - startTime;
        resolve({
          exitCode: -1,
          stdout: '',
          stderr: PythonSubprocessBridge.sanitizeOutput(`Exception thrown during spawn: ${err.message}`),
          timedOut: false,
          durationMs
        });
      }
    });
  }
}
