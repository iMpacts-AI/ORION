import { MemoryRecord, MemoryLayerType, IUnifiedMemoryManager } from '../../shared/types/memoryManager';
import { eventBus } from '../../shared/events';
import fs from 'fs';
import path from 'path';

export class UnifiedMemoryManager implements IUnifiedMemoryManager {
  private memories: MemoryRecord[] = [];
  private maxCapacity = 500;
  private storagePath: string;

  constructor(customStoragePath?: string) {
    const defaultDir = path.resolve(process.cwd(), '.orion_memory');
    if (!fs.existsSync(defaultDir)) {
      try {
        fs.mkdirSync(defaultDir, { recursive: true });
      } catch {}
    }
    this.storagePath = customStoragePath || path.join(defaultDir, 'unified_memory.json');
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    if (fs.existsSync(this.storagePath)) {
      try {
        const raw = fs.readFileSync(this.storagePath, 'utf-8');
        const items: MemoryRecord[] = JSON.parse(raw);
        if (Array.isArray(items)) {
          this.memories = items;
          return;
        }
      } catch (e) {
        console.error('Failed to parse persistent unified memory JSON:', e);
      }
    }
  }

  private saveToDisk(): void {
    try {
      const dir = path.dirname(this.storagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.storagePath, JSON.stringify(this.memories, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist unified memory to disk:', e);
    }
  }

  public addMemory(
    type: MemoryLayerType,
    content: string,
    tags: string[] = [],
    trustLevel: 'TRUSTED_SYSTEM' | 'UNTRUSTED_EXTERNAL' = 'TRUSTED_SYSTEM'
  ): MemoryRecord {
    // Enforce bound limit
    if (this.memories.length >= this.maxCapacity) {
      this.memories.shift(); // Evict oldest
    }

    const record: MemoryRecord = {
      id: 'mem_' + Math.random().toString(36).substring(2, 9),
      type,
      timestamp: Date.now(),
      content: content.slice(0, 5000), // Bound character length per entry
      tags,
      trustLevel
    };

    this.memories.push(record);
    this.saveToDisk();
    eventBus.logActivity('SYSTEM_EVENT', `Unified Memory Recorded [${type}]: ${content.slice(0, 60)}...`);
    return record;
  }

  public queryMemories(query: string, limit = 5): MemoryRecord[] {
    const lower = query.toLowerCase();
    const matches = this.memories.filter(m => 
      m.content.toLowerCase().includes(lower) || m.tags.some(t => t.toLowerCase().includes(lower))
    );

    return matches.slice(-limit);
  }

  public clearMemories(type?: MemoryLayerType): void {
    if (type) {
      this.memories = this.memories.filter(m => m.type !== type);
    } else {
      this.memories = [];
    }
    this.saveToDisk();
  }

  public getAllMemories(): MemoryRecord[] {
    return [...this.memories];
  }
}
