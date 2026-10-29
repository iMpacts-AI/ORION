import { PermissionLevel, TaskOutcomeStatus, ToolCall } from '../shared/types';
import {
  HarnessMode,
  StructuredToolCallProposal,
  StructuredToolExecutionResult
} from './ExecutionResult';
import { PermissionGate } from './PermissionGate';
import { ToolRegistry } from './ToolRegistry';
import { AtomicFileEngine } from './AtomicFileEngine';
import { ShellExecutionService } from './ShellExecutionService';
import { WebSearchService } from './WebSearchService';
import { ReminderService } from './ReminderService';
import { CheckpointService } from './CheckpointService';
import { ToolService } from '../main/services/ToolService';
import { SecurityPolicyMiddleware } from '../main/services/SecurityPolicyMiddleware';
import { AgentPolicyService } from '../main/services/AgentPolicyService';
import { ActionRiskEvaluator } from '../main/services/ActionRiskEvaluator';

export interface ToolDispatchOptions {
  actionId?: string;
  toolName: string;
  arguments: Record<string, any>;
  taskId?: string;
  sessionId?: string;
  mode?: HarnessMode;
  agentId?: string;
  agentAllowedTools?: string[];
  agentMaxPermissionLevel?: PermissionLevel;
  approvalToken?: string;
  operatorApproved?: boolean;
  approvedArgsHash?: string;
  timeoutMs?: number;
  signal?: AbortSignal;
}

/**
 * Authoritative Tool Dispatcher (Section 4 & 5).
 * - Validates tool existence & JSON schema (`ToolRegistry.validate`).
 * - Evaluates the 3-tier Permission Gateway (`PermissionGate.evaluate`).
 * - Executes authorized calls via `AtomicFileEngine`, `ShellExecutionService`, `WebSearchService`,
 *   `ReminderService`, `CheckpointService`, or canonical `ToolService` with timeout and `AbortSignal` enforcement.
 */
export class ToolDispatcher {
  public readonly toolRegistry: ToolRegistry;
  public readonly permissionGate: PermissionGate;
  public readonly fileEngine: AtomicFileEngine;
  public readonly shellService: ShellExecutionService;
  public readonly webSearchService: WebSearchService;
  public readonly reminderService: ReminderService;
  public readonly checkpointService: CheckpointService;
  public readonly canonicalToolService: ToolService;

  constructor(options: {
    workspaceRoot?: string;
    toolRegistry?: ToolRegistry;
    permissionGate?: PermissionGate;
    fileEngine?: AtomicFileEngine;
    shellService?: ShellExecutionService;
    webSearchService?: WebSearchService;
    reminderService?: ReminderService;
    checkpointService?: CheckpointService;
    canonicalToolService?: ToolService;
    securityMiddleware?: SecurityPolicyMiddleware;
    policyService?: AgentPolicyService;
    riskEvaluator?: ActionRiskEvaluator;
  } = {}) {
    const root = options.workspaceRoot || process.cwd();
    this.canonicalToolService = options.canonicalToolService || new ToolService();
    this.toolRegistry =
      options.toolRegistry || new ToolRegistry(this.canonicalToolService.getRegistry());
    this.permissionGate =
      options.permissionGate ||
      new PermissionGate({
        toolRegistry: this.toolRegistry,
        projectRoot: root,
        securityMiddleware: options.securityMiddleware,
        policyService: options.policyService,
        riskEvaluator: options.riskEvaluator
      });
    this.fileEngine = options.fileEngine || new AtomicFileEngine(root);
    this.shellService = options.shellService || new ShellExecutionService({ workspaceRoot: root });
    this.webSearchService = options.webSearchService || new WebSearchService();
    this.reminderService = options.reminderService || new ReminderService();
    this.checkpointService =
      options.checkpointService ||
      new CheckpointService({ workspaceRoot: root, fileEngine: this.fileEngine });
  }

