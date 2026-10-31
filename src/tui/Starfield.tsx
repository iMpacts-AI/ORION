import React, { useEffect, useMemo, useState } from 'react';
import { InkPrimitives } from './inkLoader';

export type StarParallaxLayer = 'far' | 'mid' | 'near';

export interface StarParticle {
  id: number;
  x: number;
  y: number;
  vx: number; // horizontal drift velocity (cols per second)
  vy: number; // vertical drift velocity (rows per second)
  layer: StarParallaxLayer;
  glyphIndex: number;
  twinklePhase: number;
  twinkleSpeed: number;
  brightness: 'dim' | 'normal' | 'bright';
}

export interface ShootingStar {
  active: boolean;
  x: number;
  y: number;
  dx: number;
  dy: number;
  stepsRemaining: number;
}

export interface StarfieldProps {
  ink?: InkPrimitives;
  columns: number;
  rows: number;
  vividMode: boolean;
  animationsEnabled?: boolean;
  noColor?: boolean;
  externalTick?: number;
  deltaMs?: number;
  seedOffset?: number;
}

const STAR_GLYPHS = ['·', '·', '+', '✦', '✧'] as const;

export function createBoundedStarParticles(
  columns: number,
  rows: number,
  vivid: boolean = true
): StarParticle[] {
  const maxCount = vivid ? 26 : 6;
  return generateDeterministicStars(columns, rows, maxCount);
}

/**
 * Generates deterministic multi-layer parallax stars (`far`, `mid`, `near`) moving slowly in
 * different directions/speeds with subtle twinkling and brightness variation.
 */
export function generateDeterministicStars(
  columns: number,
  rows: number,
  maxStars: number = 28,
  seedOffset: number = 0
): StarParticle[] {
  const safeCols = Math.max(4, columns);
  const safeRows = Math.max(1, Math.min(rows, 28));
  const count = Math.min(maxStars, Math.max(4, Math.floor((safeCols * safeRows) / 22)));
  const stars: StarParticle[] = [];

  for (let i = 0; i < count; i++) {
    const seed = (i + 1 + seedOffset * 17) * 2654435761;
    const layer: StarParallaxLayer = i % 3 === 0 ? 'far' : i % 3 === 1 ? 'mid' : 'near';
    // Far layer drifts slowly left, mid layer drifts slowly right, near layer drifts diagonally
    const vx = layer === 'far' ? -0.35 : layer === 'mid' ? 0.65 : 1.15;
    const vy = layer === 'near' ? 0.12 : 0;
    const brightness: StarParticle['brightness'] =
      layer === 'far' ? 'dim' : layer === 'mid' ? 'normal' : 'bright';

    stars.push({
      id: i,
      x: Math.abs(seed) % safeCols,
      y: Math.abs(seed >> 4) % safeRows,
      vx,
      vy,
      layer,
      glyphIndex: Math.abs(seed >> 8) % STAR_GLYPHS.length,
      twinklePhase: Math.abs(seed >> 12) % 10,
      twinkleSpeed: 1 + (i % 3),
      brightness
    });
  }
  return stars;
}

/**
 * Advances multi-layer parallax star coordinates and twinkling brightness using delta-time (`deltaMs`)
 * so star motion remains smooth even if terminal rendering frames drop.
 */
export function stepStarfieldParallax(
  stars: StarParticle[],
  columns: number,
  rows: number,
  deltaMs: number
): StarParticle[] {
  const safeCols = Math.max(4, columns);
  const safeRows = Math.max(1, Math.min(28, rows || 5));
  const dtSec = Math.max(0.01, Math.min(deltaMs, 500) / 1000);

  return stars.map((s) => {
    let nextX = (s.x + s.vx * dtSec) % safeCols;
    if (nextX < 0) nextX += safeCols;

    let nextY = (s.y + s.vy * dtSec) % safeRows;
    if (nextY < 0) nextY += safeRows;

    const nextPhase = (s.twinklePhase + s.twinkleSpeed * dtSec * 3) % 12;
    const glyphIdx = Math.floor(nextPhase) % STAR_GLYPHS.length;
    const brightness: StarParticle['brightness'] =
      nextPhase > 9
        ? 'bright'
        : nextPhase < 4 || s.layer === 'far'
          ? 'dim'
          : 'normal';

    return {
      ...s,
      x: nextX,
      y: nextY,
      twinklePhase: nextPhase,
      glyphIndex: glyphIdx,
      brightness
    };
  });
}

