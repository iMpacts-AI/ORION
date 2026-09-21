import { ComputerPerceptionService } from '../ComputerPerceptionService.js';
import { SystemMonitorService } from '../SystemMonitorService.js';
import { VisionService, DefaultVisionProvider } from '../VisionService.js';
import { DefaultWindowProvider } from '../../platform/WindowProvider.js';

async function runPhase7EnvironmentTests() {
  console.log('--- RUNNING PHASE 7 ENVIRONMENT PERCEPTION SUITE ---');
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

  // 1. Test IWindowProvider & Environment Snapshot Capture
  {
    const mockWindowProvider = {
      getActiveWindow: async () => ({
        title: 'ORION AI Command Shell',
        processName: 'Electron',
        bounds: { x: 0, y: 0, width: 1920, height: 1080 }
      }),
      getVisibleWindows: async () => ([
        { title: 'ORION AI Command Shell', processName: 'Electron' },
        { title: 'Visual Studio Code', processName: 'Code.exe' }
      ])
    };
    const systemMonitor = new SystemMonitorService();
    const visionService = new VisionService(new DefaultVisionProvider());
    const perception = new ComputerPerceptionService(systemMonitor, visionService, mockWindowProvider as any);

    const snapshot = await perception.captureEnvironment('STANDBY', 'Test Active Task');
    assert(snapshot.activeApp === 'Electron', 'Active application process identified cleanly');
    assert(snapshot.activeWindow?.title === 'ORION AI Command Shell', 'Active window title captured cleanly');
    assert(snapshot.visibleWindows?.length === 2, 'Visible windows enumerated safely');
    assert(snapshot.systemTelemetry !== undefined, 'System telemetry attached to environment state snapshot');

    // 2. Test EnvironmentDiff Change Detection
    const freshPerception = new ComputerPerceptionService(systemMonitor, visionService, mockWindowProvider as any);
    const diffInitial = freshPerception.computeDiff(snapshot);
    assert(diffInitial.summary === 'Initial environment baseline captured.', 'Initial environment diff baseline summary correct');

    const modifiedState = {
      ...snapshot,
      activeApp: 'Code.exe',
      activeWindow: { title: 'VS Code - ORION', processName: 'Code.exe' }
    };

    const diffModified = perception.computeDiff(modifiedState);
    assert(diffModified.activeAppChanged === true, 'App change detected by EnvironmentDiff');
    assert(diffModified.summary.includes('App changed from Electron to Code.exe'), 'Diff summary generated cleanly');
  }

  console.log(`\nPHASE 7 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase7EnvironmentTests();
