#!/usr/bin/env node

/**
 * ORION AI Command System — Terminal-Native CLI Entry Point
 * Connects directly to the authoritative TypeScript ORION Core Engine
 * (OrionOrchestrator, OrionAIProviderRouter, ToolService, McpClientService,
 *  ActionRiskEvaluator, ComputerPermissionService, ProcessSupervisor).
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const Module = require('module');
const { spawn, execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
process.env.ORION_INSTALL_ROOT = PROJECT_ROOT;

// Ensure installed release node_modules are always resolvable regardless of user's current working directory
const INSTALL_NODE_MODULES = path.join(PROJECT_ROOT, 'node_modules');
if (fs.existsSync(INSTALL_NODE_MODULES)) {
  const existingNodePath = process.env.NODE_PATH ? process.env.NODE_PATH.split(path.delimiter) : [];
  if (!existingNodePath.includes(INSTALL_NODE_MODULES)) {
    process.env.NODE_PATH = [INSTALL_NODE_MODULES, ...existingNodePath].filter(Boolean).join(path.delimiter);
    if (typeof Module._initPaths === 'function') {
      Module._initPaths();
    }
  }
}

const PKG_PATH = path.join(PROJECT_ROOT, 'package.json');
const pkg = fs.existsSync(PKG_PATH) ? JSON.parse(fs.readFileSync(PKG_PATH, 'utf8')) : { version: '1.0.0' };

function assertHealthyInstallationOrExit() {
  const required = [
    path.join(PROJECT_ROOT, 'package.json'),
    path.join(PROJECT_ROOT, 'src', 'cli', 'OrionCliApp.ts'),
    path.join(PROJECT_ROOT, 'src', 'cli', 'OrionCliKernel.ts'),
    path.join(PROJECT_ROOT, 'node_modules', 'typescript', 'package.json')
  ];
  const missing = required.filter(p => !fs.existsSync(p));
  if (missing.length > 0) {
    console.error('[ORION] Installation is incomplete or corrupted.');
    console.error(`  Install root : ${PROJECT_ROOT}`);
    console.error(`  Missing      : ${missing.map(m => path.relative(PROJECT_ROOT, m)).join(', ')}`);
    console.error('  Recovery     : Run "orion upgrade --rollback" to restore the previous release,');
    console.error('                 or run "npm install && npm run install:cli" from the ORION package.');
    process.exit(1);
  }
}

let tsRuntimeRegistered = false;

function registerTsRuntime() {
  if (tsRuntimeRegistered) return;
  assertHealthyInstallationOrExit();
  const ts = require('typescript');

  const origResolve = Module._resolveFilename;
  Module._resolveFilename = function (request, parent, isMain, options) {
    try {
      return origResolve.call(this, request, parent, isMain, options);
    } catch (err) {
      if (request.endsWith('.js')) {
        const tsRequest = request.slice(0, -3) + '.ts';
        try {
          return origResolve.call(this, tsRequest, parent, isMain, options);
        } catch {}
        const tsxRequest = request.slice(0, -3) + '.tsx';
        try {
          return origResolve.call(this, tsxRequest, parent, isMain, options);
        } catch {}
      } else if (!path.extname(request) && request.startsWith('.')) {
        try {
          return origResolve.call(this, request + '.tsx', parent, isMain, options);
        } catch {}
      }
      throw err;
    }
  };

  function compileTsModule(m, filename) {
    const content = fs.readFileSync(filename, 'utf8');
    const compiled = ts.transpileModule(content, {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true
      }
    });
    return m._compile(compiled.outputText, filename);
  }

  require.extensions['.ts'] = compileTsModule;
  require.extensions['.tsx'] = compileTsModule;

  tsRuntimeRegistered = true;
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

function showVersion() {
  console.log(`ORION v${pkg.version} — Sovereign AI Operating Layer`);
}

function showHelp() {
  console.log(`
ORION v${pkg.version} — Terminal-Native AI Command Environment

USAGE:
  orion                        Start interactive terminal session (REPL)
  orion "<request>"            Execute a natural-language task or query non-interactively
  orion /<command>             Execute a structured slash command (or //<command>)
  orion [subcommand] [flags]

COMMANDS:
  orion                        Launch interactive ORION terminal environment
  orion upgrade                Check, verify (SHA-256), safely install, and launch the latest stable ORION release
  orion upgrade --check        Check whether a newer stable ORION release is available without installing
  orion upgrade --rollback     Roll back safely to the previous verified ORION release
  orion doctor                 Inspect system dependencies, protected policies, local models, tools & health
  orion test                   Execute the verification test harness
  orion build                  Compile TypeScript and Vite production bundles
  orion setup                  Install standalone ORION release & register global CLI in system PATH
  orion dev                    Launch Vite + Electron development environment
  orion demo                   Launch interactive demonstration environment
  orion help                   Display this command reference

INTERACTIVE & SLASH COMMANDS (/cmd or //cmd):
  /help, /commands             List all interactive commands and usage
  /status, /specs              Live hardware, provider router, tool, and task telemetry
  /agents, /agent <name>       Inspect or switch specialized ORION multi-agents (core, engineer, research, operator, vision, auditor)
  /providers                   Inspect all 13 AI provider adapters, health, and routing strategy
  /models                      List registered models (including 6 local Ollama models) and switch active model
  /tools                       List all 38+ authoritative tools registered in ToolRegistry
  /permissions                 Inspect 4-tier risk policy, protected boundaries, and E-Stop
  /approve, /deny, /stop       Manage pending high-risk tool approvals or trigger immediate E-Stop
  /memory, /context, /history  Inspect unified memory, context token budgets, and conversation turn history
  /tasks, /resume              Inspect supervised tasks, execution traces, and resume persisted workflows
  /config, /doctor, /bench     Inspect/update configuration, run pre-flight health checks, or benchmark local models
  /privacy                     Inspect data locality, secret redaction, and local-only inference guarantees
  /api [start|stop|status]     Manage the OpenAI-compatible Local API server (127.0.0.1:11435)
  /hackathon                   Run the UAE Zero-Bureaucracy (NETWORK • REASON • IMPACT) workflow
  /mcp                         Inspect configured MCP servers, connect, and invoke MCP tools
  /search <query>              Execute in-process HTTP search without opening a browser
  /repo [path]                 Inspect repository structure and languages
  /find <pattern>              Search source code across the repository
  /vivid, /animations          Switch visual mode (vivid | minimal) or toggle decorative animations
  /tip                         Cycle to the next curated ORION workflow tip (also Alt+T on Home)
  /clear                       Clear session conversation context
  /exit                        Cleanly shut down services and exit

OPTIONS:
  -v, --version                Display version string
  -h, --help                   Display this help menu
  --json                       Output structured JSON for scripts and automation
  --no-color                   Disable ANSI terminal colors
  --yes                        Approve high-risk non-critical tool actions in non-interactive mode
  --gui                        Launch legacy Electron desktop window
`);
}

function runDoctor() {
  registerTsRuntime();
  const { OrionCliKernel } = require(path.join(PROJECT_ROOT, 'src', 'cli', 'OrionCliKernel.ts'));
  const {
    resolvePublicEngineIdentity,
    formatLogicalPath
  } = require(path.join(PROJECT_ROOT, 'src', 'shared', 'branding', 'OrionEngineIdentity.ts'));
  const kernel = new OrionCliKernel({ projectRoot: process.cwd() });

  try {
    console.log('\n=== ORION SYSTEM PRE-FLIGHT DIAGNOSTIC (DOCTOR) ===\n');
    console.log(`Node.js Runtime:    ${process.version} (${process.arch})`);
    console.log(`Operating System:   ${process.platform} (${os.release()})`);
    console.log(`Install Root:       ${formatLogicalPath(PROJECT_ROOT)}`);
    console.log(`Workspace Root:     ${formatLogicalPath(process.cwd(), process.cwd())}`);
    console.log(`Kernel Init Time:   ${kernel.getInitDurationMs()}ms`);

    const electronExe = getElectronPath();
    const electronExists = fs.existsSync(electronExe);
    console.log(
      `Electron Binary:    ${electronExists ? `[PASS] ${formatLogicalPath(electronExe, PROJECT_ROOT)}` : '[OPTIONAL] CLI Mode Active'}`
    );

    const distHtml = path.join(PROJECT_ROOT, 'dist', 'index.html');
    const mainBundle = path.join(PROJECT_ROOT, 'dist-electron', 'main', 'index.js');
    const distReady = fs.existsSync(distHtml) && fs.existsSync(mainBundle);
    console.log(`Production Bundles: ${distReady ? '[PASS] Compiled & ready' : '[WARN] Missing (CLI runs directly via TypeScript kernel)'}`);

    const tools = kernel.toolService.getTools();
    console.log(`Authoritative Tools:[PASS] ${tools.length} tools registered in ToolRegistry`);

    const providers = kernel.omniRouter.getAllProviderStatuses();
    const configured = providers.filter(p => p.isConfigured && p.id !== 'local-heuristic');
    console.log(`AI Provider Router: [PASS] ${configured.length}/${providers.length - 1} cloud/local providers configured (+1 deterministic offline fallback)`);
    for (const p of providers) {
      const publicLabel = resolvePublicEngineIdentity(p.id, p.currentModel).publicLabel;
      const state = p.id === 'local-heuristic'
        ? `ACTIVE (${publicLabel} -> Offline Fallback)`
        : p.isConfigured
          ? (p.isHealthy ? `CONFIGURED (${publicLabel} -> ${p.id}:${p.currentModel})` : `UNHEALTHY (${p.lastErrorCode || 'error'})`)
          : 'UNCONFIGURED';
      console.log(`  └─ ${p.id.padEnd(18)}: ${state}`);
    }

    const mcpStatuses = kernel.mcpClient.getAllStatuses();
    const mcpConnected = mcpStatuses.filter(s => s.state === 'CONNECTED').length;
    console.log(
      `MCP Subsystem:      [PASS] ${mcpConnected} connected / ${mcpStatuses.length} configured (${formatLogicalPath(kernel.mcpClient.getConfigPath(), process.cwd())})`
    );

    const runnerExists = fs.existsSync(path.join(PROJECT_ROOT, 'run_suites.cjs'));
    const testDir = path.join(PROJECT_ROOT, 'src/main/services/__tests__');
    const suiteCount = fs.existsSync(testDir) ? fs.readdirSync(testDir).filter(f => f.endsWith('.test.ts')).length : 0;
    console.log(`Test Harness:       ${runnerExists ? `[PASS] ${suiteCount} test suites configured` : '[OPTIONAL] Standalone installed release'}`);

    try {
      const cmdCheck = process.platform === 'win32' ? 'where orion' : 'which orion';
      const whereResult = execSync(cmdCheck, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      console.log(
        `Global CLI Command: [PASS] Registered at: ${formatLogicalPath(whereResult.split(/\r?\n/)[0])}`
      );
    } catch {
      console.log('Global CLI Command: [WARN] Not registered in PATH. Run "orion setup" to install globally.');
    }

    console.log('\n[✓] Diagnostic check complete. System is ready.\n');
  } finally {
    kernel.shutdown();
  }
}

function ensureBuild() {
  const distHtml = path.join(PROJECT_ROOT, 'dist', 'index.html');
  const mainBundle = path.join(PROJECT_ROOT, 'dist-electron', 'main', 'index.js');
  if (!fs.existsSync(distHtml) || !fs.existsSync(mainBundle)) {
    console.log('[i] Production bundles missing. Running initial build...');
    execSync('npm run build', { cwd: PROJECT_ROOT, stdio: 'inherit' });
  }
}

function launchGuiApp(options = {}) {
  ensureBuild();
  const electronExe = getElectronPath();
  const isForeground = options.foreground || false;
  const isDemo = options.demo || false;
  const extraEnv = {
    ...process.env,
    ...(isDemo ? { ORION_INITIAL_MODE: 'DEMO' } : {})
  };
  delete extraEnv.ELECTRON_RUN_AS_NODE;
  const args = ['.'];
  if (isDemo) args.push('--demo');

  if (isForeground) {
    const child = spawn(electronExe, args, { cwd: PROJECT_ROOT, stdio: 'inherit', env: extraEnv, shell: false });
    child.on('close', (code) => process.exit(code || 0));
  } else {
    const child = spawn(electronExe, args, { cwd: PROJECT_ROOT, detached: true, stdio: 'ignore', env: extraEnv, shell: false });
    child.unref();
    console.log(`[✓] ORION desktop process spawned (PID: ${child.pid}).`);
    process.exit(0);
  }
}

function runDev() {
  const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev'], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
    shell: true
  });
  child.on('close', (code) => process.exit(code || 0));
}

function runTest(extraArgs = []) {
  const child = spawn(process.execPath, ['run_suites.cjs', ...extraArgs], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit'
  });
  child.on('close', (code) => process.exit(code || 0));
}

function runBuild() {
  const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
    shell: true
  });
  child.on('close', (code) => process.exit(code || 0));
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

async function runUpgradeCommand(extraArgs, jsonMode) {
  registerTsRuntime();
  const { OrionUpgradeService } = require(path.join(PROJECT_ROOT, 'src', 'cli', 'OrionUpgradeService.ts'));

  let feedUrl;
  let installBaseDir;
  const checkOnly = extraArgs.includes('--check') || extraArgs.includes('-c');
  const noLaunch = extraArgs.includes('--no-launch') || jsonMode;
  const rollback = extraArgs.includes('--rollback');
  const allowPrerelease = extraArgs.includes('--prerelease');

  for (let i = 0; i < extraArgs.length; i++) {
    if (extraArgs[i] === '--feed-url' && extraArgs[i + 1]) {
      feedUrl = extraArgs[i + 1];
      i++;
    } else if (extraArgs[i] === '--install-dir' && extraArgs[i + 1]) {
      installBaseDir = extraArgs[i + 1];
      i++;
    }
  }

  const service = new OrionUpgradeService(installBaseDir);
  const logs = [];
  const result = await service.runUpgrade({
    installBaseDir,
    currentVersionOverride: fs.existsSync(service.getCurrentDir()) ? undefined : pkg.version,
    feedUrl,
    checkOnly,
    noLaunch,
    rollback,
    allowPrerelease,
    logger: (line) => {
      logs.push(line);
      if (!jsonMode) {
        console.log(line);
      }
    }
  });

  if (jsonMode) {
    console.log(JSON.stringify({ ...result, logs }, null, 2));
  } else if (!result.success && result.error) {
    console.error(`[!] ORION upgrade error: ${result.error}`);
  }

  process.exit(result.success ? 0 : 1);
}

async function main() {
  if (process.versions && process.versions.electron) {
    const mainBundle = path.join(PROJECT_ROOT, 'dist-electron', 'main', 'index.js');
    if (fs.existsSync(mainBundle)) {
      require(mainBundle);
      return;
    }
    registerTsRuntime();
    require(path.join(PROJECT_ROOT, 'src', 'main', 'index.ts'));
    return;
  }

  const rawArgs = process.argv.slice(2);
  const jsonMode = rawArgs.includes('--json');
  const noColor = rawArgs.includes('--no-color');
  const autoApprove = rawArgs.includes('--yes');
  const printMode = rawArgs.includes('--print') || rawArgs.includes('-p');
  const headlessMode = rawArgs.includes('--headless');
  const args = rawArgs.filter(
    a => a !== '--json' && a !== '--no-color' && a !== '--yes' && a !== '--print' && a !== '-p' && a !== '--headless'
  );
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
    launchGuiApp({ foreground: isFg, demo: true });
    return;
  }

  if (args.includes('--gui') || command === 'gui') {
    const isFg = args.includes('-w') || args.includes('--wait') || args.includes('-f') || args.includes('--foreground');
    launchGuiApp({ foreground: isFg, demo: false });
    return;
  }

  if ((command === 'doctor' || command === 'check') && !jsonMode) {
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

  if (command === 'upgrade' || command === 'update') {
    await runUpgradeCommand(args.slice(1), jsonMode);
    return;
  }

  let workspaceRoot = process.cwd();
  const filteredArgs = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--cwd' && args[i + 1]) {
      workspaceRoot = path.resolve(args[i + 1]);
      i++;
    } else {
      filteredArgs.push(args[i]);
    }
  }

  // Initialize the authoritative TypeScript CLI Application against the user's current workspace directory
  registerTsRuntime();
  const { OrionCliApp } = require(path.join(PROJECT_ROOT, 'src', 'cli', 'OrionCliApp.ts'));
  const app = new OrionCliApp({
    projectRoot: workspaceRoot,
    version: pkg.version,
    jsonMode,
    useColor: noColor ? false : undefined,
    autoApprove
  });

  // Non-interactive one-shot command via CLI arguments (or --print / --headless)
  if ((filteredArgs.length > 0 && command !== 'cli' && command !== 'repl') || printMode || headlessMode) {
    const promptInput = filteredArgs.filter(a => a !== 'cli' && a !== 'repl').join(' ').trim();
    if (!promptInput) {
      process.exit(0);
      return;
    }
    const exitCode = await app.runOnce(promptInput);
    process.exit(exitCode);
    return;
  }

  // Non-interactive piped stdin support
  if (!process.stdin.isTTY && filteredArgs.length === 0) {
    let pipedInput = '';
    process.stdin.setEncoding('utf8');
    for await (const chunk of process.stdin) {
      pipedInput += chunk;
    }
    const trimmedPipe = pipedInput.trim();
    if (!trimmedPipe) {
      process.exit(0);
      return;
    }
    const lines = trimmedPipe.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length > 1 && lines.every(l => l.startsWith('/'))) {
      let lastCode = 0;
      for (const line of lines) {
        if (line === '/exit' || line === '/quit' || line === '//exit' || line === '//quit') {
          break;
        }
        const res = await app.router.dispatch(line);
        lastCode = res.exitCode;
        if (res.shouldExit) break;
      }
      await app.kernel.shutdown();
      process.exit(lastCode);
      return;
    }
    const exitCode = await app.runOnce(trimmedPipe);
    process.exit(exitCode);
    return;
  }

  // Default: Start full-screen React + Ink TUI in interactive TTY (with readline fallback for non-TTY)
  if (process.stdout.isTTY && process.stdin.isTTY && !jsonMode && !filteredArgs.includes('--readline')) {
    const code = await app.startTui();
    process.exit(code);
    return;
  }
  app.startInteractive();
}

if (require.main === module || (process.versions && process.versions.electron)) {
  main().catch((err) => {
    console.error('ORION Fatal CLI Error:', err?.message || err);
    process.exit(1);
  });
}

module.exports = {
  main,
  getElectronPath,
  PROJECT_ROOT,
  registerTsRuntime
};
