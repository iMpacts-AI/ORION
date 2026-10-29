import { ExecutionTraceService } from '../main/services/ExecutionTraceService';
import { ProviderStatus } from '../main/services/AIProvider';
import { ModelRegistryEntry, RoutingStrategy } from '../main/services/OrionAIProviderRouter';
import { Tool, ToolCall, ToolResult } from '../shared/types';
import { McpServerStatus } from '../main/services/McpClientService';
import {
  OrionActiveAppsTracker,
  TrackedAppState,
  AppRuntimeStatus
} from './OrionActiveAppsTracker';

function redactSecrets(text: string): string {
  return String(ExecutionTraceService.redactSensitiveValue(text) ?? '');
}

export type ContextualPanelType = 'none' | 'system-stats' | 'recent-tools' | 'help';

export type TaskExecutionStatusLabel =
  | 'RUNNING'
  | 'VERIFIED'
  | 'NEEDS APPROVAL'
  | 'FAILED'
  | 'CANCELLED'
  | 'UNKNOWN';

export interface RecentToolRecord {
  id: string;
  toolId: string;
  toolName?: string;
  status: TaskExecutionStatusLabel;
  durationMs: number;
  summary: string;
  timestamp: number;
  appBadge?: string;
}

export interface SystemStatsPanelData {
  osSummary: string;
  cpuModel: string;
  cpuCores: number;
  cpuUsagePercent: number;
  ramUsedGb: string;
  ramTotalGb: string;
  ramUsagePercent: number;
  diskSummary?: string;
  networkSummary: string;
  uptimeHours: string;
  activeAgent: string;
  activeModel: string;
  policyValid: boolean;
}

export interface CliRenderOptions {
  useColor?: boolean;
  jsonMode?: boolean;
  maxWidth?: number;
  outputStream?: NodeJS.WritableStream;
  appsTracker?: OrionActiveAppsTracker;
}

/**
 * Strip unsafe terminal control sequences (OSC, APC, DCS, CSI cursor/screen clear)
 * from untrusted text before writing to stdout.
 */
export function stripTerminalControlSequences(input: string): string {
  if (!input) return '';
  return input
    // Remove OSC sequences: ESC ] ... BEL or ESC \
    .replace(/\x1b\][\s\S]*?(?:\x07|\x1b\\)/g, '')
    // Remove DCS/PM/APC sequences
    .replace(/\x1b[P^_][\s\S]*?\x1b\\/g, '')
    // Remove all CSI sequences from untrusted text
    .replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, '')
    // Remove raw C0 control chars except \n, \r, \t
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');
}

export class OrionCliRenderer {
  private useColor: boolean;
  private jsonMode: boolean;
  private maxWidth: number;
  private out: NodeJS.WritableStream;
  private isStreaming = false;
  private activePanel: ContextualPanelType = 'none';
  private recentTools: RecentToolRecord[] = [];
  private toolCallCache: Map<string, ToolCall> = new Map();
  public readonly appsTracker: OrionActiveAppsTracker;

  constructor(options: CliRenderOptions = {}) {
    const noColorEnv = Boolean(process.env.NO_COLOR) || process.env.TERM === 'dumb';
    this.jsonMode = Boolean(options.jsonMode);
    this.useColor =
      options.useColor !== undefined
        ? options.useColor && !this.jsonMode
        : Boolean(process.stdout.isTTY) && !noColorEnv && !this.jsonMode;
    this.maxWidth = options.maxWidth || this.detectTerminalWidth();
    this.out = options.outputStream || process.stdout;
    this.appsTracker = options.appsTracker || new OrionActiveAppsTracker();
  }

  public detectTerminalWidth(): number {
    const cols = process.stdout?.columns;
    if (typeof cols === 'number' && cols >= 40) {
      return Math.min(cols, 140);
    }
    return 100;
  }

  public updateTerminalWidth(cols?: number): void {
    if (typeof cols === 'number' && cols >= 40) {
      this.maxWidth = Math.min(cols, 140);
    } else {
      this.maxWidth = this.detectTerminalWidth();
    }
  }

  public getTerminalWidth(): number {
    return this.maxWidth;
  }

  public isJsonMode(): boolean {
    return this.jsonMode;
  }

  public setJsonMode(enabled: boolean): void {
    this.jsonMode = enabled;
    if (enabled) {
      this.useColor = false;
    }
  }

  public isColorEnabled(): boolean {
    return this.useColor;
  }

  public setColorEnabled(enabled: boolean): void {
    this.useColor = enabled && !this.jsonMode;
  }

  public getActivePanel(): ContextualPanelType {
    return this.activePanel;
  }

  public setActivePanel(panel: ContextualPanelType): void {
    this.activePanel = panel;
  }

