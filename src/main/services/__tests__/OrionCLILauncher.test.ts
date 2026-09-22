import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

function runOrionCLILauncherSuite() {
  const PROJECT_ROOT = process.cwd();
  const ORION_JS = path.join(PROJECT_ROOT, 'bin', 'orion.js');
  const ORION_CMD = path.join(PROJECT_ROOT, 'bin', 'orion.cmd');
  const ORION_PS1 = path.join(PROJECT_ROOT, 'bin', 'orion.ps1');
  const INSTALL_JS = path.join(PROJECT_ROOT, 'bin', 'install-cli.js');
  const INSTALL_BAT = path.join(PROJECT_ROOT, 'install-cli.bat');
  const INSTALL_PS1 = path.join(PROJECT_ROOT, 'install-cli.ps1');
  const PKG_JSON = path.join(PROJECT_ROOT, 'package.json');

  console.log('=== RUNNING ORION CLI LAUNCHER & GLOBAL COMMAND VERIFICATION SUITE ===\n');

  // 1. Script existence check
  assert.strictEqual(fs.existsSync(ORION_JS), true, 'bin/orion.js must exist');
  assert.strictEqual(fs.existsSync(ORION_CMD), true, 'bin/orion.cmd must exist');
  assert.strictEqual(fs.existsSync(ORION_PS1), true, 'bin/orion.ps1 must exist');
  assert.strictEqual(fs.existsSync(INSTALL_JS), true, 'bin/install-cli.js must exist');
  assert.strictEqual(fs.existsSync(INSTALL_BAT), true, 'install-cli.bat must exist');
  assert.strictEqual(fs.existsSync(INSTALL_PS1), true, 'install-cli.ps1 must exist');
  console.log('  ✓ 1. All CLI launcher binaries and setup scripts verified');

  // 2. package.json bin registration
  const pkg = JSON.parse(fs.readFileSync(PKG_JSON, 'utf8'));
  assert.ok(pkg.bin, 'package.json must contain bin object');
  assert.strictEqual(pkg.bin.orion, './bin/orion.js', 'package.json bin.orion must point to ./bin/orion.js');
  assert.ok(pkg.scripts['install:cli'], 'package.json must have "install:cli" script');
  assert.ok(pkg.scripts['setup:cli'], 'package.json must have "setup:cli" script');
  console.log('  ✓ 2. package.json "bin" and CLI installer scripts verified');

  // 3. Version command check
  const verOutput = execSync(`node "${ORION_JS}" --version`, {
    cwd: PROJECT_ROOT,
    encoding: 'utf8'
  }).trim();
  assert.ok(verOutput.includes('ORION v1.0.0'), `Expected version string in: ${verOutput}`);
  console.log('  ✓ 3. "orion --version" returned valid version v1.0.0');

  // 4. Help command check
  const helpOutput = execSync(`node "${ORION_JS}" --help`, {
    cwd: PROJECT_ROOT,
    encoding: 'utf8'
  });
  assert.ok(helpOutput.includes('COMMANDS:'), 'Must contain COMMANDS header');
  assert.ok(helpOutput.includes('orion dev'), 'Must list dev command');
  assert.ok(helpOutput.includes('orion demo'), 'Must list demo command');
  assert.ok(helpOutput.includes('orion doctor'), 'Must list doctor command');
  assert.ok(helpOutput.includes('orion test'), 'Must list test command');
  assert.ok(helpOutput.includes('orion build'), 'Must list build command');
  assert.ok(helpOutput.includes('orion setup'), 'Must list setup command');
  console.log('  ✓ 4. "orion --help" returned full command documentation');

  // 5. Doctor diagnostics check
  const doctorOutput = execSync(`node "${ORION_JS}" doctor`, {
    cwd: PROJECT_ROOT,
    encoding: 'utf8'
  });
  assert.ok(doctorOutput.includes('ORION SYSTEM PRE-FLIGHT DIAGNOSTIC'), 'Must include doctor title');
  assert.ok(doctorOutput.includes('Node.js Runtime:'), 'Must check Node.js');
  assert.ok(doctorOutput.includes('Electron Binary:'), 'Must check Electron');
  assert.ok(doctorOutput.includes('Production Bundles:'), 'Must check production bundles');
  assert.ok(doctorOutput.includes('Diagnostic check complete.'), 'Must complete diagnostic check');
  console.log('  ✓ 5. "orion doctor" executed complete pre-flight check');

  // 6. Exports and electron resolution check
  const cliModule = require(ORION_JS);
  assert.strictEqual(typeof cliModule.getElectronPath, 'function', 'Must export getElectronPath');
  assert.strictEqual(cliModule.PROJECT_ROOT, PROJECT_ROOT, 'Must export PROJECT_ROOT');
  const electronExe = cliModule.getElectronPath();
  assert.ok(electronExe, 'Electron executable path must not be empty');
  assert.strictEqual(fs.existsSync(electronExe), true, `Electron executable must exist at: ${electronExe}`);
  console.log('  ✓ 6. Module exports and Electron binary resolution verified');

  console.log('\n[PASS] ORION CLI Launcher suite passed 6/6 assertions.\n');
}

runOrionCLILauncherSuite();
