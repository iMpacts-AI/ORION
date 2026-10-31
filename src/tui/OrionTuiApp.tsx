import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InkPrimitives, loadInkPrimitives } from './inkLoader';
import { Starfield } from './Starfield';
import {
  COMPACT_CAPSULE_HEIGHT_ROWS,
  Capsule,
  FULL_HERO_CAPSULE_HEIGHT_ROWS
} from './Capsule';
import { SlashMenu } from './SlashMenu';
import {
  OrisMascotController,
  OrisMascotState,
  OrisTaskLifecycleState,
  SGR_MOUSE_DISABLE_SEQ,
  SGR_MOUSE_ENABLE_SEQ,
  SgrMouseEvent,
  computeOrisHitbox,
  containsSgrMouseSequence,
  parseSgrMouseEvents,
  stripSgrMouseSequences
} from './MascotInteractive';
import {
  CoordinatedFrameStream,
  FOCUS_TRACKING_DISABLE_SEQ,
  FOCUS_TRACKING_ENABLE_SEQ,
  FilteredTtyInputStream
} from './CoordinatedFrameWriter';
import {
  isDecorativeMotionActive
} from './VisualPreferences';
import {
  OrionTipDefinition,
  TIP_ROTATION_INTERVAL_MS,
  parseTipSegments
} from './OrionTipsEngine';
import {
  formatLogicalPath,
  resolvePublicEngineIdentity,
  sanitizeConversationalResponse,
  sanitizePersonalPathsInText
} from '../shared/branding/OrionEngineIdentity';
import { OrionCliKernel } from '../cli/OrionCliKernel';
import { OrionCliCommandRouter } from '../cli/OrionCliCommandRouter';
import { ProcessSupervisor } from '../main/services/computer/ProcessSupervisor';
import { PendingApprovalRequest } from '../main/services/SecurityPolicyMiddleware';
import { HarnessEffortLevel, HarnessMode } from '../harness/ExecutionResult';

export interface TuiFeedEntry {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool' | 'error' | 'approval';
  title: string;
  body: string;
  timestamp: string;
  statusBadge?: string;
}

export interface CoordinatedLayoutBudget {
  viewportCols: number;
  viewportRows: number;
  compactHeader: boolean;
  topStarRows: number;
  bottomStarRows: number;
  slashMaxVisibleItems: number;
  feedMaxRows: number;
  showFooterTip: boolean;
}

/**
 * Computes a deterministic, non-overlapping vertical & horizontal layout budget
 * strictly within `(columns - 1) x (rows - 1)` so:
 * 1. Ink never sees `outputHeight >= stdout.rows` (zero `\x1b[2J` full-screen clear wipes).
 * 2. ConPTY never auto-wraps on the rightmost terminal column.
 * 3. Yoga never shrinks `<Capsule>`, `<MascotInteractive>`, or `<SlashMenu>` borders.
 * 4. Small terminals or tight slash-palette viewports cleanly transition to `compactHeader`
 *    instead of clipping Oris or colliding borders.
 */
export function computeCoordinatedLayout(params: {
  columns: number;
  rows: number;
  hasActivityFeed: boolean;
  isSlashMenuVisible: boolean;
  matchedSlashCount: number;
}): CoordinatedLayoutBudget {
  const rawCols = Math.max(44, params.columns || 100);
  const rawRows = Math.max(13, params.rows || 30);

  // Keep 1-col right margin and 1-row bottom margin to prevent ConPTY auto-wrap & Ink clearTerminal
  const viewportCols = Math.max(44, rawCols - 1);
  const viewportRows = Math.max(12, rawRows - 1);
  const showFooterTip = viewportRows >= 16;
  const footerRows = showFooterTip ? 1 : 0;

  // Case 1: Clean Hero Idle Screen (no feed, slash palette closed)
  if (!params.hasActivityFeed && !params.isSlashMenuVisible) {
    const minHeroRows = FULL_HERO_CAPSULE_HEIGHT_ROWS + footerRows + 1;
    if (viewportRows >= minHeroRows && rawCols >= 56) {
      const spareRows = viewportRows - FULL_HERO_CAPSULE_HEIGHT_ROWS - footerRows;
      const topStarRows = Math.max(1, Math.ceil(spareRows / 2));
      const bottomStarRows = Math.max(0, spareRows - topStarRows);
      return {
        viewportCols,
        viewportRows,
        compactHeader: false,
        topStarRows,
        bottomStarRows,
        slashMaxVisibleItems: 0,
        feedMaxRows: 0,
        showFooterTip
      };
    }

    // Small terminal fallback: controlled compact capsule without destructive sprite clipping
    const spareCompact = Math.max(0, viewportRows - COMPACT_CAPSULE_HEIGHT_ROWS - footerRows);
    const topStarRows = Math.min(3, Math.ceil(spareCompact / 2));
    const bottomStarRows = Math.min(2, Math.max(0, spareCompact - topStarRows));
    return {
      viewportCols,
      viewportRows,
      compactHeader: true,
      topStarRows,
      bottomStarRows,
      slashMaxVisibleItems: 0,
      feedMaxRows: 0,
      showFooterTip
    };
  }

  // Case 2: Slash Command Palette open on Hero Screen (no activity feed yet)
  if (!params.hasActivityFeed && params.isSlashMenuVisible) {
    const minSlashRows = params.matchedSlashCount === 0 ? 3 : 6; // >= 3 visible items + 3 border/header rows
    const minRowsForFullHeroAndSlash =
      1 + minSlashRows + FULL_HERO_CAPSULE_HEIGHT_ROWS + footerRows;

    if (viewportRows >= minRowsForFullHeroAndSlash && rawCols >= 56) {
      const remaining = viewportRows - FULL_HERO_CAPSULE_HEIGHT_ROWS - footerRows;
      const topStarRows = remaining >= 10 ? 2 : 1;
      const maxSlashBoxRows = remaining - topStarRows;
      const slashMaxVisibleItems =
        params.matchedSlashCount === 0
          ? 0
          : Math.max(3, Math.min(8, params.matchedSlashCount, maxSlashBoxRows - 3));
      const actualSlashRows =
        params.matchedSlashCount === 0 ? 3 : slashMaxVisibleItems + 3;
      const bottomStarRows = Math.max(0, remaining - topStarRows - actualSlashRows);

      return {
        viewportCols,
        viewportRows,
        compactHeader: false,
        topStarRows,
        bottomStarRows,
        slashMaxVisibleItems,
        feedMaxRows: 0,
        showFooterTip
      };
    }

    // Tighter vertical viewport (< 30 rows): cleanly collapse to compactHeader while SlashMenu is open
    const remainingCompact = Math.max(
      3,
      viewportRows - COMPACT_CAPSULE_HEIGHT_ROWS - footerRows
    );
    const topStarRows = remainingCompact >= 11 ? 2 : remainingCompact >= 7 ? 1 : 0;
    const maxSlashBoxRows = Math.max(3, remainingCompact - topStarRows);
    const slashMaxVisibleItems =
      params.matchedSlashCount === 0
        ? 0
        : Math.max(1, Math.min(8, params.matchedSlashCount, maxSlashBoxRows - 3));

    return {
      viewportCols,
      viewportRows,
      compactHeader: true,
      topStarRows,
      bottomStarRows: 0,
      slashMaxVisibleItems,
      feedMaxRows: 0,
      showFooterTip
    };
  }

  // Case 3: Activity Feed / Streaming / Approval active
  const topStarRows = viewportRows >= 20 ? 1 : 0;
  let slashMaxVisibleItems = 0;
  let actualSlashRows = 0;
  if (params.isSlashMenuVisible) {
    if (params.matchedSlashCount === 0) {
      actualSlashRows = 3;
    } else {
      const maxForSlash = Math.max(
        4,
        viewportRows - COMPACT_CAPSULE_HEIGHT_ROWS - footerRows - topStarRows - 4
      );
      slashMaxVisibleItems = Math.max(
        1,
        Math.min(5, params.matchedSlashCount, maxForSlash - 3)
      );
      actualSlashRows = slashMaxVisibleItems + 3;
    }
  }

  const feedMaxRows = Math.max(
    3,
    viewportRows -
      topStarRows -
      actualSlashRows -
      COMPACT_CAPSULE_HEIGHT_ROWS -
      footerRows
  );

  return {
    viewportCols,
    viewportRows,
    compactHeader: true,
    topStarRows,
    bottomStarRows: 0,
    slashMaxVisibleItems,
    feedMaxRows,
    showFooterTip
  };
}

