# ORION: Coded Evidence Index & Auditable Proof Mapping

**Audit Date:** 2026-09-21  
**Repository:** `ORION`  
**Current Commit:** `f312538`  
**Purpose:** Map every technical claim in the portfolio directly to verifiable source code, automated test suites, and empirical benchmark traces.

---

## Systematic Claim-to-Evidence Matrix

### 1. Architecture & Process Security

| Portfolio Claim | Empirical Evidence | Repository Code Location |
| :--- | :--- | :--- |
| **Electron Context Isolation** | Untrusted renderer has zero direct Node.js access; communication strictly mediated via `contextBridge`. | [`src/preload/preload.ts`](../src/preload/preload.ts)<br>[`src/main/index.ts`](../src/main/index.ts) |
| **Main-Process Credential Quarantine** | API keys, tokens, and system secrets stored solely in Node memory; never transmitted to renderer DOM. | [`src/main/services/OrionAIProviderRouter.ts`](../src/main/services/OrionAIProviderRouter.ts)<br>[`src/preload/preload.ts`](../src/preload/preload.ts) |
| **Typed Asynchronous IPC** | Bidirectional event streaming and typed request/response channels across IPC boundary. | [`src/main/ipc/`](../src/main/ipc/)<br>[`src/main/services/__tests__/ComputerIPCIntegration.test.ts`](../src/main/services/__tests__/ComputerIPCIntegration.test.ts) |

---

### 2. AI Routing, Offline Heuristics & Tool DAG

