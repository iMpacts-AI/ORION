import fs from 'fs';
import path from 'path';
import os from 'os';
import dotenv from 'dotenv';
import { ToolService } from '../main/services/ToolService';
import { VisionService, CloudVisionAdapter } from '../main/services/VisionService';
import { VoiceService, WindowsNativeSTTProvider } from '../main/services/VoiceService';
import { OrionAIProviderRouter, ModelRegistry, RoutingStrategy } from '../main/services/OrionAIProviderRouter';
import { OrionOrchestrator, ProcessCommandResult } from '../main/services/OrionOrchestrator';
import { SystemMonitorService } from '../main/services/SystemMonitorService';
import { UnifiedMemoryManager } from '../main/services/UnifiedMemoryManager';
import { DefaultDeveloperAgentProvider } from '../main/platform/DeveloperAgentProvider';
import { McpClientService } from '../main/services/McpClientService';
import { SkillWorkflowEngine } from '../main/services/SkillWorkflowEngine';
import { ProcessSupervisor } from '../main/services/computer/ProcessSupervisor';
import { ActionRiskEvaluator } from '../main/services/ActionRiskEvaluator';
import { ComputerPermissionService } from '../main/services/computer/ComputerPermissionService';
import { AgentPolicyService } from '../main/services/AgentPolicyService';
import { OrionAgentSystem } from '../main/services/OrionAgentSystem';
import { SecurityPolicyMiddleware, PendingApprovalRequest } from '../main/services/SecurityPolicyMiddleware';
import { OrionLocalApiServer } from '../main/services/OrionLocalApiServer';
import { ZeroBureaucracyService } from '../main/services/ZeroBureaucracyService';
import { HarnessOrchestrator } from '../harness/HarnessOrchestrator';
import { CommandRegistry } from '../harness/CommandRegistry';
import { VisualPreferencesStore } from '../tui/VisualPreferences';
import {
  resolvePublicEngineIdentity,
  sanitizeConversationalResponse
} from '../shared/branding/OrionEngineIdentity';
import { eventBus } from '../shared/events';
import { ToolCall, ToolResult } from '../shared/types';
import { OrionCliRenderer } from './OrionCliRenderer';

export type ApprovalCallback = (request: {
  toolId: string;
  toolName: string;
  riskLevel: string;
  arguments: Record<string, any>;
  reason: string;
}) => Promise<boolean>;

export class OrionCliKernel {
  public readonly projectRoot: string;
  public readonly renderer: OrionCliRenderer;
  public readonly omniRouter: OrionAIProviderRouter;
  public readonly modelRegistry: ModelRegistry;
  public readonly toolService: ToolService;
  public readonly visionService: VisionService;
  public readonly voiceService: VoiceService;
  public readonly orchestrator: OrionOrchestrator;
  public readonly systemMonitor: SystemMonitorService;
  public readonly unifiedMemory: UnifiedMemoryManager;
  public readonly developerAgent: DefaultDeveloperAgentProvider;
  public readonly mcpClient: McpClientService;
  public readonly workflowEngine: SkillWorkflowEngine;
  public readonly riskEvaluator: ActionRiskEvaluator;
  public readonly permissionService: ComputerPermissionService;
  public readonly policyService: AgentPolicyService;
  public readonly agentSystem: OrionAgentSystem;
  public readonly securityMiddleware: SecurityPolicyMiddleware;
  public readonly localApiServer: OrionLocalApiServer;
  public readonly hackathonService: ZeroBureaucracyService;
  public readonly harness: HarnessOrchestrator;
  public readonly visualPreferences: VisualPreferencesStore;
  public readonly commandRegistry: CommandRegistry;

  private unsubscribers: Array<() => void> = [];
  private activeAbortController: AbortController | null = null;
  private taskCancellationState: 'idle' | 'running' | 'cancelling' | 'cancelled' = 'idle';
  private taskStateListeners: Set<
    (state: 'idle' | 'running' | 'cancelling' | 'cancelled', reason?: string) => void
  > = new Set();
  private stepCounter = 0;
  private approvalCallback?: ApprovalCallback;
  private initDurationMs = 0;

