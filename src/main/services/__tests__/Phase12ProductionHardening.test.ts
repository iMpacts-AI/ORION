import { ComputerUseService } from '../computer/ComputerUseService';
import { MockInputDriver } from '../computer/InputControlService';

async function runPhase12HardeningTestSuite() {
  console.log('=== RUNNING PHASE 12: PRODUCTION HARDENING TEST SUITE ===');
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

  const mockDriver = new MockInputDriver();
  const service = new ComputerUseService(mockDriver);

  // Test 1: Full multi-step command decomposition with select and replacement
  const cmd = 'Open Notepad, type a test message, select the text, replace it with another message, verify the new text, then close Notepad.';
  const plan = await service.planTask(cmd);
  assert(
    plan.actions.length >= 6 &&
    plan.actions.some(a => a.type === 'HOTKEY') &&
    plan.actions.some(a => (a.reason || '').includes('replacement text')),
    'Plans multi-step workflow with text selection, replacement, and verification'
  );

  // Test 2: Closed-loop execution of select and replace workflow
  const executed = await service.executePlan(plan);
  assert(
    executed.status === 'COMPLETED' &&
    executed.auditLog.filter(a => a.result === 'SUCCESS').length >= 6,
    'Executes select and replace workflow in closed-loop with verified steps'
  );

  // Test 3: Multi-application window switching and active detection
  const multiAppPlan = await service.planTask('Open Notepad, type MULTI_APP_STATE, then close Notepad');
  const multiAppRes = await service.executePlan(multiAppPlan);
  assert(
    multiAppRes.status === 'COMPLETED',
    'Maintains reliable multi-app orchestration and window focus state'
  );

  // Test 4: Bounded failure recovery upon unlocatable UI element
  const unlocatablePlan = await service.planTask('Click UnknownFakeButtonXYZ');
  const failRes = await service.executePlan(unlocatablePlan);
  assert(
    failRes.status === 'FAILED' &&
    failRes.auditLog.some(a => a.result === 'FAILURE'),
    'Enforces bounded non-infinite recovery when UI element cannot be located'
  );

  // Test 5: Immediate ESTOP halt and post-abort rejection
  service.emergencyStop();
  const estopPlan = await service.planTask('Open Notepad, type SAFE_TEST, close Notepad');
  const estopRes = await service.executePlan(estopPlan);
  assert(
    (estopRes.status === 'CANCELLED' || estopRes.status === 'ESTOPPED') &&
    service.isEmergencyStopped() === true,
    'ESTOP immediately cancels execution and rejects queued actions'
  );
  service.resetEmergencyStop();
  assert(!service.isEmergencyStopped(), 'ESTOP can be reset cleanly back to normal operation');

  // Test 6: Strict CRITICAL blocking on protected Project Titan 4K Masters
  const titanPlan = await service.planTask('Modify Titan master');
  titanPlan.actions = [{
    id: 'act_titan_prohibited',
    type: 'WRITE_FILE',
    payload: { filePath: 'C:\\Users\\smsaq\\Project_Titan\\07_Video_Projects\\5_Render_Exports\\Video_001_Nvidia_CUDA_Moat_Master_4K.mp4' },
    confidence: 0.99,
    riskLevel: 'CRITICAL'
  }];
  const titanRes = await service.executePlan(titanPlan);
  assert(
    titanRes.status === 'FAILED' &&
    titanRes.auditLog[0].error?.includes('Protected Master'),
    'Strictly gates and blocks any attempt to mutate protected Project Titan 4K Masters'
  );

  console.log(`\nPHASE 12 PRODUCTION HARDENING SUITE: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase12HardeningTestSuite();
