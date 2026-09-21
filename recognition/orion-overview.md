# ORION: One-Page Executive Briefing

**Product:** ORION  
**Organization:** iMpact ([https://impacts-ai.com/orion](https://impacts-ai.com/orion))  
**Founder:** Saqib (Age 13)  
**Classification:** Desktop AI Agent & Computer-Use Platform  
**Reading Time:** ~2 Minutes  

---

### 1. What is ORION?
ORION is an open-architecture, permission-based desktop AI computer-use agent. Unlike conventional chatbots that run in isolated browser tabs, ORION lives natively on the desktop, allowing it to inspect hardware telemetry, understand screen context, execute tools, and automate computer workflows under strict human supervision.

### 2. What Problem Does It Address?
Modern language models are exceptional reasoners, but they are severed from the user's actual operating system. They cannot check if your CPU is throttling, inspect a local repository, verify test results, or assist with real desktop workflows. Furthermore, experimental computer-use agents often lack deterministic safety rails, risking unintended system damage or credential leakage.

### 3. How Does It Work?
ORION uses a segregated multi-tier Electron architecture:
1. **Understand**: The user provides a command via voice or text.
2. **Route**: The AI Provider Router classifies intent and queries our 10-provider AI fabric (OpenRouter Llama 3.3 70B, Groq, Gemini, DeepSeek).
3. **Plan**: The model emits a structured DAG (Directed Acyclic Graph) tool plan.
4. **Govern**: An ActionRiskEvaluator checks permission tiers (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) and asserts path blacklists against `C:\Windows`.
5. **Execute**: Independent read-only tools run in parallel; state-modifying Win32 actions execute sequentially.
6. **Verify**: Pre- and post-action screen observations are compared to compute execution confidence before advancing.

### 4. What Has Actually Been Built? (Verified)
* **40 Automated Test Suites:** 100% passing in pure process isolation (`npm test`).
* **Multi-Provider AI Fabric:** Active routing across 10 backends with automatic failover and deterministic offline fallback.
* **Win32 Input Drivers:** Native cursor movement, clicks, dragging, scrolling, and keystroke injection.
* **Security & Emergency Stop:** Quarantined credentials in Main process; PID-tree process termination (`taskkill`).
* **Persistent Memory:** File-backed explicit and unified semantic memory stored locally in `.orion_memory/`.
* **Hardware Telemetry:** Real-time CPU core timings, RAM usage, and OS release metrics.
* **Production Build:** Clean TypeScript compilation and Vite packaging in 3.1 seconds.

### 5. What Makes the Architecture Interesting?
* **Zero Secrets in UI**: Complete credential quarantine in the Node.js Main process. The Renderer window never receives API tokens.
* **Fault-Tolerant Failover**: If a cloud model throttles (HTTP 429), ORION automatically fails over to alternate providers within milliseconds.
* **Zero-Crash Offline Mode**: If internet drops, ORION seamlessly shifts to an offline rule router without throwing uncaught exceptions.

### 6. Where is the Project Going? (Q4 2026 Targets)
* **Local Neural Acceleration**: Integrating Ollama with `qwen2.5:14b-instruct` running on the workstation's NVIDIA RTX A5500 (16 GB VRAM) for 100% private, zero-cost inference.
* **DirectX DXGI Screen Capture**: Reducing optical acquisition latency to `< 16ms`.
* **On-Device Whisper STT**: Adding local speech recognition for natural voice command.

### 7. What Help is Needed?
Technical mentorship from experienced systems architects, AI engineers, and founders to review architecture, critique code quality, and challenge system assumptions.
