import { AgentExecutionTrace } from '../../shared/types/eventDriven';
import { eventBus } from '../../shared/events';

export class ExecutionTraceService {
  private traces: Map<string, AgentExecutionTrace> = new Map();

  public createTrace(query: string): AgentExecutionTrace {
    const trace: AgentExecutionTrace = {
      traceId: 'trace_' + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      query,
      stateTransitions: ['STANDBY'],
      plansGenerated: [],
      toolCallsExecuted: [],
      toolResults: [],
      observationsRecorded: [],
      telemetryMetrics: {
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
      },
      verificationSuccess: false,
      replanningCount: 0
    };

    this.traces.set(trace.traceId, trace);
    eventBus.logActivity('SYSTEM_EVENT', `Agent Execution Trace Started [${trace.traceId}] for query: "${query}"`);
    return trace;
  }

  public recordStateTransition(traceId: string, newState: any): void {
    const trace = this.traces.get(traceId);
    if (trace) {
      trace.stateTransitions.push(newState);
    }
  }

  public completeTrace(traceId: string, verificationSuccess: boolean, metrics: any): void {
    const trace = this.traces.get(traceId);
    if (trace) {
      trace.verificationSuccess = verificationSuccess;
      trace.telemetryMetrics = metrics;
      eventBus.logActivity('SYSTEM_EVENT', `Agent Execution Trace Completed [${traceId}] (Verified: ${verificationSuccess})`);
    }
  }

  public getTrace(traceId: string): AgentExecutionTrace | undefined {
    return this.traces.get(traceId);
  }
}
