#!/usr/bin/env node

/**
 * ORION AI Command System — Cross-Platform Global CLI Installer
 * Supports Windows (win32), macOS (darwin), and Linux (linux)
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const ORION_JS_PATH = path.join(PROJECT_ROOT, 'bin', 'orion.js');

console.log(`
\x1b[36m======================================================================
       ORION AI COMMAND SYSTEM — CROSS-PLATFORM CLI INSTALLER
       Platform: ${process.platform} (${os.arch()}) | Node.js: ${process.version}
======================================================================\x1b[0m
`);

console.log(`[+] Project Directory: \x1b[90m${PROJECT_ROOT}\x1b[0m`);

// Step 1: Ensure executable permissions on Unix (macOS / Linux)
if (process.platform !== 'win32') {
  try {
    fs.chmodSync(ORION_JS_PATH, 0o755);
    console.log('\x1b[32m[✓] Marked bin/orion.js as executable (chmod +x).\x1b[0m');
  } catch (err) {
    console.log('\x1b[33m[!] chmod notice:\x1b[0m', err.message);
  }
}

// Step 2: Execute npm link
console.log('\n[1/3] Linking global package via npm...');
try {
  execSync('npm link', { cwd: PROJECT_ROOT, stdio: 'inherit' });
  console.log('\x1b[32m[✓] npm link registered successfully in global npm prefix.\x1b[0m');
} catch (err) {
  console.log('\x1b[33m[!] npm link warning (continuing with user binary directory setup):', err.message, '\x1b[0m');
}

// Step 3: Platform-specific binary wrappers & PATH setup
if (process.platform === 'win32') {
  const LOCAL_APP_DATA = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
  const ORION_GLOBAL_BIN = path.join(LOCAL_APP_DATA, 'orion', 'bin');

  console.log('\n[2/3] Setting up Windows user binary wrappers...');
  try {
    if (!fs.existsSync(ORION_GLOBAL_BIN)) {
      fs.mkdirSync(ORION_GLOBAL_BIN, { recursive: true });
    }

    const cmdContent = `@echo off\r\nnode "${ORION_JS_PATH}" %*\r\n`;
    fs.writeFileSync(path.join(ORION_GLOBAL_BIN, 'orion.cmd'), cmdContent, 'utf8');

    const ps1Content = `[CmdletBinding()]\r\nparam(\r\n    [Parameter(ValueFromRemainingArguments = $true)]\r\n    [string[]]$ScriptArgs\r\n)\r\n& node "${ORION_JS_PATH}" @ScriptArgs\r\n`;
    fs.writeFileSync(path.join(ORION_GLOBAL_BIN, 'orion.ps1'), ps1Content, 'utf8');

    const shContent = `#!/bin/sh\nexec node "${ORION_JS_PATH.replace(/\\/g, '/')}" "$@"\n`;
    fs.writeFileSync(path.join(ORION_GLOBAL_BIN, 'orion'), shContent, 'utf8');

    console.log(`\x1b[32m[✓] Generated global wrappers in: ${ORION_GLOBAL_BIN}\x1b[0m`);
  } catch (err) {
    console.error('\x1b[31m[!] Error creating wrapper scripts:\x1b[0m', err.message);
  }

  console.log('\n[3/3] Ensuring PATH registration in Windows User Environment...');
  try {
    const psCommands = [
      "$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')",
      "$added = $false",
      `$targets = @('${ORION_GLOBAL_BIN.replace(/\\/g, '\\\\')}', [System.Environment]::ExpandEnvironmentVariables('%APPDATA%\\\\npm'))`,
      "foreach ($t in $targets) { if ($userPath -split ';' -notcontains $t) { $userPath = \"$userPath;$t\"; $added = $true } }",
      "if ($added) { [Environment]::SetEnvironmentVariable('Path', $userPath, 'User'); Write-Output 'PATH_UPDATED' } else { Write-Output 'ALREADY_PRESENT' }"
    ].join('; ');

    const result = execSync(`powershell -NoProfile -Command "${psCommands}"`, { encoding: 'utf8' }).trim();
    if (result.includes('PATH_UPDATED')) {
      console.log('\x1b[32m[✓] Added ORION binary directory to Windows User PATH.\x1b[0m');
    } else {
      console.log('\x1b[32m[✓] Windows User PATH already contains ORION binary directory.\x1b[0m');
    }
  } catch (err) {
    console.log('\x1b[33m[!] PATH update notice:\x1b[0m', err.message);
  }
} else {
  // macOS (darwin) & Linux
  const localBin = path.join(os.homedir(), '.local', 'bin');
  console.log(`\n[2/3] Setting up Unix binary wrapper in ${localBin}...`);
  try {
    if (!fs.existsSync(localBin)) {
      fs.mkdirSync(localBin, { recursive: true });
    }
    const wrapperPath = path.join(localBin, 'orion');
    const shContent = `#!/usr/bin/env sh\nexec node "${ORION_JS_PATH}" "$@"\n`;
    fs.writeFileSync(wrapperPath, shContent, { encoding: 'utf8', mode: 0o755 });
    fs.chmodSync(wrapperPath, 0o755);
    console.log(`\x1b[32m[✓] Installed executable wrapper at: ${wrapperPath}\x1b[0m`);
  } catch (err) {
    console.error('\x1b[31m[!] Error creating Unix wrapper:\x1b[0m', err.message);
  }

  console.log('\n[3/3] Checking shell profile PATH (~/.zshrc / ~/.bashrc)...');
  const rcFiles = [
    path.join(os.homedir(), '.zshrc'),
    path.join(os.homedir(), '.bashrc'),
    path.join(os.homedir(), '.bash_profile')
  ];
  const exportLine = 'export PATH="$HOME/.local/bin:$PATH"';
  for (const rc of rcFiles) {
    if (fs.existsSync(rc)) {
      const content = fs.readFileSync(rc, 'utf8');
      if (!content.includes('.local/bin')) {
        fs.appendFileSync(rc, `\n# ORION CLI\n${exportLine}\n`, 'utf8');
        console.log(`\x1b[32m[✓] Added ~/.local/bin to ${rc}\x1b[0m`);
      }
    }
  }
}

console.log(`
\x1b[32m======================================================================
       ORION CLI INSTALLATION COMPLETED SUCCESSFULLY!
======================================================================\x1b[0m

You can now run \x1b[1;36morion\x1b[0m from ANY terminal on Windows, macOS, or Linux:

  \x1b[33m$ orion\x1b[0m                 Launch interactive ORION CLI REPL
  \x1b[33m$ orion //commands\x1b[0m      View all /slash and //double-slash commands
  \x1b[33m$ orion /mcp\x1b[0m            Manage Model Context Protocol (MCP) servers & tools
  \x1b[33m$ orion "open spotify"\x1b[0m  Launch apps with Al-Hiqmah cross-platform engine
  \x1b[33m$ orion doctor\x1b[0m          Inspect system health, AI keys & dependencies
`);
