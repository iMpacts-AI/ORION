import crypto from 'crypto';
import { AgentExecutionTrace } from '../../shared/types/eventDriven';
import { ToolCall, ToolResult } from '../../shared/types';
import { eventBus } from '../../shared/events';

export class ExecutionTraceService {
  private traces: Map<string, AgentExecutionTrace> = new Map();
  private lastChainHash = '0000000000000000000000000000000000000000000000000000000000000000';

  private static readonly SENSITIVE_KEY_REGEX = /(api[_-]?key|token|secret|password|passwd|authorization|cookie|private[_-]?key|credential)/i;

  private static readonly SENSITIVE_VALUE_PATTERNS: RegExp[] = [
    /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z0-9 ]*PRIVATE KEY-----/g,
    /sk-ant-[a-zA-Z0-9\-_]{8,}/g,
    /sk-or-v1-[a-zA-Z0-9\-_]{8,}/g,
    /sk-[a-zA-Z0-9\-_]{12,}/g,
    /gsk_[a-zA-Z0-9\-_]{12,}/g,
    /AIza[0-9A-Za-z\-_]{15,}/g,
    /gh[pousr]_[a-zA-Z0-9_]{12,}/g,
    /nvapi-[a-zA-Z0-9\-_]{12,}/g,
    /csk-[a-zA-Z0-9\-_]{12,}/g,
    /orion-local-[a-zA-Z0-9\-_]{10,}/g,
    /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi,
    /sessionid=[A-Za-z0-9\-._~+/]+/gi,
    /([?&](?:api[_-]?key|key|token|secret|access[_-]?token|password)=)[^&\s"']+/gi
  ];

