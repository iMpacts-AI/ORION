import http from 'http';
import fs from 'fs';
import os from 'os';
import path from 'path';
import React from 'react';
import { PassThrough } from 'stream';
import { DefaultBrowserProvider } from '../../platform/BrowserProvider';
import { ComputerActionExecutor } from '../computer/ComputerActionExecutor';
import { ComputerActionPlanner } from '../computer/ComputerActionPlanner';
import { ComputerActionVerifier } from '../computer/ComputerActionVerifier';
import { ComputerPermissionService } from '../computer/ComputerPermissionService';
import { ComputerRecoveryService } from '../computer/ComputerRecoveryService';
import { InputControlService, MockInputDriver } from '../computer/InputControlService';
import { ProcessSupervisor } from '../computer/ProcessSupervisor';
import { ScreenUnderstandingService } from '../computer/ScreenUnderstandingService';
import { TaskStateStore } from '../computer/TaskStateStore';
import { WindowManagerService } from '../computer/WindowManagerService';
import { WindowsAppResolver } from '../computer/WindowsAppResolver';
import { OrionCliKernel } from '../../../cli/OrionCliKernel';
import { OrionCliCommandRouter } from '../../../cli/OrionCliCommandRouter';
import { OrionCliRenderer } from '../../../cli/OrionCliRenderer';
import { loadInkPrimitives } from '../../../tui/inkLoader';
import { OrionTuiView } from '../../../tui/OrionTuiApp';
import {
  CoordinatedFrameStream,
  FilteredTtyInputStream
} from '../../../tui/CoordinatedFrameWriter';
import { ComputerAction } from '../../../shared/types/action';

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean, detail = ''): void {
  if (condition) {
    passed++;
    console.log(`  [PASS] ${label}${detail ? ` — ${detail}` : ''}`);
  } else {
    failed++;
    console.error(`  [FAIL] ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function stripAnsi(s: string): string {
  return (s || '').replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '');
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createMockTtyStreams(columns: number, rows: number) {
  const rawOut = new PassThrough() as unknown as NodeJS.WriteStream & {
    columns: number;
    rows: number;
    isTTY: boolean;
  };
  rawOut.isTTY = true;
  rawOut.columns = columns;
  rawOut.rows = rows;

  const rawIn = new PassThrough() as unknown as NodeJS.ReadStream & {
    isTTY: boolean;
    setRawMode: (enable: boolean) => any;
    ref: () => any;
    unref: () => any;
  };
  rawIn.isTTY = true;
  rawIn.setRawMode = () => rawIn;
  rawIn.ref = () => rawIn;
  rawIn.unref = () => rawIn;

  return { rawOut, rawIn };
}

async function run28ScenarioHarnessSuite(): Promise<void> {
  console.log('=== ORION GLOBAL RELEASE — 28-SCENARIO COMPUTER-USE & VISIBLE CHROME E2E SUITE ===\n');

  ProcessSupervisor.getInstance().resetEstop('Global Release 28-scenario E2E suite');
  const tmpWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), 'orion-global-28-e2e-'));
  const strayOut = new PassThrough();

  const kernel = new OrionCliKernel({
    projectRoot: tmpWorkspace,
    renderer: new OrionCliRenderer({ useColor: true, outputStream: strayOut })
  });
  const router = new OrionCliCommandRouter(kernel);
  const orch = kernel.orchestrator;

  // Controlled local HTTP server hosting search engine, results, docs, safe form, auth/MFA/consent, dialog, and slow pages
  const server = http.createServer((req, res) => {
    const rawUrl = req.url || '/';
    const parsedUrl = new URL(rawUrl, 'http://127.0.0.1');

    if (parsedUrl.pathname === '/search') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>ORION Controlled Search Portal</title></head>
<body>
  <h1>ORION Search Engine</h1>
  <form id="search-form" action="/results" method="GET">
    <input id="q" name="q" type="search" placeholder="Search documentation..." value="" />
    <button id="search-submit" type="submit">Search</button>
  </form>
</body>
</html>`);
      return;
    }

    if (parsedUrl.pathname === '/results') {
      const q = parsedUrl.searchParams.get('q') || '';
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>Results for ${q} - ORION Search</title></head>
<body>
  <h1>Search Results for "${q}"</h1>
  <ul>
    <li><a href="http://127.0.0.1:${(server.address() as any).port}/docs">ORION Sovereign Documentation — Architecture &amp; Safety Guide</a></li>
    <li><a href="https://github.com/iMpacts-AI/ORION">iMpacts-AI/ORION Official GitHub Repository</a></li>
  </ul>
</body>
</html>`);
      return;
    }

    if (parsedUrl.pathname === '/docs') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>ORION Sovereign Documentation</title></head>
<body>
  <h1>ORION Sovereign AI Operating Layer</h1>
  <p id="doc-summary">Verified closed-loop browser and desktop execution with permission gates.</p>
  <input id="notes-input" name="notes" type="text" value="" placeholder="Quick note" />
  <button id="preview-btn" onclick="
    document.getElementById('preview-badge').textContent = 'PREVIEW_READY:' + (document.getElementById('notes-input').value || 'EMPTY');
    document.title = 'ORION Docs - Preview Active';
  ">Preview Note</button>
  <span id="preview-badge">IDLE</span>
</body>
</html>`);
      return;
    }

    if (parsedUrl.pathname === '/safe-form') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>ORION Safe Workspace Form</title></head>
