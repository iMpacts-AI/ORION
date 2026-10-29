import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InkPrimitives, loadInkPrimitives } from './inkLoader';
import { Starfield } from './Starfield';
import { Capsule } from './Capsule';
import { SlashMenu } from './SlashMenu';
import {
  OrisMascotController,
  OrisTaskLifecycleState,
  SGR_MOUSE_DISABLE_SEQ,
  SGR_MOUSE_ENABLE_SEQ,
  computeOrisHitbox,
  containsSgrMouseSequence,
  parseSgrMouseEvents,
  stripSgrMouseSequences
} from './MascotInteractive';
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

export interface OrionTuiViewProps {
  ink: InkPrimitives;
  kernel: OrionCliKernel;
  router: OrionCliCommandRouter;
  onRequestExit: (code: number) => void;
  noColor?: boolean;
}

/**
 * Full-Screen Alternate-Buffer Terminal State Guard.
 * Ensures `\x1b[?1049h` (enter alternate screen), OSC 11 deep-space background (`#070d19`),
 * SGR mouse tracking, and `\x1b[?1049l\x1b[?25h` restoration are always balanced on exit.
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
      this.stdout.write(`\x1b[?1049h${oscBg}\x1b[2J\x1b[H${SGR_MOUSE_ENABLE_SEQ}`);
    } catch {}
  }

  public leave(): void {
    if (!this.active) return;
    this.active = false;
    try {
      const oscRestore = process.env.NO_COLOR ? '' : '\x1b]111\x07';
      this.stdout.write(`${SGR_MOUSE_DISABLE_SEQ}${oscRestore}\x1b[0m\x1b[?25h\x1b[?1049l`);
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
  noColor = Boolean(process.env.NO_COLOR)
}) => {
  const { Box, Text, useInput, useStdout, useStdin } = ink;
  const { stdout } = useStdout();
  const stdinCtx = typeof useStdin === 'function' ? useStdin() : undefined;
  const isRawModeSupported = stdinCtx ? Boolean(stdinCtx.isRawModeSupported) : Boolean(process.stdin.isTTY);

  const [dims, setDims] = useState<{ columns: number; rows: number }>({
    columns: stdout?.columns || process.stdout.columns || 100,
    rows: stdout?.rows || process.stdout.rows || 30
  });

  const [inputValue, setInputValue] = useState('');
  const [slashDismissed, setSlashDismissed] = useState(false);
  const [slashSelectedIndex, setSlashSelectedIndex] = useState(0);
  const [vividMode, setVividMode] = useState<boolean>(kernel.commandRegistry.isVividMode());
  const [uiMode, setUiMode] = useState<HarnessMode>(kernel.harness.getMode());
  const [uiEffort, setUiEffort] = useState<HarnessEffortLevel>(kernel.harness.getEffort());
  const [isBusy, setIsBusy] = useState(false);
  const [taskStatusLabel, setTaskStatusLabel] = useState('READY');
  const [mascotLifecycle, setMascotLifecycle] = useState<OrisTaskLifecycleState>('idle');
  const [mascotCaption, setMascotCaption] = useState<string | undefined>(undefined);
  const [sharedTick, setSharedTick] = useState(0);
  const [sharedDeltaMs, setSharedDeltaMs] = useState(140);
  const mascotControllerRef = useRef<OrisMascotController | null>(null);
  const lastEscapeCancelRef = useRef<number>(0);
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

  const lastCtrlCRef = useRef<number>(0);

  const appendFeed = useCallback((entry: Omit<TuiFeedEntry, 'id' | 'timestamp'>) => {
    setFeed(prev => [
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

  const isHeroIdle =
    feed.length === 0 && !streamingBuffer && !pendingApproval && !isSlashMenuVisible;
  const compactHeader =
    dims.rows < 25 || feed.length > 1 || Boolean(streamingBuffer) || Boolean(pendingApproval);
  const topStarRows = isHeroIdle
    ? Math.max(2, Math.floor((dims.rows - 22) / 2))
    : dims.rows < 24
      ? 1
      : 2;
  const bottomStarRows = isHeroIdle ? Math.max(1, dims.rows - 22 - topStarRows) : 0;

  // Synchronized shared delta-time animation scheduler for Starfield and Oris MascotInteractive
  useEffect(() => {
    if (!vividMode && !isBusy) return;
    let lastTime = Date.now();
    const intervalMs = isBusy ? 100 : 160;
    const timer = setInterval(() => {
      const now = Date.now();
      const dt = Math.max(16, Math.min(now - lastTime, 400));
      lastTime = now;
      setSharedDeltaMs(dt);
      setSharedTick(prev => prev + 1);
    }, intervalMs);

    if (typeof timer.unref === 'function') {
      timer.unref();
    }
    return () => clearInterval(timer);
  }, [vividMode, isBusy]);

  // Listen to stdin for SGR mouse reports (`\x1b[<btn;X;YM` / `m`) without competing with Ink's keyboard input
  useEffect(() => {
    const stream = stdinCtx?.stdin || process.stdin;
    if (!stream || typeof stream.on !== 'function') return;

    const onRawData = (chunk: Buffer | string) => {
      if (compactHeader) return;
      const str = typeof chunk === 'string' ? chunk : chunk.toString('utf8');
      if (!containsSgrMouseSequence(str)) return;
      const mouseEvents = parseSgrMouseEvents(str);
      if (mouseEvents.length === 0) return;

      const ctrl = mascotControllerRef.current;
      if (!ctrl) return;

      const curState = ctrl.getState();
      const anchorRow = topStarRows + 3;
      const hitbox = computeOrisHitbox(dims.columns, dims.rows, curState.x, curState.y, anchorRow, 9);
      let anyHandled = false;
      for (const ev of mouseEvents) {
        const res = ctrl.handleMouseEvent(ev, hitbox);
        if (res.handled) anyHandled = true;
      }
      if (anyHandled) {
        setSharedTick(prev => prev + 1);
      }
    };

    stream.on('data', onRawData);
    return () => {
      stream.off('data', onRawData);
    };
  }, [stdinCtx, dims.columns, dims.rows, compactHeader, topStarRows]);

  // Listen for terminal resize
  useEffect(() => {
    const targetOut = stdout || process.stdout;
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

  // Hook kernel renderer output into TUI feed so slash commands render cleanly inside the Ink viewport
  useEffect(() => {
    const origWriteLine = kernel.renderer.writeLine.bind(kernel.renderer);
    const origRenderInfo = kernel.renderer.renderInfo.bind(kernel.renderer);
    const origRenderWarn = kernel.renderer.renderWarning.bind(kernel.renderer);
    const origRenderErr = kernel.renderer.renderError.bind(kernel.renderer);
    const origRenderAssistant = kernel.renderer.renderAssistantResponse.bind(kernel.renderer);

    let lineCollector: string[] = [];
    let flushTimer: NodeJS.Timeout | null = null;

    const flushCollectedLines = () => {
      if (lineCollector.length === 0) return;
      const joined = lineCollector.join('\n').trim();
      lineCollector = [];
      if (joined) {
        appendFeed({
          role: 'system',
          title: 'ORION Telemetry',
          body: kernel.renderer.stripAnsi(joined),
          statusBadge: 'OUTPUT'
        });
      }
    };

    kernel.renderer.writeLine = (text = '') => {
      lineCollector.push(text);
      if (flushTimer) clearTimeout(flushTimer);
      flushTimer = setTimeout(flushCollectedLines, 40);
    };

    kernel.renderer.renderInfo = (msg: string) => {
      appendFeed({
        role: 'system',
        title: 'Info',
        body: kernel.renderer.stripAnsi(msg),
        statusBadge: 'INFO'
      });
    };

    kernel.renderer.renderWarning = (msg: string) => {
      appendFeed({
        role: 'error',
        title: 'Warning',
        body: kernel.renderer.stripAnsi(msg),
        statusBadge: 'WARN'
      });
    };

    kernel.renderer.renderError = (msg: string) => {
      appendFeed({
        role: 'error',
        title: 'Error',
        body: kernel.renderer.stripAnsi(msg),
        statusBadge: 'ERROR'
      });
    };

    kernel.renderer.renderAssistantResponse = (
      response: string,
      latencyMs: number,
      providerLabel?: string
    ) => {
      appendFeed({
        role: 'assistant',
        title: `ORION [${providerLabel || 'router'}] (${latencyMs}ms)`,
        body: kernel.renderer.stripAnsi(response),
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
      kernel.renderer.writeLine = origWriteLine;
      kernel.renderer.renderInfo = origRenderInfo;
      kernel.renderer.renderWarning = origRenderWarn;
      kernel.renderer.renderError = origRenderErr;
      kernel.renderer.renderAssistantResponse = origRenderAssistant;
      unsubReminders();
      kernel.harness.dispatcher.reminderService.stopBackgroundScheduler();
    };
  }, [kernel, appendFeed]);

  const handleInputChange = useCallback((val: string) => {
    const cleanVal = stripSgrMouseSequences(val);
    setInputValue(cleanVal);
    setSlashDismissed(false);
    setSlashSelectedIndex(0);
  }, []);

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
      body: `Task cancelled.${cancelRes.terminatedProcesses > 0 ? ` Terminated ${cancelRes.terminatedProcesses} child process(es).` : ''}`,
      statusBadge: 'CANCELLED'
    });
  }, [appendFeed, isBusy, kernel]);

  const executeSubmittedInput = useCallback(
    async (rawText: string) => {
      const trimmed = rawText.trim();
      if (!trimmed) return;

      setInputValue('');
      setSlashDismissed(false);
      setSlashSelectedIndex(0);

      if (trimmed.startsWith('/')) {
        const normalized = trimmed.replace(/^\/\/+/, '/');
        const parts = normalized.slice(1).trim().split(/\s+/);
        const cmdName = `/${(parts[0] || '').toLowerCase()}`;
        const cmdArgs = parts.slice(1);

        if (cmdName === '/clear') {
          setFeed([]);
          setMascotLifecycle('idle');
          setMascotCaption(undefined);
          kernel.harness.contextManager.clearTurns();
          kernel.orchestrator.getMemoryService().clearMemory();
          return;
        }

        if (cmdName === '/vivid') {
          const entry = kernel.commandRegistry.getCommand('/vivid');
          if (entry) {
            const res = await entry.handler(cmdArgs, trimmed);
            setVividMode(kernel.commandRegistry.isVividMode());
            appendFeed({
              role: 'system',
              title: '/vivid',
              body: res.summary,
              statusBadge: kernel.commandRegistry.isVividMode() ? 'VIVID' : 'MINIMAL'
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
        if (!trimmed.startsWith('/') && !trimmed.startsWith('@') && kernel.harness.getMode() === 'Plan') {
          setMascotLifecycle('working');
          setMascotCaption('ORIS • EXECUTING PLAN LOOP...');
          const rep = await kernel.harness.runLoop({
            goal: trimmed,
            mode: 'Plan',
            signal: taskSignal,
            onToken: (tok) => setStreamingBuffer(prev => prev + tok)
          });
          setStreamingBuffer('');
          if (rep.status === 'CANCELLED' || taskSignal.aborted) {
            setTaskStatusLabel('CANCELLED');
            setMascotLifecycle('cancelled');
            setMascotCaption('ORIS • TASK CANCELLED (ESC)');
            return;
          }
          setMascotLifecycle(rep.status === 'COMPLETED' && rep.verified ? 'success' : 'error');
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
              setStreamingBuffer(prev => prev + tok);
            }
          });
          setStreamingBuffer('');
          setVividMode(kernel.commandRegistry.isVividMode());
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
          taskSignal.aborted ||
          /cancelled|aborted/i.test(String(err?.message || ''));
        setMascotLifecycle(isCancelErr ? 'cancelled' : 'error');
        setMascotCaption(isCancelErr ? 'ORIS • TASK CANCELLED (ESC)' : 'ORIS • ALERT / ERROR');
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

  // Keyboard navigation for Escape-to-Cancel, Mode/Effort cycling, Status card, SlashMenu, Approval Cards, Scrollback
  useInput(
    (input, key) => {
    if (containsSgrMouseSequence(input)) {
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
        setInputValue('');
        appendFeed({
          role: 'system',
          title: 'Exit Confirmation',
          body: 'Press Ctrl+C again within 1.5s (or type /exit) to quit ORION CLI.',
          statusBadge: 'HINT'
        });
      }
      return;
    }

    // Ctrl+P opens a live Runtime Settings & Policy Status card
    if (key.ctrl && input === 'p') {
      const rs = kernel.omniRouter.getStatus();
      const policyOk = kernel.policyService.verifyProtectedPolicyIntegrity().valid;
      const estop = ProcessSupervisor.getInstance().isEstopActive();
      appendFeed({
        role: 'system',
        title: 'ORION Runtime Settings & Governance Status',
        body: [
          `Mode: ${kernel.harness.getMode()}  |  Effort: ${kernel.harness.getEffort()}  |  Space Visuals: ${vividMode ? 'Vivid' : 'Minimal'}`,
          `Active Engine: ${rs.id}/${rs.currentModel}  |  Protected Policy: ${policyOk ? 'VERIFIED' : 'DEGRADED'}  |  E-Stop: ${estop ? 'ENGAGED' : 'CLEAR'}`,
          `Working Directory: ${kernel.projectRoot}`
        ].join('\n'),
        statusBadge: 'STATUS'
      });
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
    }

    if (key.pageUp) {
      setScrollOffset(prev => Math.min(Math.max(0, feed.length - 3), prev + 3));
      return;
    }
    if (key.pageDown) {
      setScrollOffset(prev => Math.max(0, prev - 3));
      return;
    }

    // SlashMenu navigation when visible
    if (isSlashMenuVisible && filteredSlashCommands.length > 0) {
      if (key.upArrow) {
        setSlashSelectedIndex(prev =>
          prev <= 0 ? filteredSlashCommands.length - 1 : prev - 1
        );
        return;
      }
      if (key.downArrow) {
        setSlashSelectedIndex(prev =>
          prev >= filteredSlashCommands.length - 1 ? 0 : prev + 1
        );
        return;
      }
      if (key.tab && !key.shift) {
        const chosen = filteredSlashCommands[slashSelectedIndex] || filteredSlashCommands[0];
        if (chosen) {
          setInputValue(`${chosen.command} `);
        }
        return;
      }
      if (key.escape) {
        setSlashDismissed(true);
        return;
      }
    }

    // Tab cycles Mode (`Build -> Plan -> Chat`); Shift+Tab cycles Effort (`low -> medium -> high -> max`)
    if (key.tab && !isBusy) {
      if (key.shift) {
        const curEffort = kernel.harness.getEffort();
        const nextEffort = EFFORT_CYCLE[(EFFORT_CYCLE.indexOf(curEffort) + 1) % EFFORT_CYCLE.length];
        kernel.harness.setEffort(nextEffort);
        setUiEffort(nextEffort);
      } else if (!isSlashMenuVisible) {
        const curMode = kernel.harness.getMode();
        const nextMode = MODE_CYCLE[(MODE_CYCLE.indexOf(curMode) + 1) % MODE_CYCLE.length];
        kernel.harness.setMode(nextMode);
        setUiMode(nextMode);
      }
    }
    },
    { isActive: isRawModeSupported }
  );

  const handlePromptSubmit = useCallback(
    (val: string) => {
      if (
        isSlashMenuVisible &&
        filteredSlashCommands.length > 0 &&
        val.trim().startsWith('/') &&
        !val.trim().includes(' ')
      ) {
        const chosen = filteredSlashCommands[slashSelectedIndex] || filteredSlashCommands[0];
        if (chosen && chosen.command !== val.trim().toLowerCase()) {
          executeSubmittedInput(chosen.command);
          return;
        }
      }
      executeSubmittedInput(val);
    },
    [executeSubmittedInput, filteredSlashCommands, isSlashMenuVisible, slashSelectedIndex]
  );

  const routerStatus = kernel.omniRouter.getStatus();
  const estopActive = ProcessSupervisor.getInstance().isEstopActive();
  const pendingQueue: PendingApprovalRequest[] = kernel.securityMiddleware.getPendingApprovals();
  const attachedCount = kernel.harness.workspaceService.listAttachments().length;

  const maxVisibleFeedItems = dims.rows < 24 ? 3 : dims.rows < 34 ? 6 : 10;
  const endIdx = Math.max(0, feed.length - scrollOffset);
  const startIdx = Math.max(0, endIdx - maxVisibleFeedItems);
  const visibleFeed = feed.slice(startIdx, endIdx);

  return (
    <Box flexDirection="column" width={dims.columns} height={dims.rows} justifyContent="space-between">
      {/* Top Starfield + Scrollable Activity Feed */}
      <Box flexDirection="column" width="100%">
        <Starfield
          ink={ink}
          columns={dims.columns}
          rows={topStarRows}
          vividMode={vividMode}
          noColor={noColor}
          externalTick={sharedTick}
          deltaMs={sharedDeltaMs}
          seedOffset={0}
        />

        {visibleFeed.length > 0 || streamingBuffer || pendingApproval || scrollOffset > 0 ? (
          <Box flexDirection="column" paddingX={2} marginY={0} width="100%">
            {scrollOffset > 0 ? (
              <Text color={noColor ? undefined : 'yellow'}>
                ▲ Viewing historical output (scroll offset -{scrollOffset} • PgDn to return to live)
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

              return (
                <Box
                  key={item.id}
                  flexDirection="column"
                  marginBottom={1}
                  borderStyle="round"
                  borderColor={noColor ? undefined : roleColor}
                  paddingX={1}
                >
                  <Box justifyContent="space-between" width="100%">
                    <Text bold color={noColor ? undefined : roleColor}>
                      {item.title}
                    </Text>
                    <Text dimColor>
                      {item.statusBadge ? `[${item.statusBadge}] ` : ''}
                      {item.timestamp}
                    </Text>
                  </Box>
                  <Text color={noColor ? undefined : '#f8fafc'}>
                    {item.body.slice(0, 900)}
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
                marginBottom={1}
              >
                <Text bold color={noColor ? undefined : '#38bdf8'}>
                  ⟳ Streaming [{routerStatus.id}/{routerStatus.currentModel}]...
                </Text>
                <Text>{streamingBuffer}</Text>
              </Box>
            ) : null}

            {pendingApproval ? (
              <Box
                flexDirection="column"
                borderStyle="double"
                borderColor={noColor ? undefined : 'yellow'}
                paddingX={2}
                marginBottom={1}
              >
                <Text bold color={noColor ? undefined : 'yellow'}>
                  ⚠ TIER 2 OPERATOR CONFIRMATION REQUIRED — {pendingApproval.request.toolId} ({pendingApproval.request.riskLevel})
                </Text>
                <Text>Reason: {pendingApproval.request.reason}</Text>
                <Text dimColor>
                  Arguments: {JSON.stringify(pendingApproval.request.arguments).slice(0, 220)}
                </Text>
                <Text bold color={noColor ? undefined : '#38bdf8'}>
                  Press [Y] to Approve & Execute, or [N] / [Esc] to Deny.
                </Text>
              </Box>
            ) : null}
          </Box>
        ) : null}
      </Box>

      {/* Center / Bottom Hero Capsule + SlashMenu Dropup */}
      <Box flexDirection="column" width="100%">
        <SlashMenu
          ink={ink}
          visible={isSlashMenuVisible}
          query={inputValue}
          commands={filteredSlashCommands}
          selectedIndex={slashSelectedIndex}
          maxVisibleItems={dims.rows < 26 ? 5 : 8}
          noColor={noColor}
        />

        <Capsule
          ink={ink}
          inputValue={inputValue}
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
          attachedFilesCount={attachedCount}
          pendingApprovalsCount={pendingQueue.length}
          compactHeader={compactHeader}
          noColor={noColor}
          columns={dims.columns}
          rows={dims.rows}
          mascotLifecycle={mascotLifecycle}
          mascotStatusCaption={mascotCaption}
          mascotControllerRef={mascotControllerRef}
          externalTick={sharedTick}
          deltaMs={sharedDeltaMs}
          inputFocused={isRawModeSupported}
        />

        {bottomStarRows > 0 ? (
          <Starfield
            ink={ink}
            columns={dims.columns}
            rows={bottomStarRows}
            vividMode={vividMode}
            noColor={noColor}
            externalTick={sharedTick}
            deltaMs={sharedDeltaMs}
            seedOffset={97}
          />
        ) : null}

        <Box justifyContent="center" width="100%">
          <Text color={noColor ? undefined : '#7dd3fc'}>✦ </Text>
          <Text color={noColor ? undefined : '#64748b'}>Tip: Use </Text>
          <Text bold color={noColor ? undefined : '#e2e8f0'}>/vivid</Text>
          <Text color={noColor ? undefined : '#64748b'}> to toggle space visuals</Text>
        </Box>
      </Box>
    </Box>
  );
};

/**
 * Launches the full-screen React + Ink ORION TUI application in the alternate screen buffer,
 * guaranteeing terminal restoration on all exit paths.
 */
export async function runOrionInkTui(options: {
  kernel: OrionCliKernel;
  router: OrionCliCommandRouter;
}): Promise<number> {
  const ink = await loadInkPrimitives();
  const screenGuard = new AlternateScreenGuard(process.stdout);
  let exitCode = 0;

  const cleanupTerminal = () => {
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
        onRequestExit: handleRequestExit
      }),
      {
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
