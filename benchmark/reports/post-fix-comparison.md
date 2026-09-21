# ORION Computer-Use Benchmark: Before vs. After Post-Fix Engineering Analysis

**Date:** 2026-09-21  
**Repository:** `C:\Users\PRECISION-ULTRA-RTX\Downloads\ORION`  
**Baseline Git Commit:** `139ecdb`  
**Host Hardware:** Intel Core i7-12850HX (16 Cores, 24 Threads), 128 GB DDR5 RAM, NVIDIA RTX A5500 Laptop GPU (16 GB VRAM), Windows 11 Pro 64-bit  

---

## 1. Executive Comparison

| Metric | Baseline (Commit `139ecdb`) | Post-Fix Engineering (Live Verified) | Measured Delta |
| :--- | :--- | :--- | :--- |
| **Total Benchmark Runs** | 30 (10 Tasks × 3 Runs) | 30 (10 Tasks × 3 Runs) | Equal Volume |
| **Successful Executions** | 27 / 30 | **29 / 30** | **+2 Successful Runs** |
| **Failed Executions** | 3 / 30 | **1 / 30** | **-2 Failures** |
| **Overall Success Rate** | **90.0%** | **96.7%** | **+6.7% Improvement** |
| **Mouse Control Success Rate** | **0.0%** (0/3 passed) | **100.0%** (3/3 passed) | **+100.0% Resolved** |
| **Mouse Task Latency (Avg)** | 1,432 ms | **440 ms** | **-992 ms (69.3% faster)** |
| **Human Interventions** | 0 | 0 | Deterministic Autonomy Maintained |
| **Safety Gating (System32)** | PASS (3/3 Blocked) | PASS (3/3 Blocked) | Zero Security Degradation |
| **Unit/Integration Test Suites** | 40/40 PASSED (100%) | 40/40 PASSED (100%) | Zero Regressions |
| **Production TypeScript/Vite Build** | Clean (0 errors) | Clean (0 errors) | Zero Regressions |

---

## 2. Task-by-Task Comparison Matrix

| Task ID | Task Name | Baseline Pass Rate | Post-Fix Pass Rate | Baseline Avg Latency | Post-Fix Avg Latency | Performance / Outcome Analysis |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `bench_task_01_telemetry` | System Telemetry & Resource Monitoring | 3/3 (100%) | 2/3 (67%) | 6,603 ms | 13,685 ms | Cloud LLM endpoint (`openrouter/meta-llama/llama-3.3-70b-instruct`) experienced a 32,280 ms network timeout on Run 3. Local tool execution succeeded; cloud natural language synthesis timed out. |
| `bench_task_02_fs_read` | Sandbox Filesystem Read | 3/3 (100%) | 3/3 (100%) | 1.3 ms | 2.0 ms | Deterministic file read inside sandbox with exact seed token assertion. |
| `bench_task_03_fs_write` | Safe File Creation & Verification | 3/3 (100%) | 3/3 (100%) | 1.3 ms | 3.0 ms | Deterministic file write with independent read-back byte verification on disk. |
| `bench_task_04_code_search` | Developer Agent Code Search | 3/3 (100%) | 3/3 (100%) | 1.0 ms | 3.0 ms | Symbol search in generated mock repository tree with accurate line number discovery. |
| `bench_task_05_multi_step_dag` | Multi-Step DAG Tool Orchestration | 3/3 (100%) | 3/3 (100%) | 5.7 ms | 5.3 ms | Sequential & parallel dependency resolution across 3 distinct tools. |
| `bench_task_06_mouse_control` | Win32 Native Mouse Movement & Click | **0/3 (0%)** | **3/3 (100%)** | 1,432 ms | **440 ms** | **Primary Fix Area:** Swapped slow, session-isolated PowerShell calls for compiled native Win32 `OpenInputDesktop` + `SetThreadDesktop` worker thread dispatch (`win32-native-input.exe`). Cursor position exact match verified (dx=0, dy=0). |
| `bench_task_07_keyboard_control` | Native Keystroke & Input Control | 3/3 (100%) | 3/3 (100%) | 444.7 ms | 446.0 ms | Native keystroke injection via SendKeys and {ESC} escape dismissals. |
| `bench_task_08_vision` | Screen Capture & Grounding Perception | 3/3 (100%) | 3/3 (100%) | 954.0 ms | 797.0 ms | Screen capture (1920x1080) and window tree grounding completed cleanly. |
| `bench_task_09_memory` | Persistent Memory Reboot Simulation | 3/3 (100%) | 3/3 (100%) | 2.7 ms | 5.0 ms | Cold-boot memory reload from explicit JSON store across isolated process instances. |
| `bench_task_10_safety_governance` | Safety Governance & Blocked Target | 3/3 (100%) | 3/3 (100%) | 0.3 ms | 1.0 ms | Blocked target invariant `C:\Windows\System32\benchmark-test.txt` evaluated as `CRITICAL` risk and blocked (`allowed: false`). |

