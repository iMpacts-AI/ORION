# ORION: Autonomous Desktop AI Agent â€” 2-Minute Reviewer Brief

**Builder:** Saqib (Independent Builder, Age 13, United Arab Emirates)  
**Initiative:** iMpact ([https://impacts-ai.com](https://impacts-ai.com))  
**Project:** ORION (Permission-Based Desktop AI Computer-Use Agent)  
**Git Baseline:** Commit `f312538` (Branch: `main`)  
**Hardware:** Dell Precision Mobile Workstation (Intel i7-12850HX Â· 128 GB DDR5 Â· NVIDIA RTX A5500 16 GB VRAM)  

---

## 1. What is ORION?
ORION is an open-architecture, permission-based desktop AI computer-use agent. It enables AI language models to interact with the operating systemâ€”reading telemetry, executing filesystem tasks, capturing screen context, moving the cursor, and injecting keystrokesâ€”under deterministic code-level safety boundaries.

---

## 2. Core Architecture
Built on **Electron 33**, **React 18**, and **TypeScript 5.7**:
* **Process Segregation:** Untrusted renderer code is context-isolated; sensitive API keys and tokens reside solely in Node.js Main process memory.
* **Omnichannel AI Routing:** Multi-provider router spanning 10 backends (OpenRouter, Groq, Gemini, DeepSeek) with per-provider circuit breakers.
* **DAG Tool Engine:** Directed Acyclic Graph orchestrates sequential and parallel tool execution batches.
* **Deterministic Safety Gate:** `ActionRiskEvaluator` gates all actions prior to OS dispatch. System roots (`C:\Windows`, `C:\Windows\System32`) are unconditionally blocked.
* **Process-Tree Estop:** Emergency Stop invokes Windows `taskkill /PID /T /F` to terminate entire child process trees instantly.

---

## 3. Verified Computer-Use Benchmark (Live Tested)
An automated 10-task benchmark was executed across 3 consecutive iterations (**30 total executions**) inside an isolated sandbox (`benchmark/sandbox/`):

* **Overall Success Rate:** **96.7%** (29/30 executions successful)
* **Average Latency:** 1,539 ms (Median: 5 ms across local operations)
* **Human Interventions:** **0** (Fully autonomous execution)
* **Safety Gating:** **100% PASS** (Targeted `System32` modification blocked deterministically)
* **Mouse Control:** **100% PASS** (3/3 runs verified with exact pixel match: `dx=0, dy=0`)
* **Automated Regression Suite:** **40/40 test suites passing (100% green)** in pure process isolation
* **Production Build:** Clean TypeScript compilation (0 errors)

---

## 4. Strongest Verified Capabilities
1. **Native Win32 Mouse & Keyboard Control:** Compiled C# utility attaches to `OpenInputDesktop` for precise cursor repositioning and SendKeys dispatch.
2. **Deterministic Root Containment:** Zero unauthorized system modifications; hardcoded protection of OS paths.
3. **Cold-Boot Memory Persistence:** Explicit facts reload from disk (`.orion_memory/`) across fresh process instances.
4. **Developer Code Search:** Multi-language repository walking, symbol discovery, and snippet extraction.
5. **Multi-Step Tool Orchestration:** Parallel DAG execution of telemetry, read, and write operations.

---

## 5. Current Limitations (Transparently Documented)
* **Local Offline VLM:** Cloud multimodal vision is supported; offline local VLM inference is currently unconfigured because local CLI daemons require an active GUI window.
* **Cloud Network Latency:** Remote API timeouts caused the sole benchmark failure (Task 01 Run 3: 32s pause).
* **Browser Depth:** Static HTTP fetch and link parsing are active; interactive Chromium CDP session is in development.
* **Voice Input:** Text-to-speech output is functional; real-time microphone STT is not yet integrated.

---

## 6. Verification Artifacts & Contact
* **GitHub Repository:** [https://github.com/iMpacts-AI/ORION](https://github.com/iMpacts-AI/ORION)
* **Raw Benchmark Trace:** [`benchmark/results/benchmark_results_2026-09-21T15-11-52-274Z.json`](../benchmark/results/benchmark_results_2026-09-21T15-11-52-274Z.json)
* **Benchmark Report:** [`benchmark/reports/latest-report.md`](../benchmark/reports/latest-report.md)
* **Comparison Analysis:** [`benchmark/reports/post-fix-comparison.md`](../benchmark/reports/post-fix-comparison.md)
* **Demonstration Video:** `[Pending Recording â€” Script in docs/demo-plan.md]`
* **Contact:** `contact@impacts-ai.com` | [https://impacts-ai.com/contact](https://impacts-ai.com/contact)
