import { ActionRiskEvaluator } from '../ActionRiskEvaluator.js';
import { ActionValidator } from '../ActionValidator.js';
import { DefaultBrowserProvider } from '../../platform/BrowserProvider.js';
import { DefaultWindowProvider } from '../../platform/WindowProvider.js';
import { SystemMonitorService } from '../SystemMonitorService.js';

async function runPhase14ReliabilityTests() {
  console.log('--- RUNNING PHASE 14 REAL-WORLD RELIABILITY SUITE ---');
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

  // 1. Authoritative Risk Evaluator
  {
    const evaluator = new ActionRiskEvaluator();
    const risk = evaluator.evaluateRisk('WRITE_FILE', { filePath: 'C:\\Windows\\System32\\config' });
    assert(risk === 'CRITICAL', 'ActionRiskEvaluator correctly flags system path write as CRITICAL');
  }

  // 2. Action Precondition & Postcondition Validator
  {
    const validator = new ActionValidator();
    const preCheck = await validator.validatePreconditions({ requiredFilePath: './package.json' });
    assert(preCheck.valid === true, 'ActionValidator correctly confirms valid precondition paths');
  }

  // 3. Browser Navigation Security Boundary
  {
    const browser = new DefaultBrowserProvider();
    const badNav = await browser.navigate('file:///C:/Windows/System32');
    assert(!badNav.success && Boolean(badNav.error?.includes('SECURITY ENFORCEMENT')), 'BrowserProvider strictly blocks unsupported file:/// protocol navigation');
  }

  // 4. Real System Storage Telemetry Query
  {
    const sysMon = new SystemMonitorService();
    const snap = await sysMon.getSnapshot();
    assert(snap.storage.length > 0 && snap.storage[0].totalBytes > 0, 'SystemMonitorService captures real storage capacity metrics');
  }

  // 5. Windows Window Perception Provider
  {
    const winProv = new DefaultWindowProvider();
    const win = await winProv.getActiveWindow();
    assert(Boolean(win.title && win.processName), 'WindowProvider returns active desktop foreground window title and process name');
  }

  console.log(`\nPHASE 14 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase14ReliabilityTests();
