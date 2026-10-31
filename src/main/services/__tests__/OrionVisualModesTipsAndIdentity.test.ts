import fs from 'fs';
import os from 'os';
import path from 'path';
import React from 'react';
import { PassThrough } from 'stream';
import { loadInkPrimitives } from '../../../tui/inkLoader';
import { OrionTuiView } from '../../../tui/OrionTuiApp';
import {
  CoordinatedFrameStream,
  FilteredTtyInputStream
} from '../../../tui/CoordinatedFrameWriter';
import {
  VisualPreferencesStore,
  isDecorativeMotionActive
} from '../../../tui/VisualPreferences';
import {
  ORION_CURATED_TIP_CATALOG,
  TIP_PRIORITY_WEIGHTS,
  buildAvailableTipPool,
  cycleManualTip,
  parseTipSegments,
  pickWeightedNextTip,
  renderTipPlainText
} from '../../../tui/OrionTipsEngine';
import {
  OrisMascotController,
  computeOrisHitbox,
  renderOrisPixelHalfBlockLines
} from '../../../tui/MascotInteractive';
import {
  classifyConversationalTurn,
  formatDeveloperEngineDiagnostics,
  formatLogicalPath,
  isExplicitSystemSpecQuery,
  resolvePublicEngineIdentity,
  sanitizeConversationalResponse,
  sanitizePersonalPathsInText
} from '../../../shared/branding/OrionEngineIdentity';
import { OrionCliKernel } from '../../../cli/OrionCliKernel';
import { OrionCliCommandRouter } from '../../../cli/OrionCliCommandRouter';
import { OrionCliRenderer } from '../../../cli/OrionCliRenderer';
import { OrionOrchestrator } from '../OrionOrchestrator';

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

