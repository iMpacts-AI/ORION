import fs from 'fs';
import path from 'path';
import React, { useEffect, useState, useRef } from 'react';
import { InkPrimitives } from './inkLoader';

export type OrisActionState =
  | 'idle'
  | 'blinking'
  | 'hopping'
  | 'landing'
  | 'jumping'
  | 'fallen'
  | 'tracking'
  | 'thinking'
  | 'working'
  | 'awaiting_approval'
  | 'success'
  | 'cancelled'
  | 'error';

export type OrisTaskLifecycleState =
  | 'idle'
  | 'thinking'
  | 'working'
  | 'awaiting_approval'
  | 'success'
  | 'cancelled'
  | 'error';

export interface OrisMascotState {
  x: number;
  y: number;
  actionState: OrisActionState;
  eyeOffsetX: -1 | 0 | 1;
  tiltDirection: -1 | 0 | 1;
  blinkLong: boolean;
  particles: Array<{ glyph: '✧' | '✦'; dx: number; dy: number }>;
  clickCount: number;
  lastClickTimestamp: number;
  statusCaption?: string;
}

export interface SgrMouseEvent {
  buttonCode: number;
  col: number; // 1-based terminal column
  row: number; // 1-based terminal row
  type: 'press' | 'release' | 'move';
  isLeftButton: boolean;
  raw: string;
}

export interface OrisHitbox {
  leftCol: number;   // 1-based inclusive
  rightCol: number;  // 1-based inclusive
  topRow: number;    // 1-based inclusive
  bottomRow: number; // 1-based inclusive
  centerCol: number;
  centerRow: number;
  width: number;
  height: number;
}

/**
 * Exact 18x18 canonical pixel-art grid extracted from the approved Gemini Oris reference
 * (`assets/mascot/oris-reference.png` / `assets/mascot/oris-sprite.json`).
 * Rendered in terminal via 24-bit ANSI Unicode half-blocks (`▀` / `▄` / `█`) at 18 cols x 9 rows.
 */
export const ORIS_CANONICAL_PIXEL_GRID_18X18: ReadonlyArray<ReadonlyArray<string | null>> = [
  [null, '#49ebf9', '#43ecfa', null, null, null, null, null, null, null, null, null, null, null, null, '#967ffa', '#7169df', null],
  ['#49e7f5', '#00205c', '#001c48', '#47ebf8', null, '#56f1f9', '#4eeef8', '#4feaf8', '#55e9fa', '#5ce0f9', '#61d9f8', '#63d5fa', '#54aae7', null, '#9986fa', '#021750', '#483287', '#9178f4'],
  ['#48eaf7', '#001d56', '#001d4d', '#4feefa', '#57f5fd', '#00225c', '#001b4b', '#011b4c', '#011b4d', '#011d53', '#001c53', '#011c55', '#27307b', '#787df5', '#8b83fd', '#001342', '#492f83', '#9175f3'],
  [null, null, '#55eafb', '#00215e', '#011e55', '#001d50', '#011c4f', '#01194a', '#011a49', '#011a4b', '#011848', '#12155a', '#665ddd', '#001948', '#030e4c', '#686ae9', null, null],
  [null, '#3ddff9', '#001f60', '#001d52', '#011c52', '#8b70f4', '#001a61', '#001c4e', '#001b4d', '#01194b', '#011847', '#011648', '#021455', '#011744', '#001743', '#24226e', '#6760d7', null],
  ['#4bebf9', '#32def7', '#001a54', '#001a4c', '#001a4e', '#011b51', '#011c4e', '#00194c', '#001a4e', '#001a4b', '#001949', '#011946', '#021849', '#011949', '#001b4a', '#25236d', '#a284f5', '#a48cf6'],
  ['#4deaf9', '#001d56', '#04154b', '#886df6', '#001745', '#021948', '#001a4b', '#011d4f', '#3f81a7', '#001d55', '#01194b', '#011846', '#011a45', '#3f7fa3', '#001b4d', '#011b50', '#44357d', '#ab8ff8'],
  ['#56eefa', '#001c58', '#011646', '#011649', '#011846', '#011847', '#011947', '#011948', '#95fbfd', '#002057', '#001b4b', '#011a4a', '#001f48', '#95f9fe', '#011947', '#001743', '#402b73', '#ab87f9'],
  ['#5df1fb', '#001f5f', '#01184b', '#011949', '#011949', '#001848', '#011a48', '#011948', '#95f8fd', '#001c50', '#001c4b', '#001b4d', '#00224e', '#a1fdfe', '#001b49', '#011842', '#3b256d', '#aa81f8'],
  ['#5bf0fb', '#002162', '#011a4f', '#011b4f', '#021a4c', '#01194b', '#011949', '#001847', '#95f6fc', '#001b4b', '#011948', '#011b4b', '#00224f', '#a5fefe', '#011e50', '#011946', '#3d2871', '#ad82fa'],
  ['#59ecf9', '#00205e', '#001a4f', '#7170f2', '#001b60', '#001a4a', '#001a4a', '#001a48', '#011b4a', '#021a48', '#001946', '#001a49', '#001b4b', '#011b4c', '#001b4a', '#001a49', '#3c2a72', '#b68afc'],
  ['#58e7f8', '#001f5d', '#7c70e8', '#144eeb', '#8198f3', '#001f6a', '#011b4d', '#001c4b', '#011b4b', '#021a4a', '#011a48', '#001845', '#001b48', '#011c4b', '#001c4c', '#001a4b', '#3b2a72', '#b890fb'],
  ['#65ecfa', '#002466', '#001b4b', '#6463e7', '#00175a', '#001b4b', '#011c4d', '#011b4d', '#001d4c', '#011c4e', '#011c4c', '#001b4a', '#001c48', '#011844', '#070f48', '#a47def', '#3d2a73', '#b78cfa'],
  [null, '#63e1f7', '#002261', '#001c4a', '#011943', '#001946', '#011b4b', '#011d50', '#001e54', '#011c53', '#001d53', '#001b4c', '#011949', '#011747', '#001643', '#221a63', '#a47dea', null],
  [null, null, '#62e1fc', '#61dafb', '#5dd4fa', '#6ac4f8', '#86b7fd', '#91aefc', '#a6a4fa', '#ba9cfe', '#c193fc', '#bd86f9', '#bf80fb', '#bd7ffc', '#bf83fc', '#a981f2', null, null],
  [null, null, '#5edffb', '#2178f3', '#5fd4fa', '#001543', '#8ebdfb', '#214cf4', '#a798fb', '#000e43', null, null, '#211352', '#c08ffe', '#443dec', '#a57ef2', null, null],
  [null, null, '#5edffc', '#2d7df2', '#001745', null, '#9ec5fc', '#2f5af1', '#ad99fc', null, null, null, '#1d0e48', '#c291fe', '#4e46e9', '#ad8af4', null, null],
  [null, null, '#68ddf9', '#4387f0', null, null, '#9ec3fc', '#8e9bef', '#021445', null, null, null, '#1b0d40', '#bd88fc', '#ad86fa', null, null, null]
];

