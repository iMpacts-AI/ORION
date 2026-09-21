import { ExecutionTraceService } from '../ExecutionTraceService.js';

async function runPhase11ExecutionTraceTests() {
  console.log('--- RUNNING PHASE 11 EXECUTION TRACE SUITE ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  const traceService = new ExecutionTraceService();

  // 1. Test Trace Initialization
  {
    const trace = traceService.createTrace('Analyze project architecture');
    assert(trace.traceId.startsWith('trace_'), 'Trace initialized with typed trace ID');
    assert(trace.query === 'Analyze project architecture', 'Trace query recorded correctly');
    assert(trace.stateTransitions[0] === 'STANDBY', 'Initial STANDBY state transition recorded');
  }

  // 2. Test State Transitions & Completion
  {
    const trace = traceService.createTrace('Run test suite');
    traceService.recordStateTransition(trace.traceId, 'THINKING');
    traceService.recordStateTransition(trace.traceId, 'EXECUTING');
    traceService.completeTrace(trace.traceId, true, { totalCommandLatencyMs: 150 });

    const retrieved = traceService.getTrace(trace.traceId);
    assert(retrieved?.stateTransitions.length === 3, 'All state transitions recorded in trace');
    assert(retrieved?.verificationSuccess === true, 'Verification success recorded cleanly in trace');
    assert(retrieved?.telemetryMetrics.totalCommandLatencyMs === 150, 'Telemetry metrics attached to trace record');
  }

  console.log(`\nPHASE 11 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase11ExecutionTraceTests();
