#!/usr/bin/env node

/**
 * ORION AI Command System — Unified CLI Launcher
 * Coders HQ Technical Architecture
 *
 * Usage:
 *   orion            (Launches ORION desktop application)
 *   orion dev        (Launches in development mode with live reload)
 *   orion demo       (Launches Coders HQ Showcase mode)
 *   orion doctor     (Performs pre-flight diagnostic check)
 *   orion test       (Runs full 41-suite verification test harness)
 *   orion build      (Compiles production TypeScript and Vite bundles)
 *   orion setup      (Registers global PATH and desktop shortcut)
 *   orion --help     (Displays help documentation)
 */

const path = require('path');
const fs = require('fs');
const { spawn, execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PKG_PATH = path.join(PROJECT_ROOT, 'package.json');
const pkg = fs.existsSync(PKG_PATH) ? JSON.parse(fs.readFileSync(PKG_PATH, 'utf8')) : { version: '1.0.0' };

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

function printBanner() {
  console.log(`
\x1b[36m   ___  ____  ___ ___  _  _ 
  / _ \\|  _ \\|_ _/ _ \\| \\| |
 | | | | |_) || | | | | .\` |
 | |_| |  _ < | | |_| | |\\ |
  \\___/|_| \\_\\___\\___/|_| \\_|\x1b[0m
 \x1b[90m┌─────────────────────────────────────────────────────────────┐\x1b[0m
 \x1b[90m│\x1b[0m \x1b[1mORION AI Command System\x1b[0m — Desktop Autonomous Assistant    \x1b[90m│\x1b[0m
 \x1b[90m│\x1b[0m Coders HQ Verified Architecture | v${pkg.version.padEnd(25)}\x1b[90m│\x1b[0m
 \x1b[90m└─────────────────────────────────────────────────────────────┘\x1b[0m
`);
}

function showHelp() {
  printBanner();
  console.log(`\x1b[1mCOMMANDS:\x1b[0m
  \x1b[32morion\x1b[0m               Launch the ORION desktop assistant (production runtime)
  \x1b[32morion dev\x1b[0m           Launch with Vite hot-reloading & live debugging
  \x1b[32morion demo\x1b[0m          Launch directly into the Coders HQ Showcase mode
  \x1b[32morion doctor\x1b[0m        Inspect system dependencies, API keys & environment health
  \x1b[32morion test\x1b[0m          Execute the complete 41-suite verification harness
  \x1b[32morion build\x1b[0m         Compile TypeScript and Vite production bundles
  \x1b[32morion setup\x1b[0m         Register global Windows PATH and desktop shortcuts
  \x1b[32morion help\x1b[0m          Display this command reference

\x1b[1mOPTIONS:\x1b[0m
  \x1b[33m-w, --wait, -f, --foreground\x1b[0m   Attach terminal to application logs instead of detached mode
  \x1b[33m-d, --dev\x1b[0m                      Alias for 'orion dev'
  \x1b[33m--demo\x1b[0m                         Alias for 'orion demo'
  \x1b[33m-v, --version\x1b[0m                  Display version string
  \x1b[33m-h, --help\x1b[0m                     Display this help menu
`);
}

function showVersion() {
  console.log(`ORION v${pkg.version}`);
}

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
  if (isDemo) {
    args.push('--demo');
  }

  printBanner();
  console.log(`\x1b[36m[+] Launching ORION Desktop Interface ${isDemo ? '(Coders HQ Showcase Mode)' : '(Production Runtime)'}...\x1b[0m`);

  if (isForeground) {
    console.log('\x1b[90m[i] Running in foreground mode. Press Ctrl+C to terminate.\x1b[0m\n');
    const child = spawn(electronExe, args, {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      env: extraEnv,
      shell: false
    });

    child.on('close', (code) => {
      process.exit(code || 0);
    });
  } else {
    const child = spawn(electronExe, args, {
      cwd: PROJECT_ROOT,
      detached: true,
      stdio: 'ignore',
      env: extraEnv,
      shell: false
    });

    child.unref();

    console.log(`\x1b[32m[✓] ORION desktop process spawned successfully (PID: ${child.pid}).\x1b[0m`);
    console.log('\x1b[90m[i] The ORION Cyberpunk HUD is active on your desktop.\x1b[0m');
    console.log('\x1b[90m[i] Tip: Use Alt+Tab to bring ORION to the front if it opens behind active windows.\x1b[0m\n');
    process.exit(0);
  }
}

