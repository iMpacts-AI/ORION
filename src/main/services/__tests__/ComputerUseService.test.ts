import { ComputerUseService } from '../computer/ComputerUseService';
import { MockInputDriver } from '../computer/InputControlService';

async function runComputerUseServiceTests() {
  console.log('--- RUNNING COMPUTER USE SERVICE TEST SUITE ---');
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

  // 1. Observe Screen
  {
    const obs = await service.observeScreen();
    assert(
      obs.screen.width > 0 &&
      obs.activeWindow.title.length > 0 &&
      obs.confidence >= 0.7,
      'observeScreen returns valid observation model'
    );
  }

  // 2. Plan Task
  {
    const plan = await service.planTask('Open Chrome and search for Nvidia');
    assert(
      plan.actions.length >= 3 &&
      (plan.status === 'PENDING' || plan.status === 'PLANNING'),
      'planTask generates structured plan'
    );
  }

  // 3. Execute Closed-Loop Plan
  {
    const plan = await service.planTask('Scroll down');
    const resultPlan = await service.executePlan(plan);
    assert(
      resultPlan.status === 'COMPLETED' &&
      resultPlan.auditLog.length > 0 &&
      resultPlan.auditLog[0].verification === 'VERIFIED',
      'executePlan completes successfully with verified audit log'
    );
  }

  // 4. Emergency Stop Halts Execution
  {
    service.emergencyStop();
    const plan = await service.planTask('Scroll down');
    const stoppedPlan = await service.executePlan(plan);
    assert(
      stoppedPlan.status === 'CANCELLED' || stoppedPlan.status === 'FAILED' || stoppedPlan.status === 'ESTOPPED',
      'Emergency stop halts execution cleanly'
    );

    service.resetEmergencyStop();
  }

  console.log(`\nCOMPUTER USE SERVICE SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runComputerUseServiceTests();
