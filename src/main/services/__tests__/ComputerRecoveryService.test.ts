import { ComputerRecoveryService } from '../computer/ComputerRecoveryService';
import { ComputerObservation } from '../../../shared/types/action';

async function runComputerRecoveryTests() {
  console.log('--- RUNNING COMPUTER RECOVERY SERVICE TEST SUITE ---');
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

  const recoveryService = new ComputerRecoveryService();

  const dummyObs: ComputerObservation = {
    timestamp: Date.now(),
    screen: { width: 1920, height: 1080, scaleFactor: 1 },
    activeWindow: { title: 'Desktop', processName: 'explorer.exe', processId: 1, bounds: { x: 0, y: 0, width: 1920, height: 1080 } },
    cursor: { x: 0, y: 0 },
    visibleText: [],
    interactiveElements: [],
    applications: [],
    confidence: 0.9
  };

  // 1. Formulate recovery for missing UI element
  {
    const plan = await recoveryService.formulateRecovery(
      {
        id: 'act_rec_test_1',
        type: 'MOUSE_CLICK',
        selector: { text: 'Submit', windowTitle: 'Chrome' },
        confidence: 0.9,
        riskLevel: 'MODERATE_RISK'
      },
      'Element not found',
      0,
      dummyObs
    );

    assert(
      plan.shouldRetry === true &&
      plan.recoveryActions.length >= 2 &&
      plan.recoveryActions.some(a => a.type === 'FOCUS_WINDOW') &&
      plan.recoveryActions.some(a => a.type === 'PRESS_KEY' && a.parameters?.key === 'escape'),
      'Formulates multi-strategy recovery with window refocus, modal dismissal, and retry'
    );
  }

  // 2. Halts when max attempt threshold is reached
  {
    const plan = await recoveryService.formulateRecovery(
      {
        id: 'act_rec_test_2',
        type: 'MOUSE_CLICK',
        confidence: 0.9,
        riskLevel: 'MODERATE_RISK'
      },
      'Persistent failure',
      2,
      dummyObs
    );

    assert(
      plan.shouldRetry === false &&
      plan.recoveryActions.length === 0 &&
      Boolean(plan.reason.includes('Maximum recovery limit')),
      'Strictly blocks infinite retry loops when max recovery bound is reached'
    );
  }

  console.log(`\nCOMPUTER RECOVERY SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runComputerRecoveryTests();
