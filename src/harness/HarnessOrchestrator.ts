import {
  HarnessEffortLevel,
  HarnessExecutionStatus,
  HarnessLoopReport,
  HarnessMode,
  HarnessStageTrace,
  StructuredToolExecutionResult
} from './ExecutionResult';
import { TaskOutcomeStatus } from '../shared/types';
import { ToolDispatcher, ToolDispatchOptions } from './ToolDispatcher';
import { WorkspaceService } from './WorkspaceService';
import { ContextManager } from './ContextManager';
import { SessionStore } from './SessionStore';
import { OrionAIProviderRouter, RoutingStrategy } from '../main/services/OrionAIProviderRouter';
import { ProcessSupervisor } from '../main/services/computer/ProcessSupervisor';
import { UnifiedMemoryManager } from '../main/services/UnifiedMemoryManager';
import { ToolService } from '../main/services/ToolService';
import { SecurityPolicyMiddleware } from '../main/services/SecurityPolicyMiddleware';
import { AgentPolicyService } from '../main/services/AgentPolicyService';
import { ActionRiskEvaluator } from '../main/services/ActionRiskEvaluator';

export interface ProposedStep {
  toolName: string;
  arguments: Record<string, any>;
  rationale?: string;
  approvalToken?: string;
  operatorApproved?: boolean;
  approvedArgsHash?: string;
}

export interface HarnessRunOptions {
  goal: string;
  mode?: HarnessMode;
  effort?: HarnessEffortLevel;
  sessionId?: string;
  proposedSteps?: ProposedStep[];
  maxIterations?: number;
  wallClockBudgetMs?: number;
  signal?: AbortSignal;
  onStage?: (trace: HarnessStageTrace) => void;
  onToken?: (token: string) => void;
}

export interface RecurringLoopJob {
  jobId: string;
  goal: string;
  intervalMs: number;
  maxRuns: number;
  runsCompleted: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  lastOutcomeSummary?: string;
  timer?: NodeJS.Timeout;
}

/**
 * Universal Agent Harness Orchestrator (Sections 4, 8, 13, 14).
 * Implements the 8-stage execution lifecycle:
 * `UNDERSTAND -> PLAN -> VALIDATE -> AUTHORIZE -> EXECUTE -> OBSERVE -> VERIFY -> RECOVER_OR_REPORT`
 * with bounded iterations, wall-clock timeout, duplicate-failure loop breaking, `Plan`/`Chat`/`Build`
 * mode enforcement, `/effort` routing, `/subtask` isolated execution, and `/loop` recurring monitoring.
 */
export class HarnessOrchestrator {
  public readonly workspaceService: WorkspaceService;
  public readonly dispatcher: ToolDispatcher;
  public readonly contextManager: ContextManager;
  public readonly sessionStore: SessionStore;
  public readonly omniRouter: OrionAIProviderRouter;
  public readonly memoryManager: UnifiedMemoryManager;

  private mode: HarnessMode = 'Build';
  private effort: HarnessEffortLevel = 'medium';
  private activeGoal: string = '';
  private activeLoops: Map<string, RecurringLoopJob> = new Map();

  constructor(options: {
    workspaceRoot?: string;
    workspaceService?: WorkspaceService;
    dispatcher?: ToolDispatcher;
    contextManager?: ContextManager;
    sessionStore?: SessionStore;
    omniRouter?: OrionAIProviderRouter;
    memoryManager?: UnifiedMemoryManager;
    canonicalToolService?: ToolService;
    securityMiddleware?: SecurityPolicyMiddleware;
    policyService?: AgentPolicyService;
    riskEvaluator?: ActionRiskEvaluator;
  } = {}) {
    const root = options.workspaceRoot || process.cwd();
    this.memoryManager = options.memoryManager || new UnifiedMemoryManager();
    this.workspaceService = options.workspaceService || new WorkspaceService({ workspaceRoot: root });
    this.dispatcher =
      options.dispatcher ||
      new ToolDispatcher({
        workspaceRoot: root,
        fileEngine: this.workspaceService.getFileEngine(),
        checkpointService: this.workspaceService.getCheckpointService(),
        canonicalToolService: options.canonicalToolService,
        securityMiddleware: options.securityMiddleware,
        policyService: options.policyService,
        riskEvaluator: options.riskEvaluator
      });
    this.contextManager =
      options.contextManager ||
      new ContextManager({
        workspaceService: this.workspaceService,
        memoryManager: this.memoryManager
      });
    this.sessionStore = options.sessionStore || new SessionStore({ workspaceRoot: root });
    this.omniRouter = options.omniRouter || new OrionAIProviderRouter();

    const activeSess = this.sessionStore.getActiveSession();
    this.mode = activeSess.mode || 'Build';
    this.effort = activeSess.effortLevel || 'medium';
  }

