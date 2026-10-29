import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync } from 'child_process';

export type AppDiscoverySource =
  | 'CATALOG'
  | 'PROTOCOL_URI'
  | 'REGISTRY_APP_PATHS'
  | 'START_MENU_SHORTCUT'
  | 'PROGRAMS_DIR'
  | 'SYSTEM_PATH'
  | 'WINDOWS_STORE_AUMID'
  | 'NOT_INSTALLED';

export interface ResolvedWindowsApp {
  canonicalId: string;
  displayName: string;
  executableName: string;
  resolvedExecutablePath: string;
  existsOnDisk: boolean;
  isProtocolUri: boolean;
  isStoreApp?: boolean;
  aumid?: string;
  shortcutPath?: string;
  discoverySource: AppDiscoverySource;
  defaultArgs: string[];
  processNames: string[];
}

interface AppCatalogEntry {
  canonicalId: string;
  displayName: string;
  executableName: string;
  aliases: string[];
  candidatePaths: string[];
  isProtocolUri?: boolean;
  defaultArgs?: string[];
  processNames: string[];
}

interface StartAppRecord {
  Name: string;
  AppID: string;
}

const LOCAL_APPDATA = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
const APPDATA = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
const PROGRAM_DATA = process.env.ProgramData || 'C:\\ProgramData';
const PROGRAM_FILES = process.env.ProgramFiles || 'C:\\Program Files';
const PROGRAM_FILES_X86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
const SYSTEM_ROOT = process.env.SystemRoot || 'C:\\Windows';

/**
 * Administrative, destructive, or LOLBin binaries prohibited from direct application launching.
 */
const PROHIBITED_APP_IDENTIFIERS = new Set<string>([
  'regedit',
  'diskpart',
  'bcdedit',
  'format',
  'vssadmin',
  'wbadmin',
  'cipher',
  'takeown',
  'icacls',
  'schtasks',
  'sc',
  'netsh',
  'rundll32',
  'mshta',
  'regsvr32',
  'certutil',
  'bitsadmin',
  'wscript',
  'cscript',
  'msiexec'
]);

/**
 * Dangerous Chromium/Electron/interpreter argument prefixes blocked even when passed as separate arguments.
 */
const PROHIBITED_ARG_PATTERNS = [
  /^--gpu-launcher/i,
  /^--renderer-cmd-prefix/i,
  /^--utility-cmd-prefix/i,
  /^--ppapi-plugin-launcher/i,
  /^--no-sandbox/i,
  /^--remote-debugging-port/i,
  /^--user-data-dir/i,
  /^--load-extension/i,
  /^-executionpolicy/i,
  /^-encodedcommand/i,
  /^-enc\b/i,
  /^-command\b/i,
  /^\/[ck]\b/i
];

function buildArtCraftCandidatePaths(folderName: string, exeBase: string): string[] {
  return [
    path.join(LOCAL_APPDATA, 'Programs', 'ArtCraft', folderName, `${exeBase}.exe`),
    path.join(LOCAL_APPDATA, 'Programs', 'ArtCraft', `${exeBase}.exe`),
    path.join(LOCAL_APPDATA, 'Programs', folderName, `${exeBase}.exe`),
    path.join(LOCAL_APPDATA, 'ArtCraft', folderName, `${exeBase}.exe`),
    path.join(LOCAL_APPDATA, 'ArtCraft', 'apps', exeBase, `${exeBase}.exe`),
    path.join(PROGRAM_FILES, 'ArtCraft', folderName, `${exeBase}.exe`),
    path.join(PROGRAM_FILES, folderName, `${exeBase}.exe`)
  ];
}

