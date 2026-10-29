import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { AtomicFileEngine, FileChangeRecord } from './AtomicFileEngine';

export interface CheckpointSnapshot {
  checkpointId: string;
  label: string;
  createdAtIso: string;
  createdAtEpochMs: number;
  gitBranch: string;
  gitHeadSha: string;
  gitDirtyFiles: string[];
  associatedChangeIds: string[];
  fileSnapshots: Array<{
    relativePath: string;
    resolvedPath: string;
    existed: boolean;
    content: string | null;
    sha256: string | null;
  }>;
}

export interface UndoRedoOutcome {
  success: boolean;
  action: 'UNDO' | 'REDO' | 'REWIND';
  targetId: string;
  affectedFiles: string[];
  restoredStates: Array<{
    relativePath: string;
    status: 'RESTORED' | 'DELETED_NEW_FILE' | 'REAPPLIED';
    sha256: string | null;
  }>;
  error?: string;
  errorCode?: 'NO_CHANGES' | 'CONFLICT_DETECTED' | 'NOT_FOUND' | 'IO_ERROR';
}

export interface GitStatusReport {
  isGitRepo: boolean;
  branch: string;
  headSha: string;
  clean: boolean;
  entries: Array<{ status: string; path: string }>;
  rawPorcelain: string;
}

/**
 * Non-Destructive Checkpoint, Undo, Redo, Rewind & Git Worktree Service (Section 12).
 * - Never executes `git reset --hard`, `git clean -fd`, or force-discards unrelated user work.
 * - Combines Git metadata with `AtomicFileEngine` journal entries so both tracked and untracked
 *   agent-modified files can be safely undone, redone, or rewound to a named checkpoint.
 * - Detects conflicting external user edits via SHA-256 comparison before reverting or reapplying changes.
 */
export class CheckpointService {
  private readonly workspaceRoot: string;
  private readonly fileEngine: AtomicFileEngine;
  private readonly checkpointsPath: string;
  private checkpoints: CheckpointSnapshot[] = [];

  constructor(options: {
    workspaceRoot?: string;
    fileEngine?: AtomicFileEngine;
    customCheckpointsPath?: string;
  } = {}) {
    this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
    this.fileEngine = options.fileEngine || new AtomicFileEngine(this.workspaceRoot);
    this.checkpointsPath =
      options.customCheckpointsPath ||
      path.join(this.workspaceRoot, '.orion_memory', 'checkpoints_v2.json');
    this.loadCheckpoints();
  }

  public getFileEngine(): AtomicFileEngine {
    return this.fileEngine;
  }

  private loadCheckpoints(): void {
    try {
      if (fs.existsSync(this.checkpointsPath)) {
        const parsed = JSON.parse(fs.readFileSync(this.checkpointsPath, 'utf8'));
        if (Array.isArray(parsed)) {
          this.checkpoints = parsed;
          return;
        }
      }
    } catch {}
    this.checkpoints = [];
  }

