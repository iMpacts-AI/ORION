import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ActionRiskEvaluator } from '../main/services/ActionRiskEvaluator';
import { UnifiedMemoryManager } from '../main/services/UnifiedMemoryManager';

export interface FileChangeRecord {
  changeId: string;
  checkpointId: string;
  filePath: string;
  relativePath: string;
  existedBefore: boolean;
  beforeContent: string | null;
  afterContent: string | null;
  beforeSha256: string | null;
  afterSha256: string | null;
  timestamp: number;
  sessionId: string;
  taskId: string;
  undone?: boolean;
}

export interface AtomicWriteOutcome {
  success: boolean;
  filePath: string;
  relativePath: string;
  beforeSha256: string | null;
  afterSha256: string;
  bytesWritten: number;
  checkpointId: string;
  changeId: string;
  diffPreview: string;
  error?: string;
  errorCode?: 'PATH_VIOLATION' | 'CONFLICT_DETECTED' | 'MISMATCH_COUNT' | 'ENOENT' | 'IO_ERROR';
}

/**
 * Workspace-contained Atomic File Engine (Section 6).
 * - Enforces workspace path containment, symlink escape detection, device/UNC blocking, and protected file checks.
 * - Uses atomic temporary-file + rename writes.
 * - Validates expected match count and optional expected prior SHA-256 hash before modifying files.
 * - Records every modification in a recoverable change journal for undo/redo/rewind.
 */
export class AtomicFileEngine {
  private readonly workspaceRoot: string;
  private readonly riskEvaluator: ActionRiskEvaluator;
  private readonly journalPath: string;
  private journal: FileChangeRecord[] = [];

  constructor(workspaceRoot?: string, customJournalPath?: string) {
    this.workspaceRoot = path.resolve(workspaceRoot || process.cwd());
    this.riskEvaluator = new ActionRiskEvaluator();
    this.journalPath =
      customJournalPath || path.join(this.workspaceRoot, '.orion_memory', 'atomic_file_journal.json');
    this.loadJournal();
  }

  public getWorkspaceRoot(): string {
    return this.workspaceRoot;
  }

  public static sha256(content: string): string {
    return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
  }

  private loadJournal(): void {
    try {
      if (fs.existsSync(this.journalPath)) {
        const parsed = JSON.parse(fs.readFileSync(this.journalPath, 'utf8'));
        if (Array.isArray(parsed)) {
          this.journal = parsed;
        }
      }
    } catch {}
  }

  private saveJournal(): void {
    try {
      const dir = path.dirname(this.journalPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.journalPath, JSON.stringify(this.journal.slice(-200), null, 2), 'utf8');
    } catch {}
  }

  public getJournal(): FileChangeRecord[] {
    this.loadJournal();
    return [...this.journal];
  }

  public updateJournalEntries(updater: (entries: FileChangeRecord[]) => FileChangeRecord[]): void {
    this.loadJournal();
    this.journal = updater(this.journal);
    this.saveJournal();
  }

