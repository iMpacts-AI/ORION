import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AssistantState, OrionMode, SystemSnapshot, ActivityEvent, TaskState, PrivacyState } from '../shared/types';
import { eventBus } from '../shared/events';
import { MainContentArea } from './hud/MainContentArea';
import {
  Send,
  Square,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Terminal,
  Cpu,
  Globe,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  Play,
  Mic,
  Eye,
  Lock,
  Activity,
  FolderOpen,
  FileText,
  Monitor,
  Bot,
  Search
} from 'lucide-react';

export type WorkstationExecutionState =
  | 'Standby'
  | 'Planning'
  | 'Awaiting Approval'
  | 'Running'
  | 'Verifying'
  | 'Completed'
  | 'Failed'
  | 'Blocked'
  | 'Cancelled';

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  executionState?: WorkstationExecutionState;
  agentId?: string;
  providerModel?: string;
  toolCalls?: any[];
  toolResults?: any[];
  browserReport?: any;
  isStreaming?: boolean;
  errorRecoverySuggestion?: string;
}

interface ActiveAppEntry {
  id: string;
  displayName: string;
  status: 'Open' | 'Launching' | 'Not running' | 'Launch failed' | 'Unknown';
  verifiedWindow: boolean;
  windowTitle: string | null;
  processName: string | null;
  processId: number | null;
  isForeground: boolean;
  brandRgb: [number, number, number];
  iconVerifiedLocal: boolean;
  iconDataUrl?: string;
  detail?: string | null;
}

