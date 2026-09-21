import { MemoryItem } from '../../shared/types';
import fs from 'fs';
import path from 'path';

export interface IMemoryService {
  getMemories(): Promise<MemoryItem[]>;
  saveMemory(item: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MemoryItem>;
  deleteMemory(id: string): Promise<boolean>;
  clearAllMemories(): Promise<void>;
}

export class MemoryService implements IMemoryService {
  private memories: Map<string, MemoryItem> = new Map();
  private storagePath: string;

  constructor(customStoragePath?: string) {
    const defaultDir = path.resolve(process.cwd(), '.orion_memory');
    if (!fs.existsSync(defaultDir)) {
      try {
        fs.mkdirSync(defaultDir, { recursive: true });
      } catch {}
    }
    this.storagePath = customStoragePath || path.join(defaultDir, 'explicit_memory.json');
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    if (fs.existsSync(this.storagePath)) {
      try {
        const raw = fs.readFileSync(this.storagePath, 'utf-8');
        const items: MemoryItem[] = JSON.parse(raw);
        if (Array.isArray(items)) {
          this.memories.clear();
          items.forEach(m => this.memories.set(m.id, m));
          return;
        }
      } catch (e) {
        console.error('Failed to parse persistent memory JSON:', e);
      }
    }
    this.seedDefaultExplicitMemories();
    this.saveToDisk();
  }

  private saveToDisk(): void {
    try {
      const dir = path.dirname(this.storagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const items = Array.from(this.memories.values());
      fs.writeFileSync(this.storagePath, JSON.stringify(items, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist memory to disk:', e);
    }
  }

  private seedDefaultExplicitMemories(): void {
    const defaults: MemoryItem[] = [
      {
        id: 'mem_1',
        createdAt: Date.now() - 86400000 * 2,
        updatedAt: Date.now() - 86400000 * 2,
        category: 'PREFERENCE',
        key: 'preferred_mode',
        value: 'HUD Dark Mode with Red Highlights',
        source: 'USER_EXPLICIT'
      },
      {
        id: 'mem_2',
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 86400000,
        category: 'WORKFLOW',
        key: 'dev_environment',
        value: 'Windows 11 with Node.js 24 and Electron Vite',
        source: 'USER_EXPLICIT'
      },
      {
        id: 'mem_3',
        createdAt: Date.now() - 3600000 * 4,
        updatedAt: Date.now() - 3600000 * 4,
        category: 'SYSTEM_NOTE',
        key: 'privacy_policy',
        value: 'Camera & Mic explicit confirmation strictly enforced',
        source: 'USER_EXPLICIT'
      }
    ];

    defaults.forEach(m => this.memories.set(m.id, m));
  }

  public async getMemories(): Promise<MemoryItem[]> {
    return Array.from(this.memories.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  public async saveMemory(item: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MemoryItem> {
    const id = 'mem_' + Math.random().toString(36).substring(2, 9);
    const now = Date.now();
    const newMemory: MemoryItem = {
      ...item,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.memories.set(id, newMemory);
    this.saveToDisk();
    return newMemory;
  }

  public async deleteMemory(id: string): Promise<boolean> {
    const deleted = this.memories.delete(id);
    if (deleted) {
      this.saveToDisk();
    }
    return deleted;
  }

  public async clearAllMemories(): Promise<void> {
    this.memories.clear();
    this.saveToDisk();
  }
}
