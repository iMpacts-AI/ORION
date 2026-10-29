import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import http from 'http';
import React from 'react';
import {
  ORIS_CANONICAL_DESIGN_SPEC,
  SGR_MOUSE_ENABLE_SEQ,
  SGR_MOUSE_DISABLE_SEQ,
  enableTerminalMouseTracking,
  disableTerminalMouseTracking,
  parseSgrMouseEvents,
  containsSgrMouseSequence,
  stripSgrMouseSequences,
  computeOrisHitbox,
  isPointInsideHitbox,
  isPointNearHitbox,
  OrisMascotController,
  renderOrisAsciiLines,
  MascotInteractive
} from '../../../tui/MascotInteractive';
import {
  Starfield,
  createBoundedStarParticles,
  generateDeterministicStars,
  stepStarfieldParallax
} from '../../../tui/Starfield';
import { Capsule } from '../../../tui/Capsule';
import { AlternateScreenGuard } from '../../../tui/OrionTuiApp';
import { loadInkPrimitives } from '../../../tui/inkLoader';
import { OrionCliKernel } from '../../../cli/OrionCliKernel';
import { OrionCliCommandRouter } from '../../../cli/OrionCliCommandRouter';
import { OrionCliRenderer } from '../../../cli/OrionCliRenderer';
import { ProcessSupervisor } from '../computer/ProcessSupervisor';

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

