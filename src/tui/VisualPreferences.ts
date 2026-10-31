import fs from 'fs';
import os from 'os';
import path from 'path';

export type OrionVisualMode = 'vivid' | 'minimal';

export interface OrionVisualPreferences {
  visualMode: OrionVisualMode;
  animationsEnabled: boolean;
  tipRotationIntervalMs: number;
  updatedAtIso: string;
}

export const DEFAULT_VISUAL_PREFERENCES: Readonly<OrionVisualPreferences> = Object.freeze({
  visualMode: 'vivid',
  animationsEnabled: true,
  tipRotationIntervalMs: 10_000,
  updatedAtIso: '2026-10-30T00:00:00.000Z'
});

/**
 * Shared decorative-motion contract (`vivid && animationsEnabled && focused`).
 * - Visual mode controls visual presentation (`vivid` deep-space layout vs `minimal` quiet layout).
 * - Animation preference independently controls high-frequency decorative movement.
 * - Functional updates (input, tips, task status, streaming, approvals) continue in ALL 4 combinations.
 */
export function isDecorativeMotionActive(
  prefs: Pick<OrionVisualPreferences, 'visualMode' | 'animationsEnabled'>,
  isTerminalFocused: boolean = true
): boolean {
  return Boolean(
    prefs.visualMode === 'vivid' && prefs.animationsEnabled && isTerminalFocused
  );
}

/**
 * Resolves the default user-level ORION home directory (`~/.orion`),
 * honoring `ORION_HOME` when set (e.g. for isolated tests or portable installs).
 */
export function resolveOrionUserHomeDir(): string {
  if (process.env.ORION_HOME && process.env.ORION_HOME.trim()) {
    return path.resolve(process.env.ORION_HOME.trim());
  }
  return path.join(os.homedir(), '.orion');
}

export function resolveDefaultVisualPreferencesPath(workspaceRoot?: string): string {
  if (process.env.ORION_PREFERENCES_PATH && process.env.ORION_PREFERENCES_PATH.trim()) {
    return path.resolve(process.env.ORION_PREFERENCES_PATH.trim());
  }
  // When running inside an isolated temp test workspace (`os.tmpdir()`), scope preferences to that temp workspace
  // unless `ORION_HOME` was explicitly configured, so parallel test suites never mutate the operator's real `~/.orion`.
  if (workspaceRoot && !process.env.ORION_HOME) {
    const normWs = path.resolve(workspaceRoot).toLowerCase();
    const normTmp = path.resolve(os.tmpdir()).toLowerCase();
    if (normWs.startsWith(normTmp)) {
      return path.join(path.resolve(workspaceRoot), '.orion_memory', 'visual_preferences.json');
    }
  }
  return path.join(resolveOrionUserHomeDir(), 'preferences.json');
}

export type VisualPreferencesListener = (prefs: OrionVisualPreferences) => void;

/**
 * Single authoritative persisted store for ORION Visual Mode (`vivid` | `minimal`)
 * and independent Animation Preference (`animationsEnabled: boolean`).
 */
export class VisualPreferencesStore {
  private readonly storagePath: string;
  private state: OrionVisualPreferences;
  private readonly listeners: Set<VisualPreferencesListener> = new Set();

  constructor(options: {
    storagePath?: string;
    workspaceRoot?: string;
    initialFallbackVividMode?: boolean;
  } = {}) {
    this.storagePath =
      options.storagePath || resolveDefaultVisualPreferencesPath(options.workspaceRoot);
    this.state = this.loadFromDisk(options.initialFallbackVividMode);
  }

  public getStoragePath(): string {
    return this.storagePath;
  }

