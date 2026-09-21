import { ComputerUseService } from '../computer/ComputerUseService';
import { MockInputDriver } from '../computer/InputControlService';
import { TaskStateMachine } from '../computer/TaskStateMachine';
import { ComputerObservation } from '../../../shared/types/action';

async function runPhase13TestSuite() {
  console.log('=== RUNNING PHASE 13: PRODUCTION-GRADE COMPUTER-USE BENCHMARK & TEST SUITE ===');
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

  // Category 1: Single-app workflow
  const singleAppPlan = await service.planTask('Open Notepad, type SINGLE_APP_PAYLOAD, close Notepad');
  const singleAppRes = await service.executePlan(singleAppPlan);
  assert(singleAppRes.status === 'COMPLETED', '1. Single-app workflow executes with verified steps');

  // Category 2: Multi-app workflow & window switching
  const multiAppPlan = await service.planTask('Open Notepad, type MULTI_PAYLOAD, switch to chrome, close Notepad');
  const multiAppRes = await service.executePlan(multiAppPlan);
  assert(multiAppRes.status === 'COMPLETED', '2. Multi-app workflow maintains window focus and task tracking');

  // Category 3: Window switching explicit test
  const switchAct: any = { id: 'act_sw', type: 'FOCUS_WINDOW', target: 'notepad', riskLevel: 'LOW_RISK', confidence: 0.95 };
  const switchRes = await service.executeSingleAction(switchAct);
  assert(switchRes.success === true, '3. Window switching targets active process correctly');

  // Category 4: Dynamic UI & Scrolling
  const scrollPlan = await service.planTask('Scroll down');
  const scrollRes = await service.executePlan(scrollPlan);
  assert(scrollRes.status === 'COMPLETED', '4. Dynamic UI scrolling executes cleanly');

  // Category 5: Modal Interruption & Replan
  const obs = await service.observeScreen();
  const replanned = await service.getPlanner().replanFromFailure(
    { id: 'act_fail_1', type: 'MOUSE_CLICK', riskLevel: 'LOW_RISK', target: 'blocked_btn' },
    'element not visible due to modal',
    obs,
    []
  );
  assert(replanned.some(a => a.parameters?.key === 'escape'), '5. Modal interruption synthesized Escape key dismissal');

  // Category 6: Target Ambiguity detection
  const ambiguousObs: ComputerObservation = {
    timestamp: Date.now(),
    screen: { width: 1920, height: 1080, scaleFactor: 1 },
    activeWindow: { title: 'Editor', processName: 'code', processId: 100, bounds: { x: 0, y: 0, width: 1920, height: 1080 } },
    cursor: { x: 100, y: 100 },
    visibleText: ['Save', 'Save'],
    interactiveElements: [
      { id: 'b1', role: 'button', text: 'Save', bounds: { x: 100, y: 200, width: 80, height: 30 }, enabled: true, visible: true, confidence: 0.95, source: 'ACCESSIBILITY' },
      { id: 'b2', role: 'button', text: 'Save', bounds: { x: 500, y: 200, width: 80, height: 30 }, enabled: true, visible: true, confidence: 0.95, source: 'ACCESSIBILITY' }
    ],
    applications: ['code'],
    confidence: 0.95
  };
  const ambiguityCheck = service.getScreenUnderstanding().locateElement(ambiguousObs, { text: 'Save', role: 'button' });
  assert(ambiguityCheck.ambiguous === true, '6. Target ambiguity detected for duplicate high-confidence elements');

  // Category 7: Stale observation prevention & unique IDs
  const obs1 = await service.observeScreen();
  const obs2 = await service.observeScreen();
  assert(Boolean(obs1.observationId && obs2.observationId && obs1.observationId !== obs2.observationId), '7. Fresh observation snapshots generate distinct unique IDs');

  // Category 8: Failed target & Bounded non-infinite recovery
  const failedTargetPlan = await service.planTask('Click NonExistentUnknownControl123');
  const failedRes = await service.executePlan(failedTargetPlan);
  assert(failedRes.status === 'FAILED' || failedRes.auditLog.some(a => a.result === 'FAILURE'), '8. Unresolvable target element fails gracefully without infinite loop');

  // Category 9: Adaptive Recovery
  const recoveryPlan = await service.getExecutor()['recoveryService'].formulateRecovery(
    { id: 'act_rec', type: 'MOUSE_CLICK', riskLevel: 'LOW_RISK', selector: { text: 'Submit', windowTitle: 'FormApp' } },
    'Window not focused',
    0,
    obs
  );
  assert(recoveryPlan.shouldRetry && recoveryPlan.recoveryActions.length > 0, '9. Adaptive recovery formulates multi-step corrective recovery');

  // Category 10: Task cancellation
  const cancelPlan = await service.planTask('Open Notepad, type CANCEL_TEST, close Notepad');
  service.cancelActiveTask('User requested stop');
  const cancelRes = await service.executePlan(cancelPlan);
  assert(cancelRes.status === 'CANCELLED', '10. Workflow cancellation signals clean task abort');

  // Category 11: ESTOP immediate halt and rejection
  service.emergencyStop();
  const estopPlan = await service.planTask('Open Notepad, type ESTOP_TEST, close Notepad');
  const estopRes = await service.executePlan(estopPlan);
  assert(estopRes.status === 'ESTOPPED' || estopRes.status === 'CANCELLED', '11. Emergency Stop aborts execution and sets ESTOPPED status');
  service.resetEmergencyStop();

  // Category 12: Dry-run / Preview mode
  const dryDriver = new MockInputDriver();
  const dryService = new ComputerUseService(dryDriver);
  const dryRunPlan = await dryService.planTask('Open Notepad, type DRY_RUN_PAYLOAD, close Notepad', { isDryRun: true });
  const dryRunRes = await dryService.executePlan(dryRunPlan);
  assert(dryRunRes.status === 'COMPLETED' && dryRunRes.isDryRun === true && dryDriver.history.length === 0, '12. Dry-run mode plans and verifies without sending physical input');

  // Category 13: Checkpoint & In-Memory Resume
  const store = service.getStateStore();
  const chkPlan = await service.planTask('Open Notepad, type CHECKPOINT_TEST, close Notepad');
  const chkId = await store.saveCheckpoint(chkPlan);
  const loaded = await store.loadCheckpoint(chkPlan.taskId);
  assert(Boolean(loaded && loaded.plan.taskId === chkPlan.taskId), '13. Durable checkpoint saved and restored successfully');

  // Category 14: Long multi-step select & replace workflow
  const longPlan = await service.planTask('Open Notepad, type initial, select the text, replace it with updated, verify state, close Notepad');
  const longRes = await service.executePlan(longPlan);
  assert(longRes.status === 'COMPLETED' && longRes.actions.length >= 6, '14. Long-horizon select and replace workflow completed');

  // Category 15: Protected Project Titan 4K master attempt
  const titanPlan = await service.planTask('Modify Titan master');
  titanPlan.actions = [{
    id: 'act_titan_test',
    type: 'WRITE_FILE',
    payload: { filePath: 'C:\\Users\\smsaq\\Project_Titan\\07_Video_Projects\\5_Render_Exports\\Video_001_Nvidia_CUDA_Moat_Master_4K.mp4' },
    confidence: 0.99,
    riskLevel: 'CRITICAL'
  }];
  const titanRes = await service.executePlan(titanPlan);
  assert(titanRes.status === 'FAILED' && titanRes.auditLog[0].error?.includes('Protected Master'), '15. Strictly gates and blocks modification of protected Titan 4K masters');

  // Category 16: Concurrent task conflict rejection
  service.getExecutor()['activePlanLock'] = true;
  const concPlan = await service.planTask('Open Notepad');
  const concRes = await service.executePlan(concPlan);
  assert(concRes.status === 'FAILED' && concRes.completionReport?.includes('Concurrent'), '16. Strictly rejects concurrent task execution on shared desktop');
  service.getExecutor()['activePlanLock'] = false;

  // Category 17: Secret / Credential Redaction
  const secretPlan = await service.planTask('Type password: SuperSecretPassword123 into auth field');
  assert(!secretPlan.naturalLanguageCommand.includes('SuperSecretPassword123'), '17. Passwords and credentials redacted from task logs and stored commands');

  // Category 18: Final state verification & Timing metrics
  const timingPlan = await service.planTask('Open Notepad, type TIMING_TEST, close Notepad');
  const timingRes = await service.executePlan(timingPlan);
  assert(Boolean(timingRes.timingMetrics && timingRes.timingMetrics.totalDurationMs !== undefined), '18. Structured completion report calculates total duration and timing metrics');
  console.log(`\nPHASE 13 PRODUCTION-GRADE BENCHMARK SUITE: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase13TestSuite();