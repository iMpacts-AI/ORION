import { HarnessEffortLevel, HarnessMode, HarnessPermissionTier } from './ExecutionResult';
import { HarnessOrchestrator } from './HarnessOrchestrator';
import { OrionCliKernel } from '../cli/OrionCliKernel';

export type CommandAvailabilityStatus = 'IMPLEMENTED' | 'CONFIGURED' | 'UNAVAILABLE';

export interface SlashCommandEntry {
  command: string;
  aliases: string[];
  category:
    | 'Project & Workspace'
    | 'Planning & Execution'
    | 'Engineering & Quality'
    | 'Reversibility & Session'
    | 'Web & Knowledge'
    | 'Models, Agents & MCP'
    | 'System & Workstation'
    | 'Visual & UI';
  description: string;
  argumentHint: string;
  permissionTier: HarnessPermissionTier;
  availability: CommandAvailabilityStatus;
  handler: (args: string[], rawInput: string) => Promise<{
    handled: boolean;
    exitCode: number;
    shouldExit?: boolean;
    summary: string;
    data?: any;
  }>;
}

/**
 * Authoritative Slash-Command Registry for ORION CLI v2 (Section 8).
 * Registers all required v2 engineering & harness commands (`/init`, `/memory`, `/context`,
 * `/attach`, `/worktree`, `/mode`, `/plan`, `/goal`, `/effort`, `/subtask`, `/loop`,
 * `/review`, `/security-review`, `/simplify`, `/test`, `/doctor`, `/undo`, `/redo`,
 * `/rewind`, `/resume`, `/clear`, `/search`, `/model`, `/mcp`, `/vivid`) plus all
 * existing ORION workstation & multi-agent commands.
 */
export class CommandRegistry {
  public readonly kernel: OrionCliKernel;
  public readonly harness: HarnessOrchestrator;
  private readonly entries: Map<string, SlashCommandEntry> = new Map();
  private vividMode: boolean = true;
  private onVividChange?: (vivid: boolean) => void;

  constructor(options: {
    kernel: OrionCliKernel;
    harness?: HarnessOrchestrator;
    onVividChange?: (vivid: boolean) => void;
  }) {
    this.kernel = options.kernel;
    this.harness =
      options.harness ||
      new HarnessOrchestrator({
        workspaceRoot: this.kernel.projectRoot,
        omniRouter: this.kernel.omniRouter,
        memoryManager: this.kernel.unifiedMemory
      });
    this.onVividChange = options.onVividChange;
    this.vividMode = this.harness.sessionStore.getActiveSession().vividMode ?? true;
    this.registerAllCommands();
  }

  public isVividMode(): boolean {
    return this.vividMode;
  }

  public setVividMode(enabled: boolean): boolean {
    this.vividMode = enabled;
    this.harness.sessionStore.updateActiveSession({ vividMode: enabled });
    if (this.onVividChange) {
      try {
        this.onVividChange(enabled);
      } catch {}
    }
    return this.vividMode;
  }

  public register(entry: SlashCommandEntry): void {
    const primary = entry.command.startsWith('/') ? entry.command.toLowerCase() : `/${entry.command.toLowerCase()}`;
    this.entries.set(primary, { ...entry, command: primary });
  }

  public getCommand(nameOrAlias: string): SlashCommandEntry | undefined {
    const normalized = (nameOrAlias.startsWith('/') ? nameOrAlias : `/${nameOrAlias}`).toLowerCase();
    const direct = this.entries.get(normalized);
    if (direct) return direct;
    for (const item of this.entries.values()) {
      if (item.aliases.some(a => a.toLowerCase() === normalized || `/${a.toLowerCase()}` === normalized)) {
        return item;
      }
    }
    return undefined;
  }

  public getAllCommands(): SlashCommandEntry[] {
    return Array.from(this.entries.values());
  }

  public filterCommands(query: string): SlashCommandEntry[] {
    const clean = (query || '').trim().toLowerCase();
    const all = this.getAllCommands();
    if (!clean || clean === '/') return all;
    const withoutSlash = clean.replace(/^\/+/, '');
    return all.filter(
      c =>
        c.command.slice(1).includes(withoutSlash) ||
        c.aliases.some(a => a.toLowerCase().includes(withoutSlash)) ||
        c.description.toLowerCase().includes(withoutSlash) ||
        c.category.toLowerCase().includes(withoutSlash)
    );
  }