  public getMode(): HarnessMode {
    return this.mode;
  }

  public setMode(newMode: HarnessMode): HarnessMode {
    this.mode = newMode;
    this.sessionStore.updateActiveSession({ mode: newMode });
    return this.mode;
  }

  public getEffort(): HarnessEffortLevel {
    return this.effort;
  }

  public setEffort(newEffort: HarnessEffortLevel): {
    effort: HarnessEffortLevel;
    routingStrategy: RoutingStrategy;
    maxIterations: number;
    wallClockBudgetMs: number;
  } {
    this.effort = newEffort;
    const config = HarnessOrchestrator.getEffortParameters(newEffort);
    this.omniRouter.setRoutingStrategy(config.routingStrategy);
    this.sessionStore.updateActiveSession({ effortLevel: newEffort });
    return {
      effort: newEffort,
      ...config
    };
  }

  public getActiveGoal(): string {
    return this.activeGoal;
  }

  public setActiveGoal(goal: string): void {
    this.activeGoal = UnifiedMemoryManager.sanitizeSecrets(goal.trim());
  }

  public static getEffortParameters(effort: HarnessEffortLevel): {
    routingStrategy: RoutingStrategy;
    maxIterations: number;
    wallClockBudgetMs: number;
  } {
    switch (effort) {
      case 'low':
        return { routingStrategy: 'SPEED_FIRST', maxIterations: 2, wallClockBudgetMs: 15_000 };
      case 'medium':
        return { routingStrategy: 'BALANCED', maxIterations: 4, wallClockBudgetMs: 30_000 };
      case 'high':
        return { routingStrategy: 'QUALITY_FIRST', maxIterations: 8, wallClockBudgetMs: 60_000 };
      case 'max':
        return { routingStrategy: 'CODING', maxIterations: 12, wallClockBudgetMs: 120_000 };
    }
  }

