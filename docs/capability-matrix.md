# ORION Capability Matrix & Verification Inventory

**Project:** ORION by iMpacts-AI  
**Primary Platform:** Windows 11 (x64)  
**Primary Interface:** ORION CLI (`node bin/orion.js` / `orion`)  
**Audit Standard:** Direct Source Inspection, Automated Isolation Suites (`node run_suites.cjs`), and Live Windows 11 Execution  

---

## 1. Outcome & Capability Status Classifications

### Runtime Task Outcome States (`TaskOutcomeStatus`)
Every tool execution and harness run classifies its result truthfully into one of seven explicit states:

| Outcome Status | Meaning |
| :--- | :--- |
| `completed_verified` | Action executed and postconditions (window focus, file SHA-256, active audio session, HTTP/DOM state) were observed and verified. |
| `launched_unverified` | Process or external protocol spawned without error, but foreground window or active playback could not be independently confirmed within the verification window. |
| `partially_completed` | Multi-step workflow completed an initial subset of steps before a subsequent step failed or was blocked. |
| `permission_required` | Action paused awaiting explicit operator confirmation (`/approve <id>` or `[Y/N]`) or user browser authentication (`PAUSED_FOR_USER_AUTH`). |
| `cancelled` | Task aborted cleanly by operator via `Esc` (Escape-to-Cancel) or `Ctrl+C` without engaging Emergency Stop lockdown. |
| `timed_out` | Tool or managed subprocess exceeded its bounded timeout and was terminated cleanly. |
| `failed` | Precondition, schema validation, binary resolution, security policy, or execution step failed. |

### Capability Implementation Classifications
- **VERIFIED_WORKING**: Implemented in source code and verified through automated regression tests and live Windows 11 execution.
- **PARTIALLY_IMPLEMENTED**: Core architecture and runtime guards work, with clearly documented external or platform boundaries.

---

## 2. Capability Matrix