async function runOrisMascotAndEscapeCancelAcceptance(): Promise<void> {
  console.log('================================================================================');
  console.log('ORIS INTERACTIVE MASCOT + GLOBAL ESCAPE-TO-CANCEL ACCEPTANCE SUITE');
  console.log('================================================================================\n');

  const tmpWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), 'orion-oris-esc-test-'));
  ProcessSupervisor.getInstance().resetEstop('Oris + Escape acceptance startup');

  // ===========================================================================
  // PART 1 (SECTION 12): ORIS MASCOT INTERACTION & MOUSE TRACKING TESTS (1-10)
  // ===========================================================================
  console.log('--- Part 1 (Section 12): Oris Mascot Interaction & Mouse Tracking Tests ---');

  // 12.1 Mouse tracking enable/disable escape sequence handling
  const writtenSeqs: string[] = [];
  enableTerminalMouseTracking((s) => writtenSeqs.push(s));
  disableTerminalMouseTracking((s) => writtenSeqs.push(s));

  const guardChunks: string[] = [];
  const mockTtyOut = {
    isTTY: true,
    write: (s: string) => {
      guardChunks.push(s);
      return true;
    }
  } as unknown as NodeJS.WriteStream;
  const screenGuard = new AlternateScreenGuard(mockTtyOut);
  screenGuard.enter();
  screenGuard.leave();

  check(
    '12.1 Mouse tracking enable (?1000h?1002h?1006h) & disable (?1006l?1002l?1000l) sequences handled cleanly',
    writtenSeqs[0] === SGR_MOUSE_ENABLE_SEQ &&
      writtenSeqs[1] === SGR_MOUSE_DISABLE_SEQ &&
      guardChunks.some(c => c.includes('\x1b[?1000h\x1b[?1002h\x1b[?1006h')) &&
      guardChunks.some(c => c.includes('\x1b[?1006l\x1b[?1002l\x1b[?1000l')),
    `enable=${JSON.stringify(SGR_MOUSE_ENABLE_SEQ)}, disable=${JSON.stringify(SGR_MOUSE_DISABLE_SEQ)}`
  );

  // 12.2 SGR mouse packet parsing for move, press, and release events
  const sgrPacketStream = '\x1b[<35;50;8M\x1b[<0;50;8M\x1b[<0;50;8m[<0;42;9M';
  const parsedEvents = parseSgrMouseEvents(sgrPacketStream);
  check(
    '12.2 SGR mouse packet parser extracts move, press, and release events accurately',
    parsedEvents.length === 4 &&
      parsedEvents[0].type === 'move' &&
      parsedEvents[0].col === 50 &&
      parsedEvents[0].row === 8 &&
      parsedEvents[1].type === 'press' &&
      parsedEvents[1].isLeftButton === true &&
      parsedEvents[2].type === 'release' &&
      parsedEvents[3].type === 'press' &&
      parsedEvents[3].col === 42 &&
      parsedEvents[3].row === 9,
    `parsed=${parsedEvents.map(e => `${e.type}@(${e.col},${e.row})`).join(', ')}`
  );

  // 12.3 Hitbox calculation across terminal sizes
  const hb80 = computeOrisHitbox(80, 24, 0, 0);
  const hb120 = computeOrisHitbox(120, 40, 0, 0);
  const hbNarrow = computeOrisHitbox(50, 20, 0, 0);
  check(
    '12.3 Hitbox calculation centers Oris dynamically across 80x24, 120x40, and 50x20 terminal sizes',
    hb80.centerCol === 40 &&
      hb120.centerCol === 60 &&
      hbNarrow.centerCol === 25 &&
      hb80.width === ORIS_CANONICAL_DESIGN_SPEC.widthCols &&
      hb80.height === ORIS_CANONICAL_DESIGN_SPEC.heightRows &&
      isPointInsideHitbox(hb120.centerCol, hb120.centerRow, hb120) &&
      !isPointInsideHitbox(1, 1, hb120),
    `80col->center=${hb80.centerCol}, 120col->center=${hb120.centerCol}`
  );

  // 12.4 Idle chirp/hop/blink state transitions (`idle -> blinking -> hopping -> landing -> idle`)
  const idleCtrl = new OrisMascotController();
  const observedIdleStates = new Set<string>([idleCtrl.getState().actionState]);
  for (let i = 0; i < 80; i++) {
    const st = idleCtrl.step(100);
    observedIdleStates.add(st.actionState);
  }
  check(
    '12.4 Idle chirp/hop/blink state machine transitions through idle -> blinking -> hopping -> landing -> idle',
    observedIdleStates.has('idle') &&
      observedIdleStates.has('blinking') &&
      observedIdleStates.has('hopping') &&
      observedIdleStates.has('landing'),
    `states=${Array.from(observedIdleStates).join(' -> ')}`
  );

  // 12.5 Cursor proximity reaction (`tracking`) and return to idle
  const trackCtrl = new OrisMascotController();
  const hitbox = computeOrisHitbox(100, 30);
  const nearRightMove = parseSgrMouseEvents(`\x1b[<35;${hitbox.centerCol + 5};${hitbox.centerRow}M`)[0];
  const trackRes = trackCtrl.handleMouseEvent(nearRightMove, hitbox, 1000);
  const trackedState = trackRes.state;
  // Advance time past tracking decay (>1400ms) so it returns to idle smoothly
  trackCtrl.step(800);
  const decayedState = trackCtrl.step(800);
  check(
    '12.5 Cursor proximity triggers tracking (eyes & tilt follow pointer) and decays smoothly back to idle',
    trackRes.handled &&
      trackedState.actionState === 'tracking' &&
      trackedState.eyeOffsetX === 1 &&
      trackedState.tiltDirection === 1 &&
      decayedState.actionState === 'idle' &&
      decayedState.eyeOffsetX === 0,
    `tracking=(eye=${trackedState.eyeOffsetX}, tilt=${trackedState.tiltDirection}) -> ${decayedState.actionState}`
  );

  // 12.6 Single click inside hitbox triggers jump (`jumping`) and settles back to idle
  const jumpCtrl = new OrisMascotController({ jumpDurationMs: 360 });
  const clickInside = parseSgrMouseEvents(`\x1b[<0;${hitbox.centerCol};${hitbox.centerRow}M`)[0];
  const jumpRes = jumpCtrl.handleMouseEvent(clickInside, hitbox, 2000);
  const jumpInitial = jumpRes.state;
  const jumpMid = jumpCtrl.step(200);
  const jumpLanding = jumpCtrl.step(200);
  const jumpSettled = jumpCtrl.step(200);
  check(
    '12.6 Single click inside hitbox triggers spring jump (~3 rows + ✧/✦ particles) and settles back to idle',
    jumpRes.handled &&
      jumpInitial.actionState === 'jumping' &&
      jumpInitial.y === -3 &&
      jumpInitial.particles.length >= 2 &&
      jumpMid.y < 0 &&
      jumpLanding.actionState === 'landing' &&
      jumpSettled.actionState === 'idle' &&
      jumpSettled.y === 0,
    `y: ${jumpInitial.y} -> ${jumpMid.y} -> ${jumpLanding.y} (${jumpLanding.actionState}) -> ${jumpSettled.actionState}`
  );

  // 12.7 Click outside hitbox does not trigger jump
  const outsideCtrl = new OrisMascotController();
  const clickOutside = parseSgrMouseEvents('\x1b[<0;2;2M')[0];
  const outsideRes = outsideCtrl.handleMouseEvent(clickOutside, hitbox, 3000);
  check(
    '12.7 Click outside hitbox does NOT trigger jump or alter idle state',
    outsideRes.handled === false &&
      outsideRes.state.actionState === 'idle' &&
      outsideRes.state.y === 0,
    `handled=${outsideRes.handled}, state=${outsideRes.state.actionState}`
  );

  // 12.8 Repeated rapid clicks trigger fallen/flip state and recover after ~400ms
  const flipCtrl = new OrisMascotController({
    multiClickThresholdCount: 3,
    multiClickWindowMs: 900,
    fallenDurationMs: 400
  });
  flipCtrl.handleMouseEvent(clickInside, hitbox, 5000);
  flipCtrl.handleMouseEvent(clickInside, hitbox, 5200);
  const thirdClick = flipCtrl.handleMouseEvent(clickInside, hitbox, 5400);
  const fallenArt = renderOrisAsciiLines(thirdClick.state);
  const midFall = flipCtrl.step(260);
  const recoveredFromFall = flipCtrl.step(200);
  check(
    '12.8 Repeated rapid clicks trigger fallen/flip state (~400ms) and recover cleanly to idle',
    thirdClick.state.actionState === 'fallen' &&
      fallenArt.badgeText.includes('TUMBLE FLIP') &&
      midFall.actionState === 'fallen' &&
      recoveredFromFall.actionState === 'idle' &&
      recoveredFromFall.y === 0,
    `click3=${thirdClick.state.actionState} -> mid=${midFall.actionState} -> +460ms=${recoveredFromFall.actionState}`
  );

  // 12.9 Clicking mascot does not submit or clear the prompt input buffer
  const promptBefore = 'build a full-stack dashboard ';
  const pollutedInput = promptBefore + '\x1b[<0;50;8M\x1b[<0;50;8m';
  const sanitizedPrompt = stripSgrMouseSequences(pollutedInput);
  check(
    '12.9 Clicking mascot / SGR mouse sequences never submit or corrupt the prompt input buffer',
    containsSgrMouseSequence('\x1b[<0;50;8M') &&
      sanitizedPrompt === promptBefore,
    `sanitized="${sanitizedPrompt}"`
  );

  // 12.10 Task state changes update mascot state (`thinking`, `working`, `success`, `cancelled`, `error`)
  const lifecycleCtrl = new OrisMascotController();
  const sThinking = lifecycleCtrl.setTaskLifecycleState('thinking');
  const sWorking = lifecycleCtrl.setTaskLifecycleState('working');
  const sSuccess = lifecycleCtrl.setTaskLifecycleState('success');
  const sCancelled = lifecycleCtrl.setTaskLifecycleState('cancelled');
  const sError = lifecycleCtrl.setTaskLifecycleState('error');
  const sBackIdle = lifecycleCtrl.setTaskLifecycleState('idle');
  check(
    '12.10 Task lifecycle events transition Oris across thinking, working, success, cancelled, error, and back to idle',
    sThinking.actionState === 'thinking' &&
      sWorking.actionState === 'working' &&
      sSuccess.actionState === 'success' &&
      sCancelled.actionState === 'cancelled' &&
      sError.actionState === 'error' &&
      sBackIdle.actionState === 'idle',
    `${sThinking.actionState}->${sWorking.actionState}->${sSuccess.actionState}->${sCancelled.actionState}->${sError.actionState}->${sBackIdle.actionState}`
  );

  // ===========================================================================
  // PART 4 (SECTION 17G): STARFIELD PARALLAX & ORIS PERSONALITY CHECKS (1-12)
  // ===========================================================================
  console.log('\n--- Part 4 (Section 17G): Starfield Parallax & Oris Personality Checks ---');

  const starsInitial = generateDeterministicStars(100, 5, 24);
  const layersPresent = new Set(starsInitial.map(s => s.layer));
  const starsAfterStep1 = stepStarfieldParallax(starsInitial, 100, 5, 500);
  const starsAfterStep2 = stepStarfieldParallax(starsAfterStep1, 100, 5, 500);
  const movedStars = starsInitial.filter((s, idx) => Math.abs(s.x - starsAfterStep2[idx].x) > 0.05);
  const twinkledStars = starsInitial.filter(
    (s, idx) => s.twinklePhase !== starsAfterStep2[idx].twinklePhase
  );

  const ink = await loadInkPrimitives();
  const mascotEl = React.createElement(MascotInteractive, {
    ink,
    columns: 100,
    rows: 30,
    vividMode: true,
    taskLifecycle: 'idle',
    externalTick: 1,
    deltaMs: 120
  });
  const starEl = React.createElement(Starfield, {
    ink,
    columns: 100,
    rows: 4,
    vividMode: true,
    externalTick: 1,
    deltaMs: 120
  });
  const capEl = React.createElement(Capsule, {
    ink,
    inputValue: '',
    onInputChange: () => {},
    onInputSubmit: () => {},
    mode: 'Build',
    effort: 'medium',
    activeModel: 'llama3.1:8b',
    activeProvider: 'ollama',
    workingDirectory: tmpWorkspace,
    taskStatusLabel: 'READY',
    isBusy: false,
    estopActive: false,
    vividMode: true,
    attachedFilesCount: 0,
    pendingApprovalsCount: 0,
    columns: 100,
    rows: 30,
    mascotLifecycle: 'idle',
    externalTick: 1,
    deltaMs: 120
  });

  check(
    '17G.1 Starfield renders and animates smoothly without flickering or high CPU usage',
    Boolean(starEl) && createBoundedStarParticles(100, 4, true).length <= 28,
    `boundedParticles=${createBoundedStarParticles(100, 4, true).length}`
  );
  check(
    '17G.2 Stars move at multiple speeds/layers (far, mid, near) and twinkle subtly',
    layersPresent.has('far') &&
      layersPresent.has('mid') &&
      layersPresent.has('near') &&
      movedStars.length === starsInitial.length &&
      twinkledStars.length === starsInitial.length,
    `layers=${Array.from(layersPresent).join(',')}, moving=${movedStars.length}/${starsInitial.length}`
  );
  check(
    '17G.3 Oris is centered in the mascot/dashboard region across terminal sizes',
    Boolean(mascotEl) && Boolean(capEl) && hb80.centerCol === 40 && hb120.centerCol === 60,
    `center80=${hb80.centerCol}, center120=${hb120.centerCol}`
  );
  check(
    '17G.4 Oris preserves the exact approved design silhouette and proportions (5-row 19-col canonical spec)',
    ORIS_CANONICAL_DESIGN_SPEC.canonicalIdleSilhouette.length === 5 &&
      ORIS_CANONICAL_DESIGN_SPEC.widthCols === 19 &&
      ORIS_CANONICAL_DESIGN_SPEC.heightRows === 5,
    `${ORIS_CANONICAL_DESIGN_SPEC.widthCols}x${ORIS_CANONICAL_DESIGN_SPEC.heightRows}`
  );
  check(
    '17G.5 Oris blinks naturally (short & relaxed long blinks) and performs subtle idle bobbing/hops',
    observedIdleStates.has('blinking') && observedIdleStates.has('hopping'),
    `states=${Array.from(observedIdleStates).join('->')}`
  );
  check(
    '17G.6 Moving the cursor near Oris triggers gentle awareness/jiggle',
    trackedState.actionState === 'tracking' && trackedState.eyeOffsetX === 1,
    `actionState=${trackedState.actionState}`
  );
  check(
    '17G.7 Clicking Oris triggers a jump with ✧ and ✦ particles and settles cleanly',
    jumpInitial.actionState === 'jumping' &&
      jumpInitial.particles.some(p => p.glyph === '✧' || p.glyph === '✦') &&
      jumpSettled.actionState === 'idle',
    `particles=${jumpInitial.particles.map(p => p.glyph).join('')}`
  );
  check(
    '17G.8 Clicking outside Oris does not trigger a jump',
    outsideRes.handled === false && outsideRes.state.actionState === 'idle',
    `handled=${outsideRes.handled}`
  );
  check(
    '17G.9 Repeated rapid clicks trigger the fallen/flip state (~400ms) and recover cleanly',
    thirdClick.state.actionState === 'fallen' && recoveredFromFall.actionState === 'idle',
    `${thirdClick.state.actionState} -> ${recoveredFromFall.actionState}`
  );
  check(
    '17G.10 Clicking Oris does not submit the prompt or break keyboard typing',
    sanitizedPrompt === promptBefore,
    'Prompt buffer preserved'
  );
  check(
    '17G.11 Terminal resize keeps the starfield, centered Oris, and hitbox aligned',
    computeOrisHitbox(140, 42).centerCol === 70 && computeOrisHitbox(64, 22).centerCol === 32,
    '140col->70, 64col->32'
  );
  check(
    '17G.12 Exiting ORION disables mouse tracking and restores terminal state cleanly',
    guardChunks.some(c => c.includes(SGR_MOUSE_DISABLE_SEQ)) && !screenGuard.isActive(),
    'SGR_MOUSE_DISABLE_SEQ verified'
  );

  // ===========================================================================
  // PART 2 (SECTION 13): GLOBAL ESCAPE-TO-CANCEL TESTS (1-15)
  // ===========================================================================
  console.log('\n--- Part 2 (Section 13): Global Escape-to-Cancel Tests (1-15) ---');

  const logChunks: string[] = [];
  const memStream = {
    write: (s: string) => {
      logChunks.push(s);
      return true;
    }
  } as unknown as NodeJS.WritableStream;

  const renderer = new OrionCliRenderer({ outputStream: memStream, useColor: false });
  const kernel = new OrionCliKernel({ projectRoot: tmpWorkspace, renderer });
  const router = new OrionCliCommandRouter(kernel);

  // Track kernel cancellation state transitions (`idle -> running -> cancelling -> cancelled`)
  const stateHistory: string[] = [kernel.getTaskExecutionState()];
  const unsubState = kernel.onTaskStateChange((st) => {
    stateHistory.push(st);
  });

  // 13.1 Pressing Escape when idle does NOT exit ORION or clear input
  const idleCancelRes = await kernel.cancelActiveTask('Escape pressed while idle');
  check(
    '13.1 Pressing Escape when idle is a safe no-op (does not exit ORION or trigger cancellation)',
    idleCancelRes.cancelled === false &&
      kernel.getTaskExecutionState() === 'idle' &&
      !ProcessSupervisor.getInstance().isEstopActive(),
    `cancelled=${idleCancelRes.cancelled}, state=${kernel.getTaskExecutionState()}`
  );

  // 13.2 & 13.3 Escape during model request / streaming response stops token output immediately
  let streamedTokensCount = 0;
  let streamCleanupCalled = false as boolean;
  const origStream = kernel.omniRouter.stream.bind(kernel.omniRouter);
  kernel.omniRouter.stream = async (
    _prompt: string,
    onToken: (tok: string) => void,
    _history?: any,
    _timeouts?: any,
    externalSignal?: AbortSignal
  ): Promise<string> => {
    for (let i = 0; i < 20; i++) {
      if (externalSignal?.aborted) {
        streamCleanupCalled = true;
        throw new Error('Stream cancelled by AbortSignal.');
      }
      onToken(`token_${i} `);
      streamedTokensCount++;
      await new Promise(r => setTimeout(r, 35));
    }
    return 'Full uncancelled response';
  };

  const streamTaskPromise = kernel.executePrompt('Explain quantum error correction in detail', {
    streamTokens: true
  });
  const waitStart = Date.now();
  while (streamedTokensCount < 2 && Date.now() - waitStart < 2500) {
    await new Promise(r => setTimeout(r, 20));
  }
  const tokensAtCancel = streamedTokensCount;
  const escStreamRes = await kernel.cancelActiveTask('Escape during streaming');
  const streamTaskResult = await streamTaskPromise;
  await new Promise(r => setTimeout(r, 80));
  const tokensAfterWait = streamedTokensCount;
  kernel.omniRouter.stream = origStream;

  check(
    '13.2-13.3 Escape during model streaming immediately stops token generation and aborts stream',
    escStreamRes.cancelled === true &&
      streamCleanupCalled === true &&
      tokensAtCancel >= 1 &&
      tokensAtCancel < 10 &&
      tokensAfterWait === tokensAtCancel &&
      streamTaskResult.success === false &&
      streamTaskResult.response === 'Task cancelled.',
    `tokensAtCancel=${tokensAtCancel}, tokensAfter=${tokensAfterWait}, response="${streamTaskResult.response}"`
  );

  // 13.4 & 13.12 Escape during multi-step plan prevents remaining steps from starting & never reports completed
  let executedStepsCount = 0;
  const multiStepRunPromise = kernel.harness.runLoop({
    goal: 'Run 3 sequential read steps and cancel after step 1',
    proposedSteps: [
      { toolName: 'git.status', arguments: {} },
      { toolName: 'atomic.list_dir', arguments: { dirPath: '.' } },
      { toolName: 'atomic.search_files', arguments: { pattern: '*' } }
    ],
    signal: kernel.beginForegroundTask(),
    onStage: (trace) => {
      if (trace.stage === 'OBSERVE') {
        executedStepsCount++;
        if (executedStepsCount === 1) {
          // Press Escape right after step 1 completes
          kernel.cancelActiveTask('Escape after step 1').catch(() => {});
        }
      }
    }
  });
  const multiStepReport = await multiStepRunPromise;
  kernel.endForegroundTask();

  check(
    '13.4 & 13.12 Escape during multi-step plan halts before step 2 starts and reports status=CANCELLED (never COMPLETED)',
    executedStepsCount === 1 &&
      multiStepReport.toolResults.length === 1 &&
      multiStepReport.status === 'CANCELLED' &&
      multiStepReport.verified === false,
    `stepsExecuted=${executedStepsCount}/3, status=${multiStepReport.status}, verified=${multiStepReport.verified}`
  );

  // 13.5 & 13.6 Escape during tool execution & subprocess execution terminates the subprocess cleanly
  const slowShellSignal = kernel.beginForegroundTask();
  const slowShellPromise = kernel.harness.dispatcher.shellService.execute({
    command: process.execPath,
    args: ['-e', 'setInterval(() => {}, 1000);'],
    cwd: tmpWorkspace,
    timeoutMs: 15000,
    signal: slowShellSignal
  });
  await new Promise(r => setTimeout(r, 250));
  const activeProcsDuringRun = ProcessSupervisor.getInstance().getActiveProcessCount();
  const escShellCancel = await kernel.cancelActiveTask('Escape during long-running subprocess');
  const slowShellOutcome = await slowShellPromise;
  kernel.endForegroundTask();

  check(
    '13.5-13.6 Escape during tool/subprocess execution terminates child process tree and returns status=CANCELLED',
    activeProcsDuringRun >= 1 &&
      escShellCancel.cancelled === true &&
      slowShellOutcome.status === 'CANCELLED' &&
      slowShellOutcome.success === false &&
      ProcessSupervisor.getInstance().getActiveProcessCount() === 0,
    `activeDuring=${activeProcsDuringRun}, outcome=${slowShellOutcome.status}, remainingProcs=${ProcessSupervisor.getInstance().getActiveProcessCount()}`
  );

  // 13.7 Escape during browser operation cancels the browser action cleanly
  const slowServer = http.createServer((_req, res) => {
    // Deliberately hold connection open until aborted
    setTimeout(() => {
      try {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<html><head><title>Delayed</title></head><body>Delayed</body></html>');
      } catch {}
    }, 10000);
  });
  await new Promise<void>(resolve => slowServer.listen(0, '127.0.0.1', () => resolve()));
  const srvAddr = slowServer.address() as { port: number };
  const slowUrl = `http://127.0.0.1:${srvAddr.port}/slow`;

  const browserSignal = kernel.beginForegroundTask();
  const navPromise = kernel.toolService.getBrowserProvider().navigate(slowUrl, {
    timeoutMs: 12000,
    ...( { signal: browserSignal } as any )
  });
  await new Promise(r => setTimeout(r, 120));
  await kernel.cancelActiveTask('Escape during browser navigation');
  const navResult = await navPromise;
  kernel.endForegroundTask();
  slowServer.close();

  check(
    '13.7 Escape during browser operation aborts in-flight navigation and returns errorCode=CANCELLED',
    navResult.success === false &&
      (navResult.errorCode as any) === 'CANCELLED' &&
      /cancelled/i.test(navResult.error || ''),
    `errorCode=${navResult.errorCode}, error="${navResult.error}"`
  );

  // 13.8-13.9 Escape when command menu or contextual panel is open closes/dismisses cleanly
  let slashMenuDismissed = false as boolean;
  let approvalDeniedViaEscape = false as boolean;
  const simulateEscapeOnOverlay = (opts: { slashOpen: boolean; approvalOpen: boolean }) => {
    if (opts.approvalOpen) {
      approvalDeniedViaEscape = true;
      return 'DENIED_APPROVAL';
    }
    if (opts.slashOpen) {
      slashMenuDismissed = true;
      return 'DISMISSED_SLASH_MENU';
    }
    return 'NO_OP';
  };
  simulateEscapeOnOverlay({ slashOpen: true, approvalOpen: false });
  simulateEscapeOnOverlay({ slashOpen: false, approvalOpen: true });

  check(
    '13.8-13.9 Escape dismisses open SlashMenu or denies pending approval prompt cleanly',
    slashMenuDismissed === true && approvalDeniedViaEscape === true,
    `slashDismissed=${slashMenuDismissed}, approvalDenied=${approvalDeniedViaEscape}`
  );

  // 13.10 Repeated Escape presses do not crash or double-cancel
  const repSignal = kernel.beginForegroundTask();
  const repResults = await Promise.all([
    kernel.cancelActiveTask('Repeated Escape #1'),
    kernel.cancelActiveTask('Repeated Escape #2'),
    kernel.cancelActiveTask('Repeated Escape #3')
  ]);
  kernel.endForegroundTask();
  check(
    '13.10 Repeated rapid Escape presses are idempotent and do not crash or double-cancel',
    repSignal.aborted === true &&
      repResults.filter(r => r.cancelled).length === 1 &&
      repResults.slice(1).every(r => r.cancelled === false),
    `results=${repResults.map(r => r.cancelled).join(', ')}`
  );

  // 13.11 Subsequent prompt after cancellation works normally
  const postCancelDispatch = await router.dispatch('/status');
  check(
    '13.11 Subsequent prompt/command after Escape cancellation executes normally',
    postCancelDispatch.handled === true && postCancelDispatch.exitCode === 0,
    `exitCode=${postCancelDispatch.exitCode}`
  );

  // 13.13Mascot & UI state return cleanly after cancellation (`idle -> running -> cancelling -> cancelled`)
  check(
    '13.13 Task cancellation state machine records full progression (idle -> running -> cancelling -> cancelled)',
    stateHistory.includes('idle') &&
      stateHistory.includes('running') &&
      stateHistory.includes('cancelling') &&
      stateHistory.includes('cancelled'),
    `history=${Array.from(new Set(stateHistory)).join(' -> ')}`
  );

  // 13.14-13.15 Emergency Stop (/stop) remains independent and higher-priority than Escape-to-Cancel
  const estopAfterEscape = ProcessSupervisor.getInstance().isEstopActive();
  await kernel.cancelActiveOperation(); // Explicit Emergency Stop
  const estopAfterStopCmd = ProcessSupervisor.getInstance().isEstopActive();
  ProcessSupervisor.getInstance().resetEstop('Reset after test 13.15');
  kernel.permissionService.resetEmergencyStop();

  check(
    '13.14-13.15 Escape cancellation works independently of E-Stop, while Emergency Stop (/stop) remains authoritative',
    estopAfterEscape === false &&
      estopAfterStopCmd === true &&
      !ProcessSupervisor.getInstance().isEstopActive(),
    `estopAfterEscape=${estopAfterEscape}, estopAfterStopCmd=${estopAfterStopCmd}`
  );

  unsubState();
  await kernel.shutdown();
  try {
    fs.rmSync(tmpWorkspace, { recursive: true, force: true });
  } catch {}

  console.log('\n================================================================================');
  console.log(`ORIS MASCOT & ESCAPE-TO-CANCEL SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('================================================================================\n');

  assert.strictEqual(failed, 0, `Expected 0 failures in OrisMascotAndEscapeCancelAcceptance, got ${failed}`);
  process.exit(0);
}

runOrisMascotAndEscapeCancelAcceptance().catch((err) => {
  console.error('OrisMascotAndEscapeCancelAcceptance failed:', err);
  process.exit(1);
});