  public getRecentTools(): RecentToolRecord[] {
    return [...this.recentTools];
  }

  public recordToolResultInHistory(record: RecentToolRecord): void {
    const existingIdx = this.recentTools.findIndex(r => r.id === record.id);
    if (existingIdx >= 0) {
      this.recentTools[existingIdx] = record;
    } else {
      this.recentTools.push(record);
      if (this.recentTools.length > 25) {
        this.recentTools.shift();
      }
    }
  }

  private ansi(code: string, text: string): string {
    if (!this.useColor) return text;
    return `\x1b[${code}m${text}\x1b[0m`;
  }

  public bold(text: string): string { return this.ansi('1', text); }
  public dim(text: string): string { return this.ansi('38;5;245', text); }
  // Secondary accent: Electric Blue (#3B82F6 -> 256-color 75)
  public cyan(text: string): string { return this.ansi('38;5;75', text); }
  public electricBlue(text: string): string { return this.ansi('1;38;5;75', text); }
  // Primary accent: ORION Purple / Violet (#8B5CF6 -> 256-color 141 & 99)
  public violet(text: string): string { return this.ansi('38;5;141', text); }
  public deepViolet(text: string): string { return this.ansi('38;5;99', text); }
  public brand(text: string): string { return this.ansi('1;38;5;141', text); }
  // Semantic statuses
  public green(text: string): string { return this.ansi('38;5;42', text); }
  public yellow(text: string): string { return this.ansi('38;5;214', text); }
  public red(text: string): string { return this.ansi('38;5;203', text); }
  public gray(text: string): string { return this.ansi('38;5;245', text); }
  public white(text: string): string { return this.ansi('1;97', text); }

  /**
   * Renders the genuine ORION split-orbital star emblem from assets/branding/orion_logo_kit.png: (✦) O R I O N
   */
  public formatOrionLogo(): string {
    const caps = OrionActiveAppsTracker.detectTerminalCapabilities(this.useColor);
    if (!caps.supportsColor) {
      return caps.supportsUnicode ? '(✦) O R I O N' : '(*) O R I O N';
    }
    const leftArc = this.electricBlue('(');
    const starFlare = this.brand(caps.supportsUnicode ? '✦' : '*');
    const rightArc = this.electricBlue(')');
    const wordmark = this.white('O R I O N');
    return `${leftArc}${starFlare}${rightArc} ${wordmark}`;
  }

  public sanitize(raw: unknown): string {
    const str = typeof raw === 'string' ? raw : JSON.stringify(raw ?? '');
    const redacted = redactSecrets(str);
    return stripTerminalControlSequences(redacted);
  }

  public stripAnsi(text: string): string {
    return (text || '').replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
  }

  public write(text: string): void {
    this.out.write(text);
  }

  public writeLine(text = ''): void {
    this.out.write(`${text}\n`);
  }

  public writeJson(payload: unknown): void {
    const serialized = JSON.stringify(payload, null, 2);
    this.out.write(`${redactSecrets(serialized)}\n`);
  }

  public divider(char = '─', width?: number): string {
    const w = Math.max(20, Math.min(width || this.maxWidth, 120));
    return this.deepViolet(char.repeat(w));
  }

  public truncate(text: string, maxLen: number): string {
    const clean = this.sanitize(text).replace(/\s+/g, ' ').trim();
    if (clean.length <= maxLen) return clean;
    return `${clean.slice(0, Math.max(0, maxLen - 3))}...`;
  }

  /**
   * Maps a ToolResult to one of the 6 required canonical status labels:
   * RUNNING, VERIFIED, NEEDS APPROVAL, FAILED, CANCELLED, UNKNOWN
   */
  public static resolveTaskStatusLabel(result: ToolResult): TaskExecutionStatusLabel {
    const errText = String(result.error || '');
    if (
      errText.includes('AUTHORIZATION REQUIRED') ||
      errText.includes('Approval ID:') ||
      errText.includes('requires explicit operator approval') ||
      errText.includes('requires operator approval')
    ) {
      return 'NEEDS APPROVAL';
    }
    if (
      errText.includes('Emergency Stop') ||
      errText.includes('ABORTED') ||
      errText.toLowerCase().includes('cancelled') ||
      errText.toLowerCase().includes('canceled')
    ) {
      return 'CANCELLED';
    }

    const dataObj = (result.data ?? (result as any).output ?? {}) as Record<string, any>;
    if (!result.success || result.verificationStatus === 'FAILED' || dataObj?.success === false) {
      return 'FAILED';
    }

    if (result.verificationStatus === 'VERIFIED' || result.verified === true) {
      return 'VERIFIED';
    }

    // Never treat an unverified tool invocation as VERIFIED
    return 'UNKNOWN';
  }

