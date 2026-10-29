import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { PermissionLevel, ToolCall, ToolResult } from '../../shared/types';
import { TaskCategory } from './AIProvider';
import { ToolService } from './ToolService';
import { OrionAIProviderRouter } from './OrionAIProviderRouter';
import { AgentPolicyService, OrionAgentId, ProtectedAgentDefinition } from './AgentPolicyService';
import { ExecutionTraceService } from './ExecutionTraceService';
import { UnifiedMemoryManager } from './UnifiedMemoryManager';
import { ContextBuilder } from './ContextBuilder';
import { ProcessSupervisor } from './computer/ProcessSupervisor';
import { eventBus } from '../../shared/events';

export type EngineeringAgentStatus =
  | 'IDLE'
  | 'QUEUED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'BLOCKED'
  | 'CANCELLED'
  | 'INTERRUPTED';

export interface EngineeringAgentDefinition {
  id: string;
  canonicalPolicyId?: OrionAgentId;
  displayName: string;
  roleTitle: string;
  responsibilities: string[];
  defaultTaskCategory: TaskCategory;
  preferredLocalModel: string;
  fallbackLocalModels: string[];
  backendType: 'ollama' | 'gemini' | 'argon' | 'local-heuristic';
  maxContextTokens: number;
  maxPermissionLevel: PermissionLevel;
  allowedTools: string[];
  timeoutMs: number;
  maxRetries: number;
  readOnly: boolean;
  isBuiltIn: boolean;
  isRemovable: boolean;
  protectedSystemPrompt: string;
  outputContractDescription: string;
}

export interface AgentTaskEvidenceResult {
  taskId: string;
  agentId: string;
  displayName: string;
  backendUsed: string;
  status: EngineeringAgentStatus;
  verified: boolean;
  summary: string;
  filesInspected: string[];
  filesChanged: string[];
  commandsOrToolsExecuted: string[];
  testOutcomes: Array<{ suiteOrCheck: string; passed: boolean; details: string }>;
  evidenceReferences: string[];
  blockers: string[];
  remainingRisks: string[];
  startedAt: number;
  completedAt: number;
  durationMs: number;
  retryCount: number;
  error?: string;
}

export interface EngineeringAgentTask {
  taskId: string;
  agentId: string;
  title: string;
  prompt: string;
  status: EngineeringAgentStatus;
  dependencies: string[];
  targetFilesForWrite: string[];
  toolCallsToRun?: Array<{ toolId: string; arguments?: Record<string, any> }>;
  parentMaxPermission: PermissionLevel;
  timeoutMs: number;
  maxRetries: number;
  retryCount: number;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  durationMs?: number;
  backendResolved?: string;
  result?: AgentTaskEvidenceResult;
  error?: string;
}

export interface AgentLifecycleEvent {
  eventId: string;
  timestamp: number;
  agentId: string;
  taskId?: string;
  eventType:
    | 'agent.registered'
    | 'agent.removed'
    | 'agent.task.queued'
    | 'agent.task.started'
    | 'agent.tool.called'
    | 'agent.tool.completed'
    | 'agent.task.completed'
    | 'agent.task.failed'
    | 'agent.task.blocked'
    | 'agent.task.cancelled'
    | 'agent.task.interrupted';
  message: string;
  metadata?: Record<string, any>;
}

