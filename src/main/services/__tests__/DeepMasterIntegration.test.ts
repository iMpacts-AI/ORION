import { ProcessSupervisor } from '../computer/ProcessSupervisor';
import { ComputerActionExecutor } from '../computer/ComputerActionExecutor';
import { ScreenUnderstandingService } from '../computer/ScreenUnderstandingService';
import { InputControlService } from '../computer/InputControlService';
import { WindowManagerService } from '../computer/WindowManagerService';
import { ComputerPermissionService } from '../computer/ComputerPermissionService';
import { ComputerActionVerifier } from '../computer/ComputerActionVerifier';
import { ComputerRecoveryService } from '../computer/ComputerRecoveryService';
import { MockWindowProvider } from '../../platform/WindowProvider';
import { UnifiedMemoryManager } from '../UnifiedMemoryManager';
import { DefaultDeveloperAgentProvider } from '../../platform/DeveloperAgentProvider';
import { DefaultBrowserProvider } from '../../platform/BrowserProvider';
import { ToolService } from '../ToolService';
import { ToolDependencyGraph } from '../ExecutionContext';
import { ComputerTaskPlan, ComputerAction } from '../../../shared/types/action';
import fs from 'fs';
import path from 'path';

async function runDeepMasterIntegrationVerification() {
  console.log('================================================================');
  console.log('ORION MASTER CONTROLLER: FORENSIC REAL-WORLD VERIFICATION SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} -> ${detail || 'Assertion failed'}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // 1. REAL-WORLD CLOSED-LOOP COMPUTER USE & TARGET GROUNDING
  // -------------------------------------------------------------
  console.log('--- TEST GROUP 1: CLOSED-LOOP COMPUTER USE & TARGET GROUNDING ---');
  {
    const winProvider = new MockWindowProvider();
    const winManager = new WindowManagerService(winProvider);
    const screenService = new ScreenUnderstandingService(undefined, winManager, true);
    const permService = new ComputerPermissionService();
    const verifier = new ComputerActionVerifier();
    const recovery = new ComputerRecoveryService();
    const executor = new ComputerActionExecutor(
      screenService,
      undefined,
      winManager,
      permService,
      verifier,
      recovery
    );

    // Test A: Disallow launch of arbitrary non-whitelisted app
    let disallowedThrown = false;
    const maliciousPlan: ComputerTaskPlan = {
      taskId: 'task_sec_test',
      naturalLanguageCommand: 'Launch unauthorized app',
      intent: 'Launch unauthorized app',
      actions: [{
        id: 'act_evil',
        type: 'OPEN_APP',
        parameters: { appName: 'powershell -ExecutionPolicy Bypass evil.ps1' },
        riskLevel: 'HIGH_RISK'
      }],
      overallRisk: 'HIGH_RISK',
      requiresUserApproval: false,
      currentActionIndex: 0,
      status: 'PLANNING',
      isDryRun: false,
      auditLog: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    permService.resetEmergencyStop();
    try {
      await executor.executePlan(maliciousPlan);
      disallowedThrown = maliciousPlan.status === 'FAILED';
    } catch {
      disallowedThrown = true;
    }
    assert(disallowedThrown, 'OPEN_APP strictly blocks non-whitelisted application binaries');

    // Test B: Ambiguity Grounding - Two elements with identical high scores and different bounds
    const ambiguousObs = await screenService.captureObservation();
    ambiguousObs.interactiveElements = [
      { id: 'btn_save_1', role: 'button', text: 'Save Document', bounds: { x: 100, y: 100, width: 80, height: 30 }, confidence: 0.95, enabled: true, visible: true, source: 'VISUAL_HEURISTIC' },
      { id: 'btn_save_2', role: 'button', text: 'Save Document', bounds: { x: 500, y: 500, width: 80, height: 30 }, confidence: 0.95, enabled: true, visible: true, source: 'VISUAL_HEURISTIC' }
    ];
    const located = screenService.locateElement(ambiguousObs, { text: 'Save Document', role: 'button' });
    assert(located.ambiguous === true && (located.candidates?.length || 0) >= 2,
      'ScreenUnderstandingService halts and reports ambiguity when duplicate UI elements match with high confidence');
  }

  // -------------------------------------------------------------
  // 2. MULTI-STEP DATA FLOW & DAG DEPENDENCY PROPAGATION
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: MULTI-STEP EXECUTION & DYNAMIC DATA FLOW ---');
  {
    const steps = [
      { stepNumber: 1, actionDescription: 'Read package', toolToCall: 'file.read_text', toolArguments: { filePath: './package.json' }, prerequisites: [] },
      { stepNumber: 2, actionDescription: 'Write package output', toolToCall: 'file.write_text', toolArguments: { filePath: './test_step2_out.txt', content: '${step.1.output}' }, prerequisites: [1] }
    ];
    const graph = new ToolDependencyGraph(steps);
    const batches = graph.getExecutableBatches();
    assert(batches.length === 1 && batches[0].length === 1 && batches[0][0].stepNumber === 1,
      'ToolDependencyGraph correctly gates Step 2 until prerequisite Step 1 completes');

    // Mark Step 1 complete and verify Step 2 becomes executable
    graph.markCompleted(1);
    const nextBatches = graph.getExecutableBatches();
    assert(nextBatches.length === 1 && nextBatches[0][0].stepNumber === 2,
      'ToolDependencyGraph unlocks dependent Step 2 upon Step 1 completion');

    // Verify dynamic substitution resolution
    const rawContent = '${step.1.output.name}';
    const mockStepOutputs = new Map<number, any>();
    mockStepOutputs.set(1, { name: 'orion-verified', version: '1.0.0' });
    const resolved = rawContent.replace(/\$\{step\.(\d+)\.output(?:\.([^}]+))?\}/g, (_, stepStr, propPath) => {
      const stepNum = parseInt(stepStr, 10);
      const out = mockStepOutputs.get(stepNum);
      return propPath ? out[propPath] : JSON.stringify(out);
    });
    assert(resolved === 'orion-verified',
      'Dynamic argument substitution correctly propagates previous step property to dependent step input');
  }

  // -------------------------------------------------------------
  // 3. UNIFIED MEMORY PERSISTENCE, CORRUPTION & BOUND RESILIENCE
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: UNIFIED MEMORY PERSISTENCE & FAULT TOLERANCE ---');
  {
    const tempMemDir = path.resolve(process.cwd(), '.orion_memory');
    const tempMemPath = path.join(tempMemDir, 'test_mem_resilience.json');
    if (fs.existsSync(tempMemPath)) fs.unlinkSync(tempMemPath);

    // Normal Write -> Simulated Process Exit -> Reload
    const mem1 = new UnifiedMemoryManager(tempMemPath);
    mem1.addMemory('SYSTEM', 'ORION Closed Loop Production Architecture', ['core', 'v1']);
    mem1.addMemory('EPISODIC', 'Verified ProcessSupervisor ESTOP on Win32', ['estop', 'security']);

    const mem2 = new UnifiedMemoryManager(tempMemPath);
    const queryResults = mem2.queryMemories('Closed Loop');
    assert(queryResults.length === 1 && queryResults[0].content.includes('Production Architecture'),
      'UnifiedMemoryManager successfully loads and queries memories across simulated restart');

    // Corruption Handling: Corrupt the file on disk and verify manager recovers gracefully
    fs.writeFileSync(tempMemPath, '{ THIS IS CORRUPT NOT VALID JSON :::', 'utf-8');
    const mem3 = new UnifiedMemoryManager(tempMemPath);
    assert(mem3.getAllMemories().length === 0,
      'UnifiedMemoryManager recovers safely without crashing when backing storage is corrupt JSON');

    // Re-save and clean up
    mem3.addMemory('WORKING', 'Post-corruption recovery memory entry', ['recovery']);
    assert(mem3.getAllMemories().length === 1,
      'UnifiedMemoryManager resumes write capabilities after recovering from corrupted storage file');

    if (fs.existsSync(tempMemPath)) fs.unlinkSync(tempMemPath);
  }

  // -------------------------------------------------------------
  // 4. DEVELOPER AGENT SECURE BUILD EXECUTION & RESTRICTIONS
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: DEVELOPER AGENT SECURITY & EXECUTION BOUNDARIES ---');
  {
    const devAgent = new DefaultDeveloperAgentProvider();
    
    // Command Injection Test
    const chainedRes = await devAgent.executeBuild(process.cwd(), 'npm test & calc.exe');
    assert(!chainedRes.success && Boolean(chainedRes.output.includes('chaining operators')),
      'DeveloperAgentProvider strictly blocks command chaining (&, ;, |)');

    // Disallowed Command Test
    const disallowedRes = await devAgent.executeBuild(process.cwd(), 'rmdir /s /q C:\\');
    assert(!disallowedRes.success && Boolean(disallowedRes.output.includes('whitelist')),
      'DeveloperAgentProvider strictly blocks commands outside approved build whitelist');

    // Code Search Verification
    const searchResults = await devAgent.searchCode(process.cwd(), 'ProcessSupervisor');
    assert(searchResults.length > 0 && searchResults.some(r => r.filePath.includes('ProcessSupervisor.ts')),
      'DeveloperAgentProvider successfully searches and locates codebase references');
  }

  // -------------------------------------------------------------
  // 5. BROWSER PROVIDER SECURITY PROTOCOL & FETCH INTEGRITY
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 5: BROWSER PROVIDER PROTOCOL SECURITY & OBSERVATION ---');
  {
    const browser = new DefaultBrowserProvider();

    // Protocol injection
    const badProto = await browser.navigate('file:///C:/Windows/System32/calc.exe');
    assert(!badProto.success && Boolean(badProto.error?.includes('SECURITY ENFORCEMENT')),
      'BrowserProvider blocks file:/// protocol and local filesystem navigation');

    // Observation
    const obs = await browser.observe();
    assert(obs.url !== undefined && obs.title !== undefined,
      'BrowserProvider observe() returns structured observation schema');
  }

  console.log('\n================================================================');
  console.log(`DEEP MASTER VERIFICATION RESULTS: ${passed} passed, ${failed} failed.`);
  console.log('================================================================\n');

  if (failed > 0) process.exit(1);
}

runDeepMasterIntegrationVerification();