let cachedDiskSpriteGrid: ReadonlyArray<ReadonlyArray<string | null>> | null = null;

function loadCanonicalOrisPixelGrid(): ReadonlyArray<ReadonlyArray<string | null>> {
  if (cachedDiskSpriteGrid) return cachedDiskSpriteGrid;
  try {
    const candidate = path.resolve(__dirname, '..', '..', 'assets', 'mascot', 'oris-sprite.json');
    if (fs.existsSync(candidate)) {
      const parsed = JSON.parse(fs.readFileSync(candidate, 'utf8'));
      if (Array.isArray(parsed?.pixels) && parsed.pixels.length === 18) {
        cachedDiskSpriteGrid = parsed.pixels;
        return cachedDiskSpriteGrid!;
      }
    }
  } catch {
    // Fall back to embedded canonical 18x18 pixel grid
  }
  cachedDiskSpriteGrid = ORIS_CANONICAL_PIXEL_GRID_18X18;
  return cachedDiskSpriteGrid;
}

/**
 * Canonical visual design specification for Oris (ORION's official mascot).
 * Preserves silhouette, proportions, deep-space cyan/violet color palette,
 * luminous optical eyes, cheek `+` emblem, and recognizable appearance across all animation states.
 */
export const ORIS_CANONICAL_DESIGN_SPEC = Object.freeze({
  name: 'Oris',
  role: 'ORION Official Deep-Space Companion Mascot',
  widthCols: 19,
  heightRows: 5,
  pixelWidthCols: 18,
  pixelHeightRows: 18,
  halfBlockHeightRows: 9,
  spriteAssetPath: 'assets/mascot/oris-sprite.json',
  referenceAssetPath: 'assets/mascot/oris-reference.png',
  palette: {
    primaryCyan: 'cyan',
    accentMagenta: 'magenta',
    successGreen: 'green',
    warningYellow: 'yellow',
    errorRed: 'red',
    starlightDim: 'gray'
  },
  canonicalIdleSilhouette: [
    '   ✦  ╭───╮  ✧   ',
    '  ╭┴──┤◉ ◉├──┴╮  ',
    '  │ ◈ ╰───╯ ◈ │  ',
    '  ╰───┬───┬───╯  ',
    '      ╰───╯      '
  ]
});

export const SGR_MOUSE_ENABLE_SEQ = '\x1b[?1000h\x1b[?1002h\x1b[?1006h';
export const SGR_MOUSE_DISABLE_SEQ = '\x1b[?1006l\x1b[?1002l\x1b[?1000l';

export function enableTerminalMouseTracking(
  writeFn: (seq: string) => void = (s) => {
    if (process.stdout.isTTY) process.stdout.write(s);
  }
): string {
  writeFn(SGR_MOUSE_ENABLE_SEQ);
  return SGR_MOUSE_ENABLE_SEQ;
}

export function disableTerminalMouseTracking(
  writeFn: (seq: string) => void = (s) => {
    if (process.stdout.isTTY) process.stdout.write(s);
  }
): string {
  writeFn(SGR_MOUSE_DISABLE_SEQ);
  return SGR_MOUSE_DISABLE_SEQ;
}

