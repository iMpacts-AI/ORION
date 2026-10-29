import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { ProcessSupervisor } from '../main/services/computer/ProcessSupervisor';
import { UnifiedMemoryManager } from '../main/services/UnifiedMemoryManager';

export interface ShellExecutionRequest {
  command: string;
  args?: string[];
  cwd?: string;
  timeoutMs?: number;
  maxOutputBytes?: number;
  signal?: AbortSignal;
  useShell?: boolean;
}

export interface ShellExecutionOutcome {
  success: boolean;
  status: 'COMPLETED' | 'FAILED' | 'TIMED_OUT' | 'CANCELLED' | 'BLOCKED';
  command: string;
  args: string[];
  cwd: string;
  exitCode: number | null;
  signal: string | null;
  stdout: string;
  stderr: string;
  stdoutTruncated: boolean;
  stderrTruncated: boolean;
  durationMs: number;
  pid?: number;
  error?: string;
}

/**
 * Safe Shell & Command Execution Service (Section 9).
 * - Integrates with `ProcessSupervisor` and E-Stop.
 * - Enforces bounded timeouts, output-size limits, explicit working directory validation,
 *   restricted environment variables (secrets stripped), and process-tree termination on timeout/cancel.
 * - Rejects destructive shell patterns and untrusted command interpolation.
 */
export class ShellExecutionService {
  private readonly workspaceRoot: string;
  private readonly supervisor: ProcessSupervisor;
  private readonly defaultTimeoutMs: number;
  private readonly defaultMaxOutputBytes: number;

  private static readonly DESTRUCTIVE_PATTERNS: Array<{ name: string; regex: RegExp }> = [
    { name: 'RECURSIVE_FORCE_RM', regex: /\brm\s+(-[rRf]+\s+|.*--no-preserve-root)/i },
    { name: 'WINDOWS_DEL_FORCE', regex: /\bdel\s+\/[fqs]/i },
    { name: 'WINDOWS_RMDIR_RECURSIVE', regex: /\brmdir\s+\/[sq]/i },
    { name: 'POWERSHELL_REMOVE_ITEM_FORCE', regex: /\bRemove-Item\b.*-Recurse.*-Force/i },
    { name: 'DISK_FORMAT', regex: /\bformat\s+[a-zA-Z]:/i },
    { name: 'DISKPART', regex: /\bdiskpart\b/i },
    { name: 'BCDEDIT', regex: /\bbcdedit\b/i },
    { name: 'REGISTRY_DELETE', regex: /\breg\s+delete\b/i },
    { name: 'GIT_RESET_HARD', regex: /\bgit\s+reset\s+--hard\b/i },
    { name: 'GIT_CLEAN_FORCE', regex: /\bgit\s+clean\s+-[fxd]+/i },
    { name: 'POWERSHELL_IEX', regex: /\b(?:Invoke-Expression|iex)\b/i },
    { name: 'REMOTE_PIPE_EXEC', regex: /\b(?:curl|wget)\b.*\|\s*(?:sh|bash|pwsh|powershell|cmd)/i }
  ];

  private static readonly SECRET_ENV_KEY_PATTERN =
    /(?:API_KEY|SECRET|TOKEN|PASSWORD|PRIVATE_KEY|CREDENTIAL|OPENAI|ANTHROPIC|GEMINI|GROQ|OPENROUTER|DEEPSEEK|MISTRAL|XAI|CEREBRAS|TOGETHER|PERPLEXITY|ELEVENLABS)/i;

  constructor(options: {
    workspaceRoot?: string;
    supervisor?: ProcessSupervisor;
    defaultTimeoutMs?: number;
    defaultMaxOutputBytes?: number;
  } = {}) {
    this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
    this.supervisor = options.supervisor || ProcessSupervisor.getInstance();
    this.defaultTimeoutMs = options.defaultTimeoutMs ?? 30_000;
    this.defaultMaxOutputBytes = options.defaultMaxOutputBytes ?? 65_536;
  }