  public formatStatusBadge(status: TaskExecutionStatusLabel): string {
    switch (status) {
      case 'RUNNING':
        return this.electricBlue('● RUNNING');
      case 'VERIFIED':
        return this.green('✓ VERIFIED');
      case 'NEEDS APPROVAL':
        return this.yellow('⚠ NEEDS APPROVAL');
      case 'FAILED':
        return this.red('✗ FAILED');
      case 'CANCELLED':
        return this.yellow('⊘ CANCELLED');
      case 'UNKNOWN':
      default:
        return this.yellow('? UNKNOWN');
    }
  }

  /**
   * Section 3: Compact Header + Default Conversation-First Layout.
   * Displays the genuine ORION logo, product name, CLI version, short descriptor,
   * compact status for model/agent/permissions, and the persistent Active Applications bar.
   * Does NOT clutter the header with hardware metrics, decorative cards, or long command lists.
   */
  public renderStartupHeader(info: {
    version: string;
    platform?: string;
    activeProvider: string;
    activeModel: string;
    routingStrategy?: RoutingStrategy;
    toolCount?: number;
    mcpConnected?: number;
    estopActive?: boolean;
    activeAgent?: string;
    activeAgentId?: string;
    activeAgentName?: string;
    permissionCeiling?: string;
    policyVerified?: boolean;
    configuredProvidersCount?: number;
    totalProvidersCount?: number;
    registeredToolsCount?: number;
    mcpConnectedCount?: number;
    mcpConfiguredCount?: number;
    localApiPort?: number | null;
  }): void {
    if (this.jsonMode) return;
    this.updateTerminalWidth();
    const width = Math.min(Math.max(this.maxWidth, 48), 108);
    const agentLabel = info.activeAgent || info.activeAgentId || 'core';
    const permMode = info.estopActive
      ? this.red('E-STOP ACTIVE')
      : info.policyVerified === false
        ? this.red('TAMPER_DETECTED')
        : this.green(`4-Tier Protected (${info.permissionCeiling || 'MEDIUM'})`);
    const modelStr = `${info.activeProvider}:${info.activeModel}`;

    // Refresh Active Applications state from fast cached OS window snapshot
    this.appsTracker.refreshFromSystem(false);

    if (width < 72) {
      this.writeLine(
        `${this.formatOrionLogo()} ${this.dim(`v${info.version} · Sovereign AI Operating Layer`)}`
      );
      this.writeLine(
        `${this.dim('Model:')} ${this.cyan(modelStr)} ${this.dim('│ Agent:')} ${this.violet(agentLabel)} ${this.dim('│ Mode:')} ${permMode}`
      );
      this.renderActiveApplicationsBar();
      return;
    }

    const borderTop = this.deepViolet(`╭${'─'.repeat(width - 2)}╮`);
    const borderBot = this.deepViolet(`╰${'─'.repeat(width - 2)}╯`);

    const line1Content = `${this.formatOrionLogo()}  ${this.violet(`v${info.version}`)} ${this.dim('· Sovereign AI Operating Layer')}`;
    const line2Content =
      `${this.dim('Model:')} ${this.cyan(modelStr)}  ${this.dim('│')}  ` +
      `${this.dim('Agent:')} ${this.violet(agentLabel)}  ${this.dim('│')}  ` +
      `${this.dim('Security:')} ${permMode}`;
    const line3Content =
      `${this.dim('Contextual Panels:')} ${this.cyan('/system-stats')} ${this.dim('·')} ` +
      `${this.cyan('/recent-tools')} ${this.dim('·')} ${this.cyan('/help')} ${this.dim('(hidden by default)')}`;

    this.writeLine(borderTop);
    this.writeLine(this.padBoxLine(line1Content, width));
    this.writeLine(this.padBoxLine(line2Content, width));
    this.writeLine(this.padBoxLine(line3Content, width));
    this.writeLine(borderBot);

    // Section 4: Active Applications is the ONLY auxiliary panel visible by default
    this.renderActiveApplicationsBar();
  }

  private padBoxLine(content: string, totalWidth: number): string {
    const innerWidth = totalWidth - 4;
    const visibleLen = this.stripAnsi(content).length;
    const padCount = Math.max(0, innerWidth - visibleLen);
    return `${this.deepViolet('│')} ${content}${' '.repeat(padCount)} ${this.deepViolet('│')}`;
  }

