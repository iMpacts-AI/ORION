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
  noColor?: boolean;
}

/**
 * Interactive Slash-Command Dropup Menu (`src/tui/SlashMenu.tsx` — Section 3C).
 * - Appears above the prompt input whenever the user types `/`.
 * - Filters commands live as characters are typed.
 * - Supports Up/Down selection, Enter execution, Tab completion, and Escape dismissal.
 * - Displays command name, argument hint, description, and availability status (`IMPLEMENTED`, `CONFIGURED`, `UNAVAILABLE`).
 */
export const SlashMenu: React.FC<SlashMenuProps> = ({
  ink,
  visible,
  query,
  commands,
  selectedIndex,
  maxVisibleItems = 8,
  noColor = Boolean(process.env.NO_COLOR)
}) => {
  const { Box, Text } = ink;

  if (!visible || !query.trim().startsWith('/')) {
    return null;
  }

  const total = commands.length;
  if (total === 0) {
    return (
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={noColor ? undefined : '#6D5AE6'}
        paddingX={1}
        marginBottom={1}
      >
        <Text color={noColor ? undefined : 'yellow'}>
          No matching command for "{query}". Press Esc to dismiss or type /help.
        </Text>
      </Box>
    );
  }

  const clampedIdx = Math.max(0, Math.min(selectedIndex, total - 1));
  const halfWindow = Math.floor(maxVisibleItems / 2);
  let startIdx = Math.max(0, clampedIdx - halfWindow);
  const endIdx = Math.min(total, startIdx + maxVisibleItems);
  if (endIdx - startIdx < maxVisibleItems) {
    startIdx = Math.max(0, endIdx - maxVisibleItems);
  }

  const visibleSlice = commands.slice(startIdx, endIdx);

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={noColor ? undefined : '#8A70FF'}
      paddingX={1}
      marginBottom={0}
      width="100%"
    >
      <Box justifyContent="space-between" marginBottom={0}>
        <Text bold color={noColor ? undefined : '#B39DFF'}>
          ✦ ORION Slash Commands ({total} matched)
        </Text>
        <Text dimColor>
          ↑/↓ Navigate • Tab Complete • Enter Run • Esc Dismiss
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

        return (
          <Box key={entry.command} justifyContent="space-between" width="100%">
            <Box>
              <Text
                bold={isSelected}
                color={noColor ? undefined : isSelected ? '#00E5FF' : '#E2E8F0'}
              >
                {isSelected ? '❯ ' : '  '}
                {entry.command.padEnd(18)}
              </Text>
              {entry.argumentHint ? (
                <Text color={noColor ? undefined : '#94A3B8'}>
                  {entry.argumentHint.slice(0, 22).padEnd(23)}
                </Text>
              ) : (
                <Text>{''.padEnd(23)}</Text>
              )}
              <Text
                color={noColor ? undefined : isSelected ? '#FFFFFF' : '#94A3B8'}
                dimColor={!isSelected}
              >
                {entry.description.slice(0, 58)}
              </Text>
            </Box>
            <Box>
              <Text color={noColor ? undefined : badgeColor} dimColor={!isSelected}>
                [{entry.availability}]
              </Text>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
