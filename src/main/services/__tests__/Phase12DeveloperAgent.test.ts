import { DefaultDeveloperAgentProvider } from '../../platform/DeveloperAgentProvider.js';

async function runPhase12DeveloperAgentTests() {
  console.log('--- RUNNING PHASE 12 DEVELOPER AGENT SUITE ---');
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

  const devAgent = new DefaultDeveloperAgentProvider();

  // 1. Test Repository Inspection
  {
    const summary = await devAgent.inspectRepository('.');
    assert(summary.hasPackageJson === true, 'Developer agent inspects package.json correctly');
    assert(summary.languagesDetected.includes('TypeScript/JavaScript'), 'TypeScript language detected cleanly');
  }

  // 2. Test Code Search
  {
    const searchResults = await devAgent.searchCode('.', 'OrionOrchestrator');
    assert(searchResults.length > 0, 'Code search locates symbol definitions cleanly');
  }

  // 3. Test Build Execution Whitelist Security Boundary
  {
    const illegalBuild = await devAgent.executeBuild('.', 'rm -rf /');
    assert(!illegalBuild.success && Boolean(illegalBuild.output.includes('SECURITY ENFORCEMENT')), 'Developer agent security whitelist blocks unapproved command');
  }

  console.log(`\nPHASE 12 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase12DeveloperAgentTests();
