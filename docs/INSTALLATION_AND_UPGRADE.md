# ORION Global CLI Installation & Safe Upgrade Guide

This document describes how **ORION** installs as a standalone global CLI executable (`orion`) and how `orion upgrade` verifies, stages, switches, and rolls back releases safely without depending on a live Git repository checkout.

---

## 1. Standalone Release Directory Layout

Unlike a `git`-bound development symlink, ORION installs a self-contained versioned release snapshot so `orion` operates reliably from **any** working directory on the machine:

- **Windows 11 (`%LOCALAPPDATA%\orion`, displayed logically as `<orion-install>`):**
  - `releases/v<version>/` — Immutable versioned release payload (`bin/`, `src/`, `assets/`, `config/`, `package.json`, `node_modules/`).
  - `current/` — Active verified release directory invoked by global shims.
  - `previous/` — Previous verified release snapshot retained automatically for instant rollback.
  - `staging/` — Temporary `.part` download and extraction workspace cleared before and after cutover.
  - `bin/` — Global executable shims (`orion.cmd`, `orion.ps1`, `orion`) registered at the front of the Windows User `PATH`.
  - `install-manifest.json` — Installed version, SHA-256 metadata, and timestamp audit record.
- **macOS & Linux (`~/.local/share/orion`, shim at `~/.local/bin/orion`):**
  - Same `releases/v<version>/`, `current/`, `previous/`, `staging/`, `bin/orion`, and `install-manifest.json` layout with POSIX `0755` wrapper permissions.
- **User Configuration & Workspace Separation:**
  - User preferences, visual settings (`visual-preferences.json`), MCP config (`mcp.json`), and operator data live under `~/.orion` (`<orion-home>`) and are **never** overwritten or deleted during installation or upgrade.
  - At runtime, `ORION_INSTALL_ROOT` points to the installed ORION release while `process.cwd()` is treated independently as the operator's active `<workspace>`.

---

## 2. Installing ORION Globally

From an ORION release archive or source checkout:

```powershell
# 1. Install dependencies and verify build
npm install
npm run build

# 2. Provision standalone global release and register `orion` in User PATH
npm run install:cli
# (Equivalent to: node bin/install-cli.js or .\install-cli.ps1 on Windows / ./install.sh on macOS & Linux)
```

### Verify Installation from Any Directory

Open a new terminal window and run from outside the source folder (for example `$env:TEMP` on Windows or `/tmp` on Unix):

```powershell
orion --version
orion --help
orion doctor
orion "Hi"
```

---

## 3. Upgrading ORION (`orion upgrade`)

ORION checks official stable GitHub Releases (`https://api.github.com/repos/iMpacts-AI/ORION/releases`) over HTTPS only. Draft and prerelease builds are ignored automatically unless a dedicated preview channel is explicitly requested in code.

### Commands

```powershell
# Check current version vs. latest stable release without modifying disk state
orion upgrade --check

# Download, verify SHA-256 checksum, atomically switch release, verify `--version`, and launch ORION
orion upgrade

# Upgrade without auto-launching interactive ORION after verification (useful for CI/scripts)
orion upgrade --no-launch

# Immediately restore the previous verified release snapshot
orion upgrade --rollback
```

### Safe Atomic Upgrade Pipeline

Every `orion upgrade` run enforces seven sequential safety gates:

1. **HTTPS Feed & Semver Check:** Enforces `https://` release endpoints (except local `127.0.0.1` loopback test harnesses), filters out `draft` and `prerelease` entries, and exits cleanly if the installed version is already up to date.
2. **Partial Download Staging (`.part`):** Streams the release `.tar.gz` into `staging/<asset>.part` and renames it only after the full stream closes cleanly. Interrupted downloads never touch `current/`.
3. **Mandatory SHA-256 Verification:** Fetches `<asset>.sha256` (or release body SHA-256), computes the local SHA-256 digest of the downloaded archive, and aborts immediately before extraction if the digest is missing or mismatched.
4. **Isolated Staging Validation:** Extracts into `staging/extracted` and validates required entrypoint and runtime files (`package.json`, `bin/orion.js`, `src/cli/OrionCliApp.ts`, `src/cli/OrionCliKernel.ts`) before any cutover.
5. **Backup & Atomic Cutover:** Moves the existing `current/` snapshot to `previous/`, promotes the validated release into `releases/v<new>` and `current/`, and refreshes global shims in `bin/`.
6. **Post-Switch Executable Self-Test & Automatic Rollback:** Executes `node current/bin/orion.js --version` in an external temporary working directory and verifies the output reports `ORION v<new>`. If verification fails, `orion upgrade` automatically restores `previous/` back to `current/`.
7. **Post-Upgrade Launch:** Unless `--no-launch` is passed or stdout is non-interactive, spawns the newly upgraded `orion` interactive session cleanly.

---

## 4. Troubleshooting & Recovery

- **`orion` not recognized right after first install:** Open a fresh PowerShell / Windows Terminal tab so the updated Windows User `PATH` takes effect, or run `orion doctor` to confirm `<orion-install>/bin/orion` registration.
- **Corrupted or incomplete installation:** If core files are ever removed manually from `<orion-install>/current`, `orion` detects the missing files at startup and prints recovery instructions (`orion upgrade --rollback` or `npm run install:cli`).
