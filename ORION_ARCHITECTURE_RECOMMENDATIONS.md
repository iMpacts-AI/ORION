# ORION ARCHITECTURE RECOMMENDATIONS & ROADMAP

**Principal Systems Architect Strategic Blueprint**  
**Repository Target:** C:\Users\smsaq\Downloads\ORION  
**Scope:** Actionable Architectural Hardening Roadmap  

---

## Ranked Architectural Recommendations

Recommendations are categorized by architectural impact into **CRITICAL**, **HIGH**, **MEDIUM**, and **LOW**.

---

### [CRITICAL] 1. Re-Entrant Lock & Cancellation Synchronization in Desktop Executor

- **Problem:** ComputerActionExecutor uses an in-memory boolean lock (ctivePlanLock) that does not handle process timeout aborts or thread interruptions gracefully. Win32/PowerShell child processes spawned via execAsync do not accept an AbortSignal.
- **Architectural Solution:**
  1. Refactor ComputerActionExecutor.executePlan() to use an execution ticket or cancellation token pattern (AbortController / AbortSignal).
  2. Pass AbortSignal through InputControlService and WindowManagerService down to child process executions so canceling a task immediately terminates running subprocesses.
  3. Ensure the lock is managed through a formal scoped mutex with timeout auto-release.

---

### [CRITICAL] 2. Single Source of Truth for Task Management (TaskSupervisor)

- **Problem:** Two separate task stores coexist: TaskSupervisor (with priority, retries, and background state) and TaskMemoryService (in-memory progress tracking used by OrionOrchestrator).
- **Architectural Solution:**
  1. Deprecate TaskMemoryService.
  2. Make TaskSupervisor the single source of truth for all background and interactive tasks.
  3. Wire OrionOrchestrator to read from and update TaskSupervisor directly.

---

### [HIGH] 3. Unify Computer Action Execution Pipeline

- **Problem:** ComputerActionService acts as an unnecessary intermediate layer, routing some actions to ToolService and others to ComputerUseService.executeSingleAction().
- **Architectural Solution:**
  1. Consolidate desktop execution exclusively into ComputerUseService and ComputerActionExecutor.
  2. Deprecate ComputerActionService.
  3. Update ToolRegistry and ToolService to delegate all computer.* tool invocations directly to ComputerUseService.

---

### [HIGH] 4. Integrate Unified Memory into Reasoning Context Builder

- **Problem:** UnifiedMemoryManager persists rich semantic records to .orion_memory/unified_memory.json, but ContextBuilder only injects short-term conversation turns and explicit key-values.
- **Architectural Solution:**
  1. Inject UnifiedMemoryManager into ContextBuilder.
  2. Implement semantic memory retrieval (querying relevant memories based on the user prompt) during prompt synthesis before sending requests to the AI router.

---

### [MEDIUM] 5. Schema Validation at IPC Boundaries

- **Problem:** IPC handlers in src/main/index.ts accept untyped ny payloads from the renderer without runtime schema validation (e.g. i:save_provider_keys, ction:execute).
- **Architectural Solution:**
  1. Introduce runtime schema validators (such as lightweight Zod or typed guards) across all ipcMain.handle endpoints.
  2. Validate .env key updates strictly to prevent accidental malformed environment configurations.

---

### [MEDIUM] 6. Push-Based Event Streaming for System Telemetry

- **Problem:** The Renderer UI (App.tsx) polls getSystemSnapshot() and getSupervisorTasks() on a 2500ms interval.
- **Architectural Solution:**
  1. Establish push-based IPC events (webContents.send('telemetry:snapshot', ...) and webContents.send('task:updated', ...)) emitted by SystemMonitorService and TaskSupervisor.
  2. Eliminate renderer interval polling to reduce CPU cycles and IPC serialization overhead.

---

### [LOW] 7. Standardize Branding & Clean Deprecation of Legacy Aliases

- **Problem:** Legacy rvisApi, rvisEventBus, and ARVIS_CONSTANTS shims remain throughout preload and shared types.
- **Architectural Solution:**
  1. Fully migrate all components to orionApi, eventBus, and ORION_CONSTANTS.
  2. Schedule removal of backward compatibility shims in the next minor version release.
