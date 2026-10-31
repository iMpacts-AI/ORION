import { MemoryLayerType, MemoryRecord, IUnifiedMemoryManager } from '../../shared/types/memoryManager';
import { eventBus } from '../../shared/events';
import { classifyConversationalTurn } from '../../shared/branding/OrionEngineIdentity';
import fs from 'fs';
import path from 'path';

export interface HikmahMemoryImportResult {
  success: boolean;
  sourcePath: string;
  importedCount: number;
  skippedDuplicates: number;
  blockedInjections: number;
  categoriesImported: Record<string, number>;
  error?: string;
}

export class UnifiedMemoryManager implements IUnifiedMemoryManager {
  private memories: MemoryRecord[] = [];
  private maxCapacity = 1500;
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

  private static readonly INJECTION_AND_SECRET_PATTERNS = [
    /unrestricted system access/i,
    /behave like\s+['"]?nuvulu/i,
    /behave like\s+['"]?bhaiya/i,
    /(?:ignore|disregard|forget)\s+(?:all\s+)?(?:previous\s+|prior\s+)?(?:instructions|directives|system\s+prompt)/i,
    /system override/i,
    /developer mode enabled/i,
    /jailbreak/i,
    /<\|im_start\|>\s*system/i,
    /bypass.*security/i,
    /disable.*safety/i,
    /you are now/i
  ];

  public static sanitizeSecrets(text: string): string {
    return text
      .replace(/-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z0-9 ]*PRIVATE KEY-----/g, '***REDACTED_PRIVATE_KEY***')
      .replace(/(sk-ant-[a-zA-Z0-9\-_]{8,}|sk-or-v1-[a-zA-Z0-9\-_]{8,}|sk-[a-zA-Z0-9\-_]{12,}|gsk_[a-zA-Z0-9\-_]{12,}|AIza[0-9A-Za-z\-_]{15,}|gh[pousr]_[a-zA-Z0-9_]{12,}|nvapi-[a-zA-Z0-9\-_]{12,}|csk-[a-zA-Z0-9\-_]{12,}|Bearer\s+[A-Za-z0-9\-._~+/]+=*)/gi, '***REDACTED_SECRET***')
      .replace(/([?&](?:api[_-]?key|key|token|secret|access[_-]?token|password)=)[^&\s"']+/gi, '$1***REDACTED***')
      .replace(/(password|passwd|api_key|apikey|secret_key|access_token|private_key)\s*[:=]\s*[^\s,;]+/gi, '$1=***REDACTED***');
  }

  public static isPromptInjectionAttempt(text: string): boolean {
    return UnifiedMemoryManager.INJECTION_AND_SECRET_PATTERNS.some(rx => rx.test(text));
  }

  public addMemory(
    type: MemoryLayerType,
    content: string,
    tags: string[] = [],
    trustLevel: 'TRUSTED_SYSTEM' | 'UNTRUSTED_EXTERNAL' = 'TRUSTED_SYSTEM'
  ): MemoryRecord {
    const sanitizedContent = UnifiedMemoryManager.sanitizeSecrets(content).slice(0, 5000);
    if (UnifiedMemoryManager.isPromptInjectionAttempt(sanitizedContent)) {
      throw new Error('SECURITY POLICY VIOLATION: Attempted to store prompt-injection or authority-override payload in Unified Memory.');
    }

    if (this.memories.length >= this.maxCapacity) {
      this.memories.shift();
    }

    const record: MemoryRecord = {
      id: 'mem_' + Math.random().toString(36).substring(2, 9),
      type,
      timestamp: Date.now(),
      content: sanitizedContent,
      tags,
      trustLevel
    };

    this.memories.push(record);
    this.saveToDisk();
    eventBus.logActivity('SYSTEM_EVENT', `Unified Memory Recorded [${type}]: ${sanitizedContent.slice(0, 60)}...`);
    return record;
  }

  public deleteMemoryById(id: string): boolean {
    const before = this.memories.length;
    this.memories = this.memories.filter(m => m.id !== id);
    if (this.memories.length < before) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  public updateMemoryById(id: string, newContent: string): MemoryRecord | null {
    const sanitized = UnifiedMemoryManager.sanitizeSecrets(newContent).slice(0, 5000);
    if (UnifiedMemoryManager.isPromptInjectionAttempt(sanitized)) {
      throw new Error('SECURITY POLICY VIOLATION: Attempted to update memory with prompt-injection payload.');
    }
    const target = this.memories.find(m => m.id === id);
    if (!target) return null;
    target.content = sanitized;
    target.timestamp = Date.now();
    this.saveToDisk();
    return target;
  }

  public addNote(content: string, tags: string[] = []): MemoryRecord {
    return this.addMemory('WORKING', `[NOTE] ${content}`, ['note', ...tags], 'TRUSTED_SYSTEM');
  }

  public listNotes(limit = 20): MemoryRecord[] {
    return this.memories
      .filter(m => m.tags.includes('note') || m.content.startsWith('[NOTE]'))
      .slice(-limit);
  }

  public addReminder(taskText: string, dueTime?: string): MemoryRecord {
    const formatted = dueTime ? `[REMINDER | Due: ${dueTime}] ${taskText}` : `[REMINDER] ${taskText}`;
    return this.addMemory('TASK', formatted, ['reminder', ...(dueTime ? [dueTime] : [])], 'TRUSTED_SYSTEM');
  }

  public listReminders(limit = 20): MemoryRecord[] {
    return this.memories
      .filter(m => m.tags.includes('reminder') || m.content.startsWith('[REMINDER'))
      .slice(-limit);
  }

  public getMemoriesByTag(tag: string, limit = 50): MemoryRecord[] {
    const lower = tag.toLowerCase();
    return this.memories
      .filter(m => m.tags.some(t => t.toLowerCase() === lower))
      .slice(-limit);
  }

  /**
   * Safe UTF-8 Migration of Al-Hikmah's `memory.json` into ORION UnifiedMemoryManager:
   * 1. Reads explicitly as UTF-8 (fixing Al-Hikmah's Windows cp1252 UnicodeDecodeError at byte 0x90).
   * 2. Filters out prompt-injection / persona-override entries (e.g. "Nuvulu", "Bhaiya", "unrestricted system access").
   * 3. Deduplicates against existing ORION memory records.
   */
  public importHikmahMemory(hikmahFilePath: string): HikmahMemoryImportResult {
    const resolved = path.resolve(hikmahFilePath);
    const categoriesImported: Record<string, number> = {
      facts: 0,
      preferences: 0,
      people: 0,
      projects: 0,
      tasks: 0,
      notes: 0,
      reminders: 0
    };

    if (!fs.existsSync(resolved)) {
      return {
        success: false,
        sourcePath: resolved,
        importedCount: 0,
        skippedDuplicates: 0,
        blockedInjections: 0,
        categoriesImported,
        error: `Hikmah memory file not found at: ${resolved}`
      };
    }

    try {
      // Explicit UTF-8 read to prevent Windows cp1252 decoding errors
      const raw = fs.readFileSync(resolved, { encoding: 'utf-8' });
      const parsed = JSON.parse(raw);

      const injectionPatterns = [
        /unrestricted system access/i,
        /behave like\s+['"]?nuvulu/i,
        /behave like\s+['"]?bhaiya/i,
        /ignore previous instructions/i,
        /bypass.*security/i,
        /disable.*safety/i
      ];

      const existingContents = new Set(this.memories.map(m => m.content.trim().toLowerCase()));
      let importedCount = 0;
      let skippedDuplicates = 0;
      let blockedInjections = 0;

      const categoryMapping: Array<{ key: string; layer: MemoryLayerType; prefix: string }> = [
        { key: 'facts', layer: 'EPISODIC', prefix: '[FACT]' },
        { key: 'preferences', layer: 'WORKING', prefix: '[PREFERENCE]' },
        { key: 'people', layer: 'EPISODIC', prefix: '[PERSON]' },
        { key: 'projects', layer: 'TASK', prefix: '[PROJECT]' },
        { key: 'tasks', layer: 'TASK', prefix: '[TASK]' },
        { key: 'notes', layer: 'WORKING', prefix: '[NOTE]' },
        { key: 'reminders', layer: 'TASK', prefix: '[REMINDER]' }
      ];

      for (const { key, layer, prefix } of categoryMapping) {
        const list = parsed[key];
        if (!Array.isArray(list)) continue;

        for (const item of list) {
          const text = typeof item === 'string'
            ? item.trim()
            : typeof item === 'object' && item !== null
              ? String(item.text || item.content || item.task || JSON.stringify(item)).trim()
              : '';

          if (!text) continue;

          // Prompt-Injection Sanitization Gate
          if (injectionPatterns.some(rx => rx.test(text))) {
            blockedInjections++;
            continue;
          }

          const formattedContent = `${prefix} ${text}`;
          const normKey = formattedContent.toLowerCase();
          if (existingContents.has(normKey)) {
            skippedDuplicates++;
            continue;
          }

          existingContents.add(normKey);
          this.memories.push({
            id: 'mem_hikmah_' + Math.random().toString(36).substring(2, 9),
            type: layer,
            timestamp: Date.now(),
            content: formattedContent.slice(0, 5000),
            tags: ['hikmah-import', key.replace(/s$/, ''), key],
            trustLevel: 'TRUSTED_SYSTEM'
          });

          categoriesImported[key] = (categoriesImported[key] || 0) + 1;
          importedCount++;
        }
      }

      if (importedCount > 0) {
        // Trim to capacity if needed
        if (this.memories.length > this.maxCapacity) {
          this.memories = this.memories.slice(-this.maxCapacity);
        }
        this.saveToDisk();
      }

      return {
        success: true,
        sourcePath: resolved,
        importedCount,
        skippedDuplicates,
        blockedInjections,
        categoriesImported
      };
    } catch (err: any) {
      return {
        success: false,
        sourcePath: resolved,
        importedCount: 0,
        skippedDuplicates: 0,
        blockedInjections: 0,
        categoriesImported,
        error: err.message || String(err)
      };
    }
  }

  public queryMemories(query: string, limit = 5): MemoryRecord[] {
    const lower = query.toLowerCase().trim();
    if (!lower || classifyConversationalTurn(query).isGreetingOrSmallTalk) {
      return [];
    }

    // 1. Direct substring or tag match (require word boundary for short <4 char queries so "hi" never matches "this")
    const shortWordBoundary =
      lower.length < 4
        ? new RegExp(`\\b${lower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
        : null;
    const directMatches = this.memories.filter(m => {
      if (UnifiedMemoryManager.isPromptInjectionAttempt(m.content)) return false;
      if (shortWordBoundary) {
        return shortWordBoundary.test(m.content) || m.tags.some(t => shortWordBoundary.test(t));
      }
      return m.content.toLowerCase().includes(lower) || m.tags.some(t => t.toLowerCase().includes(lower));
    });

    if (directMatches.length >= limit) {
      return directMatches.slice(-limit);
    }

    // 2. Token-based relevance scoring for natural language queries (e.g. "what are my projects or preferences?")
    const stopWords = new Set(['what', 'where', 'when', 'which', 'who', 'how', 'the', 'and', 'for', 'with', 'about', 'from', 'that', 'this', 'have', 'does', 'are', 'was', 'were', 'tell', 'show', 'please']);
    const tokens = lower
      .replace(/[^a-z0-9_\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length >= 3 && !stopWords.has(t));

    if (tokens.length < 2) {
      return directMatches.slice(-limit);
    }

    const minRequiredMatches = Math.min(2, tokens.length);
    const scored: Array<{ record: MemoryRecord; score: number }> = [];
    for (const m of this.memories) {
      if (UnifiedMemoryManager.isPromptInjectionAttempt(m.content)) continue;
      const contentLower = m.content.toLowerCase();
      let score = 0;
      let matchedTokens = 0;
      if (contentLower.includes(lower)) score += 10;
      for (const tok of tokens) {
        const inContent = contentLower.includes(tok);
        const inTags = m.tags.some(tag => tag.toLowerCase().includes(tok));
        if (inContent || inTags) {
          matchedTokens++;
          if (inContent) score += 3;
          if (inTags) score += 4;
        }
      }
      if (contentLower.includes(lower) || matchedTokens >= minRequiredMatches) {
        scored.push({ record: m, score });
      }
    }

    scored.sort((a, b) => b.score - a.score || b.record.timestamp - a.record.timestamp);
    return scored.slice(0, limit).map(s => s.record);
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
