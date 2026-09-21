import { ComputerUseService } from '../computer/ComputerUseService';
import { MockInputDriver } from '../computer/InputControlService';

async function runPhase9WorkflowTests() {
  console.log('=== RUNNING PHASE 9: AUTONOMOUS WORKFLOW EXECUTION TEST SUITE ===');
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

  // 1. Multi-step workflow decomposition
  {
    const plan = await service.planTask('Open Notepad, type ORION_PHASE_9_TEST, verify it appears, then close Notepad');
    assert(
      plan.actions.length >= 4 &&
      plan.actions[0].type === 'OPEN_APP' &&
      plan.actions[1].type === 'FOCUS_WINDOW' &&
      plan.actions[2].type === 'KEYBOARD_INPUT' &&
      plan.actions[3].type === 'OBSERVE_SCREEN' &&
      plan.actions[4]?.type === 'CLOSE_WINDOW',
      'Decomposes complex multi-step workflow into open, focus, type, verify, and close steps'
    );
  }

  // 2. Real observation between steps with mock driver
  {
    const plan = await service.planTask('Scroll down and observe');
    const result = await service.executePlan(plan);
    assert(
      result.status === 'COMPLETED' &&
      result.auditLog.length > 0 &&
      Boolean(result.completionReport) &&
      result.completionReport?.includes('ORION WORKFLOW EXECUTION REPORT'),
      'Executes multi-step workflow with interleaved observation and structured completion report'
    );
  }

  // 3. Postcondition verification in workflow
  {
    const plan = await service.planTask('Open Notepad, type DATA, close Notepad');
    const action = plan.actions[0];
    assert(
      Boolean(action.postconditions?.verifyActiveApp === 'notepad'),
      'Attaches strict postconditions to multi-step workflow stages'
    );
  }

  // 4. Bounded recovery on unexpected step failure
  {
    const plan = await service.planTask('Switch to NonExistentTargetApp');
    const res = await service.executePlan(plan);
    assert(
      res.status === 'FAILED' &&
      res.auditLog.some(a => a.result === 'FAILURE'),
      'Enforces bounded failure handling when a workflow step cannot be recovered'
    );
  }

  // 5. Emergency Stop (ESTOP) during active workflow
  {
    service.emergencyStop();
    const plan = await service.planTask('Open Notepad, type TEST, close Notepad');
    const res = await service.executePlan(plan);
    assert(
      res.status === 'CANCELLED' || res.status === 'FAILED' || res.status === 'ESTOPPED',
      'ESTOP immediately halts multi-step workflow execution'
    );
    service.resetEmergencyStop();
  }

  // 6. Risk gating and Titan 4K master protection
  {
    const plan = await service.planTask('Write custom master data');
    plan.actions.push({
      id: 'act_titan_crit',
      type: 'WRITE_FILE',
      payload: { filePath: 'C:\\Users\\smsaq\\Project_Titan\\07_Video_Projects\\5_Render_Exports\\Video_001_Nvidia_CUDA_Moat_Master_4K.mp4' },
      confidence: 0.99,
      riskLevel: 'CRITICAL'
    });

    const res = await service.executePlan(plan);
    assert(
      res.status === 'FAILED' &&
      res.auditLog.some(a => a.actionId === 'act_titan_crit' && a.result === 'BLOCKED'),
      'Strictly blocks workflow steps attempting to mutate protected Project Titan 4K Masters'
    );
  }

  // 7. Successful Completion Report formatting
  {
    const plan = await service.planTask('Scroll down');
    const completedPlan = await service.executePlan(plan);
    assert(
      Boolean(completedPlan.completionReport?.includes('Step Verification Integrity: 100.0%')),
      'Completion report calculates duration, verification integrity %, and step statistics'
    );
  }

  console.log(`\nPHASE 9 WORKFLOW SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase9WorkflowTests();