  /**
   * Resolves and validates a target path against the authorized workspace root,
   * rejecting path traversal (`..`), UNC/device paths, symlink escapes, and protected files.
   */
  public resolveAndValidatePath(
    candidatePath: string,
    mode: 'READ' | 'WRITE'
  ): { valid: boolean; resolvedPath: string; relativePath: string; error?: string } {
    if (!candidatePath || typeof candidatePath !== 'string' || !candidatePath.trim()) {
      return { valid: false, resolvedPath: '', relativePath: '', error: 'Path cannot be empty.' };
    }

    const raw = candidatePath.trim();

    // Block Windows UNC (\\server\share) and device (\\.\, \\?\) paths immediately
    if (/^(\\\\|\/\/)[^\\/]+[\\/]+[^\\/]+/.test(raw) || /^\\\\[?.]\\/.test(raw)) {
      return {
        valid: false,
        resolvedPath: raw,
        relativePath: raw,
        error: `SECURITY_VIOLATION: UNC and device paths ('${raw}') are prohibited.`
      };
    }

    const resolved = path.resolve(this.workspaceRoot, raw);
    const realWorkspace = fs.existsSync(this.workspaceRoot)
      ? fs.realpathSync(this.workspaceRoot)
      : this.workspaceRoot;

    // Check symlink resolution on existing target or parent directory
    let effectiveRealTarget = resolved;
    try {
      if (fs.existsSync(resolved)) {
        effectiveRealTarget = fs.realpathSync(resolved);
      } else {
        let parentDir = path.dirname(resolved);
        while (parentDir && parentDir !== path.dirname(parentDir) && !fs.existsSync(parentDir)) {
          parentDir = path.dirname(parentDir);
        }
        if (fs.existsSync(parentDir)) {
          const realParent = fs.realpathSync(parentDir);
          const relFromParent = path.relative(parentDir, resolved);
          effectiveRealTarget = path.join(realParent, relFromParent);
        }
      }
    } catch {}

    const normRoot = process.platform === 'win32' ? realWorkspace.toLowerCase() : realWorkspace;
    const normTarget = process.platform === 'win32' ? effectiveRealTarget.toLowerCase() : effectiveRealTarget;

    if (normTarget !== normRoot && !normTarget.startsWith(normRoot + path.sep)) {
      return {
        valid: false,
        resolvedPath: resolved,
        relativePath: path.relative(this.workspaceRoot, resolved),
        error: `SECURITY_VIOLATION: Path '${candidatePath}' resolves outside authorized workspace root ('${this.workspaceRoot}').`
      };
    }

    // Check ActionRiskEvaluator for sensitive/protected targets (.env, .git/hooks, orion-protected-policy, etc.)
    const evalType = mode === 'WRITE' ? 'FILE_WRITE' : 'FILE_READ';
    const risk = this.riskEvaluator.evaluateRisk(evalType as any, { filePath: resolved }, { filePath: resolved }, resolved);
    if (risk === 'CRITICAL') {
      return {
        valid: false,
        resolvedPath: resolved,
        relativePath: path.relative(this.workspaceRoot, resolved),
        error: `SECURITY_VIOLATION: Access to protected or restricted path '${candidatePath}' is blocked.`
      };
    }

    return {
      valid: true,
      resolvedPath: effectiveRealTarget,
      relativePath: path.relative(this.workspaceRoot, effectiveRealTarget)
    };
  }

  public readFile(
    filePath: string,
    options?: { startLine?: number; endLine?: number; maxBytes?: number }
  ): {
    success: boolean;
    filePath: string;
    relativePath: string;
    content: string;
    sha256: string;
    sizeBytes: number;
    totalLines: number;
    truncated: boolean;
    error?: string;
  } {
    const check = this.resolveAndValidatePath(filePath, 'READ');
    if (!check.valid) {
      return {
        success: false,
        filePath: check.resolvedPath,
        relativePath: check.relativePath,
        content: '',
        sha256: '',
        sizeBytes: 0,
        totalLines: 0,
        truncated: false,
        error: check.error
      };
    }

    if (!fs.existsSync(check.resolvedPath)) {
      return {
        success: false,
        filePath: check.resolvedPath,
        relativePath: check.relativePath,
        content: '',
        sha256: '',
        sizeBytes: 0,
        totalLines: 0,
        truncated: false,
        error: `ENOENT: File not found: ${check.relativePath || filePath}`
      };
    }

    const stat = fs.statSync(check.resolvedPath);
    if (stat.isDirectory()) {
      return {
        success: false,
        filePath: check.resolvedPath,
        relativePath: check.relativePath,
        content: '',
        sha256: '',
        sizeBytes: 0,
        totalLines: 0,
        truncated: false,
        error: `EISDIR: Path '${check.relativePath}' is a directory, not a file.`
      };
    }

    const raw = fs.readFileSync(check.resolvedPath, 'utf8');
    const fullHash = AtomicFileEngine.sha256(raw);
    const allLines = raw.split(/\r?\n/);
    const maxBytes = options?.maxBytes ?? 256 * 1024;

    let selected = raw;
    if (options?.startLine !== undefined || options?.endLine !== undefined) {
      const start = Math.max(1, options.startLine ?? 1);
      const end = Math.min(allLines.length, options.endLine ?? allLines.length);
      selected = allLines.slice(start - 1, end).join('\n');
    }

    let truncated = false;
    if (Buffer.byteLength(selected, 'utf8') > maxBytes) {
      selected = selected.slice(0, maxBytes);
      truncated = true;
    }

    return {
      success: true,
      filePath: check.resolvedPath,
      relativePath: check.relativePath,
      content: UnifiedMemoryManager.sanitizeSecrets(selected),
      sha256: fullHash,
      sizeBytes: stat.size,
      totalLines: allLines.length,
      truncated
    };
  }

