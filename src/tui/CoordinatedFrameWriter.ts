import { PassThrough, Writable } from 'stream';
import {
  SgrMouseEvent,
  containsSgrMouseSequence,
  parseSgrMouseEvents,
  stripSgrMouseSequences
} from './MascotInteractive';

export interface CoordinatedFrameTelemetry {
  framesReceived: number;
  framesWritten: number;
  skippedIdenticalFrames: number;
  linesUpdated: number;
  bytesWritten: number;
  clearScreen2JEmitted: number;
  synchronizedFramesEmitted: number;
}

export interface CoordinatedFrameStreamOptions {
  /**
   * Emit DEC Mode 2026 Synchronized Output (`\x1b[?2026h` ... `\x1b[?2026l`)
   * around each atomic frame update. Supported natively by Windows Terminal
   * and gracefully ignored by older VT parsers.
   */
  useSynchronizedOutput?: boolean;
}

const DEC_SYNC_BEGIN = '\x1b[?2026h';
const DEC_SYNC_END = '\x1b[?2026l';
const CURSOR_HIDE = '\x1b[?25l';
const CURSOR_SHOW = '\x1b[?25h';

/**
 * Leading destructive clear/erase prefixes emitted by `ink` (`clearTerminal`: `\x1b[2J\x1b[0f` / `\x1b[2J\x1b[3J\x1b[H`)
 * and `log-update` (`eraseLines`: `\x1b[2K\x1b[1A...\x1b[G`).
 */