async function runSuite(): Promise<void> {
  console.log('=== ORION VISUAL MODES, CURATED TIPS, ORIS ARC, IDENTITY & 10-CASE CONVERSATION SUITE ===\n');

  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'orion-visual-identity-suite-'));
  const prefsFile = path.join(tmpRoot, 'preferences.json');

  // ===========================================================================
  // PART 1: VISUAL MODE + INDEPENDENT ANIMATION PERSISTENCE & 4-COMBINATION CONTRACT
  // ===========================================================================
  console.log('--- Part 1: Persisted Visual Mode, Independent Animation Preference & Focus Pause ---');

  const store1 = new VisualPreferencesStore({ storagePath: prefsFile });
  check(
    '1.1 Default visual preferences start in vivid mode with animations enabled',
    store1.getVisualMode() === 'vivid' &&
      store1.isAnimationsEnabled() === true &&
      store1.isMotionActive(true) === true
  );

  store1.updatePreferences({ visualMode: 'minimal' });
  const storeReloadMinimal = new VisualPreferencesStore({ storagePath: prefsFile });
  check(
    '1.2 Persisted visualMode="minimal" survives store reload while preserving animationsEnabled=true',
    storeReloadMinimal.getVisualMode() === 'minimal' &&
      storeReloadMinimal.isAnimationsEnabled() === true
  );

  storeReloadMinimal.updatePreferences({ visualMode: 'vivid', animationsEnabled: false });
  const storeReloadStaticVivid = new VisualPreferencesStore({ storagePath: prefsFile });
  check(
    '1.3 Independent animationsEnabled=false persists across reload while visualMode stays "vivid"',
    storeReloadStaticVivid.getVisualMode() === 'vivid' &&
      storeReloadStaticVivid.isAnimationsEnabled() === false
  );

  check(
    '1.4 All 4 (visualMode x animationsEnabled) combinations + terminal focus evaluate deterministically',
    isDecorativeMotionActive({ visualMode: 'vivid', animationsEnabled: true }, true) === true &&
      isDecorativeMotionActive({ visualMode: 'vivid', animationsEnabled: true }, false) === false &&
      isDecorativeMotionActive({ visualMode: 'vivid', animationsEnabled: false }, true) === false &&
      isDecorativeMotionActive({ visualMode: 'minimal', animationsEnabled: true }, true) === false &&
      isDecorativeMotionActive({ visualMode: 'minimal', animationsEnabled: false }, true) === false
  );

  // Live TUI verification across all 4 combinations + focus/blur + Slash/Tab/Alt+T
  const ink = await loadInkPrimitives();
  const strayOut = new PassThrough();
  const kernel = new OrionCliKernel({
    projectRoot: tmpRoot,
    renderer: new OrionCliRenderer({ useColor: true, outputStream: strayOut })
  });
  kernel.visualPreferences.updatePreferences({
    visualMode: 'vivid',
    animationsEnabled: true,
    tipRotationIntervalMs: 1100
  });

  const router = new OrionCliCommandRouter(kernel);
  const { rawOut, rawIn } = createMockTtyStreams(120, 32);
  const frameStream = new CoordinatedFrameStream(rawOut);
  const filteredIn = new FilteredTtyInputStream(rawIn);

  const instance = ink.render(
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

  await wait(250);
  const snapVividAnim = frameStream.getScreenSnapshot().map(stripAnsi).join('\n');
  const orisRowsVividAnim = frameStream
    .getScreenSnapshot()
    .map(stripAnsi)
    .filter((l) => (l.match(/[▀▄█]/g) || []).length >= 8).length;

  // Test focus-out (\x1b[O) pausing decorative motion completely
  filteredIn.processRawChunk('\x1b[O');
  await wait(120);
  const framesAtBlurStart = frameStream.getTelemetry().framesWritten;
  await wait(950);
  const framesDuringBlur = frameStream.getTelemetry().framesWritten - framesAtBlurStart;

  // Test focus-in (\x1b[I) resuming decorative motion
  filteredIn.processRawChunk('\x1b[I');
  await wait(950);
  const framesAfterFocusResume =
    frameStream.getTelemetry().framesWritten - (framesAtBlurStart + framesDuringBlur);

  check(
    '1.5 Combo 1 (vivid + animations on) renders Oris + space field, pauses to 0 frames on blur (\\x1b[O), and resumes on focus (\\x1b[I)',
    orisRowsVividAnim >= 9 &&
      snapVividAnim.includes('Tip:') &&
      framesDuringBlur === 0 &&
      framesAfterFocusResume >= 1,
    `orisRows=${orisRowsVividAnim}, blurFrames=${framesDuringBlur}, resumedFrames=${framesAfterFocusResume}`
  );

  // Combo 2: vivid + animations off (static deep-space visuals, 0 decorative frames, tip rotation temporarily raised to 60s to isolate decorative timers)
  kernel.visualPreferences.updatePreferences({
    visualMode: 'vivid',
    animationsEnabled: false,
    tipRotationIntervalMs: 60_000
  });
  await wait(140);
  const orisRowsVividStatic = frameStream
    .getScreenSnapshot()
    .map(stripAnsi)
    .filter((l) => (l.match(/[▀▄█]/g) || []).length >= 8).length;
  const fStartVividStatic = frameStream.getTelemetry().framesWritten;
  await wait(1000);
  const fDeltaVividStatic = frameStream.getTelemetry().framesWritten - fStartVividStatic;

  check(
    '1.6 Combo 2 (vivid + animations off) preserves static Oris & deep-space presentation with 0 decorative animation frames',
    orisRowsVividStatic >= 9 && fDeltaVividStatic === 0,
    `orisRows=${orisRowsVividStatic}, idleFrames=${fDeltaVividStatic}`
  );

  // Combo 3: minimal + animations on
  kernel.visualPreferences.updatePreferences({
    visualMode: 'minimal',
    animationsEnabled: true,
    tipRotationIntervalMs: 60_000
  });
  await wait(140);
  const fStartMinAnim = frameStream.getTelemetry().framesWritten;
  await wait(900);
  const fDeltaMinAnim = frameStream.getTelemetry().framesWritten - fStartMinAnim;

  // Combo 4: minimal + animations off + functional update verification
  kernel.visualPreferences.updatePreferences({
    visualMode: 'minimal',
    animationsEnabled: false,
    tipRotationIntervalMs: 60_000
  });
  await wait(140);
  const fStartMinOff = frameStream.getTelemetry().framesWritten;
  await wait(900);
  const fDeltaMinOff = frameStream.getTelemetry().framesWritten - fStartMinOff;

  // Functional update while minimal + animations off: type characters and cycle mode with Tab
  filteredIn.processRawChunk('hello orion');
  await wait(80);
  const snapFunctionalTyped = frameStream.getScreenSnapshot().map(stripAnsi).join('\n');
  filteredIn.processRawChunk('\t'); // Tab cycles Build -> Plan while preserving typed text!
  await wait(80);
  const snapAfterTabMode = frameStream.getScreenSnapshot().map(stripAnsi).join('\n');
  // Clear typed characters + reset mode back to Build (Plan -> Chat -> Build)
  filteredIn.processRawChunk('\x15\t\t'); // Ctrl+U clears line, Tab x2 returns to BUILD MODE
  await wait(80);

  check(
    '1.7 Combos 3 & 4 (minimal + animations on/off) emit 0 idle decorative frames while functional typing & Tab mode-cycling work immediately',
    fDeltaMinAnim === 0 &&
      fDeltaMinOff === 0 &&
      snapFunctionalTyped.includes('hello orion') &&
      snapAfterTabMode.includes('hello orion') &&
      snapAfterTabMode.includes('[PLAN MODE]'),
    `minAnimFrames=${fDeltaMinAnim}, minOffFrames=${fDeltaMinOff}`
  );

  // Single command contract: `/animations on` and `/vivid on` synchronize with VisualPreferencesStore
  filteredIn.processRawChunk('/vivid on\r');
  await wait(120);
  filteredIn.processRawChunk('/animations on\r');
  await wait(120);
  const syncedPrefs = kernel.visualPreferences.getPreferences();
  check(
    '1.8 Slash commands "/vivid on" and "/animations on" share the single VisualPreferencesStore contract',
    syncedPrefs.visualMode === 'vivid' &&
      syncedPrefs.animationsEnabled === true &&
      kernel.commandRegistry.isVividMode() === true &&
      kernel.commandRegistry.isAnimationsEnabled() === true
  );

  // Return to Home screen via `/clear` to test live Home-screen tip rotation & Alt+T cycling
  filteredIn.processRawChunk('/clear\r');
  await wait(120);

  // ===========================================================================
  // PART 2: CURATED ROTATING TIPS ENGINE & HOME-SCREEN ROTATION
  // ===========================================================================
  console.log('\n--- Part 2: Curated ORION Tips Catalog, Weighted Selection, Manual & Auto Rotation ---');

  const categoriesPresent = new Set(ORION_CURATED_TIP_CATALOG.map((t) => t.category));
  const allBalancedHighlights = ORION_CURATED_TIP_CATALOG.every((tip) => {
    const opens = (tip.template.match(/\{highlight\}/g) || []).length;
    const closes = (tip.template.match(/\{\/highlight\}/g) || []).length;
    const segs = parseTipSegments(tip.template);
    const plain = renderTipPlainText(tip.template);
    return (
      opens >= 1 &&
      opens === closes &&
      segs.some((s) => s.highlight && s.text.length > 0) &&
      !plain.includes('{highlight}') &&
      !/mimo/i.test(plain)
    );
  });

  check(
    '2.1 Curated catalog has 40+ ORION-native tips across 11 categories with balanced {highlight} tokens and zero MiMo wording',
    ORION_CURATED_TIP_CATALOG.length >= 40 &&
      categoriesPresent.size >= 11 &&
      allBalancedHighlights,
    `count=${ORION_CURATED_TIP_CATALOG.length}, categories=${categoriesPresent.size}`
  );

  const restrictedPool = buildAvailableTipPool({
    platform: 'linux',
    desktopControlAvailable: false,
    implementedCommands: new Set(['/tip', '/vivid'])
  });
  check(
    '2.2 Capability & platform filtering excludes win32-only, desktop-control-only, and unimplemented-command tips',
    restrictedPool.length > 0 &&
      restrictedPool.every(
        (t) =>
          (!t.platforms || t.platforms.includes('linux')) &&
          !t.requiresDesktopControl &&
          (!t.requiresCommand || ['/tip', '/vivid'].includes(t.requiresCommand))
      ),
    `filteredCount=${restrictedPool.length}`
  );

  // Weighted selection distribution & zero consecutive duplicates
  let consecutiveDuplicates = 0;
  const priorityHits: Record<string, number> = { high: 0, normal: 0, low: 0 };
  let prevId: string | undefined;
  let lcg = 1234567;
  const deterministicRng = () => {
    lcg = (lcg * 48271) % 2147483647;
    return (lcg - 1) / 2147483646;
  };
  for (let i = 0; i < 600; i++) {
    const picked = pickWeightedNextTip(ORION_CURATED_TIP_CATALOG, prevId, deterministicRng);
    if (prevId && picked.id === prevId) consecutiveDuplicates++;
    priorityHits[picked.priority] = (priorityHits[picked.priority] || 0) + 1;
    prevId = picked.id;
  }
  const avgHighPerTip =
    priorityHits.high / ORION_CURATED_TIP_CATALOG.filter((t) => t.priority === 'high').length;
  const avgLowPerTip =
    priorityHits.low / ORION_CURATED_TIP_CATALOG.filter((t) => t.priority === 'low').length;

  check(
    '2.3 Weighted random tip selection enforces priority weights (high > low per tip) with 0 consecutive duplicates across 600 draws',
    consecutiveDuplicates === 0 &&
      TIP_PRIORITY_WEIGHTS.high > TIP_PRIORITY_WEIGHTS.low &&
      avgHighPerTip > avgLowPerTip * 1.5,
    `dups=${consecutiveDuplicates}, avgHigh=${avgHighPerTip.toFixed(1)}, avgLow=${avgLowPerTip.toFixed(1)}`
  );

  const manualA = ORION_CURATED_TIP_CATALOG[0];
  const manualB = cycleManualTip(ORION_CURATED_TIP_CATALOG, manualA.id, 'next');
  const manualBack = cycleManualTip(ORION_CURATED_TIP_CATALOG, manualB.id, 'prev');
  check(
    '2.4 Manual tip cycling advances deterministically without consecutive duplicates and supports reverse cycling',
    manualB.id !== manualA.id && manualBack.id === manualA.id
  );

  // Live Home-screen automatic rotation & Alt+T manual cycling
  kernel.visualPreferences.updatePreferences({ tipRotationIntervalMs: 1000 });
  await wait(120);
  const extractTipLine = () =>
    frameStream
      .getScreenSnapshot()
      .map(stripAnsi)
      .find((l) => l.includes('Tip:')) || '';

  const tipBeforeAltT = extractTipLine();
  filteredIn.processRawChunk('\x1bt'); // Alt+T manual tip cycle
  await wait(120);
  const tipAfterAltT = extractTipLine();
  await wait(1250); // Auto-rotation tick (~1000ms)
  const tipAfterAutoRotate = extractTipLine();

  check(
    '2.5 Live Home screen supports Alt+T manual tip cycling and automatic timed tip rotation',
    tipBeforeAltT.includes('Tip:') &&
      tipAfterAltT.includes('Tip:') &&
      tipAfterAltT !== tipBeforeAltT &&
      tipAfterAutoRotate.includes('Tip:') &&
      tipAfterAutoRotate !== tipAfterAltT
  );

  instance.unmount();
  filteredIn.dispose();
  frameStream.dispose();

  // ===========================================================================
  // PART 3: ORIS CANONICAL ARTWORK & 6-STAGE EASED CLICK JUMP ARC
  // ===========================================================================
  console.log('\n--- Part 3: Oris Canonical Artwork & 6-Stage Click Jump Arc ---');

  const mascotCtrl = new OrisMascotController();
  const orisHalfBlocks = renderOrisPixelHalfBlockLines(mascotCtrl.getState(), { noColor: false });
  const hitbox = computeOrisHitbox(120, 32);
  const observedJumpStages: string[] = [];
  const clickRes = mascotCtrl.handleMouseEvent(
    {
      buttonCode: 0,
      col: hitbox.centerCol,
      row: hitbox.centerRow,
      type: 'press',
      isLeftButton: true,
      raw: ''
    },
    hitbox,
    1000
  );
  if (clickRes.state.clickStage) {
    observedJumpStages.push(clickRes.state.clickStage);
  }
  for (let elapsed = 0; elapsed < 1400; elapsed += 70) {
    const st = mascotCtrl.step(70);
    if (st.clickStage && observedJumpStages[observedJumpStages.length - 1] !== st.clickStage) {
      observedJumpStages.push(st.clickStage);
    }
  }
  const finalMascotState = mascotCtrl.getState();

  check(
    '3.1 Canonical 18x18 Oris artwork renders to 9 half-block rows and executes full 6-stage eased jump arc back to idle',
    orisHalfBlocks.length === 9 &&
      observedJumpStages.includes('anticipation') &&
      observedJumpStages.includes('ascent') &&
      observedJumpStages.includes('apex') &&
      observedJumpStages.includes('descent') &&
      observedJumpStages.includes('landing') &&
      finalMascotState.clickStage === 'idle' &&
      finalMascotState.actionState === 'idle',
    `stages=${observedJumpStages.join('->')}`
  );

  // ===========================================================================
  // PART 4: PROVIDER-NEUTRAL ENGINE BRANDING & PATH PRIVACY
  // ===========================================================================
  console.log('\n--- Part 4: Provider-Neutral ORION Engine Identity & Personal Path Privacy ---');

  const idOllama = resolvePublicEngineIdentity('ollama', 'llama3.1:8b');
  const idCore = resolvePublicEngineIdentity('local-heuristic', 'heuristic-v1');
  const idCloud = resolvePublicEngineIdentity('openai', 'gpt-4o');
  const doctorLine = formatDeveloperEngineDiagnostics('ollama', 'llama3.1:8b');

  check(
    '4.1 Public engine labels use honest provider-neutral ORION names while /doctor exposes technical provider:model',
    idOllama.publicLabel === 'ORION Local' &&
      !idOllama.honestDisclosure.toLowerCase().includes('proprietary') &&
      idCore.publicLabel === 'ORION Core' &&
      idCloud.publicLabel === 'ORION Intelligence' &&
      doctorLine.includes('ORION Local') &&
      doctorLine.includes('ollama:llama3.1:8b')
  );

  const syntheticWinPath = 'C:\\Users\\demo_operator\\workspace\\secret-app\\src\\index.ts';
  const syntheticWs = 'C:\\Users\\demo_operator\\workspace\\secret-app';
  const logicalRel = formatLogicalPath(syntheticWinPath, syntheticWs);
  const sanitizedMsg = sanitizePersonalPathsInText(
    'Failed opening C:\\Users\\demo_operator\\Documents\\notes.txt and /Users/demo_operator/.config/app.json and /home/demo_operator/log.txt',
    syntheticWs
  );
  const cleanedMemoryLeak = sanitizeConversationalResponse(
    'ANALYSIS COMPLETE. SYSTEM STATUS: NOMINAL.\nEXTERNAL DATA ANALYSIS: [MEMORY_DATA id=mem_hikmah_001]\nUSER RESPONSE: **ORION responds** Memory update. Memory ID. Mem. Hello there! File at C:\\Users\\demo_operator\\Desktop\\test.txt (mem_998877) via ollama:llama3.1:8b.',
    { workspaceRoot: syntheticWs, redactProviderIds: true }
  );

  check(
    '4.2 Logical path formatting & text sanitization eliminate Windows/macOS/Linux usernames and C:\\Users\\<user> paths',
    logicalRel === '<workspace>/src/index.ts' &&
      !sanitizedMsg.includes('demo_operator') &&
      !sanitizedMsg.includes('C:\\Users') &&
      sanitizedMsg.includes('~/Documents/notes.txt')
  );

  check(
    '4.3 Conversational response sanitizer strips leaked memory headers, "**ORION responds** Memory update. Memory ID. Mem.", mem_* IDs, and raw model tags',
    !cleanedMemoryLeak.includes('ORION responds') &&
      !cleanedMemoryLeak.includes('Memory update') &&
      !cleanedMemoryLeak.includes('Memory ID') &&
      !cleanedMemoryLeak.includes('mem_hikmah_001') &&
      !cleanedMemoryLeak.includes('mem_998877') &&
      !cleanedMemoryLeak.includes('demo_operator') &&
      !cleanedMemoryLeak.includes('llama3.1:8b') &&
      cleanedMemoryLeak.includes('Hello there!')
  );

  // ===========================================================================
  // PART 5: 10-CASE CONVERSATIONAL QUALITY AUDIT (PHASE 5)
  // ===========================================================================
  console.log('\n--- Part 5: 10-Case Conversational Quality Audit ---');

  const orch = kernel.orchestrator;
  const hasForbiddenLeak = (text: string): boolean =>
    /^ORION Error:|\*\*ORION responds\*\*|Memory update\.|Memory ID|\bmem_[a-z0-9_]+|EXTERNAL DATA ANALYSIS|C:\\Users\\/i.test(
      text
    );
  const hasHardwareSpecDump = (text: string): boolean =>
    /\b(?:Total Memory|Free Memory|CPU Cores|128\s*GB|i7-12850HX|RTX\s*A5500)\b/i.test(text);

  // Case 1: Simple greeting ("Hi")
  const c1 = await orch.processCommand('Hi', 'TEXT');
  check(
    '5.1 Case 1 ("Hi"): Warm concise greeting with 0 tool calls, 0 system specs, and 0 memory/path leaks',
    c1.toolCallsExecuted.length === 0 &&
      c1.response.length > 4 &&
      c1.response.length < 280 &&
      !hasHardwareSpecDump(c1.response) &&
      !hasForbiddenLeak(c1.response),
    `reply="${c1.response}"`
  );

  // Case 2: Time-of-day greeting ("Good morning") — must NOT hallucinate `show_desktop`!
  const c2 = await orch.processCommand('Good morning', 'TEXT');
  check(
    '5.2 Case 2 ("Good morning"): Time-matched greeting in Build mode with 0 hallucinated desktop/tool calls',
    c2.toolCallsExecuted.length === 0 &&
      c2.response.length > 4 &&
      c2.response.length < 280 &&
      !hasHardwareSpecDump(c2.response) &&
      !hasForbiddenLeak(c2.response),
    `reply="${c2.response}"`
  );

  // Case 3: Friendly follow-up ("How are you doing today?")
  const c3 = await orch.processCommand('How are you doing today?', 'TEXT');
  check(
    '5.3 Case 3 ("How are you doing today?"): Natural friendly reply with 0 tool calls or leaks',
    c3.toolCallsExecuted.length === 0 &&
      c3.response.length > 8 &&
      !hasHardwareSpecDump(c3.response) &&
      !hasForbiddenLeak(c3.response)
  );

  // Case 4: Context retention across turns ("Remember our release codename is Project Vega" -> recall)
  await orch.processCommand('Remember that our release codename is Project Vega.', 'TEXT');
  const c4 = await orch.processCommand('What is our release codename?', 'TEXT');
  check(
    '5.4 Case 4 (Multi-turn context retention): Recalls stored session context without leaking raw mem_* IDs',
    /Project Vega/i.test(c4.response) && !hasForbiddenLeak(c4.response),
    `reply="${c4.response.slice(0, 120)}"`
  );

  // Case 5: Ambiguous task request after casual greeting -> asks concise clarifying question
  const c5 = await orch.processCommand('Update the file for me', 'TEXT');
  check(
    '5.5 Case 5 (Ambiguous task after greeting): Asks a clear clarifying question rather than guessing blindly',
    c5.toolCallsExecuted.length === 0 &&
      /\?|which\s+file|path|clarify|specify/i.test(c5.response) &&
      !hasForbiddenLeak(c5.response)
  );

  // Case 6: Explicit system specification request ("Show my system specifications.")
  const c6Class = classifyConversationalTurn('Show my system specifications.');
  const c6 = await orch.processCommand('Show my system specifications.', 'TEXT');
  check(
    '5.6 Case 6 ("Show my system specifications."): Invokes system.get_info ONLY on explicit request and returns verified specs without personal paths',
    isExplicitSystemSpecQuery('Show my system specifications.') === true &&
      isExplicitSystemSpecQuery('Hi, good morning!') === false &&
      c6Class.isExplicitSystemSpecRequest === true &&
      c6.toolCallsExecuted.some((tc) => tc.toolId.startsWith('system.get_')) &&
      !hasForbiddenLeak(c6.response)
  );

  // Case 7: Error recovery conversation (missing file read -> honest failure without personal path leak)
  const missingTarget = path.join(tmpRoot, 'does_not_exist_12345.txt');
  const c7 = await orch.processCommand(`Read file ${missingTarget}`, 'TEXT');
  check(
    '5.7 Case 7 (Error recovery conversation): Reports missing file honestly with 0 C:\\Users\\<username> leaks',
    (/not found|failed|does not exist|error/i.test(c7.response) || c7.outcomeStatus === 'failed') &&
      !hasForbiddenLeak(c7.response)
  );

  // Case 8: Cancelled action conversation (pre-aborted signal)
  const abortCtrl = new AbortController();
  abortCtrl.abort();
  const c8 = await orch.processCommand('Show my system specifications.', 'TEXT', {
    signal: abortCtrl.signal
  });
  check(
    '5.8 Case 8 (Cancelled action conversation): Cleanly reports cancelled outcome without crashing or leaking paths',
    c8.outcomeStatus === 'cancelled' && !hasForbiddenLeak(c8.response)
  );

  // Case 9: Unsupported / unsafe credential boundary request -> clear refusal
  const unsafeEnvPath = path.join(tmpRoot, '.env');
  const c9 = await orch.processCommand(`Read file ${unsafeEnvPath}`, 'TEXT');
  check(
    '5.9 Case 9 (Unsafe/restricted request): Refuses restricted .env credential boundary politely and honestly',
    (/restricted|prohibited|security|blocked|failed|refused/i.test(c9.response) ||
      c9.outcomeStatus === 'failed') &&
      !hasForbiddenLeak(c9.response)
  );

  // Case 10: Casual appreciative conversation ("Thanks!")
  const c10 = await orch.processCommand('Thanks!', 'TEXT');
  check(
    '5.10 Case 10 ("Thanks!"): Warm conversational closure with 0 unnecessary tool calls or metadata leaks',
    c10.toolCallsExecuted.length === 0 &&
      c10.response.length > 4 &&
      !hasHardwareSpecDump(c10.response) &&
      !hasForbiddenLeak(c10.response),
    `reply="${c10.response}"`
  );

  await kernel.shutdown();
  try {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  } catch {}

  console.log('\n================================================================================');
  console.log(`ORION VISUAL, TIPS, IDENTITY & CONVERSATION SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('================================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSuite()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Unhandled error in OrionVisualModesTipsAndIdentity.test.ts:', err);
    process.exit(1);
  });