function didMascotVisualStateChange(prev: OrisMascotState, next: OrisMascotState): boolean {
  return (
    prev.actionState !== next.actionState ||
    prev.x !== next.x ||
    prev.y !== next.y ||
    prev.eyeOffsetX !== next.eyeOffsetX ||
    prev.tiltDirection !== next.tiltDirection ||
    prev.blinkLong !== next.blinkLong ||
    prev.breathingPhase !== next.breathingPhase ||
    prev.isDancing !== next.isDancing ||
    prev.clickStage !== next.clickStage ||
    prev.statusCaption !== next.statusCaption ||
    prev.particles.length !== next.particles.length
  );
}

export interface OrionTuiViewProps {
  ink: InkPrimitives;
  kernel: OrionCliKernel;
  router: OrionCliCommandRouter;
  onRequestExit: (code: number) => void;
  noColor?: boolean;
  registerMouseHandler?: (handler: ((events: SgrMouseEvent[]) => void) | undefined) => void;
  registerFocusHandler?: (handler: ((focused: boolean) => void) | undefined) => void;
}

/**
 * Full-Screen Alternate-Buffer Terminal State Guard.
 * Ensures `\x1b[?1049h` (enter alternate screen), OSC 11 deep-space background (`#070d19`),
 * SGR mouse tracking, DEC `?1004` terminal focus tracking, and `\x1b[?1049l\x1b[?25h` restoration
 * are always balanced on exit.
 */
export class AlternateScreenGuard {
  private active = false;
  private readonly stdout: NodeJS.WriteStream;

  constructor(stdout: NodeJS.WriteStream = process.stdout) {
    this.stdout = stdout;
  }

  public enter(): void {
    if (this.active || !this.stdout.isTTY) return;
    this.active = true;
    try {
      const oscBg = process.env.NO_COLOR ? '' : '\x1b]11;#070d19\x07';
      this.stdout.write(
        `\x1b[?1049h${oscBg}\x1b[2J\x1b[H${SGR_MOUSE_ENABLE_SEQ}${FOCUS_TRACKING_ENABLE_SEQ}`
      );
    } catch {}
  }

  public leave(): void {
    if (!this.active) return;
    this.active = false;
    try {
      const oscRestore = process.env.NO_COLOR ? '' : '\x1b]111\x07';
      this.stdout.write(
        `\x1b[?2026l${FOCUS_TRACKING_DISABLE_SEQ}${SGR_MOUSE_DISABLE_SEQ}${oscRestore}\x1b[0m\x1b[?25h\x1b[?1049l`
      );
    } catch {}
  }

  public isActive(): boolean {
    return this.active;
  }
}

const MODE_CYCLE: readonly HarnessMode[] = ['Build', 'Plan', 'Chat'];
const EFFORT_CYCLE: readonly HarnessEffortLevel[] = ['low', 'medium', 'high', 'max'];