const LEADING_DESTRUCTIVE_PREFIX_RE =
  /^(?:\x1b\[\?25[lh]|\x1b\[2J|\x1b\[3J|\x1b\[0?f|\x1b\[H|\x1b\[2K|\x1b\[1A|\x1b\[0?G)+/;

const PURE_CONTROL_ONLY_RE =
  /^(?:\x1b\[\?25[lh]|\x1b\[2J|\x1b\[3J|\x1b\[0?f|\x1b\[H|\x1b\[2K|\x1b\[1A|\x1b\[0?G|\r|\n)*$/;

/**
 * Single Coordinated Terminal Frame Writer (`src/tui/CoordinatedFrameWriter.ts`).
 *
 * Solves Windows Terminal / ConPTY (`OpenConsole.exe`) flicker, frame disappearance, and half-drawn sprite tearing:
 * 1. Intercepts Ink's `clearTerminal` (`\x1b[2J\x1b[0f`) and `eraseLines` (`\x1b[2K\x1b[1A...`) writes so the active
 *    viewport is NEVER wiped blank before a replacement frame arrives across 4 KB / 8 KB ConPTY pipe chunks.
 * 2. Performs deterministic line-level diffing against `previousLines`:
 *    - Identical visual frames emit 0 bytes (`skippedIdenticalFrames`).
 *    - Partial updates (e.g., typing a character or blinking Oris's eyes) overwrite ONLY the changed rows in place
 *      (`\x1b[<row>;1H\x1b[0m<line>\x1b[0m\x1b[K`), cutting ConPTY pipe traffic by >90%.
 * 3. Wraps every frame write in a single atomic `targetStdout.write(...)` call bracketed by DEC Mode 2026
 *    Synchronized Output (`\x1b[?2026h` ... `\x1b[?2026l`).
 */
export class CoordinatedFrameStream extends Writable {
  private readonly targetStdout: NodeJS.WriteStream;
  private readonly useSynchronizedOutput: boolean;
  private previousLines: string[] = [];
  private forceFullPaint = true;
  private pendingViewportSweep = false;
  private disposed = false;

  private readonly telemetry: CoordinatedFrameTelemetry = {
    framesReceived: 0,
    framesWritten: 0,
    skippedIdenticalFrames: 0,
    linesUpdated: 0,
    bytesWritten: 0,
    clearScreen2JEmitted: 0,
    synchronizedFramesEmitted: 0
  };

  private readonly handleTargetResize = (): void => {
    if (this.disposed) return;
    this.invalidate(true);
    this.emit('resize');
  };

  constructor(
    targetStdout: NodeJS.WriteStream = process.stdout,
    options: CoordinatedFrameStreamOptions = {}
  ) {
    super({ decodeStrings: false });
    this.targetStdout = targetStdout;
    this.useSynchronizedOutput = options.useSynchronizedOutput ?? true;

    if (this.targetStdout && typeof this.targetStdout.on === 'function') {
      this.targetStdout.on('resize', this.handleTargetResize);
    }
  }

  public get isTTY(): boolean {
    return Boolean(this.targetStdout?.isTTY);
  }

  public get columns(): number {
    return this.targetStdout?.columns || 100;
  }

  public get rows(): number {
    return this.targetStdout?.rows || 30;
  }

  public getColorDepth(env?: Record<string, string | undefined>): number {
    if (typeof this.targetStdout?.getColorDepth === 'function') {
      return this.targetStdout.getColorDepth(env);
    }
    return 24;
  }

  public hasColors(count?: number, env?: Record<string, string | undefined>): boolean {
    if (typeof this.targetStdout?.hasColors === 'function') {
      return this.targetStdout.hasColors(count as number, env as NodeJS.ProcessEnv);
    }
    return true;
  }

  /**
   * Marks cached line state dirty so the next frame repaints every row in place atomically.
   */
  public invalidate(sweepRemainingRows: boolean = true): void {
    this.forceFullPaint = true;
    if (sweepRemainingRows) {
      this.pendingViewportSweep = true;
    }
  }

  public getTelemetry(): CoordinatedFrameTelemetry {
    return { ...this.telemetry };
  }

  public getScreenSnapshot(): readonly string[] {
    return [...this.previousLines];
  }

  public override _write(
    chunk: Buffer | string,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    try {
      if (this.disposed) {
        callback();
        return;
      }

      const raw = typeof chunk === 'string' ? chunk : chunk.toString('utf8');
      if (!raw) {
        callback();
        return;
      }

      // Suppress standalone erase/clear/cursor-toggle noise emitted by log-update clear()/done();
      // AlternateScreenGuard owns clean cursor & screen buffer restoration on exit.
      if (PURE_CONTROL_ONLY_RE.test(raw)) {
        if (raw.includes(CURSOR_SHOW) && !this.isTTY) {
          this.targetStdout.write(CURSOR_SHOW);
        }
        callback();
        return;
      }

      let frameBody = raw.replace(LEADING_DESTRUCTIVE_PREFIX_RE, '');
      frameBody = frameBody.replace(/\r\n/g, '\n');
      if (frameBody.endsWith('\n')) {
        frameBody = frameBody.slice(0, -1);
      }
      // Strip trailing cursorShow if appended onto final unmount flush
      if (frameBody.endsWith(CURSOR_SHOW)) {
        frameBody = frameBody.slice(0, -CURSOR_SHOW.length);
      }

      const viewportRows = Math.max(1, this.rows);
      const nextLines = frameBody.split('\n').slice(0, viewportRows);

      this.telemetry.framesReceived++;

      const isIdentical =
        !this.forceFullPaint &&
        !this.pendingViewportSweep &&
        nextLines.length === this.previousLines.length &&
        nextLines.every((line, idx) => line === this.previousLines[idx]);

      if (isIdentical) {
        this.telemetry.skippedIdenticalFrames++;
        callback();
        return;
      }

      let outBuffer = '';
      if (this.useSynchronizedOutput) {
        outBuffer += DEC_SYNC_BEGIN;
      }
      outBuffer += CURSOR_HIDE;

      let updatedCount = 0;
      for (let r = 0; r < nextLines.length; r++) {
        if (this.forceFullPaint || this.previousLines[r] !== nextLines[r]) {
          // Position to 1-based row `r + 1`, col 1, reset prior SGR state so attributes never bleed,
          // overwrite cells in place, reset SGR, and clear trailing remainder of that line (`\x1b[K`).
          outBuffer += `\x1b[${r + 1};1H\x1b[0m${nextLines[r]}\x1b[0m\x1b[K`;
          updatedCount++;
        }
      }

      const clearEndRow = this.pendingViewportSweep
        ? viewportRows
        : Math.min(viewportRows, this.previousLines.length);

      for (let r = nextLines.length; r < clearEndRow; r++) {
        outBuffer += `\x1b[${r + 1};1H\x1b[0m\x1b[K`;
        updatedCount++;
      }

      if (this.useSynchronizedOutput) {
        outBuffer += DEC_SYNC_END;
        this.telemetry.synchronizedFramesEmitted++;
      }

      this.previousLines = nextLines;
      this.forceFullPaint = false;
      this.pendingViewportSweep = false;

      if (updatedCount > 0) {
        this.telemetry.framesWritten++;
        this.telemetry.linesUpdated += updatedCount;
        this.telemetry.bytesWritten += Buffer.byteLength(outBuffer, 'utf8');
        this.targetStdout.write(outBuffer);
      } else {
        this.telemetry.skippedIdenticalFrames++;
      }

      callback();
    } catch (err) {
      callback(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    if (this.targetStdout && typeof this.targetStdout.off === 'function') {
      this.targetStdout.off('resize', this.handleTargetResize);
    }
  }
}

export interface FilteredTtyInputStreamOptions {
  onMouseEvents?: (events: SgrMouseEvent[]) => void;
}

const TERMINAL_FOCUS_REPORT_RE = /\x1b\[[IO]/g;
const DISCRETE_KEY_TOKEN_RE =
  /\x1b\[[0-?]*[ -/]*[@-~]|\x1bO[A-Za-z]|\x1b.|\x1b|\r\n|\r|\n|\t|\x7f|\x08|[\x01-\x1a]|[^\x00-\x1f\x7f]+/g;

/**
 * Splits batched ConPTY / pasted input buffers (e.g. `'\x1b[D\x1b[D'`, `'\x7f\x7f\x7f'`, `'/doctor\r\n'`)
 * into discrete terminal key tokens so Ink's `parseKeypress` never drops repeated arrows/backspaces
 * or swallows trailing Enter (`\r`) keys on pasted commands.
 */
export function tokenizeTerminalKeypresses(cleanedInput: string): string[] {
  if (!cleanedInput) return [];
  const matches = cleanedInput.match(DISCRETE_KEY_TOKEN_RE);
  if (!matches) return [];
  return matches.map((tok) => (tok === '\r\n' || tok === '\n' ? '\r' : tok));
}

/**
 * Coordinated TTY Input Filter (`FilteredTtyInputStream`).
 *
 * Bridges raw `process.stdin` to Ink's paused `'readable'` + `.read()` loop without attaching
 * competing `'data'` listeners on the same stream:
 * - Uses `objectMode: true` + `tokenizeTerminalKeypresses` so batched ConPTY reads dequeue one
 *   discrete key event per `stdin.read()` call instead of concatenating escape sequences.
 * - Intercepts SGR mouse packets (`\x1b[<btn;col;rowM`/`m`) and routes them directly to `onMouseEvents`
 *   so pointer motion/clicks NEVER pollute typed prompt text or advance cursor offsets.
 * - Strips terminal focus-in / focus-out sequences (`\x1b[I`, `\x1b[O`).
 */
export class FilteredTtyInputStream extends PassThrough {
  private readonly sourceStdin: NodeJS.ReadStream;
  private onMouseEventsCallback?: (events: SgrMouseEvent[]) => void;
  private attached = false;
  private disposed = false;

  private readonly handleSourceData = (chunk: Buffer | string): void => {
    if (this.disposed) return;
    this.processRawChunk(chunk);
  };

  constructor(
    sourceStdin: NodeJS.ReadStream = process.stdin,
    options: FilteredTtyInputStreamOptions = {}
  ) {
    super({ objectMode: true });
    this.sourceStdin = sourceStdin;
    this.onMouseEventsCallback = options.onMouseEvents;
  }

  public override setEncoding(_encoding: BufferEncoding): this {
    // Tokens are already pushed as UTF-8 strings in objectMode
    return this;
  }

  public setMouseEventHandler(handler?: (events: SgrMouseEvent[]) => void): void {
    this.onMouseEventsCallback = handler;
  }

  public get isTTY(): boolean {
    return Boolean(this.sourceStdin?.isTTY);
  }

  public setRawMode(enable: boolean): this {
    if (typeof this.sourceStdin?.setRawMode === 'function') {
      this.sourceStdin.setRawMode(enable);
    }
    if (enable) {
      this.attachSourceListener();
    } else {
      this.detachSourceListener();
    }
    return this;
  }

  public ref(): this {
    if (typeof this.sourceStdin?.ref === 'function') {
      this.sourceStdin.ref();
    }
    return this;
  }

  public unref(): this {
    if (typeof this.sourceStdin?.unref === 'function') {
      this.sourceStdin.unref();
    }
    return this;
  }

  /**
   * Processes a raw UTF-8/Buffer chunk (either from `sourceStdin` or directly from automated tests).
   */
  public processRawChunk(chunk: Buffer | string): void {
    if (this.disposed) return;
    const rawStr = typeof chunk === 'string' ? chunk : chunk.toString('utf8');
    if (!rawStr) return;

    if (containsSgrMouseSequence(rawStr)) {
      const events = parseSgrMouseEvents(rawStr);
      if (events.length > 0 && this.onMouseEventsCallback) {
        this.onMouseEventsCallback(events);
      }
    }

    const cleaned = stripSgrMouseSequences(rawStr).replace(TERMINAL_FOCUS_REPORT_RE, '');
    if (cleaned.length > 0) {
      const tokens = tokenizeTerminalKeypresses(cleaned);
      for (const tok of tokens) {
        this.write(tok);
      }
    }
  }

  private attachSourceListener(): void {
    if (this.attached || this.disposed) return;
    if (this.sourceStdin && typeof this.sourceStdin.on === 'function') {
      this.attached = true;
      this.sourceStdin.on('data', this.handleSourceData);
    }
  }

  private detachSourceListener(): void {
    if (!this.attached) return;
    this.attached = false;
    if (this.sourceStdin && typeof this.sourceStdin.off === 'function') {
      this.sourceStdin.off('data', this.handleSourceData);
    }
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.detachSourceListener();
    this.onMouseEventsCallback = undefined;
  }
}