const AUTHORIZED_APP_CATALOG: AppCatalogEntry[] = [
  {
    canonicalId: 'notepad',
    displayName: 'Notepad',
    executableName: 'notepad.exe',
    aliases: ['notepad', 'notepad.exe', 'text editor'],
    candidatePaths: [
      path.join(SYSTEM_ROOT, 'System32', 'notepad.exe'),
      path.join(SYSTEM_ROOT, 'notepad.exe'),
      path.join(LOCAL_APPDATA, 'Microsoft', 'WindowsApps', 'notepad.exe')
    ],
    processNames: ['notepad.exe', 'notepad']
  },
  {
    canonicalId: 'chrome',
    displayName: 'Google Chrome',
    executableName: 'chrome.exe',
    aliases: ['chrome', 'chrome.exe', 'google chrome'],
    candidatePaths: [
      path.join(PROGRAM_FILES, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(PROGRAM_FILES_X86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(LOCAL_APPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe')
    ],
    processNames: ['chrome.exe', 'chrome']
  },
  {
    canonicalId: 'vscode',
    displayName: 'Visual Studio Code',
    executableName: 'Code.exe',
    aliases: ['code', 'code.cmd', 'code.exe', 'vscode', 'vs code', 'visual studio code'],
    candidatePaths: [
      path.join(LOCAL_APPDATA, 'Programs', 'Microsoft VS Code', 'Code.exe'),
      path.join(PROGRAM_FILES, 'Microsoft VS Code', 'Code.exe'),
      path.join(LOCAL_APPDATA, 'Programs', 'Microsoft VS Code', 'bin', 'code.cmd')
    ],
    processNames: ['code.exe', 'code']
  },
  {
    canonicalId: 'explorer',
    displayName: 'File Explorer',
    executableName: 'explorer.exe',
    aliases: ['explorer', 'explorer.exe', 'file explorer', 'files'],
    candidatePaths: [path.join(SYSTEM_ROOT, 'explorer.exe')],
    processNames: ['explorer.exe', 'explorer']
  },
  {
    canonicalId: 'calculator',
    displayName: 'Calculator',
    executableName: 'calc.exe',
    aliases: ['calc', 'calc.exe', 'calculator'],
    candidatePaths: [path.join(SYSTEM_ROOT, 'System32', 'calc.exe')],
    processNames: ['calculatorapp.exe', 'calculator.exe', 'calc.exe', 'applicationframehost.exe']
  },
  {
    canonicalId: 'edge',
    displayName: 'Microsoft Edge',
    executableName: 'msedge.exe',
    aliases: ['edge', 'msedge', 'msedge.exe', 'microsoft edge'],
    candidatePaths: [
      path.join(PROGRAM_FILES_X86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
      path.join(PROGRAM_FILES, 'Microsoft', 'Edge', 'Application', 'msedge.exe')
    ],
    processNames: ['msedge.exe', 'msedge']
  },
  {
    canonicalId: 'brave',
    displayName: 'Brave Browser',
    executableName: 'brave.exe',
    aliases: ['brave', 'brave.exe', 'brave browser'],
    candidatePaths: [
      path.join(PROGRAM_FILES, 'BraveSoftware', 'Brave-Browser', 'Application', 'brave.exe'),
      path.join(LOCAL_APPDATA, 'BraveSoftware', 'Brave-Browser', 'Application', 'brave.exe')
    ],
    processNames: ['brave.exe', 'brave']
  },
  {
    canonicalId: 'firefox',
    displayName: 'Mozilla Firefox',
    executableName: 'firefox.exe',
    aliases: ['firefox', 'firefox.exe', 'mozilla firefox'],
    candidatePaths: [
      path.join(PROGRAM_FILES, 'Mozilla Firefox', 'firefox.exe'),
      path.join(PROGRAM_FILES_X86, 'Mozilla Firefox', 'firefox.exe')
    ],
    processNames: ['firefox.exe', 'firefox']
  },
  {
    canonicalId: 'paint',
    displayName: 'Paint',
    executableName: 'mspaint.exe',
    aliases: ['paint', 'mspaint', 'mspaint.exe'],
    candidatePaths: [
      path.join(SYSTEM_ROOT, 'System32', 'mspaint.exe'),
      path.join(LOCAL_APPDATA, 'Microsoft', 'WindowsApps', 'mspaint.exe')
    ],
    processNames: ['mspaint.exe', 'mspaint']
  },
  {
    canonicalId: 'wt',
    displayName: 'Windows Terminal',
    executableName: 'wt.exe',
    aliases: ['wt', 'wt.exe', 'windows terminal'],
    candidatePaths: [path.join(LOCAL_APPDATA, 'Microsoft', 'WindowsApps', 'wt.exe')],
    processNames: ['windowsterminal.exe', 'wt.exe']
  },
  {
    canonicalId: 'powershell',
    displayName: 'PowerShell',
    executableName: 'powershell.exe',
    aliases: ['terminal', 'powershell', 'powershell.exe'],
    candidatePaths: [
      path.join(SYSTEM_ROOT, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
    ],
    processNames: ['powershell.exe', 'windowsterminal.exe']
  },
  {
    canonicalId: 'cmd',
    displayName: 'Command Prompt',
    executableName: 'cmd.exe',
    aliases: ['cmd', 'cmd.exe', 'command prompt'],
    candidatePaths: [path.join(SYSTEM_ROOT, 'System32', 'cmd.exe')],
    processNames: ['cmd.exe']
  },
  {
    canonicalId: 'taskmgr',
    displayName: 'Task Manager',
    executableName: 'taskmgr.exe',
    aliases: ['taskmgr', 'taskmgr.exe', 'task manager'],
    candidatePaths: [path.join(SYSTEM_ROOT, 'System32', 'taskmgr.exe')],
    processNames: ['taskmgr.exe']
  },
  {
    canonicalId: 'spotify',
    displayName: 'Spotify',
    executableName: 'Spotify.exe',
    aliases: ['spotify', 'spotify.exe'],
    candidatePaths: [
      path.join(APPDATA, 'Spotify', 'Spotify.exe'),
      path.join(LOCAL_APPDATA, 'Microsoft', 'WindowsApps', 'Spotify.exe')
    ],
    processNames: ['spotify.exe', 'spotify']
  },
  {
    canonicalId: 'vlc',
    displayName: 'VLC Media Player',
    executableName: 'vlc.exe',
    aliases: ['vlc', 'vlc.exe', 'vlc media player'],
    candidatePaths: [
      path.join(PROGRAM_FILES, 'VideoLAN', 'VLC', 'vlc.exe'),
      path.join(PROGRAM_FILES_X86, 'VideoLAN', 'VLC', 'vlc.exe')
    ],
    processNames: ['vlc.exe']
  },
  {
    canonicalId: 'word',
    displayName: 'Microsoft Word',
    executableName: 'WINWORD.EXE',
    aliases: ['word', 'winword', 'winword.exe', 'microsoft word'],
    candidatePaths: [
      path.join(PROGRAM_FILES, 'Microsoft Office', 'root', 'Office16', 'WINWORD.EXE'),
      path.join(PROGRAM_FILES_X86, 'Microsoft Office', 'root', 'Office16', 'WINWORD.EXE')
    ],
    processNames: ['winword.exe']
  },
  {
    canonicalId: 'excel',
    displayName: 'Microsoft Excel',
    executableName: 'EXCEL.EXE',
    aliases: ['excel', 'excel.exe', 'microsoft excel'],
    candidatePaths: [
      path.join(PROGRAM_FILES, 'Microsoft Office', 'root', 'Office16', 'EXCEL.EXE'),
      path.join(PROGRAM_FILES_X86, 'Microsoft Office', 'root', 'Office16', 'EXCEL.EXE')
    ],
    processNames: ['excel.exe']
  },
  {
    canonicalId: 'powerpoint',
    displayName: 'Microsoft PowerPoint',
    executableName: 'POWERPNT.EXE',
    aliases: ['powerpoint', 'powerpnt', 'powerpnt.exe', 'microsoft powerpoint'],
    candidatePaths: [
      path.join(PROGRAM_FILES, 'Microsoft Office', 'root', 'Office16', 'POWERPNT.EXE'),
      path.join(PROGRAM_FILES_X86, 'Microsoft Office', 'root', 'Office16', 'POWERPNT.EXE')
    ],
    processNames: ['powerpnt.exe']
  },
  {
    canonicalId: 'outlook',
    displayName: 'Microsoft Outlook',
    executableName: 'OUTLOOK.EXE',
    aliases: ['outlook', 'outlook.exe', 'microsoft outlook'],
    candidatePaths: [
      path.join(PROGRAM_FILES, 'Microsoft Office', 'root', 'Office16', 'OUTLOOK.EXE'),
      path.join(PROGRAM_FILES_X86, 'Microsoft Office', 'root', 'Office16', 'OUTLOOK.EXE')
    ],
    processNames: ['outlook.exe', 'olk.exe']
  },
  {
    canonicalId: 'onenote',
    displayName: 'Microsoft OneNote',
    executableName: 'ONENOTE.EXE',
    aliases: ['onenote', 'onenote.exe'],
    candidatePaths: [
      path.join(PROGRAM_FILES, 'Microsoft Office', 'root', 'Office16', 'ONENOTE.EXE')
    ],
    processNames: ['onenote.exe']
  },
  {
    canonicalId: 'teams',
    displayName: 'Microsoft Teams',
    executableName: 'ms-teams.exe',
    aliases: ['teams', 'ms-teams', 'ms-teams.exe', 'microsoft teams'],
    candidatePaths: [path.join(LOCAL_APPDATA, 'Microsoft', 'WindowsApps', 'ms-teams.exe')],
    processNames: ['ms-teams.exe', 'teams.exe']
  },
  {
    canonicalId: 'discord',
    displayName: 'Discord',
    executableName: 'Discord.exe',
    aliases: ['discord', 'discord.exe'],
    candidatePaths: [path.join(LOCAL_APPDATA, 'Discord', 'Update.exe')],
    defaultArgs: ['--processStart', 'Discord.exe'],
    processNames: ['discord.exe']
  },
  {
    canonicalId: 'slack',
    displayName: 'Slack',
    executableName: 'slack.exe',
    aliases: ['slack', 'slack.exe'],
    candidatePaths: [
      path.join(LOCAL_APPDATA, 'slack', 'slack.exe'),
      path.join(LOCAL_APPDATA, 'Microsoft', 'WindowsApps', 'slack.exe')
    ],
    processNames: ['slack.exe']
  },
  {
    canonicalId: 'zoom',
    displayName: 'Zoom',
    executableName: 'Zoom.exe',
    aliases: ['zoom', 'zoom.exe'],
    candidatePaths: [
      path.join(APPDATA, 'Zoom', 'bin', 'Zoom.exe'),
      path.join(PROGRAM_FILES, 'Zoom', 'bin', 'Zoom.exe')
    ],
    processNames: ['zoom.exe']
  },
  {
    canonicalId: 'whatsapp',
    displayName: 'WhatsApp',
    executableName: 'WhatsApp.exe',
    aliases: ['whatsapp', 'whatsapp.exe'],
    candidatePaths: [path.join(LOCAL_APPDATA, 'Microsoft', 'WindowsApps', 'WhatsApp.exe')],
    processNames: ['whatsapp.exe']
  },
  {
    canonicalId: 'telegram',
    displayName: 'Telegram',
    executableName: 'Telegram.exe',
    aliases: ['telegram', 'telegram.exe'],
    candidatePaths: [path.join(APPDATA, 'Telegram Desktop', 'Telegram.exe')],
    processNames: ['telegram.exe']
  },
  {
    canonicalId: 'obs',
    displayName: 'OBS Studio',
    executableName: 'obs64.exe',
    aliases: ['obs', 'obs64', 'obs64.exe', 'obs studio'],
    candidatePaths: [path.join(PROGRAM_FILES, 'obs-studio', 'bin', '64bit', 'obs64.exe')],
    processNames: ['obs64.exe']
  },
  {
    canonicalId: 'steam',
    displayName: 'Steam',
    executableName: 'steam.exe',
    aliases: ['steam', 'steam.exe'],
    candidatePaths: [path.join(PROGRAM_FILES_X86, 'Steam', 'steam.exe')],
    processNames: ['steam.exe']
  },
  {
    canonicalId: 'notion',
    displayName: 'Notion',
    executableName: 'Notion.exe',
    aliases: ['notion', 'notion.exe'],
    candidatePaths: [path.join(LOCAL_APPDATA, 'Programs', 'Notion', 'Notion.exe')],
    processNames: ['notion.exe']
  },
  {
    canonicalId: 'figma',
    displayName: 'Figma',
    executableName: 'Figma.exe',
    aliases: ['figma', 'figma.exe'],
    candidatePaths: [path.join(LOCAL_APPDATA, 'Figma', 'Figma.exe')],
    processNames: ['figma.exe']
  },
  {
    canonicalId: 'postman',
    displayName: 'Postman',
    executableName: 'Postman.exe',
    aliases: ['postman', 'postman.exe'],
    candidatePaths: [path.join(LOCAL_APPDATA, 'Postman', 'Postman.exe')],
    processNames: ['postman.exe']
  },
  {
    canonicalId: 'blender',
    displayName: 'Blender',
    executableName: 'blender.exe',
    aliases: ['blender', 'blender.exe'],
    candidatePaths: [path.join(PROGRAM_FILES, 'Blender Foundation', 'Blender', 'blender.exe')],
    processNames: ['blender.exe']
  },
  {
    canonicalId: 'audacity',
    displayName: 'Audacity',
    executableName: 'Audacity.exe',
    aliases: ['audacity', 'audacity.exe'],
    candidatePaths: [path.join(PROGRAM_FILES, 'Audacity', 'Audacity.exe')],
    processNames: ['audacity.exe']
  },
  {
    canonicalId: 'snippingtool',
    displayName: 'Snipping Tool',
    executableName: 'SnippingTool.exe',
    aliases: ['snippingtool', 'snippingtool.exe', 'snipping tool'],
    candidatePaths: [
      path.join(SYSTEM_ROOT, 'System32', 'SnippingTool.exe'),
      path.join(LOCAL_APPDATA, 'Microsoft', 'WindowsApps', 'SnippingTool.exe')
    ],
    processNames: ['snippingtool.exe']
  },
  {
    canonicalId: 'settings',
    displayName: 'Windows Settings',
    executableName: 'ms-settings:',
    aliases: ['settings', 'ms-settings:', 'windows settings'],
    candidatePaths: [],
    isProtocolUri: true,
    processNames: ['systemsettings.exe', 'applicationframehost.exe']
  },
  {
    canonicalId: 'control',
    displayName: 'Control Panel',
    executableName: 'control.exe',
    aliases: ['control', 'control.exe', 'control panel'],
    candidatePaths: [path.join(SYSTEM_ROOT, 'System32', 'control.exe')],
    processNames: ['control.exe', 'explorer.exe']
  },
  // Official ArtCraft Suite (https://getartcraft.com/apps)
  {
    canonicalId: 'artcraft-launcher',
    displayName: 'ArtCraft Launcher',
    executableName: 'artcraft-launcher.exe',
    aliases: ['artcraft', 'artcraft launcher', 'artcraft-launcher', 'craft launcher', 'craft-launcher'],
    candidatePaths: [
      ...buildArtCraftCandidatePaths('ArtCraft Launcher', 'artcraft-launcher'),
      ...buildArtCraftCandidatePaths('craft-launcher', 'artcraft-launcher'),
      ...buildArtCraftCandidatePaths('ArtCraft Launcher', 'craft-launcher')
    ],
    processNames: ['artcraft-launcher.exe', 'artcraft-launcher', 'craft-launcher.exe']
  },
  {
    canonicalId: 'pdfcraft',
    displayName: 'PdfCraft',
    executableName: 'pdfcraft.exe',
    aliases: ['pdfcraft', 'pdfcraft.exe', 'pdf craft'],
    candidatePaths: [
      ...buildArtCraftCandidatePaths('PdfCraft', 'pdfcraft'),
      ...buildArtCraftCandidatePaths('pdfcraft', 'pdfcraft')
    ],
    processNames: ['pdfcraft.exe', 'pdfcraft']
  },
  {
    canonicalId: 'photocraft',
    displayName: 'PhotoCraft',
    executableName: 'photocraft.exe',
    aliases: ['photocraft', 'photocraft.exe', 'photo craft'],
    candidatePaths: [
      ...buildArtCraftCandidatePaths('PhotoCraft', 'photocraft'),
      ...buildArtCraftCandidatePaths('photocraft', 'photocraft')
    ],
    processNames: ['photocraft.exe', 'photocraft']
  },
  {
    canonicalId: 'vectorcraft',
    displayName: 'VectorCraft',
    executableName: 'vectorcraft.exe',
    aliases: ['vectorcraft', 'vectorcraft.exe', 'vector craft'],
    candidatePaths: [
      ...buildArtCraftCandidatePaths('VectorCraft', 'vectorcraft'),
      ...buildArtCraftCandidatePaths('vectorcraft', 'vectorcraft')
    ],
    processNames: ['vectorcraft.exe', 'vectorcraft']
  },
  {
    canonicalId: 'wordcraft',
    displayName: 'WordCraft',
    executableName: 'wordcraft.exe',
    aliases: ['wordcraft', 'wordcraft.exe', 'word craft'],
    candidatePaths: [
      ...buildArtCraftCandidatePaths('WordCraft', 'wordcraft'),
      ...buildArtCraftCandidatePaths('wordcraft', 'wordcraft')
    ],
    processNames: ['wordcraft.exe', 'wordcraft']
  },
  {
    canonicalId: 'gridcraft',
    displayName: 'GridCraft',
    executableName: 'gridcraft.exe',
    aliases: ['gridcraft', 'gridcraft.exe', 'grid craft'],
    candidatePaths: [
      ...buildArtCraftCandidatePaths('GridCraft', 'gridcraft'),
      ...buildArtCraftCandidatePaths('gridcraft', 'gridcraft')
    ],
    processNames: ['gridcraft.exe', 'gridcraft']
  },
  {
    canonicalId: 'deckcraft',
    displayName: 'DeckCraft',
    executableName: 'deckcraft.exe',
    aliases: ['deckcraft', 'deckcraft.exe', 'deck craft'],
    candidatePaths: [
      ...buildArtCraftCandidatePaths('DeckCraft', 'deckcraft'),
      ...buildArtCraftCandidatePaths('deckcraft', 'deckcraft')
    ],
    processNames: ['deckcraft.exe', 'deckcraft']
  },
  {
    canonicalId: 'soundcraft',
    displayName: 'SoundCraft',
    executableName: 'soundcraft.exe',
    aliases: ['soundcraft', 'soundcraft.exe', 'sound craft'],
    candidatePaths: [
      ...buildArtCraftCandidatePaths('SoundCraft', 'soundcraft'),
      ...buildArtCraftCandidatePaths('soundcraft', 'soundcraft')
    ],
    processNames: ['soundcraft.exe', 'soundcraft']
  },
  {
    canonicalId: 'filmcraft',
    displayName: 'FilmCraft',
    executableName: 'filmcraft.exe',
    aliases: ['filmcraft', 'filmcraft.exe', 'film craft'],
    candidatePaths: [
      ...buildArtCraftCandidatePaths('FilmCraft', 'filmcraft'),
      ...buildArtCraftCandidatePaths('filmcraft', 'filmcraft')
    ],
    processNames: ['filmcraft.exe', 'filmcraft']
  },
  {
    canonicalId: 'lightcraft',
    displayName: 'LightCraft',
    executableName: 'lightcraft.exe',
    aliases: ['lightcraft', 'lightcraft.exe', 'light craft'],
    candidatePaths: [
      ...buildArtCraftCandidatePaths('LightCraft', 'lightcraft'),
      ...buildArtCraftCandidatePaths('lightcraft', 'lightcraft')
    ],
    processNames: ['lightcraft.exe', 'lightcraft']
  },
  {
    canonicalId: 'designcraft',
    displayName: 'DesignCraft',
    executableName: 'designcraft.exe',
    aliases: ['designcraft', 'designcraft.exe', 'design craft'],
    candidatePaths: [
      ...buildArtCraftCandidatePaths('DesignCraft', 'designcraft'),
      ...buildArtCraftCandidatePaths('designcraft', 'designcraft')
    ],
    processNames: ['designcraft.exe', 'designcraft']
  },
  {
    canonicalId: 'figcraft',
    displayName: 'FigCraft',
    executableName: 'figcraft.exe',
    aliases: ['figcraft', 'figcraft.exe', 'fig craft'],
    candidatePaths: [
      ...buildArtCraftCandidatePaths('FigCraft', 'figcraft'),
      ...buildArtCraftCandidatePaths('figcraft', 'figcraft')
    ],
    processNames: ['figcraft.exe', 'figcraft']
  },
  {
    canonicalId: 'effectcraft',
    displayName: 'EffectCraft',
    executableName: 'effectcraft.exe',
    aliases: ['effectcraft', 'effectcraft.exe', 'effect craft'],
    candidatePaths: [
      ...buildArtCraftCandidatePaths('EffectCraft', 'effectcraft'),
      ...buildArtCraftCandidatePaths('effectcraft', 'effectcraft')
    ],
    processNames: ['effectcraft.exe', 'effectcraft']
  },
  {
    canonicalId: 'cadcraft',
    displayName: 'CADCraft',
    executableName: 'cadcraft.exe',
    aliases: ['cadcraft', 'cadcraft.exe', 'cad craft'],
    candidatePaths: [
      ...buildArtCraftCandidatePaths('CADCraft', 'cadcraft'),
      ...buildArtCraftCandidatePaths('cadcraft', 'cadcraft')
    ],
    processNames: ['cadcraft.exe', 'cadcraft']
  }
];

export class WindowsAppResolver {
  private static instance: WindowsAppResolver;
  private aliasMap: Map<string, AppCatalogEntry> = new Map();
  private startMenuCache: Map<string, string> | null = null;
  private startMenuCacheTimestamp = 0;
  private startAppsCache: StartAppRecord[] | null = null;
  private startAppsCacheTimestamp = 0;

  constructor() {
    for (const entry of AUTHORIZED_APP_CATALOG) {
      this.aliasMap.set(entry.canonicalId.toLowerCase(), entry);
      for (const alias of entry.aliases) {
        this.aliasMap.set(alias.toLowerCase(), entry);
      }
    }
  }

  public static getInstance(): WindowsAppResolver {
    if (!WindowsAppResolver.instance) {
      WindowsAppResolver.instance = new WindowsAppResolver();
    }
    return WindowsAppResolver.instance;
  }

  public refreshCache(): void {
    this.startMenuCache = null;
    this.startMenuCacheTimestamp = 0;
    this.startAppsCache = null;
    this.startAppsCacheTimestamp = 0;
  }

  /**
   * Validates that an input string contains no shell metacharacters, command separators, or path traversal.
   */
  public static containsUnsafeCharacters(input: string): boolean {
    return /[;&|`$(){}<>'"\r\n]/.test(input) || input.includes('..');
  }

  private static normalizeKey(name: string): string {
    return name
      .toLowerCase()
      .replace(/\.(exe|lnk|cmd|bat)$/i, '')
      .replace(/[^a-z0-9]+/g, '');
  }

  /**
   * Queries Windows Registry App Paths (`HKCU` and `HKLM`) without shell interpolation.
   */
  private queryRegistryAppPaths(exeName: string): string | null {
    if (process.platform !== 'win32') return null;
    const cleanExe = exeName.toLowerCase().endsWith('.exe') ? exeName : `${exeName}.exe`;
    if (!/^[a-zA-Z0-9._\-\s]+\.exe$/i.test(cleanExe)) return null;

    const hives = [
      `HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\${cleanExe}`,
      `HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\${cleanExe}`,
      `HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\App Paths\\${cleanExe}`
    ];

    for (const keyPath of hives) {
      try {
        const out = execFileSync('reg.exe', ['query', keyPath, '/ve'], {
          encoding: 'utf8',
          timeout: 1500,
          windowsHide: true,
          stdio: ['ignore', 'pipe', 'ignore']
        });
        const match = out.match(/REG_(?:EXPAND_)?SZ\s+(.+)$/im);
        if (match && match[1]) {
          let candidate = match[1].trim().replace(/^"|"$/g, '');
          candidate = candidate.replace(/%([^%]+)%/g, (_m, envName) => process.env[envName] || _m);
          if (fs.existsSync(candidate)) {
            return candidate;
          }
        }
      } catch {
        // Key does not exist in this hive
      }
    }
    return null;
  }

  /**
   * Indexes Start Menu `.lnk` shortcuts across User and All-Users Start Menu folders.
   */
  private getStartMenuShortcutIndex(): Map<string, string> {
    const now = Date.now();
    if (this.startMenuCache && now - this.startMenuCacheTimestamp < 60_000) {
      return this.startMenuCache;
    }

    const index = new Map<string, string>();
    if (process.platform !== 'win32') {
      this.startMenuCache = index;
      this.startMenuCacheTimestamp = now;
      return index;
    }

    const roots = [
      path.join(APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs'),
      path.join(PROGRAM_DATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs')
    ];

    const walk = (dir: string, depth: number) => {
      if (depth > 4 || !fs.existsSync(dir)) return;
      let entries: fs.Dirent[] = [];
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full, depth + 1);
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.lnk')) {
          const base = entry.name.slice(0, -4);
          if (/uninstall|remove|help|readme|website/i.test(base)) continue;
          const lower = base.toLowerCase().trim();
          const compact = WindowsAppResolver.normalizeKey(base);
          if (!index.has(lower)) index.set(lower, full);
          if (compact && !index.has(compact)) index.set(compact, full);
        }
      }
    };

    for (const root of roots) {
      walk(root, 0);
    }

    this.startMenuCache = index;
    this.startMenuCacheTimestamp = now;
    return index;
  }

  /**
   * Resolves a `.lnk` shortcut's target executable path safely via parameterized environment variable.
   */
  private inspectShortcutTarget(lnkPath: string): { targetPath: string; arguments: string } | null {
    if (process.platform !== 'win32' || !fs.existsSync(lnkPath)) return null;
    try {
      const psScript =
        '$s = (New-Object -ComObject WScript.Shell).CreateShortcut($env:ORION_LNK_PATH); ' +
        '[PSCustomObject]@{ targetPath = [string]$s.TargetPath; arguments = [string]$s.Arguments } | ConvertTo-Json -Compress';
      const out = execFileSync(
        'powershell.exe',
        ['-NoProfile', '-NonInteractive', '-Command', psScript],
        {
          encoding: 'utf8',
          timeout: 2500,
          windowsHide: true,
          env: { ...process.env, ORION_LNK_PATH: lnkPath },
          stdio: ['ignore', 'pipe', 'ignore']
        }
      );
      const parsed = JSON.parse(out.trim());
      if (parsed && typeof parsed.targetPath === 'string' && parsed.targetPath.trim()) {
        return {
          targetPath: parsed.targetPath.trim(),
          arguments: typeof parsed.arguments === 'string' ? parsed.arguments.trim() : ''
        };
      }
    } catch {}
    return null;
  }

  /**
   * Scans `%LOCALAPPDATA%\Programs` (including `ArtCraft\**`) and `%ProgramFiles%` for matching `.exe` binaries.
   */
  private scanInstalledProgramsDirectories(queryName: string): string | null {
    if (process.platform !== 'win32') return null;
    const compactTarget = WindowsAppResolver.normalizeKey(queryName);
    if (!compactTarget) return null;

    const searchRoots = [
      path.join(LOCAL_APPDATA, 'Programs', 'ArtCraft'),
      path.join(LOCAL_APPDATA, 'Programs'),
      path.join(PROGRAM_FILES, 'ArtCraft'),
      PROGRAM_FILES,
      PROGRAM_FILES_X86
    ];

    for (const root of searchRoots) {
      if (!fs.existsSync(root)) continue;
      let subdirs: fs.Dirent[] = [];
      try {
        subdirs = fs.readdirSync(root, { withFileTypes: true });
      } catch {
        continue;
      }

      // Direct exe check in root
      for (const item of subdirs) {
        if (item.isFile() && item.name.toLowerCase().endsWith('.exe')) {
          if (WindowsAppResolver.normalizeKey(item.name) === compactTarget) {
            return path.join(root, item.name);
          }
        }
      }

      // One-level subdirectory check for matching folder or matching executable
      for (const dir of subdirs) {
        if (!dir.isDirectory()) continue;
        const dirNorm = WindowsAppResolver.normalizeKey(dir.name);
        if (!dirNorm.includes(compactTarget) && !compactTarget.includes(dirNorm)) {
          continue;
        }
        const subPath = path.join(root, dir.name);
        try {
          const files = fs.readdirSync(subPath, { withFileTypes: true });
          for (const f of files) {
            if (f.isFile() && f.name.toLowerCase().endsWith('.exe')) {
              const fileNorm = WindowsAppResolver.normalizeKey(f.name);
              if (fileNorm === compactTarget || (dirNorm === compactTarget && !/unins|update|crash/i.test(f.name))) {
                return path.join(subPath, f.name);
              }
            }
          }
        } catch {}
      }
    }

    return null;
  }

  /**
   * Resolves an executable registered on the system `PATH` via `where.exe` (excluding unsafe temp/downloads dirs).
   */
  private resolveFromSystemPath(queryName: string): string | null {
    if (process.platform !== 'win32') return null;
    const exeQuery = queryName.toLowerCase().endsWith('.exe') ? queryName : `${queryName}.exe`;
    if (!/^[a-zA-Z0-9._\-]+\.exe$/i.test(exeQuery)) return null;

    try {
      const out = execFileSync('where.exe', [exeQuery], {
        encoding: 'utf8',
        timeout: 1500,
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'ignore']
      });
      const lines = out
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean);
      for (const candidate of lines) {
        const lower = candidate.toLowerCase();
        if (lower.includes('\\temp\\') || lower.includes('\\downloads\\')) continue;
        if (fs.existsSync(candidate)) {
          return candidate;
        }
      }
    } catch {}
    return null;
  }

  /**
   * Queries registered Windows Start / Microsoft Store applications (`Get-StartApps`) for AUMID resolution.
   */
  private getRegisteredStartApps(): StartAppRecord[] {
    const now = Date.now();
    if (this.startAppsCache && now - this.startAppsCacheTimestamp < 60_000) {
      return this.startAppsCache;
    }
    if (process.platform !== 'win32') {
      this.startAppsCache = [];
      this.startAppsCacheTimestamp = now;
      return [];
    }

    try {
      const out = execFileSync(
        'powershell.exe',
        [
          '-NoProfile',
          '-NonInteractive',
          '-Command',
          'Get-StartApps | Select-Object Name, AppID | ConvertTo-Json -Compress'
        ],
        {
          encoding: 'utf8',
          timeout: 3500,
          windowsHide: true,
          stdio: ['ignore', 'pipe', 'ignore']
        }
      );
      const parsed = JSON.parse(out.trim());
      const records: StartAppRecord[] = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === 'object'
          ? [parsed]
          : [];
      this.startAppsCache = records.filter(r => r && typeof r.Name === 'string' && typeof r.AppID === 'string');
    } catch {
      this.startAppsCache = [];
    }
    this.startAppsCacheTimestamp = now;
    return this.startAppsCache;
  }

  /**
   * Lists discoverable installed applications across catalog, Start Menu, Registry, and ArtCraft directory.
   */
  public discoverInstalledApps(query?: string): ResolvedWindowsApp[] {
    const discovered: ResolvedWindowsApp[] = [];
    const seenIds = new Set<string>();
    const cleanQuery = query?.trim().toLowerCase();

    for (const entry of AUTHORIZED_APP_CATALOG) {
      if (
        cleanQuery &&
        !entry.canonicalId.toLowerCase().includes(cleanQuery) &&
        !entry.displayName.toLowerCase().includes(cleanQuery) &&
        !entry.aliases.some(a => a.toLowerCase().includes(cleanQuery))
      ) {
        continue;
      }
      try {
        const res = this.resolveApp(entry.canonicalId);
        if (res.existsOnDisk) {
          discovered.push(res);
          seenIds.add(res.canonicalId.toLowerCase());
        }
      } catch {}
    }

    if (cleanQuery && discovered.length === 0) {
      try {
        const direct = this.resolveApp(query!.trim());
        if (direct.existsOnDisk && !seenIds.has(direct.canonicalId.toLowerCase())) {
          discovered.push(direct);
        }
      } catch {}
    }

    return discovered;
  }

  /**
   * Resolves an application identifier across Catalog, Windows Registry App Paths,
   * Start Menu shortcuts, Installed Programs folders, System PATH, and Microsoft Store AUMIDs.
   * Rejects shell injection, arbitrary filesystem paths, inline CLI flags, and prohibited binaries.
   */
  public resolveApp(rawAppName: string): ResolvedWindowsApp {
    if (!rawAppName || typeof rawAppName !== 'string' || !rawAppName.trim()) {
      throw new Error(`[SECURITY BLOCKED] Application identifier must be a non-empty string.`);
    }

    const trimmed = rawAppName.trim();
    if (
      WindowsAppResolver.containsUnsafeCharacters(trimmed) ||
      trimmed.includes('\\') ||
      trimmed.includes('/') ||
      /(?:^|\s)--?[a-zA-Z]/.test(trimmed) ||
      /\s\/[a-zA-Z]/.test(trimmed)
    ) {
      throw new Error(
        `[SECURITY BLOCKED] Disallowed or unsafe application identifier: '${trimmed}'. Arbitrary paths, inline flags, and shell metacharacters are prohibited.`
      );
    }

    const normalized = trimmed.toLowerCase();
    const withoutExe = normalized.replace(/\.exe$/i, '');
    const compact = WindowsAppResolver.normalizeKey(trimmed);

    if (PROHIBITED_APP_IDENTIFIERS.has(withoutExe) || PROHIBITED_APP_IDENTIFIERS.has(compact)) {
      throw new Error(
        `[SECURITY BLOCKED] Disallowed administrative or high-risk binary: '${trimmed}'.`
      );
    }

    const entry =
      this.aliasMap.get(normalized) ||
      this.aliasMap.get(withoutExe) ||
      AUTHORIZED_APP_CATALOG.find(e => WindowsAppResolver.normalizeKey(e.displayName) === compact);

    // 1. Protocol URI Catalog Entries (e.g. ms-settings:)
    if (entry?.isProtocolUri) {
      return {
        canonicalId: entry.canonicalId,
        displayName: entry.displayName,
        executableName: entry.executableName,
        resolvedExecutablePath: entry.executableName,
        existsOnDisk: true,
        isProtocolUri: true,
        discoverySource: 'PROTOCOL_URI',
        defaultArgs: [],
        processNames: entry.processNames
      };
    }

    // 2. Direct Catalog Candidate Paths
    if (entry) {
      for (const candidate of entry.candidatePaths) {
        try {
          if (fs.existsSync(candidate)) {
            return {
              canonicalId: entry.canonicalId,
              displayName: entry.displayName,
              executableName: entry.executableName,
              resolvedExecutablePath: candidate,
              existsOnDisk: true,
              isProtocolUri: false,
              discoverySource: 'CATALOG',
              defaultArgs: entry.defaultArgs ? [...entry.defaultArgs] : [],
              processNames: entry.processNames
            };
          }
        } catch {}
      }
    }

    // 3. Windows Registry App Paths Discovery (supports non-default drives & paths with spaces)
    const regLookupName = entry ? entry.executableName : withoutExe;
    const regResolved = this.queryRegistryAppPaths(regLookupName);
    if (regResolved) {
      const exeBase = path.basename(regResolved);
      return {
        canonicalId: entry?.canonicalId || withoutExe,
        displayName: entry?.displayName || trimmed,
        executableName: exeBase,
        resolvedExecutablePath: regResolved,
        existsOnDisk: true,
        isProtocolUri: false,
        discoverySource: 'REGISTRY_APP_PATHS',
        defaultArgs: entry?.defaultArgs ? [...entry.defaultArgs] : [],
        processNames: entry?.processNames || [exeBase.toLowerCase(), exeBase.toLowerCase().replace(/\.exe$/i, '')]
      };
    }

    // 4. Installed Programs Directories (%LOCALAPPDATA%\Programs, ArtCraft, %ProgramFiles%)
    const progDirResolved = this.scanInstalledProgramsDirectories(entry ? entry.displayName : withoutExe)
      || (entry ? this.scanInstalledProgramsDirectories(entry.canonicalId) : null);
    if (progDirResolved) {
      const exeBase = path.basename(progDirResolved);
      return {
        canonicalId: entry?.canonicalId || withoutExe,
        displayName: entry?.displayName || trimmed,
        executableName: exeBase,
        resolvedExecutablePath: progDirResolved,
        existsOnDisk: true,
        isProtocolUri: false,
        discoverySource: 'PROGRAMS_DIR',
        defaultArgs: [],
        processNames: entry?.processNames || [exeBase.toLowerCase(), exeBase.toLowerCase().replace(/\.exe$/i, '')]
      };
    }

    // 5. Start Menu Shortcut (.lnk) Discovery
    const shortcutIndex = this.getStartMenuShortcutIndex();
    const shortcutPath =
      shortcutIndex.get(normalized) ||
      shortcutIndex.get(withoutExe) ||
      shortcutIndex.get(compact) ||
      (entry ? shortcutIndex.get(entry.displayName.toLowerCase()) : undefined);
    if (shortcutPath && fs.existsSync(shortcutPath)) {
      const targetInfo = this.inspectShortcutTarget(shortcutPath);
      if (targetInfo && fs.existsSync(targetInfo.targetPath)) {
        const exeBase = path.basename(targetInfo.targetPath);
        if (!PROHIBITED_APP_IDENTIFIERS.has(exeBase.toLowerCase().replace(/\.exe$/i, ''))) {
          return {
            canonicalId: entry?.canonicalId || compact || withoutExe,
            displayName: entry?.displayName || path.basename(shortcutPath, '.lnk'),
            executableName: exeBase,
            resolvedExecutablePath: targetInfo.targetPath,
            existsOnDisk: true,
            isProtocolUri: false,
            shortcutPath,
            discoverySource: 'START_MENU_SHORTCUT',
            defaultArgs: [],
            processNames: entry?.processNames || [exeBase.toLowerCase(), exeBase.toLowerCase().replace(/\.exe$/i, '')]
          };
        }
      }
      // UWP / Store or MSI shortcut without direct file TargetPath: launch via explorer.exe <shortcut.lnk>
      return {
        canonicalId: entry?.canonicalId || compact || withoutExe,
        displayName: entry?.displayName || path.basename(shortcutPath, '.lnk'),
        executableName: path.basename(shortcutPath),
        resolvedExecutablePath: path.join(SYSTEM_ROOT, 'explorer.exe'),
        existsOnDisk: true,
        isProtocolUri: false,
        shortcutPath,
        discoverySource: 'START_MENU_SHORTCUT',
        defaultArgs: [shortcutPath],
        processNames: entry?.processNames || [compact, 'applicationframehost.exe']
      };
    }

    // 6. System PATH Discovery (`where.exe`)
    const pathResolved = this.resolveFromSystemPath(entry ? entry.executableName : withoutExe);
    if (pathResolved) {
      const exeBase = path.basename(pathResolved);
      return {
        canonicalId: entry?.canonicalId || withoutExe,
        displayName: entry?.displayName || trimmed,
        executableName: exeBase,
        resolvedExecutablePath: pathResolved,
        existsOnDisk: true,
        isProtocolUri: false,
        discoverySource: 'SYSTEM_PATH',
        defaultArgs: entry?.defaultArgs ? [...entry.defaultArgs] : [],
        processNames: entry?.processNames || [exeBase.toLowerCase(), exeBase.toLowerCase().replace(/\.exe$/i, '')]
      };
    }

    // 7. Microsoft Store / MSIX / UWP Registered StartApps (`AppsFolder` AUMID)
    const startApps = this.getRegisteredStartApps();
    const matchedStartApp = startApps.find(a => {
      const nLower = a.Name.toLowerCase().trim();
      const nCompact = WindowsAppResolver.normalizeKey(a.Name);
      return nLower === normalized || nLower === withoutExe || (compact.length >= 3 && nCompact === compact);
    });
    if (matchedStartApp) {
      return {
        canonicalId: entry?.canonicalId || compact || withoutExe,
        displayName: matchedStartApp.Name,
        executableName: matchedStartApp.Name,
        resolvedExecutablePath: path.join(SYSTEM_ROOT, 'explorer.exe'),
        existsOnDisk: true,
        isProtocolUri: false,
        isStoreApp: true,
        aumid: matchedStartApp.AppID,
        discoverySource: 'WINDOWS_STORE_AUMID',
        defaultArgs: [`shell:AppsFolder\\${matchedStartApp.AppID}`],
        processNames: entry?.processNames || [compact, 'applicationframehost.exe']
      };
    }

    // 8. Known Catalog Entry Not Installed on Disk
    if (entry) {
      return {
        canonicalId: entry.canonicalId,
        displayName: entry.displayName,
        executableName: entry.executableName,
        resolvedExecutablePath: entry.executableName,
        existsOnDisk: false,
        isProtocolUri: false,
        discoverySource: 'NOT_INSTALLED',
        defaultArgs: [],
        processNames: entry.processNames
      };
    }

    throw new Error(
      `[APP_NOT_INSTALLED] Application '${trimmed}' is not installed or registered in Windows Registry, Start Menu, Programs, PATH, or Microsoft Store.`
    );
  }

  /**
   * Validates a single optional file/document/URL argument passed to an application launch.
   * Preserves paths containing spaces safely while rejecting metacharacters, traversal, and injection flags.
   */
  public validateLaunchArgument(argPath?: string): string[] {
    if (!argPath || typeof argPath !== 'string' || !argPath.trim()) {
      return [];
    }
    const clean = argPath.trim();
    if (
      clean.startsWith('-') ||
      WindowsAppResolver.containsUnsafeCharacters(clean) ||
      PROHIBITED_ARG_PATTERNS.some(rx => rx.test(clean))
    ) {
      throw new Error(`[SECURITY BLOCKED] Unsafe launch argument rejected: '${clean}'.`);
    }
    return [clean];
  }

  /**
   * Validates an array of separated launch arguments (e.g. file paths with spaces, URLs, or safe flags like `--new-window`).
   */
  public validateLaunchArguments(args?: string | string[]): string[] {
    if (!args) return [];
    const list = Array.isArray(args) ? args : [args];
    const validated: string[] = [];

    for (const raw of list) {
      if (typeof raw !== 'string' || !raw.trim()) continue;
      const clean = raw.trim();
      if (
        WindowsAppResolver.containsUnsafeCharacters(clean) ||
        PROHIBITED_ARG_PATTERNS.some(rx => rx.test(clean))
      ) {
        throw new Error(`[SECURITY BLOCKED] Unsafe launch argument rejected: '${clean}'.`);
      }
      if (clean.startsWith('-') && !['--new-window', '--incognito'].includes(clean.toLowerCase())) {
        throw new Error(`[SECURITY BLOCKED] Disallowed CLI flag in application launch arguments: '${clean}'.`);
      }
      validated.push(clean);
    }

    return validated;
  }
}
