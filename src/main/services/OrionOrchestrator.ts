import { ToolService } from './ToolService';
import { VisionService } from './VisionService';
import { VoiceService } from './VoiceService';
import { ConversationMemoryService } from './ConversationMemoryService';
import { ExecutionContext, ToolDependencyGraph } from './ExecutionContext';
import { IAIProvider, LocalHeuristicAIProvider, AIPlanStep } from './AIProvider';
import { ToolCall, ToolResult, AssistantState, OrionMode, VisionResult, CommandTelemetryMetrics, TaskOutcomeStatus } from '../../shared/types';
import { eventBus } from '../../shared/events';

import { ContextBuilder } from './ContextBuilder';
import { ToolCapabilityResolver } from './ToolCapabilityResolver';
import { ComputerPerceptionService } from './ComputerPerceptionService';
import { SystemMonitorService } from './SystemMonitorService';
import { TaskSupervisor } from './TaskSupervisor';
import { ExecutionTraceService } from './ExecutionTraceService';
import { ComputerActionService } from './ComputerActionService';
import { Observation } from '../../shared/types';
import { AgentStateMachine } from './AgentStateMachine';
import { TaskMemoryService, AgentTask } from './TaskMemoryService';
import {
  classifyConversationalTurn,
  isExplicitPathInspectionQuery,
  sanitizeConversationalResponse,
  sanitizePersonalPathsInText
} from '../../shared/branding/OrionEngineIdentity';

export interface ProcessCommandResult {
  query: string;
  response: string;
  success: boolean;
  verified?: boolean;
  outcomeStatus?: TaskOutcomeStatus;
  toolCallsExecuted: ToolCall[];
  toolResults: ToolResult[];
  visionResult?: VisionResult;
  state: AssistantState;
  suggestedMode?: OrionMode;
  metrics: CommandTelemetryMetrics;
  activeTask?: AgentTask;
}

export interface ProcessCommandOptions {
  onToken?: (token: string) => void;
  signal?: AbortSignal;
}

export class OrionOrchestrator {
  private toolService: ToolService;
  private visionService: VisionService;
  private voiceService: VoiceService;
  private aiProvider: IAIProvider;
  private memoryService: ConversationMemoryService;
  private stateMachine: AgentStateMachine;
  private taskMemory: TaskMemoryService;
  private contextBuilder: ContextBuilder;
  private capabilityResolver: ToolCapabilityResolver;
  private perceptionService: ComputerPerceptionService;
  private taskSupervisor: TaskSupervisor;
  private traceService: ExecutionTraceService;
  private actionService: ComputerActionService;

  constructor(
    toolService: ToolService,
    visionService: VisionService,
    voiceService: VoiceService,
    aiProvider?: IAIProvider,
    memoryService?: ConversationMemoryService
  ) {
    this.toolService = toolService;
    this.visionService = visionService;
    this.voiceService = voiceService;
    this.aiProvider = aiProvider || new LocalHeuristicAIProvider();
    this.memoryService = memoryService || new ConversationMemoryService();
    this.stateMachine = new AgentStateMachine();
    this.taskMemory = new TaskMemoryService();
    this.contextBuilder = new ContextBuilder();
    this.capabilityResolver = new ToolCapabilityResolver();
    this.perceptionService = new ComputerPerceptionService(new SystemMonitorService(), this.visionService);
    this.taskSupervisor = new TaskSupervisor();
    this.traceService = new ExecutionTraceService();
    this.actionService = new ComputerActionService(this.perceptionService, this.toolService);
  }

  public setAIProvider(provider: IAIProvider): void {
    this.aiProvider = provider;
  }

  public getMemoryService(): ConversationMemoryService {
    return this.memoryService;
  }

  public getTaskMemory(): TaskMemoryService {
    return this.taskMemory;
  }

  public getPerceptionService(): ComputerPerceptionService {
    return this.perceptionService;
  }

  public getTaskSupervisor(): TaskSupervisor {
    return this.taskSupervisor;
  }

  public getTraceService(): ExecutionTraceService {
    return this.traceService;
  }

  public getActionService(): ComputerActionService {
    return this.actionService;
  }

  public getContextBuilder(): ContextBuilder {
    return this.contextBuilder;
  }

