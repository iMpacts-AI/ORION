import assert from 'assert';
import http from 'http';
import fs from 'fs';
import { DefaultBrowserProvider } from '../../platform/BrowserProvider';
import { ToolService } from '../ToolService';
import { OrionOrchestrator } from '../OrionOrchestrator';
import { VisionService, CloudVisionAdapter } from '../VisionService';
import { VoiceService } from '../VoiceService';
import { OrionAIProviderRouter } from '../OrionAIProviderRouter';
import { AgentPolicyService } from '../AgentPolicyService';
import { OrionAgentSystem } from '../OrionAgentSystem';
import { SecurityPolicyMiddleware } from '../SecurityPolicyMiddleware';
import { ProcessSupervisor } from '../computer/ProcessSupervisor';
import { OrionActiveAppsTracker } from '../../../cli/OrionActiveAppsTracker';

function logPass(message: string) {
  console.log(`[PASS] ${message}`);
}

async function createAcceptanceServer(): Promise<{ server: http.Server; baseUrl: string }> {
  const server = http.createServer((req, res) => {
    const reqUrl = req.url || '/';

    if (reqUrl === '/' || reqUrl.startsWith('/example')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>Example Domain</title></head>
<body>
  <div>
    <h1>Example Domain</h1>
    <p>This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.</p>
    <p><a id="more-info-link" href="/repo">More information...</a></p>
  </div>
</body>
</html>`);
      return;
    }

    if (reqUrl.startsWith('/repo')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>iMpacts-AI/ORION: Autonomous Desktop AI Command System</title></head>
<body>
  <main>
    <h1>iMpacts-AI / ORION</h1>
    <p>ORION is an autonomous desktop AI workstation and multi-agent engineering operating system built with Electron, React, TypeScript, and closed-loop verification.</p>
    <ul>
      <li>Closed-Loop Chrome &amp; Desktop Execution Engine</li>
      <li>10-Agent Specialist Engineering Command Centre</li>
      <li>SHA-256 Protected Security Policy &amp; Hardware-Grade E-Stop</li>
    </ul>
  </main>
</body>
</html>`);
      return;
    }

    if (reqUrl.startsWith('/tab2')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>ORION Architecture Documentation</title></head>
<body>
  <h1>ORION Architecture Overview</h1>
  <p>Secondary tab verified in multi-tab workspace workflow.</p>
</body>
</html>`);
      return;
    }

    if (reqUrl.startsWith('/dynamic')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>ORION Dynamic State Test</title></head>
<body>
  <h1>Dynamic Page State</h1>
  <button id="mutate-btn" onclick="
    alert('Unexpected modal alert triggered by page!');
    const oldBtn = document.getElementById('stale-target-btn');
    if (oldBtn) oldBtn.remove();
    const statusEl = document.getElementById('status-text');
    if (statusEl) statusEl.textContent = 'DOM_MUTATED_AND_DIALOG_CLEARED';
  ">Trigger Dynamic Change</button>
  <button id="stale-target-btn">Stale Button That Disappears</button>
  <button id="disabled-btn" disabled>Disabled Action</button>
  <p id="status-text">INITIAL_STATE</p>
</body>
</html>`);
      return;
    }

    if (reqUrl.startsWith('/form')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>ORION Controlled Form Submission</title></head>
<body>
  <h1>Project Registration Form</h1>
  <form id="orion-form" onsubmit="event.preventDefault(); document.title = 'Form Submitted Successfully'; document.getElementById('form-status').textContent = 'SUBMITTED_OK';">
    <label for="project-name">Project Name</label>
    <input id="project-name" name="projectName" type="text" value="" />
    <label for="owner-role">Role</label>
    <input id="owner-role" name="ownerRole" type="text" value="" />
    <label for="api-token">API Secret Token</label>
    <input id="api-token" name="apiToken" type="password" value="" />
    <button id="submit-form-btn" type="submit">Submit Registration</button>
  </form>
  <p id="form-status">DRAFT_READY</p>
</body>
</html>`);
      return;
    }

    if (reqUrl.startsWith('/login-wall')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>Sign in to Your Account</title></head>
<body>
  <h1>Sign in to continue</h1>
  <form>
    <input id="username" type="text" />
    <input id="password" type="password" />
    <button type="submit">Log In</button>
  </form>
</body>
</html>`);
      return;
    }

    if (reqUrl.startsWith('/captcha-wall')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>Security Challenge - Verify you are human</title></head>
<body>
  <h1>Verify you are human</h1>
  <div class="g-recaptcha" data-sitekey="test">CAPTCHA Challenge Required</div>
</body>
</html>`);
      return;
    }

    if (reqUrl.startsWith('/slow')) {
      setTimeout(() => {
        if (!res.writableEnded) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<html><head><title>Slow Page</title></head><body>Finally loaded</body></html>');
        }
      }, 2500);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address() as { port: number };
  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`
  };
}