| Portfolio Claim | Empirical Evidence | Repository Code Location |
| :--- | :--- | :--- |
| **Omnichannel 10-Provider AI Routing** | Router supports 10 distinct providers with health tracking and automatic fallback transitions. | [`src/main/services/OrionAIProviderRouter.ts`](../src/main/services/OrionAIProviderRouter.ts)<br>[`src/main/services/AIProvider.ts`](../src/main/services/AIProvider.ts) |
| **Deterministic Offline Fallback** | System diagnostics and fast-path commands execute locally with zero network latency. | [`src/main/services/AIProvider.ts`](../src/main/services/AIProvider.ts#L96)<br>[`src/main/services/__tests__/PhaseCReasoning.test.ts`](../src/main/services/__tests__/PhaseCReasoning.test.ts) |
| **Tool Dependency DAG Resolution** | Sequentially and concurrently executes dependent multi-step plans without deadlocks. | [`src/main/services/ExecutionContext.ts`](../src/main/services/ExecutionContext.ts)<br>Benchmark Task 05 in [`benchmark/run_benchmark.cjs`](../benchmark/run_benchmark.cjs) |
| **Extensible Tool Registry** | Over 15 registered tools across system, filesystem, developer, and video domains. | [`src/main/services/ToolRegistry.ts`](../src/main/services/ToolRegistry.ts)<br>[`src/main/services/ToolService.ts`](../src/main/services/ToolService.ts) |

---

### 3. Safety, Governance & Containment

| Portfolio Claim | Empirical Evidence | Repository Code Location |
| :--- | :--- | :--- |
| **Pre-Execution Risk Classification** | Every action evaluated into LOW, MEDIUM, HIGH, or CRITICAL before execution. | [`src/main/services/ActionRiskEvaluator.ts`](../src/main/services/ActionRiskEvaluator.ts)<br>[`src/main/services/__tests__/Phase8ActionSafety.test.ts`](../src/main/services/__tests__/Phase8ActionSafety.test.ts) |
| **System Root Protection** | Access to `C:\Windows\System32\` deterministically blocked; verified 3/3 times in benchmark. | [`src/main/services/computer/ComputerPermissionService.ts`](../src/main/services/computer/ComputerPermissionService.ts)<br>Benchmark Task 10 in [`benchmark/reports/latest-report.md`](../benchmark/reports/latest-report.md) |
| **Process-Tree Emergency Stop (Estop)** | Recursive termination of spawned process trees using Windows `taskkill /PID /T /F`. | [`src/main/services/computer/ProcessSupervisor.ts`](../src/main/services/computer/ProcessSupervisor.ts)<br>[`src/main/services/__tests__/ProcessSupervisorEstop.test.ts`](../src/main/services/__tests__/ProcessSupervisorEstop.test.ts) |

---

### 4. Computer-Use, OS Interaction & Vision

| Portfolio Claim | Empirical Evidence | Repository Code Location |
| :--- | :--- | :--- |
| **Native Win32 Mouse Control** | Native C# utility attaches to `OpenInputDesktop`; verified `dx=0, dy=0` at 440 ms avg latency. | [`src/main/platform/win32-native-input.cs`](../src/main/platform/win32-native-input.cs)<br>[`src/main/services/computer/InputControlService.ts`](../src/main/services/computer/InputControlService.ts) |
| **Native Keystroke Injection** | WScript SendKeys dispatches text and special keys cleanly; verified in Task 07. | [`src/main/services/computer/InputControlService.ts`](../src/main/services/computer/InputControlService.ts)<br>[`src/main/services/__tests__/InputControlService.test.ts`](../src/main/services/__tests__/InputControlService.test.ts) |
| **Hardware Screen Capture** | Captures 1920Ã—1080 display frame buffer via Electron `desktopCapturer` in under 100 ms. | [`src/main/services/computer/ScreenCaptureService.ts`](../src/main/services/computer/ScreenCaptureService.ts)<br>[`src/main/services/__tests__/ScreenUnderstandingService.test.ts`](../src/main/services/__tests__/ScreenUnderstandingService.test.ts) |
| **UI Window Grounding** | Resolves active window title, process ID, and element bounding boxes. | [`src/main/services/computer/ScreenUnderstandingService.ts`](../src/main/services/computer/ScreenUnderstandingService.ts)<br>[`src/main/services/computer/WindowManagerService.ts`](../src/main/services/computer/WindowManagerService.ts) |
| **Cold-Boot Memory Persistence** | Facts and preferences persist across application reboot in explicit JSON files. | [`src/main/services/memory/MemoryService.ts`](../src/main/services/memory/MemoryService.ts)<br>Benchmark Task 09 in [`benchmark/reports/latest-report.md`](../benchmark/reports/latest-report.md) |
| **Developer Repository Search** | Recursive file tree walk, programming language identification, and symbol search. | [`src/main/platform/DeveloperAgentProvider.ts`](../src/main/platform/DeveloperAgentProvider.ts)<br>[`src/main/services/__tests__/Phase12DeveloperAgent.test.ts`](../src/main/services/__tests__/Phase12DeveloperAgent.test.ts) |

---

### 5. Verification, Testing & Build Rigor

| Portfolio Claim | Empirical Evidence | Repository Code Location |
| :--- | :--- | :--- |
| **40/40 Automated Test Suites (100% Green)** | All 40 unit and integration suites pass in pure process isolation without global state bleed. | [`run_suites.cjs`](../run_suites.cjs)<br>[`docs/testing/testing.md`](../docs/testing/testing.md) |
| **Production Build Reliability** | Clean TypeScript compile (0 errors) and production Vite packaging. | [`package.json`](../package.json)<br>[`vite.config.ts`](../vite.config.ts) |
| **30-Run Live Benchmark (96.7% Success)** | 29/30 runs passed; raw telemetry JSON and markdown reports generated automatically. | [`benchmark/results/benchmark_results_2026-09-21T15-11-52-274Z.json`](../benchmark/results/benchmark_results_2026-09-21T15-11-52-274Z.json)<br>[`benchmark/reports/latest-report.md`](../benchmark/reports/latest-report.md) |
| **Closed-Loop Engineering Fix** | Measured 90.0% baseline, investigated Session 0 failure, deployed native fix, re-tested to 96.7%. | [`benchmark/reports/session0-input-investigation.md`](../benchmark/reports/session0-input-investigation.md)<br>[`benchmark/reports/post-fix-comparison.md`](../benchmark/reports/post-fix-comparison.md) |
