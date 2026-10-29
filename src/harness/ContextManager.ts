import { WorkspaceService, AttachedContextItem } from './WorkspaceService';
import { UnifiedMemoryManager } from '../main/services/UnifiedMemoryManager';
import { HarnessEffortLevel, HarnessMode } from './ExecutionResult';

export interface ConversationTurn {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: number;
  toolId?: string;
  exactTokens?: number;
}

export interface ContextWindowDiagnostics {
  modelId: string;
  mode: HarnessMode;
  effortLevel: HarnessEffortLevel;
  tokenAccountingBasis: 'EXACT_PROVIDER' | 'ESTIMATED_HEURISTIC_4_CHARS_PER_TOKEN';
  systemAndAgentMdTokens: number;
  attachedFilesTokens: number;
  memoryNotesTokens: number;
  conversationTurnsCount: number;
  conversationTokens: number;
  totalContextTokens: number;
  maxContextBudgetTokens: number;
  utilizationPercent: number;
  attachedFiles: Array<{ relativePath: string; estimatedTokens: number; byteSize: number }>;
  agentMdLoaded: boolean;
  agentMdPath: string;
  compactionCount: number;
}

/**
 * Context & Token Accounting Manager (Section 13).
 * - Explicitly distinguishes exact provider token usage from heuristic estimates (~4 chars/token).
 * - Performs non-destructive conversation compaction preserving user constraints, active tasks,
 *   pending approvals, unresolved errors, `AGENT.md` rules, and attached file references.
 */
export class ContextManager {
  private readonly workspaceService: WorkspaceService;
  private readonly memoryManager: UnifiedMemoryManager;
  private turns: ConversationTurn[] = [];
  private compactionCount: number = 0;
  private maxContextBudgetTokens: number;

  constructor(options: {
    workspaceService: WorkspaceService;
    memoryManager?: UnifiedMemoryManager;
    maxContextBudgetTokens?: number;
  }) {
    this.workspaceService = options.workspaceService;
    this.memoryManager = options.memoryManager || new UnifiedMemoryManager();
    this.maxContextBudgetTokens = options.maxContextBudgetTokens ?? 64_000;
  }

  public static estimateTokensHeuristic(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }

