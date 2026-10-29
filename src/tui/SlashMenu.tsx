import React from 'react';
import { InkPrimitives } from './inkLoader';
import { SlashCommandEntry } from '../harness/CommandRegistry';

export interface SlashMenuProps {
  ink: InkPrimitives;
  visible: boolean;
  query: string;
  commands: SlashCommandEntry[];
  selectedIndex: number;
  maxVisibleItems?: number;
  columns?: number;
  noColor?: boolean;
}

/**
 * Interactive Slash-Command Dropup Menu (`src/tui/SlashMenu.tsx`).
 * - Appears cleanly above the prompt capsule whenever the user types `/`.
 * - Enforces `flexShrink={0}` and strict single-line column budgeting so command descriptions
 *   NEVER wrap unexpectedly or collide with `<Capsule>` / Oris across terminal widths.
 */
export const SlashMenu: React.FC<SlashMenuProps> = ({
  ink,
  visible,
  query,
  commands,
  selectedIndex,
  maxVisibleItems = 6,
  columns = 100,
  noColor = Boolean(process.env.NO_COLOR)
}) => {
  const { Box, Text } = ink;

  if (!visible || !query.trim().startsWith('/')) {
    return null;
  }

  const menuWidth = Math.max(44, columns);
  const innerCols = Math.max(40, menuWidth - 4);
  const total = commands.length;

  if (total === 0) {
    const emptyMsg = `No matching command for "${query}". Press Esc to dismiss or type /help.`;
    return (
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={noColor ? undefined : '#6D5AE6'}
        paddingX={1}
        marginBottom={0}
        width={menuWidth}
        flexShrink={0}
      >
        <Text color={noColor ? undefined : 'yellow'} wrap="truncate-end">
          {emptyMsg.slice(0, innerCols)}
        </Text>
      </Box>
    );
  }

  const safeMaxItems = Math.max(1, maxVisibleItems);
  const clampedIdx = Math.max(0, Math.min(selectedIndex, total - 1));
  const halfWindow = Math.floor(safeMaxItems / 2);
  let startIdx = Math.max(0, clampedIdx - halfWindow);
  const endIdx = Math.min(total, startIdx + safeMaxItems);
  if (endIdx - startIdx < safeMaxItems) {
    startIdx = Math.max(0, endIdx - safeMaxItems);
  }

  const visibleSlice = commands.slice(startIdx, endIdx);
  const showFullBadges = innerCols >= 76;
  const hintColWidth = innerCols >= 98 ? 20 : innerCols >= 82 ? 14 : 0;
  const cmdColWidth = innerCols >= 68 ? 18 : 15;
  const badgeColWidth = showFullBadges ? 14 : 7;
  const descMaxWidth = Math.max(
    8,
    innerCols - (cmdColWidth + 2) - hintColWidth - badgeColWidth - 1
  );

  const headerTitle = `✦ ORION Slash Commands (${total} matched)`;
  const headerKeys =
    innerCols >= 84
      ? '↑/↓ Navigate • Tab Complete • Enter Run • Esc Dismiss'
      : innerCols >= 64
        ? '↑/↓ Move • Tab • Enter • Esc'
        : '↑/↓ • Enter • Esc';

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={noColor ? undefined : '#8A70FF'}
      paddingX={1}
      marginBottom={0}
      width={menuWidth}
      flexShrink={0}
    >
      <Box justifyContent="space-between" width="100%" marginBottom={0}>
        <Text bold color={noColor ? undefined : '#B39DFF'} wrap="truncate-end">
          {headerTitle}
        </Text>
        <Text dimColor wrap="truncate-end">
          {headerKeys}
        </Text>
      </Box>

      {visibleSlice.map((entry, idx) => {
        const absoluteIdx = startIdx + idx;
        const isSelected = absoluteIdx === clampedIdx;
        const badgeColor =
          entry.availability === 'IMPLEMENTED'
            ? 'green'
            : entry.availability === 'CONFIGURED'
              ? 'cyan'
              : 'yellow';

        const badgeLabel = showFullBadges
          ? `[${entry.availability}]`
          : `[${entry.availability.slice(0, 4)}]`;

        const hintText =
          hintColWidth > 0
            ? (entry.argumentHint || '').slice(0, hintColWidth - 1).padEnd(hintColWidth)
            : '';

        const descText = entry.description.slice(0, descMaxWidth);

        return (
          <Box key={entry.command} justifyContent="space-between" width="100%">
            <Box flexShrink={1}>
              <Text
                bold={isSelected}
                color={noColor ? undefined : isSelected ? '#00E5FF' : '#E2E8F0'}
              >
                {`${isSelected ? '❯ ' : '  '}${entry.command.slice(0, cmdColWidth).padEnd(cmdColWidth)}`}
              </Text>
              {hintColWidth > 0 ? (
                <Text color={noColor ? undefined : '#94A3B8'}>{hintText}</Text>
              ) : null}
              <Text
                color={noColor ? undefined : isSelected ? '#FFFFFF' : '#94A3B8'}
                dimColor={!isSelected}
                wrap="truncate-end"
              >
                {descText}
              </Text>
            </Box>
            <Box flexShrink={0}>
              <Text color={noColor ? undefined : badgeColor} dimColor={!isSelected}>
                {badgeLabel}
              </Text>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
