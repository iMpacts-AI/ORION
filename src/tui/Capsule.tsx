import React from 'react';
import { InkPrimitives } from './inkLoader';
import { HarnessEffortLevel, HarnessMode } from '../harness/ExecutionResult';
import {
  MascotInteractive,
  OrisMascotController,
  OrisTaskLifecycleState
} from './MascotInteractive';
import { Starfield } from './Starfield';
import {
  formatLogicalPath,
  resolvePublicEngineIdentity
} from '../shared/branding/OrionEngineIdentity';

export const FULL_HERO_CAPSULE_HEIGHT_ROWS = 21;
export const COMPACT_CAPSULE_HEIGHT_ROWS = 7;

export interface PromptViewportSlice {
  beforeCursor: string;
  cursorChar: string;
  afterCursor: string;
  hasLeftOverflow: boolean;
  hasRightOverflow: boolean;
}

/**
 * Computes a single-line horizontal sliding window around `cursorOffset` so long typed prompts
 * NEVER wrap the inner command box or shift outer card borders.
 */
export function computePromptViewport(
  value: string,
  cursorOffset: number,
  maxCols: number
): PromptViewportSlice {
  const safeVal = value || '';
  const safeMax = Math.max(4, maxCols);
  const clampedCursor = Math.max(0, Math.min(safeVal.length, cursorOffset));
  const padded = `${safeVal} `;
  const totalLen = padded.length;

  let winStart = 0;
  let winEnd = totalLen;
  if (totalLen > safeMax) {
    const anchor = Math.floor(safeMax * 0.75);
    winStart = Math.max(0, Math.min(clampedCursor - anchor, totalLen - safeMax));
    winEnd = winStart + safeMax;
  }

  const beforeCursor = padded.slice(winStart, clampedCursor);
  const cursorChar = padded[clampedCursor] || ' ';
  let afterCursor = padded.slice(clampedCursor + 1, winEnd);
  if (winEnd === totalLen && clampedCursor < safeVal.length && afterCursor.endsWith(' ')) {
    afterCursor = afterCursor.slice(0, -1);
  }

  return {
    beforeCursor,
    cursorChar,
    afterCursor,
    hasLeftOverflow: winStart > 0,
    hasRightOverflow: winEnd < safeVal.length
  };
}

export interface CapsuleProps {
  ink: InkPrimitives;
  inputValue: string;
  cursorOffset?: number;
  onInputChange: (val: string) => void;
  onInputSubmit: (val: string) => void;
  mode: HarnessMode;
  effort: HarnessEffortLevel;
  activeModel: string;
  activeProvider: string;
  workingDirectory: string;
  taskStatusLabel: string;
  isBusy: boolean;
  estopActive: boolean;
  vividMode: boolean;
  animationsEnabled?: boolean;
  motionActive?: boolean;
  attachedFilesCount: number;
  pendingApprovalsCount: number;
  compactHeader?: boolean;
  noColor?: boolean;
  columns?: number;
  rows?: number;
  mascotLifecycle?: OrisTaskLifecycleState;
  mascotStatusCaption?: string;
  mascotControllerRef?: React.MutableRefObject<OrisMascotController | null>;
  parentDrivenMascot?: boolean;
  externalTick?: number;
  deltaMs?: number;
  inputFocused?: boolean;
}

export const ORION_WORDMARK_LINES = [
  '  ██████╗ ██████╗ ██╗ ██████╗ ███╗   ██╗ ',
  ' ██╔═══██╗██╔══██╗██║██╔═══██╗████╗  ██║ ',
  ' ██║   ██║██████╔╝██║██║   ██║██╔██╗ ██║ ',
  ' ██║   ██║██╔══██╗██║██║   ██║██║╚██╗██║ ',
  ' ╚██████╔╝██║  ██║██║╚██████╔╝██║ ╚████║ ',
  '  ╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝ '
] as const;

export const ORION_GEOMETRIC_TITLE_LINES = [
  '▄█▀▀█▄ ██▀▀█▄ ██ ▄█▀▀█▄ ██▄ ██',
  '▀█▄▄█▀ ██▀ █▄ ██ ▀█▄▄█▀ ██ ▀██'
] as const;

