import React, { useEffect, useState, useMemo, useRef } from 'react';
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
  const safeCols = Math.max(12, columns);
  const safeRows = Math.max(2, Math.min(rows, 28));
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
  const safeCols = Math.max(12, columns);
  const safeRows = Math.max(2, Math.min(28, rows || 5));
  const dtSec = Math.max(0.01, Math.min(deltaMs, 500) / 1000);

  return stars.map(s => {
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

interface CellDescriptor {
  glyph: string;
  ansiPrefix: string;
}

const ANSI_RESET = '\x1b[0m';
const ANSI_SHOOTING_HEAD = '\x1b[1;38;2;224;242;254m';
const ANSI_SHOOTING_MID = '\x1b[38;2;56;189;248m';
const ANSI_SHOOTING_TAIL = '\x1b[38;2;59;130;246m';
const ANSI_STAR_BRIGHT = '\x1b[1;38;2;241;245;249m';
const ANSI_STAR_CYAN = '\x1b[38;2;125;211;252m';
const ANSI_STAR_VIOLET = '\x1b[38;2;196;181;253m';
const ANSI_STAR_DIM = '\x1b[38;2;100;116;139m';

export const Starfield: React.FC<StarfieldProps> = ({
  ink,
  columns,
  rows,
  vividMode,
  noColor = false,
  externalTick,
  deltaMs = 180,
  seedOffset = 0
}) => {
  const Box: React.ComponentType<any> = ink?.Box || ('div' as any);
  const Text: React.ComponentType<any> = ink?.Text || ('span' as any);
  const fieldHeight = Math.max(1, Math.min(24, rows || 3));
  const fieldWidth = Math.max(12, columns);

  const maxStarsForBand = Math.min(42, Math.max(6, Math.floor((fieldWidth * fieldHeight) / 18)));

  const initialStars = useMemo(
    () => generateDeterministicStars(fieldWidth, fieldHeight, maxStarsForBand, seedOffset),
    [fieldWidth, fieldHeight, maxStarsForBand, seedOffset]
  );

  const [stars, setStars] = useState<StarParticle[]>(initialStars);
  const [internalTick, setInternalTick] = useState(0);
  const [shootingStar, setShootingStar] = useState<ShootingStar>(() =>
    vividMode && fieldHeight >= 3 && fieldWidth >= 24 && seedOffset % 2 === 0
      ? {
          active: true,
          x: Math.min(fieldWidth - 5, Math.max(8, Math.floor(fieldWidth * 0.82))),
          y: Math.min(fieldHeight - 1, 2),
          dx: -2,
          dy: 1,
          stepsRemaining: 3
        }
      : {
          active: false,
          x: 0,
          y: 0,
          dx: -2,
          dy: 1,
          stepsRemaining: 0
        }
  );

  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    setStars(initialStars);
  }, [initialStars]);

  useEffect(() => {
    if (!vividMode) return;
    if (externalTick !== undefined) {
      setStars(prev => stepStarfieldParallax(prev, fieldWidth, fieldHeight, deltaMs));
      setShootingStar(prev => {
        if (prev.active && prev.stepsRemaining > 0) {
          const nx = prev.x + prev.dx;
          const ny = prev.y + prev.dy;
          if (nx < 2 || nx >= fieldWidth - 2 || ny >= fieldHeight || ny < 0) {
            return { ...prev, active: false, stepsRemaining: 0 };
          }
          return {
            ...prev,
            x: nx,
            y: ny,
            stepsRemaining: prev.stepsRemaining - 1
          };
        }
        if (fieldHeight >= 2 && fieldWidth >= 18 && externalTick > 0 && (externalTick + seedOffset) % 13 === 0) {
          const startX = Math.min(
            fieldWidth - 4,
            Math.max(6, ((externalTick * 11 + seedOffset * 7) % Math.max(8, fieldWidth - 8)) + 6)
          );
          return {
            active: true,
            x: startX,
            y: Math.min(fieldHeight - 1, 1),
            dx: -2,
            dy: 1,
            stepsRemaining: 3
          };
        }
        return prev;
      });
      return;
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const dt = now - lastUpdateRef.current;
      lastUpdateRef.current = now;
      setInternalTick(prev => prev + 1);
      setStars(prev => stepStarfieldParallax(prev, fieldWidth, fieldHeight, dt));
    }, 240);

    if (typeof timer.unref === 'function') {
      timer.unref();
    }
    return () => clearInterval(timer);
  }, [vividMode, externalTick, deltaMs, fieldWidth, fieldHeight, seedOffset]);

  if (!vividMode) {
    return (
      <Box flexDirection="column" width={fieldWidth} marginBottom={0}>
        {Array.from({ length: fieldHeight }, (_, idx) => (
          <Text key={idx} dimColor={!noColor}>
            {idx === Math.floor(fieldHeight / 2)
              ? '     ·       '.repeat(Math.max(2, Math.floor(fieldWidth / 13))).slice(0, fieldWidth)
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

  // Diagonal shooting star matching the Gemini deep-space reference (`✦` head bottom-left + `╱` cyan trail up-right)
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
    } else if (hy >= 0 && hy < fieldHeight && hx + 2 >= 0 && hx + 2 < fieldWidth && fieldHeight === 1) {
      grid[hy][hx + 1] = { glyph: '─', ansiPrefix: ANSI_SHOOTING_MID };
      grid[hy][hx + 2] = { glyph: '·', ansiPrefix: ANSI_SHOOTING_TAIL };
    }
  }

  const renderedRows = grid.map((rowCells) => {
    if (noColor) {
      return rowCells.map(c => (c ? c.glyph : ' ')).join('');
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
    <Box flexDirection="column" width={fieldWidth}>
      {renderedRows.map((line, rIdx) => (
        <Text key={rIdx}>{line}</Text>
      ))}
    </Box>
  );
};
