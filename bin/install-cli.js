#!/usr/bin/env node

/**
 * ORION — Standalone Global CLI Release Installer
 * Installs a self-contained ORION release into:
 *   - Windows : %LOCALAPPDATA%\orion  (shims in %LOCALAPPDATA%\orion\bin)
 *   - Unix    : ~/.local/share/orion  (shim in ~/.local/bin/orion)
 * so `orion` and `orion upgrade` run from ANY working directory against the installed release.
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');
const { registerTsRuntime } = require('./orion.js');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const ORION_JS_PATH = path.join(PROJECT_ROOT, 'bin', 'orion.js');

function parseCustomInstallDir(argv) {
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--install-dir' && argv[i + 1]) {
      return path.resolve(argv[i + 1]);
    }
  }
  return undefined;
}

function runInstaller() {
  const customInstallDir = parseCustomInstallDir(process.argv.slice(2));
  const skipPathMutation = process.argv.includes('--skip-path');

  console.log(`
\x1b[36m======================================================================
       ORION — STANDALONE GLOBAL CLI RELEASE INSTALLER
       Platform: ${process.platform} (${os.arch()}) | Node.js: ${process.version}
======================================================================\x1b[0m
`);

  if (process.platform !== 'win32') {
    try {
      fs.chmodSync(ORION_JS_PATH, 0o755);
    } catch {}
  }

  registerTsRuntime();
  const { OrionUpgradeService } = require(path.join(
    PROJECT_ROOT,
    'src',
    'cli',
    'OrionUpgradeService.ts'
  ));
  const { formatLogicalPath } = require(path.join(
    PROJECT_ROOT,
    'src',
    'shared',
    'branding',
    'OrionEngineIdentity.ts'
  ));

  const upgradeService = new OrionUpgradeService(customInstallDir);
  console.log('[1/3] Provisioning standalone ORION release snapshot...');
  const installed = upgradeService.installFromLocalSource(PROJECT_ROOT, {
    syncGlobalNpmShim: !customInstallDir,
    copyNodeModules: process.argv.includes('--copy-modules')
  });

  console.log(`\x1b[32m[✓] Installed ORION v${installed.version} release at: ${formatLogicalPath(installed.currentDir)}\x1b[0m`);
  console.log(`\x1b[32m[✓] Verified standalone executable: ${installed.verifiedVersionOutput}\x1b[0m`);
  console.log(`\x1b[32m[✓] Generated global CLI shims in:  ${formatLogicalPath(installed.binDir)}\x1b[0m`);

  if (skipPathMutation) {
    console.log('\n[2/3] Skipping User PATH mutation (--skip-path specified).');
    return installed;
  }

  if (process.platform === 'win32') {
    console.log('\n[2/3] Ensuring Windows User PATH points to installed ORION release...');
    try {
      const escapedBin = installed.binDir.replace(/'/g, "''");
      const psScript = [
        "$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')",
        '$parts = @()',
        "if ($userPath) { $parts = $userPath -split ';' | Where-Object { $_ -and $_.Trim() -ne '' } }",
        `$target = '${escapedBin}'`,
        '$filtered = @($target) + ($parts | Where-Object { $_.TrimEnd("\\") -ieq $target.TrimEnd("\\") -eq $false })',
        "$newPath = ($filtered | Select-Object -Unique) -join ';'",
        "if ($newPath -ne $userPath) { [Environment]::SetEnvironmentVariable('Path', $newPath, 'User'); Write-Output 'PATH_UPDATED' } else { Write-Output 'ALREADY_FIRST' }"
      ].join('; ');

      const result = execSync(`powershell -NoProfile -Command "${psScript}"`, {
        encoding: 'utf8'
      }).trim();
      if (result.includes('PATH_UPDATED')) {
        console.log('\x1b[32m[✓] Prioritized installed ORION binary directory in Windows User PATH.\x1b[0m');
      } else {
        console.log('\x1b[32m[✓] Windows User PATH already prioritizes installed ORION binary directory.\x1b[0m');
      }
    } catch (err) {
      console.log('\x1b[33m[!] PATH update notice:\x1b[0m', err.message);
    }
  } else {
    const localBin = path.join(os.homedir(), '.local', 'bin');
    console.log(`\n[2/3] Linking Unix binary wrapper into ${localBin}...`);
    try {
      fs.mkdirSync(localBin, { recursive: true });
      const unixShimSource = path.join(installed.binDir, 'orion');
      const unixShimDest = path.join(localBin, 'orion');
      fs.copyFileSync(unixShimSource, unixShimDest);
      fs.chmodSync(unixShimDest, 0o755);
      console.log(`\x1b[32m[✓] Installed executable wrapper at: ${unixShimDest}\x1b[0m`);
    } catch (err) {
      console.error('\x1b[31m[!] Error creating Unix wrapper:\x1b[0m', err.message);
    }
  }

  console.log('\n[3/3] Installation summary:');
  console.log(`
\x1b[32m======================================================================
       ORION v${installed.version} GLOBAL CLI READY
======================================================================\x1b[0m

Run from ANY directory:
  \x1b[33morion\x1b[0m                   Launch interactive ORION terminal interface
  \x1b[33morion upgrade\x1b[0m           Verify (SHA-256) and install latest stable release
  \x1b[33morion upgrade --check\x1b[0m   Check for updates without modifying installation
  \x1b[33morion doctor\x1b[0m            Run system & runtime diagnostic checks
`);
  return installed;
}

if (require.main === module) {
  try {
    runInstaller();
  } catch (err) {
    console.error('\x1b[31m[!] ORION CLI Installation Failed:\x1b[0m', err?.message || err);
    process.exit(1);
  }
}

module.exports = { runInstaller };
