import fs from 'fs';
import os from 'os';
import path from 'path';
import React from 'react';
import { PassThrough } from 'stream';
import { loadInkPrimitives } from '../../../tui/inkLoader';
import {
  AlternateScreenGuard,
  OrionTuiView,
  computeCoordinatedLayout
} from '../../../tui/OrionTuiApp';
import {
  CoordinatedFrameStream,
  FilteredTtyInputStream
} from '../../../tui/CoordinatedFrameWriter';
import {
  COMPACT_CAPSULE_HEIGHT_ROWS,
  FULL_HERO_CAPSULE_HEIGHT_ROWS,
  computePromptViewport
} from '../../../tui/Capsule';
import {
  MascotInteractive,
  ORIS_CANONICAL_PIXEL_GRID_18X18,
  ORIS_MASCOT_STAGE_ROWS,
  OrisActionState,
  OrisMascotController,
  OrisMascotState,
  SGR_MOUSE_DISABLE_SEQ,
  SGR_MOUSE_ENABLE_SEQ,
  renderOrisPixelHalfBlockLines
} from '../../../tui/MascotInteractive';
import {
  Starfield,
  generateDeterministicStars,
  projectStarfieldAtTick
} from '../../../tui/Starfield';
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

function stripAnsi(s: string): string {
  return (s || '').replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '');
}