  constructor(options: {
    projectRoot?: string;
    renderer?: OrionCliRenderer;
    approvalCallback?: ApprovalCallback;
    mcpConfigPath?: string;
  } = {}) {
    const startInit = performance.now();
    this.projectRoot = options.projectRoot || process.cwd();
    this.renderer = options.renderer || new OrionCliRenderer();
    this.approvalCallback = options.approvalCallback;

    this.loadEnvironment();

    this.systemMonitor = new SystemMonitorService();
    this.unifiedMemory = new UnifiedMemoryManager();
    this.omniRouter = new OrionAIProviderRouter();
    this.modelRegistry = new ModelRegistry();
    this.riskEvaluator = new ActionRiskEvaluator();
    this.securityMiddleware = SecurityPolicyMiddleware.getInstance();
    this.policyService = new AgentPolicyService(this.projectRoot);

    this.toolService = new ToolService();
    this.permissionService = this.toolService.getComputerUseService().getPermissionService();
    this.toolService.setUnifiedMemory(this.unifiedMemory);
    this.toolService.getComputerUseService().getPlanner().setAIProvider(this.omniRouter);

    this.mcpClient = new McpClientService(this.toolService.getRegistry(), options.mcpConfigPath);
    this.wrapToolServiceWithPermissionsAndMcp();
    this.workflowEngine = new SkillWorkflowEngine(this.toolService, this.riskEvaluator);

    this.developerAgent = new DefaultDeveloperAgentProvider(this.toolService);
    this.voiceService = new VoiceService(new WindowsNativeSTTProvider());
    const cloudVisionAdapter = new CloudVisionAdapter(this.omniRouter);
    this.visionService = new VisionService(cloudVisionAdapter);
    this.orchestrator = new OrionOrchestrator(
      this.toolService,
      this.visionService,
      this.voiceService,
      this.omniRouter
    );

    this.agentSystem = new OrionAgentSystem(
      this.policyService,
      this.toolService,
      this.omniRouter,
      this.orchestrator.getTraceService()
    );
    this.localApiServer = new OrionLocalApiServer(this.omniRouter);
    this.hackathonService = ZeroBureaucracyService.getInstance();
    this.hackathonService.setTraceService(this.orchestrator.getTraceService());

    this.harness = new HarnessOrchestrator({
      workspaceRoot: this.projectRoot,
      omniRouter: this.omniRouter,
      memoryManager: this.unifiedMemory,
      canonicalToolService: this.toolService,
      securityMiddleware: this.securityMiddleware,
      policyService: this.policyService,
      riskEvaluator: this.riskEvaluator
    });
    this.visualPreferences = new VisualPreferencesStore({
      workspaceRoot: this.projectRoot,
      initialFallbackVividMode: this.harness.sessionStore.getActiveSession().vividMode
    });
    this.commandRegistry = new CommandRegistry({
      kernel: this,
      harness: this.harness
    });

    this.registerEventListeners();
    this.initDurationMs = Math.round(performance.now() - startInit);
  }

  public getInitDurationMs(): number {
    return this.initDurationMs;
  }

  public setApprovalCallback(cb: ApprovalCallback): void {
    this.approvalCallback = cb;
  }

  private loadEnvironment(): void {
    const candidates = [
      path.resolve(this.projectRoot, '.env'),
      path.resolve(process.cwd(), '.env'),
      path.resolve(os.homedir(), '.env')
    ];
    const found = candidates.find(p => fs.existsSync(p));
    if (found) {
      dotenv.config({ path: found });
    }
  }

  /**
   * Integrates CLI human-in-the-loop approval gates, action-bound approval tokens,
   * and MCP tool routing directly into the authoritative ToolService execution path.
   */
  private wrapToolServiceWithPermissionsAndMcp(): void {
    const origExecute = this.toolService.executeTool.bind(this.toolService);

    this.toolService.executeTool = async (
      call: ToolCall,
      execOpts?: { signal?: AbortSignal }
    ): Promise<ToolResult> => {
      const startTime = Date.now();
      const activeSignal = execOpts?.signal || this.activeAbortController?.signal;
      if (activeSignal?.aborted || this.taskCancellationState === 'cancelling') {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: false,
          outcomeStatus: 'cancelled',
          verificationStatus: 'FAILED',
          verified: false,
          error: 'Execution CANCELLED: Task cancelled by operator via Escape.',
          timestamp: Date.now(),
          executionTimeMs: Date.now() - startTime
        };
      }
      const tool = this.toolService.getRegistry().getTool(call.toolId);

      if (!tool) {
        return await origExecute(call);
      }

      // Check Emergency Stop
      if (this.permissionService.isEmergencyStopped() || ProcessSupervisor.getInstance().isEstopActive()) {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: false,
          outcomeStatus: 'failed',
          verificationStatus: 'FAILED',
          verified: false,
          error: 'Execution BLOCKED: ORION Emergency Stop is active.',
          timestamp: Date.now(),
          executionTimeMs: Date.now() - startTime
        };
      }