/**
 * Reference-Faithful Centered Hero Card & Command Capsule (`src/tui/Capsule.tsx`).
 * Enforces deterministic fixed row heights (`21` rows in full hero mode, `7` rows in compact mode),
 * `flexShrink={0}` border protection, single-owner cursor/input rendering (zero competing `useInput` hooks),
 * and adaptive single-line shortcut/badge truncation across all terminal dimensions.
 */
export const Capsule: React.FC<CapsuleProps> = ({
  ink,
  inputValue,
  cursorOffset,
  mode,
  effort,
  activeModel,
  activeProvider,
  workingDirectory,
  taskStatusLabel,
  isBusy,
  estopActive,
  vividMode,
  animationsEnabled = true,
  motionActive,
  attachedFilesCount,
  pendingApprovalsCount,
  compactHeader = false,
  noColor = Boolean(process.env.NO_COLOR),
  columns = 100,
  rows = 30,
  mascotLifecycle = 'idle',
  mascotStatusCaption,
  mascotControllerRef,
  parentDrivenMascot = false,
  externalTick = 0,
  deltaMs = 120,
  inputFocused = true
}) => {
  const { Box, Text } = ink;

  const modeBadgeColor =
    mode === 'Build' ? '#fde047' : mode === 'Plan' ? '#38bdf8' : '#c084fc';

  const safeCols = Math.max(44, columns);
  const cardWidth = compactHeader
    ? Math.min(Math.max(44, safeCols - 4), 108)
    : Math.min(Math.max(48, safeCols - 12), 82);

  // Outer card has 2 border cols + 2 paddingX cols (`paddingX={1}`) = 4 cols overhead
  const outerInnerCols = Math.max(36, cardWidth - 4);
  // Inner command box has 2 border cols + 2 paddingX cols (`paddingX={1}`) = 4 cols overhead
  const commandBoxInnerCols = Math.max(28, outerInnerCols - 4);

  const sideSpaceCols = Math.max(0, Math.floor((safeCols - cardWidth) / 2));
  const showSideStars = !compactHeader && vividMode && sideSpaceCols >= 8;
  const effectiveMotionActive =
    typeof motionActive === 'boolean' ? motionActive : Boolean(vividMode && animationsEnabled);
  const busyGlyph = effectiveMotionActive ? '⟳' : '⋯';

  const rawEngineLabel = resolvePublicEngineIdentity(activeProvider, activeModel).shortBadge;
  const maxEngineChars = commandBoxInnerCols >= 64 ? 26 : commandBoxInnerCols >= 50 ? 16 : 12;
  const engineLabel =
    rawEngineLabel.length > maxEngineChars
      ? `${rawEngineLabel.slice(0, Math.max(6, maxEngineChars - 1))}…`
      : rawEngineLabel;

  const modeText = commandBoxInnerCols >= 52 ? `[${mode.toUpperCase()} MODE]` : `[${mode.toUpperCase()}]`;
  const effortText =
    effort !== 'medium' && commandBoxInnerCols >= 58 ? ` [Effort: ${effort.toUpperCase()}]` : '';
  const attachText = attachedFilesCount > 0 ? ` [@${attachedFilesCount}]` : '';
  const statusSuffix = estopActive
    ? ' [⚠ E-STOP]'
    : pendingApprovalsCount > 0
      ? ' [⏳ APPROVAL]'
      : isBusy
        ? ` [${busyGlyph} ${taskStatusLabel.slice(0, 12)}]`
        : '';

  const showEngineBadge = commandBoxInnerCols >= 44;
  const engineFullText = showEngineBadge ? ` [Engine: ${engineLabel}]` : '';
  const badgesTotalLen =
    modeText.length +
    effortText.length +
    engineFullText.length +
    attachText.length +
    statusSuffix.length;

  // Reserve 2 cols for `'> '` and 2 cols safety margin before right-side badges
  const maxPromptCols = Math.max(6, commandBoxInnerCols - badgesTotalLen - 4);
  const activeCursor =
    typeof cursorOffset === 'number' ? cursorOffset : (inputValue || '').length;
  const viewport = computePromptViewport(inputValue, activeCursor, maxPromptCols);

  // Format prompt + cursor as a single flat `#text` child inside `<Text>` to bypass Ink 5.2.1's
  // `insertBeforeNode` missing-`markNodeAsDirty` bug (all CSI tokens strictly <= 18 bytes).
  const promptPrefixAnsi = noColor
    ? '> '
    : '\x1b[1m\x1b[38;2;56;189;248m> \x1b[22m\x1b[39m';
  const cursorAnsi = !inputFocused
    ? viewport.cursorChar.trimEnd()
    : viewport.cursorChar === ' '
      ? noColor
        ? '█'
        : '\x1b[38;2;56;189;248m█\x1b[39m'
      : `\x1b[7m${viewport.cursorChar}\x1b[27m`;
  const formattedPromptLine = `${promptPrefixAnsi}${viewport.beforeCursor}${cursorAnsi}${viewport.afterCursor}`;

  const renderInnerCommandBox = () => (
    <Box
      borderStyle="round"
      borderColor={
        noColor
          ? undefined
          : estopActive
            ? 'red'
            : pendingApprovalsCount > 0
              ? 'yellow'
              : isBusy
                ? '#38bdf8'
                : '#3b5998'
      }
      paddingX={1}
      width={outerInnerCols}
      justifyContent="space-between"
      flexShrink={0}
    >
      <Box width={maxPromptCols + 3} flexShrink={0}>
        <Text>{formattedPromptLine}</Text>
      </Box>

      <Box flexShrink={0}>
        <Text bold color={noColor ? undefined : modeBadgeColor}>
          {modeText}
        </Text>
        {effortText ? (
          <Text color={noColor ? undefined : '#94a3b8'}>{effortText}</Text>
        ) : null}
        {showEngineBadge ? (
          <>
            <Text color={noColor ? undefined : '#7dd3fc'}> [Engine: </Text>
            <Text bold color={noColor ? undefined : '#c084fc'}>
              {engineLabel}
            </Text>
            <Text color={noColor ? undefined : '#7dd3fc'}>]</Text>
          </>
        ) : null}
        {attachText ? (
          <Text color={noColor ? undefined : '#34d399'}>{attachText}</Text>
        ) : null}
        {estopActive ? (
          <Text bold color={noColor ? undefined : 'red'}>
            {statusSuffix}
          </Text>
        ) : pendingApprovalsCount > 0 ? (
          <Text bold color={noColor ? undefined : 'yellow'}>
            {statusSuffix}
          </Text>
        ) : isBusy ? (
          <Text color={noColor ? undefined : '#38bdf8'}>{statusSuffix}</Text>
        ) : null}
      </Box>
    </Box>
  );

  const shortcutBar =
    outerInnerCols >= 76 ? (
      <Box justifyContent="center" width={outerInnerCols} flexShrink={0}>
        <Text color={noColor ? undefined : '#cbd5e1'} wrap="truncate-end">
          Tab: Mode <Text color={noColor ? undefined : '#475569'}>|</Text> S-Tab: Effort{' '}
          <Text color={noColor ? undefined : '#475569'}>|</Text> Alt+T: Tip{' '}
          <Text color={noColor ? undefined : '#475569'}>|</Text> ^P: Status{' '}
          <Text color={noColor ? undefined : '#475569'}>|</Text> /: Skills{' '}
          <Text color={noColor ? undefined : '#475569'}>|</Text> Esc: Cancel
        </Text>
      </Box>
    ) : outerInnerCols >= 56 ? (
      <Box justifyContent="center" width={outerInnerCols} flexShrink={0}>
        <Text color={noColor ? undefined : '#cbd5e1'} wrap="truncate-end">
          Tab Mode <Text color={noColor ? undefined : '#475569'}>·</Text> S-Tab Effort{' '}
          <Text color={noColor ? undefined : '#475569'}>·</Text> ^P Status{' '}
          <Text color={noColor ? undefined : '#475569'}>·</Text> / Skills{' '}
          <Text color={noColor ? undefined : '#475569'}>·</Text> Esc
        </Text>
      </Box>
    ) : (
      <Box justifyContent="center" width={outerInnerCols} flexShrink={0}>
        <Text color={noColor ? undefined : '#cbd5e1'} wrap="truncate-end">
          Tab Mode · / Skills · ^P · Esc
        </Text>
      </Box>
    );

  if (compactHeader) {
    const statusText = isBusy ? `${busyGlyph} ${taskStatusLabel}` : `● ${taskStatusLabel}`;
    const logicalCwd = formatLogicalPath(workingDirectory, workingDirectory);
    const maxCwdLen = Math.max(10, outerInnerCols - 22 - statusText.length);
    const displayCwd =
      logicalCwd.length > maxCwdLen
        ? `…${logicalCwd.slice(-(maxCwdLen - 1))}`
        : logicalCwd;

    return (
      <Box flexDirection="column" width="100%" alignItems="center" flexShrink={0}>
        <Box
          flexDirection="column"
          width={cardWidth}
          borderStyle="round"
          borderColor={noColor ? undefined : '#4b6ea8'}
          paddingX={1}
          paddingY={0}
          flexShrink={0}
        >
          <Box justifyContent="space-between" width="100%" flexShrink={0}>
            <Box flexShrink={1}>
              <Text bold color={noColor ? undefined : '#e2e8f0'}>
                iMpacts-AI
              </Text>
              <Text color={noColor ? undefined : '#475569'}> • </Text>
              <Text bold color={noColor ? undefined : '#ffffff'}>
                ORION
              </Text>
              <Text dimColor wrap="truncate-end">
                {' '}
                • {displayCwd}
              </Text>
            </Box>
            <Box flexShrink={0}>
              <Text color={noColor ? undefined : isBusy ? '#38bdf8' : '#10b981'}>
                {statusText}
              </Text>
            </Box>
          </Box>
          {renderInnerCommandBox()}
          {shortcutBar}
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="row" width="100%" justifyContent="center" alignItems="center" flexShrink={0}>
      {showSideStars ? (
        <Starfield
          ink={ink}
          columns={sideSpaceCols - 1}
          rows={19}
          vividMode={vividMode}
          animationsEnabled={animationsEnabled}
          noColor={noColor}
          externalTick={externalTick}
          deltaMs={deltaMs}
          seedOffset={17}
        />
      ) : null}

      <Box
        flexDirection="column"
        width={cardWidth}
        borderStyle="round"
        borderColor={noColor ? undefined : '#4b6ea8'}
        paddingX={1}
        paddingY={0}
        alignItems="center"
        flexShrink={0}
      >
        <MascotInteractive
          ink={ink}
          columns={outerInnerCols}
          rows={rows}
          vividMode={vividMode}
          animationsEnabled={animationsEnabled}
          noColor={noColor}
          taskLifecycle={mascotLifecycle}
          statusCaption={mascotStatusCaption}
          controllerRef={mascotControllerRef}
          externalTick={externalTick}
          deltaMs={deltaMs}
          cardBgHex="#070d19"
          parentDriven={parentDrivenMascot}
        />

        <Box justifyContent="center" width="100%" marginTop={0} flexShrink={0}>
          <Text bold color={noColor ? undefined : '#e2e8f0'}>
            iMpacts-AI
          </Text>
        </Box>

        <Box flexDirection="column" alignItems="center" width="100%" marginBottom={1} flexShrink={0}>
          {ORION_GEOMETRIC_TITLE_LINES.map((line, idx) => (
            <Text key={`orion-geo-${idx}`} bold color={noColor ? undefined : '#ffffff'}>
              {line}
            </Text>
          ))}
        </Box>

        {renderInnerCommandBox()}

        <Box width="100%" marginTop={0} flexShrink={0}>
          {shortcutBar}
        </Box>
      </Box>

      {showSideStars ? (
        <Starfield
          ink={ink}
          columns={sideSpaceCols - 1}
          rows={19}
          vividMode={vividMode}
          animationsEnabled={animationsEnabled}
          noColor={noColor}
          externalTick={externalTick}
          deltaMs={deltaMs}
          seedOffset={53}
        />
      ) : null}
    </Box>
  );
};
