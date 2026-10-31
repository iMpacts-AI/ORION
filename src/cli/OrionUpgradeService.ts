import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync, spawn } from 'child_process';
import { Readable } from 'stream';
import { resolveOrionUserHomeDir } from '../tui/VisualPreferences';

export const OFFICIAL_GITHUB_RELEASES_API_URL =
  'https://api.github.com/repos/iMpacts-AI/ORION/releases';

export interface OrionInstallManifest {
  product: 'ORION';
  currentVersion: string;
  previousVersion: string | null;
  installedAt: string;
  currentReleaseDir: string;
  previousReleaseDir: string | null;
  checksumSha256?: string;
  sourceType: 'local-source' | 'github-release';
  feedUrl?: string;
}

export interface GithubReleaseAssetInfo {
  name: string;
  browser_download_url: string;
  size?: number;
  digest?: string;
}

export interface GithubReleaseInfo {
  tag_name: string;
  name?: string;
  draft: boolean;
  prerelease: boolean;
  published_at?: string;
  body?: string;
  html_url?: string;
  assets: GithubReleaseAssetInfo[];
}

export interface ReleaseUpdateCheckResult {
  checked: boolean;
  feedUrl: string;
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  releaseTag?: string;
  releaseUrl?: string;
  archiveAsset?: GithubReleaseAssetInfo;
  checksumAsset?: GithubReleaseAssetInfo;
  inlineSha256?: string;
  releaseNotes?: string;
  reason?: string;
}

export interface UpgradeExecutionOptions {
  installBaseDir?: string;
  currentVersionOverride?: string;
  feedUrl?: string;
  checkOnly?: boolean;
  noLaunch?: boolean;
  rollback?: boolean;
  allowPrerelease?: boolean;
  simulateInterruptAfterBytes?: number;
  logger?: (line: string) => void;
}

export interface UpgradeExecutionResult {
  success: boolean;
  action: 'check' | 'up-to-date' | 'no-release' | 'upgraded' | 'rolled-back' | 'failed';
  currentVersion: string;
  availableVersion: string | null;
  installedVersion: string | null;
  checksumVerified: boolean;
  rolledBack: boolean;
  launchedNewVersion: boolean;
  userConfigPreserved: boolean;
  installBaseDir: string;
  activeReleaseDir?: string;
  error?: string;
}

export interface InstallHealthReport {
  healthy: boolean;
  installRoot: string;
  version: string | null;
  missingPaths: string[];
  recoveryInstructions: string[];
}

export function normalizeSemver(raw: string): string {
  return String(raw || '')
    .trim()
    .replace(/^v/i, '')
    .split('+')[0];
}

export function isValidSemver(raw: string): boolean {
  const norm = normalizeSemver(raw);
  return /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(norm);
}

/**
 * Compares two semver strings (`a` vs `b`): returns 1 if a > b, -1 if a < b, 0 if equal.
 * Stable releases outrank prereleases of the same major.minor.patch.
 */
export function compareSemver(aRaw: string, bRaw: string): number {
  const aClean = normalizeSemver(aRaw);
  const bClean = normalizeSemver(bRaw);
  const [aCore, aPre] = aClean.split('-', 2);
  const [bCore, bPre] = bClean.split('-', 2);
  const aParts = aCore.split('.').map((n) => parseInt(n, 10) || 0);
  const bParts = bCore.split('.').map((n) => parseInt(n, 10) || 0);

  for (let i = 0; i < 3; i++) {
    const av = aParts[i] || 0;
    const bv = bParts[i] || 0;
    if (av > bv) return 1;
    if (av < bv) return -1;
  }

  if (!aPre && bPre) return 1;
  if (aPre && !bPre) return -1;
  if (aPre && bPre) return aPre.localeCompare(bPre);
  return 0;
}

export function resolveOrionInstallBaseDir(customBaseDir?: string): string {
  if (customBaseDir && customBaseDir.trim()) {
    return path.resolve(customBaseDir.trim());
  }
  if (process.env.ORION_INSTALL_BASE_DIR && process.env.ORION_INSTALL_BASE_DIR.trim()) {
    return path.resolve(process.env.ORION_INSTALL_BASE_DIR.trim());
  }
  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
    return path.join(localAppData, 'orion');
  }
  return path.join(os.homedir(), '.local', 'share', 'orion');
}

