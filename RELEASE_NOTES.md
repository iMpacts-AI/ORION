# ORION v1.0.0 — Global CLI Release Notes

**Release:** `v1.0.0`  
**Organization:** iMpact AI (`NETWORK • REASON • IMPACT`)  
**Repository:** [https://github.com/iMpacts-AI/ORION](https://github.com/iMpacts-AI/ORION)  
**Primary Verified Platform:** Windows 11 (x64)

---

## Highlights

### 1. Standalone Global CLI (`orion`) & SHA-256 Verified `orion upgrade`
- Installed standalone release architecture under `%LOCALAPPDATA%\orion` (`<orion-install>`) on Windows and `~/.local/share/orion` on macOS/Linux (`releases/v<version>`, `current`, `previous`, `staging`, `bin/orion*`, `install-manifest.json`).
- Runs from **any** working directory outside the Git repository, cleanly separating `ORION_INSTALL_ROOT` from the active `<workspace>` (`process.cwd()`).
- Added `orion upgrade` (`--check`, `--no-launch`, `--rollback`) with HTTPS release-feed enforcement, draft/prerelease filtering, `.part` partial download staging, mandatory SHA-256 checksum verification before cutover, `previous` backup retention with automatic rollback on verification failure, `<orion-home>` (`~/.orion`) user-config preservation, and post-upgrade launch.

### 2. Performance-Engineered Visual Modes (`Vivid` / `Minimal`), Independent `/animations` & Focus Pause
- Added persisted `visualMode: 'vivid' | 'minimal'` (`/vivid`) and independent `animationsEnabled: boolean` (`/animations`) stored in `<orion-home>/visual-preferences.json`, supporting all 4 combinations (`vivid+anim`, `vivid+no-anim`, `minimal+anim`, `minimal+no-anim`).
- Added DECSET `1004` terminal focus/blur awareness (`\x1b[?1004h`) plus identical-frame skipping in `CoordinatedFrameStream`:
  - **Idle Vivid ANSI Throughput:** reduced from `40,278 B/s` (`123.3 lines/s`) to **`7,821 B/s` (`29.9 lines/s`, `-80.6%`)**.
  - **Idle Vivid CPU Usage:** reduced from `11.96%` to **`2.59%` (`-78.3%`)**.
  - **Unfocused Terminal Background Overhead:** reduced from `12 frames / 2s` (`39,252 B/s`, `7.74%` CPU) to **`0 frames`, `0 B/s`, `0.00%` CPU (`-100%`)**.
  - **CLI Startup Latency (p50):** improved from `68.67ms` to **`45.50ms` (`-33.7%`)**.

### 3. Curated Rotating Workflow Tips (`OrionTipsEngine`)
- Built an ORION-native weighted tip engine featuring **41 curated tips across 11 workflow & safety categories** with `{highlight}...{/highlight}` formatting, capability/platform filtering, zero consecutive duplicates, ~10-second Home-screen auto-rotation (paused on blur and cleaned up when leaving Home), and manual cycling via **`Alt+T`**, **`/tip`**, or clicking the footer tip — while preserving **`Tab`** for `SlashMenu` / `Build → Plan → Chat` mode switching and **`Shift+Tab`** for reasoning effort.

### 4. Canonical Pixel-Art Oris Personality & Smooth Physics
- Preserved canonical `18x18` (`9` half-block rows) Oris artwork (`assets/mascot/oris-sprite.json`) with memoized O(1) ANSI half-block caching.
- Refined idle ~2.4s breathing, gentle floating, occasional 3-beat cosmic sway dance, ~1,140ms 6-stage eased click jump arc (`anticipation → ascent → apex → descent → landing → idle`), rapid triple-click tumble-flip, and lifecycle state reactions.

### 5. Natural Conversational Behavior, Provider-Neutral Engine Identity & Path Privacy
- Casual greetings (`"Hi"`, `"Hello"`, `"Good morning"`) now respond warmly in **`358.44ms` p50** (down from `9,508.43ms` p50, **`-96.2%`**) with zero hardware spec dumps, zero hallucinated desktop tools, and zero leaked `mem_*` or `EXTERNAL DATA ANALYSIS` prompt scaffolds. System specifications execute `system.get_info` only when explicitly requested.
- Public UI badges use honest provider-neutral ORION runtime labels (`ORION Local`, `ORION Core`, `ORION Intelligence`, `ORION Engine`), while `/doctor` and `orion doctor` transparently disclose exact provider and model mappings (e.g., `ORION Local -> ollama:llama3.1:8b`).
- Personal OS paths (`C:\Users\<username>\...`) are sanitized across ordinary UI, status bars, tool outputs, errors, transcripts, and repository documentation into `<workspace>`, `<orion-home>`, `<orion-install>`, or `~/...`.

### 6. Visible Foreground Chrome & Windows 11 Computer-Use Harness
- Upgraded visible Chrome CDP automation (`visibleWindow: true`), foreground window activation, visible search-input typing & submission, `ms-settings:<subpage>` resolution, Win32 cursor/window postcondition verification, safe form preparation with pre-submit approval gates, automatic `PAUSED_FOR_USER_AUTH` pause on login/2FA/CAPTCHA/OAuth consent pages, and `<80ms` mid-flight browser task cancellation via forwarded `AbortSignal`.

---

## Verification Summary
- **TypeScript Strict Check (`npm run typecheck`):** `0` errors.
- **Static Hygiene & Path-Privacy Gate (`npm run lint`):** `PASS` across 230+ source and documentation files (`0` errors, `0` leaked personal paths or live keys).
- **Production Bundle Build (`npm run build`):** `PASS` (`dist/`, `dist-electron/main/`, `dist-electron/preload/`).
- **28-Scenario Computer-Use & Visible Chrome E2E Suite (`OrionGlobalReleaseHarnessE2E.test.ts`):** **`28/28` passed**.
- **Visual Modes, Tips, Oris & Conversational Identity Suite (`OrionVisualModesTipsAndIdentity.test.ts`):** **`27/27` passed**.
- **Global CLI Install & SHA-256 Upgrade/Rollback Suite (`OrionGlobalCliInstallAndUpgrade.test.ts`):** **`13/13` passed**.
- **Phase 9 Load & Capacity Benchmark:** **`72/72` tasks completed & verified (`100%` verified success, `0%` false-success rate, `-7.13 MB` 50-cycle heap delta)**.
