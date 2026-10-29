import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { ToolCall, ToolResult } from '../shared/types';

export type AppRuntimeStatus =
  | 'Open'
  | 'Launching'
  | 'Not running'
  | 'Launch failed'
  | 'Unknown';

export interface AppVisualIdentity {
  id: string;
  displayName: string;
  processNames: string[];
  aliases: string[];
  brandRgb: [number, number, number];
  ansi256Code: number;
  unicodeGlyph: string;
  asciiFallback: string;
  iconPngFilename: string;
  candidatePaths: string[];
}

export interface TrackedAppState {
  id: string;
  displayName: string;
  status: AppRuntimeStatus;
  detail?: string;
  processName?: string;
  iconAssetPath?: string;
  iconPngPath?: string;
  iconVerifiedLocal: boolean;
  lastUpdated: number;
  isCoreTracked: boolean;
  brandRgb: [number, number, number];
  ansi256Code: number;
  unicodeGlyph: string;
  asciiFallback: string;
}

export interface TerminalIconCapabilities {
  supportsColor: boolean;
  supportsTrueColor: boolean;
  supportsUnicode: boolean;
  supportsInlineImageProtocol: boolean;
}

const LOCAL_APPDATA = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
const APPDATA = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
const PROGRAM_FILES = process.env.ProgramFiles || 'C:\\Program Files';
const PROGRAM_FILES_X86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
const SYSTEM_ROOT = process.env.SystemRoot || 'C:\\Windows';
const REPO_ICONS_DIR = path.resolve(__dirname, '..', '..', 'assets', 'icons');

