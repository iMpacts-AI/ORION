import React from 'react';
import { InkPrimitives } from './inkLoader';
import { HarnessEffortLevel, HarnessMode } from '../harness/ExecutionResult';
import {
  MascotInteractive,
  OrisMascotController,
  OrisTaskLifecycleState
} from './MascotInteractive';
import { Starfield } from './Starfield';

export interface CapsuleProps {
  ink: InkPrimitives;
  inputValue: string;
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
  attachedFilesCount: number;
  pendingApprovalsCount: number;
  compactHeader?: boolean;
  noColor?: boolean;
  columns?: number;
  rows?: number;
  mascotLifecycle?: OrisTaskLifecycleState;
  mascotStatusCaption?: string;
  mascotControllerRef?: React.MutableRefObject<OrisMascotController | null>;
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
 * Matches the approved Gemini reference layout:
 * 1. Centered rounded slate-blue outer card (`#4b6ea8` border) surrounded by deep-space starfields.
 * 2. Canonical 18x18 pixel-art Oris mascot centered at top (`#070d19` card background).
 * 3. Centered `iMpacts-AI` branding above crisp geometric white `ORION` wordmark.
 * 4. Inner rounded command box with `>` chevron, live cursor/input, and truthful `[MODE]` + `[Engine: provider/model]` badges.
 * 5. Actionable shortcut bar (`Tab: Mode | Shift+Tab: Effort | Ctrl+P: Status | @: Attach | /: Skills | Esc: Cancel`).
 */
export const Capsule: React.FC<CapsuleProps> = ({
  ink,
  inputValue,
  onInputChange,
  onInputSubmit,
  mode,
  effort,
  activeModel,
  activeProvider,
  workingDirectory,
  taskStatusLabel,
  isBusy,
  estopActive,
  vividMode,
  attachedFilesCount,
  pendingApprovalsCount,
  compactHeader = false,
  noColor = Boolean(process.env.NO_COLOR),
  columns = 100,
  rows = 30,
  mascotLifecycle = 'idle',
  mascotStatusCaption,
  mascotControllerRef,
  externalTick = 0,
  deltaMs = 120,
  inputFocused = true
}) => {
  const { Box, Text, TextInput } = ink;

  const modeBadgeColor =
    mode === 'Build' ? '#fde047' : mode === 'Plan' ? '#38bdf8' : '#c084fc';

  const cardWidth = Math.min(Math.max(54, columns - 16), 82);
  const sideSpaceCols = Math.max(0, Math.floor((columns - cardWidth) / 2));
  const showSideStars = !compactHeader && vividMode && sideSpaceCols >= 8;

  const engineLabel = `${activeProvider}/${activeModel}`;

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
      width="100%"
      justifyContent="space-between"
    >
      <Box flexGrow={1}>
        <Text bold color={noColor ? undefined : '#38bdf8'}>
          {'> '}
        </Text>
        <TextInput
          value={inputValue}
          onChange={onInputChange}
          onSubmit={onInputSubmit}
          placeholder=""
          focus={inputFocused}
          showCursor={true}
        />
      </Box>

      <Box flexShrink={0}>
        <Text bold color={noColor ? undefined : modeBadgeColor}>
          [{mode.toUpperCase()} MODE]
        </Text>
        {effort !== 'medium' ? (
          <Text color={noColor ? undefined : '#94a3b8'}>
            {' '}
            [Effort: {effort.toUpperCase()}]
          </Text>
        ) : null}
        <Text color={noColor ? undefined : '#7dd3fc'}> [Engine: </Text>
        <Text bold color={noColor ? undefined : '#c084fc'}>
          {engineLabel}
        </Text>
        <Text color={noColor ? undefined : '#7dd3fc'}>]</Text>
        {attachedFilesCount > 0 ? (
          <Text color={noColor ? undefined : '#34d399'}>
            {' '}
            [@{attachedFilesCount}]
          </Text>
        ) : null}
        {estopActive ? (
          <Text bold color={noColor ? undefined : 'red'}>
            {' '}
            [⚠ E-STOP]
          </Text>
        ) : pendingApprovalsCount > 0 ? (
          <Text bold color={noColor ? undefined : 'yellow'}>
            {' '}
            [⏳ APPROVAL]
          </Text>
        ) : isBusy ? (
          <Text color={noColor ? undefined : '#38bdf8'}>
            {' '}
            [⟳ {taskStatusLabel}]
          </Text>
        ) : null}
      </Box>
    </Box>
  );

