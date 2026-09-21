import { ComputerActionPlanner } from '../computer/ComputerActionPlanner';

async function runComputerActionPlannerTests() {
  console.log('--- RUNNING COMPUTER ACTION PLANNER TEST SUITE ---');
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

  const planner = new ComputerActionPlanner();

  // 1. Browser search planning
  {
    const plan = await planner.planTask('Open Chrome and search for latest Nvidia earnings');
    assert(
      plan.actions.length >= 3 &&
      plan.actions[0].type === 'OPEN_APP' &&
      plan.actions[0].target === 'chrome' &&
      plan.actions.some(a => a.type === 'KEYBOARD_INPUT' && a.parameters?.text?.includes('Nvidia')),
      'Decomposes browser search command into launch, address bar click, query typing, and enter'
    );
  }

  // 2. VS Code ORION Project
  {
    const plan = await planner.planTask('Open the ORION project in VS Code');
    assert(
      plan.actions[0].type === 'OPEN_APP' &&
      plan.actions[0].target === 'Code' &&
      plan.actions[0].parameters?.path?.includes('ORION'),
      'Plans opening VS Code with direct ORION project directory path'
    );
  }

  // 3. Window Switching
  {
    const plan = await planner.planTask('Switch to Chrome');
    assert(
      plan.actions[0].type === 'FOCUS_WINDOW' &&
      plan.actions[0].target?.toLowerCase() === 'chrome',
      'Plans window focus transition to target application'
    );
  }

  // 4. Scroll viewport
  {
    const plan = await planner.planTask('Scroll down');
    assert(
      plan.actions[0].type === 'SCROLL' &&
      (plan.actions[0].parameters?.amount || 0) < 0,
      'Plans downward scrolling action'
    );
  }

  // 5. Click button
  {
    const plan = await planner.planTask('Click the Settings button');
    assert(
      plan.actions[0].type === 'MOUSE_CLICK' &&
      plan.actions[0].selector?.text === 'Settings',
      'Plans element targeting click for Settings button'
    );
  }

  console.log(`\nCOMPUTER ACTION PLANNER SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runComputerActionPlannerTests();