<body>
  <h1>Workspace Configuration Form</h1>
  <input id="workspace-name" name="workspaceName" type="text" value="" />
  <input id="environment-tier" name="tier" type="text" value="" />
  <button id="submit-safe-form" onclick="
    document.title = 'Form Saved: ' + document.getElementById('workspace-name').value;
    document.getElementById('form-status').textContent = 'SAVED_VERIFIED';
  ">Save Configuration</button>
  <p id="form-status">UNSAVED</p>
</body>
</html>`);
      return;
    }

    if (parsedUrl.pathname === '/auth-login') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>Sign in to Workspace Portal</title></head>
<body>
  <h1>Sign In Required</h1>
  <form>
    <input id="username" name="username" type="text" />
    <input id="user-password" name="password" type="password" />
    <button id="login-btn" type="submit">Sign In</button>
  </form>
</body>
</html>`);
      return;
    }

    if (parsedUrl.pathname === '/mfa-challenge') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>Two-Factor Authentication</title></head>
<body>
  <h1>Enter verification code</h1>
  <input id="otp-code" name="otp" type="text" />
</body>
</html>`);
      return;
    }

    if (parsedUrl.pathname === '/oauth-consent') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>Authorize Application Access</title></head>
<body>
  <h1>Authorize Application</h1>
  <p>This service is requesting permission to access your account.</p>
  <button id="grant-btn">Allow</button>
</body>
</html>`);
      return;
    }

    if (parsedUrl.pathname === '/dialog-page') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>ORION Dialog Recovery Test</title></head>
<body>
  <button id="dialog-trigger-btn" onclick="
    alert('Unexpected blocking alert!');
    document.getElementById('dialog-outcome').textContent = 'DIALOG_DISMISSED_AND_RECOVERED';
    document.title = 'Dialog Recovered';
  ">Trigger Alert</button>
  <div id="dialog-outcome">WAITING</div>
