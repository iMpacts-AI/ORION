# ORION SYSTEM-WIDE ARCHITECTURE MAP

**Repository:** C:\Users\smsaq\Downloads\ORION  
**Architecture Classification:** Electron Desktop AI & Closed-Loop Agent Platform  

---

## 1. Complete System Flowchart

\\\mermaid
flowchart TD
    subgraph UI [Renderer Tier (React + Vite HUD)]
        A[Operator Input / Voice] --> B[App.tsx]
        B --> C[Screen Views / HUD Panels]
    end

    subgraph Preload [Preload Boundary (Context Bridge)]
        C --> D[preload.ts: orionApi]
    end

    subgraph IPC [IPC Channel Routing]
        D --> E[index.ts: ipcMain.handle]
    end

    subgraph Core [Orchestration & Planning Tier]
        E --> F[OrionOrchestrator]
        E --> G[ComputerUseService]
        F --> H[ToolCapabilityResolver]
        F --> I[OrionAIProviderRouter]
        G --> J[ComputerActionPlanner]
        J --> I
    end

    subgraph Safety [Safety, Risk & Policy Tier]
        H --> K[ActionRiskEvaluator]
        J --> K
        K --> L[ComputerPermissionService]
        L --> M[ActionValidator: Preconditions]
    end

    subgraph Grounding [Grounding & Perception Tier]
        M --> N[ComputerPerceptionService]
        N --> O[ScreenUnderstandingService]
        O --> P[ScreenCaptureService]
        O --> Q[WindowManagerService]
    end

    subgraph Execution [Execution Tier]
        M --> R[ComputerActionExecutor]
        R --> S[InputControlService: WindowsNativeInputDriver]
        F --> T[ToolService: ToolRegistry]
    end

    subgraph Observation [Observation & Verification Tier]
        S --> U[ScreenCapture & UI Inspection]
        U --> V[ComputerActionVerifier]
        V --> W[ActionValidator: Postconditions]
    end

    subgraph RecoveryTier [Recovery & Replanning Tier]
        W -- Failure --> X[ComputerRecoveryService]
        X -- Bounded Retry --> R
        X -- Replanning Required --> J
    end

    subgraph Synthesis [Feedback & Synthesis Tier]
        W -- Success --> Y[ContextBuilder]
        Y --> Z[ConversationMemoryService / UnifiedMemory]
        Z --> AA[VoiceService: SystemTTSProvider]
        AA --> AB[Operator Output / Audio Feedback]
    end
\\\

---

## 2. Subsystem Ownership & Core Component Directory

### A. Core Agent Loop & Orchestration
- **OrionOrchestrator (src/main/services/OrionOrchestrator.ts)**: Top-level coordinator for multimodal user queries, intent classification, DAG-based tool parallelization, response synthesis, and audio feedback.
- **AgentStateMachine (src/main/services/AgentStateMachine.ts)**: Formal state machine managing the overarching assistant lifecycle (STANDBY -> THINKING -> PLANNING -> EXECUTING -> RESPONDING -> SPEAKING).
- **TaskSupervisor (src/main/services/TaskSupervisor.ts)**: Background task registry managing task priority, progress percentage, deadline timeouts, and retry budgets.

### B. Computer-Use & Desktop Automation
- **ComputerUseService (src/main/services/computer/ComputerUseService.ts)**: Unified facade for screen perception, planning, and task execution.
- **ComputerActionPlanner (src/main/services/computer/ComputerActionPlanner.ts)**: Decomposes natural language instructions into structured actions using AI or rule-based heuristics with credential redaction.
- **ComputerActionExecutor (src/main/services/computer/ComputerActionExecutor.ts)**: Execution loop with task-level locking (ctivePlanLock), bounded replanning, and audit logging.
- **TaskStateMachine (src/main/services/computer/TaskStateMachine.ts)**: State machine dedicated to desktop workflows (IDLE, UNDERSTANDING, OBSERVING, PLANNING, EXECUTING, VERIFYING, RECOVERING, ESTOPPED).
- **ScreenUnderstandingService (src/main/services/computer/ScreenUnderstandingService.ts)**: Real-time screen grounding and Windows UI Automation element tree inspection.
- **InputControlService (src/main/services/computer/InputControlService.ts)**: Dispatches mouse/keyboard events via Win32 user32.dll / COM APIs.

### C. Safety & Governance
- **ActionRiskEvaluator (src/main/services/ActionRiskEvaluator.ts)**: Deterministic risk analyzer (READ_ONLY, LOW_RISK, MODERATE_RISK, HIGH_RISK, CRITICAL) with protected path assertions.
- **ComputerPermissionService (src/main/services/computer/ComputerPermissionService.ts)**: Gatekeeper enforcing human-in-the-loop approvals and global Emergency Stop.
- **ActionValidator (src/main/services/ActionValidator.ts)**: Checks desktop preconditions and verifies postcondition assertions (file existence, active window, visible text).
- **ComputerActionVerifier (src/main/services/computer/ComputerActionVerifier.ts)**: Compares pre- and post-action screen observations to compute execution confidence.
- **ComputerRecoveryService (src/main/services/computer/ComputerRecoveryService.ts)**: Formulates recovery steps (window refocus, ESC dismissal) upon failure.

### D. AI & Omnichannel Routing
- **OrionAIProviderRouter (src/main/services/OrionAIProviderRouter.ts)**: Dynamic multi-provider AI gateway supporting Groq, Gemini, GitHub Models, Cerebras, Mistral, NVIDIA, DeepSeek, and Cloudflare.
- **ProviderAdapters (src/main/services/ProviderAdapters.ts)**: Individual provider clients with health monitoring, exponential cooldowns, and automatic failovers.

### E. Memory Layers
- **ConversationMemoryService (src/main/services/ConversationMemoryService.ts)**: Bounded sliding-window conversational turn manager.
- **MemoryService (src/main/services/MemoryService.ts)**: Persistent key-value explicit memory stored in .orion_memory/explicit_memory.json.
- **UnifiedMemoryManager (src/main/services/UnifiedMemoryManager.ts)**: Multi-tier semantic memory persisted to disk.
- **TaskMemoryService (src/main/services/TaskMemoryService.ts)**: In-memory task progress and step checkpoint store.

### F. Perception & Hardware Interfaces
- **VisionService (src/main/services/VisionService.ts)**: Optical capture engine interfacing with Electron desktopCapturer and AI vision adapters.
- **VoiceService (src/main/services/VoiceService.ts)**: Native Windows SAPI speech synthesis and microphone state coordinator.
- **SystemMonitorService (src/main/services/SystemMonitorService.ts)**: Hardware resource monitor reading CPU core times, RAM, storage, and network interfaces.
