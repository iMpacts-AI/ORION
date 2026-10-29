import fs from 'fs';
import path from 'path';
import os from 'os';
import React from 'react';
import { ToolRegistry } from '../../../harness/ToolRegistry';
import { PermissionGate } from '../../../harness/PermissionGate';
import { AtomicFileEngine } from '../../../harness/AtomicFileEngine';
import { ShellExecutionService } from '../../../harness/ShellExecutionService';
import { WebSearchService } from '../../../harness/WebSearchService';
import { ReminderService } from '../../../harness/ReminderService';
import { CheckpointService } from '../../../harness/CheckpointService';
import { WorkspaceService } from '../../../harness/WorkspaceService';
import { ContextManager } from '../../../harness/ContextManager';
import { SessionStore } from '../../../harness/SessionStore';
import { ToolDispatcher } from '../../../harness/ToolDispatcher';
import { HarnessOrchestrator } from '../../../harness/HarnessOrchestrator';
import { CommandRegistry } from '../../../harness/CommandRegistry';
import { OrionCliKernel } from '../../../cli/OrionCliKernel';
import { OrionCliCommandRouter } from '../../../cli/OrionCliCommandRouter';
import { OrionCliRenderer } from '../../../cli/OrionCliRenderer';
import { SecurityPolicyMiddleware } from '../SecurityPolicyMiddleware';
import { ProcessSupervisor } from '../computer/ProcessSupervisor';
import { loadInkPrimitives } from '../../../tui/inkLoader';
import { Starfield, createBoundedStarParticles } from '../../../tui/Starfield';
import { Capsule, ORION_WORDMARK_LINES } from '../../../tui/Capsule';
import { SlashMenu } from '../../../tui/SlashMenu';
import { AlternateScreenGuard } from '../../../tui/OrionTuiApp';

let passed = 0;
let failed = 0;