/**
 * Pure closed-form starfield projection at `tick`, avoiding cascading child `useEffect` -> `setState`
 * re-renders when driven by the parent's single coordinated frame scheduler.
 */
export function projectStarfieldAtTick(
  initialStars: StarParticle[],
  columns: number,
  rows: number,
  tick: number,
  tickDeltaMs: number,
  vividMode: boolean,
  seedOffset: number
): { stars: StarParticle[]; shootingStar: ShootingStar } {
  const safeCols = Math.max(4, columns);
  const safeRows = Math.max(1, Math.min(24, rows));

  if (!vividMode || tick <= 0) {
    const initialShooting: ShootingStar =
      vividMode && safeRows >= 3 && safeCols >= 24 && seedOffset % 2 === 0
        ? {
            active: true,
            x: Math.min(safeCols - 5, Math.max(8, Math.floor(safeCols * 0.82))),
            y: Math.min(safeRows - 1, 2),
            dx: -2,
            dy: 1,
            stepsRemaining: 3
          }
        : { active: false, x: 0, y: 0, dx: -2, dy: 1, stepsRemaining: 0 };
    return { stars: initialStars, shootingStar: initialShooting };
  }

  const clampedDtSec = Math.max(0.016, Math.min(tickDeltaMs || 220, 400) / 1000);
  const totalSec = tick * clampedDtSec;
  const isNarrowSideBand = safeCols <= 28;
  const speedScale = isNarrowSideBand ? 0.28 : 0.65;
  const twinkleScale = isNarrowSideBand ? 0.35 : 0.75;

  const projectedStars: StarParticle[] = initialStars.map((s) => {
    let nextX = (s.x + s.vx * totalSec * speedScale) % safeCols;
    if (nextX < 0) nextX += safeCols;

    let nextY = isNarrowSideBand ? s.y : (s.y + s.vy * totalSec * speedScale) % safeRows;
    if (nextY < 0) nextY += safeRows;

    const nextPhase = (s.twinklePhase + s.twinkleSpeed * totalSec * twinkleScale) % 12;
    const glyphIdx = Math.floor(nextPhase) % STAR_GLYPHS.length;
    const brightness: StarParticle['brightness'] =
      nextPhase > 9
        ? 'bright'
        : nextPhase < 4 || s.layer === 'far'
          ? 'dim'
          : 'normal';

    return {
      ...s,
      x: nextX,
      y: nextY,
      twinklePhase: nextPhase,
      glyphIndex: glyphIdx,
      brightness
    };
  });

  let shootingStar: ShootingStar = {
    active: false,
    x: 0,
    y: 0,
    dx: -2,
    dy: 1,
    stepsRemaining: 0
  };

  if (safeRows >= 2 && safeCols >= 36) {
    const cycleOffset = tick + seedOffset;
    const stepInCycle = cycleOffset % 31;
    if (stepInCycle <= 2) {
      const launchTick = tick - stepInCycle;
      if (launchTick >= 0) {
        const startX =
          launchTick === 0 && seedOffset % 2 === 0 && safeRows >= 3 && safeCols >= 24
            ? Math.min(safeCols - 5, Math.max(8, Math.floor(safeCols * 0.82)))
            : Math.min(
                safeCols - 4,
                Math.max(
                  6,
                  ((Math.max(1, launchTick) * 11 + seedOffset * 7) % Math.max(8, safeCols - 8)) + 6
                )
              );
        const startY =
          launchTick === 0 && seedOffset % 2 === 0 && safeRows >= 3
            ? Math.min(safeRows - 1, 2)
            : Math.min(safeRows - 1, 1);
        const curX = startX - 2 * stepInCycle;
        const curY = startY + stepInCycle;
        if (curX >= 2 && curX < safeCols - 2 && curY >= 0 && curY < safeRows) {
          shootingStar = {
            active: true,
            x: curX,
            y: curY,
            dx: -2,
            dy: 1,
            stepsRemaining: 3 - stepInCycle
          };
        }
      }
    }
  }

  return { stars: projectedStars, shootingStar };
}