export function verifyTrustedFeedUrl(feedUrl: string): { trusted: boolean; reason?: string } {
  try {
    const parsed = new URL(feedUrl);
    if (parsed.protocol === 'https:') {
      return { trusted: true };
    }
    if (
      parsed.protocol === 'http:' &&
      (parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost')
    ) {
      return { trusted: true };
    }
    return {
      trusted: false,
      reason: `Refusing insecure non-HTTPS release feed protocol (${parsed.protocol}) for host '${parsed.hostname}'.`
    };
  } catch (err: any) {
    return {
      trusted: false,
      reason: `Invalid release feed URL: ${err?.message || String(err)}`
    };
  }
}

export function computeFileSha256(filePath: string): string {
  const hash = crypto.createHash('sha256');
  const buf = fs.readFileSync(filePath);
  hash.update(buf);
  return hash.digest('hex').toLowerCase();
}

export function parseExpectedSha256Text(rawText: string, archiveName?: string): string | null {
  const lines = String(rawText || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (archiveName) {
    for (const line of lines) {
      const m = line.match(/^([a-fA-F0-9]{64})\s+\*?(.+)$/);
      if (m && path.basename(m[2].trim()) === archiveName) {
        return m[1].toLowerCase();
      }
    }
  }

  for (const line of lines) {
    const m = line.match(/\b([a-fA-F0-9]{64})\b/);
    if (m) return m[1].toLowerCase();
  }
  return null;
}

/**
 * Verifies the structural health of an ORION installation root before startup or after upgrade.
 */
export function verifyOrionInstallationHealth(installRoot: string): InstallHealthReport {
  const resolved = path.resolve(installRoot);
  const requiredRelPaths = [
    'package.json',
    path.join('bin', 'orion.js'),
    path.join('src', 'cli', 'OrionCliApp.ts'),
    path.join('src', 'cli', 'OrionCliKernel.ts'),
    path.join('assets', 'mascot', 'oris-sprite.json'),
    path.join('config', 'policies', 'orion-protected-policy.v1.json'),
    path.join('node_modules', 'typescript', 'package.json')
  ];

  const missingPaths: string[] = [];
  for (const rel of requiredRelPaths) {
    if (!fs.existsSync(path.join(resolved, rel))) {
      missingPaths.push(rel.replace(/\\/g, '/'));
    }
  }

  let version: string | null = null;
  try {
    const pkgRaw = fs.readFileSync(path.join(resolved, 'package.json'), 'utf8');
    const pkg = JSON.parse(pkgRaw);
    if (typeof pkg?.version === 'string') {
      version = pkg.version;
    }
  } catch {
    if (!missingPaths.includes('package.json')) {
      missingPaths.push('package.json (invalid JSON)');
    }
  }

  const healthy = missingPaths.length === 0 && Boolean(version);
  const recoveryInstructions = healthy
    ? []
    : [
        'Run `orion upgrade --rollback` to restore the previous verified ORION release.',
        'Or run `orion upgrade --no-launch` to download and verify a clean stable release.',
        'If reinstalling from local source, run `npm run install:cli` inside the ORION source directory.'
      ];

  return {
    healthy,
    installRoot: resolved,
    version,
    missingPaths,
    recoveryInstructions
  };
}

function removeLinkOrDirSync(targetPath: string): void {
  if (!fs.existsSync(targetPath)) {
    try {
      const lst = fs.lstatSync(targetPath);
      if (lst.isSymbolicLink()) fs.unlinkSync(targetPath);
    } catch {}
    return;
  }
  try {
    const lst = fs.lstatSync(targetPath);
    if (lst.isSymbolicLink()) {
      try {
        fs.unlinkSync(targetPath);
        return;
      } catch {
        fs.rmSync(targetPath, { recursive: true, force: true });
        return;
      }
    }
  } catch {}
  fs.rmSync(targetPath, { recursive: true, force: true });
}

function linkOrCopyDirectorySync(sourceDir: string, linkPath: string): void {
  removeLinkOrDirSync(linkPath);
  fs.mkdirSync(path.dirname(linkPath), { recursive: true });
  const linkType = process.platform === 'win32' ? 'junction' : 'dir';
  try {
    fs.symlinkSync(sourceDir, linkPath, linkType);
  } catch {
    fs.cpSync(sourceDir, linkPath, { recursive: true });
  }
}

function copyReleaseTreeSync(sourceDir: string, destDir: string): void {
  fs.mkdirSync(destDir, { recursive: true });
  const copyEntries = ['package.json', 'README.md', 'bin', 'src', 'assets', 'config', 'docs'];
  for (const entry of copyEntries) {
    const srcPath = path.join(sourceDir, entry);
    if (!fs.existsSync(srcPath)) continue;
    const dstPath = path.join(destDir, entry);
    fs.cpSync(srcPath, dstPath, {
      recursive: true,
      filter: (src) => {
        const base = path.basename(src);
        return base !== '.git' && base !== '.orion_memory' && base !== 'node_modules';
      }
    });
  }
}

export class OrionUpgradeService {
  private readonly installBaseDir: string;

  constructor(customInstallBaseDir?: string) {
    this.installBaseDir = resolveOrionInstallBaseDir(customInstallBaseDir);
  }

  public getInstallBaseDir(): string {
    return this.installBaseDir;
  }

  public getReleasesDir(): string {
    return path.join(this.installBaseDir, 'releases');
  }

  public getCurrentDir(): string {
    return path.join(this.installBaseDir, 'current');
  }

  public getPreviousDir(): string {
    return path.join(this.installBaseDir, 'previous');
  }

  public getStagingDir(): string {
    return path.join(this.installBaseDir, 'staging');
  }

  public getBinDir(): string {
    return path.join(this.installBaseDir, 'bin');
  }

  public getManifestPath(): string {
    return path.join(this.installBaseDir, 'install-manifest.json');
  }

  public readManifest(): OrionInstallManifest | null {
    const p = this.getManifestPath();
    if (!fs.existsSync(p)) return null;
    try {
      return JSON.parse(fs.readFileSync(p, 'utf8')) as OrionInstallManifest;
    } catch {
      return null;
    }
  }

  private writeManifest(manifest: OrionInstallManifest): void {
    fs.mkdirSync(this.installBaseDir, { recursive: true });
    const tmp = `${this.getManifestPath()}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    fs.renameSync(tmp, this.getManifestPath());
  }

  public getInstalledVersion(fallbackVersion = '0.0.0'): string {
    const currentPkg = path.join(this.getCurrentDir(), 'package.json');
    if (fs.existsSync(currentPkg)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(currentPkg, 'utf8'));
        if (typeof parsed?.version === 'string') {
          return normalizeSemver(parsed.version);
        }
      } catch {}
    }
    const manifest = this.readManifest();
    if (manifest?.currentVersion) {
      return normalizeSemver(manifest.currentVersion);
    }
    return normalizeSemver(fallbackVersion);
  }

  /**
   * Executes `node <releaseDir>/bin/orion.js --version` in an isolated working directory
   * (`os.tmpdir()`) to prove the release runs standalone outside any source repository.
   */
  public verifyReleaseExecutable(releaseDir: string, expectedVersion?: string): {
    ok: boolean;
    reportedOutput: string;
    error?: string;
  } {
    const health = verifyOrionInstallationHealth(releaseDir);
    if (!health.healthy) {
      return {
        ok: false,
        reportedOutput: '',
        error: `Missing required release files: ${health.missingPaths.join(', ')}`
      };
    }

    const orionEntry = path.join(releaseDir, 'bin', 'orion.js');
    try {
      const out = execFileSync(process.execPath, [orionEntry, '--version'], {
        cwd: os.tmpdir(),
        encoding: 'utf8',
        timeout: 15000,
        stdio: ['ignore', 'pipe', 'pipe']
      }).trim();

      if (!out.includes('ORION v')) {
        return {
          ok: false,
          reportedOutput: out,
          error: `Unexpected --version output: ${out}`
        };
      }
      if (expectedVersion && !out.includes(`v${normalizeSemver(expectedVersion)}`)) {
        return {
          ok: false,
          reportedOutput: out,
          error: `Expected version v${normalizeSemver(expectedVersion)}, got: ${out}`
        };
      }
      return { ok: true, reportedOutput: out };
    } catch (err: any) {
      return {
        ok: false,
        reportedOutput: '',
        error: err?.message || String(err)
      };
    }
  }

  /**
   * Generates resilient global CLI wrapper shims (`orion.cmd`, `orion.ps1`, `orion`)
   * pointing strictly to the installed `<installBase>/current/bin/orion.js` release,
   * with clear diagnostics if the installation is missing or corrupted.
   */
  public writeGlobalShims(options?: { alsoSyncGlobalNpmShim?: boolean }): {
    binDir: string;
    writtenFiles: string[];
  } {
    const binDir = this.getBinDir();
    fs.mkdirSync(binDir, { recursive: true });
    const currentOrionJs = path.join(this.getCurrentDir(), 'bin', 'orion.js');
    const writtenFiles: string[] = [];

    if (process.platform === 'win32') {
      const cmdContent = [
        '@echo off',
        `set "ORION_ENTRY=${currentOrionJs}"`,
        'if not exist "%ORION_ENTRY%" (',
        '  echo [ORION] Installation missing or corrupted at "%ORION_ENTRY%". 1>&2',
        '  echo [ORION] Recovery: run "npm run install:cli" from the ORION package or reinstall ORION. 1>&2',
        '  exit /b 1',
        ')',
        'node "%ORION_ENTRY%" %*',
        ''
      ].join('\r\n');

      const ps1Content = [
        '[CmdletBinding()]',
        'param(',
        '    [Parameter(ValueFromRemainingArguments = $true)]',
        '    [string[]]$ScriptArgs',
        ')',
        `$orionEntry = "${currentOrionJs}"`,
        'if (-not (Test-Path -LiteralPath $orionEntry)) {',
        '    [Console]::Error.WriteLine("[ORION] Installation missing or corrupted at \'$orionEntry\'.")',
        '    [Console]::Error.WriteLine("[ORION] Recovery: run \'npm run install:cli\' or reinstall the latest ORION release.")',
        '    exit 1',
        '}',
        '& node $orionEntry @ScriptArgs',
        'exit $LASTEXITCODE',
        ''
      ].join('\r\n');

      const shContent = [
        '#!/bin/sh',
        `ORION_ENTRY="${currentOrionJs.replace(/\\/g, '/')}"`,
        'if [ ! -f "$ORION_ENTRY" ]; then',
        '  echo "[ORION] Installation missing or corrupted at $ORION_ENTRY." >&2',
        '  exit 1',
        'fi',
        'exec node "$ORION_ENTRY" "$@"',
        ''
      ].join('\n');

      const cmdPath = path.join(binDir, 'orion.cmd');
      const ps1Path = path.join(binDir, 'orion.ps1');
      const shPath = path.join(binDir, 'orion');

      fs.writeFileSync(cmdPath, cmdContent, 'utf8');
      fs.writeFileSync(ps1Path, ps1Content, 'utf8');
      fs.writeFileSync(shPath, shContent, 'utf8');
      writtenFiles.push(cmdPath, ps1Path, shPath);

      // If an earlier `npm link` created shims in `%APPDATA%\npm` pointing directly to a dev repo,
      // update them (when installing to the real default base dir) so `orion` always launches the installed release!
      if (options?.alsoSyncGlobalNpmShim && process.env.APPDATA) {
        const npmBinDir = path.join(process.env.APPDATA, 'npm');
        const npmCmd = path.join(npmBinDir, 'orion.cmd');
        const npmPs1 = path.join(npmBinDir, 'orion.ps1');
        const npmSh = path.join(npmBinDir, 'orion');
        if (fs.existsSync(npmBinDir) && (fs.existsSync(npmCmd) || fs.existsSync(npmPs1))) {
          try {
            fs.writeFileSync(npmCmd, cmdContent, 'utf8');
            fs.writeFileSync(npmPs1, ps1Content, 'utf8');
            fs.writeFileSync(npmSh, shContent, 'utf8');
            writtenFiles.push(npmCmd, npmPs1, npmSh);
          } catch {}
        }
      }
    } else {
      const shContent = [
        '#!/usr/bin/env sh',
        `ORION_ENTRY="${currentOrionJs}"`,
        'if [ ! -f "$ORION_ENTRY" ]; then',
        '  echo "[ORION] Installation missing or corrupted at $ORION_ENTRY." >&2',
        '  echo "[ORION] Recovery: reinstall ORION or run npm run install:cli." >&2',
        '  exit 1',
        'fi',
        'exec node "$ORION_ENTRY" "$@"',
        ''
      ].join('\n');
      const shPath = path.join(binDir, 'orion');
      fs.writeFileSync(shPath, shContent, { encoding: 'utf8', mode: 0o755 });
      try {
        fs.chmodSync(shPath, 0o755);
      } catch {}
      writtenFiles.push(shPath);
    }

    return { binDir, writtenFiles };
  }

  /**
   * Provisions a standalone installed ORION release from a local package/source directory
   * into `<installBase>/releases/v<version>` + `<installBase>/current` + `<installBase>/bin`.
   */
  public installFromLocalSource(
    sourceDir: string,
    options?: { syncGlobalNpmShim?: boolean; copyNodeModules?: boolean }
  ): {
    version: string;
    releaseDir: string;
    currentDir: string;
    binDir: string;
    verifiedVersionOutput: string;
  } {
    const resolvedSource = path.resolve(sourceDir);
    const pkgPath = path.join(resolvedSource, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      throw new Error(`Cannot install ORION: package.json not found at ${resolvedSource}`);
    }
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const version = normalizeSemver(pkg.version || '1.0.0');
    const releaseDir = path.join(this.getReleasesDir(), `v${version}`);

    fs.mkdirSync(this.getReleasesDir(), { recursive: true });
    removeLinkOrDirSync(releaseDir);
    copyReleaseTreeSync(resolvedSource, releaseDir);

    const srcNodeModules = path.join(resolvedSource, 'node_modules');
    const dstNodeModules = path.join(releaseDir, 'node_modules');
    if (fs.existsSync(srcNodeModules)) {
      if (options?.copyNodeModules) {
        fs.cpSync(srcNodeModules, dstNodeModules, { recursive: true });
      } else {
        linkOrCopyDirectorySync(srcNodeModules, dstNodeModules);
      }
    }

    const verification = this.verifyReleaseExecutable(releaseDir, version);
    if (!verification.ok) {
      throw new Error(`Staged release verification failed: ${verification.error}`);
    }

    const prevManifest = this.readManifest();
    let previousVersion: string | null = prevManifest?.currentVersion || null;
    let previousReleaseDir: string | null = prevManifest?.currentReleaseDir || null;

    if (
      previousReleaseDir &&
      fs.existsSync(previousReleaseDir) &&
      path.resolve(previousReleaseDir) !== path.resolve(releaseDir)
    ) {
      linkOrCopyDirectorySync(previousReleaseDir, this.getPreviousDir());
    } else {
      previousVersion = prevManifest?.previousVersion || null;
      previousReleaseDir = prevManifest?.previousReleaseDir || null;
    }

    linkOrCopyDirectorySync(releaseDir, this.getCurrentDir());
    const shims = this.writeGlobalShims({
      alsoSyncGlobalNpmShim: options?.syncGlobalNpmShim ?? false
    });

    this.writeManifest({
      product: 'ORION',
      currentVersion: version,
      previousVersion,
      installedAt: new Date().toISOString(),
      currentReleaseDir: releaseDir,
      previousReleaseDir,
      sourceType: 'local-source'
    });

    return {
      version,
      releaseDir,
      currentDir: this.getCurrentDir(),
      binDir: shims.binDir,
      verifiedVersionOutput: verification.reportedOutput
    };
  }

  /**
   * Queries the official GitHub Releases feed (or configured test feed) for the latest stable release.
   */
  public async checkLatestRelease(options?: {
    feedUrl?: string;
    currentVersionOverride?: string;
    allowPrerelease?: boolean;
  }): Promise<ReleaseUpdateCheckResult> {
    const feedUrl =
      options?.feedUrl ||
      process.env.ORION_RELEASE_FEED_URL ||
      OFFICIAL_GITHUB_RELEASES_API_URL;
    const currentVersion = normalizeSemver(
      options?.currentVersionOverride || this.getInstalledVersion('1.0.0')
    );

    const trust = verifyTrustedFeedUrl(feedUrl);
    if (!trust.trusted) {
      return {
        checked: false,
        feedUrl,
        currentVersion,
        latestVersion: null,
        updateAvailable: false,
        reason: trust.reason
      };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(feedUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': `ORION-CLI-Updater/${currentVersion}`
        },
        signal: controller.signal
      });
      clearTimeout(timer);

      if (res.status === 404) {
        return {
          checked: true,
          feedUrl,
          currentVersion,
          latestVersion: null,
          updateAvailable: false,
          reason: 'No published stable releases found on the official distribution feed yet.'
        };
      }

      if (!res.ok) {
        return {
          checked: false,
          feedUrl,
          currentVersion,
          latestVersion: null,
          updateAvailable: false,
          reason: `Release feed returned HTTP ${res.status}.`
        };
      }

      const payload: unknown = await res.json();
      const rawList: GithubReleaseInfo[] = Array.isArray(payload)
        ? (payload as GithubReleaseInfo[])
        : payload && typeof payload === 'object' && 'tag_name' in (payload as any)
          ? [payload as GithubReleaseInfo]
          : [];

      const eligible = rawList
        .filter((r) => {
          if (!r || typeof r.tag_name !== 'string') return false;
          if (r.draft) return false;
          if (r.prerelease && !options?.allowPrerelease) return false;
          return isValidSemver(r.tag_name);
        })
        .sort((a, b) => compareSemver(b.tag_name, a.tag_name));

      if (eligible.length === 0) {
        return {
          checked: true,
          feedUrl,
          currentVersion,
          latestVersion: null,
          updateAvailable: false,
          reason: 'No stable (non-draft, non-prerelease) ORION releases are currently published.'
        };
      }

      const best = eligible[0];
      const latestVersion = normalizeSemver(best.tag_name);
      const assets = Array.isArray(best.assets) ? best.assets : [];

      const archiveAsset = assets.find((a) =>
        /\.(?:tar\.gz|tgz|zip)$/i.test(String(a?.name || ''))
      );
      const checksumAsset =
        assets.find(
          (a) =>
            archiveAsset &&
            String(a?.name || '').toLowerCase() === `${archiveAsset.name.toLowerCase()}.sha256`
        ) ||
        assets.find((a) => /(?:sha256|checksums?)/i.test(String(a?.name || '')));

      let inlineSha256: string | undefined;
      if (archiveAsset?.digest && /^sha256:[a-f0-9]{64}$/i.test(archiveAsset.digest)) {
        inlineSha256 = archiveAsset.digest.slice('sha256:'.length).toLowerCase();
      }

      return {
        checked: true,
        feedUrl,
        currentVersion,
        latestVersion,
        updateAvailable: compareSemver(latestVersion, currentVersion) > 0,
        releaseTag: best.tag_name,
        releaseUrl: best.html_url,
        archiveAsset,
        checksumAsset,
        inlineSha256,
        releaseNotes: best.body
      };
    } catch (err: any) {
      clearTimeout(timer);
      return {
        checked: false,
        feedUrl,
        currentVersion,
        latestVersion: null,
        updateAvailable: false,
        reason: `Unable to reach release feed: ${err?.message || String(err)}`
      };
    }
  }

  private cleanupInterruptedPartFiles(): number {
    const stagingDir = this.getStagingDir();
    if (!fs.existsSync(stagingDir)) return 0;
    let cleaned = 0;
    for (const entry of fs.readdirSync(stagingDir)) {
      if (entry.endsWith('.part')) {
        try {
          fs.rmSync(path.join(stagingDir, entry), { force: true });
          cleaned++;
        } catch {}
      }
    }
    return cleaned;
  }

  private async downloadToStagingWithPart(
    downloadUrl: string,
    destFinalPath: string,
    simulateInterruptAfterBytes?: number
  ): Promise<void> {
    const trust = verifyTrustedFeedUrl(downloadUrl);
    if (!trust.trusted) {
      throw new Error(trust.reason || 'Untrusted download URL');
    }

    fs.mkdirSync(path.dirname(destFinalPath), { recursive: true });
    const partPath = `${destFinalPath}.part`;
    if (fs.existsSync(partPath)) {
      fs.rmSync(partPath, { force: true });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);
    let fd: number | null = null;

    try {
      const res = await fetch(downloadUrl, {
        method: 'GET',
        headers: { 'User-Agent': 'ORION-CLI-Updater' },
        signal: controller.signal
      });
      if (!res.ok || !res.body) {
        throw new Error(`Download failed with HTTP ${res.status}`);
      }

      fd = fs.openSync(partPath, 'w');
      let bytesWritten = 0;
      const nodeStream = Readable.fromWeb(res.body as any);
      for await (const chunk of nodeStream) {
        const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        if (
          simulateInterruptAfterBytes !== undefined &&
          bytesWritten + buf.length >= simulateInterruptAfterBytes
        ) {
          const partialSlice = buf.subarray(
            0,
            Math.max(1, simulateInterruptAfterBytes - bytesWritten)
          );
          fs.writeSync(fd, partialSlice);
          throw new Error('Simulated network interruption during release download.');
        }
        fs.writeSync(fd, buf);
        bytesWritten += buf.length;
      }
      fs.closeSync(fd);
      fd = null;
      clearTimeout(timer);

      if (bytesWritten === 0) {
        throw new Error('Downloaded archive was empty (0 bytes).');
      }

      if (fs.existsSync(destFinalPath)) {
        fs.rmSync(destFinalPath, { force: true });
      }
      fs.renameSync(partPath, destFinalPath);
    } catch (err) {
      clearTimeout(timer);
      if (fd !== null) {
        try {
          fs.closeSync(fd);
        } catch {}
      }
      throw err;
    }
  }

  private extractArchiveToDirectory(archivePath: string, extractDir: string): string {
    removeLinkOrDirSync(extractDir);
    fs.mkdirSync(extractDir, { recursive: true });

    const lowerName = archivePath.toLowerCase();
    if (lowerName.endsWith('.tar.gz') || lowerName.endsWith('.tgz')) {
      execFileSync('tar', ['-xzf', archivePath, '-C', extractDir], {
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 60000
      });
    } else if (lowerName.endsWith('.zip')) {
      if (process.platform === 'win32') {
        execFileSync(
          'powershell',
          [
            '-NoProfile',
            '-Command',
            `Expand-Archive -LiteralPath '${archivePath.replace(/'/g, "''")}' -DestinationPath '${extractDir.replace(/'/g, "''")}' -Force`
          ],
          { stdio: ['ignore', 'pipe', 'pipe'], timeout: 60000 }
        );
      } else {
        execFileSync('tar', ['-xf', archivePath, '-C', extractDir], {
          stdio: ['ignore', 'pipe', 'pipe'],
          timeout: 60000
        });
      }
    } else {
      throw new Error(`Unsupported release archive format: ${path.basename(archivePath)}`);
    }

    // Support both flat archives and single top-level directory archives (`orion-v1.1.0/...`)
    if (fs.existsSync(path.join(extractDir, 'package.json'))) {
      return extractDir;
    }
    const entries = fs.readdirSync(extractDir);
    if (entries.length === 1) {
      const nested = path.join(extractDir, entries[0]);
      if (fs.statSync(nested).isDirectory() && fs.existsSync(path.join(nested, 'package.json'))) {
        return nested;
      }
    }
    throw new Error('Extracted release archive does not contain a valid ORION package.json root.');
  }

  /**
   * Rolls back `<installBase>/current` to `<installBase>/previous` safely.
   */
  public rollbackToPrevious(logger?: (msg: string) => void): UpgradeExecutionResult {
    const log = logger || (() => {});
    const currentVersion = this.getInstalledVersion('0.0.0');
    const manifest = this.readManifest();
    const prevDir = manifest?.previousReleaseDir || this.getPreviousDir();

    if (!prevDir || !fs.existsSync(prevDir)) {
      return {
        success: false,
        action: 'failed',
        currentVersion,
        availableVersion: null,
        installedVersion: currentVersion,
        checksumVerified: false,
        rolledBack: false,
        launchedNewVersion: false,
        userConfigPreserved: true,
        installBaseDir: this.installBaseDir,
        error: 'No previous ORION installation snapshot is available for rollback.'
      };
    }

    const checkPrev = this.verifyReleaseExecutable(prevDir);
    if (!checkPrev.ok) {
      return {
        success: false,
        action: 'failed',
        currentVersion,
        availableVersion: null,
        installedVersion: currentVersion,
        checksumVerified: false,
        rolledBack: false,
        launchedNewVersion: false,
        userConfigPreserved: true,
        installBaseDir: this.installBaseDir,
        error: `Previous snapshot failed verification: ${checkPrev.error}`
      };
    }

    const prevPkg = JSON.parse(fs.readFileSync(path.join(prevDir, 'package.json'), 'utf8'));
    const restoredVersion = normalizeSemver(prevPkg.version || '1.0.0');
    linkOrCopyDirectorySync(prevDir, this.getCurrentDir());
    this.writeGlobalShims({ alsoSyncGlobalNpmShim: false });

    this.writeManifest({
      product: 'ORION',
      currentVersion: restoredVersion,
      previousVersion: currentVersion,
      installedAt: new Date().toISOString(),
      currentReleaseDir: prevDir,
      previousReleaseDir: manifest?.currentReleaseDir || null,
      sourceType: manifest?.sourceType || 'local-source'
    });

    log(`[✓] Rolled back ORION from v${currentVersion} to v${restoredVersion}.`);
    return {
      success: true,
      action: 'rolled-back',
      currentVersion,
      availableVersion: restoredVersion,
      installedVersion: restoredVersion,
      checksumVerified: false,
      rolledBack: true,
      launchedNewVersion: false,
      userConfigPreserved: true,
      installBaseDir: this.installBaseDir,
      activeReleaseDir: prevDir
    };
  }

  /**
   * Executes the full 9-stage `orion upgrade` lifecycle safely.
   */
  public async runUpgrade(options: UpgradeExecutionOptions = {}): Promise<UpgradeExecutionResult> {
    const log = options.logger || ((line: string) => console.log(line));

    if (options.rollback) {
      return this.rollbackToPrevious(log);
    }

    // Snapshot user config/data directory state before upgrade to verify 100% preservation
    const userHomeDir = resolveOrionUserHomeDir();
    const userHomeEntriesBefore = fs.existsSync(userHomeDir)
      ? fs.readdirSync(userHomeDir).sort()
      : [];

    const cleanedParts = this.cleanupInterruptedPartFiles();
    if (cleanedParts > 0) {
      log(`[i] Cleaned up ${cleanedParts} interrupted partial download (.part) file(s).`);
    }

    // 1. Check latest available stable ORION release
    const check = await this.checkLatestRelease({
      feedUrl: options.feedUrl,
      currentVersionOverride: options.currentVersionOverride,
      allowPrerelease: options.allowPrerelease
    });

    // 2. Display current and available versions
    log(`Current installed version : v${check.currentVersion}`);
    log(
      `Latest available stable   : ${
        check.latestVersion ? `v${check.latestVersion}` : 'none published'
      }`
    );

    if (!check.checked) {
      return {
        success: false,
        action: 'failed',
        currentVersion: check.currentVersion,
        availableVersion: null,
        installedVersion: check.currentVersion,
        checksumVerified: false,
        rolledBack: false,
        launchedNewVersion: false,
        userConfigPreserved: true,
        installBaseDir: this.installBaseDir,
        error: check.reason || 'Release check failed.'
      };
    }

    if (!check.latestVersion) {
      log(`[i] ${check.reason || 'No published stable releases found.'}`);
      return {
        success: true,
        action: 'no-release',
        currentVersion: check.currentVersion,
        availableVersion: null,
        installedVersion: check.currentVersion,
        checksumVerified: false,
        rolledBack: false,
        launchedNewVersion: false,
        userConfigPreserved: true,
        installBaseDir: this.installBaseDir
      };
    }

    if (options.checkOnly) {
      log(
        check.updateAvailable
          ? `[i] Update available: v${check.currentVersion} -> v${check.latestVersion}. Run 'orion upgrade' to install.`
          : `[✓] ORION is up to date (v${check.currentVersion}).`
      );
      return {
        success: true,
        action: 'check',
        currentVersion: check.currentVersion,
        availableVersion: check.latestVersion,
        installedVersion: check.currentVersion,
        checksumVerified: false,
        rolledBack: false,
        launchedNewVersion: false,
        userConfigPreserved: true,
        installBaseDir: this.installBaseDir
      };
    }

    if (!check.updateAvailable) {
      log(`[✓] ORION is already on the latest stable version (v${check.currentVersion}).`);
      return {
        success: true,
        action: 'up-to-date',
        currentVersion: check.currentVersion,
        availableVersion: check.latestVersion,
        installedVersion: check.currentVersion,
        checksumVerified: false,
        rolledBack: false,
        launchedNewVersion: false,
        userConfigPreserved: true,
        installBaseDir: this.installBaseDir
      };
    }

    if (!check.archiveAsset?.browser_download_url) {
      return {
        success: false,
        action: 'failed',
        currentVersion: check.currentVersion,
        availableVersion: check.latestVersion,
        installedVersion: check.currentVersion,
        checksumVerified: false,
        rolledBack: false,
        launchedNewVersion: false,
        userConfigPreserved: true,
        installBaseDir: this.installBaseDir,
        error: `Release v${check.latestVersion} does not publish a downloadable release archive (.tar.gz/.zip).`
      };
    }

    // 3 & 4. Retrieve official checksum & release archive and verify SHA-256 BEFORE touching current installation
    let expectedSha256: string | null = check.inlineSha256 || null;
    if (!expectedSha256 && check.checksumAsset?.browser_download_url) {
      const trustChecksum = verifyTrustedFeedUrl(check.checksumAsset.browser_download_url);
      if (!trustChecksum.trusted) {
        return {
          success: false,
          action: 'failed',
          currentVersion: check.currentVersion,
          availableVersion: check.latestVersion,
          installedVersion: check.currentVersion,
          checksumVerified: false,
          rolledBack: false,
          launchedNewVersion: false,
          userConfigPreserved: true,
          installBaseDir: this.installBaseDir,
          error: trustChecksum.reason
        };
      }
      const csRes = await fetch(check.checksumAsset.browser_download_url);
      if (!csRes.ok) {
        return {
          success: false,
          action: 'failed',
          currentVersion: check.currentVersion,
          availableVersion: check.latestVersion,
          installedVersion: check.currentVersion,
          checksumVerified: false,
          rolledBack: false,
          launchedNewVersion: false,
          userConfigPreserved: true,
          installBaseDir: this.installBaseDir,
          error: `Failed to retrieve SHA-256 checksum asset (HTTP ${csRes.status}).`
        };
      }
      const csText = await csRes.text();
      expectedSha256 = parseExpectedSha256Text(csText, check.archiveAsset.name);
    }

    if (!expectedSha256) {
      return {
        success: false,
        action: 'failed',
        currentVersion: check.currentVersion,
        availableVersion: check.latestVersion,
        installedVersion: check.currentVersion,
        checksumVerified: false,
        rolledBack: false,
        launchedNewVersion: false,
        userConfigPreserved: true,
        installBaseDir: this.installBaseDir,
        error: `Refusing unverified upgrade: Release v${check.latestVersion} has no published SHA-256 checksum.`
      };
    }

    const stagingDir = this.getStagingDir();
    fs.mkdirSync(stagingDir, { recursive: true });
    const stagedArchivePath = path.join(stagingDir, path.basename(check.archiveAsset.name));

    try {
      log(`[1/4] Downloading ORION v${check.latestVersion} (${check.archiveAsset.name})...`);
      await this.downloadToStagingWithPart(
        check.archiveAsset.browser_download_url,
        stagedArchivePath,
        options.simulateInterruptAfterBytes
      );
    } catch (err: any) {
      this.cleanupInterruptedPartFiles();
      return {
        success: false,
        action: 'failed',
        currentVersion: check.currentVersion,
        availableVersion: check.latestVersion,
        installedVersion: check.currentVersion,
        checksumVerified: false,
        rolledBack: false,
        launchedNewVersion: false,
        userConfigPreserved: true,
        installBaseDir: this.installBaseDir,
        error: `Download interrupted or failed: ${err?.message || String(err)}`
      };
    }

    // Verify SHA-256 digest
    log('[2/4] Verifying SHA-256 release integrity...');
    const actualSha256 = computeFileSha256(stagedArchivePath);
    const expectedBuf = Buffer.from(expectedSha256, 'utf8');
    const actualBuf = Buffer.from(actualSha256, 'utf8');
    const digestMatches =
      expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf);

    if (!digestMatches) {
      try {
        fs.rmSync(stagedArchivePath, { force: true });
      } catch {}
      return {
        success: false,
        action: 'failed',
        currentVersion: check.currentVersion,
        availableVersion: check.latestVersion,
        installedVersion: check.currentVersion,
        checksumVerified: false,
        rolledBack: false,
        launchedNewVersion: false,
        userConfigPreserved: true,
        installBaseDir: this.installBaseDir,
        error: `SHA-256 INTEGRITY CHECK FAILED: expected ${expectedSha256}, got ${actualSha256}. Existing installation preserved.`
      };
    }

    // 5, 6 & 7. Extract to staging, preserve previous working installation, install & verify
    const extractDir = path.join(stagingDir, `extract-v${check.latestVersion}`);
    const targetReleaseDir = path.join(this.getReleasesDir(), `v${check.latestVersion}`);
    const manifestBefore = this.readManifest();
    const previousActiveDir =
      manifestBefore?.currentReleaseDir && fs.existsSync(manifestBefore.currentReleaseDir)
        ? manifestBefore.currentReleaseDir
        : fs.existsSync(this.getCurrentDir())
          ? fs.realpathSync(this.getCurrentDir())
          : null;

    try {
      log(`[3/4] Staging ORION v${check.latestVersion}...`);
      const extractedRoot = this.extractArchiveToDirectory(stagedArchivePath, extractDir);

      fs.mkdirSync(this.getReleasesDir(), { recursive: true });
      removeLinkOrDirSync(targetReleaseDir);
      copyReleaseTreeSync(extractedRoot, targetReleaseDir);

      // Carry over or link node_modules if archive is a slim release bundle
      const extractedNodeModules = path.join(extractedRoot, 'node_modules');
      const targetNodeModules = path.join(targetReleaseDir, 'node_modules');
      if (fs.existsSync(extractedNodeModules)) {
        fs.cpSync(extractedNodeModules, targetNodeModules, { recursive: true });
      } else if (previousActiveDir && fs.existsSync(path.join(previousActiveDir, 'node_modules'))) {
        linkOrCopyDirectorySync(path.join(previousActiveDir, 'node_modules'), targetNodeModules);
      } else if (
        process.env.ORION_INSTALL_ROOT &&
        fs.existsSync(path.join(process.env.ORION_INSTALL_ROOT, 'node_modules'))
      ) {
        linkOrCopyDirectorySync(
          path.join(process.env.ORION_INSTALL_ROOT, 'node_modules'),
          targetNodeModules
        );
      }

      // Pre-cutover verification of staged release
      const preVerify = this.verifyReleaseExecutable(targetReleaseDir, check.latestVersion);
      if (!preVerify.ok) {
        removeLinkOrDirSync(targetReleaseDir);
        throw new Error(`Staged release failed pre-cutover verification: ${preVerify.error}`);
      }

      // Preserve previous working installation before switching `current`
      if (previousActiveDir && path.resolve(previousActiveDir) !== path.resolve(targetReleaseDir)) {
        linkOrCopyDirectorySync(previousActiveDir, this.getPreviousDir());
      }

      // Atomic cutover of `current`
      linkOrCopyDirectorySync(targetReleaseDir, this.getCurrentDir());
      this.writeGlobalShims({ alsoSyncGlobalNpmShim: false });

      // 8. Verify installed version via `current/bin/orion.js --version`
      log(`[4/4] Verifying installed ORION v${check.latestVersion}...`);
      const postVerify = this.verifyReleaseExecutable(this.getCurrentDir(), check.latestVersion);
      if (!postVerify.ok) {
        // Automatic rollback!
        if (previousActiveDir && fs.existsSync(previousActiveDir)) {
          linkOrCopyDirectorySync(previousActiveDir, this.getCurrentDir());
        }
        return {
          success: false,
          action: 'failed',
          currentVersion: check.currentVersion,
          availableVersion: check.latestVersion,
          installedVersion: check.currentVersion,
          checksumVerified: true,
          rolledBack: Boolean(previousActiveDir),
          launchedNewVersion: false,
          userConfigPreserved: true,
          installBaseDir: this.installBaseDir,
          error: `Post-install verification failed (${postVerify.error}). Automatically rolled back to v${check.currentVersion}.`
        };
      }

      this.writeManifest({
        product: 'ORION',
        currentVersion: check.latestVersion,
        previousVersion: previousActiveDir ? check.currentVersion : null,
        installedAt: new Date().toISOString(),
        currentReleaseDir: targetReleaseDir,
        previousReleaseDir: previousActiveDir,
        checksumSha256: actualSha256,
        sourceType: 'github-release',
        feedUrl: check.feedUrl
      });
    } catch (err: any) {
      // Ensure previous active installation remains intact on any staging/install error
      if (previousActiveDir && fs.existsSync(previousActiveDir)) {
        try {
          linkOrCopyDirectorySync(previousActiveDir, this.getCurrentDir());
        } catch {}
      }
      return {
        success: false,
        action: 'failed',
        currentVersion: check.currentVersion,
        availableVersion: check.latestVersion,
        installedVersion: check.currentVersion,
        checksumVerified: true,
        rolledBack: Boolean(previousActiveDir),
        launchedNewVersion: false,
        userConfigPreserved: true,
        installBaseDir: this.installBaseDir,
        error: err?.message || String(err)
      };
    } finally {
      try {
        removeLinkOrDirSync(extractDir);
        if (fs.existsSync(stagedArchivePath)) {
          fs.rmSync(stagedArchivePath, { force: true });
        }
      } catch {}
    }

    const userHomeEntriesAfter = fs.existsSync(userHomeDir)
      ? fs.readdirSync(userHomeDir).sort()
      : [];
    const userConfigPreserved = userHomeEntriesBefore.every((entry) =>
      userHomeEntriesAfter.includes(entry)
    );

    log(`[✓] Successfully upgraded ORION from v${check.currentVersion} to v${check.latestVersion}.`);

    // 9. Launch the newly installed ORION version unless `--no-launch`
    let launchedNewVersion = false;
    if (!options.noLaunch) {
      const upgradedEntry = path.join(this.getCurrentDir(), 'bin', 'orion.js');
      if (fs.existsSync(upgradedEntry)) {
        log(`[→] Launching ORION v${check.latestVersion}...`);
        launchedNewVersion = true;
        await new Promise<void>((resolve) => {
          const child = spawn(process.execPath, [upgradedEntry], {
            cwd: process.cwd(),
            stdio: 'inherit'
          });
          child.on('close', () => resolve());
          child.on('error', () => resolve());
        });
      }
    }

    return {
      success: true,
      action: 'upgraded',
      currentVersion: check.currentVersion,
      availableVersion: check.latestVersion,
      installedVersion: check.latestVersion,
      checksumVerified: true,
      rolledBack: false,
      launchedNewVersion,
      userConfigPreserved,
      installBaseDir: this.installBaseDir,
      activeReleaseDir: targetReleaseDir
    };
  }
}