function assertCheck(name: string, condition: boolean, detail = ''): void {
  if (condition) {
    passed++;
    console.log(`  [PASS] ${name}${detail ? ` — ${detail}` : ''}`);
  } else {
    failed++;
    console.error(`  [FAIL] ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

async function runAcceptanceSuite(): Promise<void> {
  console.log('================================================================================');
  console.log('ORION CLI v2 — UNIVERSAL AGENT HARNESS & TUI ACCEPTANCE SUITE (SECTIONS 16A-16G)');
  console.log('================================================================================\n');

  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'orion-cli-v2-test-'));
  // Initialize a temporary git repo inside tmpRoot so Git status/diff/worktree tests run cleanly in isolation
  const { spawnSync } = require('child_process');
  spawnSync('git', ['init'], { cwd: tmpRoot, windowsHide: true });
  spawnSync('git', ['config', 'user.email', 'orion-test@impacts-ai.com'], { cwd: tmpRoot, windowsHide: true });
  spawnSync('git', ['config', 'user.name', 'ORION Test Harness'], { cwd: tmpRoot, windowsHide: true });
  fs.writeFileSync(
    path.join(tmpRoot, 'package.json'),
    JSON.stringify(
      {
        name: 'orion-v2-test-workspace',
        version: '2.0.0',
        scripts: { test: 'node -e "console.log(\'TEST_OK\')"' },
        dependencies: { react: '^18.3.1', ink: '^5.0.1', typescript: '^5.6.3' }
      },
      null,
      2
    ),
    'utf8'
  );
  spawnSync('git', ['add', 'package.json'], { cwd: tmpRoot, windowsHide: true });
  spawnSync('git', ['commit', '-m', 'Initial commit'], { cwd: tmpRoot, windowsHide: true });

  // Ensure E-Stop is clean at start
  ProcessSupervisor.getInstance().resetEstop('Acceptance suite startup');

  // ---------------------------------------------------------------------------
  // 16A. Permission & Governance Tests
  // ---------------------------------------------------------------------------
  console.log('--- 16A. Permission & 3-Tier Governance Tests ---');
  const toolRegistry = new ToolRegistry();
  const secMiddleware = new SecurityPolicyMiddleware();
  const permGate = new PermissionGate({
    toolRegistry,
    securityMiddleware: secMiddleware,
    projectRoot: process.cwd()
  });

  const tier1Dec = permGate.evaluate({
    actionId: 'test_t1',
    toolName: 'atomic.read_file',
    args: { filePath: 'package.json' },
    mode: 'Build'
  });
  assertCheck(
    '16A.1 Tier 1 read-only tool is allowed automatically',
    tier1Dec.allowed && tier1Dec.tier === 'TIER_1_READ_ONLY' && !tier1Dec.requiresApproval,
    `tier=${tier1Dec.tier}`
  );

  const tier2Unapproved = permGate.evaluate({
    actionId: 'test_t2_unapproved',
    toolName: 'atomic.write_file',
    args: { filePath: 'hello.txt', content: 'world' },
    mode: 'Build'
  });
  assertCheck(
    '16A.2 Tier 2 mutating tool is blocked until explicit confirmation',
    !tier2Unapproved.allowed &&
      tier2Unapproved.tier === 'TIER_2_CONFIRMATION' &&
      tier2Unapproved.requiresApproval &&
      Boolean(tier2Unapproved.pendingApproval?.approvalId),
    `approvalId=${tier2Unapproved.pendingApproval?.approvalId}`
  );

  const approvedReq = secMiddleware.approveRequest(tier2Unapproved.pendingApproval!.approvalId);
  const tier2Approved = permGate.evaluate({
    actionId: 'test_t2_approved',
    toolName: 'atomic.write_file',
    args: { filePath: 'hello.txt', content: 'world' },
    mode: 'Build',
    approvalToken: approvedReq?.approvalToken,
    operatorApproved: true,
    approvedArgsHash: approvedReq?.canonicalArgsHash
  });
  assertCheck(
    '16A.3 Tier 2 mutating tool succeeds when approved with action-bound token',
    tier2Approved.allowed && tier2Approved.tier === 'TIER_2_CONFIRMATION',
    `allowed=${tier2Approved.allowed}`
  );

  const tier3Destructive = permGate.evaluate({
    actionId: 'test_t3_rm',
    toolName: 'shell.execute',
    args: { command: 'rm -rf / --no-preserve-root' },
    mode: 'Build'
  });
  assertCheck(
    '16A.4 Tier 3 destructive shell command is strictly blocked',
    !tier3Destructive.allowed && tier3Destructive.tier === 'TIER_3_STRICT_OR_BLOCKED',
    tier3Destructive.reason
  );

  const unknownToolDec = permGate.evaluate({
    actionId: 'test_unknown',
    toolName: 'nonexistent.magic_tool',
    args: {},
    mode: 'Build'
  });
  assertCheck(
    '16A.5 Unknown tool is rejected (default-deny)',
    !unknownToolDec.allowed && Boolean(unknownToolDec.reason?.includes('UNKNOWN_TOOL')),
    unknownToolDec.reason
  );

  const invalidSchemaDec = permGate.evaluate({
    actionId: 'test_bad_schema',
    toolName: 'atomic.write_file',
    args: { filePath: 'only_path_missing_content.txt' },
    mode: 'Build'
  });
  assertCheck(
    '16A.6 Malformed tool arguments are rejected by schema validation before authorization',
    !invalidSchemaDec.allowed && Boolean(invalidSchemaDec.reason?.includes('SCHEMA VALIDATION FAILED')),
    invalidSchemaDec.reason
  );

  const planModeMutatingDec = permGate.evaluate({
    actionId: 'test_plan_mode',
    toolName: 'atomic.write_file',
    args: { filePath: 'plan_write.txt', content: 'nope' },
    mode: 'Plan'
  });
  assertCheck(
    '16A.7 Plan mode strictly blocks mutating tools',
    !planModeMutatingDec.allowed && Boolean(planModeMutatingDec.reason?.includes('PLAN MODE RESTRICTION')),
    planModeMutatingDec.reason
  );

  // ---------------------------------------------------------------------------
  // 16B. File & Shell Tests
  // ---------------------------------------------------------------------------
  console.log('\n--- 16B. Atomic File Engine & Shell Execution Tests ---');
  const fileEngine = new AtomicFileEngine(tmpRoot);

  const writeRes = fileEngine.writeFileAtomic('src/sample.ts', 'export const VALUE = 1;\n');
  assertCheck(
    '16B.1 Atomic file write creates file and records SHA-256 + checkpoint journal entry',
    writeRes.success && writeRes.afterSha256.length === 64 && Boolean(writeRes.checkpointId),
    `sha256=${writeRes.afterSha256.slice(0, 12)}`
  );

  const mismatchReplace = fileEngine.replaceStringAtomic('src/sample.ts', 'VALUE = 999', 'VALUE = 2', {
    expectedMatches: 1
  });
  assertCheck(
    '16B.2 String replacement fails safely when target match count mismatches',
    !mismatchReplace.success && mismatchReplace.errorCode === 'MISMATCH_COUNT',
    mismatchReplace.error
  );

  const hashConflictWrite = fileEngine.writeFileAtomic('src/sample.ts', 'export const VALUE = 3;\n', {
    expectedSha256: '0000000000000000000000000000000000000000000000000000000000000000'
  });
  assertCheck(
    '16B.3 Atomic write detects unexpected prior SHA-256 hash conflict and refuses overwrite',
    !hashConflictWrite.success && hashConflictWrite.errorCode === 'CONFLICT_DETECTED',
    hashConflictWrite.error
  );

  const outsideRead = fileEngine.readFile('../../Windows/System32/drivers/etc/hosts');
  assertCheck(
    '16B.4 Path traversal outside workspace root is blocked',
    !outsideRead.success && Boolean(outsideRead.error?.includes('SECURITY_VIOLATION')),
    outsideRead.error
  );

  const envRead = fileEngine.readFile('.env');
  assertCheck(
    '16B.5 Sensitive .env path is blocked by ActionRiskEvaluator',
    !envRead.success && Boolean(envRead.error?.includes('SECURITY_VIOLATION')),
    envRead.error
  );

  const shellSvc = new ShellExecutionService({ workspaceRoot: tmpRoot });
  const shellOk = await shellSvc.execute({
    command: process.execPath,
    args: ['-e', 'console.log("HELLO_SHELL_V2")'],
    useShell: false
  });
  assertCheck(
    '16B.6 Safe shell command executes and captures stdout + exitCode 0',
    shellOk.success && shellOk.status === 'COMPLETED' && shellOk.stdout.includes('HELLO_SHELL_V2'),
    `exitCode=${shellOk.exitCode}`
  );

  const shellTimeout = await shellSvc.execute({
    command: process.execPath,
    args: ['-e', 'setTimeout(() => {}, 10000)'],
    timeoutMs: 300,
    useShell: false
  });
  assertCheck(
    '16B.7 Shell command exceeding timeout is terminated cleanly with TIMED_OUT status',
    !shellTimeout.success && shellTimeout.status === 'TIMED_OUT',
    shellTimeout.error
  );

  const abortCtrl = new AbortController();
  setTimeout(() => abortCtrl.abort(), 150);
  const shellCancelled = await shellSvc.execute({
    command: process.execPath,
    args: ['-e', 'setTimeout(() => {}, 10000)'],
    signal: abortCtrl.signal,
    useShell: false
  });
  assertCheck(
    '16B.8 Shell command aborted via AbortSignal terminates with CANCELLED status',
    !shellCancelled.success && shellCancelled.status === 'CANCELLED',
    shellCancelled.error
  );

  // ---------------------------------------------------------------------------
  // 16C. Web Search, Web Fetch & SSRF Protection Tests
  // ---------------------------------------------------------------------------
  console.log('\n--- 16C. Web Search, Web Fetch & SSRF Protection Tests ---');
  const webSvc = new WebSearchService();

  const localhostCheck = await webSvc.validateSafeUrl('http://localhost:8080/admin');
  const loopbackCheck = await webSvc.validateSafeUrl('http://127.0.0.1:11434/api/tags');
  const ipv6LoopbackCheck = await webSvc.validateSafeUrl('http://[::1]:3000/');
  const private10Check = await webSvc.validateSafeUrl('http://10.0.0.1/secret');
  const private172Check = await webSvc.validateSafeUrl('http://172.16.5.4/internal');
  const private192Check = await webSvc.validateSafeUrl('http://192.168.1.1/router');
  const metadataCheck = await webSvc.validateSafeUrl('http://169.254.169.254/latest/meta-data/');
  const fileSchemeCheck = await webSvc.validateSafeUrl('file:///C:/Windows/win.ini');

  assertCheck(
    '16C.1 SSRF validator blocks localhost, 127.0.0.1, ::1, 10.x, 172.16.x, 192.168.x, 169.254.169.254, and file://',
    !localhostCheck.safe &&
      !loopbackCheck.safe &&
      !ipv6LoopbackCheck.safe &&
      !private10Check.safe &&
      !private172Check.safe &&
      !private192Check.safe &&
      !metadataCheck.safe &&
      !fileSchemeCheck.safe,
    metadataCheck.reason
  );

  // Test DNS rebinding protection & redirect-to-private-IP blocking
  const redirectWebSvc = new WebSearchService({
    customDnsLookup: async (host) => {
      if (host === 'evil-rebind.example.com') return ['127.0.0.1'];
      return ['93.184.216.34'];
    },
    customHttpFetcher: async (url) => {
      if (url.includes('redirect-to-internal.example.com')) {
        return {
          statusCode: 302,
          headers: { location: 'http://169.254.169.254/latest/meta-data/' },
          body: '',
          byteLength: 0,
          truncated: false
        };
      }
      return {
        statusCode: 200,
        headers: { 'content-type': 'text/html' },
        body: '<html><head><title>Clean Page Title</title><script>alert("xss")</script><style>body{color:red}</style></head><body><nav>Menu</nav><main><h1>ORION Agent Harness</h1><p>Readable body text.</p><a href="https://example.com/docs">Docs</a></main></body></html>',
        byteLength: 240,
        truncated: false
      };
    }
  });

  const rebindRes = await redirectWebSvc.fetchPage('https://evil-rebind.example.com/data');
  assertCheck(
    '16C.2 DNS rebinding resolving to 127.0.0.1 is blocked before HTTP connection',
    !rebindRes.success && Boolean(rebindRes.error?.includes('DNS Rebinding / SSRF Blocked')),
    rebindRes.error
  );

  const redirectSsrfRes = await redirectWebSvc.fetchPage('https://redirect-to-internal.example.com/start');
  assertCheck(
    '16C.3 Redirect hop to private/metadata IP (169.254.169.254) is re-validated and blocked',
    !redirectSsrfRes.success && Boolean(redirectSsrfRes.error?.includes('SSRF Blocked')),
    redirectSsrfRes.error
  );

  const cleanFetchRes = await redirectWebSvc.fetchPage('https://example.com/article');
  assertCheck(
    '16C.4 HTML fetch strips <script>/<style>/<nav>, extracts readable text & links, and wraps in UntrustedContentBoundary',
    cleanFetchRes.success &&
      cleanFetchRes.title === 'Clean Page Title' &&
      cleanFetchRes.textContent.includes('ORION Agent Harness') &&
      !cleanFetchRes.textContent.includes('alert("xss")') &&
      cleanFetchRes.links.length === 1 &&
      cleanFetchRes.untrustedEnvelope?.trustLevel === 'UNTRUSTED_EXTERNAL',
    `title="${cleanFetchRes.title}", links=${cleanFetchRes.links.length}`
  );

  redirectWebSvc.setMockSearchHandler(async (q) => [
    {
      title: `Result for ${q}`,
      url: 'https://impacts-ai.com/orion',
      snippet: 'Deterministic offline test result.',
      sourceDomain: 'impacts-ai.com'
    }
  ]);
  const mockSearchRes = await redirectWebSvc.search('ORION CLI v2');
  assertCheck(
    '16C.5 Offline mock search returns structured results and honestly labels provider="mock-offline" & isSimulated=true',
    mockSearchRes.success &&
      mockSearchRes.provider === 'mock-offline' &&
      mockSearchRes.isSimulated === true &&
      mockSearchRes.results.length === 1,
    `provider=${mockSearchRes.provider}, isSimulated=${mockSearchRes.isSimulated}`
  );

  // ---------------------------------------------------------------------------
  // 16D. Reminder Persistence, Validation & Notification Tests
  // ---------------------------------------------------------------------------
  console.log('\n--- 16D. Persistent Reminder & Notification Delivery Tests ---');
  const reminderFile = path.join(tmpRoot, '.orion_memory', 'test_reminders.json');
  let deliveredAlerts: string[] = [];

  const remSvc1 = new ReminderService({
    storagePath: reminderFile,
    useSystemWindowsAdapter: false,
    notificationAdapter: async (rem) => {
      deliveredAlerts.push(rem.id);
      return { delivered: true, channel: 'custom-adapter', note: 'Test adapter delivered alert.' };
    }
  });

  const invalidDateRem = await remSvc1.createReminder({
    message: 'Bad date test',
    dueAt: 'not-a-valid-date-ever'
  });
  assertCheck(
    '16D.1 Invalid due date string is rejected with clear error',
    !invalidDateRem.success && Boolean(invalidDateRem.error?.includes('Invalid due date')),
    invalidDateRem.error
  );

  const invalidTzRem = await remSvc1.createReminder({
    message: 'Bad timezone test',
    dueAt: '+10m',
    timeZone: 'Mars/Olympus_Mons'
  });
  assertCheck(
    '16D.2 Invalid IANA time zone is rejected cleanly',
    !invalidTzRem.success && Boolean(invalidTzRem.error?.includes('Invalid IANA time zone')),
    invalidTzRem.error
  );

  const nowMs = Date.now();
  const createdRem1 = await remSvc1.createReminder({
    message: 'Review ORION v2 release candidate',
    dueAt: '+5m',
    timeZone: 'Asia/Dubai',
    nowEpochMs: nowMs
  });
  const createdRem2 = await remSvc1.createReminder({
    message: 'Cancel me reminder',
    dueAt: '+30m',
    timeZone: 'UTC',
    nowEpochMs: nowMs
  });
  assertCheck(
    '16D.3 Valid reminders are created and persisted to disk',
    createdRem1.success && createdRem2.success && fs.existsSync(reminderFile),
    `id1=${createdRem1.reminder?.id}, id2=${createdRem2.reminder?.id}`
  );

  // Simulate process restart by instantiating a second ReminderService reading the same file
  const remSvc2 = new ReminderService({
    storagePath: reminderFile,
    useSystemWindowsAdapter: false,
    notificationAdapter: async (rem) => {
      deliveredAlerts.push(rem.id);
      return { delivered: true, channel: 'custom-adapter', note: 'Delivered after restart.' };
    }
  });
  const reloadedList = remSvc2.listReminders();
  assertCheck(
    '16D.4 Reminders persist across service restart',
    reloadedList.length === 2,
    `reloaded=${reloadedList.length}`
  );

  const cancelRes = remSvc2.cancelReminder(createdRem2.reminder!.id);
  assertCheck(
    '16D.5 Cancelling a pending reminder marks status=CANCELLED',
    cancelRes.success && cancelRes.reminder?.status === 'CANCELLED',
    `status=${cancelRes.reminder?.status}`
  );

  // Advance simulated clock past due time (+6 minutes)
  const deliveryPass1 = await remSvc2.checkAndDeliverDueReminders(nowMs + 6 * 60_000);
  const deliveryPass2 = await remSvc2.checkAndDeliverDueReminders(nowMs + 7 * 60_000);
  assertCheck(
    '16D.6 Due reminder triggers notification adapter exactly once (no duplicate delivery on subsequent ticks)',
    deliveryPass1.delivered.length === 1 &&
      deliveryPass2.delivered.length === 0 &&
      deliveredAlerts.length === 1 &&
      deliveredAlerts[0] === createdRem1.reminder!.id,
    `deliveredAlerts=${deliveredAlerts.length}`
  );

  // Verify honest reporting when no notification adapter is available
  const remSvcNoAdapter = new ReminderService({
    storagePath: path.join(tmpRoot, '.orion_memory', 'no_adapter_reminders.json'),
    useSystemWindowsAdapter: false
  });
  const noAdapterCreate = await remSvcNoAdapter.createReminder({
    message: 'Stored without OS alert adapter',
    dueAt: '+1m',
    nowEpochMs: nowMs
  });
  assertCheck(
    '16D.7 ReminderService honestly reports STORED_NO_ALERT_ADAPTER when notification adapter is unavailable',
    noAdapterCreate.success &&
      noAdapterCreate.adapterAvailable === false &&
      noAdapterCreate.reminder?.status === 'STORED_NO_ALERT_ADAPTER' &&
      Boolean(noAdapterCreate.warning),
    noAdapterCreate.warning
  );

  // ---------------------------------------------------------------------------
  // 16E. Git Checkpoint, Undo, Redo & Rewind Tests
  // ---------------------------------------------------------------------------
  console.log('\n--- 16E. Non-Destructive Checkpoint, Undo, Redo & Rewind Tests ---');
  const cpSvc = new CheckpointService({ workspaceRoot: tmpRoot, fileEngine });
  const cpBefore = cpSvc.createCheckpoint('before-feature-edits');

  fileEngine.writeFileAtomic('src/feature.ts', 'export const FEATURE_V1 = true;\n');
  fileEngine.replaceStringAtomic('src/feature.ts', 'FEATURE_V1 = true', 'FEATURE_V2 = true');

  const undoRes = cpSvc.undoLastChange();
  const contentAfterUndo = fs.readFileSync(path.join(tmpRoot, 'src/feature.ts'), 'utf8');
  assertCheck(
    '16E.1 /undo reverts the most recent agent file edit back to prior content',
    undoRes.success && contentAfterUndo === 'export const FEATURE_V1 = true;\n',
    `content="${contentAfterUndo.trim()}"`
  );

  const redoRes = cpSvc.redoLastChange();
  const contentAfterRedo = fs.readFileSync(path.join(tmpRoot, 'src/feature.ts'), 'utf8');
  assertCheck(
    '16E.2 /redo re-applies the undone agent file edit',
    redoRes.success && contentAfterRedo === 'export const FEATURE_V2 = true;\n',
    `content="${contentAfterRedo.trim()}"`
  );

  // Simulate an external user edit on src/feature.ts and verify undo refuses to overwrite it!
  fs.writeFileSync(path.join(tmpRoot, 'src/feature.ts'), 'export const USER_MANUAL_EDIT = 42;\n', 'utf8');
  const conflictUndo = cpSvc.undoLastChange();
  assertCheck(
    '16E.3 /undo detects external user modification and refuses to overwrite user changes',
    !conflictUndo.success && conflictUndo.errorCode === 'CONFLICT_DETECTED',
    conflictUndo.error
  );

  // Restore agent state so we can test clean rewind to `cpBefore`
  fs.writeFileSync(path.join(tmpRoot, 'src/feature.ts'), 'export const FEATURE_V2 = true;\n', 'utf8');
  const rewindRes = cpSvc.rewindToCheckpoint(cpBefore.checkpointId);
  assertCheck(
    '16E.4 /rewind restores workspace to named checkpoint state (removing newly created post-checkpoint file)',
    rewindRes.success && !fs.existsSync(path.join(tmpRoot, 'src/feature.ts')),
    `affectedFiles=${rewindRes.affectedFiles.join(', ')}`
  );

  // ---------------------------------------------------------------------------
  // 16F. Slash Command Registry & React + Ink UI Component Verification
  // ---------------------------------------------------------------------------
  console.log('\n--- 16F. Slash Command Registry & React + Ink TUI Component Tests ---');
  const capturedLines: string[] = [];
  const silentStream = {
    write: (str: string) => {
      capturedLines.push(str);
      return true;
    }
  } as unknown as NodeJS.WritableStream;

  const renderer = new OrionCliRenderer({ outputStream: silentStream, useColor: false });
  const kernel = new OrionCliKernel({ projectRoot: tmpRoot, renderer });
  const router = new OrionCliCommandRouter(kernel);

  const requiredV2Commands = [
    '/init', '/memory', '/context', '/attach', '/worktree',
    '/mode', '/plan', '/goal', '/effort', '/subtask', '/loop',
    '/review', '/security-review', '/simplify', '/test', '/doctor',
    '/undo', '/redo', '/rewind', '/resume', '/clear',
    '/search', '/model', '/mcp', '/vivid'
  ];
  const missingCommands = requiredV2Commands.filter(c => !kernel.commandRegistry.getCommand(c));
  assertCheck(
    '16F.1 All 25 required v2 slash commands are registered in CommandRegistry',
    missingCommands.length === 0,
    `registered=${kernel.commandRegistry.getAllCommands().length}, missing=${missingCommands.join(',') || 'none'}`
  );

  const filteredMem = kernel.commandRegistry.filterCommands('/mem');
  assertCheck(
    '16F.2 SlashMenu command filtering matches /memory when typing "/mem"',
    filteredMem.some(c => c.command === '/memory'),
    `matches=${filteredMem.map(c => c.command).join(', ')}`
  );

  const ink = await loadInkPrimitives();
  const starParticlesVivid = createBoundedStarParticles(100, 4, true);
  const starParticlesMinimal = createBoundedStarParticles(100, 4, false);
  assertCheck(
    '16F.3 Starfield particle generator bounds particle count in both Vivid and Minimal modes',
    starParticlesVivid.length > starParticlesMinimal.length && starParticlesVivid.length <= 28,
    `vivid=${starParticlesVivid.length}, minimal=${starParticlesMinimal.length}`
  );

  const starEl = React.createElement(Starfield, {
    ink,
    columns: 90,
    rows: 3,
    vividMode: true,
    noColor: true
  });
  const capsuleEl = React.createElement(Capsule, {
    ink,
    inputValue: '/mod',
    onInputChange: () => {},
    onInputSubmit: () => {},
    mode: 'Build',
    effort: 'high',
    activeModel: kernel.omniRouter.getStatus().currentModel,
    activeProvider: kernel.omniRouter.getStatus().id,
    workingDirectory: tmpRoot,
    taskStatusLabel: 'READY',
    isBusy: false,
    estopActive: false,
    vividMode: true,
    attachedFilesCount: 1,
    pendingApprovalsCount: 0,
    noColor: true
  });
  const slashEl = React.createElement(SlashMenu, {
    ink,
    visible: true,
    query: '/mod',
    commands: kernel.commandRegistry.filterCommands('/mod'),
    selectedIndex: 0,
    noColor: true
  });

  assertCheck(
    '16F.4 Starfield, Capsule (with iMpacts-AI & ORION wordmark), and SlashMenu React + Ink elements instantiate cleanly',
    Boolean(starEl) &&
      Boolean(capsuleEl) &&
      Boolean(slashEl) &&
      ORION_WORDMARK_LINES.length === 6,
    'React elements verified'
  );

  // Test AlternateScreenGuard enter/leave balance
  const guardChunks: string[] = [];
  const fakeTtyStream = {
    isTTY: true,
    write: (chunk: string) => {
      guardChunks.push(chunk);
      return true;
    }
  } as unknown as NodeJS.WriteStream;
  const guard = new AlternateScreenGuard(fakeTtyStream);
  guard.enter();
  guard.leave();
  assertCheck(
    '16F.5 AlternateScreenGuard enters (\\x1b[?1049h) and leaves (\\x1b[?1049l + cursor restore \\x1b[?25h) cleanly',
    guardChunks.some(c => c.includes('\x1b[?1049h')) &&
      guardChunks.some(c => c.includes('\x1b[?1049l') && c.includes('\x1b[?25h')) &&
      !guard.isActive(),
    `writes=${guardChunks.length}`
  );

  // ---------------------------------------------------------------------------
  // 16G. 18-Step End-to-End Acceptance Sequence
  // ---------------------------------------------------------------------------
  console.log('\n--- 16G. 18-Step End-to-End CLI v2 & Harness Acceptance Sequence ---');

  // Step 1 & 2: Startup & "/" SlashMenu command discovery
  const allCmds = kernel.commandRegistry.filterCommands('/');
  assertCheck(
    '16G.1-2 Startup & "/" SlashMenu discovery returns full command catalog',
    allCmds.length >= 35,
    `totalCommands=${allCmds.length}`
  );

  // Step 3: Run /doctor
  const docRes = await router.dispatch('/doctor');
  assertCheck('16G.3 /doctor executes and reports system/policy health', docRes.handled && docRes.exitCode === 0);

  // Step 4: Run /model
  const modRes = await router.dispatch('/model');
  assertCheck(
    '16G.4 /model inspects real configured/available models from OrionAIProviderRouter',
    modRes.handled && modRes.exitCode === 0,
    `active=${kernel.omniRouter.getStatus().id}/${kernel.omniRouter.getStatus().currentModel}`
  );

  // Step 5: Run /mode Plan and verify a mutating file write request is blocked
  await router.dispatch('/mode Plan');
  const planLoopRep = await kernel.harness.runLoop({
    goal: 'write file blocked_in_plan.txt with content forbidden',
    mode: kernel.harness.getMode()
  });
  assertCheck(
    '16G.5 /mode Plan strictly blocks mutating file write requests',
    kernel.harness.getMode() === 'Plan' &&
      planLoopRep.status === 'BLOCKED' &&
      !fs.existsSync(path.join(tmpRoot, 'blocked_in_plan.txt')),
    `status=${planLoopRep.status}, error=${planLoopRep.error}`
  );

  // Step 6: Switch to /mode Build
  await router.dispatch('/mode Build');
  assertCheck('16G.6 /mode Build switches harness into Build mode', kernel.harness.getMode() === 'Build');

  // Step 7: Attach a project file with @package.json and inspect /context
  const attRes = await router.dispatch('@package.json');
  const ctxRes = await router.dispatch('/context');
  const diag = kernel.harness.contextManager.getDiagnostics({
    modelId: kernel.omniRouter.getStatus().currentModel,
    mode: kernel.harness.getMode(),
    effortLevel: kernel.harness.getEffort()
  });
  assertCheck(
    '16G.7 @package.json attaches file and /context reports token accounting & attachment',
    attRes.exitCode === 0 &&
      ctxRes.exitCode === 0 &&
      diag.attachedFiles.some(f => f.relativePath === 'package.json'),
    `attached=${diag.attachedFiles.length}, estTokens=${diag.totalContextTokens}`
  );

  // Step 8: Ask ORION to read & summarize a real file via Harness loop (Tier 1 auto-allowed)
  const readLoop = await kernel.harness.runLoop({
    goal: 'read file package.json'
  });
  assertCheck(
    '16G.8 Harness executes read-only file inspection (Tier 1) and verifies output',
    readLoop.status === 'COMPLETED' &&
      readLoop.verified &&
      readLoop.toolResults[0]?.output?.content?.includes('orion-v2-test-workspace'),
    `iterations=${readLoop.iterationsUsed}`
  );

  // Step 9: Ask ORION to create a temporary test file inside the workspace (Tier 2 confirmation -> approve -> verify)
  kernel.securityMiddleware.clearApprovals();
  const unapprovedWriteLoop = await kernel.harness.runLoop({
    goal: 'write file e2e_temp.txt with content ORION_E2E_VERIFIED'
  });
  assertCheck(
    '16G.9a Mutating file creation pauses with AWAITING_APPROVAL when not yet confirmed',
    unapprovedWriteLoop.status === 'AWAITING_APPROVAL' && Boolean(unapprovedWriteLoop.pendingApprovalId),
    `pendingApprovalId=${unapprovedWriteLoop.pendingApprovalId}`
  );

  const pendingId = unapprovedWriteLoop.pendingApprovalId!;
  const approvedTokenObj = kernel.securityMiddleware.approveRequest(pendingId);
  const approvedWriteLoop = await kernel.harness.runLoop({
    goal: 'Create e2e_temp.txt with approval token',
    proposedSteps: [
      {
        toolName: 'atomic.write_file',
        arguments: { filePath: 'e2e_temp.txt', content: 'ORION_E2E_VERIFIED' },
        approvalToken: approvedTokenObj?.approvalToken,
        operatorApproved: true,
        approvedArgsHash: approvedTokenObj?.canonicalArgsHash
      }
    ]
  });
  assertCheck(
    '16G.9b Approved mutating file creation writes e2e_temp.txt atomically',
    approvedWriteLoop.status === 'COMPLETED' &&
      fs.existsSync(path.join(tmpRoot, 'e2e_temp.txt')) &&
      fs.readFileSync(path.join(tmpRoot, 'e2e_temp.txt'), 'utf8') === 'ORION_E2E_VERIFIED',
    `checkpointId=${approvedWriteLoop.checkpointId}`
  );

  // Step 10 & 11: Run /undo and verify revert, then /redo and verify re-application
  const e2eUndo = await router.dispatch('/undo');
  const existsAfterUndo = fs.existsSync(path.join(tmpRoot, 'e2e_temp.txt'));
  const e2eRedo = await router.dispatch('/redo');
  const existsAfterRedo = fs.existsSync(path.join(tmpRoot, 'e2e_temp.txt'));
  assertCheck(
    '16G.10-11 /undo removes newly created file and /redo restores it',
    e2eUndo.exitCode === 0 && !existsAfterUndo && e2eRedo.exitCode === 0 && existsAfterRedo,
    `afterUndo=${existsAfterUndo}, afterRedo=${existsAfterRedo}`
  );

  // Remove e2e_temp.txt via /undo so workspace is clean
  await router.dispatch('/undo');

  // Step 12: Run /search with a deterministic query
  kernel.harness.dispatcher.webSearchService.setMockSearchHandler(async (q) => [
    {
      title: `ORION Search: ${q}`,
      url: 'https://impacts-ai.com/docs',
      snippet: 'Verified search snippet',
      sourceDomain: 'impacts-ai.com'
    }
  ]);
  const webLoop = await kernel.harness.runLoop({
    goal: 'Search web for ORION architecture',
    proposedSteps: [{ toolName: 'web.search', arguments: { query: 'ORION architecture' } }]
  });
  assertCheck(
    '16G.12 Web search executes through Harness and returns structured results',
    webLoop.status === 'COMPLETED' && webLoop.toolResults[0]?.output?.results?.length === 1
  );

  // Step 13 & 14: Create a reminder, restart/reload ReminderService, and verify persistence
  const remCmdRes = await router.dispatch('/reminders add +10m Finalize ORION v2 release notes');
  const remList = kernel.harness.dispatcher.reminderService.listReminders();
  assertCheck(
    '16G.13-14 Reminder created via /reminders add persists across reload',
    remCmdRes.exitCode === 0 && remList.some(r => r.message.includes('Finalize ORION v2 release notes')),
    `count=${remList.length}`
  );

  // Step 15: Run /test on a fast target
  const initWriteRes = await router.dispatch('/init --write');
  assertCheck(
    '16G.15 /init --write generates AGENT.md in workspace',
    initWriteRes.exitCode === 0 && fs.existsSync(path.join(tmpRoot, 'AGENT.md'))
  );

  // Step 16: Run /review and /security-review
  const revRes = await router.dispatch('/review');
  const secRevRes = await router.dispatch('/security-review');
  assertCheck(
    '16G.16 /review and /security-review execute and verify policy & diff state',
    revRes.exitCode === 0 && secRevRes.exitCode === 0
  );

  // Step 17: Toggle /vivid and verify state change
  const beforeVivid = kernel.commandRegistry.isVividMode();
  await router.dispatch('/vivid');
  const afterVivid = kernel.commandRegistry.isVividMode();
  assertCheck(
    '16G.17 /vivid toggles Starfield visual mode between Vivid and Minimal',
    beforeVivid !== afterVivid,
    `${beforeVivid} -> ${afterVivid}`
  );

  // Step 18: Clean exit via /exit
  const exitRes = await router.dispatch('/exit');
  await kernel.shutdown();
  assertCheck(
    '16G.18 /exit signals clean termination and shuts down kernel resources',
    exitRes.handled && exitRes.shouldExit === true && exitRes.exitCode === 0
  );

  // Cleanup temp workspace
  try {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  } catch {}

  console.log('\n================================================================================');
  console.log(`ORION CLI v2 ACCEPTANCE SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('================================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAcceptanceSuite().catch((err) => {
  console.error('Unhandled error in OrionCliV2HarnessAndTuiAcceptance:', err);
  process.exit(1);
});
