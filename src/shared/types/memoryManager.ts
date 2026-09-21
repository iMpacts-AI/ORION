export type MemoryLayerType = 'WORKING' | 'CONVERSATION' | 'TASK' | 'EPISODIC' | 'SYSTEM';

export interface MemoryRecord {
  id: string;
  type: MemoryLayerType;
  timestamp: number;
  content: string;
  tags: string[];
  trustLevel: 'TRUSTED_SYSTEM' | 'UNTRUSTED_EXTERNAL';
  relevanceScore?: number;
}

export interface IUnifiedMemoryManager {
  addMemory(type: MemoryLayerType, content: string, tags?: string[], trustLevel?: 'TRUSTED_SYSTEM' | 'UNTRUSTED_EXTERNAL'): MemoryRecord;
  queryMemories(query: string, limit?: number): MemoryRecord[];
  clearMemories(type?: MemoryLayerType): void;
}