  public static redactSensitiveValue(val: any, seen = new WeakSet()): any {
    if (val === null || val === undefined) return val;
    if (typeof val === 'string') {
      let sanitized = val;
      for (const rx of ExecutionTraceService.SENSITIVE_VALUE_PATTERNS) {
        sanitized = sanitized.replace(rx, (match, prefix) => {
          if (typeof prefix === 'string' && (prefix.startsWith('?') || prefix.startsWith('&'))) {
            return `${prefix}***REDACTED***`;
          }
          return '***REDACTED***';
        });
      }
      return sanitized;
    }
    if (typeof val !== 'object') return val;
    if (seen.has(val)) return '[Circular]';
    seen.add(val);

    if (Array.isArray(val)) {
      return val.map(item => ExecutionTraceService.redactSensitiveValue(item, seen));
    }

    const sanitized: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (ExecutionTraceService.SENSITIVE_KEY_REGEX.test(k)) {
        sanitized[k] = '***REDACTED***';
      } else {
        sanitized[k] = ExecutionTraceService.redactSensitiveValue(v, seen);
      }
    }
    return sanitized;
  }

  private static redactSensitiveArgs(args: Record<string, any> | undefined): Record<string, any> {
    if (!args || typeof args !== 'object') return {};
    return ExecutionTraceService.redactSensitiveValue(args);
  }

  public static computeTraceHash(trace: Omit<AgentExecutionTrace, 'integrityHash'>): string {
    const canonical = JSON.stringify({
      traceId: trace.traceId,
      timestamp: trace.timestamp,
      query: trace.query,
      agentId: trace.agentId || 'core',
      previousTraceHash: trace.previousTraceHash || '',
      stateTransitions: trace.stateTransitions,
      toolCallsCount: trace.toolCallsExecuted.length,
      toolResultsCount: trace.toolResults.length,
      verificationSuccess: trace.verificationSuccess,
      replanningCount: trace.replanningCount
    });
    return crypto.createHash('sha256').update(canonical, 'utf8').digest('hex');
  }

  public createTrace(query: string, agentId = 'core'): AgentExecutionTrace {
    const sanitizedQuery = ExecutionTraceService.redactSensitiveValue(query);
    const trace: AgentExecutionTrace = {
      traceId: 'trace_' + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      query: sanitizedQuery,
      agentId,
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
      replanningCount: 0,
      previousTraceHash: this.lastChainHash
    };
    trace.integrityHash = ExecutionTraceService.computeTraceHash(trace);
    this.lastChainHash = trace.integrityHash;

    this.traces.set(trace.traceId, trace);
    eventBus.logActivity('SYSTEM_EVENT', `Agent Execution Trace Started [${trace.traceId}] for query: "${sanitizedQuery}"`);
    return trace;
  }

  public recordStateTransition(traceId: string, newState: any): void {
    const trace = this.traces.get(traceId);
    if (trace) {
      trace.stateTransitions.push(newState);
      trace.integrityHash = ExecutionTraceService.computeTraceHash(trace);
    }
  }

  public recordPlan(traceId: string, plan: any): void {
    const trace = this.traces.get(traceId);
    if (trace && plan) {
      trace.plansGenerated.push(ExecutionTraceService.redactSensitiveValue(plan));
      trace.integrityHash = ExecutionTraceService.computeTraceHash(trace);
    }
  }

  public recordToolCall(traceId: string, call: ToolCall): void {
    const trace = this.traces.get(traceId);
    if (trace && call) {
      trace.toolCallsExecuted.push({
        ...call,
        arguments: ExecutionTraceService.redactSensitiveArgs(call.arguments)
      });
      trace.integrityHash = ExecutionTraceService.computeTraceHash(trace);
    }
  }

  public recordToolResult(traceId: string, result: ToolResult): void {
    const trace = this.traces.get(traceId);
    if (trace && result) {
      trace.toolResults.push({
        ...result,
        data: ExecutionTraceService.redactSensitiveValue(result.data),
        error: typeof result.error === 'string' ? ExecutionTraceService.redactSensitiveValue(result.error) : result.error
      });
      trace.integrityHash = ExecutionTraceService.computeTraceHash(trace);
    }
  }

  public recordObservation(traceId: string, observation: any): void {
    const trace = this.traces.get(traceId);
    if (trace && observation) {
      trace.observationsRecorded.push(ExecutionTraceService.redactSensitiveValue(observation));
      trace.integrityHash = ExecutionTraceService.computeTraceHash(trace);
    }
  }

  public completeTrace(traceId: string, verificationSuccess: boolean, metrics: any): void {
    const trace = this.traces.get(traceId);
    if (trace) {
      // Never falsely report verificationSuccess if any executed tool failed without recovery
      const hasUnrecoveredFailure =
        trace.toolResults.length > 0 &&
        trace.toolResults.every(r => !r.success || r.verificationStatus === 'FAILED');
      trace.verificationSuccess = Boolean(verificationSuccess && !hasUnrecoveredFailure);
      trace.telemetryMetrics = metrics;
      trace.replanningCount = metrics?.replanningCount || 0;
      trace.integrityHash = ExecutionTraceService.computeTraceHash(trace);
      this.lastChainHash = trace.integrityHash;
      eventBus.logActivity('SYSTEM_EVENT', `Agent Execution Trace Completed [${traceId}] (Verified: ${trace.verificationSuccess})`);
    }
  }

  public verifyTraceChainIntegrity(): { valid: boolean; totalTraces: number; tamperedTraceId?: string } {
    const all = Array.from(this.traces.values());
    let expectedPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';
    for (const tr of all) {
      if (tr.previousTraceHash !== expectedPrevHash) {
        return { valid: false, totalTraces: all.length, tamperedTraceId: tr.traceId };
      }
      const expected = ExecutionTraceService.computeTraceHash(tr);
      if (tr.integrityHash !== expected) {
        return { valid: false, totalTraces: all.length, tamperedTraceId: tr.traceId };
      }
      expectedPrevHash = tr.integrityHash || expected;
    }
    return { valid: true, totalTraces: all.length };
  }

  public getTrace(traceId: string): AgentExecutionTrace | undefined {
    return this.traces.get(traceId);
  }

  public getAllTraces(): AgentExecutionTrace[] {
    return Array.from(this.traces.values());
  }
}