async function runAcceptanceSuite() {
  console.log('=== ORION UI + REAL CHROME EXECUTION ACCEPTANCE SUITE (TESTS A - I) ===');

  const { server, baseUrl } = await createAcceptanceServer();
  const browserProvider = new DefaultBrowserProvider();
  const router = new OrionAIProviderRouter();
  const toolService = new ToolService(undefined, undefined, browserProvider);
  toolService.getComputerUseService().getPlanner().setAIProvider(router);
  const visionService = new VisionService(new CloudVisionAdapter(router));
  const voiceService = new VoiceService();
  const orchestrator = new OrionOrchestrator(toolService, visionService, voiceService, router);
  const policyService = new AgentPolicyService();
  const agentSystem = new OrionAgentSystem(policyService, toolService, router);
  const securityMiddleware = SecurityPolicyMiddleware.getInstance();
  const activeAppsTracker = new OrionActiveAppsTracker();

  // Ensure E-stop is clear before starting
  ProcessSupervisor.getInstance().resetEstop();
  toolService.getComputerUseService().resetEmergencyStop();

  try {
    // =========================================================================
    // TEST A — Launch Chrome (`Open Chrome.`)
    // =========================================================================
    console.log('\n--- Running Test A: Real Chrome Launch & Verification ---');
    const localChromeExe = DefaultBrowserProvider.findLocalChromiumExecutable();
    assert.ok(localChromeExe && fs.existsSync(localChromeExe), `Expected local Chrome/Chromium executable to exist on disk, got: ${localChromeExe}`);

    const launchRes = await browserProvider.openChromeWindow(`${baseUrl}/example`, {
      visibleWindow: false,
      useCdp: true,
      timeoutMs: 12000
    });
    assert.strictEqual(launchRes.success, true, `Expected openChromeWindow to succeed: ${launchRes.error}`);
    assert.strictEqual(launchRes.postconditionsVerified, true, 'Expected postconditionsVerified=true for Chrome launch');
    assert.ok(launchRes.observation, 'Expected initial BrowserObservation after launch');
    assert.strictEqual(launchRes.observation?.title, 'Example Domain', 'Expected Example Domain title after Chrome launch');
    logPass('Test A1: Real Chrome process launched via CDP session and verified initial page observation.');

    // Verify planner decomposition for "Open Chrome." (no blind mouse click on address bar)
    const openChromePlan = await toolService.getComputerUseService().getPlanner().planTask('Open Chrome.');
    assert.ok(openChromePlan.actions.length >= 2, 'Expected at least 2 actions in Open Chrome plan');
    assert.strictEqual(openChromePlan.actions[0].type, 'OPEN_APP', 'Expected action 1 to be OPEN_APP');
    const hasBlindAddressClick = openChromePlan.actions.some(s => s.type === 'MOUSE_CLICK');
    assert.strictEqual(hasBlindAddressClick, false, 'Expected Open Chrome plan NOT to include blind MOUSE_CLICK on address bar');
    logPass('Test A2: ComputerActionPlanner decomposes "Open Chrome." cleanly without blind address-bar mouse clicks.');

    // =========================================================================
    // TEST B — Navigate (`Open https://example.com in Chrome.`)
    // =========================================================================
    console.log('\n--- Running Test B: Closed-Loop URL Navigation & Postcondition Verification ---');
    const navReport = await browserProvider.executeClosedLoopTask({
      goal: `Open ${baseUrl}/example in Chrome.`,
      useCdpAdapter: true,
      visibleWindow: false,
      timeoutMs: 10000
    });
    assert.strictEqual(navReport.status, 'COMPLETED', `Expected CLOSED_LOOP navigate status=COMPLETED, got ${navReport.status}`);
    assert.strictEqual(navReport.postconditionsVerified, true, 'Expected postconditionsVerified=true on navigation');
    assert.strictEqual(navReport.observation?.title, 'Example Domain');
    assert.ok(
      (navReport.observation?.extractedText || navReport.observation?.contentSummary || '').includes('illustrative examples in documents'),
      'Expected visible text from Example Domain page'
    );
    const stageNames = navReport.steps.map(s => s.stage);
    for (const requiredStage of ['OBSERVE', 'UNDERSTAND', 'PLAN', 'VALIDATE', 'AUTHORIZE', 'EXECUTE', 'OBSERVE_AGAIN', 'VERIFY', 'RECOVER_OR_REPORT'] as const) {
      assert.ok(stageNames.includes(requiredStage), `Expected closed-loop trace to include stage ${requiredStage}`);
    }
    logPass('Test B1: Closed-loop navigation executed all 9 stages and verified URL + page title ("Example Domain").');

    // Also test via ToolService `browser.navigate`
    const toolNavRes = await toolService.executeTool({
      id: 'call_test_b_nav',
      toolId: 'browser.navigate',
      toolName: 'Navigate to URL',
      arguments: { url: `${baseUrl}/example` },
      timestamp: Date.now(),
      requiresUserApproval: false
    });
    assert.strictEqual(toolNavRes.success, true, `Expected ToolService browser.navigate to succeed: ${toolNavRes.error}`);
    assert.strictEqual(toolNavRes.data?.observation?.title, 'Example Domain');
    logPass('Test B2: ToolService browser.navigate verified target URL and page title.');

    // =========================================================================
    // TEST C — Search (`Search for the official ORION GitHub repository and show me the result.`)
    // =========================================================================
    console.log('\n--- Running Test C: Web Search & Grounded Result Extraction ---');
    const searchReport = await browserProvider.executeClosedLoopTask({
      goal: 'Search for the official ORION GitHub repository and show me the result.',
      timeoutMs: 12000
    });
    assert.strictEqual(searchReport.status, 'COMPLETED', `Expected search status=COMPLETED, got ${searchReport.status}`);
    assert.strictEqual(searchReport.postconditionsVerified, true, 'Expected postconditionsVerified=true for search');
    assert.ok(searchReport.searchResults && searchReport.searchResults.length > 0, 'Expected non-empty searchResults');
    const officialHit = searchReport.searchResults!.find(r => r.url.includes('github.com/iMpacts-AI/ORION'));
    assert.ok(officialHit, `Expected official ORION repository in search results, got: ${JSON.stringify(searchReport.searchResults)}`);
    assert.ok(officialHit!.title.length > 0, 'Expected non-empty title on official repo search result');
    logPass(`Test C: Search identified official ORION repository (${officialHit!.title} -> ${officialHit!.url}).`);

    // =========================================================================
    // TEST D — Extract Information (`Open the official repository and summarize its visible project information.`)
    // =========================================================================
    console.log('\n--- Running Test D: Grounded Repository Information Extraction & Multi-Tab Support ---');
    const extractReport = await browserProvider.executeClosedLoopTask({
      goal: `Open ${baseUrl}/repo and summarize its visible project information.`,
      useCdpAdapter: true,
      visibleWindow: false,
      timeoutMs: 10000
    });
    assert.strictEqual(extractReport.status, 'COMPLETED');
    assert.strictEqual(extractReport.postconditionsVerified, true);
    assert.ok(extractReport.summary.includes('iMpacts-AI/ORION'), 'Expected grounded summary to include page title');
    assert.ok(
      extractReport.summary.includes('Closed-Loop Chrome') ||
        extractReport.summary.includes('autonomous desktop AI workstation'),
      'Expected grounded summary to include actual visible text from repository page'
    );
    logPass('Test D1: Grounded page extraction summarized real visible DOM content without fabrication.');

    // Multi-tab workflow verification (Capability #5)
    const multiTabRes = await browserProvider.openMultipleTabs([`${baseUrl}/repo`, `${baseUrl}/tab2`], {
      useCdpAdapter: true,
      visibleWindow: false,
      timeoutMs: 10000
    });
    assert.strictEqual(multiTabRes.success, true);
    assert.ok((multiTabRes.observation?.tabs?.length || 0) >= 2, 'Expected at least 2 tracked tabs in BrowserObservation');
    logPass(`Test D2: Multi-tab browser control opened and verified ${multiTabRes.observation?.tabs?.length} tabs.`);

    // =========================================================================
    // TEST E — Changing Page State (DOM Mutation, Unexpected JS Alert Dialog, Stale & Disabled Elements)
    // =========================================================================
    console.log('\n--- Running Test E: Dynamic DOM Mutation, Dialog Interception & Stale Element Detection ---');
    const dynNav = await browserProvider.navigate(`${baseUrl}/dynamic`, {
      useCdpAdapter: true,
      visibleWindow: false,
      timeoutMs: 8000
    });
    assert.strictEqual(dynNav.success, true);
    assert.strictEqual(dynNav.observation?.title, 'ORION Dynamic State Test');

    // Step 1: Click #mutate-btn which triggers an unexpected JS alert() AND removes #stale-target-btn from the DOM
    const mutateClick = await browserProvider.click('#mutate-btn');
    assert.strictEqual(mutateClick.success, true, `Expected #mutate-btn click to succeed and auto-dismiss JS dialog: ${mutateClick.error}`);
    assert.ok(
      (mutateClick.observation?.extractedText || mutateClick.observation?.contentSummary || '').includes('DOM_MUTATED_AND_DIALOG_CLEARED'),
      `Expected re-observed DOM to show 'DOM_MUTATED_AND_DIALOG_CLEARED', got: ${mutateClick.observation?.extractedText}`
    );
    logPass('Test E1: Unexpected JS alert dialog was intercepted/dismissed via CDP and post-click DOM mutation was re-observed.');

    // Step 2: Attempt to click #stale-target-btn which was removed by the mutation -> must fail deterministically
    const staleClick = await browserProvider.click('#stale-target-btn');
    assert.strictEqual(staleClick.success, false, 'Expected clicking removed/stale element #stale-target-btn to fail');
    assert.strictEqual(staleClick.errorCode, 'ELEMENT_NOT_FOUND', `Expected ELEMENT_NOT_FOUND for stale element, got ${staleClick.errorCode}`);
    assert.strictEqual(staleClick.postconditionsVerified, false);
    logPass('Test E2: Clicking a removed/stale DOM element deterministically returned ELEMENT_NOT_FOUND instead of blindly succeeding.');

    // Step 3: Attempt to click #disabled-btn -> must fail with STALE_ELEMENT / disabled check
    const disabledClick = await browserProvider.click('#disabled-btn');
    assert.strictEqual(disabledClick.success, false, 'Expected clicking disabled button to fail');
    assert.strictEqual(disabledClick.postconditionsVerified, false);
    logPass(`Test E3: Clicking a disabled element deterministically failed (${disabledClick.errorCode}).`);

    // =========================================================================
    // TEST F — Approval Gate Before Form Submission & Sensitive Field Protection
    // =========================================================================
    console.log('\n--- Running Test F: Form Preparation & Approval Gate Before Submission ---');
    await browserProvider.navigate(`${baseUrl}/form`, { useCdpAdapter: true, visibleWindow: false, timeoutMs: 8000 });

    // 1. Attempt to type into sensitive password/token field without authorization -> must be blocked
    const sensitiveBlockRes = await browserProvider.typeText('#api-token', 'secret-value-123', {
      explicitAuthorization: false
    });
    assert.strictEqual(sensitiveBlockRes.success, false, 'Expected typing into sensitive password field without authorization to be blocked');
    assert.strictEqual(sensitiveBlockRes.errorCode, 'SENSITIVE_FIELD_BLOCKED');
    logPass('Test F1: Sensitive password/secret input field was automatically blocked without explicit authorization.');

    // 2. Fill safe form fields and request submission WITHOUT explicitAuthorization -> must prepare fields and pause with AWAITING_APPROVAL
    const unapprovedFormReport = await browserProvider.executeClosedLoopTask({
      goal: 'Fill the project registration form and submit it.',
      formFields: {
        '#project-name': 'ORION Desktop Workstation',
        '#owner-role': 'Principal Systems Architect'
      },
      submitSelector: '#submit-form-btn',
      submitForm: true,
      explicitAuthorization: false
    });
    assert.strictEqual(
      unapprovedFormReport.status,
      'AWAITING_APPROVAL',
      `Expected status=AWAITING_APPROVAL when submitting without authorization, got ${unapprovedFormReport.status}`
    );
    assert.strictEqual(unapprovedFormReport.errorCode, 'AUTHORIZATION_REQUIRED');
    assert.strictEqual(unapprovedFormReport.postconditionsVerified, false, 'Expected postconditionsVerified=false before approval');
    logPass('Test F2: Form preparation filled safe fields and halted before submission with AWAITING_APPROVAL (AUTHORIZATION_REQUIRED).');

    // 3. Register and approve a bound approval request in SecurityPolicyMiddleware, then submit with explicitAuthorization=true
    const reqApproval = securityMiddleware.createApprovalRequest({
      tool: {
        id: 'browser.click',
        name: 'Click Browser Element',
        category: 'BROWSER',
        description: 'Click an element in the browser',
        permissionLevel: 'MEDIUM',
        parameters: {}
      },
      arguments: { selector: '#submit-form-btn', url: `${baseUrl}/form` },
      evaluatedRisk: 'HIGH_RISK',
      agentId: 'commander',
      reason: 'Approve final form submission on /form'
    });
    assert.strictEqual(reqApproval.status, 'PENDING');
    const approvedRecord = securityMiddleware.approveRequest(reqApproval.approvalId);
    assert.ok(approvedRecord && approvedRecord.status === 'APPROVED', 'Expected approval request to transition to APPROVED');

    const approvedFormReport = await browserProvider.executeClosedLoopTask({
      goal: 'Submit the approved project registration form.',
      formFields: {
        '#project-name': 'ORION Desktop Workstation',
        '#owner-role': 'Principal Systems Architect'
      },
      submitSelector: '#submit-form-btn',
      submitForm: true,
      explicitAuthorization: true
    });
    assert.strictEqual(approvedFormReport.status, 'COMPLETED', `Expected status=COMPLETED after approval, got ${approvedFormReport.status}`);
    assert.strictEqual(approvedFormReport.postconditionsVerified, true);
    assert.strictEqual(approvedFormReport.observation?.title, 'Form Submitted Successfully');
    logPass('Test F3: Form submission succeeded and verified post-submit DOM state once explicit approval was granted.');

    // =========================================================================
    // TEST G — Failure Handling (Nonexistent URL, Timeout, Missing Binary, Login/CAPTCHA Blockers)
    // =========================================================================
    console.log('\n--- Running Test G: Deterministic Failure & Blocker Reporting ---');
    // G1: Nonexistent local port / unreachable URL
    const unreachableReport = await browserProvider.executeClosedLoopTask({
      goal: 'Open http://127.0.0.1:59997/nonexistent in Chrome.',
      useCdpAdapter: false,
      timeoutMs: 3000
    });
    assert.strictEqual(unreachableReport.status, 'FAILED', 'Expected unreachable URL to report FAILED');
    assert.strictEqual(unreachableReport.postconditionsVerified, false, 'Expected postconditionsVerified=false on unreachable URL');
    logPass('Test G1: Unreachable URL reported status=FAILED with postconditionsVerified=false.');

    // G2: Timed-out navigation (/slow with 250ms timeout)
    const timeoutNav = await browserProvider.navigate(`${baseUrl}/slow`, { useCdpAdapter: false, timeoutMs: 250 });
    assert.strictEqual(timeoutNav.success, false, 'Expected /slow with 250ms timeout to fail');
    assert.strictEqual(timeoutNav.postconditionsVerified, false);
    logPass(`Test G2: Timed-out navigation deterministically failed (${timeoutNav.errorCode}).`);

    // G3: Missing browser executable override
    const missingBinRes = await browserProvider.openChromeWindow(`${baseUrl}/example`, {
      executableOverride: 'C:\\nonexistent_orion_browser_binary_xyz.exe'
    });
    assert.strictEqual(missingBinRes.success, false, 'Expected missing browser executable to fail');
    assert.strictEqual(missingBinRes.errorCode, 'BROWSER_UNAVAILABLE', `Expected BROWSER_UNAVAILABLE for missing browser binary, got ${missingBinRes.errorCode}`);
    assert.strictEqual(missingBinRes.postconditionsVerified, false);
    logPass('Test G3: Missing browser executable returned BROWSER_UNAVAILABLE with postconditionsVerified=false.');

    // G4: Login wall & CAPTCHA challenge detection
    const loginReport = await browserProvider.executeClosedLoopTask({
      goal: `Open ${baseUrl}/login-wall in browser.`,
      useCdpAdapter: false,
      timeoutMs: 8000
    });
    assert.strictEqual(loginReport.status, 'BLOCKED', `Expected LOGIN_REQUIRED page to report BLOCKED, got ${loginReport.status}`);
    assert.ok(loginReport.observation?.blockers?.some(b => b.type === 'LOGIN_REQUIRED'), 'Expected LOGIN_REQUIRED blocker to be detected');

    const captchaReport = await browserProvider.executeClosedLoopTask({
      goal: `Open ${baseUrl}/captcha-wall in browser.`,
      useCdpAdapter: false,
      timeoutMs: 8000
    });
    assert.strictEqual(captchaReport.status, 'BLOCKED', `Expected CAPTCHA page to report BLOCKED, got ${captchaReport.status}`);
    assert.ok(captchaReport.observation?.blockers?.some(b => b.type === 'CAPTCHA'), 'Expected CAPTCHA blocker to be detected');
    logPass('Test G4: Login wall and CAPTCHA challenge pages were detected and reported honestly as BLOCKED.');

    // =========================================================================
    // TEST H — Cancellation & E-Stop Enforcement
    // =========================================================================
    console.log('\n--- Running Test H: Mid-Flight Cancellation & Hardware-Grade E-Stop ---');
    // H1: Cancel active task via AbortController
    const cancelController = new AbortController();
    setTimeout(() => cancelController.abort(), 80);
    const cancelledReport = await browserProvider.executeClosedLoopTask({
      goal: `Open ${baseUrl}/slow in browser.`,
      useCdpAdapter: false,
      timeoutMs: 5000,
      signal: cancelController.signal
    });
    assert.strictEqual(cancelledReport.status, 'CANCELLED', `Expected status=CANCELLED, got ${cancelledReport.status}`);
    assert.strictEqual(cancelledReport.postconditionsVerified, false);
    logPass('Test H1: Mid-flight browser task cancellation aborted cleanly and returned status=CANCELLED.');

    // H2: Trigger E-Stop and verify browser tasks are immediately blocked
    ProcessSupervisor.getInstance().triggerEstop('Acceptance Test H E-Stop');
    assert.strictEqual(ProcessSupervisor.getInstance().isEstopActive(), true);

    const estoppedReport = await browserProvider.executeClosedLoopTask({
      goal: `Open ${baseUrl}/example in browser.`
    });
    assert.strictEqual(estoppedReport.status, 'ESTOPPED', `Expected status=ESTOPPED while E-Stop is active, got ${estoppedReport.status}`);
    assert.strictEqual(estoppedReport.postconditionsVerified, false);

    // Reset E-Stop and confirm recovery
    ProcessSupervisor.getInstance().resetEstop();
    toolService.getComputerUseService().resetEmergencyStop();
    assert.strictEqual(ProcessSupervisor.getInstance().isEstopActive(), false);
    logPass('Test H2: E-Stop immediately blocked browser execution (status=ESTOPPED) and recovered cleanly after explicit reset.');

    // =========================================================================
    // TEST I — UI Truthfulness, Active Apps Panel (Chrome & Spotify Icons) & Specialist Agent Delegation
    // =========================================================================
    console.log('\n--- Running Test I: UI Truthfulness, Active Apps Panel & Specialist Agent Delegation ---');
    // I1: Verify Active Apps Panel tracks Chrome and Spotify with real local PNG icons
    activeAppsTracker.recordToolStarted({
      id: 'ui_chrome_open',
      toolId: 'system.open_program',
      toolName: 'Open Program',
      arguments: { program: 'chrome' },
      timestamp: Date.now(),
      requiresUserApproval: false
    });
    activeAppsTracker.recordToolCompleted({
      toolCallId: 'ui_chrome_open',
      toolId: 'system.open_program',
      success: true,
      verificationStatus: 'VERIFIED',
      verified: true,
      data: 'Launched chrome',
      timestamp: Date.now(),
      executionTimeMs: 120
    });

    activeAppsTracker.refreshFromSystem(true);
    const trackedApps = activeAppsTracker.getAllTrackedApplications();
    const chromeApp = trackedApps.find(a => a.id === 'chrome');
    const spotifyApp = trackedApps.find(a => a.id === 'spotify');
    assert.ok(chromeApp, 'Expected Chrome in Active Apps Panel');
    assert.ok(spotifyApp, 'Expected Spotify in Active Apps Panel');
    assert.strictEqual(chromeApp!.iconVerifiedLocal, true, 'Expected Chrome PNG icon to exist on disk');
    assert.strictEqual(spotifyApp!.iconVerifiedLocal, true, 'Expected Spotify PNG icon to exist on disk');
    assert.ok(chromeApp!.iconPngPath && fs.existsSync(chromeApp!.iconPngPath), 'Expected Chrome iconPngPath to exist on disk');
    assert.ok(spotifyApp!.iconPngPath && fs.existsSync(spotifyApp!.iconPngPath), 'Expected Spotify iconPngPath to exist on disk');
    const chromeIconDataUrl = `data:image/png;base64,${fs.readFileSync(chromeApp!.iconPngPath!).toString('base64')}`;
    const spotifyIconDataUrl = `data:image/png;base64,${fs.readFileSync(spotifyApp!.iconPngPath!).toString('base64')}`;
    assert.ok(chromeIconDataUrl.startsWith('data:image/png;base64,iVBOR'), 'Expected valid PNG base64 header for Chrome icon');
    assert.ok(spotifyIconDataUrl.startsWith('data:image/png;base64,iVBOR'), 'Expected valid PNG base64 header for Spotify icon');
    logPass('Test I1: Active Apps Panel provides verified Chrome & Spotify entries with base64 PNG icons and real OS window/process states.');

    // I2: Verify Specialist Agent Delegation (`recon`, `security`, `qa`) produces real tool-backed execution records
    const delegationResult = await agentSystem.delegateEngineeringGoal(
      'Verify ORION UI and Chrome closed-loop integration readiness',
      { targetPath: 'package.json' }
    );
    assert.strictEqual(delegationResult.overallStatus, 'COMPLETED', `Expected delegation status=COMPLETED, got ${delegationResult.overallStatus}`);
    assert.strictEqual(delegationResult.tasksExecuted.length, 3, 'Expected 3 specialist agent tasks (recon, security, qa)');
    for (const task of delegationResult.tasksExecuted) {
      assert.strictEqual(task.status, 'COMPLETED', `Expected agent ${task.agentId} task to complete`);
      assert.strictEqual(task.verified, true, `Expected agent ${task.agentId} task to be tool-verified`);
    }
    logPass('Test I2: Multi-agent delegation (recon, security, qa) executed real tool calls and returned verified evidence records.');

    // I3: Verify Orchestrator end-to-end streaming command with real tool execution
    const streamedTokens: string[] = [];
    const orchResponse = await orchestrator.processCommand(
      `Open ${baseUrl}/example in Chrome`,
      'TEXT',
      { onToken: (token) => streamedTokens.push(token) }
    );
    assert.ok(orchResponse.response.length > 0, 'Expected non-empty orchestrator response');
    assert.ok(orchResponse.toolCallsExecuted.length > 0, 'Expected orchestrator to execute browser.navigate tool call');
    assert.strictEqual(orchResponse.toolCallsExecuted[0].toolId, 'browser.navigate');
    logPass('Test I3: OrionOrchestrator executed end-to-end Chrome navigation command and returned grounded verification details.');

    console.log('\n=== ALL ACCEPTANCE TESTS (A - I) PASSED WITH 100% VERIFIED EVIDENCE ===');
  } finally {
    await browserProvider.close();
    (server as any).closeAllConnections?.();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

runAcceptanceSuite()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[FAIL] OrionChromeAndUIAcceptance failed:', err);
    process.exit(1);
  });