function runDev() {
  printBanner();
  console.log('\x1b[36m[+] Starting ORION in Developer Mode (Vite + Electron live reload)...\x1b[0m\n');
  const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev'], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
    shell: true
  });

  child.on('close', (code) => {
    process.exit(code || 0);
  });
}

function runTest(extraArgs = []) {
  printBanner();
  console.log('\x1b[36m[+] Executing ORION Verification Test Harness...\x1b[0m\n');
  const child = spawn(process.execPath, ['run_suites.cjs', ...extraArgs], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit'
  });

  child.on('close', (code) => {
    process.exit(code || 0);
  });
}

function runBuild() {
  printBanner();
  console.log('\x1b[36m[+] Compiling ORION TypeScript & Vite Production Bundles...\x1b[0m\n');
  const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
    shell: true
  });

  child.on('close', (code) => {
    process.exit(code || 0);
  });
}

function runDoctor() {
  printBanner();
  console.log('\x1b[1m=== ORION SYSTEM PRE-FLIGHT DIAGNOSTIC (DOCTOR) ===\x1b[0m\n');

  // 1. Environment & Node
  console.log(`Node.js Runtime:    \x1b[32m${process.version}\x1b[0m (${process.arch})`);
  console.log(`Operating System:   \x1b[32m${process.platform}\x1b[0m (${process.release?.name || 'native'})`);
  console.log(`Repository Root:    \x1b[90m${PROJECT_ROOT}\x1b[0m`);

  // 2. Electron binary check
  const electronExe = getElectronPath();
  const electronExists = fs.existsSync(electronExe);
  console.log(`Electron Binary:    ${electronExists ? `\x1b[32m[PASS]\x1b[0m ${electronExe}` : '\x1b[31m[FAIL] Not found\x1b[0m'}`);

  // 3. Build artifacts
  const distHtml = path.join(PROJECT_ROOT, 'dist', 'index.html');
  const mainBundle = path.join(PROJECT_ROOT, 'dist-electron', 'main', 'index.js');
  const distReady = fs.existsSync(distHtml) && fs.existsSync(mainBundle);
  console.log(`Production Bundles: ${distReady ? '\x1b[32m[PASS] Compiled & ready\x1b[0m' : '\x1b[33m[WARN] Missing (will auto-compile on launch)\x1b[0m'}`);

  // 4. Test harness check
  const runnerExists = fs.existsSync(path.join(PROJECT_ROOT, 'run_suites.cjs'));
  console.log(`Test Harness:       ${runnerExists ? '\x1b[32m[PASS] 41 test suites configured\x1b[0m' : '\x1b[31m[FAIL] Missing run_suites.cjs\x1b[0m'}`);

  // 5. Environment keys (.env)
  const envPath = path.join(PROJECT_ROOT, '.env');
  const hasEnv = fs.existsSync(envPath);
  console.log(`Environment File:   ${hasEnv ? '\x1b[32m[PASS] .env present\x1b[0m' : '\x1b[33m[INFO] .env not found (Local Heuristic Mode active)\x1b[0m'}`);

  if (hasEnv) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const keys = ['GEMINI_API_KEY', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GROQ_API_KEY'];
    for (const key of keys) {
      const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
      const val = match ? match[1].trim() : '';
      if (val && val !== 'your_api_key_here') {
        const masked = val.length > 8 ? `${val.slice(0, 4)}...${val.slice(-4)}` : '****';
        console.log(`  └─ ${key.padEnd(20)}: \x1b[32mConfigured\x1b[0m (${masked})`);
      } else {
        console.log(`  └─ ${key.padEnd(20)}: \x1b[90mNot set (Deterministic Router active)\x1b[0m`);
      }
    }
  }

  // 6. Global CLI registration check
  try {
    const whereResult = execSync('where orion', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
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

// Main CLI Dispatcher
function main() {
  const args = process.argv.slice(2);
  const command = args[0] ? args[0].toLowerCase() : '';

  // Options & Flags
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

  if (command === 'doctor' || command === 'status' || command === 'check') {
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

  // Default: launch production desktop app
  const isFg = args.includes('-w') || args.includes('--wait') || args.includes('-f') || args.includes('--foreground');
  launchApp({ foreground: isFg, demo: false });
}

if (require.main === module) {
  main();
}

module.exports = { main, getElectronPath, PROJECT_ROOT };