export interface AgentFindingForReconciliation {
  agentId: string;
  claimId: string;
  topic: string;
  conclusion: string;
  verifiedByTool: boolean;
  evidenceReferences: string[];
  filesInspected: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ReconciledFindingReport {
  topic: string;
  hasConflict: boolean;
  allFindingsPreserved: AgentFindingForReconciliation[];
  authoritativeConclusion: string;
  winningAgentId: string;
  resolutionReason: string;
  requiresTargetedVerification: boolean;
}

export interface AgentRuntimeRosterEntry {
  id: string;
  displayName: string;
  roleTitle: string;
  status: EngineeringAgentStatus;
  backend: string;
  backendHealthy: boolean;
  preferredLocalModel: string;
  maxPermissionLevel: PermissionLevel;
  readOnly: boolean;
  allowedToolsCount: number;
  currentTask: string | null;
  currentTaskId: string | null;
  latestResultSummary: string | null;
  latestEvidenceRef: string | null;
  isBuiltIn: boolean;
}

export interface AgentExecutionRecord {
  recordId: string;
  agentId: OrionAgentId;
  displayName: string;
  taskDescription: string;
  selectedModel: string;
  fallbackChain: string[];
  parentMaxPermission: PermissionLevel;
  effectiveMaxPermission: PermissionLevel;
  startedAt: number;
  completedAt: number;
  durationMs: number;
  status: 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'BLOCKED';
  verified: boolean;
  toolCallsCount: number;
  outputSummary: string;
  error?: string;
}

export interface AgentStructuredOutput {
  agentId: OrionAgentId;
  displayName: string;
  roleTitle: string;
  selectedModel: string;
  status: 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'BLOCKED';
  verified: boolean;
  response: string;
  toolCallsExecuted: ToolCall[];
  toolResults: ToolResult[];
  durationMs: number;
  contextTokensUsedEstimate: number;
  contextBudgetMaxTokens: number;
  policyIntegrityVerified: boolean;
}

const BUILTIN_ENGINEERING_ROSTER: EngineeringAgentDefinition[] = [
  {
    id: 'commander',
    canonicalPolicyId: 'core',
    displayName: 'ORION Commander',
    roleTitle: 'Technical Coordinator & Multi-Agent Task Orchestrator',
    responsibilities: [
      'Break complex engineering requests into concrete subtasks with explicit dependencies.',
      'Assign subtasks to specialist agents and track dependencies, file locks, and blockers.',
      'Reconcile conflicting findings using source evidence and produce the final verified report.'
    ],
    defaultTaskCategory: 'PLANNING',
    preferredLocalModel: 'llama3.1:8b',
    fallbackLocalModels: ['gpt-oss:20b', 'qwen2.5-coder:7b'],
    backendType: 'ollama',
    maxContextTokens: 65536,
    maxPermissionLevel: 'HIGH',
    allowedTools: ['*'],
    timeoutMs: 30000,
    maxRetries: 1,
    readOnly: false,
    isBuiltIn: true,
    isRemovable: false,
    protectedSystemPrompt:
      'You are ORION Commander, the technical coordinator and task orchestrator for the ORION Build CLI Engineering Command Centre.',
    outputContractDescription: 'Coordinated multi-agent task plan, reconciled evidence, and verified status summary.'
  },
  {
    id: 'recon',
    canonicalPolicyId: 'research',
    displayName: 'Reconnaissance Engineer',
    roleTitle: 'Read-Only Codebase Discovery & Execution Path Tracer',
    responsibilities: [
      'Inspect repository layout, entry points, modules, configurations, and tests.',
      'Locate real implementations vs dead code or stubs and trace execution paths.',
      'Produce structured file maps and symbol inventories without modifying files.'
    ],
    defaultTaskCategory: 'CODING',
    preferredLocalModel: 'qwen2.5-coder:7b',
    fallbackLocalModels: ['llama3.1:8b'],
    backendType: 'ollama',
    maxContextTokens: 65536,
    maxPermissionLevel: 'LOW',
    allowedTools: [
      'file.list_directory',
      'file.read_text',
      'system.get_info',
      'system.get_cpu_usage',
      'system.get_memory_usage',
      'system.get_disk_usage'
    ],
    timeoutMs: 30000,
    maxRetries: 2,
    readOnly: true,
    isBuiltIn: true,
    isRemovable: false,
    protectedSystemPrompt:
      'You are the ORION Reconnaissance Engineer. You have strictly READ-ONLY access to inspect files, directories, and execution paths.',
    outputContractDescription: 'Read-only repository map, symbol locations, and execution path trace.'
  },
  {
    id: 'security',
    canonicalPolicyId: 'auditor',
    displayName: 'Security Engineer',
    roleTitle: 'Permission Gate, Trust Boundary & Adversarial Security Auditor',
    responsibilities: [
      'Audit permission gates, content-bound approvals, E-Stop handling, and protected paths.',
      'Inspect shell/PowerShell execution, environment variable handling, and secret redaction.',
      'Verify that untrusted file, web, and MCP outputs cannot escalate privileges.'
    ],
    defaultTaskCategory: 'COMPLEX_REASONING',
    preferredLocalModel: 'deepseek-r1:14b',
    fallbackLocalModels: ['gpt-oss:20b', 'llama3.1:8b'],
    backendType: 'ollama',
    maxContextTokens: 65536,
    maxPermissionLevel: 'LOW',
    allowedTools: [
      'file.list_directory',
      'file.read_text',
      'system.get_info',
      'system.get_cpu_usage',
      'system.get_memory_usage',
      'system.get_disk_usage',
      'system.get_network_status'
    ],
    timeoutMs: 65000,
    maxRetries: 1,
    readOnly: true,
    isBuiltIn: true,
    isRemovable: false,
    protectedSystemPrompt:
      'You are the ORION Security Engineer. Perform strict, read-only security audits across permission boundaries, approvals, E-Stop, and secret redaction.',
    outputContractDescription: 'Security audit verdict with file/line evidence, exploitability analysis, and verification status.'
  },
  {
    id: 'implementation',
    canonicalPolicyId: 'engineer',
    displayName: 'Implementation Engineer',
    roleTitle: 'Scoped Code Repair, Type Safety & Feature Implementation Specialist',
    responsibilities: [
      'Implement scoped code changes and defect repairs in assigned files.',
      'Preserve existing working behavior and maintain strict TypeScript type safety.',
      'Record exact files changed and prepare changes for QA verification.'
    ],
    defaultTaskCategory: 'CODING',
    preferredLocalModel: 'qwen2.5-coder:7b',
    fallbackLocalModels: ['qwen3-coder:30b', 'llama3.1:8b'],
    backendType: 'ollama',
    maxContextTokens: 32768,
    maxPermissionLevel: 'MEDIUM',
    allowedTools: [
      'file.list_directory',
      'file.read_text',
      'file.write_text',
      'system.get_info',
      'system.get_cpu_usage',
      'system.get_memory_usage',
      'system.get_disk_usage'
    ],
    timeoutMs: 45000,
    maxRetries: 1,
    readOnly: false,
    isBuiltIn: true,
    isRemovable: false,
    protectedSystemPrompt:
      'You are the ORION Implementation Engineer. Apply surgical, well-typed workspace code fixes while respecting file write locks and protected paths.',
    outputContractDescription: 'Summary of code changes, root causes resolved, and files modified.'
  },
  {
    id: 'qa',
    canonicalPolicyId: 'auditor',
    displayName: 'Test and QA Engineer',
    roleTitle: 'Independent Verification, Regression Testing & False-Positive Auditor',
    responsibilities: [
      'Verify code changes independently without modifying production source files.',
      'Inspect test coverage, edge cases, failure paths, and exit codes.',
      'Reject false-positive tests that pass without asserting real runtime behavior.'
    ],
    defaultTaskCategory: 'COMPLEX_REASONING',
    preferredLocalModel: 'deepseek-r1:14b',
    fallbackLocalModels: ['qwen2.5-coder:7b', 'llama3.1:8b'],
    backendType: 'ollama',
    maxContextTokens: 65536,
    maxPermissionLevel: 'LOW',
    allowedTools: [
      'file.list_directory',
      'file.read_text',
      'system.get_info',
      'system.get_cpu_usage',
      'system.get_memory_usage',
      'system.get_disk_usage'
    ],
    timeoutMs: 65000,
    maxRetries: 2,
    readOnly: true,
    isBuiltIn: true,
    isRemovable: false,
    protectedSystemPrompt:
      'You are the ORION Test and QA Engineer. You are strictly READ-ONLY on production code and responsible for independent test and build verification.',
    outputContractDescription: 'Independent QA verification report with test outcomes, regressions, and coverage gaps.'
  },
  {
    id: 'windows',
    canonicalPolicyId: 'operator',
    displayName: 'Windows Systems Engineer',
    roleTitle: 'Win32 Process Supervision, App Resolution & Desktop Automation Specialist',
    responsibilities: [
      'Validate Windows executable resolution, detached process supervision, and E-Stop tree termination.',
      'Verify Win32 foreground window detection, PowerShell execution safety, and screen capture.',
      'Ensure desktop and system actions verify observable postconditions.'
    ],
    defaultTaskCategory: 'TOOL_USE',
    preferredLocalModel: 'llama3.1:8b',
    fallbackLocalModels: ['qwen2.5-coder:7b', 'deepseek-r1:14b'],
    backendType: 'ollama',
    maxContextTokens: 32768,
    maxPermissionLevel: 'HIGH',
    allowedTools: [
      'system.*',
      'file.list_directory',
      'file.read_text',
      'computer.*',
      'media.*',
      'info.*'
    ],
    timeoutMs: 30000,
    maxRetries: 1,
    readOnly: false,
    isBuiltIn: true,
    isRemovable: false,
    protectedSystemPrompt:
      'You are the ORION Windows Systems Engineer, responsible for safe Windows 11 process supervision, app resolution, and Win32 verification.',
    outputContractDescription: 'Windows subsystem diagnostic report with process, window, and postcondition telemetry.'
  },
  {
    id: 'architecture',
    canonicalPolicyId: 'auditor',
    displayName: 'Architecture and Performance Engineer',
    roleTitle: 'Dependency Graph, Concurrency, Cancellation & Budget Specialist',
    responsibilities: [
      'Review service boundaries, circular dependencies, and Electron/CLI separation.',
      'Audit concurrency, stream cancellation, timeout enforcement, and retry bounds.',
      'Analyze cold-start latency, memory footprints, and token context budgets.'
    ],
    defaultTaskCategory: 'COMPLEX_REASONING',
    preferredLocalModel: 'qwen3-coder:30b',
    fallbackLocalModels: ['deepseek-r1:14b', 'qwen2.5-coder:7b'],
    backendType: 'ollama',
    maxContextTokens: 65536,
    maxPermissionLevel: 'LOW',
    allowedTools: [
      'file.list_directory',
      'file.read_text',
      'system.get_info',
      'system.get_cpu_usage',
      'system.get_memory_usage',
      'system.get_disk_usage'
    ],
    timeoutMs: 45000,
    maxRetries: 1,
    readOnly: true,
    isBuiltIn: true,
    isRemovable: false,
    protectedSystemPrompt:
      'You are the ORION Architecture and Performance Engineer. Perform read-only architectural, concurrency, and latency analysis.',
    outputContractDescription: 'Architecture & performance review with dependency analysis, latency metrics, and bottleneck findings.'
  },
  {
    id: 'release',
    canonicalPolicyId: 'auditor',
    displayName: 'Integration and Release Engineer',
    roleTitle: 'Build Pipeline, Dependency Integrity, Secret Exclusion & Handoff Specialist',
    responsibilities: [
      'Audit package.json dependencies, TypeScript configs, and Vite/Electron build pipelines.',
      'Ensure zero secrets, .env files, or private tokens are included in handoff archives.',
      'Verify clean-machine reproducibility and release readiness.'
    ],
    defaultTaskCategory: 'CODING',
    preferredLocalModel: 'qwen2.5-coder:7b',
    fallbackLocalModels: ['llama3.1:8b'],
    backendType: 'ollama',
    maxContextTokens: 32768,
    maxPermissionLevel: 'LOW',
    allowedTools: [
      'file.list_directory',
      'file.read_text',
      'system.get_info',
      'system.get_disk_usage'
    ],
    timeoutMs: 30000,
    maxRetries: 1,
    readOnly: true,
    isBuiltIn: true,
    isRemovable: false,
    protectedSystemPrompt:
      'You are the ORION Integration and Release Engineer. Verify build reproducibility, dependency declarations, and secret exclusion.',
    outputContractDescription: 'Release readiness checklist with build, packaging, and secret-hygiene verification.'
  },
  {
    id: 'design',
    canonicalPolicyId: 'vision',
    displayName: 'Design and Experience Engineer',
    roleTitle: 'CLI & Desktop UX Hierarchy, Readability & Visual Diagnostics Specialist',
    responsibilities: [
      'Review CLI output formatting, status tables, approval prompts, and error clarity.',
      'Inspect desktop interface layout so chat remains primary and diagnostics stay collapsible.',
      'Analyze visual screenshots and interface hierarchy when requested.'
    ],
    defaultTaskCategory: 'VISION',
    preferredLocalModel: 'gemma4:26b',
    fallbackLocalModels: ['llama3.1:8b'],
    backendType: 'ollama',
    maxContextTokens: 65536,
    maxPermissionLevel: 'LOW',
    allowedTools: [
      'file.list_directory',
      'file.read_text',
      'computer.observe',
      'system.get_info'
    ],
    timeoutMs: 45000,
    maxRetries: 1,
    readOnly: true,
    isBuiltIn: true,
    isRemovable: false,
    protectedSystemPrompt:
      'You are the ORION Design and Experience Engineer, focused on clean CLI output, operator clarity, and calm visual hierarchy.',
    outputContractDescription: 'UX and interface clarity assessment with actionable layout and formatting findings.'
  },
  {
    id: 'research',
    canonicalPolicyId: 'research',
    displayName: 'Research and Model Integration Engineer',
    roleTitle: 'Model Provider Qualification, Gemini/Ollama/Argon & Evidence Specialist',
    responsibilities: [
      'Inspect provider configurations, model routing chains, and local/cloud model readiness.',
      'Evaluate Gemini, Ollama, OpenRouter, and external backend availability truthfully.',
      'Synthesize evidence-backed comparisons with latency and capability metrics.'
    ],
    defaultTaskCategory: 'SUMMARIZATION',
    preferredLocalModel: 'gpt-oss:20b',
    fallbackLocalModels: ['deepseek-r1:14b', 'llama3.1:8b'],
    backendType: 'ollama',
    maxContextTokens: 65536,
    maxPermissionLevel: 'LOW',
    allowedTools: [
      'browser.search',
      'browser.navigate',
      'file.list_directory',
      'file.read_text',
      'info.weather',
      'info.prayers',
      'memory.list_notes',
      'memory.list_reminders',
      'system.get_info'
    ],
    timeoutMs: 30000,
    maxRetries: 2,
    readOnly: true,
    isBuiltIn: true,
    isRemovable: false,
    protectedSystemPrompt:
      'You are the ORION Research and Model Integration Engineer. Never fake provider connections or model availability.',
    outputContractDescription: 'Provider and model integration report with truthful configuration status and evidence.'
  }
];

const AGENT_ID_ALIASES: Record<string, OrionAgentId> = {
  core: 'core',
  commander: 'core',
  engineer: 'engineer',
  implementation: 'engineer',
  research: 'research',
  recon: 'research',
  operator: 'operator',
  windows: 'operator',
  vision: 'vision',
  design: 'vision',
  auditor: 'auditor',
  security: 'auditor',
  qa: 'auditor',
  architecture: 'auditor',
  release: 'auditor'
};

export class OrionAgentSystem {
  private policyService: AgentPolicyService;
  private toolService: ToolService;
  private router: OrionAIProviderRouter;
  private traceService: ExecutionTraceService;
  private contextBuilder: ContextBuilder;
  private activeAgentId: OrionAgentId = 'core';
  private activeEngineeringAgentId: string = 'commander';
  private executionRecords: AgentExecutionRecord[] = [];

  private engineeringRegistry: Map<string, EngineeringAgentDefinition> = new Map();
  private agentLiveStatus: Map<
    string,
    {
      status: EngineeringAgentStatus;
      currentTaskId: string | null;
      currentTaskTitle: string | null;
      latestResultSummary: string | null;
      latestEvidenceRef: string | null;
      lastError?: string;
    }
  > = new Map();
  private tasks: Map<string, EngineeringAgentTask> = new Map();
  private activeAbortControllers: Map<string, AbortController> = new Map();
  private fileWriteLocks: Map<string, string> = new Map();
  private lifecycleEvents: AgentLifecycleEvent[] = [];
  private runtimeStatePath: string;

  constructor(
    policyService: AgentPolicyService,
    toolService: ToolService,
    router: OrionAIProviderRouter,
    traceService?: ExecutionTraceService,
    customStatePath?: string
  ) {
    this.policyService = policyService;
    this.toolService = toolService;
    this.router = router;
    this.traceService = traceService || new ExecutionTraceService();
    this.contextBuilder = new ContextBuilder();
    this.runtimeStatePath =
      customStatePath || path.join(process.cwd(), '.orion_memory', 'agent_runtime_state.json');

    this.initializeBuiltInRegistry();
    this.loadPersistedRuntimeState();
  }

  private initializeBuiltInRegistry(): void {
    // Register the 10-agent engineering team
    for (const def of BUILTIN_ENGINEERING_ROSTER) {
      this.engineeringRegistry.set(def.id, { ...def });
      this.agentLiveStatus.set(def.id, {
        status: 'IDLE',
        currentTaskId: null,
        currentTaskTitle: null,
        latestResultSummary: null,
        latestEvidenceRef: null
      });
    }

    // Ensure the 6 canonical IDs (core, engineer, research, operator, vision, auditor) are also directly addressable
    const canonicalDefs = this.policyService.getAllAgentDefinitions();
    for (const c of canonicalDefs) {
      if (!this.engineeringRegistry.has(c.id)) {
        const isReadOnly = c.maxPermissionLevel === 'LOW';
        this.engineeringRegistry.set(c.id, {
          id: c.id,
          canonicalPolicyId: c.id,
          displayName: c.displayName,
          roleTitle: c.roleTitle,
          responsibilities: [...c.responsibilities],
          defaultTaskCategory: c.defaultTaskCategory,
          preferredLocalModel: c.preferredLocalModel,
          fallbackLocalModels: [...c.fallbackLocalModels],
          backendType: 'ollama',
          maxContextTokens: c.maxContextTokens,
          maxPermissionLevel: c.maxPermissionLevel,
          allowedTools: [...c.allowedTools],
          timeoutMs: c.timeoutMs,
          maxRetries: 1,
          readOnly: isReadOnly,
          isBuiltIn: true,
          isRemovable: false,
          protectedSystemPrompt: c.protectedSystemPrompt,
          outputContractDescription: c.outputContractDescription
        });
      }
      if (!this.agentLiveStatus.has(c.id)) {
        this.agentLiveStatus.set(c.id, {
          status: 'IDLE',
          currentTaskId: null,
          currentTaskTitle: null,
          latestResultSummary: null,
          latestEvidenceRef: null
        });
      }
    }
  }