  /**
   * Section 4: Persistent Active Applications section (visible by default).
   * Displays genuine application icons and truthful runtime states:
   * Open, Launching, Not running, Launch failed, Unknown.
   */
  public renderActiveApplicationsBar(customApps?: TrackedAppState[]): void {
    if (this.jsonMode) return;
    const apps = customApps || this.appsTracker.getDisplayedApplications(5);
    const formatState = (status: AppRuntimeStatus): string => {
      switch (status) {
        case 'Open':
          return this.green('● Open');
        case 'Launching':
          return this.electricBlue('◌ Launching');
        case 'Launch failed':
          return this.red('✗ Launch failed');
        case 'Unknown':
          return this.yellow('? Unknown');
        case 'Not running':
        default:
          return this.dim('○ Not running');
      }
    };

    const items = apps.map(app => {
      const badge = this.appsTracker.formatAppBadge(app, this.useColor, true);
      return `${badge} ${formatState(app.status)}`;
    });

    const width = this.maxWidth;
    if (width < 76) {
      this.writeLine(`${this.brand('Active Applications:')} ${items.slice(0, 3).join(this.dim(' │ '))}`);
      if (items.length > 3) {
        this.writeLine(`  ${items.slice(3).join(this.dim(' │ '))}`);
      }
    } else {
      this.writeLine(`${this.brand('Active Applications')} ${this.dim('▸')} ${items.join(this.dim('  │  '))}`);
    }
  }

  /**
   * Section 5: Optional Contextual Panels (Hidden Until Requested).
   * Renders System Stats (/system-stats), Recent Tools (/recent-tools), or Help (/help)
   * with responsive wide split-pane or compact contextual frame and explicit close instructions.
   */
  public renderSystemStatsPanel(stats: SystemStatsPanelData): void {
    this.activePanel = 'system-stats';
    if (this.jsonMode) return;

    this.appsTracker.refreshFromSystem(false);
    this.updateTerminalWidth();
    const width = Math.min(Math.max(this.maxWidth, 50), 112);
    const policyBadge = stats.policyValid ? this.green('VERIFIED') : this.red('TAMPER_DETECTED');

    this.writeLine('');
    if (width >= 96) {
      // Wide terminal: Side-by-side split contextual view (Conversation / Active Apps summary on left, System Stats panel on right)
      const leftWidth = Math.floor(width * 0.44);
      const rightWidth = width - leftWidth - 3;
      const apps = this.appsTracker.getDisplayedApplications(5);

      const leftLines: string[] = [
        this.bold('Session & Active Applications'),
        `${this.dim('Agent   :')} ${this.violet(stats.activeAgent)}`,
        `${this.dim('Model   :')} ${this.cyan(stats.activeModel)}`,
        `${this.dim('Security:')} ${policyBadge}`,
        this.dim('─'.repeat(Math.max(10, leftWidth - 4))),
        ...apps.map(a => `${this.appsTracker.formatAppBadge(a, this.useColor, true)}: ${this.formatAppStateText(a.status)}`)
      ];

      const rightLines: string[] = [
        `${this.brand('◈ Contextual Panel: System Stats')} ${this.dim('(/system-stats)')}`,
        `${this.cyan('OS / Arch'.padEnd(13))}: ${this.truncate(stats.osSummary, rightWidth - 18)}`,
        `${this.cyan('CPU Load'.padEnd(13))}: ${stats.cpuUsagePercent}% (${stats.cpuCores} cores · ${this.truncate(stats.cpuModel, Math.max(12, rightWidth - 32))})`,
        `${this.cyan('Memory (RAM)'.padEnd(13))}: ${stats.ramUsedGb} / ${stats.ramTotalGb} GB (${stats.ramUsagePercent}%)`,
        ...(stats.diskSummary ? [`${this.cyan('Disk Volume'.padEnd(13))}: ${this.truncate(stats.diskSummary, rightWidth - 18)}`] : []),
        `${this.cyan('Network'.padEnd(13))}: ${this.truncate(stats.networkSummary, rightWidth - 18)}`,
        `${this.cyan('System Uptime'.padEnd(13))}: ${stats.uptimeHours} hours`,
        this.dim(`Close: /system-stats close │ Switch: /recent-tools · /help`)
      ];

      this.renderSplitContextualPane(leftLines, rightLines, leftWidth, rightWidth);
      return;
    }

    // Compact contextual box for narrower terminals
    this.writeLine(this.deepViolet(`╭─ `) + this.brand('◈ Contextual Panel: System Stats (/system-stats)') + this.deepViolet(' ─╮'));
    this.writeLine(`  • ${this.cyan('OS / Platform'.padEnd(15))}: ${stats.osSummary}`);
    this.writeLine(`  • ${this.cyan('CPU Telemetry'.padEnd(15))}: ${stats.cpuUsagePercent}% load (${stats.cpuCores} cores · ${this.truncate(stats.cpuModel, 38)})`);
    this.writeLine(`  • ${this.cyan('Memory (RAM)'.padEnd(15))}: ${stats.ramUsedGb} GB / ${stats.ramTotalGb} GB (${stats.ramUsagePercent}%)`);
    if (stats.diskSummary) {
      this.writeLine(`  • ${this.cyan('Disk Storage'.padEnd(15))}: ${stats.diskSummary}`);
    }
    this.writeLine(`  • ${this.cyan('Network'.padEnd(15))}: ${stats.networkSummary}`);
    this.writeLine(`  • ${this.cyan('Uptime'.padEnd(15))}: ${stats.uptimeHours} hours`);
    this.writeLine(`  • ${this.cyan('Active Engine'.padEnd(15))}: ${stats.activeModel} │ Agent: ${stats.activeAgent} │ Policy: ${policyBadge}`);
    this.writeLine(`  ${this.dim('Close panel: /system-stats close  │  Switch: /recent-tools · /help  │  /panel close')}`);
    this.writeLine('');
  }