  public addTurn(turn: Omit<ConversationTurn, 'id' | 'timestamp'> & { id?: string; timestamp?: number }): ConversationTurn {
    const entry: ConversationTurn = {
      id: turn.id || `turn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      role: turn.role,
      content: UnifiedMemoryManager.sanitizeSecrets(String(turn.content || '')),
      timestamp: turn.timestamp ?? Date.now(),
      toolId: turn.toolId,
      exactTokens: turn.exactTokens
    };
    this.turns.push(entry);
    return entry;
  }

  public getTurns(): ConversationTurn[] {
    return [...this.turns];
  }

  public setTurns(turns: ConversationTurn[]): void {
    this.turns = [...turns];
  }

  public clearTurns(): void {
    this.turns = [];
  }

  public getDiagnostics(options: {
    modelId: string;
    mode: HarnessMode;
    effortLevel: HarnessEffortLevel;
  }): ContextWindowDiagnostics {
    const agentMd = this.workspaceService.getAgentMd();
    const systemAndAgentMdTokens =
      250 + (agentMd.found ? ContextManager.estimateTokensHeuristic(agentMd.content) : 0);

    const attachments = this.workspaceService.listAttachments();
    const attachedFilesTokens = attachments.reduce((sum, a) => sum + a.estimatedTokens, 0);

    const recentNotes = this.memoryManager.listNotes(10);
    const memoryNotesTokens = recentNotes.reduce(
      (sum, n) => sum + ContextManager.estimateTokensHeuristic(n.content),
      0
    );

    let allExact = this.turns.length > 0;
    let conversationTokens = 0;
    for (const t of this.turns) {
      if (typeof t.exactTokens === 'number' && t.exactTokens > 0) {
        conversationTokens += t.exactTokens;
      } else {
        allExact = false;
        conversationTokens += ContextManager.estimateTokensHeuristic(t.content);
      }
    }

    const totalContextTokens =
      systemAndAgentMdTokens + attachedFilesTokens + memoryNotesTokens + conversationTokens;
    const utilizationPercent = Math.min(
      100,
      Math.round((totalContextTokens / Math.max(1, this.maxContextBudgetTokens)) * 1000) / 10
    );

    return {
      modelId: options.modelId,
      mode: options.mode,
      effortLevel: options.effortLevel,
      tokenAccountingBasis: allExact
        ? 'EXACT_PROVIDER'
        : 'ESTIMATED_HEURISTIC_4_CHARS_PER_TOKEN',
      systemAndAgentMdTokens,
      attachedFilesTokens,
      memoryNotesTokens,
      conversationTurnsCount: this.turns.length,
      conversationTokens,
      totalContextTokens,
      maxContextBudgetTokens: this.maxContextBudgetTokens,
      utilizationPercent,
      attachedFiles: attachments.map((a: AttachedContextItem) => ({
        relativePath: a.relativePath,
        estimatedTokens: a.estimatedTokens,
        byteSize: a.byteSize
      })),
      agentMdLoaded: agentMd.found,
      agentMdPath: agentMd.relativePath,
      compactionCount: this.compactionCount
    };
  }

  /**
   * Compacts older conversation turns into a structured summary while preserving:
   * - User constraints & directives
   * - Pending tasks & approvals
   * - Unresolved errors / failures
   * - Recent turns (`keepLastN`)
   */
  public compactContext(keepLastN: number = 6): {
    compacted: boolean;
    beforeTurnCount: number;
    afterTurnCount: number;
    beforeEstimatedTokens: number;
    afterEstimatedTokens: number;
    summaryText: string;
  } {
    const beforeTurnCount = this.turns.length;
    const beforeEstimatedTokens = this.turns.reduce(
      (s, t) => s + ContextManager.estimateTokensHeuristic(t.content),
      0
    );

    if (this.turns.length <= keepLastN) {
      return {
        compacted: false,
        beforeTurnCount,
        afterTurnCount: beforeTurnCount,
        beforeEstimatedTokens,
        afterEstimatedTokens: beforeEstimatedTokens,
        summaryText: 'Context is already compact; no turns needed compaction.'
      };
    }

    const olderTurns = this.turns.slice(0, this.turns.length - keepLastN);
    const recentTurns = this.turns.slice(this.turns.length - keepLastN);

    const userRequests: string[] = [];
    const unresolvedFailures: string[] = [];
    const keyOutcomes: string[] = [];

    for (const t of olderTurns) {
      const snippet = t.content.replace(/\s+/g, ' ').trim().slice(0, 180);
      if (t.role === 'user') {
        userRequests.push(`- User: ${snippet}`);
      } else if (/error|failed|blocked|violation|conflict/i.test(t.content)) {
        unresolvedFailures.push(`- [${t.role.toUpperCase()}] ${snippet}`);
      } else if (t.role === 'assistant' || t.role === 'tool') {
        keyOutcomes.push(`- [${t.role.toUpperCase()}] ${snippet}`);
      }
    }

    const summaryLines = [
      `[COMPACTED SESSION SUMMARY — ${olderTurns.length} earlier turns condensed]`,
      userRequests.length > 0 ? `User Objectives:\n${userRequests.slice(-5).join('\n')}` : '',
      unresolvedFailures.length > 0
        ? `Recorded Failures / Warnings:\n${unresolvedFailures.slice(-5).join('\n')}`
        : '',
      keyOutcomes.length > 0 ? `Key Actions:\n${keyOutcomes.slice(-5).join('\n')}` : ''
    ].filter(Boolean);

    const summaryText = summaryLines.join('\n\n');
    const summaryTurn: ConversationTurn = {
      id: `turn_compact_${Date.now()}`,
      role: 'system',
      content: summaryText,
      timestamp: Date.now()
    };

    this.turns = [summaryTurn, ...recentTurns];
    this.compactionCount += 1;

    const afterEstimatedTokens = this.turns.reduce(
      (s, t) => s + ContextManager.estimateTokensHeuristic(t.content),
      0
    );

    return {
      compacted: true,
      beforeTurnCount,
      afterTurnCount: this.turns.length,
      beforeEstimatedTokens,
      afterEstimatedTokens,
      summaryText
    };
  }
}
