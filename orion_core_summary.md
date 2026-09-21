# ORION Core — Phase 2 Architecture & Technical Report

> [!IMPORTANT]
> **Phase 2 Complete**: ORION has been upgraded from a visual prototype into a fully functional local AI command engine. The existing HUD design and architecture were preserved while replacing mock services with live system drivers, typed tool registries, intent classification, and an event-driven orchestrator.

---

### 🏛️ 1. Architecture & Execution Pipeline

```
USER INPUT (Text / Voice)
    │
    ▼
IPC BOUNDARY (processCommand)
    │
    ▼
ORION ORCHESTRATOR (OrionOrchestrator.ts)
    │
    ├──► AI PROVIDER (AIProvider.ts — LocalHeuristic / Configurable Model)
    │     ├──► Intent Classification (SYSTEM_QUERY | FILE_OPERATION | CONVERSATION)
    │     └──► AI Execution Plan & Tool Selection
    │
    ├──► PERMISSION ENFORCEMENT LAYER
    │     └──► LOW (Auto) | MEDIUM/HIGH (User Confirmation) | CRITICAL (Disabled)
    │
    ├──► TOOL REGISTRY (ToolService.ts)
    │     └──► Real Node.js OS & Filesystem Handlers
    │
    ├──► EVENT PUBLISHER (OrionEventBus)
    │     └──► Emits state & activity events to HUD
    │
    ▼
HUD STATE TRANSITIONS & RESPONSE SYNTHESIS
```

---

### ⚙️ 2. Implemented Subsystems & Status

#### REAL FUNCTIONALITY (Fully Operational)
1. **ORION Core Orchestrator (`OrionOrchestrator.ts`)**:
   - Manages intent classification, step planning, tool invocation loops, and output synthesis.
   - Includes a **10-second execution timeout guard** to guarantee state recovery.
2. **AI Provider Abstraction (`AIProvider.ts`)**:
   - `IAIProvider` interface supporting `chat()`, `classifyIntent()`, and `plan()`.
   - `LocalHeuristicAIProvider` implemented for offline execution without requiring external API keys.
3. **Real Tool Registry (`ToolService.ts`)**:
   - Implemented 8 real read-only system and filesystem tools using native Node.js `os` and `fs`:
     - `system.get_info`: Hostname, platform, architecture, release, uptime, and CPU model.
     - `system.get_cpu_usage`: Live CPU utilization across all detected cores.
     - `system.get_memory_usage`: Total, used, free RAM memory and percentage.
     - `system.get_disk_usage`: Storage status and drive information.
     - `system.get_network_status`: Local IPv4 address, primary interface, and connection state.
     - `system.get_current_time`: Local time, ISO timestamp, and timezone offset.
     - `file.list_directory`: Reads directory contents (files and folders).
     - `file.read_text`: Reads local text files with size safety limits (512KB max).
4. **Real System Telemetry (`SystemMonitorService.ts`)**:
   - Telemetry driver calculating live CPU core utilization, memory breakdown, and primary IP address.
5. **HUD State Transitions & Event Bus Integration**:
   - State machine automatically updates HUD between `STANDBY` → `THINKING` → `EXECUTING` → `SPEAKING` → `STANDBY`.
   - All tool executions log structured activity events to the HUD Activity Log.

#### PARTIALLY IMPLEMENTED (Architectural Abstractions Ready)
1. **External LLM Provider**: Provider interface `IAIProvider` ready for OpenAI/Ollama/Anthropic environment key integration.
2. **Voice Speech-to-Text**: Hardware mic toggle and state handler active; STT engine backend queued for Phase 3.

#### PLACEHOLDERS (Non-Misleading Stubs)
1. **GPU Thermal Sensors**: Hardware thermal sensors return `null` (`N/A`) on standard Windows OS APIs without elevated kernel drivers.

---

### 🛡️ 3. Safety & Permission Model

- **LOW**: Automatically executed (read-only queries like CPU, RAM, Time, File Listing).
- **MEDIUM / HIGH**: Require user confirmation.
- **CRITICAL**: Disabled by default; cannot be bypassed by the AI model.

---

### 🧪 4. Commands Tested & Verified

The following commands were tested through the ORION Orchestration pipeline:

1. `"ORION, show system"` → Mode switches to **SYSTEM** view.
2. `"ORION, what's my CPU usage?"` → Executes `system.get_cpu_usage`, returns live core utilization.
3. `"ORION, how much RAM am I using?"` → Executes `system.get_memory_usage`, returns RAM metrics.
4. `"ORION, what's the current time?"` → Executes `system.get_current_time`, returns local ISO timestamp.
5. `"ORION, list the files in my current directory"` → Executes `file.list_directory`, returns directory entries.
6. `"ORION, show network status"` → Executes `system.get_network_status`, returns host IPv4 address.

---

### 🚀 5. Next Recommended Phase

**Phase 3 — Voice Engine & Local LLM Integration**:
- Connect local Ollama / LM Studio or OpenAI API key via Electron main environment variables.
- Integrate Web Speech API or Whisper for real voice speech-to-text recognition.