function everyAnsiCsiTokenSafeForInkTokenizer(raw: string): boolean {
  const tokens = raw.match(/\x1b\[[0-9;?]*[a-zA-Z]/g) || [];
  return tokens.every((tok) => tok.length <= 19);
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

/**
 * Simulates a stateful Windows Terminal / ConPTY 2D character cell grid fed in arbitrary pipe chunk sizes
 * (e.g., 512-byte ConPTY pipe slices that split lines & CSI sequences mid-flight) to verify in-place cell
 * overwrites NEVER blank the central card frame mid-write.
 */
class VirtualVtViewport {
  private readonly backGrid: string[][];
  private presentedGrid: string[][];
  private readonly cols: number;
  private readonly rowCount: number;
  private cursorRow = 0;
  private cursorCol = 0;
  private pendingEsc = '';
  private inSyncUpdate = false;
  private hasPresentedAtLeastOnce = false;

  constructor(rowCount: number, cols: number = 140) {
    this.rowCount = rowCount;
    this.cols = cols;
    this.backGrid = Array.from({ length: rowCount }, () =>
      Array.from({ length: cols }, () => ' ')
    );
    this.presentedGrid = Array.from({ length: rowCount }, () =>
      Array.from({ length: cols }, () => ' ')
    );
  }

  private commitPresented(): void {
    this.presentedGrid = this.backGrid.map((r) => [...r]);
    this.hasPresentedAtLeastOnce = true;
  }

  public applyChunk(rawChunk: string): void {
    const data = this.pendingEsc + rawChunk;
    this.pendingEsc = '';

    let i = 0;
    while (i < data.length) {
      const ch = data[i];
      if (ch === '\x1b') {
        if (i + 1 >= data.length) {
          this.pendingEsc = data.slice(i);
          break;
        }
        if (data[i + 1] === '[') {
          const rest = data.slice(i);
          const m = rest.match(/^\x1b\[([0-9;?]*)([a-zA-Z])/);
          if (!m) {
            // Incomplete CSI sequence split across 512-byte ConPTY pipe boundary!
            this.pendingEsc = rest;
            break;
          }
          const params = m[1];
          const finalChar = m[2];
          if (params === '?2026' && finalChar === 'h') {
            this.inSyncUpdate = true;
          } else if (params === '?2026' && finalChar === 'l') {
            this.inSyncUpdate = false;
            this.commitPresented();
          } else if (finalChar === 'J' && (params === '2' || params === '3')) {
            for (let r = 0; r < this.rowCount; r++) {
              this.backGrid[r].fill(' ');
            }
          } else if (finalChar === 'H' || finalChar === 'f') {
            const parts = params.split(';');
            this.cursorRow = Math.max(
              0,
              Math.min(this.rowCount - 1, (parseInt(parts[0] || '1', 10) || 1) - 1)
            );
            this.cursorCol = Math.max(
              0,
              Math.min(this.cols - 1, (parseInt(parts[1] || '1', 10) || 1) - 1)
            );
          } else if (finalChar === 'K') {
            if (params === '2') {
              this.backGrid[this.cursorRow].fill(' ');
            } else {
              for (let c = this.cursorCol; c < this.cols; c++) {
                this.backGrid[this.cursorRow][c] = ' ';
              }
            }
          }
          i += m[0].length;
          continue;
        }
        i += 2;
        continue;
      }

      if (ch === '\r') {
        this.cursorCol = 0;
      } else if (ch === '\n') {
        this.cursorRow = Math.min(this.rowCount - 1, this.cursorRow + 1);
        this.cursorCol = 0;
      } else if (this.cursorRow < this.rowCount && this.cursorCol < this.cols) {
        this.backGrid[this.cursorRow][this.cursorCol] = ch;
        this.cursorCol++;
      }
      i++;
    }

    if (!this.inSyncUpdate) {
      this.commitPresented();
    }
  }

  private static gridHasCard(grid: string[][], innerDashWidths: number[]): boolean {
    const rowStrings = grid.map((r) => r.join(''));
    return innerDashWidths.some((w) => {
      const top = `╭${'─'.repeat(w)}╮`;
      const bot = `╰${'─'.repeat(w)}╯`;
      return rowStrings.some((r) => r.includes(top)) && rowStrings.some((r) => r.includes(bot));
    });
  }

  public hasIntactUnbufferedCard(expectedInnerDashWidth: number): boolean {
    return VirtualVtViewport.gridHasCard(this.backGrid, [expectedInnerDashWidth]);
  }

  public hasIntactPresentedCard(allowedDashWidths: number[] = [80, 106]): boolean {
    if (!this.hasPresentedAtLeastOnce) return true;
    return VirtualVtViewport.gridHasCard(this.presentedGrid, allowedDashWidths);
  }
}

async function runOrionTuiFlickerAndSpriteIntegritySuite(): Promise<void> {
  process.env.FORCE_COLOR = '3';
  console.log('================================================================================');
  console.log('ORION TUI FLICKER, SPRITE INTEGRITY & COORDINATED RENDERER REGRESSION SUITE');
  console.log('================================================================================\n');

  const tmpWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), 'orion-tui-flicker-test-'));
  ProcessSupervisor.getInstance().resetEstop('TUI flicker & sprite regression suite');

  const ink = await loadInkPrimitives();
  const strayRendererBytes: string[] = [];
  const strayRendererStream = new PassThrough();
  strayRendererStream.on('data', (c: Buffer) => strayRendererBytes.push(c.toString('utf8')));

  const kernel = new OrionCliKernel({
    projectRoot: tmpWorkspace,
    renderer: new OrionCliRenderer({ useColor: true, outputStream: strayRendererStream })
  });
  const router = new OrionCliCommandRouter(kernel);

  // ===========================================================================
  // SCENARIO 5: SPRITE INTEGRITY ACROSS ALL 13 STATES, TRANSPARENCY & <=19B ANSI
  // ===========================================================================
  console.log('--- Scenario 5: Oris 18x18 Sprite Integrity, Transparency & ANSI Token Safety ---');

  const allActionStates: OrisActionState[] = [
    'idle',
    'blinking',
    'hopping',
    'landing',
    'jumping',
    'fallen',
    'tracking',
    'thinking',
    'working',
    'awaiting_approval',
    'success',
    'cancelled',
    'error'
  ];

  let allStatesValid = true;
  let allAnsiTokensUnder19Bytes = true;
  let usesGenuineTransparentBg = true;
  let distinctEyeVariants = new Set<string>();

  for (const actionState of allActionStates) {
    for (const tiltDirection of [-1, 0, 1] as const) {
      for (const blinkLong of [false, true]) {
        const sampleState: OrisMascotState = {
          x: tiltDirection,
          y: actionState === 'jumping' ? -3 : actionState === 'hopping' ? -1 : 0,
          actionState,
          eyeOffsetX: tiltDirection,
          tiltDirection,
          blinkLong,
          particles: actionState === 'jumping' ? [{ glyph: '✦', dx: -2, dy: -2 }] : [],
          clickCount: 0,
          lastClickTimestamp: 0
        };

        const colorLines = renderOrisPixelHalfBlockLines(sampleState, { noColor: false });
        const monoLines = renderOrisPixelHalfBlockLines(sampleState, { noColor: true });

        if (colorLines.length !== 9 || monoLines.length !== 9) {
          allStatesValid = false;
        }

        for (let r = 0; r < 9; r++) {
          const strippedColor = stripAnsi(colorLines[r]);
          if (strippedColor.length !== 20 || monoLines[r].length !== 20) {
            allStatesValid = false;
          }
          if (!everyAnsiCsiTokenSafeForInkTokenizer(colorLines[r])) {
            allAnsiTokensUnder19Bytes = false;
          }
          if (monoLines[r].includes('\x1b[')) {
            allStatesValid = false;
          }
        }

        // Top-left pixel (0,0) in ORIS_CANONICAL_PIXEL_GRID_18X18 is transparent (`null`),
        // so default background `\x1b[49m` must be used instead of opaque `#070d19` (`48;2;7;13;25`).
        if (!colorLines[0].includes('\x1b[49m') || colorLines[0].includes('48;2;7;13;25')) {
          usesGenuineTransparentBg = false;
        }

        if (tiltDirection === 0 && !blinkLong) {
          distinctEyeVariants.add(colorLines.join('\n'));
        }
      }
    }
  }

  check(
    '5.1 All 13 OrisActionStates x 3 tilt directions render exact 9 rows x 20 visible cells in color & --no-color',
    allStatesValid && ORIS_CANONICAL_PIXEL_GRID_18X18.length === 18 && distinctEyeVariants.size >= 6,
    `states=${allActionStates.length}, distinctSprites=${distinctEyeVariants.size}`
  );

  check(
    '5.2 Transparent sprite cells use genuine terminal default background (\\x1b[49m) instead of fake opaque box (#070d19)',
    usesGenuineTransparentBg,
    'verified \\x1b[49m transparency & zero 48;2;7;13;25 bleed'
  );

  // Verify Starfield ANSI tokens are also <= 19 bytes across 30 projected ticks
  const baseStars = generateDeterministicStars(120, 6, 32, 0);
  let starAnsiSafe = true;
  for (let tick = 0; tick < 30; tick++) {
    const { rawOut } = createMockTtyStreams(120, 10);
    const chunks: string[] = [];
    rawOut.on('data', (c: Buffer) => chunks.push(c.toString('utf8')));
    const proj = projectStarfieldAtTick(baseStars, 120, 6, tick, 160, true, 0);
    if (proj.stars.length !== baseStars.length) starAnsiSafe = false;
    const inst = ink.render(
      React.createElement(Starfield, {
        ink,
        columns: 120,
        rows: 6,
        vividMode: true,
        externalTick: tick,
        deltaMs: 160,
        seedOffset: 0
      }),
      { stdout: rawOut, exitOnCtrlC: false, patchConsole: false }
    );
    inst.unmount();
    if (!chunks.every(everyAnsiCsiTokenSafeForInkTokenizer)) {
      starAnsiSafe = false;
    }
  }

  check(
    '5.3 Every CSI escape token in Oris sprite & Starfield is <= 19 bytes (immune to @alcalzone/ansi-tokenize 19-byte slice bug)',
    allAnsiTokensUnder19Bytes && starAnsiSafe
  );

  // Verify MascotInteractive constant 11-row stage height across rest, hop, jump+particles, and caption states
  const stageHeights = new Set<number>();
  const stageCtrlRef: { current: OrisMascotController | null } = {
    current: new OrisMascotController()
  };
  for (const lifecycle of ['idle', 'thinking', 'working', 'awaiting_approval', 'success', 'error'] as const) {
    const { rawOut } = createMockTtyStreams(80, 20);
    const frameStream = new CoordinatedFrameStream(rawOut);
    if (lifecycle === 'working') {
      stageCtrlRef.current!.step(250); // pulse with particles & lift
    }
    const inst = ink.render(
      React.createElement(MascotInteractive, {
        ink,
        columns: 78,
        rows: 20,
        vividMode: true,
        taskLifecycle: lifecycle,
        statusCaption: lifecycle === 'working' ? 'ORIS • WORKING' : undefined,
        controllerRef: stageCtrlRef,
        parentDriven: true
      }),
      { stdout: frameStream as unknown as NodeJS.WriteStream, exitOnCtrlC: false, patchConsole: false }
    );
    stageHeights.add(frameStream.getScreenSnapshot().length);
    inst.unmount();
    frameStream.dispose();
  }

  check(
    '5.4 MascotInteractive maintains strictly constant 11-row stage height across rest, lift, particles & status captions',
    stageHeights.size === 1 && stageHeights.has(ORIS_MASCOT_STAGE_ROWS),
    `observedHeights=${JSON.stringify([...stageHeights])}`
  );

  // ===========================================================================
  // SCENARIOS 1, 2, 3, 4 & 9: CONTINUOUS ANIMATION, TYPING, SLASH PALETTE, CURSOR & CONPTY PIPES
  // ===========================================================================
  console.log('\n--- Scenarios 1, 2, 3, 4 & 9: Live Coordinated TUI Animation, Typing, Slash Palette & ConPTY ---');

  const { rawOut, rawIn } = createMockTtyStreams(120, 30);
  const wirePayloads: string[] = [];
  const snapshots: Array<readonly string[]> = [];
  const frameStream = new CoordinatedFrameStream(rawOut, { useSynchronizedOutput: true });
  const filteredIn = new FilteredTtyInputStream(rawIn);

  const vtViewport = new VirtualVtViewport(30);
  let blankFrameObservedOnChunkBoundary = false;
  let checkStationaryUnbufferedChunks = true;
  let checkSynchronizedPresentedChunks = true;

  rawOut.on('data', (chunk: Buffer) => {
    const str = chunk.toString('utf8');
    wirePayloads.push(str);
    snapshots.push(frameStream.getScreenSnapshot());

    if (checkSynchronizedPresentedChunks) {
      // Simulate Windows ConPTY 512-byte chunked pipe reads across both unbuffered (conhost)
      // and DEC Mode 2026 synchronized front-buffer (Windows Terminal) viewports
      for (let offset = 0; offset < str.length; offset += 512) {
        vtViewport.applyChunk(str.slice(offset, offset + 512));
        if (!vtViewport.hasIntactPresentedCard([80, 106])) {
          blankFrameObservedOnChunkBoundary = true;
        }
        if (
          checkStationaryUnbufferedChunks &&
          wirePayloads.length > 1 &&
          !vtViewport.hasIntactUnbufferedCard(80)
        ) {
          blankFrameObservedOnChunkBoundary = true;
        }
      }
    }
  });

  let exitRequestedCode: number | null = null;
  const tuiInstance = ink.render(
    React.createElement(OrionTuiView, {
      ink,
      kernel,
      router,
      onRequestExit: (code) => {
        exitRequestedCode = code;
      },
      registerMouseHandler: (handler) => filteredIn.setMouseEventHandler(handler)
    }),
    {
      stdout: frameStream as unknown as NodeJS.WriteStream,
      stdin: filteredIn as unknown as NodeJS.ReadStream,
      exitOnCtrlC: false,
      patchConsole: false
    }
  );

  // Scenario 1: Let continuous idle animation run across multiple frames (~1.0s)
  await wait(950);
  const idleFramesCount = snapshots.length;

  // Scenario 2: Rapidly type characters interleaved with SGR mouse motion & focus events while animation runs
  const telemetryBeforeTyping = frameStream.getTelemetry();
  const rapidText = 'hello world';
  for (const ch of rapidText) {
    filteredIn.processRawChunk(ch);
    filteredIn.processRawChunk('\x1b[<35;60;11M\x1b[I'); // interleaved mouse move + focus-in
    await wait(25);
  }
  await wait(80);
  const telemetryAfterTyping = frameStream.getTelemetry();
  const snapAfterTyping = frameStream.getScreenSnapshot().map(stripAnsi).join('\n');

  const typingWrites = Math.max(1, telemetryAfterTyping.framesWritten - telemetryBeforeTyping.framesWritten);
  const avgLinesPerTypingFrame =
    (telemetryAfterTyping.linesUpdated - telemetryBeforeTyping.linesUpdated) / typingWrites;

  check(
    '2.1 Rapid typing while animation & SGR mouse motion run preserves exact text with line-diffed partial updates',
    snapAfterTyping.includes('> hello world█') &&
      !snapAfterTyping.includes('[<35') &&
      avgLinesPerTypingFrame < 8,
    `avgLinesUpdatedPerFrame=${avgLinesPerTypingFrame.toFixed(2)} (vs 29 full-screen rows)`
  );

  // Scenario 4: Cursor movement (LeftArrow x 5 -> insert "ORION " -> Backspace -> Ctrl+U clear -> empty Backspace)
  for (let i = 0; i < 5; i++) {
    filteredIn.processRawChunk('\x1b[D'); // LeftArrow
  }
  await wait(40);
  for (const ch of 'ORION ') {
    filteredIn.processRawChunk(ch);
  }
  await wait(360); // Let 2 animation ticks pass to verify typed text persists across background star ticks!
  const snapMidCursorEdit = frameStream.getScreenSnapshot().map(stripAnsi).join('\n');

  // Clear via Ctrl+U and press Backspace 3x on empty input
  filteredIn.processRawChunk('\x15'); // Ctrl+U
  await wait(40);
  filteredIn.processRawChunk('\x7f\x7f\x7f'); // Backspace x 3 on empty prompt
  await wait(60);
  const snapAfterClear = frameStream.getScreenSnapshot().map(stripAnsi).join('\n');

  check(
    '4.1 Mid-string cursor insertion, persistence across animation ticks, Ctrl+U clear & empty Backspace work cleanly',
    snapMidCursorEdit.includes('> hello ORION world') &&
      snapAfterClear.includes('> █') &&
      !snapAfterClear.includes('ORION world')
  );

  // Scenario 3: Open SlashMenu by typing `/`, verify BOTH SlashMenu AND full 9-row Oris coexist at 120x30!
  // (Opening SlashMenu transitions Capsule vertically from Row 5 to Row 8 under DEC Mode 2026 synchronization.)
  checkStationaryUnbufferedChunks = false;
  filteredIn.processRawChunk('/');
  await wait(80);
  const snapSlashOpen120 = frameStream.getScreenSnapshot().map(stripAnsi);
  const slashMenuVisibleAt120 = snapSlashOpen120.some((l) =>
    l.includes('ORION Slash Commands')
  );
  const orisAndTitleRowsAt120 = snapSlashOpen120.filter(
    (l) => (l.match(/[▀▄█]/g) || []).length >= 8
  ).length;

  // Filter to `/doc`, press Esc to dismiss without losing `/doc` or `[BUILD MODE]`
  filteredIn.processRawChunk('doc');
  await wait(60);
  const snapSlashFiltered = frameStream.getScreenSnapshot().map(stripAnsi).join('\n');

  filteredIn.processRawChunk('\x1b'); // Esc dismisses SlashMenu
  await wait(60);
  const snapSlashDismissed = frameStream.getScreenSnapshot().map(stripAnsi).join('\n');

  // Clear `/doc` via Backspace x 4, verify hero idle clean, then reopen `/` -> `/vivid` -> Enter to execute real handler!
  filteredIn.processRawChunk('\x7f\x7f\x7f\x7f');
  await wait(60);
  const vividBefore = kernel.commandRegistry.isVividMode();
  filteredIn.processRawChunk('/vivid');
  await wait(60);
  const snapSlashReopened = frameStream.getScreenSnapshot().map(stripAnsi).join('\n');
  filteredIn.processRawChunk('\r'); // Enter submits `/vivid` to real CommandRegistry handler!
  await wait(120);
  const vividAfter = kernel.commandRegistry.isVividMode();
  const snapAfterVividExec = frameStream.getScreenSnapshot().map(stripAnsi).join('\n');

  // Toggle `/vivid` back on and `/clear` feed so hero idle resumes cleanly
  filteredIn.processRawChunk('/vivid\r');
  await wait(90);
  filteredIn.processRawChunk('/clear\r');
  await wait(90);

  check(
    '3.1 Typing "/" at 120x30 opens SlashMenu cleanly above Capsule while preserving all 9 Oris sprite rows & outer borders',
    slashMenuVisibleAt120 && orisAndTitleRowsAt120 === 11,
    `orisPlusTitleRows=${orisAndTitleRowsAt120}`
  );

  check(
    '3.2 Filtering "/doc", Esc dismissal (preserving input & BUILD MODE), reopening, and executing real "/vivid" handler succeed',
    snapSlashFiltered.includes('/doctor') &&
      !snapSlashDismissed.includes('ORION Slash Commands') &&
      snapSlashDismissed.includes('> /doc█') &&
      snapSlashDismissed.includes('[BUILD MODE]') &&
      snapSlashReopened.includes('/vivid') &&
      vividBefore !== vividAfter &&
      snapAfterVividExec.includes('/vivid')
  );

  // Inspect ALL collected hero frames so far for Scenario 1 & Scenario 9 invariants!
  const clear2JCount = wirePayloads.filter((p) => p.includes('\x1b[2J')).length;
  const eraseLinesCount = wirePayloads.filter((p) => p.includes('\x1b[2K\x1b[1A')).length;
  const allSynchronized = wirePayloads.every(
    (p) => p.startsWith('\x1b[?2026h') && p.endsWith('\x1b[?2026l')
  );
  const malformedCsiCount = wirePayloads.filter((p) =>
    Boolean(p.match(/\x1b\[[0-9;?]+[^0-9;?mHfJKABCDsuhl]/))
  ).length;

  let tornBorderFrames = 0;
  let missingCardBorderFrames = 0;
  for (const snap of snapshots) {
    const clean = snap.map(stripAnsi);
    // Hero frames at 120 cols have 82-col card (`╭` + 80 `─` + `╮`) or compact 108-col card (`╭` + 106 `─` + `╮`)
    const has82Top = clean.some((l) => l.includes(`╭${'─'.repeat(80)}╮`));
    const has82Bot = clean.some((l) => l.includes(`╰${'─'.repeat(80)}╯`));
    const has108Top = clean.some((l) => l.includes(`╭${'─'.repeat(106)}╮`));
    const has108Bot = clean.some((l) => l.includes(`╰${'─'.repeat(106)}╯`));
    if (!((has82Top && has82Bot) || (has108Top && has108Bot))) {
      missingCardBorderFrames++;
    }
    if (has82Top && !clean.some((l) => l.includes('ORION Slash Commands'))) {
      const leftBorderCols = new Set<number>();
      for (const l of clean) {
        const idx = l.indexOf('│');
        if (idx > 2) leftBorderCols.add(idx);
      }
      if (leftBorderCols.size > 1) tornBorderFrames++;
    }
  }

  check(
    '1.1 Continuous animation frames have 0 \\x1b[2J clear blasts, 0 \\x1b[2K pre-clears, 0 missing borders, 0 torn borders & 0 broken CSI escapes',
    idleFramesCount >= 4 &&
      clear2JCount === 0 &&
      eraseLinesCount === 0 &&
      allSynchronized &&
      malformedCsiCount === 0 &&
      missingCardBorderFrames === 0 &&
      tornBorderFrames === 0,
    `frames=${snapshots.length}, idle=${idleFramesCount}, clear2J=${clear2JCount}, erase=${eraseLinesCount}, sync=${allSynchronized}, missingBorders=${missingCardBorderFrames}, torn=${tornBorderFrames}, malformed=${malformedCsiCount}`
  );

  // Test OrionCliRenderer stdout isolation while TUI is mounted
  const strayBefore = strayRendererBytes.length;
  kernel.renderer.write('raw-direct-write-attempt');
  kernel.renderer.writeLine('raw-line-attempt');
  kernel.renderer.startStream('ollama', 'llama3.1:8b');
  kernel.renderer.writeStreamToken('streamed-token-inside-tui');
  kernel.renderer.endStream(42);
  await wait(80);
  const strayAfter = strayRendererBytes.length;
  const snapAfterStreamIntercept = frameStream.getScreenSnapshot().map(stripAnsi).join('\n');

  // Clear intercepted feed items back to hero idle for Scenario 6 resize verification
  filteredIn.processRawChunk('/clear\r');
  await wait(80);
  checkSynchronizedPresentedChunks = false;

  check(
    '9.1 ConPTY 512-byte chunked pipe simulation observes 0 blank/half-wiped frames & OrionCliRenderer direct stdout writes are 100% intercepted',
    !blankFrameObservedOnChunkBoundary &&
      strayBefore === strayAfter &&
      snapAfterStreamIntercept.includes('streamed-token-inside-tui'),
    `blankChunk=${blankFrameObservedOnChunkBoundary}, strayWrites=${strayAfter - strayBefore}, hasStreamTok=${snapAfterStreamIntercept.includes('streamed-token-inside-tui')}`
  );

  // ===========================================================================
  // SCENARIO 6: LIVE TERMINAL RESIZE & CONTROLLED COMPACT LAYOUT FALLBACK
  // ===========================================================================
  console.log('\n--- Scenario 6: Terminal Resize Handling & Narrow/Compact Dimension Invariants ---');

  const resizeMatrix: Array<[number, number, boolean]> = [
    [140, 40, false],
    [100, 28, false],
    [80, 24, false],
    [54, 18, true], // small terminal -> controlled compactHeader
    [120, 30, false] // back to large -> restores full 9-row Oris!
  ];

  let resizeAllClean = true;
  const resizeDebug: string[] = [];
  for (const [cols, rows, expectCompact] of resizeMatrix) {
    rawOut.columns = cols;
    rawOut.rows = rows;
    rawOut.emit('resize');
    await wait(90);

    const budget = computeCoordinatedLayout({
      columns: cols,
      rows,
      hasActivityFeed: false,
      isSlashMenuVisible: false,
      matchedSlashCount: 0
    });
    const snap = frameStream.getScreenSnapshot();
    const clean = snap.map(stripAnsi);
    const maxLineCols = Math.max(...clean.map((l) => l.length));
    const hasOrisBlocks = clean.filter((l) => (l.match(/[▀▄█]/g) || []).length >= 8).length === 11;

    if (
      budget.compactHeader !== expectCompact ||
      snap.length > rows - 1 ||
      maxLineCols > cols ||
      (!expectCompact && !hasOrisBlocks) ||
      (expectCompact && hasOrisBlocks)
    ) {
      resizeAllClean = false;
      resizeDebug.push(`${cols}x${rows}:compact=${budget.compactHeader}/${expectCompact},lines=${snap.length},maxCols=${maxLineCols},oris=${hasOrisBlocks}`);
    }
  }

  check(
    '6.1 Live terminal resize (140x40 -> 100x28 -> 80x24 -> 54x18 compact -> 120x30 full Oris) adapts cleanly with zero overflow or clipping',
    resizeAllClean &&
      FULL_HERO_CAPSULE_HEIGHT_ROWS === 21 &&
      COMPACT_CAPSULE_HEIGHT_ROWS === 7 &&
      computePromptViewport('a'.repeat(160), 160, 28).beforeCursor.length <= 27,
    resizeDebug.join('; ') || 'all 5 dimensions verified'
  );

  // ===========================================================================
  // SCENARIO 7: ANIMATION CANCELLATION & CLEAN EXIT RESTORATION
  // ===========================================================================
  console.log('\n--- Scenario 7: Animation Cancellation & Clean Terminal Restoration on Exit ---');

  filteredIn.processRawChunk('/exit\r');
  await wait(100);
  tuiInstance.unmount();
  filteredIn.dispose();
  frameStream.dispose();

  const writesCountAtExit = wirePayloads.length;
  await wait(350); // wait >2 scheduler intervals to verify zero post-exit timer writes
  const writesCountAfterWait = wirePayloads.length;

  const guardWrites: string[] = [];
  const guardStream = {
    isTTY: true,
    write: (s: string) => {
      guardWrites.push(s);
      return true;
    }
  } as unknown as NodeJS.WriteStream;
  const guard = new AlternateScreenGuard(guardStream);
  guard.enter();
  guard.leave();

  check(
    '7.1 "/exit" requests clean exit (code 0), stops all animation timers, and AlternateScreenGuard restores ?2026l, mouse, cursor (?25h) & ?1049l',
    exitRequestedCode === 0 &&
      writesCountAfterWait === writesCountAtExit &&
      guardWrites[0].includes('\x1b[?1049h') &&
      guardWrites[0].includes(SGR_MOUSE_ENABLE_SEQ) &&
      guardWrites[1].includes('\x1b[?2026l') &&
      guardWrites[1].includes(SGR_MOUSE_DISABLE_SEQ) &&
      guardWrites[1].includes('\x1b[?25h') &&
      guardWrites[1].includes('\x1b[?1049l') &&
      !guard.isActive(),
    `exitCode=${exitRequestedCode}, postExitWrites=${writesCountAfterWait - writesCountAtExit}`
  );

  // ===========================================================================
  // SCENARIO 8: IDENTICAL-FRAME DEDUPLICATION & REPEATED MOUNT/UNMOUNT LEAK CHECK
  // ===========================================================================
  console.log('\n--- Scenario 8: Identical-Frame Deduplication & Zero Listener/Timer Leak Cycles ---');

  const { rawOut: dedupOut, rawIn: sharedIn } = createMockTtyStreams(100, 28);
  const dedupStream = new CoordinatedFrameStream(dedupOut);
  dedupStream.write('Line 1\nLine 2\nLine 3\n');
  const afterFirst = dedupStream.getTelemetry();
  dedupStream.write('\x1b[2J\x1b[0fLine 1\nLine 2\nLine 3\n');
  dedupStream.write('\x1b[2K\x1b[1ALine 1\nLine 2\nLine 3\n');
  const afterDuplicates = dedupStream.getTelemetry();
  dedupStream.dispose();

  check(
    '8.1 CoordinatedFrameStream skips identical visual frames (0 bytes emitted even when Ink prepends clearTerminal/eraseLines)',
    afterFirst.framesWritten === 1 &&
      afterDuplicates.framesReceived === 3 &&
      afterDuplicates.framesWritten === 1 &&
      afterDuplicates.skippedIdenticalFrames === 2
  );

  const baselineResizeListeners = dedupOut.listenerCount('resize');
  const baselineDataListeners = sharedIn.listenerCount('data');

  for (let cycle = 0; cycle < 5; cycle++) {
    const cycleFrame = new CoordinatedFrameStream(dedupOut);
    const cycleInput = new FilteredTtyInputStream(sharedIn);
    const cycleInst = ink.render(
      React.createElement(OrionTuiView, {
        ink,
        kernel,
        router,
        onRequestExit: () => {},
        registerMouseHandler: (h) => cycleInput.setMouseEventHandler(h)
      }),
      {
        stdout: cycleFrame as unknown as NodeJS.WriteStream,
        stdin: cycleInput as unknown as NodeJS.ReadStream,
        exitOnCtrlC: false,
        patchConsole: false
      }
    );
    await wait(50);
    cycleInst.unmount();
    cycleInput.dispose();
    cycleFrame.dispose();
  }

  const finalResizeListeners = dedupOut.listenerCount('resize');
  const finalDataListeners = sharedIn.listenerCount('data');

  check(
    '8.2 Five consecutive mount/unmount render cycles leave zero accumulated resize or stdin data listeners',
    finalResizeListeners === baselineResizeListeners &&
      finalDataListeners === baselineDataListeners,
    `resizeListeners=${baselineResizeListeners}->${finalResizeListeners}, dataListeners=${baselineDataListeners}->${finalDataListeners}`
  );

  await kernel.shutdown();
  try {
    fs.rmSync(tmpWorkspace, { recursive: true, force: true });
  } catch {}

  console.log('\n================================================================================');
  console.log(`ORION TUI FLICKER & SPRITE INTEGRITY SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('================================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runOrionTuiFlickerAndSpriteIntegritySuite().catch((err) => {
  console.error('Unhandled error in OrionTuiFlickerAndSpriteIntegrity.test.ts:', err);
  process.exit(1);
});
