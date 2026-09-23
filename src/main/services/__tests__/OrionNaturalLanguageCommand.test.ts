import { LocalHeuristicAIProvider } from '../AIProvider';
import { ComputerActionPlanner } from '../computer/ComputerActionPlanner';

async function runOrionNaturalLanguageCommandTests() {
  console.log('--- RUNNING ORION KINETIC DESKTOP COMMAND SUITE ---');
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

  const ai = new LocalHeuristicAIProvider();
  const planner = new ComputerActionPlanner();

  // Test 1: "try and open Notepad" intent classification
  {
    const res = await ai.classifyIntent('try and open Notepad');
    assert(
      res.intent === 'AUTOMATION' &&
      res.fastPathMatch?.toolId === 'computer.natural_language_command' &&
      res.fastPathMatch?.args?.command === 'try and open Notepad',
      'Classifies "try and open Notepad" as AUTOMATION routing to computer.natural_language_command'
    );
  }

  // Test 2: "open notepad" and "launch calculator"
  {
    const r1 = await ai.classifyIntent('open notepad');
    const r2 = await ai.classifyIntent('launch calculator');
    assert(
      r1.intent === 'AUTOMATION' && r2.intent === 'AUTOMATION',
      'Classifies application open instructions as AUTOMATION'
    );
  }

  // Test 3: Plan execution for opening Notepad
  {
    const plan = await planner.planTask('try and open Notepad', { isDryRun: true });
    assert(
      plan.actions.length >= 2 &&
      plan.actions[0].type === 'OPEN_APP' &&
      plan.actions[0].target === 'notepad' &&
      plan.actions[1].type === 'FOCUS_WINDOW' &&
      plan.actions[1].target === 'notepad',
      'Plans OPEN_APP and FOCUS_WINDOW for Notepad'
    );
  }

  // Test 4: Plan execution for open + type
  {
    const plan = await planner.planTask('open notepad and type Hello World', { isDryRun: true });
    const hasType = plan.actions.some(a => a.type === 'KEYBOARD_INPUT' && a.parameters?.text?.includes('Hello World'));
    assert(
      plan.actions[0].type === 'OPEN_APP' && hasType,
      'Plans OPEN_APP and KEYBOARD_INPUT for open and type instructions'
    );
  }

  // Test 5: Compound Notepad Type and Save Workflow
  {
    const plan = await planner.planTask('open notepad, type iMpact AI is the future, and save as notes.txt', { isDryRun: true });
    const hasHotkeySave = plan.actions.some(a => a.type === 'HOTKEY' && a.parameters?.keys?.includes('control'));
    const hasFilename = plan.actions.some(a => a.type === 'KEYBOARD_INPUT' && a.parameters?.text === 'notes.txt');
    assert(
      plan.actions[0].type === 'OPEN_APP' && hasHotkeySave && hasFilename,
      'Plans compound open, type, save hotkey, and filename input'
    );
  }

  // Test 6: Calculator Math Expression Computation
  {
    const plan = await planner.planTask('open calculator and calculate 128 * 4', { isDryRun: true });
    const hasMathInput = plan.actions.some(a => a.type === 'KEYBOARD_INPUT' && a.parameters?.text === '128*4');
    assert(
      plan.actions[0].type === 'OPEN_APP' && hasMathInput,
      'Plans calculator launch and automated math expression computation'
    );
  }

  // Test 7: Direct Browser Navigation to Target URL
  {
    const plan = await planner.planTask('open chrome and go to impacts-ai.com', { isDryRun: true });
    const hasTargetUrl = plan.actions.some(a => a.type === 'KEYBOARD_INPUT' && a.parameters?.text === 'https://impacts-ai.com');
    assert(
      plan.actions[0].type === 'OPEN_APP' && hasTargetUrl,
      'Plans Chrome launch and direct URL navigation for domain target'
    );
  }

  // Test 8: Desktop Surface Minimization Toggle
  {
    const plan = await planner.planTask('show desktop', { isDryRun: true });
    const hasWinD = plan.actions.some(a => a.type === 'HOTKEY' && a.parameters?.keys?.includes('win') && a.parameters?.keys?.includes('d'));
    assert(
      hasWinD,
      'Plans Win+D hotkey for show desktop command'
    );
  }

  if (failed > 0) {
    throw new Error(`OrionNaturalLanguageCommand: ${failed} tests failed`);
  }
}

runOrionNaturalLanguageCommandTests().catch(err => {
  console.error(err);
  process.exit(1);
});