const BrandAppIcon: React.FC<{ app: ActiveAppEntry; size?: number }> = ({ app, size = 20 }) => {
  if (app.iconDataUrl) {
    return (
      <img
        src={app.iconDataUrl}
        alt={app.displayName}
        style={{ width: size, height: size }}
        className="rounded-sm object-contain flex-shrink-0"
      />
    );
  }
  const [r, g, b] = app.brandRgb || [139, 92, 246];
  return (
    <span
      style={{
        width: size,
        height: size,
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.18)`,
        borderColor: `rgba(${r}, ${g}, ${b}, 0.55)`,
        color: `rgb(${r}, ${g}, ${b})`
      }}
      className="rounded flex items-center justify-center border text-[10px] font-bold flex-shrink-0"
    >
      {app.displayName.slice(0, 1).toUpperCase()}
    </span>
  );
};

const getInitialMode = (): OrionMode => {
  try {
    const params = new URLSearchParams(window.location.search);
    const queryMode = params.get('mode')?.toUpperCase();
    if (queryMode && ['COMMAND', 'VISION', 'COMPUTER', 'SYSTEM', 'NETWORK', 'MEMORY', 'TITAN', 'DEMO'].includes(queryMode)) {
      return queryMode as OrionMode;
    }
    const hashMode = window.location.hash.replace('#', '').toUpperCase();
    if (hashMode && ['COMMAND', 'VISION', 'COMPUTER', 'SYSTEM', 'NETWORK', 'MEMORY', 'TITAN', 'DEMO'].includes(hashMode)) {
      return hashMode as OrionMode;
    }
  } catch {}
  return 'COMMAND';
};

export const App: React.FC = () => {
  const [assistantState, setAssistantState] = useState<AssistantState>('STANDBY');
  const [executionState, setExecutionState] = useState<WorkstationExecutionState>('Standby');
  const [executionDetail, setExecutionDetail] = useState<string>('Ready for task execution');
  const [currentMode, setCurrentMode] = useState<OrionMode>(getInitialMode);
  const [workspaceTab, setWorkspaceTab] = useState<'WORKSTATION' | 'BROWSER' | 'AGENTS' | 'LEGACY_HUD'>('WORKSTATION');

  const [privacy, setPrivacy] = useState<PrivacyState>({
    micActive: false,
    cameraActive: false,
    screenCaptureActive: false,
    userConfirmationRequired: true
  });

  const [snapshot, setSnapshot] = useState<SystemSnapshot | null>(null);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [currentTask, setCurrentTask] = useState<TaskState | null>(null);

  // Conversation & Input State
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 'welcome_msg',
      role: 'assistant',
      content:
        'ORION Workstation online. Real Windows process/window verification, closed-loop Chrome execution, and the 10-agent engineering command roster are active. Enter a task below or select a quick action.',
      timestamp: Date.now(),
      executionState: 'Completed',
      agentId: 'commander',
      providerModel: 'ollama:llama3.1:8b'
    }
  ]);
  const [isExecuting, setIsExecuting] = useState(false);

  // Active Applications State
  const [activeApps, setActiveApps] = useState<ActiveAppEntry[]>([]);
  const [activeOsWindow, setActiveOsWindow] = useState<{ title: string; processName: string } | null>(null);
  const [isRefreshingApps, setIsRefreshingApps] = useState(false);

  // Multi-Agent & Provider State
  const [activeAgentId, setActiveAgentId] = useState<string>('commander');
  const [agentRoster, setAgentRoster] = useState<any[]>([]);
  const [agentTasks, setAgentTasks] = useState<any[]>([]);
  const [backendHealth, setBackendHealth] = useState<any>(null);
  const [routerStatus, setRouterStatus] = useState<any>(null);

  // Security & Approvals State
  const [estopActive, setEstopActive] = useState(false);
  const [policyVerified, setPolicyVerified] = useState(true);
  const [policyHash, setPolicyHash] = useState('3dbbe5b1dfbf058a...');
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

  // Browser Harness Interactive State
  const [browserObservation, setBrowserObservation] = useState<any>(null);
  const [browserStages, setBrowserStages] = useState<Array<{ stage: string; detail: string; timestamp: number }>>([]);
  const [browserUrlInput, setBrowserUrlInput] = useState('https://example.com');
  const [browserSearchInput, setBrowserSearchInput] = useState('official ORION GitHub repository');

  // Right Drawer Collapsible Sections
  const [rightDrawerOpen, setRightDrawerOpen] = useState(true);
  const [diagnosticsExpanded, setDiagnosticsExpanded] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const streamingMsgIdRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const refreshWorkstationState = useCallback(async (forceApps = false) => {
    const api = window.orionApi || window.arvisApi;
    if (!api) return;

    try {
      const [snap, appsData, rosterData, secData, rStatus, bObs] = await Promise.all([
        api.getSystemSnapshot().catch(() => null),
        api.getActiveAppsState ? api.getActiveAppsState(forceApps).catch(() => null) : Promise.resolve(null),
        api.getAgentsRoster ? api.getAgentsRoster().catch(() => null) : Promise.resolve(null),
        api.getSecurityStatus ? api.getSecurityStatus().catch(() => null) : Promise.resolve(null),
        api.getAIRouterStatus ? api.getAIRouterStatus().catch(() => null) : Promise.resolve(null),
        api.browserObserve ? api.browserObserve().catch(() => null) : Promise.resolve(null)
      ]);

      if (snap) {
        setSnapshot(snap);
        eventBus.emit('system.stats.updated', { snapshot: snap });
      }
      if (appsData && Array.isArray(appsData.apps)) {
        setActiveApps(appsData.apps);
        if (appsData.activeWindow) {
          setActiveOsWindow(appsData.activeWindow);
        }
      }
      if (rosterData) {
        if (rosterData.activeAgentId) setActiveAgentId(rosterData.activeAgentId);
        if (Array.isArray(rosterData.roster)) setAgentRoster(rosterData.roster);
        if (Array.isArray(rosterData.tasks)) setAgentTasks(rosterData.tasks);
        if (rosterData.backendHealth) setBackendHealth(rosterData.backendHealth);
      }
      if (secData) {
        setEstopActive(Boolean(secData.estopActive));
        setPolicyVerified(Boolean(secData.policyIntegrityVerified));
        if (secData.policyHash) setPolicyHash(String(secData.policyHash).slice(0, 16) + '...');
        if (Array.isArray(secData.pendingApprovals)) {
          setPendingApprovals(secData.pendingApprovals);
          if (secData.pendingApprovals.length > 0 && executionState !== 'Running') {
            setExecutionState('Awaiting Approval');
          }
        }
      }
      if (rStatus) {
        setRouterStatus(rStatus);
      }
      if (bObs) {
        setBrowserObservation(bObs);
      }
    } catch {}
  }, [executionState]);

  useEffect(() => {
    refreshWorkstationState(true);
    const interval = setInterval(() => {
      refreshWorkstationState(false);
    }, 3000);

    const api = window.orionApi || window.arvisApi;
    if (api && api.getInitialMode) {
      api.getInitialMode().then((mode: string) => {
        if (mode === 'DEMO') {
          setCurrentMode('DEMO');
          setWorkspaceTab('LEGACY_HUD');
        }
      }).catch(() => {});
    }

    const unsubStream = api?.onStreamToken
      ? api.onStreamToken(({ token }) => {
          const activeId = streamingMsgIdRef.current;
          if (!activeId) return;
          setMessages(prev =>
            prev.map(m =>
              m.id === activeId
                ? { ...m, content: (m.content || '') + token, isStreaming: true }
                : m
            )
          );
        })
      : undefined;

    const unsubState = api?.onOrchestratorStateChanged
      ? api.onOrchestratorStateChanged(({ state, detail }) => {
          const mapped: Record<string, WorkstationExecutionState> = {
            PLANNING: 'Planning',
            EXECUTING: 'Running',
            VERIFYING: 'Verifying',
            COMPLETED: 'Completed',
            FAILED: 'Failed',
            BLOCKED: 'Blocked',
            CANCELLED: 'Cancelled',
            AWAITING_APPROVAL: 'Awaiting Approval'
          };
          if (mapped[state]) {
            setExecutionState(mapped[state]);
          }
          if (detail) {
            setExecutionDetail(detail);
          }
        })
      : undefined;

    const unsubBrowserStage = api?.onBrowserStageChanged
      ? api.onBrowserStageChanged((stageEvt) => {
          setBrowserStages(prev => [...prev.slice(-18), stageEvt]);
          setExecutionDetail(`[Browser ${stageEvt.stage}] ${stageEvt.detail}`);
          if (stageEvt.stage === 'PLAN') setExecutionState('Planning');
          else if (stageEvt.stage === 'AUTHORIZE' && stageEvt.detail.toLowerCase().includes('approval')) {
            setExecutionState('Awaiting Approval');
          } else if (stageEvt.stage === 'EXECUTE') setExecutionState('Running');
          else if (stageEvt.stage === 'VERIFY') setExecutionState('Verifying');
        })
      : undefined;

    const unsubscribeActivity = eventBus.subscribe('activity.logged', () => {
      setActivities(eventBus.getActivityHistory());
    });

    return () => {
      clearInterval(interval);
      if (unsubStream) unsubStream();
      if (unsubState) unsubState();
      if (unsubBrowserStage) unsubBrowserStage();
      unsubscribeActivity();
    };
  }, [refreshWorkstationState]);

  const computeRecoverySuggestion = (errText: string): string => {
    const lower = (errText || '').toLowerCase();
    if (lower.includes('emergency stop')) {
      return 'Click "Reset E-Stop" in the top bar to clear the emergency lock before running new actions.';
    }
    if (lower.includes('authorization required') || lower.includes('approval')) {
      return 'Review the Pending Approval card in the right panel and click "Approve" to authorize this operation.';
    }
    if (lower.includes('policy violation') || lower.includes('restricted') || lower.includes('prohibited')) {
      return 'Target path or command is inside a protected system boundary. Choose a safe workspace path inside the project repository.';
    }
    if (lower.includes('enoent') || lower.includes('not found') || lower.includes('unavailable')) {
      return 'Verify that the target application or URL exists and is reachable, then retry.';
    }
    if (lower.includes('timed out') || lower.includes('timeout')) {
      return 'The target took too long to respond. Check network connectivity or retry with a simpler query.';
    }
    return 'Inspect the tool execution evidence below or check the Diagnostics drawer for full error details.';
  };

  const handleSendPrompt = async (overridePrompt?: string) => {
    const query = (overridePrompt !== undefined ? overridePrompt : userInput).trim();
    if (!query || isExecuting) return;

    if (overridePrompt === undefined) {
      setUserInput('');
    }

    const userMsg: ConversationMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now()
    };

    const assistantMsgId = `asst_${Date.now() + 1}`;
    streamingMsgIdRef.current = assistantMsgId;

    const placeholderMsg: ConversationMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      executionState: 'Planning',
      agentId: activeAgentId,
      providerModel: routerStatus ? `${routerStatus.id}:${routerStatus.currentModel}` : 'ollama:llama3.1:8b',
      isStreaming: true
    };

    setMessages(prev => [...prev, userMsg, placeholderMsg]);
    setIsExecuting(true);
    setExecutionState('Planning');
    setExecutionDetail(`Analyzing: "${query.slice(0, 70)}"`);

    const api = window.orionApi || window.arvisApi;
    if (!api) {
      setIsExecuting(false);
      return;
    }

    try {
      const lower = query.toLowerCase();
      const isClosedLoopChromeTask =
        /^(?:please\s+)?(?:open|launch)\s+(?:google\s+)?chrome[.!]?$/i.test(query) ||
        (lower.includes('in chrome') && /https?:\/\//i.test(query)) ||
        (lower.includes('search for') && lower.includes('orion') && lower.includes('github')) ||
        (lower.includes('open the official repository') && lower.includes('summarize'));

      if (isClosedLoopChromeTask && api.browserExecuteClosedLoop) {
        setExecutionState('Running');
        setBrowserStages([]);
        const report = await api.browserExecuteClosedLoop({
          goal: query,
          visibleWindow: true
        });

        const finalState: WorkstationExecutionState =
          report.status === 'COMPLETED'
            ? 'Completed'
            : report.status === 'AWAITING_APPROVAL'
              ? 'Awaiting Approval'
              : report.status === 'CANCELLED'
                ? 'Cancelled'
                : report.status === 'ESTOPPED' || report.status === 'BLOCKED'
                  ? 'Blocked'
                  : 'Failed';

        setExecutionState(finalState);
        setExecutionDetail(report.summary || report.error || '');

        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: report.summary || report.error || 'Browser task finished.',
                  executionState: finalState,
                  browserReport: report,
                  isStreaming: false,
                  errorRecoverySuggestion: !report.success
                    ? computeRecoverySuggestion(report.error || report.summary)
                    : undefined
                }
              : m
          )
        );
        await refreshWorkstationState(true);
        return;
      }

      setExecutionState('Running');
      const result = await api.processCommand(query, 'TEXT');
      const hasPolicyBlock =
        result?.response?.includes('SECURITY POLICY') ||
        result?.toolResults?.some((r: any) => /POLICY VIOLATION|BLOCKED|Emergency Stop/i.test(r.error || ''));
      const hasApprovalPending =
        result?.toolResults?.some((r: any) => /AUTHORIZATION REQUIRED/i.test(r.error || ''));

      const finalExecState: WorkstationExecutionState = hasApprovalPending
        ? 'Awaiting Approval'
        : hasPolicyBlock
          ? 'Blocked'
          : result?.success
            ? 'Completed'
            : 'Failed';

      setExecutionState(finalExecState);
      setExecutionDetail(
        result?.success
          ? `Verified completion in ${result.metrics?.totalCommandLatencyMs || 0}ms`
          : result?.response || 'Task failed'
      );

      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: result?.response || m.content || 'Task finished.',
                executionState: finalExecState,
                toolCalls: result?.toolCallsExecuted || [],
                toolResults: result?.toolResults || [],
                isStreaming: false,
                errorRecoverySuggestion: !result?.success
                  ? computeRecoverySuggestion(result?.response || '')
                  : undefined
              }
            : m
        )
      );
    } catch (err: any) {
      const isCancelled = /cancel|abort/i.test(err?.message || '');
      const stateAfter: WorkstationExecutionState = isCancelled ? 'Cancelled' : 'Failed';
      setExecutionState(stateAfter);
      setExecutionDetail(err?.message || 'Task execution failed');
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: isCancelled
                  ? 'Task cancelled by operator.'
                  : `Execution failed: ${err?.message || String(err)}`,
                executionState: stateAfter,
                isStreaming: false,
                errorRecoverySuggestion: computeRecoverySuggestion(err?.message || '')
              }
            : m
        )
      );
    } finally {
      streamingMsgIdRef.current = null;
      setIsExecuting(false);
      await refreshWorkstationState(true);
    }
  };

  const handleStopActiveTask = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!api) return;
    try {
      if (api.cancelCommand) {
        await api.cancelCommand('Stopped by operator from workstation UI');
      } else if (api.cancelComputerTask) {
        await api.cancelComputerTask('Stopped by operator');
      }
      setExecutionState('Cancelled');
      setExecutionDetail('Active task cancelled by operator.');
      setIsExecuting(false);
    } catch {}
  };

  const handleToggleEstop = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!api) return;
    if (estopActive) {
      await api.resetEmergencyStopComputer?.();
      setEstopActive(false);
      setExecutionState('Standby');
      setExecutionDetail('Emergency Stop reset by operator. System ready.');
    } else {
      await api.emergencyStopComputer?.();
      await api.cancelCommand?.('EMERGENCY STOP TRIGGERED');
      setEstopActive(true);
      setExecutionState('Blocked');
      setExecutionDetail('EMERGENCY STOP ACTIVE — All mutating desktop and browser operations are locked.');
      setIsExecuting(false);
    }
    await refreshWorkstationState(true);
  };

  const handleAppClick = async (app: ActiveAppEntry) => {
    const api = window.orionApi || window.arvisApi;
    if (!api || !api.focusOrOpenApp) return;

    setExecutionState('Running');
    setExecutionDetail(
      app.status === 'Open'
        ? `Focusing ${app.displayName} window...`
        : `Launching ${app.displayName} and verifying window...`
    );

    const res = await api.focusOrOpenApp(app.id);
    if (res?.success) {
      setExecutionState('Completed');
      setExecutionDetail(
        res.action === 'FOCUSED'
          ? `Focused ${app.displayName} window.`
          : `Launched and verified ${app.displayName}.`
      );
    } else {
      setExecutionState(estopActive ? 'Blocked' : 'Failed');
      setExecutionDetail(res?.error || `Failed to activate ${app.displayName}.`);
    }
    await refreshWorkstationState(true);
  };

  const handleApproveRequest = async (approvalId: string) => {
    const api = window.orionApi || window.arvisApi;
    if (!api || !api.approvePendingRequest) return;
    const res = await api.approvePendingRequest(approvalId);
    if (res?.success) {
      setExecutionState('Completed');
      setExecutionDetail(`Approved request ${approvalId}. Action token bound.`);
    }
    await refreshWorkstationState(false);
  };

  const handleDenyRequest = async (approvalId: string) => {
    const api = window.orionApi || window.arvisApi;
    if (!api || !api.denyPendingRequest) return;
    await api.denyPendingRequest(approvalId);
    setExecutionState('Blocked');
    setExecutionDetail(`Denied approval request ${approvalId}.`);
    await refreshWorkstationState(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  const getStateBadgeStyle = (state: WorkstationExecutionState) => {
    switch (state) {
      case 'Completed':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35';
      case 'Running':
      case 'Planning':
      case 'Verifying':
        return 'bg-violet-500/20 text-violet-200 border-violet-500/40 animate-pulse';
      case 'Awaiting Approval':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Failed':
      case 'Blocked':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Cancelled':
        return 'bg-slate-700/40 text-slate-300 border-slate-600/50';
      default:
        return 'bg-slate-800/70 text-slate-300 border-slate-700/60';
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#07090E] text-slate-100 overflow-hidden select-none font-sans">
      {/* TOP WORKSTATION HEADER BAR */}
      <header className="h-14 px-4 bg-[#0B0F19]/95 border-b border-white/[0.07] flex items-center justify-between flex-shrink-0 z-30">
        {/* Left: Brand Identity & Workspace Switcher */}
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600/30 to-indigo-600/20 border border-violet-500/40 flex items-center justify-center shadow-inner">
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold tracking-wider text-white">ORION</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/30">
                  OS WORKSTATION
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate max-w-[240px]">
                {executionDetail}
              </div>
            </div>
          </div>

          {/* Primary Navigation Pills */}
          <nav className="flex items-center bg-[#07090E] p-1 rounded-lg border border-white/[0.06] space-x-1">
            <button
              onClick={() => setWorkspaceTab('WORKSTATION')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                workspaceTab === 'WORKSTATION'
                  ? 'bg-violet-600/25 text-violet-200 border border-violet-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Conversation</span>
            </button>
            <button
              onClick={() => setWorkspaceTab('BROWSER')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                workspaceTab === 'BROWSER'
                  ? 'bg-violet-600/25 text-violet-200 border border-violet-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Chrome Control</span>
            </button>
            <button
              onClick={() => setWorkspaceTab('AGENTS')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                workspaceTab === 'AGENTS'
                  ? 'bg-violet-600/25 text-violet-200 border border-violet-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Agents ({agentRoster.length || 10})</span>
            </button>
            <button
              onClick={() => setWorkspaceTab('LEGACY_HUD')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                workspaceTab === 'LEGACY_HUD'
                  ? 'bg-violet-600/25 text-violet-200 border border-violet-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Subsystems & Demo</span>
            </button>
          </nav>
        </div>

        {/* Center/Right: Live Execution Status, Active Agent, Provider, & E-Stop */}
        <div className="flex items-center space-x-3">
          {/* Live Execution State Badge */}
          <div className={`px-2.5 py-1 rounded-md border text-xs font-mono flex items-center space-x-1.5 ${getStateBadgeStyle(executionState)}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{executionState.toUpperCase()}</span>
          </div>

          {/* Active Agent Selector */}
          <div className="hidden xl:flex items-center space-x-1.5 bg-[#07090E] px-2.5 py-1 rounded-md border border-white/[0.07] text-xs">
            <Bot className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-slate-400">Agent:</span>
            <select
              value={activeAgentId}
              onChange={async (e) => {
                const nextId = e.target.value;
                setActiveAgentId(nextId);
                const api = window.orionApi || window.arvisApi;
                await api?.setActiveAgent?.(nextId);
                await refreshWorkstationState(false);
              }}
              className="bg-transparent text-slate-200 font-mono text-xs focus:outline-none cursor-pointer"
            >
              {(agentRoster.length > 0
                ? agentRoster
                : [
                    { id: 'commander', displayName: 'ORION Commander' },
                    { id: 'recon', displayName: 'Reconnaissance Engineer' },
                    { id: 'security', displayName: 'Security Engineer' },
                    { id: 'implementation', displayName: 'Implementation Engineer' },
                    { id: 'qa', displayName: 'QA & Verification' },
                    { id: 'windows', displayName: 'Windows & Desktop' }
                  ]
              ).map((ag: any) => (
                <option key={ag.id} value={ag.id} className="bg-[#0B0F19] text-slate-200">
                  {ag.id} — {ag.displayName}
                </option>
              ))}
            </select>
          </div>

          {/* Active Model / Provider Pill */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-[#07090E] px-2.5 py-1 rounded-md border border-white/[0.07] text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-300">
              {routerStatus ? `${routerStatus.id}:${routerStatus.currentModel}` : 'ollama:llama3.1:8b'}
            </span>
          </div>

          {/* Prominent E-STOP Control */}
          <button
            onClick={handleToggleEstop}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold tracking-wider transition-all flex items-center space-x-1.5 border ${
              estopActive
                ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/30 animate-pulse'
                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}
            title={estopActive ? 'Click to Reset Emergency Stop' : 'Immediate Hardware/Process Emergency Stop'}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{estopActive ? 'RESET E-STOP' : 'E-STOP'}</span>
          </button>

          {/* Toggle Right Diagnostics Drawer */}
          <button
            onClick={() => setRightDrawerOpen(prev => !prev)}
            className="p-1.5 rounded-md bg-[#07090E] border border-white/[0.07] text-slate-400 hover:text-slate-200 text-xs"
            title="Toggle Execution Details & Diagnostics Panel"
          >
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN 3-COLUMN WORKSTATION BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PERSISTENT ACTIVE APPLICATIONS PANEL */}
        <aside className="w-64 bg-[#0B0F19]/90 border-r border-white/[0.06] flex flex-col justify-between flex-shrink-0">
          <div className="p-3.5 space-y-3 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Active Applications
              </span>
              <button
                onClick={async () => {
                  setIsRefreshingApps(true);
                  await refreshWorkstationState(true);
                  setIsRefreshingApps(false);
                }}
                className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
                title="Refresh live Windows process and window state"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingApps ? 'animate-spin text-violet-400' : ''}`} />
              </button>
            </div>

            {/* Active OS Foreground Window Readout */}
            {activeOsWindow && (
              <div className="p-2.5 rounded-lg bg-[#07090E] border border-white/[0.05] space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>OS FOREGROUND WINDOW</span>
                  <span className="text-emerald-400 font-mono">LIVE</span>
                </div>
                <div className="text-xs font-medium text-slate-200 truncate" title={activeOsWindow.title}>
                  {activeOsWindow.title || 'Desktop'}
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate">
                  Process: {activeOsWindow.processName}
                </div>
              </div>
            )}

            {/* Tracked Applications List (Chrome, Spotify, VS Code, Discord, Notepad, Explorer, Terminal) */}
            <div className="space-y-1.5">
              {activeApps.map(app => {
                const isOpen = app.status === 'Open';
                const isLaunching = app.status === 'Launching';
                const isFailed = app.status === 'Launch failed';

                return (
                  <button
                    key={app.id}
                    onClick={() => handleAppClick(app)}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-start space-x-2.5 group ${
                      app.isForeground
                        ? 'bg-violet-600/15 border-violet-500/40'
                        : isOpen
                          ? 'bg-[#111625]/90 hover:bg-[#161C2E] border-white/[0.08]'
                          : 'bg-[#07090E]/60 hover:bg-[#111625]/60 border-white/[0.04] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <BrandAppIcon app={app} size={22} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-100 truncate">
                          {app.displayName}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isOpen
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : isLaunching
                                ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                                : isFailed
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center space-x-1.5 text-[10px]">
                        {app.verifiedWindow ? (
                          <span className="text-emerald-400/90 flex items-center space-x-1 truncate">
                            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate" title={app.windowTitle || 'Window verified'}>
                              {app.windowTitle || 'Window verified'}
                            </span>
                          </span>
                        ) : isOpen ? (
                          <span className="text-slate-400 truncate">Background process running</span>
                        ) : (
                          <span className="text-slate-500 group-hover:text-violet-300 transition-colors">
                            Click to launch & verify
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Left Footer: System Telemetry Mini Summary */}
          <div className="p-3 border-t border-white/[0.06] bg-[#07090E]/80 space-y-2 text-[11px] font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span>CPU LOAD</span>
              <span className="text-slate-200">{snapshot?.cpu.usagePercent ?? 0}%</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 transition-all duration-300"
                style={{ width: `${Math.min(100, snapshot?.cpu.usagePercent ?? 0)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-slate-400 pt-1">
              <span>MEMORY</span>
              <span className="text-slate-200">
                {snapshot ? `${(snapshot.memory.usedBytes / 1073741824).toFixed(1)} / ${(snapshot.memory.totalBytes / 1073741824).toFixed(0)} GB` : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400 pt-1">
              <span>POLICY SHA-256</span>
              <span className={policyVerified ? 'text-emerald-400' : 'text-rose-400'}>
                {policyVerified ? 'VERIFIED' : 'TAMPERED'}
              </span>
            </div>
          </div>
        </aside>

        {/* CENTER WORKSPACE VIEW */}
        <main className="flex-1 flex flex-col bg-[#07090E] overflow-hidden relative">
          {/* TAB 1: CHAT-FIRST CONVERSATION WORKSTATION */}
          {workspaceTab === 'WORKSTATION' && (
            <>
              {/* Quick-Task Bar */}
              <div className="px-6 py-2.5 bg-[#0B0F19]/60 border-b border-white/[0.05] flex items-center space-x-2 overflow-x-auto flex-shrink-0">
                <span className="text-[11px] font-mono text-slate-400 mr-1 flex-shrink-0">QUICK TASKS:</span>
                {[
                  { label: 'Open Chrome', prompt: 'Open Chrome.' },
                  { label: 'Open example.com in Chrome', prompt: 'Open https://example.com in Chrome.' },
                  { label: 'Search ORION GitHub Repo', prompt: 'Search for the official ORION GitHub repository and show me the result.' },
                  { label: 'Summarize Official ORION Repo', prompt: 'Open the official repository and summarize its visible project information.' },
                  { label: 'System Overview', prompt: 'Give me an overview of this machine' },
                  { label: 'Check Display Brightness', prompt: 'What is my current screen brightness?' }
                ].map(q => (
                  <button
                    key={q.label}
                    disabled={isExecuting}
                    onClick={() => handleSendPrompt(q.prompt)}
                    className="px-2.5 py-1 rounded-md bg-[#111625] hover:bg-violet-600/20 border border-white/[0.07] hover:border-violet-500/40 text-xs text-slate-300 hover:text-violet-200 transition-all flex-shrink-0 disabled:opacity-40"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Conversation Thread */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-3xl rounded-xl p-4 border ${
                        msg.role === 'user'
                          ? 'bg-violet-600/20 border-violet-500/35 text-slate-100'
                          : 'bg-[#0B0F19] border-white/[0.07] text-slate-200 shadow-lg'
                      }`}
                    >
                      {/* Message Header */}
                      <div className="flex items-center justify-between space-x-4 mb-2 text-[11px] font-mono text-slate-400">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-300">
                            {msg.role === 'user' ? 'OPERATOR' : `ORION (${msg.agentId || 'commander'})`}
                          </span>
                          {msg.providerModel && msg.role === 'assistant' && (
                            <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-400">
                              {msg.providerModel}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {msg.executionState && (
                            <span className={`px-1.5 py-0.5 rounded border text-[10px] ${getStateBadgeStyle(msg.executionState)}`}>
                              {msg.executionState}
                            </span>
                          )}
                          <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>

                      {/* Message Body */}
                      <div className="text-sm leading-relaxed whitespace-pre-wrap select-text">
                        {msg.content || (msg.isStreaming ? 'Executing and verifying...' : '')}
                      </div>

                      {/* Closed-Loop Browser Report Card */}
                      {msg.browserReport && (
                        <div className="mt-3 p-3 rounded-lg bg-[#07090E] border border-white/[0.07] space-y-2 text-xs font-mono">
                          <div className="flex items-center justify-between">
                            <span className="text-violet-300 font-semibold flex items-center space-x-1.5">
                              <Globe className="w-3.5 h-3.5" />
                              <span>CLOSED-LOOP CHROME VERIFICATION</span>
                            </span>
                            <span className={msg.browserReport.postconditionsVerified ? 'text-emerald-400' : 'text-rose-400'}>
                              {msg.browserReport.postconditionsVerified ? 'POSTCONDITIONS VERIFIED' : 'UNVERIFIED / FAILED'}
                            </span>
                          </div>
                          {msg.browserReport.url && (
                            <div className="text-slate-300 truncate">
                              URL: <span className="text-cyan-300 select-text">{msg.browserReport.url}</span>
                            </div>
                          )}
                          {msg.browserReport.title && (
                            <div className="text-slate-300 truncate">
                              Title: <span className="text-white select-text">{msg.browserReport.title}</span>
                            </div>
                          )}
                          {Array.isArray(msg.browserReport.searchResults) && msg.browserReport.searchResults.length > 0 && (
                            <div className="space-y-1 pt-1 border-t border-white/[0.06]">
                              <div className="text-[10px] text-slate-400">EXTRACTED SEARCH RESULTS:</div>
                              {msg.browserReport.searchResults.slice(0, 4).map((sr: any, idx: number) => (
                                <div key={idx} className="p-1.5 rounded bg-[#0B0F19] border border-white/[0.04]">
                                  <div className="text-violet-300 font-semibold truncate select-text">{sr.title}</div>
                                  <div className="text-cyan-400 text-[11px] truncate select-text">{sr.url}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          {Array.isArray(msg.browserReport.steps) && (
                            <div className="pt-1 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                              {msg.browserReport.steps.map((s: any, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px] text-slate-300"
                                  title={s.detail}
                                >
                                  {s.stage}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tool Execution Evidence Cards */}
                      {Array.isArray(msg.toolResults) && msg.toolResults.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.toolResults.map((tr: any, idx: number) => (
                            <div
                              key={tr.toolCallId || idx}
                              className="p-2.5 rounded-lg bg-[#07090E] border border-white/[0.07] text-xs font-mono space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-violet-300 font-semibold">{tr.toolId}</span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                                    tr.success && tr.verificationStatus === 'VERIFIED'
                                      ? 'bg-emerald-500/15 text-emerald-300'
                                      : tr.success
                                        ? 'bg-blue-500/15 text-blue-300'
                                        : 'bg-rose-500/15 text-rose-300'
                                  }`}
                                >
                                  {tr.verificationStatus || (tr.success ? 'VERIFIED' : 'FAILED')} ({tr.executionTimeMs || 0}ms)
                                </span>
                              </div>
                              {tr.error && <div className="text-rose-300 select-text">{tr.error}</div>}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Recovery Suggestion on Failure */}
                      {msg.errorRecoverySuggestion && (
                        <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold">Recovery Suggestion: </span>
                            <span>{msg.errorRecoverySuggestion}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Task Input Bar */}
              <div className="p-4 bg-[#0B0F19]/95 border-t border-white/[0.07]">
                <div className="max-w-4xl mx-auto flex items-end space-x-3">
                  <div className="flex-1 bg-[#07090E] border border-white/[0.1] focus-within:border-violet-500/60 rounded-xl p-2.5 transition-all">
                    <textarea
                      rows={2}
                      value={userInput}
                      onChange={e => setUserInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Give ORION a task (e.g., 'Open https://example.com in Chrome.' or 'Search for the official ORION GitHub repository')... Press Enter to send, Shift+Enter for newline."
                      className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none select-text"
                    />
                  </div>

                  {isExecuting ? (
                    <button
                      onClick={handleStopActiveTask}
                      className="px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-rose-600/25 transition-all"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      <span>STOP</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendPrompt()}
                      disabled={!userInput.trim()}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-violet-600/20 transition-all"
                    >
                      <span>EXECUTE</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: DEDICATED CHROME & BROWSER CONTROL PANEL */}
          {workspaceTab === 'BROWSER' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-violet-400" />
                    <span>Closed-Loop Chrome & Web Execution Engine</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    OBSERVE → UNDERSTAND → PLAN → VALIDATE → AUTHORIZE → EXECUTE → OBSERVE AGAIN → VERIFY → REPORT
                  </p>
                </div>
                <button
                  onClick={async () => {
                    const api = window.orionApi || window.arvisApi;
                    await api?.browserOpenChrome?.({ visibleWindow: true });
                    await refreshWorkstationState(true);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center space-x-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch & Focus Visible Chrome</span>
                </button>
              </div>

              {/* Direct URL Navigation & Web Search Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0B0F19] border border-white/[0.07] space-y-3">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    1. Navigate Chrome to URL
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={browserUrlInput}
                      onChange={e => setBrowserUrlInput(e.target.value)}
                      className="flex-1 bg-[#07090E] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-slate-100 font-mono"
                    />
                    <button
                      onClick={() => {
                        setWorkspaceTab('WORKSTATION');
                        handleSendPrompt(`Open ${browserUrlInput} in Chrome.`);
                      }}
                      className="px-3.5 py-2 rounded-lg bg-violet-600/30 hover:bg-violet-600/40 border border-violet-500/40 text-violet-200 text-xs font-medium"
                    >
                      Navigate & Verify
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0B0F19] border border-white/[0.07] space-y-3">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    2. Search Web & Extract Verified Links
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={browserSearchInput}
                      onChange={e => setBrowserSearchInput(e.target.value)}
                      className="flex-1 bg-[#07090E] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                    <button
                      onClick={() => {
                        setWorkspaceTab('WORKSTATION');
                        handleSendPrompt(`Search for ${browserSearchInput} and show me the result.`);
                      }}
                      className="px-3.5 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-200 text-xs font-medium"
                    >
                      Search & Extract
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Browser Observation Readout */}
              <div className="p-4 rounded-xl bg-[#0B0F19] border border-white/[0.07] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-violet-300 font-semibold">ACTIVE BROWSER OBSERVATION</span>
                  <span className="text-slate-400">
                    Adapter: {browserObservation?.adapterMode || 'HTTP_FETCH'} | ReadyState: {browserObservation?.readyState || 'complete'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400">Active URL: </span>
                    <span className="text-cyan-300 select-text">{browserObservation?.url || 'about:blank'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Page Title: </span>
                    <span className="text-white select-text">{browserObservation?.title || 'Blank Window'}</span>
                  </div>
                </div>
                {browserObservation?.extractedText && (
                  <div className="p-3 rounded bg-[#07090E] border border-white/[0.05] text-slate-300 max-h-40 overflow-y-auto select-text">
                    {browserObservation.extractedText}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REAL 10-AGENT ENGINEERING COMMAND SYSTEM */}
          {workspaceTab === 'AGENTS' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-violet-400" />
                    <span>Multi-Agent Engineering Roster & Task Coordinator</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real inspectable agents with enforced permission ceilings, tool allowlists, and verified evidence records.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    const api = window.orionApi || window.arvisApi;
                    if (!api?.delegateAgentGoal) return;
                    setExecutionState('Running');
                    setExecutionDetail('Coordinating parallel Recon + Security + QA verification...');
                    await api.delegateAgentGoal('Verify Chrome & UI workstation integration and security boundaries', 'src/main/index.ts');
                    setExecutionState('Completed');
                    await refreshWorkstationState(false);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Run Coordinated Recon + Security + QA Pass</span>
                </button>
              </div>

              {/* 10-Agent Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {agentRoster.map((ag: any) => (
                  <div
                    key={ag.id}
                    className={`p-4 rounded-xl border transition-all space-y-2 ${
                      activeAgentId === ag.id
                        ? 'bg-violet-600/10 border-violet-500/40'
                        : 'bg-[#0B0F19] border-white/[0.07]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-mono text-violet-300 font-semibold">{ag.id}</span>
                        <h3 className="text-sm font-semibold text-white">{ag.displayName}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[10px] font-mono text-slate-300">
                          {ag.maxPermissionLevel} {ag.readOnly ? '(RO)' : ''}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            ag.status === 'RUNNING'
                              ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                              : ag.status === 'COMPLETED'
                                ? 'bg-emerald-500/15 text-emerald-300'
                                : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {ag.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">{ag.roleTitle}</div>
                    <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-white/[0.05]">
                      <span className="text-indigo-300">{ag.backend}</span>
                      <button
                        onClick={async () => {
                          const api = window.orionApi || window.arvisApi;
                          await api?.setActiveAgent?.(ag.id);
                          setActiveAgentId(ag.id);
                        }}
                        className="text-violet-400 hover:text-violet-300 underline"
                      >
                        {activeAgentId === ag.id ? 'Active Coordinator' : 'Select Agent'}
                      </button>
                    </div>
                    {ag.latestResultSummary && (
                      <div className="p-2 rounded bg-[#07090E] text-[11px] font-mono text-slate-300 truncate" title={ag.latestResultSummary}>
                        Latest: {ag.latestResultSummary}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SUBSYSTEMS & LEGACY MODES (COMPUTER / VISION / TITAN / DEMO) */}
          {workspaceTab === 'LEGACY_HUD' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 py-2 bg-[#0B0F19] border-b border-white/[0.06] flex items-center space-x-2">
                {(['COMPUTER', 'VISION', 'SYSTEM', 'NETWORK', 'MEMORY', 'TITAN', 'DEMO'] as OrionMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setCurrentMode(m)}
                    className={`px-2.5 py-1 rounded text-xs font-mono ${
                      currentMode === m
                        ? 'bg-violet-600/30 text-violet-200 border border-violet-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-hidden">
                <MainContentArea
                  currentMode={currentMode === 'COMMAND' ? 'COMPUTER' : currentMode}
                  assistantState={assistantState}
                  snapshot={snapshot}
                  activities={activities}
                  currentTask={currentTask}
                  cameraActive={privacy.cameraActive}
                />
              </div>
            </div>
          )}
        </main>

        {/* RIGHT EXECUTION DETAILS, APPROVALS & COLLAPSIBLE DIAGNOSTICS PANEL */}
        {rightDrawerOpen && (
          <aside className="w-80 bg-[#0B0F19]/95 border-l border-white/[0.06] flex flex-col overflow-y-auto flex-shrink-0 p-3.5 space-y-4">
            {/* 1. PENDING OPERATOR APPROVALS (Shown prominently whenever non-empty) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Authorization Gate
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-300">
                  {pendingApprovals.length} Pending
                </span>
              </div>

              {pendingApprovals.length === 0 ? (
                <div className="p-2.5 rounded-lg bg-[#07090E] border border-white/[0.05] text-xs text-slate-400 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>No pending approval requests. Action-bound gate active.</span>
                </div>
              ) : (
                pendingApprovals.map((req: any) => (
                  <div
                    key={req.approvalId}
                    className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-amber-300 font-semibold">{req.toolId}</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 text-[10px]">
                        {req.evaluatedRisk}
                      </span>
                    </div>
                    <div className="text-slate-200 text-[11px]">{req.reason}</div>
                    <div className="flex space-x-2 pt-1">
                      <button
                        onClick={() => handleApproveRequest(req.approvalId)}
                        className="flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDenyRequest(req.approvalId)}
                        className="flex-1 py-1.5 rounded bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-xs"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 2. CURRENT EXECUTION CONTEXT */}
            <div className="p-3 rounded-lg bg-[#07090E] border border-white/[0.06] space-y-2 text-xs font-mono">
              <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-400">
                Active Execution Context
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">State:</span>
                <span className="text-violet-300">{executionState}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coordinator:</span>
                <span className="text-slate-200">{activeAgentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Provider:</span>
                <span className="text-indigo-300">
                  {routerStatus ? `${routerStatus.id}:${routerStatus.currentModel}` : 'ollama:llama3.1:8b'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">E-Stop:</span>
                <span className={estopActive ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {estopActive ? 'LOCKED (ACTIVE)' : 'ARMED (READY)'}
                </span>
              </div>
            </div>

            {/* 3. COLLAPSIBLE TASK & BROWSER STEP TIMELINE */}
            <div className="border-t border-white/[0.06] pt-3">
              <button
                onClick={() => setHistoryExpanded(prev => !prev)}
                className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200"
              >
                <span>Execution Timeline ({browserStages.length + agentTasks.length})</span>
                {historyExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {historyExpanded && (
                <div className="mt-2 space-y-1.5 max-h-56 overflow-y-auto">
                  {browserStages.slice(-6).map((bs, idx) => (
                    <div key={idx} className="p-2 rounded bg-[#07090E] border border-white/[0.04] text-[11px] font-mono">
                      <span className="text-violet-400 font-semibold">[{bs.stage}]</span>{' '}
                      <span className="text-slate-300">{bs.detail}</span>
                    </div>
                  ))}
                  {agentTasks.slice(-6).reverse().map((t: any) => (
                    <div key={t.taskId} className="p-2 rounded bg-[#07090E] border border-white/[0.04] text-[11px] font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-indigo-300 font-semibold">{t.agentId}</span>
                        <span className={t.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-300'}>
                          {t.status}
                        </span>
                      </div>
                      <div className="text-slate-300 truncate">{t.title}</div>
                    </div>
                  ))}
                  {browserStages.length === 0 && agentTasks.length === 0 && (
                    <div className="text-xs text-slate-500 py-2">No tasks executed in this session yet.</div>
                  )}
                </div>
              )}
            </div>

            {/* 4. COLLAPSIBLE ADVANCED DIAGNOSTICS & PROVIDER STATUS */}
            <div className="border-t border-white/[0.06] pt-3">
              <button
                onClick={() => setDiagnosticsExpanded(prev => !prev)}
                className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200"
              >
                <span>Backend & Provider Diagnostics</span>
                {diagnosticsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {diagnosticsExpanded && (
                <div className="mt-2 p-2.5 rounded-lg bg-[#07090E] border border-white/[0.05] space-y-2 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ollama Local:</span>
                    <span className="text-emerald-400">
                      {backendHealth?.ollama?.healthy ? `READY (${backendHealth.ollama.activeModel})` : 'FALLBACK READY'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gemini Cloud:</span>
                    <span className="text-amber-300">
                      {backendHealth?.gemini?.configured ? 'CONFIGURED' : 'NOT CONFIGURED'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Argon Runtime:</span>
                    <span className="text-slate-400">
                      {backendHealth?.argon?.status || 'UNAVAILABLE'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Policy Hash:</span>
                    <span className="text-emerald-400">{policyHash}</span>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
