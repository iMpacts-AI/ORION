import { ConversationTurn, ConversationMemoryConfig } from '../../shared/types';
import { eventBus } from '../../shared/events';

export const DEFAULT_MEMORY_CONFIG: ConversationMemoryConfig = {
  maxTurns: 20,
  maxTotalTokens: 16000,
  maxTotalChars: 64000
};

export class ConversationMemoryService {
  private turns: ConversationTurn[] = [];
  private config: ConversationMemoryConfig;

  constructor(config: ConversationMemoryConfig = DEFAULT_MEMORY_CONFIG) {
    this.config = { ...config };
  }

  public addTurn(turn: Omit<ConversationTurn, 'id' | 'timestamp'>): ConversationTurn {
    const rawContent = String(turn.content || '');
    // Safety cap individual giant messages (e.g. max 10k chars per turn)
    const sanitizedContent = rawContent.length > 10000 ? rawContent.slice(0, 10000) + '... [TRUNCATED]' : rawContent;

    const fullTurn: ConversationTurn = {
      ...turn,
      content: sanitizedContent,
      id: 'turn_' + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      tokensEstimate: Math.ceil(sanitizedContent.length / 4)
    };

    this.turns.push(fullTurn);
    this.enforceBounds();

    eventBus.emit('memory.updated', { memories: [] });
    return fullTurn;
  }

  public getTurns(): ConversationTurn[] {
    return [...this.turns];
  }

  public getFormattedHistory(): Array<{ role: string; content: string }> {
    return this.turns.map(t => ({
      role: t.role,
      content: t.content
    }));
  }

  public clearMemory(): void {
    this.turns = [];
    eventBus.emit('memory.updated', { memories: [] });
  }

  public setConfig(config: Partial<ConversationMemoryConfig>): void {
    this.config = { ...this.config, ...config };
    this.enforceBounds();
  }

  private enforceBounds(): void {
    // 1. Enforce Turn Count Limit
    if (this.turns.length > this.config.maxTurns) {
      this.turns = this.turns.slice(-this.config.maxTurns);
    }

    // 2. Enforce Character / Token Bound Limit
    let currentChars = this.turns.reduce((acc, t) => acc + t.content.length, 0);
    while (this.turns.length > 1 && currentChars > this.config.maxTotalChars) {
      const removed = this.turns.shift();
      if (removed) {
        currentChars -= removed.content.length;
      }
    }
  }
}