  public getState(): AssistantState {
    return this.stateMachine.getState();
  }

  private activeTraceId?: string;

  private updateState(newState: AssistantState): void {
    this.stateMachine.transitionTo(newState);
    if (this.activeTraceId) {
      this.traceService.recordStateTransition(this.activeTraceId, newState);
    }
  }

  private async generateResponseWithOptionalStreaming(
    prompt: string,
    formattedHistory: Array<{ role: string; content: string }>,
    options?: ProcessCommandOptions,
    metrics?: CommandTelemetryMetrics
  ): Promise<string> {
    if (options?.signal?.aborted) {
      throw new Error('Operation cancelled by AbortSignal before response generation.');
    }

    const onToken = options?.onToken;
    if (onToken && typeof this.aiProvider.stream === 'function') {
      const startStream = Date.now();
      let ttftRecorded = false;
      const wrappedToken = (token: string) => {
        if (options?.signal?.aborted) {
          throw new Error('Stream cancelled by AbortSignal.');
        }
        if (!ttftRecorded && metrics) {
          metrics.aiTtftMs = Date.now() - startStream;
          ttftRecorded = true;
        }
        onToken(token);
      };

      const streamedText = await this.aiProvider.stream(
        prompt,
        wrappedToken,
        formattedHistory,
        undefined,
        options?.signal
      );

      if (options?.signal?.aborted) {
        throw new Error('Stream cancelled by AbortSignal.');
      }

      // If stream fell back to non-streaming chat without emitting tokens, emit the full response once
      if (!ttftRecorded && streamedText) {
        onToken(streamedText);
      }

      return streamedText;
    }

    const resp = await this.aiProvider.chat(prompt, formattedHistory, options?.signal);
    if (options?.signal?.aborted) {
      throw new Error('Operation cancelled by AbortSignal.');
    }
    if (onToken && resp) {
      onToken(resp);
    }
    return resp;
  }

