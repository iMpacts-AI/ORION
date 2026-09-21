# ORION BUG BACKLOG (FORENSIC DEFECT INVENTORY)

**Auditor:** Independent QA Break Tester  
**Date:** 2026-09-01  
**Total Defects Identified:** 10  
**Release Impact:** CRITICAL (Blocks Ship)

---

### BUG-001: Memory Subsystem Fails to Persist Across Application Restarts
* **ID:** `BUG-001`
* **Severity:** **CRITICAL**
* **Likely Component:** `src/main/services/MemoryService.ts`
* **Reproduction Rate:** 100%
* **Steps to Reproduce:**
  1. Open ORION.
  2. Call `memory:save_memory` via IPC with payload `{ category: 'PREFERENCE', key: 'user_theme', value: 'cyberpunk_gold' }`.
  3. Verify memory appears in `memory:get_memories`.
  4. Fully terminate ORION process (`taskkill /F /IM electron.exe`).
  5. Restart ORION.
  6. Call `memory:get_memories`.
* **Expected Result:** Previously saved preference key `user_theme` is retrieved from persistent disk storage (e.g., SQLite/LevelDB/JSON).
* **Actual Result:** `user_theme` is gone. Memory resets to the 3 hardcoded default seed memories.
* **Evidence:**
  - `src/main/services/MemoryService.ts:11`: `private memories: Map<string, MemoryItem> = new Map();`
  - Zero `fs.writeFile`, `better-sqlite3`, or storage engine logic in `MemoryService.ts`.
* **Builder Recommendation:** Implement persistent disk-backed storage using SQLite or structured atomic JSON file persistence under `app.getPath('userData')`.

---

### BUG-002: Browser Automation Engine is an Unwired Mock
* **ID:** `BUG-002`
* **Severity:** **CRITICAL**
* **Likely Component:** `src/main/platform/BrowserProvider.ts`
* **Reproduction Rate:** 100%
* **Steps to Reproduce:**
  1. Issue a browser automation command (e.g., "Navigate to https://google.com and click Search").
  2. Inspect running browser instances and system network traffic.
* **Expected Result:** A real Chromium/CDP/Playwright browser process launches, navigates to Google, renders DOM, and performs physical click.
* **Actual Result:** `DefaultBrowserProvider` updates an internal JavaScript string `this.currentUrl` and returns `{ success: true }`. Zero Chromium/Playwright instance is spawned, and the provider is completely missing from IPC handlers in `src/main/index.ts`.
* **Evidence:** `src/main/platform/BrowserProvider.ts:3-73` (contains only dummy memory variables).
* **Builder Recommendation:** Integrate Playwright / Puppeteer or Electron `webContents` CDP session to drive real web sessions.

---

### BUG-003: Speech Synthesis (TTS) Produces Zero Physical Audio Output
* **ID:** `BUG-003`
* **Severity:** **HIGH**
* **Likely Component:** `src/main/services/VoiceService.ts`
* **Reproduction Rate:** 100%
* **Steps to Reproduce:**
  1. Trigger TTS output via `voiceService.speak("Hello world")`.
  2. Monitor Windows Audio Mixer and speaker audio output.
* **Expected Result:** Synthesized voice audio plays through the default OS audio playback device.
* **Actual Result:** The method emits an event `speech.started`, calculates a duration based on string length, sets a JavaScript `setTimeout()`, and emits `speech.ended`. Zero audio buffers are sent to Windows SAPI or web speech synthesis.
* **Evidence:** `src/main/services/VoiceService.ts:46-68`.
* **Builder Recommendation:** Integrate Windows SAPI via PowerShell `System.Speech.Synthesis.SpeechSynthesizer` or Web Speech API / native audio driver.

---

### BUG-004: Speech-to-Text (STT) Provider is Hardcoded Stub Returning Constant String
* **ID:** `BUG-004`
* **Severity:** **HIGH**
* **Likely Component:** `src/main/services/VoiceService.ts`
* **Reproduction Rate:** 100%
* **Steps to Reproduce:**
  1. Trigger voice listening via `voiceService.startListening()`.
  2. Pass microphone audio buffer to `transcribe()`.
* **Expected Result:** Live microphone audio is transcribed into text via Whisper or native OS speech recognizer.
* **Actual Result:** `DefaultSTTProvider.transcribe()` unconditionally returns `"STT NOT CONFIGURED"`.
* **Evidence:** `src/main/services/VoiceService.ts:14-35`.
* **Builder Recommendation:** Implement local Whisper binding (e.g. `whisper.node` or `node-whisper`) or cloud STT adapter (Groq Whisper API).

---

### BUG-005: Optical Webcam Vision Analysis is a Hardcoded Stub
* **ID:** `BUG-005`
* **Severity:** **HIGH**
* **Likely Component:** `src/main/services/VisionService.ts`
* **Reproduction Rate:** 100%
* **Steps to Reproduce:**
  1. Call `vision:capture_and_analyze` with `source = 'CAMERA'`.
  2. Check webcam hardware activity indicator.
* **Expected Result:** Webcam activates, captures frame, and passes image to multimodal vision model for object/scene analysis.
* **Actual Result:** Webcam hardware never activates. `VisionService.ts` returns a synthetic JSON object with empty `detectedObjects: []` and string `"Camera frame captured."`.
* **Evidence:** `src/main/services/VisionService.ts:170-185`.
* **Builder Recommendation:** Use `navigator.mediaDevices.getUserMedia` in renderer or native OpenCV/MediaFoundation node addon to capture live webcam frames.

