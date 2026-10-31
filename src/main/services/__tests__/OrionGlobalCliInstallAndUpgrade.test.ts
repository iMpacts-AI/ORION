import http from 'http';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import {
  OrionUpgradeService,
  compareSemver,
  computeFileSha256,
  normalizeSemver,
  parseExpectedSha256Text,
  verifyOrionInstallationHealth,
  verifyTrustedFeedUrl
} from '../../../cli/OrionUpgradeService';

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean, detail = ''): void {
  if (condition) {
    passed++;
    console.log(`  [PASS] ${label}${detail ? ` — ${detail}` : ''}`);
  } else {
    failed++;
    console.error(`  [FAIL] ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

async function runSuite(): Promise<void> {
  console.log('=== ORION GLOBAL CLI STANDALONE INSTALL, UPGRADE, SHA-256 & ROLLBACK SUITE ===\n');

  const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');
  const tmpSandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'orion-cli-upgrade-suite-'));
  const installBaseDir = path.join(tmpSandbox, 'install-root');
  const externalWorkDir = path.join(tmpSandbox, 'external-user-project');
  const isolatedOrionHome = path.join(tmpSandbox, 'orion-user-home');
  const archiveBuildDir = path.join(tmpSandbox, 'archive-build');

  fs.mkdirSync(externalWorkDir, { recursive: true });
  fs.mkdirSync(isolatedOrionHome, { recursive: true });
  fs.mkdirSync(archiveBuildDir, { recursive: true });

  const prevOrionHome = process.env.ORION_HOME;
  process.env.ORION_HOME = isolatedOrionHome;

  // Seed user configuration & memory inside `~/.orion` (`ORION_HOME`) to verify 100% preservation across upgrades
  const userPrefsPath = path.join(isolatedOrionHome, 'preferences.json');
  const userCustomDataPath = path.join(isolatedOrionHome, 'user_notes.json');
  const expectedPrefsJson = JSON.stringify(
    {
      visualMode: 'minimal',
      animationsEnabled: false,
      tipRotationIntervalMs: 12000,
      updatedAtIso: '2026-10-30T12:00:00.000Z'
    },
    null,
    2
  );
  const expectedNotesJson = JSON.stringify({ operatorNote: 'preserve-across-orion-upgrade' });
  fs.writeFileSync(userPrefsPath, expectedPrefsJson, 'utf8');
  fs.writeFileSync(userCustomDataPath, expectedNotesJson, 'utf8');

  let server: http.Server | null = null;

  try {
    // =========================================================================
    // 1. SEMVER, TRUSTED FEED BOUNDARIES & SHA-256 PARSING
    // =========================================================================
    console.log('--- Part 1: Semver Ordering, HTTPS Feed Enforcement & Checksum Parsing ---');

    check(
      '1.1 Semver comparison orders stable releases above prereleases and lower versions',
      normalizeSemver('v1.2.3+build9') === '1.2.3' &&
        compareSemver('1.1.0', '1.0.9') === 1 &&
        compareSemver('1.1.0', '1.1.0-rc.1') === 1 &&
        compareSemver('1.0.0', '1.0.0') === 0
    );

    const httpsTrust = verifyTrustedFeedUrl('https://api.github.com/repos/iMpacts-AI/ORION/releases');
    const loopbackTrust = verifyTrustedFeedUrl('http://127.0.0.1:45555/releases');
    const insecureHttpTrust = verifyTrustedFeedUrl('http://evil-mirror.example.com/releases');

    check(
      '1.2 Release feed trust verifier allows HTTPS and local loopback test feeds while blocking remote plaintext HTTP',
      httpsTrust.trusted === true &&
        loopbackTrust.trusted === true &&
        insecureHttpTrust.trusted === false
    );

    const sampleHash = 'a'.repeat(64);
    const parsedMulti = parseExpectedSha256Text(
      `${'b'.repeat(64)}  other-file.zip\n${sampleHash} *orion-v1.0.1.tar.gz\n`,
      'orion-v1.0.1.tar.gz'
    );
    check(
      '1.3 SHA-256 checksum manifest parser matches target archive filename accurately',
      parsedMulti === sampleHash
    );

    // =========================================================================
    // 2. STANDALONE INSTALLATION & EXTERNAL WORKING DIRECTORY EXECUTION
    // =========================================================================
    console.log('\n--- Part 2: Standalone Installation & Execution Outside Source Repository ---');

    const upgrader = new OrionUpgradeService(installBaseDir);
    const initialInstall = upgrader.installFromLocalSource(repoRoot, {
      syncGlobalNpmShim: false,
      copyNodeModules: false
    });

    const baseVersion = initialInstall.version;
    const installedOrionJs = path.join(upgrader.getCurrentDir(), 'bin', 'orion.js');

    const externalVersionOut = execFileSync(process.execPath, [installedOrionJs, '--version'], {
      cwd: externalWorkDir,
      encoding: 'utf8',
      timeout: 15000
    }).trim();

    const externalHelpOut = execFileSync(process.execPath, [installedOrionJs, '--help'], {
      cwd: externalWorkDir,
      encoding: 'utf8',
      timeout: 15000
    }).trim();

    const externalDirEntries = fs.readdirSync(externalWorkDir);

    check(
      '2.1 Standalone release installs into isolated releases/v<ver> + current + bin and runs --version & --help from external temp dir',
      fs.existsSync(installedOrionJs) &&
        fs.existsSync(upgrader.getManifestPath()) &&
        externalVersionOut.includes(`ORION v${baseVersion}`) &&
        externalHelpOut.includes('orion upgrade') &&
        !externalDirEntries.includes('config'),
      `versionOut="${externalVersionOut}", externalDirEntries=${externalDirEntries.length}`
    );

    // Corrupted installation health check
    const brokenDir = path.join(tmpSandbox, 'corrupted-release');
    fs.mkdirSync(path.join(brokenDir, 'bin'), { recursive: true });
    fs.writeFileSync(
      path.join(brokenDir, 'package.json'),
      JSON.stringify({ name: 'orion', version: '1.0.0' }),
      'utf8'
    );
    const brokenHealth = verifyOrionInstallationHealth(brokenDir);
    check(
      '2.2 Corrupted installation health verifier detects missing core files and returns clear recovery instructions',
      brokenHealth.healthy === false &&
        brokenHealth.missingPaths.length > 0 &&
        brokenHealth.recoveryInstructions.some((line) => line.includes('orion upgrade --rollback'))
    );

    // =========================================================================
    // 3. BUILD REAL STAGED ARCHIVES (v1.0.1 VALID + v1.0.2 BROKEN) & LOCAL FEED SERVER
    // =========================================================================
    console.log('\n--- Part 3: Upgrade Check, Draft/Prerelease Filtering, Interrupted .part, Bad Checksum & Cutover ---');

    const validNextVersion = '1.0.1';
    const brokenNextVersion = '1.0.2';

    // Prepare v1.0.1 archive tree from installed v1.0.0 release (excluding node_modules junction; upgrader links shared node_modules or we copy package files)
    const stage101Src = path.join(archiveBuildDir, 'orion-v1.0.1');
    fs.mkdirSync(stage101Src, { recursive: true });
    for (const item of ['package.json', 'README.md', 'bin', 'src', 'assets', 'config']) {
      const srcItem = path.join(repoRoot, item);
      if (fs.existsSync(srcItem)) {
        fs.cpSync(srcItem, path.join(stage101Src, item), { recursive: true });
      }
    }
    // Link node_modules inside the installed base's current release; for archive extraction, also include minimal typescript marker or link?
    // Wait: let's check how `OrionUpgradeService.runUpgrade` provisions `node_modules` for extracted archives!
    // Let's include a junction/copy or check if `OrionUpgradeService` carries forward `node_modules` from `current` when archive omits `node_modules`!
    const pkg101Path = path.join(stage101Src, 'package.json');
    const pkg101 = JSON.parse(fs.readFileSync(pkg101Path, 'utf8'));
    pkg101.version = validNextVersion;
    fs.writeFileSync(pkg101Path, JSON.stringify(pkg101, null, 2) + '\n', 'utf8');

    const archive101Name = `orion-v${validNextVersion}.tar.gz`;
    const archive101Path = path.join(archiveBuildDir, archive101Name);
    execFileSync('tar', ['-czf', archive101Path, '-C', archiveBuildDir, 'orion-v1.0.1'], {
      stdio: 'pipe',
      timeout: 30000
    });
    const sha101 = computeFileSha256(archive101Path);

    // Prepare broken v1.0.2 archive (valid tar.gz + valid SHA-256, but missing src/cli/OrionCliKernel.ts!)
    const stage102Broken = path.join(archiveBuildDir, 'orion-v1.0.2');
    fs.mkdirSync(path.join(stage102Broken, 'bin'), { recursive: true });
    fs.writeFileSync(
      path.join(stage102Broken, 'package.json'),
      JSON.stringify({ name: 'orion', version: brokenNextVersion }, null, 2),
      'utf8'
    );
    fs.copyFileSync(
      path.join(repoRoot, 'bin', 'orion.js'),
      path.join(stage102Broken, 'bin', 'orion.js')
    );
    const archive102Name = `orion-v${brokenNextVersion}.tar.gz`;
    const archive102Path = path.join(archiveBuildDir, archive102Name);
    execFileSync('tar', ['-czf', archive102Path, '-C', archiveBuildDir, 'orion-v1.0.2'], {
      stdio: 'pipe',
      timeout: 30000
    });
    const sha102 = computeFileSha256(archive102Path);

    let feedMode: 'normal_101' | 'tampered_checksum' | 'broken_102' | 'empty_404' = 'normal_101';

    server = http.createServer((req, res) => {
      const reqUrl = req.url || '/';
      const addr = server!.address() as { port: number };
      const origin = `http://127.0.0.1:${addr.port}`;

      if (reqUrl === '/releases') {
        if (feedMode === 'empty_404') {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Not Found' }));
          return;
        }

        if (feedMode === 'broken_102') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify([
              {
                tag_name: `v${brokenNextVersion}`,
                draft: false,
                prerelease: false,
                assets: [
                  {
                    name: archive102Name,
                    browser_download_url: `${origin}/assets/${archive102Name}`
                  },
                  {
                    name: `${archive102Name}.sha256`,
                    browser_download_url: `${origin}/assets/${archive102Name}.sha256`
                  }
                ]
              }
            ])
          );
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify([
            {
              tag_name: 'v1.0.5',
              draft: true,
              prerelease: false,
              assets: []
            },
            {
              tag_name: 'v1.0.4-beta.1',
              draft: false,
              prerelease: true,
              assets: []
            },
            {
              tag_name: `v${validNextVersion}`,
              draft: false,
              prerelease: false,
              body: 'ORION v1.0.1 Verified Release',
              assets: [
                {
                  name: archive101Name,
                  browser_download_url: `${origin}/assets/${archive101Name}`
                },
                {
                  name: `${archive101Name}.sha256`,
                  browser_download_url: `${origin}/assets/${archive101Name}.sha256`
                }
              ]
            }
          ])
        );
        return;
      }

      if (reqUrl === `/assets/${archive101Name}`) {
        res.writeHead(200, { 'Content-Type': 'application/gzip' });
        fs.createReadStream(archive101Path).pipe(res);
        return;
      }

      if (reqUrl === `/assets/${archive101Name}.sha256`) {
        const hashToServe = feedMode === 'tampered_checksum' ? 'f'.repeat(64) : sha101;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`${hashToServe}  ${archive101Name}\n`);
        return;
      }

      if (reqUrl === `/assets/${archive102Name}`) {
        res.writeHead(200, { 'Content-Type': 'application/gzip' });
        fs.createReadStream(archive102Path).pipe(res);
        return;
      }

      if (reqUrl === `/assets/${archive102Name}.sha256`) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`${sha102}  ${archive102Name}\n`);
        return;
      }

      res.writeHead(404);
      res.end('Not found');
    });

    await new Promise<void>((resolve) => server!.listen(0, '127.0.0.1', () => resolve()));
    const port = (server.address() as { port: number }).port;
    const feedUrl = `http://127.0.0.1:${port}/releases`;
    const silentLog = () => {};

    // 3.1 Empty/unpublished release feed handling
    feedMode = 'empty_404';
    const noRelRes = await upgrader.runUpgrade({ feedUrl, checkOnly: true, logger: silentLog });
    check(
      '3.1 Empty/unpublished release feed reports no-release honestly without failing or altering current install',
      noRelRes.success === true &&
        noRelRes.action === 'no-release' &&
        upgrader.getInstalledVersion() === baseVersion
    );

    // 3.2 Draft & prerelease filtering + `--check`
    feedMode = 'normal_101';
    const checkRes = await upgrader.runUpgrade({ feedUrl, checkOnly: true, logger: silentLog });
    check(
      '3.2 "--check" filters out draft (v1.0.5) & prerelease (v1.0.4-beta.1) and identifies stable v1.0.1',
      checkRes.success === true &&
        checkRes.action === 'check' &&
        checkRes.availableVersion === validNextVersion &&
        upgrader.getInstalledVersion() === baseVersion
    );

    // 3.3 Already up-to-date check
    const upToDateRes = await upgrader.runUpgrade({
      feedUrl,
      currentVersionOverride: validNextVersion,
      noLaunch: true,
      logger: silentLog
    });
    check(
      '3.3 Already up-to-date check exits cleanly without re-downloading when current >= latest',
      upToDateRes.success === true && upToDateRes.action === 'up-to-date'
    );

    // 3.4 Interrupted download (.part file) safety
    const interruptedRes = await upgrader.runUpgrade({
      feedUrl,
      simulateInterruptAfterBytes: 256,
      noLaunch: true,
      logger: silentLog
    });
    check(
      '3.4 Interrupted download aborts safely before cutover and leaves v1.0.0 active',
      interruptedRes.success === false &&
        interruptedRes.action === 'failed' &&
        upgrader.getInstalledVersion() === baseVersion
    );

    // 3.5 Tampered SHA-256 checksum rejection
    feedMode = 'tampered_checksum';
    const badHashRes = await upgrader.runUpgrade({
      feedUrl,
      noLaunch: true,
      logger: silentLog
    });
    check(
      '3.5 Tampered SHA-256 checksum is rejected before replacing current binary, preserving v1.0.0',
      badHashRes.success === false &&
        badHashRes.checksumVerified === false &&
        upgrader.getInstalledVersion() === baseVersion
    );

    // 3.6 Valid SHA-256 verified upgrade (v1.0.0 -> v1.0.1) + `~/.orion` user data preservation
    feedMode = 'normal_101';
    const upgradeRes = await upgrader.runUpgrade({
      feedUrl,
      noLaunch: true,
      logger: silentLog
    });
    const postUpgradeVerOut = execFileSync(process.execPath, [installedOrionJs, '--version'], {
      cwd: externalWorkDir,
      encoding: 'utf8',
      timeout: 15000
    }).trim();

    check(
      '3.6 Valid upgrade verifies SHA-256, cuts over atomically to v1.0.1, verifies --version, and preserves ~/.orion user config & data',
      upgradeRes.success === true &&
        upgradeRes.action === 'upgraded' &&
        upgradeRes.checksumVerified === true &&
        upgradeRes.installedVersion === validNextVersion &&
        upgradeRes.userConfigPreserved === true &&
        postUpgradeVerOut.includes(`ORION v${validNextVersion}`) &&
        fs.readFileSync(userPrefsPath, 'utf8') === expectedPrefsJson &&
        fs.readFileSync(userCustomDataPath, 'utf8') === expectedNotesJson,
      `postUpgradeVerOut="${postUpgradeVerOut}"`
    );

    // 3.7 Broken v1.0.2 release archive rejected / rolled back automatically, keeping v1.0.1 intact
    feedMode = 'broken_102';
    const brokenUpgradeRes = await upgrader.runUpgrade({
      feedUrl,
      noLaunch: true,
      logger: silentLog
    });
    const afterBrokenAttemptVer = execFileSync(process.execPath, [installedOrionJs, '--version'], {
      cwd: externalWorkDir,
      encoding: 'utf8',
      timeout: 15000
    }).trim();

    check(
      '3.7 Structurally broken v1.0.2 release fails verification before/at cutover and keeps v1.0.1 healthy and executable',
      brokenUpgradeRes.success === false &&
        upgrader.getInstalledVersion() === validNextVersion &&
        afterBrokenAttemptVer.includes(`ORION v${validNextVersion}`)
    );

    // 3.8 Manual `orion upgrade --rollback` restores previous v1.0.0 release cleanly
    const rollbackRes = await upgrader.runUpgrade({
      rollback: true,
      logger: silentLog
    });
    const afterRollbackVer = execFileSync(process.execPath, [installedOrionJs, '--version'], {
      cwd: externalWorkDir,
      encoding: 'utf8',
      timeout: 15000
    }).trim();

    check(
      '3.8 Manual "orion upgrade --rollback" restores previous v1.0.0 snapshot and verifies executable health',
      rollbackRes.success === true &&
        rollbackRes.action === 'rolled-back' &&
        rollbackRes.rolledBack === true &&
        rollbackRes.installedVersion === baseVersion &&
        afterRollbackVer.includes(`ORION v${baseVersion}`)
    );
  } finally {
    if (prevOrionHome === undefined) {
      delete process.env.ORION_HOME;
    } else {
      process.env.ORION_HOME = prevOrionHome;
    }
    if (server) {
      (server as any).closeAllConnections?.();
      await new Promise<void>((resolve) => server!.close(() => resolve()));
    }
    try {
      fs.rmSync(tmpSandbox, { recursive: true, force: true });
    } catch {}
  }

  console.log('\n================================================================================');
  console.log(`ORION GLOBAL CLI INSTALL & UPGRADE SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('================================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSuite()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Unhandled error in OrionGlobalCliInstallAndUpgrade.test.ts:', err);
    process.exit(1);
  });
