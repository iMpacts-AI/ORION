import { ScreenUnderstandingService } from '../computer/ScreenUnderstandingService';
import { ScreenCaptureService } from '../computer/ScreenCaptureService';
import { WindowManagerService } from '../computer/WindowManagerService';
import { ComputerObservation, UIElementNode } from '../../../shared/types/action';

async function runScreenUnderstandingTests() {
  console.log('--- RUNNING SCREEN UNDERSTANDING SERVICE TEST SUITE ---');
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

  const mockCapture: any = {
    getScreenMetrics: async () => ({ width: 1920, height: 1080, scaleFactor: 1 }),
    captureFullScreenBase64: async () => 'data:image/png;base64,mock',
    getCursorPosition: async () => ({ x: 500, y: 300 })
  };

  const mockWindowManager: any = {
    getActiveWindow: async () => ({
      title: 'Google Chrome - Nvidia Investor Relations',
      processName: 'chrome.exe',
      processId: 1042,
      bounds: { x: 0, y: 0, width: 1920, height: 1040 }
    }),
    getVisibleWindows: async () => [
      { title: 'Google Chrome', processName: 'chrome.exe', processId: 1042, bounds: { x: 0, y: 0, width: 1920, height: 1040 } },
      { title: 'Visual Studio Code', processName: 'Code.exe', processId: 2048, bounds: { x: 0, y: 0, width: 960, height: 1040 } }
    ]
  };

  const service = new ScreenUnderstandingService(mockCapture, mockWindowManager);

  // 1. Capture Observation
  {
    const obs = await service.captureObservation();
    assert(
      obs.screen.width === 1920 &&
      obs.screen.height === 1080 &&
      obs.activeWindow.processName === 'chrome.exe' &&
      obs.applications.includes('chrome.exe') &&
      obs.confidence >= 0.9,
      'captureObservation compiles unified observation model with active window and dimensions'
    );
  }

  // 2. Locate Element by exact text
  {
    const testObs: ComputerObservation = {
      timestamp: Date.now(),
      screen: { width: 1920, height: 1080, scaleFactor: 1 },
      activeWindow: { title: 'Settings', processName: 'settings.exe', processId: 1, bounds: { x: 0, y: 0, width: 800, height: 600 } },
      cursor: { x: 100, y: 100 },
      visibleText: ['Settings', 'Network & Internet', 'Privacy'],
      interactiveElements: [
        {
          id: 'btn_network',
          role: 'button',
          text: 'Network & Internet',
          bounds: { x: 100, y: 200, width: 250, height: 50 },
          enabled: true,
          visible: true,
          confidence: 0.95,
          source: 'ACCESSIBILITY'
        }
      ],
      applications: ['settings.exe'],
      confidence: 0.95
    };

    const match = service.locateElement(testObs, { text: 'Network & Internet', role: 'button' });
    assert(
      Boolean(match.element) &&
      match.confidence >= 0.9 &&
      match.centerPoint?.x === 225 &&
      match.centerPoint?.y === 225,
      'locateElement locates interactive button and calculates exact centerPoint'
    );
  }

  // 3. Fallback to approximate location when text is missing
  {
    const testObs: ComputerObservation = {
      timestamp: Date.now(),
      screen: { width: 1920, height: 1080, scaleFactor: 1 },
      activeWindow: { title: 'Unknown', processName: 'unknown.exe', processId: 2, bounds: { x: 0, y: 0, width: 500, height: 500 } },
      cursor: { x: 0, y: 0 },
      visibleText: [],
      interactiveElements: [],
      applications: [],
      confidence: 0.7
    };

    const fallback = service.locateElement(testObs, {
      text: 'NonExistentButton',
      approximateLocation: { x: 450, y: 350 }
    });

    assert(
      fallback.centerPoint?.x === 450 && fallback.centerPoint?.y === 350 && fallback.confidence === 0.65,
      'locateElement falls back safely to approximateLocation with calibrated confidence'
    );
  }

  console.log(`\nSCREEN UNDERSTANDING SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runScreenUnderstandingTests();