  public getRuntimeStatePath(): string {
    return this.runtimeStatePath;
  }

  /**
   * Loads persisted custom agents, task history, and lifecycle logs across restarts.
   * Any task that was left in RUNNING or QUEUED state during an unexpected shutdown is
   * deterministically marked INTERRUPTED / FAILED without replaying mutating actions.
   */
  public loadPersistedRuntimeState(): void {
    try {
      if (!fs.existsSync(this.runtimeStatePath)) {
        return;
      }
      const raw = JSON.parse(fs.readFileSync(this.runtimeStatePath, 'utf8'));

      // 1. Restore custom agents
      if (Array.isArray(raw?.customAgents)) {
        for (const custom of raw.customAgents) {
          if (custom && typeof custom.id === 'string' && !this.engineeringRegistry.has(custom.id)) {
            this.engineeringRegistry.set(custom.id, custom as EngineeringAgentDefinition);
            this.agentLiveStatus.set(custom.id, {
              status: 'IDLE',
              currentTaskId: null,
              currentTaskTitle: null,
              latestResultSummary: null,
              latestEvidenceRef: null
            });
          }
        }
      }

      // 2. Restore task history & recover interrupted tasks safely
      let stateMutatedOnRecovery = false;
      if (Array.isArray(raw?.tasks)) {
        for (const savedTask of raw.tasks as EngineeringAgentTask[]) {
          if (!savedTask || typeof savedTask.taskId !== 'string') continue;
          if (savedTask.status === 'RUNNING' || savedTask.status === 'QUEUED') {
            savedTask.status = 'INTERRUPTED';
            savedTask.completedAt = Date.now();
            savedTask.durationMs = savedTask.startedAt ? Date.now() - savedTask.startedAt : 0;
            savedTask.error =
              'Task was interrupted by runtime restart before completion. Mutating actions were not auto-replayed.';
            if (savedTask.result) {
              savedTask.result.status = 'INTERRUPTED';
              savedTask.result.verified = false;
              savedTask.result.error = savedTask.error;
            }
            stateMutatedOnRecovery = true;
            this.recordLifecycleEvent(
              savedTask.agentId,
              'agent.task.interrupted',
              `Recovered interrupted task '${savedTask.taskId}' (${savedTask.title}) on startup.`,
              savedTask.taskId
            );
          }
          this.tasks.set(savedTask.taskId, savedTask);

          // Update agent latest summary from most recent task
          const st = this.agentLiveStatus.get(savedTask.agentId);
          if (st) {
            st.status = savedTask.status === 'INTERRUPTED' ? 'FAILED' : savedTask.status;
            st.currentTaskId = null;
            st.currentTaskTitle = savedTask.title;
            st.latestResultSummary =
              savedTask.result?.summary || savedTask.error || `Status: ${savedTask.status}`;
            st.latestEvidenceRef = savedTask.result?.evidenceReferences?.[0] || savedTask.taskId;
          }
        }
      }

      // 3. Restore lifecycle events
      if (Array.isArray(raw?.lifecycleEvents)) {
        this.lifecycleEvents = raw.lifecycleEvents.slice(-250);
      }

      // Clear any stale file locks on startup
      this.fileWriteLocks.clear();

      if (stateMutatedOnRecovery) {
        this.persistRuntimeState();
      }
    } catch {
      // Fail safe if state file is missing or unreadable
    }
  }

