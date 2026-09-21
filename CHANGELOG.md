# Changelog

All notable changes to the **ORION** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Local Ollama neural model adapter for 100% offline GPU inference (`qwen2.5:14b-instruct`).
- DirectX Desktop Duplication API (DXGI) screen capture bridge (<16ms latency).
- On-device local speech-to-text via Whisper.cpp / ONNX runtime.
- Global OS hardware Emergency Stop hotkey hook (`Ctrl+Alt+Escape`).
- Embedded vector memory using SQLite + `sqlite-vec` / LanceDB.

---

## [1.0.0] - 2026-09-21

### Added
- **Formal Documentation Hierarchy**: Established comprehensive engineering documentation under `docs/` (`architecture/`, `ai/`, `tools/`, `vision/`, `security/`, `testing/`, `decisions/`, `roadmap/`).
- **Capability Matrix**: Documented all 18 system capabilities with strict evidence classifications (15 Verified, 3 Partial, 0 Unverified Claims).
- **Architecture Decision Records**: Authored 7 foundational ADRs (ADR-001 through ADR-007) explaining core engineering decisions and tradeoffs.
- **Git Tracking & Safety**: Initialized repository tracking, configured local Git identity, and updated `.gitignore` to prevent tracking of local `.orion_memory/`, `.orion_task_state/`, and runtime caches.
- **Live OpenRouter End-to-End Brain Loop**: Verified real-time communication with OpenRouter Llama 3.3 70B, autonomous planning, system tool execution, and response synthesis (`test_brain_full_loop.cjs`).
- **Live Demonstration Suite**: Authored 30s, 60s, 3m, and 5m live technical demonstration scripts with offline contingency protocols (`docs/demo-plan.md`).
- **Mentor Meeting Discussion Package**: Prepared rigorous technical critique guide and deep systems questions for senior software mentors (`docs/mentor-meeting.md`).

### Changed
- Relabeled `LocalHeuristicAIProvider` as `ORION Offline Rule-Based Fallback Router` (`offline-rule-router`) to ensure honest reporting when external cloud models are unconfigured.
- Upgraded `MemoryService` and `UnifiedMemoryManager` from volatile in-memory Maps to atomic file-backed disk JSON serialization under `.orion_memory/`.
- Replaced flat top-level directory search in `DeveloperAgentProvider` with recursive workspace tree traversal, language classification (TS, JS, Py, Rust, Go), and symbol search.

### Tested
- All 40 test suites passing 100% green in pure process isolation via `run_suites.cjs`.
- Production build verified with zero TypeScript compilation errors (`npm run build`).

---

## [0.9.0] - 2026-09-12

### Added
- **Omnichannel AI Provider Routing**: Implemented dynamic multi-provider routing across OpenRouter, Groq, Gemini, GitHub Models, Cerebras, Mistral, NVIDIA, DeepSeek, and Cloudflare.
- **Circuit Breaker Engine**: Added automatic exponential backoff cooldowns and fault-tolerant failovers upon encountering HTTP 429 or 401 errors.
- **Server-Sent Events Parser (`SSEParser.ts`)**: Implemented streaming token parser with `firstChunkTimeoutMs` (8s) and `interChunkTimeoutMs` (4s) timeout guards.
- **Dynamic Routing Strategies**: Added UI and IPC support for toggling strategies (`SPEED_FIRST`, `BALANCED`, `QUALITY_FIRST`, `VISION`, `CODING`, `AGENT`, `OFFLINE`).

### Changed
- Quarantined all `.env` credentials in Electron Main process; removed any token exposure to Renderer window.

---

## [0.8.0] - 2026-09-05

### Added
- **Universal Desktop Control Engine**: Implemented `ComputerUseService`, `ComputerActionPlanner`, and `ComputerActionExecutor`.
- **Win32 Input Drivers (`InputControlService.ts`)**: Added native mouse cursor positioning, left/right clicks, dragging, scrolling, and keyboard typing via `user32.dll` and `Wscript.Shell`.
- **UI Automation Grounding (`ScreenUnderstandingService.ts`)**: Implemented Windows UI Automation COM tree inspection to resolve element bounding boxes and calculate centroid click coordinates.
- **Closed-Loop Verification (`ComputerActionVerifier.ts`)**: Implemented pre- and post-action observation delta comparisons to compute execution confidence scores.
- **Computer Recovery Policy (`ComputerRecoveryService.ts`)**: Added automated dialog dismissal via Escape key injection and window refocusing.

---

## [0.7.0] - 2026-08-28

### Added
- **Titan Video Production Pipeline**: Integrated domain automation tools for video draft inspection, visual planning, voice checking, and render execution (`TitanClosedLoopPipeline.ts`).
- **Batch Orchestration**: Added multi-target batch rendering support across `Video_001`, `Video_002`, `Video_003` (`TitanBatchOrchestrator.ts`).
- **Release Packaging & Validation**: Implemented automated release manifest generation, cryptographic checksum calculation, and package verification (`TitanToolProvider.ts`).

---

## [0.6.0] - 2026-08-20

### Added
- **Defense-in-Depth Security Layer**: Implemented `ActionRiskEvaluator.ts` scoring actions into `READ_ONLY`, `LOW_RISK`, `MODERATE_RISK`, `HIGH_RISK`, and `CRITICAL`.
- **Protected Paths Enforcement**: Asserted file access boundaries blocking modification or deletion of `C:\Windows`, `C:\Windows\System32`, and parent directory traversal (`..`).
- **Process Supervisor & Emergency Stop**: Implemented `ProcessSupervisor.ts` tracking active child processes and executing process tree SIGKILL termination via `taskkill /T /F /PID`.

---

## [0.5.0] - 2026-08-12

### Added
- **Multi-Tier Electron Architecture**: Configured Electron 33 with isolated React 18 + Vite frontend and typed IPC context bridge (`window.orionApi`).
- **Holographic 3D HUD**: Built interactive command center featuring Three.js 3D rotating world sphere, live system telemetry gauges (`SystemStatusPanel`), activity log feed, and task command panel.
- **Native Hardware Telemetry**: Integrated real-time CPU core timing sampling, RAM consumption tracking, and OS platform reporting via Node.js `os` module.
- **Native Windows Speech Synthesis**: Implemented `VoiceService.ts` utilizing PowerShell `System.Speech.Synthesis.SpeechSynthesizer` with instant cancellation support.

---

## [0.1.0] - 2026-07-15

### Added
- Initial Electron prototype repository.
- Proof-of-concept rule-based intent matching and basic command execution.
