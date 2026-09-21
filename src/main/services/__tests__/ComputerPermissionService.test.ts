import { ComputerPermissionService } from '../computer/ComputerPermissionService';
import { ActionRiskEvaluator } from '../ActionRiskEvaluator';

async function runComputerPermissionTests() {
  console.log('--- RUNNING COMPUTER PERMISSION SERVICE TEST SUITE ---');
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

  const service = new ComputerPermissionService();

  // 1. Low risk observation is permitted
  {
    const check = service.evaluateActionPermission({
      id: 'act_perm_1',
      type: 'OBSERVE_SCREEN',
      confidence: 0.95,
      riskLevel: 'READ_ONLY'
    });
    assert(check.allowed === true && !check.requiresExplicitApproval, 'READ_ONLY observation is auto-authorized');
  }

  // 2. Project Titan Protected 4K Master alteration is strictly CRITICAL & BLOCKED
  {
    const check = service.evaluateActionPermission({
      id: 'act_perm_crit',
      type: 'WRITE_FILE',
      payload: { filePath: 'C:\\Users\\smsaq\\Project_Titan\\07_Video_Projects\\5_Render_Exports\\Video_001_Nvidia_CUDA_Moat_Master_4K.mp4' },
      confidence: 0.99,
      riskLevel: 'CRITICAL'
    });
    assert(
      check.allowed === false && check.riskLevel === 'CRITICAL' && check.reason?.includes('prohibited'),
      'Modifying Project Titan 4K Protected Master is strictly BLOCKED with CRITICAL rating'
    );
  }

  // 3. High risk action requires human approval
  {
    const check = service.evaluateActionPermission({
      id: 'act_perm_high',
      type: 'WRITE_FILE',
      payload: { filePath: 'C:\\Users\\smsaq\\Downloads\\ORION\\temp.txt' },
      confidence: 0.95,
      riskLevel: 'HIGH_RISK'
    });
    assert(
      check.allowed === false && check.requiresExplicitApproval === true,
      'High risk actions require explicit user authorization'
    );

    // Grant explicit approval
    service.setActionApproval('act_perm_high', true);
    const approvedCheck = service.evaluateActionPermission({
      id: 'act_perm_high',
      type: 'WRITE_FILE',
      payload: { filePath: 'C:\\Users\\smsaq\\Downloads\\ORION\\temp.txt' },
      confidence: 0.95,
      riskLevel: 'HIGH_RISK'
    });
    assert(approvedCheck.allowed === true, 'Explicitly approved action proceeds cleanly');
  }

  // 4. Emergency Stop Halts ALL Pending Actions
  {
    service.triggerEmergencyStop();
    const estopCheck = service.evaluateActionPermission({
      id: 'act_perm_read',
      type: 'OBSERVE_SCREEN',
      confidence: 0.95,
      riskLevel: 'READ_ONLY'
    });
    assert(
      estopCheck.allowed === false && service.isEmergencyStopped() === true,
      'Emergency Stop blocks all actions immediately'
    );

    service.resetEmergencyStop();
    assert(service.isEmergencyStopped() === false, 'Emergency Stop can be cleanly reset by operator');
  }

  console.log(`\nCOMPUTER PERMISSION SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runComputerPermissionTests();
