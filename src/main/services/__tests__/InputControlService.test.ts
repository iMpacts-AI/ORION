import { InputControlService, MockInputDriver } from '../computer/InputControlService';

async function runInputControlTests() {
  console.log('--- RUNNING INPUT CONTROL SERVICE TEST SUITE ---');
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
  const service = new InputControlService(mockDriver);

  // 1. Mouse Move & Click
  {
    await service.moveCursor(100, 200);
    await service.click(300, 400, 'left');
    assert(
      mockDriver.history.some(h => h.action === 'mouseMove' && h.args.x === 100 && h.args.y === 200) &&
      mockDriver.history.some(h => h.action === 'mouseClick' && h.args.button === 'left'),
      'InputControlService executes move and click commands via driver'
    );
  }

  // 2. Double Click & Right Click
  {
    await service.doubleClick(500, 600);
    await service.rightClick(700, 800);
    assert(
      mockDriver.history.some(h => h.action === 'mouseDoubleClick') &&
      mockDriver.history.some(h => h.action === 'mouseClick' && h.args.button === 'right'),
      'InputControlService executes double click and right click'
    );
  }

  // 3. Scroll & Drag
  {
    await service.scroll(5);
    await service.drag({ x: 10, y: 20 }, { x: 30, y: 40 });
    assert(
      mockDriver.history.some(h => h.action === 'scroll' && h.args.amount === 5) &&
      mockDriver.history.some(h => h.action === 'drag'),
      'InputControlService executes scroll and drag gestures'
    );
  }

  // 4. Keyboard Text Input & Hotkeys
  {
    await service.type('Hello ORION');
    await service.pressKey('Enter');
    await service.hotkey(['ctrl', 's']);
    assert(
      mockDriver.history.some(h => h.action === 'typeText' && h.args.text === 'Hello ORION') &&
      mockDriver.history.some(h => h.action === 'pressKey' && h.args.key === 'Enter') &&
      mockDriver.history.some(h => h.action === 'hotkey'),
      'InputControlService executes typing, key press, and hotkey combinations'
    );
  }

  console.log(`\nINPUT CONTROL SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runInputControlTests();