  const shortcutBar = (
    <Box justifyContent="center" width="100%">
      <Text color={noColor ? undefined : '#cbd5e1'}>
        Tab: Mode <Text color={noColor ? undefined : '#475569'}>|</Text> Shift+Tab: Effort{' '}
        <Text color={noColor ? undefined : '#475569'}>|</Text> Ctrl+P: Status{' '}
        <Text color={noColor ? undefined : '#475569'}>|</Text> @: Attach{' '}
        <Text color={noColor ? undefined : '#475569'}>|</Text> /: Skills{' '}
        <Text color={noColor ? undefined : '#475569'}>|</Text> Esc: Cancel
      </Text>
    </Box>
  );

  if (compactHeader) {
    const compactWidth = Math.min(Math.max(54, columns - 4), 108);
    return (
      <Box flexDirection="column" width="100%" alignItems="center">
        <Box
          flexDirection="column"
          width={compactWidth}
          borderStyle="round"
          borderColor={noColor ? undefined : '#4b6ea8'}
          paddingX={2}
          paddingY={0}
        >
          <Box justifyContent="space-between" width="100%">
            <Box>
              <Text bold color={noColor ? undefined : '#e2e8f0'}>
                iMpacts-AI
              </Text>
              <Text color={noColor ? undefined : '#475569'}> • </Text>
              <Text bold color={noColor ? undefined : '#ffffff'}>
                ORION
              </Text>
              <Text dimColor> • {workingDirectory}</Text>
            </Box>
            <Text color={noColor ? undefined : isBusy ? '#38bdf8' : '#10b981'}>
              {isBusy ? `⟳ ${taskStatusLabel}` : `● ${taskStatusLabel}`}
            </Text>
          </Box>
          {renderInnerCommandBox()}
          {shortcutBar}
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="row" width="100%" justifyContent="center" alignItems="center">
      {showSideStars ? (
        <Starfield
          ink={ink}
          columns={sideSpaceCols - 1}
          rows={19}
          vividMode={vividMode}
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
        paddingX={2}
        paddingY={0}
        alignItems="center"
      >
        <MascotInteractive
          ink={ink}
          columns={cardWidth - 4}
          rows={rows}
          vividMode={vividMode}
          noColor={noColor}
          taskLifecycle={mascotLifecycle}
          statusCaption={mascotStatusCaption}
          controllerRef={mascotControllerRef}
          externalTick={externalTick}
          deltaMs={deltaMs}
          cardBgHex="#070d19"
        />

        <Box justifyContent="center" width="100%" marginTop={0}>
          <Text bold color={noColor ? undefined : '#e2e8f0'}>
            iMpacts-AI
          </Text>
        </Box>

        <Box flexDirection="column" alignItems="center" width="100%" marginBottom={1}>
          {ORION_GEOMETRIC_TITLE_LINES.map((line, idx) => (
            <Text key={`orion-geo-${idx}`} bold color={noColor ? undefined : '#ffffff'}>
              {line}
            </Text>
          ))}
        </Box>

        {renderInnerCommandBox()}

        <Box width="100%" marginTop={1}>
          {shortcutBar}
        </Box>
      </Box>

      {showSideStars ? (
        <Starfield
          ink={ink}
          columns={sideSpaceCols - 1}
          rows={19}
          vividMode={vividMode}
          noColor={noColor}
          externalTick={externalTick}
          deltaMs={deltaMs}
          seedOffset={53}
        />
      ) : null}
    </Box>
  );
};
