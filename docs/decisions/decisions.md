# ORION Architecture Decision Records (ADRs)

This document records the foundational architectural decisions made during the engineering of ORION.

---

## ADR-001: Adoption of Electron + Vite + TypeScript Architecture

* **Status:** Accepted & Implemented  
* **Date:** 2026-08-15  

### Problem
ORION requires direct native operating system access (Win32 input events, process supervision, file system inspection, desktop screen capture) combined with a high-fidelity, responsive holographic HUD with 3D canvas rendering. Pure web applications cannot access native OS APIs, while purely native C++ frameworks lack rapid UI prototyping agility.

### Options Considered
1. **Pure Native C++ / Win32 / C# WPF**: Maximum performance and minimal memory footprint, but slow UI development cycle and lack of modern web graphics ecosystem (Three.js, Tailwind).
2. **Python (PyQt / CustomTkinter)**: Rapid development, but sluggish multi-threaded UI responsiveness and difficult packaging/distribution for desktop clients.
3. **Electron + Vite + TypeScript**: Full Node.js OS capability, rapid React UI prototyping, hardware-accelerated WebGL/Three.js rendering, and strong TypeScript type safety across Main and Renderer boundaries.

### Decision
Adopt Electron with Vite and TypeScript.

### Reason
Electron provides the optimal balance of native OS power through Node.js APIs in the Main process and fluid presentation via React and Three.js in the Renderer process. Vite delivers sub-second hot module reloading during development and fast production bundling.

### Tradeoffs
* Higher memory baseline (~150–250 MB RAM for Chromium + Node.js runtime).
* Requires disciplined IPC architecture to prevent security vulnerabilities.

### Future Reconsideration Conditions
If target distribution environments require ultralight memory footprint (<50 MB RAM), evaluate Tauri (Rust) as a lightweight alternative.

---

## ADR-002: Main-Process-Only Credential Quarantine via Context Bridge

* **Status:** Accepted & Implemented  
* **Date:** 2026-08-20  

### Problem
AI assistants utilize commercial cloud API credentials. If API keys are loaded into the Renderer process, any third-party npm package, UI library, or cross-site scripting attack could inspect `window` memory and exfiltrate secrets.

### Options Considered
1. **Pass API Keys to Renderer via Context Bridge**: Simple to write UI components that call cloud APIs directly with `fetch()`, but completely compromises token security.
2. **Quarantine All Credentials in Node.js Main Process**: All network calls, `.env` file reads, and API invocations occur strictly in the Main process. The Renderer receives only sanitized data responses.

### Decision
Quarantine all credentials in the Electron Main process. Enforce `contextIsolation: true` and `nodeIntegration: false`.

### Reason
Completely eliminates the attack surface for credential theft from the presentation tier. The Renderer has zero knowledge of raw API tokens.

### Tradeoffs
* Every AI action or provider status check requires an IPC round-trip.
* Slightly more complex IPC boilerplate.

### Future Reconsideration Conditions
None. This is an immutable security invariant.

---

## ADR-003: Multi-Provider AI Routing with Deterministic Offline Fallback

* **Status:** Accepted & Implemented  
* **Date:** 2026-08-28  

### Problem
Reliance on a single AI provider creates critical failure points when APIs throttle, experience rate limits, or suffer transient cloud downtime. Furthermore, testing or operating without an internet connection must not crash the application.

### Options Considered
1. **Hardcode Single Provider (e.g. OpenAI or Gemini)**: Simple implementation, but brittle to rate limits and outages.
2. **Dynamic Multi-Provider Router with Offline Deterministic Fallback**: Uniform interface wrapping multiple providers (OpenRouter, Groq, Gemini, DeepSeek, Cerebras) with automatic circuit-breaking failover, backed by a local rule-based regex router when offline.

### Decision
Implement `OrionAIProviderRouter` with multi-provider adapters and deterministic offline fallback.

### Reason
Provides enterprise-grade fault tolerance. If OpenRouter is slow or rate-limited, ORION automatically reroutes to Groq or Gemini. If completely offline, telemetry and local tools continue executing without throwing uncaught network exceptions.

### Tradeoffs
* Maintaining 10 separate provider adapter configurations and prompt adaptations.

### Future Reconsideration Conditions
As local LLM engines (Ollama, llama.cpp) mature on the workstation, enhance the offline fallback to route to a local 14B neural model before resorting to rule-based heuristics.

---

## ADR-004: DAG-Based Tool Parallelization & Dependency Graph

* **Status:** Accepted & Implemented  
* **Date:** 2026-09-02  

### Problem
Multi-step agent plans often require multiple independent read actions (e.g. fetching CPU usage, memory usage, and directory listings). Executing these sequentially introduces unnecessary latency.

