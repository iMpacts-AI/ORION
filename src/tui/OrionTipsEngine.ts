export type OrionTipCategory =
  | 'cli_shortcuts'
  | 'capabilities'
  | 'browser_computer_use'
  | 'safety_permissions'
  | 'productivity_workflows'
  | 'customization'
  | 'troubleshooting'
  | 'privacy_security'
  | 'engine_configuration'
  | 'request_examples'
  | 'cli_distribution';

export type OrionTipPriority = 'high' | 'normal' | 'low';

export interface OrionTipDefinition {
  id: string;
  category: OrionTipCategory;
  priority: OrionTipPriority;
  /** Localized English template using `{highlight}...{/highlight}` tokens */
  template: string;
  /** Optional platform filter (e.g. `['win32']` for Windows-specific desktop tips) */
  platforms?: ReadonlyArray<NodeJS.Platform>;
  /** Optional slash command that must be registered & implemented for this tip to appear */
  requiresCommand?: string;
  /** Optional context filter (e.g. only when visible desktop automation is available) */
  requiresDesktopControl?: boolean;
}

export interface ParsedTipSegment {
  text: string;
  highlight: boolean;
}

export const TIP_ROTATION_INTERVAL_MS = 10_000;

export const TIP_PRIORITY_WEIGHTS: Readonly<Record<OrionTipPriority, number>> = Object.freeze({
  high: 3,
  normal: 2,
  low: 1
});

/**
 * Curated, data-driven ORION Tip Catalog covering all 12 product categories.
 * Every command and workflow referenced here corresponds to an implemented, verified ORION feature.
 */
