import fs from 'fs';
import path from 'path';
import { AtomicFileEngine } from './AtomicFileEngine';
import { CheckpointService } from './CheckpointService';
import { UnifiedMemoryManager } from '../main/services/UnifiedMemoryManager';

export interface AttachedContextItem {
  id: string;
  relativePath: string;
  resolvedPath: string;
  type: 'FILE' | 'DIRECTORY';
  byteSize: number;
  estimatedTokens: number;
  sha256?: string;
  contentPreview: string;
  attachedAt: number;
}

export interface AgentMdStatus {
  found: boolean;
  filePath: string;
  relativePath: string;
  content: string;
  sha256?: string;
}

/**
 * Workspace Service (Sections 6, 8, 12, 13).
 * - Manages `AGENT.md` / `AGENTS.md` discovery and `/init` project analysis.
 * - Manages `@file` / `/attach` searchable file and directory context attachment with
 *   path containment validation and context-size caps.
 * - Coordinates with `AtomicFileEngine` and `CheckpointService`.
 */
export class WorkspaceService {
  private readonly workspaceRoot: string;
  private readonly fileEngine: AtomicFileEngine;
  private readonly checkpointService: CheckpointService;
  private attachedItems: Map<string, AttachedContextItem> = new Map();
  private readonly maxAttachedCharsPerFile: number;
  private readonly maxTotalAttachedChars: number;

  constructor(options: {
    workspaceRoot?: string;
    fileEngine?: AtomicFileEngine;
    checkpointService?: CheckpointService;
    maxAttachedCharsPerFile?: number;
    maxTotalAttachedChars?: number;
  } = {}) {
    this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
    this.fileEngine = options.fileEngine || new AtomicFileEngine(this.workspaceRoot);
    this.checkpointService =
      options.checkpointService ||
      new CheckpointService({ workspaceRoot: this.workspaceRoot, fileEngine: this.fileEngine });
    this.maxAttachedCharsPerFile = options.maxAttachedCharsPerFile ?? 16_000;
    this.maxTotalAttachedChars = options.maxTotalAttachedChars ?? 64_000;
  }

  public getWorkspaceRoot(): string {
    return this.workspaceRoot;
  }

  public getFileEngine(): AtomicFileEngine {
    return this.fileEngine;
  }

  public getCheckpointService(): CheckpointService {
    return this.checkpointService;
  }

  /**
   * Inspects `AGENT.md` (or `AGENTS.md`) in the workspace root.
   */
  public getAgentMd(): AgentMdStatus {
    const candidates = ['AGENT.md', 'AGENTS.md'];
    for (const name of candidates) {
      const candidatePath = path.join(this.workspaceRoot, name);
      if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
        const raw = fs.readFileSync(candidatePath, 'utf8');
        return {
          found: true,
          filePath: candidatePath,
          relativePath: name,
          content: UnifiedMemoryManager.sanitizeSecrets(raw),
          sha256: AtomicFileEngine.sha256(raw)
        };
      }
    }

