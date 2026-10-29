# ◈ ORION — Reliability-First CLI Agent Harness & Windows 11 Computer-Use Platform

**Organization:** [iMpacts-AI](https://impacts-ai.com) (`NETWORK • REASON • IMPACT`)  
**Founder & Chief Systems Architect:** Sheikh Mohammed Saqib ([@SaqibsAura](https://github.com/SaqibsAura))  
**Repository:** [https://github.com/iMpacts-AI/ORION](https://github.com/iMpacts-AI/ORION)  
**Primary Interface:** ORION CLI (`node bin/orion.js` / `orion`)

---

## 1. Overview

**ORION** is a local-first, security-governed AI command-line agent harness built primarily for Windows 11 workstations. It translates natural-language goals and slash commands into schema-validated, permission-checked computer, browser, filesystem, media, and engineering actions — verifying real postconditions before reporting completion.

### Key Architectural Pillars

1. **Unified Verified Execution Pipeline:**
   - Every task flows through `intent -> plan -> typed tool call -> schema validation -> permission gate -> operator approval (if required) -> execution -> observation -> postcondition verification -> bounded recovery -> truthful outcome`.
   - Distinguishes explicit runtime outcome states: `completed_verified`, `launched_unverified`, `partially_completed`, `permission_required`, `cancelled`, `timed_out`, and `failed`.
2. **Windows 11 Multi-Source Application Discovery & Safe Launching:**
   - Resolves installed desktop applications across Catalog, Windows Registry `App Paths`, `%LOCALAPPDATA%\Programs` (including official **ArtCraft** portable tools: `ArtCraft Launcher`, `PdfCraft`, `PhotoCraft`, `GridCraft`, `WordCraft`, `DeckCraft`, `VectorCraft`), Start Menu `.lnk` shortcuts, `PATH`, and Microsoft Store `AppsFolder` AUMIDs.
   - Spawns executables with `shell: false` and validated `string[]` arguments (preserving paths with spaces while blocking shell injection and administrative/LOLBin binaries).
3. **Chrome Profile-Aware Workflows & Auth Pause:**
   - Reuses the operator's active Chrome profile (`--profile-directory=<last_used>` read solely from Chrome `Local State` directory metadata — never reading, copying, or decrypting Cookies, Login Data, Web Data, or tokens).
   - Automatically detects Google Account Chooser, SSO sign-in, 2FA/MFA, and CAPTCHA interruptions and pauses cleanly (`PAUSED_FOR_USER_AUTH` -> `permission_required`) for user completion.
4. **Truthful Windows Media & Spotify Control:**
   - Inspects WinRT `GlobalSystemMediaTransportControlsSessionManager` (with window-title fallback) and passes Spotify URIs via environment parameterization (`$env:ORION_SPOTIFY_URI`) with zero shell string interpolation.
5. **Non-Overridable Security Governance & Global Escape-to-Cancel (`Esc`):**
   - Single shared policy/approval state across `OrionCliKernel`, `ToolService`, and `HarnessOrchestrator`, backed by SHA-256 integrity-verified [`config/policies/orion-protected-policy.v1.json`](config/policies/orion-protected-policy.v1.json).
   - Schema validation runs **before** approval token consumption so malformed calls never burn single-use SHA-256 action-bound tokens.
   - Pressing `Esc` cancels active model streaming, multi-step plans, browser operations, and ORION-owned subprocesses immediately without killing detached user desktop apps or locking Emergency Stop (`/stop`).
6. **Reference-Faithful Deep-Space CLI & Interactive Pixel-Art Oris Mascot:**
   - Full-screen alternate-buffer React + Ink TUI featuring deep midnight-navy space visuals, multi-layer twinkling stars, diagonal shooting stars, a centered slate-blue command capsule, live mode/engine badges, and **Oris** (`18x18` canonical pixel-art sprite rendered in 24-bit ANSI half-blocks with cursor tracking, click-to-jump sparkles, rapid-click tumble-flip, and `--no-color` fallback).
7. **Sovereign Local Ollama Routing (`$0.00` Mandatory API Spend):**
   - Routes across local Ollama models (`llama3.1:8b`, `qwen2.5-coder:7b`, `deepseek-r1:14b`, `gpt-oss:20b`, `gemma4:26b`, `qwen3-coder:30b`) with deterministic offline fallback when no model daemon is running.

---

## 2. Quick Start

```powershell
# 1. Install dependencies & build TypeScript + Vite bundles
npm install
npm run build

# 2. Launch interactive full-screen ORION CLI (Windows Terminal recommended)
node bin/orion.js

# 3. Single-shot diagnostics & non-interactive commands
node bin/orion.js "/doctor"
node bin/orion.js "/status" --json
node bin/orion.js "/specs" --no-color
```

### Interactive Keyboard Shortcuts & Slash Commands

| Input / Command | Action |
| :--- | :--- |
| `Tab` | Cycle execution mode (`Build` → `Plan` → `Chat`) |
| `Shift+Tab` | Cycle reasoning effort (`low` → `medium` → `high` → `max`) |
| `Ctrl+P` | Display live Runtime Settings & Governance Status card |
| `Esc` | Cancel active task / dismiss open menu / deny pending approval prompt |
| `@<path>` | Attach workspace file into active context |
| `/help`, `/doctor`, `/status` | Command catalog, policy/system pre-flight check, and live runtime telemetry |
| `/mode`, `/effort`, `/model` | Inspect or switch execution mode, effort level, and active model provider |
| `/vivid`, `/clear` | Toggle deep-space starfield visuals (`Vivid` / `Minimal`) or reset viewport |
| `/undo`, `/redo`, `/rewind` | Non-destructive SHA-256 conflict-checked workspace file undo/redo/checkpoint rewind |
| `/approve <id>`, `/deny <id>` | Approve or deny pending action-bound Tier-2 tool requests |
| `/stop` | Engage authoritative Emergency Stop across managed child process trees |

---

## 3. Verification & Documentation

```powershell
# Run all isolated automated test suites
node run_suites.cjs

# Run targeted Reliability, Computer Use, Cancellation & Oris CLI regression suite
node runner_helper.cjs "src\main\services\__tests__\OrionMasterEngineeringMission.test.ts"
```

- **Capability Matrix & Honest Limitations:** [`docs/capability-matrix.md`](docs/capability-matrix.md)
- **Windows 11 Setup & Manual Smoke Test Guide:** [`docs/SMOKE_TEST_GUIDE.md`](docs/SMOKE_TEST_GUIDE.md)
- **Protected Agent Security Policy:** [`config/policies/orion-protected-policy.v1.json`](config/policies/orion-protected-policy.v1.json)
