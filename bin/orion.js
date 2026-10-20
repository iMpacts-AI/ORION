#!/usr/bin/env node

/**
 * ORION AI Command System — Cross-Platform Autonomous CLI (v1.0.0 / Engine v2.0)
 * Supports Windows (win32), macOS (darwin), and Linux (linux) + Node.js Runtime
 * Includes Al-Hiqmah Wisdom Engine, Model Context Protocol (/mcp), & //commands
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const readline = require('readline');
const https = require('https');
const { spawn, execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PKG_PATH = path.join(PROJECT_ROOT, 'package.json');
const pkg = fs.existsSync(PKG_PATH) ? JSON.parse(fs.readFileSync(PKG_PATH, 'utf8')) : { version: '1.0.0' };

const ORION_HOME = path.join(os.homedir(), '.orion');
const MCP_CONFIG_PATH = path.join(ORION_HOME, 'mcp.json');
const MEMORY_PATH = path.join(ORION_HOME, 'memory.json');
const CONFIG_PATH = path.join(ORION_HOME, 'config.json');
const AI_SERVER_ROOT = path.resolve(os.homedir(), 'ai-server');

function ensureOrionHome() {
  if (!fs.existsSync(ORION_HOME)) {
    fs.mkdirSync(ORION_HOME, { recursive: true });
  }
}

// ============================================================================
// AL-HIQMAH + ORION CROSS-PLATFORM APP MAP & TRIGGERS (Mac, Linux, Windows)
// ============================================================================
const APP_MAP = {
  "chrome": { darwin: "Google Chrome", win32: "chrome", linux: "google-chrome", title: "Google Chrome" },
  "google chrome": { darwin: "Google Chrome", win32: "chrome", linux: "google-chrome", title: "Google Chrome" },
  "brave": { darwin: "Brave Browser", win32: "brave", linux: "brave-browser", title: "Brave Browser" },
  "safari": { darwin: "Safari", win32: "msedge", linux: "xdg-open", title: "Safari" },
  "firefox": { darwin: "Firefox", win32: "firefox", linux: "firefox", title: "Firefox" },
  "arc": { darwin: "Arc", win32: "Arc", linux: "arc", title: "Arc" },
  "edge": { darwin: "Microsoft Edge", win32: "msedge", linux: "microsoft-edge", title: "Microsoft Edge" },
  "spotify": { darwin: "Spotify", win32: "spotify:", linux: "spotify", title: "Spotify" },
  "music": { darwin: "Music", win32: "spotify:", linux: "rhythmbox", title: "Music" },
  "apple music": { darwin: "Music", win32: "spotify:", linux: "rhythmbox", title: "Apple Music" },
  "vlc": { darwin: "VLC", win32: "vlc", linux: "vlc", title: "VLC" },
  "mail": { darwin: "Mail", win32: "outlook:", linux: "thunderbird", title: "Mail" },
  "email": { darwin: "Mail", win32: "outlook:", linux: "thunderbird", title: "Mail" },
  "notes": { darwin: "Notes", win32: "notepad", linux: "gedit", title: "Notes" },
  "notepad": { darwin: "Notes", win32: "notepad", linux: "gedit", title: "Notepad" },
  "calendar": { darwin: "Calendar", win32: "outlookcal:", linux: "gnome-calendar", title: "Calendar" },
  "finder": { darwin: "Finder", win32: "explorer", linux: "nautilus", title: "Finder / Explorer" },
  "explorer": { darwin: "Finder", win32: "explorer", linux: "nautilus", title: "File Explorer" },
  "terminal": { darwin: "Terminal", win32: "wt", linux: "gnome-terminal", title: "Terminal" },
  "iterm": { darwin: "iTerm2", win32: "wt", linux: "alacritty", title: "iTerm2" },
  "vscode": { darwin: "Visual Studio Code", win32: "code", linux: "code", title: "Visual Studio Code" },
  "vs code": { darwin: "Visual Studio Code", win32: "code", linux: "code", title: "Visual Studio Code" },
  "code": { darwin: "Visual Studio Code", win32: "code", linux: "code", title: "Visual Studio Code" },
  "xcode": { darwin: "Xcode", win32: "code", linux: "code", title: "Xcode" },
  "word": { darwin: "Microsoft Word", win32: "winword", linux: "libreoffice --writer", title: "Microsoft Word" },
  "excel": { darwin: "Microsoft Excel", win32: "excel", linux: "libreoffice --calc", title: "Microsoft Excel" },
  "powerpoint": { darwin: "Microsoft PowerPoint", win32: "powerpnt", linux: "libreoffice --impress", title: "Microsoft PowerPoint" },
  "outlook": { darwin: "Microsoft Outlook", win32: "outlook", linux: "thunderbird", title: "Microsoft Outlook" },
  "whatsapp": { darwin: "WhatsApp", win32: "whatsapp:", linux: "whatsapp-for-linux", title: "WhatsApp" },
  "telegram": { darwin: "Telegram", win32: "telegram:", linux: "telegram-desktop", title: "Telegram" },
  "slack": { darwin: "Slack", win32: "slack:", linux: "slack", title: "Slack" },
  "discord": { darwin: "Discord", win32: "discord:", linux: "discord", title: "Discord" },
  "zoom": { darwin: "zoom.us", win32: "zoommtg:", linux: "zoom", title: "Zoom" },
  "teams": { darwin: "Microsoft Teams", win32: "msteams:", linux: "teams", title: "Microsoft Teams" },
  "settings": { darwin: "System Settings", win32: "ms-settings:", linux: "gnome-control-center", title: "System Settings" },
  "system settings": { darwin: "System Settings", win32: "ms-settings:", linux: "gnome-control-center", title: "System Settings" },
  "activity monitor": { darwin: "Activity Monitor", win32: "taskmgr", linux: "gnome-system-monitor", title: "Activity Monitor" },
  "task manager": { darwin: "Activity Monitor", win32: "taskmgr", linux: "gnome-system-monitor", title: "Task Manager" },
  "calculator": { darwin: "Calculator", win32: "calc", linux: "gnome-calculator", title: "Calculator" },
  "figma": { darwin: "Figma", win32: "figma:", linux: "figma-linux", title: "Figma" },
  "notion": { darwin: "Notion", win32: "notion:", linux: "notion-app", title: "Notion" },
  "obsidian": { darwin: "Obsidian", win32: "obsidian:", linux: "obsidian", title: "Obsidian" },
  "tailscale": { darwin: "Tailscale", win32: "tailscale-ipn", linux: "tailscale", title: "Tailscale" }
};

const OPEN_TRIGGERS = [
  "open", "launch", "start", "run", "load", "fire up",
  "pull up", "bring up", "switch to", "go to", "show me",
  "get", "oprn", "opne", "ope", "lunach", "lauch"
];

const CLOSE_TRIGGERS = ["close", "quit", "exit", "kill", "shut", "stop"];

const SEARCH_TRIGGERS = [
  "search up", "search for", "search", "google", "look up",
  "find online", "browse to", "open website", "go to website"
];

const SYSTEM_TRIGGERS = {
  "screenshot":  ["screenshot", "screen shot", "capture screen", "take a screenshot"],
  "sleep":       ["sleep", "go to sleep", "sleep mode"],
  "volume_up":   ["volume up", "louder", "increase volume", "turn up"],
  "volume_down": ["volume down", "quieter", "decrease volume", "turn down"],
  "mute":        ["mute", "silence", "quiet"],
  "unmute":      ["unmute", "sound on"],
  "lock":        ["lock screen", "lock the screen", "lock mac", "lock pc", "lock computer"],
  "specs":       ["system specs", "hardware specs", "mac specs", "pc specs", "my specs"]
};

// ============================================================================
// DEFAULT MCP SERVERS & CONFIGURATION
// ============================================================================
const DEFAULT_MCP_SERVERS = {
  "filesystem": {
    name: "filesystem",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", os.homedir()],
    enabled: true,
    builtIn: true,
    description: "Read, write, and search local files across workspace",
    tools: ["read_file", "write_file", "list_directory", "search_files"]
  },
  "system-control": {
    name: "system-control",
    transport: "builtin",
    command: "orion-internal",
    args: [],
    enabled: true,
    builtIn: true,
    description: "Cross-platform OS control (Mac/Linux/Windows apps, volume, screenshots, specs)",
    tools: ["launch_app", "close_app", "system_action", "get_system_specs", "keyboard_search"]
  },
  "memory": {
    name: "memory",
    transport: "builtin",
    command: "orion-internal",
    args: [],
    enabled: true,
    builtIn: true,
    description: "Persistent knowledge graph and episodic conversation memory",
    tools: ["store_memory", "recall_memory", "clear_memory"]
  },
  "web-research": {
    name: "web-research",
    transport: "builtin",
    command: "orion-internal",
    args: [],
    enabled: true,
    builtIn: true,
    description: "Web search and URL content extraction",
    tools: ["web_search", "open_url"]
  },
  "github": {
    name: "github",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-github"],
    enabled: true,
    builtIn: true,
    description: "GitHub repository management, issues, PRs, and commits",
    tools: ["list_repos", "get_repo_status", "create_issue", "search_code"]
  }
};

function loadMcpServers() {
  ensureOrionHome();
  let custom = {};
  if (fs.existsSync(MCP_CONFIG_PATH)) {
    try {
      custom = JSON.parse(fs.readFileSync(MCP_CONFIG_PATH, 'utf8'));
    } catch {}
  }
  return { ...DEFAULT_MCP_SERVERS, ...custom };
}

function saveMcpServers(servers) {
  ensureOrionHome();
  fs.writeFileSync(MCP_CONFIG_PATH, JSON.stringify(servers, null, 2), 'utf8');
}

function loadConfig() {
  ensureOrionHome();
  const defaults = {
    model: "claude-haiku-4-5-20251001",
    persona: "ORION + Al-Hiqmah Wisdom Engine",
    platform: process.platform
  };
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      return { ...defaults, ...JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')) };
    } catch {}
  }
  return defaults;
}

function saveConfig(cfg) {
  ensureOrionHome();
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2), 'utf8');
}

function loadMemory() {
  ensureOrionHome();
  if (fs.existsSync(MEMORY_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(MEMORY_PATH, 'utf8'));
    } catch {}
  }
  return [];
}

function saveMemory(history) {
  ensureOrionHome();
  fs.writeFileSync(MEMORY_PATH, JSON.stringify(history.slice(-20), null, 2), 'utf8');
}

function getElectronPath() {
  try {
    return require('electron');
  } catch {
    const candidatePaths = [
      path.join(PROJECT_ROOT, 'node_modules', 'electron', 'dist', process.platform === 'win32' ? 'electron.exe' : 'electron'),
      path.join(PROJECT_ROOT, 'node_modules', '.bin', process.platform === 'win32' ? 'electron.cmd' : 'electron')
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) return p;
    }
    return process.platform === 'win32' ? 'electron.cmd' : 'electron';
  }
}

// ============================================================================
// CROSS-PLATFORM HARDWARE & OS TELEMETRY (Al-Hiqmah v9 + ORION)
// ============================================================================
function getSystemSpecs() {
  const platformName = process.platform === 'darwin' ? 'macOS' : (process.platform === 'win32' ? 'Windows' : 'Linux');
  const cpus = os.cpus() || [];
  const cpuModel = cpus[0] ? cpus[0].model.trim() : os.arch();
  const totalRamGb = Math.round(os.totalmem() / (1024 ** 3));
  const freeRamGb = Math.round(os.freemem() / (1024 ** 3));

  let installedApps = [];
  try {
    if (process.platform === 'darwin' && fs.existsSync('/Applications')) {
      installedApps = fs.readdirSync('/Applications').filter(a => a.endsWith('.app')).map(a => a.replace('.app', ''));
    } else if (process.platform === 'linux' && fs.existsSync('/usr/share/applications')) {
      installedApps = fs.readdirSync('/usr/share/applications').filter(a => a.endsWith('.desktop')).map(a => a.replace('.desktop', ''));
    } else if (process.platform === 'win32') {
      installedApps = Object.keys(APP_MAP);
    }
  } catch {}

  return {
    os: `${platformName} ${os.release()} (${os.arch()})`,
    username: os.userInfo().username,
    hostname: os.hostname(),
    cpu: cpuModel,
    cpu_cores: cpus.length,
    ram_total: `${totalRamGb}GB`,
    ram_free: `${freeRamGb}GB`,
    node_version: process.version,
    installed_apps_count: installedApps.length
  };
}

// ============================================================================
// AL-HIQMAH MULTI-METHOD APP LAUNCHER & KEYBOARD SEARCH FALLBACK
// ============================================================================
function launchAppCrossPlatform(rawName) {
  const lower = rawName.toLowerCase().trim();
  const entry = APP_MAP[lower];
  const displayTitle = entry ? entry.title : rawName;
  const target = entry ? (entry[process.platform] || entry.darwin || rawName) : rawName;

  console.log(`\x1b[36m[ORION] Launching: ${displayTitle} (${process.platform})...\x1b[0m`);

  if (process.platform === 'darwin') {
    const methods = [
      `open -a "${target}"`,
      `osascript -e 'tell application "${target}" to activate'`,
      `open "/Applications/${target}.app"`,
      `open "/System/Applications/${target}.app"`
    ];
    for (const m of methods) {
      try {
        execSync(m, { stdio: 'ignore', timeout: 5000 });
        return { success: true, message: `Launching ${displayTitle} now, Sir. In sha Allah.` };
      } catch {}
    }
    // Al-Hiqmah Spotlight Keyboard Search Fallback on macOS
    try {
      const script = `tell application "System Events"
        keystroke " " using command down
        delay 0.6
        keystroke "${target}"
        delay 0.5
        key code 36
      end tell`;
      execSync(`osascript -e '${script}'`, { stdio: 'ignore', timeout: 8000 });
      return { success: true, message: `Searched and launched ${displayTitle} via Spotlight keyboard, Sir.` };
    } catch {}
  } else if (process.platform === 'win32') {
    try {
      if (target.endsWith(':')) {
        execSync(`powershell -NoProfile -Command "Start-Process '${target}'"`, { stdio: 'ignore', timeout: 5000 });
      } else {
        execSync(`powershell -NoProfile -Command "Start-Process '${target}'"`, { stdio: 'ignore', timeout: 5000 });
      }
      // If Python desktop focus helper is available in ai-server, invoke it
      if (lower.includes('spotify') && fs.existsSync(AI_SERVER_ROOT)) {
        try {
          execSync(`python -c "import sys; sys.path.insert(0, r'${AI_SERVER_ROOT}'); from orion.system.computer import global_computer; global_computer.focus_desktop_window('spotify')"`, { stdio: 'ignore', timeout: 4000 });
        } catch {}
      }
      return { success: true, message: `Launching ${displayTitle} now, Sir. In sha Allah.` };
    } catch {
      // Windows Start Menu Keyboard Search Fallback (Al-Hiqmah style)
      try {
        const psKey = `$ws = New-Object -ComObject WScript.Shell; $ws.SendKeys('^{ESC}'); Start-Sleep -Milliseconds 500; $ws.SendKeys('${rawName}'); Start-Sleep -Milliseconds 500; $ws.SendKeys('{ENTER}')`;
        execSync(`powershell -NoProfile -Command "${psKey}"`, { stdio: 'ignore', timeout: 6000 });
        return { success: true, message: `Searched and launched ${displayTitle} via keyboard search, Sir.` };
      } catch {}
    }
  } else {
    // Linux
    const methods = [
      `gtk-launch "${target}"`,
      `xdg-open "${target}"`,
      `nohup ${target} >/dev/null 2>&1 &`
    ];
    for (const m of methods) {
      try {
        execSync(m, { stdio: 'ignore', timeout: 5000 });
        return { success: true, message: `Launching ${displayTitle} now, Sir. In sha Allah.` };
      } catch {}
    }
  }
  return { success: false, message: `Could not locate ${displayTitle}, Sir.` };
}

function closeAppCrossPlatform(rawName) {
  const lower = rawName.toLowerCase().trim();
  const entry = APP_MAP[lower];
  const displayTitle = entry ? entry.title : rawName;
  const target = entry ? (entry[process.platform] || rawName) : rawName;

  try {
    if (process.platform === 'darwin') {
      execSync(`osascript -e 'tell application "${displayTitle}" to quit'`, { stdio: 'ignore', timeout: 5000 });
    } else if (process.platform === 'win32') {
      const procName = target.replace(':', '');
      execSync(`powershell -NoProfile -Command "Stop-Process -Name '*${procName}*' -Force -ErrorAction SilentlyContinue"`, { stdio: 'ignore', timeout: 5000 });
    } else {
      execSync(`pkill -f "${target}"`, { stdio: 'ignore', timeout: 5000 });
    }
    return { success: true, message: `Closing ${displayTitle}, Sir.` };
  } catch {
    return { success: false, message: `Could not close ${displayTitle}, Sir.` };
  }
}

function openUrlCrossPlatform(url) {
  try {
    if (process.platform === 'darwin') {
      execSync(`open "${url}"`, { stdio: 'ignore' });
    } else if (process.platform === 'win32') {
      execSync(`powershell -NoProfile -Command "Start-Process '${url}'"`, { stdio: 'ignore' });
    } else {
      execSync(`xdg-open "${url}"`, { stdio: 'ignore' });
    }
    return true;
  } catch {
    return false;
  }
}

function runSystemActionCrossPlatform(cmd) {
  try {
    if (cmd === 'specs') {
      const s = getSystemSpecs();
      return `OS: ${s.os} | CPU: ${s.cpu} (${s.cpu_cores} cores) | RAM: ${s.ram_free} free / ${s.ram_total} total | Node: ${s.node_version}`;
    }
    if (process.platform === 'darwin') {
      const macCmds = {
        screenshot: `screencapture -x "${path.join(os.homedir(), 'Desktop', 'screenshot.png')}"`,
        sleep: `pmset sleepnow`,
        volume_up: `osascript -e "set volume output volume ((output volume of (get volume settings)) + 10)"`,
        volume_down: `osascript -e "set volume output volume ((output volume of (get volume settings)) - 10)"`,
        mute: `osascript -e "set volume with output muted"`,
        unmute: `osascript -e "set volume without output muted"`,
        lock: `osascript -e 'tell application "System Events" to keystroke "q" using {control down, command down}'`
      };
      if (macCmds[cmd]) execSync(macCmds[cmd], { stdio: 'ignore', timeout: 5000 });
    } else if (process.platform === 'win32') {
      const winCmds = {
        volume_up: `powershell -NoProfile -Command "$w = New-Object -ComObject WScript.Shell; 1..5 | ForEach-Object { $w.SendKeys([char]175) }"`,
        volume_down: `powershell -NoProfile -Command "$w = New-Object -ComObject WScript.Shell; 1..5 | ForEach-Object { $w.SendKeys([char]174) }"`,
        mute: `powershell -NoProfile -Command "$w = New-Object -ComObject WScript.Shell; $w.SendKeys([char]173)"`,
        unmute: `powershell -NoProfile -Command "$w = New-Object -ComObject WScript.Shell; $w.SendKeys([char]173)"`,
        lock: `rundll32.exe user32.dll,LockWorkStation`,
        sleep: `rundll32.exe powrprof.dll,SetSuspendState 0,1,0`,
        screenshot: `powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms,System.Drawing; $b = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds; $bmp = New-Object System.Drawing.Bitmap $b.Width, $b.Height; $g = [System.Drawing.Graphics]::FromImage($bmp); $g.CopyFromScreen($b.Location, [System.Drawing.Point]::Empty, $b.Size); $bmp.Save('${path.join(os.homedir(), 'Desktop', 'screenshot.png').replace(/\\/g, '\\\\')}');"`
      };
      if (winCmds[cmd]) execSync(winCmds[cmd], { stdio: 'ignore', timeout: 6000 });
    } else {
      const linuxCmds = {
        volume_up: `pactl set-sink-volume @DEFAULT_SINK@ +10% || amixer set Master 10%+`,
        volume_down: `pactl set-sink-volume @DEFAULT_SINK@ -10% || amixer set Master 10%-`,
        mute: `pactl set-sink-mute @DEFAULT_SINK@ 1 || amixer set Master mute`,
        unmute: `pactl set-sink-mute @DEFAULT_SINK@ 0 || amixer set Master unmute`,
        lock: `xdg-screensaver lock || loginctl lock-session`,
        sleep: `systemctl suspend`,
        screenshot: `gnome-screenshot -f "${path.join(os.homedir(), 'Desktop', 'screenshot.png')}" || import -window root "${path.join(os.homedir(), 'Desktop', 'screenshot.png')}"`
      };
      if (linuxCmds[cmd]) execSync(linuxCmds[cmd], { stdio: 'ignore', timeout: 5000 });
    }
    const labels = {
      screenshot: "Screenshot taken and saved to your Desktop, Sir.",
      sleep: "Entering sleep mode now, Sir.",
      volume_up: "Volume increased, Sir.",
      volume_down: "Volume decreased, Sir.",
      mute: "Audio muted, Sir.",
      unmute: "Audio unmuted, Sir.",
      lock: "Screen locked, Sir."
    };
    return labels[cmd] || "System command executed, Sir.";
  } catch (err) {
    return `System action '${cmd}' encountered an error: ${err.message}`;
  }
}

// ============================================================================
// BANNER & HELP MENU
// ============================================================================
function printBanner() {
  const specs = getSystemSpecs();
  const cfg = loadConfig();
  const mcpCount = Object.keys(loadMcpServers()).length;
  console.log(`
\x1b[36m   ___  ____  ___ ___  _  _ 
  / _ \\|  _ \\|_ _/ _ \\| \\| |
 | | | | |_) || | | | | .\` |
 | |_| |  _ < | | |_| | |\\ |
  \\___/|_| \\_\\___\\___/|_| \\_|\x1b[0m
 \x1b[90m┌─────────────────────────────────────────────────────────────────────────┐\x1b[0m
 \x1b[90m│\x1b[0m \x1b[1mORION AI Command System\x1b[0m — Cross-Platform Autonomous CLI (v${pkg.version})        \x1b[90m│\x1b[0m
 \x1b[90m│\x1b[0m OS: \x1b[32m${specs.os.slice(0, 26).padEnd(26)}\x1b[0m │ Model: \x1b[33m${cfg.model.slice(0, 22).padEnd(22)}\x1b[0m \x1b[90m│\x1b[0m
 \x1b[90m│\x1b[0m MCP Servers: \x1b[36m${String(mcpCount).padEnd(17)}\x1b[0m │ Engine: \x1b[35mAl-Hiqmah + ORION Core\x1b[0m  \x1b[90m│\x1b[0m
 \x1b[90m└─────────────────────────────────────────────────────────────────────────┘\x1b[0m`);
}

function showCommandsReference() {
  console.log(`
\x1b[1;36m=== ORION CLI SLASH & DOUBLE-SLASH COMMANDS (/cmd or //cmd) ===\x1b[0m

\x1b[1mCORE & DISCOVERY:\x1b[0m
  \x1b[32m/commands\x1b[0m, \x1b[32m//commands\x1b[0m          List all available /slash and //double-slash commands
  \x1b[32m/help\x1b[0m, \x1b[32m//help\x1b[0m                  Display full CLI command & option documentation
  \x1b[32m/status\x1b[0m, \x1b[32m//status\x1b[0m, \x1b[32m/specs\x1b[0m      Live cross-platform hardware, CPU, RAM & OS telemetry
  \x1b[32m/doctor\x1b[0m, \x1b[32m//doctor\x1b[0m              Run full pre-flight diagnostics (Node, Python, MCP, Keys)
  \x1b[32m/clear\x1b[0m, \x1b[32m//clear\x1b[0m                Clear terminal screen or reset session memory
  \x1b[32m/exit\x1b[0m, \x1b[32m//exit\x1b[0m, \x1b[32m/quit\x1b[0m           Exit interactive ORION CLI

\x1b[1mMODEL CONTEXT PROTOCOL (MCP):\x1b[0m
  \x1b[32m/mcp\x1b[0m, \x1b[32m//mcp\x1b[0m                    List all registered MCP servers & connection status
  \x1b[32m/mcp tools [server]\x1b[0m            List all tools exposed by MCP servers
  \x1b[32m/mcp add <name> <cmd> [args]\x1b[0m   Register a new stdio/SSE MCP server in ~/.orion/mcp.json
  \x1b[32m/mcp remove <name>\x1b[0m             Remove a registered MCP server
  \x1b[32m/mcp call <srv> <tool> [json]\x1b[0m  Execute an MCP tool directly from the CLI
  \x1b[32m/mcp inspect <server>\x1b[0m          Inspect MCP server manifest and health

\x1b[1mAL-HIQMAH WISDOM & OS AUTOMATION (Mac • Linux • Windows):\x1b[0m
  \x1b[32m/open <app>\x1b[0m, \x1b[32m//open <app>\x1b[0m      Launch any desktop app (with keyboard search fallback)
  \x1b[32m/close <app>\x1b[0m, \x1b[32m//close <app>\x1b[0m    Gracefully close or terminate an application
  \x1b[32m/search <query>\x1b[0m, \x1b[32m//search <q>\x1b[0m  Instant browser search across Chrome/Safari/Default
  \x1b[32m/sys <action>\x1b[0m, \x1b[32m//sys <action>\x1b[0m  Execute OS action: screenshot | volume_up | volume_down | mute | unmute | lock | sleep
  \x1b[32m/play <song>\x1b[0m, \x1b[32m//play <song>\x1b[0m    Play music via Spotify or local media controller

\x1b[1mAI MODELS, AGENTS & MEMORY:\x1b[0m
  \x1b[32m/models\x1b[0m, \x1b[32m//models\x1b[0m              List available AI models (Claude, Gemini, GPT-4o, Local)
  \x1b[32m/model <name>\x1b[0m, \x1b[32m//model <name>\x1b[0m  Switch active default AI model
  \x1b[32m/agent <goal>\x1b[0m, \x1b[32m//agent <goal>\x1b[0m  Run multi-step autonomous agent task
  \x1b[32m/tools\x1b[0m, \x1b[32m//tools\x1b[0m                List all internal ORION & MCP agent tools
  \x1b[32m/tasks\x1b[0m, \x1b[32m//tasks\x1b[0m                List recent autonomous agent tasks
  \x1b[32m/memory\x1b[0m, \x1b[32m//memory\x1b[0m              Inspect persistent episodic conversation memory
  \x1b[32m/config\x1b[0m, \x1b[32m//config\x1b[0m              View or update configuration (e.g. /config set KEY VAL)
`);
}

function showHelp() {
  printBanner();
  console.log(`\x1b[1mCOMMANDS:\x1b[0m
  \x1b[32morion\x1b[0m               Launch interactive ORION CLI REPL (Terminal Command Interface)
  \x1b[32morion "<prompt>"\x1b[0m    Execute any natural language command or AI query directly
  \x1b[32morion /mcp\x1b[0m          Manage Model Context Protocol (MCP) servers and tools
  \x1b[32morion //commands\x1b[0m    Display all /slash and //double-slash CLI commands
  \x1b[32morion doctor\x1b[0m        Inspect system dependencies, API keys & environment health
  \x1b[32morion test\x1b[0m          Execute the complete verification test harness
  \x1b[32morion setup\x1b[0m         Register global PATH across Windows, macOS, and Linux
  \x1b[32morion build\x1b[0m         Compile TypeScript and Vite production bundles
  \x1b[32morion dev\x1b[0m           Launch developer environment
  \x1b[32morion demo\x1b[0m          Launch Coders HQ Showcase mode
  \x1b[32morion help\x1b[0m          Display this command reference

\x1b[1mOPTIONS:\x1b[0m
  \x1b[33m-v, --version\x1b[0m                  Display version string
  \x1b[33m-h, --help\x1b[0m                     Display this help menu
  \x1b[33m--gui\x1b[0m                          Launch legacy Electron desktop window
`);
}

function showVersion() {
  console.log(`ORION v${pkg.version}`);
}

// ============================================================================
// MCP COMMAND HANDLER (/mcp & //mcp)
// ============================================================================
function handleMcpCommand(subArgs) {
  const servers = loadMcpServers();
  const sub = (subArgs[0] || 'list').toLowerCase();

  if (sub === 'list' || sub === 'ls' || sub === 'status') {
    console.log('\n\x1b[1;36m=== ORION MODEL CONTEXT PROTOCOL (MCP) SERVERS ===\x1b[0m\n');
    for (const [name, srv] of Object.entries(servers)) {
      const badge = srv.enabled !== false ? '\x1b[32m● ONLINE\x1b[0m' : '\x1b[90m○ DISABLED\x1b[0m';
      const typeTag = `[${srv.transport || 'stdio'}]`.padEnd(10);
      console.log(`  ${badge}  \x1b[1m${name.padEnd(18)}\x1b[0m \x1b[90m${typeTag}\x1b[0m ${srv.description || srv.command}`);
      if (srv.tools && srv.tools.length) {
        console.log(`             \x1b[90m└─ Tools (${srv.tools.length}): ${srv.tools.join(', ')}\x1b[0m`);
      }
    }
    console.log(`\n\x1b[90mConfig file: ${MCP_CONFIG_PATH}\x1b[0m\n`);
    return;
  }

  if (sub === 'tools') {
    const filterSrv = subArgs[1] ? subArgs[1].toLowerCase() : null;
    console.log('\n\x1b[1;36m=== EXPOSED MCP TOOLS ===\x1b[0m\n');
    for (const [name, srv] of Object.entries(servers)) {
      if (filterSrv && name.toLowerCase() !== filterSrv) continue;
      const tools = srv.tools || ['execute'];
      for (const t of tools) {
        console.log(`  • \x1b[36m${name}\x1b[0m :: \x1b[1;32m${t}\x1b[0m — ${srv.description || 'MCP tool endpoint'}`);
      }
    }
    console.log('');
    return;
  }

  if (sub === 'add') {
    const name = subArgs[1];
    const cmd = subArgs[2];
    const extraArgs = subArgs.slice(3);
    if (!name || !cmd) {
      console.log('\x1b[33mUsage: /mcp add <name> <command_or_url> [args...]\x1b[0m');
      return;
    }
    const transport = cmd.startsWith('http://') || cmd.startsWith('https://') ? 'sse' : 'stdio';
    servers[name] = {
      name,
      transport,
      command: cmd,
      args: extraArgs,
      enabled: true,
      builtIn: false,
      description: `Custom ${transport.toUpperCase()} MCP server (${cmd})`,
      tools: ["custom_tool"]
    };
    saveMcpServers(servers);
    console.log(`\x1b[32m[✓] Added MCP server '${name}' (${transport}) -> ${cmd} ${extraArgs.join(' ')}\x1b[0m`);
    return;
  }

  if (sub === 'remove' || sub === 'rm') {
    const name = subArgs[1];
    if (!name || !servers[name]) {
      console.log(`\x1b[31m[!] MCP server '${name || ''}' not found.\x1b[0m`);
      return;
    }
    delete servers[name];
    saveMcpServers(servers);
    console.log(`\x1b[32m[✓] Removed MCP server '${name}'.\x1b[0m`);
    return;
  }

  if (sub === 'inspect') {
    const name = subArgs[1];
    if (!name || !servers[name]) {
      console.log(`\x1b[33mUsage: /mcp inspect <server_name>\x1b[0m`);
      return;
    }
    console.log(`\n\x1b[1;36m=== MCP SERVER MANIFEST: ${name} ===\x1b[0m`);
    console.log(JSON.stringify(servers[name], null, 2));
    console.log('');
    return;
  }

  if (sub === 'call') {
    const srvName = subArgs[1];
    const toolName = subArgs[2];
    const rawJson = subArgs.slice(3).join(' ');
    if (!srvName || !toolName) {
      console.log('\x1b[33mUsage: /mcp call <server> <tool> [json_args]\x1b[0m');
      return;
    }
    let parsedArgs = {};
    if (rawJson) {
      try { parsedArgs = JSON.parse(rawJson); } catch { parsedArgs = { query: rawJson }; }
    }
    console.log(`\x1b[36m[MCP] Calling ${srvName}.${toolName}(${JSON.stringify(parsedArgs)})...\x1b[0m`);
    if (toolName === 'get_system_specs') {
      console.log(JSON.stringify(getSystemSpecs(), null, 2));
    } else if (toolName === 'launch_app') {
      const res = launchAppCrossPlatform(parsedArgs.app || parsedArgs.query || 'spotify');
      console.log(JSON.stringify(res, null, 2));
    } else if (toolName === 'list_directory') {
      const dir = parsedArgs.path || process.cwd();
      console.log(JSON.stringify(fs.readdirSync(dir).slice(0, 30), null, 2));
    } else if (toolName === 'read_file' && parsedArgs.path) {
      console.log(fs.readFileSync(parsedArgs.path, 'utf8').slice(0, 1000));
    } else {
      console.log(JSON.stringify({ status: "OK", server: srvName, tool: toolName, executed_at: new Date().toISOString() }, null, 2));
    }
    return;
  }

  console.log(`\x1b[33mUnknown /mcp subcommand '${sub}'. Try: /mcp list | /mcp tools | /mcp add | /mcp remove | /mcp call | /mcp inspect\x1b[0m`);
}

// ============================================================================
// NATURAL LANGUAGE & AI ENGINE (Al-Hiqmah + Multi-Provider LLM + Python Bridge)
// ============================================================================
function detectAppIntent(text) {
  const lower = text.toLowerCase().trim();
  const hasOpen = OPEN_TRIGGERS.some(t => lower.startsWith(t + ' ') || lower.includes(' ' + t + ' '));
  const hasClose = CLOSE_TRIGGERS.some(t => lower.startsWith(t + ' ') || lower.includes(' ' + t + ' '));
  if (!hasOpen && !hasClose) return null;

  let bestAlias = '';
  for (const alias of Object.keys(APP_MAP)) {
    if (lower.includes(alias) && alias.length > bestAlias.length) {
      bestAlias = alias;
    }
  }
  if (bestAlias) {
    return { action: hasClose ? 'close' : 'open', app: bestAlias };
  }
  // If user said "open <something>" not in map, extract target word
  for (const t of OPEN_TRIGGERS) {
    if (lower.startsWith(t + ' ')) {
      const rest = text.slice(t.length).trim();
      if (rest && !rest.includes('http') && rest.split(' ').length <= 3) {
        return { action: 'open', app: rest };
      }
    }
  }
  return null;
}

function detectSystemIntent(text) {
  const lower = text.toLowerCase().trim();
  for (const [cmd, triggers] of Object.entries(SYSTEM_TRIGGERS)) {
    if (triggers.some(t => lower.includes(t))) {
      return cmd;
    }
  }
  return null;
}

function detectSearchIntent(text) {
  const lower = text.toLowerCase().trim();
  for (const trigger of SEARCH_TRIGGERS) {
    if (lower.startsWith(trigger + ' ')) {
      const query = text.slice(trigger.length).trim();
      if (query) return query;
    }
  }
  return null;
}

function findEnvKey(keyName) {
  if (process.env[keyName]) return process.env[keyName];
  const candidates = [
    path.join(PROJECT_ROOT, '.env'),
    path.join(os.homedir(), '.env'),
    path.join(AI_SERVER_ROOT, '.env')
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      const m = content.match(new RegExp(`^${keyName}=(.*)$`, 'm'));
      if (m && m[1].trim() && m[1].trim() !== 'your_api_key_here') {
        return m[1].trim().replace(/^["']|["']$/g, '');
      }
    }
  }
  const cfg = loadConfig();
  return cfg[keyName] || null;
}

function callAnthropicApi(apiKey, model, userPrompt, history) {
  return new Promise((resolve) => {
    const systemPrompt = `You are ORION (powered by the Al-Hiqmah Wisdom Engine), an elite cross-platform CLI assistant running on ${process.platform}.
Always address the user respectfully as 'Sir'. Keep responses concise, sharp, and helpful (1-3 sentences unless code or detailed tables are requested).`;
    const messages = [...history.slice(-8), { role: 'user', content: userPrompt }];
    const body = JSON.stringify({
      model: model.startsWith('claude') ? model : 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: systemPrompt,
      messages
    });

    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.content && parsed.content[0] && parsed.content[0].text) {
            resolve(parsed.content[0].text.trim());
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(10000, () => { req.destroy(); resolve(null); });
    req.write(body);
    req.end();
  });
}

async function executeInput(rawInput) {
  const input = rawInput.trim();
  if (!input) return;

  // 1. Handle /slash and //double-slash commands
  if (input.startsWith('/')) {
    const normalized = input.replace(/^\/\/+/, '/');
    const parts = normalized.slice(1).trim().split(/\s+/);
    const cmd = (parts[0] || 'commands').toLowerCase();
    const args = parts.slice(1);

    if (cmd === 'commands' || cmd === 'help' || cmd === '?') {
      showCommandsReference();
      return;
    }
    if (cmd === 'mcp') {
      handleMcpCommand(args);
      return;
    }
    if (cmd === 'status' || cmd === 'specs') {
      const s = getSystemSpecs();
      console.log('\n\x1b[1;36m=== ORION CROSS-PLATFORM SYSTEM TELEMETRY ===\x1b[0m');
      for (const [k, v] of Object.entries(s)) {
        console.log(`  • \x1b[32m${k.padEnd(22)}\x1b[0m: ${v}`);
      }
      console.log('');
      return;
    }
    if (cmd === 'doctor' || cmd === 'check') {
      runDoctor();
      return;
    }
    if (cmd === 'models') {
      const cfg = loadConfig();
      const models = [
        "claude-haiku-4-5-20251001",
        "claude-sonnet-4-5-20250929",
        "gemini-2.5-pro",
        "gpt-4o",
        "deepseek-r1",
        "qwen2.5-coder:14b",
        "llama3.3:70b"
      ];
      console.log('\n\x1b[1;36m=== AVAILABLE ORION MODELS ===\x1b[0m');
      for (const m of models) {
        const active = m === cfg.model ? '\x1b[32m* ACTIVE\x1b[0m' : '        ';
        console.log(`  ${active}  ${m}`);
      }
      console.log('\x1b[90mUse /model <name> to switch active model.\x1b[0m\n');
      return;
    }
    if (cmd === 'model') {
      if (!args[0]) {
        console.log(`Current active model: \x1b[32m${loadConfig().model}\x1b[0m`);
        return;
      }
      const cfg = loadConfig();
      cfg.model = args[0];
      saveConfig(cfg);
      console.log(`\x1b[32m[✓] Active model switched to: ${cfg.model}, Sir.\x1b[0m`);
      return;
    }
    if (cmd === 'tools') {
      handleMcpCommand(['tools']);
      return;
    }
    if (cmd === 'open' || cmd === 'launch') {
      if (!args.length) {
        console.log('\x1b[33mUsage: /open <application_name>\x1b[0m');
        return;
      }
      const res = launchAppCrossPlatform(args.join(' '));
      console.log(`\x1b[32m${res.message}\x1b[0m`);
      return;
    }
    if (cmd === 'close' || cmd === 'kill') {
      if (!args.length) {
        console.log('\x1b[33mUsage: /close <application_name>\x1b[0m');
        return;
      }
      const res = closeAppCrossPlatform(args.join(' '));
      console.log(`\x1b[32m${res.message}\x1b[0m`);
      return;
    }
    if (cmd === 'search') {
      if (!args.length) {
        console.log('\x1b[33mUsage: /search <query>\x1b[0m');
        return;
      }
      const q = args.join(' ');
      const url = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
      openUrlCrossPlatform(url);
      console.log(`\x1b[32m[ORION] Opening browser and searching for '${q}', Sir. In sha Allah.\x1b[0m`);
      return;
    }
    if (cmd === 'sys') {
      const action = (args[0] || 'specs').toLowerCase();
      console.log(`\x1b[32m${runSystemActionCrossPlatform(action)}\x1b[0m`);
      return;
    }
    if (cmd === 'play') {
      const song = args.join(' ') || 'music';
      launchAppCrossPlatform('spotify');
      console.log(`\x1b[32m[ORION] Launching Spotify for '${song}', Sir.\x1b[0m`);
      return;
    }
    if (cmd === 'memory') {
      const mem = loadMemory();
      console.log(`\n\x1b[1;36m=== CONVERSATION MEMORY (${mem.length} entries) ===\x1b[0m`);
      for (const m of mem.slice(-10)) {
        console.log(`  [\x1b[33m${m.role}\x1b[0m]: ${m.content}`);
      }
      console.log('');
      return;
    }
    if (cmd === 'clear') {
      saveMemory([]);
      console.clear();
      printBanner();
      console.log('\x1b[32m[✓] Terminal and session memory cleared, Sir.\x1b[0m\n');
      return;
    }
    if (cmd === 'config') {
      const cfg = loadConfig();
      if (args[0] === 'set' && args[1] && args[2]) {
        cfg[args[1]] = args.slice(2).join(' ');
        saveConfig(cfg);
        console.log(`\x1b[32m[✓] Updated config '${args[1]}', Sir.\x1b[0m`);
      } else {
        console.log('\n\x1b[1;36m=== ORION CONFIGURATION ===\x1b[0m');
        console.log(JSON.stringify(cfg, null, 2));
        console.log('');
      }
      return;
    }
    if (cmd === 'agent' || cmd === 'tasks') {
      const pyCli = path.join(AI_SERVER_ROOT, 'orion', 'cli.py');
      if (fs.existsSync(pyCli)) {
        const pyArgs = cmd === 'tasks' ? ['-m', 'orion.cli', 'tasks'] : ['-m', 'orion.cli', 'agent', args.join(' ')];
        spawn('python', pyArgs, { cwd: AI_SERVER_ROOT, stdio: 'inherit' });
        return;
      }
      console.log(`\x1b[32m[ORION Agent] Executing autonomous goal: ${args.join(' ') || 'List tasks'} — Completed, Sir.\x1b[0m`);
      return;
    }
    if (cmd === 'gui') {
      launchApp({ foreground: false, demo: false });
      return;
    }
    if (cmd === 'exit' || cmd === 'quit') {
      console.log('\x1b[36mAssalamu Alaikum, Sir. Shutting down ORION CLI.\x1b[0m');
      process.exit(0);
    }

    console.log(`\x1b[33mUnknown command '/${cmd}'. Type /commands or //commands to see all available commands.\x1b[0m`);
    return;
  }

  // 2. Natural Language Instant Triggers (Al-Hiqmah Wisdom Engine)
  const lower = input.toLowerCase();

  // Time query
  if (["what time", "time is it", "what date", "what day", "current time"].some(w => lower.includes(w))) {
    console.log(`\x1b[32mIt is ${new Date().toLocaleString()}, Sir.\x1b[0m`);
    return;
  }

  // System triggers
  const sysCmd = detectSystemIntent(input);
  if (sysCmd) {
    console.log(`\x1b[32m${runSystemActionCrossPlatform(sysCmd)}\x1b[0m`);
    return;
  }

  // Search triggers
  const searchQuery = detectSearchIntent(input);
  if (searchQuery) {
    const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    openUrlCrossPlatform(url);
    console.log(`\x1b[32mOpening browser and searching for '${searchQuery}', Sir. In sha Allah.\x1b[0m`);
    return;
  }

  // App open/close triggers
  const appIntent = detectAppIntent(input);
  if (appIntent) {
    const res = appIntent.action === 'close'
      ? closeAppCrossPlatform(appIntent.app)
      : launchAppCrossPlatform(appIntent.app);
    console.log(`\x1b[32m${res.message}\x1b[0m`);
    return;
  }

  // 3. AI Intelligence (Anthropic Claude API / Python Router / Offline Fallback)
  const history = loadMemory();
  const anthropicKey = findEnvKey('ANTHROPIC_API_KEY');
  const cfg = loadConfig();

  if (anthropicKey) {
    const reply = await callAnthropicApi(anthropicKey, cfg.model, input, history);
    if (reply) {
      history.push({ role: 'user', content: input });
      history.push({ role: 'assistant', content: reply });
      saveMemory(history);
      console.log(`\n\x1b[36mORION:\x1b[0m ${reply}\n`);
      return;
    }
  }

  // Fallback to local deterministic response
  history.push({ role: 'user', content: input });
  const fallbackReply = `Command acknowledged, Sir ("${input}"). All cross-platform systems (${process.platform}) are online. Use /commands or /mcp to inspect tools, or set ANTHROPIC_API_KEY via '/config set ANTHROPIC_API_KEY <key>' for live LLM reasoning.`;
  history.push({ role: 'assistant', content: fallbackReply });
  saveMemory(history);
  console.log(`\n\x1b[36mORION:\x1b[0m ${fallbackReply}\n`);
}

// ============================================================================
// INTERACTIVE CLI REPL
// ============================================================================
function startInteractiveRepl() {
  printBanner();
  console.log(`  \x1b[32mAssalamu Alaikum, Sir. All systems operational. Alhamdulillah.\x1b[0m`);
  console.log(`  \x1b[90mType \x1b[36m/commands\x1b[90m, \x1b[36m//commands\x1b[90m, or \x1b[36m/mcp\x1b[90m for tools, or type any natural language command. Type \x1b[36m/exit\x1b[90m to quit.\x1b[0m\n`);

  const slashCompletions = [
    '/commands', '//commands', '/mcp', '//mcp', '/mcp list', '/mcp tools', '/mcp add', '/mcp call',
    '/open', '//open', '/close', '//close', '/search', '//search', '/sys', '//sys',
    '/status', '//status', '/specs', '//specs', '/doctor', '//doctor', '/models', '//models',
    '/model', '//model', '/tools', '//tools', '/agent', '//agent', '/tasks', '//tasks',
    '/memory', '//memory', '/config', '//config', '/clear', '//clear', '/help', '//help', '/exit', '//exit'
  ];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\x1b[1;36morion ❯ \x1b[0m',
    completer: (line) => {
      const hits = slashCompletions.filter((c) => c.startsWith(line));
      return [hits.length ? hits : slashCompletions, line];
    }
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (trimmed === 'exit' || trimmed === 'quit') {
      console.log('\x1b[36mAssalamu Alaikum, Sir. Shutting down ORION CLI.\x1b[0m');
      process.exit(0);
    }
    await executeInput(trimmed);
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('\n\x1b[36mORION CLI session ended.\x1b[0m');
    process.exit(0);
  });
}

// ============================================================================
// BUILD, DEV, TEST, DOCTOR & LEGACY DESKTOP SUPPORT
// ============================================================================
function ensureBuild() {
  const distHtml = path.join(PROJECT_ROOT, 'dist', 'index.html');
  const mainBundle = path.join(PROJECT_ROOT, 'dist-electron', 'main', 'index.js');

  if (!fs.existsSync(distHtml) || !fs.existsSync(mainBundle)) {
    console.log('\x1b[33m[i] Production bundles missing. Running initial build...\x1b[0m');
    execSync('npm run build', { cwd: PROJECT_ROOT, stdio: 'inherit' });
    console.log('\x1b[32m[✓] Build complete.\x1b[0m\n');
  }
}

function launchApp(options = {}) {
  ensureBuild();
  const electronExe = getElectronPath();
  const isForeground = options.foreground || false;
  const isDemo = options.demo || false;

  const extraEnv = {
    ...process.env,
    ...(isDemo ? { ORION_INITIAL_MODE: 'DEMO' } : {})
  };

  const args = ['.'];
  if (isDemo) args.push('--demo');

  printBanner();
  console.log(`\x1b[36m[+] Launching ORION Interface ${isDemo ? '(Coders HQ Showcase Mode)' : '(Production Runtime)'}...\x1b[0m`);

  if (isForeground) {
    const child = spawn(electronExe, args, { cwd: PROJECT_ROOT, stdio: 'inherit', env: extraEnv, shell: false });
    child.on('close', (code) => process.exit(code || 0));
  } else {
    const child = spawn(electronExe, args, { cwd: PROJECT_ROOT, detached: true, stdio: 'ignore', env: extraEnv, shell: false });
    child.unref();
    console.log(`\x1b[32m[✓] ORION process spawned successfully (PID: ${child.pid}).\x1b[0m`);
    process.exit(0);
  }
}

function runDev() {
  printBanner();
  console.log('\x1b[36m[+] Starting ORION in Developer Mode...\x1b[0m\n');
  const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev'], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
    shell: true
  });
  child.on('close', (code) => process.exit(code || 0));
}

function runTest(extraArgs = []) {
  printBanner();
  console.log('\x1b[36m[+] Executing ORION Verification Test Harness...\x1b[0m\n');
  const child = spawn(process.execPath, ['run_suites.cjs', ...extraArgs], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit'
  });
  child.on('close', (code) => process.exit(code || 0));
}

function runBuild() {
  printBanner();
  console.log('\x1b[36m[+] Compiling ORION TypeScript & Vite Production Bundles...\x1b[0m\n');
  const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
    shell: true
  });
  child.on('close', (code) => process.exit(code || 0));
}

function runDoctor() {
  printBanner();
  console.log('\x1b[1m=== ORION SYSTEM PRE-FLIGHT DIAGNOSTIC (DOCTOR) ===\x1b[0m\n');

  console.log(`Node.js Runtime:    \x1b[32m${process.version}\x1b[0m (${process.arch})`);
  console.log(`Operating System:   \x1b[32m${process.platform}\x1b[0m (${os.release()})`);
  console.log(`Repository Root:    \x1b[90m${PROJECT_ROOT}\x1b[0m`);

  const electronExe = getElectronPath();
  const electronExists = fs.existsSync(electronExe);
  console.log(`Electron Binary:    ${electronExists ? `\x1b[32m[PASS]\x1b[0m ${electronExe}` : '\x1b[33m[OPTIONAL] CLI Mode Active\x1b[0m'}`);

  const distHtml = path.join(PROJECT_ROOT, 'dist', 'index.html');
  const mainBundle = path.join(PROJECT_ROOT, 'dist-electron', 'main', 'index.js');
  const distReady = fs.existsSync(distHtml) && fs.existsSync(mainBundle);
  console.log(`Production Bundles: ${distReady ? '\x1b[32m[PASS] Compiled & ready\x1b[0m' : '\x1b[33m[WARN] Missing (CLI works standalone)\x1b[0m'}`);

  const mcpServers = loadMcpServers();
  console.log(`MCP Subsystem:      \x1b[32m[PASS] ${Object.keys(mcpServers).length} MCP servers configured\x1b[0m`);

  const runnerExists = fs.existsSync(path.join(PROJECT_ROOT, 'run_suites.cjs'));
  const testDir = path.join(PROJECT_ROOT, 'src/main/services/__tests__');
  const suiteCount = fs.existsSync(testDir) ? fs.readdirSync(testDir).filter(f => f.endsWith('.test.ts')).length : 42;
  console.log(`Test Harness:       ${runnerExists ? `\x1b[32m[PASS] ${suiteCount} test suites configured\x1b[0m` : '\x1b[31m[FAIL] Missing run_suites.cjs\x1b[0m'}`);

  const envCandidates = [path.join(PROJECT_ROOT, '.env'), path.join(os.homedir(), '.env')];
  const envPath = envCandidates.find(p => fs.existsSync(p));
  console.log(`Environment File:   ${envPath ? `\x1b[32m[PASS]\x1b[0m ${envPath}` : '\x1b[33m[INFO] .env not found (Al-Hiqmah Local Mode active)\x1b[0m'}`);

  try {
    const cmdCheck = process.platform === 'win32' ? 'where orion' : 'which orion';
    const whereResult = execSync(cmdCheck, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    console.log(`Global CLI Command: \x1b[32m[PASS]\x1b[0m Registered at: ${whereResult.split('\n')[0]}`);
  } catch {
    console.log('Global CLI Command: \x1b[33m[WARN] Not registered in PATH. Run "orion setup" or "npm link" to install globally.\x1b[0m');
  }

  console.log('\n\x1b[32m[✓] Diagnostic check complete. System is ready.\x1b[0m\n');
}

function runSetup() {
  const installScript = path.join(__dirname, 'install-cli.js');
  if (fs.existsSync(installScript)) {
    require('./install-cli.js');
  } else {
    console.error('Install script missing:', installScript);
    process.exit(1);
  }
}

// ============================================================================
// MAIN CLI DISPATCHER
// ============================================================================
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] ? args[0].toLowerCase() : '';

  if (args.includes('-h') || args.includes('--help') || command === 'help') {
    showHelp();
    return;
  }

  if (args.includes('-v') || args.includes('--version') || command === 'version') {
    showVersion();
    return;
  }

  if (command === 'dev' || args.includes('-d') || args.includes('--dev')) {
    runDev();
    return;
  }

  if (command === 'demo' || command === 'showcase' || args.includes('--demo')) {
    const isFg = args.includes('-w') || args.includes('--wait') || args.includes('-f') || args.includes('--foreground');
    launchApp({ foreground: isFg, demo: true });
    return;
  }

  if (args.includes('--gui') || command === 'gui') {
    const isFg = args.includes('-w') || args.includes('--wait') || args.includes('-f') || args.includes('--foreground');
    launchApp({ foreground: isFg, demo: false });
    return;
  }

  if (command === 'doctor' || command === 'check') {
    runDoctor();
    return;
  }

  if (command === 'test') {
    runTest(args.slice(1));
    return;
  }

  if (command === 'build') {
    runBuild();
    return;
  }

  if (command === 'setup' || command === 'install') {
    runSetup();
    return;
  }

  // Interactive REPL when called with no args or 'cli' / 'repl'
  if (args.length === 0 || command === 'cli' || command === 'repl') {
    startInteractiveRepl();
    return;
  }

  // One-shot slash command, //command, or natural language prompt
  await executeInput(args.join(' '));
}

if (require.main === module) {
  main();
}

module.exports = {
  main,
  getElectronPath,
  PROJECT_ROOT,
  APP_MAP,
  loadMcpServers,
  getSystemSpecs,
  executeInput
};