---

### BUG-006: Computer Action Planner Relies Exclusively on Rigid Regex Heuristics
* **ID:** `BUG-006`
* **Severity:** **HIGH**
* **Likely Component:** `src/main/services/computer/ComputerActionPlanner.ts`
* **Reproduction Rate:** 100%
* **Steps to Reproduce:**
  1. Issue a natural desktop command that varies slightly from hardcoded templates (e.g., "Open Calculator and calculate 45 * 2", "Open paint and draw a circle", "Open terminal and list files").
  2. Inspect generated `ComputerTaskPlan`.
* **Expected Result:** Dynamic task decomposition utilizing LLM reasoning to generate contextual UI interaction sequences.
* **Actual Result:** Regex pattern matching fails to recognize intent and falls back to a single generic `OBSERVE_SCREEN` action with 0 execution steps.
* **Evidence:** `src/main/services/computer/ComputerActionPlanner.ts:20-269`.
* **Builder Recommendation:** Route natural language computer-use commands through an LLM (e.g., Claude 3.5 Sonnet Computer-Use or Gemini 2.0 Flash) with structured tool schema instead of regex matching.

---

### BUG-007: Unsaved Application State Hangs or Fails Upon Window Closure
* **ID:** `BUG-007`
* **Severity:** **HIGH**
* **Likely Component:** `src/main/services/computer/WindowManagerService.ts` / `ComputerActionExecutor.ts`
* **Reproduction Rate:** 100%
* **Steps to Reproduce:**
  1. Plan and execute a workflow: "Open Notepad, type text, close Notepad".
  2. Observe application closure behavior.
* **Expected Result:** Planner handles file save dialog or gracefully dismisses confirmation modal before closing.
* **Actual Result:** `WindowManagerService.closeWindow()` sends `WM_CLOSE` / `CloseMainWindow()` via PowerShell. Notepad intercepts with a modal "Do you want to save changes to Untitled?", causing Notepad to remain open indefinitely.
* **Evidence:** `src/main/services/computer/WindowManagerService.ts:60-75`.
* **Builder Recommendation:** Implement modal detection in `ScreenUnderstandingService` to detect unsaved prompt dialogs and send hotkey sequences (`Ctrl+S` or `Alt+N` / Don't Save).

---

### BUG-008: Native Windows Input Incurs 500ms-2000ms Latency per Keystroke / Click
* **ID:** `BUG-008`
* **Severity:** **MEDIUM**
* **Likely Component:** `src/main/services/computer/InputControlService.ts`
* **Reproduction Rate:** 100%
* **Steps to Reproduce:**
  1. Execute a plan containing 5 consecutive mouse or keyboard actions.
  2. Measure elapsed execution time.
* **Expected Result:** Actions execute within 10-50ms per event.
* **Actual Result:** Every single click or keystroke spawns a separate `powershell.exe` subprocess with full .NET runtime initialization, resulting in 500ms-2000ms per action (~8-12 seconds for a 5-step task).
* **Evidence:** `src/main/services/computer/InputControlService.ts:26, 44, 60, 70, 80, 99`.
* **Builder Recommendation:** Replace `powershell.exe` CLI spawning with a persistent PowerShell worker process via stdio, or compile a native Node.js C++ N-API addon calling `SendInput` directly.

---

### BUG-009: Offline Local AI Provider is a Hardcoded String Template
* **ID:** `BUG-009`
* **Severity:** **MEDIUM**
* **Likely Component:** `src/main/services/AIProvider.ts`
* **Reproduction Rate:** 100%
* **Steps to Reproduce:**
  1. Disconnect network or switch routing strategy to `OFFLINE`.
  2. Send prompt: "Explain quantum computing in simple terms".
* **Expected Result:** Local offline SLM/LLM generates a contextual response.
* **Actual Result:** `LocalHeuristicAIProvider` checks for "hello" or "who are you"; if unmatched, returns generic fallback text: `"I am operating in offline local mode. Systems are active."`.
* **Evidence:** `src/main/services/AIProvider.ts:275-295`.
* **Builder Recommendation:** Integrate `node-llama-cpp` or `ollama` local endpoint for real offline GGUF model execution.

---

### BUG-010: Developer Agent and Unified Memory Manager are Dead / Orphaned Code
* **ID:** `BUG-010`
* **Severity:** **LOW**
* **Likely Component:** `src/main/platform/DeveloperAgentProvider.ts`, `src/main/services/UnifiedMemoryManager.ts`
* **Reproduction Rate:** 100%
* **Steps to Reproduce:**
  1. Search for imports of `DeveloperAgentProvider` or `UnifiedMemoryManager` in `src/main/index.ts` and `ToolRegistry.ts`.
* **Expected Result:** Providers are wired to IPC and exposed as callable tools.
* **Actual Result:** Classes exist in isolation with unit tests passing against them, but they are never instantiated in the running application.
* **Evidence:** `src/main/index.ts` imports neither file.
* **Builder Recommendation:** Wire `UnifiedMemoryManager` to replace `MemoryService` and register `DeveloperAgentProvider` in `ToolRegistry`.
