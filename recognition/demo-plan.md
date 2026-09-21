# ORION Recognition Showcase Demonstration Plan

This document outlines the live presentation sequence for showcasing ORION to technical review committees, judges, investors, and senior engineering mentors.

---

## 1. Presentation Structure Overview

| Format | Target Duration | Focus |
| :--- | :--- | :--- |
| **Fast Showcase** | 30 Seconds | What ORION is + Immediate Live Telemetry Display |
| **Feature Walkthrough** | 60 Seconds | End-to-End Command Loop (Query → Plan → DAG Tool → Speech) |
| **Architecture Presentation**| 3 Minutes | Multi-Screen Depth, AI Provider Network, Emergency Stop |
| **Deep Technical Audit** | 5 Minutes | Codebase Inspection, Process Isolation Tests, Hardware Lab |

---

## 2. 30-Second Fast Showcase

* **Opening:** *"This is ORION. It’s an open-architecture, permission-based desktop AI computer-use agent that I’m building at iMpact. Instead of confining AI to a web browser tab, ORION lives on the operating system with native Win32 drivers, allowing it to inspect hardware telemetry, understand screen context, execute tools, and automate real computer workflows under strict operator permissions."*
* **Live Action:** Point out the live telemetry gauges updating in real time on the HUD (`SystemStatusPanel`), sampling per-core CPU cycles and RAM.

---

## 3. 60-Second Feature Walkthrough

* **Action:** Submit command: `"Check current CPU usage and system memory"`.
* **Visual Progression:**
  1. State shifts: `STANDBY` → `THINKING` → `EXECUTING` → `RESPONDING` → `SPEAKING`.
  2. OpenRouter Llama 3.3 70B formulates a DAG plan containing `system.get_cpu_usage` and `system.get_memory_usage`.
  3. Tools execute concurrently via `Promise.all()`.
  4. Model ingests observations and synthesizes the final report.
  5. Native Windows SAPI voice announces the result through system speakers.
* **Key Point:** *"The model didn't guess those numbers. It planned the tool calls, ORION executed the low-level OS tools in parallel, and the model synthesized the report—all with zero API keys exposed to the UI window."*

---

## 4. 3-Minute Architecture & Safety Showcase

1. **AI Provider Network (`NETWORK` Screen)**:
   * Show multi-provider dashboard (OpenRouter, Groq, Gemini, DeepSeek).
   * Show dynamic strategy switching (`SPEED_FIRST`, `QUALITY_FIRST`, `OFFLINE`).
   * Trigger live diagnostic test showing sub-second round-trip latency.
2. **Computer-Use & Desktop Grounding (`COMPUTER` Screen)**:
   * Show screen observation: active window title, cursor coordinates, and UI Automation element bounding boxes.
   * Demonstrate **Dry-Run Mode**: show the decomposed action plan without moving the physical cursor.
3. **Emergency Stop (Estop)**:
   * Trigger an active task, then press the red **EMERGENCY STOP** button.
   * Show immediate state change to `[ESTOPPED ACTIVE]`, process-tree termination via `taskkill`, and rejection of new spawns.

---

## 5. Offline Fallback Protocol

If internet connectivity is unavailable:
1. Switch strategy to **OFFLINE**.
2. Run command: `"Get system telemetry"`.
3. ORION automatically falls back to its deterministic rule router (`LocalHeuristicAIProvider`), executing local telemetry and file tools with zero crashes.

*For complete technical demo scripts and contingencies, see [docs/demo-plan.md](../docs/demo-plan.md).*
