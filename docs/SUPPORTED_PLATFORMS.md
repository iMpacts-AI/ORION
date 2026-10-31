# ORION Supported Platforms & Honest Capability Boundaries

This document defines what **ORION** supports reliably today, what operates with platform or OS security limitations, what is experimental, and what is not implemented.

---

## 1. Operating System Support Matrix

| Platform | Support Tier | CLI, TUI, Visual Modes, Tips & `orion upgrade` | Local Ollama & Cloud Model Routing | Visible Chrome CDP Automation | Native Desktop Input, Window Focus & Media Control |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Windows 11 (x64)** | **Primary Verified Platform** | **Verified Working** (`%LOCALAPPDATA%\orion`, Windows Terminal 24-bit ANSI, SGR mouse, DECSET 1004 focus/blur) | **Verified Working** | **Verified Working** (Foreground visible Chrome window, `--profile-directory=<last_used>` reuse, CDP DOM control, auth/2FA/CAPTCHA pause) | **Verified Working** (`win32-native-input.exe` + Win32 cursor/window verification, multi-source app discovery, `ms-settings:*` URIs, WinRT GSMTC media telemetry) |
| **macOS (Apple Silicon & Intel)** | **CLI & Browser Portable / Desktop Partial** | **Supported** (`~/.local/share/orion`, `~/.local/bin/orion` POSIX wrapper; verified via cross-platform unit tests) | **Supported** | **Supported** (Standard macOS Google Chrome / Chromium binary discovery & CDP WebSocket control) | **Limited** (AppleScript/Accessibility desktop automation and macOS NowPlaying media bridges are not verified on macOS hardware in CI) |
| **Linux (x64 / ARM64)** | **CLI & Browser Portable / Desktop Partial** | **Supported** (`~/.local/share/orion`, `~/.local/bin/orion` POSIX wrapper; verified via cross-platform unit tests) | **Supported** | **Supported** (`google-chrome` / `chromium` binary discovery & CDP WebSocket control on X11/Wayland) | **Limited** (Win32 native desktop input, Registry `App Paths`, and WinRT GSMTC media APIs are Windows-specific) |

---

## 2. Capability Classification

### A. Reliably Supported & Verified (`VERIFIED_WORKING`)
1. **Standalone Global CLI & Safe Atomic Upgrades:** `orion`, `orion "<prompt>"`, `orion doctor`, `orion upgrade`, `orion upgrade --check`, and `orion upgrade --rollback` with HTTPS enforcement, `.part` download staging, mandatory SHA-256 verification, `previous` backup retention, and `<orion-home>` user-config preservation.
2. **Coordinated Full-Screen TUI Rendering:** Line-diff ANSI frame writer (`CoordinatedFrameStream`), synchronized DECSET `2026` output, SGR mouse and DECSET `1004` focus/blur filtering (`0` unfocused frames/sec), `Vivid` and `Minimal` visual modes with independent `/animations` toggle, 41 weighted rotating tips (`Alt+T` / `/tip`), and memoized canonical `18x18` pixel-art Oris animations.
3. **Natural Conversation & Privacy Hygiene:** Friendly, concise responses to casual greetings (`"Hi"`, `"Hello"`, `"Good morning"`) without hardware dumps, hallucinated tool calls, or leaked `mem_*` / `EXTERNAL DATA ANALYSIS` strings; system specifications reported only when explicitly requested; personal `C:\Users\<username>` paths redacted across ordinary UI and transcripts.
4. **Visible Foreground Chrome Automation:** Real visible Chrome window launch/focus, active profile directory reuse from `Local State` metadata (without touching Cookies, Login Data, or tokens), visible search-box typing and submission, URL navigation, DOM extraction, JS dialog dismissal, clean CDP child process teardown, and automatic `PAUSED_FOR_USER_AUTH` pause on login, Account Chooser, 2FA/MFA, CAPTCHA, and OAuth consent screens.
5. **Windows 11 Desktop Control & Verification:** Multi-source app discovery (Catalog, Registry `App Paths`, `%LOCALAPPDATA%\Programs`, Start Menu `.lnk`, `PATH`, Store AUMIDs, and `ms-settings:<subpage>` protocol URIs), `shell: false` argument-array process spawning, mouse move/left-click/right-click/double-click/drag/scroll, keyboard typing and shortcut hotkeys, Win32 cursor/window postcondition verification, and zero-false-positive verification failure reporting.
6. **Security Governance & Instant Cancellation:** SHA-256 integrity-verified protected policy (`config/policies/orion-protected-policy.v1.json`), pre-approval schema validation, single-use action-bound approval tokens, sub-100ms `Esc` / `AbortSignal` task cancellation, and authoritative `/stop` Emergency Stop.

### B. Supported with Known OS or Runtime Limitations (`WORKS_WITH_LIMITATIONS`)
1. **Windows UAC / Elevated Windows:** Non-elevated ORION processes cannot inject synthetic mouse/keyboard events into Administrator-elevated windows due to Windows User Interface Privilege Isolation (UIPI).
2. **Already-Running User Chrome Sessions Without Remote Debugging:** Chrome only opens a CDP WebSocket when started with `--remote-debugging-port`. If Chrome is already running on the default profile without remote debugging enabled, ORION either opens the URL cleanly via external OS launch (`launched_unverified` for DOM state) or uses a managed automation profile directory when live CDP DOM verification is required.
3. **Desktop UI Observation Latency:** Capturing full Windows UI Automation / window-enumeration snapshots via PowerShell/Win32 takes ~0.9–2.0 seconds per checkpointed desktop plan on Windows 11.
4. **Local LLM Inference Speed & Tool-Planning Quality:** Conversational and planning quality depends on the configured model (`ollama:llama3.1:8b` locally vs. larger models). Small 8B models have narrower multi-step reasoning capacity than frontier models; ORION mitigates this with deterministic pre-validation and postcondition verification.

### C. Experimental (`EXPERIMENTAL`)
1. **Multimodal VLM Screen Grounding (`VisionService`):** Screenshot capture works natively on Windows 11, while visual element reasoning requires an active multimodal VLM (`ollama:gemma4:26b` or configured cloud vision adapter).
2. **Voice Interaction (`VoiceService`):** Local Windows SAPI text-to-speech works offline, whereas speech-to-text recognition requires binding an external or local STT engine (`STT NOT CONFIGURED` by default).

### D. Intentionally Not Implemented (`NOT_IMPLEMENTED`)
1. **Authentication, MFA, CAPTCHA, or Paywall Bypass:** By strict security policy, ORION never stores/decrypts browser passwords or session cookies and never attempts to solve CAPTCHAs or bypass MFA/OAuth prompts.
2. **Proprietary Foundation Model Hosting:** ORION is an agent harness and operating layer that routes across local Ollama open-weights models and user-configured API providers; it does not bundle a proprietary LLM weights file.
3. **macOS/Linux Native Accessibility Input Drivers:** Native C#/Win32 input (`win32-native-input.exe`) targets Windows 11; native macOS Quartz/Accessibility and Linux XTest/uinput binary drivers are not yet bundled.