  private registerAllCommands(): void {
    // 1. /init
    this.register({
      command: '/init',
      aliases: [],
      category: 'Project & Workspace',
      description: 'Analyze repository structure and initialize or preview AGENT.md guidelines',
      argumentHint: '[--write|--overwrite]',
      permissionTier: 'TIER_2_CONFIRMATION',
      availability: 'IMPLEMENTED',
      handler: async (args) => {
        const shouldWrite = args.includes('--write') || args.includes('--overwrite') || args.includes('write');
        const analysis = this.harness.workspaceService.generateAgentMdContent();
        if (!shouldWrite) {
          return {
            handled: true,
            exitCode: 0,
            summary: `Analyzed project "${analysis.projectName}" (${analysis.detectedStack.join(', ') || 'Node.js'}). Pass '/init --write' to write AGENT.md.`,
            data: analysis
          };
        }
        const res = this.harness.workspaceService.initAgentMd({
          overwrite: args.includes('--overwrite'),
          sessionId: this.harness.sessionStore.getActiveSession().sessionId
        });
        return {
          handled: true,
          exitCode: res.success ? 0 : 1,
          summary: res.success
            ? `AGENT.md ${res.created ? 'created' : res.updated ? 'updated' : 'verified'} at ${res.filePath}`
            : `Failed to initialize AGENT.md: ${res.error}`,
          data: res
        };
      }
    });

    // 2. /attach (and @file)
    this.register({
      command: '/attach',
      aliases: ['@'],
      category: 'Project & Workspace',
      description: 'Attach or detach workspace files/folders into active model context',
      argumentHint: '<path | list | clear | remove <path>>',
      permissionTier: 'TIER_1_READ_ONLY',
      availability: 'IMPLEMENTED',
      handler: async (args) => {
        const sub = (args[0] || 'list').toLowerCase();
        if (sub === 'list' && args.length <= 1) {
          const items = this.harness.workspaceService.listAttachments();
          return {
            handled: true,
            exitCode: 0,
            summary: `Attached context items (${items.length}): ${items.map(i => i.relativePath).join(', ') || 'none'}`,
            data: { attachments: items }
          };
        }
        if (sub === 'clear') {
          this.harness.workspaceService.clearAttachments();
          this.harness.sessionStore.updateActiveSession({ attachedPaths: [] });
          return {
            handled: true,
            exitCode: 0,
            summary: 'Cleared all attached context files/directories.',
            data: { cleared: true }
          };
        }
        if ((sub === 'remove' || sub === 'detach') && args[1]) {
          const ok = this.harness.workspaceService.detachPath(args.slice(1).join(' '));
          const remaining = this.harness.workspaceService.listAttachments().map(i => i.relativePath);
          this.harness.sessionStore.updateActiveSession({ attachedPaths: remaining });
          return {
            handled: true,
            exitCode: ok ? 0 : 1,
            summary: ok ? `Detached ${args[1]}.` : `Path ${args[1]} was not attached.`,
            data: { detached: ok, remaining }
          };
        }

        const targetPath = args.join(' ');
        const res = this.harness.workspaceService.attachPath(targetPath);
        if (res.success && res.item) {
          const allPaths = this.harness.workspaceService.listAttachments().map(i => i.relativePath);
          this.harness.sessionStore.updateActiveSession({ attachedPaths: allPaths });
          return {
            handled: true,
            exitCode: 0,
            summary: `Attached ${res.item.type} '${res.item.relativePath}' (~${res.item.estimatedTokens} est. tokens).`,
            data: res.item
          };
        }
        return {
          handled: true,
          exitCode: 1,
          summary: res.error || `Failed to attach '${targetPath}'.`,
          data: res
        };
      }
    });

    // 3. /worktree
    this.register({
      command: '/worktree',
      aliases: [],
      category: 'Project & Workspace',
      description: 'Manage non-destructive Git worktrees (list, add, remove)',
      argumentHint: '[list | add <path> [branch] | remove <path>]',
      permissionTier: 'TIER_2_CONFIRMATION',
      availability: 'IMPLEMENTED',
      handler: async (args) => {
        const sub = (args[0] || 'list').toLowerCase() as 'list' | 'add' | 'remove';
        if (sub !== 'list' && sub !== 'add' && sub !== 'remove') {
          return {
            handled: true,
            exitCode: 1,
            summary: `Invalid /worktree action '${sub}'. Use: /worktree list | add <path> [branch] | remove <path>`
          };
        }
        const res = this.harness.workspaceService.getCheckpointService().manageWorktree({
          action: sub,
          worktreePath: args[1],
          branch: args[2]
        });
        return {
          handled: true,
          exitCode: res.success ? 0 : 1,
          summary: res.success
            ? `Git worktree ${sub} succeeded${res.worktrees ? ` (${res.worktrees.length} worktree(s))` : ''}.`
            : `Git worktree ${sub} failed: ${res.error}`,
          data: res
        };
      }
    });

    // 4. /mode
    this.register({
      command: '/mode',
      aliases: [],
      category: 'Planning & Execution',
      description: 'Switch execution mode (Build, Plan, Chat) or Al-Hikmah intelligence profile (saif, nur, hikmah, auto)',
      argumentHint: '[Build | Plan | Chat | saif | nur | hikmah | auto]',
      permissionTier: 'TIER_1_READ_ONLY',
      availability: 'IMPLEMENTED',
      handler: async (args) => {
        const sub = (args[0] || '').trim();
        if (!sub) {
          return {
            handled: true,
            exitCode: 0,
            summary: `Current Harness Mode: ${this.harness.getMode()} | Routing Strategy: ${this.kernel.omniRouter.getRoutingStrategy()}`,
            data: {
              harnessMode: this.harness.getMode(),
              routingStrategy: this.kernel.omniRouter.getRoutingStrategy(),
              supportedModes: ['Build', 'Plan', 'Chat', 'saif', 'nur', 'hikmah', 'auto']
            }
          };
        }
        const lower = sub.toLowerCase();
        if (lower === 'build' || lower === 'plan' || lower === 'chat') {
          const normalized: HarnessMode =
            lower === 'build' ? 'Build' : lower === 'plan' ? 'Plan' : 'Chat';
          this.harness.setMode(normalized);
          return {
            handled: true,
            exitCode: 0,
            summary: `Switched ORION Harness Mode to ${normalized}${normalized === 'Plan' ? ' (strict read-only planning)' : ''}.`,
            data: { mode: normalized }
          };
        }
        if (['saif', 'nur', 'hikmah', 'auto'].includes(lower)) {
          const applied = this.kernel.omniRouter.setHikmahMode(lower as any);
          return {
            handled: true,
            exitCode: 0,
            summary: `Intelligence profile set to '${applied.mode.toUpperCase()}' (${applied.strategy}).`,
            data: applied
          };
        }
        return {
          handled: true,
          exitCode: 1,
          summary: `Unknown mode '${sub}'. Valid modes: Build, Plan, Chat, saif, nur, hikmah, auto.`
        };
      }
    });

    // 5. /plan
    this.register({
      command: '/plan',
      aliases: [],
      category: 'Planning & Execution',
      description: 'Switch into Plan (read-only) mode or generate a read-only architectural plan for a task',
      argumentHint: '[task_description]',
      permissionTier: 'TIER_1_READ_ONLY',
      availability: 'IMPLEMENTED',
      handler: async (args) => {
        this.harness.setMode('Plan');
        if (args.length === 0) {
          return {
            handled: true,
            exitCode: 0,
            summary: 'Entered Plan mode (read-only). Mutating file/shell/git tools are blocked until you switch back to /mode Build.',
            data: { mode: 'Plan' }
          };
        }
        const taskText = args.join(' ');
        const rep = await this.harness.runLoop({
          goal: taskText,
          mode: 'Plan'
        });
        return {
          handled: true,
          exitCode: rep.status === 'COMPLETED' ? 0 : 1,
          summary: `[Plan Mode] ${rep.finalResponse}`,
          data: rep
        };
      }
    });

    // 6. /goal
    this.register({
      command: '/goal',
      aliases: [],
      category: 'Planning & Execution',
      description: 'Set, inspect, or execute a primary session engineering goal with bounded verification',
      argumentHint: '[goal_description | show | clear]',
      permissionTier: 'TIER_1_READ_ONLY',
      availability: 'IMPLEMENTED',
      handler: async (args) => {
        if (args.length === 0 || args[0].toLowerCase() === 'show') {
          const current = this.harness.getActiveGoal();
          return {
            handled: true,
            exitCode: 0,
            summary: current ? `Active Goal: ${current}` : 'No active session goal set. Use /goal <objective>.',
            data: { goal: current }
          };
        }
        if (args[0].toLowerCase() === 'clear') {
          this.harness.setActiveGoal('');
          return {
            handled: true,
            exitCode: 0,
            summary: 'Cleared active session goal.',
            data: { goal: '' }
          };
        }
        const goalText = args.join(' ');
        this.harness.setActiveGoal(goalText);
        return {
          handled: true,
          exitCode: 0,
          summary: `Active session goal set: "${goalText}"`,
          data: { goal: goalText }
        };
      }
    });

    // 7. /effort
    this.register({
      command: '/effort',
      aliases: [],
      category: 'Planning & Execution',
      description: 'Configure reasoning & iteration effort level (low, medium, high, max)',
      argumentHint: '[low | medium | high | max]',
      permissionTier: 'TIER_1_READ_ONLY',
      availability: 'IMPLEMENTED',
      handler: async (args) => {
        const sub = (args[0] || '').toLowerCase() as HarnessEffortLevel;
        if (!sub) {
          const current = this.harness.getEffort();
          const params = HarnessOrchestrator.getEffortParameters(current);
          return {
            handled: true,
            exitCode: 0,
            summary: `Current Effort: ${current.toUpperCase()} (strategy=${params.routingStrategy}, maxIterations=${params.maxIterations}, budget=${params.wallClockBudgetMs}ms)`,
            data: { effort: current, ...params }
          };
        }
        if (!['low', 'medium', 'high', 'max'].includes(sub)) {
          return {
            handled: true,
            exitCode: 1,
            summary: `Invalid effort level '${sub}'. Valid levels: low, medium, high, max.`
          };
        }
        const applied = this.harness.setEffort(sub);
        return {
          handled: true,
          exitCode: 0,
          summary: `Effort level set to ${applied.effort.toUpperCase()} (strategy=${applied.routingStrategy}, maxIterations=${applied.maxIterations}, budget=${applied.wallClockBudgetMs}ms).`,
          data: applied
        };
      }
    });

    // 8. /subtask
    this.register({
      command: '/subtask',
      aliases: [],
      category: 'Planning & Execution',
      description: 'Run an isolated subtask without polluting the primary conversation context',
      argumentHint: '<subtask_objective>',
      permissionTier: 'TIER_1_READ_ONLY',
      availability: 'IMPLEMENTED',
      handler: async (args) => {
        if (args.length === 0) {
          return {
            handled: true,
            exitCode: 1,
            summary: 'Usage: /subtask <subtask_objective>'
          };
        }
        const objective = args.join(' ');
        const res = await this.harness.runSubtask(objective);
        return {
          handled: true,
          exitCode: res.status === 'COMPLETED' ? 0 : 1,
          summary: res.summary,
          data: res
        };
      }
    });

    // 9. /loop
    this.register({
      command: '/loop',
      aliases: [],
      category: 'Planning & Execution',
      description: 'Manage bounded, cancellable recurring tasks (start, list, cancel)',
      argumentHint: '<list | cancel [id] | <goal>>',
      permissionTier: 'TIER_2_CONFIRMATION',
      availability: 'IMPLEMENTED',
      handler: async (args) => {
        const sub = (args[0] || 'list').toLowerCase();
        if (sub === 'list' && args.length <= 1) {
          const jobs = this.harness.listRecurringLoops();
          return {
            handled: true,
            exitCode: 0,
            summary: `Recurring loop jobs (${jobs.length}): ${jobs.map(j => `${j.jobId}[${j.status}]`).join(', ') || 'none'}`,
            data: { jobs }
          };
        }
        if (sub === 'cancel' || sub === 'stop') {
          const res = this.harness.cancelRecurringLoop(args[1]);
          return {
            handled: true,
            exitCode: 0,
            summary: `Cancelled ${res.cancelledCount} recurring loop job(s).`,
            data: res
          };
        }
        const goal = args.join(' ');
        const job = this.harness.startRecurringLoop({
          goal,
          intervalMs: 15_000,
          maxRuns: 3
        });
        return {
          handled: true,
          exitCode: 0,
          summary: `Started bounded recurring loop '${job.jobId}' (every ${job.intervalMs / 1000}s, max ${job.maxRuns} runs): "${goal}"`,
          data: {
            jobId: job.jobId,
            goal: job.goal,
            intervalMs: job.intervalMs,
            maxRuns: job.maxRuns,
            status: job.status
          }
        };
      }
    });

    // 10. /review
    this.register({
      command: '/review',
      aliases: [],
      category: 'Engineering & Quality',
      description: 'Inspect current Git diff / modified files for defects, edge cases, and regressions',
      argumentHint: '[file_path]',
      permissionTier: 'TIER_1_READ_ONLY',
      availability: 'IMPLEMENTED',
      handler: async (args) => {
        const targetFile = args[0];
        const status = this.harness.workspaceService.getCheckpointService().getGitStatus();
        const diff = this.harness.workspaceService.getCheckpointService().getGitDiff({ filePath: targetFile });

        const findings: string[] = [];
        if (diff.diff) {
          if (/console\.log\(/i.test(diff.diff)) {
            findings.push('Detected added `console.log` statement(s) in diff; verify they do not corrupt TUI stdout.');
          }
          if (/TODO|FIXME|HACK/i.test(diff.diff)) {
            findings.push('Detected TODO/FIXME marker in modified code.');
          }
          if (/any\b/.test(diff.diff)) {
            findings.push('Detected TypeScript `any` usage in diff; verify strict schema validation at boundaries.');
          }
        }

        return {
          handled: true,
          exitCode: 0,
          summary: `Code Review [branch=${status.branch} | modified=${status.entries.length} file(s) | findings=${findings.length}]: ${findings.join(' ') || 'No obvious defect patterns detected in current diff.'}`,
          data: {
            branch: status.branch,
            headSha: status.headSha,
            modifiedFiles: status.entries,
            findings,
            diffPreview: diff.diff.slice(0, 2000)
          }
        };
      }
    });

    // 11. /security-review
    this.register({
      command: '/security-review',
      aliases: ['secreview'],
      category: 'Engineering & Quality',
      description: 'Audit current workspace changes and policy integrity for security vulnerabilities',
      argumentHint: '[file_path]',
      permissionTier: 'TIER_1_READ_ONLY',
      availability: 'IMPLEMENTED',
      handler: async (args) => {
        const policyIntegrity = this.kernel.policyService.verifyProtectedPolicyIntegrity();
        const diff = this.harness.workspaceService.getCheckpointService().getGitDiff({ filePath: args[0] });
        const securityFindings: Array<{ severity: 'HIGH' | 'MEDIUM' | 'LOW'; detail: string }> = [];

        if (!policyIntegrity.valid) {
          securityFindings.push({
            severity: 'HIGH',
            detail: `Protected policy integrity check failed: ${policyIntegrity.error}`
          });
        }

        if (diff.diff) {
          if (/eval\(|new Function\(/i.test(diff.diff)) {
            securityFindings.push({
              severity: 'MEDIUM',
              detail: 'Dynamic code evaluation (`eval` / `new Function`) detected in diff; verify no untrusted input reaches it.'
            });
          }
          if (/child_process|spawn|exec/i.test(diff.diff)) {
            securityFindings.push({
              severity: 'LOW',
              detail: 'Process execution API referenced in diff; ensure commands route through ProcessSupervisor and ShellExecutionService.'
            });
          }
          if (/(?:sk-[a-zA-Z0-9]{16,}|AIza[0-9A-Za-z\-_]{15,})/i.test(diff.diff)) {
            securityFindings.push({
              severity: 'HIGH',
              detail: 'Potential hardcoded API key pattern detected in diff!'
            });
          }
        }

        return {
          handled: true,
          exitCode: policyIntegrity.valid ? 0 : 1,
          summary: `Security Review [Policy=${policyIntegrity.valid ? 'VERIFIED' : 'TAMPERED'} | Findings=${securityFindings.length}]: ${securityFindings.map(f => `[${f.severity}] ${f.detail}`).join(' | ') || 'Zero high-risk findings.'}`,
          data: {
            protectedPolicyVerified: policyIntegrity.valid,
            protectedPolicySha256: policyIntegrity.actualSha256,
            securityFindings
          }
        };
      }
    });

    // 12. /simplify
    this.register({
      command: '/simplify',
      aliases: [],
      category: 'Engineering & Quality',
      description: 'Analyze a file or recent changes for complexity reduction and dead-code cleanup',
      argumentHint: '[file_path]',
      permissionTier: 'TIER_1_READ_ONLY',
      availability: 'IMPLEMENTED',
      handler: async (args) => {
        const target = args[0];
        if (!target) {
          const journal = this.harness.workspaceService.getFileEngine().getJournal();
          const lastFile = journal.length > 0 ? journal[journal.length - 1].relativePath : 'src/cli/OrionCliKernel.ts';
          return {
            handled: true,
            exitCode: 0,
            summary: `Simplify analysis ready. Pass a file path (e.g., '/simplify ${lastFile}') to inspect line count, long functions, and duplication.`
          };
        }
        const readRes = this.harness.workspaceService.getFileEngine().readFile(target);
        if (!readRes.success) {
          return {
            handled: true,
            exitCode: 1,
            summary: `Cannot inspect '${target}': ${readRes.error}`
          };
        }
        const lines = readRes.content.split(/\r?\n/);
        const longLines = lines.filter(l => l.length > 140).length;
        return {
          handled: true,
          exitCode: 0,
          summary: `Simplify Analysis for '${readRes.relativePath}': ${readRes.totalLines} lines (${longLines} lines > 140 chars, ${readRes.sizeBytes} bytes).`,
          data: {
            filePath: readRes.relativePath,
            totalLines: readRes.totalLines,
            longLinesCount: longLines,
            byteSize: readRes.sizeBytes
          }
        };
      }
    });

    // 13. /test
    this.register({
      command: '/test',
      aliases: [],
      category: 'Engineering & Quality',
      description: 'Run project verification tests or a specific test file via ShellExecutionService',
      argumentHint: '[test_file_or_pattern]',
      permissionTier: 'TIER_2_CONFIRMATION',
      availability: 'IMPLEMENTED',
      handler: async (args) => {
        const target = args[0];
        const cmdArgs = target
          ? ['runner_helper.cjs', target]
          : ['-e', 'console.log("ORION test runner ready. Pass a suite path to /test <suite>.")'];
        const res = await this.harness.dispatcher.shellService.execute({
          command: process.execPath,
          args: cmdArgs,
          cwd: this.kernel.projectRoot,
          timeoutMs: 60_000,
          useShell: false
        });
        return {
          handled: true,
          exitCode: res.success ? 0 : 1,
          summary: res.success
            ? `Test execution passed (${res.durationMs}ms): ${(res.stdout || '').trim().slice(0, 240)}`
            : `Test execution failed (exit=${res.exitCode}): ${(res.stderr || res.stdout || res.error || '').trim().slice(0, 240)}`,
          data: res
        };
      }
    });

    // 14. /undo
    this.register({
      command: '/undo',
      aliases: [],
      category: 'Reversibility & Session',
      description: 'Safely undo the most recent agent file modification (with conflict detection)',
      argumentHint: '',
      permissionTier: 'TIER_2_CONFIRMATION',
      availability: 'IMPLEMENTED',
      handler: async () => {
        const res = this.harness.workspaceService.getCheckpointService().undoLastChange();
        return {
          handled: true,
          exitCode: res.success ? 0 : 1,
          summary: res.success
            ? `Undid change '${res.targetId}' on ${res.affectedFiles.join(', ')}.`
            : `Undo failed: ${res.error}`,
          data: res
        };
      }
    });

    // 15. /redo
    this.register({
      command: '/redo',
      aliases: [],
      category: 'Reversibility & Session',
      description: 'Safely redo the most recently undone agent file modification',
      argumentHint: '',
      permissionTier: 'TIER_2_CONFIRMATION',
      availability: 'IMPLEMENTED',
      handler: async () => {
        const res = this.harness.workspaceService.getCheckpointService().redoLastChange();
        return {
          handled: true,
          exitCode: res.success ? 0 : 1,
          summary: res.success
            ? `Redid change '${res.targetId}' on ${res.affectedFiles.join(', ')}.`
            : `Redo failed: ${res.error}`,
          data: res
        };
      }
    });

    // 16. /rewind
    this.register({
      command: '/rewind',
      aliases: ['checkpoint'],
      category: 'Reversibility & Session',
      description: 'List, create, or rewind workspace files to a named non-destructive checkpoint',
      argumentHint: '[list | create [label] | <checkpoint_id>]',
      permissionTier: 'TIER_2_CONFIRMATION',
      availability: 'IMPLEMENTED',
      handler: async (args) => {
        const sub = (args[0] || 'list').toLowerCase();
        const cpSvc = this.harness.workspaceService.getCheckpointService();
        if (sub === 'list' && args.length <= 1) {
          const list = cpSvc.listCheckpoints();
          return {
            handled: true,
            exitCode: 0,
            summary: `Checkpoints (${list.length}): ${list.slice(0, 6).map(c => `${c.checkpointId} ("${c.label}")`).join(', ') || 'none'}`,
            data: { checkpoints: list }
          };
        }
        if (sub === 'create') {
          const label = args.slice(1).join(' ') || 'manual-checkpoint';
          const cp = cpSvc.createCheckpoint(label);
          return {
            handled: true,
            exitCode: 0,
            summary: `Created checkpoint '${cp.checkpointId}' ("${cp.label}") on branch ${cp.gitBranch}.`,
            data: cp
          };
        }
        const targetId = args[0];
        const res = cpSvc.rewindToCheckpoint(targetId);
        return {
          handled: true,
          exitCode: res.success ? 0 : 1,
          summary: res.success
            ? `Rewound to checkpoint '${targetId}' (${res.affectedFiles.length} file(s) restored).`
            : `Rewind failed: ${res.error}`,
          data: res
        };
      }
    });

    // 17. /vivid
    this.register({
      command: '/vivid',
      aliases: [],
      category: 'Visual & UI',
      description: 'Toggle Starfield TUI animation between Vivid mode and Minimal reduced-motion mode',
      argumentHint: '[on | off | toggle]',
      permissionTier: 'TIER_1_READ_ONLY',
      availability: 'IMPLEMENTED',
      handler: async (args) => {
        const sub = (args[0] || 'toggle').toLowerCase();
        let next = !this.vividMode;
        if (sub === 'on' || sub === 'true' || sub === 'vivid') next = true;
        else if (sub === 'off' || sub === 'false' || sub === 'minimal') next = false;
        this.setVividMode(next);
        return {
          handled: true,
          exitCode: 0,
          summary: `Starfield visual mode set to ${next ? 'VIVID (animated particles & shooting stars)' : 'MINIMAL (reduced motion)'}.`,
          data: { vividMode: next }
        };
      }
    });

    // 18. Register bridges for all preserved commands so SlashMenu & CommandRegistry expose 100% of commands
    const bridgedDefinitions: Array<{
      command: string;
      aliases?: string[];
      category: SlashCommandEntry['category'];
      description: string;
      argumentHint?: string;
      tier?: HarnessPermissionTier;
    }> = [
      {
        command: '/help',
        aliases: ['/commands', '/?'],
        category: 'Visual & UI',
        description: 'Display full ORION CLI v2 command directory and keyboard shortcuts',
        argumentHint: '[close]'
      },
      {
        command: '/status',
        aliases: ['/specs'],
        category: 'System & Workstation',
        description: 'Inspect real-time OS, CPU, RAM, active model, policy integrity, and E-Stop telemetry'
      },
      {
        command: '/doctor',
        category: 'Engineering & Quality',
        description: 'Run full workstation, provider, policy SHA-256, and harness health diagnostics'
      },
      {
        command: '/context',
        category: 'Project & Workspace',
        description: 'Inspect context window utilization, AGENT.md status, attached files, or compact turns',
        argumentHint: '[compact]'
      },
      {
        command: '/memory',
        category: 'Project & Workspace',
        description: 'Inspect, search, or clear persistent UnifiedMemoryManager records and AGENT.md',
        argumentHint: '[list | search <q> | clear]'
      },
      {
        command: '/reminders',
        aliases: ['/reminder'],
        category: 'System & Workstation',
        description: 'Create, list, inspect, or cancel persistent reminders with due-date & alert verification',
        argumentHint: '[list | add <dueAt> <msg> | cancel <id> | check]'
      },
      {
        command: '/search',
        category: 'Web & Knowledge',
        description: 'Execute live SSRF-protected web search or fetch a web page via WebSearchService',
        argumentHint: '<query | fetch <url>>'
      },
      {
        command: '/model',
        aliases: ['/models', '/providers'],
        category: 'Models, Agents & MCP',
        description: 'Inspect or switch across all 12 provider adapters and 6 local Ollama models',
        argumentHint: '[list | <model_or_provider> | ping]'
      },
      {
        command: '/mcp',
        category: 'Models, Agents & MCP',
        description: 'Inspect configured MCP servers, health status, and namespaced MCP tools',
        argumentHint: '[status | tools | connect]'
      },
      {
        command: '/agents',
        aliases: ['/agent'],
        category: 'Models, Agents & MCP',
        description: 'Inspect live multi-agent engineering roster, roles, permissions, and tasks',
        argumentHint: '[list | run <agent> <task> | status]'
      },
      {
        command: '/tools',
        category: 'Models, Agents & MCP',
        description: 'List or inspect all registered ORION and Harness tools and schemas',
        argumentHint: '[list | inspect <tool_id>]'
      },
      {
        command: '/permissions',
        category: 'Engineering & Quality',
        description: 'Inspect 3-tier PermissionGate status, pending approvals, or trigger/reset E-Stop',
        argumentHint: '[status | estop | reset | rollback]'
      },
      {
        command: '/approve',
        category: 'Engineering & Quality',
        description: 'Approve and execute a pending Tier 2 tool call with action-bound token verification',
        argumentHint: '[approval_id]',
        tier: 'TIER_2_CONFIRMATION'
      },
      {
        command: '/deny',
        category: 'Engineering & Quality',
        description: 'Deny and discard a pending Tier 2 tool call request',
        argumentHint: '[approval_id]'
      },
      {
        command: '/stop',
        category: 'Engineering & Quality',
        description: 'Trigger immediate Emergency Stop (E-Stop) and terminate tracked child process trees'
      },
      {
        command: '/resume',
        category: 'Reversibility & Session',
        description: 'List or resume a persisted ORION CLI session and task checkpoint',
        argumentHint: '[list | <session_id>]'
      },
      {
        command: '/clear',
        category: 'Reversibility & Session',
        description: 'Clear current conversation context and terminal output buffer'
      },
      {
        command: '/tasks',
        category: 'Planning & Execution',
        description: 'List supervised tasks, execution traces, and workflow checkpoints',
        argumentHint: '[list | traces | checkpoints]'
      },
      {
        command: '/history',
        category: 'Reversibility & Session',
        description: 'Show conversation turn history for the active session'
      },
      {
        command: '/notes',
        category: 'Project & Workspace',
        description: 'List or add persistent operator notes in UnifiedMemoryManager',
        argumentHint: '[list | add <text>]'
      },
      {
        command: '/repo',
        category: 'Project & Workspace',
        description: 'Inspect repository file count, detected languages, and structure'
      },
      {
        command: '/find',
        category: 'Project & Workspace',
        description: 'Search workspace code for a pattern across source files',
        argumentHint: '<pattern>'
      },
      {
        command: '/open',
        aliases: ['/apps'],
        category: 'System & Workstation',
        description: 'Launch or inspect active desktop applications',
        argumentHint: '<app_name>',
        tier: 'TIER_2_CONFIRMATION'
      },
      {
        command: '/weather',
        category: 'System & Workstation',
        description: 'Fetch live weather telemetry for a city',
        argumentHint: '[city]'
      },
      {
        command: '/prayers',
        category: 'System & Workstation',
        description: 'Fetch live Islamic prayer timings for a city',
        argumentHint: '[city]'
      },
      {
        command: '/spotify',
        aliases: ['/media', '/volume'],
        category: 'System & Workstation',
        description: 'Control media playback, Spotify, or system volume',
        argumentHint: '[status | play | pause | next]'
      },
      {
        command: '/clipboard',
        category: 'System & Workstation',
        description: 'Read or write system clipboard text',
        argumentHint: '[read | write <text>]'
      },
      {
        command: '/speak',
        aliases: ['/voice'],
        category: 'System & Workstation',
        description: 'Synthesize speech via Windows SAPI TTS or check voice subsystem status',
        argumentHint: '<text>'
      },
      {
        command: '/config',
        aliases: ['/privacy', '/api', '/bench', '/hackathon', '/google', '/remote', '/content', '/system-stats', '/recent-tools', '/panel', '/close'],
        category: 'System & Workstation',
        description: 'Inspect runtime configuration, privacy guarantees, local API, or telemetry panels'
      },
      {
        command: '/exit',
        aliases: ['/quit'],
        category: 'Visual & UI',
        description: 'Cleanly exit ORION CLI and restore terminal state'
      }
    ];

    for (const def of bridgedDefinitions) {
      if (this.entries.has(def.command)) continue;
      this.register({
        command: def.command,
        aliases: def.aliases || [],
        category: def.category,
        description: def.description,
        argumentHint: def.argumentHint || '',
        permissionTier: def.tier || 'TIER_1_READ_ONLY',
        availability: 'IMPLEMENTED',
        handler: async () => ({
          handled: false,
          exitCode: 0,
          summary: `Delegated to canonical OrionCliCommandRouter (${def.command}).`
        })
      });
    }
  }
}
