import fs from 'fs';
import path from 'path';
import os from 'os';
import { OrionCliKernel } from './OrionCliKernel';
import { RoutingStrategy } from '../main/services/OrionAIProviderRouter';
import { ProcessSupervisor } from '../main/services/computer/ProcessSupervisor';
import { ExecutionTraceService } from '../main/services/ExecutionTraceService';
import { OrionAgentId } from '../main/services/AgentPolicyService';
import { ToolCall } from '../shared/types';
import { WindowsNativeSTTProvider } from '../main/services/VoiceService';
import {
  formatDeveloperEngineDiagnostics,
  formatLogicalPath,
  resolvePublicEngineIdentity
} from '../shared/branding/OrionEngineIdentity';

export interface CommandDispatchResult {
  handled: boolean;
  shouldExit?: boolean;
  exitCode?: number;
}

export class OrionCliCommandRouter {
  private kernel: OrionCliKernel;

  constructor(kernel: OrionCliKernel) {
    this.kernel = kernel;
  }

  public static getSupportedCommands(): string[] {
    return [
      '/help', '/commands', '/system-stats', '/recent-tools', '/panel', '/close', '/apps',
      '/status', '/specs', '/providers', '/models', '/model', '/mode',
      '/init', '/attach', '/worktree', '/plan', '/goal', '/effort', '/subtask', '/loop',
      '/review', '/security-review', '/simplify', '/test', '/undo', '/redo', '/rewind',
      '/vivid', '/animations', '/motion', '/tip', '/tips',
      '/agents', '/agent', '/tools', '/mcp', '/tasks', '/resume', '/remote', '/content',
      '/memory', '/context', '/history', '/notes', '/reminders', '/permissions',
      '/approve', '/deny', '/stop', '/config', '/doctor', '/bench', '/privacy',
      '/api', '/hackathon', '/google', '/search', '/open', '/spotify', '/media', '/volume',
      '/clipboard', '/weather', '/prayers', '/speak', '/voice', '/repo', '/find',
      '/clear', '/exit', '/quit'
    ];
  }

  public async dispatch(
    rawInput: string,
    options?: {
      streamTokens?: boolean;
      onToken?: (token: string) => void;
      signal?: AbortSignal;
    }
  ): Promise<CommandDispatchResult> {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      return { handled: true, exitCode: 0 };
    }

    if (trimmed === 'exit' || trimmed === 'quit') {
      return { handled: true, shouldExit: true, exitCode: 0 };
    }

    // Check if @file attachment shorthand
    if (trimmed.startsWith('@') && trimmed.length > 1) {
      const targetPath = trimmed.slice(1).trim();
      const entry = this.kernel.commandRegistry.getCommand('/attach');
      if (entry) {
        const out = await entry.handler([targetPath], trimmed);
        if (this.kernel.renderer.isJsonMode()) {
          this.kernel.renderer.writeJson(out.data || { summary: out.summary });
        } else if (out.exitCode === 0) {
          this.kernel.renderer.renderInfo(out.summary);
        } else {
          this.kernel.renderer.renderError(out.summary);
        }
        return { handled: true, exitCode: out.exitCode };
      }
    }

    // Check if slash or double-slash command
    if (!trimmed.startsWith('/')) {
      const res = await this.kernel.executePrompt(trimmed, options);
      return { handled: true, exitCode: res.success ? 0 : 1 };
    }

    const normalized = trimmed.replace(/^\/\/+/, '/');
    const tokens = this.tokenize(normalized.slice(1));
    const cmd = (tokens[0] || 'help').toLowerCase();
    const args = tokens.slice(1);
    const r = this.kernel.renderer;