  public buildRestrictedEnv(): NodeJS.ProcessEnv {
    const cleanEnv: NodeJS.ProcessEnv = {};
    for (const [key, value] of Object.entries(process.env)) {
      if (value === undefined) continue;
      if (ShellExecutionService.SECRET_ENV_KEY_PATTERN.test(key)) {
        continue;
      }
      cleanEnv[key] = value;
    }
    cleanEnv.CI = 'true';
    cleanEnv.NO_COLOR = cleanEnv.NO_COLOR || '1';
    return cleanEnv;
  }

  public validateCommandSafety(command: string, args: string[] = []): {
    safe: boolean;
    reason?: string;
  } {
    if (!command || typeof command !== 'string' || !command.trim()) {
      return { safe: false, reason: 'Command must be a non-empty string.' };
    }

    const combined = `${command} ${args.join(' ')}`.trim();
    for (const rule of ShellExecutionService.DESTRUCTIVE_PATTERNS) {
      if (rule.regex.test(combined)) {
        return {
          safe: false,
          reason: `Blocked destructive or high-risk command pattern (${rule.name}): "${combined.slice(0, 120)}"`
        };
      }
    }

    return { safe: true };
  }

  public validateWorkingDirectory(requestedCwd?: string): string {
    const resolvedCwd = requestedCwd
      ? path.resolve(this.workspaceRoot, requestedCwd)
      : this.workspaceRoot;

    const rootWithSep = this.workspaceRoot.endsWith(path.sep)
      ? this.workspaceRoot
      : this.workspaceRoot + path.sep;

    const isInside =
      process.platform === 'win32'
        ? resolvedCwd.toLowerCase() === this.workspaceRoot.toLowerCase() ||
          resolvedCwd.toLowerCase().startsWith(rootWithSep.toLowerCase())
        : resolvedCwd === this.workspaceRoot || resolvedCwd.startsWith(rootWithSep);

    if (!isInside) {
      throw new Error(
        `SECURITY POLICY VIOLATION: Working directory "${requestedCwd}" escapes workspace root "${this.workspaceRoot}".`
      );
    }

    if (!fs.existsSync(resolvedCwd) || !fs.statSync(resolvedCwd).isDirectory()) {
      throw new Error(`Working directory does not exist or is not a directory: "${resolvedCwd}".`);
    }

    return resolvedCwd;
  }

