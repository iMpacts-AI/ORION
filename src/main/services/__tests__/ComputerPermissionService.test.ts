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
      payload: { filePath: 'C:\\Users\\operator\\Project_Titan\\07_Video_Projects\\5_Render_Exports\\Video_001_Nvidia_CUDA_Moat_Master_4K.mp4' },
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
      payload: { filePath: 'C:\\Users\\operator\\Downloads\\ORION\\temp.txt' },
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
      payload: { filePath: 'C:\\Users\\operator\\Downloads\\ORION\\temp.txt' },
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

  // 5. Consistent inspection across action.parameters, action.payload, and action.target (Defect D-04 regression)
  {
    const paramEnvCheck = service.evaluateActionPermission({
      id: 'act_perm_params_env',
      type: 'READ_FILE',
      parameters: { filePath: 'C:\\Users\\operator\\iMpacts-repos\\ORION\\.env' },
      riskLevel: 'READ_ONLY'
    });
    assert(
      paramEnvCheck.allowed === false && paramEnvCheck.riskLevel === 'CRITICAL',
      'Action with .env path in action.parameters (without action.payload) is strictly BLOCKED as CRITICAL'
    );

    const targetSshCheck = service.evaluateActionPermission({
      id: 'act_perm_target_ssh',
      type: 'READ_FILE',
      target: 'C:\\Users\\operator\\.ssh\\id_rsa',
      riskLevel: 'READ_ONLY'
    });
    assert(
      targetSshCheck.allowed === false && targetSshCheck.riskLevel === 'CRITICAL',
      'Action with .ssh/id_rsa path in top-level action.target is strictly BLOCKED as CRITICAL'
    );

    const missingParamsWriteCheck = service.evaluateActionPermission({
      id: 'act_perm_missing_write',
      type: 'WRITE_FILE',
      riskLevel: 'LOW_RISK'
    });
    assert(
      missingParamsWriteCheck.allowed === false && missingParamsWriteCheck.riskLevel === 'CRITICAL',
      'WRITE_FILE action missing target path parameters is strictly BLOCKED as CRITICAL'
    );

    const malformedActionCheck = service.evaluateActionPermission({
      id: 'act_malformed',
      type: '' as any,
      payload: 'not-an-object' as any,
      riskLevel: 'LOW_RISK'
    });
    assert(
      malformedActionCheck.allowed === false && malformedActionCheck.riskLevel === 'CRITICAL',
      'Malformed action representation is strictly BLOCKED as CRITICAL'
    );
  }

  console.log(`\nCOMPUTER PERMISSION SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runComputerPermissionTests();