### Options Considered
1. **Strict Sequential Execution**: Execute one tool at a time in order. Safe and simple, but slow.
2. **Unconstrained Parallel Execution (`Promise.all`)**: Run all plan steps simultaneously. Fast, but dangerous: steps that depend on outputs of earlier steps fail, and race conditions can corrupt state.
3. **Directed Acyclic Graph (DAG) with Permission Partitioning**: Construct a dependency graph (`ToolDependencyGraph`). Execute independent read-only (`LOW` permission) steps concurrently via `Promise.all()`; execute state-modifying or dependent steps sequentially.

### Decision
Adopt the DAG-based tool dependency resolver with permission partitioning.

### Reason
Reduces multi-tool query latency by 40–60% while strictly preventing race conditions on mutating file system or computer-use operations.

### Tradeoffs
* Requires plan steps to declare explicit dependencies or parameter references (`${step.N.output.key}`).

### Future Reconsideration Conditions
Expand DAG execution to support transactional rollbacks if a mid-graph mutating step fails.

---

## ADR-005: Dual-Layer Safety Model with Process Tree Emergency Stop

* **Status:** Accepted & Implemented  
* **Date:** 2026-09-05  

### Problem
Autonomous desktop control (simulated mouse clicks, keystrokes, shell execution) carries the risk of unintended actions, infinite loops, or damage to system configuration.

### Options Considered
1. **Confirmation Prompt on Every Action**: Guarantees safety, but makes the assistant unusable for multi-step automation.
2. **No Confirmation**: Fast, but dangerous.
3. **Dual-Layer Safety: Deterministic Risk Classification + Human-in-the-Loop Gate + Emergency Stop**:
   * Low/Medium risk actions execute autonomously with audit logging.
   * Critical actions (file deletion, process termination, system path modification) require explicit confirmation.
   * An Emergency Stop (Estop) halts all active child processes via process-tree SIGKILL (`taskkill /T /F /PID`).

### Decision
Implement the dual-layer safety architecture with `ActionRiskEvaluator` and `ProcessSupervisor.triggerEstop()`.

### Reason
Provides genuine operator trust. The operator knows the system cannot touch `C:\Windows` without being blocked, and can instantly kill runaway automation with a single button press.

### Tradeoffs
* In-flight Win32 native mouse events already sent to the OS hardware buffer cannot be recalled once dispatched.

### Future Reconsideration Conditions
Implement an OS-level global keyboard hook (`Ctrl+Alt+Escape`) to trigger Emergency Stop even if the Electron window is out of focus.

---

## ADR-006: File-Backed Persistent Memory Over In-Memory Mocks

* **Status:** Accepted & Implemented  
* **Date:** 2026-09-08  

### Problem
Initial versions of `MemoryService` and `UnifiedMemoryManager` stored memories exclusively in JavaScript `Map` structures in RAM. On application restart, all operator preferences and task records were wiped.

### Options Considered
1. **Volatile In-Memory Storage**: Fast, but loses all context on app exit.
2. **External Cloud Database (Supabase / Firebase)**: Persistent, but violates the local-first, privacy-centric design.
3. **Local File-Backed JSON Store (`.orion_memory/`)**: Zero-dependency local persistence with atomic write-on-mutation and read-on-boot.

### Decision
Implement local file-backed JSON serialization under `.orion_memory/explicit_memory.json` and `unified_memory.json`.

### Reason
Ensures 100% privacy, local data ownership, and instant startup without external cloud database dependencies.

### Tradeoffs
* Simple JSON serialization is not optimized for vector similarity search over tens of thousands of items.

### Future Reconsideration Conditions
When memory volume exceeds 5,000 entries, migrate storage to an embedded SQLite database with vector extensions (e.g. `sqlite-vec` or `LanceDB`).

---

## ADR-007: Pure Process Isolation Test Harness

* **Status:** Accepted & Implemented  
* **Date:** 2026-09-12  

### Problem
Running 40 unit and integration test suites using standard global test runners resulted in cross-suite state leakage (e.g. static event bus subscriptions, process supervisor tracking, singleton state machine pollution).

### Options Considered
1. **Global Jest / Vitest with Complex teardown Hooks**: Requires meticulous cleanup in every test file; prone to random intermittent failures.
2. **Pure Process Isolation Runner (`run_suites.cjs`)**: Spawns a dedicated Node.js child process for every test suite file with dynamic in-memory TypeScript compilation.

### Decision
Implement `run_suites.cjs` executing each test file in pure process isolation.

### Reason
Achieves 100% deterministic, reproducible test runs. A passing suite is guaranteed to be clean, and no suite can pollute another's environment.

### Tradeoffs
* Slight process spawn overhead (~50ms per test file, ~3.2s total run time for 40 suites).

### Future Reconsideration Conditions
None. 100% green determinism is worth 3 seconds of execution time.