  public renderRecentToolsPanel(records?: RecentToolRecord[]): void {
    this.activePanel = 'recent-tools';
    if (this.jsonMode) return;

    const list = records || this.recentTools;
    this.writeLine('');
    this.writeLine(
      `${this.brand('◈ Contextual Panel: Recent Tools')} ${this.dim(`(${list.length} recorded in session)`)}`
    );
    this.writeLine(this.divider('─', Math.min(this.maxWidth, 96)));

    if (list.length === 0) {
      this.writeLine(`  ${this.dim('No tools executed in this session yet.')}`);
    } else {
      for (const item of list.slice(-10)) {
        const statusStr = this.formatStatusBadge(item.status);
        const appPrefix = item.appBadge ? `${item.appBadge} ` : '';
        const dur = `${item.durationMs}ms`.padStart(6);
        const summary = this.truncate(item.summary, Math.max(24, this.maxWidth - 48));
        this.writeLine(
          `  • ${appPrefix}${this.bold(item.toolId.padEnd(26))} [${statusStr}] ${this.dim(dur)}  ${this.dim(summary)}`
        );
      }
    }

    this.writeLine(this.divider('─', Math.min(this.maxWidth, 96)));
    this.writeLine(
      `  ${this.dim('Close panel: /recent-tools close  │  Switch: /system-stats · /help  │  /panel close')}\n`
    );
  }

  public closeContextualPanel(): ContextualPanelType {
    const prev = this.activePanel;
    this.activePanel = 'none';
    if (!this.jsonMode) {
      this.writeLine(
        `${this.green('✓')} Contextual panel ${this.bold(prev === 'none' ? 'view' : prev)} closed. Restored clean conversation layout.`
      );
      this.renderActiveApplicationsBar();
    }
    return prev;
  }

  private formatAppStateText(status: AppRuntimeStatus): string {
    switch (status) {
      case 'Open':
        return this.green('Open');
      case 'Launching':
        return this.electricBlue('Launching');
      case 'Launch failed':
        return this.red('Launch failed');
      case 'Unknown':
        return this.yellow('Unknown');
      case 'Not running':
      default:
        return this.dim('Not running');
    }
  }

  private renderSplitContextualPane(
    leftLines: string[],
    rightLines: string[],
    leftWidth: number,
    rightWidth: number
  ): void {
    const totalRows = Math.max(leftLines.length, rightLines.length);
    const topBorder =
      this.deepViolet(`╭${'─'.repeat(leftWidth)}┬${'─'.repeat(rightWidth)}╮`);
    const botBorder =
      this.deepViolet(`╰${'─'.repeat(leftWidth)}┴${'─'.repeat(rightWidth)}╯`);

    this.writeLine(topBorder);
    for (let i = 0; i < totalRows; i++) {
      const lText = leftLines[i] || '';
      const rText = rightLines[i] || '';
      const lVis = this.stripAnsi(lText).length;
      const rVis = this.stripAnsi(rText).length;
      const lPad = Math.max(0, leftWidth - 2 - lVis);
      const rPad = Math.max(0, rightWidth - 2 - rVis);
      this.writeLine(
        `${this.deepViolet('│')} ${lText}${' '.repeat(lPad)} ${this.deepViolet('│')} ${rText}${' '.repeat(rPad)} ${this.deepViolet('│')}`
      );
    }
    this.writeLine(botBorder);
    this.writeLine('');
  }

  public renderTaskStart(taskLabel: string, query: string): void {
    if (this.jsonMode) return;
    this.writeLine(
      `\n${this.brand('╭─')} ${this.bold('ORION Task')} ${this.dim(`[${taskLabel}]`)} ${this.electricBlue('● RUNNING')} ${this.dim('─')} ${this.sanitize(query)}`
    );
  }