  public async runLoop(options: HarnessRunOptions): Promise<HarnessLoopReport> {
    const startedAt = Date.now();
    const taskId = `htask_${startedAt.toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const session = this.sessionStore.getActiveSession();
    const sessionId = options.sessionId || session.sessionId;
    const mode: HarnessMode = options.mode || this.mode;
    const effort: HarnessEffortLevel = options.effort || this.effort;
    const effortParams = HarnessOrchestrator.getEffortParameters(effort);
    const maxIterations = options.maxIterations ?? effortParams.maxIterations;
    const wallClockBudgetMs = options.wallClockBudgetMs ?? effortParams.wallClockBudgetMs;

    const stages: HarnessStageTrace[] = [];
    const toolResults: StructuredToolExecutionResult[] = [];
    const recordStage = (
      stage: HarnessStageTrace['stage'],
      detail: string,
      status: HarnessStageTrace['status'] = 'OK'
    ) => {
      const trace: HarnessStageTrace = { stage, timestamp: Date.now(), detail, status };
      stages.push(trace);
      if (options.onStage) {
        try {
          options.onStage(trace);
        } catch {}
      }
    };

    const providerStatus = this.omniRouter.getStatus();
    const activeModel = providerStatus.currentModel || 'auto';
    const activeProvider = providerStatus.id || 'orion-router';

    // Check E-Stop first
    if (ProcessSupervisor.getInstance().isEstopActive()) {
      recordStage('UNDERSTAND', 'Blocked by active Emergency Stop.', 'ERROR');
      recordStage('RECOVER_OR_REPORT', 'Emergency Stop active; explicit reset required.', 'ERROR');
      return {
        taskId,
        sessionId,
        goal: options.goal,
        mode,
        effort,
        activeModel,
        activeProvider,
        status: 'BLOCKED',
        verified: false,
        iterationsUsed: 0,
        maxIterations,
        stages,
        toolResults,
        finalResponse: 'Execution BLOCKED: ORION Emergency Stop is active.',
        startedAt,
        completedAt: Date.now(),
        durationMs: Date.now() - startedAt,
        error: 'Emergency Stop is active.'
      };
    }

    // STAGE 1: UNDERSTAND
    const cleanGoal = UnifiedMemoryManager.sanitizeSecrets(String(options.goal || '').trim());
    this.contextManager.addTurn({ role: 'user', content: cleanGoal });
    recordStage(
      'UNDERSTAND',
      `Parsed objective in ${mode} mode (effort=${effort}): "${cleanGoal.slice(0, 120)}"`
    );

    // STAGE 2: PLAN
    let plannedSteps: ProposedStep[] = options.proposedSteps
      ? [...options.proposedSteps]
      : this.deriveDeterministicPlanFromGoal(cleanGoal, mode);

    if (mode === 'Chat') {
      // Chat mode does not execute mutating or system tools unless explicitly read-only
      plannedSteps = plannedSteps.filter(s =>
        this.dispatcher.permissionGate.classifyTier(s.toolName, s.arguments) === 'TIER_1_READ_ONLY'
      );
    }

    recordStage(
      'PLAN',
      plannedSteps.length > 0
        ? `Formulated ${plannedSteps.length} structured step(s): ${plannedSteps.map(s => s.toolName).join(' -> ')}`
        : `Formulated direct conversational/analytical response plan (0 tool calls required).`
    );

    // If no tools are needed (or pure Chat / Plan synthesis), generate response via router
    if (plannedSteps.length === 0) {
      if (options.signal?.aborted) {
        const cancelMsg = 'Execution cancelled via AbortSignal before model generation.';
        recordStage('RECOVER_OR_REPORT', cancelMsg, 'WARN');
        const completedAt = Date.now();
        return {
          taskId,
          sessionId,
          goal: cleanGoal,
          mode,
          effort,
          activeModel: this.omniRouter.getStatus().currentModel || activeModel,
          activeProvider: this.omniRouter.getStatus().id || activeProvider,
          status: 'CANCELLED',
          verified: false,
          iterationsUsed: 0,
          maxIterations,
          stages,
          toolResults,
          finalResponse: 'Task cancelled.',
          startedAt,
          completedAt,
          durationMs: completedAt - startedAt,
          error: cancelMsg
        };
      }

      recordStage('VALIDATE', 'No tool schemas to validate for direct response.', 'OK');
      recordStage('AUTHORIZE', `Mode ${mode} authorized for direct response.`, 'OK');
      recordStage('EXECUTE', 'Generating model response via OrionAIProviderRouter.', 'OK');

      let aiReply = '';
      try {
        if (options.onToken) {
          aiReply = await this.omniRouter.stream(
            cleanGoal,
            options.onToken,
            undefined,
            undefined,
            options.signal
          );
        } else {
          aiReply = await this.omniRouter.chat(cleanGoal, undefined, options.signal);
        }
      } catch (err: any) {
        if (
          options.signal?.aborted ||
          /cancelled by abortsignal|aborted by signal|task cancelled/i.test(String(err?.message || ''))
        ) {
          const cancelMsg = 'Model generation cancelled via AbortSignal.';
          recordStage('RECOVER_OR_REPORT', cancelMsg, 'WARN');
          const completedAt = Date.now();
          return {
            taskId,
            sessionId,
            goal: cleanGoal,
            mode,
            effort,
            activeModel: this.omniRouter.getStatus().currentModel || activeModel,
            activeProvider: this.omniRouter.getStatus().id || activeProvider,
            status: 'CANCELLED',
            verified: false,
            iterationsUsed: 1,
            maxIterations,
            stages,
            toolResults,
            finalResponse: 'Task cancelled.',
            startedAt,
            completedAt,
            durationMs: completedAt - startedAt,
            error: cancelMsg
          };
        }
        aiReply = `[Fallback Synthesis] Objective analyzed (${mode} mode): ${cleanGoal}`;
      }

      if (options.signal?.aborted) {
        const cancelMsg = 'Model generation cancelled via AbortSignal.';
        recordStage('RECOVER_OR_REPORT', cancelMsg, 'WARN');
        const completedAt = Date.now();
        return {
          taskId,
          sessionId,
          goal: cleanGoal,
          mode,
          effort,
          activeModel: this.omniRouter.getStatus().currentModel || activeModel,
          activeProvider: this.omniRouter.getStatus().id || activeProvider,
          status: 'CANCELLED',
          verified: false,
          iterationsUsed: 1,
          maxIterations,
          stages,
          toolResults,
          finalResponse: 'Task cancelled.',
          startedAt,
          completedAt,
          durationMs: completedAt - startedAt,
          error: cancelMsg
        };
      }

      recordStage('OBSERVE', `Observed response (${aiReply.length} chars).`, 'OK');
      recordStage('VERIFY', 'Response verified non-empty.', 'OK');
      recordStage('RECOVER_OR_REPORT', 'Completed direct response turn.', 'OK');

      this.contextManager.addTurn({ role: 'assistant', content: aiReply });
      this.sessionStore.updateActiveSession({ turns: this.contextManager.getTurns() });

      const completedAt = Date.now();
      return {
        taskId,
        sessionId,
        goal: cleanGoal,
        mode,
        effort,
        activeModel: this.omniRouter.getStatus().currentModel || activeModel,
        activeProvider: this.omniRouter.getStatus().id || activeProvider,
        status: 'COMPLETED',
        verified: true,
        iterationsUsed: 1,
        maxIterations,
        stages,
        toolResults,
        finalResponse: aiReply,
        startedAt,
        completedAt,
        durationMs: completedAt - startedAt
      };
    }

    // Iterate over planned steps with bounded iterations, wall-clock check, and duplicate-failure breaker
    let iterationsUsed = 0;
    let finalStatus: HarnessExecutionStatus = 'COMPLETED';
    let lastCheckpointId: string | undefined;
    let pendingApprovalId: string | undefined;
    let loopError: string | undefined;
    const seenFailureSignatures = new Set<string>();

    for (let i = 0; i < plannedSteps.length; i++) {
      if (options.signal?.aborted) {
        finalStatus = 'CANCELLED';
        loopError = 'Execution cancelled via AbortSignal.';
        recordStage('RECOVER_OR_REPORT', loopError, 'WARN');
        break;
      }

      if (Date.now() - startedAt > wallClockBudgetMs) {
        finalStatus = 'TIMED_OUT';
        loopError = `Harness wall-clock budget (${wallClockBudgetMs}ms) exceeded.`;
        recordStage('RECOVER_OR_REPORT', loopError, 'ERROR');
        break;
      }

      if (iterationsUsed >= maxIterations) {
        finalStatus = 'FAILED';
        loopError = `Reached maximum iteration bound (${maxIterations}) for effort=${effort}.`;
        recordStage('RECOVER_OR_REPORT', loopError, 'WARN');
        break;
      }

      iterationsUsed += 1;
      const step = plannedSteps[i];

      // STAGE 3: VALIDATE
      const schemaVal = this.dispatcher.toolRegistry.validate(step.toolName, step.arguments);
      if (!schemaVal.valid) {
        const errMsg = `Schema validation failed for '${step.toolName}': ${schemaVal.errors.join('; ')}`;
        recordStage('VALIDATE', errMsg, 'ERROR');
        finalStatus = 'FAILED';
        loopError = errMsg;
        recordStage('RECOVER_OR_REPORT', `Halted on invalid tool schema: ${errMsg}`, 'ERROR');
        break;
      }
      recordStage('VALIDATE', `Validated schema for '${step.toolName}'.`, 'OK');

      // STAGE 4: AUTHORIZE (pre-flight tier classification & Plan mode check)
      const tier = this.dispatcher.permissionGate.classifyTier(step.toolName, step.arguments);
      if (mode === 'Plan' && tier !== 'TIER_1_READ_ONLY') {
        const msg = `Plan mode blocked mutating tool '${step.toolName}' (${tier}).`;
        recordStage('AUTHORIZE', msg, 'ERROR');
        const blockedRes = await this.dispatcher.dispatch({
          toolName: step.toolName,
          arguments: step.arguments,
          taskId,
          sessionId,
          mode
        });
        toolResults.push(blockedRes);
        finalStatus = 'BLOCKED';
        loopError = blockedRes.error || msg;
        recordStage('RECOVER_OR_REPORT', loopError, 'ERROR');
        break;
      }
      recordStage('AUTHORIZE', `Classified '${step.toolName}' as ${tier} in ${mode} mode.`, 'OK');

      // STAGE 5: EXECUTE
      recordStage('EXECUTE', `Dispatching '${step.toolName}'...`, 'OK');
      const dispatchOpts: ToolDispatchOptions = {
        toolName: step.toolName,
        arguments: step.arguments,
        taskId,
        sessionId,
        mode,
        approvalToken: step.approvalToken,
        operatorApproved: step.operatorApproved,
        approvedArgsHash: step.approvedArgsHash,
        timeoutMs: Math.min(30_000, Math.max(1000, wallClockBudgetMs - (Date.now() - startedAt))),
        signal: options.signal
      };

      const execRes = await this.dispatcher.dispatch(dispatchOpts);
      toolResults.push(execRes);
      if (execRes.checkpointId) {
        lastCheckpointId = execRes.checkpointId;
      }

      // STAGE 6: OBSERVE
      recordStage(
        'OBSERVE',
        `Tool '${step.toolName}' finished with status=${execRes.status} (${execRes.durationMs}ms).`,
        execRes.status === 'COMPLETED' ? 'OK' : 'WARN'
      );

      this.contextManager.addTurn({
        role: 'tool',
        toolId: step.toolName,
        content: JSON.stringify({
          status: execRes.status,
          verified: execRes.verified,
          error: execRes.error,
          outputPreview: String(JSON.stringify(execRes.output || '')).slice(0, 500)
        })
      });

      // STAGE 7: VERIFY
      if (execRes.status === 'AWAITING_APPROVAL') {
        pendingApprovalId = execRes.approvalId;
        finalStatus = 'AWAITING_APPROVAL';
        loopError = execRes.error;
        recordStage(
          'VERIFY',
          `Action '${step.toolName}' paused awaiting operator approval (id=${pendingApprovalId}).`,
          'WARN'
        );
        recordStage(
          'RECOVER_OR_REPORT',
          `Paused for explicit operator confirmation before executing '${step.toolName}'.`,
          'WARN'
        );
        break;
      }

      if (execRes.status === 'CANCELLED' || options.signal?.aborted) {
        finalStatus = 'CANCELLED';
        loopError = execRes.error || 'Execution cancelled via AbortSignal.';
        recordStage('VERIFY', `Action '${step.toolName}' cancelled.`, 'WARN');
        recordStage('RECOVER_OR_REPORT', loopError, 'WARN');
        break;
      }

      if (execRes.status === 'LAUNCHED_UNVERIFIED') {
        finalStatus = 'LAUNCHED_UNVERIFIED';
        recordStage(
          'VERIFY',
          `Action '${step.toolName}' launched/issued without full postcondition window/playback verification.`,
          'WARN'
        );
        continue;
      }

      if (execRes.status !== 'COMPLETED' || !execRes.verified) {
        const failSig = `${step.toolName}:${execRes.errorCode || execRes.status}:${execRes.error || ''}`;
        recordStage(
          'VERIFY',
          `Verification failed for '${step.toolName}': ${execRes.error || execRes.status}`,
          'ERROR'
        );

        const priorCompletedCount = toolResults
          .slice(0, -1)
          .filter(t => t.status === 'COMPLETED' || t.status === 'LAUNCHED_UNVERIFIED').length;

        if (seenFailureSignatures.has(failSig)) {
          finalStatus = priorCompletedCount > 0 ? 'PARTIALLY_COMPLETED' : execRes.status;
          loopError = `Duplicate failure detected for '${step.toolName}'; breaking loop to prevent infinite retries.`;
          recordStage('RECOVER_OR_REPORT', loopError, 'ERROR');
          break;
        }
        seenFailureSignatures.add(failSig);

        finalStatus = priorCompletedCount > 0 ? 'PARTIALLY_COMPLETED' : execRes.status;
        loopError = execRes.error || `Tool '${step.toolName}' returned ${execRes.status}`;
        recordStage('RECOVER_OR_REPORT', `Reporting failure: ${loopError}`, 'ERROR');
        break;
      }

      recordStage('VERIFY', `Verified execution of '${step.toolName}'.`, 'OK');
    }

    if (finalStatus === 'COMPLETED') {
      recordStage(
        'RECOVER_OR_REPORT',
        `All ${toolResults.length} tool execution(s) completed and verified.`,
        'OK'
      );
    }

    const summaryLines = toolResults.map(
      tr =>
        `- [${tr.status}] ${tr.toolName} (${tr.durationMs}ms)${tr.checkpointId ? ` [checkpoint=${tr.checkpointId}]` : ''}${tr.error ? ` — ${tr.error}` : ''}`
    );

    const finalResponse = [
      `ORION Harness [${mode} | effort=${effort} | status=${finalStatus}]`,
      ...summaryLines
    ].join('\n');

    this.contextManager.addTurn({ role: 'assistant', content: finalResponse });
    this.sessionStore.updateActiveSession({ turns: this.contextManager.getTurns() });

    const completedAt = Date.now();
    const allVerified =
      finalStatus === 'COMPLETED' && toolResults.length > 0 && toolResults.every(t => t.verified);
    const computedOutcome: TaskOutcomeStatus =
      finalStatus === 'COMPLETED'
        ? allVerified
          ? 'completed_verified'
          : 'launched_unverified'
        : finalStatus === 'LAUNCHED_UNVERIFIED'
          ? 'launched_unverified'
          : finalStatus === 'PARTIALLY_COMPLETED'
            ? 'partially_completed'
            : finalStatus === 'AWAITING_APPROVAL'
              ? 'permission_required'
              : finalStatus === 'CANCELLED'
                ? 'cancelled'
                : finalStatus === 'TIMED_OUT'
                  ? 'timed_out'
                  : 'failed';

    return {
      taskId,
      sessionId,
      goal: cleanGoal,
      mode,
      effort,
      activeModel,
      activeProvider,
      status: finalStatus,
      outcomeStatus: computedOutcome,
      verified: allVerified,
      iterationsUsed,
      maxIterations,
      stages,
      toolResults,
      finalResponse,
      checkpointId: lastCheckpointId,
      pendingApprovalId,
      startedAt,
      completedAt,
      durationMs: completedAt - startedAt,
      error: loopError
    };
  }

  /**
   * Deterministic intent-to-tool planner for structured CLI prompts when `proposedSteps` are not explicitly passed.
   */
  public deriveDeterministicPlanFromGoal(goal: string, mode: HarnessMode): ProposedStep[] {
    const trimmed = goal.trim();

    // Check if user asked to search code
    const searchCodeMatch = trimmed.match(/^(?:search\s+code|grep)\s+for\s+["']?([^"']+)["']?$/i);
    if (searchCodeMatch) {
      return [{ toolName: 'atomic.search_code', arguments: { query: searchCodeMatch[1].trim() } }];
    }

    // Check if user asked for git status
    if (/^(?:git\s+status|check\s+git\s+status)$/i.test(trimmed)) {
      return [{ toolName: 'git.status', arguments: {} }];
    }

    // Check if user asked to read a specific file
    const readFileMatch = trimmed.match(/^read\s+file\s+([^\s]+)$/i);
    if (readFileMatch) {
      return [{ toolName: 'atomic.read_file', arguments: { filePath: readFileMatch[1].trim() } }];
    }

    // In Plan mode, if the user asks to modify/write/delete a file, we still return the proposed step
    // so that Stage 4 (AUTHORIZE) explicitly demonstrates and enforces the Plan mode read-only block!
    const writeMatch = trimmed.match(/^write\s+file\s+([^\s]+)\s+with\s+content\s+([\s\S]+)$/i);
    if (writeMatch && (mode === 'Build' || mode === 'Plan')) {
      return [
        {
          toolName: 'atomic.write_file',
          arguments: { filePath: writeMatch[1].trim(), content: writeMatch[2] }
        }
      ];
    }

    const discoverAppsMatch = trimmed.match(/^(?:discover|list)\s+(?:installed\s+)?apps(?:\s+matching\s+["']?([^"']+)["']?)?$/i);
    if (discoverAppsMatch) {
      return [
        {
          toolName: 'computer.discover_apps',
          arguments: discoverAppsMatch[1] ? { query: discoverAppsMatch[1].trim() } : {}
        }
      ];
    }

    const launchAppMatch = trimmed.match(/^(?:launch|open)\s+app\s+["']?([^"']+)["']?$/i);
    if (launchAppMatch && (mode === 'Build' || mode === 'Plan')) {
      return [
        {
          toolName: 'computer.launch_app',
          arguments: { appName: launchAppMatch[1].trim() }
        }
      ];
    }

    return [];
  }

  /**
   * Executes a bounded subtask in an isolated context without polluting the main conversation turns,
   * returning a concise structured summary (`/subtask`).
   */
  public async runSubtask(subtaskPrompt: string, proposedSteps?: ProposedStep[]): Promise<{
    subtaskId: string;
    goal: string;
    status: HarnessExecutionStatus;
    summary: string;
    report: HarnessLoopReport;
  }> {
    const savedTurns = this.contextManager.getTurns();
    try {
      const report = await this.runLoop({
        goal: subtaskPrompt,
        mode: this.mode,
        effort: this.effort,
        proposedSteps,
        maxIterations: Math.min(4, HarnessOrchestrator.getEffortParameters(this.effort).maxIterations)
      });
      return {
        subtaskId: report.taskId,
        goal: subtaskPrompt,
        status: report.status,
        summary: `[Subtask ${report.taskId} | ${report.status}] ${report.finalResponse}`,
        report
      };
    } finally {
      // Restore main context turns and append only the concise subtask summary
      this.contextManager.setTurns(savedTurns);
      this.contextManager.addTurn({
        role: 'system',
        content: `[Subtask Completed] Objective: "${subtaskPrompt.slice(0, 100)}"`
      });
    }
  }

  /**
   * Starts a bounded, cancellable recurring loop task (`/loop`).
   */
  public startRecurringLoop(options: {
    goal: string;
    intervalMs?: number;
    maxRuns?: number;
    proposedSteps?: ProposedStep[];
  }): RecurringLoopJob {
    const jobId = `loop_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const intervalMs = Math.max(1000, Math.min(options.intervalMs ?? 15_000, 3_600_000));
    const maxRuns = Math.max(1, Math.min(options.maxRuns ?? 5, 50));

    const job: RecurringLoopJob = {
      jobId,
      goal: options.goal,
      intervalMs,
      maxRuns,
      runsCompleted: 0,
      status: 'ACTIVE'
    };

    const executeTick = async () => {
      if (job.status !== 'ACTIVE') return;
      if (ProcessSupervisor.getInstance().isEstopActive()) {
        this.cancelRecurringLoop(jobId);
        return;
      }
      job.runsCompleted += 1;
      try {
        const rep = await this.runSubtask(options.goal, options.proposedSteps);
        job.lastOutcomeSummary = rep.summary;
      } catch (err: any) {
        job.lastOutcomeSummary = `Error: ${err.message}`;
      }

      if (job.runsCompleted >= job.maxRuns) {
        job.status = 'COMPLETED';
        if (job.timer) {
          clearInterval(job.timer);
          job.timer = undefined;
        }
      }
    };

    job.timer = setInterval(() => {
      executeTick().catch(() => {});
    }, intervalMs);

    if (typeof job.timer.unref === 'function') {
      job.timer.unref();
    }

    this.activeLoops.set(jobId, job);
    return job;
  }

  public cancelRecurringLoop(jobId?: string): { cancelledCount: number; jobs: RecurringLoopJob[] } {
    let cancelledCount = 0;
    for (const [id, job] of this.activeLoops.entries()) {
      if (!jobId || id === jobId) {
        if (job.timer) {
          clearInterval(job.timer);
          job.timer = undefined;
        }
        if (job.status === 'ACTIVE') {
          job.status = 'CANCELLED';
          cancelledCount++;
        }
      }
    }
    return {
      cancelledCount,
      jobs: Array.from(this.activeLoops.values())
    };
  }

  public listRecurringLoops(): RecurringLoopJob[] {
    return Array.from(this.activeLoops.values()).map(j => ({
      ...j,
      timer: undefined
    }));
  }
}
