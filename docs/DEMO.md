# ORION Demo Guide

## Objective

This document outlines the exact, repeatable procedure for demonstrating the ORION desktop AI command system to technical evaluators at Coders HQ. The goal is to prove that ORION is a real, robust, and architecturally sound agentic system by exercising its core orchestration pipeline: **Input → Intent Classification → DAG Planning → Permission Gate → Native Tool Execution → Result Verification → Response Synthesis**.

---

## Environment

* **Host Operating System:** Windows 10 / 11 (x64)
* **Runtime Environment:** Node.js v20+ / Electron 34+
* **Display Configuration:** Standard interactive desktop display (1920×1080 recommended for optimal HUD layout)
* **Network Connectivity:** Offline-ready via deterministic rule router; cloud neural failover enabled when external API keys (`OPENROUTER_API_KEY`, `GROQ_API_KEY`, `GEMINI_API_KEY`) are present in `.env`
* **Working Directory:** `C:\Users\PRECISION-ULTRA-RTX\Downloads\ORION`

---

## Startup

1. **Terminal Launch:**
   ```bash
   cd C:\Users\PRECISION-ULTRA-RTX\Downloads\ORION
   npm run dev
   ```
2. **Pre-Flight Verification:**
   * Electron desktop HUD opens at 1600×960 resolution.
   * Verify top navigation status shows `LOCAL IPC: ONLINE` and `STATE: STANDBY`.
   * Switch to the `[DEMO]` tab on the top mode navigation bar to access the dedicated Showcase Controller and live pipeline trace.

---

## Primary Demo: Basic Intelligence & Machine Overview

* **Demonstration Goal:** Prove natural language intent classification, parallel multi-tool DAG planning, and telemetry synthesis.
* **Exact Command:**
  ```
  ORION, give me a quick overview of this machine.
  ```
* **Execution Flow:**
  1. `Intent Classification`: Identified as `SYSTEM_QUERY` (100% confidence).
  2. `Plan Generation`: Decomposed into a 3-step DAG batch (`system.get_info`, `system.get_cpu_usage`, `system.get_memory_usage`).
  3. `Permission Check`: All 3 tools verified as `LOW` risk (Read-Only) and cleared for parallel dispatch.
  4. `Tool Execution`: Dispatched concurrently via `Promise.all` in <10ms.
  5. `Response Synthesis`: Synthesized into a structured machine report covering hostname, OS release, CPU model, total logical cores, uptime, average CPU load, and RAM utilization.
* **Expected Result:** Clean structured telemetry output displayed in the HUD with full tool dispatch metadata.

---

## Secondary Demo: Safe Tool Use & Real-time Telemetry

* **Demonstration Goal:** Prove real hardware sensor polling with execution metrics, call IDs, and core-by-core telemetry.
* **Exact Command:**
  ```
  Check current CPU and memory usage.
  ```
* **Execution Flow:**
  1. Resolves `system.get_cpu_usage` and `system.get_memory_usage`.
  2. Polls live CPU core tick counters and system RAM bytes directly via native OS bindings.
  3. Returns precise utilization percentages and individual core performance metrics.
* **Duration:** ~738ms total roundtrip latency.

---

## Optional Vision Demo: Visual Perception & Display Stream

* **Demonstration Goal:** Prove full-resolution desktop display capture without simulated frames.
* **Exact Command:** Trigger from `[DEMO]` screen card: **DEMO 4 — Visual Perception**, or input:
  ```
  Capture primary desktop screen and analyze display buffer.
  ```
* **Execution Flow:**
  1. Electron Main invokes `desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 1920, height: 1080 } })`.
  2. Captures full primary display buffer and converts to base64 image data URL.
  3. Displays live captured frame buffer directly in the Demo HUD.
  4. If cloud vision is configured, passes buffer to multimodal VLM; if offline, reports clean display buffer readiness without crashing.
* **Duration:** ~743ms total roundtrip latency.

---

## Permission Demo: Safety Boundary & Permission Enforcement

* **Demonstration Goal:** Prove that ORION does not blindly execute requested actions and deterministically halts at security boundaries.
* **Exact Command:**
  ```
  Write test file to restricted system directory C:\Windows\System32.
  ```
* **Execution Flow:**
  1. Orchestrator receives request and evaluates target file path.
  2. `ActionRiskEvaluator` intercepts target path `C:\Windows\System32` as `CRITICAL` risk.
  3. `ToolService` safety containment throws: `SECURITY POLICY VIOLATION: Writing into restricted boundary 'C:\Windows\System32\...' is strictly prohibited. Security containment enforced.`
  4. UI marks step as `[BLOCKED]` in red with clear policy rationale.
* **Key Takeaway:** Demonstrates that ORION enforces hard security gates regardless of operator phrasing.

---

## Failure Recovery: Autonomous Replanning & Graceful Fallback

* **Demonstration Goal:** Prove autonomous replanning, error detection, and zero-crash recovery when an external resource or target fails.
* **Exact Command:**
  ```
  Read non-existent restricted configuration file /invalid/path/missing.cfg.
  ```
* **Execution Flow:**
  1. Tool dispatch fails safely with `File not found`.
  2. Orchestrator detects failure, records error event, and triggers autonomous replanning attempt.
  3. Evaluates alternative recovery paths.
  4. Synthesizes a clean explanatory response: `ORION was unable to complete the request: File not found at path...`
  5. UI returns cleanly to `STANDBY` state with zero unhandled exceptions or UI freezing.

---

## Troubleshooting

| Symptom | Probable Cause | Remediation Step |
| :--- | :--- | :--- |
| UI reports `READY_WITH_LIMITATIONS` | No cloud API keys found in `.env` | Expected behavior in offline mode. All 5 demo scenarios remain 100% operational via the deterministic rule engine. |
| Microphone button does not transcribe | Web Speech permission ungranted in OS | Use text command bar or click demo scenario buttons directly. |
| Synthetic mouse cursor doesn't move | Headless Windows Session 0 | Ensure ORION runs on an active, interactive desktop user session. |

---

## Reset Procedure

To clear all temporary execution state, conversation turns, and task buffers between demonstration runs:
1. Click the **Reset** icon (`RotateCcw`) in the top right of the `[DEMO]` screen pre-flight check banner.
2. Alternatively, invoke the IPC channel via DevTools: `window.orionApi.resetDemo()`.
3. The environment flushes temporary memory instantly without touching persistent files.

---

## Known Limitations

1. **Windows Session 0 Isolation:** Automated cursor movements require an active physical or RDP user session; running in headless background services blocks Win32 synthetic cursor injection.
2. **Offline Vision VLM:** Offline vision uses real 1080p display buffer capture; full semantic scene interpretation requires an active cloud VLM API key (Gemini, OpenRouter) or a local Ollama service.
3. **Audio Transcription:** Voice recognition requires Chromium Web Speech API access or local microphone authorization.