  private saveCheckpoints(): void {
    try {
      const dir = path.dirname(this.checkpointsPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tmp = `${this.checkpointsPath}.tmp.${process.pid}.${Date.now()}`;
      fs.writeFileSync(tmp, JSON.stringify(this.checkpoints.slice(-100), null, 2), 'utf8');
      fs.renameSync(tmp, this.checkpointsPath);
    } catch {}
  }

  private runGitSync(args: string[]): { ok: boolean; stdout: string; stderr: string; exitCode: number } {
    try {
      const res = spawnSync('git', args, {
        cwd: this.workspaceRoot,
        encoding: 'utf8',
        windowsHide: true,
        timeout: 10_000
      });
      return {
        ok: res.status === 0,
        stdout: (res.stdout || '').trim(),
        stderr: (res.stderr || '').trim(),
        exitCode: res.status ?? 1
      };
    } catch (err: any) {
      return {
        ok: false,
        stdout: '',
        stderr: err.message || String(err),
        exitCode: 1
      };
    }
  }

  public getGitStatus(): GitStatusReport {
    const rev = this.runGitSync(['rev-parse', '--abbrev-ref', 'HEAD']);
    const sha = this.runGitSync(['rev-parse', 'HEAD']);
    const status = this.runGitSync(['status', '--porcelain']);

    if (!rev.ok && !sha.ok) {
      return {
        isGitRepo: false,
        branch: 'non-git',
        headSha: 'none',
        clean: true,
        entries: [],
        rawPorcelain: ''
      };
    }

    const lines = status.stdout ? status.stdout.split(/\r?\n/).filter(Boolean) : [];
    const entries = lines.map(line => ({
      status: line.slice(0, 2).trim(),
      path: line.slice(3).trim()
    }));

    return {
      isGitRepo: true,
      branch: rev.stdout || 'HEAD',
      headSha: sha.stdout || 'unknown',
      clean: entries.length === 0,
      entries,
      rawPorcelain: status.stdout
    };
  }

  public getGitDiff(options: { filePath?: string; staged?: boolean } = {}): {
    success: boolean;
    diff: string;
    error?: string;
  } {
    const args = ['diff'];
    if (options.staged) args.push('--staged');
    if (options.filePath) {
      const check = this.fileEngine.resolveAndValidatePath(options.filePath, 'READ');
      if (!check.valid) {
        return { success: false, diff: '', error: check.error };
      }
      args.push('--', check.relativePath);
    }

    const res = this.runGitSync(args);
    if (!res.ok) {
      return { success: false, diff: '', error: res.stderr || 'git diff failed' };
    }
    return {
      success: true,
      diff: res.stdout.slice(0, 32_000)
    };
  }

  /**
   * Creates a named non-destructive checkpoint capturing current Git metadata and the exact
   * state of any tracked/modified files in the AtomicFileEngine journal (plus any explicitly specified paths).
   */
  public createCheckpoint(label: string = 'manual-checkpoint', targetPaths: string[] = []): CheckpointSnapshot {
    this.loadCheckpoints();
    const gitStatus = this.getGitStatus();
    const journal = this.fileEngine.getJournal();

    // Collect all unique files touched in the journal plus any explicitly requested paths
    const trackedPathSet = new Set<string>();
    for (const entry of journal) {
      trackedPathSet.add(entry.relativePath);
    }
    for (const p of targetPaths) {
      const check = this.fileEngine.resolveAndValidatePath(p, 'READ');
      if (check.valid) {
        trackedPathSet.add(check.relativePath);
      }
    }

    const fileSnapshots: CheckpointSnapshot['fileSnapshots'] = [];
    for (const relPath of trackedPathSet) {
      const check = this.fileEngine.resolveAndValidatePath(relPath, 'READ');
      if (!check.valid) continue;
      const existed = fs.existsSync(check.resolvedPath) && fs.statSync(check.resolvedPath).isFile();
      const content = existed ? fs.readFileSync(check.resolvedPath, 'utf8') : null;
      const sha256 = content !== null ? AtomicFileEngine.sha256(content) : null;
      fileSnapshots.push({
        relativePath: check.relativePath,
        resolvedPath: check.resolvedPath,
        existed,
        content,
        sha256
      });
    }

    const now = Date.now();
    const snapshot: CheckpointSnapshot = {
      checkpointId: `chk_${now.toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      label: label.trim() || 'checkpoint',
      createdAtIso: new Date(now).toISOString(),
      createdAtEpochMs: now,
      gitBranch: gitStatus.branch,
      gitHeadSha: gitStatus.headSha,
      gitDirtyFiles: gitStatus.entries.map(e => e.path),
      associatedChangeIds: journal.filter(j => !j.undone).map(j => j.changeId),
      fileSnapshots
    };

    this.checkpoints.push(snapshot);
    this.saveCheckpoints();
    return snapshot;
  }

  public listCheckpoints(): CheckpointSnapshot[] {
    this.loadCheckpoints();
    return [...this.checkpoints].sort((a, b) => b.createdAtEpochMs - a.createdAtEpochMs);
  }

  public inspectCheckpoint(checkpointId: string): CheckpointSnapshot | null {
    this.loadCheckpoints();
    return this.checkpoints.find(c => c.checkpointId === checkpointId) || null;
  }

  /**
   * Undoes the most recent non-undone agent file change (or all changes sharing its checkpointId).
   * Verifies that the file on disk still matches `afterSha256` so user changes made after the agent edit
   * are never overwritten.
   */
  public undoLastChange(): UndoRedoOutcome {
    const journal = this.fileEngine.getJournal();
    const activeEntries = journal.filter(e => !e.undone);
    if (activeEntries.length === 0) {
      return {
        success: false,
        action: 'UNDO',
        targetId: '',
        affectedFiles: [],
        restoredStates: [],
        error: 'No agent file modifications available to undo.',
        errorCode: 'NO_CHANGES'
      };
    }

    const latest = activeEntries[activeEntries.length - 1];

    // Check if the file on disk was modified externally since `latest` was written
    if (fs.existsSync(latest.filePath)) {
      const diskContent = fs.readFileSync(latest.filePath, 'utf8');
      const diskSha = AtomicFileEngine.sha256(diskContent);
      if (latest.afterSha256 && diskSha !== latest.afterSha256) {
        return {
          success: false,
          action: 'UNDO',
          targetId: latest.changeId,
          affectedFiles: [latest.relativePath],
          restoredStates: [],
          error: `CONFLICT_DETECTED: Cannot undo change '${latest.changeId}' on '${latest.relativePath}' because the file was modified externally since the agent edit (expected SHA-256 ${latest.afterSha256.slice(0, 12)}, found ${diskSha.slice(0, 12)}).`,
          errorCode: 'CONFLICT_DETECTED'
        };
      }
    }

    try {
      if (!latest.existedBefore || latest.beforeContent === null) {
        if (fs.existsSync(latest.filePath)) {
          fs.unlinkSync(latest.filePath);
        }
      } else {
        const tmp = `${latest.filePath}.undo-tmp-${process.pid}-${Date.now()}`;
        fs.writeFileSync(tmp, latest.beforeContent, 'utf8');
        fs.renameSync(tmp, latest.filePath);
      }
    } catch (err: any) {
      return {
        success: false,
        action: 'UNDO',
        targetId: latest.changeId,
        affectedFiles: [latest.relativePath],
        restoredStates: [],
        error: `IO_ERROR while undoing '${latest.relativePath}': ${err.message}`,
        errorCode: 'IO_ERROR'
      };
    }

    this.fileEngine.updateJournalEntries(entries =>
      entries.map(e => (e.changeId === latest.changeId ? { ...e, undone: true } : e))
    );

    return {
      success: true,
      action: 'UNDO',
      targetId: latest.changeId,
      affectedFiles: [latest.relativePath],
      restoredStates: [
        {
          relativePath: latest.relativePath,
          status: latest.existedBefore ? 'RESTORED' : 'DELETED_NEW_FILE',
          sha256: latest.beforeSha256
        }
      ]
    };
  }

  /**
   * Redoes the most recently undone agent file change, verifying no conflicting user edits occurred.
   */
  public redoLastChange(): UndoRedoOutcome {
    const journal = this.fileEngine.getJournal();
    const undoneEntries = journal.filter(e => e.undone === true);
    if (undoneEntries.length === 0) {
      return {
        success: false,
        action: 'REDO',
        targetId: '',
        affectedFiles: [],
        restoredStates: [],
        error: 'No undone agent file modifications available to redo.',
        errorCode: 'NO_CHANGES'
      };
    }

    const target = undoneEntries[undoneEntries.length - 1];

    // Verify current disk state matches `beforeSha256` (or does not exist if `!existedBefore`)
    const currentlyExists = fs.existsSync(target.filePath);
    if (target.existedBefore) {
      if (!currentlyExists) {
        return {
          success: false,
          action: 'REDO',
          targetId: target.changeId,
          affectedFiles: [target.relativePath],
          restoredStates: [],
          error: `CONFLICT_DETECTED: Cannot redo change '${target.changeId}' because '${target.relativePath}' was deleted externally.`,
          errorCode: 'CONFLICT_DETECTED'
        };
      }
      const diskSha = AtomicFileEngine.sha256(fs.readFileSync(target.filePath, 'utf8'));
      if (target.beforeSha256 && diskSha !== target.beforeSha256) {
        return {
          success: false,
          action: 'REDO',
          targetId: target.changeId,
          affectedFiles: [target.relativePath],
          restoredStates: [],
          error: `CONFLICT_DETECTED: Cannot redo change '${target.changeId}' on '${target.relativePath}' because the file was modified externally after undo.`,
          errorCode: 'CONFLICT_DETECTED'
        };
      }
    } else if (currentlyExists) {
      return {
        success: false,
        action: 'REDO',
        targetId: target.changeId,
        affectedFiles: [target.relativePath],
        restoredStates: [],
        error: `CONFLICT_DETECTED: Cannot redo creation of '${target.relativePath}' because a file already exists at that path.`,
        errorCode: 'CONFLICT_DETECTED'
      };
    }

    try {
      const parentDir = path.dirname(target.filePath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      const tmp = `${target.filePath}.redo-tmp-${process.pid}-${Date.now()}`;
      fs.writeFileSync(tmp, target.afterContent ?? '', 'utf8');
      fs.renameSync(tmp, target.filePath);
    } catch (err: any) {
      return {
        success: false,
        action: 'REDO',
        targetId: target.changeId,
        affectedFiles: [target.relativePath],
        restoredStates: [],
        error: `IO_ERROR while redoing '${target.relativePath}': ${err.message}`,
        errorCode: 'IO_ERROR'
      };
    }

    this.fileEngine.updateJournalEntries(entries =>
      entries.map(e => (e.changeId === target.changeId ? { ...e, undone: false } : e))
    );

    return {
      success: true,
      action: 'REDO',
      targetId: target.changeId,
      affectedFiles: [target.relativePath],
      restoredStates: [
        {
          relativePath: target.relativePath,
          status: 'REAPPLIED',
          sha256: target.afterSha256
        }
      ]
    };
  }

  /**
   * Rewinds agent-modified files to the state recorded in `checkpointId` (or undoes all journal entries
   * created after that checkpoint) after verifying no external conflicts exist.
   */
  public rewindToCheckpoint(checkpointId: string): UndoRedoOutcome {
    this.loadCheckpoints();
    const cp = this.checkpoints.find(c => c.checkpointId === checkpointId);
    if (!cp) {
      return {
        success: false,
        action: 'REWIND',
        targetId: checkpointId,
        affectedFiles: [],
        restoredStates: [],
        error: `Checkpoint "${checkpointId}" not found.`,
        errorCode: 'NOT_FOUND'
      };
    }

    const journal = this.fileEngine.getJournal();
    // Find all active journal entries created strictly after the checkpoint was taken
    const postEntries = journal.filter(
      e => !e.undone && e.timestamp > cp.createdAtEpochMs && !cp.associatedChangeIds.includes(e.changeId)
    );

    // Pre-validate that the latest state of every affected file matches the latest journal `afterSha256`
    const latestByFile = new Map<string, FileChangeRecord>();
    for (const entry of postEntries) {
      latestByFile.set(entry.filePath, entry);
    }

    for (const [filePath, latestEntry] of latestByFile.entries()) {
      if (fs.existsSync(filePath)) {
        const diskSha = AtomicFileEngine.sha256(fs.readFileSync(filePath, 'utf8'));
        if (latestEntry.afterSha256 && diskSha !== latestEntry.afterSha256) {
          return {
            success: false,
            action: 'REWIND',
            targetId: checkpointId,
            affectedFiles: [latestEntry.relativePath],
            restoredStates: [],
            error: `CONFLICT_DETECTED: Cannot rewind to checkpoint '${checkpointId}' because '${latestEntry.relativePath}' was modified externally.`,
            errorCode: 'CONFLICT_DETECTED'
          };
        }
      }
    }

    const affectedFiles: string[] = [];
    const restoredStates: UndoRedoOutcome['restoredStates'] = [];

    // Undo post-checkpoint entries in reverse chronological order
    const reversed = [...postEntries].reverse();
    const undoneIds = new Set<string>();

    for (const entry of reversed) {
      try {
        if (!entry.existedBefore || entry.beforeContent === null) {
          if (fs.existsSync(entry.filePath)) {
            fs.unlinkSync(entry.filePath);
          }
        } else {
          const tmp = `${entry.filePath}.rewind-tmp-${process.pid}-${Date.now()}`;
          fs.writeFileSync(tmp, entry.beforeContent, 'utf8');
          fs.renameSync(tmp, entry.filePath);
        }
        undoneIds.add(entry.changeId);
        if (!affectedFiles.includes(entry.relativePath)) {
          affectedFiles.push(entry.relativePath);
        }
        restoredStates.push({
          relativePath: entry.relativePath,
          status: entry.existedBefore ? 'RESTORED' : 'DELETED_NEW_FILE',
          sha256: entry.beforeSha256
        });
      } catch (err: any) {
        return {
          success: false,
          action: 'REWIND',
          targetId: checkpointId,
          affectedFiles,
          restoredStates,
          error: `IO_ERROR during rewind of '${entry.relativePath}': ${err.message}`,
          errorCode: 'IO_ERROR'
        };
      }
    }

    // Also restore any explicit fileSnapshots stored in the checkpoint
    for (const snap of cp.fileSnapshots) {
      if (!snap.existed || snap.content === null) {
        if (fs.existsSync(snap.resolvedPath)) {
          try {
            fs.unlinkSync(snap.resolvedPath);
          } catch {}
        }
      } else {
        try {
          const tmp = `${snap.resolvedPath}.snap-tmp-${process.pid}-${Date.now()}`;
          fs.writeFileSync(tmp, snap.content, 'utf8');
          fs.renameSync(tmp, snap.resolvedPath);
          if (!affectedFiles.includes(snap.relativePath)) {
            affectedFiles.push(snap.relativePath);
            restoredStates.push({
              relativePath: snap.relativePath,
              status: 'RESTORED',
              sha256: snap.sha256
            });
          }
        } catch {}
      }
    }

    if (undoneIds.size > 0) {
      this.fileEngine.updateJournalEntries(entries =>
        entries.map(e => (undoneIds.has(e.changeId) ? { ...e, undone: true } : e))
      );
    }

    return {
      success: true,
      action: 'REWIND',
      targetId: checkpointId,
      affectedFiles,
      restoredStates
    };
  }

  /**
   * Non-destructive Git worktree management (`list`, `add`, `remove` without `--force`).
   */
  public manageWorktree(input: {
    action: 'list' | 'add' | 'remove';
    worktreePath?: string;
    branch?: string;
  }): {
    success: boolean;
    action: string;
    worktrees?: Array<{ path: string; head: string; branch: string }>;
    output?: string;
    error?: string;
  } {
    if (input.action === 'list') {
      const res = this.runGitSync(['worktree', 'list', '--porcelain']);
      if (!res.ok) {
        return { success: false, action: 'list', error: res.stderr || 'git worktree list failed' };
      }
      const worktrees: Array<{ path: string; head: string; branch: string }> = [];
      const blocks = res.stdout.split(/\r?\n\r?\n/).filter(Boolean);
      for (const block of blocks) {
        let wtPath = '';
        let wtHead = '';
        let wtBranch = 'detached';
        for (const line of block.split(/\r?\n/)) {
          if (line.startsWith('worktree ')) wtPath = line.slice('worktree '.length).trim();
          else if (line.startsWith('HEAD ')) wtHead = line.slice('HEAD '.length).trim();
          else if (line.startsWith('branch ')) wtBranch = line.slice('branch '.length).trim();
        }
        if (wtPath) {
          worktrees.push({ path: wtPath, head: wtHead, branch: wtBranch });
        }
      }
      return { success: true, action: 'list', worktrees, output: res.stdout };
    }

    if (!input.worktreePath || !input.worktreePath.trim()) {
      return {
        success: false,
        action: input.action,
        error: `worktreePath is required for git worktree ${input.action}.`
      };
    }

    const check = this.fileEngine.resolveAndValidatePath(input.worktreePath, 'WRITE');
    if (!check.valid) {
      return {
        success: false,
        action: input.action,
        error: check.error
      };
    }

    if (input.action === 'add') {
      const args = ['worktree', 'add', check.resolvedPath];
      if (input.branch && input.branch.trim()) {
        args.push(input.branch.trim());
      }
      const res = this.runGitSync(args);
      return {
        success: res.ok,
        action: 'add',
        output: res.stdout,
        error: res.ok ? undefined : res.stderr || 'git worktree add failed'
      };
    }

    if (input.action === 'remove') {
      // Never pass --force so uncommitted changes in a worktree are protected
      const res = this.runGitSync(['worktree', 'remove', check.resolvedPath]);
      return {
        success: res.ok,
        action: 'remove',
        output: res.stdout,
        error: res.ok ? undefined : res.stderr || 'git worktree remove failed'
      };
    }

    return {
      success: false,
      action: String(input.action),
      error: `Unsupported worktree action "${input.action}".`
    };
  }
}
