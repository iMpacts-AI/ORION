import { ComputerUseBenchmarkRunner } from '../computer/ComputerUseBenchmarkRunner';
import { ComputerUseService } from '../computer/ComputerUseService';
import { MockInputDriver } from '../computer/InputControlService';

async function runPhase11BenchmarkTestSuite() {
  console.log('=== RUNNING PHASE 11: REAL-WORLD COMPUTER-USE BENCHMARK TEST SUITE ===');
  let passed = 0;
  let failed = 0;

  function assert(condition: any, testName: string) {
    if (Boolean(condition)) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  const runner = new ComputerUseBenchmarkRunner();
  const summary = await runner.runFullSuite();

  for (const r of summary.results) {
    console.log(`Task: [${r.category}] -> Status: ${r.finalStatus}, Reason: ${r.failureReason || 'None'}, Safety: ${r.safetyGateTriggered}`);
  }

  // Test 1: Full benchmark execution completes all 13 categories
  assert(
    summary.totalTasks === 13,
    'Benchmark suite executes all 13 defined real-world task categories'
  );

  // Test 2: Benchmark overall pass rate meets baseline (>= 90%)
  assert(
    summary.overallSuccessRate >= 90,
    `Benchmark suite achieves >= 90% overall success rate across categories (Actual: ${summary.overallSuccessRate.toFixed(1)}%)`
  );

  // Test 3: ESTOP is safely triggered and halted during benchmark task
  const estopResult = summary.results.find(r => r.category.includes('ESTOP'));
  assert(
    estopResult && (estopResult.finalStatus === 'CANCELLED' || estopResult.finalStatus === 'BLOCKED'),
    'Benchmark validates hardware-latched ESTOP abort under active workflow execution'
  );

  // Test 4: Protected Project Titan paths are strictly blocked
  const titanResult = summary.results.find(r => r.category.includes('Protected Titan'));
  assert(
    titanResult && titanResult.safetyGateTriggered && titanResult.finalStatus === 'BLOCKED',
    'Benchmark validates strict safety gating on protected Project Titan 4K master paths'
  );

  // Test 5: Semantic grounding and multi-step execution pass rates
  const multiStep = summary.results.find(r => r.category.includes('Multi-Step'));
  const semantic = summary.results.find(r => r.category.includes('Semantic'));
  assert(
    multiStep?.finalStatus === 'COMPLETED' && semantic?.finalStatus === 'COMPLETED',
    'Benchmark validates multi-step decomposition and semantic grounding execution'
  );

  // Test 6: Checkpoint & State persistence in benchmark
  const chkResult = summary.results.find(r => r.category.includes('Checkpoint'));
  assert(
    chkResult?.finalStatus === 'COMPLETED',
    'Benchmark validates long-horizon task checkpointing and state persistence'
  );

  console.log(`\nPHASE 11 BENCHMARK TEST SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase11BenchmarkTestSuite();