export function parseSgrMouseEvents(rawChunk: string): SgrMouseEvent[] {
  if (!rawChunk || typeof rawChunk !== 'string') return [];
  const events: SgrMouseEvent[] = [];
  const regex = /(?:\x1b)?\[<(\d+);(\d+);(\d+)([Mm])/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(rawChunk)) !== null) {
    const buttonCode = parseInt(match[1], 10);
    const col = parseInt(match[2], 10);
    const row = parseInt(match[3], 10);
    const suffix = match[4];
    const isMove = (buttonCode & 32) !== 0;
    const baseBtn = buttonCode & 3;
    const type: SgrMouseEvent['type'] = isMove
      ? 'move'
      : suffix === 'M'
        ? 'press'
        : 'release';

    events.push({
      buttonCode,
      col: Math.max(1, col),
      row: Math.max(1, row),
      type,
      isLeftButton: baseBtn === 0,
      raw: match[0]
    });
  }
  return events;
}

export function containsSgrMouseSequence(input: string): boolean {
  if (!input) return false;
  return /(?:\x1b)?\[?<\d+;\d+;\d+[Mm]/.test(input) || /^\[<\d+/.test(input);
}

export function stripSgrMouseSequences(input: string): string {
  if (!input) return '';
  return input.replace(/(?:\x1b)?\[?<\d+;\d+;\d+[Mm]/g, '');
}

/**
 * Computes Oris's centered terminal hitbox dynamically from current terminal dimensions
 * and current mascot offset `(x, y)` so resize events keep the hitbox accurately aligned.
 */
export function computeOrisHitbox(
  terminalColumns: number,
  terminalRows: number,
  mascotOffsetX: number = 0,
  mascotOffsetY: number = 0,
  anchorRowBase: number = 7,
  heightRowsOverride?: number
): OrisHitbox {
  const cols = Math.max(40, terminalColumns || 80);
  const rows = Math.max(16, terminalRows || 24);
  const width = ORIS_CANONICAL_DESIGN_SPEC.widthCols;
  const height = heightRowsOverride ?? ORIS_CANONICAL_DESIGN_SPEC.heightRows;

  const centerCol = Math.max(1, Math.floor(cols / 2) + Math.round(mascotOffsetX));
  const leftCol = Math.max(1, Math.floor(centerCol - width / 2));
  const rightCol = Math.min(cols, leftCol + width - 1);

  const clampedAnchorRow = Math.min(Math.max(2, anchorRowBase), Math.max(2, rows - height - 4));
  const topRow = Math.max(1, clampedAnchorRow + Math.round(mascotOffsetY));
  const bottomRow = Math.min(rows, topRow + height - 1);
  const centerRow = Math.floor((topRow + bottomRow) / 2);

  return {
    leftCol,
    rightCol,
    topRow,
    bottomRow,
    centerCol,
    centerRow,
    width,
    height
  };
}

export function isPointInsideHitbox(col: number, row: number, hitbox: OrisHitbox): boolean {
  return (
    col >= hitbox.leftCol &&
    col <= hitbox.rightCol &&
    row >= hitbox.topRow &&
    row <= hitbox.bottomRow
  );
}

export function isPointNearHitbox(
  col: number,
  row: number,
  hitbox: OrisHitbox,
  proximityCols: number = 10,
  proximityRows: number = 4
): boolean {
  return (
    col >= hitbox.leftCol - proximityCols &&
    col <= hitbox.rightCol + proximityCols &&
    row >= hitbox.topRow - proximityRows &&
    row <= hitbox.bottomRow + proximityRows
  );
}

export interface OrisInteractionConfig {
  multiClickThresholdCount?: number;
  multiClickWindowMs?: number;
  fallenDurationMs?: number;
  jumpDurationMs?: number;
}

export class OrisMascotController {
  private state: OrisMascotState;
  private taskLifecycle: OrisTaskLifecycleState = 'idle';
  private readonly multiClickThreshold: number;
  private readonly multiClickWindowMs: number;
  private readonly fallenDurationMs: number;
  private readonly jumpDurationMs: number;

  private elapsedMs = 0;
  private nextBlinkAtMs = 2600;
  private blinkEndAtMs = 0;
  private nextHopAtMs = 6400;
  private hopPhaseEndAtMs = 0;
  private jumpStartedAtMs = 0;
  private fallenStartedAtMs = 0;
  private lastPointerMoveAtMs = 0;

  constructor(config: OrisInteractionConfig = {}) {
    this.multiClickThreshold = config.multiClickThresholdCount ?? 3;
    this.multiClickWindowMs = config.multiClickWindowMs ?? 900;
    this.fallenDurationMs = config.fallenDurationMs ?? 400;
    this.jumpDurationMs = config.jumpDurationMs ?? 420;

    this.state = {
      x: 0,
      y: 0,
      actionState: 'idle',
      eyeOffsetX: 0,
      tiltDirection: 0,
      blinkLong: false,
      particles: [],
      clickCount: 0,
      lastClickTimestamp: 0
    };
  }

  public getState(): OrisMascotState {
    return {
      ...this.state,
      particles: [...this.state.particles]
    };
  }

  public setTaskLifecycleState(
    lifecycle: OrisTaskLifecycleState,
    caption?: string
  ): OrisMascotState {
    this.taskLifecycle = lifecycle;
    this.state.statusCaption = caption;

    if (this.state.actionState !== 'jumping' && this.state.actionState !== 'fallen') {
      if (lifecycle === 'idle') {
        this.state.actionState = 'idle';
        this.state.x = 0;
        this.state.y = 0;
        this.state.particles = [];
      } else {
        this.state.actionState = lifecycle;
        this.state.y = lifecycle === 'success' ? -1 : 0;
        this.state.particles =
          lifecycle === 'success'
            ? [
                { glyph: '✦', dx: -2, dy: -1 },
                { glyph: '✧', dx: 2, dy: -1 }
              ]
            : [];
      }
    }

    return this.getState();
  }

  public handleMouseEvent(
    event: SgrMouseEvent,
    hitbox: OrisHitbox,
    nowMs: number = Date.now()
  ): { handled: boolean; state: OrisMascotState } {
    const inside = isPointInsideHitbox(event.col, event.row, hitbox);
    const near = isPointNearHitbox(event.col, event.row, hitbox);

    if (event.type === 'press' && event.isLeftButton && inside) {
      const withinWindow =
        this.state.lastClickTimestamp > 0 &&
        nowMs - this.state.lastClickTimestamp <= this.multiClickWindowMs;
      const updatedClickCount = withinWindow ? this.state.clickCount + 1 : 1;
      this.state.clickCount = updatedClickCount;
      this.state.lastClickTimestamp = nowMs;

      if (updatedClickCount >= this.multiClickThreshold) {
        this.state.actionState = 'fallen';
        this.fallenStartedAtMs = this.elapsedMs;
        this.state.y = 1;
        this.state.tiltDirection = updatedClickCount % 2 === 0 ? 1 : -1;
        this.state.particles = [
          { glyph: '✧', dx: -3, dy: 0 },
          { glyph: '✦', dx: 3, dy: -1 },
          { glyph: '✧', dx: 0, dy: -2 }
        ];
        this.state.clickCount = 0;
      } else {
        this.state.actionState = 'jumping';
        this.jumpStartedAtMs = this.elapsedMs;
        this.state.y = -3;
        this.state.particles = [
          { glyph: '✦', dx: -2, dy: -2 },
          { glyph: '✧', dx: 2, dy: -2 },
          { glyph: '✦', dx: 0, dy: -3 }
        ];
      }

      return { handled: true, state: this.getState() };
    }

    if (event.type === 'move' || (event.type === 'press' && near && !inside)) {
      if (this.state.actionState === 'jumping' || this.state.actionState === 'fallen') {
        return { handled: near, state: this.getState() };
      }

      if (near) {
        this.lastPointerMoveAtMs = this.elapsedMs;
        const deltaCol = event.col - hitbox.centerCol;
        const eyeDir: -1 | 0 | 1 = deltaCol < -2 ? -1 : deltaCol > 2 ? 1 : 0;
        const tiltDir: -1 | 0 | 1 = deltaCol < -3 ? -1 : deltaCol > 3 ? 1 : 0;
        this.state.eyeOffsetX = eyeDir;
        this.state.tiltDirection = tiltDir;
        this.state.x = tiltDir;
        this.state.y = inside ? -1 : 0;
        if (this.taskLifecycle === 'idle') {
          this.state.actionState = 'tracking';
        }
        return { handled: true, state: this.getState() };
      } else if (this.state.actionState === 'tracking') {
        this.state.actionState = this.taskLifecycle === 'idle' ? 'idle' : this.taskLifecycle;
        this.state.eyeOffsetX = 0;
        this.state.tiltDirection = 0;
        this.state.x = 0;
        this.state.y = 0;
      }
    }

    return { handled: inside, state: this.getState() };
  }

  public step(deltaMs: number): OrisMascotState {
    const dt = Math.max(0, Math.min(deltaMs, 500));
    this.elapsedMs += dt;

    if (this.state.actionState === 'fallen') {
      const fallenElapsed = this.elapsedMs - this.fallenStartedAtMs;
      if (fallenElapsed >= this.fallenDurationMs) {
        this.state.actionState = this.taskLifecycle === 'idle' ? 'idle' : this.taskLifecycle;
        this.state.x = 0;
        this.state.y = 0;
        this.state.tiltDirection = 0;
        this.state.particles = [];
      } else if (fallenElapsed >= this.fallenDurationMs * 0.6) {
        this.state.y = -1;
      }
      return this.getState();
    }

    if (this.state.actionState === 'jumping') {
      const jumpElapsed = this.elapsedMs - this.jumpStartedAtMs;
      if (jumpElapsed >= this.jumpDurationMs) {
        this.state.actionState = 'landing';
        this.hopPhaseEndAtMs = this.elapsedMs + 140;
        this.state.y = 0;
        this.state.particles = [{ glyph: '✧', dx: -1, dy: 0 }, { glyph: '✦', dx: 1, dy: 0 }];
      } else if (jumpElapsed < this.jumpDurationMs * 0.45) {
        this.state.y = -3;
      } else if (jumpElapsed < this.jumpDurationMs * 0.8) {
        this.state.y = -2;
      } else {
        this.state.y = -1;
      }
      return this.getState();
    }

    if (this.state.actionState === 'landing') {
      if (this.elapsedMs >= this.hopPhaseEndAtMs) {
        this.state.actionState = this.taskLifecycle === 'idle' ? 'idle' : this.taskLifecycle;
        this.state.y = 0;
        this.state.particles = [];
      }
      return this.getState();
    }

    if (this.state.actionState === 'tracking') {
      if (this.elapsedMs - this.lastPointerMoveAtMs >= 900) {
        this.state.actionState = this.taskLifecycle === 'idle' ? 'idle' : this.taskLifecycle;
        this.state.eyeOffsetX = 0;
        this.state.tiltDirection = 0;
        this.state.x = 0;
        this.state.y = 0;
      }
      return this.getState();
    }

    if (this.taskLifecycle !== 'idle') {
      this.state.actionState = this.taskLifecycle;
      if (this.taskLifecycle === 'thinking') {
        const phase = Math.floor(this.elapsedMs / 400) % 3;
        this.state.eyeOffsetX = phase === 0 ? -1 : phase === 1 ? 0 : 1;
        this.state.y = Math.floor(this.elapsedMs / 600) % 2 === 0 ? 0 : -1;
        this.state.particles = [{ glyph: '✧', dx: 0, dy: -1 }];
      } else if (this.taskLifecycle === 'working') {
        const pulse = Math.floor(this.elapsedMs / 250) % 2;
        this.state.y = pulse === 0 ? 0 : -1;
        this.state.particles =
          pulse === 0
            ? [{ glyph: '✦', dx: -2, dy: 0 }, { glyph: '✧', dx: 2, dy: 0 }]
            : [{ glyph: '✧', dx: -2, dy: -1 }, { glyph: '✦', dx: 2, dy: -1 }];
      } else if (this.taskLifecycle === 'awaiting_approval') {
        this.state.y = 0;
        this.state.particles = [{ glyph: '✦', dx: 0, dy: -1 }];
      }
      return this.getState();
    }

    if (this.state.actionState === 'blinking') {
      if (this.elapsedMs >= this.blinkEndAtMs) {
        if (this.elapsedMs >= this.nextHopAtMs) {
          this.state.actionState = 'hopping';
          this.state.y = -1;
          this.hopPhaseEndAtMs = this.elapsedMs + 220;
          this.nextHopAtMs = this.elapsedMs + 5800 + (Math.floor(this.elapsedMs) % 2200);
          this.state.particles = [{ glyph: '✧', dx: 0, dy: -1 }];
        } else {
          this.state.actionState = 'idle';
          this.state.blinkLong = false;
        }
      }
      return this.getState();
    }

    if (this.state.actionState === 'hopping') {
      if (this.elapsedMs >= this.hopPhaseEndAtMs) {
        this.state.actionState = 'landing';
        this.state.y = 0;
        this.hopPhaseEndAtMs = this.elapsedMs + 140;
      }
      return this.getState();
    }

    this.state.y = 0;

    if (this.elapsedMs >= this.nextBlinkAtMs) {
      this.state.actionState = 'blinking';
      const isLong = Math.floor(this.elapsedMs / 1000) % 4 === 0;
      this.state.blinkLong = isLong;
      this.blinkEndAtMs = this.elapsedMs + (isLong ? 340 : 160);
      this.nextBlinkAtMs = this.elapsedMs + 2400 + (Math.floor(this.elapsedMs) % 1800);
    } else if (this.elapsedMs >= this.nextHopAtMs) {
      this.state.actionState = 'hopping';
      this.state.y = -1;
      this.hopPhaseEndAtMs = this.elapsedMs + 220;
      this.nextHopAtMs = this.elapsedMs + 6200;
      this.state.particles = [{ glyph: '✧', dx: 1, dy: -1 }];
    }

    return this.getState();
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace(/^#/, '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function isLuminousOrisFeature(hex: string | null): boolean {
  if (!hex) return false;
  const [r, g, b] = hexToRgb(hex);
  return Math.max(r, g, b) >= 110;
}

/**
 * Renders the canonical 18x18 Gemini pixel-art Oris sprite into 9 rows of 24-bit ANSI
 * half-block characters (`▀` / `▄` / `█` / ` `) with genuine terminal background transparency (`\x1b[49m`),
 * fixed 20-column cell width, <=19-byte CSI SGR tokens (safe for Ink's `@alcalzone/ansi-tokenize`),
 * and faithful pixel-level eye animations across all 13 `OrisActionState`s.
 */
export function renderOrisPixelHalfBlockLines(
  state: OrisMascotState,
  options?: { cardBgHex?: string; opaqueBg?: boolean; noColor?: boolean }
): string[] {
  const baseGrid = loadCanonicalOrisPixelGrid();
  const grid: Array<Array<string | null>> = baseGrid.map((r) => [...r]);
  const darkFaceHex = '#011948';
  const useOpaqueBg = Boolean(options?.opaqueBg && options?.cardBgHex);
  const opaqueBgHex = options?.cardBgHex || '#070d19';
  const noColor = Boolean(options?.noColor);

  // Clear canonical eye columns (rows 6..9, cols 8 and 13) before drawing animated eyes
  for (let r = 6; r <= 9; r++) {
    grid[r][8] = darkFaceHex;
    grid[r][13] = darkFaceHex;
  }

  const eyeShift = state.eyeOffsetX;
  const leftEyeCol = Math.max(6, Math.min(10, 8 + eyeShift));
  const rightEyeCol = Math.max(11, Math.min(15, 13 + eyeShift));

  switch (state.actionState) {
    case 'blinking': {
      const blinkRow = state.blinkLong ? 9 : 8;
      grid[blinkRow][leftEyeCol] = '#95fbfd';
      grid[blinkRow][Math.max(5, leftEyeCol - 1)] = '#4feaf8';
      grid[blinkRow][rightEyeCol] = '#a1fdfe';
      grid[blinkRow][Math.min(15, rightEyeCol + 1)] = '#63d5fa';
      break;
    }
    case 'awaiting_approval': {
      for (const r of [7, 8, 9]) {
        grid[r][leftEyeCol] = '#fbbf24';
        grid[r][rightEyeCol] = '#fde68a';
      }
      break;
    }
    case 'cancelled': {
      grid[8][leftEyeCol] = '#f59e0b';
      grid[8][leftEyeCol - 1] = '#f59e0b';
      grid[8][rightEyeCol] = '#f59e0b';
      grid[8][rightEyeCol + 1] = '#f59e0b';
      break;
    }
    case 'error': {
      grid[7][leftEyeCol] = '#f87171';
      grid[9][leftEyeCol] = '#f87171';
      grid[8][leftEyeCol] = '#fecaca';
      grid[7][rightEyeCol] = '#f87171';
      grid[9][rightEyeCol] = '#f87171';
      grid[8][rightEyeCol] = '#fecaca';
      break;
    }
    case 'success':
    case 'jumping': {
      grid[7][leftEyeCol] = '#a7f3d0';
      grid[8][leftEyeCol - 1] = '#6ee7b7';
      grid[8][leftEyeCol + 1] = '#6ee7b7';
      grid[7][rightEyeCol] = '#a7f3d0';
      grid[8][rightEyeCol - 1] = '#6ee7b7';
      grid[8][rightEyeCol + 1] = '#6ee7b7';
      break;
    }
    default: {
      // Canonical 1x3 luminous cyan-white vertical bar eyes (with subtle top glow pixel at row 6)
      grid[6][leftEyeCol] = '#3f81a7';
      grid[7][leftEyeCol] = '#95fbfd';
      grid[8][leftEyeCol] = '#95f8fd';
      grid[9][leftEyeCol] = '#95f6fc';
      grid[6][rightEyeCol] = '#3f7fa3';
      grid[7][rightEyeCol] = '#95f9fe';
      grid[8][rightEyeCol] = '#a1fdfe';
      grid[9][rightEyeCol] = '#a5fefe';
      break;
    }
  }

  const finalGrid = state.actionState === 'fallen' ? [...grid].reverse() : grid;
  const shiftPrefix = state.tiltDirection < 0 ? '' : state.tiltDirection > 0 ? '  ' : ' ';
  const shiftSuffix = state.tiltDirection < 0 ? '  ' : state.tiltDirection > 0 ? '' : ' ';

  const defaultBgReset = useOpaqueBg
    ? (() => {
        const [bgR, bgG, bgB] = hexToRgb(opaqueBgHex);
        return `\x1b[48;2;${bgR};${bgG};${bgB}m`;
      })()
    : '\x1b[49m';

  const lines: string[] = [];

  for (let rowPair = 0; rowPair < 9; rowPair++) {
    const topRow = finalGrid[rowPair * 2];
    const botRow = finalGrid[rowPair * 2 + 1];

    if (noColor) {
      let mono = shiftPrefix;
      for (let c = 0; c < 18; c++) {
        const t = isLuminousOrisFeature(topRow[c]);
        const b = isLuminousOrisFeature(botRow[c]);
        mono += t && b ? '█' : t ? '▀' : b ? '▄' : ' ';
      }
      lines.push(mono + shiftSuffix);
      continue;
    }

    let ansiLine = `${defaultBgReset}${shiftPrefix}`;
    for (let c = 0; c < 18; c++) {
      const topHex = topRow[c] || (useOpaqueBg ? opaqueBgHex : null);
      const botHex = botRow[c] || (useOpaqueBg ? opaqueBgHex : null);

      if (topHex === null && botHex === null) {
        ansiLine += `${defaultBgReset} `;
      } else if (topHex !== null && botHex === null) {
        const [tr, tg, tb] = hexToRgb(topHex);
        ansiLine += `\x1b[38;2;${tr};${tg};${tb}m${defaultBgReset}▀`;
      } else if (topHex === null && botHex !== null) {
        const [br, bg, bb] = hexToRgb(botHex);
        ansiLine += `\x1b[38;2;${br};${bg};${bb}m${defaultBgReset}▄`;
      } else if (topHex === botHex) {
        const [tr, tg, tb] = hexToRgb(topHex!);
        ansiLine += `\x1b[38;2;${tr};${tg};${tb}m${defaultBgReset}█`;
      } else {
        const [tr, tg, tb] = hexToRgb(topHex!);
        const [br, bg, bb] = hexToRgb(botHex!);
        ansiLine += `\x1b[38;2;${tr};${tg};${tb}m\x1b[48;2;${br};${bg};${bb}m▀`;
      }
    }
    ansiLine += `${defaultBgReset}${shiftSuffix}\x1b[0m`;
    lines.push(ansiLine);
  }

  return lines;
}

/**
 * Low-capability / monochrome 5-row ASCII/Unicode fallback renderer for Oris.
 */
export function renderOrisAsciiLines(state: OrisMascotState): {
  lines: string[];
  color: string;
  badgeText: string;
} {
  const { actionState, eyeOffsetX, tiltDirection, blinkLong } = state;

  const shiftPad = tiltDirection < 0 ? '' : tiltDirection > 0 ? '  ' : ' ';
  const rightPad = tiltDirection < 0 ? '  ' : tiltDirection > 0 ? '' : ' ';

  let crestLeft = '✦';
  let crestRight = '✧';
  let visorInner = '◉ ◉';
  let coreLeft = '◈';
  let coreRight = '◈';
  let feetLine = '      ╰───╯      ';
  let color = ORIS_CANONICAL_DESIGN_SPEC.palette.primaryCyan;
  let badgeText = 'ORIS • IDLE';

  switch (actionState) {
    case 'blinking':
      visorInner = blinkLong ? '─ ─' : '‒ ‒';
      badgeText = blinkLong ? 'ORIS • RELAXED BLINK' : 'ORIS • BLINK';
      break;
    case 'hopping':
      crestLeft = '✧';
      crestRight = '✦';
      visorInner = '◕ ◕';
      feetLine = '     ╱╰───╯╲     ';
      badgeText = 'ORIS • CHIRP HOP ✧';
      break;
    case 'landing':
      visorInner = '◉ ◉';
      feetLine = '     ╰─────╯     ';
      badgeText = 'ORIS • SETTLE';
      break;
    case 'jumping':
      crestLeft = '✦';
      crestRight = '✦';
      visorInner = '✧ ✧';
      coreLeft = '✦';
      coreRight = '✧';
      feetLine = '    ✧ ╰───╯ ✦    ';
      color = ORIS_CANONICAL_DESIGN_SPEC.palette.accentMagenta;
      badgeText = 'ORIS • SPRING JUMP ✦ ✧';
      break;
    case 'fallen':
      crestLeft = '✧';
      crestRight = '✦';
      visorInner = '◎ ◎';
      coreLeft = '✧';
      coreRight = '✦';
      feetLine = '    ╭─┴───┴─╮    ';
      color = ORIS_CANONICAL_DESIGN_SPEC.palette.warningYellow;
      badgeText = 'ORIS • TUMBLE FLIP ✧';
      break;
    case 'tracking':
      visorInner = eyeOffsetX < 0 ? '◉◉ ' : eyeOffsetX > 0 ? ' ◉◉' : '◉ ◉';
      badgeText =
        eyeOffsetX < 0
          ? 'ORIS • TRACKING ◀'
          : eyeOffsetX > 0
            ? 'ORIS • TRACKING ▶'
            : 'ORIS • AWARE';
      break;
    case 'thinking':
      crestLeft = '✧';
      crestRight = '✦';
      visorInner = eyeOffsetX < 0 ? '◔ ◔' : eyeOffsetX > 0 ? '◕ ◕' : '◉ ◔';
      color = ORIS_CANONICAL_DESIGN_SPEC.palette.accentMagenta;
      badgeText = 'ORIS • THINKING...';
      break;
    case 'working':
      crestLeft = '✦';
      crestRight = '✦';
      visorInner = '◈ ◈';
      coreLeft = '✦';
      coreRight = '✦';
      color = ORIS_CANONICAL_DESIGN_SPEC.palette.primaryCyan;
      badgeText = 'ORIS • EXECUTING TASK';
      break;
    case 'awaiting_approval':
      crestLeft = '✦';
      crestRight = '✧';
      visorInner = '◉ ◉';
      color = ORIS_CANONICAL_DESIGN_SPEC.palette.warningYellow;
      badgeText = 'ORIS • AWAITING APPROVAL';
      break;
    case 'success':
      crestLeft = '✦';
      crestRight = '✦';
      visorInner = '✧ ✧';
      color = ORIS_CANONICAL_DESIGN_SPEC.palette.successGreen;
      badgeText = 'ORIS • VERIFIED COMPLETE ✦';
      break;
    case 'cancelled':
      crestLeft = '·';
      crestRight = '·';
      visorInner = '─ ─';
      color = ORIS_CANONICAL_DESIGN_SPEC.palette.warningYellow;
      badgeText = 'ORIS • TASK CANCELLED (ESC)';
      break;
    case 'error':
      crestLeft = '!';
      crestRight = '!';
      visorInner = '× ×';
      color = ORIS_CANONICAL_DESIGN_SPEC.palette.errorRed;
      badgeText = 'ORIS • ALERT / ERROR';
      break;
    case 'idle':
    default:
      visorInner = eyeOffsetX < 0 ? '◉◉ ' : eyeOffsetX > 0 ? ' ◉◉' : '◉ ◉';
      badgeText = '';
      break;
  }

  const lines =
    actionState === 'fallen'
      ? [
          `  ${shiftPad}✧   ╭───╮   ✦${rightPad}  `,
          ` ${shiftPad}╭───┬┴───┴┬───╮${rightPad} `,
          ` ${shiftPad}│ ${coreLeft} ╭─────╮ ${coreRight} │${rightPad} `,
          `  ${shiftPad}╰──┤ ${visorInner} ├──╯${rightPad}  `,
          feetLine
        ]
      : [
          `  ${shiftPad}${crestLeft}  ╭───╮  ${crestRight}${rightPad}  `,
          ` ${shiftPad}╭┴──┤${visorInner}├──┴╮${rightPad} `,
          ` ${shiftPad}│ ${coreLeft} ╰───╯ ${coreRight} │${rightPad} `,
          ` ${shiftPad}╰───┬───┬───╯${rightPad} `,
          feetLine
        ];

  return { lines, color, badgeText };
}

export const ORIS_MASCOT_STAGE_ROWS = 11;

export interface MascotInteractiveProps {
  ink?: InkPrimitives;
  columns: number;
  rows: number;
  vividMode: boolean;
  noColor?: boolean;
  taskLifecycle?: OrisTaskLifecycleState;
  statusCaption?: string;
  controllerRef?: React.MutableRefObject<OrisMascotController | null>;
  externalTick?: number;
  deltaMs?: number;
  cardBgHex?: string;
  opaqueBg?: boolean;
  parentDriven?: boolean;
}

export const MascotInteractive: React.FC<MascotInteractiveProps> = ({
  ink,
  columns,
  vividMode,
  noColor = false,
  taskLifecycle = 'idle',
  statusCaption,
  controllerRef,
  externalTick = 0,
  deltaMs = 80,
  cardBgHex = '#070d19',
  opaqueBg = false,
  parentDriven = false
}) => {
  const Box: React.ComponentType<any> = ink?.Box || ('div' as any);
  const Text: React.ComponentType<any> = ink?.Text || ('span' as any);
  const fallbackControllerRef = useRef<OrisMascotController | null>(null);
  if (!fallbackControllerRef.current) {
    fallbackControllerRef.current = new OrisMascotController();
  }

  const controller =
    controllerRef?.current ?? fallbackControllerRef.current;

  if (controllerRef && !controllerRef.current) {
    controllerRef.current = controller;
  }

  const lastLifecycleRef = useRef<{
    lifecycle: OrisTaskLifecycleState;
    caption?: string;
  } | null>(null);

  if (
    !lastLifecycleRef.current ||
    lastLifecycleRef.current.lifecycle !== taskLifecycle ||
    lastLifecycleRef.current.caption !== statusCaption
  ) {
    lastLifecycleRef.current = { lifecycle: taskLifecycle, caption: statusCaption };
    controller.setTaskLifecycleState(taskLifecycle, statusCaption);
  }

  const lastSteppedTickRef = useRef<number>(externalTick);
  if (!parentDriven && lastSteppedTickRef.current !== externalTick) {
    lastSteppedTickRef.current = externalTick;
    if (vividMode || taskLifecycle !== 'idle') {
      controller.step(deltaMs);
    }
  }

  const mascotState = controller.getState();
  const { color, badgeText } = renderOrisAsciiLines(mascotState);
  const pixelLines = renderOrisPixelHalfBlockLines(mascotState, {
    cardBgHex,
    opaqueBg,
    noColor
  });
  const isJumpingUp = mascotState.y < 0;

  const particleBanner =
    vividMode && mascotState.particles.length > 0
      ? mascotState.particles.map((p) => p.glyph).join('   ')
      : '';

  const stageWidth = Math.min(Math.max(22, columns - 4), 72);
  const rawCaption =
    mascotState.statusCaption ||
    (mascotState.actionState !== 'idle' && mascotState.actionState !== 'blinking'
      ? badgeText
      : '');
  const activeCaption = rawCaption ? rawCaption.slice(0, Math.max(12, stageWidth - 2)) : '';

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      width={stageWidth}
      height={ORIS_MASCOT_STAGE_ROWS}
      flexShrink={0}
    >
      {!isJumpingUp ? (
        <Text color={noColor ? undefined : '#a78bfa'}>{particleBanner || ' '}</Text>
      ) : null}
      {pixelLines.map((line, idx) => (
        <Text key={`oris_px_${idx}`}>{line}</Text>
      ))}
      {isJumpingUp ? (
        <Text color={noColor ? undefined : '#a78bfa'}>{particleBanner || ' '}</Text>
      ) : null}
      <Text color={noColor ? undefined : color} dimColor wrap="truncate-end">
        {activeCaption || ' '}
      </Text>
    </Box>
  );
};
