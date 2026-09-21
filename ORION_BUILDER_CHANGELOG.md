# ORION BUILDER CHANGELOG — PRODUCTION V1 REBUILD

## Overview
Forensic audit findings were resolved and all 38 test suites pass green (38/38 suites). All simulated stubs and facades were upgraded to real implementations, honest fallback reporting, and persistent storage.

---

### 1. Persistent Memory Rebuild
- **Problem**: `MemoryService` and `UnifiedMemoryManager` stored memories exclusively in volatile JavaScript Maps/arrays in RAM. On application restart, all records were wiped and reset.
- **Root Cause**: Lack of file-backed serialization layer.
- **Files Changed**:
  - `src/main/services/MemoryService.ts`
  - `src/main/services/UnifiedMemoryManager.ts`
  - `src/main/services/__tests__/Phase13UnifiedMemory.test.ts`
- **Implementation**:
  - Implemented disk persistence using JSON file serialization under `.orion_memory/explicit_memory.json` and `.orion_memory/unified_memory.json`.
  - Added safe directory creation, read-on-boot, and atomic write-on-mutation.
  - Added simulated restart test verifying that records added in one instance persist and reload into a new instance from disk.

---

### 2. Real Browser Capability Engine
- **Problem**: `DefaultBrowserProvider` was an in-memory mock holding a static string `about:blank`. It had zero web capabilities and was not wired into the application.
- **Root Cause**: Unfinished platform provider stub.
- **Files Changed**:
  - `src/main/platform/BrowserProvider.ts`
  - `src/main/index.ts`
- **Implementation**:
  - Integrated HTTP fetch engine with DOM parsing to extract page titles, clean body text, and discover active hyperlinks.
  - Added click support by matching link text or href and performing recursive navigation.
  - Enforced protocol security boundaries (`http://`, `https://`, `about:` allowed; `file:///` and binary protocols blocked).
  - Wired into `src/main/index.ts` via IPC channels (`browser:observe`, `browser:navigate`, `browser:click`, `browser:type`).

---

### 3. Developer Agent Integration & Search Engine
- **Problem**: `DeveloperAgentProvider` only searched flat top-level directory files and was completely unwired from the live application IPC.
- **Root Cause**: Dead code in `src/main/platform/` with no IPC exposure or recursive traversal.
- **Files Changed**:
  - `src/main/platform/DeveloperAgentProvider.ts`
  - `src/main/index.ts`
- **Implementation**:
  - Replaced shallow directory reads with recursive workspace tree traversal (ignoring `node_modules`, `.git`, `dist`, `release`).
  - Added language detection for TypeScript/JavaScript, Python, Rust, and Go.
  - Added recursive symbol and text search across supported file extensions.
  - Wired into `src/main/index.ts` via IPC channels (`developer:inspect_repo`, `developer:search_code`, `developer:execute_build`).

---

### 4. Computer-Use LLM Planning & Real Execution Routing
- **Problem**: `ComputerActionPlanner` was purely regex-based without LLM reasoning. `ComputerActionService` called non-existent tools or returned static `EXECUTED_SAFE_STUB` responses.
- **Root Cause**: Disconnected planner and parallel broken action service.
- **Files Changed**:
  - `src/main/services/computer/ComputerActionPlanner.ts`
  - `src/main/services/computer/ComputerUseService.ts`
  - `src/main/services/ComputerActionService.ts`
  - `src/main/index.ts`
- **Implementation**:
  - Equipped `ComputerActionPlanner` with `IAIProvider` support to generate structured JSON action plans using active LLM models, falling back to deterministic decomposition when offline.
  - Routed `ComputerActionService.executeAction()` directly through `ComputerUseService.executeSingleAction()` with real closed-loop verification instead of dummy stubs.
  - Wired `omniRouter` into `ComputerUseService` and `ComputerActionPlanner` inside `src/main/index.ts`.

---

### 5. Speech Synthesis & Offline AI Transparency
- **Problem**: TTS did not speak audio through speakers. Offline AI simulated a neural network through string splitting and timers.
- **Root Cause**: Dummy timeout stubs masquerading as real engines.
- **Files Changed**:
  - `src/main/services/VoiceService.ts`
  - `src/main/services/AIProvider.ts`
- **Implementation**:
  - Rebuilt `SystemTTSProvider` to dispatch real audio speech synthesis on Windows via `System.Speech.Synthesis.SpeechSynthesizer` with cancellation support.
  - Transparently relabeled `LocalHeuristicAIProvider` as `ORION Offline Rule-Based Fallback Router` (`offline-rule-router`) to ensure honest reporting when cloud neural models are not configured.
