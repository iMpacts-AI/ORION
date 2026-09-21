import { ActionRiskEvaluator } from '../ActionRiskEvaluator.js';
import { ActionValidator } from '../ActionValidator.js';
import { ComputerActionService } from '../ComputerActionService.js';
import { ComputerPerceptionService } from '../ComputerPerceptionService.js';
import { SystemMonitorService } from '../SystemMonitorService.js';
import { VisionService, DefaultVisionProvider } from '../VisionService.js';
import { ToolService } from '../ToolService.js';
import { ComputerAction } from '../../../shared/types/index.js';

async function runPhase8ActionSafetyTests() {
  console.log('--- RUNNING PHASE 8 ACTION SAFETY & VERIFICATION SUITE ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Test ActionRiskEvaluator Runtime Authoritative Ratings
  {
    const evaluator = new ActionRiskEvaluator();
    assert(evaluator.evaluateRisk('READ_FILE') === 'READ_ONLY', 'READ_FILE correctly rated READ_ONLY');
    assert(evaluator.evaluateRisk('FOCUS_WINDOW') === 'LOW_RISK', 'FOCUS_WINDOW correctly rated LOW_RISK');
    assert(evaluator.evaluateRisk('OPEN_APP') === 'MODERATE_RISK', 'OPEN_APP correctly rated MODERATE_RISK');
    assert(evaluator.evaluateRisk('WRITE_FILE', { filePath: 'C:\\test.txt' }) === 'HIGH_RISK', 'Normal WRITE_FILE correctly rated HIGH_RISK');
    assert(evaluator.evaluateRisk('WRITE_FILE', { filePath: 'C:\\Windows\\system32\\test.dll' }) === 'CRITICAL', 'System path WRITE_FILE correctly rated CRITICAL');
  }

  // 2. Test ActionValidator Precondition & Postcondition Engine
  {
    const validator = new ActionValidator();
    
    // Precondition failure test
    const preRes = await validator.validatePreconditions(
      { expectedActiveApp: 'Calculator' },
      { timestamp: Date.now(), activeApp: 'Electron', displayCount: 1, currentAssistantState: 'EXECUTING' }
    );
    assert(preRes.valid === false && Boolean(preRes.reason?.includes('expected \'Calculator\'')), 'Precondition correctly rejects active app mismatch');

    // Postcondition verification test
    const postRes = await validator.verifyPostconditions({ verifyFileExists: './non_existent_file_xyz.txt' });
    assert(postRes.verified === false && Boolean(postRes.reason?.includes('was not created')), 'Postcondition correctly fails when file is absent');
  }

  // 3. Test ComputerActionService Execution & Precondition Safety Abort
  {
    const perception = new ComputerPerceptionService(new SystemMonitorService(), new VisionService(new DefaultVisionProvider()));
    const toolService = new ToolService();
    const actionService = new ComputerActionService(perception, toolService);

    const action: ComputerAction = {
      id: 'act_test_1',
      type: 'READ_FILE',
      riskLevel: 'READ_ONLY',
      preconditions: { expectedActiveApp: 'NonExistentApp' },
      payload: { filePath: './package.json' }
    };

    const res = await actionService.executeAction(action);
    assert(res.success === false && res.preconditionsMet === false, 'ComputerActionService cleanly aborts execution when preconditions fail');
  }

  console.log(`\nPHASE 8 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase8ActionSafetyTests();