export const OrionTuiView: React.FC<OrionTuiViewProps> = ({
  ink,
  kernel,
  router,
  onRequestExit,
  noColor = Boolean(process.env.NO_COLOR),
  registerMouseHandler,
  registerFocusHandler
}) => {
  const { Box, Text, useInput, useStdout, useStdin } = ink;
  const { stdout } = useStdout();
  const stdinCtx = typeof useStdin === 'function' ? useStdin() : undefined;
  const isRawModeSupported = stdinCtx
    ? Boolean(stdinCtx.isRawModeSupported)
    : Boolean(process.stdin.isTTY);

  const [dims, setDims] = useState<{ columns: number; rows: number }>({
    columns: stdout?.columns || process.stdout.columns || 100,
    rows: stdout?.rows || process.stdout.rows || 30
  });

  // Single-owner prompt input + cursor state (mirrored in `promptStateRef` for synchronous burst/paste safety)
  const [promptState, setPromptState] = useState<{ value: string; cursorOffset: number }>({
    value: '',
    cursorOffset: 0
  });
  const promptStateRef = useRef<{ value: string; cursorOffset: number }>(promptState);
  const commitPromptState = useCallback(
    (
      updater:
        | { value: string; cursorOffset: number }
        | ((prev: { value: string; cursorOffset: number }) => {
            value: string;
            cursorOffset: number;
          })
    ) => {
      const next =
        typeof updater === 'function' ? updater(promptStateRef.current) : updater;
      promptStateRef.current = next;
      setPromptState(next);
    },
    []
  );
  const inputValue = promptState.value;
  const cursorOffset = promptState.cursorOffset;

  const [slashDismissed, setSlashDismissed] = useState(false);
  const [slashSelectedIndex, setSlashSelectedIndex] = useState(0);
  const [vividMode, setVividMode] = useState<boolean>(kernel.commandRegistry.isVividMode());
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(
    kernel.commandRegistry.isAnimationsEnabled()
  );
  const [isTerminalFocused, setIsTerminalFocused] = useState<boolean>(true);
  const [activeTip, setActiveTip] = useState<OrionTipDefinition>(() =>
    kernel.commandRegistry.getCurrentTip()
  );
  const [uiMode, setUiMode] = useState<HarnessMode>(kernel.harness.getMode());
  const [uiEffort, setUiEffort] = useState<HarnessEffortLevel>(kernel.harness.getEffort());
  const [isBusy, setIsBusy] = useState(false);
  const [taskStatusLabel, setTaskStatusLabel] = useState('READY');
  const [mascotLifecycle, setMascotLifecycle] = useState<OrisTaskLifecycleState>('idle');
  const [mascotCaption, setMascotCaption] = useState<string | undefined>(undefined);

  // Single coordinated frame clock (drives both Starfield projection and Oris Mascot controller in 1 render)
  const [frameClock, setFrameClock] = useState<{ tick: number; deltaMs: number }>({
    tick: 0,
    deltaMs: 240
  });

  const mascotControllerRef = useRef<OrisMascotController | null>(null);
  if (!mascotControllerRef.current) {
    mascotControllerRef.current = new OrisMascotController();
  }

  const lastEscapeCancelRef = useRef<number>(0);
  const lastCtrlCRef = useRef<number>(0);

  const [streamingBuffer, setStreamingBuffer] = useState('');
  const [scrollOffset, setScrollOffset] = useState(0);
  const [pendingApproval, setPendingApproval] = useState<{
    request: {
      toolId: string;
      toolName: string;
      riskLevel: string;
      arguments: Record<string, any>;
      reason: string;
    };
    resolve: (approved: boolean) => void;
  } | null>(null);

  const [feed, setFeed] = useState<TuiFeedEntry[]>([]);

  const updateInputValue = useCallback(
    (nextVal: string, nextCursor?: number) => {
      const cleanVal = stripSgrMouseSequences(nextVal).replace(/\x1b\[[IO]/g, '');
      const targetCursor =
        typeof nextCursor === 'number'
          ? Math.max(0, Math.min(cleanVal.length, nextCursor))
          : cleanVal.length;
      commitPromptState({ value: cleanVal, cursorOffset: targetCursor });
      setSlashDismissed(false);
      setSlashSelectedIndex(0);
    },
    [commitPromptState]
  );

  const appendFeed = useCallback((entry: Omit<TuiFeedEntry, 'id' | 'timestamp'>) => {
    setFeed((prev) => [
      ...prev.slice(-80),
      {
        ...entry,
        id: `fe_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setScrollOffset(0);
  }, []);

  const filteredSlashCommands = useMemo(() => {
    if (!inputValue.trim().startsWith('/')) return [];
    const firstToken = inputValue.trim().split(/\s+/)[0];
    return kernel.commandRegistry.filterCommands(firstToken);
  }, [inputValue, kernel.commandRegistry]);

  const isSlashMenuVisible =
    inputValue.trim().startsWith('/') &&
    !inputValue.trim().includes(' ') &&
    !slashDismissed;

  const hasActivityFeed =
    feed.length > 0 || Boolean(streamingBuffer) || Boolean(pendingApproval) || scrollOffset > 0;

  const layout = useMemo(
    () =>
      computeCoordinatedLayout({
        columns: dims.columns,
        rows: dims.rows,
        hasActivityFeed,
        isSlashMenuVisible,
        matchedSlashCount: filteredSlashCommands.length
      }),
    [
      dims.columns,
      dims.rows,
      hasActivityFeed,
      isSlashMenuVisible,
      filteredSlashCommands.length
    ]
  );

  const motionActive = isDecorativeMotionActive(
    {
      visualMode: vividMode ? 'vivid' : 'minimal',
      animationsEnabled
    },
    isTerminalFocused
  );

  const [tipIntervalMs, setTipIntervalMs] = useState<number>(
    () =>
      (kernel.visualPreferences || kernel.commandRegistry.visualPreferences)?.getPreferences()
        .tipRotationIntervalMs || TIP_ROTATION_INTERVAL_MS
  );

  // Sync visual preferences store updates from any command or config surface
  useEffect(() => {
    const store = kernel.visualPreferences || kernel.commandRegistry.visualPreferences;
    if (!store) return;
    const unsub = store.subscribe((prefs) => {
      setVividMode(prefs.visualMode === 'vivid');
      setAnimationsEnabled(prefs.animationsEnabled);
      setTipIntervalMs(prefs.tipRotationIntervalMs || TIP_ROTATION_INTERVAL_MS);
    });
    return unsub;
  }, [kernel]);

  // Register terminal focus-in / focus-out listener so decorative timers pause immediately when unfocused
  useEffect(() => {
    if (!registerFocusHandler) return;
    registerFocusHandler((focused: boolean) => {
      setIsTerminalFocused(focused);
    });
    return () => {
      registerFocusHandler(undefined);
    };
  }, [registerFocusHandler]);

  // Automatic Home-Screen Tip Rotation (~10s weighted rotation, paused on blur, cleaned up when leaving Home or unmounting)
  useEffect(() => {
    if (!layout.showFooterTip || hasActivityFeed || !isTerminalFocused) {
      return;
    }
    const timer = setInterval(() => {
      setActiveTip(kernel.commandRegistry.cycleTip('weighted'));
    }, tipIntervalMs);

    if (typeof timer.unref === 'function') {
      timer.unref();
    }
    return () => clearInterval(timer);
  }, [hasActivityFeed, isTerminalFocused, kernel.commandRegistry, layout.showFooterTip, tipIntervalMs]);

  // Single coordinated delta-time animation scheduler:
  // - Zero decorative timers run when `!animationsEnabled` or `!isTerminalFocused` or (`!vividMode && !isBusy`).
  // - Uses high-resolution `performance.now()` delta-time and skips redundant React commits in Minimal mode.
  useEffect(() => {
    const shouldRunScheduler =
      isTerminalFocused && animationsEnabled && (vividMode || isBusy);
    if (!shouldRunScheduler) {
      return;
    }

    let lastTime = performance.now();
    const intervalMs = isBusy ? 110 : 240;
    const timer = setInterval(() => {
      const now = performance.now();
      const dt = Math.max(16, Math.min(Math.round(now - lastTime), 450));
      lastTime = now;

      const ctrl = mascotControllerRef.current;
      let mascotChanged = false;
      if (ctrl) {
        const beforeState = ctrl.getState();
        const afterState = ctrl.step(dt);
        mascotChanged = didMascotVisualStateChange(beforeState, afterState);
      }

      if (vividMode || mascotChanged) {
        setFrameClock((prev) => ({
          tick: prev.tick + 1,
          deltaMs: dt
        }));
      }
    }, intervalMs);

    if (typeof timer.unref === 'function') {
      timer.unref();
    }
    return () => clearInterval(timer);
  }, [animationsEnabled, isBusy, isTerminalFocused, vividMode]);

  // Coordinated SGR mouse handler (invoked by FilteredTtyInputStream without competing with Ink's stdin reader)
  const routeSgrMouseEvents = useCallback(
    (mouseEvents: SgrMouseEvent[]) => {
      if (mouseEvents.length === 0) return;

      // Deliberate click on the footer tip row cycles to the next useful tip without altering prompt focus
      if (layout.showFooterTip) {
        for (const ev of mouseEvents) {
          if (
            ev.type === 'press' &&
            ev.isLeftButton &&
            ev.row >= layout.viewportRows
          ) {
            setActiveTip(kernel.commandRegistry.cycleTip('next'));
            return;
          }
        }
      }

      if (layout.compactHeader) return;
      const ctrl = mascotControllerRef.current;
      if (!ctrl) return;

      const beforeState = ctrl.getState();
      const slashRows = !isSlashMenuVisible
        ? 0
        : filteredSlashCommands.length === 0
          ? 3
          : layout.slashMaxVisibleItems + 3;
      const anchorRow = layout.topStarRows + slashRows + 3;
      const hitbox = computeOrisHitbox(
        dims.columns,
        dims.rows,
        beforeState.x,
        beforeState.y,
        anchorRow,
        9
      );

      for (const ev of mouseEvents) {
        ctrl.handleMouseEvent(ev, hitbox);
      }

      const afterState = ctrl.getState();
      if (didMascotVisualStateChange(beforeState, afterState)) {
        setFrameClock((prev) => ({ tick: prev.tick + 1, deltaMs: prev.deltaMs }));
      }
    },
    [
      dims.columns,
      dims.rows,
      filteredSlashCommands.length,
      isSlashMenuVisible,
      kernel.commandRegistry,
      layout.compactHeader,
      layout.showFooterTip,
      layout.slashMaxVisibleItems,
      layout.topStarRows,
      layout.viewportRows
    ]
  );

  useEffect(() => {
    if (!registerMouseHandler) return;
    registerMouseHandler(routeSgrMouseEvents);
    return () => {
      registerMouseHandler(undefined);
    };
  }, [registerMouseHandler, routeSgrMouseEvents]);

  // Listen for terminal resize cleanly
  useEffect(() => {
    const targetOut = stdout || process.stdout;
    if (!targetOut || typeof targetOut.on !== 'function') return;

    const onResize = () => {
      setDims({
        columns: targetOut.columns || 100,
        rows: targetOut.rows || 30
      });
    };
    targetOut.on('resize', onResize);
    return () => {
      targetOut.off('resize', onResize);
    };
  }, [stdout]);

  // Intercept 100% of kernel.renderer output methods so nothing ever writes directly to stdout behind the TUI
  useEffect(() => {
    const origWrite = kernel.renderer.write.bind(kernel.renderer);
    const origWriteLine = kernel.renderer.writeLine.bind(kernel.renderer);
    const origWriteJson = kernel.renderer.writeJson.bind(kernel.renderer);
    const origStartStream = kernel.renderer.startStream.bind(kernel.renderer);
    const origWriteStreamToken = kernel.renderer.writeStreamToken.bind(kernel.renderer);
    const origEndStream = kernel.renderer.endStream.bind(kernel.renderer);
    const origRenderInfo = kernel.renderer.renderInfo.bind(kernel.renderer);
    const origRenderWarn = kernel.renderer.renderWarning.bind(kernel.renderer);
    const origRenderErr = kernel.renderer.renderError.bind(kernel.renderer);
    const origRenderAssistant = kernel.renderer.renderAssistantResponse.bind(kernel.renderer);

    let lineCollector: string[] = [];
    let partialWriteBuffer = '';
    let activeStreamLabel = '';
    let activeStreamText = '';
    let isCapturingStream = false;
    let flushTimer: NodeJS.Timeout | null = null;

    const flushCollectedLines = () => {
      if (partialWriteBuffer.trim()) {
        lineCollector.push(partialWriteBuffer);
        partialWriteBuffer = '';
      }
      if (lineCollector.length === 0) return;
      const filteredLines = lineCollector
        .map((line) => kernel.renderer.stripAnsi(line))
        .filter((plain) => !/^\s*╭─\s*ORION Task\s*\[task_\d+\]/i.test(plain));
      lineCollector = [];
      const joined = sanitizePersonalPathsInText(
        filteredLines.join('\n').trim(),
        kernel.projectRoot
      );
      if (joined) {
        appendFeed({
          role: 'system',
          title: 'ORION Activity',
          body: joined,
          statusBadge: 'OUTPUT'
        });
      }
    };

    const scheduleFlush = () => {
      if (flushTimer) clearTimeout(flushTimer);
      flushTimer = setTimeout(flushCollectedLines, 40);
    };

    kernel.renderer.write = (text: string) => {
      partialWriteBuffer += text || '';
      if (partialWriteBuffer.includes('\n')) {
        const parts = partialWriteBuffer.split('\n');
        partialWriteBuffer = parts.pop() || '';
        for (const p of parts) {
          lineCollector.push(p);
        }
      }
      scheduleFlush();
    };

    kernel.renderer.writeLine = (text = '') => {
      if (partialWriteBuffer) {
        lineCollector.push(partialWriteBuffer + text);
        partialWriteBuffer = '';
      } else {
        lineCollector.push(text);
      }
      scheduleFlush();
    };

    kernel.renderer.writeJson = (payload: unknown) => {
      appendFeed({
        role: 'system',
        title: 'ORION JSON Payload',
        body: JSON.stringify(payload, null, 2),
        statusBadge: 'JSON'
      });
    };

    kernel.renderer.startStream = (providerId: string, modelName: string) => {
      isCapturingStream = true;
      activeStreamLabel = resolvePublicEngineIdentity(providerId, modelName).publicLabel;
      activeStreamText = '';
    };

    kernel.renderer.writeStreamToken = (token: string) => {
      if (isCapturingStream) {
        activeStreamText += token;
      }
    };

    kernel.renderer.endStream = (latencyMs?: number) => {
      if (isCapturingStream) {
        isCapturingStream = false;
        const finalBody = sanitizeConversationalResponse(
          kernel.renderer.stripAnsi(activeStreamText).trim(),
          {
            workspaceRoot: kernel.projectRoot,
            redactProviderIds: true
          }
        );
        activeStreamText = '';
        if (finalBody) {
          appendFeed({
            role: 'assistant',
            title: `ORION [${activeStreamLabel || 'ORION Engine'}]${
              latencyMs !== undefined ? ` (${latencyMs}ms)` : ''
            }`,
            body: finalBody,
            statusBadge: 'COMPLETED'
          });
        }
      }
    };

    kernel.renderer.renderInfo = (msg: string) => {
      appendFeed({
        role: 'system',
        title: 'Info',
        body: sanitizePersonalPathsInText(kernel.renderer.stripAnsi(msg), kernel.projectRoot),
        statusBadge: 'INFO'
      });
    };

    kernel.renderer.renderWarning = (msg: string) => {
      appendFeed({
        role: 'error',
        title: 'Warning',
        body: sanitizePersonalPathsInText(kernel.renderer.stripAnsi(msg), kernel.projectRoot),
        statusBadge: 'WARN'
      });
    };

    kernel.renderer.renderError = (msg: string) => {
      appendFeed({
        role: 'error',
        title: 'Error',
        body: sanitizePersonalPathsInText(kernel.renderer.stripAnsi(msg), kernel.projectRoot),
        statusBadge: 'ERROR'
      });
    };

    kernel.renderer.renderAssistantResponse = (
      response: string,
      latencyMs: number,
      providerLabel?: string
    ) => {
      let cleanBadge = providerLabel || 'ORION Engine';
      if (cleanBadge.includes(':') || cleanBadge.includes('/')) {
        const [pId, ...rest] = cleanBadge.split(/[:/]/);
        cleanBadge = resolvePublicEngineIdentity(pId, rest.join(':')).publicLabel;
      }
      const cleanBody = sanitizeConversationalResponse(
        kernel.renderer.stripAnsi(response),
        {
          workspaceRoot: kernel.projectRoot,
          redactProviderIds: true
        }
      );
      appendFeed({
        role: 'assistant',
        title: `ORION [${cleanBadge}] (${latencyMs}ms)`,
        body: cleanBody,
        statusBadge: 'COMPLETED'
      });
    };

    // Wire interactive approval callback and transition Oris into `awaiting_approval`
    kernel.setApprovalCallback(async (req) => {
      setMascotLifecycle('awaiting_approval');
      setMascotCaption('ORIS • AWAITING OPERATOR APPROVAL (Y/N)');
      return new Promise<boolean>((resolve) => {
        setPendingApproval({ request: req, resolve });
      });
    });

    // Wire reminder alerts into TUI feed
    const unsubReminders = kernel.harness.dispatcher.reminderService.onReminderTriggered((rem) => {
      appendFeed({
        role: 'system',
        title: `⏰ REMINDER DUE [${rem.id}]`,
        body: `${rem.message} (Due: ${rem.dueAtIso})`,
        statusBadge: 'ALERT'
      });
    });
    kernel.harness.dispatcher.reminderService.startBackgroundScheduler(10_000);

    return () => {
      if (flushTimer) clearTimeout(flushTimer);
      kernel.renderer.write = origWrite;
      kernel.renderer.writeLine = origWriteLine;
      kernel.renderer.writeJson = origWriteJson;
      kernel.renderer.startStream = origStartStream;
      kernel.renderer.writeStreamToken = origWriteStreamToken;
      kernel.renderer.endStream = origEndStream;
      kernel.renderer.renderInfo = origRenderInfo;
      kernel.renderer.renderWarning = origRenderWarn;
      kernel.renderer.renderError = origRenderErr;
      kernel.renderer.renderAssistantResponse = origRenderAssistant;
      unsubReminders();
      kernel.harness.dispatcher.reminderService.stopBackgroundScheduler();
    };
  }, [kernel, appendFeed]);

  const handleInputChange = useCallback(
    (val: string) => {
      updateInputValue(val);
    },
    [updateInputValue]
  );

  const triggerEscapeCancel = useCallback(async () => {
    const now = Date.now();
    if (now - lastEscapeCancelRef.current < 150) {
      return;
    }
    lastEscapeCancelRef.current = now;

    if (!isBusy && !kernel.isBusy()) {
      return;
    }

    setTaskStatusLabel('CANCELLING...');
    setMascotLifecycle('cancelled');
    setMascotCaption('ORIS • CANCELLING TASK (ESC)...');
    appendFeed({
      role: 'system',
      title: 'Cancellation Requested (Esc)',
      body: 'Cancellation requested... stopping active model/tool/subprocess operations.',
      statusBadge: 'CANCELLING'
    });

    const cancelRes = await kernel.cancelActiveTask('Task cancelled by operator via Escape');
    setStreamingBuffer('');
    setIsBusy(false);
    setTaskStatusLabel('CANCELLED');
    setMascotLifecycle('cancelled');
    setMascotCaption('ORIS • TASK CANCELLED (ESC)');
    appendFeed({
      role: 'error',
      title: 'Task Cancelled',
      body: `Task cancelled.${
        cancelRes.terminatedProcesses > 0
          ? ` Terminated ${cancelRes.terminatedProcesses} child process(es).`
          : ''
      }`,
      statusBadge: 'CANCELLED'
    });
  }, [appendFeed, isBusy, kernel]);

  const executeSubmittedInput = useCallback(
    async (rawText: string) => {
      const trimmed = rawText.trim();
      if (!trimmed) return;

      commitPromptState({ value: '', cursorOffset: 0 });
      setSlashDismissed(false);
      setSlashSelectedIndex(0);

      if (trimmed.startsWith('/')) {
        const normalized = trimmed.replace(/^\/\/+/, '/');
        const parts = normalized.slice(1).trim().split(/\s+/);
        const cmdName = `/${(parts[0] || '').toLowerCase()}`;
        const cmdArgs = parts.slice(1);

        if (cmdName === '/clear') {
          setFeed([]);
          setStreamingBuffer('');
          setScrollOffset(0);
          setMascotLifecycle('idle');
          setMascotCaption(undefined);
          kernel.harness.contextManager.clearTurns();
          kernel.orchestrator.getMemoryService().clearMemory();
          return;
        }

        if (cmdName === '/vivid' || cmdName === '/visual') {
          const entry = kernel.commandRegistry.getCommand('/vivid');
          if (entry) {
            const res = await entry.handler(cmdArgs, trimmed);
            setVividMode(kernel.commandRegistry.isVividMode());
            setAnimationsEnabled(kernel.commandRegistry.isAnimationsEnabled());
            appendFeed({
              role: 'system',
              title: '/vivid',
              body: res.summary,
              statusBadge: kernel.commandRegistry.isVividMode() ? 'VIVID' : 'MINIMAL'
            });
            return;
          }
        }

        if (
          cmdName === '/animations' ||
          cmdName === '/animation' ||
          cmdName === '/motion'
        ) {
          const entry = kernel.commandRegistry.getCommand('/animations');
          if (entry) {
            const res = await entry.handler(cmdArgs, trimmed);
            setVividMode(kernel.commandRegistry.isVividMode());
            setAnimationsEnabled(kernel.commandRegistry.isAnimationsEnabled());
            appendFeed({
              role: 'system',
              title: '/animations',
              body: res.summary,
              statusBadge: kernel.commandRegistry.isAnimationsEnabled() ? 'ON' : 'OFF'
            });
            return;
          }
        }

        if (cmdName === '/tip' || cmdName === '/tips') {
          const sub = (cmdArgs[0] || 'next').toLowerCase();
          if (sub !== 'list' && !hasActivityFeed) {
            const dir = sub === 'prev' || sub === 'previous' ? 'prev' : 'next';
            setActiveTip(kernel.commandRegistry.cycleTip(dir));
            return;
          }
          const entry = kernel.commandRegistry.getCommand('/tip');
          if (entry) {
            const res = await entry.handler(cmdArgs, trimmed);
            setActiveTip(kernel.commandRegistry.getCurrentTip());
            appendFeed({
              role: 'system',
              title: '/tip',
              body: res.summary,
              statusBadge: 'TIP'
            });
            return;
          }
        }
      }

      appendFeed({
        role: 'user',
        title: 'Operator',
        body: trimmed,
        statusBadge: kernel.harness.getMode().toUpperCase()
      });

      setIsBusy(true);
      setTaskStatusLabel('EXECUTING...');
      setMascotLifecycle('thinking');
      setMascotCaption('ORIS • THINKING & PLANNING...');
      setStreamingBuffer('');
      const taskSignal = kernel.beginForegroundTask();

      try {
        if (
          !trimmed.startsWith('/') &&
          !trimmed.startsWith('@') &&
          kernel.harness.getMode() === 'Plan'
        ) {
          setMascotLifecycle('working');
          setMascotCaption('ORIS • EXECUTING PLAN LOOP...');
          const rep = await kernel.harness.runLoop({
            goal: trimmed,
            mode: 'Plan',
            signal: taskSignal,
            onToken: (tok) => setStreamingBuffer((prev) => prev + tok)
          });
          setStreamingBuffer('');
          if (rep.status === 'CANCELLED' || taskSignal.aborted) {
            setTaskStatusLabel('CANCELLED');
            setMascotLifecycle('cancelled');
            setMascotCaption('ORIS • TASK CANCELLED (ESC)');
            return;
          }
          setMascotLifecycle(
            rep.status === 'COMPLETED' && rep.verified ? 'success' : 'error'
          );
          setMascotCaption(
            rep.status === 'COMPLETED' && rep.verified
              ? 'ORIS • VERIFIED COMPLETE ✦'
              : `ORIS • ${rep.status}`
          );
          appendFeed({
            role: rep.status === 'BLOCKED' ? 'error' : 'assistant',
            title: `ORION Plan Mode [${rep.status}]`,
            body: rep.finalResponse,
            statusBadge: rep.status
          });
        } else {
          setMascotLifecycle('working');
          setMascotCaption('ORIS • EXECUTING TASK...');
          const res = await router.dispatch(trimmed, {
            streamTokens: true,
            signal: taskSignal,
            onToken: (tok) => {
              setStreamingBuffer((prev) => prev + tok);
            }
          });
          setStreamingBuffer('');
          setVividMode(kernel.commandRegistry.isVividMode());
          setAnimationsEnabled(kernel.commandRegistry.isAnimationsEnabled());
          setUiMode(kernel.harness.getMode());
          setUiEffort(kernel.harness.getEffort());
          if (taskSignal.aborted || kernel.getTaskExecutionState() === 'cancelled') {
            setTaskStatusLabel('CANCELLED');
            setMascotLifecycle('cancelled');
            setMascotCaption('ORIS • TASK CANCELLED (ESC)');
            return;
          }
          setMascotLifecycle(res.exitCode === 0 ? 'success' : 'error');
          setMascotCaption(
            res.exitCode === 0 ? 'ORIS • VERIFIED COMPLETE ✦' : 'ORIS • TASK FAILED'
          );
          if (res.shouldExit) {
            onRequestExit(res.exitCode ?? 0);
            return;
          }
        }
      } catch (err: any) {
        setStreamingBuffer('');
        const isCancelErr =
          taskSignal.aborted || /cancelled|aborted/i.test(String(err?.message || ''));
        setMascotLifecycle(isCancelErr ? 'cancelled' : 'error');
        setMascotCaption(
          isCancelErr ? 'ORIS • TASK CANCELLED (ESC)' : 'ORIS • ALERT / ERROR'
        );
        if (!isCancelErr) {
          appendFeed({
            role: 'error',
            title: 'Execution Exception',
            body: err?.message || String(err),
            statusBadge: 'FAILED'
          });
        }
      } finally {
        kernel.endForegroundTask();
        setIsBusy(false);
        setUiMode(kernel.harness.getMode());
        setUiEffort(kernel.harness.getEffort());
        if (kernel.getTaskExecutionState() !== 'cancelled') {
          setTaskStatusLabel('READY');
        }
      }
    },
    [appendFeed, kernel, onRequestExit, router]
  );

  const handlePromptSubmit = useCallback(
    (val: string) => {
      const trimmedVal = val.trim();
      if (trimmedVal.startsWith('/') && !trimmedVal.includes(' ') && !slashDismissed) {
        const normalizedCmd = trimmedVal.replace(/^\/\/+/, '/').toLowerCase();
        // If user typed an exact registered command without arrowing away from index 0, execute it directly
        if (slashSelectedIndex === 0 && kernel.commandRegistry.getCommand(normalizedCmd)) {
          executeSubmittedInput(normalizedCmd);
          return;
        }
        const liveMatches = kernel.commandRegistry.filterCommands(trimmedVal);
        if (liveMatches.length > 0) {
          const chosen = liveMatches[slashSelectedIndex] || liveMatches[0];
          if (chosen && chosen.command !== normalizedCmd) {
            executeSubmittedInput(chosen.command);
            return;
          }
        }
      }
      executeSubmittedInput(val);
    },
    [executeSubmittedInput, kernel.commandRegistry, slashDismissed, slashSelectedIndex]
  );

  // Single coordinated keyboard handler (wrapped in a stable ref-backed callback so Ink's `useInput`
  // never detaches its EventEmitter listener mid-burst when multiple tokens arrive in one stdin read!)
  const latestInputHandlerRef = useRef<(input: string, key: any) => void>(() => {});
  latestInputHandlerRef.current = (input: string, key: any) => {
      if (containsSgrMouseSequence(input)) {
        const fallbackMouse = parseSgrMouseEvents(input);
        if (fallbackMouse.length > 0 && !registerMouseHandler) {
          routeSgrMouseEvents(fallbackMouse);
        }
        return;
      }

      // Ignore terminal focus-in / focus-out escape reports
      if (input === '\x1b[I' || input === '\x1b[O') {
        return;
      }

      if (key.ctrl && input === 'd') {
        onRequestExit(0);
        return;
      }

      if (key.escape && (isBusy || kernel.isBusy()) && !pendingApproval) {
        triggerEscapeCancel().catch(() => {});
        return;
      }

      if (key.ctrl && input === 'c') {
        if (isBusy || kernel.isBusy()) {
          triggerEscapeCancel().catch(() => {});
          return;
        }
        const now = Date.now();
        if (now - lastCtrlCRef.current < 1500) {
          onRequestExit(0);
        } else {
          lastCtrlCRef.current = now;
          setPromptState({ value: '', cursorOffset: 0 });
          setSlashDismissed(false);
          setSlashSelectedIndex(0);
          appendFeed({
            role: 'system',
            title: 'Exit Confirmation',
            body: 'Press Ctrl+C again within 1.5s (or type /exit) to quit ORION CLI.',
            statusBadge: 'HINT'
          });
        }
        return;
      }

      // Ctrl+P opens a live Runtime Settings & Policy Status card (with provider-neutral engine identity & logical workspace path)
      if (key.ctrl && input === 'p') {
        const rs = kernel.omniRouter.getStatus();
        const engineIdentity = resolvePublicEngineIdentity(rs.id, rs.currentModel);
        const policyOk = kernel.policyService.verifyProtectedPolicyIntegrity().valid;
        const estop = ProcessSupervisor.getInstance().isEstopActive();
        appendFeed({
          role: 'system',
          title: 'ORION Runtime Settings & Governance Status',
          body: [
            `Mode: ${kernel.harness.getMode()}  |  Effort: ${kernel.harness.getEffort()}  |  Visuals: ${vividMode ? 'Vivid' : 'Minimal'}  |  Animations: ${animationsEnabled ? 'On' : 'Off'}`,
            `Active Engine: ${engineIdentity.publicLabel} (${engineIdentity.tierDescription})  |  Policy: ${policyOk ? 'VERIFIED' : 'DEGRADED'}  |  E-Stop: ${estop ? 'ENGAGED' : 'CLEAR'}`,
            `Workspace: ${formatLogicalPath(kernel.projectRoot, kernel.projectRoot)}`
          ].join('\n'),
          statusBadge: 'STATUS'
        });
        return;
      }

      // Alt+T manually cycles to the next useful ORION tip without altering input focus or inserting characters
      if (key.meta && (input === 't' || input === 'T')) {
        setActiveTip(kernel.commandRegistry.cycleTip('next'));
        return;
      }

      // Handle active inline approval prompt (Y/N)
      if (pendingApproval) {
        if (input.toLowerCase() === 'y') {
          const resolver = pendingApproval.resolve;
          const toolId = pendingApproval.request.toolId;
          setPendingApproval(null);
          setMascotLifecycle('working');
          setMascotCaption('ORIS • EXECUTING APPROVED ACTION...');
          appendFeed({
            role: 'approval',
            title: `Approved ${toolId}`,
            body: 'Operator granted action-bound approval.',
            statusBadge: 'APPROVED'
          });
          resolver(true);
          return;
        }
        if (input.toLowerCase() === 'n' || key.escape) {
          const resolver = pendingApproval.resolve;
          const toolId = pendingApproval.request.toolId;
          setPendingApproval(null);
          setMascotLifecycle('cancelled');
          setMascotCaption('ORIS • ACTION DENIED');
          appendFeed({
            role: 'error',
            title: `Denied ${toolId}`,
            body: 'Operator denied tool execution.',
            statusBadge: 'DENIED'
          });
          resolver(false);
          return;
        }
        return;
      }

      if (key.pageUp) {
        setScrollOffset((prev) => Math.min(Math.max(0, feed.length - 2), prev + 2));
        return;
      }
      if (key.pageDown) {
        setScrollOffset((prev) => Math.max(0, prev - 2));
        return;
      }

      // SlashMenu navigation when visible
      if (isSlashMenuVisible) {
        if (key.escape) {
          setSlashDismissed(true);
          return;
        }
        if (filteredSlashCommands.length > 0) {
          if (key.upArrow) {
            setSlashSelectedIndex((prev) =>
              prev <= 0 ? filteredSlashCommands.length - 1 : prev - 1
            );
            return;
          }
          if (key.downArrow) {
            setSlashSelectedIndex((prev) =>
              prev >= filteredSlashCommands.length - 1 ? 0 : prev + 1
            );
            return;
          }
          if (key.tab && !key.shift) {
            const chosen =
              filteredSlashCommands[slashSelectedIndex] || filteredSlashCommands[0];
            if (chosen) {
              const completed = `${chosen.command} `;
              commitPromptState({ value: completed, cursorOffset: completed.length });
              setSlashDismissed(false);
            }
            return;
          }
        }
      }

      // Tab cycles Mode (`Build -> Plan -> Chat`); Shift+Tab cycles Effort (`low -> medium -> high -> max`)
      if (key.tab) {
        if (!isBusy) {
          if (key.shift) {
            const curEffort = kernel.harness.getEffort();
            const nextEffort =
              EFFORT_CYCLE[(EFFORT_CYCLE.indexOf(curEffort) + 1) % EFFORT_CYCLE.length];
            kernel.harness.setEffort(nextEffort);
            setUiEffort(nextEffort);
          } else if (!isSlashMenuVisible) {
            const curMode = kernel.harness.getMode();
            const nextMode =
              MODE_CYCLE[(MODE_CYCLE.indexOf(curMode) + 1) % MODE_CYCLE.length];
            kernel.harness.setMode(nextMode);
            setUiMode(nextMode);
          }
        }
        return;
      }

      // Submit current prompt (read synchronous `promptStateRef.current.value` so fast burst/paste+Enter never reads stale state)
      if (key.return) {
        handlePromptSubmit(promptStateRef.current.value);
        return;
      }

      // Cursor movement & readline shortcuts
      if (key.leftArrow) {
        commitPromptState((prev) => ({
          ...prev,
          cursorOffset: Math.max(0, prev.cursorOffset - 1)
        }));
        return;
      }
      if (key.rightArrow) {
        commitPromptState((prev) => ({
          ...prev,
          cursorOffset: Math.min(prev.value.length, prev.cursorOffset + 1)
        }));
        return;
      }
      if (key.ctrl && input === 'a') {
        commitPromptState((prev) => ({ ...prev, cursorOffset: 0 }));
        return;
      }
      if (key.ctrl && input === 'e') {
        commitPromptState((prev) => ({ ...prev, cursorOffset: prev.value.length }));
        return;
      }
      if (key.ctrl && input === 'u') {
        commitPromptState({ value: '', cursorOffset: 0 });
        setSlashDismissed(false);
        setSlashSelectedIndex(0);
        return;
      }

      // Backspace / Delete
      if (key.backspace || key.delete) {
        commitPromptState((prev) => {
          if (prev.value.length === 0 || prev.cursorOffset <= 0) {
            return prev;
          }
          const nextValue =
            prev.value.slice(0, prev.cursorOffset - 1) +
            prev.value.slice(prev.cursorOffset);
          return {
            value: nextValue,
            cursorOffset: Math.max(0, prev.cursorOffset - 1)
          };
        });
        setSlashDismissed(false);
        setSlashSelectedIndex(0);
        return;
      }

      // Ignore non-printable navigation / modifier keys
      if (key.escape || key.upArrow || key.downArrow || key.ctrl || key.meta) {
        return;
      }

      // Insert printable text at cursorOffset
      if (input) {
        const cleanInsert = stripSgrMouseSequences(input)
          .replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, '')
          .replace(/[\r\n]+/g, ' ')
          .replace(/[\x00-\x1f\x7f]/g, '');

        if (!cleanInsert) {
          return;
        }

        commitPromptState((prev) => {
          const pos = Math.max(0, Math.min(prev.value.length, prev.cursorOffset));
          const nextValue =
            prev.value.slice(0, pos) + cleanInsert + prev.value.slice(pos);
          return {
            value: nextValue,
            cursorOffset: pos + cleanInsert.length
          };
        });
        setSlashDismissed(false);
        setSlashSelectedIndex(0);
      }
  };

  const stableInputHandler = useCallback((input: string, key: any) => {
    latestInputHandlerRef.current(input, key);
  }, []);

  useInput(stableInputHandler, { isActive: isRawModeSupported });

  const routerStatus = kernel.omniRouter.getStatus();
  const publicEngineIdentity = resolvePublicEngineIdentity(
    routerStatus.id,
    routerStatus.currentModel
  );
  const streamGlyph = motionActive ? '⟳' : '⋯';
  const tipSegments = useMemo(
    () => parseTipSegments(activeTip.template),
    [activeTip.template]
  );
  const estopActive = ProcessSupervisor.getInstance().isEstopActive();
  const pendingQueue: PendingApprovalRequest[] =
    kernel.securityMiddleware.getPendingApprovals();
  const attachedCount = kernel.harness.workspaceService.listAttachments().length;

  // Budget visible feed items against `layout.feedMaxRows` so feed cards never crush `<Capsule>`
  const estimatedRowsPerFeedCard = 4;
  const maxVisibleFeedItems = Math.max(
    1,
    Math.min(6, Math.floor(Math.max(4, layout.feedMaxRows) / estimatedRowsPerFeedCard))
  );
  const endIdx = Math.max(0, feed.length - scrollOffset);
  const startIdx = Math.max(0, endIdx - maxVisibleFeedItems);
  const visibleFeed = feed.slice(startIdx, endIdx);
  const maxBodyLinesPerCard = Math.max(
    1,
    Math.floor(Math.max(3, layout.feedMaxRows - 2) / Math.max(1, visibleFeed.length)) - 2
  );

  return (
    <Box
      flexDirection="column"
      width={layout.viewportCols}
      height={layout.viewportRows}
      justifyContent="space-between"
      overflow="hidden"
    >
      {/* Top Starfield + Bounded Activity Feed */}
      <Box flexDirection="column" width={layout.viewportCols} flexShrink={1} overflow="hidden">
        {layout.topStarRows > 0 ? (
          <Starfield
            ink={ink}
            columns={layout.viewportCols}
            rows={layout.topStarRows}
            vividMode={vividMode}
            animationsEnabled={motionActive}
            noColor={noColor}
            externalTick={frameClock.tick}
            deltaMs={frameClock.deltaMs}
            seedOffset={0}
          />
        ) : null}

        {hasActivityFeed ? (
          <Box
            flexDirection="column"
            paddingX={1}
            width={layout.viewportCols}
            height={layout.feedMaxRows}
            flexShrink={1}
            overflow="hidden"
          >
            {scrollOffset > 0 ? (
              <Text color={noColor ? undefined : 'yellow'} wrap="truncate-end">
                ▲ Viewing historical output (offset -{scrollOffset} • PgDn to return to live)
              </Text>
            ) : null}

            {visibleFeed.map((item) => {
              const roleColor =
                item.role === 'user'
                  ? '#38bdf8'
                  : item.role === 'assistant'
                    ? '#c084fc'
                    : item.role === 'error'
                      ? 'red'
                      : item.role === 'approval'
                        ? 'yellow'
                        : '#64748b';

              const bodyLines = item.body
                .split('\n')
                .slice(0, Math.max(1, Math.min(8, maxBodyLinesPerCard)));

              return (
                <Box
                  key={item.id}
                  flexDirection="column"
                  borderStyle="round"
                  borderColor={noColor ? undefined : roleColor}
                  paddingX={1}
                  width={Math.max(36, layout.viewportCols - 2)}
                  flexShrink={1}
                >
                  <Box justifyContent="space-between" width="100%">
                    <Text bold color={noColor ? undefined : roleColor} wrap="truncate-end">
                      {item.title}
                    </Text>
                    <Text dimColor wrap="truncate-end">
                      {`${item.statusBadge ? `[${item.statusBadge}] ` : ''}${item.timestamp}`}
                    </Text>
                  </Box>
                  <Text color={noColor ? undefined : '#f8fafc'} wrap="truncate-end">
                    {bodyLines.join('\n').slice(0, 640)}
                  </Text>
                </Box>
              );
            })}

            {streamingBuffer ? (
              <Box
                flexDirection="column"
                borderStyle="round"
                borderColor={noColor ? undefined : '#38bdf8'}
                paddingX={1}
                width={Math.max(36, layout.viewportCols - 2)}
                flexShrink={0}
              >
                <Text bold color={noColor ? undefined : '#38bdf8'} wrap="truncate-end">
                  {streamGlyph} Streaming [{publicEngineIdentity.publicLabel}]...
                </Text>
                <Text wrap="truncate-end">
                  {streamingBuffer.split('\n').slice(-4).join('\n')}
                </Text>
              </Box>
            ) : null}

            {pendingApproval ? (
              <Box
                flexDirection="column"
                borderStyle="double"
                borderColor={noColor ? undefined : 'yellow'}
                paddingX={1}
                width={Math.max(36, layout.viewportCols - 2)}
                flexShrink={0}
              >
                <Text bold color={noColor ? undefined : 'yellow'} wrap="truncate-end">
                  ⚠ TIER 2 CONFIRMATION REQUIRED — {pendingApproval.request.toolId} (
                  {pendingApproval.request.riskLevel})
                </Text>
                <Text wrap="truncate-end">Reason: {pendingApproval.request.reason}</Text>
                <Text dimColor wrap="truncate-end">
                  Arguments:{' '}
                  {JSON.stringify(pendingApproval.request.arguments).slice(0, 140)}
                </Text>
                <Text bold color={noColor ? undefined : '#38bdf8'} wrap="truncate-end">
                  Press [Y] to Approve & Execute, or [N] / [Esc] to Deny.
                </Text>
              </Box>
            ) : null}
          </Box>
        ) : null}
      </Box>

      {/* Center / Bottom Hero Capsule + SlashMenu Dropup (flexShrink={0} protects all borders & Oris) */}
      <Box flexDirection="column" width={layout.viewportCols} flexShrink={0}>
        <SlashMenu
          ink={ink}
          visible={isSlashMenuVisible}
          query={inputValue}
          commands={filteredSlashCommands}
          selectedIndex={slashSelectedIndex}
          maxVisibleItems={layout.slashMaxVisibleItems || 5}
          columns={layout.viewportCols}
          noColor={noColor}
        />

        <Capsule
          ink={ink}
          inputValue={inputValue}
          cursorOffset={cursorOffset}
          onInputChange={handleInputChange}
          onInputSubmit={handlePromptSubmit}
          mode={uiMode}
          effort={uiEffort}
          activeModel={routerStatus.currentModel}
          activeProvider={routerStatus.id}
          workingDirectory={kernel.projectRoot}
          taskStatusLabel={taskStatusLabel}
          isBusy={isBusy}
          estopActive={estopActive}
          vividMode={vividMode}
          animationsEnabled={animationsEnabled && isTerminalFocused}
          motionActive={motionActive}
          attachedFilesCount={attachedCount}
          pendingApprovalsCount={pendingQueue.length}
          compactHeader={layout.compactHeader}
          noColor={noColor}
          columns={layout.viewportCols}
          rows={layout.viewportRows}
          mascotLifecycle={mascotLifecycle}
          mascotStatusCaption={mascotCaption}
          mascotControllerRef={mascotControllerRef}
          parentDrivenMascot={true}
          externalTick={frameClock.tick}
          deltaMs={frameClock.deltaMs}
          inputFocused={isRawModeSupported}
        />

        {layout.bottomStarRows > 0 ? (
          <Starfield
            ink={ink}
            columns={layout.viewportCols}
            rows={layout.bottomStarRows}
            vividMode={vividMode}
            animationsEnabled={motionActive}
            noColor={noColor}
            externalTick={frameClock.tick}
            deltaMs={frameClock.deltaMs}
            seedOffset={97}
          />
        ) : null}

        {layout.showFooterTip ? (
          <Box justifyContent="center" width={layout.viewportCols} flexShrink={0}>
            <Text wrap="truncate-end">
              <Text color={noColor ? undefined : '#7dd3fc'}>✦ </Text>
              <Text color={noColor ? undefined : '#64748b'}>Tip: </Text>
              {tipSegments.map((seg, idx) =>
                seg.highlight ? (
                  <Text
                    key={`tip_seg_${idx}`}
                    bold
                    color={noColor ? undefined : '#e2e8f0'}
                  >
                    {seg.text}
                  </Text>
                ) : (
                  <Text key={`tip_seg_${idx}`} color={noColor ? undefined : '#64748b'}>
                    {seg.text}
                  </Text>
                )
              )}
            </Text>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

/**
 * Launches the full-screen React + Ink ORION TUI application inside the alternate screen buffer
 * using `CoordinatedFrameStream` (synchronized atomic line-diffed rendering with zero `\x1b[2J` clear blasts)
 * and `FilteredTtyInputStream` (isolated SGR mouse event routing), guaranteeing clean terminal restoration.
 */
export async function runOrionInkTui(options: {
  kernel: OrionCliKernel;
  router: OrionCliCommandRouter;
  stdout?: NodeJS.WriteStream;
  stdin?: NodeJS.ReadStream;
}): Promise<number> {
  const ink = await loadInkPrimitives();
  const realStdout = options.stdout || process.stdout;
  const realStdin = options.stdin || process.stdin;

  const screenGuard = new AlternateScreenGuard(realStdout);
  const coordinatedStdout = new CoordinatedFrameStream(realStdout, {
    useSynchronizedOutput: true
  });
  const filteredStdin = new FilteredTtyInputStream(realStdin);
  let exitCode = 0;

  const cleanupTerminal = () => {
    filteredStdin.dispose();
    coordinatedStdout.dispose();
    screenGuard.leave();
  };

  const onSigInt = () => {
    cleanupTerminal();
  };
  const onSigTerm = () => {
    cleanupTerminal();
    process.exit(0);
  };
  const onUncaught = (err: Error) => {
    cleanupTerminal();
    console.error('[ORION TUI Uncaught Exception]:', err?.message || err);
    process.exit(1);
  };

  process.on('exit', cleanupTerminal);
  process.on('SIGINT', onSigInt);
  process.on('SIGTERM', onSigTerm);
  process.on('uncaughtException', onUncaught);

  screenGuard.enter();

  try {
    let instance: ReturnType<InkPrimitives['render']> | null = null;
    const handleRequestExit = (code: number) => {
      exitCode = code;
      if (instance) {
        instance.unmount();
      }
    };

    instance = ink.render(
      React.createElement(OrionTuiView, {
        ink,
        kernel: options.kernel,
        router: options.router,
        onRequestExit: handleRequestExit,
        registerMouseHandler: (handler) => {
          filteredStdin.setMouseEventHandler(handler);
        },
        registerFocusHandler: (handler) => {
          filteredStdin.setFocusChangeHandler(handler);
        }
      }),
      {
        stdout: coordinatedStdout as unknown as NodeJS.WriteStream,
        stdin: filteredStdin as unknown as NodeJS.ReadStream,
        patchConsole: true,
        exitOnCtrlC: false
      }
    );

    await instance.waitUntilExit();
  } finally {
    cleanupTerminal();
    process.off('exit', cleanupTerminal);
    process.off('SIGINT', onSigInt);
    process.off('SIGTERM', onSigTerm);
    process.off('uncaughtException', onUncaught);
    await options.kernel.shutdown();
  }

  return exitCode;
}