      // Evaluate path/target risk independently via ActionRiskEvaluator (including nested computer.execute_action payloads)
      const nestedAction = call.arguments?.action;
      const targetPath = String(
        call.arguments?.filePath ||
        call.arguments?.dirPath ||
        call.arguments?.path ||
        call.arguments?.command ||
        call.arguments?.selector ||
        nestedAction?.target ||
        nestedAction?.payload?.filePath ||
        nestedAction?.parameters?.filePath ||
        ''
      );
      const { mappedActionType } = this.riskEvaluator.classifyToolEffect(call.toolId, tool, call.arguments);

      const evaluatedRisk = this.riskEvaluator.evaluateRisk(
        mappedActionType as any,
        nestedAction ? nestedAction.payload : call.arguments,
        nestedAction ? nestedAction.parameters : call.arguments,
        targetPath
      );

      if (evaluatedRisk === 'CRITICAL' || tool.permissionLevel === 'CRITICAL') {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: false,
          outcomeStatus: 'failed',
          verificationStatus: 'FAILED',
          verified: false,
          error: `SECURITY POLICY VIOLATION: Critical or restricted target '${targetPath || call.toolId}' is strictly blocked by ORION safety policy.`,
          timestamp: Date.now(),
          executionTimeMs: Date.now() - startTime
        };
      }

      // Normalize legacy path aliases and enforce mandatory schema validation BEFORE creating or consuming approval tokens
      if (call.arguments && typeof call.arguments === 'object') {
        if ((call.toolId === 'file.read_text' || call.toolId === 'file.write_text') && !call.arguments.filePath && typeof call.arguments.path === 'string') {
          call.arguments.filePath = call.arguments.path;
        }
        if (call.toolId === 'file.list_directory' && !call.arguments.dirPath && typeof call.arguments.path === 'string') {
          call.arguments.dirPath = call.arguments.path;
        }
      }
      const schemaValidation = this.toolService.getRegistry().validateToolArguments(call.toolId, call.arguments);
      if (!schemaValidation.valid) {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: false,
          outcomeStatus: 'failed',
          verificationStatus: 'FAILED',
          verified: false,
          error: `SCHEMA VALIDATION FAILED: ${schemaValidation.errors.join(' ')}`,
          timestamp: Date.now(),
          executionTimeMs: Date.now() - startTime
        };
      }

      // Enforce Agent Least-Privilege Allowlist & Permission Ceiling before approval prompts (without consuming token yet)
      const prePolicyCheck = this.securityMiddleware.verifyToolExecution({
        tool,
        call,
        agentAllowedTools: (call as any).agentAllowedTools,
        agentMaxPermissionLevel: (call as any).agentMaxPermissionLevel,
        isEmergencyStopped: this.permissionService.isEmergencyStopped(),
        consumeToken: false
      });
      if (!prePolicyCheck.allowed && !prePolicyCheck.requiresApproval) {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: false,
          outcomeStatus: 'failed',
          verificationStatus: 'FAILED',
          verified: false,
          error: prePolicyCheck.reason || `Execution denied by ORION Security Policy Middleware.`,
          timestamp: Date.now(),
          executionTimeMs: Date.now() - startTime
        };
      }

      // Require explicit operator approval for HIGH permission tools or HIGH_RISK actions (when not pre-approved with a valid bound hash/token)
      const needsApproval =
        tool.permissionLevel === 'HIGH' ||
        tool.requiresApproval === true ||
        call.requiresUserApproval === true ||
        (call.toolId === 'system.control' && call.arguments?.action === 'lock') ||
        (call.toolId !== 'file.write_text' && evaluatedRisk === 'HIGH_RISK');

      const currentBindingHash = SecurityPolicyMiddleware.computeActionBindingHash(call.toolId, call.arguments || {});
      const hasValidBoundCallFlag = Boolean(
        (call as any).operatorApproved &&
        (call as any).__approvedArgsHash &&
        (call as any).__approvedArgsHash === currentBindingHash
      );
      const hasPreApprovedToken = this.securityMiddleware.hasMatchingApproval(
        tool.id,
        call.arguments,
        call.arguments?.approvalToken || (call as any).approvalToken
      );

      if (needsApproval && !hasValidBoundCallFlag && !hasPreApprovedToken) {
        if (!this.approvalCallback) {
          // Record pending approval so operator can inspect/approve via /approve or /deny
          const pending: PendingApprovalRequest = this.securityMiddleware.createApprovalRequest({
            tool,
            arguments: call.arguments || {},
            evaluatedRisk: String(evaluatedRisk),
            agentId: (call as any).agentId || this.agentSystem?.getActiveAgentId() || 'core',
            reason: `Tool '${tool.id}' (${tool.permissionLevel}) requires explicit operator approval.`
          });
          return {
            toolCallId: call.id,
            toolId: call.toolId,
            success: false,
            outcomeStatus: 'permission_required',
            verificationStatus: 'FAILED',
            verified: false,
            error: `AUTHORIZATION REQUIRED [approvalId=${pending.approvalId}]: Tool '${tool.id}' (${tool.permissionLevel}) requires operator approval, which was not granted in non-interactive mode. Use '/approve ${pending.approvalId}' or '/deny ${pending.approvalId}'.`,
            data: { pendingApprovalId: pending.approvalId, requiresConfirmation: true },
            timestamp: Date.now(),
            executionTimeMs: Date.now() - startTime
          };
        }

        const approved = await this.approvalCallback({
          toolId: tool.id,
          toolName: tool.name,
          riskLevel: tool.permissionLevel,
          arguments: call.arguments || {},
          reason: `Tool '${tool.id}' has permission level ${tool.permissionLevel}.`
        });

        if (!approved) {
          const pending: PendingApprovalRequest = this.securityMiddleware.createApprovalRequest({
            tool,
            arguments: call.arguments || {},
            evaluatedRisk: String(evaluatedRisk),
            agentId: (call as any).agentId || this.agentSystem?.getActiveAgentId() || 'core',
            reason: `Tool '${tool.id}' (${tool.permissionLevel}) requires explicit operator approval.`
          });
          return {
            toolCallId: call.id,
            toolId: call.toolId,
            success: false,
            outcomeStatus: 'permission_required',
            verificationStatus: 'FAILED',
            verified: false,
            error: `AUTHORIZATION REQUIRED [approvalId=${pending.approvalId}]: Operator approval was not granted for tool '${tool.id}'. Use '/approve ${pending.approvalId}' or '/deny ${pending.approvalId}'.`,
            data: { pendingApprovalId: pending.approvalId, requiresConfirmation: true },
            timestamp: Date.now(),
            executionTimeMs: Date.now() - startTime
          };
        }

        SecurityPolicyMiddleware.bindCallApproval(call);
      }

      // Delegate namespaced MCP tools (mcp.<server>.<tool>) to McpClientService after consuming bound approval and validating schema
      if (tool.id.startsWith('mcp.')) {
        const finalMcpCheck = this.securityMiddleware.verifyToolExecution({
          tool,
          call,
          agentAllowedTools: (call as any).agentAllowedTools,
          agentMaxPermissionLevel: (call as any).agentMaxPermissionLevel,
          isEmergencyStopped: this.permissionService.isEmergencyStopped(),
          consumeToken: true
        });
        if (!finalMcpCheck.allowed) {
          return {
            toolCallId: call.id,
            toolId: call.toolId,
            success: false,
            outcomeStatus: 'permission_required',
            verificationStatus: 'FAILED',
            verified: false,
            error: finalMcpCheck.reason || `Authorization denied for MCP tool '${tool.id}'.`,
            timestamp: Date.now(),
            executionTimeMs: Date.now() - startTime
          };
        }
        const parts = tool.id.split('.');
        const serverName = parts[1];
        const mcpToolName = parts.slice(2).join('.');
        return await this.mcpClient.callTool(serverName, mcpToolName, call.arguments || {});
      }

      return await origExecute(call, { signal: activeSignal });
    };
  }

  private registerEventListeners(): void {
    this.unsubscribers.push(
      eventBus.subscribe('assistant.tool.started', ({ toolCall }) => {
        this.stepCounter++;
        this.renderer.renderToolStarted(this.stepCounter, toolCall);
      }),
      eventBus.subscribe('assistant.tool.completed', ({ result }) => {
        this.renderer.renderToolCompleted(result);
      }),
      eventBus.subscribe('assistant.tool.failed', ({ toolCallId, error }) => {
        this.renderer.renderToolCompleted({
          toolCallId,
          toolId: toolCallId,
          success: false,
          verificationStatus: 'FAILED',
          verified: false,
          error,
          timestamp: Date.now(),
          executionTimeMs: 0
        });
      }),
      eventBus.subscribe('ai.failover.started', ({ failedProviderId }) => {
        this.renderer.renderProviderFailover(failedProviderId);
      })
    );
  }

  public getTaskExecutionState(): 'idle' | 'running' | 'cancelling' | 'cancelled' {
    return this.taskCancellationState;
  }

  public onTaskStateChange(
    listener: (state: 'idle' | 'running' | 'cancelling' | 'cancelled', reason?: string) => void
  ): () => void {
    this.taskStateListeners.add(listener);
    return () => {
      this.taskStateListeners.delete(listener);
    };
  }

  private setTaskExecutionState(
    nextState: 'idle' | 'running' | 'cancelling' | 'cancelled',
    reason?: string
  ): void {
    this.taskCancellationState = nextState;
    for (const listener of this.taskStateListeners) {
      try {
        listener(nextState, reason);
      } catch {}
    }
  }

  public beginForegroundTask(externalSignal?: AbortSignal): AbortSignal {
    this.activeAbortController = new AbortController();
    this.setTaskExecutionState('running');
    if (externalSignal) {
      if (externalSignal.aborted) {
        this.activeAbortController.abort(externalSignal.reason || new Error('Task cancelled by operator'));
      } else {
        externalSignal.addEventListener(
          'abort',
          () => {
            this.cancelActiveTask('Cancelled via external AbortSignal').catch(() => {});
          },
          { once: true }
        );
      }
    }
    return this.activeAbortController.signal;
  }

  public endForegroundTask(): void {
    this.activeAbortController = null;
    if (this.taskCancellationState === 'running') {
      this.setTaskExecutionState('idle');
    }
  }

  public async executePrompt(
    query: string,
    options?: {
      streamTokens?: boolean;
      onToken?: (token: string) => void;
      signal?: AbortSignal;
    }
  ): Promise<ProcessCommandResult> {
    this.stepCounter = 0;
    const taskSignal = this.beginForegroundTask(options?.signal);

    // E-Stop is authoritative: never auto-reset E-Stop merely because a new prompt arrives
    if (ProcessSupervisor.getInstance().isEstopActive() || this.permissionService.isEmergencyStopped()) {
      const estopMsg = 'Execution BLOCKED: ORION Emergency Stop is active. Explicit operator reset ("/permissions reset") is required before executing new commands.';
      this.renderer.renderError(estopMsg);
      return {
        query,
        response: estopMsg,
        toolCallsExecuted: [],
        toolResults: [],
        success: false,
        state: 'STANDBY',
        metrics: {
          totalCommandLatencyMs: 0,
          intentClassificationLatencyMs: 0,
          planningLatencyMs: 0,
          toolExecutionLatencyMs: 0,
          visionCaptureLatencyMs: 0,
          visionAnalysisLatencyMs: 0,
          aiTtftMs: 0,
          aiTotalGenerationLatencyMs: 0,
          failoverCount: 0,
          retryCount: 0,
          replanningCount: 0
        }
      };
    }

    const activeTasksBefore = this.orchestrator.getTaskSupervisor().getAllTasks().length;
    const taskLabel = `task_${activeTasksBefore + 1}`;
    this.renderer.renderTaskStart(taskLabel, query);

    const openMatch = query.trim().match(/^(?:open|launch|start)\s+([a-zA-Z0-9_.\-\s]{2,30})$/i);
    const requestedAppTarget = openMatch
      ? openMatch[1].replace(/\b(and|then|to|in|with|now)\b.*$/i, '').trim()
      : null;
    if (requestedAppTarget) {
      this.renderer.appsTracker.setApplicationState(requestedAppTarget, 'Launching', 'Starting process...');
    }

    await this.omniRouter.ensureInitialized(1200);

    const shouldStreamToTerminal = Boolean(options?.streamTokens) && !this.renderer.isJsonMode();
    let startedTerminalStream = false;

    this.recordSessionTaskCheckpoint({
      taskId: taskLabel,
      query: this.renderer.sanitize(query),
      status: 'INTERRUPTED',
      toolsUsed: [],
      responsePreview: 'Task started; awaiting completion...',
      timestamp: Date.now()
    });

    const tokenHandler =
      options?.onToken || shouldStreamToTerminal
        ? (token: string) => {
            if (options?.onToken) {
              options.onToken(token);
            }
            if (shouldStreamToTerminal) {
              if (!startedTerminalStream) {
                const active = this.omniRouter.getStatus();
                this.renderer.startStream(active.id, active.currentModel);
                startedTerminalStream = true;
              }
              this.renderer.writeStreamToken(token);
            }
          }
        : undefined;

    try {
      const result = await this.orchestrator.processCommand(query, 'TEXT', {
        onToken: tokenHandler,
        signal: taskSignal
      });
      result.response = sanitizeConversationalResponse(result.response, {
        workspaceRoot: this.projectRoot,
        redactProviderIds: true
      });

      if (startedTerminalStream) {
        this.renderer.endStream();
      }

      const wasCancelled =
        taskSignal.aborted ||
        this.taskCancellationState === 'cancelling' ||
        this.taskCancellationState === 'cancelled' ||
        result.response === 'Task cancelled.';

      if (wasCancelled) {
        this.setTaskExecutionState('cancelled', 'Task cancelled.');
        if (requestedAppTarget) {
          this.renderer.appsTracker.setApplicationState(
            requestedAppTarget,
            'Unknown',
            'Launch cancelled by operator'
          );
          this.renderer.renderActiveApplicationsBar();
        }
        this.recordSessionTaskCheckpoint({
          taskId: taskLabel,
          query: this.renderer.sanitize(query),
          status: 'INTERRUPTED',
          toolsUsed: result.toolCallsExecuted.map(t => t.toolId),
          responsePreview: 'Task cancelled by operator.',
          timestamp: Date.now()
        });
        if (!this.renderer.isJsonMode()) {
          this.renderer.renderWarning('Task cancelled.');
        }
        return {
          ...result,
          success: false,
          response: 'Task cancelled.'
        };
      }

      if (requestedAppTarget) {
        const anyVerified = result.toolResults?.some(
          tr => tr.verificationStatus === 'VERIFIED' || tr.verified === true
        );
        if (result.success && anyVerified) {
          this.renderer.appsTracker.setApplicationState(requestedAppTarget, 'Open');
        } else if (!result.success) {
          this.renderer.appsTracker.setApplicationState(
            requestedAppTarget,
            'Launch failed',
            result.response || 'Application launch failed'
          );
        } else {
          this.renderer.appsTracker.setApplicationState(
            requestedAppTarget,
            'Unknown',
            'Unverified window state'
          );
        }
        this.renderer.renderActiveApplicationsBar();
      }

      // Record in UnifiedMemoryManager without leaking secrets
      this.unifiedMemory.addMemory(
        'EPISODIC',
        `Query: ${this.renderer.sanitize(query)} | Outcome: ${result.success ? 'SUCCESS' : 'FAILED'} | Tools: ${result.toolCallsExecuted.map(t => t.toolId).join(', ') || 'none'}`,
        ['cli', result.success ? 'success' : 'failed'],
        'TRUSTED_SYSTEM'
      );

      this.recordSessionTaskCheckpoint({
        taskId: taskLabel,
        query: this.renderer.sanitize(query),
        status: result.success ? 'COMPLETED' : 'FAILED',
        toolsUsed: result.toolCallsExecuted.map(t => t.toolId),
        responsePreview: this.renderer.truncate(this.renderer.sanitize(result.response), 180),
        timestamp: Date.now()
      });

      const activeProvider = this.omniRouter.getStatus();
      const publicIdentity = resolvePublicEngineIdentity(
        activeProvider.id,
        activeProvider.currentModel
      );
      if (this.renderer.isJsonMode()) {
        this.renderer.writeJson({
          query: result.query,
          response: result.response,
          success: result.success,
          activeAgent: this.agentSystem.getActiveAgentId(),
          engine: publicIdentity.publicLabel,
          provider: `${activeProvider.id}:${activeProvider.currentModel}`,
          toolCallsExecuted: result.toolCallsExecuted,
          toolResults: result.toolResults,
          metrics: result.metrics
        });
      } else if (!startedTerminalStream || !result.success) {
        this.renderer.renderAssistantResponse(
          result.response,
          result.metrics.totalCommandLatencyMs,
          publicIdentity.publicLabel
        );
      }

      return result;
    } finally {
      if (startedTerminalStream) {
        this.renderer.endStream();
      }
      this.endForegroundTask();
    }
  }

  /**
   * Normal Escape-to-Cancel task cancellation (Part 2, Sections 5-11).
   * Transitions state `running -> cancelling -> cancelled`, aborts active model/tool/browser/shell
   * operations, and terminates task child processes WITHOUT activating global Emergency Stop lockdown.
   * Safe and idempotent on repeated Escape presses or when idle.
   */
  public async cancelActiveTask(
    reason: string = 'Task cancelled by operator via Escape'
  ): Promise<{
    cancelled: boolean;
    alreadyCancelling: boolean;
    terminatedProcesses: number;
    state: 'idle' | 'running' | 'cancelling' | 'cancelled';
  }> {
    if (this.taskCancellationState === 'cancelling') {
      return {
        cancelled: false,
        alreadyCancelling: true,
        terminatedProcesses: 0,
        state: 'cancelling'
      };
    }

    const hasRunningTasks =
      this.activeAbortController !== null ||
      this.taskCancellationState === 'running' ||
      this.orchestrator
        .getTaskSupervisor()
        .getAllTasks()
        .some(t => t.status === 'RUNNING') ||
      ProcessSupervisor.getInstance().getActiveProcessCount() > 0;

    if (!hasRunningTasks) {
      return {
        cancelled: false,
        alreadyCancelling: false,
        terminatedProcesses: 0,
        state: this.taskCancellationState
      };
    }

    this.setTaskExecutionState('cancelling', 'Cancellation requested...');

    if (this.activeAbortController) {
      try {
        this.activeAbortController.abort(new Error(reason));
      } catch {}
      this.activeAbortController = null;
    }

    try {
      this.toolService.getBrowserProvider().cancelActiveTask();
    } catch {}
    try {
      this.harness.dispatcher.canonicalToolService.getBrowserProvider().cancelActiveTask();
    } catch {}

    const procRes = await ProcessSupervisor.getInstance().cancelActiveProcesses(reason);

    const runningTasks = this.orchestrator
      .getTaskSupervisor()
      .getAllTasks()
      .filter(t => t.status === 'RUNNING');
    for (const t of runningTasks) {
      this.orchestrator.getTaskSupervisor().cancelTask(t.taskId);
    }

    this.setTaskExecutionState('cancelled', 'Task cancelled.');
    return {
      cancelled: true,
      alreadyCancelling: false,
      terminatedProcesses: procRes.terminatedCount,
      state: 'cancelled'
    };
  }

  public async cancelActiveOperation(): Promise<{ terminatedProcesses: number }> {
    this.setTaskExecutionState('cancelling', 'Emergency Stop requested...');
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }
    try {
      this.toolService.getBrowserProvider().cancelActiveTask();
    } catch {}
    this.permissionService.triggerEmergencyStop();
    const estopRes = await ProcessSupervisor.getInstance().triggerEstop();

    // Cancel any running tasks in TaskSupervisor
    const runningTasks = this.orchestrator.getTaskSupervisor().getAllTasks().filter(t => t.status === 'RUNNING');
    for (const t of runningTasks) {
      this.orchestrator.getTaskSupervisor().cancelTask(t.taskId);
    }

    this.setTaskExecutionState('cancelled', 'Emergency Stop active.');
    return { terminatedProcesses: estopRes.terminatedCount };
  }

  public isBusy(): boolean {
    return this.activeAbortController !== null || this.taskCancellationState === 'running' || this.taskCancellationState === 'cancelling';
  }

  public setRoutingStrategy(strategy: RoutingStrategy): void {
    this.omniRouter.setRoutingStrategy(strategy);
  }

  public getSessionResumeFilePath(): string {
    return path.join(this.projectRoot, '.orion_memory', 'session_resume_state.json');
  }

  public recordSessionTaskCheckpoint(entry: {
    taskId: string;
    query: string;
    status: 'COMPLETED' | 'FAILED' | 'INTERRUPTED' | 'PENDING';
    toolsUsed: string[];
    responsePreview: string;
    timestamp: number;
  }): void {
    try {
      const filePath = this.getSessionResumeFilePath();
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      let existingTasks: Array<typeof entry> = [];
      let sessionId = `sess_${Date.now().toString(36)}`;
      if (fs.existsSync(filePath)) {
        try {
          const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (parsed && typeof parsed === 'object') {
            if (typeof parsed.sessionId === 'string') sessionId = parsed.sessionId;
            if (Array.isArray(parsed.recentTasks)) {
              existingTasks = parsed.recentTasks.filter((t: any) => t && t.taskId !== entry.taskId);
            }
          }
        } catch {}
      }
      const sanitizedEntry = {
        taskId: this.renderer.sanitize(entry.taskId),
        query: this.renderer.sanitize(entry.query),
        status: entry.status,
        toolsUsed: (entry.toolsUsed || []).map(t => this.renderer.sanitize(t)),
        responsePreview: this.renderer.sanitize(entry.responsePreview),
        timestamp: entry.timestamp
      };
      const recentTasks = [...existingTasks, sanitizedEntry].slice(-25);
      const activeStatus = this.omniRouter.getStatus();
      const payload = {
        schemaVersion: '1.0.0',
        sessionId,
        updatedAt: new Date().toISOString(),
        activeAgentId: this.agentSystem.getActiveAgentId(),
        activeProvider: activeStatus.id,
        activeModel: activeStatus.currentModel,
        routingStrategy: this.omniRouter.getRoutingStrategy(),
        modelChain: this.omniRouter.getModelChain(),
        lastTask: sanitizedEntry,
        recentTasks
      };
      fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
    } catch {}
  }

  public getSessionResumeState(): {
    exists: boolean;
    corrupted: boolean;
    filePath: string;
    error?: string;
    state?: {
      schemaVersion: string;
      sessionId: string;
      updatedAt: string;
      activeAgentId: string;
      activeProvider: string;
      activeModel: string;
      routingStrategy: string;
      modelChain: string[];
      lastTask: {
        taskId: string;
        query: string;
        status: 'COMPLETED' | 'FAILED' | 'INTERRUPTED' | 'PENDING';
        toolsUsed: string[];
        responsePreview: string;
        timestamp: number;
      } | null;
      recentTasks: Array<{
        taskId: string;
        query: string;
        status: 'COMPLETED' | 'FAILED' | 'INTERRUPTED' | 'PENDING';
        toolsUsed: string[];
        responsePreview: string;
        timestamp: number;
      }>;
    };
  } {
    const filePath = this.getSessionResumeFilePath();
    if (!fs.existsSync(filePath)) {
      return { exists: false, corrupted: false, filePath };
    }
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.recentTasks)) {
        return {
          exists: true,
          corrupted: true,
          filePath,
          error: 'Session resume file has invalid schema structure; loaded safe empty fallback.'
        };
      }
      return {
        exists: true,
        corrupted: false,
        filePath,
        state: parsed
      };
    } catch (err: any) {
      return {
        exists: true,
        corrupted: true,
        filePath,
        error: `Corrupted session state file detected (${err?.message || 'JSON parse error'}); loaded safe empty fallback.`
      };
    }
  }

  public clearSessionResumeState(): boolean {
    const filePath = this.getSessionResumeFilePath();
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return true;
    } catch {
      return false;
    }
  }

  public shutdown(): void {
    for (const unsub of this.unsubscribers) {
      try { unsub(); } catch {}
    }
    this.unsubscribers = [];
    this.mcpClient.shutdownAll();
    try {
      this.toolService.getBrowserProvider().close().catch(() => {});
    } catch {}
    if (this.localApiServer.getStatus().running) {
      this.localApiServer.stop().catch(() => {});
    }
  }
}