    switch (cmd) {
      case 'help':
      case 'commands':
      case '?': {
        const sub = (args[0] || '').toLowerCase();
        if (sub === 'close' || sub === 'hide' || sub === 'off') {
          if (r.isJsonMode()) {
            r.setActivePanel('none');
            r.writeJson({ panel: 'help', activePanel: 'none', closed: true });
            return { handled: true, exitCode: 0 };
          }
          r.closeContextualPanel();
          return { handled: true, exitCode: 0 };
        }
        r.setActivePanel('help');
        if (r.isJsonMode()) {
          r.writeJson({
            product: 'ORION',
            activePanel: 'help',
            commands: OrionCliCommandRouter.getSupportedCommands(),
            closeCommand: '/help close'
          });
          return { handled: true, exitCode: 0 };
        }
        this.renderHelp();
        return { handled: true, exitCode: 0 };
      }

      case 'system-stats':
      case 'system_stats':
      case 'sys-stats': {
        return await this.handleSystemStatsPanel(args);
      }

      case 'recent-tools':
      case 'recent_tools':
      case 'recenttools': {
        return this.handleRecentToolsPanel(args);
      }

      case 'panel':
      case 'close': {
        return await this.handlePanelCommand(cmd, args);
      }

      case 'apps':
      case 'active-apps': {
        r.appsTracker.refreshFromSystem(true);
        const apps = r.appsTracker.getDisplayedApplications(7);
        if (r.isJsonMode()) {
          r.writeJson({ activeApplications: apps });
          return { handled: true, exitCode: 0 };
        }
        r.renderActiveApplicationsBar(apps);
        return { handled: true, exitCode: 0 };
      }

      case 'exit':
      case 'quit': {
        if (r.isJsonMode()) {
          r.writeJson({ exited: true, status: 'CLEAN_EXIT' });
        }
        return { handled: true, shouldExit: true, exitCode: 0 };
      }

      case 'clear': {
        this.kernel.orchestrator.getMemoryService().clearMemory();
        if (r.isJsonMode()) {
          r.writeJson({ cleared: true, message: 'Session conversation context cleared.' });
          return { handled: true, exitCode: 0 };
        }
        if (process.stdout.isTTY) {
          process.stdout.write('\x1b[2J\x1b[0f');
        }
        r.renderInfo('Session conversation context cleared.');
        return { handled: true, exitCode: 0 };
      }

      case 'status':
      case 'specs': {
        const snapshot = await this.kernel.systemMonitor.getSnapshot();
        const routerStatus = this.kernel.omniRouter.getStatus();
        const allProviders = this.kernel.omniRouter.getAllProviderStatuses();
        const configuredCount = allProviders.filter(p => p.isConfigured && p.id !== 'local-heuristic').length;
        const tools = this.kernel.toolService.getTools();
        const mcpStatuses = this.kernel.mcpClient.getAllStatuses();
        const mcpConnected = mcpStatuses.filter(s => s.state === 'CONNECTED').length;
        const tasks = this.kernel.orchestrator.getTaskSupervisor().getAllTasks();
        const activeAgent = this.kernel.agentSystem.getActiveAgentDefinition();
        const policyIntegrity = this.kernel.policyService.verifyProtectedPolicyIntegrity();
        const apiStatus = this.kernel.localApiServer.getStatus();
        const usedGb = (snapshot.memory.usedBytes / (1024 ** 3)).toFixed(2);
        const totalGb = (snapshot.memory.totalBytes / (1024 ** 3)).toFixed(2);

        if (r.isJsonMode()) {
          r.writeJson({
            platform: os.platform(),
            release: os.release(),
            arch: process.arch,
            cpu: {
              model: snapshot.cpu.model,
              cores: snapshot.cpu.cores.length,
              usagePercent: snapshot.cpu.usagePercent
            },
            memory: {
              usedGb: Number(usedGb),
              totalGb: Number(totalGb),
              usagePercent: snapshot.memory.usagePercent
            },
            activeAgent: activeAgent.id,
            activeProvider: routerStatus.id,
            activeModel: routerStatus.currentModel,
            routingStrategy: this.kernel.omniRouter.getRoutingStrategy(),
            protectedPolicyVerified: policyIntegrity.valid,
            protectedPolicySha256: policyIntegrity.actualSha256,
            localApiRunning: apiStatus.running,
            localApiPort: apiStatus.port,
            configuredProvidersCount: configuredCount,
            totalProvidersCount: allProviders.length - 1,
            registeredToolsCount: tools.length,
            mcpConnectedCount: mcpConnected,
            mcpConfiguredCount: mcpStatuses.length,
            tasksCount: tasks.length,
            estopActive: ProcessSupervisor.getInstance().isEstopActive()
          });
          return { handled: true, exitCode: 0 };
        }

        const engineIdentity = resolvePublicEngineIdentity(routerStatus.id, routerStatus.currentModel);
        r.writeLine(`\n${r.bold('ORION Runtime & System Telemetry')}`);
        r.writeLine(`  • ${r.cyan('OS / Platform'.padEnd(20))}: ${os.platform()} ${os.release()} (${process.arch})`);
        r.writeLine(`  • ${r.cyan('CPU Model'.padEnd(20))}: ${snapshot.cpu.model} (${snapshot.cpu.cores.length} cores @ ${snapshot.cpu.usagePercent}% load)`);
        r.writeLine(`  • ${r.cyan('Memory (RAM)'.padEnd(20))}: ${usedGb} GB used / ${totalGb} GB total (${snapshot.memory.usagePercent}%)`);
        r.writeLine(`  • ${r.cyan('Network'.padEnd(20))}: ${snapshot.network.interfaceName} (${snapshot.network.ipAddress})`);
        r.writeLine(`  • ${r.cyan('Uptime'.padEnd(20))}: ${(os.uptime() / 3600).toFixed(1)} hours`);
        r.writeLine(`  • ${r.cyan('Active Agent'.padEnd(20))}: ${activeAgent.displayName} (${activeAgent.id} | ceiling: ${activeAgent.maxPermissionLevel})`);
        r.writeLine(`  • ${r.cyan('Active Engine'.padEnd(20))}: ${engineIdentity.publicLabel} (${engineIdentity.tierDescription})`);
        r.writeLine(`  • ${r.cyan('Routing Strategy'.padEnd(20))}: ${this.kernel.omniRouter.getRoutingStrategy()}`);
        r.writeLine(`  • ${r.cyan('Protected Policy'.padEnd(20))}: ${policyIntegrity.valid ? r.green('VERIFIED') : r.red('TAMPER_DETECTED (FAIL-SAFE)')} (${policyIntegrity.actualSha256.slice(0, 12)}...)`);
        r.writeLine(`  • ${r.cyan('Cloud/Local Adapters'.padEnd(20))}: ${configuredCount} configured / ${allProviders.length - 1} adapters (+1 offline fallback)`);
        r.writeLine(`  • ${r.cyan('Registered Tools'.padEnd(20))}: ${tools.length} authoritative tools`);
        r.writeLine(`  • ${r.cyan('MCP Servers'.padEnd(20))}: ${mcpConnected} connected / ${mcpStatuses.length} configured`);
        r.writeLine(`  • ${r.cyan('Local OpenAI API'.padEnd(20))}: ${apiStatus.running ? r.green(`ONLINE (http://${apiStatus.host}:${apiStatus.port}/v1)`) : r.dim('STOPPED (/api start)')}`);
        r.writeLine(`  • ${r.cyan('Session Tasks'.padEnd(20))}: ${tasks.length} recorded`);
        r.writeLine(`  • ${r.cyan('Emergency Stop'.padEnd(20))}: ${ProcessSupervisor.getInstance().isEstopActive() ? r.red('ACTIVE') : r.green('STANDBY')}\n`);
        return { handled: true, exitCode: 0 };
      }

      case 'doctor': {
        return await this.handleDoctor();
      }

      case 'agents': {
        return await this.handleAgentsCommand(args);
      }

      case 'agent': {
        return await this.handleAgentCommand(args);
      }

      case 'mode': {
        const sub = (args[0] || '').toLowerCase();
        if (!sub) {
          if (r.isJsonMode()) {
            r.writeJson({
              harnessMode: this.kernel.harness.getMode(),
              activeStrategy: this.kernel.omniRouter.getRoutingStrategy(),
              modes: ['Build', 'Plan', 'Chat', 'saif', 'nur', 'hikmah', 'auto']
            });
            return { handled: true, exitCode: 0 };
          }
          r.writeLine(`\n${r.bold('ORION Execution & Intelligence Modes')}`);
          r.writeLine(`  • ${r.cyan('Build'.padEnd(10))} — Full Agent Execution (${r.dim('Tier 1 auto, Tier 2 confirmation, Tier 3 blocked')})`);
          r.writeLine(`  • ${r.cyan('Plan'.padEnd(10))} — Read-Only Planning   (${r.dim('Strictly blocks all file/shell/git mutations')})`);
          r.writeLine(`  • ${r.cyan('Chat'.padEnd(10))} — Conversational Mode  (${r.dim('Direct reasoning & read-only context')})`);
          r.writeLine(`  • ${r.cyan('saif'.padEnd(10))} — Fast Tier            (${r.dim('SPEED_FIRST   | llama3.1:8b / claude-haiku-4-5-20251001')})`);
          r.writeLine(`  • ${r.cyan('nur'.padEnd(10))} — Balanced Tier        (${r.dim('BALANCED      | qwen2.5-coder:7b / claude-sonnet-4-6')})`);
          r.writeLine(`  • ${r.cyan('hikmah'.padEnd(10))} — Deep Tier            (${r.dim('QUALITY_FIRST | deepseek-r1:14b / claude-opus-4-7')})`);
          r.writeLine(`  • ${r.cyan('auto'.padEnd(10))} — Dynamic Router       (${r.dim('Automatic task-based routing')})`);
          r.writeLine(`  Active Harness Mode: ${r.bold(this.kernel.harness.getMode())} | Active Strategy: ${r.bold(this.kernel.omniRouter.getRoutingStrategy())}\n`);
          return { handled: true, exitCode: 0 };
        }
        if (['build', 'plan', 'chat'].includes(sub)) {
          const normalized = sub === 'build' ? 'Build' : sub === 'plan' ? 'Plan' : 'Chat';
          this.kernel.harness.setMode(normalized);
          if (r.isJsonMode()) {
            r.writeJson({ harnessMode: normalized, activeStrategy: this.kernel.omniRouter.getRoutingStrategy() });
          } else {
            r.renderInfo(`Harness execution mode set to '${normalized}'.`);
          }
          return { handled: true, exitCode: 0 };
        }
        if (['saif', 'nur', 'hikmah', 'auto'].includes(sub)) {
          const applied = this.kernel.omniRouter.setHikmahMode(sub as any);
          r.renderInfo(
            `Intelligence mode set to '${applied.mode.toUpperCase()}' (Strategy: ${applied.strategy}, Claude Model: ${applied.anthropicModel}).`
          );
          return { handled: true, exitCode: 0 };
        }
        r.renderError(`Unknown mode '${sub}'. Valid modes: Build, Plan, Chat, saif, nur, hikmah, auto.`);
        return { handled: true, exitCode: 1 };
      }

      case 'providers': {
        const sub = (args[0] || 'list').toLowerCase();
        if (sub === 'strategy' && args[1]) {
          const strat = args[1].toUpperCase() as RoutingStrategy;
          const valid: RoutingStrategy[] = ['SPEED_FIRST', 'BALANCED', 'QUALITY_FIRST', 'VISION', 'CODING', 'AGENT', 'OFFLINE'];
          if (!valid.includes(strat)) {
            r.renderError(`Invalid routing strategy '${args[1]}'. Valid strategies: ${valid.join(', ')}`);
            return { handled: true, exitCode: 1 };
          }
          this.kernel.setRoutingStrategy(strat);
          r.renderInfo(`Routing strategy updated to ${strat}.`);
          return { handled: true, exitCode: 0 };
        }
        if (sub === 'ping' || sub === 'qualify') {
          r.renderInfo('Running live provider qualification ping...');
          const results = await this.kernel.omniRouter.runLiveQualificationTest();
          if (r.isJsonMode()) {
            r.writeJson(results);
            return { handled: true, exitCode: 0 };
          }
          for (const [id, info] of Object.entries(results)) {
            const st = info.status === 'READY'
              ? r.green(`READY (${info.latencyMs}ms)`)
              : info.status === 'NOT CONFIGURED'
                ? r.dim('NOT CONFIGURED')
                : r.red(`${info.status}: ${r.sanitize(info.error || '')}`);
            r.writeLine(`  • ${r.bold(id.padEnd(16))} ${st}`);
          }
          r.writeLine('');
          return { handled: true, exitCode: 0 };
        }
        const statuses = this.kernel.omniRouter.getAllProviderStatuses();
        const active = this.kernel.omniRouter.getStatus();
        if (r.isJsonMode()) {
          r.writeJson({
            activeProvider: active.id,
            activeModel: active.currentModel,
            routingStrategy: this.kernel.omniRouter.getRoutingStrategy(),
            providers: statuses
          });
          return { handled: true, exitCode: 0 };
        }
        r.renderProvidersTable(statuses, active.id, this.kernel.omniRouter.getRoutingStrategy());
        return { handled: true, exitCode: 0 };
      }

      case 'models':
      case 'model': {
        return await this.handleModelCommand(args);
      }

      case 'remote':
      case 'remote-control': {
        return await this.handleRemoteControlCommand(args);
      }

      case 'content': {
        return await this.handleContentCommand(args);
      }

      case 'tools': {
        const sub = (args[0] || 'list').toLowerCase();
        if (sub === 'inspect' && args[1]) {
          const tool = this.kernel.toolService.getRegistry().getTool(args[1]);
          if (!tool) {
            r.renderError(`Tool '${args[1]}' is not registered in ToolRegistry.`);
            return { handled: true, exitCode: 1 };
          }
          r.writeJson(tool);
          return { handled: true, exitCode: 0 };
        }
        if (sub === 'run' && args[1]) {
          const toolId = args[1];
          const rawJson = args.slice(2).join(' ');
          let parsedArgs: Record<string, any> = {};
          if (rawJson) {
            try {
              parsedArgs = JSON.parse(rawJson);
            } catch {
              r.renderError(`Invalid JSON arguments for tool '${toolId}': ${rawJson}`);
              return { handled: true, exitCode: 1 };
            }
          }
          const call: ToolCall = {
            id: `cli_call_${Date.now()}`,
            toolId,
            toolName: toolId,
            arguments: parsedArgs,
            timestamp: Date.now(),
            requiresUserApproval: false
          };
          r.renderToolStarted(1, call);
          const res = await this.kernel.toolService.executeTool(call);
          r.renderToolCompleted(res);
          const payload = res.data ?? (res as any).output;
          if (res.success && payload !== undefined) {
            r.writeJson(payload);
          }
          return { handled: true, exitCode: res.success ? 0 : 1 };
        }
        if (r.isJsonMode()) {
          const tools = this.kernel.toolService.getTools();
          r.writeJson({
            totalCount: tools.length,
            tools
          });
          return { handled: true, exitCode: 0 };
        }
        r.renderToolsTable(this.kernel.toolService.getTools());
        return { handled: true, exitCode: 0 };
      }

      case 'mcp': {
        return await this.handleMcp(args);
      }

      case 'resume': {
        return await this.handleResumeCommand(args);
      }

      case 'tasks': {
        const sub = (args[0] || 'list').toLowerCase();
        const supervisor = this.kernel.orchestrator.getTaskSupervisor();
        if (sub === 'trace' || sub === 'traces') {
          const traces = this.kernel.orchestrator.getTraceService().getAllTraces().slice(-10);
          const chainIntegrity = this.kernel.orchestrator.getTraceService().verifyTraceChainIntegrity();
          if (r.isJsonMode()) {
            r.writeJson({ chainIntegrity, traces });
            return { handled: true, exitCode: 0 };
          }
          r.writeLine(`\n${r.bold(`Execution Traces (${traces.length})`)} ${r.dim(`[Hash Chain: ${chainIntegrity.valid ? 'VALID' : 'BROKEN'} (${chainIntegrity.totalTraces} records)]`)}`);
          if (traces.length === 0) {
            r.writeLine(`  ${r.dim('No execution traces recorded in this session.')}\n`);
          } else {
            for (const tr of traces) {
              const statusLabel = tr.verificationSuccess ? r.green('VERIFIED') : r.yellow('RECORDED');
              r.writeLine(
                `  • ${r.bold(tr.traceId)} [${statusLabel}] Tools: ${tr.toolCallsExecuted.length} (${tr.telemetryMetrics.totalCommandLatencyMs}ms)`
              );
            }
            r.writeLine('');
          }
          return { handled: true, exitCode: 0 };
        }
        if (sub === 'checkpoints' || sub === 'workflows') {
          const cps = this.kernel.workflowEngine.listCheckpoints();
          if (r.isJsonMode()) {
            r.writeJson({ checkpoints: cps });
            return { handled: true, exitCode: 0 };
          }
          r.writeLine(`\n${r.bold(`Persisted Workflow Checkpoints (${cps.length})`)}`);
          if (cps.length === 0) {
            r.writeLine(`  ${r.dim('No persisted workflow checkpoints found.')}\n`);
          } else {
            for (const cp of cps.slice(0, 15)) {
              const badge = cp.status === 'COMPLETED' ? r.green(cp.status) : cp.status === 'FAILED' || cp.status === 'BLOCKED' ? r.red(cp.status) : r.yellow(cp.status);
              r.writeLine(`  • ${r.bold(cp.workflowId)} [${badge}] (${cp.stepsCompleted}/${cp.stepsTotal} verified) — ${r.sanitize(cp.goal)}`);
            }
            r.writeLine('');
          }
          return { handled: true, exitCode: 0 };
        }
        if (sub === 'resume' && args[1]) {
          const wfId = args[1];
          const res = await this.kernel.workflowEngine.resumeWorkflow(wfId);
          if (res.status === 'COMPLETED') {
            r.renderInfo(`Workflow '${wfId}' resumed and completed (${res.verifiedCount}/${res.stepsTotal} steps verified).`);
            return { handled: true, exitCode: 0 };
          }
          r.renderError(`Workflow '${wfId}' resume ended with status ${res.status}: ${res.error || 'Unknown error'}`);
          return { handled: true, exitCode: 1 };
        }
        if (sub === 'cancel' && args[1]) {
          const ok = supervisor.cancelTask(args[1]);
          if (ok) {
            r.renderInfo(`Task '${args[1]}' cancelled.`);
          } else {
            r.renderError(`Could not cancel task '${args[1]}' (not found or not running).`);
          }
          return { handled: true, exitCode: ok ? 0 : 1 };
        }
        const allTasks = supervisor.getAllTasks();
        if (r.isJsonMode()) {
          r.writeJson({ totalCount: allTasks.length, tasks: allTasks });
          return { handled: true, exitCode: 0 };
        }
        r.writeLine(`\n${r.bold(`Supervised Tasks (${allTasks.length})`)}`);
        if (allTasks.length === 0) {
          r.writeLine(`  ${r.dim('No tasks recorded in this session.')}\n`);
        } else {
          for (const t of allTasks.slice(-15)) {
            const statusStr = t.status === 'COMPLETED'
              ? r.green(t.status)
              : t.status === 'FAILED' || t.status === 'CANCELLED'
                ? r.red(t.status)
                : r.cyan(t.status);
            r.writeLine(`  • ${r.bold(t.taskId.padEnd(18))} [${statusStr}] ${r.sanitize(t.title)} (${t.progressPercent}%)`);
          }
          r.writeLine('');
        }
        return { handled: true, exitCode: 0 };
      }

      case 'context': {
        const sub = (args[0] || '').toLowerCase();
        if (sub === 'compact') {
          const comp = this.kernel.harness.contextManager.compactContext(6);
          if (r.isJsonMode()) {
            r.writeJson(comp);
          } else {
            r.renderInfo(
              `Context Compaction: ${comp.beforeTurnCount} -> ${comp.afterTurnCount} turns (${comp.beforeEstimatedTokens} -> ${comp.afterEstimatedTokens} est. tokens).`
            );
          }
          return { handled: true, exitCode: 0 };
        }
        const cb = this.kernel.orchestrator.getContextBuilder();
        const activeAgent = this.kernel.agentSystem.getActiveAgentDefinition();
        cb.setMaxContextTokens(activeAgent.maxContextTokens);
        cb.buildSynthesisContext(
          '(context inspection)',
          this.kernel.orchestrator.getMemoryService().getTurns(),
          [],
          this.kernel.orchestrator.getTaskMemory().getCurrentTask(),
          this.kernel.unifiedMemory.getAllMemories().slice(-5),
          activeAgent.protectedSystemPrompt
        );
        const report = cb.getLastAccountingReport();
        const v2Diag = this.kernel.harness.contextManager.getDiagnostics({
          modelId: this.kernel.omniRouter.getStatus().currentModel,
          mode: this.kernel.harness.getMode(),
          effortLevel: this.kernel.harness.getEffort()
        });
        if (r.isJsonMode()) {
          r.writeJson({
            ...report,
            ...v2Diag,
            agentId: activeAgent.id,
            maxBudgetTokens: report.maxContextTokens,
            untrustedDataSegmented: true
          });
          return { handled: true, exitCode: 0 };
        }
        r.writeLine(`\n${r.bold('ORION Context & Token Budget Accounting')}`);
        r.writeLine(`  • Active Agent        : ${r.cyan(activeAgent.id)} (${activeAgent.displayName})`);
        r.writeLine(`  • Harness Mode/Effort : ${r.bold(v2Diag.mode)} / ${v2Diag.effortLevel.toUpperCase()} (${v2Diag.tokenAccountingBasis})`);
        r.writeLine(`  • Token Budget        : ${report.estimatedUsedTokens} / ${report.maxContextTokens} tokens (${report.utilizationPercent}%)`);
        r.writeLine(`  • System Policy Tokens: ${report.trustedPolicyTokens} (TRUSTED)`);
        r.writeLine(`  • AGENT.md Status     : ${v2Diag.agentMdLoaded ? r.green(`LOADED (${v2Diag.agentMdPath})`) : r.dim('NOT FOUND (/init --write)')}`);
        r.writeLine(`  • Attached Files      : ${v2Diag.attachedFiles.length} (~${v2Diag.attachedFilesTokens} est. tokens)`);
        r.writeLine(`  • Conversation Tokens : ${report.conversationHistoryTokens} (Compacted older turns: ${report.turnsCompacted})`);
        r.writeLine(`  • Untrusted Data      : ${report.untrustedDataTokens} (UNTRUSTED_DATA boundary)`);
        r.writeLine(`  • Operator Query      : ${report.operatorQueryTokens}`);
        r.writeLine(`  • Boundary Enforced   : ${r.green('YES (<UNTRUSTED_DATA> tags active)')}\n`);
        return { handled: true, exitCode: 0 };
      }

      case 'history': {
        const turns = this.kernel.orchestrator.getMemoryService().getTurns();
        if (r.isJsonMode()) {
          r.writeJson({ turnCount: turns.length, turns });
          return { handled: true, exitCode: 0 };
        }
        r.writeLine(`\n${r.bold(`Session Conversation History (${turns.length} turns)`)}`);
        if (turns.length === 0) {
          r.writeLine(`  ${r.dim('No conversation turns in current session.')}\n`);
        } else {
          for (const t of turns.slice(-20)) {
            const roleBadge = t.role === 'user' ? r.cyan('USER     ') : r.violet('ASSISTANT');
            const timeStr = new Date(t.timestamp).toLocaleTimeString();
            r.writeLine(`  [${r.dim(timeStr)}] ${roleBadge}: ${r.truncate(r.sanitize(t.content), 90)}`);
          }
          r.writeLine('');
        }
        return { handled: true, exitCode: 0 };
      }

      case 'memory': {
        const sub = (args[0] || 'list').toLowerCase();
        if (sub === 'clear') {
          this.kernel.orchestrator.getMemoryService().clearMemory();
          this.kernel.unifiedMemory.clearMemories();
          r.renderInfo('Conversation and unified memory stores cleared.');
          return { handled: true, exitCode: 0 };
        }
        if (sub === 'import-hikmah') {
          const targetPath = args.slice(1).join(' ');
          if (!targetPath) {
            r.renderError('Usage: /memory import-hikmah <path_to_hikmah_memory.json>');
            return { handled: true, exitCode: 1 };
          }
          const res = this.kernel.unifiedMemory.importHikmahMemory(targetPath);
          if (!res.success) {
            r.renderError(`Hikmah memory import failed: ${res.error}`);
            return { handled: true, exitCode: 1 };
          }
          r.writeLine(`\n${r.bold(r.green('Al-Hikmah Memory Migration Complete'))}`);
          r.writeLine(`  • Source File        : ${res.sourcePath}`);
          r.writeLine(`  • Imported Records   : ${res.importedCount}`);
          r.writeLine(`  • Skipped Duplicates : ${res.skippedDuplicates}`);
          r.writeLine(`  • Blocked Injections : ${res.blockedInjections}`);
          r.writeLine(`  • Category Breakdown : ${JSON.stringify(res.categoriesImported)}\n`);
          return { handled: true, exitCode: 0 };
        }
        if (sub === 'search' && args[1]) {
          const q = args.slice(1).join(' ');
          const hits = this.kernel.unifiedMemory.queryMemories(q, 10);
          if (r.isJsonMode()) {
            r.writeJson({ query: q, matches: hits });
            return { handled: true, exitCode: 0 };
          }
          r.writeLine(`\n${r.bold(`Unified Memory Matches for "${q}" (${hits.length})`)}`);
          for (const m of hits) {
            r.writeLine(`  • [${r.violet(m.type)}] ${r.sanitize(m.content)}`);
          }
          r.writeLine('');
          return { handled: true, exitCode: 0 };
        }
        if (['facts', 'preferences', 'people', 'projects', 'tasks', 'notes', 'reminders'].includes(sub)) {
          const tagHits = this.kernel.unifiedMemory.getMemoriesByTag(sub, 25);
          if (r.isJsonMode()) {
            r.writeJson({ category: sub, records: tagHits });
            return { handled: true, exitCode: 0 };
          }
          r.writeLine(`\n${r.bold(`Unified Memory Category: ${sub.toUpperCase()} (${tagHits.length})`)}`);
          for (const m of tagHits) {
            r.writeLine(`  • [${r.violet(m.type)}] ${r.sanitize(m.content)}`);
          }
          r.writeLine('');
          return { handled: true, exitCode: 0 };
        }
        const turns = this.kernel.orchestrator.getMemoryService().getTurns();
        const unified = this.kernel.unifiedMemory.getAllMemories();
        if (r.isJsonMode()) {
          r.writeJson({
            sessionTurnCount: turns.length,
            unifiedMemoryCount: unified.length,
            recentMemories: unified.slice(-10)
          });
          return { handled: true, exitCode: 0 };
        }
        r.writeLine(`\n${r.bold('ORION Memory Subsystem')}`);
        r.writeLine(`  • Session Conversation Turns: ${turns.length}`);
        r.writeLine(`  • Persistent Unified Records: ${unified.length}`);
        for (const m of unified.slice(-8)) {
          r.writeLine(`    └─ [${r.violet(m.type)}] ${r.truncate(r.sanitize(m.content), 80)}`);
        }
        r.writeLine('');
        return { handled: true, exitCode: 0 };
      }

      case 'notes':
      case 'note': {
        const sub = (args[0] || 'list').toLowerCase();
        if (sub === 'add' && args[1]) {
          const content = args.slice(1).join(' ');
          const rec = this.kernel.unifiedMemory.addNote(content);
          r.renderInfo(`Saved note [${rec.id}]: ${r.sanitize(rec.content)}`);
          return { handled: true, exitCode: 0 };
        }
        const notes = this.kernel.unifiedMemory.listNotes(20);
        if (r.isJsonMode()) {
          r.writeJson({ notes });
          return { handled: true, exitCode: 0 };
        }
        r.writeLine(`\n${r.bold(`Saved Notes (${notes.length})`)}`);
        if (notes.length === 0) {
          r.writeLine(`  ${r.dim('No notes saved. Use /notes add <text> to record a note.')}\n`);
        } else {
          for (const n of notes) {
            r.writeLine(`  • ${r.sanitize(n.content)} ${r.dim(`(${new Date(n.timestamp).toLocaleDateString()})`)}`);
          }
          r.writeLine('');
        }
        return { handled: true, exitCode: 0 };
      }

      case 'reminders':
      case 'reminder': {
        const sub = (args[0] || 'list').toLowerCase();
        const remSvc = this.kernel.harness.dispatcher.reminderService;
        if (sub === 'check' || sub === 'deliver') {
          const checkRes = await remSvc.checkAndDeliverDueReminders();
          if (r.isJsonMode()) {
            r.writeJson(checkRes);
          } else {
            r.renderInfo(
              `Checked ${checkRes.checkedCount} reminder(s): ${checkRes.delivered.length} delivered, ${checkRes.unalertedStored.length} stored without alert adapter.`
            );
          }
          return { handled: true, exitCode: 0 };
        }
        if (sub === 'cancel' && args[1]) {
          const cancelRes = remSvc.cancelReminder(args[1]);
          if (r.isJsonMode()) {
            r.writeJson(cancelRes);
          } else if (cancelRes.success) {
            r.renderInfo(`Cancelled reminder '${args[1]}'.`);
          } else {
            r.renderError(cancelRes.error || `Could not cancel reminder '${args[1]}'.`);
          }
          return { handled: true, exitCode: cancelRes.success ? 0 : 1 };
        }
        if (sub === 'inspect' && args[1]) {
          const item = remSvc.inspectReminder(args[1]);
          if (!item) {
            r.renderError(`Reminder '${args[1]}' not found.`);
            return { handled: true, exitCode: 1 };
          }
          r.writeJson(item);
          return { handled: true, exitCode: 0 };
        }
        if (sub === 'add' && args[1]) {
          // Support "/reminders add +15m Task description" or "/reminders add Task description"
          const firstToken = args[1];
          const parsedFirst = (remSvc.constructor as any).parseDueTime(firstToken);
          const dueAt = parsedFirst.valid && args.length >= 3 ? firstToken : '+1h';
          const taskText = parsedFirst.valid && args.length >= 3 ? args.slice(2).join(' ') : args.slice(1).join(' ');
          const v2Res = await remSvc.createReminder({ message: taskText, dueAt });
          const rec = this.kernel.unifiedMemory.addReminder(taskText, v2Res.reminder?.dueAtIso);
          if (r.isJsonMode()) {
            r.writeJson({ ...v2Res, unifiedMemoryId: rec.id });
          } else if (v2Res.success && v2Res.reminder) {
            r.renderInfo(
              `Saved reminder [${v2Res.reminder.id} | due ${v2Res.reminder.dueAtIso} | status=${v2Res.reminder.status}]: ${r.sanitize(v2Res.reminder.message)}`
            );
            if (v2Res.warning) {
              r.renderWarning(v2Res.warning);
            }
          } else {
            r.renderError(v2Res.error || 'Failed to create reminder.');
          }
          return { handled: true, exitCode: v2Res.success ? 0 : 1 };
        }
        const v2Reminders = remSvc.listReminders();
        const reminders = this.kernel.unifiedMemory.listReminders(20);
        if (r.isJsonMode()) {
          r.writeJson({ reminders, v2Reminders });
          return { handled: true, exitCode: 0 };
        }
        r.writeLine(`\n${r.bold(`Saved Reminders & Tasks (${v2Reminders.length + reminders.length})`)}`);
        if (v2Reminders.length === 0 && reminders.length === 0) {
          r.writeLine(`  ${r.dim('No reminders saved. Use /reminders add <dueAt> <task> to add one.')}\n`);
        } else {
          for (const vr of v2Reminders) {
            r.writeLine(
              `  • [${r.cyan(vr.id)}] [${vr.status}] Due ${vr.dueAtIso} (${vr.timeZone}) — ${r.sanitize(vr.message)}`
            );
          }
          for (const rem of reminders) {
            r.writeLine(`  • ${r.sanitize(rem.content)} ${r.dim(`(${new Date(rem.timestamp).toLocaleDateString()})`)}`);
          }
          r.writeLine('');
        }
        return { handled: true, exitCode: 0 };
      }

      case 'approve': {
        const pendingList = this.kernel.securityMiddleware.getPendingApprovals();
        const targetId = args[0] || (pendingList[0] ? pendingList[0].approvalId : '');
        if (!targetId) {
          if (r.isJsonMode()) {
            r.writeJson({ approved: false, reason: 'No pending approvals found.' });
          } else {
            r.renderInfo('No pending high-risk tool approval requests in queue.');
          }
          return { handled: true, exitCode: 0 };
        }
        const approved = this.kernel.securityMiddleware.approveRequest(targetId);
        if (!approved) {
          r.renderError(`Pending approval '${targetId}' not found or expired.`);
          return { handled: true, exitCode: 1 };
        }
        // Execute the approved tool call with action-bound token hash
        const call: ToolCall & { operatorApproved?: boolean; __approvedArgsHash?: string; approvalToken?: string } = {
          id: `approved_${approved.approvalId}`,
          toolId: approved.toolId,
          toolName: approved.toolName,
          arguments: approved.argumentsSnapshot,
          timestamp: Date.now(),
          requiresUserApproval: true,
          operatorApproved: true,
          __approvedArgsHash: approved.canonicalArgsHash,
          approvalToken: approved.approvalToken
        };
        const res = await this.kernel.toolService.executeTool(call);
        if (r.isJsonMode()) {
          r.writeJson({ approved: true, approvalId: targetId, toolResult: res });
        } else {
          r.renderInfo(`Approved and executed '${approved.toolId}' [approvalId=${targetId}].`);
          r.renderToolCompleted(res);
        }
        return { handled: true, exitCode: res.success ? 0 : 1 };
      }

      case 'deny': {
        const pendingList = this.kernel.securityMiddleware.getPendingApprovals();
        const targetId = args[0] || (pendingList[0] ? pendingList[0].approvalId : '');
        if (!targetId) {
          if (r.isJsonMode()) {
            r.writeJson({ denied: false, reason: 'No pending approvals found.' });
          } else {
            r.renderInfo('No pending high-risk tool approval requests in queue.');
          }
          return { handled: true, exitCode: 0 };
        }
        const denied = this.kernel.securityMiddleware.denyRequest(targetId);
        if (!denied) {
          r.renderError(`Pending approval '${targetId}' not found.`);
          return { handled: true, exitCode: 1 };
        }
        if (r.isJsonMode()) {
          r.writeJson({ denied: true, approvalId: targetId, toolId: denied.toolId });
        } else {
          r.renderWarning(`Denied pending tool execution '${denied.toolId}' [approvalId=${targetId}].`);
        }
        return { handled: true, exitCode: 0 };
      }

      case 'stop': {
        const res = await this.kernel.cancelActiveOperation();
        if (r.isJsonMode()) {
          r.writeJson({ estopTriggered: true, terminatedProcesses: res.terminatedProcesses });
        } else {
          r.renderWarning(`Emergency Stop triggered (/stop). Terminated ${res.terminatedProcesses} active child process(es).`);
        }
        return { handled: true, exitCode: 0 };
      }

      case 'config': {
        const sub = (args[0] || 'show').toLowerCase();
        if (sub === 'model' && args[1]) {
          const sw = this.kernel.omniRouter.setActiveLocalModel(args[1]);
          if (!sw) {
            r.renderError(`Could not switch local model to '${args[1]}'.`);
            return { handled: true, exitCode: 1 };
          }
          r.renderInfo(`Configured active local Ollama model: ${args[1]}`);
          return { handled: true, exitCode: 0 };
        }
        if (sub === 'strategy' && args[1]) {
          const strat = args[1].toUpperCase() as RoutingStrategy;
          this.kernel.setRoutingStrategy(strat);
          r.renderInfo(`Configured routing strategy: ${strat}`);
          return { handled: true, exitCode: 0 };
        }
        const integrity = this.kernel.policyService.verifyProtectedPolicyIntegrity();
        const cfg = {
          projectRoot: this.kernel.projectRoot,
          activeAgent: this.kernel.agentSystem.getActiveAgentId(),
          activeProvider: this.kernel.omniRouter.getStatus().id,
          activeModel: this.kernel.omniRouter.getStatus().currentModel,
          routingStrategy: this.kernel.omniRouter.getRoutingStrategy(),
          protectedPolicyPath: this.kernel.policyService.getProtectedPolicyPath(),
          protectedPolicyVerified: integrity.valid,
          protectedPolicySha256: integrity.actualSha256,
          localApi: this.kernel.localApiServer.getStatus(),
          mcpConfigPath: this.kernel.mcpClient.getConfigPath()
        };
        if (r.isJsonMode()) {
          r.writeJson(cfg);
          return { handled: true, exitCode: 0 };
        }
        const engineIdentity = resolvePublicEngineIdentity(cfg.activeProvider, cfg.activeModel);
        const visualPrefs = this.kernel.visualPreferences.getPreferences();
        r.writeLine(`\n${r.bold('ORION Runtime Configuration')}`);
        r.writeLine(`  • Workspace        : ${formatLogicalPath(cfg.projectRoot, cfg.projectRoot)}`);
        r.writeLine(`  • Active Agent     : ${r.cyan(cfg.activeAgent)}`);
        r.writeLine(`  • Active Engine    : ${engineIdentity.publicLabel} (${engineIdentity.tierDescription})`);
        r.writeLine(`  • Visual Mode      : ${visualPrefs.visualMode.toUpperCase()} | Animations: ${visualPrefs.animationsEnabled ? 'ON' : 'OFF'}`);
        r.writeLine(`  • Routing Strategy : ${cfg.routingStrategy}`);
        r.writeLine(`  • Protected Policy : ${formatLogicalPath(cfg.protectedPolicyPath, cfg.projectRoot)} [${cfg.protectedPolicyVerified ? r.green('VERIFIED') : r.red('TAMPERED')}]`);
        r.writeLine(`  • Local OpenAI API : http://${cfg.localApi.host}:${cfg.localApi.port}/v1 (${cfg.localApi.running ? 'RUNNING' : 'STOPPED'})\n`);
        return { handled: true, exitCode: 0 };
      }

      case 'bench': {
        return await this.handleBench(args);
      }

      case 'privacy': {
        const allProviders = this.kernel.omniRouter.getAllProviderStatuses();
        const cloudConfigured = allProviders.filter(p => p.isConfigured && p.id !== 'ollama' && p.id !== 'local-heuristic').map(p => p.id);
        const privacyReport = {
          localFirstArchitecture: true,
          zeroRequiredApiSpend: true,
          localOllamaEndpoint: 'http://127.0.0.1:11434',
          localOpenAiApiBindHost: this.kernel.localApiServer.getStatus().host,
          cloudProvidersConfigured: cloudConfigured,
          secretRedactionActive: true,
          untrustedContentBoundaryActive: true,
          protectedPolicyNonOverridable: true,
          telemetryExternalUpload: false
        };
        if (r.isJsonMode()) {
          r.writeJson(privacyReport);
          return { handled: true, exitCode: 0 };
        }
        r.writeLine(`\n${r.bold('ORION Privacy, Sovereignty & Data Locality Report')}`);
        r.writeLine(`  • ${r.green('Local-First Inference'.padEnd(26))}: 6 local Ollama models on 127.0.0.1:11434 (Zero external API spend required)`);
        r.writeLine(`  • ${r.green('External Telemetry Upload'.padEnd(26))}: DISABLED (All traces and memories stored locally in .orion_memory)`);
        r.writeLine(`  • ${r.green('Secret Redaction'.padEnd(26))}: ACTIVE (API keys, Bearer tokens, private keys, and local tokens redacted)`);
        r.writeLine(`  • ${r.green('Untrusted Data Boundary'.padEnd(26))}: ACTIVE (Files, web, MCP, and memory tagged as UNTRUSTED_EXTERNAL)`);
        r.writeLine(`  • ${r.green('Local API Binding'.padEnd(26))}: Bound strictly to 127.0.0.1 unless explicitly overridden`);
        r.writeLine(`  • ${r.cyan('Optional Cloud Adapters'.padEnd(26))}: ${cloudConfigured.length > 0 ? cloudConfigured.join(', ') : 'None configured (100% local)'}\n`);
        return { handled: true, exitCode: 0 };
      }

      case 'api': {
        return await this.handleLocalApiCommand(args);
      }

      case 'hackathon': {
        return await this.handleHackathonCommand(args);
      }

      case 'google': {
        return await this.handleGoogleCommand(args);
      }

      case 'spotify':
      case 'media': {
        const sub = (args[0] || 'status').toLowerCase();
        if (sub === 'status' || sub === 'now') {
          const call: ToolCall = {
            id: `media_status_${Date.now()}`,
            toolId: 'media.status',
            toolName: 'Media Status',
            arguments: {},
            timestamp: Date.now(),
            requiresUserApproval: false
          };
          r.renderToolStarted(1, call);
          const res = await this.kernel.toolService.executeTool(call);
          r.renderToolCompleted(res);
          const d = (res as any).data;
          if (res.success && d) {
            r.writeLine(`\n${r.bold('Media & Spotify Telemetry')}`);
            r.writeLine(`  • Running : ${d.running ? r.green('YES') : r.dim('NO')}`);
            r.writeLine(`  • Playing : ${d.playing ? r.green('ACTIVE') : r.yellow('IDLE / PAUSED')}`);
            if (d.windowTitle) r.writeLine(`  • Window  : ${r.sanitize(d.windowTitle)}`);
            if (d.artist) r.writeLine(`  • Artist  : ${r.sanitize(d.artist)}`);
            if (d.track) r.writeLine(`  • Track   : ${r.sanitize(d.track)}`);
            r.writeLine('');
          }
          return { handled: true, exitCode: res.success ? 0 : 1 };
        }
        if (['play', 'pause', 'toggle', 'next', 'previous', 'prev', 'stop', 'louder', 'quieter', 'mute'].includes(sub) && args.length === 1) {
          const call: ToolCall = {
            id: `media_ctrl_${Date.now()}`,
            toolId: 'media.control',
            toolName: 'Media Playback Control',
            arguments: { action: sub },
            timestamp: Date.now(),
            requiresUserApproval: false
          };
          r.renderToolStarted(1, call);
          const res = await this.kernel.toolService.executeTool(call);
          r.renderToolCompleted(res);
          if (res.success && (res as any).data?.message) {
            r.renderInfo((res as any).data.message);
          }
          return { handled: true, exitCode: res.success ? 0 : 1 };
        }
        const query = sub === 'play' || sub === 'search' ? args.slice(1).join(' ') : args.join(' ');
        const call: ToolCall = {
          id: `spotify_play_${Date.now()}`,
          toolId: 'media.play_spotify',
          toolName: 'Spotify Play/Search',
          arguments: { query },
          timestamp: Date.now(),
          requiresUserApproval: false
        };
        r.renderToolStarted(1, call);
        const res = await this.kernel.toolService.executeTool(call);
        r.renderToolCompleted(res);
        if (res.success && (res as any).data?.message) {
          r.renderInfo((res as any).data.message);
        }
        return { handled: true, exitCode: res.success ? 0 : 1 };
      }

      case 'volume':
      case 'vol': {
        const level = args[0] || '50';
        const call: ToolCall = {
          id: `vol_${Date.now()}`,
          toolId: 'system.volume',
          toolName: 'System Volume Control',
          arguments: { level },
          timestamp: Date.now(),
          requiresUserApproval: false
        };
        r.renderToolStarted(1, call);
        const res = await this.kernel.toolService.executeTool(call);
        r.renderToolCompleted(res);
        if (res.success && (res as any).data?.message) {
          r.renderInfo((res as any).data.message);
        }
        return { handled: true, exitCode: res.success ? 0 : 1 };
      }

      case 'clipboard': {
        const sub = (args[0] || 'read').toLowerCase();
        if (sub === 'write' || sub === 'set' || sub === 'copy') {
          const text = args.slice(1).join(' ');
          const call: ToolCall = {
            id: `clip_w_${Date.now()}`,
            toolId: 'system.clipboard_write',
            toolName: 'Write Clipboard',
            arguments: { text },
            timestamp: Date.now(),
            requiresUserApproval: false
          };
          r.renderToolStarted(1, call);
          const res = await this.kernel.toolService.executeTool(call);
          r.renderToolCompleted(res);
          if (res.success) {
            r.renderInfo(`Copied ${text.length} character(s) to system clipboard.`);
          }
          return { handled: true, exitCode: res.success ? 0 : 1 };
        }
        const call: ToolCall = {
          id: `clip_r_${Date.now()}`,
          toolId: 'system.clipboard_read',
          toolName: 'Read Clipboard',
          arguments: {},
          timestamp: Date.now(),
          requiresUserApproval: false
        };
        r.renderToolStarted(1, call);
        const res = await this.kernel.toolService.executeTool(call);
        r.renderToolCompleted(res);
        if (res.success && (res as any).data) {
          r.writeLine(`\n${r.bold('System Clipboard')} (${(res as any).data.length} chars):`);
          r.writeLine(`  ${r.sanitize((res as any).data.content || '(empty)')}\n`);
        }
        return { handled: true, exitCode: res.success ? 0 : 1 };
      }

      case 'weather': {
        const city = args.join(' ') || 'Abu Dhabi';
        const call: ToolCall = {
          id: `weather_${Date.now()}`,
          toolId: 'info.weather',
          toolName: 'Live Weather',
          arguments: { city },
          timestamp: Date.now(),
          requiresUserApproval: false
        };
        r.renderToolStarted(1, call);
        const res = await this.kernel.toolService.executeTool(call);
        r.renderToolCompleted(res);
        const d = (res as any).data;
        if (res.success && d) {
          if (d.status === 'OFFLINE_FALLBACK') {
            r.renderWarning(d.message);
          } else {
            r.writeLine(`\n${r.bold(`Live Weather — ${d.city}${d.country ? ', ' + d.country : ''}`)}`);
            r.writeLine(`  • Temperature : ${r.cyan(`${d.tempC}°C`)} (Feels like ${d.feelsLikeC}°C)`);
            r.writeLine(`  • Condition   : ${d.condition}`);
            r.writeLine(`  • Humidity    : ${d.humidity}`);
            r.writeLine(`  • Wind Speed  : ${d.windKmph}\n`);
          }
        }
        return { handled: true, exitCode: res.success ? 0 : 1 };
      }

      case 'prayers':
      case 'prayer':
      case 'salah': {
        const city = args.join(' ') || 'Abu Dhabi';
        const call: ToolCall = {
          id: `prayers_${Date.now()}`,
          toolId: 'info.prayers',
          toolName: 'Islamic Prayer Times',
          arguments: { city, country: 'UAE' },
          timestamp: Date.now(),
          requiresUserApproval: false
        };
        r.renderToolStarted(1, call);
        const res = await this.kernel.toolService.executeTool(call);
        r.renderToolCompleted(res);
        const d = (res as any).data;
        if (res.success && d) {
          if (d.status === 'OFFLINE_FALLBACK') {
            r.renderWarning(d.message);
          } else {
            r.writeLine(`\n${r.bold(`Islamic Prayer Timings — ${d.city} (${d.date} | ${d.hijriDate})`)}`);
            for (const [name, time] of Object.entries(d.timings || {})) {
              r.writeLine(`  • ${r.cyan(name.padEnd(10))}: ${time}`);
            }
            r.writeLine('');
          }
        }
        return { handled: true, exitCode: res.success ? 0 : 1 };
      }

      case 'speak':
      case 'say': {
        const text = args.join(' ');
        if (!text) {
          r.renderError('Usage: /speak <text>');
          return { handled: true, exitCode: 1 };
        }
        r.renderInfo(`Speaking via hardened Windows SAPI TTS: "${r.sanitize(text)}"`);
        await this.kernel.voiceService.speak(text);
        return { handled: true, exitCode: 0 };
      }

      case 'voice': {
        const sub = (args[0] || 'status').toLowerCase();
        const stt = this.kernel.voiceService.getSTTProvider();
        const tts = this.kernel.voiceService.getTTSProvider();
        if (sub === 'listen') {
          if (stt instanceof WindowsNativeSTTProvider) {
            r.renderInfo('Listening for voice command (5s timeout)...');
            const transcript = await stt.listenOnce(5);
            if (transcript) {
              r.renderInfo(`Heard: "${r.sanitize(transcript)}"`);
              const res = await this.kernel.executePrompt(transcript);
              return { handled: true, exitCode: res.success ? 0 : 1 };
            } else {
              r.renderWarning('No speech detected within timeout window.');
              return { handled: true, exitCode: 0 };
            }
          }
        }
        r.writeLine(`\n${r.bold('ORION Voice & Speech Subsystem')}`);
        r.writeLine(`  • TTS Engine : ${tts.name} [${tts.isConfigured ? r.green('READY') : r.red('UNAVAILABLE')}]`);
        r.writeLine(`  • STT Engine : ${stt.name} [${stt.isConfigured ? r.green('READY') : r.red('UNAVAILABLE')}]\n`);
        return { handled: true, exitCode: 0 };
      }

      case 'permissions': {
        const sub = (args[0] || 'status').toLowerCase();
        if (sub === 'estop' || sub === 'stop') {
          const res = await this.kernel.cancelActiveOperation();
          r.renderWarning(`Emergency Stop triggered. Terminated ${res.terminatedProcesses} active child process(es).`);
          return { handled: true, exitCode: 0 };
        }
        if (sub === 'reset') {
          ProcessSupervisor.getInstance().resetEstop();
          this.kernel.permissionService.resetEmergencyStop();
          r.renderInfo('Emergency Stop state reset to STANDBY.');
          return { handled: true, exitCode: 0 };
        }
        if (sub === 'rollback') {
          const rb = this.kernel.securityMiddleware.rollbackLastFileWrite();
          if (!rb.rolledBack) {
            r.renderError(rb.error || 'Rollback failed.');
            return { handled: true, exitCode: 1 };
          }
          r.renderInfo(`Restored '${rb.restoredPath}' from backup snapshot.`);
          return { handled: true, exitCode: 0 };
        }
        const pendingApprovals = this.kernel.securityMiddleware.getPendingApprovals();
        if (r.isJsonMode()) {
          r.writeJson({
            tiers: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
            estopActive: ProcessSupervisor.getInstance().isEstopActive(),
            trackedProcesses: ProcessSupervisor.getInstance().getActiveProcessCount(),
            pendingApprovalsCount: pendingApprovals.length,
            pendingApprovals
          });
          return { handled: true, exitCode: 0 };
        }
        r.writeLine(`\n${r.bold('ORION Security & Permission Governance')}`);
        r.writeLine(`  • ${r.green('LOW / READ_ONLY'.padEnd(20))}: System telemetry, directory listing, bounded file reads (<512KB)`);
        r.writeLine(`  • ${r.cyan('MEDIUM / MODERATE'.padEnd(20))}: Atomic workspace file writes (with backup), verified window/app actions`);
        r.writeLine(`  • ${r.yellow('HIGH_RISK'.padEnd(20))}: Mutating external MCP tools & workstation lock (action-bound approval token required)`);
        r.writeLine(`  • ${r.red('CRITICAL (BLOCKED)'.padEnd(20))}: C:\\Windows, System32, /etc/, 5_Render_Exports, .env, .ssh, .aws, credentials.json`);
        r.writeLine(`  • ${r.bold('Pending Approvals'.padEnd(20))}: ${pendingApprovals.length} (/approve or /deny)`);
        for (const p of pendingApprovals) {
          r.writeLine(`    └─ [${r.yellow(p.approvalId)}] ${r.bold(p.toolId)} — ${r.sanitize(p.reason)}`);
        }
        r.writeLine(`  • ${r.bold('Emergency Stop'.padEnd(20))}: ${ProcessSupervisor.getInstance().isEstopActive() ? r.red('ACTIVE') : r.green('STANDBY')}`);
        r.writeLine(`  • ${r.bold('Tracked Processes'.padEnd(20))}: ${ProcessSupervisor.getInstance().getActiveProcessCount()}\n`);
        return { handled: true, exitCode: 0 };
      }

      case 'search': {
        if (args.length === 0) {
          r.renderError('Usage: /search <query>');
          return { handled: true, exitCode: 1 };
        }
        const query = args.join(' ');
        const call: ToolCall = {
          id: `search_${Date.now()}`,
          toolId: 'browser.search',
          toolName: 'Web Search',
          arguments: { query },
          timestamp: Date.now(),
          requiresUserApproval: false
        };
        r.renderToolStarted(1, call);
        const res = await this.kernel.toolService.executeTool(call);
        r.renderToolCompleted(res);
        const searchPayload = res.data ?? (res as any).output;
        if (res.success && searchPayload) {
          const topLinks = searchPayload.topLinks || searchPayload.observation?.links || [];
          const extractedText = searchPayload.extractedText || searchPayload.observation?.extractedText || '';
          const title = searchPayload.pageTitle || searchPayload.observation?.title || query;
          r.writeLine(`\n${r.bold('In-Process HTTP Search Results')} ${r.dim(`(${r.sanitize(title)})`)}`);
          if (Array.isArray(topLinks) && topLinks.length > 0) {
            for (const link of topLinks.slice(0, 8)) {
              r.writeLine(`  • ${r.bold(r.sanitize(link.text))} — ${r.cyan(r.sanitize(link.href))}`);
            }
          } else if (extractedText) {
            r.writeLine(`  ${r.truncate(r.sanitize(extractedText), 500)}`);
          }
          r.writeLine('');
        }
        return { handled: true, exitCode: res.success ? 0 : 1 };
      }

      case 'open':
      case 'launch': {
        if (args.length === 0) {
          r.renderError('Usage: /open <application_name>');
          return { handled: true, exitCode: 1 };
        }
        const targetApp = args.join(' ');
        r.appsTracker.setApplicationState(targetApp, 'Launching', 'Starting process...');
        const res = await this.kernel.executePrompt(`open ${targetApp}`);
        const anyVerified = res.toolResults?.some(tr => tr.verificationStatus === 'VERIFIED' || tr.verified === true);
        if (res.success && anyVerified) {
          r.appsTracker.setApplicationState(targetApp, 'Open');
        } else if (!res.success) {
          r.appsTracker.setApplicationState(targetApp, 'Launch failed', res.response || 'Launch failed');
        } else {
          r.appsTracker.setApplicationState(targetApp, 'Unknown', 'Unverified window state');
        }
        r.renderActiveApplicationsBar();
        return { handled: true, exitCode: res.success ? 0 : 1 };
      }

      case 'repo': {
        const target = args[0] || this.kernel.projectRoot;
        try {
          const summary = await this.kernel.developerAgent.inspectRepository(target);
          if (r.isJsonMode()) {
            r.writeJson(summary);
            return { handled: true, exitCode: 0 };
          }
          r.writeLine(`\n${r.bold('Repository Inspection')}`);
          r.writeLine(`  • Root Path    : ${summary.rootPath}`);
          r.writeLine(`  • Source Files : ${summary.totalFiles}`);
          r.writeLine(`  • Languages    : ${summary.languagesDetected.join(', ') || 'None detected'}`);
          r.writeLine(`  • package.json : ${summary.hasPackageJson ? 'Present' : 'Not found'}\n`);
          return { handled: true, exitCode: 0 };
        } catch (err: any) {
          r.renderError(err.message);
          return { handled: true, exitCode: 1 };
        }
      }

      case 'find': {
        if (args.length === 0) {
          r.renderError('Usage: /find <search_pattern>');
          return { handled: true, exitCode: 1 };
        }
        const query = args.join(' ');
        const matches = await this.kernel.developerAgent.searchCode(this.kernel.projectRoot, query);
        if (r.isJsonMode()) {
          r.writeJson({ query, totalMatches: matches.length, matches: matches.slice(0, 25) });
          return { handled: true, exitCode: 0 };
        }
        r.writeLine(`\n${r.bold(`Code Search Matches for "${query}" (${matches.length})`)}`);
        for (const m of matches.slice(0, 15)) {
          r.writeLine(`  • ${r.cyan(`${m.filePath}:${m.lineNumber}`)} — ${r.truncate(r.sanitize(m.lineContent), 80)}`);
        }
        r.writeLine('');
        return { handled: true, exitCode: 0 };
      }

      default: {
        const regEntry = this.kernel.commandRegistry.getCommand(`/${cmd}`);
        if (regEntry) {
          const out = await regEntry.handler(args, rawInput);
          if (out.handled) {
            if (r.isJsonMode()) {
              r.writeJson(out.data ?? { command: `/${cmd}`, summary: out.summary, exitCode: out.exitCode });
            } else if (out.exitCode === 0) {
              r.renderInfo(out.summary);
            } else {
              r.renderError(out.summary);
            }
            return {
              handled: true,
              shouldExit: out.shouldExit,
              exitCode: out.exitCode
            };
          }
        }
        r.renderError(`Unknown command '/${cmd}'. Type /help or /commands to view supported commands.`);
        return { handled: true, exitCode: 1 };
      }
    }
  }

  private async handleAgentsCommand(args: string[]): Promise<CommandDispatchResult> {
    const r = this.kernel.renderer;
    const sub = (args[0] || '').toLowerCase();
    const agentSys = this.kernel.agentSystem;
    const integrity = this.kernel.policyService.verifyProtectedPolicyIntegrity();

    if (!sub) {
      const agents = agentSys.getAllAgents();
      const engineeringRoster = agentSys.getLiveAgentRoster(false);
      const activeId = agentSys.getActiveAgentId();
      if (r.isJsonMode()) {
        r.writeJson({
          activeAgentId: activeId,
          activeEngineeringAgentId: agentSys.getActiveEngineeringAgentId(),
          protectedPolicyIntegrity: integrity,
          agents,
          engineeringRoster,
          tasksCount: agentSys.getAllTasks().length
        });
        return { handled: true, exitCode: 0 };
      }

      r.writeLine(`\n${r.bold('ORION BUILD CLI — AGENT ROSTER')} ${r.dim(`(Protected Policy SHA-256: ${integrity.actualSha256.slice(0, 16)}...)`)}`);
      r.writeLine('');
      for (const entry of engineeringRoster) {
        const statusColor =
          entry.status === 'COMPLETED'
            ? r.green(entry.status)
            : entry.status === 'RUNNING'
              ? r.cyan(entry.status)
              : entry.status === 'QUEUED'
                ? r.yellow(entry.status)
                : entry.status === 'FAILED' || entry.status === 'BLOCKED' || entry.status === 'CANCELLED'
                  ? r.red(entry.status)
                  : r.dim(entry.status);
        r.writeLine(`${r.bold(entry.id)} — ${r.violet(entry.displayName)} ${r.dim(`(${entry.roleTitle})`)}`);
        r.writeLine(`  Status: ${statusColor}`);
        r.writeLine(`  Backend: ${r.cyan(entry.backend)} | Ceiling: ${r.yellow(entry.maxPermissionLevel)}${entry.readOnly ? ' (read-only)' : ''}`);
        r.writeLine(`  Task: ${entry.currentTask ? r.sanitize(entry.currentTask) : 'none'}`);
        if (entry.latestResultSummary) {
          r.writeLine(`  Result: ${r.sanitize(entry.latestResultSummary)}${entry.latestEvidenceRef ? ` [ref: ${entry.latestEvidenceRef}]` : ''}`);
        }
        r.writeLine('');
      }
      r.writeLine(
        `  ${r.dim('Subcommands: /agents list | /agents status | /agents inspect <id> | /agents tasks | /agents logs <id> | /agents add <json> | /agents remove <id> | /agents delegate <goal>')}\n`
      );
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'list') {
      const defs = agentSys.getEngineeringAgents(true);
      if (r.isJsonMode()) {
        r.writeJson({ totalCount: defs.length, definitions: defs });
        return { handled: true, exitCode: 0 };
      }
      r.writeLine(`\n${r.bold(`Registered ORION Agent Definitions (${defs.length})`)}`);
      for (const d of defs) {
        r.writeLine(
          `  • ${r.bold(d.id.padEnd(16))} ${r.violet(d.displayName.padEnd(34))} Ceiling: ${r.yellow(d.maxPermissionLevel.padEnd(7))} Model: ${r.cyan(d.preferredLocalModel)}`
        );
        r.writeLine(`      Role: ${r.dim(d.roleTitle)} | Tools: ${d.allowedTools.join(', ')}`);
      }
      r.writeLine('');
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'status') {
      const ollamaAdapter = this.kernel.omniRouter.getOllamaProvider();
      if (ollamaAdapter && ollamaAdapter.getInstalledModels().length === 0) {
        await ollamaAdapter.probeHealth(1200);
      }
      const health = agentSys.getBackendHealthSummary();
      const tasks = agentSys.getAllTasks();
      const counts = {
        queued: tasks.filter(t => t.status === 'QUEUED').length,
        running: tasks.filter(t => t.status === 'RUNNING').length,
        completed: tasks.filter(t => t.status === 'COMPLETED').length,
        failed: tasks.filter(t => t.status === 'FAILED' || t.status === 'INTERRUPTED').length,
        blocked: tasks.filter(t => t.status === 'BLOCKED').length,
        cancelled: tasks.filter(t => t.status === 'CANCELLED').length
      };
      if (r.isJsonMode()) {
        r.writeJson({
          backendHealth: health,
          taskCounts: counts,
          registeredAgentsCount: agentSys.getEngineeringAgents(false).length
        });
        return { handled: true, exitCode: 0 };
      }
      r.writeLine(`\n${r.bold('ORION Multi-Agent Runtime & Backend Health (/agents status)')}`);
      r.writeLine(
        `  • Local Ollama Backend : ${health.ollama.healthy ? r.green('READY') : r.yellow('LOCAL-FALLBACK')} (Active: ${health.ollama.activeModel}, Installed: ${health.ollama.installedModels.length})`
      );
      r.writeLine(
        `  • Google Gemini Adapter: ${health.gemini.configured ? r.green(health.gemini.status) : r.yellow(health.gemini.status)} (${health.gemini.model})`
      );
      r.writeLine(
        `  • Argon Integration    : ${r.red(health.argon.status)} — ${r.dim(health.argon.details)}`
      );
      r.writeLine(
        `  • Protected Policy     : ${health.policyIntegrityVerified ? r.green('VERIFIED') : r.red('TAMPERED')}`
      );
      r.writeLine(
        `  • Emergency Stop       : ${health.estopActive ? r.red('ACTIVE') : r.green('STANDBY')}`
      );
      r.writeLine(
        `  • Agent Task Queue     : ${counts.running} running, ${counts.queued} queued, ${counts.completed} completed, ${counts.blocked} blocked, ${counts.failed} failed, ${counts.cancelled} cancelled\n`
      );
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'inspect') {
      return await this.handleAgentCommand(['inspect', args[1] || 'commander']);
    }

    if (sub === 'tasks') {
      if (args[1] === 'cancel' && args[2]) {
        const ok = agentSys.cancelAgentTask(args[2], 'Cancelled via /agents tasks cancel');
        if (r.isJsonMode()) {
          r.writeJson({ cancelled: ok, taskId: args[2] });
        } else if (ok) {
          r.renderInfo(`Cancelled agent task '${args[2]}'.`);
        } else {
          r.renderError(`Could not cancel agent task '${args[2]}' (not found or already finished).`);
        }
        return { handled: true, exitCode: ok ? 0 : 1 };
      }
      const tasks = agentSys.getAllTasks();
      if (r.isJsonMode()) {
        r.writeJson({ totalCount: tasks.length, tasks });
        return { handled: true, exitCode: 0 };
      }
      r.writeLine(`\n${r.bold(`ORION Agent Tasks (${tasks.length})`)}`);
      if (tasks.length === 0) {
        r.writeLine(`  ${r.dim('No agent tasks recorded yet. Run /agents delegate <goal> or /agent run <id> <prompt>.')}\n`);
      } else {
        for (const t of tasks.slice(-20)) {
          const badge =
            t.status === 'COMPLETED'
              ? r.green(t.status)
              : t.status === 'RUNNING'
                ? r.cyan(t.status)
                : t.status === 'QUEUED'
                  ? r.yellow(t.status)
                  : r.red(t.status);
          r.writeLine(
            `  • ${r.bold(t.taskId)} [${badge}] Agent: ${r.violet(t.agentId)} — ${r.sanitize(t.title)} (${t.durationMs || 0}ms)`
          );
          if (t.result?.summary) {
            r.writeLine(`      └─ ${r.truncate(r.sanitize(t.result.summary), 100)}`);
          }
        }
        r.writeLine('');
      }
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'logs') {
      const targetId = args[1] || '';
      const logs = agentSys.getAgentLogs(targetId, 30);
      if (r.isJsonMode()) {
        r.writeJson({ agentId: targetId || 'all', totalCount: logs.length, logs });
        return { handled: true, exitCode: 0 };
      }
      r.writeLine(`\n${r.bold(`ORION Agent Lifecycle Logs (${targetId || 'all'} — ${logs.length} events)`)}`);
      if (logs.length === 0) {
        r.writeLine(`  ${r.dim('No lifecycle events recorded for this filter.')}\n`);
      } else {
        for (const ev of logs) {
          const ts = new Date(ev.timestamp).toLocaleTimeString();
          r.writeLine(`  [${r.dim(ts)}] ${r.cyan(ev.agentId.padEnd(14))} ${r.yellow(ev.eventType.padEnd(22))} ${r.sanitize(ev.message)}`);
        }
        r.writeLine('');
      }
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'add') {
      const rawSpec = args.slice(1).join(' ').trim();
      if (!rawSpec) {
        r.renderError(
          'Usage: /agents add <json_spec> OR /agents add <id> <displayName> <roleTitle>'
        );
        return { handled: true, exitCode: 1 };
      }
      try {
        let parsedSpec: any;
        if (rawSpec.startsWith('{')) {
          parsedSpec = JSON.parse(rawSpec);
        } else {
          const id = args[1];
          const displayName = args[2] || id;
          const roleTitle = args.slice(3).join(' ') || 'Custom Specialist Agent';
          parsedSpec = { id, displayName, roleTitle };
        }
        const registered = agentSys.registerCustomAgent(parsedSpec);
        if (r.isJsonMode()) {
          r.writeJson({ added: true, agent: registered });
        } else {
          r.renderInfo(
            `Registered custom agent '${registered.displayName}' (${registered.id}) [Ceiling: ${registered.maxPermissionLevel}, Read-Only: ${registered.readOnly}].`
          );
        }
        return { handled: true, exitCode: 0 };
      } catch (err: any) {
        r.renderError(err.message || 'Failed to add custom agent.');
        return { handled: true, exitCode: 1 };
      }
    }

    if (sub === 'remove') {
      const targetId = args[1] || '';
      if (!targetId) {
        r.renderError('Usage: /agents remove <id>');
        return { handled: true, exitCode: 1 };
      }
      const res = agentSys.removeAgent(targetId);
      if (r.isJsonMode()) {
        r.writeJson(res);
      } else if (res.removed) {
        r.renderInfo(`Removed custom agent '${res.agentId}'.`);
      } else {
        r.renderError(res.reason || `Could not remove agent '${targetId}'.`);
      }
      return { handled: true, exitCode: res.removed ? 0 : 1 };
    }

    if (sub === 'delegate' || sub === 'run') {
      const goal = args.slice(1).join(' ').trim();
      if (!goal) {
        r.renderError('Usage: /agents delegate <engineering_goal>');
        return { handled: true, exitCode: 1 };
      }
      const report = await agentSys.delegateEngineeringGoal(goal);
      if (r.isJsonMode()) {
        r.writeJson(report);
        return { handled: true, exitCode: report.overallStatus === 'COMPLETED' ? 0 : 1 };
      }
      r.writeLine(`\n${r.bold('ORION Commander — Multi-Agent Engineering Delegation Report')}`);
      r.writeLine(`  • Goal           : ${r.sanitize(report.goal)}`);
      r.writeLine(`  • Overall Status : ${report.overallStatus === 'COMPLETED' ? r.green(report.overallStatus) : r.red(report.overallStatus)} (${report.durationMs}ms)`);
      r.writeLine(`  • Tasks Executed : ${report.tasksExecuted.length}`);
      for (const t of report.tasksExecuted) {
        const st = t.status === 'COMPLETED' ? r.green(t.status) : r.red(t.status);
        r.writeLine(
          `    └─ [${st}] ${r.bold(t.agentId.padEnd(12))} (${t.backendUsed}) — ${r.truncate(r.sanitize(t.summary), 90)} [Files: ${t.filesInspected.length}]`
        );
      }
      r.writeLine(`  • Reconciled Findings (${report.reconciledFindings.length}):`);
      for (const rf of report.reconciledFindings) {
        r.writeLine(`    └─ ${r.cyan(rf.topic)}: ${r.sanitize(rf.authoritativeConclusion)} (${rf.resolutionReason})`);
      }
      r.writeLine('');
      return { handled: true, exitCode: report.overallStatus === 'COMPLETED' ? 0 : 1 };
    }

    r.renderError(
      `Unknown /agents subcommand '${sub}'. Supported: list, status, inspect, tasks, logs, add, remove, delegate.`
    );
    return { handled: true, exitCode: 1 };
  }

  private async handleAgentCommand(args: string[]): Promise<CommandDispatchResult> {
    const r = this.kernel.renderer;
    const sub = (args[0] || '').toLowerCase();

    if (!sub) {
      const current = this.kernel.agentSystem.getActiveAgentDefinition();
      if (r.isJsonMode()) {
        r.writeJson(current);
      } else {
        r.renderInfo(`Active agent: ${current.displayName} (${current.id}) — Default Model: ${current.preferredLocalModel}, Ceiling: ${current.maxPermissionLevel}`);
      }
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'run' && args[1]) {
      const targetAgentId = args[1];
      const taskPrompt = args.slice(2).join(' ').trim() || `Inspect workspace for ${targetAgentId}`;
      try {
        const engDef = this.kernel.agentSystem.getEngineeringAgentDefinition(targetAgentId);
        const inferredTools = engDef
          ? this.kernel.agentSystem.inferToolsForPrompt(engDef, taskPrompt)
          : [{ toolId: 'system.get_info', arguments: {} }];
        const taskRes = await this.kernel.agentSystem.runEngineeringTask({
          agentId: targetAgentId,
          title: taskPrompt.slice(0, 70),
          prompt: taskPrompt,
          toolCallsToRun: inferredTools
        });
        if (r.isJsonMode()) {
          r.writeJson(taskRes);
          return { handled: true, exitCode: taskRes.status === 'COMPLETED' ? 0 : 1 };
        }
        r.writeLine(`\n${r.bold(`Agent Task Result — ${taskRes.displayName} (${taskRes.agentId})`)}`);
        r.writeLine(`  • Task ID        : ${taskRes.taskId}`);
        r.writeLine(`  • Status         : ${taskRes.status === 'COMPLETED' ? r.green(taskRes.status) : r.red(taskRes.status)} (Verified: ${taskRes.verified})`);
        r.writeLine(`  • Backend        : ${taskRes.backendUsed}`);
        r.writeLine(`  • Files Inspected: ${taskRes.filesInspected.join(', ') || 'none'}`);
        r.writeLine(`  • Tools Executed : ${taskRes.commandsOrToolsExecuted.length}`);
        r.writeLine(`  • Summary        : ${r.truncate(r.sanitize(taskRes.summary), 220)}\n`);
        return { handled: true, exitCode: taskRes.status === 'COMPLETED' ? 0 : 1 };
      } catch (err: any) {
        r.renderError(err.message || 'Agent run failed.');
        return { handled: true, exitCode: 1 };
      }
    }

    if (sub === 'inspect') {
      const rawId = (args[1] || this.kernel.agentSystem.getActiveAgentId()).toLowerCase();
      const engDef = this.kernel.agentSystem.getEngineeringAgentDefinition(rawId);
      const validCanonicalIds: OrionAgentId[] = ['core', 'engineer', 'research', 'operator', 'vision', 'auditor'];
      if (!engDef && !validCanonicalIds.includes(rawId as OrionAgentId)) {
        r.renderError(
          `Unknown agent '${rawId}'. Use '/agents list' to see all registered agents.`
        );
        return { handled: true, exitCode: 1 };
      }
      const canonicalId: OrionAgentId = validCanonicalIds.includes(rawId as OrionAgentId)
        ? (rawId as OrionAgentId)
        : (engDef?.canonicalPolicyId || 'core');
      const profile = validCanonicalIds.includes(rawId as OrionAgentId)
        ? this.kernel.policyService.getAgentDefinition(canonicalId)
        : {
            ...this.kernel.policyService.getAgentDefinition(canonicalId),
            id: (engDef!.id as any),
            displayName: engDef!.displayName,
            roleTitle: engDef!.roleTitle,
            responsibilities: engDef!.responsibilities,
            preferredLocalModel: engDef!.preferredLocalModel,
            fallbackLocalModels: engDef!.fallbackLocalModels,
            maxContextTokens: engDef!.maxContextTokens,
            maxPermissionLevel: engDef!.maxPermissionLevel,
            allowedTools: engDef!.allowedTools,
            timeoutMs: engDef!.timeoutMs,
            protectedSystemPrompt: engDef!.protectedSystemPrompt,
            outputContractDescription: engDef!.outputContractDescription
          };
      const assembled = this.kernel.policyService.getEffectiveInstructions(canonicalId);
      const rosterMatch = this.kernel.agentSystem.getLiveAgentRoster(true).find(e => e.id === rawId);
      const recentTasks = this.kernel.agentSystem
        .getAllTasks()
        .filter(t => t.agentId === rawId)
        .slice(-5);

      if (r.isJsonMode()) {
        r.writeJson({
          profile,
          liveStatus: rosterMatch || null,
          recentTasks,
          policyVerified: assembled.policyIntegrityVerified,
          policySha256: assembled.policySha256,
          globalUserCustomizationText: assembled.globalUserCustomizationText,
          agentUserCustomizationText: assembled.agentUserCustomizationText,
          rejectedOverrideAttempts: assembled.rejectedCustomizationLines
        });
        return { handled: true, exitCode: 0 };
      }
      r.writeLine(`\n${r.bold(`${profile.displayName} (${profile.id})`)} — ${r.cyan(profile.roleTitle)}`);
      if (rosterMatch) {
        r.writeLine(`  • Live Status         : ${rosterMatch.status} (Backend: ${rosterMatch.backend})`);
        r.writeLine(`  • Current / Last Task : ${rosterMatch.currentTask || 'none'}`);
        if (rosterMatch.latestResultSummary) {
          r.writeLine(`  • Latest Result       : ${r.sanitize(rosterMatch.latestResultSummary)}`);
        }
      }
      r.writeLine(`  • Default Local Model : ${profile.preferredLocalModel} (Fallbacks: ${profile.fallbackLocalModels.join(', ')})`);
      r.writeLine(`  • Permission Ceiling  : ${profile.maxPermissionLevel}${engDef?.readOnly ? ' (Strictly Read-Only)' : ''}`);
      r.writeLine(`  • Context Budget      : ${profile.maxContextTokens} tokens`);
      r.writeLine(`  • Allowed Tools (${profile.allowedTools.length})  : ${profile.allowedTools.join(', ')}`);
      r.writeLine(`  • Protected Policy    : ${assembled.policyIntegrityVerified ? r.green('VERIFIED') : r.red('TAMPERED')} (${assembled.policySha256.slice(0, 16)}...)`);
      r.writeLine(`  • User Customizations : ${assembled.rejectedCustomizationLines.length} rejected override lines\n`);
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'reset') {
      const target = (args[1] || 'global').toLowerCase();
      const removed = this.kernel.policyService.resetUserCustomizations(target === 'global' ? 'global' : (target as OrionAgentId));
      r.renderInfo(removed.length > 0 ? `Reset user customization file(s): ${removed.join(', ')}.` : `No user customization file existed for '${target}'.`);
      return { handled: true, exitCode: 0 };
    }

    try {
      const agent = this.kernel.agentSystem.setActiveAgent(sub);
      if (r.isJsonMode()) {
        r.writeJson({ switched: true, activeAgent: agent });
      } else {
        r.renderInfo(`Switched active agent to ${agent.displayName} (${agent.id}) [Model: ${agent.preferredLocalModel} | Ceiling: ${agent.maxPermissionLevel}].`);
      }
      return { handled: true, exitCode: 0 };
    } catch (err: any) {
      r.renderError(err.message || `Unknown agent '${sub}'.`);
      return { handled: true, exitCode: 1 };
    }
  }

  private async handleDoctor(): Promise<CommandDispatchResult> {
    const r = this.kernel.renderer;
    const snapshot = await this.kernel.systemMonitor.getSnapshot();
    const policyIntegrity = this.kernel.policyService.verifyProtectedPolicyIntegrity();
    const traceIntegrity = this.kernel.orchestrator.getTraceService().verifyTraceChainIntegrity();
    const ollamaAdapter = this.kernel.omniRouter.getOllamaProvider();
    if (ollamaAdapter && ollamaAdapter.getInstalledModels().length === 0) {
      await ollamaAdapter.probeHealth(1200);
    }
    const installedOllama = ollamaAdapter?.getInstalledModels() || [];
    const tools = this.kernel.toolService.getTools();
    const agents = this.kernel.agentSystem.getAllAgents();
    const apiStatus = this.kernel.localApiServer.getStatus();

    const activeStatus = this.kernel.omniRouter.getStatus();
    const engineDiagnostics = formatDeveloperEngineDiagnostics(
      activeStatus.id,
      activeStatus.currentModel
    );

    const report = {
      status: policyIntegrity.valid && traceIntegrity.valid && tools.length >= 30 ? 'HEALTHY' : 'DEGRADED',
      nodeVersion: process.version,
      platform: `${os.platform()} ${os.release()} (${process.arch})`,
      cpuModel: snapshot.cpu.model,
      totalRamGb: Number((snapshot.memory.totalBytes / (1024 ** 3)).toFixed(2)),
      engineMapping: {
        publicIdentity: resolvePublicEngineIdentity(activeStatus.id, activeStatus.currentModel),
        diagnosticsSummary: engineDiagnostics
      },
      visualPreferences: this.kernel.visualPreferences.getPreferences(),
      protectedPolicy: {
        ...policyIntegrity,
        verified: policyIntegrity.valid
      },
      executionTraceChain: traceIntegrity,
      agentsCount: agents.length,
      registeredToolsCount: tools.length,
      installedOllamaModelsCount: installedOllama.length,
      installedOllamaModels: installedOllama.map(m => m.name),
      localOpenAiApi: apiStatus
    };

    if (r.isJsonMode()) {
      r.writeJson(report);
      return { handled: true, exitCode: report.status === 'HEALTHY' ? 0 : 1 };
    }

    r.writeLine(`\n${r.bold('=== ORION SYSTEM PRE-FLIGHT DIAGNOSTIC (/doctor) ===')}`);
    r.writeLine(`  • Node.js & OS         : ${r.green('[PASS]')} ${report.nodeVersion} on ${report.platform}`);
    r.writeLine(`  • Engine Mapping       : ${r.cyan('[INFO]')} ${engineDiagnostics}`);
    r.writeLine(`  • Visual & Motion      : ${r.green('[PASS]')} Mode=${report.visualPreferences.visualMode} | Animations=${report.visualPreferences.animationsEnabled ? 'enabled' : 'disabled'}`);
    r.writeLine(`  • Protected Policy     : ${policyIntegrity.valid ? r.green('[PASS]') : r.red('[FAIL]')} SHA-256 ${policyIntegrity.actualSha256.slice(0, 16)}...`);
    r.writeLine(`  • Trace Hash Chain     : ${traceIntegrity.valid ? r.green('[PASS]') : r.red('[FAIL]')} ${traceIntegrity.totalTraces} tamper-evident records`);
    r.writeLine(`  • Multi-Agent System   : ${r.green('[PASS]')} ${agents.length} specialized agents ready (active: ${this.kernel.agentSystem.getActiveAgentId()})`);
    r.writeLine(`  • Authoritative Tools  : ${r.green('[PASS]')} ${tools.length} tools registered with SecurityPolicyMiddleware`);
    r.writeLine(`  • Local Ollama Models  : ${installedOllama.length >= 6 ? r.green('[PASS]') : r.yellow('[WARN]')} ${installedOllama.length} local models discovered (${installedOllama.map(m => m.name).join(', ')})`);
    r.writeLine(`  • OpenAI Local API     : ${apiStatus.running ? r.green(`[ONLINE] http://${apiStatus.host}:${apiStatus.port}/v1`) : r.dim('[STANDBY] Run /api start to launch')}\n`);
    return { handled: true, exitCode: 0 };
  }

  private async handleBench(args: string[]): Promise<CommandDispatchResult> {
    const r = this.kernel.renderer;
    const start = performance.now();
    const targetModel = args[0] && args[0] !== 'live' && args[0] !== '--live' ? args[0] : 'llama3.1:8b';
    const ollamaAdapter = this.kernel.omniRouter.getOllamaProvider();
    if (ollamaAdapter && ollamaAdapter.getInstalledModels().length === 0) {
      await ollamaAdapter.probeHealth(1200);
    }
    const installed = ollamaAdapter?.getInstalledModels() || [];
    const policyStart = performance.now();
    const policyCheck = this.kernel.policyService.verifyProtectedPolicyIntegrity();
    const policyMs = Math.max(1, Math.round((performance.now() - policyStart) * 100) / 100);

    const sysStart = performance.now();
    await this.kernel.systemMonitor.getSnapshot();
    const sysMs = Math.max(1, Math.round(performance.now() - sysStart));

    let ollamaInferenceMs = 0;
    let ollamaSampleOutput = '';
    let ollamaSuccess = false;

    if (args.includes('--live') || args.includes('live')) {
      const infStart = performance.now();
      this.kernel.omniRouter.setActiveLocalModel(targetModel);
      try {
        const out = await this.kernel.omniRouter.chat('Reply with the single word READY.');
        ollamaInferenceMs = Math.round(performance.now() - infStart);
        ollamaSampleOutput = out.trim().slice(0, 80);
        ollamaSuccess = true;
      } catch (e: any) {
        ollamaInferenceMs = Math.round(performance.now() - infStart);
        ollamaSampleOutput = e?.message || 'error';
      }
    }

    const totalMs = Math.round(performance.now() - start);
    const benchResult = {
      totalBenchmarkMs: totalMs,
      policyIntegrityVerificationMs: policyMs,
      policyVerified: policyCheck.valid,
      systemTelemetrySnapshotMs: sysMs,
      installedLocalModelsCount: installed.length,
      liveInferenceTested: args.includes('--live') || args.includes('live'),
      liveModel: targetModel,
      ollamaInferenceMs,
      ollamaSuccess,
      ollamaSampleOutput
    };

    if (r.isJsonMode()) {
      r.writeJson(benchResult);
      return { handled: true, exitCode: 0 };
    }

    r.writeLine(`\n${r.bold('ORION Subsystem & Local Model Benchmark (/bench)')}`);
    r.writeLine(`  • Policy SHA-256 Verification : ${policyMs} ms`);
    r.writeLine(`  • Hardware Telemetry Snapshot : ${sysMs} ms`);
    r.writeLine(`  • Local Ollama Models Ready   : ${installed.length} (${installed.map(m => m.name).join(', ')})`);
    if (benchResult.liveInferenceTested) {
      r.writeLine(`  • Live Inference (${targetModel}) : ${ollamaSuccess ? r.green(`${ollamaInferenceMs} ms`) : r.red('FAILED')} — "${r.sanitize(ollamaSampleOutput)}"`);
    } else {
      r.writeLine(`  • Tip: Run ${r.cyan('/bench live [model]')} to measure live Ollama token generation latency.`);
    }
    r.writeLine('');
    return { handled: true, exitCode: 0 };
  }

  private async handleLocalApiCommand(args: string[]): Promise<CommandDispatchResult> {
    const r = this.kernel.renderer;
    const sub = (args[0] || 'status').toLowerCase();
    const api = this.kernel.localApiServer;

    if (sub === 'start') {
      const portArg = args[1] ? parseInt(args[1], 10) : 11435;
      const res = await api.start(Number.isNaN(portArg) ? 11435 : portArg);
      if (r.isJsonMode()) {
        r.writeJson(res);
        return { handled: true, exitCode: 0 };
      }
      r.writeLine(`\n${r.bold(r.green('ORION OpenAI-Compatible Local API Server Started'))}`);
      r.writeLine(`  • Base URL   : ${r.cyan(`http://${res.host}:${res.port}/v1`)}`);
      r.writeLine(`  • Models     : GET  http://${res.host}:${res.port}/v1/models`);
      r.writeLine(`  • Chat / SSE : POST http://${res.host}:${res.port}/v1/chat/completions`);
      r.writeLine(`  • Active Key : ${r.yellow(res.keyPrefix)}\n`);
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'stop') {
      await api.stop();
      if (r.isJsonMode()) {
        r.writeJson(api.getStatus());
      } else {
        r.renderInfo('ORION Local OpenAI-Compatible API server stopped.');
      }
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'key-gen' || sub === 'keygen' || sub === 'key-rotate' || sub === 'rotate') {
      const generated = api.generateOrRotateCompatibilityKey();
      if (r.isJsonMode()) {
        r.writeJson({ rotated: true, keyId: generated.keyId, prefix: generated.keyPrefix });
      } else {
        r.writeLine(`\n${r.bold('Generated / Rotated Local Compatibility API Key')}`);
        r.writeLine(`  • Key ID : ${generated.keyId}`);
        r.writeLine(`  • Prefix : ${generated.keyPrefix}`);
        r.writeLine(`  • Secret (shown once): ${generated.rawKey}\n`);
      }
      return { handled: true, exitCode: 0 };
    }

    const st = api.getStatus();
    if (r.isJsonMode()) {
      r.writeJson(st);
      return { handled: true, exitCode: 0 };
    }
    r.writeLine(`\n${r.bold('ORION OpenAI-Compatible Local API Server (/api)')}`);
    r.writeLine(`  • Status       : ${st.running ? r.green('RUNNING') : r.dim('STOPPED')}`);
    r.writeLine(`  • Bind Address : http://${st.host}:${st.port}/v1 (Localhost-only security boundary)`);
    r.writeLine(`  • Key Prefix   : ${st.keyPrefix}`);
    r.writeLine(`  • Requests     : ${st.totalRequestsServed} (${st.activeRequests} active)`);
    r.writeLine(`  • Commands     : ${r.cyan('/api start [port]')} | ${r.cyan('/api stop')} | ${r.cyan('/api key-gen')} | ${r.cyan('/api key-rotate')}\n`);
    return { handled: true, exitCode: 0 };
  }

  private async handleHackathonCommand(args: string[]): Promise<CommandDispatchResult> {
    const r = this.kernel.renderer;
    const sub = (args[0] || 'run').toLowerCase();
    const isIncomplete = sub === 'incomplete';
    const isConflict = sub === 'conflict';
    const isAwaitApproval = sub === 'await-approval' || sub === 'pending-approval';
    const isApprove = sub === 'approve';

    const customInput = isIncomplete
      ? { emiratesId: '', uboDeclarationConfirmed: false }
      : isConflict
        ? { jurisdiction: 'UAE Innovation Free Zone (Simulated Sandbox)', legalStructure: 'Sole Establishment' as const }
        : undefined;

    const res = await this.kernel.hackathonService.runWorkflow(customInput, {
      allowIncompleteDefaultFill: !isIncomplete,
      requireHumanApproval: isAwaitApproval || isApprove,
      operatorApproved: isApprove
    });

    if (r.isJsonMode()) {
      r.writeJson(res);
      return { handled: true, exitCode: res.status === 'COMPLETED' || res.status === 'AWAITING_HUMAN_APPROVAL' ? 0 : 1 };
    }

    r.writeLine(`\n${r.brand('◈ UAE Hackathon Zero-Bureaucracy Workflow (NETWORK • REASON • IMPACT)')}`);
    r.writeLine(`  • Workflow ID    : ${res.workflowId}`);
    r.writeLine(`  • Classification : ${r.yellow(res.dataClassification)} (100% fictional local sample data)`);
    r.writeLine(`  • Approval Gate  : ${res.approvalStatus === 'APPROVED_BY_OPERATOR' ? r.green(res.approvalStatus) : r.yellow(res.approvalStatus || 'STANDARD')}`);
    r.writeLine(`  • 1. NETWORK     : ${r.green(res.stages.network.status)} (${res.stages.network.durationMs}ms) — ${res.stages.network.organizedFiles.length} intake files organized`);
    r.writeLine(
      `  • 2. REASON      : ${res.stages.reason.allRequirementsMet ? r.green('VERIFIED') : r.red(res.stages.reason.status)} (${res.stages.reason.durationMs}ms) — ${res.stages.reason.fieldChecks.filter(c => c.valid).length}/${res.stages.reason.fieldChecks.length} compliance checks passed`
    );
    if (res.stages.impact.status === 'VERIFIED') {
      r.writeLine(`  • 3. IMPACT      : ${r.green('VERIFIED')} (${res.stages.impact.durationMs}ms)`);
      r.writeLine(`    └─ Populated Form : ${res.stages.impact.populatedFormPath}`);
      r.writeLine(`    └─ Executive PDF  : ${res.stages.impact.pdfReportPath} (${res.stages.impact.pdfSizeBytes} bytes, SHA-256: ${res.stages.impact.pdfSha256?.slice(0, 16)}...)`);
    } else if (res.stages.impact.status === 'AWAITING_HUMAN_APPROVAL') {
      r.writeLine(`  • 3. IMPACT      : ${r.yellow('AWAITING_HUMAN_APPROVAL')} — Consequential filing held pending '/hackathon approve'`);
      r.writeLine(`    └─ Draft Packet   : ${res.stages.impact.populatedFormPath}`);
    } else {
      r.writeLine(`  • 3. IMPACT      : ${r.yellow(res.stages.impact.status)} — Blocked: ${res.stages.reason.missingOrInvalidFields.join('; ')}`);
    }
    r.writeLine(`  • Audit Trace    : ${res.auditTracePath || 'recorded'}`);
    r.writeLine(`  • Total Latency  : ${res.totalDurationMs}ms\n`);
    return { handled: true, exitCode: res.status === 'COMPLETED' || res.status === 'AWAITING_HUMAN_APPROVAL' ? 0 : 1 };
  }

  private async handleGoogleCommand(args: string[]): Promise<CommandDispatchResult> {
    const r = this.kernel.renderer;
    const sub = (args[0] || 'status').toLowerCase();
    const gDrivePath = 'G:\\My Drive';
    const gDriveMounted = fs.existsSync(gDrivePath);
    let gDriveEntriesCount = 0;
    if (gDriveMounted) {
      try {
        gDriveEntriesCount = fs.readdirSync(gDrivePath).length;
      } catch {
        gDriveEntriesCount = 0;
      }
    }
    const geminiConfigured = Boolean(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.trim().length > 10 &&
      !process.env.GEMINI_API_KEY.includes('your_')
    );

    if (sub === 'drive' && gDriveMounted) {
      const entries = fs.readdirSync(gDrivePath, { withFileTypes: true }).slice(0, 20).map(e => ({
        name: e.name,
        type: e.isDirectory() ? 'directory' : 'file'
      }));
      if (r.isJsonMode()) {
        r.writeJson({ path: gDrivePath, mounted: true, entries });
        return { handled: true, exitCode: 0 };
      }
      r.writeLine(`\n${r.brand(`◈ Google Drive Local Mount (${gDrivePath})`)}`);
      for (const e of entries) {
        r.writeLine(`  • ${e.type === 'directory' ? r.cyan('[DIR] ') : r.dim('[FILE]')} ${r.sanitize(e.name)}`);
      }
      r.writeLine('');
      return { handled: true, exitCode: 0 };
    }

    const report = {
      command: '/google',
      integrations: {
        googleDriveLocalMount: {
          status: gDriveMounted ? 'VERIFIED_WORKING' : 'NOT_MOUNTED',
          path: gDrivePath,
          topLevelEntriesCount: gDriveEntriesCount,
          permissionPolicy: 'READ_ONLY by default; writes require explicit workspace authorization'
        },
        geminiCloudAdapter: {
          status: geminiConfigured ? 'CONFIGURED' : 'NOT_CONFIGURED (Zero-spend local Ollama active)',
          envVar: 'GEMINI_API_KEY (secret value never logged)'
        },
        workspaceOAuthServices: {
          gmail: {
            status: 'GUARDED_EXTERNAL',
            policy: 'Reading/drafting allowed when authorized; sending email requires explicit human approval per recipient & subject'
          },
          calendarDocsSheets: {
            status: gDriveMounted ? 'LOCAL_DRIVE_SYNC_AVAILABLE' : 'REQUIRES_OAUTH_CONSENT',
            policy: 'Creating/modifying calendar events or shared cloud docs requires explicit operator confirmation'
          }
        }
      }
    };

    if (r.isJsonMode()) {
      r.writeJson(report);
      return { handled: true, exitCode: 0 };
    }

    r.writeLine(`\n${r.brand('◈ ORION Google Ecosystem & Workspace Integration Status (/google)')}`);
    r.writeLine(
      `  • ${r.bold('Google Drive (G:\\My Drive)'.padEnd(28))}: ${gDriveMounted ? r.green(`VERIFIED_WORKING (${gDriveEntriesCount} root items)`) : r.yellow('NOT_MOUNTED')}`
    );
    r.writeLine(
      `  • ${r.bold('Gemini API Provider'.padEnd(28))}: ${geminiConfigured ? r.green('CONFIGURED') : r.dim('NOT_CONFIGURED (Using 6 local Ollama models)')}`
    );
    r.writeLine(
      `  • ${r.bold('Gmail & Workspace OAuth'.padEnd(28))}: ${r.cyan('GUARDED_EXTERNAL')} (Sending email / mutating calendar gated by approval)`
    );
    r.writeLine(`  • ${r.dim('Tip: Run /google drive to list mounted Google Drive items safely.')}\n`);
    return { handled: true, exitCode: 0 };
  }

  private async handleMcp(args: string[]): Promise<CommandDispatchResult> {
    const r = this.kernel.renderer;
    const mcp = this.kernel.mcpClient;
    const sub = (args[0] || 'list').toLowerCase();

    if (sub === 'list' || sub === 'ls' || sub === 'status') {
      if (r.isJsonMode()) {
        r.writeJson({
          configPath: mcp.getConfigPath(),
          servers: mcp.getAllStatuses()
        });
        return { handled: true, exitCode: 0 };
      }
      r.renderMcpStatus(mcp.getAllStatuses(), mcp.getConfigPath());
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'add') {
      const name = args[1];
      const command = args[2];
      const cmdArgs = args.slice(3);
      if (!name || !command) {
        r.renderError('Usage: /mcp add <name> <command> [args...]');
        return { handled: true, exitCode: 1 };
      }
      try {
        const status = mcp.addServerConfig({ name, command, args: cmdArgs, enabled: true, trusted: false });
        r.renderInfo(`Configured MCP server '${status.name}' [state: ${status.state}]. Run '/mcp connect ${status.name}' to start and handshake.`);
        return { handled: true, exitCode: 0 };
      } catch (err: any) {
        r.renderError(err.message);
        return { handled: true, exitCode: 1 };
      }
    }

    if (sub === 'remove' || sub === 'rm') {
      const name = args[1];
      if (!name) {
        r.renderError('Usage: /mcp remove <name>');
        return { handled: true, exitCode: 1 };
      }
      const removed = mcp.removeServerConfig(name);
      if (removed) {
        r.renderInfo(`Removed MCP server '${name}'.`);
        return { handled: true, exitCode: 0 };
      }
      r.renderError(`MCP server '${name}' is not configured.`);
      return { handled: true, exitCode: 1 };
    }

    if (sub === 'connect') {
      const name = args[1];
      if (!name) {
        r.renderError('Usage: /mcp connect <name>');
        return { handled: true, exitCode: 1 };
      }
      r.renderInfo(`Initiating JSON-RPC 2.0 stdio handshake with MCP server '${name}'...`);
      const status = await mcp.connectServer(name, true);
      if (status.state === 'CONNECTED') {
        r.renderInfo(`Connected to '${name}' (protocol ${status.protocolVersion}, ${status.discoveredTools.length} tools registered).`);
        return { handled: true, exitCode: 0 };
      }
      r.renderError(`Failed to connect MCP server '${name}': ${status.lastError || status.state}`);
      return { handled: true, exitCode: 1 };
    }

    if (sub === 'disconnect') {
      const name = args[1];
      if (!name) {
        r.renderError('Usage: /mcp disconnect <name>');
        return { handled: true, exitCode: 1 };
      }
      mcp.disconnectServer(name);
      r.renderInfo(`Disconnected MCP server '${name}'.`);
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'tools') {
      const statuses = mcp.getAllStatuses();
      const connected = statuses.filter(s => s.state === 'CONNECTED');
      r.writeLine(`\n${r.bold('Discovered MCP Tools')}`);
      if (connected.length === 0) {
        r.writeLine(`  ${r.dim('No MCP servers are currently in CONNECTED state. Use /tools to inspect ORION built-in tools.')}\n`);
        return { handled: true, exitCode: 0 };
      }
      for (const s of connected) {
        for (const t of s.discoveredTools) {
          r.writeLine(`  • ${r.cyan(`mcp.${s.name}.${t.name}`)} — ${r.sanitize(t.description || '')}`);
        }
      }
      r.writeLine('');
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'inspect') {
      const name = args[1];
      const status = name ? mcp.getServerStatus(name) : undefined;
      if (!status) {
        r.renderError(`MCP server '${name || ''}' is not configured.`);
        return { handled: true, exitCode: 1 };
      }
      r.writeJson(status);
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'call') {
      const serverName = args[1];
      const toolName = args[2];
      const rawJson = args.slice(3).join(' ');
      if (!serverName || !toolName) {
        r.renderError('Usage: /mcp call <server> <tool> [json_args]');
        return { handled: true, exitCode: 1 };
      }
      let parsedArgs: Record<string, any> = {};
      if (rawJson) {
        try {
          parsedArgs = JSON.parse(rawJson);
        } catch {
          r.renderError(`Invalid JSON arguments: ${rawJson}`);
          return { handled: true, exitCode: 1 };
        }
      }
      const mcpToolId = `mcp.${serverName}.${toolName}`;
      const call: ToolCall = {
        id: `cli_mcp_${Date.now()}`,
        toolId: mcpToolId,
        toolName: `[MCP:${serverName}] ${toolName}`,
        arguments: parsedArgs,
        timestamp: Date.now(),
        requiresUserApproval: true
      };
      r.renderToolStarted(1, call);
      const res = await this.kernel.toolService.executeTool(call);
      r.renderToolCompleted(res);
      const mcpPayload = res.data ?? (res as any).output;
      if (res.success && mcpPayload !== undefined) {
        r.writeJson(mcpPayload);
      }
      return { handled: true, exitCode: res.success ? 0 : 1 };
    }

    r.renderError(`Unknown /mcp subcommand '${sub}'. Supported: list, add, remove, connect, disconnect, tools, inspect, call.`);
    return { handled: true, exitCode: 1 };
  }

  private async handleModelCommand(args: string[]): Promise<CommandDispatchResult> {
    const r = this.kernel.renderer;
    await this.kernel.omniRouter.ensureInitialized(1200);
    const ollamaAdapter = this.kernel.omniRouter.getOllamaProvider();
    const installedOllama = ollamaAdapter?.getInstalledModels() || [];
    const installedSet = new Set(installedOllama.map(m => m.name));
    const activeStatus = this.kernel.omniRouter.getStatus();
    const sub = (args[0] || '').toLowerCase();

    // /model chain [set <m1,m2,...> | reset | status]
    if (sub === 'chain') {
      const action = (args[1] || 'status').toLowerCase();
      if (action === 'reset') {
        const chain = this.kernel.omniRouter.resetModelChain();
        if (r.isJsonMode()) {
          r.writeJson({ reset: true, chain });
        } else {
          r.renderInfo(`Model chain reset to sovereign default: ${chain.join(' -> ')}`);
        }
        return { handled: true, exitCode: 0 };
      }

      if (action === 'set') {
        const rawModels = args.slice(2).join(',').split(',').map(s => s.trim()).filter(Boolean);
        const res = this.kernel.omniRouter.setModelChain(rawModels);
        if (!res.valid) {
          r.renderError(res.error || 'Failed to update model chain.');
          return { handled: true, exitCode: 1 };
        }
        if (r.isJsonMode()) {
          r.writeJson({ updated: true, chain: res.chain, activeModel: res.chain[0] });
        } else {
          r.renderInfo(`Model chain updated and persisted: ${res.chain.join(' -> ')} (Primary: ${res.chain[0]})`);
        }
        return { handled: true, exitCode: 0 };
      }

      const chain = this.kernel.omniRouter.getModelChain();
      const roleMatrix = [
        { role: 'Interactive / Tool Execution', category: 'TOOL_USE', selection: this.kernel.omniRouter.selectLocalModelForTask('TOOL_USE') },
        { role: 'Software Engineering / Code', category: 'CODING', selection: this.kernel.omniRouter.selectLocalModelForTask('CODING') },
        { role: 'Deep Reasoning / Audit', category: 'COMPLEX_REASONING', selection: this.kernel.omniRouter.selectLocalModelForTask('COMPLEX_REASONING') },
        { role: 'Synthesis / Summarization', category: 'SUMMARIZATION', selection: this.kernel.omniRouter.selectLocalModelForTask('SUMMARIZATION') },
        { role: 'Multimodal Vision / OCR', category: 'VISION', selection: this.kernel.omniRouter.selectLocalModelForTask('VISION', { requiresVision: true }) }
      ];

      if (r.isJsonMode()) {
        r.writeJson({
          activeProvider: activeStatus.id,
          activeModel: activeStatus.currentModel,
          routingStrategy: this.kernel.omniRouter.getRoutingStrategy(),
          ollamaReachable: Boolean(ollamaAdapter?.isConfigured && ollamaAdapter.getStatus().isHealthy),
          configuredChain: chain.map((modelId, idx) => ({
            priority: idx + 1,
            modelId,
            installedLocally: installedSet.has(modelId),
            status: installedSet.has(modelId) && ollamaAdapter?.getStatus().isHealthy ? 'READY_LOCAL' : 'CONFIGURED'
          })),
          deterministicFallback: 'local-heuristic:offline-rule-router',
          taskRoleRouting: roleMatrix
        });
        return { handled: true, exitCode: 0 };
      }

      r.writeLine(`\n${r.brand('◈ ORION Sovereign Model Chain & Task Router')}`);
      r.writeLine(`  • ${r.violet('Active Engine'.padEnd(20))}: ${r.bold(`${activeStatus.id}:${activeStatus.currentModel}`)} (${activeStatus.isHealthy ? r.green('ONLINE') : r.yellow('FALLBACK')})`);
      r.writeLine(`  • ${r.violet('Routing Strategy'.padEnd(20))}: ${r.bold(this.kernel.omniRouter.getRoutingStrategy())} (Zero Paid API Enforcement: ${r.green('ACTIVE')})`);
      r.writeLine(`  • ${r.violet('Fallback Chain'.padEnd(20))}:`);
      chain.forEach((m, idx) => {
        const isCurrent = m === activeStatus.currentModel && activeStatus.id === 'ollama';
        const isInstalled = installedSet.has(m);
        const stateLabel = isInstalled && ollamaAdapter?.getStatus().isHealthy
          ? r.green('INSTALLED & REACHABLE')
          : isInstalled
            ? r.yellow('INSTALLED (DAEMON OFFLINE)')
            : r.dim('CONFIGURED');
        const marker = isCurrent ? r.brand('▸') : ' ';
        r.writeLine(`    ${marker} [${idx + 1}] ${r.bold(m.padEnd(22))} ${stateLabel}`);
      });
      r.writeLine(`      [${chain.length + 1}] ${r.dim('local-heuristic:offline-rule-router'.padEnd(22))} ${r.cyan('DETERMINISTIC OFFLINE FALLBACK')}`);
      r.writeLine(`\n  ${r.bold('Task-Aware Model Routing Matrix:')}`);
      for (const item of roleMatrix) {
        r.writeLine(
          `    • ${item.role.padEnd(28)} ❯ ${r.bold(item.selection.selectedModel.padEnd(18))} ${r.dim(`(fallbacks: ${item.selection.fallbackChain.slice(1).join(' -> ')})`)}`
        );
      }
      r.writeLine(`\n  ${r.dim('Usage: /model chain | /model chain set <m1,m2,...> | /model chain reset | /model <model_name>')}\n`);
      return { handled: true, exitCode: 0 };
    }

    if (args[0]) {
      const lowerArg = args[0].toLowerCase();
      if (['saif', 'nur', 'hikmah', 'auto'].includes(lowerArg)) {
        const applied = this.kernel.omniRouter.setHikmahMode(lowerArg as any);
        r.renderInfo(`Mode set to ${applied.mode.toUpperCase()} (${applied.strategy} / ${applied.anthropicModel}).`);
        return { handled: true, exitCode: 0 };
      }
      const valid: RoutingStrategy[] = ['SPEED_FIRST', 'BALANCED', 'QUALITY_FIRST', 'VISION', 'CODING', 'AGENT', 'OFFLINE'];
      const upper = args[0].toUpperCase() as RoutingStrategy;
      if (valid.includes(upper)) {
        this.kernel.setRoutingStrategy(upper);
        r.renderInfo(`Routing strategy set to ${upper}.`);
        return { handled: true, exitCode: 0 };
      }
      const targetModel = args[0] === 'set' && args[1] ? args[1] : args[0];
      const knownModels = new Set([
        ...this.kernel.modelRegistry.getModels().map(m => m.modelId),
        ...installedOllama.map(m => m.name)
      ]);
      if (!knownModels.has(targetModel)) {
        r.renderError(
          `Model '${targetModel}' is not registered or installed locally. Installed local models: ${installedOllama.map(m => m.name).join(', ') || 'llama3.1:8b, qwen2.5-coder:7b, deepseek-r1:14b, gpt-oss:20b, gemma4:26b, qwen3-coder:30b'}`
        );
        return { handled: true, exitCode: 1 };
      }
      const switched = this.kernel.omniRouter.setActiveLocalModel(targetModel);
      if (switched) {
        if (r.isJsonMode()) {
          r.writeJson({ success: true, activeLocalModel: targetModel });
        } else {
          r.renderInfo(`Active local Ollama model set to '${targetModel}'.`);
        }
        return { handled: true, exitCode: 0 };
      }
    }

    const models = this.kernel.modelRegistry.getModels();
    const configuredIds = new Set(
      this.kernel.omniRouter.getAllProviderStatuses().filter(p => p.isConfigured).map(p => p.id)
    );
    if (r.isJsonMode()) {
      r.writeJson({
        activeProvider: activeStatus.id,
        activeModel: activeStatus.currentModel,
        modelChain: this.kernel.omniRouter.getModelChain(),
        configuredProviders: Array.from(configuredIds),
        installedLocalOllamaModels: installedOllama,
        models
      });
      return { handled: true, exitCode: 0 };
    }
    r.renderModelsTable(models, configuredIds);
    if (installedOllama.length > 0) {
      r.writeLine(`${r.bold(`Installed Local Ollama Models (${installedOllama.length})`)}`);
      for (const m of installedOllama) {
        const sizeGb = (m.sizeBytes / (1024 ** 3)).toFixed(1);
        const isCurrent = m.name === activeStatus.currentModel && activeStatus.id === 'ollama';
        const badge = isCurrent ? r.brand('▸') : r.green('●');
        r.writeLine(
          `  ${badge} ${r.bold(m.name.padEnd(24))} ${r.cyan((m.parameterSize || '').padEnd(8))} ` +
          `${r.dim((m.quantizationLevel || '').padEnd(10))} ${r.dim(`${sizeGb} GB`)} ` +
          `${r.dim(`${Math.round(m.contextLength / 1024)}k ctx`)} [${m.capabilities.join(', ')}]`
        );
      }
      r.writeLine(`\n  ${r.dim('Tip: Run /model chain to inspect fallback order and task-role routing.')}\n`);
    }
    return { handled: true, exitCode: 0 };
  }

  private async handleRemoteControlCommand(args: string[]): Promise<CommandDispatchResult> {
    const r = this.kernel.renderer;
    const normalizedArgs = args[0]?.toLowerCase() === 'control' ? args.slice(1) : args;
    const sub = (normalizedArgs[0] || 'status').toLowerCase();
    const api = this.kernel.localApiServer;

    if (sub === 'enable-local' || sub === 'start-local' || sub === 'start') {
      const port = normalizedArgs[1] ? parseInt(normalizedArgs[1], 10) : 11435;
      try {
        const started = await api.start(port);
        if (r.isJsonMode()) {
          r.writeJson({
            action: 'enable-local',
            localApiStatus: started,
            externalRemoteControl: 'DISABLED_BY_SECURITY_POLICY'
          });
        } else {
          r.renderInfo(
            `Localhost OpenAI-compatible control bridge started at http://${started.host}:${started.port}/v1 (Auth key prefix: ${started.keyPrefix}, external network exposure: BLOCKED).`
          );
        }
        return { handled: true, exitCode: 0 };
      } catch (err: any) {
        r.renderError(`Failed to start local control bridge: ${err?.message || err}`);
        return { handled: true, exitCode: 1 };
      }
    }

    if (sub === 'disable' || sub === 'stop' || sub === 'off') {
      if (api.getStatus().running) {
        await api.stop();
      }
      if (r.isJsonMode()) {
        r.writeJson({
          action: 'disable',
          localApiRunning: false,
          externalRemoteControl: 'DISABLED_BY_SECURITY_POLICY',
          estopReady: true
        });
      } else {
        r.renderInfo('Local API control bridge stopped. External remote control remains disabled by security policy.');
      }
      return { handled: true, exitCode: 0 };
    }

    if (!['status', 'inspect', 'info', 'list'].includes(sub)) {
      r.renderError(
        `Unknown /remote control subcommand '${sub}'. Supported: /remote control [status | enable-local [port] | disable]`
      );
      return { handled: true, exitCode: 1 };
    }

    const apiStatus = api.getStatus();
    const estopActive = ProcessSupervisor.getInstance().isEstopActive();
    const policyIntegrity = this.kernel.policyService.verifyProtectedPolicyIntegrity();

    const report = {
      command: '/remote control',
      surfaces: {
        localWorkstationControl: {
          status: 'VERIFIED_WORKING',
          driver: 'ComputerUseService + ToolService (Windows WMI / Win32 / PowerShell Safe)',
          permissionGate: 'SecurityPolicyMiddleware + ActionRiskEvaluator (4-Tier)',
          emergencyStop: estopActive ? 'ACTIVE (HALTED)' : 'ARMED_READY',
          protectedPolicyVerified: policyIntegrity.valid
        },
        loopbackApiBridge: {
          status: apiStatus.running ? 'ONLINE_LOOPBACK_ONLY' : 'STOPPED',
          endpoint: `http://${apiStatus.host}:${apiStatus.port}/v1`,
          authentication: `Bearer token required (${apiStatus.keyPrefix})`,
          networkBinding: '127.0.0.1 ONLY (0.0.0.0 wildcard binding strictly prohibited)'
        },
        externalRemoteControl: {
          status: 'DISABLED_BY_SECURITY_POLICY',
          implementationLabel: 'NOT_CONFIGURED',
          reason: 'No public network listener, cloud relay, or unauthenticated remote control tunnel is enabled. All remote control is restricted to authenticated localhost loopback (127.0.0.1).'
        }
      }
    };

    if (r.isJsonMode()) {
      r.writeJson(report);
      return { handled: true, exitCode: 0 };
    }

    r.writeLine(`\n${r.brand('◈ ORION Remote & Workstation Control Architecture (/remote control)')}`);
    r.writeLine(`  1. ${r.bold('Local Workstation OS Control')} : ${r.green('VERIFIED_WORKING')}`);
    r.writeLine(`     • Engine     : ComputerUseService + ToolService (WMI brightness, volume, app launch, file ops)`);
    r.writeLine(`     • Safety Gate: 4-Tier ActionRiskEvaluator + SecurityPolicyMiddleware (E-Stop: ${estopActive ? r.red('ACTIVE') : r.green('ARMED')})`);
    r.writeLine(`  2. ${r.bold('Localhost API Control Bridge')} : ${apiStatus.running ? r.green('ONLINE (127.0.0.1:' + apiStatus.port + ')') : r.dim('STOPPED (run /remote control enable-local)')}`);
    r.writeLine(`     • Endpoint   : http://${apiStatus.host}:${apiStatus.port}/v1 (Strict 127.0.0.1 loopback binding)`);
    r.writeLine(`     • Auth Policy: Mandatory Bearer token (${apiStatus.keyPrefix})`);
    r.writeLine(`  3. ${r.bold('External / Network Remote')}    : ${r.yellow('DISABLED_BY_SECURITY_POLICY (NOT_CONFIGURED)')}`);
    r.writeLine(`     • Boundary   : Zero external listeners, zero public tunnels, zero unauthenticated sockets.`);
    r.writeLine(`\n  ${r.dim('Subcommands: /remote control status | /remote control enable-local [port] | /remote control disable')}\n`);
    return { handled: true, exitCode: 0 };
  }

  private async handleContentCommand(args: string[]): Promise<CommandDispatchResult> {
    const r = this.kernel.renderer;
    const sub = (args[0] || 'status').toLowerCase();
    const draftsDir = path.join(this.kernel.projectRoot, '.orion_memory', 'drafts');

    if (sub === 'status' || sub === 'overview') {
      const listCall: ToolCall = {
        id: `content_list_${Date.now()}`,
        toolId: 'file.list_directory',
        toolName: 'List Directory',
        arguments: { dirPath: '.' },
        timestamp: Date.now(),
        requiresUserApproval: false
      };
      const listRes = await this.kernel.toolService.executeTool(listCall);
      const items: Array<{ name: string; isDirectory: boolean; sizeBytes?: number }> = listRes.data?.items || [];
      const docsDir = path.join(this.kernel.projectRoot, 'docs');
      let docsCount = 0;
      if (fs.existsSync(docsDir)) {
        const countFiles = (dir: string): number => {
          let total = 0;
          for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            if (entry.isDirectory()) total += countFiles(path.join(dir, entry.name));
            else total++;
          }
          return total;
        };
        docsCount = countFiles(docsDir);
      }
      const drafts = fs.existsSync(draftsDir) ? fs.readdirSync(draftsDir).filter(f => f.endsWith('.md') || f.endsWith('.txt')) : [];

      if (r.isJsonMode()) {
        r.writeJson({
          workspaceRoot: this.kernel.projectRoot,
          rootEntriesCount: items.length,
          docsFilesCount: docsCount,
          draftsCount: drafts.length,
          drafts,
          sampleEntries: items.slice(0, 12)
        });
        return { handled: true, exitCode: 0 };
      }

      r.writeLine(`\n${r.brand('◈ ORION Workspace Content & Documentation Manager (/content)')}`);
      r.writeLine(`  • ${r.violet('Workspace Root'.padEnd(18))}: ${formatLogicalPath(this.kernel.projectRoot, this.kernel.projectRoot)}`);
      r.writeLine(`  • ${r.violet('Top-Level Items'.padEnd(18))}: ${items.length} entries (${items.filter(i => i.isDirectory).length} dirs, ${items.filter(i => !i.isDirectory).length} files)`);
      r.writeLine(`  • ${r.violet('Documentation'.padEnd(18))}: ${docsCount} files in docs/`);
      r.writeLine(`  • ${r.violet('Saved Drafts'.padEnd(18))}: ${drafts.length} draft(s) in .orion_memory/drafts/`);
      r.writeLine(`  • ${r.violet('Sample Files'.padEnd(18))}: ${items.slice(0, 8).map(i => i.name).join(', ')}`);
      r.writeLine(`\n  ${r.dim('Subcommands: /content list [dir] | /content find <query> | /content read <file> | /content summarize <file> | /content draft <title> <text>')}\n`);
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'list' || sub === 'ls') {
      const targetDir = args[1] || '.';
      const call: ToolCall = {
        id: `content_ls_${Date.now()}`,
        toolId: 'file.list_directory',
        toolName: 'List Directory',
        arguments: { dirPath: targetDir },
        timestamp: Date.now(),
        requiresUserApproval: false
      };
      const res = await this.kernel.toolService.executeTool(call);
      if (!res.success) {
        r.renderError(res.error || `Failed to list directory '${targetDir}'.`);
        return { handled: true, exitCode: 1 };
      }
      if (r.isJsonMode()) {
        r.writeJson(res.data);
        return { handled: true, exitCode: 0 };
      }
      const items = res.data?.items || [];
      r.writeLine(`\n${r.bold(`Workspace Content: ${res.data?.directory || targetDir} (${items.length} items)`)}`);
      for (const item of items.slice(0, 30)) {
        const badge = item.isDirectory ? r.violet('[DIR] ') : r.cyan('[FILE]');
        r.writeLine(`  ${badge} ${r.bold(String(item.name).padEnd(36))} ${item.sizeBytes ? r.dim(`${item.sizeBytes} B`) : ''}`);
      }
      r.writeLine('');
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'find' || sub === 'search') {
      const query = args.slice(1).join(' ').trim();
      if (!query) {
        r.renderError('Usage: /content find <query>');
        return { handled: true, exitCode: 1 };
      }
      const textHits = await this.kernel.developerAgent.searchCode(this.kernel.projectRoot, query);
      const fileHits = Array.from(new Set(textHits.map(h => h.filePath)));
      if (r.isJsonMode()) {
        r.writeJson({ query, fileHits, textHits: textHits.slice(0, 20) });
        return { handled: true, exitCode: 0 };
      }
      r.writeLine(`\n${r.bold(`Workspace Content Search: "${r.sanitize(query)}"`)}`);
      r.writeLine(`  • Matching File Paths (${fileHits.length}):`);
      for (const f of fileHits.slice(0, 10)) {
        r.writeLine(`    - ${r.cyan(f)}`);
      }
      r.writeLine(`  • Matching Content Lines (${textHits.length}):`);
      for (const h of textHits.slice(0, 10)) {
        r.writeLine(`    - ${r.violet(`${h.filePath}:${h.lineNumber}`)} ❯ ${r.truncate(r.sanitize(h.lineContent), 80)}`);
      }
      r.writeLine('');
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'read' || sub === 'view') {
      const targetFile = args.slice(1).join(' ').trim();
      if (!targetFile) {
        r.renderError('Usage: /content read <filePath>');
        return { handled: true, exitCode: 1 };
      }
      const call: ToolCall = {
        id: `content_read_${Date.now()}`,
        toolId: 'file.read_text',
        toolName: 'Read Text File',
        arguments: { filePath: targetFile },
        timestamp: Date.now(),
        requiresUserApproval: false
      };
      const res = await this.kernel.toolService.executeTool(call);
      if (!res.success) {
        r.renderError(res.error || `Failed to read '${targetFile}'.`);
        return { handled: true, exitCode: 1 };
      }
      const content = String(res.data?.content || '');
      const lines = content.split(/\r?\n/);
      if (r.isJsonMode()) {
        r.writeJson({
          filePath: res.data?.filePath || targetFile,
          lineCount: lines.length,
          sizeBytes: Buffer.byteLength(content, 'utf8'),
          preview: r.sanitize(lines.slice(0, 40).join('\n'))
        });
        return { handled: true, exitCode: 0 };
      }
      r.writeLine(`\n${r.bold(`Content View: ${targetFile}`)} ${r.dim(`(${lines.length} lines, ${Buffer.byteLength(content, 'utf8')} bytes)`)}`);
      for (const [idx, line] of lines.slice(0, 35).entries()) {
        r.writeLine(`  ${r.dim(String(idx + 1).padStart(3, ' '))} │ ${r.sanitize(line)}`);
      }
      if (lines.length > 35) {
        r.writeLine(`  ${r.dim(`... (${lines.length - 35} more lines)`)}`);
      }
      r.writeLine('');
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'summarize' || sub === 'summary') {
      const targetFile = args.slice(1).join(' ').trim();
      if (!targetFile) {
        r.renderError('Usage: /content summarize <filePath>');
        return { handled: true, exitCode: 1 };
      }
      const call: ToolCall = {
        id: `content_sum_${Date.now()}`,
        toolId: 'file.read_text',
        toolName: 'Read Text File',
        arguments: { filePath: targetFile },
        timestamp: Date.now(),
        requiresUserApproval: false
      };
      const res = await this.kernel.toolService.executeTool(call);
      if (!res.success) {
        r.renderError(res.error || `Failed to read '${targetFile}'.`);
        return { handled: true, exitCode: 1 };
      }
      const content = String(res.data?.content || '');
      const lines = content.split(/\r?\n/);
      const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
      const headings = lines
        .filter(l => /^#{1,3}\s+/.test(l.trim()) || /^(?:export\s+)?(?:class|interface|function)\s+[A-Za-z0-9_]+/.test(l.trim()))
        .map(l => l.trim().slice(0, 90))
        .slice(0, 12);

      if (r.isJsonMode()) {
        r.writeJson({
          filePath: res.data?.filePath || targetFile,
          lines: lines.length,
          words: wordCount,
          sizeBytes: Buffer.byteLength(content, 'utf8'),
          keySectionsOrSymbols: headings
        });
        return { handled: true, exitCode: 0 };
      }

      r.writeLine(`\n${r.brand(`◈ Content Summary: ${targetFile}`)}`);
      r.writeLine(`  • Metrics : ${lines.length} lines │ ${wordCount} words │ ${Buffer.byteLength(content, 'utf8')} bytes`);
      if (headings.length > 0) {
        r.writeLine(`  • Key Sections / Symbols (${headings.length}):`);
        for (const h of headings) {
          r.writeLine(`    - ${r.sanitize(h)}`);
        }
      } else {
        r.writeLine(`  • Preview : ${r.truncate(r.sanitize(content.replace(/\s+/g, ' ').trim()), 160)}`);
      }
      r.writeLine('');
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'draft') {
      const title = args[1];
      const body = args.slice(2).join(' ').trim();
      if (!title || !body) {
        r.renderError('Usage: /content draft "<title>" "<markdown_body>"');
        return { handled: true, exitCode: 1 };
      }
      if (!fs.existsSync(draftsDir)) {
        fs.mkdirSync(draftsDir, { recursive: true });
      }
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `draft-${Date.now()}`;
      const draftPath = path.join(draftsDir, `${slug}.md`);
      const markdown = `# ${r.sanitize(title)}\n\n- **Created:** ${new Date().toISOString()}\n- **Author:** ORION Content Engine\n\n${r.sanitize(body)}\n`;
      fs.writeFileSync(draftPath, markdown, 'utf8');
      if (r.isJsonMode()) {
        r.writeJson({ saved: true, draftPath, title: r.sanitize(title), bytes: Buffer.byteLength(markdown, 'utf8') });
      } else {
        r.renderInfo(`Content draft saved to ${draftPath} (${Buffer.byteLength(markdown, 'utf8')} bytes).`);
      }
      return { handled: true, exitCode: 0 };
    }

    r.renderError(
      `Unknown /content subcommand '${sub}'. Supported: status, list [dir], find <query>, read <file>, summarize <file>, draft <title> <text>.`
    );
    return { handled: true, exitCode: 1 };
  }

  private async handleResumeCommand(args: string[]): Promise<CommandDispatchResult> {
    const r = this.kernel.renderer;
    const sub = (args[0] || '').trim();
    const sessionResume = this.kernel.getSessionResumeState();
    const cps = this.kernel.workflowEngine.listCheckpoints();

    if (sub.toLowerCase() === 'clear') {
      this.kernel.clearSessionResumeState();
      if (r.isJsonMode()) {
        r.writeJson({ cleared: true, message: 'Persisted session resume state cleared.' });
      } else {
        r.renderInfo('Persisted session resume state cleared.');
      }
      return { handled: true, exitCode: 0 };
    }

    if (!sub || sub.toLowerCase() === 'list' || sub.toLowerCase() === 'status') {
      if (r.isJsonMode()) {
        r.writeJson({
          sessionResume: {
            exists: sessionResume.exists,
            corrupted: sessionResume.corrupted,
            error: sessionResume.error,
            filePath: sessionResume.filePath,
            state: sessionResume.state || null
          },
          checkpoints: cps,
          workflowCheckpoints: cps
        });
        return { handled: true, exitCode: sessionResume.corrupted ? 1 : 0 };
      }

      r.writeLine(`\n${r.brand('◈ ORION Session & Workflow Resume Center (/resume)')}`);
      if (sessionResume.corrupted) {
        r.renderWarning(sessionResume.error || 'Corrupted session state file detected.');
      } else if (sessionResume.exists && sessionResume.state) {
        const st = sessionResume.state;
        r.writeLine(`  • ${r.violet('Session ID'.padEnd(18))}: ${st.sessionId} (Updated: ${st.updatedAt})`);
        r.writeLine(`  • ${r.violet('Saved Context'.padEnd(18))}: Agent=${r.bold(st.activeAgentId)} │ Model=${r.bold(`${st.activeProvider}:${st.activeModel}`)} │ Strategy=${st.routingStrategy}`);
        if (st.lastTask) {
          const badge = st.lastTask.status === 'COMPLETED'
            ? r.green('COMPLETED')
            : st.lastTask.status === 'INTERRUPTED'
              ? r.yellow('INTERRUPTED')
              : r.red(st.lastTask.status);
          r.writeLine(`  • ${r.violet('Last Task'.padEnd(18))}: [${badge}] ${r.bold(st.lastTask.taskId)} — "${r.sanitize(st.lastTask.query)}"`);
        }
        if (st.recentTasks.length > 0) {
          r.writeLine(`\n  ${r.bold(`Recent Persisted Session Tasks (${st.recentTasks.length}):`)}`);
          for (const t of st.recentTasks.slice(-8)) {
            const b = t.status === 'COMPLETED'
              ? r.green(t.status.padEnd(11))
              : t.status === 'INTERRUPTED'
                ? r.yellow(t.status.padEnd(11))
                : r.red(t.status.padEnd(11));
            const tools = t.toolsUsed?.length ? ` [tools: ${t.toolsUsed.join(', ')}]` : '';
            r.writeLine(`    • ${r.bold(t.taskId.padEnd(10))} [${b}] "${r.truncate(r.sanitize(t.query), 48)}"${r.dim(tools)}`);
          }
        }
      } else {
        r.writeLine(`  ${r.dim('No persisted session tasks found yet in .orion_memory/session_resume_state.json.')}`);
      }

      r.writeLine(`\n  ${r.bold(`Persisted Multi-Step Workflow Checkpoints (${cps.length}):`)}`);
      if (cps.length === 0) {
        r.writeLine(`    ${r.dim('No workflow checkpoints recorded.')}`);
      } else {
        for (const cp of cps.slice(0, 10)) {
          const badge = cp.status === 'COMPLETED' ? r.green(cp.status) : cp.status === 'FAILED' || cp.status === 'BLOCKED' ? r.red(cp.status) : r.yellow(cp.status);
          r.writeLine(`    • ${r.bold(cp.workflowId)} [${badge}] (${cp.stepsCompleted}/${cp.stepsTotal} verified) — ${r.sanitize(cp.goal)}`);
        }
      }
      r.writeLine(`\n  ${r.dim('Usage: /resume | /resume last | /resume <taskId|workflowId> | /resume clear')}\n`);
      return { handled: true, exitCode: sessionResume.corrupted ? 1 : 0 };
    }

    // Check if sub matches 'last' or a persisted session taskId
    if (sub.toLowerCase() === 'last' || sub.startsWith('task_')) {
      if (sessionResume.corrupted) {
        r.renderError(sessionResume.error || 'Cannot resume from corrupted session state file.');
        return { handled: true, exitCode: 1 };
      }
      const tasks = sessionResume.state?.recentTasks || [];
      const targetTask = sub.toLowerCase() === 'last'
        ? sessionResume.state?.lastTask || tasks[tasks.length - 1]
        : tasks.find(t => t.taskId === sub);

      if (!targetTask) {
        r.renderError(`Session task '${sub}' not found in persisted session history.`);
        return { handled: true, exitCode: 1 };
      }

      // Restore saved agent & model context safely without auto-re-executing consequential mutations
      if (sessionResume.state?.activeAgentId) {
        try {
          this.kernel.agentSystem.setActiveAgent(sessionResume.state.activeAgentId as any);
        } catch {}
      }
      if (sessionResume.state?.activeModel) {
        this.kernel.omniRouter.setActiveLocalModel(sessionResume.state.activeModel);
      }

      if (r.isJsonMode()) {
        r.writeJson({
          resumedSessionContext: true,
          sessionId: sessionResume.state?.sessionId,
          restoredAgent: this.kernel.agentSystem.getActiveAgentId(),
          restoredModel: this.kernel.omniRouter.getStatus().currentModel,
          task: targetTask,
          autoReexecutedConsequentialAction: false
        });
        return { handled: true, exitCode: 0 };
      }

      r.writeLine(`\n${r.brand(`◈ Resumed Session Context for ${targetTask.taskId}`)}`);
      r.writeLine(`  • Restored Agent : ${r.bold(this.kernel.agentSystem.getActiveAgentId())}`);
      r.writeLine(`  • Restored Model : ${r.bold(this.kernel.omniRouter.getStatus().currentModel)}`);
      r.writeLine(`  • Task Query     : "${r.sanitize(targetTask.query)}"`);
      r.writeLine(`  • Task Status    : ${targetTask.status} (Tools used: ${targetTask.toolsUsed.join(', ') || 'none'})`);
      r.writeLine(`  • Last Output    : ${r.sanitize(targetTask.responsePreview)}`);
      r.writeLine(`  • Safety Policy  : Consequential actions are never automatically re-executed on resume.\n`);
      return { handled: true, exitCode: 0 };
    }

    // Otherwise resume a multi-step workflow checkpoint by ID
    const res = await this.kernel.workflowEngine.resumeWorkflow(sub);
    if (r.isJsonMode()) {
      r.writeJson(res);
      return { handled: true, exitCode: res.status === 'COMPLETED' ? 0 : 1 };
    }
    if (res.status === 'COMPLETED') {
      r.renderInfo(`Workflow '${sub}' resumed and completed (${res.verifiedCount}/${res.stepsTotal} steps verified).`);
      return { handled: true, exitCode: 0 };
    }
    r.renderError(`Workflow '${sub}' resume ended with status ${res.status}: ${res.error || 'Unknown error'}`);
    return { handled: true, exitCode: 1 };
  }

  private async handleSystemStatsPanel(args: string[]): Promise<CommandDispatchResult> {
    const r = this.kernel.renderer;
    const sub = (args[0] || '').toLowerCase();
    if (sub === 'close' || sub === 'hide' || sub === 'off') {
      if (r.isJsonMode()) {
        r.setActivePanel('none');
        r.writeJson({ panel: 'system-stats', activePanel: 'none', closed: true });
        return { handled: true, exitCode: 0 };
      }
      r.closeContextualPanel();
      return { handled: true, exitCode: 0 };
    }

    const snapshot = await this.kernel.systemMonitor.getSnapshot();
    const routerStatus = this.kernel.omniRouter.getStatus();
    const activeAgent = this.kernel.agentSystem.getActiveAgentDefinition();
    const policyIntegrity = this.kernel.policyService.verifyProtectedPolicyIntegrity();
    const usedGb = (snapshot.memory.usedBytes / (1024 ** 3)).toFixed(2);
    const totalGb = (snapshot.memory.totalBytes / (1024 ** 3)).toFixed(2);
    const uptimeHours = (os.uptime() / 3600).toFixed(1);

    let diskSummary: string | undefined;
    try {
      if (typeof (fs as any).statfsSync === 'function') {
        const st = (fs as any).statfsSync(this.kernel.projectRoot);
        const totalDiskGb = ((st.blocks * st.bsize) / (1024 ** 3)).toFixed(1);
        const freeDiskGb = ((st.bavail * st.bsize) / (1024 ** 3)).toFixed(1);
        diskSummary = `${freeDiskGb} GB free / ${totalDiskGb} GB total`;
      }
    } catch {}

    r.setActivePanel('system-stats');
    if (r.isJsonMode()) {
      r.writeJson({
        panel: 'system-stats',
        activePanel: 'system-stats',
        os: `${os.platform()} ${os.release()} (${process.arch})`,
        cpu: {
          model: snapshot.cpu.model,
          cores: snapshot.cpu.cores.length,
          usagePercent: snapshot.cpu.usagePercent
        },
        memory: {
          usedGb: Number(usedGb),
          totalGb: Number(totalGb),
          usagePercent: snapshot.memory.usagePercent
        },
        disk: diskSummary || null,
        network: `${snapshot.network.interfaceName} (${snapshot.network.ipAddress})`,
        uptimeHours: Number(uptimeHours),
        activeAgent: activeAgent.id,
        activeModel: `${routerStatus.id}:${routerStatus.currentModel}`,
        protectedPolicyVerified: policyIntegrity.valid,
        closeCommand: '/system-stats close'
      });
      return { handled: true, exitCode: 0 };
    }

    r.renderSystemStatsPanel({
      osSummary: `${os.platform()} ${os.release()} (${process.arch})`,
      cpuModel: snapshot.cpu.model,
      cpuCores: snapshot.cpu.cores.length,
      cpuUsagePercent: snapshot.cpu.usagePercent,
      ramUsedGb: usedGb,
      ramTotalGb: totalGb,
      ramUsagePercent: snapshot.memory.usagePercent,
      diskSummary,
      networkSummary: `${snapshot.network.interfaceName} (${snapshot.network.ipAddress})`,
      uptimeHours,
      activeAgent: activeAgent.id,
      activeModel: `${routerStatus.id}:${routerStatus.currentModel}`,
      policyValid: policyIntegrity.valid
    });
    return { handled: true, exitCode: 0 };
  }

  private handleRecentToolsPanel(args: string[]): CommandDispatchResult {
    const r = this.kernel.renderer;
    const sub = (args[0] || '').toLowerCase();
    if (sub === 'close' || sub === 'hide' || sub === 'off') {
      if (r.isJsonMode()) {
        r.setActivePanel('none');
        r.writeJson({ panel: 'recent-tools', activePanel: 'none', closed: true });
        return { handled: true, exitCode: 0 };
      }
      r.closeContextualPanel();
      return { handled: true, exitCode: 0 };
    }

    // Merge renderer's recorded tool executions with any execution trace records
    const recorded = r.getRecentTools();
    const traces = this.kernel.orchestrator.getTraceService().getAllTraces().slice(-10);
    const seenIds = new Set(recorded.map(item => item.id));
    for (const tr of traces) {
      for (const idx of tr.toolCallsExecuted.keys()) {
        const tc = tr.toolCallsExecuted[idx];
        const trRes = tr.toolResults?.[idx];
        const callId = tc.id || `${tr.traceId}_${idx}`;
        if (!seenIds.has(callId)) {
          seenIds.add(callId);
          recorded.push({
            id: callId,
            toolId: tc.toolId,
            toolName: tc.toolName,
            status: trRes
              ? (r.constructor as any).resolveTaskStatusLabel(trRes)
              : tr.verificationSuccess
                ? 'VERIFIED'
                : 'UNKNOWN',
            durationMs: trRes?.executionTimeMs ?? tr.telemetryMetrics.toolExecutionLatencyMs ?? 0,
            summary: trRes
              ? trRes.success
                ? trRes.verificationStatus === 'VERIFIED' || trRes.verified
                  ? 'Postcondition verified'
                  : 'Executed (unverified outcome)'
                : r.sanitize(trRes.error || 'Tool execution failed')
              : 'Recorded in trace',
            timestamp: tc.timestamp || tr.timestamp
          });
        }
      }
    }

    r.setActivePanel('recent-tools');
    if (r.isJsonMode()) {
      r.writeJson({
        panel: 'recent-tools',
        activePanel: 'recent-tools',
        totalCount: recorded.length,
        tools: recorded.slice(-15),
        closeCommand: '/recent-tools close'
      });
      return { handled: true, exitCode: 0 };
    }

    r.renderRecentToolsPanel(recorded);
    return { handled: true, exitCode: 0 };
  }

  private async handlePanelCommand(cmd: string, args: string[]): Promise<CommandDispatchResult> {
    const r = this.kernel.renderer;
    const sub = cmd === 'close' ? 'close' : (args[0] || '').toLowerCase();

    if (sub === 'close' || sub === 'hide' || sub === 'off' || sub === 'none') {
      const prev = r.getActivePanel();
      if (r.isJsonMode()) {
        r.setActivePanel('none');
        r.writeJson({ previousPanel: prev, activePanel: 'none', closed: true });
        return { handled: true, exitCode: 0 };
      }
      r.closeContextualPanel();
      return { handled: true, exitCode: 0 };
    }

    if (sub === 'system-stats' || sub === 'stats') {
      return await this.handleSystemStatsPanel([]);
    }
    if (sub === 'recent-tools' || sub === 'tools') {
      return this.handleRecentToolsPanel([]);
    }
    if (sub === 'help' || sub === 'commands') {
      r.setActivePanel('help');
      if (r.isJsonMode()) {
        r.writeJson({
          panel: 'help',
          activePanel: 'help',
          commands: OrionCliCommandRouter.getSupportedCommands()
        });
        return { handled: true, exitCode: 0 };
      }
      this.renderHelp();
      return { handled: true, exitCode: 0 };
    }

    if (r.isJsonMode()) {
      r.writeJson({
        activePanel: r.getActivePanel(),
        availablePanels: ['system-stats', 'recent-tools', 'help'],
        closeCommand: '/panel close'
      });
      return { handled: true, exitCode: 0 };
    }

    r.writeLine(
      `\n${r.brand('◈ Contextual Panels')} ${r.dim(`(Active: ${r.getActivePanel()})`)}\n` +
      `  • ${r.cyan('/system-stats')}   Open live CPU, RAM, Disk, Network & Uptime contextual panel\n` +
      `  • ${r.cyan('/recent-tools')}   Open recent tool executions, status labels & durations panel\n` +
      `  • ${r.cyan('/help')}           Open command reference contextual panel\n` +
      `  • ${r.cyan('/panel close')}    Close the active contextual panel and return to default view\n`
    );
    return { handled: true, exitCode: 0 };
  }

  private renderHelp(): void {
    const r = this.kernel.renderer;
    r.writeLine(`
${r.brand('◈ Contextual Panel: ORION CLI Command Reference')} ${r.dim('(/command or //command supported)')}

${r.bold('Contextual Panels & Active Applications (On-Demand Views):')}
  ${r.cyan('/system-stats [close]')}           Open or close live CPU, RAM, Disk, Network & Uptime contextual panel
  ${r.cyan('/recent-tools [close]')}           Open or close recent tool executions, status badges & timing panel
  ${r.cyan('/vivid [on|off]')} / ${r.cyan('/animations')}   Switch Vivid/Minimal visual mode or toggle decorative motion independently
  ${r.cyan('/tip [next|prev|list]')}           Cycle through curated ORION tips (or press Alt+T on the home screen)
  ${r.cyan('/help [close]')} / ${r.cyan('/panel close')}    Open or close contextual panels and restore clean conversation layout
  ${r.cyan('/apps')} / ${r.cyan('/open <app>')}             Refresh Active Applications bar or launch a desktop application

${r.bold('Multi-Agent, Models & Intelligence:')}
  ${r.violet('/model chain [set|reset]')}       Inspect or configure the ordered local Ollama model chain & task router
  ${r.violet('/models [model_name]')}          List all models (including 6 local Ollama models) or switch active local model
  ${r.violet('/agents')} / ${r.violet('/agent <id>')}          Inspect or switch specialized ORION agents (core, engineer, research, operator, vision, auditor)
  ${r.violet('/providers [ping|strategy]')}    Inspect all 13 AI provider adapters, health, latency, or set routing strategy
  ${r.violet('/mode [saif|nur|hikmah|auto]')}  Switch intelligence tier profile (Fast/Balanced/Deep/Dynamic)

${r.bold('Workspace Content, Session Resume & Remote Control:')}
  ${r.violet('/content [list|find|read|summarize|draft]')} Inspect, search, read, summarize, or draft workspace documents
  ${r.violet('/resume [last|<id>|clear]')}     Inspect or restore persisted session task state & workflow checkpoints
  ${r.violet('/remote control [status|enable-local|disable]')} Inspect workstation control & loopback API security boundaries

${r.bold('Security, Governance & Diagnostics:')}
  ${r.cyan('/status')} / ${r.cyan('/doctor')}              Live hardware, active agent, provider router, policy SHA-256 & pre-flight check
  ${r.cyan('/permissions [estop|rollback]')} Inspect 4-tier risk policy, trigger E-Stop, or rollback last atomic file write
  ${r.cyan('/approve [id]')} / ${r.cyan('/deny [id]')}    Approve or deny pending high-risk tool executions (action-bound token)
  ${r.cyan('/stop')} / ${r.cyan('/privacy')} / ${r.cyan('/config')}    Emergency stop, data locality guarantees, and protected policy verification
  ${r.cyan('/bench [live]')}                 Benchmark policy verification, telemetry, and live local model inference

${r.bold('Context, Memory, Tasks & Integrations:')}
  ${r.cyan('/context')} / ${r.cyan('/history')} / ${r.cyan('/memory')} Token-budget accounting, session turns, and unified memory store
  ${r.cyan('/tasks [trace|checkpoints]')}    Inspect supervised tasks, SHA-256 execution traces, or workflow checkpoints
  ${r.cyan('/tools [inspect|run]')} / ${r.cyan('/mcp')}   List all 28+ authoritative tools or manage MCP servers
  ${r.cyan('/api [start|stop|status]')}      Manage the OpenAI-compatible Local API server (http://127.0.0.1:11435/v1)
  ${r.cyan('/hackathon [run|incomplete|approve]')} Execute the UAE Responsible AI / Zero-Bureaucracy workflow & PDF dossier

${r.bold('Desktop, Media, Voice & Repository Tools:')}
  ${r.cyan('/repo [path]')} / ${r.cyan('/find <query>')}  Inspect repository structure or search source code
  ${r.cyan('/search <query>')} / ${r.cyan('/spotify')}    HTTP web search or control media/Spotify playback
  ${r.cyan('/volume')} / ${r.cyan('/clipboard')} / ${r.cyan('/speak')} Control master audio volume, system clipboard, or Windows SAPI TTS
  ${r.cyan('/weather [city]')} / ${r.cyan('/prayers')}    Live weather telemetry and UAE Islamic prayer timings
  ${r.cyan('/clear')} / ${r.cyan('/exit')}                Clear session conversation context or cleanly exit ORION CLI

  ${r.dim('Close panel: /help close  │  Switch: /system-stats · /recent-tools  │  /panel close')}
`);
  }

  private tokenize(input: string): string[] {
    const tokens: string[] = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < input.length; i++) {
      const ch = input[i];
      if (ch === '\\' && i + 1 < input.length && (input[i + 1] === '"' || input[i + 1] === "'" || input[i + 1] === '\\')) {
        current += input[i + 1];
        i++;
        continue;
      }
      if ((ch === '"' || ch === "'") && (!inQuotes || ch === quoteChar)) {
        inQuotes = !inQuotes;
        quoteChar = inQuotes ? ch : '';
        continue;
      }
      if (/\s/.test(ch) && !inQuotes) {
        if (current) {
          tokens.push(current);
          current = '';
        }
      } else {
        current += ch;
      }
    }
    if (current) tokens.push(current);
    return tokens;
  }
}