  public renderToolStarted(stepIndex: number, toolCall: ToolCall): void {
    this.toolCallCache.set(toolCall.id, toolCall);
    this.appsTracker.recordToolStarted(toolCall);
    const opBadge = `${this.appsTracker.resolveToolOperationBadge(toolCall, this.useColor)} `;

    if (this.jsonMode) return;
    const argPreview = this.truncate(JSON.stringify(toolCall.arguments || {}), Math.max(24, this.maxWidth - 46));
    this.writeLine(
      `${this.deepViolet('├─')} ${this.electricBlue(`[Step ${stepIndex}: RUNNING]`)} ${opBadge}${this.bold(toolCall.toolId)} ${this.dim(argPreview)}`
    );
  }

  public renderToolCompleted(result: ToolResult): void {
    const statusLabel = OrionCliRenderer.resolveTaskStatusLabel(result);
    const badge = this.formatStatusBadge(statusLabel);
    const duration = `${result.executionTimeMs || 0}ms`;

    const cachedCall = this.toolCallCache.get(result.toolCallId);
    this.toolCallCache.delete(result.toolCallId);

    const appUpdate = this.appsTracker.recordToolCompleted(result);
    let appBadgeStr = '';
    if (appUpdate?.app) {
      appBadgeStr = `${this.appsTracker.formatAppBadge(appUpdate.app, this.useColor, true)} `;
    } else if (cachedCall) {
      appBadgeStr = `${this.appsTracker.resolveToolOperationBadge(cachedCall, this.useColor)} `;
    } else {
      const syntheticCall: ToolCall = {
        id: result.toolCallId || 'res',
        toolId: result.toolId,
        toolName: result.toolId,
        arguments: {},
        timestamp: result.timestamp || Date.now(),
        requiresUserApproval: false
      };
      appBadgeStr = `${this.appsTracker.resolveToolOperationBadge(syntheticCall, this.useColor)} `;
    }

    const summaryText = result.success
      ? statusLabel === 'VERIFIED'
        ? 'Postcondition verified'
        : 'Executed (unverified outcome)'
      : this.sanitize(result.error || 'Tool execution failed');

    this.recordToolResultInHistory({
      id: result.toolCallId || `tool_${Date.now()}`,
      toolId: result.toolId,
      status: statusLabel,
      durationMs: result.executionTimeMs || 0,
      summary: summaryText,
      timestamp: result.timestamp || Date.now(),
      appBadge: appBadgeStr.trim() || undefined
    });

    if (this.jsonMode) return;

    if (result.success) {
      this.writeLine(
        `${this.deepViolet('├─')}   ${badge} ${appBadgeStr}${this.dim(result.toolId)} ${this.dim(`(${duration})`)}`
      );
    } else {
      const errMsg = this.truncate(this.sanitize(result.error || 'Tool execution failed'), Math.max(30, this.maxWidth - 28));
      this.writeLine(
        `${this.deepViolet('├─')}   ${badge} ${appBadgeStr}${this.dim(result.toolId)} ${this.dim(`(${duration})`)}: ${this.red(errMsg)}`
      );
    }

    if (appUpdate?.stateChanged) {
      this.writeLine(
        `${this.deepViolet('├─')}   ${this.dim('Active App Updated ▸')} ${this.appsTracker.formatAppBadge(appUpdate.app, this.useColor, true)} ${this.formatAppStateText(appUpdate.app.status)}`
      );
    }
  }

  public renderProviderFailover(failedProviderId: string, nextProviderId?: string): void {
    if (this.jsonMode) return;
    const msg = nextProviderId
      ? `Provider '${failedProviderId}' unavailable; failing over to '${nextProviderId}'...`
      : `Provider '${failedProviderId}' failed; selecting next healthy provider...`;
    this.writeLine(`${this.deepViolet('├─')} ${this.yellow('⚡ FAILOVER')} ${this.dim(this.sanitize(msg))}`);
  }

  public startStream(providerId: string, modelName: string): void {
    if (this.jsonMode) return;
    this.isStreaming = true;
    this.writeLine(`${this.deepViolet('╰─')} ${this.brand('ORION')} ${this.dim(`[${providerId}:${modelName}]`)}`);
    this.write('   ');
  }

  public writeStreamToken(token: string): void {
    if (this.jsonMode) return;
    const safe = this.sanitize(token).replace(/\n/g, '\n   ');
    this.write(safe);
  }

  public endStream(latencyMs?: number): void {
    if (this.jsonMode) return;
    if (this.isStreaming) {
      this.writeLine('');
      if (latencyMs !== undefined) {
        this.writeLine(`   ${this.dim(`Completed in ${latencyMs}ms`)}\n`);
      } else {
        this.writeLine('');
      }
      this.isStreaming = false;
    }
  }