export const ORION_CURATED_TIP_CATALOG: ReadonlyArray<OrionTipDefinition> = Object.freeze([
  // 1. CLI Shortcuts
  {
    id: 'shortcut.slash_palette',
    category: 'cli_shortcuts',
    priority: 'high',
    template: 'Type {highlight}/{/highlight} to open the interactive command palette and filter skills instantly'
  },
  {
    id: 'shortcut.mode_cycle',
    category: 'cli_shortcuts',
    priority: 'high',
    template: 'Press {highlight}Tab{/highlight} to switch between {highlight}Build{/highlight}, {highlight}Plan{/highlight}, and {highlight}Chat{/highlight} modes'
  },
  {
    id: 'shortcut.effort_cycle',
    category: 'cli_shortcuts',
    priority: 'normal',
    template: 'Press {highlight}Shift+Tab{/highlight} to adjust reasoning effort ({highlight}low{/highlight} · {highlight}medium{/highlight} · {highlight}high{/highlight} · {highlight}max{/highlight})'
  },
  {
    id: 'shortcut.next_tip',
    category: 'cli_shortcuts',
    priority: 'high',
    requiresCommand: '/tip',
    template: 'Press {highlight}Alt+T{/highlight} or run {highlight}/tip{/highlight} anytime to cycle to another useful tip'
  },
  {
    id: 'shortcut.escape_cancel',
    category: 'cli_shortcuts',
    priority: 'high',
    template: 'Press {highlight}Esc{/highlight} while a task is running to cancel active generation and child processes safely'
  },
  {
    id: 'shortcut.runtime_status',
    category: 'cli_shortcuts',
    priority: 'normal',
    template: 'Press {highlight}Ctrl+P{/highlight} to view live mode, engine, permission integrity, and Emergency Stop status'
  },
  {
    id: 'shortcut.clear_line',
    category: 'cli_shortcuts',
    priority: 'low',
    template: 'Use {highlight}Ctrl+U{/highlight} to clear the current input line and {highlight}Ctrl+A{/highlight}/{highlight}Ctrl+E{/highlight} to jump home or end'
  },

  // 2. ORION Capabilities
  {
    id: 'cap.attach_context',
    category: 'capabilities',
    priority: 'high',
    requiresCommand: '/attach',
    template: 'Use {highlight}/attach <path>{/highlight} or {highlight}@{/highlight} to pin workspace files directly into active context'
  },
  {
    id: 'cap.checkpoints_rewind',
    category: 'capabilities',
    priority: 'normal',
    requiresCommand: '/rewind',
    template: 'Create named workspace snapshots with {highlight}/rewind create{/highlight} and restore cleanly anytime'
  },
  {
    id: 'cap.code_search',
    category: 'capabilities',
    priority: 'normal',
    requiresCommand: '/find',
    template: 'Run {highlight}/find <pattern>{/highlight} or {highlight}/repo{/highlight} to inspect codebase structure without modifying files'
  },
  {
    id: 'cap.reminders_notes',
    category: 'capabilities',
    priority: 'low',
    requiresCommand: '/reminders',
    template: 'Track persistent workspace notes with {highlight}/notes{/highlight} and scheduled tasks with {highlight}/reminders{/highlight}'
  },

  // 3. Browser & Visible Computer-Use Guidance
  {
    id: 'browser.visible_chrome_search',
    category: 'browser_computer_use',
    priority: 'high',
    requiresDesktopControl: true,
    template: 'Ask ORION to {highlight}open Chrome and search{/highlight} to watch real foreground browser navigation on screen'
  },
  {
    id: 'browser.auth_pause_safety',
    category: 'browser_computer_use',
    priority: 'high',
    requiresDesktopControl: true,
    template: 'ORION pauses automatically at {highlight}sign-in, MFA, and CAPTCHA{/highlight} screens so you stay in control'
  },
  {
    id: 'browser.desktop_apps_win32',
    category: 'browser_computer_use',
    priority: 'normal',
    platforms: ['win32'],
    requiresDesktopControl: true,
    template: 'ORION verifies window focus and screen state after launching Windows apps like {highlight}Chrome{/highlight} or {highlight}Notepad{/highlight}'
  },
  {
    id: 'browser.safe_web_search',
    category: 'browser_computer_use',
    priority: 'normal',
    requiresCommand: '/search',
    template: 'Use {highlight}/search <query>{/highlight} for quick SSRF-protected web lookups right inside the terminal'
  },

  // 4. Safety & Permission Controls
  {
    id: 'safety.tier2_approval',
    category: 'safety_permissions',
    priority: 'high',
    requiresCommand: '/permissions',
    template: 'Consequential actions pause for {highlight}[Y] Approve{/highlight} or {highlight}[N] Deny{/highlight} confirmation before running'
  },
  {
    id: 'safety.emergency_stop',
    category: 'safety_permissions',
    priority: 'high',
    requiresCommand: '/stop',
    template: 'Run {highlight}/stop{/highlight} to engage Emergency Stop immediately; reset later with {highlight}/permissions reset{/highlight}'
  },
  {
    id: 'safety.plan_readonly',
    category: 'safety_permissions',
    priority: 'high',
    requiresCommand: '/plan',
    template: 'Switch to {highlight}/plan{/highlight} mode to explore architecture and action steps with file mutations blocked'
  },
  {
    id: 'safety.audit_verification',
    category: 'safety_permissions',
    priority: 'normal',
    requiresCommand: '/tasks',
    template: 'ORION verifies postconditions before reporting completion — inspect execution traces with {highlight}/tasks{/highlight}'
  },

  // 5. Productivity Workflows
  {
    id: 'workflow.init_agent_md',
    category: 'productivity_workflows',
    priority: 'normal',
    requiresCommand: '/init',
    template: 'Run {highlight}/init{/highlight} to preview project stack conventions or {highlight}/init --write{/highlight} to generate AGENT.md'
  },
  {
    id: 'workflow.session_goal',
    category: 'productivity_workflows',
    priority: 'normal',
    requiresCommand: '/goal',
    template: 'Set a clear session objective with {highlight}/goal <objective>{/highlight} to keep multi-step execution focused'
  },
  {
    id: 'workflow.resume_session',
    category: 'productivity_workflows',
    priority: 'normal',
    requiresCommand: '/resume',
    template: 'Use {highlight}/resume{/highlight} to pick up a previous ORION session where you left off'
  },
  {
    id: 'workflow.git_worktree',
    category: 'productivity_workflows',
    priority: 'low',
    requiresCommand: '/worktree',
    template: 'Manage isolated Git worktrees safely using {highlight}/worktree list{/highlight} or {highlight}/worktree add{/highlight}'
  },

  // 6. Customization
  {
    id: 'custom.visual_mode',
    category: 'customization',
    priority: 'high',
    requiresCommand: '/vivid',
    template: 'Use {highlight}/vivid{/highlight} to switch between {highlight}ORION Vivid{/highlight} space visuals and quiet {highlight}ORION Minimal{/highlight} mode'
  },
  {
    id: 'custom.animations_toggle',
    category: 'customization',
    priority: 'high',
    requiresCommand: '/animations',
    template: 'Run {highlight}/animations off{/highlight} to keep Vivid visuals static while preserving live status and tip updates'
  },
  {
    id: 'custom.interactive_oris',
    category: 'customization',
    priority: 'normal',
    template: 'Click {highlight}Oris{/highlight} on the home card for a friendly spring jump — decorative motion pauses when unfocused'
  },

  // 7. Troubleshooting
  {
    id: 'troubleshoot.doctor',
    category: 'troubleshooting',
    priority: 'high',
    requiresCommand: '/doctor',
    template: 'Run {highlight}/doctor{/highlight} to inspect engine health, policy integrity, and technical developer diagnostics'
  },
  {
    id: 'troubleshoot.context_compact',
    category: 'troubleshooting',
    priority: 'normal',
    requiresCommand: '/context',
    template: 'Check token usage with {highlight}/context{/highlight} or run {highlight}/context compact{/highlight} during long sessions'
  },
  {
    id: 'troubleshoot.clear_feed',
    category: 'troubleshooting',
    priority: 'low',
    requiresCommand: '/clear',
    template: 'Run {highlight}/clear{/highlight} to reset the active conversation feed and return to the clean home view'
  },

  // 8. Privacy & Security
  {
    id: 'privacy.local_first',
    category: 'privacy_security',
    priority: 'high',
    template: 'ORION runs {highlight}local-first{/highlight} by default and automatically redacts personal paths and API secrets'
  },
  {
    id: 'privacy.protected_boundaries',
    category: 'privacy_security',
    priority: 'normal',
    template: 'Protected OS directories, {highlight}.env{/highlight} secrets, and cloud metadata IPs are blocked automatically'
  },
  {
    id: 'privacy.memory_control',
    category: 'privacy_security',
    priority: 'normal',
    requiresCommand: '/memory',
    template: 'Review or clear stored workspace memories anytime with {highlight}/memory list{/highlight} and {highlight}/memory clear{/highlight}'
  },

  // 9. Model & Engine Configuration (User-Friendly Language)
  {
    id: 'engine.friendly_switching',
    category: 'engine_configuration',
    priority: 'high',
    requiresCommand: '/model',
    template: 'Use {highlight}/model{/highlight} to switch between on-device {highlight}ORION Local{/highlight} engines and configured cloud runtimes'
  },
  {
    id: 'engine.intelligence_profiles',
    category: 'engine_configuration',
    priority: 'normal',
    requiresCommand: '/mode',
    template: 'Tune routing speed vs. depth with {highlight}/mode saif{/highlight} (fast), {highlight}nur{/highlight} (balanced), or {highlight}hikmah{/highlight} (deep)'
  },
  {
    id: 'engine.mcp_servers',
    category: 'engine_configuration',
    priority: 'low',
    requiresCommand: '/mcp',
    template: 'Inspect connected Model Context Protocol tools with {highlight}/mcp status{/highlight} and {highlight}/mcp tools{/highlight}'
  },

  // 10. Useful Examples of Requests
  {
    id: 'example.chrome_search',
    category: 'request_examples',
    priority: 'high',
    requiresDesktopControl: true,
    template: 'Try asking: {highlight}"Open Chrome and search for TypeScript 5.6 release notes"{/highlight}'
  },
  {
    id: 'example.system_specs',
    category: 'request_examples',
    priority: 'normal',
    requiresCommand: '/status',
    template: 'Try asking: {highlight}"Show my system specifications"{/highlight} or run {highlight}/status{/highlight} for workstation telemetry'
  },
  {
    id: 'example.notepad_draft',
    category: 'request_examples',
    priority: 'normal',
    platforms: ['win32'],
    requiresDesktopControl: true,
    template: 'Try asking: {highlight}"Open Notepad and type today\'s release checklist"{/highlight}'
  },
  {
    id: 'example.repo_summary',
    category: 'request_examples',
    priority: 'normal',
    template: 'Try asking: {highlight}"List the files in this folder and summarize the project layout"{/highlight}'
  },

  // 11. Global CLI Distribution & Upgrade
  {
    id: 'cli.global_launch',
    category: 'cli_distribution',
    priority: 'high',
    template: 'Launch {highlight}orion{/highlight} from any folder in your terminal to work directly in that workspace'
  },
  {
    id: 'cli.orion_upgrade',
    category: 'cli_distribution',
    priority: 'high',
    template: 'Run {highlight}orion upgrade{/highlight} from your terminal to verify checksums and update to the latest stable release'
  }
]);

