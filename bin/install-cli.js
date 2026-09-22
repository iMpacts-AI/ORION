#!/usr/bin/env node

/**
 * ORION AI Command System — Global CLI Installer & Environment Configurator
 * Registers the global 'orion' command across Windows Command Prompt, PowerShell, and Terminal.
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const LOCAL_APP_DATA = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
const ORION_GLOBAL_BIN = path.join(LOCAL_APP_DATA, 'orion', 'bin');
const DESKTOP_DIR = path.join(os.homedir(), 'Desktop');

console.log(`
\x1b[36m======================================================================
       ORION AI COMMAND SYSTEM — GLOBAL CLI INSTALLER
======================================================================\x1b[0m
`);

console.log(`[+] Project Directory: \x1b[90m${PROJECT_ROOT}\x1b[0m`);

// Step 1: Execute npm link
console.log('\n[1/4] Linking global package via npm...');
try {
  execSync('npm link', { cwd: PROJECT_ROOT, stdio: 'inherit' });
  console.log('\x1b[32m[✓] npm link registered successfully in global npm prefix.\x1b[0m');
} catch (err) {
  console.log('\x1b[33m[!] npm link warning (continuing with direct PATH registration):', err.message, '\x1b[0m');
}

// Step 2: Create %LOCALAPPDATA%\orion\bin and generate wrapper scripts
console.log('\n[2/4] Setting up dedicated user binary directory...');
try {
  if (!fs.existsSync(ORION_GLOBAL_BIN)) {
    fs.mkdirSync(ORION_GLOBAL_BIN, { recursive: true });
  }

  // Windows CMD Batch Wrapper
  const cmdContent = `@echo off\r\nnode "${path.join(PROJECT_ROOT, 'bin', 'orion.js')}" %*\r\n`;
  fs.writeFileSync(path.join(ORION_GLOBAL_BIN, 'orion.cmd'), cmdContent, 'utf8');

  // Windows PowerShell Wrapper
  const ps1Content = `[CmdletBinding()]\r\nparam(\r\n    [Parameter(ValueFromRemainingArguments = $true)]\r\n    [string[]]$ScriptArgs\r\n)\r\n& node "${path.join(PROJECT_ROOT, 'bin', 'orion.js')}" @ScriptArgs\r\n`;
  fs.writeFileSync(path.join(ORION_GLOBAL_BIN, 'orion.ps1'), ps1Content, 'utf8');

  // Bash/WSL/Git Bash Wrapper
  const shContent = `#!/bin/sh\nexec node "${path.join(PROJECT_ROOT, 'bin', 'orion.js').replace(/\\/g, '/')}" "$@"\n`;
  fs.writeFileSync(path.join(ORION_GLOBAL_BIN, 'orion'), shContent, 'utf8');

  console.log(`\x1b[32m[✓] Generated global wrappers in: ${ORION_GLOBAL_BIN}\x1b[0m`);
} catch (err) {
  console.error('\x1b[31m[!] Error creating wrapper scripts:\x1b[0m', err.message);
}

// Step 3: Register in Windows User PATH
console.log('\n[3/4] Ensuring PATH registration in Windows User Environment...');
if (process.platform === 'win32') {
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
      console.log('\x1b[32m[✓] Added ORION binary directory to User PATH.\x1b[0m');
    } else {
      console.log('\x1b[32m[✓] User PATH already contains ORION binary directory.\x1b[0m');
    }
  } catch (err) {
    console.log('\x1b[33m[!] PATH update notice:\x1b[0m', err.message);
  }
}

// Step 4: Create Desktop Shortcut
console.log('\n[4/4] Creating Desktop Shortcut...');
if (process.platform === 'win32' && fs.existsSync(DESKTOP_DIR)) {
  try {
    const shortcutPath = path.join(DESKTOP_DIR, 'ORION.lnk');
    const targetScript = path.join(PROJECT_ROOT, 'bin', 'orion.cmd');
    const iconPath = path.join(PROJECT_ROOT, 'public', 'favicon.ico');

    const psShortcut = [
      "$ws = New-Object -ComObject WScript.Shell",
      `$s = $ws.CreateShortcut('${shortcutPath.replace(/\\/g, '\\\\')}')`,
      `$s.TargetPath = '${targetScript.replace(/\\/g, '\\\\')}'`,
      `$s.WorkingDirectory = '${PROJECT_ROOT.replace(/\\/g, '\\\\')}'`,
      "$s.Description = 'ORION AI Command System Desktop Assistant'",
      `if (Test-Path '${iconPath.replace(/\\/g, '\\\\')}') { $s.IconLocation = '${iconPath.replace(/\\/g, '\\\\')}' }`,
      "$s.Save()"
    ].join('; ');

    execSync(`powershell -NoProfile -Command "${psShortcut}"`, { stdio: 'ignore' });
    console.log(`\x1b[32m[✓] Desktop shortcut created at: ${shortcutPath}\x1b[0m`);
  } catch (err) {
    console.log('\x1b[33m[!] Desktop shortcut notice (skipping):\x1b[0m', err.message);
  }
}

console.log(`
\x1b[32m======================================================================
       ORION CLI INSTALLATION COMPLETED SUCCESSFULLY!
======================================================================\x1b[0m

You can now type \x1b[1;36morion\x1b[0m from ANY Command Prompt, PowerShell, or Terminal:

  \x1b[33m> orion\x1b[0m           Launch ORION desktop application immediately
  \x1b[33m> orion demo\x1b[0m      Launch Coders HQ Showcase & Demonstration mode
  \x1b[33m> orion dev\x1b[0m       Launch in developer mode with live reload
  \x1b[33m> orion doctor\x1b[0m    Inspect system health, AI keys & dependencies
  \x1b[33m> orion test\x1b[0m      Execute 41-suite verification test harness
  \x1b[33m> orion --help\x1b[0m    View all commands and options
`);