  public async processCommand(
    query: string,
    source: 'TEXT' | 'VOICE' = 'TEXT',
    options?: ProcessCommandOptions
  ): Promise<ProcessCommandResult> {
    const startCmdTime = Date.now();
    const timeoutMs = 45000;
    const activeTrace = this.traceService.createTrace(query);
    this.activeTraceId = activeTrace.traceId;

    const metrics: CommandTelemetryMetrics = {
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
    };

    eventBus.logActivity('VOICE_INPUT', `Received command: "${query}"`, { source });
    eventBus.emit('assistant.command.received', { query, source });

    this.updateState('THINKING');
    eventBus.logActivity('PROCESSING', `Analyzing intent for query: "${query}"`);

    // Record User Turn in Memory
    this.memoryService.addTurn({ role: 'user', content: query });

    const turnClassification = classifyConversationalTurn(query);

    // Capture Initial Environment State Snapshot (skip expensive window enumeration on pure greetings/small talk)
    if (!turnClassification.isGreetingOrSmallTalk) {
      const initialEnv = await this.perceptionService.captureEnvironment(this.getState());
      eventBus.logActivity(
        'PROCESSING',
        `Environment State: Active App "${initialEnv.activeApp}" | Window "${initialEnv.activeWindow?.title}"`
      );
    }

    // Register Active Background Task Record in TaskSupervisor
    const activeTaskRecord = this.taskSupervisor.createTask(`Execute: ${query.slice(0, 30)}...`, query, 'HIGH');
    this.taskSupervisor.startTask(activeTaskRecord.taskId);

    const executedCalls: ToolCall[] = [];
    const results: ToolResult[] = [];
    let visionRes: VisionResult | undefined;
    let responseText = '';
    let suggestedMode: OrionMode | undefined;
    let commandFailed = false;

    try {
      if (options?.signal?.aborted) {
        throw new Error('Operation cancelled by AbortSignal.');
      }

      const processPromise = async () => {
        const lower = query.toLowerCase();

        // Step 1: Intent Classification
        const startIntentTime = Date.now();
        const intentResult = turnClassification.isGreetingOrSmallTalk
          ? { intent: 'CONVERSATION' as const, confidence: 0.99 }
          : await this.aiProvider.classifyIntent(query);
        metrics.intentClassificationLatencyMs = Date.now() - startIntentTime;

        const isVisionIntent = intentResult.intent === 'VISION' ||
          lower.includes('look at my screen') ||
          lower.includes('what is on my screen') ||
          lower.includes('read the text on my screen') ||
          lower.includes('analyze what i\'m looking at') ||
          lower.includes('screen analysis');

        if (isVisionIntent) {
          this.updateState('VISION');
          suggestedMode = 'VISION';
          eventBus.logActivity('PROCESSING', 'Multimodal screen vision analysis requested by operator');

          const startCap = Date.now();
          visionRes = await this.visionService.captureAndAnalyze('SCREENSHOT');
          metrics.visionCaptureLatencyMs = Date.now() - startCap;

          if (this.visionService.isConfigured) {
            responseText = `[ORION VISION INTEL] ${visionRes.analysis.sceneSummary}`;
          } else {
            responseText = `ORION Vision Provider is currently NOT CONFIGURED for external screen analysis. Screen capture executed successfully (${visionRes.analysis.source}).`;
          }
          if (options?.onToken && responseText) {
            options.onToken(responseText);
          }
        } else {
          // Navigation Mode Triggers (only when not a greeting/small talk)
          if (!turnClassification.isGreetingOrSmallTalk) {
            if (turnClassification.isExplicitSystemSpecRequest || lower.includes('show system')) suggestedMode = 'SYSTEM';
            else if (lower.includes('vision') || lower.includes('activate vision')) suggestedMode = 'VISION';
            else if (lower.includes('show my computer')) suggestedMode = 'COMPUTER';
            else if (lower.includes('world overview')) suggestedMode = 'WORLD';
            else if (lower.includes('show memory')) suggestedMode = 'MEMORY';
          }

          // Step 2: Planning Stage with Intelligent Tool Capability Resolution
          const startPlanTime = Date.now();
          const isAmbiguousTargetlessEdit =
            /^\s*(?:please\s+)?(?:can\s+you\s+|could\s+you\s+)?(?:update|edit|modify|change|fix|rewrite)\s+(?:the|a|my|this|that)\s+(?:file|config|configuration|document|script)(?:\s+for\s+me)?[.!?]?\s*$/i.test(
              query.trim()
            );

          if (isAmbiguousTargetlessEdit) {
            responseText =
              'Which file would you like me to update, and what specific changes should I make?';
            if (options?.onToken) {
              options.onToken(responseText);
            }
            metrics.planningLatencyMs = Date.now() - startPlanTime;
            this.traceService.recordPlan(activeTrace.traceId, {
              goal: `Clarify ambiguous request: "${query}"`,
              steps: []
            });
          } else {
          const allTools = this.toolService.getTools();
          const skipToolsForPureChat =
            turnClassification.isGreetingOrSmallTalk ||
            (turnClassification.isPureConversational &&
              !turnClassification.isExplicitFileRequest &&
              !turnClassification.isExplicitSystemSpecRequest);
          const resolvedTools = skipToolsForPureChat
            ? []
            : this.capabilityResolver.resolveToolsForTask(query, allTools);
          const availableToolIds = resolvedTools.map(t => t.id);
          const plan = skipToolsForPureChat
            ? { goal: `Conversation: "${query}"`, steps: [] }
            : await this.aiProvider.plan(query, availableToolIds);

          if (
            turnClassification.isExplicitSystemSpecRequest &&
            plan.steps.length === 0 &&
            !/\b(?:what\s+time|current\s+time|date\s+today)\b/i.test(query)
          ) {
            plan.steps = [
              {
                stepNumber: 1,
                actionDescription: 'Retrieve workstation OS and CPU specifications',
                toolToCall: 'system.get_info',
                toolArguments: {},
                isReadOnly: true
              },
              {
                stepNumber: 2,
                actionDescription: 'Retrieve workstation memory capacity and utilization',
                toolToCall: 'system.get_memory_usage',
                toolArguments: {},
                isReadOnly: true
              }
            ];
          }
          metrics.planningLatencyMs = Date.now() - startPlanTime;
          this.traceService.recordPlan(activeTrace.traceId, plan);

          // Step 3: Tool Execution Loop (DAG Dependency Graph & Concurrency Support)
          if (plan.steps.length > 0) {
            const startToolExecTime = Date.now();
            const graph = new ToolDependencyGraph(plan.steps);
            const contextStepOutputs = new Map<number, any>();

            while (!graph.isFinished()) {
              if (options?.signal?.aborted) {
                throw new Error('Operation cancelled by AbortSignal.');
              }

              const batches = graph.getExecutableBatches();
              if (batches.length === 0) break; // Deadlock or finished

              for (const batch of batches) {
                this.updateState('EXECUTING');

                const isParallelSafe = batch.length > 1 && batch.every(s => {
                  const tool = this.toolService.getTools().find(t => t.id === s.toolToCall);
                  return tool && tool.permissionLevel === 'LOW' && s.isReadOnly !== false;
                });

                if (isParallelSafe) {
                  // Parallel Execution of Independent LOW-permission Read-Only Tools via Promise.all
                  eventBus.logActivity('TOOL_EXECUTION', `Parallel executing ${batch.length} read-only steps concurrently`);

                  const promises = batch.map(async (step) => {
                    const tool = this.toolService.getTools().find(t => t.id === step.toolToCall);
                    if (!tool) {
                      graph.markFailed(step.stepNumber);
                      return;
                    }

                    const call: ToolCall = {
                      id: 'call_' + Math.random().toString(36).substring(2, 9),
                      toolId: tool.id,
                      toolName: tool.name,
                      arguments: step.toolArguments || {},
                      timestamp: Date.now(),
                      requiresUserApproval: false
                    };

                    executedCalls.push(call);
                    this.traceService.recordToolCall(activeTrace.traceId, call);
                    eventBus.emit('assistant.tool.started', { toolCall: call });
                    const res = await this.toolService.executeTool(call, { signal: options?.signal });
                    results.push(res);
                    this.traceService.recordToolResult(activeTrace.traceId, res);

                    if (res.success) {
                      eventBus.emit('assistant.tool.completed', { result: res });
                      graph.markCompleted(step.stepNumber);
                      contextStepOutputs.set(step.stepNumber, res.data);
                    } else {
                      eventBus.emit('assistant.tool.failed', { toolCallId: call.id, error: res.error || 'Execution failed' });
                      graph.markFailed(step.stepNumber);
                    }
                  });

                  await Promise.all(promises);

                } else {
                  // Sequential Execution for Dependent / Non-Readonly Steps with Replanning Recovery
                  for (const step of batch) {
                    if (options?.signal?.aborted) {
                      throw new Error('Operation cancelled by AbortSignal.');
                    }

                    const tool = this.toolService.getTools().find(t => t.id === step.toolToCall);
                    if (!tool) {
                      eventBus.emit('assistant.tool.failed', { toolCallId: 'unknown', error: `Tool '${step.toolToCall}' not registered.` });
                      eventBus.logActivity('ERROR_EVENT', `Planned step ${step.stepNumber} referenced unknown tool '${step.toolToCall}'`);
                      graph.markFailed(step.stepNumber);
                      continue;
                    }

                    // Dynamic Step Output Argument Substitution (${step.N.output.key})
                    const resolvedArgs: Record<string, any> = { ...step.toolArguments };
                    for (const [key, val] of Object.entries(resolvedArgs)) {
                      if (typeof val === 'string' && val.includes('${step.') && val.includes('.output')) {
                        resolvedArgs[key] = val.replace(/\$\{step\.(\d+)\.output(?:\.([^}]+))?\}/g, (_match, stepStr, propPath) => {
                          const stepNum = parseInt(stepStr, 10);
                          const outputData = contextStepOutputs.get(stepNum);
                          if (outputData !== undefined && outputData !== null) {
                            if (propPath) {
                              return outputData[propPath] !== undefined ? String(outputData[propPath]) : '';
                            }
                            return typeof outputData === 'object' ? JSON.stringify(outputData) : String(outputData);
                          }
                          return '';
                        });
                      }
                    }

                    const call: ToolCall = {
                      id: 'call_' + Math.random().toString(36).substring(2, 9),
                      toolId: tool.id,
                      toolName: tool.name,
                      arguments: resolvedArgs,
                      timestamp: Date.now(),
                      requiresUserApproval: false
                    };

                    executedCalls.push(call);
                    this.traceService.recordToolCall(activeTrace.traceId, call);
                    eventBus.emit('assistant.tool.started', { toolCall: call });
                    eventBus.logActivity('TOOL_EXECUTION', `Executing tool '${tool.name}'`, { args: call.arguments });

                    let res = await this.toolService.executeTool(call, { signal: options?.signal });

                    if (options?.signal?.aborted || /cancelled/i.test(String(res.error || ''))) {
                      results.push(res);
                      this.traceService.recordToolResult(activeTrace.traceId, res);
                      throw new Error('Operation cancelled by AbortSignal.');
                    }

                    // Autonomous Tool Failure Recovery & Replanning Attempt (bounded, never bypasses security/auth/cancellation)
                    const isNonRecoverablePolicyOrAuth =
                      /SECURITY POLICY VIOLATION|AUTHORIZATION REQUIRED|PAUSED_FOR_USER_AUTH|PERMISSION_BLOCKED|Emergency Stop|SCHEMA VALIDATION FAILED/i.test(
                        String(res.error || '')
                      );
                    if (
                      !res.success &&
                      !isNonRecoverablePolicyOrAuth &&
                      metrics.replanningCount < 2 &&
                      !options?.signal?.aborted
                    ) {
                      metrics.replanningCount++;
                      eventBus.logActivity('ERROR_EVENT', `Tool '${tool.name}' failed. Initiating autonomous replanning attempt #${metrics.replanningCount}...`);
                      
                      try {
                        const replanPrompt = `Step ${step.stepNumber} calling '${tool.id}' failed with error: "${res.error}". Suggest an alternative tool execution plan to complete: "${query}".`;
                        const revisedPlan = await this.aiProvider.plan(replanPrompt, availableToolIds);
                        this.traceService.recordPlan(activeTrace.traceId, revisedPlan);
                        if (
                          !options?.signal?.aborted &&
                          revisedPlan.steps.length > 0 &&
                          revisedPlan.steps[0].toolToCall &&
                          revisedPlan.steps[0].toolToCall !== tool.id &&
                          availableToolIds.includes(revisedPlan.steps[0].toolToCall)
                        ) {
                          const altStep = revisedPlan.steps[0];
                          const altTool = this.toolService.getTools().find(t => t.id === altStep.toolToCall);
                          if (altTool) {
                            const altCall: ToolCall = {
                              id: 'call_replan_' + Math.random().toString(36).substring(2, 9),
                              toolId: altTool.id,
                              toolName: altTool.name,
                              arguments: altStep.toolArguments || {},
                              timestamp: Date.now(),
                              requiresUserApproval: false
                            };
                            executedCalls.push(altCall);
                            this.traceService.recordToolCall(activeTrace.traceId, altCall);
                            eventBus.logActivity('TOOL_EXECUTION', `Executing alternative tool '${altTool.name}'`);
                            res = await this.toolService.executeTool(altCall, { signal: options?.signal });
                          }
                        }
                      } catch (replanErr) {
                        // Keep original error result if replanning fails
                      }
                    }

                    results.push(res);
                    this.traceService.recordToolResult(activeTrace.traceId, res);

                    if (res.success) {
                      eventBus.emit('assistant.tool.completed', { result: res });
                      eventBus.logActivity('TASK_COMPLETE', `Tool '${tool.name}' executed successfully`, { data: res.data });
                      graph.markCompleted(step.stepNumber);
                      contextStepOutputs.set(step.stepNumber, res.data);
                    } else {
                      eventBus.emit('assistant.tool.failed', { toolCallId: call.id, error: res.error || 'Execution failed' });
                      eventBus.logActivity('ERROR_EVENT', `Tool '${tool.name}' failed: ${res.error}`);
                      graph.markFailed(step.stepNumber);
                    }
                  }
                }
              }
            }

            metrics.toolExecutionLatencyMs = Date.now() - startToolExecTime;
          }

          // Step 4: Synthesize Final Response using ContextBuilder, Relevant Persisted Memories, & Structured Observations
          const startAiGen = Date.now();
          const historyTurns = this.memoryService.getTurns();
          const sanitizedFormattedHistory = this.memoryService
            .getFormattedHistory()
            .map(t => ({
              role: t.role,
              content: sanitizeConversationalResponse(t.content, {
                workspaceRoot: process.cwd(),
                redactProviderIds: true
              })
            }))
            .filter(t => t.content.length > 0);
          const unifiedMemory = typeof (this.toolService as any).getUnifiedMemory === 'function'
            ? (this.toolService as any).getUnifiedMemory()
            : undefined;
          const relevantMemories =
            !turnClassification.isGreetingOrSmallTalk && unifiedMemory
              ? unifiedMemory.queryMemories(query, 5)
              : [];

          const observations: Observation[] = results.map(r => {
            const obs: Observation = {
              executionId: 'exec_' + Math.random().toString(36).substring(2, 9),
              toolCallId: r.toolCallId,
              timestamp: r.timestamp,
              source: r.toolId,
              trustLevel: 'UNTRUSTED_EXTERNAL',
              data: r.data,
              summary: r.success ? `Tool ${r.toolId} executed successfully` : `Tool ${r.toolId} failed: ${r.error}`,
              verificationStatus: r.verificationStatus || 'UNKNOWN'
            };
            this.traceService.recordObservation(activeTrace.traceId, obs);
            return obs;
          });

          if (results.length > 0) {
            const succeededResults = results.filter(r => r.success);
            const failedResults = results.filter(r => !r.success);

            if (failedResults.length === 0) {
              const synthesisPrompt = this.contextBuilder.buildSynthesisContext(
                query,
                historyTurns,
                observations,
                this.taskMemory.getCurrentTask(),
                relevantMemories
              );

              try {
                responseText = await this.generateResponseWithOptionalStreaming(
                  synthesisPrompt,
                  sanitizedFormattedHistory,
                  options,
                  metrics
                );
              } catch (e: any) {
                if (options?.signal?.aborted || /abort|cancel/i.test(e?.message || '')) {
                  throw e;
                }
                responseText = sanitizePersonalPathsInText(
                  `[ORION INTEL] ${JSON.stringify(results[0].data, null, 2)}`,
                  process.cwd()
                );
                if (options?.onToken) options.onToken(responseText);
              }

              const anyUnverified = results.some(
                r =>
                  r.verified === false ||
                  r.outcomeStatus === 'launched_unverified' ||
                  (r.verificationStatus !== 'VERIFIED' && r.verificationStatus !== undefined)
              );
              if (anyUnverified && !/unverified/i.test(responseText)) {
                responseText = `${responseText}\n[Verification Notice: Action launched/issued; postcondition state remained unverified.]`;
              }
            } else if (succeededResults.length > 0) {
              commandFailed = true;
              const completedList = succeededResults.map(r => r.toolId).join(', ');
              const failedDetail = failedResults
                .map(r => `${r.toolId}: ${r.error || 'Execution failed'}`)
                .join('; ');
              responseText = `ORION partially completed the request (succeeded: ${completedList}), then halted on failure (${failedDetail}).`;
            } else {
              commandFailed = true;
              responseText = `ORION was unable to complete the request: ${failedResults[0].error}`;
            }
          } else {
            const unsupported = LocalHeuristicAIProvider.detectUnsupportedCapability(query);
            if (unsupported.unsupported) {
              commandFailed = true;
              responseText = `UNSUPPORTED CAPABILITY: ORION does not have a verified native tool for ${unsupported.capability} (${unsupported.reason}). No system mutation or external action was executed. Use /tools to inspect the registered authoritative tools.`;
            } else {
              const promptWithMemory =
                !turnClassification.isGreetingOrSmallTalk && relevantMemories.length > 0
                  ? this.contextBuilder.buildSynthesisContext(query, historyTurns, [], this.taskMemory.getCurrentTask(), relevantMemories)
                  : query;
              responseText = await this.generateResponseWithOptionalStreaming(
                promptWithMemory,
                sanitizedFormattedHistory,
                options,
                metrics
              );
            }
          }
          responseText = sanitizeConversationalResponse(responseText, {
            workspaceRoot: process.cwd(),
            redactProviderIds: true,
            preserveExplicitPaths: isExplicitPathInspectionQuery(query)
          });
          metrics.aiTotalGenerationLatencyMs = Date.now() - startAiGen;
          }
        }

        // Step 5: Record Assistant Response in Memory, Mark Task Completed, & Trigger TTS Speech (VOICE only)
        if (!commandFailed) {
          this.taskSupervisor.updateProgress(activeTaskRecord.taskId, 100, { responseText });
        } else {
          this.taskSupervisor.handleTaskFailure(activeTaskRecord.taskId, responseText);
        }
        this.memoryService.addTurn({ role: 'assistant', content: responseText, toolResults: results });
        this.updateState('SPEAKING');
        eventBus.logActivity('TASK_COMPLETE', `ORION response: ${responseText.slice(0, 120)}...`);

        if (source === 'VOICE') {
          await this.voiceService.speak(responseText);
        }
      };

      await Promise.race([
        processPromise(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('ORION Orchestrator execution timed out (30s limit)')), timeoutMs))
      ]);

    } catch (err: any) {
      commandFailed = true;
      const isCancelled =
        Boolean(options?.signal?.aborted) ||
        /cancelled by abortsignal|aborted by signal|task cancelled/i.test(String(err?.message || ''));
      if (isCancelled) {
        this.updateState('STANDBY');
        this.taskSupervisor.cancelTask(activeTaskRecord.taskId);
        eventBus.logActivity('SYSTEM_EVENT', `Task cancelled by operator: ${query}`);
        responseText = 'Task cancelled.';
      } else {
        this.updateState('ERROR');
        const safeErrMessage = sanitizePersonalPathsInText(err.message || 'Execution error', process.cwd());
        this.taskSupervisor.handleTaskFailure(activeTaskRecord.taskId, safeErrMessage);
        eventBus.logActivity('ERROR_EVENT', `Orchestrator failure: ${err.message}`);
        responseText = `ORION Error: ${safeErrMessage}`;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } finally {
      this.updateState('STANDBY');
      metrics.totalCommandLatencyMs = Date.now() - startCmdTime;
      const allToolsSucceeded = results.length === 0 || results.every(r => r.success && r.verificationStatus !== 'FAILED');
      const overallSuccess =
        !commandFailed &&
        !responseText.startsWith('ORION Error:') &&
        !responseText.startsWith('ORION was unable to complete') &&
        allToolsSucceeded;
      this.traceService.completeTrace(activeTrace.traceId, overallSuccess, metrics);
      this.activeTraceId = undefined;
    }

    const allToolsSucceeded =
      results.length === 0 || results.every(r => r.success && r.verificationStatus !== 'FAILED');
    const overallSuccess =
      !commandFailed &&
      !responseText.startsWith('ORION Error:') &&
      !responseText.startsWith('ORION was unable to complete') &&
      !responseText.startsWith('ORION partially completed') &&
      responseText !== 'Task cancelled.' &&
      allToolsSucceeded;

    const allVerified =
      overallSuccess &&
      (results.length === 0 ||
        results.every(
          r =>
            r.verified !== false &&
            r.outcomeStatus !== 'launched_unverified' &&
            r.verificationStatus === 'VERIFIED'
        ));

    const outcomeStatus: TaskOutcomeStatus = (() => {
      if (
        responseText === 'Task cancelled.' ||
        Boolean(options?.signal?.aborted) ||
        results.some(r => r.outcomeStatus === 'cancelled' || /Execution CANCELLED/i.test(r.error || ''))
      ) {
        return 'cancelled';
      }
      if (
        /timed out/i.test(responseText) ||
        results.some(r => r.outcomeStatus === 'timed_out' || /TIMED_OUT|timed out/i.test(r.error || ''))
      ) {
        return 'timed_out';
      }
      if (
        results.some(
          r =>
            r.outcomeStatus === 'permission_required' ||
            /AUTHORIZATION REQUIRED|PAUSED_FOR_USER_AUTH/i.test(r.error || '') ||
            Boolean(r.data?.pendingApprovalId)
        )
      ) {
        return 'permission_required';
      }
      if (!overallSuccess) {
        const anySucceeded = results.some(r => r.success);
        return anySucceeded ? 'partially_completed' : 'failed';
      }
      return allVerified ? 'completed_verified' : 'launched_unverified';
    })();

    return {
      query,
      response: responseText,
      success: overallSuccess,
      verified: allVerified,
      outcomeStatus,
      toolCallsExecuted: executedCalls,
      toolResults: results,
      visionResult: visionRes,
      state: this.getState(),
      suggestedMode,
      metrics
    };
  }
}