  public listDirectory(dirPath = '.'): {
    success: boolean;
    dirPath: string;
    entries: Array<{ name: string; type: 'file' | 'directory'; sizeBytes: number }>;
    error?: string;
  } {
    const check = this.resolveAndValidatePath(dirPath, 'READ');
    if (!check.valid) {
      return { success: false, dirPath: check.resolvedPath, entries: [], error: check.error };
    }
    if (!fs.existsSync(check.resolvedPath)) {
      return { success: false, dirPath: check.resolvedPath, entries: [], error: `ENOENT: Directory not found: ${dirPath}` };
    }
    const stat = fs.statSync(check.resolvedPath);
    if (!stat.isDirectory()) {
      return { success: false, dirPath: check.resolvedPath, entries: [], error: `ENOTDIR: '${dirPath}' is not a directory.` };
    }

    const dirents = fs.readdirSync(check.resolvedPath, { withFileTypes: true });
    const entries = dirents.slice(0, 250).map(d => {
      let sizeBytes = 0;
      if (d.isFile()) {
        try {
          sizeBytes = fs.statSync(path.join(check.resolvedPath, d.name)).size;
        } catch {}
      }
      return {
        name: d.name,
        type: d.isDirectory() ? ('directory' as const) : ('file' as const),
        sizeBytes
      };
    });

    return {
      success: true,
      dirPath: check.resolvedPath,
      entries
    };
  }

  public searchFiles(pattern: string, maxResults = 50): string[] {
    const cleanPattern = (pattern || '').trim().toLowerCase();
    const results: string[] = [];
    const ignoredDirs = new Set(['node_modules', '.git', 'dist', 'dist-electron', 'release', '.orion_memory']);

    const walk = (dir: string) => {
      if (results.length >= maxResults) return;
      let list: fs.Dirent[] = [];
      try {
        list = fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const item of list) {
        if (results.length >= maxResults) break;
        if (ignoredDirs.has(item.name)) continue;
        const full = path.join(dir, item.name);
        const rel = path.relative(this.workspaceRoot, full);
        if (!cleanPattern || rel.toLowerCase().includes(cleanPattern)) {
          results.push(rel);
        }
        if (item.isDirectory()) {
          walk(full);
        }
      }
    };

    walk(this.workspaceRoot);
    return results;
  }