/**
 * Parses `{highlight}...{/highlight}` markers into typed segments so TUI renderers can style
 * highlighted commands/shortcuts cleanly with zero leaked markup tags.
 */
export function parseTipSegments(template: string): ParsedTipSegment[] {
  if (!template) return [];
  const segments: ParsedTipSegment[] = [];
  const regex = /\{highlight\}([\s\S]*?)\{\/highlight\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: template.slice(lastIndex, match.index), highlight: false });
    }
    if (match[1].length > 0) {
      segments.push({ text: match[1], highlight: true });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < template.length) {
    segments.push({ text: template.slice(lastIndex), highlight: false });
  }

  return segments;
}

/**
 * Renders a tip template to plain unformatted text (for plain-text/monochrome logs and width calculations).
 */
export function renderTipPlainText(template: string): string {
  return parseTipSegments(template)
    .map((s) => s.text)
    .join('');
}

export interface TipFilterContext {
  platform?: NodeJS.Platform;
  implementedCommands?: ReadonlySet<string>;
  desktopControlAvailable?: boolean;
}

/**
 * Filters the curated tip catalog so unavailable commands or unsupported OS features are never advertised.
 */
export function buildAvailableTipPool(
  context: TipFilterContext = {},
  catalog: ReadonlyArray<OrionTipDefinition> = ORION_CURATED_TIP_CATALOG
): OrionTipDefinition[] {
  const platform = context.platform || process.platform;
  const desktopAvailable = context.desktopControlAvailable ?? true;

  return catalog.filter((tip) => {
    if (tip.platforms && tip.platforms.length > 0 && !tip.platforms.includes(platform)) {
      return false;
    }
    if (tip.requiresDesktopControl && !desktopAvailable) {
      return false;
    }
    if (tip.requiresCommand && context.implementedCommands) {
      const normalized = tip.requiresCommand.toLowerCase();
      if (!context.implementedCommands.has(normalized)) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Selects a weighted random tip while strictly preventing consecutive duplicate tips
 * whenever `pool.length > 1`.
 */
export function pickWeightedNextTip(
  pool: ReadonlyArray<OrionTipDefinition>,
  currentTipId?: string,
  rng: () => number = Math.random
): OrionTipDefinition {
  if (pool.length === 0) {
    return ORION_CURATED_TIP_CATALOG[0];
  }
  if (pool.length === 1) {
    return pool[0];
  }

  const candidates = currentTipId ? pool.filter((t) => t.id !== currentTipId) : [...pool];
  const effectivePool = candidates.length > 0 ? candidates : [...pool];

  let totalWeight = 0;
  for (const tip of effectivePool) {
    totalWeight += TIP_PRIORITY_WEIGHTS[tip.priority] ?? 1;
  }

  let cursor = Math.max(0, Math.min(0.999999, rng())) * totalWeight;
  for (const tip of effectivePool) {
    cursor -= TIP_PRIORITY_WEIGHTS[tip.priority] ?? 1;
    if (cursor <= 0) {
      return tip;
    }
  }

  return effectivePool[effectivePool.length - 1];
}

/**
 * Deterministically cycles forward/backward through the filtered tip pool for manual cycling (`Alt+T` / `/tip`),
 * guaranteeing immediate visual change and zero consecutive duplicates.
 */
export function cycleManualTip(
  pool: ReadonlyArray<OrionTipDefinition>,
  currentTipId?: string,
  direction: 'next' | 'prev' = 'next'
): OrionTipDefinition {
  if (pool.length === 0) {
    return ORION_CURATED_TIP_CATALOG[0];
  }
  if (pool.length === 1) {
    return pool[0];
  }
  const currentIdx = currentTipId ? pool.findIndex((t) => t.id === currentTipId) : -1;
  if (currentIdx < 0) {
    return pool[0];
  }
  const delta = direction === 'prev' ? -1 : 1;
  const nextIdx = (currentIdx + delta + pool.length) % pool.length;
  return pool[nextIdx];
}