interface CellDescriptor {
  glyph: string;
  ansiPrefix: string;
}

/**
 * IMPORTANT: Every individual CSI escape token below MUST remain <= 19 bytes so
 * Ink's `@alcalzone/ansi-tokenize` (`string.slice(offset, offset + 19)`) parses
 * 100% of tokens without slicing trailing digits/`m` into visible grid cells.
 */
const ANSI_RESET = '\x1b[0m';
const ANSI_SHOOTING_HEAD = '\x1b[1m\x1b[38;2;224;242;254m';
const ANSI_SHOOTING_MID = '\x1b[38;2;56;189;248m';
const ANSI_SHOOTING_TAIL = '\x1b[38;2;59;130;246m';
const ANSI_STAR_BRIGHT = '\x1b[1m\x1b[38;2;241;245;249m';
const ANSI_STAR_CYAN = '\x1b[38;2;125;211;252m';
const ANSI_STAR_VIOLET = '\x1b[38;2;196;181;253m';
const ANSI_STAR_DIM = '\x1b[38;2;100;116;139m';

const StarfieldInner: React.FC<StarfieldProps> = ({
  ink,
  columns,
  rows,
  vividMode,
  animationsEnabled = true,
  noColor = false,
  externalTick,
  deltaMs = 220,
  seedOffset = 0
}) => {
  const Box: React.ComponentType<any> = ink?.Box || ('div' as any);
  const Text: React.ComponentType<any> = ink?.Text || ('span' as any);

  const fieldHeight = Math.max(0, Math.min(24, rows ?? 0));
  const fieldWidth = Math.max(0, columns ?? 0);

  const [internalTick, setInternalTick] = useState(0);

  // Fallback internal timer ONLY when rendered standalone without a parent coordinated scheduler
  useEffect(() => {
    if (
      !vividMode ||
      !animationsEnabled ||
      externalTick !== undefined ||
      fieldHeight <= 0 ||
      fieldWidth < 4
    ) {
      return;
    }
    const timer = setInterval(() => {
      setInternalTick((prev) => prev + 1);
    }, 280);

    if (typeof timer.unref === 'function') {
      timer.unref();
    }
    return () => clearInterval(timer);
  }, [vividMode, animationsEnabled, externalTick, fieldHeight, fieldWidth]);

  const safeWidth = Math.max(4, fieldWidth);
  const safeHeight = Math.max(1, fieldHeight);
  const isSideBand = safeWidth <= 28 && safeHeight >= 12;
  const maxStarsForBand = isSideBand
    ? Math.min(5, Math.max(3, Math.floor((safeWidth * safeHeight) / 80)))
    : Math.min(26, Math.max(4, Math.floor((safeWidth * safeHeight) / 26)));

  const initialStars = useMemo(() => {
    const base = generateDeterministicStars(safeWidth, safeHeight, maxStarsForBand, seedOffset);
    if (!isSideBand) return base;
    // Keep side-band atmospheric stars off the 9 central 24-bit Oris rows (rows 1..10) so side twinkles
    // never force unnecessary 24-bit truecolor Oris sprite row re-serialization on ConPTY.
    const safeSideRows = [0, 11, 13, 15, 17, 18].filter((r) => r < safeHeight);
    if (safeSideRows.length === 0) return base;
    return base.map((star, idx) => ({
      ...star,
      y: safeSideRows[idx % safeSideRows.length],
      vy: 0
    }));
  }, [safeWidth, safeHeight, maxStarsForBand, seedOffset, isSideBand]);

  const activeTick = !animationsEnabled
    ? 0
    : externalTick !== undefined
      ? externalTick
      : internalTick;

  const { stars, shootingStar } = useMemo(
    () =>
      projectStarfieldAtTick(
        initialStars,
        safeWidth,
        safeHeight,
        activeTick,
        deltaMs,
        vividMode,
        seedOffset
      ),
    [initialStars, safeWidth, safeHeight, activeTick, deltaMs, vividMode, seedOffset]
  );

  if (fieldHeight <= 0 || fieldWidth < 4) {
    return null;
  }

  if (!vividMode) {
    return (
      <Box flexDirection="column" width={fieldWidth} height={fieldHeight} flexShrink={0}>
        {Array.from({ length: fieldHeight }, (_, idx) => (
          <Text key={idx} dimColor={!noColor}>
            {idx === Math.floor(fieldHeight / 2)
              ? '     ·       '
                  .repeat(Math.max(1, Math.ceil(fieldWidth / 13)))
                  .slice(0, fieldWidth)
              : ' '.repeat(fieldWidth)}
          </Text>
        ))}
      </Box>
    );
  }

  const grid: Array<Array<CellDescriptor | null>> = Array.from({ length: fieldHeight }, () =>
    Array.from({ length: fieldWidth }, () => null)
  );

  for (const star of stars) {
    const sx = Math.floor(star.x) % fieldWidth;
    const sy = Math.floor(star.y) % fieldHeight;
    if (sy >= 0 && sy < fieldHeight && sx >= 0 && sx < fieldWidth) {
      const glyph = STAR_GLYPHS[star.glyphIndex];
      const ansiPrefix =
        star.brightness === 'bright'
          ? ANSI_STAR_BRIGHT
          : star.brightness === 'dim'
            ? ANSI_STAR_DIM
            : star.id % 4 === 0
              ? ANSI_STAR_VIOLET
              : ANSI_STAR_CYAN;
      grid[sy][sx] = { glyph, ansiPrefix };
    }
  }

  if (shootingStar.active && shootingStar.stepsRemaining > 0) {
    const hx = shootingStar.x;
    const hy = shootingStar.y;
    if (hy >= 0 && hy < fieldHeight && hx >= 0 && hx < fieldWidth) {
      grid[hy][hx] = { glyph: '✦', ansiPrefix: ANSI_SHOOTING_HEAD };
    }
    if (hy - 1 >= 0 && hy - 1 < fieldHeight && hx + 1 >= 0 && hx + 1 < fieldWidth) {
      grid[hy - 1][hx + 1] = { glyph: '╱', ansiPrefix: ANSI_SHOOTING_MID };
    }
    if (hy - 2 >= 0 && hy - 2 < fieldHeight && hx + 2 >= 0 && hx + 2 < fieldWidth) {
      grid[hy - 2][hx + 2] = { glyph: '·', ansiPrefix: ANSI_SHOOTING_TAIL };
    } else if (
      hy >= 0 &&
      hy < fieldHeight &&
      hx + 2 >= 0 &&
      hx + 2 < fieldWidth &&
      fieldHeight === 1
    ) {
      grid[hy][hx + 1] = { glyph: '─', ansiPrefix: ANSI_SHOOTING_MID };
      grid[hy][hx + 2] = { glyph: '·', ansiPrefix: ANSI_SHOOTING_TAIL };
    }
  }

  const renderedRows = grid.map((rowCells) => {
    if (noColor) {
      return rowCells.map((c) => (c ? c.glyph : ' ')).join('');
    }
    let out = '';
    for (let c = 0; c < rowCells.length; c++) {
      const cell = rowCells[c];
      if (!cell) {
        out += ' ';
      } else {
        out += `${cell.ansiPrefix}${cell.glyph}${ANSI_RESET}`;
      }
    }
    return out;
  });

  return (
    <Box flexDirection="column" width={fieldWidth} height={fieldHeight} flexShrink={0}>
      {renderedRows.map((line, rIdx) => (
        <Text key={rIdx}>{line}</Text>
      ))}
    </Box>
  );
};

export const Starfield: React.FC<StarfieldProps> = React.memo(StarfieldInner);
