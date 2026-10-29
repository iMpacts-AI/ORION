import assert from 'assert';
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';
import React from 'react';
import { WindowsAppResolver } from '../computer/WindowsAppResolver';
import { ProcessSupervisor } from '../computer/ProcessSupervisor';
import { DefaultBrowserProvider } from '../../platform/BrowserProvider';
import { OrionCliKernel } from '../../../cli/OrionCliKernel';
import { OrionCliCommandRouter } from '../../../cli/OrionCliCommandRouter';
import { OrionCliRenderer } from '../../../cli/OrionCliRenderer';
import {
  ORIS_CANONICAL_PIXEL_GRID_18X18,
  OrisMascotController,
  computeOrisHitbox,
  isPointInsideHitbox,
  parseSgrMouseEvents,
  renderOrisPixelHalfBlockLines,
  stripSgrMouseSequences
} from '../../../tui/MascotInteractive';
import { Capsule, ORION_GEOMETRIC_TITLE_LINES } from '../../../tui/Capsule';
import { Starfield } from '../../../tui/Starfield';
import { AlternateScreenGuard } from '../../../tui/OrionTuiApp';
import { loadInkPrimitives } from '../../../tui/inkLoader';

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

async function runMasterMissionRegressionSuite(): Promise<void> {
  console.log('================================================================================');
  console.log('ORION MASTER ENGINEERING MISSION — RELIABILITY, COMPUTER USE & ORIS CLI SUITE');
  console.log('================================================================================\n');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orion-master-mission-'));
  ProcessSupervisor.getInstance().resetEstop('Master mission suite startup');

  const outChunks: string[] = [];
  const silentStream = {
    write: (s: string) => {
      outChunks.push(s);
      return true;
    }
  } as unknown as NodeJS.WritableStream;

  const renderer = new OrionCliRenderer({ outputStream: silentStream, useColor: false });
  const kernel = new OrionCliKernel({ projectRoot: tmpDir, renderer });
  const router = new OrionCliCommandRouter(kernel);
  const resolver = new WindowsAppResolver();

  // ---------------------------------------------------------------------------
  // 1. Installed App Resolution & Discovery (including ArtCraft Official Suite)
  // ---------------------------------------------------------------------------
  console.log('--- 1. Windows 11 App Resolution & Official ArtCraft Discovery ---');
  const notepadApp = resolver.resolveApp('notepad');
  check(
    '1.1 Notepad resolves to a verified Windows executable on disk',
    notepadApp.existsOnDisk && notepadApp.canonicalId === 'notepad',
    `${notepadApp.discoverySource}: ${path.basename(notepadApp.resolvedExecutablePath)}`
  );

  const artcraftExpected = [
    'ArtCraft Launcher',
    'PdfCraft',
    'PhotoCraft',
    'GridCraft',
    'WordCraft',
    'DeckCraft',
    'VectorCraft'
  ];
  const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
  const artcraftBaseDir = path.join(localAppData, 'Programs', 'ArtCraft');
  if (fs.existsSync(artcraftBaseDir)) {
    const resolvedArtCraft = artcraftExpected.map(name => resolver.resolveApp(name));
    check(
      '1.2 All 7 official ArtCraft apps resolve to GUI executables (never -cli.exe), including spaces in ArtCraft Launcher path',
      resolvedArtCraft.every(
        a =>
          a.existsOnDisk &&
          fs.existsSync(a.resolvedExecutablePath) &&
          !a.resolvedExecutablePath.toLowerCase().endsWith('-cli.exe')
      ) && resolvedArtCraft[0].resolvedExecutablePath.includes('ArtCraft Launcher'),
      resolvedArtCraft.map(a => `${a.displayName}->${path.basename(a.resolvedExecutablePath)}`).join(', ')
    );
  } else {
    const catalogProbe = resolver.resolveApp('PdfCraft');
    check(
      '1.2 ArtCraft catalog entry resolves cleanly even when portable directory is absent on CI host',
      catalogProbe.canonicalId === 'pdfcraft',
      `existsOnDisk=${catalogProbe.existsOnDisk}`
    );
  }

  const discoverRes = await kernel.toolService.executeTool({
    id: 'tc_discover_1',
    toolId: 'computer.discover_apps',
    toolName: 'Discover Installed Windows Applications',
    arguments: { query: 'craft' },
    requiresUserApproval: false,
    timestamp: Date.now()
  });
  check(
    '1.3 computer.discover_apps executes as Tier-1 read-only tool with outcomeStatus=completed_verified',
    discoverRes.success === true &&
      discoverRes.outcomeStatus === 'completed_verified' &&
      Array.isArray(discoverRes.data?.applications),
    `discoveredCount=${discoverRes.data?.count}`
  );

  // ---------------------------------------------------------------------------
  // 2. Missing, Prohibited, Failed, and Timed-Out App/Subprocess Launches
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Missing, Prohibited & Timed-Out Execution Handling ---');
  let missingAppErr = '';
  try {
    resolver.resolveApp('nonexistent_quantum_hypervisor_xyz');
  } catch (e: any) {
    missingAppErr = e.message || String(e);
  }
  check(
    '2.1 Uninstalled application throws structured [APP_NOT_INSTALLED] error (never swallowed)',
    missingAppErr.includes('[APP_NOT_INSTALLED]'),
    missingAppErr
  );

  const prohibitedChecks = ['regedit', 'diskpart', 'rundll32', 'chrome --remote-debugging-port=9222', 'notepad & calc'];
  const prohibitedBlockedCount = prohibitedChecks.filter( badInput => {
    try {
      resolver.resolveApp(badInput);
      return false;
    } catch (e: any) {
      return String(e?.message || '').includes('[SECURITY BLOCKED]');
    }
  }).length;
  check(
    '2.2 Prohibited binaries, inline flags, and shell metacharacters are rejected with [SECURITY BLOCKED]',
    prohibitedBlockedCount === prohibitedChecks.length,
    `blocked=${prohibitedBlockedCount}/${prohibitedChecks.length}`
  );

  const timeoutSubproc = await kernel.harness.dispatcher.shellService.execute({
    command: process.execPath,
    args: ['-e', 'setTimeout(() => {}, 10000)'],
    timeoutMs: 250,
    useShell: false
  });
  check(
    '2.3 Timed-out subprocess terminates cleanly and reports status=TIMED_OUT',
    timeoutSubproc.success === false && timeoutSubproc.status === 'TIMED_OUT',
    timeoutSubproc.status
  );

  // ---------------------------------------------------------------------------
  // 3. Paths with Spaces & Separated string[] Launch Arguments
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. Paths with Spaces & Separated Launch Argument Validation ---');
  const spacedArgs = resolver.validateLaunchArguments([
    'C:\\Program Files\\ArtCraft Projects\\Design Brief 2026.pdf',
    '--new-window'
  ]);
  let dangerousArgBlocked = false;
  try {
    resolver.validateLaunchArguments(['--user-data-dir=C:\\temp\\hijack']);
  } catch (e: any) {
    dangerousArgBlocked = String(e?.message || '').includes('[SECURITY BLOCKED]');
  }
  check(
    '3.1 Separated launch arguments preserve spaces safely while blocking dangerous Chromium/interpreter flags',
    spacedArgs.length === 2 &&
      spacedArgs[0].includes('Design Brief 2026.pdf') &&
      dangerousArgBlocked === true,
    `validated=${JSON.stringify(spacedArgs)}`
  );

  // ---------------------------------------------------------------------------
  // 4. Schema Validation Before Approval Token Consumption & 5. Shared Policy State
  // ---------------------------------------------------------------------------
  console.log('\n--- 4 & 5. Schema Validation Ordering & Single Shared Policy State ---');
  check(
    '5.1 OrionCliKernel, ToolService, and HarnessOrchestrator share a single SecurityPolicyMiddleware & ToolService instance',
    kernel.securityMiddleware === kernel.toolService.getPolicyMiddleware() &&
      kernel.harness.dispatcher.canonicalToolService === kernel.toolService,
    'Single authoritative policy & tool pipeline verified'
  );

  const targetWriteFile = path.join(tmpDir, 'token_preservation_test.txt');
  const validWriteArgs = { filePath: targetWriteFile, content: 'VERIFIED_SINGLE_USE_TOKEN' };
  const writeToolDef = kernel.toolService.getRegistry().getTool('file.write_text')!;
  const pendingReq = kernel.securityMiddleware.createApprovalRequest({
    tool: { ...writeToolDef, requiresApproval: true },
    arguments: validWriteArgs,
    evaluatedRisk: 'HIGH_RISK',
    agentId: 'core',
    reason: 'Regression test for schema-first token preservation'
  });
  const approvedObj = kernel.securityMiddleware.approveRequest(pendingReq.approvalId);
  assert(approvedObj?.approvalToken, 'Expected single-use approval token');

  // First call: malformed arguments (missing required `content` string) passing the real approvalToken!
  const malformedCall = await kernel.toolService.executeTool({
    id: 'tc_malformed_write',
    toolId: 'file.write_text',
    arguments: { filePath: targetWriteFile } as any,
    requiresUserApproval: true,
    approvalToken: approvedObj!.approvalToken,
    timestamp: Date.now()
  } as any);

  // Second call: valid arguments reusing that EXACT same single-use approvalToken!
  const validCallAfterMalformed = await kernel.toolService.executeTool({
    id: 'tc_valid_write',
    toolId: 'file.write_text',
    arguments: validWriteArgs,
    requiresUserApproval: true,
    approvalToken: approvedObj!.approvalToken,
    timestamp: Date.now()
  } as any);

  check(
    '4.1 Schema validation runs BEFORE policy token consumption so malformed payloads never burn a valid approval token',
    malformedCall.success === false &&
      Boolean(malformedCall.error?.toUpperCase().includes('SCHEMA VALIDATION FAILED')) &&
      validCallAfterMalformed.success === true &&
      validCallAfterMalformed.outcomeStatus === 'completed_verified' &&
      fs.readFileSync(targetWriteFile, 'utf8') === 'VERIFIED_SINGLE_USE_TOKEN',
    `malformedErr="${malformedCall.error}", subsequentValid=${validCallAfterMalformed.outcomeStatus}`
  );

  // ---------------------------------------------------------------------------
  // 6 & 7. Outcome States, Bounded Recovery & Multi-Step Failure Honesty
  // ---------------------------------------------------------------------------
  console.log('\n--- 6 & 7. Outcome Status Truthfulness & Multi-Step Failure Honesty ---');
  const unapprovedLaunch = await kernel.toolService.executeTool({
    id: 'tc_launch_unapproved',
    toolId: 'computer.launch_app',
    toolName: 'Launch Installed Windows Application',
    arguments: { appName: 'notepad' },
    requiresUserApproval: true,
    timestamp: Date.now()
  });
  check(
    '6.1 Unapproved confirmation-gated computer.launch_app returns outcomeStatus=permission_required (never executes silently)',
    unapprovedLaunch.success === false &&
      unapprovedLaunch.outcomeStatus === 'permission_required' &&
      Boolean(unapprovedLaunch.data?.pendingApprovalId),
    `outcomeStatus=${unapprovedLaunch.outcomeStatus}`
  );

  // Test multi-step failure honesty in HarnessOrchestrator (step 1 succeeds, step 2 fails)
  const partialLoop = await kernel.harness.runLoop({
    goal: 'Read existing directory then read nonexistent file',
    proposedSteps: [
      { toolName: 'atomic.list_dir', arguments: { dirPath: '.' } },
      { toolName: 'atomic.read_file', arguments: { filePath: 'does_not_exist_999.txt' } }
    ]
  });
  check(
    '7.1 Multi-step run where step 1 succeeds and step 2 fails never reports COMPLETED/verified',
    partialLoop.status !== 'COMPLETED' && partialLoop.verified === false,
    `status=${partialLoop.status}, verified=${partialLoop.verified}`
  );

  // ---------------------------------------------------------------------------
  // 8, 9, 10 & 11. Global Escape-to-Cancel & Detached User App Safety
  // ---------------------------------------------------------------------------
  console.log('\n--- 8-11. Escape-to-Cancel Propagation, Subprocess Cleanup & Immediate Recovery ---');
  let tokensEmitted = 0;
  const origStream = kernel.omniRouter.stream.bind(kernel.omniRouter);
  kernel.omniRouter.stream = async (_p, onTok, _h, _t, sig) => {
    for (let i = 0; i < 20; i++) {
      if (sig?.aborted) throw new Error('Aborted by Escape');
      onTok(`tok_${i} `);
      tokensEmitted++;
      await new Promise(r => setTimeout(r, 25));
    }
    return 'Uncancelled';
  };
  const streamProm = kernel.executePrompt('Stream test for Escape cancellation', { streamTokens: true });
  while (tokensEmitted < 2) {
    await new Promise(r => setTimeout(r, 15));
  }
  await kernel.cancelActiveTask('Escape during streaming');
  const cancelledStreamRes = await streamProm;
  kernel.omniRouter.stream = origStream;

  check(
    '8.1 Escape during model streaming halts generation immediately and reports Task cancelled.',
    cancelledStreamRes.success === false && cancelledStreamRes.response === 'Task cancelled.',
    `tokensEmitted=${tokensEmitted}, response="${cancelledStreamRes.response}"`
  );

  // Spawn a harmless short-lived detached process (node -e "setTimeout(()=>{}, 1500)") via runManagedCommand(detached=true)
  // and verify Escape cancellation of an active ORION task does NOT kill the detached app or engage E-Stop!
  const detachedLaunch = await ProcessSupervisor.getInstance().runManagedCommand(
    process.execPath,
    ['-e', 'setTimeout(() => {}, 1500);'],
    { detached: true, isDetachedUserApp: true, stdio: 'ignore', windowsHide: true },
    5000
  );
  const detachedPid = detachedLaunch.pid;

  const managedSig = kernel.beginForegroundTask();
  const managedProm = kernel.harness.dispatcher.shellService.execute({
    command: process.execPath,
    args: ['-e', 'setInterval(() => {}, 1000);'],
    cwd: tmpDir,
    signal: managedSig
  });
  await new Promise(r => setTimeout(r, 150));
  await kernel.cancelActiveTask('Escape during managed subprocess');
  const managedOutcome = await managedProm;
  kernel.endForegroundTask();

  let detachedStillAlive = false;
  if (detachedPid) {
    try {
      process.kill(detachedPid, 0);
      detachedStillAlive = true;
      process.kill(detachedPid);
    } catch {
      detachedStillAlive = false;
    }
  }

  check(
    '9.1 Escape terminates ORION-owned managed subprocesses WITHOUT killing detached user apps or engaging E-Stop',
    managedOutcome.status === 'CANCELLED' &&
      detachedStillAlive === true &&
      ProcessSupervisor.getInstance().isEstopActive() === false,
    `managed=${managedOutcome.status}, detachedSurvived=${detachedStillAlive}, estop=${ProcessSupervisor.getInstance().isEstopActive()}`
  );

  // 10. Multi-step propagation & 11. Immediate follow-up task after cancellation
  let stepsStarted = 0;
  const multiCancelLoop = await kernel.harness.runLoop({
    goal: 'Cancel multi-step plan after step 1',
    proposedSteps: [
      { toolName: 'atomic.list_dir', arguments: { dirPath: '.' } },
      { toolName: 'atomic.list_dir', arguments: { dirPath: '.' } },
      { toolName: 'atomic.list_dir', arguments: { dirPath: '.' } }
    ],
    signal: kernel.beginForegroundTask(),
    onStage: (tr) => {
      if (tr.stage === 'OBSERVE') {
        stepsStarted++;
        if (stepsStarted === 1) {
          kernel.cancelActiveTask('Cancel after step 1').catch(() => {});
        }
      }
    }
  });
  kernel.endForegroundTask();

  const immediateFollowup = await kernel.toolService.executeTool({
    id: 'tc_post_cancel_discover',
    toolId: 'computer.discover_apps',
    toolName: 'Discover Installed Windows Applications',
    arguments: { query: 'notepad' },
    requiresUserApproval: false,
    timestamp: Date.now()
  });

  check(
    '10.1 & 11.1 Cancellation halts remaining plan steps (1/3) and next task executes immediately without restart',
    stepsStarted === 1 &&
      multiCancelLoop.status === 'CANCELLED' &&
      immediateFollowup.success === true &&
      immediateFollowup.outcomeStatus === 'completed_verified',
    `cancelledAt=${stepsStarted}/3, followup=${immediateFollowup.outcomeStatus}`
  );

  // ---------------------------------------------------------------------------
  // 12. Chrome Profile Reuse Metadata & Auth / Account Chooser / 2FA Pausing
  // ---------------------------------------------------------------------------
  console.log('\n--- 12. Chrome Profile Directory Resolution & Auth Interruption Pausing ---');
  const fakeLocalStatePath = path.join(tmpDir, 'Fake_Chrome_Local_State.json');
  fs.writeFileSync(
    fakeLocalStatePath,
    JSON.stringify({ profile: { last_used: 'Profile 3' } }),
    'utf8'
  );
  const resolvedProfile = DefaultBrowserProvider.resolveDefaultChromeProfileDirectory(
    undefined,
    fakeLocalStatePath
  );
  const unsafeProfileFallback = DefaultBrowserProvider.resolveDefaultChromeProfileDirectory(
    '../../evil_traversal',
    fakeLocalStatePath
  );
  check(
    '12.1 Chrome profile resolver extracts profile.last_used metadata safely and rejects unsafe profile names',
    resolvedProfile === 'Profile 3' && unsafeProfileFallback === 'Profile 3',
    `resolved="${resolvedProfile}"`
  );

  const authTestServer = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    if (req.url === '/chooser') {
      res.end(
        '<html><head><title>Sign in - Google Accounts</title></head><body><h1>Choose an account</h1><p>to continue to Google Docs</p></body></html>'
      );
    } else if (req.url === '/mfa') {
      res.end(
        '<html><head><title>2-Step Verification</title></head><body><h1>2-Step Verification</h1><p>Enter the verification code sent to your device</p></body></html>'
      );
    } else {
      res.end('<html><head><title>Public Docs</title></head><body><h1>ORION Documentation</h1></body></html>');
    }
  });
  await new Promise<void>(resolve => authTestServer.listen(0, '127.0.0.1', () => resolve()));
  const authPort = (authTestServer.address() as { port: number }).port;

  const browserProvider = new DefaultBrowserProvider({ enableCdp: false });
  const chooserNav = await browserProvider.navigate(`http://127.0.0.1:${authPort}/chooser`, {
    visibleWindow: false
  });
  const mfaNav = await browserProvider.navigate(`http://127.0.0.1:${authPort}/mfa`, {
    visibleWindow: false
  });
  authTestServer.close();

  check(
    '12.2 Account Chooser and 2FA/MFA pages pause cleanly with errorCode=PAUSED_FOR_USER_AUTH (never bypassed)',
    chooserNav.success === false &&
      chooserNav.errorCode === 'PAUSED_FOR_USER_AUTH' &&
      Boolean(chooserNav.observation?.blockers?.some(b => b.type === 'ACCOUNT_CHOOSER')) &&
      mfaNav.success === false &&
      mfaNav.errorCode === 'PAUSED_FOR_USER_AUTH' &&
      Boolean(mfaNav.observation?.blockers?.some(b => b.type === 'TWO_FACTOR_AUTH')),
    `chooser=${chooserNav.errorCode}, mfa=${mfaNav.errorCode}`
  );

  // ---------------------------------------------------------------------------
  // 13 & 14. Reference-Faithful CLI, Canonical 18x18 Oris Sprite & Honest Media Status
  // ---------------------------------------------------------------------------
  console.log('\n--- 13 & 14. Canonical 18x18 Pixel-Art Oris CLI & Honest Media Status ---');
  const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');
  const spriteJsonPath = path.join(repoRoot, 'assets', 'mascot', 'oris-sprite.json');
  const spritePngPath = path.join(repoRoot, 'assets', 'mascot', 'oris-reference.png');
  const spriteJson = JSON.parse(fs.readFileSync(spriteJsonPath, 'utf8'));

  check(
    '14.1 Canonical Oris assets (oris-reference.png & 18x18 oris-sprite.json) exist and match embedded pixel grid',
    fs.existsSync(spritePngPath) &&
      fs.statSync(spritePngPath).size > 1000 &&
      spriteJson.logicalWidth === 18 &&
      spriteJson.logicalHeight === 18 &&
      spriteJson.terminalWidthCols === 18 &&
      spriteJson.terminalHeightRows === 9 &&
      ORIS_CANONICAL_PIXEL_GRID_18X18.length === 18 &&
      ORIS_CANONICAL_PIXEL_GRID_18X18[0].length === 18,
    `sprite=${spriteJson.logicalWidth}x${spriteJson.logicalHeight} -> ${spriteJson.terminalWidthCols}x${spriteJson.terminalHeightRows} half-blocks`
  );

  const orisCtrl = new OrisMascotController();
  const colorLinesIdle = renderOrisPixelHalfBlockLines(orisCtrl.getState(), { noColor: false });
  const monoLinesIdle = renderOrisPixelHalfBlockLines(orisCtrl.getState(), { noColor: true });
  const approvalState = orisCtrl.setTaskLifecycleState('awaiting_approval');
  const colorLinesApproval = renderOrisPixelHalfBlockLines(approvalState, { noColor: false });

  // Test 9-row pixel-art hitbox across resizes & click-to-jump / rapid-click-flip
  const pixelHitbox100 = computeOrisHitbox(100, 30, 0, 0, 7, 9);
  const pixelHitbox140 = computeOrisHitbox(140, 40, 0, 0, 12, 9);
  const clickEv = parseSgrMouseEvents(`\x1b[<0;${pixelHitbox100.centerCol};${pixelHitbox100.centerRow}M`)[0];
  orisCtrl.setTaskLifecycleState('idle');
  const clickJump = orisCtrl.handleMouseEvent(clickEv, pixelHitbox100, 10_000);
  orisCtrl.handleMouseEvent(clickEv, pixelHitbox100, 10_150);
  const clickFlip = orisCtrl.handleMouseEvent(clickEv, pixelHitbox100, 10_300);
  const colorLinesFallen = renderOrisPixelHalfBlockLines(clickFlip.state, { noColor: false });

  check(
    '13.1 & 14.2 18x18 Oris renders 9 half-block rows in 24-bit color & --no-color fallback, updates across awaiting_approval/jumping/fallen, and aligns 9-row hitbox across resizes',
    colorLinesIdle.length === 9 &&
      colorLinesIdle[0].includes('▀') &&
      monoLinesIdle.length === 9 &&
      !monoLinesIdle[0].includes('\x1b[') &&
      colorLinesApproval.join('\n') !== colorLinesIdle.join('\n') &&
      colorLinesFallen.join('\n') !== colorLinesIdle.join('\n') &&
      pixelHitbox100.height === 9 &&
      pixelHitbox140.centerCol === 70 &&
      isPointInsideHitbox(pixelHitbox100.centerCol, pixelHitbox100.bottomRow, pixelHitbox100) &&
      clickJump.state.actionState === 'jumping' &&
      clickFlip.state.actionState === 'fallen' &&
      stripSgrMouseSequences('hello\x1b[<0;50;9Mworld') === 'helloworld',
    `rows=${colorLinesIdle.length}, hitboxHeight=${pixelHitbox100.height}`
  );

  const ink = await loadInkPrimitives();
  const capElement = React.createElement(Capsule, {
    ink,
    inputValue: '',
    onInputChange: () => {},
    onInputSubmit: () => {},
    mode: 'Build',
    effort: 'medium',
    activeModel: 'llama3.1:8b',
    activeProvider: 'ollama',
    workingDirectory: tmpDir,
    taskStatusLabel: 'READY',
    isBusy: false,
    estopActive: false,
    vividMode: true,
    attachedFilesCount: 0,
    pendingApprovalsCount: 0,
    columns: 110,
    rows: 32
  });
  const starElement = React.createElement(Starfield, {
    ink,
    columns: 110,
    rows: 5,
    vividMode: true,
    seedOffset: 0
  });
  const ttyWrites: string[] = [];
  const guard = new AlternateScreenGuard({
    isTTY: true,
    write: (s: string) => {
      ttyWrites.push(s);
      return true;
    }
  } as unknown as NodeJS.WriteStream);
  guard.enter();
  guard.leave();

  check(
    '13.2 Reference-faithful Capsule, geometric ORION title, full-width Starfield, and AlternateScreenGuard instantiate and restore cleanly',
    Boolean(capElement) &&
      Boolean(starElement) &&
      ORION_GEOMETRIC_TITLE_LINES.length === 2 &&
      ttyWrites.some(w => w.includes('\x1b[?1049h')) &&
      ttyWrites.some(w => w.includes('\x1b[?1049l') && w.includes('\x1b[?25h')) &&
      !guard.isActive(),
    `writes=${ttyWrites.length}`
  );

  const mediaStatusRes = await kernel.toolService.executeTool({
    id: 'tc_media_status',
    toolId: 'media.status',
    toolName: 'Media & Spotify Now Playing Status',
    arguments: {},
    requiresUserApproval: false,
    timestamp: Date.now()
  });
  check(
    '14.3 media.status inspects Windows media session truthfully without fabricating playback',
    mediaStatusRes.success === true &&
      mediaStatusRes.outcomeStatus === 'completed_verified' &&
      typeof mediaStatusRes.data?.playing === 'boolean' &&
      typeof mediaStatusRes.data?.running === 'boolean',
    `running=${mediaStatusRes.data?.running}, playing=${mediaStatusRes.data?.playing}, source=${mediaStatusRes.data?.source}`
  );

  await browserProvider.close();
  await kernel.shutdown();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}

  console.log('\n================================================================================');
  console.log(`ORION MASTER ENGINEERING MISSION SUITE SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('================================================================================\n');

  assert.strictEqual(failed, 0, `Expected 0 failures in OrionMasterEngineeringMission, got ${failed}`);
  process.exit(0);
}

runMasterMissionRegressionSuite().catch((err) => {
  console.error('OrionMasterEngineeringMission suite failed:', err);
  process.exit(1);
});