  public searchCode(
    query: string,
    maxResults = 40
  ): Array<{ filePath: string; lineNumber: number; lineContent: string }> {
    const cleanQuery = (query || '').trim();
    if (!cleanQuery) return [];
    const lowerQ = cleanQuery.toLowerCase();
    const matches: Array<{ filePath: string; lineNumber: number; lineContent: string }> = [];
    const ignoredDirs = new Set(['node_modules', '.git', 'dist', 'dist-electron', 'release', '.orion_memory']);
    const allowedExt = new Set(['.ts', '.tsx', '.js', '.cjs', '.mjs', '.json', '.md', '.css', '.html']);

    const walk = (dir: string) => {
      if (matches.length >= maxResults) return;
      let list: fs.Dirent[] = [];
      try {
        list = fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const item of list) {
        if (matches.length >= maxResults) break;
        if (ignoredDirs.has(item.name)) continue;
        const full = path.join(dir, item.name);
        if (item.isDirectory()) {
          walk(full);
        } else if (item.isFile() && allowedExt.has(path.extname(item.name).toLowerCase())) {
          try {
            const stat = fs.statSync(full);
            if (stat.size > 512 * 1024) continue;
            const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
            const rel = path.relative(this.workspaceRoot, full);
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].toLowerCase().includes(lowerQ)) {
                matches.push({
                  filePath: rel,
                  lineNumber: i + 1,
                  lineContent: UnifiedMemoryManager.sanitizeSecrets(lines[i].trim().slice(0, 160))
                });
                if (matches.length >= maxResults) break;
              }
            }
          } catch {}
        }
      }
    };

    walk(this.workspaceRoot);
    return matches;
  }

  public static computeLineDiffPreview(before: string | null, after: string, relativePath: string): string {
    const beforeLines = before === null ? [] : before.split(/\r?\n/);
    const afterLines = after.split(/\r?\n/);
    const lines: string[] = [`--- a/${relativePath}`, `+++ b/${relativePath}`];

    const maxLines = Math.max(beforeLines.length, afterLines.length);
    let shown = 0;
    for (let i = 0; i < maxLines && shown < 24; i++) {
      const b = beforeLines[i];
      const a = afterLines[i];
      if (b === a) continue;
      if (b !== undefined) {
        lines.push(`-${b}`);
        shown++;
      }
      if (a !== undefined) {
        lines.push(`+${a}`);
        shown++;
      }
    }
    return lines.join('\n');
  }

  public writeFileAtomic(
    filePath: string,
    content: string,
    options: {
      expectedSha256?: string;
      checkpointId?: string;
      sessionId?: string;
      taskId?: string;
    } = {}
  ): AtomicWriteOutcome {
    const check = this.resolveAndValidatePath(filePath, 'WRITE');
    if (!check.valid) {
      return {
        success: false,
        filePath: check.resolvedPath,
        relativePath: check.relativePath,
        beforeSha256: null,
        afterSha256: '',
        bytesWritten: 0,
        checkpointId: options.checkpointId || '',
        changeId: '',
        diffPreview: '',
        error: check.error,
        errorCode: 'PATH_VIOLATION'
      };
    }

    const existedBefore = fs.existsSync(check.resolvedPath);
    let beforeContent: string | null = null;
    let beforeSha256: string | null = null;

    if (existedBefore) {
      beforeContent = fs.readFileSync(check.resolvedPath, 'utf8');
      beforeSha256 = AtomicFileEngine.sha256(beforeContent);

      if (options.expectedSha256 && options.expectedSha256 !== beforeSha256) {
        return {
          success: false,
          filePath: check.resolvedPath,
          relativePath: check.relativePath,
          beforeSha256,
          afterSha256: beforeSha256,
          bytesWritten: 0,
          checkpointId: options.checkpointId || '',
          changeId: '',
          diffPreview: '',
          error: `CONFLICT_DETECTED: File '${check.relativePath}' was modified externally (expected SHA-256 ${options.expectedSha256.slice(0, 12)}, found ${beforeSha256.slice(0, 12)}). Refusing to overwrite user changes.`,
          errorCode: 'CONFLICT_DETECTED'
        };
      }
    } else if (options.expectedSha256) {
      return {
        success: false,
        filePath: check.resolvedPath,
        relativePath: check.relativePath,
        beforeSha256: null,
        afterSha256: '',
        bytesWritten: 0,
        checkpointId: options.checkpointId || '',
        changeId: '',
        diffPreview: '',
        error: `CONFLICT_DETECTED: Expected existing file with hash ${options.expectedSha256.slice(0, 12)}, but file does not exist.`,
        errorCode: 'CONFLICT_DETECTED'
      };
    }

    const parentDir = path.dirname(check.resolvedPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    const tmpPath = `${check.resolvedPath}.orion-tmp-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    try {
      fs.writeFileSync(tmpPath, content, { encoding: 'utf8' });
      fs.renameSync(tmpPath, check.resolvedPath);
    } catch (err: any) {
      try {
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
      } catch {}
      return {
        success: false,
        filePath: check.resolvedPath,
        relativePath: check.relativePath,
        beforeSha256,
        afterSha256: '',
        bytesWritten: 0,
        checkpointId: options.checkpointId || '',
        changeId: '',
        diffPreview: '',
        error: `IO_ERROR: Failed atomic write to '${check.relativePath}': ${err?.message || String(err)}`,
        errorCode: 'IO_ERROR'
      };
    }

    const afterSha256 = AtomicFileEngine.sha256(content);
    const checkpointId = options.checkpointId || `cp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const changeId = `chg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const diffPreview = AtomicFileEngine.computeLineDiffPreview(beforeContent, content, check.relativePath);

    this.journal.push({
      changeId,
      checkpointId,
      filePath: check.resolvedPath,
      relativePath: check.relativePath,
      existedBefore,
      beforeContent,
      afterContent: content,
      beforeSha256,
      afterSha256,
      timestamp: Date.now(),
      sessionId: options.sessionId || 'default',
      taskId: options.taskId || 'manual',
      undone: false
    });
    this.saveJournal();

    return {
      success: true,
      filePath: check.resolvedPath,
      relativePath: check.relativePath,
      beforeSha256,
      afterSha256,
      bytesWritten: Buffer.byteLength(content, 'utf8'),
      checkpointId,
      changeId,
      diffPreview
    };
  }

  public replaceStringAtomic(
    filePath: string,
    target: string,
    replacement: string,
    options: {
      expectedMatches?: number;
      expectedSha256?: string;
      checkpointId?: string;
      sessionId?: string;
      taskId?: string;
    } = {}
  ): AtomicWriteOutcome {
    const check = this.resolveAndValidatePath(filePath, 'WRITE');
    if (!check.valid) {
      return {
        success: false,
        filePath: check.resolvedPath,
        relativePath: check.relativePath,
        beforeSha256: null,
        afterSha256: '',
        bytesWritten: 0,
        checkpointId: options.checkpointId || '',
        changeId: '',
        diffPreview: '',
        error: check.error,
        errorCode: 'PATH_VIOLATION'
      };
    }

    if (!fs.existsSync(check.resolvedPath)) {
      return {
        success: false,
        filePath: check.resolvedPath,
        relativePath: check.relativePath,
        beforeSha256: null,
        afterSha256: '',
        bytesWritten: 0,
        checkpointId: options.checkpointId || '',
        changeId: '',
        diffPreview: '',
        error: `ENOENT: File '${check.relativePath}' does not exist.`,
        errorCode: 'ENOENT'
      };
    }

    const currentContent = fs.readFileSync(check.resolvedPath, 'utf8');
    const currentHash = AtomicFileEngine.sha256(currentContent);

    if (options.expectedSha256 && options.expectedSha256 !== currentHash) {
      return {
        success: false,
        filePath: check.resolvedPath,
        relativePath: check.relativePath,
        beforeSha256: currentHash,
        afterSha256: currentHash,
        bytesWritten: 0,
        checkpointId: options.checkpointId || '',
        changeId: '',
        diffPreview: '',
        error: `CONFLICT_DETECTED: File '${check.relativePath}' changed unexpectedly (expected SHA-256 ${options.expectedSha256.slice(0, 12)}, actual ${currentHash.slice(0, 12)}).`,
        errorCode: 'CONFLICT_DETECTED'
      };
    }

    if (!target) {
      return {
        success: false,
        filePath: check.resolvedPath,
        relativePath: check.relativePath,
        beforeSha256: currentHash,
        afterSha256: currentHash,
        bytesWritten: 0,
        checkpointId: options.checkpointId || '',
        changeId: '',
        diffPreview: '',
        error: `MISMATCH_COUNT: Target string for replacement cannot be empty.`,
        errorCode: 'MISMATCH_COUNT'
      };
    }

    const parts = currentContent.split(target);
    const actualMatches = parts.length - 1;
    const expectedMatches = options.expectedMatches ?? 1;

    if (actualMatches === 0 || actualMatches !== expectedMatches) {
      return {
        success: false,
        filePath: check.resolvedPath,
        relativePath: check.relativePath,
        beforeSha256: currentHash,
        afterSha256: currentHash,
        bytesWritten: 0,
        checkpointId: options.checkpointId || '',
        changeId: '',
        diffPreview: '',
        error: `MISMATCH_COUNT: Expected ${expectedMatches} occurrence(s) of target string in '${check.relativePath}', but found ${actualMatches}.`,
        errorCode: 'MISMATCH_COUNT'
      };
    }

    const updatedContent = parts.join(replacement);
    return this.writeFileAtomic(filePath, updatedContent, {
      expectedSha256: currentHash,
      checkpointId: options.checkpointId,
      sessionId: options.sessionId,
      taskId: options.taskId
    });
  }

  public applyPatchAtomic(
    filePath: string,
    hunks: Array<{ target: string; replacement: string }>,
    options: {
      expectedSha256?: string;
      checkpointId?: string;
      sessionId?: string;
      taskId?: string;
    } = {}
  ): AtomicWriteOutcome {
    const check = this.resolveAndValidatePath(filePath, 'WRITE');
    if (!check.valid) {
      return {
        success: false,
        filePath: check.resolvedPath,
        relativePath: check.relativePath,
        beforeSha256: null,
        afterSha256: '',
        bytesWritten: 0,
        checkpointId: options.checkpointId || '',
        changeId: '',
        diffPreview: '',
        error: check.error,
        errorCode: 'PATH_VIOLATION'
      };
    }

    if (!fs.existsSync(check.resolvedPath)) {
      return {
        success: false,
        filePath: check.resolvedPath,
        relativePath: check.relativePath,
        beforeSha256: null,
        afterSha256: '',
        bytesWritten: 0,
        checkpointId: options.checkpointId || '',
        changeId: '',
        diffPreview: '',
        error: `ENOENT: File '${check.relativePath}' does not exist.`,
        errorCode: 'ENOENT'
      };
    }

    let working = fs.readFileSync(check.resolvedPath, 'utf8');
    const initialHash = AtomicFileEngine.sha256(working);
    if (options.expectedSha256 && options.expectedSha256 !== initialHash) {
      return {
        success: false,
        filePath: check.resolvedPath,
        relativePath: check.relativePath,
        beforeSha256: initialHash,
        afterSha256: initialHash,
        bytesWritten: 0,
        checkpointId: options.checkpointId || '',
        changeId: '',
        diffPreview: '',
        error: `CONFLICT_DETECTED: File '${check.relativePath}' hash mismatch before applying patch.`,
        errorCode: 'CONFLICT_DETECTED'
      };
    }

    for (let i = 0; i < hunks.length; i++) {
      const h = hunks[i];
      if (!h || !h.target || !working.includes(h.target)) {
        return {
          success: false,
          filePath: check.resolvedPath,
          relativePath: check.relativePath,
          beforeSha256: initialHash,
          afterSha256: initialHash,
          bytesWritten: 0,
          checkpointId: options.checkpointId || '',
          changeId: '',
          diffPreview: '',
          error: `MISMATCH_COUNT: Patch hunk #${i + 1} target not found in '${check.relativePath}'.`,
          errorCode: 'MISMATCH_COUNT'
        };
      }
      working = working.replace(h.target, h.replacement);
    }

    return this.writeFileAtomic(filePath, working, {
      expectedSha256: initialHash,
      checkpointId: options.checkpointId,
      sessionId: options.sessionId,
      taskId: options.taskId
    });
  }
}
