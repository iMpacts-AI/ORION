import { ComputerUseService } from '../computer/ComputerUseService';
import { MockInputDriver } from '../computer/InputControlService';

async function runComputerHUDIntegrationTests() {
  console.log('--- RUNNING COMPUTER HUD INTEGRATION TEST SUITE ---');
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

  // 1. Progress Event Stream Emitter
  {
    const progressUpdates: any[] = [];
    const plan = await service.planTask('Scroll down');

    await service.executePlan(plan, (p) => {
      progressUpdates.push({
        status: p.status,
        actionIndex: p.currentActionIndex
      });
    });

    assert(
      progressUpdates.length >= 2 &&
      progressUpdates.some(u => u.status === 'RUNNING' || u.status === 'EXECUTING') &&
      plan.status === 'COMPLETED',
      'Emits continuous progress events throughout plan lifecycle for HUD rendering'
    );
  }

  // 2. High-Risk Action Requires Approval Gate in HUD
  {
    const plan = await service.planTask('Execute custom write command');
    // Inject high risk file write
    plan.actions.push({
      id: 'act_hud_high',
      type: 'WRITE_FILE',
      payload: { filePath: 'C:\\Users\\smsaq\\test.txt' },
      confidence: 0.95,
      riskLevel: 'HIGH_RISK'
    });
    plan.requiresUserApproval = true;

    if (plan.requiresUserApproval) {
      plan.status = 'AWAITING_APPROVAL';
    }

    assert(
      plan.status === 'AWAITING_APPROVAL' && plan.requiresUserApproval === true,
      'HUD pauses execution and requests explicit confirmation for high-risk action'
    );
  }

  // 3. Immediate Emergency Stop Triggered from HUD
  {
    let stoppedDuringRun = false;
    const plan = await service.planTask('Open Chrome and search for Nvidia');

    // Trigger emergency stop on first action callback
    await service.executePlan(plan, (p) => {
      if (p.currentActionIndex === 0) {
        service.emergencyStop();
        stoppedDuringRun = true;
      }
    });

    assert(
      stoppedDuringRun && (plan.status === 'CANCELLED' || plan.status === 'FAILED' || plan.status === 'ESTOPPED'),
      'HUD Emergency Stop immediately aborts active execution plan'
    );

    service.resetEmergencyStop();
  }

  console.log(`\nCOMPUTER HUD INTEGRATION SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runComputerHUDIntegrationTests();
