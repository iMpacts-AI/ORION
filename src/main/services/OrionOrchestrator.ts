import { ToolService } from './ToolService';
import { VisionService } from './VisionService';
import { VoiceService } from './VoiceService';
import { ConversationMemoryService } from './ConversationMemoryService';
import { ExecutionContext, ToolDependencyGraph } from './ExecutionContext';
import { IAIProvider, LocalHeuristicAIProvider, AIPlanStep } from './AIProvider';
import { ToolCall, ToolResult, AssistantState, OrionMode, VisionResult, CommandTelemetryMetrics } from '../../shared/types';
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

export interface ProcessCommandResult {
  query: string;
  response: string;
  success: boolean;
  toolCallsExecuted: ToolCall[];
  toolResults: ToolResult[];
  visionResult?: VisionResult;
  state: AssistantState;
  suggestedMode?: OrionMode;
  metrics: CommandTelemetryMetrics;
  activeTask?: AgentTask;
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

  public getState(): AssistantState {
    return this.stateMachine.getState();
  }

  private updateState(newState: AssistantState): void {
    this.stateMachine.transitionTo(newState);
  }

  public async processCommand(query: string, source: 'TEXT' | 'VOICE' = 'TEXT'): Promise<ProcessCommandResult> {
    const startCmdTime = Date.now();
    const timeoutMs = 30000;

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

    // Capture Initial Environment State Snapshot
    const initialEnv = await this.perceptionService.captureEnvironment(this.getState());
    eventBus.logActivity('PROCESSING', `Environment State: Active App "${initialEnv.activeApp}" | Window "${initialEnv.activeWindow?.title}"`);

    // Register Active Background Task Record in TaskSupervisor
    const activeTaskRecord = this.taskSupervisor.createTask(`Execute: ${query.slice(0, 30)}...`, query, 'HIGH');
    this.taskSupervisor.startTask(activeTaskRecord.taskId);

    const executedCalls: ToolCall[] = [];
    const results: ToolResult[] = [];
    let visionRes: VisionResult | undefined;
    let responseText = '';
    let suggestedMode: OrionMode | undefined;

    try {
      const processPromise = async () => {
        const lower = query.toLowerCase();

        // Step 1: Intent Classification
        const startIntentTime = Date.now();
        const intentResult = await this.aiProvider.classifyIntent(query);
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
        } else {
          // Navigation Mode Triggers
          if (lower.includes('system') || lower.includes('show system')) suggestedMode = 'SYSTEM';
          else if (lower.includes('vision') || lower.includes('activate vision')) suggestedMode = 'VISION';
          else if (lower.includes('computer') || lower.includes('show my computer')) suggestedMode = 'COMPUTER';
          else if (lower.includes('world') || lower.includes('world overview')) suggestedMode = 'WORLD';
          else if (lower.includes('memory') || lower.includes('show memory')) suggestedMode = 'MEMORY';

          // Step 2: Planning Stage with Intelligent Tool Capability Resolution
          const startPlanTime = Date.now();
          const allTools = this.toolService.getTools();
          const resolvedTools = this.capabilityResolver.resolveToolsForTask(query, allTools);
          const availableToolIds = resolvedTools.map(t => t.id);
          const plan = await this.aiProvider.plan(query, availableToolIds);
          metrics.planningLatencyMs = Date.now() - startPlanTime;

          // Step 3: Tool Execution Loop (DAG Dependency Graph & Concurrency Support)
          if (plan.steps.length > 0) {
            const startToolExecTime = Date.now();
            const graph = new ToolDependencyGraph(plan.steps);
            const contextStepOutputs = new Map<number, any>();

            while (!graph.isFinished()) {
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
                    eventBus.emit('assistant.tool.started', { toolCall: call });
                    const res = await this.toolService.executeTool(call);
                    results.push(res);

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
                    eventBus.emit('assistant.tool.started', { toolCall: call });
                    eventBus.logActivity('TOOL_EXECUTION', `Executing tool '${tool.name}'`, { args: call.arguments });

                    let res = await this.toolService.executeTool(call);

                    // Autonomous Tool Failure Recovery & Replanning Attempt
                    if (!res.success && metrics.replanningCount < 2) {
                      metrics.replanningCount++;
                      eventBus.logActivity('ERROR_EVENT', `Tool '${tool.name}' failed. Initiating autonomous replanning attempt #${metrics.replanningCount}...`);
                      
                      try {
                        const replanPrompt = `Step ${step.stepNumber} calling '${tool.id}' failed with error: "${res.error}". Suggest an alternative tool execution plan to complete: "${query}".`;
                        const revisedPlan = await this.aiProvider.plan(replanPrompt, availableToolIds);
                        if (revisedPlan.steps.length > 0 && revisedPlan.steps[0].toolToCall !== tool.id) {
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
                            eventBus.logActivity('TOOL_EXECUTION', `Executing alternative tool '${altTool.name}'`);
                            res = await this.toolService.executeTool(altCall);
                          }
                        }
                      } catch (replanErr) {
                        // Keep original error result if replanning fails
                      }
                    }

                    results.push(res);

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

          // Step 4: Synthesize Final Response using ContextBuilder & Structured Observations
          const startAiGen = Date.now();
          const historyTurns = this.memoryService.getTurns();
          const observations: Observation[] = results.map(r => ({
            executionId: 'exec_' + Math.random().toString(36).substring(2, 9),
            toolCallId: r.toolCallId,
            timestamp: r.timestamp,
            source: r.toolId,
            trustLevel: 'UNTRUSTED_EXTERNAL',
            data: r.data,
            summary: r.success ? `Tool ${r.toolId} executed successfully` : `Tool ${r.toolId} failed: ${r.error}`,
            verificationStatus: r.verificationStatus || 'UNKNOWN'
          }));

          if (results.length > 0) {
            const firstResult = results[0];
            if (firstResult.success) {
              const synthesisPrompt = this.contextBuilder.buildSynthesisContext(query, historyTurns, observations, this.taskMemory.getCurrentTask());

              try {
                responseText = await this.aiProvider.chat(synthesisPrompt, this.memoryService.getFormattedHistory());
              } catch (e) {
                responseText = `[ORION INTEL] ${JSON.stringify(firstResult.data, null, 2)}`;
              }
            } else {
              responseText = `ORION was unable to complete the request: ${firstResult.error}`;
            }
          } else {
            responseText = await this.aiProvider.chat(query, this.memoryService.getFormattedHistory());
          }
          metrics.aiTotalGenerationLatencyMs = Date.now() - startAiGen;
        }

        // Step 5: Record Assistant Response in Memory, Mark Task Completed, & Trigger TTS Speech (VOICE only)
        this.taskSupervisor.updateProgress(activeTaskRecord.taskId, 100, { responseText });
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
      this.updateState('ERROR');
      eventBus.logActivity('ERROR_EVENT', `Orchestrator failure: ${err.message}`);
      responseText = `ORION Error: ${err.message}`;
      await new Promise(resolve => setTimeout(resolve, 1500));
    } finally {
      this.updateState('STANDBY');
      metrics.totalCommandLatencyMs = Date.now() - startCmdTime;
    }

    return {
      query,
      response: responseText,
      success: !responseText.startsWith('ORION Error:'),
      toolCallsExecuted: executedCalls,
      toolResults: results,
      visionResult: visionRes,
      state: this.getState(),
      suggestedMode,
      metrics
    };
  }
}
