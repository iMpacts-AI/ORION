import readline from 'readline';
import os from 'os';
import { OrionCliKernel } from './OrionCliKernel';
import { OrionCliRenderer } from './OrionCliRenderer';
import { OrionCliCommandRouter } from './OrionCliCommandRouter';
import { runOrionInkTui } from '../tui/OrionTuiApp';

export interface CliAppOptions {
  projectRoot?: string;
  version?: string;
  jsonMode?: boolean;
  useColor?: boolean;
  autoApprove?: boolean;
  mcpConfigPath?: string;
}

export class OrionCliApp {
  public readonly renderer: OrionCliRenderer;
  public readonly kernel: OrionCliKernel;
  public readonly router: OrionCliCommandRouter;
  private readonly version: string;
  private rl: readline.Interface | null = null;
  private multilineBuffer: string[] = [];

  constructor(options: CliAppOptions = {}) {
    this.version = options.version || '1.0.0';
    this.renderer = new OrionCliRenderer({
      jsonMode: options.jsonMode,
      useColor: options.useColor
    });

    this.kernel = new OrionCliKernel({
      projectRoot: options.projectRoot,
      renderer: this.renderer,
      mcpConfigPath: options.mcpConfigPath,
      approvalCallback: async (req) => {
        if (options.autoApprove) {
          return true;
        }
        return await this.promptInteractiveApproval(req);
      }
    });

    this.router = new OrionCliCommandRouter(this.kernel);
  }

  public async runOnce(input: string): Promise<number> {
    try {
      const res = await this.router.dispatch(input);
      return res.exitCode ?? 0;
    } catch (err: any) {
      this.renderer.renderError(err.message || String(err));
      return 1;
    } finally {
      this.kernel.shutdown();
    }
  }

  public async startTui(): Promise<number> {
    if (!process.stdout.isTTY || !process.stdin.isTTY || this.renderer.isJsonMode()) {
      this.startInteractive();
      return 0;
    }
    try {
      return await runOrionInkTui({
        kernel: this.kernel,
        router: this.router
      });
    } catch {
      this.startInteractive();
      return 0;
    }
  }