  public async execute(request: ShellExecutionRequest): Promise<ShellExecutionOutcome> {
    const startTime = Date.now();
    const rawCommand = String(request.command || '').trim();
    const rawArgs = Array.isArray(request.args) ? request.args.map(a => String(a)) : [];

    if (this.supervisor.isEstopActive()) {
      return {
        success: false,
        status: 'BLOCKED',
        command: rawCommand,
        args: rawArgs,
        cwd: this.workspaceRoot,
        exitCode: null,
        signal: null,
        stdout: '',
        stderr: '',
        stdoutTruncated: false,
        stderrTruncated: false,
        durationMs: Date.now() - startTime,
        error: '[ESTOP REJECTION] System is in EMERGENCY STOP state.'
      };
    }

    const safety = this.validateCommandSafety(rawCommand, rawArgs);
    if (!safety.safe) {
      return {
        success: false,
        status: 'BLOCKED',
        command: rawCommand,
        args: rawArgs,
        cwd: this.workspaceRoot,
        exitCode: null,
        signal: null,
        stdout: '',
        stderr: '',
        stdoutTruncated: false,
        stderrTruncated: false,
        durationMs: Date.now() - startTime,
        error: safety.reason
      };
    }

    let validatedCwd: string;
    try {
      validatedCwd = this.validateWorkingDirectory(request.cwd);
    } catch (err: any) {
      return {
        success: false,
        status: 'BLOCKED',
        command: rawCommand,
        args: rawArgs,
        cwd: request.cwd || this.workspaceRoot,
        exitCode: null,
        signal: null,
        stdout: '',
        stderr: '',
        stdoutTruncated: false,
        stderrTruncated: false,
        durationMs: Date.now() - startTime,
        error: err.message
      };
    }

    if (request.signal?.aborted) {
      return {
        success: false,
        status: 'CANCELLED',
        command: rawCommand,
        args: rawArgs,
        cwd: validatedCwd,
        exitCode: null,
        signal: 'ABORTED',
        stdout: '',
        stderr: '',
        stdoutTruncated: false,
        stderrTruncated: false,
        durationMs: Date.now() - startTime,
        error: 'Execution cancelled before start via AbortSignal.'
      };
    }

    const timeoutMs = Math.max(100, Math.min(request.timeoutMs ?? this.defaultTimeoutMs, 300_000));
    const maxOutputBytes = Math.max(1024, Math.min(request.maxOutputBytes ?? this.defaultMaxOutputBytes, 1_048_576));

    // Determine executable & arguments without arbitrary string interpolation when args are provided
    let spawnExec = rawCommand;
    let spawnArgs = rawArgs;
    if (rawArgs.length === 0 && /\s/.test(rawCommand) && (request.useShell ?? true)) {
      if (process.platform === 'win32') {
        spawnExec = 'powershell.exe';
        spawnArgs = ['-NoProfile', '-NonInteractive', '-Command', rawCommand];
      } else {
        spawnExec = '/bin/sh';
        spawnArgs = ['-c', rawCommand];
      }
    }

    const processId = `shell_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const internalAbort = new AbortController();

    return new Promise<ShellExecutionOutcome>((resolve) => {
      let stdoutBuf = '';
      let stderrBuf = '';
      let stdoutTruncated = false;
      let stderrTruncated = false;
      let timedOut = false;
      let cancelled = false;
      let settled = false;

      const finish = (outcome: ShellExecutionOutcome) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (request.signal) {
          request.signal.removeEventListener('abort', onExternalAbort);
        }
        this.supervisor.unregisterProcess(processId);
        resolve({
          ...outcome,
          stdout: UnifiedMemoryManager.sanitizeSecrets(outcome.stdout),
          stderr: UnifiedMemoryManager.sanitizeSecrets(outcome.stderr)
        });
      };

      const onExternalAbort = () => {
        cancelled = true;
        if (child && child.pid) {
          this.supervisor.killProcessTree(child.pid).catch(() => {});
        }
        internalAbort.abort();
      };

      if (request.signal) {
        request.signal.addEventListener('abort', onExternalAbort, { once: true });
      }

      let child: ReturnType<typeof spawn>;
      try {
        child = spawn(spawnExec, spawnArgs, {
          cwd: validatedCwd,
          env: this.buildRestrictedEnv(),
          shell: false,
          windowsHide: true
        });
      } catch (spawnErr: any) {
        return finish({
          success: false,
          status: 'FAILED',
          command: rawCommand,
          args: rawArgs,
          cwd: validatedCwd,
          exitCode: null,
          signal: null,
          stdout: '',
          stderr: '',
          stdoutTruncated: false,
          stderrTruncated: false,
          durationMs: Date.now() - startTime,
          error: `Failed to spawn process: ${spawnErr.message}`
        });
      }

      try {
        this.supervisor.registerProcess(
          processId,
          `${spawnExec} ${spawnArgs.join(' ')}`,
          child,
          internalAbort,
          true
        );
      } catch (regErr: any) {
        if (child.pid) {
          this.supervisor.killProcessTree(child.pid).catch(() => {});
        }
        return finish({
          success: false,
          status: 'BLOCKED',
          command: rawCommand,
          args: rawArgs,
          cwd: validatedCwd,
          exitCode: null,
          signal: null,
          stdout: '',
          stderr: '',
          stdoutTruncated: false,
          stderrTruncated: false,
          durationMs: Date.now() - startTime,
          pid: child.pid,
          error: regErr.message
        });
      }

      const timer = setTimeout(() => {
        timedOut = true;
        if (child.pid) {
          this.supervisor.killProcessTree(child.pid).catch(() => {});
        } else {
          child.kill('SIGKILL');
        }
        finish({
          success: false,
          status: 'TIMED_OUT',
          command: rawCommand,
          args: rawArgs,
          cwd: validatedCwd,
          exitCode: null,
          signal: 'SIGTERM',
          stdout: stdoutBuf,
          stderr: stderrBuf,
          stdoutTruncated,
          stderrTruncated,
          durationMs: Date.now() - startTime,
          pid: child.pid,
          error: `Command timed out after ${timeoutMs}ms and process tree was terminated.`
        });
      }, timeoutMs);

      if (child.stdout) {
        child.stdout.on('data', (chunk: Buffer) => {
          const str = chunk.toString('utf8');
          if (Buffer.byteLength(stdoutBuf, 'utf8') < maxOutputBytes) {
            const remaining = maxOutputBytes - Buffer.byteLength(stdoutBuf, 'utf8');
            if (Buffer.byteLength(str, 'utf8') > remaining) {
              stdoutBuf += str.slice(0, remaining) + '\n...[STDOUT TRUNCATED]...';
              stdoutTruncated = true;
            } else {
              stdoutBuf += str;
            }
          } else {
            stdoutTruncated = true;
          }
        });
      }

      if (child.stderr) {
        child.stderr.on('data', (chunk: Buffer) => {
          const str = chunk.toString('utf8');
          if (Buffer.byteLength(stderrBuf, 'utf8') < maxOutputBytes) {
            const remaining = maxOutputBytes - Buffer.byteLength(stderrBuf, 'utf8');
            if (Buffer.byteLength(str, 'utf8') > remaining) {
              stderrBuf += str.slice(0, remaining) + '\n...[STDERR TRUNCATED]...';
              stderrTruncated = true;
            } else {
              stderrBuf += str;
            }
          } else {
            stderrTruncated = true;
          }
        });
      }

      child.on('error', (err: Error) => {
        if (cancelled) {
          return finish({
            success: false,
            status: 'CANCELLED',
            command: rawCommand,
            args: rawArgs,
            cwd: validatedCwd,
            exitCode: null,
            signal: 'ABORTED',
            stdout: stdoutBuf,
            stderr: stderrBuf,
            stdoutTruncated,
            stderrTruncated,
            durationMs: Date.now() - startTime,
            pid: child.pid,
            error: 'Command execution cancelled.'
          });
        }
        finish({
          success: false,
          status: 'FAILED',
          command: rawCommand,
          args: rawArgs,
          cwd: validatedCwd,
          exitCode: null,
          signal: null,
          stdout: stdoutBuf,
          stderr: stderrBuf,
          stdoutTruncated,
          stderrTruncated,
          durationMs: Date.now() - startTime,
          pid: child.pid,
          error: err.message
        });
      });

      child.on('close', (code, sig) => {
        if (timedOut) return;
        if (cancelled) {
          return finish({
            success: false,
            status: 'CANCELLED',
            command: rawCommand,
            args: rawArgs,
            cwd: validatedCwd,
            exitCode: code,
            signal: sig ? String(sig) : 'ABORTED',
            stdout: stdoutBuf,
            stderr: stderrBuf,
            stdoutTruncated,
            stderrTruncated,
            durationMs: Date.now() - startTime,
            pid: child.pid,
            error: 'Command execution cancelled.'
          });
        }

        const exitCode = code ?? 0;
        const ok = exitCode === 0;
        finish({
          success: ok,
          status: ok ? 'COMPLETED' : 'FAILED',
          command: rawCommand,
          args: rawArgs,
          cwd: validatedCwd,
          exitCode,
          signal: sig ? String(sig) : null,
          stdout: stdoutBuf,
          stderr: stderrBuf,
          stdoutTruncated,
          stderrTruncated,
          durationMs: Date.now() - startTime,
          pid: child.pid,
          error: ok ? undefined : `Process exited with non-zero code ${exitCode}${stderrBuf ? `: ${stderrBuf.trim().slice(0, 240)}` : ''}`
        });
      });
    });
  }
}