  public persistRuntimeState(): void {
    try {
      const dir = path.dirname(this.runtimeStatePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const customAgents = Array.from(this.engineeringRegistry.values()).filter(a => !a.isBuiltIn);
      const tasksArray = Array.from(this.tasks.values()).slice(-100);
      const payload = {
        updatedAt: new Date().toISOString(),
        activeAgentId: this.activeAgentId,
        activeEngineeringAgentId: this.activeEngineeringAgentId,
        customAgents,
        tasks: tasksArray,
        lifecycleEvents: this.lifecycleEvents.slice(-250)
      };
      const serialized = UnifiedMemoryManager.sanitizeSecrets(
        ExecutionTraceService.redactSensitiveValue(JSON.stringify(payload, null, 2))
      );
      fs.writeFileSync(this.runtimeStatePath, serialized, 'utf8');
    } catch {}
  }

  private recordLifecycleEvent(
    agentId: string,
    eventType: AgentLifecycleEvent['eventType'],
    message: string,
    taskId?: string,
    metadata?: Record<string, any>
  ): AgentLifecycleEvent {
    const sanitizedMessage = UnifiedMemoryManager.sanitizeSecrets(
      ExecutionTraceService.redactSensitiveValue(message)
    );
    const sanitizedMeta = metadata
      ? JSON.parse(
          UnifiedMemoryManager.sanitizeSecrets(
            ExecutionTraceService.redactSensitiveValue(JSON.stringify(metadata))
          )
        )
      : undefined;

    const ev: AgentLifecycleEvent = {
      eventId: `agev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      agentId,
      taskId,
      eventType,
      message: sanitizedMessage,
      metadata: sanitizedMeta
    };
    this.lifecycleEvents.push(ev);
    if (this.lifecycleEvents.length > 300) {
      this.lifecycleEvents.splice(0, this.lifecycleEvents.length - 300);
    }
    eventBus.logActivity('SYSTEM_EVENT', `[${agentId}] ${sanitizedMessage}`, sanitizedMeta);
    return ev;
  }

  public getPolicyService(): AgentPolicyService {
    return this.policyService;
  }

  public getActiveAgentId(): OrionAgentId {
    return this.activeAgentId;
  }

  public getActiveEngineeringAgentId(): string {
    return this.activeEngineeringAgentId;
  }

  public getActiveAgentDefinition(): ProtectedAgentDefinition {
    return this.policyService.getAgentDefinition(this.activeAgentId);
  }

  public setActiveAgent(agentId: string): ProtectedAgentDefinition {
    const clean = agentId.trim().toLowerCase().replace(/^orion[-_\s]*/i, '');
    const customOrEng = this.engineeringRegistry.get(clean);
    if (customOrEng) {
      this.activeEngineeringAgentId = customOrEng.id;
      this.activeAgentId = customOrEng.canonicalPolicyId || AGENT_ID_ALIASES[clean] || 'core';
      const def = this.policyService.getAgentDefinition(this.activeAgentId);
      eventBus.logActivity(
        'SYSTEM_EVENT',
        `Active ORION agent switched to ${customOrEng.displayName} (${customOrEng.id})`
      );
      this.persistRuntimeState();
      return {
        ...def,
        id: this.activeAgentId,
        displayName: customOrEng.displayName,
        roleTitle: customOrEng.roleTitle,
        preferredLocalModel: customOrEng.preferredLocalModel,
        maxPermissionLevel: customOrEng.maxPermissionLevel,
        allowedTools: customOrEng.allowedTools
      };
    }

    const validIds: OrionAgentId[] = ['core', 'engineer', 'research', 'operator', 'vision', 'auditor'];
    if (!validIds.includes(clean as OrionAgentId)) {
      const allKnown = Array.from(this.engineeringRegistry.keys()).join(', ');
      throw new Error(`Unknown ORION agent '${agentId}'. Valid agents: ${allKnown}`);
    }
    this.activeAgentId = clean as OrionAgentId;
    this.activeEngineeringAgentId = clean;
    const def = this.policyService.getAgentDefinition(this.activeAgentId);
    eventBus.logActivity('SYSTEM_EVENT', `Active ORION agent switched to ${def.displayName} (${def.id})`);
    this.persistRuntimeState();
    return def;
  }

  /**
   * Preserves exact 6-agent return contract for backward compatibility with existing tests.
   */
  public getAllAgents(): ProtectedAgentDefinition[] {
    return this.policyService.getAllAgentDefinitions();
  }

  /**
   * Returns all registered engineering & specialist agents in the runtime (the 10 engineering agents + custom agents).
   */
  public getEngineeringAgents(includeLegacyAliases = false): EngineeringAgentDefinition[] {
    const all = Array.from(this.engineeringRegistry.values());
    if (includeLegacyAliases) {
      return all;
    }
    const primaryTenIds = new Set(BUILTIN_ENGINEERING_ROSTER.map(a => a.id));
    return all.filter(a => primaryTenIds.has(a.id) || !a.isBuiltIn);
  }

  public getEngineeringAgentDefinition(agentId: string): EngineeringAgentDefinition | undefined {
    const clean = (agentId || '').trim().toLowerCase().replace(/^orion[-_\s]*/i, '');
    return this.engineeringRegistry.get(clean);
  }

  /**
   * Resolves the real live backend status for a given agent definition.
   * Never fabricates a connection when a provider is unconfigured or unavailable.
   */
  public resolveAgentBackendStatus(def: EngineeringAgentDefinition): {
    backendLabel: string;
    configured: boolean;
    healthy: boolean;
    reason?: string;
  } {
    if (def.backendType === 'argon') {
      return {
        backendLabel: 'argon (UNAVAILABLE)',
        configured: false,
        healthy: false,
        reason: 'UNAVAILABLE: No Argon runtime, SDK, or endpoint is installed in this environment.'
      };
    }

    if (def.backendType === 'gemini') {
      const geminiStatus = this.router.getAllProviderStatuses().find(p => p.id === 'gemini');
      if (!geminiStatus || !geminiStatus.isConfigured) {
        return {
          backendLabel: 'gemini (NOT CONFIGURED)',
          configured: false,
          healthy: false,
          reason: 'GEMINI_API_KEY is not configured in environment.'
        };
      }
      return {
        backendLabel: `gemini:${geminiStatus.currentModel}`,
        configured: true,
        healthy: geminiStatus.isHealthy
      };
    }

    if (def.backendType === 'ollama') {
      const ollama = this.router.getOllamaProvider();
      const installed = ollama?.getInstalledModels() || [];
      const modelName = def.preferredLocalModel || 'llama3.1:8b';
      const ollamaStatus = ollama?.getStatus();
      if (ollamaStatus && ollamaStatus.isConfigured && ollamaStatus.isHealthy) {
        const modelPresent = installed.length === 0 || installed.some(m => m.name === modelName);
        if (modelPresent) {
          return {
            backendLabel: `ollama:${modelName}`,
            configured: true,
            healthy: true
          };
        }
        const fallbackPresent = def.fallbackLocalModels.find(fb => installed.some(m => m.name === fb));
        if (fallbackPresent) {
          return {
            backendLabel: `ollama:${fallbackPresent}`,
            configured: true,
            healthy: true,
            reason: `Preferred model '${modelName}' not installed; using installed fallback '${fallbackPresent}'.`
          };
        }
      }
      return {
        backendLabel: `ollama:${modelName} (local-fallback-ready)`,
        configured: true,
        healthy: Boolean(ollamaStatus?.isHealthy),
        reason: ollamaStatus?.isHealthy ? undefined : 'Ollama daemon offline; deterministic local tool engine active.'
      };
    }

    return {
      backendLabel: 'local-heuristic',
      configured: true,
      healthy: true
    };
  }

  /**
   * Returns the live inspectable roster for `/agents`.
   */
  public getLiveAgentRoster(includeLegacyAliases = false): AgentRuntimeRosterEntry[] {
    const defs = this.getEngineeringAgents(includeLegacyAliases);
    return defs.map(def => {
      const live = this.agentLiveStatus.get(def.id) || {
        status: 'IDLE' as EngineeringAgentStatus,
        currentTaskId: null,
        currentTaskTitle: null,
        latestResultSummary: null,
        latestEvidenceRef: null
      };
      const backendInfo = this.resolveAgentBackendStatus(def);
      return {
        id: def.id,
        displayName: def.displayName,
        roleTitle: def.roleTitle,
        status: live.status,
        backend: backendInfo.backendLabel,
        backendHealthy: backendInfo.healthy,
        preferredLocalModel: def.preferredLocalModel,
        maxPermissionLevel: def.maxPermissionLevel,
        readOnly: def.readOnly,
        allowedToolsCount: def.allowedTools.length,
        currentTask: live.currentTaskTitle,
        currentTaskId: live.currentTaskId,
        latestResultSummary: live.latestResultSummary,
        latestEvidenceRef: live.latestEvidenceRef,
        isBuiltIn: def.isBuiltIn
      };
    });
  }

  /**
   * Validates and registers a custom agent definition without mutating the immutable canonical policy file.
   */
  public registerCustomAgent(input: {
    id: string;
    displayName: string;
    roleTitle: string;
    responsibilities?: string[];
    preferredLocalModel?: string;
    backendType?: 'ollama' | 'gemini' | 'argon' | 'local-heuristic';
    maxPermissionLevel?: PermissionLevel;
    allowedTools?: string[];
    readOnly?: boolean;
    timeoutMs?: number;
    maxRetries?: number;
    protectedSystemPrompt?: string;
  }): EngineeringAgentDefinition {
    const rawId = String(input?.id || '').trim().toLowerCase();
    if (!/^[a-z0-9_-]{2,32}$/.test(rawId)) {
      throw new Error(
        `INVALID_AGENT_ID: Agent ID '${input?.id}' must be 2-32 lowercase alphanumeric, hyphen, or underscore characters.`
      );
    }
    if (this.engineeringRegistry.has(rawId)) {
      throw new Error(`DUPLICATE_AGENT_ID: An agent with ID '${rawId}' is already registered.`);
    }
    if (!input.displayName || !input.displayName.trim()) {
      throw new Error(`INVALID_AGENT_DEFINITION: 'displayName' is required.`);
    }
    if (!input.roleTitle || !input.roleTitle.trim()) {
      throw new Error(`INVALID_AGENT_DEFINITION: 'roleTitle' is required.`);
    }

    const validPermissions: PermissionLevel[] = ['LOW', 'MEDIUM', 'HIGH'];
    const perm: PermissionLevel = input.maxPermissionLevel || 'LOW';
    if (!validPermissions.includes(perm)) {
      throw new Error(
        `INVALID_PERMISSION_LEVEL: Custom agents cannot exceed HIGH permission (received '${perm}').`
      );
    }

    const readOnly = input.readOnly !== undefined ? Boolean(input.readOnly) : perm === 'LOW';
    const defaultTools = readOnly
      ? ['file.list_directory', 'file.read_text', 'system.get_info']
      : ['file.list_directory', 'file.read_text', 'file.write_text', 'system.get_info'];
    const allowedTools = Array.isArray(input.allowedTools) && input.allowedTools.length > 0
      ? input.allowedTools.map(String)
      : defaultTools;

    if (readOnly && allowedTools.some(t => t === 'file.write_text' || t === '*' || t.startsWith('computer.'))) {
      throw new Error(
        `PERMISSION_CONFLICT: Read-only agent '${rawId}' cannot be granted mutating tool permissions (${allowedTools.join(', ')}).`
      );
    }

    const newDef: EngineeringAgentDefinition = {
      id: rawId,
      canonicalPolicyId: readOnly ? 'auditor' : 'engineer',
      displayName: input.displayName.trim(),
      roleTitle: input.roleTitle.trim(),
      responsibilities:
        Array.isArray(input.responsibilities) && input.responsibilities.length > 0
          ? input.responsibilities
          : [input.roleTitle.trim()],
      defaultTaskCategory: readOnly ? 'COMPLEX_REASONING' : 'CODING',
      preferredLocalModel: input.preferredLocalModel || 'qwen2.5-coder:7b',
      fallbackLocalModels: ['llama3.1:8b'],
      backendType: input.backendType || 'ollama',
      maxContextTokens: 32768,
      maxPermissionLevel: perm,
      allowedTools,
      timeoutMs: Math.min(Math.max(input.timeoutMs || 30000, 1000), 120000),
      maxRetries: Math.min(Math.max(input.maxRetries ?? 1, 0), 3),
      readOnly,
      isBuiltIn: false,
      isRemovable: true,
      protectedSystemPrompt:
        input.protectedSystemPrompt ||
        `You are ${input.displayName.trim()} (${rawId}), a specialized ORION engineering agent: ${input.roleTitle.trim()}.`,
      outputContractDescription: 'Structured engineering findings and verified tool observations.'
    };

    this.engineeringRegistry.set(rawId, newDef);
    this.agentLiveStatus.set(rawId, {
      status: 'IDLE',
      currentTaskId: null,
      currentTaskTitle: null,
      latestResultSummary: 'Registered and ready.',
      latestEvidenceRef: null
    });

    this.recordLifecycleEvent(
      rawId,
      'agent.registered',
      `Registered custom agent '${newDef.displayName}' (${rawId}) with ceiling ${newDef.maxPermissionLevel}.`
    );
    this.persistRuntimeState();
    return newDef;
  }

  /**
   * Safely removes a custom/non-built-in agent if it is not currently running a task.
   */
  public removeAgent(agentId: string): { removed: boolean; agentId: string; reason?: string } {
    const clean = (agentId || '').trim().toLowerCase();
    const def = this.engineeringRegistry.get(clean);
    if (!def) {
      return { removed: false, agentId: clean, reason: `Agent '${clean}' does not exist.` };
    }
    if (def.isBuiltIn || !def.isRemovable) {
      return {
        removed: false,
        agentId: clean,
        reason: `Agent '${clean}' (${def.displayName}) is a protected built-in ORION agent and cannot be removed.`
      };
    }
    const live = this.agentLiveStatus.get(clean);
    if (live?.status === 'RUNNING') {
      return {
        removed: false,
        agentId: clean,
        reason: `Agent '${clean}' is currently RUNNING task '${live.currentTaskId}'. Cancel the task before removing the agent.`
      };
    }

    this.engineeringRegistry.delete(clean);
    this.agentLiveStatus.delete(clean);
    if (this.activeEngineeringAgentId === clean) {
      this.activeEngineeringAgentId = 'commander';
      this.activeAgentId = 'core';
    }
    this.recordLifecycleEvent(clean, 'agent.removed', `Removed custom agent '${def.displayName}' (${clean}).`);
    this.persistRuntimeState();
    return { removed: true, agentId: clean };
  }

  public getAllTasks(): EngineeringAgentTask[] {
    return Array.from(this.tasks.values());
  }

  public getTask(taskId: string): EngineeringAgentTask | undefined {
    return this.tasks.get(taskId);
  }

  public getAgentLogs(agentId?: string, limit = 50): AgentLifecycleEvent[] {
    const clean = agentId ? agentId.trim().toLowerCase() : '';
    const filtered = clean
      ? this.lifecycleEvents.filter(e => e.agentId === clean)
      : this.lifecycleEvents;
    return filtered.slice(-limit);
  }

  public cancelAgentTask(taskId: string, reason = 'Cancelled by operator.'): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    if (task.status === 'COMPLETED' || task.status === 'FAILED' || task.status === 'CANCELLED') {
      return false;
    }

    const ctrl = this.activeAbortControllers.get(taskId);
    if (ctrl) {
      ctrl.abort();
      this.activeAbortControllers.delete(taskId);
    }

    // Release any file locks held by this task
    for (const [lockedFile, holderTaskId] of this.fileWriteLocks.entries()) {
      if (holderTaskId === taskId) {
        this.fileWriteLocks.delete(lockedFile);
      }
    }

    task.status = 'CANCELLED';
    task.completedAt = Date.now();
    task.durationMs = task.startedAt ? Date.now() - task.startedAt : 0;
    task.error = reason;

    const live = this.agentLiveStatus.get(task.agentId);
    if (live) {
      live.status = 'CANCELLED';
      live.currentTaskId = null;
      live.currentTaskTitle = task.title;
      live.latestResultSummary = `Cancelled: ${reason}`;
    }

    this.recordLifecycleEvent(task.agentId, 'agent.task.cancelled', `Task '${taskId}' cancelled: ${reason}`, taskId);
    this.persistRuntimeState();
    return true;
  }

  /**
   * Inspects provider/model health including Ollama, Gemini, and Argon availability.
   */
  public getBackendHealthSummary(): {
    ollama: { configured: boolean; healthy: boolean; activeModel: string; installedModels: string[] };
    gemini: { configured: boolean; healthy: boolean; model: string; status: string };
    argon: { configured: boolean; healthy: boolean; status: string; details: string };
    policyIntegrityVerified: boolean;
    estopActive: boolean;
  } {
    const allStatuses = this.router.getAllProviderStatuses();
    const ollama = this.router.getOllamaProvider();
    const ollamaStatus = allStatuses.find(p => p.id === 'ollama');
    const geminiStatus = allStatuses.find(p => p.id === 'gemini');
    const policyIntegrity = this.policyService.verifyProtectedPolicyIntegrity();
    const estopActive =
      ProcessSupervisor.getInstance().isEstopActive() ||
      this.toolService.getComputerUseService().getPermissionService().isEmergencyStopped();

    return {
      ollama: {
        configured: Boolean(ollamaStatus?.isConfigured),
        healthy: Boolean(ollamaStatus?.isHealthy),
        activeModel: ollamaStatus?.currentModel || 'llama3.1:8b',
        installedModels: (ollama?.getInstalledModels() || []).map(m => m.name)
      },
      gemini: {
        configured: Boolean(geminiStatus?.isConfigured),
        healthy: Boolean(geminiStatus?.isHealthy),
        model: geminiStatus?.currentModel || 'gemini-2.0-flash',
        status: geminiStatus?.isConfigured
          ? geminiStatus.isHealthy
            ? 'READY'
            : `ERROR (${geminiStatus.lastErrorCode || 'UNHEALTHY'})`
          : 'NOT CONFIGURED (Set GEMINI_API_KEY in .env to enable)'
      },
      argon: {
        configured: false,
        healthy: false,
        status: 'UNAVAILABLE',
        details: 'No Argon runtime, SDK, or API adapter is installed in this repository or environment.'
      },
      policyIntegrityVerified: policyIntegrity.valid,
      estopActive
    };
  }

  public getExecutionRecords(): AgentExecutionRecord[] {
    return [...this.executionRecords];
  }

  /**
   * Computes the effective permission ceiling for a delegated agent so a child agent
   * can NEVER gain higher privileges than the parent task authorizes.
   */
  public static computeEffectivePermissionCeiling(
    agentMax: PermissionLevel,
    parentMax: PermissionLevel = 'HIGH'
  ): PermissionLevel {
    const rank: Record<PermissionLevel, number> = {
      LOW: 1,
      MEDIUM: 2,
      HIGH: 3,
      CRITICAL: 4
    };
    const minRank = Math.min(rank[agentMax] || 1, rank[parentMax] || 3);
    const reverse: Record<number, PermissionLevel> = {
      1: 'LOW',
      2: 'MEDIUM',
      3: 'HIGH',
      4: 'CRITICAL'
    };
    return reverse[minRank] || 'LOW';
  }

  /**
   * Selects the most appropriate agent for a natural-language request when operating in coordinator mode.
   * Avoids unnecessary multi-agent spawning for trivial single-step requests.
   */
  public selectAgentForQuery(query: string): {
    agentId: OrionAgentId;
    engineeringAgentId?: string;
    shouldDelegate: boolean;
    reason: string;
  } {
    if (this.activeAgentId !== 'core') {
      return {
        agentId: this.activeAgentId,
        engineeringAgentId: this.activeEngineeringAgentId,
        shouldDelegate: false,
        reason: `Explicitly pinned to agent '${this.activeAgentId}'.`
      };
    }

    const lower = query.toLowerCase();
    if (
      lower.includes('screenshot') ||
      lower.includes('on my screen') ||
      lower.includes('look at my screen') ||
      lower.includes('visual interface')
    ) {
      return {
        agentId: 'vision',
        engineeringAgentId: 'design',
        shouldDelegate: true,
        reason: 'Visual/screen understanding query routed to ORION Vision / Design Engineer.'
      };
    }

    if (
      lower.includes('security audit') ||
      lower.includes('verify checkpoint') ||
      lower.includes('audit policy') ||
      lower.includes('red-team')
    ) {
      return {
        agentId: 'auditor',
        engineeringAgentId: 'security',
        shouldDelegate: true,
        reason: 'Security/verification query routed to ORION Auditor / Security Engineer.'
      };
    }

    if (
      lower.includes('typescript') ||
      lower.includes('compile') ||
      lower.includes('debug ') ||
      lower.includes('refactor') ||
      lower.includes('inspect repo') ||
      lower.includes('source code')
    ) {
      return {
        agentId: 'engineer',
        engineeringAgentId: 'implementation',
        shouldDelegate: true,
        reason: 'Repository/coding query routed to ORION Engineer / Implementation Engineer.'
      };
    }

    if (
      lower.startsWith('research ') ||
      lower.includes('compare sources') ||
      lower.includes('summarize document')
    ) {
      return {
        agentId: 'research',
        engineeringAgentId: 'research',
        shouldDelegate: true,
        reason: 'Evidence retrieval/synthesis query routed to ORION Research.'
      };
    }

    return {
      agentId: 'core',
      engineeringAgentId: 'commander',
      shouldDelegate: false,
      reason: 'Handled directly by ORION Core / Commander without unnecessary delegation overhead.'
    };
  }

  /**
   * Executes a tool call on behalf of a specific ORION agent, enforcing the agent's
   * least-privilege `allowedTools` list, `effectiveMaxPermission` ceiling, and file write locks.
   */
  public async executeAgentToolCall(
    agentId: OrionAgentId | string,
    call: ToolCall,
    parentMaxPermission: PermissionLevel = 'HIGH',
    owningTaskId?: string
  ): Promise<ToolResult> {
    const cleanId = (agentId || 'core').trim().toLowerCase();
    const engDef = this.engineeringRegistry.get(cleanId);
    const canonicalId: OrionAgentId = engDef?.canonicalPolicyId || AGENT_ID_ALIASES[cleanId] || 'core';
    const policyDef = this.policyService.getAgentDefinition(canonicalId);

    const maxPerm = engDef ? engDef.maxPermissionLevel : policyDef.maxPermissionLevel;
    const allowedTools = engDef ? engDef.allowedTools : policyDef.allowedTools;

    if (engDef?.readOnly && (call.toolId === 'file.write_text' || call.toolId === 'computer.execute_action')) {
      return {
        toolCallId: call.id,
        toolId: call.toolId,
        success: false,
        verificationStatus: 'FAILED',
        verified: false,
        error: `AGENT POLICY VIOLATION: Read-only agent '${engDef.id}' (${engDef.displayName}) is prohibited from executing mutating tool '${call.toolId}'.`,
        timestamp: Date.now(),
        executionTimeMs: 0
      };
    }

    // Check file write lock when writing a file
    if (call.toolId === 'file.write_text') {
      const rawPath = String(call.arguments?.filePath || call.arguments?.path || '');
      if (rawPath) {
        const normalizedTarget = path.resolve(process.cwd(), rawPath).toLowerCase();
        const lockHolder = this.fileWriteLocks.get(normalizedTarget);
        if (lockHolder && lockHolder !== owningTaskId) {
          return {
            toolCallId: call.id,
            toolId: call.toolId,
            success: false,
            verificationStatus: 'FAILED',
            verified: false,
            error: `FILE_LOCK_CONFLICT: File '${rawPath}' is currently locked for writing by active task '${lockHolder}'.`,
            timestamp: Date.now(),
            executionTimeMs: 0
          };
        }
      }
    }

    const effectiveCeiling = OrionAgentSystem.computeEffectivePermissionCeiling(maxPerm, parentMaxPermission);

    const enrichedCall: ToolCall & Record<string, any> = {
      ...call,
      agentId: engDef ? engDef.id : policyDef.id,
      agentAllowedTools: allowedTools,
      agentMaxPermissionLevel: effectiveCeiling
    };

    this.recordLifecycleEvent(
      engDef ? engDef.id : policyDef.id,
      'agent.tool.called',
      `Invoking tool '${call.toolId}'`,
      owningTaskId,
      { toolId: call.toolId, arguments: call.arguments }
    );

    const res = await this.toolService.executeTool(enrichedCall);

    this.recordLifecycleEvent(
      engDef ? engDef.id : policyDef.id,
      'agent.tool.completed',
      `Tool '${call.toolId}' finished with success=${res.success} (${res.verificationStatus})`,
      owningTaskId,
      { toolId: call.toolId, success: res.success, verificationStatus: res.verificationStatus, error: res.error }
    );

    return res;
  }

  /**
   * Infers appropriate read-only or scoped tool calls for an engineering prompt when
   * `toolCallsToRun` is not explicitly provided by the caller.
   */
  public inferToolsForPrompt(
    agentDef: EngineeringAgentDefinition,
    prompt: string
  ): Array<{ toolId: string; arguments: Record<string, any> }> {
    const inferred: Array<{ toolId: string; arguments: Record<string, any> }> = [];
    const lower = prompt.toLowerCase();
    const canRead = agentDef.allowedTools.includes('*') || agentDef.allowedTools.includes('file.read_text');
    const canList = agentDef.allowedTools.includes('*') || agentDef.allowedTools.includes('file.list_directory');
    const canSys = agentDef.allowedTools.includes('*') || agentDef.allowedTools.some(t => t === 'system.*' || t === 'system.get_info');

    // Extract any explicit workspace file paths mentioned in the prompt (e.g., src/..., package.json, bin/orion.js)
    const fileMatches = prompt.match(/\b(?:src\/[a-zA-Z0-9_./-]+\.[a-zA-Z0-9]+|bin\/[a-zA-Z0-9_./-]+\.[a-zA-Z0-9]+|config\/[a-zA-Z0-9_./-]+\.[a-zA-Z0-9]+|package\.json|tsconfig(?:\.[a-zA-Z0-9_-]+)?\.json)\b/g);
    if (canRead && fileMatches && fileMatches.length > 0) {
      const uniqueFiles = Array.from(new Set(fileMatches)).slice(0, 4);
      for (const f of uniqueFiles) {
        inferred.push({ toolId: 'file.read_text', arguments: { filePath: f } });
      }
    }

    if (
      canRead &&
      (lower.includes('application launch') ||
        lower.includes('app launch') ||
        lower.includes('open_app') ||
        lower.includes('windowsappresolver') ||
        lower.includes('processsupervisor'))
    ) {
      const appLaunchFiles = [
        'src/main/services/computer/WindowsAppResolver.ts',
        'src/main/services/computer/ComputerActionExecutor.ts',
        'src/main/services/computer/ProcessSupervisor.ts'
      ];
      for (const f of appLaunchFiles) {
        if (!inferred.some(i => i.toolId === 'file.read_text' && i.arguments.filePath === f)) {
          inferred.push({ toolId: 'file.read_text', arguments: { filePath: f } });
        }
      }
    }

    if (
      canRead &&
      (lower.includes('security') ||
        lower.includes('permission') ||
        lower.includes('approval') ||
        lower.includes('e-stop') ||
        lower.includes('estop'))
    ) {
      const secFiles = [
        'src/main/services/SecurityPolicyMiddleware.ts',
        'src/main/services/computer/ComputerPermissionService.ts'
      ];
      for (const f of secFiles) {
        if (!inferred.some(i => i.toolId === 'file.read_text' && i.arguments.filePath === f)) {
          inferred.push({ toolId: 'file.read_text', arguments: { filePath: f } });
        }
      }
    }

    if (inferred.length === 0) {
      if (canList && (lower.includes('repo') || lower.includes('directory') || lower.includes('structure') || lower.includes('trace') || lower.includes('inspect'))) {
        inferred.push({ toolId: 'file.list_directory', arguments: { dirPath: 'src/main/services' } });
      }
      if (canRead && (lower.includes('package') || lower.includes('dependenc') || inferred.length === 0)) {
        inferred.push({ toolId: 'file.read_text', arguments: { filePath: 'package.json' } });
      } else if (canSys) {
        inferred.push({ toolId: 'system.get_info', arguments: {} });
      }
    }

    return inferred;
  }

  /**
   * Executes a full engineering task on a registered specialist agent with:
   * - E-Stop pre-check
   * - Prerequisite dependency checking
   * - File-write conflict locking
   * - Backend availability checking (never faking unavailable backends)
   * - Bounded retries and timeout enforcement
   * - Structured evidence result & persistence
   */
  public async runEngineeringTask(params: {
    taskId?: string;
    agentId: string;
    title: string;
    prompt: string;
    dependencies?: string[];
    targetFilesForWrite?: string[];
    toolCallsToRun?: Array<{ toolId: string; arguments?: Record<string, any> }>;
    parentMaxPermission?: PermissionLevel;
    timeoutMs?: number;
    maxRetries?: number;
    signal?: AbortSignal;
    customExecutor?: (context: {
      agent: EngineeringAgentDefinition;
      task: EngineeringAgentTask;
      signal: AbortSignal;
      runTool: (toolId: string, args?: Record<string, any>) => Promise<ToolResult>;
    }) => Promise<{ summary: string; verified?: boolean; testOutcomes?: AgentTaskEvidenceResult['testOutcomes'] }>;
  }): Promise<AgentTaskEvidenceResult> {
    const cleanAgentId = (params.agentId || '').trim().toLowerCase().replace(/^orion[-_\s]*/i, '');
    const agentDef = this.engineeringRegistry.get(cleanAgentId);
    if (!agentDef) {
      throw new Error(
        `UNKNOWN_AGENT: Agent '${params.agentId}' is not registered in OrionAgentSystem. Available: ${Array.from(this.engineeringRegistry.keys()).join(', ')}`
      );
    }

    const taskId = params.taskId || `task_${cleanAgentId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const dependencies = params.dependencies || [];
    const targetFiles = (params.targetFilesForWrite || []).map(f => path.resolve(process.cwd(), f).toLowerCase());
    const timeoutMs = params.timeoutMs || agentDef.timeoutMs || 30000;
    const maxRetries = params.maxRetries !== undefined ? params.maxRetries : agentDef.maxRetries;

    const taskRecord: EngineeringAgentTask = {
      taskId,
      agentId: agentDef.id,
      title: params.title,
      prompt: params.prompt,
      status: 'QUEUED',
      dependencies,
      targetFilesForWrite: targetFiles,
      toolCallsToRun: params.toolCallsToRun,
      parentMaxPermission: params.parentMaxPermission || 'HIGH',
      timeoutMs,
      maxRetries,
      retryCount: 0,
      createdAt: Date.now()
    };

    this.tasks.set(taskId, taskRecord);
    const liveState = this.agentLiveStatus.get(agentDef.id) || {
      status: 'QUEUED' as EngineeringAgentStatus,
      currentTaskId: taskId,
      currentTaskTitle: params.title,
      latestResultSummary: null,
      latestEvidenceRef: null
    };
    liveState.status = 'QUEUED';
    liveState.currentTaskId = taskId;
    liveState.currentTaskTitle = params.title;
    this.agentLiveStatus.set(agentDef.id, liveState);

    this.recordLifecycleEvent(
      agentDef.id,
      'agent.task.queued',
      `Queued task '${params.title}' [${taskId}]`,
      taskId,
      { dependencies, targetFilesForWrite: params.targetFilesForWrite }
    );
    this.persistRuntimeState();

    const startTime = Date.now();
    taskRecord.startedAt = startTime;

    const finalizeTask = (
      status: EngineeringAgentStatus,
      verified: boolean,
      summary: string,
      details: {
        backendUsed: string;
        filesInspected?: string[];
        filesChanged?: string[];
        commandsOrToolsExecuted?: string[];
        testOutcomes?: AgentTaskEvidenceResult['testOutcomes'];
        evidenceReferences?: string[];
        blockers?: string[];
        remainingRisks?: string[];
        error?: string;
      }
    ): AgentTaskEvidenceResult => {
      // Always release file locks owned by this task
      for (const [lockedPath, holder] of this.fileWriteLocks.entries()) {
        if (holder === taskId) {
          this.fileWriteLocks.delete(lockedPath);
        }
      }
      this.activeAbortControllers.delete(taskId);

      const completedAt = Date.now();
      const durationMs = completedAt - startTime;
      const sanitizedSummary = UnifiedMemoryManager.sanitizeSecrets(
        ExecutionTraceService.redactSensitiveValue(summary)
      );
      const sanitizedError = details.error
        ? UnifiedMemoryManager.sanitizeSecrets(ExecutionTraceService.redactSensitiveValue(details.error))
        : undefined;

      const evidenceResult: AgentTaskEvidenceResult = {
        taskId,
        agentId: agentDef.id,
        displayName: agentDef.displayName,
        backendUsed: details.backendUsed,
        status,
        verified,
        summary: sanitizedSummary,
        filesInspected: details.filesInspected || [],
        filesChanged: details.filesChanged || [],
        commandsOrToolsExecuted: details.commandsOrToolsExecuted || [],
        testOutcomes: details.testOutcomes || [],
        evidenceReferences: details.evidenceReferences || [taskId],
        blockers: details.blockers || (sanitizedError ? [sanitizedError] : []),
        remainingRisks: details.remainingRisks || [],
        startedAt: startTime,
        completedAt,
        durationMs,
        retryCount: taskRecord.retryCount,
        error: sanitizedError
      };

      taskRecord.status = status;
      taskRecord.completedAt = completedAt;
      taskRecord.durationMs = durationMs;
      taskRecord.backendResolved = details.backendUsed;
      taskRecord.result = evidenceResult;
      taskRecord.error = sanitizedError;

      liveState.status = status;
      liveState.currentTaskId = null;
      liveState.currentTaskTitle = params.title;
      liveState.latestResultSummary = sanitizedSummary.slice(0, 160);
      liveState.latestEvidenceRef = evidenceResult.evidenceReferences[0] || taskId;
      liveState.lastError = sanitizedError;

      const eventMap: Record<EngineeringAgentStatus, AgentLifecycleEvent['eventType']> = {
        IDLE: 'agent.task.completed',
        QUEUED: 'agent.task.queued',
        RUNNING: 'agent.task.started',
        COMPLETED: 'agent.task.completed',
        FAILED: 'agent.task.failed',
        BLOCKED: 'agent.task.blocked',
        CANCELLED: 'agent.task.cancelled',
        INTERRUPTED: 'agent.task.interrupted'
      };
      this.recordLifecycleEvent(
        agentDef.id,
        eventMap[status],
        `Task '${params.title}' [${taskId}] finished with status=${status} (${durationMs}ms): ${sanitizedSummary.slice(0, 120)}`,
        taskId
      );
      this.persistRuntimeState();
      return evidenceResult;
    };

    // 1. Check Emergency Stop before running
    const estopActive =
      ProcessSupervisor.getInstance().isEstopActive() ||
      this.toolService.getComputerUseService().getPermissionService().isEmergencyStopped();
    if (estopActive) {
      return finalizeTask(
        'BLOCKED',
        false,
        'Execution BLOCKED: ORION Emergency Stop (E-STOP) is active.',
        {
          backendUsed: 'none (E-STOP)',
          blockers: ['Emergency Stop is active. Run `/permissions reset` before scheduling agent tasks.'],
          error: 'Execution BLOCKED: ORION Emergency Stop is active.'
        }
      );
    }

    // 2. Check pre-aborted signal
    if (params.signal?.aborted) {
      return finalizeTask('CANCELLED', false, 'Task cancelled before execution started.', {
        backendUsed: 'none',
        error: 'Aborted by caller signal.'
      });
    }

    // 3. Check prerequisite dependencies
    for (const depId of dependencies) {
      const depTask = this.tasks.get(depId);
      if (!depTask) {
        return finalizeTask(
          'BLOCKED',
          false,
          `Prerequisite task '${depId}' does not exist.`,
          {
            backendUsed: 'none',
            blockers: [`Missing prerequisite task '${depId}'.`],
            error: `DEPENDENCY_NOT_FOUND: Prerequisite task '${depId}' not found.`
          }
        );
      }
      if (depTask.status !== 'COMPLETED') {
        return finalizeTask(
          'BLOCKED',
          false,
          `Blocked because prerequisite task '${depId}' has status '${depTask.status}' (must be COMPLETED).`,
          {
            backendUsed: 'none',
            blockers: [`Prerequisite task '${depId}' (${depTask.title}) ended with status ${depTask.status}.`],
            error: `DEPENDENCY_FAILED: Prerequisite task '${depId}' is ${depTask.status}.`
          }
        );
      }
    }

    // 4. Check file-write locks for mutating tasks
    if (targetFiles.length > 0) {
      if (agentDef.readOnly) {
        return finalizeTask(
          'BLOCKED',
          false,
          `Read-only agent '${agentDef.id}' cannot acquire file-write locks.`,
          {
            backendUsed: 'none',
            blockers: [`Agent '${agentDef.id}' is read-only.`],
            error: `AGENT POLICY VIOLATION: Read-only agent '${agentDef.id}' cannot write files.`
          }
        );
      }
      for (const normFile of targetFiles) {
        const existingHolder = this.fileWriteLocks.get(normFile);
        if (existingHolder && existingHolder !== taskId) {
          return finalizeTask(
            'BLOCKED',
            false,
            `File write conflict: '${normFile}' is currently locked by active task '${existingHolder}'.`,
            {
              backendUsed: 'none',
              blockers: [`FILE_LOCK_CONFLICT on '${normFile}' held by '${existingHolder}'.`],
              error: `FILE_LOCK_CONFLICT: Target file '${normFile}' is locked by running task '${existingHolder}'.`
            }
          );
        }
      }
      // Acquire locks
      for (const normFile of targetFiles) {
        this.fileWriteLocks.set(normFile, taskId);
      }
    }

    // 5. Verify backend availability (do not fake unavailable backends)
    const backendStatus = this.resolveAgentBackendStatus(agentDef);
    if (!backendStatus.configured) {
      return finalizeTask(
        'FAILED',
        false,
        backendStatus.reason || `Backend '${backendStatus.backendLabel}' is not configured or unavailable.`,
        {
          backendUsed: backendStatus.backendLabel,
          blockers: [backendStatus.reason || `Backend '${backendStatus.backendLabel}' unavailable.`],
          error: backendStatus.reason || `BACKEND_UNAVAILABLE: ${backendStatus.backendLabel}`
        }
      );
    }

    // Transition to RUNNING
    taskRecord.status = 'RUNNING';
    liveState.status = 'RUNNING';
    this.recordLifecycleEvent(
      agentDef.id,
      'agent.task.started',
      `Started task '${params.title}' [${taskId}] on backend ${backendStatus.backendLabel}`,
      taskId
    );
    this.persistRuntimeState();

    const filesInspected = new Set<string>();
    const filesChanged = new Set<string>();
    const commandsOrToolsExecuted: string[] = [];
    const evidenceReferences: string[] = [taskId];

    // Helper for executing tools inside this task
    const runToolForTask = async (toolId: string, args: Record<string, any> = {}): Promise<ToolResult> => {
      if (
        ProcessSupervisor.getInstance().isEstopActive() ||
        this.toolService.getComputerUseService().getPermissionService().isEmergencyStopped()
      ) {
        throw new Error('Execution BLOCKED: ORION Emergency Stop is active.');
      }
      const call: ToolCall = {
        id: `call_${taskId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        toolId,
        toolName: toolId,
        arguments: args,
        timestamp: Date.now(),
        requiresUserApproval: false
      };
      commandsOrToolsExecuted.push(`${toolId}(${JSON.stringify(args)})`);
      const fileArg = String(args.filePath || args.dirPath || args.path || '');
      if (fileArg) {
        if (toolId === 'file.read_text' || toolId === 'file.list_directory') {
          filesInspected.add(fileArg);
          evidenceReferences.push(`${toolId}:${fileArg}`);
        } else if (toolId === 'file.write_text') {
          filesChanged.add(fileArg);
          evidenceReferences.push(`${toolId}:${fileArg}`);
        }
      }
      return await this.executeAgentToolCall(
        agentDef.id,
        call,
        params.parentMaxPermission || 'HIGH',
        taskId
      );
    };

    // Execute with bounded retries and timeout enforcement
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt <= maxRetries) {
      taskRecord.retryCount = attempt;
      const attemptController = new AbortController();
      this.activeAbortControllers.set(taskId, attemptController);

      const onExternalAbort = () => attemptController.abort();
      if (params.signal) {
        if (params.signal.aborted) {
          attemptController.abort();
        } else {
          params.signal.addEventListener('abort', onExternalAbort, { once: true });
        }
      }

      let timeoutHandle: NodeJS.Timeout | null = null;
      let timedOut = false;

      try {
        const executionPromise = (async () => {
          if (attemptController.signal.aborted) {
            throw new Error('TASK_CANCELLED: Task aborted by signal.');
          }

          // Run explicit tool calls if provided
          const toolResults: ToolResult[] = [];
          if (Array.isArray(params.toolCallsToRun) && params.toolCallsToRun.length > 0) {
            for (const spec of params.toolCallsToRun) {
              if (attemptController.signal.aborted) {
                throw new Error('TASK_CANCELLED: Task aborted during tool sequence.');
              }
              const res = await runToolForTask(spec.toolId, spec.arguments || {});
              toolResults.push(res);

              if (!res.success) {
                const errText = res.error || `Tool '${spec.toolId}' failed.`;
                if (
                  /POLICY VIOLATION|PRIVILEGE ESCALATION|AUTHORIZATION REQUIRED|FILE_LOCK_CONFLICT|Emergency Stop/i.test(
                    errText
                  )
                ) {
                  const blockErr = new Error(errText);
                  (blockErr as any).isPolicyBlock = true;
                  throw blockErr;
                }
                throw new Error(errText);
              }
            }
          }

          if (params.customExecutor) {
            const customRes = await params.customExecutor({
              agent: agentDef,
              task: taskRecord,
              signal: attemptController.signal,
              runTool: runToolForTask
            });
            if (attemptController.signal.aborted) {
              throw new Error('TASK_CANCELLED: Task aborted by signal.');
            }
            return {
              summary: customRes.summary,
              verified: customRes.verified ?? true,
              testOutcomes: customRes.testOutcomes || []
            };
          }

          // Default model + tool synthesis execution
          const legacyOut = await this.executeAgentTask({
            agentId: agentDef.canonicalPolicyId || 'core',
            taskPrompt: `[ROLE: ${agentDef.displayName} — ${agentDef.roleTitle}]\n${params.prompt}`,
            parentMaxPermission: params.parentMaxPermission || 'HIGH',
            preferredModelOverride: agentDef.preferredLocalModel,
            preExecutedToolResults: toolResults,
            signal: attemptController.signal
          });

          if (legacyOut.status === 'CANCELLED') {
            throw new Error('TASK_CANCELLED: Task cancelled by AbortSignal.');
          }
          if (legacyOut.status === 'BLOCKED') {
            const blockErr = new Error(legacyOut.response);
            (blockErr as any).isPolicyBlock = true;
            throw blockErr;
          }
          if (legacyOut.status === 'FAILED') {
            throw new Error(legacyOut.response || 'Agent task execution failed.');
          }

          return {
            summary: legacyOut.response,
            verified: legacyOut.verified && toolResults.length > 0 && toolResults.every(r => r.success),
            testOutcomes: [],
            resolvedModelBackend: legacyOut.selectedModel
          };
        })();

        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutHandle = setTimeout(() => {
            timedOut = true;
            attemptController.abort();
            reject(new Error(`TASK_TIMEOUT: Task '${params.title}' exceeded timeout of ${timeoutMs}ms.`));
          }, timeoutMs);
        });

        const outcome = await Promise.race([executionPromise, timeoutPromise]);
        if (timeoutHandle) clearTimeout(timeoutHandle);
        if (params.signal) params.signal.removeEventListener('abort', onExternalAbort);

        return finalizeTask('COMPLETED', outcome.verified, outcome.summary, {
          backendUsed: (outcome as any).resolvedModelBackend || backendStatus.backendLabel,
          filesInspected: Array.from(filesInspected),
          filesChanged: Array.from(filesChanged),
          commandsOrToolsExecuted,
          testOutcomes: outcome.testOutcomes,
          evidenceReferences
        });
      } catch (err: any) {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        if (params.signal) params.signal.removeEventListener('abort', onExternalAbort);
        lastError = err instanceof Error ? err : new Error(String(err));

        // Do not retry policy blocks, explicit cancellations, or E-Stop
        if ((err as any)?.isPolicyBlock || /POLICY VIOLATION|FILE_LOCK_CONFLICT|Emergency Stop/i.test(lastError.message)) {
          return finalizeTask('BLOCKED', false, lastError.message, {
            backendUsed: backendStatus.backendLabel,
            filesInspected: Array.from(filesInspected),
            filesChanged: Array.from(filesChanged),
            commandsOrToolsExecuted,
            evidenceReferences,
            blockers: [lastError.message],
            error: lastError.message
          });
        }

        if (!timedOut && (params.signal?.aborted || /TASK_CANCELLED|aborted/i.test(lastError.message))) {
          return finalizeTask('CANCELLED', false, lastError.message, {
            backendUsed: backendStatus.backendLabel,
            filesInspected: Array.from(filesInspected),
            filesChanged: Array.from(filesChanged),
            commandsOrToolsExecuted,
            evidenceReferences,
            error: lastError.message
          });
        }

        attempt++;
        if (attempt > maxRetries) {
          break;
        }
      }
    }

    const errMsg = lastError?.message || 'Task failed after maximum retries.';
    return finalizeTask('FAILED', false, `Failed: ${errMsg}`, {
      backendUsed: backendStatus.backendLabel,
      filesInspected: Array.from(filesInspected),
      filesChanged: Array.from(filesChanged),
      commandsOrToolsExecuted,
      evidenceReferences,
      blockers: [errMsg],
      error: errMsg
    });
  }

  /**
   * Reconciles findings across multiple agents when agents disagree.
   * Preserves all conflicting findings, compares source evidence and tool verification flags,
   * and prefers reproducible tool-verified evidence over unverified claims.
   */
  public reconcileAgentFindings(findings: AgentFindingForReconciliation[]): ReconciledFindingReport[] {
    const byTopic = new Map<string, AgentFindingForReconciliation[]>();
    for (const f of findings) {
      const list = byTopic.get(f.topic) || [];
      list.push(f);
      byTopic.set(f.topic, list);
    }

    const reports: ReconciledFindingReport[] = [];
    for (const [topic, group] of byTopic.entries()) {
      const distinctConclusions = new Set(group.map(g => g.conclusion.trim().toLowerCase()));
      const hasConflict = distinctConclusions.size > 1;

      // Sort by: 1) verifiedByTool === true, 2) number of evidenceReferences + filesInspected, 3) confidence
      const confScore: Record<'HIGH' | 'MEDIUM' | 'LOW', number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      const ranked = [...group].sort((a, b) => {
        if (a.verifiedByTool !== b.verifiedByTool) {
          return a.verifiedByTool ? -1 : 1;
        }
        const aEv = a.evidenceReferences.length + a.filesInspected.length;
        const bEv = b.evidenceReferences.length + b.filesInspected.length;
        if (aEv !== bEv) {
          return bEv - aEv;
        }
        return (confScore[b.confidence] || 1) - (confScore[a.confidence] || 1);
      });

      const winner = ranked[0];
      const runnerUp = ranked[1];
      const unresolvedTie =
        hasConflict &&
        runnerUp &&
        winner.verifiedByTool === runnerUp.verifiedByTool &&
        winner.evidenceReferences.length === runnerUp.evidenceReferences.length;

      reports.push({
        topic,
        hasConflict,
        allFindingsPreserved: group,
        authoritativeConclusion: winner.conclusion,
        winningAgentId: winner.agentId,
        resolutionReason: !hasConflict
          ? `Unanimous agreement across ${group.length} agent(s).`
          : winner.verifiedByTool && !runnerUp?.verifiedByTool
            ? `Preferred '${winner.agentId}' finding because it is backed by reproducible tool verification (${winner.evidenceReferences.join(', ')}), whereas '${runnerUp.agentId}' claim was unverified.`
            : `Selected '${winner.agentId}' based on stronger source evidence (${winner.evidenceReferences.length} refs) and ${winner.confidence} confidence; preserved all ${group.length} conflicting findings.`,
        requiresTargetedVerification: Boolean(unresolvedTie || !winner.verifiedByTool)
      });
    }

    return reports;
  }

  /**
   * Executes a real multi-agent Commander delegation workflow:
   * 1. Commander decomposes the goal.
   * 2. Reconnaissance Engineer (`recon`) and Security Engineer (`security`) run concurrently in read-only mode.
   * 3. Test & QA Engineer (`qa`) runs a dependent verification task after recon/security complete.
   * 4. Commander reconciles all findings into a structured evidence report.
   */
  public async delegateEngineeringGoal(
    goal: string,
    options: { targetPath?: string; signal?: AbortSignal } = {}
  ): Promise<{
    goal: string;
    coordinatorAgentId: string;
    tasksExecuted: AgentTaskEvidenceResult[];
    reconciledFindings: ReconciledFindingReport[];
    overallStatus: 'COMPLETED' | 'PARTIAL' | 'FAILED' | 'BLOCKED';
    durationMs: number;
  }> {
    const start = Date.now();
    const targetFile = options.targetPath || 'package.json';

    // Step 1: Run read-only Reconnaissance and Security tasks concurrently
    const [reconResult, securityResult] = await Promise.all([
      this.runEngineeringTask({
        agentId: 'recon',
        title: `Reconnaissance discovery for: ${goal.slice(0, 60)}`,
        prompt: `Inspect repository structure and ${targetFile} for goal: ${goal}`,
        toolCallsToRun: [
          { toolId: 'file.list_directory', arguments: { dirPath: '.' } },
          { toolId: 'file.read_text', arguments: { filePath: targetFile } }
        ],
        signal: options.signal
      }),
      this.runEngineeringTask({
        agentId: 'security',
        title: `Security boundary audit for: ${goal.slice(0, 60)}`,
        prompt: `Verify protected policy integrity and security posture for goal: ${goal}`,
        toolCallsToRun: [{ toolId: 'system.get_info', arguments: {} }],
        signal: options.signal
      })
    ]);

    // Step 2: Run QA verification task depending on both recon and security tasks
    const qaResult = await this.runEngineeringTask({
      agentId: 'qa',
      title: `QA verification of recon & security evidence`,
      prompt: `Verify evidence gathered by recon (${reconResult.taskId}) and security (${securityResult.taskId}).`,
      dependencies: [reconResult.taskId, securityResult.taskId],
      toolCallsToRun: [{ toolId: 'file.read_text', arguments: { filePath: targetFile } }],
      signal: options.signal
    });

    const findings: AgentFindingForReconciliation[] = [
      {
        agentId: 'recon',
        claimId: `claim_${reconResult.taskId}`,
        topic: 'Repository & Target File Verification',
        conclusion: reconResult.verified
          ? `Target '${targetFile}' and workspace structure verified via read-only tools.`
          : `Reconnaissance failed or incomplete: ${reconResult.summary}`,
        verifiedByTool: reconResult.verified,
        evidenceReferences: reconResult.evidenceReferences,
        filesInspected: reconResult.filesInspected,
        confidence: reconResult.verified ? 'HIGH' : 'LOW'
      },
      {
        agentId: 'security',
        claimId: `claim_${securityResult.taskId}`,
        topic: 'Security & Policy Boundary Posture',
        conclusion: securityResult.verified
          ? `Security posture and system telemetry verified under LOW permission ceiling.`
          : `Security audit blocked or failed: ${securityResult.summary}`,
        verifiedByTool: securityResult.verified,
        evidenceReferences: securityResult.evidenceReferences,
        filesInspected: securityResult.filesInspected,
        confidence: securityResult.verified ? 'HIGH' : 'LOW'
      },
      {
        agentId: 'qa',
        claimId: `claim_${qaResult.taskId}`,
        topic: 'Repository & Target File Verification',
        conclusion: qaResult.verified
          ? `Target '${targetFile}' and workspace structure verified via read-only tools.`
          : `QA verification blocked or failed: ${qaResult.summary}`,
        verifiedByTool: qaResult.verified,
        evidenceReferences: qaResult.evidenceReferences,
        filesInspected: qaResult.filesInspected,
        confidence: qaResult.verified ? 'HIGH' : 'LOW'
      }
    ];

    const reconciledFindings = this.reconcileAgentFindings(findings);
    const tasksExecuted = [reconResult, securityResult, qaResult];
    const allCompleted = tasksExecuted.every(t => t.status === 'COMPLETED' && t.verified);
    const anyBlocked = tasksExecuted.some(t => t.status === 'BLOCKED');

    return {
      goal,
      coordinatorAgentId: 'commander',
      tasksExecuted,
      reconciledFindings,
      overallStatus: allCompleted ? 'COMPLETED' : anyBlocked ? 'BLOCKED' : 'FAILED',
      durationMs: Date.now() - start
    };
  }

  /**
   * Runs a bounded task under a specific ORION agent identity with its dedicated
   * instruction policy, local model selection, context budget, and structured output contract.
   */
  public async executeAgentTask(params: {
    agentId: OrionAgentId;
    taskPrompt: string;
    parentMaxPermission?: PermissionLevel;
    toolCallsToRun?: Array<{ toolId: string; arguments?: Record<string, any> }>;
    preferredModelOverride?: string;
    preExecutedToolResults?: ToolResult[];
    signal?: AbortSignal;
  }): Promise<AgentStructuredOutput> {
    const startTime = Date.now();
    const def = this.policyService.getAgentDefinition(params.agentId);
    const effectiveInstructions = this.policyService.getEffectiveInstructions(params.agentId);
    const effectivePermission = OrionAgentSystem.computeEffectivePermissionCeiling(
      def.maxPermissionLevel,
      params.parentMaxPermission || 'HIGH'
    );

    const modelSelection = this.router.selectLocalModelForTask(def.defaultTaskCategory, {
      requiresVision: def.id === 'vision',
      preferDeepCoding: def.id === 'engineer',
      preferDeepReasoning: def.id === 'auditor'
    });
    const selectedModel = params.preferredModelOverride || def.preferredLocalModel || modelSelection.selectedModel;

    const executedCalls: ToolCall[] = [];
    const toolResults: ToolResult[] = [...(params.preExecutedToolResults || [])];

    if (params.signal?.aborted) {
      const cancelledRec: AgentExecutionRecord = {
        recordId: `agrec_${Date.now()}`,
        agentId: def.id,
        displayName: def.displayName,
        taskDescription: params.taskPrompt.slice(0, 120),
        selectedModel,
        fallbackChain: def.fallbackLocalModels,
        parentMaxPermission: params.parentMaxPermission || 'HIGH',
        effectiveMaxPermission: effectivePermission,
        startedAt: startTime,
        completedAt: Date.now(),
        durationMs: Date.now() - startTime,
        status: 'CANCELLED',
        verified: false,
        toolCallsCount: 0,
        outputSummary: 'Task cancelled before execution.'
      };
      this.executionRecords.push(cancelledRec);
      return {
        agentId: def.id,
        displayName: def.displayName,
        roleTitle: def.roleTitle,
        selectedModel,
        status: 'CANCELLED',
        verified: false,
        response: 'Task cancelled by AbortSignal.',
        toolCallsExecuted: [],
        toolResults: [],
        durationMs: cancelledRec.durationMs,
        contextTokensUsedEstimate: 0,
        contextBudgetMaxTokens: def.maxContextTokens,
        policyIntegrityVerified: effectiveInstructions.policyIntegrityVerified
      };
    }

    if (Array.isArray(params.toolCallsToRun)) {
      for (const spec of params.toolCallsToRun) {
        const call: ToolCall = {
          id: `agcall_${def.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          toolId: spec.toolId,
          toolName: spec.toolId,
          arguments: spec.arguments || {},
          timestamp: Date.now(),
          requiresUserApproval: false
        };
        executedCalls.push(call);
        const res = await this.executeAgentToolCall(def.id, call, effectivePermission);
        toolResults.push(res);
      }
    }

    const blockedTool = toolResults.find(
      r =>
        !r.success &&
        /POLICY VIOLATION|PRIVILEGE ESCALATION|AUTHORIZATION REQUIRED|FILE_LOCK_CONFLICT|Emergency Stop/i.test(
          r.error || ''
        )
    );
    if (blockedTool) {
      const durationMs = Date.now() - startTime;
      this.executionRecords.push({
        recordId: `agrec_${Date.now()}`,
        agentId: def.id,
        displayName: def.displayName,
        taskDescription: params.taskPrompt.slice(0, 120),
        selectedModel,
        fallbackChain: def.fallbackLocalModels,
        parentMaxPermission: params.parentMaxPermission || 'HIGH',
        effectiveMaxPermission: effectivePermission,
        startedAt: startTime,
        completedAt: Date.now(),
        durationMs,
        status: 'BLOCKED',
        verified: false,
        toolCallsCount: executedCalls.length,
        outputSummary: blockedTool.error || 'Blocked by agent permission boundary.',
        error: blockedTool.error
      });
      return {
        agentId: def.id,
        displayName: def.displayName,
        roleTitle: def.roleTitle,
        selectedModel,
        status: 'BLOCKED',
        verified: false,
        response: blockedTool.error || 'Blocked by agent permission policy.',
        toolCallsExecuted: executedCalls,
        toolResults,
        durationMs,
        contextTokensUsedEstimate: Math.ceil(effectiveInstructions.compiledSystemPrompt.length / 4),
        contextBudgetMaxTokens: def.maxContextTokens,
        policyIntegrityVerified: effectiveInstructions.policyIntegrityVerified
      };
    }

    // Build bounded prompt respecting agent's maxContextTokens
    const maxChars = Math.min(def.maxContextTokens * 3, 24000);
    const observationsSummary = toolResults
      .map(r => `[Tool ${r.toolId} -> ${r.verificationStatus}]: ${JSON.stringify(r.data || r.error).slice(0, 1200)}`)
      .join('\n')
      .slice(0, 3600);

    const fullPrompt = [
      effectiveInstructions.compiledSystemPrompt,
      `[AGENT TASK REQUEST]: ${params.taskPrompt}`,
      observationsSummary ? `[UNTRUSTED TOOL OBSERVATIONS]:\n${observationsSummary}` : ''
    ]
      .filter(Boolean)
      .join('\n\n')
      .slice(0, maxChars);

    // Pin the router's local Ollama model to this agent's selectedModel for the request
    const ollama = this.router.getOllamaProvider();
    const prevModel = ollama?.getActiveModel();
    if (ollama && selectedModel) {
      ollama.setModel(selectedModel);
    }
    let responseText = '';
    try {
      responseText = await this.router.chat(fullPrompt);
    } finally {
      if (ollama && prevModel) {
        ollama.setModel(prevModel);
      }
    }
    const activeProviderAfter = this.router.getStatus();
    const actualBackendUsed =
      activeProviderAfter.id === 'ollama'
        ? `ollama:${selectedModel}`
        : activeProviderAfter.id === 'local-heuristic'
          ? `local-heuristic (fallback from ${selectedModel})`
          : `${activeProviderAfter.id}:${activeProviderAfter.currentModel}`;
    const anyToolFailed = toolResults.some(r => !r.success || r.verificationStatus === 'FAILED');
    const allToolsVerified = toolResults.length > 0 && !anyToolFailed;
    const durationMs = Date.now() - startTime;

    this.executionRecords.push({
      recordId: `agrec_${Date.now()}`,
      agentId: def.id,
      displayName: def.displayName,
      taskDescription: params.taskPrompt.slice(0, 120),
      selectedModel: actualBackendUsed,
      fallbackChain: def.fallbackLocalModels,
      parentMaxPermission: params.parentMaxPermission || 'HIGH',
      effectiveMaxPermission: effectivePermission,
      startedAt: startTime,
      completedAt: Date.now(),
      durationMs,
      status: anyToolFailed ? 'FAILED' : 'COMPLETED',
      verified: allToolsVerified,
      toolCallsCount: executedCalls.length + (params.preExecutedToolResults?.length || 0),
      outputSummary: responseText.slice(0, 200)
    });

    return {
      agentId: def.id,
      displayName: def.displayName,
      roleTitle: def.roleTitle,
      selectedModel: actualBackendUsed,
      status: anyToolFailed ? 'FAILED' : 'COMPLETED',
      verified: allToolsVerified,
      response: responseText,
      toolCallsExecuted: executedCalls,
      toolResults,
      durationMs,
      contextTokensUsedEstimate: Math.ceil(fullPrompt.length / 4),
      contextBudgetMaxTokens: def.maxContextTokens,
      policyIntegrityVerified: effectiveInstructions.policyIntegrityVerified
    };
  }
}