    return {
      found: false,
      filePath: path.join(this.workspaceRoot, 'AGENT.md'),
      relativePath: 'AGENT.md',
      content: ''
    };
  }

  /**
   * Analyzes the project structure (`package.json`, `tsconfig.json`, directories, test runners)
   * and creates or updates `AGENT.md` via `AtomicFileEngine` (only after operator confirmation when mutating).
   */
  public generateAgentMdContent(): {
    projectName: string;
    detectedStack: string[];
    scripts: Record<string, string>;
    keyDirectories: string[];
    markdown: string;
  } {
    let projectName = path.basename(this.workspaceRoot);
    let scripts: Record<string, string> = {};
    const detectedStack: string[] = [];

    const pkgPath = path.join(this.workspaceRoot, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.name) projectName = String(pkg.name);
        if (pkg.scripts && typeof pkg.scripts === 'object') {
          scripts = pkg.scripts;
        }
        const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
        if (deps.typescript) detectedStack.push('TypeScript');
        if (deps.react) detectedStack.push('React');
        if (deps.ink) detectedStack.push('Ink TUI');
        if (deps.electron) detectedStack.push('Electron');
        if (deps.vite) detectedStack.push('Vite');
        if (deps.playwright) detectedStack.push('Playwright');
      } catch {}
    }

    const topDirs = ['src', 'src/cli', 'src/tui', 'src/harness', 'src/main', 'src/renderer', 'src/shared', 'bin', 'docs'];
    const keyDirectories = topDirs.filter(d => {
      const full = path.join(this.workspaceRoot, d);
      return fs.existsSync(full) && fs.statSync(full).isDirectory();
    });

    const scriptLines = Object.entries(scripts)
      .slice(0, 12)
      .map(([k, v]) => `- \`npm run ${k}\`: \`${v}\``)
      .join('\n');

    const markdown = [
      `# AGENT.md — ${projectName} Engineering Guide`,
      ``,
      `## Project Overview`,
      `- **Workspace Root:** \`${this.workspaceRoot}\``,
      `- **Detected Stack:** ${detectedStack.length > 0 ? detectedStack.join(', ') : 'Node.js / TypeScript'}`,
      `- **Key Directories:** ${keyDirectories.map(d => `\`${d}\``).join(', ') || '`.`'}`,
      ``,
      `## Build & Verification Commands`,
      scriptLines || `- \`node run_suites.cjs\`\n- \`npx tsc --noEmit\``,
      ``,
      `## Architectural & Safety Rules`,
      `1. **Permission Enforcement:** Route all tool calls through \`PermissionGate\`, \`SecurityPolicyMiddleware\`, and \`AgentPolicyService\`.`,
      `2. **Atomic File Operations:** Use \`AtomicFileEngine\` for workspace-contained reads, atomic writes, and conflict-checked edits.`,
      `3. **Non-Destructive Git:** Never run \`git reset --hard\` or \`git clean -fd\`. Preserve uncommitted user changes.`,
      `4. **Secret Protection:** Never read, print, or commit \`.env\` files, API keys, or private credentials.`,
      ``
    ].join('\n');

    return {
      projectName,
      detectedStack,
      scripts,
      keyDirectories,
      markdown
    };
  }

  public initAgentMd(options: { overwrite?: boolean; sessionId?: string } = {}): {
    success: boolean;
    created: boolean;
    updated: boolean;
    filePath: string;
    diffPreview?: string;
    error?: string;
  } {
    const targetPath = path.join(this.workspaceRoot, 'AGENT.md');
    const exists = fs.existsSync(targetPath);
    const analysis = this.generateAgentMdContent();

    if (exists && !options.overwrite) {
      return {
        success: true,
        created: false,
        updated: false,
        filePath: targetPath,
        diffPreview: AtomicFileEngine.computeLineDiffPreview(
          fs.readFileSync(targetPath, 'utf8'),
          analysis.markdown,
          'AGENT.md'
        )
      };
    }

    const writeRes = this.fileEngine.writeFileAtomic('AGENT.md', analysis.markdown, {
      sessionId: options.sessionId || 'init'
    });

    if (!writeRes.success) {
      return {
        success: false,
        created: false,
        updated: false,
        filePath: targetPath,
        error: writeRes.error
      };
    }

    return {
      success: true,
      created: !exists,
      updated: exists,
      filePath: writeRes.filePath,
      diffPreview: writeRes.diffPreview
    };
  }

  /**
   * Attaches a workspace file or directory to the active context after validating path containment.
   */
  public attachPath(candidatePath: string): {
    success: boolean;
    item?: AttachedContextItem;
    error?: string;
  } {
    const cleanInput = String(candidatePath || '').trim().replace(/^@/, '');
    const check = this.fileEngine.resolveAndValidatePath(cleanInput, 'READ');
    if (!check.valid) {
      return { success: false, error: check.error };
    }

    if (!fs.existsSync(check.resolvedPath)) {
      return {
        success: false,
        error: `Cannot attach "${cleanInput}": file or directory does not exist.`
      };
    }

    const stat = fs.statSync(check.resolvedPath);
    let currentTotalChars = 0;
    for (const existing of this.attachedItems.values()) {
      if (existing.relativePath !== check.relativePath) {
        currentTotalChars += existing.contentPreview.length;
      }
    }

    if (stat.isDirectory()) {
      const listing = this.fileEngine.listDirectory(check.relativePath);
      if (!listing.success) {
        return { success: false, error: listing.error };
      }
      const preview = listing.entries
        .map(e => `${e.type === 'directory' ? '[DIR] ' : '      '}${e.name}`)
        .join('\n')
        .slice(0, this.maxAttachedCharsPerFile);

      if (currentTotalChars + preview.length > this.maxTotalAttachedChars) {
        return {
          success: false,
          error: `Context attachment limit reached (${this.maxTotalAttachedChars} chars max). Clear or detach items first.`
        };
      }

      const item: AttachedContextItem = {
        id: `att_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        relativePath: check.relativePath || '.',
        resolvedPath: check.resolvedPath,
        type: 'DIRECTORY',
        byteSize: Buffer.byteLength(preview, 'utf8'),
        estimatedTokens: Math.ceil(preview.length / 4),
        contentPreview: preview,
        attachedAt: Date.now()
      };
      this.attachedItems.set(item.relativePath, item);
      return { success: true, item };
    }

    const readRes = this.fileEngine.readFile(check.relativePath, { maxBytes: this.maxAttachedCharsPerFile * 2 });
    if (!readRes.success) {
      return { success: false, error: readRes.error };
    }

    const preview = readRes.content.slice(0, this.maxAttachedCharsPerFile);
    if (currentTotalChars + preview.length > this.maxTotalAttachedChars) {
      return {
        success: false,
        error: `Context attachment limit reached (${this.maxTotalAttachedChars} chars max).`
      };
    }

    const item: AttachedContextItem = {
      id: `att_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      relativePath: check.relativePath,
      resolvedPath: check.resolvedPath,
      type: 'FILE',
      byteSize: readRes.sizeBytes,
      estimatedTokens: Math.ceil(preview.length / 4),
      sha256: readRes.sha256,
      contentPreview: preview,
      attachedAt: Date.now()
    };

    this.attachedItems.set(item.relativePath, item);
    return { success: true, item };
  }

  public detachPath(relativePath: string): boolean {
    const clean = relativePath.trim().replace(/^@/, '');
    return this.attachedItems.delete(clean);
  }

  public clearAttachments(): void {
    this.attachedItems.clear();
  }

  public listAttachments(): AttachedContextItem[] {
    return Array.from(this.attachedItems.values());
  }

  public searchAttachableFiles(query: string, limit: number = 15): string[] {
    const pattern = query ? query.replace(/^@/, '') : '';
    return this.fileEngine.searchFiles(pattern, limit);
  }
}
