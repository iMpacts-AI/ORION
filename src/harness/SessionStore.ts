import fs from 'fs';
import path from 'path';
import { ConversationTurn } from './ContextManager';
import { HarnessEffortLevel, HarnessMode } from './ExecutionResult';
import { UnifiedMemoryManager } from '../main/services/UnifiedMemoryManager';

export interface PersistedSessionRecord {
  sessionId: string;
  title: string;
  createdAtIso: string;
  updatedAtIso: string;
  updatedAtEpochMs: number;
  workspaceRoot: string;
  mode: HarnessMode;
  effortLevel: HarnessEffortLevel;
  vividMode: boolean;
  activeModelId: string;
  attachedPaths: string[];
  turns: ConversationTurn[];
}

/**
 * Persistent Session & State Store (Section 13).
 * - Persists sessions in `.orion_memory/sessions_v2.json` via atomic write.
 * - Supports creating, saving, listing, inspecting, and resuming sessions (`/resume`).
 */
export class SessionStore {
  private readonly storagePath: string;
  private sessions: PersistedSessionRecord[] = [];
  private activeSessionId: string;

  constructor(options: { storagePath?: string; workspaceRoot?: string } = {}) {
    const root = path.resolve(options.workspaceRoot || process.cwd());
    const defaultDir = path.join(root, '.orion_memory');
    if (!fs.existsSync(defaultDir)) {
      try {
        fs.mkdirSync(defaultDir, { recursive: true });
      } catch {}
    }
    this.storagePath = options.storagePath || path.join(defaultDir, 'sessions_v2.json');
    this.loadFromDisk();

    if (this.sessions.length > 0) {
      this.activeSessionId = this.sessions[this.sessions.length - 1].sessionId;
    } else {
      const initial = this.createSession({ workspaceRoot: root, title: 'Default ORION v2 Session' });
      this.activeSessionId = initial.sessionId;
    }
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.storagePath)) {
        const parsed = JSON.parse(fs.readFileSync(this.storagePath, 'utf8'));
        if (Array.isArray(parsed)) {
          this.sessions = parsed;
          return;
        }
      }
    } catch {}
    this.sessions = [];
  }

  private saveToDisk(): void {
    try {
      const dir = path.dirname(this.storagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tmp = `${this.storagePath}.tmp.${process.pid}.${Date.now()}`;
      fs.writeFileSync(tmp, JSON.stringify(this.sessions.slice(-50), null, 2), 'utf8');
      fs.renameSync(tmp, this.storagePath);
    } catch {}
  }

  public createSession(options: {
    workspaceRoot?: string;
    title?: string;
    mode?: HarnessMode;
    effortLevel?: HarnessEffortLevel;
    vividMode?: boolean;
    activeModelId?: string;
  } = {}): PersistedSessionRecord {
    this.loadFromDisk();
    const now = Date.now();
    const session: PersistedSessionRecord = {
      sessionId: `sess_${now.toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      title: UnifiedMemoryManager.sanitizeSecrets(options.title || `ORION Session ${new Date(now).toISOString().slice(0, 16)}`),
      createdAtIso: new Date(now).toISOString(),
      updatedAtIso: new Date(now).toISOString(),
      updatedAtEpochMs: now,
      workspaceRoot: path.resolve(options.workspaceRoot || process.cwd()),
      mode: options.mode || 'Build',
      effortLevel: options.effortLevel || 'medium',
      vividMode: options.vividMode ?? true,
      activeModelId: options.activeModelId || 'auto',
      attachedPaths: [],
      turns: []
    };

    this.sessions.push(session);
    this.activeSessionId = session.sessionId;
    this.saveToDisk();
    return session;
  }

  public getActiveSession(): PersistedSessionRecord {
    this.loadFromDisk();
    const found = this.sessions.find(s => s.sessionId === this.activeSessionId);
    if (found) return found;
    if (this.sessions.length > 0) {
      this.activeSessionId = this.sessions[this.sessions.length - 1].sessionId;
      return this.sessions[this.sessions.length - 1];
    }
    return this.createSession();
  }

  public updateActiveSession(
    patch: Partial<
      Pick<
        PersistedSessionRecord,
        'title' | 'mode' | 'effortLevel' | 'vividMode' | 'activeModelId' | 'attachedPaths' | 'turns'
      >
    >
  ): PersistedSessionRecord {
    this.loadFromDisk();
    let target = this.sessions.find(s => s.sessionId === this.activeSessionId);
    if (!target) {
      target = this.createSession();
    }

    if (patch.title !== undefined) target.title = UnifiedMemoryManager.sanitizeSecrets(patch.title);
    if (patch.mode !== undefined) target.mode = patch.mode;
    if (patch.effortLevel !== undefined) target.effortLevel = patch.effortLevel;
    if (patch.vividMode !== undefined) target.vividMode = patch.vividMode;
    if (patch.activeModelId !== undefined) target.activeModelId = patch.activeModelId;
    if (patch.attachedPaths !== undefined) target.attachedPaths = [...patch.attachedPaths];
    if (patch.turns !== undefined) target.turns = [...patch.turns];

    const now = Date.now();
    target.updatedAtEpochMs = now;
    target.updatedAtIso = new Date(now).toISOString();

    this.saveToDisk();
    return target;
  }

  public listSessions(): PersistedSessionRecord[] {
    this.loadFromDisk();
    return [...this.sessions].sort((a, b) => b.updatedAtEpochMs - a.updatedAtEpochMs);
  }

  public resumeSession(sessionIdOrPrefix: string): {
    success: boolean;
    session?: PersistedSessionRecord;
    error?: string;
  } {
    this.loadFromDisk();
    const clean = String(sessionIdOrPrefix || '').trim();
    if (!clean) {
      // Resume most recent session
      if (this.sessions.length === 0) {
        return { success: false, error: 'No saved sessions available to resume.' };
      }
      const latest = [...this.sessions].sort((a, b) => b.updatedAtEpochMs - a.updatedAtEpochMs)[0];
      this.activeSessionId = latest.sessionId;
      return { success: true, session: latest };
    }

    const match = this.sessions.find(
      s => s.sessionId === clean || s.sessionId.startsWith(clean) || s.title.toLowerCase().includes(clean.toLowerCase())
    );
    if (!match) {
      return {
        success: false,
        error: `Session "${clean}" not found.`
      };
    }

    this.activeSessionId = match.sessionId;
    return { success: true, session: match };
  }
}