  private loadFromDisk(fallbackVivid?: boolean): OrionVisualPreferences {
    try {
      if (fs.existsSync(this.storagePath)) {
        const raw = JSON.parse(fs.readFileSync(this.storagePath, 'utf8'));
        const visualMode: OrionVisualMode =
          raw?.visualMode === 'minimal'
            ? 'minimal'
            : raw?.visualMode === 'vivid'
              ? 'vivid'
              : fallbackVivid === false
                ? 'minimal'
                : 'vivid';
        const animationsEnabled =
          typeof raw?.animationsEnabled === 'boolean' ? raw.animationsEnabled : true;
        const tipRotationIntervalMs =
          typeof raw?.tipRotationIntervalMs === 'number' && raw.tipRotationIntervalMs >= 1000
            ? Math.min(120_000, Math.round(raw.tipRotationIntervalMs))
            : DEFAULT_VISUAL_PREFERENCES.tipRotationIntervalMs;
        return {
          visualMode,
          animationsEnabled,
          tipRotationIntervalMs,
          updatedAtIso:
            typeof raw?.updatedAtIso === 'string'
              ? raw.updatedAtIso
              : new Date().toISOString()
        };
      }
    } catch {
      // Corrupt or unreadable file falls back cleanly to safe defaults
    }

    return {
      visualMode: fallbackVivid === false ? 'minimal' : DEFAULT_VISUAL_PREFERENCES.visualMode,
      animationsEnabled: DEFAULT_VISUAL_PREFERENCES.animationsEnabled,
      tipRotationIntervalMs: DEFAULT_VISUAL_PREFERENCES.tipRotationIntervalMs,
      updatedAtIso: new Date().toISOString()
    };
  }

  private saveToDisk(): void {
    try {
      const dir = path.dirname(this.storagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tmp = `${this.storagePath}.tmp.${process.pid}.${Date.now()}`;
      fs.writeFileSync(tmp, JSON.stringify(this.state, null, 2), 'utf8');
      fs.renameSync(tmp, this.storagePath);
    } catch {
      try {
        fs.writeFileSync(this.storagePath, JSON.stringify(this.state, null, 2), 'utf8');
      } catch {}
    }
  }

  public getPreferences(): OrionVisualPreferences {
    return { ...this.state };
  }

  public getVisualMode(): OrionVisualMode {
    return this.state.visualMode;
  }

  public isVividMode(): boolean {
    return this.state.visualMode === 'vivid';
  }

  public isAnimationsEnabled(): boolean {
    return this.state.animationsEnabled;
  }

  public isMotionActive(isTerminalFocused: boolean = true): boolean {
    return isDecorativeMotionActive(this.state, isTerminalFocused);
  }

  public updatePreferences(
    patch: Partial<
      Pick<OrionVisualPreferences, 'visualMode' | 'animationsEnabled' | 'tipRotationIntervalMs'>
    >
  ): OrionVisualPreferences {
    let changed = false;
    const next: OrionVisualPreferences = { ...this.state };

    if (patch.visualMode === 'vivid' || patch.visualMode === 'minimal') {
      if (next.visualMode !== patch.visualMode) {
        next.visualMode = patch.visualMode;
        changed = true;
      }
    }
    if (typeof patch.animationsEnabled === 'boolean') {
      if (next.animationsEnabled !== patch.animationsEnabled) {
        next.animationsEnabled = patch.animationsEnabled;
        changed = true;
      }
    }
    if (
      typeof patch.tipRotationIntervalMs === 'number' &&
      patch.tipRotationIntervalMs >= 1000
    ) {
      const clamped = Math.min(120_000, Math.round(patch.tipRotationIntervalMs));
      if (next.tipRotationIntervalMs !== clamped) {
        next.tipRotationIntervalMs = clamped;
        changed = true;
      }
    }

    next.updatedAtIso = new Date().toISOString();
    this.state = next;
    this.saveToDisk();

    if (changed) {
      const snapshot = this.getPreferences();
      for (const listener of this.listeners) {
        try {
          listener(snapshot);
        } catch {}
      }
    }

    return this.getPreferences();
  }

  public setVisualMode(mode: OrionVisualMode): OrionVisualPreferences {
    return this.updatePreferences({ visualMode: mode });
  }

  public toggleVisualMode(): OrionVisualPreferences {
    return this.setVisualMode(this.state.visualMode === 'vivid' ? 'minimal' : 'vivid');
  }

  public setAnimationsEnabled(enabled: boolean): OrionVisualPreferences {
    return this.updatePreferences({ animationsEnabled: enabled });
  }

  public toggleAnimations(): OrionVisualPreferences {
    return this.setAnimationsEnabled(!this.state.animationsEnabled);
  }

  public subscribe(listener: VisualPreferencesListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