  public createProposal(options: ToolDispatchOptions): StructuredToolCallProposal {
    const actionId =
      options.actionId || `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const tool = this.toolRegistry.getTool(options.toolName);
    const tier = this.permissionGate.classifyTier(options.toolName, options.arguments);

    return {
      actionId,
      toolName: options.toolName,
      arguments: options.arguments || {},
      taskId: options.taskId || 'task_default',
      sessionId: options.sessionId || 'session_default',
      permissionLevel: tool?.permissionLevel || 'CRITICAL',
      permissionTier: tier,
      requiresApproval: tier === 'TIER_2_CONFIRMATION',
      approvalStatus:
        tier === 'TIER_1_READ_ONLY'
          ? 'NOT_REQUIRED'
          : options.operatorApproved || options.approvalToken
            ? 'APPROVED'
            : 'PENDING',
      approvalToken: options.approvalToken,
      timeoutMs: options.timeoutMs ?? 30_000,
      signal: options.signal
    };
  }

  public async dispatch(options: ToolDispatchOptions): Promise<StructuredToolExecutionResult> {
    const startedAt = Date.now();
    const proposal = this.createProposal(options);
    const mode: HarnessMode = options.mode || 'Build';

    if (options.signal?.aborted) {
      return {
        actionId: proposal.actionId,
        toolName: proposal.toolName,
        taskId: proposal.taskId,
        sessionId: proposal.sessionId,
        status: 'CANCELLED',
        outcomeStatus: 'cancelled',
        permissionTier: proposal.permissionTier,
        startedAt,
        completedAt: Date.now(),
        durationMs: Date.now() - startedAt,
        verificationStatus: 'FAILED',
        verified: false,
        error: 'Tool execution cancelled before start via AbortSignal.',
        errorCode: 'ABORTED'
      };
    }

    // 1. Validate & Authorize via PermissionGate
    const decision = this.permissionGate.evaluate({
      actionId: proposal.actionId,
      toolName: proposal.toolName,
      args: proposal.arguments,
      mode,
      agentId: options.agentId,
      agentAllowedTools: options.agentAllowedTools,
      agentMaxPermissionLevel: options.agentMaxPermissionLevel,
      approvalToken: options.approvalToken,
      operatorApproved: options.operatorApproved,
      approvedArgsHash: options.approvedArgsHash,
      consumeToken: true
    });

    if (!decision.allowed) {
      if (decision.requiresApproval && decision.pendingApproval) {
        return {
          actionId: proposal.actionId,
          toolName: proposal.toolName,
          taskId: proposal.taskId,
          sessionId: proposal.sessionId,
          status: 'AWAITING_APPROVAL',
          outcomeStatus: 'permission_required',
          permissionTier: decision.tier,
          startedAt,
          completedAt: Date.now(),
          durationMs: Date.now() - startedAt,
          verificationStatus: 'UNKNOWN',
          verified: false,
          approvalId: decision.pendingApproval.approvalId,
          output: {
            pendingApproval: decision.pendingApproval
          },
          error: decision.reason || 'Operator confirmation required before executing Tier 2 tool.',
          errorCode: 'AWAITING_APPROVAL'
        };
      }

      return {
        actionId: proposal.actionId,
        toolName: proposal.toolName,
        taskId: proposal.taskId,
        sessionId: proposal.sessionId,
        status: 'BLOCKED',
        outcomeStatus: 'failed',
        permissionTier: decision.tier,
        startedAt,
        completedAt: Date.now(),
        durationMs: Date.now() - startedAt,
        verificationStatus: 'FAILED',
        verified: false,
        error: decision.reason || 'Tool execution blocked by PermissionGate.',
        errorCode: 'PERMISSION_BLOCKED'
      };
    }

    // 2. Execute with bounded timeout & AbortSignal
    try {
      const execPromise = this.executeUnderlyingTool(proposal);
      const timeoutMs = Math.max(100, proposal.timeoutMs);

      const outcome = await this.raceWithTimeoutAndSignal(execPromise, timeoutMs, proposal.signal);
      const completedAt = Date.now();
      const mappedOutcome: TaskOutcomeStatus =
        outcome.outcomeStatus ||
        (outcome.status === 'COMPLETED'
          ? outcome.verified
            ? 'completed_verified'
            : 'launched_unverified'
          : outcome.status === 'LAUNCHED_UNVERIFIED'
            ? 'launched_unverified'
            : outcome.status === 'AWAITING_APPROVAL'
              ? 'permission_required'
              : outcome.status === 'CANCELLED'
                ? 'cancelled'
                : outcome.status === 'TIMED_OUT'
                  ? 'timed_out'
                  : 'failed');

      return {
        actionId: proposal.actionId,
        toolName: proposal.toolName,
        taskId: proposal.taskId,
        sessionId: proposal.sessionId,
        status: outcome.status,
        outcomeStatus: mappedOutcome,
        permissionTier: decision.tier,
        startedAt,
        completedAt,
        durationMs: completedAt - startedAt,
        verificationStatus: outcome.verified
          ? 'VERIFIED'
          : outcome.status === 'COMPLETED' || outcome.status === 'LAUNCHED_UNVERIFIED'
            ? 'EXECUTED'
            : 'FAILED',
        verified: outcome.verified,
        output: outcome.output,
        error: outcome.error,
        errorCode: outcome.errorCode,
        checkpointId: outcome.checkpointId
      };
    } catch (err: any) {
      const completedAt = Date.now();
      const msg = err?.message || String(err);
      const isTimeout = msg.includes('TIMED_OUT') || msg.includes('timed out');
      const isCancel = msg.includes('CANCELLED') || msg.includes('ABORTED');

      return {
        actionId: proposal.actionId,
        toolName: proposal.toolName,
        taskId: proposal.taskId,
        sessionId: proposal.sessionId,
        status: isTimeout ? 'TIMED_OUT' : isCancel ? 'CANCELLED' : 'FAILED',
        outcomeStatus: isTimeout ? 'timed_out' : isCancel ? 'cancelled' : 'failed',
        permissionTier: decision.tier,
        startedAt,
        completedAt,
        durationMs: completedAt - startedAt,
        verificationStatus: 'FAILED',
        verified: false,
        error: msg,
        errorCode: isTimeout ? 'TIMED_OUT' : isCancel ? 'CANCELLED' : 'EXECUTION_ERROR'
      };
    }
  }

  private async raceWithTimeoutAndSignal<T>(
    promise: Promise<T>,
    timeoutMs: number,
    signal?: AbortSignal
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        reject(new Error(`TIMED_OUT: Tool execution exceeded timeout of ${timeoutMs}ms.`));
      }, timeoutMs);

      const onAbort = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(new Error('CANCELLED: Tool execution aborted via AbortSignal.'));
      };

      if (signal) {
        if (signal.aborted) {
          clearTimeout(timer);
          return reject(new Error('CANCELLED: Tool execution aborted via AbortSignal.'));
        }
        signal.addEventListener('abort', onAbort, { once: true });
      }

      promise
        .then(val => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (signal) signal.removeEventListener('abort', onAbort);
          resolve(val);
        })
        .catch(err => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (signal) signal.removeEventListener('abort', onAbort);
          reject(err);
        });
    });
  }

  private async executeUnderlyingTool(proposal: StructuredToolCallProposal): Promise<{
    status: StructuredToolExecutionResult['status'];
    verified: boolean;
    outcomeStatus?: TaskOutcomeStatus;
    output?: any;
    error?: string;
    errorCode?: string;
    checkpointId?: string;
  }> {
    const args = proposal.arguments || {};

    switch (proposal.toolName) {
      case 'atomic.read_file': {
        const res = this.fileEngine.readFile(args.filePath, {
          startLine: args.startLine,
          endLine: args.endLine,
          maxBytes: args.maxBytes
        });
        if (!res.success) {
          return {
            status: res.error?.includes('SECURITY_VIOLATION') ? 'BLOCKED' : 'FAILED',
            verified: false,
            error: res.error,
            errorCode: res.error?.includes('SECURITY_VIOLATION') ? 'PATH_VIOLATION' : 'READ_FAILED'
          };
        }
        return {
          status: 'COMPLETED',
          verified: true,
          output: res
        };
      }

      case 'atomic.list_dir': {
        const res = this.fileEngine.listDirectory(args.dirPath || '.');
        if (!res.success) {
          return {
            status: res.error?.includes('SECURITY_VIOLATION') ? 'BLOCKED' : 'FAILED',
            verified: false,
            error: res.error
          };
        }
        return {
          status: 'COMPLETED',
          verified: true,
          output: res
        };
      }

      case 'atomic.search_files': {
        const files = this.fileEngine.searchFiles(args.pattern || '*', args.maxResults ?? 50);
        return {
          status: 'COMPLETED',
          verified: true,
          output: { files, count: files.length }
        };
      }

      case 'atomic.search_code': {
        const matches = this.fileEngine.searchCode(args.query, args.maxResults ?? 40);
        return {
          status: 'COMPLETED',
          verified: true,
          output: { matches, count: matches.length }
        };
      }

      case 'atomic.write_file': {
        const res = this.fileEngine.writeFileAtomic(args.filePath, args.content, {
          expectedSha256: args.expectedSha256,
          sessionId: proposal.sessionId,
          taskId: proposal.taskId
        });
        if (!res.success) {
          return {
            status: res.errorCode === 'PATH_VIOLATION' ? 'BLOCKED' : 'FAILED',
            verified: false,
            output: res,
            error: res.error,
            errorCode: res.errorCode
          };
        }
        return {
          status: 'COMPLETED',
          verified: true,
          output: res,
          checkpointId: res.checkpointId
        };
      }

      case 'atomic.replace_string': {
        const res = this.fileEngine.replaceStringAtomic(args.filePath, args.target, args.replacement, {
          expectedMatches: args.expectedMatches,
          expectedSha256: args.expectedSha256,
          sessionId: proposal.sessionId,
          taskId: proposal.taskId
        });
        if (!res.success) {
          return {
            status: res.errorCode === 'PATH_VIOLATION' ? 'BLOCKED' : 'FAILED',
            verified: false,
            output: res,
            error: res.error,
            errorCode: res.errorCode
          };
        }
        return {
          status: 'COMPLETED',
          verified: true,
          output: res,
          checkpointId: res.checkpointId
        };
      }

      case 'atomic.apply_patch': {
        const res = this.fileEngine.applyPatchAtomic(args.filePath, args.hunks, {
          expectedSha256: args.expectedSha256,
          sessionId: proposal.sessionId,
          taskId: proposal.taskId
        });
        if (!res.success) {
          return {
            status: res.errorCode === 'PATH_VIOLATION' ? 'BLOCKED' : 'FAILED',
            verified: false,
            output: res,
            error: res.error,
            errorCode: res.errorCode
          };
        }
        return {
          status: 'COMPLETED',
          verified: true,
          output: res,
          checkpointId: res.checkpointId
        };
      }

      case 'shell.execute': {
        const res = await this.shellService.execute({
          command: args.command,
          args: args.args,
          cwd: args.cwd,
          timeoutMs: args.timeoutMs ?? proposal.timeoutMs,
          signal: proposal.signal
        });
        return {
          status: res.status,
          verified: res.success && res.exitCode === 0,
          output: res,
          error: res.error,
          errorCode: res.status !== 'COMPLETED' ? res.status : undefined
        };
      }

      case 'web.search': {
        const res = await this.webSearchService.search(args.query, {
          maxResults: args.maxResults,
          timeoutMs: proposal.timeoutMs
        });
        return {
          status: res.success ? 'COMPLETED' : 'FAILED',
          verified: res.success,
          output: res,
          error: res.error
        };
      }

      case 'web.fetch': {
        const res = await this.webSearchService.fetchPage(args.url, {
          timeoutMs: args.timeoutMs ?? proposal.timeoutMs,
          maxBytes: args.maxBytes
        });
        const isSsrfBlocked = Boolean(res.error && res.error.includes('SECURITY POLICY VIOLATION'));
        return {
          status: res.success ? 'COMPLETED' : isSsrfBlocked ? 'BLOCKED' : 'FAILED',
          verified: res.success,
          output: res,
          error: res.error,
          errorCode: isSsrfBlocked ? 'SSRF_BLOCKED' : undefined
        };
      }

      case 'reminder.create': {
        const res = await this.reminderService.createReminder({
          message: args.message,
          dueAt: args.dueAt,
          timeZone: args.timeZone
        });
        return {
          status: res.success ? 'COMPLETED' : 'FAILED',
          verified: res.success,
          output: res,
          error: res.error
        };
      }

      case 'reminder.list': {
        const list = this.reminderService.listReminders(args.status);
        return {
          status: 'COMPLETED',
          verified: true,
          output: { reminders: list, count: list.length }
        };
      }

      case 'reminder.cancel': {
        const res = this.reminderService.cancelReminder(args.id);
        return {
          status: res.success ? 'COMPLETED' : 'FAILED',
          verified: res.success,
          output: res,
          error: res.error
        };
      }

      case 'git.status': {
        const status = this.checkpointService.getGitStatus();
        return {
          status: 'COMPLETED',
          verified: status.isGitRepo,
          output: status
        };
      }

      case 'git.diff': {
        const diff = this.checkpointService.getGitDiff({
          filePath: args.filePath,
          staged: args.staged
        });
        return {
          status: diff.success ? 'COMPLETED' : 'FAILED',
          verified: diff.success,
          output: diff,
          error: diff.error
        };
      }

      case 'git.checkpoint': {
        const cp = this.checkpointService.createCheckpoint(args.label || 'agent-checkpoint');
        return {
          status: 'COMPLETED',
          verified: true,
          output: cp,
          checkpointId: cp.checkpointId
        };
      }

      case 'git.worktree': {
        const wt = this.checkpointService.manageWorktree({
          action: args.action,
          worktreePath: args.worktreePath,
          branch: args.branch
        });
        return {
          status: wt.success ? 'COMPLETED' : 'FAILED',
          verified: wt.success,
          output: wt,
          error: wt.error
        };
      }

      default: {
        // Delegate to canonical ToolService (PermissionGate has already validated & consumed any required approval token)
        const call: ToolCall & Record<string, any> = {
          id: proposal.actionId,
          toolId: proposal.toolName,
          toolName: proposal.toolName,
          arguments: proposal.arguments,
          timestamp: Date.now(),
          requiresUserApproval: proposal.requiresApproval
        };
        if (proposal.approvalStatus === 'APPROVED' || !proposal.requiresApproval) {
          SecurityPolicyMiddleware.bindCallApproval(call);
        }
        const res = await this.canonicalToolService.executeTool(call, { signal: proposal.signal });
        const isCancelled = Boolean(proposal.signal?.aborted) || /Execution CANCELLED/i.test(res.error || '');
        const isAuthReq = /AUTHORIZATION REQUIRED|PAUSED_FOR_USER_AUTH/i.test(res.error || '');
        const isVerified = res.verified === true || res.verificationStatus === 'VERIFIED';
        return {
          status: isCancelled
            ? 'CANCELLED'
            : isAuthReq
              ? 'AWAITING_APPROVAL'
              : res.success
                ? isVerified
                  ? 'COMPLETED'
                  : 'LAUNCHED_UNVERIFIED'
                : 'FAILED',
          verified: res.success && isVerified,
          outcomeStatus:
            res.outcomeStatus ||
            (isCancelled
              ? 'cancelled'
              : isAuthReq
                ? 'permission_required'
                : res.success
                  ? isVerified
                    ? 'completed_verified'
                    : 'launched_unverified'
                  : 'failed'),
          output: res.data ?? (res as any).output,
          error: res.error
        };
      }
    }
  }
}
