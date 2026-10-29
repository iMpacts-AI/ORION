# ORION Windows 11 Setup, Verification & Manual Smoke Test Guide

This guide provides reproducible commands to build, test, and run live Windows 11 desktop verification for **ORION** without machine-specific paths or external paid services.

---

## 1. Prerequisites & Build

- **OS:** Windows 11 (x64) with Windows Terminal (recommended for 24-bit ANSI & SGR mouse support)
- **Node.js:** `>= 18.0.0` (tested on Node 20/22)
- **Optional Local LLM Runtime:** [Ollama](https://ollama.com) running on `http://127.0.0.1:11434` (e.g. `llama3.1:8b`, `qwen2.5-coder:7b`)
- **Optional Desktop Apps for Computer-Use Smoke Tests:** Google Chrome, Spotify, and official [ArtCraft](https://getartcraft.com/apps) portable apps under `%LOCALAPPDATA%\Programs\ArtCraft\`

```powershell
# From the ORION repository root:
npm install
npm run build
```

---

## 2. Automated Isolation Test Suite

Run all runnable test suites in pure process isolation:

```powershell
# Run full isolated test runner
node run_suites.cjs

# Run targeted Reliability, Computer Use, Cancellation & Oris CLI suite
node runner_helper.cjs "src\main\services\__tests__\OrionMasterEngineeringMission.test.ts"

# Run Oris Mascot & Global Escape-to-Cancel acceptance suite
node runner_helper.cjs "src\main\services\__tests__\OrisMascotAndEscapeCancelAcceptance.test.ts"
```

---

## 3. Manual Windows 11 Smoke Test Checklist

### Smoke Test 1 — Reference-Faithful Deep-Space CLI & Pixel-Art Oris
1. Launch interactive ORION CLI in Windows Terminal:
   ```powershell
   node bin/orion.js
   ```
2. **Expected:**
   - Full-screen deep midnight-navy space viewport (`#070d19` / `#050a18`) with drifting/twinkling multi-layer stars and occasional diagonal shooting stars (`✦` head + cyan `╱` trail).
   - Centered slate-blue rounded card containing the `18x18` pixel-art **Oris** mascot (`18x9` half-blocks), `iMpacts-AI`, bold geometric white `ORION`, rounded command box (`> │ [BUILD MODE] [Engine: ...]`), and shortcut bar.
   - Move mouse near Oris -> eyes track cursor gently.
   - Left-click Oris once -> Oris jumps with `✦`/`✧` sparkles and lands cleanly without corrupting typed prompt text.
   - Left-click Oris 3 times rapidly -> Oris flips upside down (`~400ms`) and recovers.
   - Press `Tab` -> cycles `BUILD MODE` -> `PLAN MODE` -> `CHAT MODE`.
   - Press `Shift+Tab` -> cycles effort `MEDIUM` -> `HIGH` -> `MAX` -> `LOW`.
   - Press `Ctrl+P` -> displays live Runtime Settings & Governance Status card.
   - Type `/vivid` -> toggles space visuals between Vivid and Minimal; `/clear` restores the centered hero card.

### Smoke Test 2 — Chrome Default Profile Reuse & Auth Pause
1. Run single-shot or interactive discovery/navigation:
   ```powershell
   node bin/orion.js "/doctor"
   ```
2. Ask ORION to open `https://github.com/iMpacts-AI/ORION` in Chrome.
3. **Expected:**
   - Chrome launches using `--profile-directory=<last_used>` resolved solely from `Local State` metadata (never touching Cookies/Login Data/tokens and never spawning a second headless browser window).
   - If a target site presents Google Account Chooser, SSO login, or 2-Step Verification, ORION pauses cleanly with `PAUSED_FOR_USER_AUTH` (`permission_required`) instead of attempting to bypass authentication.

### Smoke Test 3 — Windows 11 & Official ArtCraft App Launch
1. Verify installed app discovery (including paths with spaces such as `ArtCraft Launcher`):
   ```powershell
   node -e "const { WindowsAppResolver } = require('./dist-electron/main/index.js'); console.log('Build verified');"
   ```
   Or inside ORION CLI, ask ORION to discover installed apps or launch `Notepad`, `PdfCraft`, or `PhotoCraft`.
2. **Expected:**
   - Installed apps launch with `shell: false` and separated argument arrays.
   - Foreground window + `tasklist.exe` process verification distinguishes `completed_verified` (window observed) from `launched_unverified` (process spawned asynchronously without foreground window confirmation).
   - Requesting an uninstalled app (e.g. `nonexistent_app_xyz`) reports `[APP_NOT_INSTALLED]` (`failed`).
   - Requesting a prohibited binary (e.g. `regedit` or `diskpart`) reports `[SECURITY BLOCKED]` (`failed`).

### Smoke Test 4 — Honest Media Playback Status & Control
1. Check live Windows media session state (`media.status`) or trigger `media.control` / `media.play_spotify`.
2. **Expected:**
   - WinRT `GlobalSystemMediaTransportControlsSessionManager` (with window-title fallback) reports actual `running`, `playing`, `track`, and `artist` state without guessing or fabricating playback.

### Smoke Test 5 — Global Escape-to-Cancel & Immediate Follow-Up
1. Start a streaming prompt or multi-step command in `node bin/orion.js`, then press `Esc` mid-execution.
2. **Expected:**
   - Active streaming, plan loop, browser navigation, and ORION-owned managed subprocesses abort immediately (`Task cancelled`).
   - Already-open detached user apps (Chrome, Notepad, PdfCraft, Spotify) remain untouched, and global Emergency Stop (`E-Stop`) is **not** engaged.
   - Immediately submit `/status` or a new prompt -> executes normally without restarting ORION.
3. Exit via `/exit` or double `Ctrl+C` -> alternate screen, cursor visibility, OSC background, and SGR mouse tracking restore cleanly.
