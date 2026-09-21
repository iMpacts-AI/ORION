import { ComputerActionVerifier } from '../computer/ComputerActionVerifier';
import { ComputerObservation } from '../../../shared/types/action';

async function runComputerActionVerifierTests() {
  console.log('--- RUNNING COMPUTER ACTION VERIFIER TEST SUITE ---');
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

  const verifier = new ComputerActionVerifier();

  const priorObs: ComputerObservation = {
    timestamp: Date.now() - 1000,
    screen: { width: 1920, height: 1080, scaleFactor: 1 },
    activeWindow: { title: 'Terminal', processName: 'cmd.exe', processId: 1, bounds: { x: 0, y: 0, width: 800, height: 600 } },
    cursor: { x: 0, y: 0 },
    visibleText: [],
    interactiveElements: [],
    applications: ['cmd.exe'],
    confidence: 0.95
  };

  // 1. Successful window focus verification
  {
    const postObs: ComputerObservation = {
      ...priorObs,
      activeWindow: { title: 'Google Chrome', processName: 'chrome.exe', processId: 2, bounds: { x: 0, y: 0, width: 1920, height: 1080 } }
    };

    const res = await verifier.verifyExecution(
      { id: 'act_v1', type: 'FOCUS_WINDOW', target: 'chrome', confidence: 0.95, riskLevel: 'LOW_RISK' },
      priorObs,
      postObs
    );
    assert(res.verified === true && res.confidence >= 0.9, 'Verifies that target window became active in foreground');
  }

  // 2. Failed window focus verification
  {
    const postObs: ComputerObservation = {
      ...priorObs,
      activeWindow: { title: 'Notepad', processName: 'notepad.exe', processId: 3, bounds: { x: 0, y: 0, width: 600, height: 400 } }
    };

    const res = await verifier.verifyExecution(
      { id: 'act_v2', type: 'FOCUS_WINDOW', target: 'chrome', confidence: 0.95, riskLevel: 'LOW_RISK' },
      priorObs,
      postObs
    );
    assert(res.verified === false && Boolean(res.reason?.includes('did not become active')), 'Detects when expected window failed to gain focus');
  }

  // 3. Postcondition text assertion
  {
    const postObsWithText: ComputerObservation = {
      ...priorObs,
      visibleText: ['Settings', 'Network & Internet']
    };

    const res = await verifier.verifyExecution(
      {
        id: 'act_v3',
        type: 'KEYBOARD_INPUT',
        confidence: 0.95,
        riskLevel: 'MODERATE_RISK',
        postconditions: { verifyTextVisible: 'Network' }
      },
      priorObs,
      postObsWithText
    );
    assert(res.verified === true, 'Verifies text postcondition presence in post-action observation');
  }

  console.log(`\nCOMPUTER ACTION VERIFIER SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runComputerActionVerifierTests();
