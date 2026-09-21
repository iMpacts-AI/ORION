import { DefaultBrowserProvider } from '../../platform/BrowserProvider.js';

async function runPhase10BrowserCapabilityTests() {
  console.log('--- RUNNING PHASE 10 BROWSER CAPABILITY SUITE ---');
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

  const browser = new DefaultBrowserProvider();

  // 1. Test Browser Observation Baseline
  {
    const obs = await browser.observe();
    assert(obs.url === 'about:blank', 'Initial browser URL baseline is about:blank');
  }

  // 2. Test Safe Navigation & Protocol Security Boundary
  {
    const validNav = await browser.navigate('https://orion.ai');
    assert(validNav.success && validNav.observation?.url === 'https://orion.ai', 'Safe HTTPS URL navigation succeeds cleanly');

    const invalidNav = await browser.navigate('file:///C:/Windows/System32/cmd.exe');
    assert(!invalidNav.success && Boolean(invalidNav.error?.includes('SECURITY ENFORCEMENT')), 'Browser protocol security boundary cleanly blocks file:/// navigation');
  }

  console.log(`\nPHASE 10 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase10BrowserCapabilityTests();
