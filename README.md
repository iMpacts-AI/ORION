# ORION — Permission-Based Windows Desktop AI Agent & Computer-Use Automation

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](docs/testing/testing.md)
[![Test Suites](https://img.shields.io/badge/tests-41%2F41%20passed%20--%20100%25-brightgreen.svg)](docs/testing/testing.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](tsconfig.json)
[![Electron](https://img.shields.io/badge/Electron-33.2.1-47848F.svg)](package.json)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](package.json)
[![Security](https://img.shields.io/badge/Security-Context%20Isolated-success.svg)](docs/security/security.md)
[![Architecture](https://img.shields.io/badge/Architecture-Multi--Tier%20IPC-blueviolet.svg)](docs/architecture/architecture.md)

> **"Ideas are ideas. Implementation is the real deal."**  
> *ORION is an open-architecture, permission-based desktop AI agent for Windows. It provides native Win32 input control, hardware telemetry inspection, DAG-based task orchestration, and closed-loop verification under strict human-in-the-loop governance.*

---

## 1. What is ORION?

**ORION** is the flagship technology project developed by **iMpact** (an independent software and AI initiative). 

Unlike conventional AI chatbots that remain confined to isolated browser tabs, ORION operates directly on the Windows operating system. It interfaces with native Win32 APIs, inspects real-time hardware telemetry, decomposes user requests into structured tool dependency graphs, and executes actions with closed-loop verification — all while enforcing strict human-in-the-loop permission gates and an immediate process-tree Emergency Stop.

* **Live Product Website:** [https://impacts-ai.com/orion](https://impacts-ai.com/orion)
* **Initiative:** [iMpact — Technology that matters](https://impacts-ai.com)

---

## 2. The Problem ORION Solves

Modern AI models are powerful reasoners, but they suffer from three critical desktop limitations:
1. **The Sandbox Trap**: Web-based AI assistants cannot inspect local system state, open files, run developer builds, or interact with desktop applications.
2. **The Fragile Single-Provider Bottleneck**: Most agent prototypes depend entirely on a single commercial AI API. When that API rate-limits, throttles, or suffers an outage, the agent crashes.
3. **The Unsafe Autonomous Runaway Risk**: Experimental computer-use agents often lack deterministic guardrails, risking accidental file deletion, system corruption, or credential leakage across process boundaries.

**ORION resolves these issues by combining:**
* **Native Desktop Execution**: Multi-tier Electron architecture with Win32 input drivers and system telemetry.
* **Omnichannel AI Routing**: 10-provider cloud/local AI fabric with automatic failover and deterministic offline fallbacks.
* **Defense-in-Depth Governance**: Deterministic risk scoring, human approval modals, and process-tree Emergency Stop.

---

## 3. Core Architectural Highlights

```mermaid
flowchart TD
    subgraph UI ["Renderer Tier (React 18 + Vite + Three.js)"]
        A[Operator Input / Voice] --> B[App.tsx Orchestrator State]
        B --> C[HUD Panels: Command / Telemetry / Vision / Memory / Titan]
    end

    subgraph Boundary ["IPC Security Boundary (Context Bridge)"]
        C --> D["preload.ts (window.orionApi)"]
        D -- "Typed IPC Invoke (Context Isolated)" --> E["ipcMain.handle (src/main/index.ts)"]
    end

    subgraph Core ["Core Orchestration Tier (Node.js Main Process)"]
        E --> F[OrionOrchestrator]
        F --> G[AgentStateMachine]
        F --> H[TaskSupervisor]
    end

    subgraph Intelligence ["AI Routing & Brain Fabric"]
        F --> I[OrionAIProviderRouter]
        I --> J[OpenRouter / Groq / Gemini / GitHub Models / DeepSeek]
        I --> K[LocalHeuristicAIProvider: Offline Fallback]
    end

    subgraph Safety ["Safety & Governance Tier"]
        F --> L[ActionRiskEvaluator: LOW / MED / HIGH / CRITICAL]
        L --> M[ComputerPermissionService: Human-in-the-Loop Gate]
        M --> N[ProcessSupervisor: Emergency Stop & PID Tree Kill]
    end

    subgraph Execution ["Execution & Perception Tier"]
        M --> O[ToolService: ToolRegistry]
        M --> P[ComputerUseService: Win32 user32.dll / SendKeys]
        F --> Q[VisionService: DesktopCapturer 1080p]
        F --> R[VoiceService: Windows SAPI Native TTS]
    end
```

### Key Engineering Invariants:
* **Zero Secrets in Renderer**: Cloud API credentials remain quarantined exclusively in the Node.js Main process. The Renderer runs in Chromium sandbox with `nodeIntegration: false` and `contextIsolation: true`.
* **DAG Tool Parallelization**: Independent read-only tools execute concurrently via `Promise.all()`, while dependent or mutating actions execute sequentially.
* **Persistent Local Memory**: Memory records persist to disk JSON stores (`.orion_memory/explicit_memory.json` and `unified_memory.json`) and survive restarts.
* **Deterministic Emergency Stop**: Halts all active child processes via Windows PID tree termination (`taskkill /T /F /PID`).

---

## 4. Current Capability Status (Evidence-Based)

To maintain absolute engineering integrity, every capability is classified against empirical test evidence:

| Capability | Status | Verified Evidence | Limitations | Next Step |
| :--- | :--- | :--- | :--- | :--- |
| **System Telemetry Monitoring** | **VERIFIED** | Automated test pass (`DeepMasterIntegration.test.ts`). Live per-core CPU, RAM, and OS release metrics. | Disk queries via PowerShell CIM introduce ~100ms overhead. | Implement 10s caching for disk metrics. |
| **Omnichannel AI Routing** | **VERIFIED** | Automated test pass (`StreamingIntegration.test.ts`). Live OpenRouter test passed with HTTP 200 and 2.1s latency. | Requires internet and valid `.env` tokens. | Add dynamic TTFT latency ranking. |
| **Deterministic Offline Fallback** | **VERIFIED** | Automated test pass (`ComputerActionPlanner.test.ts`). Falls back to `offline-rule-router` when disconnected. | Uses regex heuristics, not neural text generation. | Connect local Ollama 14B model. |
| **DAG Tool Execution** | **VERIFIED** | Automated test pass (`Phase5AgentCore.test.ts`). Dependency resolution and argument substitution (`${step.N.output.key}`). | Parallelism restricted to read-only steps. | Add transactional rollback semantics. |
| **Tool Permission Gates** | **VERIFIED** | Automated test pass (`Phase8ActionSafety.test.ts`). Enforces 4 tiers (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`). | UI approval modal blocks execution thread. | Introduce cryptographic capability tokens. |
| **Process Tree Emergency Stop** | **VERIFIED** | Automated test pass (`ProcessSupervisorEstop.test.ts`). Terminated PID trees and rejects new spawns. | In-flight Win32 buffer events cannot be recalled. | Register global OS hotkey hook. |
| **Desktop Screen Capture** | **VERIFIED** | Automated test pass (`VisionIntegration.test.ts`). Electron `desktopCapturer` captures 1080p frames to DataURL. | Defaults to primary display source index 0. | Add DirectX DXGI capture (<16ms). |
| **Native Mouse & Input Control** | **VERIFIED** | Automated test pass (`InputControlService.test.ts`) & Benchmark Task 06 (3/3 pass). Win32 `user32.dll` with desktop attachment. | UAC elevated dialogs reject non-admin synthetic input. | Compile native C++ SendInput addon. |
| **Speech Synthesis (TTS)** | **VERIFIED** | Real audio emitted through Windows SAPI (`System.Speech`). Instant cancellation supported. | Output quality is standard robotic Windows SAPI voice. | Integrate local Piper / Kokoro neural TTS. |
| **Cloud Multimodal Vision** | **PARTIAL** | `CloudVisionAdapter` interfaces with Gemini 2.0 Flash and OpenRouter. Honest fallback when unconfigured. | Cloud round-trip latency is 1.8–3.2s. | Deploy local on-device VLM (Moondream2). |
| **UI Grounding & Element Tree** | **PARTIAL** | Windows UI Automation COM tree inspection implemented via PowerShell script. | Complex DOM traversal requires ~1.2s per dump. | Compile native C++ UIAutomation client. |
| **Speech Recognition (STT)** | **PARTIAL** | Typed interface ready. Browser Web Speech handles transcription in renderer. | Native backend STT provider is unconfigured. | Bind local Whisper.cpp engine. |
| **Local Multimodal VLM** | **PLANNED / UNCONFIGURED** | Architecture supports local model daemon; requires running GUI/daemon. | Not configured for offline multimodal inference. | Configure Florence-2 / Qwen2-VL locally. |

*For complete capability breakdown, see [docs/capability-matrix.md](docs/capability-matrix.md).*

---

## 5. ORION Computer-Use Benchmark

ORION is systematically evaluated using an automated 10-task benchmark executing across 3 consecutive trials (30 real executions) within an isolated filesystem sandbox (`benchmark/sandbox/`):

> **Benchmark Framing Notice:** The 96.7% pass rate represents the measured outcome of this specific 10-task, 30-run automated test suite. It is not an assertion of universal reliability across arbitrary Windows third-party applications.

* **Benchmark Execution Result:** **29/30 successful executions (96.7%)** across 10 tasks and 30 real runs.
* **Average Task Latency:** 1,539 ms (Median: 5 ms across local OS operations; cloud latency varies with provider).
* **Human Interventions Required:** **0** across all 30 automated trials.
* **Safety Invariant (Task 03):** **100% PASS** (3/3 runs deterministically blocked unauthorized write attempts to `C:\Windows\System32\`).
* **Native Mouse Control (Task 06):** **100% PASS** (3/3 runs verified with 0-pixel offset via compiled Win32 thread-attached input utility; avg latency: 440 ms).
* **Documented Failure:** Task 01 Run 3 (Workspace Initialization) encountered an external OpenRouter cloud API gateway timeout (32,234 ms); 0 local software or input errors.
* **Historical Baseline (v1.0):** 27/30 runs passed (90.0%). All 3 failures were isolated to Task 06 mouse control due to Windows Session 0 / winstation desktop isolation returning `(0, 0)`. Resolved in v1.1 via active desktop thread attachment.

*For complete benchmark artifacts, comparative analyses, and evidence mapping, see [benchmark/reports/latest-report.md](benchmark/reports/latest-report.md), [benchmark/reports/post-fix-comparison.md](benchmark/reports/post-fix-comparison.md), and the [Master Developer Portfolio](reports/PORTFOLIO.md).*

---

## 6. Technology Stack

* **Runtime Framework**: Electron 33.2.1, Node.js v22.23.2
* **Frontend Presentation**: React 18.3.1, Vite 6.0.5, Tailwind CSS 3.4.17
* **3D Visualizations**: Three.js 0.170.0 (Holographic Globe HUD)
* **Language & Types**: TypeScript 5.7.2 (Strict mode across Main, Preload, and Renderer)
* **Operating System APIs**: Win32 `user32.dll` (P/Invoke), Windows UI Automation COM, PowerShell SAPI Speech
* **Testing Infrastructure**: Custom Pure Process Isolation Harness (`run_suites.cjs`)

---

## 7. Workstation Hardware Profile

ORION is engineered and benchmarked on a dedicated high-performance local AI workstation:

* **Host System**: Dell Precision Mobile Workstation (Windows 11 Pro 64-bit)
* **Processor (CPU)**: 12th Gen Intel Core i7-12850HX (16 Cores, 24 Logical Threads)
* **System Memory (RAM)**: 128 GB DDR5
* **Graphics Card (GPU)**: NVIDIA RTX A5500 Laptop GPU (16 GB GDDR6 ECC VRAM, Driver 596.71)
* **Storage**: ~1 TB PCIe 4.0 NVMe SSD

*For the complete local AI experimentation roadmap, see [docs/ai/local-models.md](docs/ai/local-models.md).*

---

## 8. Quickstart & Installation

### Prerequisites
* **Operating System**: Windows 10/11 (x64)
* **Node.js**: v18.0.0 or higher (v22 recommended)
* **Package Manager**: npm v9+

### Setup Instructions
```powershell
# 1. Clone or extract the repository
git clone https://github.com/iMpacts-AI/ORION.git
cd ORION

# 2. Install dependencies
npm install

# 3. Configure environment variables
copy .env.example .env
# Edit .env and insert your API keys (optional: ORION operates in offline mode without keys)

# 4. Run automated test suites (40 suites in pure process isolation)
npm test

# 5. Launch ORION in development mode
npm run dev

# 6. Or compile production executable
npm run build
```

---

## 9. Coders HQ Live Demonstration & Showcase Mode

ORION includes a dedicated, deterministic **Demo & Showcase Controller** accessible directly via the top navigation bar (`[DEMO]` tab). It exercises the authentic orchestration loop across 5 verified scenarios without fabricated results:

1. **Basic Intelligence & Machine Overview**: Natural language query (`"ORION, give me a quick overview of this machine."`) decomposing into a concurrent 3-step DAG plan (`system.get_info`, `system.get_cpu_usage`, `system.get_memory_usage`).
2. **Safe Tool Execution & Telemetry**: Native hardware sensor polling in single-digit milliseconds with execution IDs, durations, and core loads.
3. **Safety Boundary & Permission Enforcement**: Deterministic risk evaluation blocking unauthorized writes to protected Windows system paths (`C:\Windows\System32`).
4. **Visual Perception & Display Stream**: Native 1920×1080 desktop frame buffer capture via Electron `desktopCapturer`.
5. **Failure Recovery & Autonomous Replanning**: Graceful handling of missing files, autonomous replanning recovery, and zero-crash stabilization.

```powershell
# Launch ORION and navigate to the [DEMO] tab in the HUD:
npm run dev
```

*For complete step-by-step walkthroughs, latency benchmarks, and reset instructions, see [docs/DEMO.md](docs/DEMO.md).*

---

## 10. Automated Test Verification

All 41 unit and integration test suites pass 100% green in pure process isolation:

```powershell
=== RUNNING ALL 41 TEST SUITES IN PURE PROCESS ISOLATION ===

RUNNING: CodersHQDemoSuite.test.ts ... [PASS]
RUNNING: ComputerActionPlanner.test.ts ... [PASS]
RUNNING: ComputerActionVerifier.test.ts ... [PASS]
RUNNING: ComputerHUDIntegration.test.ts ... [PASS]
RUNNING: ComputerIPCIntegration.test.ts ... [PASS]
RUNNING: ComputerPermissionService.test.ts ... [PASS]
RUNNING: ComputerRecoveryService.test.ts ... [PASS]
RUNNING: ComputerUseService.test.ts ... [PASS]
RUNNING: DeepMasterIntegration.test.ts ... [PASS]
RUNNING: EndToEndIntegration.test.ts ... [PASS]
RUNNING: InputControlService.test.ts ... [PASS]
...
RUNNING: TitanPackagingPhase7B.test.ts ... [PASS]
RUNNING: VisionIntegration.test.ts ... [PASS]

==================================================
RESULTS: 41/41 SUITES PASSED 100% GREEN
ALL 41 TEST SUITES PASSED IN PURE PROCESS ISOLATION!
```

*For complete test traces and build outputs, see [docs/testing/testing.md](docs/testing/testing.md).*

---

## 10. Documentation Directory

Comprehensive, evidence-based technical documentation is organized in `docs/`:

* **[Architecture Specification](docs/architecture/architecture.md)** — Complete multi-tier architecture, IPC security model, and Mermaid flowcharts.
* **[Capability Matrix](docs/capability-matrix.md)** — Forensic capability inventory classifying all features by verified status.
* **[AI Provider Fabric](docs/ai/ai-providers.md)** — Provider adapters, routing strategies, circuit breakers, and streaming parser.
* **[Local AI Lab Report](docs/ai/local-models.md)** — Workstation hardware verification, VRAM fitting matrix, and candidate model evaluation framework.
* **[Tool System Specification](docs/tools/tools.md)** — Parameter schemas, permission tiers, precondition/postcondition validation.
* **[Visual Perception Engine](docs/vision/vision.md)** — Screen capture pipeline, UI Automation grounding, and latency metrics.
* **[Security & Governance Model](docs/security/security.md)** — Threat model, credential quarantine, and Emergency Stop mechanics.
* **[Test Verification Report](docs/testing/testing.md)** — Automated test runner, 40 passing suites, and live API loop evidence.
* **[Architecture Decision Records](docs/decisions/decisions.md)** — 7 foundational ADRs documenting engineering rationale and tradeoffs.
* **[Product Roadmap](docs/roadmap/roadmap.md)** — 4-horizon evolution plan and the anti-roadmap.
* **[3-Month Engineering Target](docs/roadmap/three-month-targets.md)** — Concrete monthly milestones for Q4 2026.
* **[Live Demonstration Plan](docs/demo-plan.md)** — 30s, 60s, 3m, 5m demonstration scripts with offline contingency.
* **[Mentor Meeting Discussion Guide](docs/mentor-meeting.md)** — High-impact technical questions for senior software mentors.

---

## 10. Repository Structure

```
ORION/
├── README.md                           # Master Technical README
├── CHANGELOG.md                        # Version Release History
├── package.json                        # Project dependencies and build scripts
├── tsconfig.json                       # TypeScript compiler configuration
├── vite.config.ts                      # Vite & Vite-Electron configuration
├── run_suites.cjs                      # Pure process isolation test runner
├── test_brain_full_loop.cjs            # Live OpenRouter end-to-end verification script
│
├── docs/                               # Formal Technical Documentation
│   ├── capability-matrix.md            # Verified capability inventory
│   ├── demo-plan.md                    # Demonstration sequence and scripts
│   ├── mentor-meeting.md               # Senior developer mentorship package
│   ├── architecture/
│   │   └── architecture.md             # System architecture specification
│   ├── ai/
│   │   ├── ai-providers.md             # Omnichannel routing & provider adapters
│   │   └── local-models.md             # Local AI lab report & evaluation framework
│   ├── tools/
│   │   └── tools.md                    # Tool registry, schemas & validation
│   ├── vision/
│   │   └── vision.md                   # Screen capture & optical grounding
│   ├── security/
│   │   └── security.md                 # Threat model, permissions & Estop
│   ├── testing/
│   │   └── testing.md                  # Test suite verification report
│   ├── decisions/
│   │   └── decisions.md                # Architecture Decision Records (ADRs)
│   └── roadmap/
│       ├── roadmap.md                  # Strategic 12-month evolution
│       └── three-month-targets.md      # Measurable Q4 engineering milestones
│
├── reports/                            # Technical Reports & Profiles
│   ├── ORION-technical-report.md       # Comprehensive technical evaluation paper
│   ├── founder-profile.md              # Builder profile & engineering journey
│   └── audits/
│       └── evidence-matrix.md          # Claim-by-claim verification index
│
├── recognition/                        # Showcase & Recognition Package
│   ├── README.md                       # Recognition overview
│   ├── founder-profile.md              # Independent builder biography
│   ├── orion-overview.md               # Executive one-page briefing
│   ├── technical-summary.md            # Architecture & metrics summary
│   ├── evidence-index.md               # Proof-backed capability index
│   ├── achievements.md                 # Verified milestones & technical evidence
│   └── demo-plan.md                    # Presentation & demonstration plan
│
└── src/                                # Application Source Code
    ├── main/                           # Electron Main Process (Sovereign OS execution)
    │   ├── index.ts                    # Main process entrypoint & IPC routing
    │   ├── preload.ts                  # Typed context bridge (window.orionApi)
    │   ├── platform/                   # Browser & Developer agent providers
    │   └── services/                   # Orchestrator, AI Router, Tools, Voice, Vision
    │       ├── computer/               # Computer-use planner, executor, input drivers
    │       ├── titan/                  # Video production pipeline & batch orchestrator
    │       └── __tests__/              # 40 automated test suites
    ├── renderer/                       # Electron Renderer Process (React 18 + Three.js)
    │   ├── App.tsx                     # Main HUD component
    │   ├── hud/                        # Holographic 3D Globe, Telemetry & Status panels
    │   └── screens/                    # Dedicated Computer, Provider & Memory screens
    └── shared/                         # Shared TypeScript types, constants & events
```

---

## 11. About iMpact & Builder Profile

**iMpact** is an independent technology initiative founded by **Saqib** (age 13) with the conviction that great software is built through implementation, honest measurement, and relentless iteration.

* **Founder:** Saqib (Independent Software Builder)
* **Philosophy:** *"Ideas are ideas. Implementation is the real deal."*
* **Ambition:** Building practical, human-centered intelligent systems that respect user privacy, enforce human authority, and solve real computing work.
* **Website:** [https://impacts-ai.com](https://impacts-ai.com)

---

## 12. Security & Responsible Disclosure

ORION treats security as a core architectural constraint. If you discover a vulnerability or security flaw, please review our [Security Architecture](docs/security/security.md) and report findings directly to `security@impacts-ai.com` or via [https://impacts-ai.com/contact](https://impacts-ai.com/contact).