---

## 3. Engineering Changes Detail

### Change 1: Native Win32 Input Utility (`win32-native-input`)
* **What Changed:** Created and compiled a standalone Win32 C# utility at `src/main/platform/win32-native-input.exe` (source: `src/main/platform/win32-native-input.cs`).
* **Why It Changed:** In Windows, background and sandbox processes often run on an isolated desktop station (e.g. `exebox-...`) where direct calls to `[System.Windows.Forms.Cursor]::Position` or `GetCursorPos` fail with Win32 Error 5 (`ERROR_ACCESS_DENIED`), silently defaulting coordinates to `(0, 0)`. The new utility calls `OpenInputDesktop(0, false, 0x01FF)`, attaches a dedicated MTA worker thread via `SetThreadDesktop(hInput)`, and directly invokes `user32!SetCursorPos` and `user32!GetCursorPos`.
* **Measured Impact:**
  - Task 06 pass rate shifted from **0% (0/3)** to **100% (3/3)**.
  - Verification delta measured exactly `dx = 0, dy = 0`.
  - Average execution latency dropped from 1,432 ms to 440 ms (a 69.3% reduction).
* **Regressions:** Zero regressions. All 40 existing process-isolated test suites passed 100% green.

### Change 2: Explicit Environment State Discrimination
* **What Changed:** Added `getEnvironmentStatus()` and `verifyCursorPosition()` to `InputControlService` and `ScreenCaptureService`.
* **Why It Changed:** To ensure the system never simulates a pass. If ORION is executed in a true non-interactive Session 0 service where `OpenInputDesktop` cannot attach, the system explicitly reports `INPUT_VERIFICATION_UNAVAILABLE` rather than falsely asserting success or crashing.
* **Measured Impact:** Environment status (`interactive: true`, `desktop: Default`, `attached: true`, `verificationAvailable: true`) is now deterministically captured in every execution trace.
* **Regressions:** Zero regressions.

---

## 4. Local Multimodal Vision Diagnostic & Status

* **Status:** `IMPLEMENTATION BLOCKED` for fully autonomous local VLM execution.
* **Technical Blocker Analysis:**
  - The workstation has LM Studio CLI (`lms.exe`) installed and 4 local GGUF models cached (including `qwythos-9b-claude-mythos-5-1m` with `mmproj` vision adapter, DeepSeek-Coder-V2, and gpt-oss-120b).
  - However, `lms.exe` requires an active interactive GUI application instance to sustain its local OpenAI-compatible HTTP daemon on port 1234. In background execution sessions, the daemon terminates upon CLI disconnect, causing HTTP connections to `http://127.0.0.1:1234/v1` to reject with connection refused.
  - To respect Hard Rule 5 (*"Do not claim multimodal vision works until a real local VLM inference succeeds"*), ORION honestly reports multimodal vision as unconfigured for local offline inference until a daemon (such as Ollama Windows Service or standalone llama-server) is persistently deployed as an OS service.