export const KNOWN_APPLICATIONS: AppVisualIdentity[] = [
  {
    id: 'spotify',
    displayName: 'Spotify',
    processNames: ['spotify.exe', 'spotify'],
    aliases: ['spotify', 'music'],
    brandRgb: [29, 185, 84], // Official Spotify Green #1DB954
    ansi256Code: 41,
    unicodeGlyph: '≈',
    asciiFallback: '[Spotify]',
    iconPngFilename: 'spotify.png',
    candidatePaths: [
      path.join(REPO_ICONS_DIR, 'spotify.png'),
      path.join(APPDATA, 'Spotify', 'Spotify.exe'),
      path.join(LOCAL_APPDATA, 'Microsoft', 'WindowsApps', 'Spotify.exe')
    ]
  },
  {
    id: 'chrome',
    displayName: 'Chrome',
    processNames: ['chrome.exe', 'chrome'],
    aliases: ['chrome', 'google chrome', 'browser'],
    brandRgb: [66, 133, 244], // Official Google Chrome Blue #4285F4
    ansi256Code: 33,
    unicodeGlyph: '◓◑◒●',
    asciiFallback: '[Chrome]',
    iconPngFilename: 'chrome.png',
    candidatePaths: [
      path.join(REPO_ICONS_DIR, 'chrome.png'),
      path.join(PROGRAM_FILES, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(PROGRAM_FILES_X86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(LOCAL_APPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe')
    ]
  },
  {
    id: 'vscode',
    displayName: 'VS Code',
    processNames: ['code.exe', 'code'],
    aliases: ['vscode', 'vs code', 'visual studio code', 'code'],
    brandRgb: [0, 122, 204], // Official VS Code Blue #007ACC
    ansi256Code: 39,
    unicodeGlyph: '⋈',
    asciiFallback: '[VS Code]',
    iconPngFilename: 'vscode.png',
    candidatePaths: [
      path.join(REPO_ICONS_DIR, 'vscode.png'),
      path.join(LOCAL_APPDATA, 'Programs', 'Microsoft VS Code', 'Code.exe'),
      path.join(PROGRAM_FILES, 'Microsoft VS Code', 'Code.exe')
    ]
  },
  {
    id: 'discord',
    displayName: 'Discord',
    processNames: ['discord.exe', 'discord'],
    aliases: ['discord'],
    brandRgb: [88, 101, 242], // Official Discord Blurple #5865F2
    ansi256Code: 63,
    unicodeGlyph: 'Ꙭ',
    asciiFallback: '[Discord]',
    iconPngFilename: 'discord.png',
    candidatePaths: [
      path.join(REPO_ICONS_DIR, 'discord.png'),
      path.join(LOCAL_APPDATA, 'Discord', 'Update.exe')
    ]
  },
  {
    id: 'notepad',
    displayName: 'Notepad',
    processNames: ['notepad.exe', 'notepad'],
    aliases: ['notepad', 'text editor'],
    brandRgb: [38, 166, 154], // Official Windows 11 Notepad Teal #26A69A
    ansi256Code: 37,
    unicodeGlyph: '≡',
    asciiFallback: '[Notepad]',
    iconPngFilename: 'notepad.png',
    candidatePaths: [
      path.join(REPO_ICONS_DIR, 'notepad.png'),
      path.join(SYSTEM_ROOT, 'System32', 'notepad.exe'),
      path.join(SYSTEM_ROOT, 'notepad.exe')
    ]
  },
  {
    id: 'explorer',
    displayName: 'Explorer',
    processNames: ['explorer.exe', 'explorer'],
    aliases: ['explorer', 'file explorer', 'files'],
    brandRgb: [251, 192, 45], // Official Windows Explorer Gold #FBC02D
    ansi256Code: 220,
    unicodeGlyph: '▣',
    asciiFallback: '[Explorer]',
    iconPngFilename: 'explorer.png',
    candidatePaths: [
      path.join(REPO_ICONS_DIR, 'explorer.png'),
      path.join(SYSTEM_ROOT, 'explorer.exe')
    ]
  },
  {
    id: 'terminal',
    displayName: 'Terminal',
    processNames: ['windowsterminal.exe', 'wt.exe', 'powershell.exe', 'cmd.exe'],
    aliases: ['terminal', 'windows terminal', 'wt', 'powershell'],
    brandRgb: [139, 92, 246], // Windows Terminal / ORION Violet #8B5CF6
    ansi256Code: 141,
    unicodeGlyph: '>_',
    asciiFallback: '[Terminal]',
    iconPngFilename: 'terminal.png',
    candidatePaths: [
      path.join(REPO_ICONS_DIR, 'terminal.png'),
      path.join(LOCAL_APPDATA, 'Microsoft', 'WindowsApps', 'wt.exe'),
      path.join(SYSTEM_ROOT, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
    ]
  }
];

let sharedProcessCache: { timestamp: number; runningImages: Set<string>; probeSucceeded: boolean } | null = null;
const PROCESS_CACHE_TTL_MS = 10_000;
const inlinePngBase64Cache: Map<string, string> = new Map();

export class OrionActiveAppsTracker {
  private states: Map<string, TrackedAppState> = new Map();
  private resolvedPaths: Map<string, string | undefined> = new Map();
  private activeCallAppMap: Map<string, string> = new Map();

  constructor() {
    this.initializeKnownApps();
  }

  private initializeKnownApps(): void {
    const now = Date.now();
    // Core default bar apps to display concisely by default (matching Section 3D: Spotify, Chrome, VS Code, Discord, Notepad, Explorer)
    const coreAppIds = new Set(['spotify', 'chrome', 'vscode', 'discord', 'notepad', 'explorer']);
    for (const app of KNOWN_APPLICATIONS) {
      const iconPath = this.resolveLocalAssetPath(app);
      const pngPath = path.join(REPO_ICONS_DIR, app.iconPngFilename);
      const hasPng = fs.existsSync(pngPath);
      this.states.set(app.id, {
        id: app.id,
        displayName: app.displayName,
        status: 'Not running',
        iconAssetPath: iconPath,
        iconPngPath: hasPng ? pngPath : undefined,
        iconVerifiedLocal: Boolean(iconPath || hasPng),
        lastUpdated: now,
        isCoreTracked: coreAppIds.has(app.id),
        brandRgb: app.brandRgb,
        ansi256Code: app.ansi256Code,
        unicodeGlyph: app.unicodeGlyph,
        asciiFallback: app.asciiFallback
      });
    }
  }

  private resolveLocalAssetPath(app: AppVisualIdentity): string | undefined {
    if (this.resolvedPaths.has(app.id)) {
      return this.resolvedPaths.get(app.id);
    }
    for (const candidate of app.candidatePaths) {
      try {
        if (fs.existsSync(candidate)) {
          this.resolvedPaths.set(app.id, candidate);
          return candidate;
        }
      } catch {}
    }
    this.resolvedPaths.set(app.id, undefined);
    return undefined;
  }

  /**
   * Probes live OS process/window list using a fast cached snapshot so startup and
   * test runs remain responsive while reporting truthful application states.
   */
  public refreshFromSystem(force = false): void {
    const now = Date.now();
    if (!force && sharedProcessCache && now - sharedProcessCache.timestamp < PROCESS_CACHE_TTL_MS) {
      this.applyProcessSnapshot(sharedProcessCache.runningImages, sharedProcessCache.probeSucceeded);
      return;
    }

    if (process.platform === 'win32') {
      try {
        const out = execSync('tasklist /FI "STATUS eq RUNNING" /FO CSV /NH', {
          encoding: 'utf8',
          timeout: 1200,
          stdio: ['ignore', 'pipe', 'ignore'],
          windowsHide: true
        });
        const runningImages = new Set<string>();
        for (const line of out.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('"')) continue;
          const firstComma = trimmed.indexOf('",');
          if (firstComma > 1) {
            const imgName = trimmed.slice(1, firstComma).toLowerCase();
            runningImages.add(imgName);
          }
        }
        sharedProcessCache = {
          timestamp: now,
          runningImages,
          probeSucceeded: true
        };
        this.applyProcessSnapshot(runningImages, true);
        return;
      } catch {
        sharedProcessCache = {
          timestamp: now,
          runningImages: new Set(),
          probeSucceeded: false
        };
        this.applyProcessSnapshot(new Set(), false);
        return;
      }
    }

    this.applyProcessSnapshot(new Set(), false);
  }

  private applyProcessSnapshot(runningImages: Set<string>, probeSucceeded: boolean): void {
    const now = Date.now();
    for (const app of KNOWN_APPLICATIONS) {
      const existing = this.states.get(app.id);
      if (!existing) continue;

      if (
        (existing.status === 'Launching' || existing.status === 'Launch failed') &&
        now - existing.lastUpdated < 15_000
      ) {
        continue;
      }

      if (!probeSucceeded) {
        existing.status = 'Unknown';
        existing.detail = 'OS window probe unavailable';
        continue;
      }

      const matchedProc = app.processNames.find(p => runningImages.has(p.toLowerCase()));
      if (matchedProc) {
        existing.status = 'Open';
        existing.processName = matchedProc;
        existing.detail = undefined;
      } else {
        existing.status = 'Not running';
        existing.processName = undefined;
        existing.detail = undefined;
      }
    }
  }

  /**
   * Resolves a known or ad-hoc application entry from an application name or query string.
   */
  public resolveAppIdentity(rawTarget: string): TrackedAppState | null {
    const clean = (rawTarget || '').trim();
    if (!clean) return null;
    const lower = clean.toLowerCase();

    for (const known of KNOWN_APPLICATIONS) {
      if (
        known.id === lower ||
        known.displayName.toLowerCase() === lower ||
        known.processNames.some(p => p.toLowerCase() === lower || p.toLowerCase() === `${lower}.exe`) ||
        known.aliases.some(a => lower === a || lower.includes(a))
      ) {
        return this.states.get(known.id) || null;
      }
    }

    const normalizedId = clean.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'custom_app';
    let dynamicState = this.states.get(normalizedId);
    if (!dynamicState) {
      const display = clean.length > 22 ? `${clean.slice(0, 19)}...` : clean;
      dynamicState = {
        id: normalizedId,
        displayName: display,
        status: 'Unknown',
        iconVerifiedLocal: false,
        lastUpdated: Date.now(),
        isCoreTracked: true,
        brandRgb: [156, 163, 175],
        ansi256Code: 248,
        unicodeGlyph: '◇',
        asciiFallback: `[${display}]`
      };
      this.states.set(normalizedId, dynamicState);
    }
    return dynamicState;
  }

  /**
   * Infers whether an invoked tool actually targets a specific desktop/browser/media application.
   * Never guesses an application solely from user wording if the invoked tool targets something else.
   */
  public inferAppFromToolCall(call: ToolCall): {
    app: TrackedAppState;
    isLaunchAttempt: boolean;
    isCloseAttempt: boolean;
  } | null {
    const toolId = (call.toolId || '').toLowerCase();
    const args = call.arguments || {};

    if (toolId.startsWith('media.play_spotify') || toolId.startsWith('spotify.')) {
      const spotify = this.states.get('spotify');
      return spotify ? { app: spotify, isLaunchAttempt: true, isCloseAttempt: false } : null;
    }

    if (toolId.startsWith('browser.')) {
      const chrome = this.states.get('chrome');
      return chrome ? { app: chrome, isLaunchAttempt: toolId === 'browser.navigate', isCloseAttempt: false } : null;
    }

    if (toolId === 'computer.natural_language_command') {
      const cmdText = String(args.command || args.query || '').trim();
      const openMatch = cmdText.match(/\b(?:open|launch|start|run|focus)\s+([a-zA-Z0-9_.\-\s]{2,30})/i);
      const closeMatch = cmdText.match(/\b(?:close|quit|kill|exit)\s+([a-zA-Z0-9_.\-\s]{2,30})/i);
      if (openMatch) {
        const targetName = openMatch[1].replace(/\b(and|then|to|in|with|now)\b.*$/i, '').trim();
        const app = this.resolveAppIdentity(targetName);
        if (app) return { app, isLaunchAttempt: true, isCloseAttempt: false };
      }
      if (closeMatch) {
        const targetName = closeMatch[1].replace(/\b(and|then|now)\b.*$/i, '').trim();
        const app = this.resolveAppIdentity(targetName);
        if (app) return { app, isLaunchAttempt: false, isCloseAttempt: true };
      }
    }

    if (toolId === 'computer.execute_action') {
      const action = args.action || args;
      const type = String(action?.type || '').toUpperCase();
      const target = String(
        action?.target ||
        action?.parameters?.appName ||
        action?.parameters?.executablePath ||
        action?.payload?.appName ||
        ''
      ).trim();

      if (type === 'OPEN_APP' || type === 'LAUNCH_APP' || type === 'FOCUS_WINDOW') {
        const app = this.resolveAppIdentity(target);
        if (app) return { app, isLaunchAttempt: true, isCloseAttempt: false };
      }
      if (type === 'CLOSE_WINDOW' || type === 'KILL_PROCESS') {
        const app = this.resolveAppIdentity(target);
        if (app) return { app, isLaunchAttempt: false, isCloseAttempt: true };
      }
    }

    return null;
  }

  /**
   * Section 5: Resolves the appropriate icon badge for ANY tool operation:
   * - Spotify operations -> real Spotify logo
   * - Chrome operations -> real Chrome logo
   * - VS Code operations -> real VS Code logo
   * - Discord operations -> real Discord logo
   * - File / Folder operations -> dedicated File or Folder icon when no application-specific icon applies
   * - ORION system/agent/vision/memory operations -> genuine ORION split-orbital star logo
   */
  public resolveToolOperationBadge(call: ToolCall, useColor: boolean): string {
    const inferred = this.inferAppFromToolCall(call);
    if (inferred?.app) {
      return this.formatAppBadge(inferred.app, useColor, true);
    }

    const toolId = (call.toolId || '').toLowerCase();
    const caps = OrionActiveAppsTracker.detectTerminalCapabilities(useColor);

    if (toolId.startsWith('file.')) {
      const isDirTool =
        toolId.includes('directory') ||
        toolId.includes('folder') ||
        toolId === 'file.list_directory' ||
        toolId === 'file.create_directory';
      if (!caps.supportsColor || !caps.supportsUnicode) {
        return isDirTool ? '[Folder]' : '[File]';
      }
      if (isDirTool) {
        return `\x1b[38;2;251;192;45m\x1b[1m▣\x1b[0m`;
      }
      return `\x1b[38;2;59;130;246m\x1b[1m▤\x1b[0m`;
    }

    // Default to genuine ORION split-orbital star emblem for ORION engine operations
    if (!caps.supportsColor) {
      return caps.supportsUnicode ? '(✦)' : '(*)';
    }
    return `\x1b[38;5;75m(\x1b[1;38;5;141m${caps.supportsUnicode ? '✦' : '*'}\x1b[0m\x1b[38;5;75m)\x1b[0m`;
  }

  /**
   * Updates application state when a tool execution begins.
   */
  public recordToolStarted(call: ToolCall): TrackedAppState | null {
    const inferred = this.inferAppFromToolCall(call);
    if (!inferred) return null;

    const { app, isLaunchAttempt } = inferred;
    this.activeCallAppMap.set(call.id, app.id);

    if (isLaunchAttempt && app.status !== 'Open') {
      app.status = 'Launching';
      app.detail = 'Starting process...';
      app.lastUpdated = Date.now();
      app.isCoreTracked = true;
    }
    return app;
  }

  /**
   * Updates application state truthfully when a tool execution finishes based on real verification status.
   */
  public recordToolCompleted(result: ToolResult): { app: TrackedAppState; stateChanged: boolean } | null {
    const appId = this.activeCallAppMap.get(result.toolCallId);
    if (!appId) return null;
    this.activeCallAppMap.delete(result.toolCallId);

    const app = this.states.get(appId);
    if (!app) return null;

    const prevStatus = app.status;
    const now = Date.now();
    app.lastUpdated = now;
    app.isCoreTracked = true;

    const dataObj = (result.data ?? (result as any).output ?? {}) as Record<string, any>;
    const explicitFailure =
      !result.success ||
      result.verificationStatus === 'FAILED' ||
      dataObj?.success === false;

    if (explicitFailure) {
      app.status = 'Launch failed';
      app.detail = result.error || dataObj?.error || 'Launch or window activation failed';
      return { app, stateChanged: prevStatus !== app.status };
    }

    if (result.verificationStatus === 'VERIFIED' || result.verified === true) {
      app.status = 'Open';
      app.detail = undefined;
      if (sharedProcessCache && app.processName) {
        sharedProcessCache.runningImages.add(app.processName.toLowerCase());
      }
      return { app, stateChanged: prevStatus !== app.status };
    }

    this.refreshFromSystem(true);
    const refreshed = this.states.get(appId);
    if (refreshed && refreshed.status === 'Open') {
      return { app: refreshed, stateChanged: prevStatus !== refreshed.status };
    }

    app.status = 'Unknown';
    app.detail = 'Unverified window state';
    return { app, stateChanged: prevStatus !== app.status };
  }

  /**
   * Explicitly sets an application's state (used by direct `/open` commands or tests).
   */
  public setApplicationState(
    targetName: string,
    status: AppRuntimeStatus,
    detail?: string
  ): TrackedAppState | null {
    const app = this.resolveAppIdentity(targetName);
    if (!app) return null;
    app.status = status;
    app.detail = detail;
    app.lastUpdated = Date.now();
    app.isCoreTracked = true;
    return app;
  }

  /**
   * Returns the list of applications to display in the persistent Active Applications bar.
   */
  public getDisplayedApplications(maxItems = 6): TrackedAppState[] {
    const all = Array.from(this.states.values());
    const priorityScore = (s: AppRuntimeStatus): number => {
      switch (s) {
        case 'Launching':
          return 5;
        case 'Launch failed':
          return 4;
        case 'Open':
          return 3;
        case 'Unknown':
          return 2;
        case 'Not running':
        default:
          return 1;
      }
    };

    const filtered = all.filter(
      a => a.isCoreTracked || a.status !== 'Not running'
    );

    filtered.sort((a, b) => {
      const diff = priorityScore(b.status) - priorityScore(a.status);
      if (diff !== 0) return diff;
      return b.lastUpdated - a.lastUpdated;
    });

    return filtered.slice(0, maxItems);
  }

  public getAllTrackedApplications(): TrackedAppState[] {
    return Array.from(this.states.values());
  }

  /**
   * Detects terminal capabilities for icon rendering (color, truecolor, Unicode, OSC 1337 inline images).
   */
  public static detectTerminalCapabilities(useColor: boolean): TerminalIconCapabilities {
    if (!useColor) {
      return {
        supportsColor: false,
        supportsTrueColor: false,
        supportsUnicode: false,
        supportsInlineImageProtocol: false
      };
    }

    const colorTerm = (process.env.COLORTERM || '').toLowerCase();
    const termProgram = (process.env.TERM_PROGRAM || '').toLowerCase();
    const wtSession = Boolean(process.env.WT_SESSION);
    const supportsTrueColor =
      colorTerm === 'truecolor' ||
      colorTerm === '24bit' ||
      wtSession ||
      termProgram === 'vscode' ||
      termProgram === 'wezterm' ||
      termProgram === 'iterm.app';

    const supportsUnicode =
      process.platform !== 'win32' ||
      wtSession ||
      termProgram === 'vscode' ||
      Boolean(process.env.CI) ||
      (process.env.LANG || '').toLowerCase().includes('utf');

    const supportsInlineImageProtocol =
      process.env.ORION_INLINE_ICONS === '1' ||
      termProgram === 'iterm.app' ||
      termProgram === 'wezterm' ||
      termProgram === 'mintty';

    return {
      supportsColor: true,
      supportsTrueColor,
      supportsUnicode,
      supportsInlineImageProtocol
    };
  }

  private renderInlineOsc1337Icon(pngPath?: string): string {
    if (!pngPath) return '';
    try {
      let b64 = inlinePngBase64Cache.get(pngPath);
      if (!b64 && fs.existsSync(pngPath)) {
        b64 = fs.readFileSync(pngPath).toString('base64');
        inlinePngBase64Cache.set(pngPath, b64);
      }
      if (b64) {
        return `\x1b]1337;File=inline=1;width=2;height=1;preserveAspectRatio=1:${b64}\x07 `;
      }
    } catch {}
    return '';
  }

  /**
   * Formats an application's genuine icon + name badge according to terminal capabilities.
   * Uses official multi-color brand geometry (and optional OSC 1337 inline PNG raster icon from assets/icons/*.png),
   * falling back cleanly to ASCII badges in no-color mode.
   */
  public formatAppBadge(app: TrackedAppState, useColor: boolean, includeName = true): string {
    const caps = OrionActiveAppsTracker.detectTerminalCapabilities(useColor);
    if (!caps.supportsColor || !caps.supportsUnicode) {
      return includeName ? `${app.asciiFallback}` : app.asciiFallback;
    }

    const reset = '\x1b[0m';
    const bold = '\x1b[1m';
    const inlineImg =
      caps.supportsInlineImageProtocol && process.env.ORION_INLINE_ICONS === '1'
        ? this.renderInlineOsc1337Icon(app.iconPngPath)
        : '';

    let iconSymbol: string;
    if (caps.supportsTrueColor) {
      switch (app.id) {
        case 'spotify':
          // Official Spotify Green (#1DB954) badge with dark wave bars
          iconSymbol = `\x1b[48;2;29;185;84m\x1b[38;2;11;15;20m${bold} ≈ ${reset}`;
          break;
        case 'chrome':
          // Official 4-color Google Chrome emblem (Red #EA4335, Yellow #FBBC05, Green #34A853, Blue #4285F4 center)
          iconSymbol = `\x1b[38;2;234;67;53m◓\x1b[38;2;251;188;5m◑\x1b[38;2;52;168;83m◒\x1b[38;2;66;133;244m●${reset}`;
          break;
        case 'vscode':
          // Official VS Code Blue (#007ACC) ribbon badge
          iconSymbol = `\x1b[48;2;0;122;204m\x1b[38;2;255;255;255m${bold} ⋈ ${reset}`;
          break;
        case 'discord':
          // Official Discord Blurple (#5865F2) Clyde badge
          iconSymbol = `\x1b[48;2;88;101;242m\x1b[38;2;255;255;255m${bold} Ꙭ ${reset}`;
          break;
        case 'notepad':
          // Official Windows 11 Notepad Teal (#26A69A) pad badge
          iconSymbol = `\x1b[48;2;38;166;154m\x1b[38;2;255;255;255m${bold} ≡ ${reset}`;
          break;
        case 'explorer':
          // Official Windows File Explorer Gold (#FBC02D) folder badge
          iconSymbol = `\x1b[48;2;251;192;45m\x1b[38;2;11;15;20m${bold} ▣ ${reset}`;
          break;
        case 'terminal':
          // Official Windows Terminal dark violet badge
          iconSymbol = `\x1b[48;2;45;45;48m\x1b[38;2;139;92;246m${bold} >_ ${reset}`;
          break;
        default: {
          const [r, g, b] = app.brandRgb;
          iconSymbol = `\x1b[38;2;${r};${g};${b}m${bold}${app.unicodeGlyph}${reset}`;
          break;
        }
      }
    } else {
      iconSymbol = `\x1b[38;5;${app.ansi256Code}m${bold}${app.unicodeGlyph}${reset}`;
    }

    if (!includeName) {
      return `${inlineImg}${iconSymbol}`;
    }
    return `${inlineImg}${iconSymbol} ${bold}${app.displayName}${reset}`;
  }
}