  public startInteractive(): void {
    const allProviders = this.kernel.omniRouter.getAllProviderStatuses();
    const configuredProviders = allProviders.filter(p => p.isConfigured && p.id !== 'local-heuristic');
    const activeProvider = this.kernel.omniRouter.getStatus();
    const mcpStatuses = this.kernel.mcpClient.getAllStatuses();
    const mcpConnected = mcpStatuses.filter(s => s.state === 'CONNECTED').length;
    const policyIntegrity = this.kernel.policyService.verifyProtectedPolicyIntegrity();

    this.renderer.renderStartupHeader({
      version: this.version,
      platform: `${process.platform} ${os.release()} (${process.arch})`,
      activeProvider: activeProvider.id,
      activeModel: activeProvider.currentModel,
      activeAgent: this.kernel.agentSystem.getActiveAgentId(),
      policyVerified: policyIntegrity.valid,
      configuredProvidersCount: configuredProviders.length,
      totalProvidersCount: allProviders.length - 1,
      registeredToolsCount: this.kernel.toolService.getTools().length,
      mcpConnectedCount: mcpConnected,
      mcpConfiguredCount: mcpStatuses.length
    });

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: this.getMainPrompt(),
      historySize: 200,
      completer: (line: string) => this.completer(line)
    });

    readline.emitKeypressEvents(process.stdin, this.rl);
    const onKeypress = async (_str: string, key?: { name?: string; ctrl?: boolean; meta?: boolean }) => {
      if (key && key.name === 'escape') {
        if (this.kernel.isBusy()) {
          if (this.kernel.getTaskExecutionState() === 'cancelling') {
            return;
          }
          this.renderer.writeLine(`\n${this.renderer.yellow('!')} Cancellation requested...`);
          const res = await this.kernel.cancelActiveTask('Task cancelled by operator via Escape');
          if (res.cancelled) {
            this.renderer.writeLine(
              `${this.renderer.yellow('!')} Task cancelled${res.terminatedProcesses > 0 ? ` (terminated ${res.terminatedProcesses} child process(es))` : ''}.`
            );
            this.rl?.setPrompt(this.getMainPrompt());
            this.rl?.prompt(true);
          }
        }
        // When idle, Escape is a safe no-op (does not exit ORION or destroy current input)
      }
    };
    process.stdin.on('keypress', onKeypress);

    this.rl.on('SIGINT', async () => {
      if (this.multilineBuffer.length > 0) {
        this.multilineBuffer = [];
        this.renderer.writeLine('\nCancelled multiline input.');
        this.rl?.setPrompt(this.getMainPrompt());
        this.rl?.prompt();
        return;
      }

      if (this.kernel.isBusy()) {
        const res = await this.kernel.cancelActiveTask('Task cancelled by operator via SIGINT');
        this.renderer.writeLine(
          `\n${this.renderer.yellow('!')} Task cancelled (terminated ${res.terminatedProcesses} child process(es)).`
        );
        this.rl?.setPrompt(this.getMainPrompt());
        this.rl?.prompt();
        return;
      }

      this.renderer.writeLine(`\n${this.renderer.dim('Exiting ORION CLI.')}`);
      this.shutdownAndExit(0);
    });

    this.rl.on('line', async (line: string) => {
      // Support trailing backslash for multiline input continuation
      if (line.endsWith('\\')) {
        this.multilineBuffer.push(line.slice(0, -1));
        this.rl?.setPrompt(this.renderer.dim('... '));
        this.rl?.prompt();
        return;
      }

      const fullInput = this.multilineBuffer.length > 0
        ? [...this.multilineBuffer, line].join('\n')
        : line;
      this.multilineBuffer = [];
      this.rl?.setPrompt(this.getMainPrompt());

      const trimmed = fullInput.trim();
      if (!trimmed) {
        this.rl?.prompt();
        return;
      }

      try {
        const res = await this.router.dispatch(trimmed, { streamTokens: true });
        if (res.shouldExit) {
          this.renderer.writeLine(this.renderer.dim('Exiting ORION CLI.'));
          this.shutdownAndExit(res.exitCode ?? 0);
          return;
        }
      } catch (err: any) {
        this.renderer.renderError(err.message || String(err));
      }

      this.rl?.prompt();
    });

    this.rl.on('close', () => {
      this.kernel.shutdown();
    });

    this.rl.prompt();
  }

  private getMainPrompt(): string {
    const agentId = this.kernel.agentSystem.getActiveAgentId();
    return `${this.renderer.brand('orion')}${this.renderer.dim(`[${agentId}]`)} ${this.renderer.violet('❯')} `;
  }

  private promptInteractiveApproval(req: {
    toolId: string;
    toolName: string;
    riskLevel: string;
    arguments: Record<string, any>;
    reason: string;
  }): Promise<boolean> {
    if (!this.rl || !process.stdin.isTTY) {
      return Promise.resolve(false);
    }

    const r = this.renderer;
    r.writeLine(`\n  ${r.yellow('⚠ APPROVAL REQUIRED')}`);
    r.writeLine(`    Tool   : ${r.bold(req.toolId)} (${req.toolName})`);
    r.writeLine(`    Risk   : ${r.yellow(req.riskLevel)}`);
    r.writeLine(`    Args   : ${r.sanitize(JSON.stringify(req.arguments))}`);
    r.writeLine(`    Reason : ${r.sanitize(req.reason)}`);

    return new Promise((resolve) => {
      this.rl!.question(`  Authorize execution? [y/N]: `, (answer) => {
        const normalized = answer.trim().toLowerCase();
        resolve(normalized === 'y' || normalized === 'yes');
      });
    });
  }

  public completer(line: string): [string[], string] {
    const baseCommands = OrionCliCommandRouter.getSupportedCommands();
    const doubleSlashCommands = baseCommands.map(c => '/' + c);
    const toolIds = this.kernel.toolService.getTools().map(t => `/tools inspect ${t.id}`);
    const agentIds = ['core', 'engineer', 'research', 'operator', 'vision', 'auditor'].flatMap(id => [
      `/agent ${id}`,
      `/agent inspect ${id}`
    ]);
    const apiSubcommands = ['/api status', '/api start', '/api stop', '/api key-gen', '/api key-rotate'];
    const completions = [...baseCommands, ...doubleSlashCommands, ...agentIds, ...apiSubcommands, ...toolIds];
    const hits = completions.filter(c => c.startsWith(line));
    return [hits.length ? hits : baseCommands, line];
  }

  private shutdownAndExit(code: number): void {
    this.kernel.shutdown();
    if (this.rl) {
      this.rl.close();
      this.rl = null;
    }
    process.exit(code);
  }
}