  public renderAssistantResponse(
    response: string,
    latencyMs: number,
    providerLabel?: string
  ): void {
    if (this.jsonMode) return;
    const safe = this.sanitize(response);
    const meta = providerLabel ? `${providerLabel} · ${latencyMs}ms` : `${latencyMs}ms`;
    this.writeLine(`${this.deepViolet('╰─')} ${this.brand('ORION')} ${this.dim(`[${meta}]`)}`);
    for (const line of safe.split('\n')) {
      this.writeLine(`   ${line}`);
    }
    this.writeLine('');
  }

  public renderError(message: string, suggestion?: string): void {
    if (this.jsonMode) {
      this.writeJson({ error: this.sanitize(message), suggestion: suggestion ? this.sanitize(suggestion) : undefined });
      return;
    }
    this.writeLine(`${this.red('✗ ERROR:')} ${this.sanitize(message)}`);
    if (suggestion) {
      this.writeLine(`  ${this.dim('Hint:')} ${this.sanitize(suggestion)}`);
    }
  }

  public renderWarning(message: string): void {
    if (this.jsonMode) return;
    this.writeLine(`${this.yellow('⚠ WARNING:')} ${this.sanitize(message)}`);
  }

  public renderInfo(message: string): void {
    if (this.jsonMode) return;
    this.writeLine(`${this.electricBlue('ℹ')} ${this.sanitize(message)}`);
  }

  public renderApprovalPrompt(details: {
    toolId: string;
    toolName: string;
    riskLevel: string;
    arguments: Record<string, any>;
    reason: string;
  }): string {
    const argsStr = this.truncate(JSON.stringify(details.arguments || {}), 100);
    const syntheticCall: ToolCall = {
      id: 'approval_preview',
      toolId: details.toolId,
      toolName: details.toolName,
      arguments: details.arguments || {},
      timestamp: Date.now(),
      requiresUserApproval: true
    };
    const opBadge = this.appsTracker.resolveToolOperationBadge(syntheticCall, this.useColor);
    this.writeLine(`\n${this.yellow('╭─ ⚠ NEEDS APPROVAL — OPERATOR AUTHORIZATION REQUIRED')}`);
    this.writeLine(`${this.yellow('│')} ${this.bold('Proposed Action :')} ${this.sanitize(details.toolName)} — ${argsStr}`);
    this.writeLine(`${this.yellow('│')} ${this.bold('App / Tool      :')} ${opBadge} ${this.sanitize(details.toolId)}`);
    this.writeLine(`${this.yellow('│')} ${this.bold('Status & Risk   :')} ${this.formatStatusBadge('NEEDS APPROVAL')} ${this.dim(`(Risk Tier: ${this.sanitize(details.riskLevel)})`)}`);
    this.writeLine(`${this.yellow('│')} ${this.bold('Why Needed      :')} ${this.sanitize(details.reason)}`);
    this.writeLine(`${this.yellow('│')} ${this.bold('Approving Allows:')} Single action-bound execution of this tool call only (no blanket permission).`);
    this.writeLine(`${this.yellow('│')} ${this.bold('How to Respond  :')} Type 'y' to approve, 'N' to deny, or use '/approve <id>' / '/deny <id>'.`);
    return `${this.yellow('╰─')} Approve execution? ${this.bold('[y/N]')}: `;
  }

  public renderProvidersTable(
    statuses: ProviderStatus[],
    activeProviderId: string,
    strategy: RoutingStrategy
  ): void {
    if (this.jsonMode) {
      this.writeJson({ activeProviderId, strategy, providers: statuses });
      return;
    }
    this.writeLine(`\n${this.bold('AI Provider Matrix')} ${this.dim(`(Active: ${activeProviderId} | Strategy: ${strategy})`)}`);
    this.writeLine(this.divider('─', 88));
    this.writeLine(
      `  ${this.bold('ID'.padEnd(16))} ${this.bold('Model'.padEnd(26))} ${this.bold('Config'.padEnd(10))} ${this.bold('Health'.padEnd(12))} ${this.bold('Latency')}`
    );
    this.writeLine(this.divider('─', 88));
    for (const p of statuses) {
      const isAct = p.id === activeProviderId ? this.cyan('▸') : ' ';
      const cfg = p.isConfigured ? this.green('READY   ') : this.dim('UNSET   ');
      const hlth = p.isHealthy
        ? this.green('HEALTHY   ')
        : p.consecutiveFailures > 0
          ? this.red('FAILING   ')
          : this.yellow('DEGRADED  ');
      const lat = p.lastObservedLatencyMs > 0 ? `${Math.round(p.lastObservedLatencyMs)}ms` : '-';
      this.writeLine(
        `${isAct} ${p.id.padEnd(16)} ${this.truncate(p.currentModel, 24).padEnd(26)} ${cfg}   ${hlth}   ${lat}`
      );
    }
    this.writeLine('');
  }

