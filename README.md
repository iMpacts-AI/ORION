# ◈ ORION — Autonomous CLI Agent Harness & Visible Computer-Use Operating Layer

**Organization:** [iMpact AI](https://impacts-ai.com) (`NETWORK • REASON • IMPACT`)  
**Founder & Chief Systems Architect:** Sheikh Mohammed Saqib ([@SaqibsAura](https://github.com/SaqibsAura))  
**Repository:** [https://github.com/iMpacts-AI/ORION](https://github.com/iMpacts-AI/ORION)  
**Primary Interface:** Global `orion` CLI (`orion`, `orion "<prompt>"`, `orion upgrade`, `orion doctor`)

---

## 1. Overview

**ORION** is a local-first, security-governed AI command-line environment and computer-use harness built primarily for Windows 11 workstations (with portable CLI and browser runtime support across macOS and Linux). It translates natural-language requests and slash commands into schema-validated, permission-checked browser, desktop, filesystem, media, and software-engineering actions — verifying real postconditions before reporting completion.

### Core Capabilities

1. **Standalone Global CLI & SHA-256 Verified `orion upgrade`:**
   - Installs as a self-contained versioned release (`<orion-install>`, `%LOCALAPPDATA%\orion` on Windows / `~/.local/share/orion` on Unix) so `orion` works from **any** directory without requiring a Git checkout.
   - `orion upgrade` verifies official HTTPS GitHub Releases with `.part` download staging, mandatory SHA-256 checksum validation, `previous` backup retention, automatic rollback on failure, and `~/.orion` (`<orion-home>`) user-data preservation.
2. **Smooth Full-Screen Terminal UI (`Vivid` & `Minimal` + Independent `/animations`):**
   - Coordinated line-diff ANSI renderer (`CoordinatedFrameStream`) with synchronized DECSET `2026` output, SGR mouse filtering, and DECSET `1004` focus/blur pause (`0` frames/sec and `0.00%` CPU when unfocused).
   - Persisted `Vivid` and `Minimal` visual modes (`/vivid`) paired with an independent `/animations` preference supporting all 4 mode×animation combinations.
   - **41 Curated Rotating Workflow Tips** across 11 categories (~10s Home auto-rotation plus manual cycling via `Alt+T`, `/tip`, or clicking the footer tip while keeping `Tab` for mode/autocomplete switching).
   - **Canonical `18x18` Pixel-Art Oris Mascot** with memoized 24-bit half-block rendering, ~2.4s calm idle breathing, occasional cosmic sway, and a ~1,140ms 6-stage click-to-jump arc.
3. **Visible Foreground Chrome & Windows 11 Desktop Automation:**
   - Launches and focuses real visible Chrome windows, reuses the operator's active profile directory from `Local State` metadata (never reading or copying Cookies, Login Data, or tokens), visibly types and submits searches, navigates pages, and automatically pauses (`PAUSED_FOR_USER_AUTH`) at login, Account Chooser, 2FA/MFA, CAPTCHA, and OAuth consent screens.
   - Resolves Windows 11 desktop apps (Catalog, Registry `App Paths`, `%LOCALAPPDATA%\Programs`, ArtCraft suite, Start Menu `.lnk`, `PATH`, Store AUMIDs, and `ms-settings:<subpage>` URIs) with `shell: false` argument arrays, executes Win32 mouse/keyboard actions, and verifies cursor/window postconditions with zero false positives.
4. **Friendly Conversation, Honest Engine Identity & Path Privacy:**
   - Responds naturally and concisely to casual greetings (`"Hi"`, `"Hello"`, `"Good morning"`) without dumping hardware specs or invoking unnecessary tools; inspects system specs only when explicitly asked.
   - Displays clean, honest provider-neutral runtime labels (`ORION Local`, `ORION Core`, `ORION Intelligence`) in ordinary UI while disclosing full `provider:model` mappings in `/doctor`.
   - Protects operator privacy by formatting local paths as `<workspace>`, `<orion-home>`, `<orion-install>`, or `~/...` across ordinary UI, transcripts, and errors.
5. **Non-Overridable Security Governance & Instant `Esc` Cancellation:**
   - Enforces SHA-256 integrity-verified [`config/policies/orion-protected-policy.v1.json`](config/policies/orion-protected-policy.v1.json), pre-approval schema validation, single-use action-bound Tier-2 tokens, `<80ms` Escape-to-Cancel (`Esc`) task cancellation, and authoritative `/stop` Emergency Stop.

---

## 2. Quick Start & Global Installation

```powershell
# 1. Install dependencies & build production bundles
npm install
npm run build

# 2. Install standalone global `orion` CLI and register User PATH shims
npm run install:cli

# 3. Run from ANY directory on your workstation
orion --version
orion doctor
orion upgrade --check
orion "Hi"

# 4. Launch interactive full-screen ORION TUI (Windows Terminal recommended)
orion
```

### Key Interactive Shortcuts & Commands

| Input / Command | Action |
| :--- | :--- |
| `Tab` | Autocomplete `/` menu or cycle execution mode (`Build` → `Plan` → `Chat`) |
| `Shift+Tab` | Cycle reasoning effort (`low` → `medium` → `high` → `max`) |
| `Alt+T` / `/tip` | Cycle immediately to the next curated ORION workflow tip |
| `Ctrl+P` | Open live Runtime Settings, Visual Mode & Governance Status card |
| `Esc` | Cancel active generation, browser, or tool workflow cleanly |
| `/vivid`, `/animations` | Switch `vivid` \| `minimal` visual mode or toggle decorative animations (`on` \| `off`) |
| `/help`, `/doctor`, `/status`, `/specs` | Command catalog, full diagnostic pre-flight, runtime health, and explicit system specs |
| `/models`, `/providers`, `/permissions` | Inspect or switch configured models, provider adapters, and 4-tier security policy |
| `/approve <id>`, `/deny <id>`, `/stop` | Approve/deny pending Tier-2 actions or engage Emergency Stop |
| `orion upgrade [--check \| --rollback]` | Check, verify (SHA-256), install, or roll back official ORION releases |

---

## 3. Verification & Documentation

```powershell
# Run strict TypeScript check + static syntax & path-privacy lint gate
npm run typecheck
npm run lint

# Run all isolated automated test suites
npm test
```

- **Global Installation & Safe Upgrade Guide:** [`docs/INSTALLATION_AND_UPGRADE.md`](docs/INSTALLATION_AND_UPGRADE.md)
- **CLI Usage, Visual Modes & Interactive Reference:** [`docs/CLI_USAGE.md`](docs/CLI_USAGE.md)
- **Supported Platforms & Honest Limitations:** [`docs/SUPPORTED_PLATFORMS.md`](docs/SUPPORTED_PLATFORMS.md)
- **Capability Matrix & Verification Inventory:** [`docs/capability-matrix.md`](docs/capability-matrix.md)
- **Windows 11 Manual Smoke Test Guide:** [`docs/SMOKE_TEST_GUIDE.md`](docs/SMOKE_TEST_GUIDE.md)
- **Release Notes (`v1.0.0`):** [`RELEASE_NOTES.md`](RELEASE_NOTES.md)
- **Protected Agent Security Policy:** [`config/policies/orion-protected-policy.v1.json`](config/policies/orion-protected-policy.v1.json)
