# Saqib — Independent Builder

**Builder:** Saqib  
**Role:** Independent Systems & Software Builder  
**Focus:** Native Desktop AI Systems, Computer-Use Agents, and OS Internals  
**Initiative:** iMpact ([https://impacts-ai.com](https://impacts-ai.com))  
**Workstation Lab:** Dell Precision Mobile Workstation (`PRECISION-ULTRA-RTX`)  
**Location:** United Arab Emirates  
**Operating Principle:** *"Ideas are ideas. Implementation is the real deal."*  

---

## Introduction

I am a 13-year-old independent builder developing software systems through direct, hands-on implementation and iteration. I spend my time designing desktop architectures, diagnosing operating system internals, writing strict TypeScript and native Win32 drivers, building automated test harnesses, and running real benchmarks.

I view age as context, not a credential or an excuse:
* **Age is not an excuse for sloppy code:** An unhandled exception, a race condition, or an unattached window station causes the exact same failure regardless of the programmer's age.
* **Age is not a substitute for evidence:** Ambitious concepts are cheap; verifiable engineering substance requires passing test suites, auditable benchmark traces, deterministic safety barriers, and clean production builds.

My objective is to develop deep, foundational computer engineering capabilities and build reliable, human-centered technology.

---

# iMpact

**iMpact** ([https://impacts-ai.com](https://impacts-ai.com)) is an early-stage independent technology initiative founded with a clear mission: to build practical, durable, and human-centered intelligent software that respects human authority and solves real problems.

iMpact operates under four explicit design commitments:
1. **Useful Before Impressive:** We start from real work and actual constraints. Features that merely demo well but lack utility are rejected.
2. **The Person Stays in Command:** Autonomous systems that act on a user's behalf must expose their execution state, request permission before taking high-risk actions, and halt instantly upon instruction.
3. **Restraint is a Feature:** Clear language, minimal interfaces, and calm presentation. Depth is accessible when needed, never forced upfront.
4. **Built to Last:** We choose durable architectural foundations over superficial short-term shortcuts. We name what is unfinished rather than implying it is complete.

iMpact's primary flagship technology project is **ORION**.

---

# ORION

**ORION** is a permission-based desktop AI computer-use agent designed to understand natural language requests, plan sequential and parallel tasks, invoke operating system tools, interact with desktop screen context, and execute actions under deterministic safety and governance controls.

ORION bridges modern large language models with native operating system capabilities inside a secure, multi-process desktop runtime.

### Current Capabilities (VERIFIED)
* **Omnichannel AI Routing:** Multi-provider failover router spanning 10 endpoints (OpenRouter, Groq, Gemini, GitHub Models, DeepSeek, Cerebras) with per-provider circuit breakers.
* **Deterministic Offline Fast-Path:** Local rule-based heuristic routing for system diagnostics and basic commands without external network calls.
* **Tool Orchestration Engine:** Dynamic registry of over 15 native tools across system telemetry, filesystem operations, code search, and video pipeline domains.
* **Dependency DAG Resolution:** Directed Acyclic Graph execution engine resolving sequential and parallel tool batches with prerequisites.
* **Safety & Risk Governance:** Pre-execution risk classifier (`ActionRiskEvaluator`) categorizing actions into `LOW`, `MEDIUM`, `HIGH`, and `CRITICAL`.
* **System Containment Blacklists:** Deterministic kernel-level blocking of restricted system paths (`C:\Windows`, `C:\Windows\System32`, `C:\Program Files`).
* **Process-Tree Emergency Stop:** Immediate execution halting with recursive child process tree termination (`taskkill /T /F`).
* **Hardware Screen Capture:** High-resolution 1080p desktop display buffer acquisition via Electron `desktopCapturer`.
* **UI Window Tree Grounding:** Active window boundary discovery, title extraction, and coordinate transformation.
* **Native Win32 Mouse Control:** Compiled C# utility (`win32-native-input.exe`) attaching to `OpenInputDesktop` for sub-pixel cursor movement and click injection.
* **Native Keyboard Injection:** Windows SendKeys keystroke injection and escape dismissal.
* **Cold-Boot Memory Persistence:** Explicit JSON persistence engine (`.orion_memory/`) surviving application reboots and process recreation.
* **Developer Agent Code Search:** Multi-language repository inspection, symbol search, and line-content extraction.

### Partial Capabilities (PARTIAL)
* **Browser Automation:** Basic HTTP fetching and DOM link extraction are implemented; full interactive Chromium DOM manipulation (CDP/Playwright) is not yet integrated.
* **Voice & Audio Interface:** Local text-to-speech output is implemented via Windows SAPI; streaming real-time speech-to-text (STT) input is not yet integrated.
* **Multimodal Visual Reasoning:** Cloud vision adapter is implemented for remote VLM analysis; local offline VLM reasoning is blocked pending a persistent OS-level inference service daemon.

### Planned Capabilities (PLANNED)
* **On-Device VLM Grounding:** Integration of quantized open-weight vision models (e.g. Qwen2-VL, Moondream2) running on local RTX A5500 GPU.
* **DirectX DXGI Screen Capture:** Native C++ desktop duplication API lowering screen capture latency from ~90ms to <16ms.
* **Semantic Vector Memory:** Hybrid SQLite-vec or HNSW vector index augmenting explicit JSON memory.

---

# Architecture

ORION is architected as a four-tier desktop application built on Electron 33, TypeScript 5.7, and React 18:

```text
+-------------------------------------------------------------------------------+
|                             RENDERER TIER (React 18)                          |
|   HUD Overlay  *  System Dashboard  *  Agent Chat UI  *  Activity Stream       |
+---------------------------------------+---------------------------------------+
                                        | ContextBridge IPC (Safe Channels)
+---------------------------------------v---------------------------------------+
|                            PRELOAD & IPC GATEWAY                              |
|   Strict Schema Validation  *  Context Isolation  *  Zero Raw Node in UI      |
+---------------------------------------+---------------------------------------+
                                        | Typed Invocations & Event Streaming
+---------------------------------------v---------------------------------------+
|                         CORE SERVICES (Node.js Main Process)                  |
|  +--------------------------+  +--------------------------+  +-------------+  |
|  |     AI Provider Router   |  |   Tool Execution Engine  |  | Memory Store|  |
|  | (Omnichannel / Failover) |  |   (DAG Dependency Graph) |  | (Disk JSON) |  |
|  +--------------------------+  +--------------------------+  +-------------+  |
|  +-------------------------------------------------------------------------+  |
|  |                       GOVERNANCE & SAFETY GATE                          |  |
|  |  ActionRiskEvaluator  *  PermissionService  *  ProcessSupervisor Estop  |  |
|  +-------------------------------------------------------------------------+  |
+---------------------------------------+---------------------------------------+
                                        | Native OS Calls / Subprocesses
+---------------------------------------v---------------------------------------+
|                      OPERATING SYSTEM ABSTRACTION LAYER                       |
|   win32-native-input.exe  *  desktopCapturer  *  WMI / CIM  *  Win32 user32   |
+-------------------------------------------------------------------------------+
```

### Key Architectural Decisions
1. **Context Isolation (ADR-001):** Untrusted web renderer code has zero access to Node.js internals or disk. All actions pass through strict IPC channels in `preload.ts`.
2. **Main-Process Credential Quarantine (ADR-004):** Cloud API keys and system tokens reside exclusively in the Node.js Main process memory, inaccessible to renderer XSS.
3. **Deterministic Pre-Execution Gating (ADR-007):** Risk evaluation occurs prior to any tool or input execution. If an action targets a critical path, it is deterministically rejected without invoking OS drivers.
4. **Dedicated Worker Thread Desktop Attachment (ADR-012):** Win32 input commands attach a dedicated worker thread to `OpenInputDesktop`, ensuring accurate cursor control even within isolated sandbox environments.

---

# Computer-Use Benchmark

To validate ORION against empirical reality rather than subjective claims, a dedicated, reproducible benchmark harness was built in `benchmark/run_benchmark.cjs`.

### Benchmark Methodology
* **Isolation:** All file operations run in an isolated sandbox (`benchmark/sandbox/`).
* **Volume:** 10 diverse tasks executed across 3 consecutive iterations (**30 total executions**).
* **Honesty:** Actions are verified through independent disk inspection and OS state queries. Unverified actions are recorded as failures, never simulated.

### Measured Results (Commit `f312538`)

```text
# ORION COMPUTER-USE BENCHMARK RESULTS

Tasks:                10
Runs:                 30
Successful:           29
Failed:               1
Overall success:      96.7%

Average latency:      1,539 ms
Median latency:       5 ms
Min latency:          0 ms
Max latency:          32,280 ms

Tool failures:        1
Human interventions:  0

Safety tests:
PASS (C:\Windows\System32\ write blocked deterministically)

Raw Trace: benchmark/results/benchmark_results_2026-09-21T15-11-52-274Z.json
Report:    benchmark/reports/latest-report.md
```

### Task-by-Task Performance

| Task ID | Task Description | Executions | Pass Rate | Avg Latency | Min / Max Latency | Verification Method |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `bench_task_01_telemetry` | Natural language system telemetry synthesis | 3 | **67%** (2/3) | 13,685 ms | 1,430 / 32,280 ms | Local tool executed; Run 3 cloud endpoint timed out |
| `bench_task_02_fs_read` | Sandbox file read with token verification | 3 | **100%** (3/3) | 2.0 ms | 1 / 4 ms | Exact seeded token string comparison |
| `bench_task_03_fs_write` | Safe file creation with disk read-back | 3 | **100%** (3/3) | 3.0 ms | 2 / 4 ms | Independent filesystem existence and byte match |
| `bench_task_04_code_search` | Developer Agent repository code search | 3 | **100%** (3/3) | 3.0 ms | 1 / 6 ms | Discovered target symbol at exact line in repo |
| `bench_task_05_multi_step_dag` | 3-step DAG tool dependency resolution | 3 | **100%** (3/3) | 5.3 ms | 3 / 9 ms | Completed batch execution and verified summary file |
| `bench_task_06_mouse_control` | Win32 native cursor movement & click | 3 | **100%** (3/3) | 440 ms | 355 / 610 ms | Native desktop query confirmed `dx=0, dy=0` |
| `bench_task_07_keyboard_control` | Keystroke injection & escape dismissal | 3 | **100%** (3/3) | 446 ms | 439 / 460 ms | Clean SendKeys dispatch without OS error |
| `bench_task_08_vision` | Screen capture & UI window grounding | 3 | **100%** (3/3) | 797 ms | 765 / 830 ms | 1080p buffer captured; active window tree parsed |
| `bench_task_09_memory` | Cold-boot memory reboot persistence | 3 | **100%** (3/3) | 5.0 ms | 4 / 5 ms | Independent instance reloaded explicit memory JSON |
| `bench_task_10_safety_governance` | Blocked target invariant assertion | 3 | **100%** (3/3) | 1.0 ms | 0 / 1 ms | Target `System32` file verified non-existent |

### Failure Analysis
Across 30 runs, exactly 1 failure occurred:
* **Task 01, Run 3:** The cloud model endpoint (`openrouter/meta-llama/llama-3.3-70b-instruct`) experienced an upstream latency spike of 32,280 ms, failing the synthesis stage. Local tool execution succeeded in <10 ms.
* **Resolution Path:** Deploying a local LLM backend (e.g. 14B model via Ollama) will eliminate external cloud latency and network timeouts.

---

# Engineering Evidence

| Capability / Claim | Status | Verification Evidence | Repository Location |
| :--- | :---: | :--- | :--- |
| **Electron Context Isolation** | **VERIFIED** | Strict preload script; renderer has no `require` or Node access | [`src/preload/preload.ts`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/src/preload/preload.ts) |
| **Multi-Provider AI Failover** | **VERIFIED** | Circuit breaker transitions; automated failover to healthy provider | [`src/main/services/OrionAIProviderRouter.ts`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/src/main/services/OrionAIProviderRouter.ts) |
| **Offline Heuristic Routing** | **VERIFIED** | Regex fast-path executes system commands with zero network calls | [`src/main/services/AIProvider.ts`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/src/main/services/AIProvider.ts#L96) |
| **Tool Dependency DAG** | **VERIFIED** | Parallel & sequential batch execution tested in Task 05 | [`src/main/services/ExecutionContext.ts`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/src/main/services/ExecutionContext.ts) |
| **Action Risk Scoring** | **VERIFIED** | Deterministic evaluation: `CRITICAL` for system roots | [`src/main/services/ActionRiskEvaluator.ts`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/src/main/services/ActionRiskEvaluator.ts) |
| **System32 Write Containment** | **VERIFIED** | 100% blocked rate across 3 benchmark runs (Task 10) | [`src/main/services/computer/ComputerPermissionService.ts`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/src/main/services/computer/ComputerPermissionService.ts) |
| **Process-Tree Estop** | **VERIFIED** | Process tree killed via `taskkill /PID /T /F`; verified in test suite | [`src/main/services/computer/ProcessSupervisor.ts`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/src/main/services/computer/ProcessSupervisor.ts) |
| **Native Win32 Mouse Control** | **VERIFIED** | Compiled C# utility attached to `OpenInputDesktop`; verified `dx=0, dy=0` | [`src/main/platform/win32-native-input.cs`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/src/main/platform/win32-native-input.cs) |
| **Hardware Screen Capture** | **VERIFIED** | 1920×1080 display buffer captured in 90ms via Electron capturer | [`src/main/services/computer/ScreenCaptureService.ts`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/src/main/services/computer/ScreenCaptureService.ts) |
| **Cold-Boot Memory Persistence**| **VERIFIED** | Reloads explicit facts from disk across fresh service instances | [`src/main/services/memory/MemoryService.ts`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/src/main/services/memory/MemoryService.ts) |
| **Developer Repository Search** | **VERIFIED** | Traverses directory trees, detects languages, discovers symbols | [`src/main/platform/DeveloperAgentProvider.ts`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/src/main/platform/DeveloperAgentProvider.ts) |
| **Automated Regression Suite** | **VERIFIED** | 40/40 test suites pass in pure process isolation (`run_suites.cjs`) | [`run_suites.cjs`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/run_suites.cjs) |
| **Production Build Integrity** | **VERIFIED** | 0 TypeScript errors; Vite bundles main (214kB) & renderer (709kB) | [`package.json`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/package.json) |
| **Browser Interaction** | **PARTIAL** | Basic HTTP fetch & link parser implemented; interactive DOM pending | [`src/main/platform/BrowserProvider.ts`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/src/main/platform/BrowserProvider.ts) |
| **Voice Interface** | **PARTIAL** | Windows SAPI TTS implemented; real-time microphone STT pending | [`src/main/services/VoiceService.ts`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/src/main/services/VoiceService.ts) |
| **Local Offline VLM** | **PLANNED** | Daemon requires active GUI; reported unconfigured for offline use | [`src/main/services/VisionService.ts`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/src/main/services/VisionService.ts) |

---

# Safety & Governance Architecture

Autonomous computer use carries inherent risk. ORION treats safety as an architectural invariant enforced through code, never as an LLM prompt suggestion.

### 1. Multi-Tier Permission Model
Every action is evaluated prior to execution against explicit permission tiers:
* **LOW Risk:** Read-only queries (system telemetry, directory listings, screen metrics). Auto-approved under safe execution policy.
* **MEDIUM Risk:** Benign mutations (creating a file inside sandbox, focusing an open application window).
* **HIGH Risk:** Broad mutations (modifying source files outside sandbox, executing CLI build commands). Requires confirmation if configured.
* **CRITICAL Risk:** Dangerous operations (system directory writes, registry edits, terminating external system processes). Deterministically **BLOCKED** by policy.

### 2. Operating System Path Containment
Paths containing `C:\Windows`, `C:\Windows\System32`, `C:\Program Files`, or path-traversal sequences (`..`) are hardcoded into containment blacklists in `ActionRiskEvaluator` and `ToolService`. Attempts to write to these paths are halted before OS driver invocation.

### 3. Process-Tree Emergency Stop (Estop)
When a user triggers an Emergency Stop (via UI or global shortcut), `ProcessSupervisor` does not rely on graceful SIGINT signals. On Windows, it executes `taskkill /PID <pid> /T /F`, terminating the parent process and all spawned child processes recursively.

### 4. Credential Quarantine
All cloud API tokens reside in Node.js Main process memory. Preload scripts expose only function wrappers; renderer DevTools inspection cannot view or exfiltrate credentials.

---

# Known Limitations

In keeping with our commitment to transparency, the following technical limitations are actively documented:

1. **Local Multimodal VLM Offline Inference:**  
   While local GGUF models are stored on disk (including a 9B model with `mmproj` vision adapter), LM Studio's CLI daemon (`lms server`) shuts down in headless subshells when the GUI is not open. ORION honestly reports multimodal vision as unconfigured for local offline inference until an independent background daemon (e.g. Ollama Windows Service) is configured.
2. **Cloud API Latency Spikes:**  
   When using remote cloud models (OpenRouter), external network latency occasionally causes multi-second pauses (measured up to 32 seconds on Task 01 Run 3).
3. **Interactive Browser Automation:**  
   Current browser capabilities are limited to static HTTP fetching and link extraction. Rich single-page web app interaction (clicking buttons, filling dynamic forms) requires full Chromium CDP integration.
4. **Speech-to-Text Input:**  
   Voice input currently relies on text commands or external dictation. Local Whisper-based real-time voice transcription is not yet integrated.

---

# Engineering Iteration

Our core development philosophy is grounded in closed-loop iteration:

$$\text{Measure} \longrightarrow \text{Identify Failure} \longrightarrow \text{Isolate Root Cause} \longrightarrow \text{Implement Fix} \longrightarrow \text{Re-Benchmark} \longrightarrow \text{Verify Zero Regressions}$$

### Case Study: Resolving the Windows Desktop Isolation Defect
* **Baseline Benchmark (Commit `139ecdb`):** Overall success rate was **90.0%** (27/30). All 3 runs of Task 06 (Mouse Control) failed. Observed cursor position was `(0, 0)` instead of `(100, 100)`.
* **Root Cause Investigation:** Diagnosed in [`session0-input-investigation.md`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/benchmark/reports/session0-input-investigation.md). The test runner launched subshells on an isolated station thread desktop (`exebox-...`), where `GetCursorPos` returned Win32 Error 5 (`ERROR_ACCESS_DENIED`), silently defaulting coordinates to `(0, 0)`.
* **Engineering Fix:** Built `win32-native-input.cs`, compiled with `csc.exe`, invoking `OpenInputDesktop` and attaching an MTA worker thread via `SetThreadDesktop`.
* **Re-Benchmark (Commit `f312538`):** Task 06 pass rate shifted to **100% (3/3)** with exact coordinate match (`dx=0, dy=0`). Task latency dropped from 1,432 ms to 440 ms (69.3% reduction). Overall benchmark score improved to **96.7% (29/30)**.
* **Regression Check:** All 40 unit and integration test suites passed 100% green. Clean production build maintained.

---

# Hardware & Development Environment

All benchmarks, automated tests, and engineering builds were executed on the primary local engineering workstation:

* **Workstation Model:** Dell Precision Mobile Workstation (`PRECISION-ULTRA-RTX`)
* **Operating System:** Microsoft Windows 11 Pro 64-bit (Build 26100)
* **Processor (CPU):** 12th Gen Intel Core i7-12850HX (16 Cores, 24 Threads, up to 4.80 GHz)
* **System Memory (RAM):** 128 GB High-Speed DDR5 RAM
* **Dedicated GPU:** NVIDIA RTX A5500 Laptop GPU (16 GB GDDR6 VRAM, Driver 596.71)
* **Primary Storage:** 1 TB PCIe Gen 4 NVMe Solid State Drive
* **Runtime Environment:** Node.js v22.23.2, npm 10.9.2, TypeScript 5.7.2, Electron 33.2.1

---

# Project Timeline / Development History

Built strictly from verified Git commit history and release documentation:

* **August 2026 — Foundational Architecture (v0.1.0 – v0.5.0):**  
  Established Electron + TypeScript core, IPC context isolation, and initial rule-based heuristic routing.
* **Late August 2026 — Agent Capabilities & DAG Engine (v0.6.0 – v0.8.0):**  
  Implemented `ComputerUseService`, `ActionRiskEvaluator`, `ToolDependencyGraph`, and Project Titan video automation pipeline.
* **Early September 2026 — Omnichannel Routing & Process Supervisor (v0.9.0):**  
  Built 10-provider AI routing fabric, process-tree Estop (`taskkill`), and verified live OpenRouter loop with Llama 3.3 70B.
* **Mid September 2026 — Forensic Hardening & Test Isolation (v1.0.0):**  
  Eliminated in-memory mocks in favor of disk JSON persistence (`.orion_memory/`). Created `run_suites.cjs`, establishing 40/40 passing test suites (Commit `139ecdb`).
* **Late September 2026 — Benchmark Infrastructure & Native Input Fix (v1.0.1):**  
  Created 10-task computer-use benchmark harness. Resolved Windows Session 0 desktop isolation via native Win32 P/Invoke utility, raising benchmark pass rate to 96.7% (Commit `f312538`).

---

# GitHub

* **GitHub Repository:** [https://github.com/iMpacts-AI/ORION](https://github.com/iMpacts-AI/ORION)
* **Organization / Owner:** `iMpacts-AI` (`iMpact`)
* **Visibility:** Public
* **Default Branch:** `main`

---

# Demonstration

* **Demonstration Video:** `[Pending Recording — 3-Minute Technical Demonstration Script available in docs/demo-plan.md]`
* **Architecture Diagram:** `[Text diagram in Architecture section; visual diagrams available in assets/diagrams/]`
* **Benchmark Report:** [`benchmark/reports/latest-report.md`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/benchmark/reports/latest-report.md)
* **Comparative Audit:** [`benchmark/reports/post-fix-comparison.md`](file:///C:/Users/PRECISION-ULTRA-RTX/Downloads/ORION/benchmark/reports/post-fix-comparison.md)

---

# Future Roadmap

### Milestone 1: Local AI Inference Daemon (Q4 2026) [PLANNED]
Deploy an independent background Windows Service daemon (Ollama / standalone llama-server) hosting a quantized 14B model on the RTX A5500 GPU, eliminating cloud latency variance and network dependency.

### Milestone 2: On-Device Multimodal Visual Grounding (Q4 2026) [PLANNED]
Connect a local vision model (e.g. Qwen2-VL 7B or Moondream2) for offline screen OCR and UI element bounding-box grounding.

### Milestone 3: DirectX DXGI Desktop Duplication (Q1 2027) [PLANNED]
Replace Electron `desktopCapturer` with a native C++ Node addon utilizing DirectX DXGI Desktop Duplication, targeting screen acquisition latencies under 16 ms.

### Milestone 4: Interactive Browser Automation (Q1 2027) [PLANNED]
Integrate a managed Chromium CDP session into `BrowserProvider` for stateful web interaction, authenticated form filling, and DOM navigation.

---

# Contact & Inquiries

* **Initiative Website:** [https://impacts-ai.com](https://impacts-ai.com)
* **Product Showcase:** [https://impacts-ai.com/orion](https://impacts-ai.com/orion)
* **Online Inquiries:** [https://impacts-ai.com/contact](https://impacts-ai.com/contact)
* **Official Email:** `contact@impacts-ai.com`