  public renderModelsTable(models: ModelRegistryEntry[], configuredProviders: Set<string>): void {
    if (this.jsonMode) {
      this.writeJson({ models });
      return;
    }
    this.writeLine(`\n${this.bold(`Registered AI Models (${models.length})`)}`);
    this.writeLine(this.divider('─', 96));
    this.writeLine(
      `  ${this.bold('Provider'.padEnd(14))} ${this.bold('Model ID'.padEnd(32))} ${this.bold('Context'.padEnd(10))} ${this.bold('Capabilities'.padEnd(20))} ${this.bold('Status')}`
    );
    this.writeLine(this.divider('─', 96));
    for (const m of models) {
      const ready = configuredProviders.has(m.providerId) || m.providerId === 'ollama';
      const statusBadge = ready ? this.green('READY') : this.dim('KEY UNSET');
      const caps = [
        m.supportsTools ? 'tools' : null,
        m.supportsVision ? 'vision' : null,
        m.supportsStreaming ? 'stream' : null
      ]
        .filter(Boolean)
        .join(',');
      const ctxStr = `${Math.round(m.maxContextTokens / 1024)}k`;
      this.writeLine(
        `  ${m.providerId.padEnd(14)} ${this.truncate(m.modelId, 30).padEnd(32)} ${ctxStr.padEnd(10)} ${caps.padEnd(20)} ${statusBadge}`
      );
    }
    this.writeLine('');
  }

  public renderToolsTable(tools: Tool[]): void {
    if (this.jsonMode) {
      this.writeJson({ count: tools.length, tools });
      return;
    }
    this.writeLine(`\n${this.bold(`Registered Authoritative Tools (${tools.length})`)}`);
    this.writeLine(this.divider('─', 92));
    this.writeLine(
      `  ${this.bold('Tool ID'.padEnd(32))} ${this.bold('Category'.padEnd(14))} ${this.bold('Risk'.padEnd(10))} ${this.bold('Description')}`
    );
    this.writeLine(this.divider('─', 92));
    for (const t of tools) {
      const riskBadge =
        t.permissionLevel === 'CRITICAL'
          ? this.red(t.permissionLevel.padEnd(8))
          : t.permissionLevel === 'HIGH'
            ? this.yellow(t.permissionLevel.padEnd(8))
            : t.permissionLevel === 'MEDIUM'
              ? this.cyan(t.permissionLevel.padEnd(8))
              : this.green(t.permissionLevel.padEnd(8));
      this.writeLine(
        `  ${t.id.padEnd(32)} ${t.category.padEnd(14)} ${riskBadge}   ${this.truncate(t.description, 32)}`
      );
    }
    this.writeLine('');
  }

  public renderMcpStatus(servers: McpServerStatus[], configPath?: string): void {
    this.renderMcpStatusTable(servers, configPath);
  }

  public renderMcpStatusTable(servers: McpServerStatus[], configPath?: string): void {
    if (this.jsonMode) {
      this.writeJson({ configPath, servers });
      return;
    }
    this.writeLine(
      `\n${this.bold(`MCP Server Connections (${servers.length})`)}${configPath ? ` ${this.dim(`[${configPath}]`)}` : ''}`
    );
    this.writeLine(this.divider('─', 88));
    if (servers.length === 0) {
      this.writeLine(`  ${this.dim('No MCP servers configured. Use /mcp add <name> <command> [args...] to register a stdio server.')}\n`);
      return;
    }
    for (const s of servers) {
      const stateColor =
        s.state === 'CONNECTED'
          ? this.green(s.state.padEnd(12))
          : s.state === 'CONFIGURED' || s.state === 'DISCONNECTED'
            ? this.yellow(s.state.padEnd(12))
            : this.red(s.state.padEnd(12));
      const trustBadge = s.trusted ? this.green('TRUSTED') : this.yellow('UNTRUSTED');
      this.writeLine(
        `  • ${this.bold(s.name.padEnd(18))} ${stateColor} [${trustBadge}] Tools: ${s.discoveredTools.length} | Cmd: ${this.sanitize(s.command)} ${this.sanitize((s.args || []).join(' '))}`
      );
      if (s.lastError) {
        this.writeLine(`    ${this.red('└─ Error:')} ${this.sanitize(s.lastError)}`);
      }
    }
    this.writeLine('');
  }
}