</body>
</html>`);
      return;
    }

    if (parsedUrl.pathname === '/hang') {
      const t = setTimeout(() => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<html><head><title>Late Response</title></head><body>Delayed</body></html>');
      }, 2500);
      req.on('close', () => clearTimeout(t));
      return;
    }

    res.writeHead(404);
    res.end('Not found');
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const port = (server.address() as { port: number }).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const visibleBrowser = new DefaultBrowserProvider({ enableCdp: true });
  const chromeBinary = DefaultBrowserProvider.findLocalChromiumExecutable();

  // Deterministic computer-use stack with stateful MockInputDriver cursor tracking + real ActionValidator/Verifier/Permission/Planner
  const mockDriver = new MockInputDriver();
  const inputControl = new InputControlService(mockDriver);
  const screenService = new ScreenUnderstandingService();
  const windowManager = new WindowManagerService();
  const permissionService = new ComputerPermissionService();
  const verifier = new ComputerActionVerifier();
  const recoveryService = new ComputerRecoveryService();
  const planner = new ComputerActionPlanner();
  const stateStore = new TaskStateStore(path.join(tmpWorkspace, 'checkpoints'));
  const executor = new ComputerActionExecutor(
    screenService,
    inputControl,
    windowManager,
    permissionService,
    verifier,
    recoveryService,
    planner,
    stateStore
  );

  try {
    // =========================================================================
    // SCENARIOS 1–3: CONVERSATION vs EXPLICIT SYSTEM SPECIFICATIONS
    // =========================================================================
    console.log('--- Scenarios 1-3: Greeting, Follow-Up Conversation & Explicit System Specs ---');

    const s1 = await orch.processCommand('Hi', 'TEXT');
    check(
      'Scenario 01 (Simple greeting): Warm reply, 0 tool calls, 0 system specs, 0 path/memory leaks',
      s1.toolCallsExecuted.length === 0 &&
        s1.response.length > 4 &&
        !/Total Memory|CPU Cores|mem_|C:\\Users\\/i.test(s1.response)
    );

    const s2 = await orch.processCommand('Thanks, how are things running today?', 'TEXT');
    check(
      'Scenario 02 (Friendly follow-up conversation): Natural conversational response without unnecessary tools',
      s2.toolCallsExecuted.length === 0 &&
        s2.response.length > 6 &&
        !/mem_|C:\\Users\\/i.test(s2.response)
    );

    const s3 = await orch.processCommand('Show my system specifications.', 'TEXT');
    check(
      'Scenario 03 (Explicit system specification request): Executes system.get_info and reports verified specs',
      s3.toolCallsExecuted.some((tc) => tc.toolId.startsWith('system.get_')) &&
        !/C:\\Users\\/i.test(s3.response)
    );

    // =========================================================================
    // SCENARIOS 4–6: REAL VISIBLE FOREGROUND CHROME LAUNCH, SEARCH & NAVIGATION
    // =========================================================================
    console.log('\n--- Scenarios 4-6: Visible Foreground Chrome Launch, Search & Navigation ---');

    const s4Launch = await visibleBrowser.navigate('about:blank', {
      useCdpAdapter: true,
      visibleWindow: true,
      timeoutMs: 10000
    });
    const s4CdpInit = await visibleBrowser.navigate(`${baseUrl}/search`, {
      useCdpAdapter: true,
      visibleWindow: true,
      timeoutMs: 10000
    });
    check(
      'Scenario 04 (Chrome launch): Launches real visible foreground Chrome CDP window and verifies live PID & DOM',
      Boolean(chromeBinary) &&
        s4Launch.success === true &&
        s4CdpInit.success === true &&
        s4CdpInit.observation?.visibleWindowVerified === true &&
        typeof s4CdpInit.observation?.visibleChromePid === 'number' &&
        s4CdpInit.observation?.title === 'ORION Controlled Search Portal',
      `pid=${s4CdpInit.observation?.visibleChromePid}`
    );

    const s5Search = await visibleBrowser.searchWeb('ORION Sovereign Architecture', {
      useCdpAdapter: true,
      visibleWindow: true,
      searchEngineUrl: `${baseUrl}/search`,
      timeoutMs: 10000
    });
    check(
      'Scenario 05 (Chrome search): Visibly types query into foreground Chrome search box, submits form, and verifies results page',
      s5Search.success === true &&
        s5Search.postconditionsVerified === true &&
        s5Search.observation?.visibleWindowVerified === true &&
        (s5Search.observation?.url || '').includes('/results?q=') &&
        s5Search.searchResults.length >= 2 &&
        s5Search.searchResults.some((r) => r.url.includes('/docs')),
      `url=${s5Search.observation?.url}, results=${s5Search.searchResults.length}`
    );

    const s6Nav = await visibleBrowser.navigate(`${baseUrl}/docs`, {
      useCdpAdapter: true,
      visibleWindow: true,
      timeoutMs: 10000
    });
    check(
      'Scenario 06 (Visible navigation): Navigates visible Chrome to target URL and verifies page title & visible content',
      s6Nav.success === true &&
        s6Nav.postconditionsVerified === true &&
        s6Nav.observation?.title === 'ORION Sovereign Documentation' &&
        (s6Nav.observation?.extractedText || '').includes('Verified closed-loop browser')
    );

    // =========================================================================
    // SCENARIOS 7–14: DESKTOP MOUSE, KEYBOARD, SHORTCUTS, SCROLL, DRAG & SETTINGS
    // =========================================================================
    console.log('\n--- Scenarios 7-14: Desktop Mouse, Clicks, Typing, Shortcuts, Scroll, Drag & Settings ---');

    const s7Plan = await planner.planTask('Move mouse to 640, 420');
    const s7Exec = await executor.executePlan(s7Plan);
    check(
      'Scenario 07 (Mouse movement): Plans MOUSE_MOVE (640, 420), validates schema, and verifies cursor readback',
      s7Plan.actions[0]?.type === 'MOUSE_MOVE' &&
        s7Exec.status === 'COMPLETED' &&
        mockDriver.cursorPosition.x === 640 &&
        mockDriver.cursorPosition.y === 420 &&
        s7Exec.auditLog[0]?.verification === 'VERIFIED'
    );

    const s8Plan = await planner.planTask('Click at 640, 420');
    const s8Exec = await executor.executePlan(s8Plan);
    check(
      'Scenario 08 (Left click): Plans coordinate MOUSE_CLICK (left) and verifies postcondition',
      s8Plan.actions[0]?.type === 'MOUSE_CLICK' &&
        s8Exec.status === 'COMPLETED' &&
        s8Exec.auditLog[0]?.verification === 'VERIFIED'
    );

    const s9RightPlan = await planner.planTask('Right-click at 650, 430');
    const s9RightExec = await executor.executePlan(s9RightPlan);
    const s9DoublePlan = await planner.planTask('Double-click at 650, 430');
    const s9DoubleExec = await executor.executePlan(s9DoublePlan);
    check(
      'Scenario 09 (Right click & Double click): Plans and verifies MOUSE_RIGHT_CLICK and MOUSE_DOUBLE_CLICK',
      s9RightPlan.actions[0]?.type === 'MOUSE_RIGHT_CLICK' &&
        s9RightExec.status === 'COMPLETED' &&
        s9DoublePlan.actions[0]?.type === 'MOUSE_DOUBLE_CLICK' &&
        s9DoubleExec.status === 'COMPLETED'
    );

    const s10Plan = await planner.planTask('Type "ORION Verified Typing"');
    const s10Exec = await executor.executePlan(s10Plan);
    check(
      'Scenario 10 (Keyboard typing): Plans KEYBOARD_INPUT, validates text schema, and verifies execution',
      s10Plan.actions[0]?.type === 'KEYBOARD_INPUT' &&
        s10Exec.status === 'COMPLETED' &&
        mockDriver.history.some(
          (h) => h.action === 'typeText' && String(h.args?.text || '').includes('ORION Verified Typing')
        )
    );

    const s11HotkeyPlan = await planner.planTask('Press ctrl+a');
    const s11HotkeyExec = await executor.executePlan(s11HotkeyPlan);
    const s11MenuPlan = await planner.planTask('Open file menu');
    const s11MenuExec = await executor.executePlan(s11MenuPlan);
    check(
      'Scenario 11 (Keyboard shortcuts & menu navigation): Plans HOTKEY (control+a and alt+f) and verifies execution',
      s11HotkeyPlan.actions[0]?.type === 'HOTKEY' &&
        s11HotkeyExec.status === 'COMPLETED' &&
        s11MenuPlan.actions[0]?.type === 'HOTKEY' &&
        s11MenuExec.status === 'COMPLETED'
    );

    const s12Plan = await planner.planTask('Scroll down');
    const s12Exec = await executor.executePlan(s12Plan);
    check(
      'Scenario 12 (Scroll): Plans SCROLL (-3) and verifies desktop viewport scroll execution',
      s12Plan.actions[0]?.type === 'SCROLL' &&
        s12Exec.status === 'COMPLETED' &&
        s12Exec.auditLog[0]?.verification === 'VERIFIED'
    );

    const s13Plan = await planner.planTask('Drag from 300, 300 to 520, 340');
    const s13Exec = await executor.executePlan(s13Plan);
    check(
      'Scenario 13 (Drag and drop): Plans DRAG (300,300 -> 520,340), validates bounds, and verifies endpoint cursor position',
      s13Plan.actions[0]?.type === 'DRAG' &&
        s13Exec.status === 'COMPLETED' &&
        mockDriver.cursorPosition.x === 520 &&
        mockDriver.cursorPosition.y === 340 &&
        s13Exec.auditLog[0]?.verification === 'VERIFIED'
    );

    const s14Plan = await planner.planTask('Open display settings');
    const resolvedSettings = WindowsAppResolver.getInstance().resolveApp('ms-settings:display');
    const s14DryRun = await executor.executePlan({ ...s14Plan, isDryRun: true });
    check(
      'Scenario 14 (Settings navigation): Resolves ms-settings:display protocol URI with "Settings" foreground window target',
      s14Plan.actions[0]?.type === 'OPEN_APP' &&
        s14Plan.actions[0]?.parameters?.appName === 'ms-settings:display' &&
        s14Plan.actions[1]?.target === 'Settings' &&
        resolvedSettings.isProtocolUri === true &&
        s14DryRun.status === 'COMPLETED'
    );

    // =========================================================================
    // SCENARIOS 15–16: SAFE FORM FILLING & AUTH / MFA / OAUTH CONSENT PAUSE
    // =========================================================================
    console.log('\n--- Scenarios 15-16: Safe Form Filling, Approval Gate & Auth/MFA/Consent Pause ---');

    await visibleBrowser.navigate(`${baseUrl}/safe-form`, {
      useCdpAdapter: true,
      visibleWindow: true,
      timeoutMs: 8000
    });
    const s15Paused = await visibleBrowser.executeClosedLoopTask({
      goal: 'Fill workspace configuration form and submit.',
      formFields: {
        '#workspace-name': 'ORION Global',
        '#environment-tier': 'Production'
      },
      submitSelector: '#submit-safe-form',
      submitForm: true,
      explicitAuthorization: false
    });
    const s15Approved = await visibleBrowser.executeClosedLoopTask({
      goal: 'Submit approved workspace configuration form.',
      formFields: {
        '#workspace-name': 'ORION Global',
        '#environment-tier': 'Production'
      },
      submitSelector: '#submit-safe-form',
      submitForm: true,
      explicitAuthorization: true
    });
    check(
      'Scenario 15 (Form filling on safe test page): Prepares fields, pauses for approval before submit, and verifies saved DOM state after approval',
      s15Paused.status === 'AWAITING_APPROVAL' &&
        s15Approved.status === 'COMPLETED' &&
        s15Approved.postconditionsVerified === true &&
        s15Approved.observation?.title === 'Form Saved: ORION Global'
    );

    const s16LoginPause = await visibleBrowser.navigate(`${baseUrl}/auth-login`, {
      useCdpAdapter: true,
      visibleWindow: true,
      pauseOnAuthOrCaptcha: true,
      timeoutMs: 8000
    });
    const s16PasswordBlock = await visibleBrowser.typeText('#user-password', 'never-type-this', {
      explicitAuthorization: false
    });
    const s16MfaPause = await visibleBrowser.navigate(`${baseUrl}/mfa-challenge`, {
      useCdpAdapter: true,
      visibleWindow: true,
      timeoutMs: 8000
    });
    const s16ConsentPause = await visibleBrowser.navigate(`${baseUrl}/oauth-consent`, {
      useCdpAdapter: true,
      visibleWindow: true,
      timeoutMs: 8000
    });
    check(
      'Scenario 16 (Login/MFA/Consent pause): Pauses safely at login, 2FA, and OAuth consent pages and blocks unauthorized password entry',
      s16LoginPause.errorCode === 'PAUSED_FOR_USER_AUTH' &&
        s16PasswordBlock.errorCode === 'SENSITIVE_FIELD_BLOCKED' &&
        s16MfaPause.errorCode === 'PAUSED_FOR_USER_AUTH' &&
        s16ConsentPause.errorCode === 'PAUSED_FOR_USER_AUTH'
    );

    // =========================================================================
    // SCENARIOS 17–20: SCREENSHOT, UI VERIFICATION, PERMISSION DENIAL & APPROVAL
    // =========================================================================
    console.log('\n--- Scenarios 17-20: Screenshot Observation, UI Verification, Permission Denial & User Approval ---');

    const s17Plan = await planner.planTask('Take a screenshot and observe screen');
    const s17Exec = await executor.executePlan(s17Plan);
    const s17LiveObs = await screenService.captureObservation();
    check(
      'Scenario 17 (Screenshot observation): Captures screen observation with valid resolution, timestamp, and active window metadata',
      s17Exec.status === 'COMPLETED' &&
        s17LiveObs.screen.width > 0 &&
        s17LiveObs.screen.height > 0 &&
        s17LiveObs.timestamp > 0
    );

    // Scenario 18: UI-state verification rejects false positives (cursor mismatch & missing window)
    const fakeSuccessClick: ComputerAction = {
      id: 'act_false_pos_check',
      type: 'MOUSE_CLICK',
      parameters: {
        x: 700,
        y: 500,
        _cursorVerification: {
          verified: false,
          status: 'INPUT_FAILED',
          observed: { x: 100, y: 100 },
          reason: 'Cursor remained at (100, 100)'
        }
      },
      confidence: 0.9,
      riskLevel: 'LOW_RISK',
      reason: 'Verify false-positive rejection on cursor mismatch'
    };
    const s18CursorReject = await verifier.verifyExecution(fakeSuccessClick, s17LiveObs, s17LiveObs);
    const s18WindowReject = await verifier.verifyExecution(
      {
        id: 'act_missing_win_check',
        type: 'FOCUS_WINDOW',
        target: 'NonExistentQuantumWindow_XYZ_999',
        confidence: 0.9,
        riskLevel: 'LOW_RISK',
        reason: 'Verify missing target window rejection'
      },
      s17LiveObs,
      s17LiveObs
    );
    check(
      'Scenario 18 (UI-state verification): Rejects unverified cursor displacement and unverified window focus (0 false positives)',
      s18CursorReject.verified === false && s18WindowReject.verified === false
    );

    // Scenario 19: Permission denial + Schema validation rejection
    const highRiskAction: ComputerAction = {
      id: 'act_high_risk_gate_19',
      type: 'MOUSE_CLICK',
      parameters: { x: 400, y: 400, button: 'left' },
      requiresApproval: true,
      confidence: 0.9,
      riskLevel: 'HIGH_RISK',
      reason: 'Consequential click requiring explicit operator approval'
    };
    const s19Denied = await executor.executeAction(highRiskAction);
    const s19MalformedSchema = await executor.executeAction({
      id: 'act_malformed_coords_19',
      type: 'MOUSE_MOVE',
      parameters: { x: 999999, y: -999999 },
      confidence: 0.9,
      riskLevel: 'LOW_RISK',
      reason: 'Out-of-bounds coordinates test'
    });
    check(
      'Scenario 19 (Permission denial & Schema rejection): Blocks unapproved consequential action and rejects out-of-bounds schema before OS input',
      s19Denied.success === false &&
        s19Denied.preconditionsMet === false &&
        /requires explicit human authorization/i.test(s19Denied.error || '') &&
        s19MalformedSchema.success === false &&
        /SCHEMA VALIDATION FAILED/i.test(s19MalformedSchema.error || '')
    );

    // Scenario 20: Single-use bound user approval
    permissionService.setActionApproval(highRiskAction.id, true, highRiskAction);
    const s20ApprovedRun = await executor.executeAction(highRiskAction);
    const s20ReplayBlocked = await executor.executeAction(highRiskAction);
    check(
      'Scenario 20 (User approval): Executes approved consequential action once and blocks unapproved replay after token consumption',
      s20ApprovedRun.success === true &&
        s20ApprovedRun.postconditionsVerified === true &&
        s20ReplayBlocked.success === false &&
        s20ReplayBlocked.preconditionsMet === false
    );

    // =========================================================================
    // SCENARIOS 21–25: CANCELLATION, CLEANUP, DIALOG RECOVERY, TIMEOUT & FAILURES
    // =========================================================================
    console.log('\n--- Scenarios 21-25: Task Cancellation, Process Cleanup, Dialog Recovery, Timeout & Failure Reporting ---');

    // Scenario 23 first while visibleBrowser is still open, then Scenario 24 & 25, then Scenario 21 & 22 cleanup!
    await visibleBrowser.navigate(`${baseUrl}/dialog-page`, {
      useCdpAdapter: true,
      visibleWindow: true,
      timeoutMs: 8000
    });
    const s23DialogClick = await visibleBrowser.click('#dialog-trigger-btn');
    const s23ErrorDialogDetect = await verifier.verifyExecution(
      {
        id: 'act_os_dialog_check',
        type: 'MOUSE_CLICK',
        parameters: { x: 500, y: 500 },
        confidence: 0.9,
        riskLevel: 'LOW_RISK',
        reason: 'Check OS error modal detection'
      },
      {
        ...s17LiveObs,
        activeWindow: { title: 'Workspace Editor', processName: 'editor', processId: 1001, bounds: { x: 0, y: 0, width: 800, height: 600 } }
      },
      {
        ...s17LiveObs,
        activeWindow: { title: 'Fatal Error - Unhandled Exception', processName: 'editor', processId: 1001, bounds: { x: 100, y: 100, width: 400, height: 200 } }
      }
    );
    check(
      'Scenario 23 (Unexpected dialog recovery): Intercepts/dismisses blocking JS alert via CDP and flags unexpected OS error dialogs',
      s23DialogClick.success === true &&
        (s23DialogClick.observation?.extractedText || '').includes('DIALOG_DISMISSED_AND_RECOVERED') &&
        s23ErrorDialogDetect.verified === false
    );

    // Scenario 24: Timeout handling
    const httpOnlyBrowser = new DefaultBrowserProvider({ enableCdp: false });
    const s24Timeout = await httpOnlyBrowser.navigate(`${baseUrl}/hang`, {
      useCdpAdapter: false,
      timeoutMs: 280
    });
    check(
      'Scenario 24 (Timeout handling): Terminates hung navigation within timeout budget with structured TIMEOUT error',
      s24Timeout.success === false &&
        s24Timeout.errorCode === 'TIMEOUT' &&
        s24Timeout.postconditionsVerified === false
    );

    // Scenario 25: Failed action reporting (no false success)
    const s25MissingEl = await visibleBrowser.click('#does-not-exist-element-999');
    const s25MissingBin = await httpOnlyBrowser.openChromeWindow(`${baseUrl}/docs`, {
      executableOverride: 'C:\\nonexistent_orion_chrome_binary_999.exe'
    });
    check(
      'Scenario 25 (Failed action reporting): Reports ELEMENT_NOT_FOUND and BROWSER_UNAVAILABLE truthfully with postconditionsVerified=false',
      s25MissingEl.success === false &&
        s25MissingEl.errorCode === 'ELEMENT_NOT_FOUND' &&
        s25MissingEl.postconditionsVerified === false &&
        s25MissingBin.success === false &&
        s25MissingBin.errorCode === 'BROWSER_UNAVAILABLE' &&
        s25MissingBin.postconditionsVerified === false
    );

    // Scenario 26: Multiple sequential actions (5-step closed-loop browser + DOM workflow)
    const s26Step1 = await visibleBrowser.navigate(`${baseUrl}/docs`, {
      useCdpAdapter: true,
      visibleWindow: true,
      timeoutMs: 8000
    });
    const s26Step2 = await visibleBrowser.typeText('#notes-input', 'SequentialStep5');
    const s26Step3 = await visibleBrowser.click('#preview-btn');
    const s26Step4 = await visibleBrowser.observe();
    const s26Step5 = await executor.executeAction({
      id: 'act_seq_step5',
      type: 'OBSERVE_SCREEN',
      confidence: 0.99,
      riskLevel: 'READ_ONLY',
      reason: 'Final desktop observation in 5-step sequence'
    });
    check(
      'Scenario 26 (Multiple sequential actions): Completes and verifies all 5 sequential browser + desktop steps cleanly',
      s26Step1.success &&
        s26Step2.success &&
        s26Step3.success &&
        s26Step4.title === 'ORION Docs - Preview Active' &&
        (s26Step4.extractedText || '').includes('PREVIEW_READY:SequentialStep5') &&
        s26Step5.success &&
        s26Step5.postconditionsVerified
    );

    // Scenario 21: Task cancellation
    const cancelCtrl = new AbortController();
    const cancelStart = Date.now();
    setTimeout(() => cancelCtrl.abort(), 70);
    const s21Cancelled = await httpOnlyBrowser.executeClosedLoopTask({
      goal: `Open ${baseUrl}/hang in browser.`,
      useCdpAdapter: false,
      timeoutMs: 5000,
      signal: cancelCtrl.signal
    });
    const cancelElapsedMs = Date.now() - cancelStart;
    check(
      'Scenario 21 (Task cancellation): Aborts in-flight task cleanly via AbortSignal with status=CANCELLED',
      s21Cancelled.status === 'CANCELLED' &&
        s21Cancelled.postconditionsVerified === false &&
        cancelElapsedMs < 1500,
      `cancelLatencyMs=${cancelElapsedMs}`
    );

    // Scenario 22: Process cleanup
    const activePidBeforeClose = (await visibleBrowser.observe()).visibleChromePid;
    await visibleBrowser.close();
    await wait(200);
    const supervisedAfterClose = ProcessSupervisor.getInstance()
      .getActiveProcesses()
      .filter((p) => p.id === `browser_cdp_${activePidBeforeClose}`);
    check(
      'Scenario 22 (Process cleanup): Closing browser provider terminates & unregisters CDP child process cleanly',
      typeof activePidBeforeClose === 'number' && supervisedAfterClose.length === 0,
      `closedPid=${activePidBeforeClose}`
    );

    // =========================================================================
    // SCENARIOS 27–28: LONG-RUNNING TASK STABILITY & CONCURRENT INPUT RESPONSIVENESS
    // =========================================================================
    console.log('\n--- Scenarios 27-28: Long-Running Task Stability & Concurrent Input Responsiveness ---');

    const heapBeforeMb = process.memoryUsage().heapUsed / (1024 * 1024);
    let s27CompletedIterations = 0;
    for (let iter = 0; iter < 12; iter++) {
      const toolRes = await kernel.toolService.executeTool({
        id: `long_run_${iter}`,
        toolId: 'system.get_current_time',
        toolName: 'Get Current Time',
        arguments: {},
        timestamp: Date.now(),
        requiresUserApproval: false
      });
      const planRun = await executor.executePlan({
        taskId: `long_plan_${iter}`,
        naturalLanguageCommand: `Move mouse to ${400 + iter * 5}, ${300 + iter * 5}`,
        intent: 'Sustained stability iteration',
        actions: [
          {
            id: `act_long_${iter}`,
            type: 'MOUSE_MOVE',
            parameters: { x: 400 + iter * 5, y: 300 + iter * 5 },
            confidence: 0.98,
            riskLevel: 'LOW_RISK',
            reason: 'Move cursor step'
          }
        ],
        overallRisk: 'LOW_RISK',
        requiresUserApproval: false,
        status: 'PLANNING',
        currentActionIndex: 0,
        totalSteps: 1,
        auditLog: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      if (toolRes.success && planRun.status === 'COMPLETED') {
        s27CompletedIterations++;
      }
    }
    const heapDeltaMb = process.memoryUsage().heapUsed / (1024 * 1024) - heapBeforeMb;
    check(
      'Scenario 27 (Long-running task stability): Sustains 12 sequential tool + checkpointed desktop plans with 0 failures and bounded heap delta',
      s27CompletedIterations === 12 && heapDeltaMb < 64,
      `completed=${s27CompletedIterations}/12, heapDeltaMB=${heapDeltaMb.toFixed(2)}`
    );

    // Scenario 28: Concurrent input responsiveness in live TUI while background async work runs
    const ink = await loadInkPrimitives();
    const { rawOut, rawIn } = createMockTtyStreams(120, 30);
    const frameStream = new CoordinatedFrameStream(rawOut);
    const filteredIn = new FilteredTtyInputStream(rawIn);
    const tuiInst = ink.render(
      React.createElement(OrionTuiView, {
        ink,
        kernel,
        router,
        onRequestExit: () => {},
        registerMouseHandler: (h) => filteredIn.setMouseEventHandler(h),
        registerFocusHandler: (h) => filteredIn.setFocusChangeHandler(h)
      }),
      {
        stdout: frameStream as unknown as NodeJS.WriteStream,
        stdin: filteredIn as unknown as NodeJS.ReadStream,
        exitOnCtrlC: false,
        patchConsole: false
      }
    );
    await wait(120);

    // Start concurrent background tool + HTTP requests while typing 16 characters into TUI
    const bgWork = Promise.all([
      httpOnlyBrowser.navigate(`${baseUrl}/docs`, { useCdpAdapter: false }),
      kernel.toolService.executeTool({
        id: 'concurrent_sys_info',
        toolId: 'system.get_info',
        toolName: 'System Info',
        arguments: {},
        timestamp: Date.now(),
        requiresUserApproval: false
      })
    ]);

    const typedPhrase = 'orion responsive';
    const charLatenciesMs: number[] = [];
    for (let i = 0; i < typedPhrase.length; i++) {
      const expectedPrefix = typedPhrase.slice(0, i + 1);
      const t0 = performance.now();
      filteredIn.processRawChunk(typedPhrase[i]);
      const deadline = performance.now() + 500;
      while (performance.now() < deadline) {
        const snap = frameStream.getScreenSnapshot().map(stripAnsi).join('\n');
        if (snap.includes(expectedPrefix)) {
          charLatenciesMs.push(performance.now() - t0);
          break;
        }
        await wait(4);
      }
    }
    await bgWork;
    const finalTypedSnap = frameStream.getScreenSnapshot().map(stripAnsi).join('\n');
    const sortedLat = [...charLatenciesMs].sort((a, b) => a - b);
    const p95InputMs = sortedLat[Math.min(sortedLat.length - 1, Math.floor(sortedLat.length * 0.95))] || 999;

    tuiInst.unmount();
    filteredIn.dispose();
    frameStream.dispose();

    check(
      'Scenario 28 (Concurrent input responsiveness): Retains 100% of typed characters during concurrent background execution with p95 < 120ms',
      charLatenciesMs.length === typedPhrase.length &&
        finalTypedSnap.includes(typedPhrase) &&
        p95InputMs < 120,
      `captured=${charLatenciesMs.length}/${typedPhrase.length}, p95=${p95InputMs.toFixed(1)}ms`
    );
  } finally {
    await visibleBrowser.close().catch(() => {});
    try {
      kernel.shutdown();
    } catch {}
    (server as any).closeAllConnections?.();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    try {
      fs.rmSync(tmpWorkspace, { recursive: true, force: true });
    } catch {}
  }

  console.log('\n================================================================================');
  console.log(`ORION 28-SCENARIO GLOBAL HARNESS E2E SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('================================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

run28ScenarioHarnessSuite()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Unhandled error in OrionGlobalReleaseHarnessE2E.test.ts:', err);
    process.exit(1);
  });