| Capability | Category | Status | Authoritative Source Files | Verification Evidence | Known Limitations & Safety Boundaries |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unified Agent Execution Harness** | Core Engine | **VERIFIED_WORKING** | `src/harness/HarnessOrchestrator.ts`<br>`src/harness/ToolDispatcher.ts`<br>`src/cli/OrionCliKernel.ts`<br>`src/main/services/OrionOrchestrator.ts` | `OrionCliV2HarnessAndTuiAcceptance.test.ts`<br>`OrionMasterEngineeringMission.test.ts` | Bounded retry limits prevent infinite recovery loops; multi-step partial failures report `PARTIALLY_COMPLETED`, never false `COMPLETED`. |
| **Windows 11 Multi-Source App Discovery & Launch** | Computer Use | **VERIFIED_WORKING** | `src/main/services/computer/WindowsAppResolver.ts`<br>`src/main/services/computer/ComputerActionExecutor.ts`<br>`src/main/services/computer/ComputerActionVerifier.ts` | `OrionMasterEngineeringMission.test.ts` (Checks 1.1–3.1) + Windows 11 live smoke tests | Resolves via Catalog, Registry `App Paths`, `%LOCALAPPDATA%\Programs` / `ArtCraft` / `%ProgramFiles%`, Start Menu `.lnk`, `where.exe` `PATH`, and Store `AppsFolder` AUMIDs. Spawns with `shell: false` and separated `string[]` arguments. Administrative/LOLBin binaries (`regedit`, `diskpart`, `rundll32`, etc.) are blocked. |
| **Official ArtCraft Desktop Suite Integration** | Computer Use / Creative Apps | **VERIFIED_WORKING** | `src/main/services/computer/WindowsAppResolver.ts`<br>`src/main/services/ToolService.ts` (`computer.discover_apps`, `computer.launch_app`) | SHA-256 verified portable installs + `OrionMasterEngineeringMission.test.ts` (Checks 1.2–1.3) + live `PdfCraft` & `PhotoCraft` launch | Installed under `%LOCALAPPDATA%\Programs\ArtCraft\<App>\` with Start Menu `.lnk` shortcuts targeting GUI binaries (`artcraft-launcher.exe`, `pdfcraft.exe`, `photocraft.exe`, `gridcraft.exe`, `wordcraft.exe`, `deckcraft.exe`, `vectorcraft.exe`). |
| **Chrome Default Profile Reuse & Auth Pause** | Browser Workflows | **VERIFIED_WORKING** | `src/main/platform/BrowserProvider.ts`<br>`src/shared/types/browser.ts`<br>`src/main/services/ToolService.ts` | `OrionMasterEngineeringMission.test.ts` (Checks 12.1–12.2) + live Chrome profile launch | Reads ONLY `profile.last_used` directory name from Chrome `Local State` metadata; never reads, copies, or decrypts Cookies, Login Data, Web Data, or tokens. Pauses with `PAUSED_FOR_USER_AUTH` (`permission_required`) on Google Account Chooser, SSO sign-in, 2FA/MFA, or CAPTCHA. Detached user Chrome windows are never killed on session cleanup. |
| **Web Fetch, Search & SSRF Protection** | Web & Grounding | **VERIFIED_WORKING** | `src/harness/WebSearchService.ts`<br>`src/main/platform/BrowserProvider.ts`<br>`src/main/services/UntrustedContentBoundary.ts` | `OrionCliV2HarnessAndTuiAcceptance.test.ts` (16C.1–16C.5) | Blocks loopback, RFC1918 private IPs, link-local metadata (`169.254.169.254`), DNS rebinding, and `file://` redirects. Wraps external HTML in `<UNTRUSTED_DATA>` boundaries. |
| **Media Playback & Spotify Control** | Audio / Media | **VERIFIED_WORKING** | `src/main/services/MediaControlService.ts`<br>`src/main/services/ToolService.ts` (`media.status`, `media.control`, `media.play_spotify`) | `OrionMasterEngineeringMission.test.ts` (Check 14.3) + live Windows 11 GSMTC smoke test | Queries WinRT `GlobalSystemMediaTransportControlsSessionManager` with window-title fallback. Passes Spotify URIs via `$env:ORION_SPOTIFY_URI` (zero PowerShell string interpolation). Reports `completed_verified` only when playback state matches target; reports `launched_unverified` if Spotify opens without active playback confirmation. |
| **Single Shared Security Policy & Action-Bound Approvals** | Security Governance | **VERIFIED_WORKING** | `src/main/services/SecurityPolicyMiddleware.ts`<br>`src/main/services/AgentPolicyService.ts`<br>`config/policies/orion-protected-policy.v1.json` | `SecurityHardeningAndReliability.test.ts`<br>`OrionMasterEngineeringMission.test.ts` (Checks 4.1, 5.1, 6.1) | Single shared policy state across `OrionCliKernel`, `ToolService`, and `HarnessOrchestrator`. Argument schema validation executes **before** approval creation or token consumption so malformed calls never burn single-use SHA-256 action-bound tokens. |
| **Global Escape-to-Cancel (`Esc`)** | Reliability & Control | **VERIFIED_WORKING** | `src/cli/OrionCliKernel.ts`<br>`src/tui/OrionTuiApp.tsx`<br>`src/main/services/computer/ProcessSupervisor.ts` | `OrisMascotAndEscapeCancelAcceptance.test.ts` (13.1–13.15)<br>`OrionMasterEngineeringMission.test.ts` (Checks 8.1–11.1) | Aborts active model streaming, multi-step plans, browser fetches, and ORION-owned managed subprocesses immediately without engaging Emergency Stop (`/stop`) and without killing already-detached user desktop applications. System is immediately ready for the next prompt. |
| **Reference-Faithful Deep-Space CLI & Canonical Pixel-Art Oris** | Terminal UX | **VERIFIED_WORKING** | `src/tui/OrionTuiApp.tsx`<br>`src/tui/Capsule.tsx`<br>`src/tui/Starfield.tsx`<br>`src/tui/MascotInteractive.tsx`<br>`assets/mascot/oris-sprite.json` | `OrisMascotAndEscapeCancelAcceptance.test.ts`<br>`OrionMasterEngineeringMission.test.ts` (Checks 13.1–14.2) | Renders canonical `18x18` pixel-art Oris sprite (`18x9` 24-bit ANSI half-blocks over `#070d19`, plus `--no-color` fallback), centered slate-blue `#4b6ea8` rounded card, geometric white `ORION` title, multi-layer twinkling starfield with diagonal shooting stars, SGR mouse click-to-jump / rapid-click tumble-flip, and clean `AlternateScreenGuard` restoration. |
| **Atomic File Engine, Git Checkpoints & Undo/Redo** | Developer Harness | **VERIFIED_WORKING** | `src/harness/AtomicFileEngine.ts`<br>`src/harness/CheckpointService.ts` | `OrionCliV2HarnessAndTuiAcceptance.test.ts` (16B, 16E) | SHA-256 conflict detection refuses to overwrite external user edits during `/undo` or atomic writes. |
| **6-Model Local Ollama Routing & Offline Heuristic Router** | AI / Models | **VERIFIED_WORKING** | `src/main/services/OrionAIProviderRouter.ts`<br>`src/main/services/AIProvider.ts` | `Campaign4ReleaseCandidateValidation.test.ts`<br>`OrionCliV2HarnessAndTuiAcceptance.test.ts` (16G.4) | Zero mandatory API spend. Falls back cleanly to deterministic local heuristic planning if Ollama daemon and cloud keys are unavailable. |
| **Desktop Input & UI Automation Grounding** | Computer Use | **PARTIALLY_IMPLEMENTED** | `src/main/services/computer/InputControlService.ts`<br>`src/main/services/computer/ScreenUnderstandingService.ts` | `InputControlService.test.ts`<br>`ScreenUnderstandingService.test.ts` | Elevated Administrator (UAC) windows reject synthetic input from non-elevated processes by Windows OS security design; large UI Automation trees take ~0.8–1.2s via PowerShell COM. |
| **Multimodal Vision & Native STT** | Perception / Voice | **PARTIALLY_IMPLEMENTED** | `src/main/services/VisionService.ts`<br>`src/main/services/VoiceService.ts` | `VisionIntegration.test.ts` | Desktop screenshot capture and Windows SAPI TTS work locally; multimodal vision analysis requires a configured VLM (`gemma4:26b` in Ollama or cloud vision key), and native backend STT reports `STT NOT CONFIGURED` when no local recognizer is bound. |
