# ORION Architectural Diagrams & Visual Models

This directory contains the formal architectural diagrams for ORION. All diagrams are authored in standard GitHub Flavored Markdown Mermaid syntax for maintainability and version control tracking.

---

## Diagram 1: Complete System Overview

```mermaid
flowchart TD
    subgraph UI ["Presentation Tier (Renderer — React 18 + Three.js)"]
        A[Operator Input / Voice] --> B[App.tsx State Engine]
        B --> C[Screens: Command / System / Computer / Network / Memory]
    end

    subgraph Boundary ["IPC Security Boundary (Context Bridge)"]
        C --> D["preload.ts (window.orionApi)"]
        D -- "Typed IPC Invoke" --> E["ipcMain.handle (src/main/index.ts)"]
    end

    subgraph Core ["Orchestration & Planning Tier (Main Process)"]
        E --> F[OrionOrchestrator]
        F --> G[AgentStateMachine]
        F --> H[TaskSupervisor]
        F --> I[ContextBuilder]
    end

    subgraph Intelligence ["AI Routing Fabric"]
        F --> J[OrionAIProviderRouter]
        J --> K[OpenRouter / Groq / Gemini / GitHub Models / DeepSeek]
        J --> L[LocalHeuristicAIProvider: Deterministic Offline Fallback]
    end

    subgraph Safety ["Safety & Governance Engine"]
        F --> M[ToolCapabilityResolver]
        M --> N[ActionRiskEvaluator: LOW / MED / HIGH / CRITICAL]
        N --> O[ComputerPermissionService: Operator Approval Gate]
        O --> P[ProcessSupervisor: Emergency Stop & PID Tree Kill]
    end

    subgraph Execution ["Execution & Perception Tier"]
        O --> Q[ToolService: ToolRegistry]
        O --> R[ComputerUseService: Win32 user32.dll / SendKeys]
        F --> S[VisionService: DesktopCapturer 1080p]
        F --> T[VoiceService: Windows SAPI Native TTS]
    end

    subgraph Feedback ["Verification & Memory Synthesis"]
        R --> U[Screen Observation & Delta Verification]
        U --> V[ComputerActionVerifier]
        V --> W[UnifiedMemoryManager: Persistent Disk JSON]
        W --> T
    end
```

---

## Diagram 2: AI Provider Multi-Cloud Router & Circuit Breaker

```mermaid
flowchart TD
    UserQuery[Operator Query] --> StrategySelect{Active Strategy}
    
    StrategySelect -->|SPEED_FIRST| RouteGroq[Groq LPU / Cerebras]
    StrategySelect -->|BALANCED| RoutePrimary[OpenRouter: Llama 3.3 70B]
    StrategySelect -->|QUALITY_FIRST| RouteHighParam[Llama 3.3 70B / DeepSeek]
    StrategySelect -->|VISION| RouteVision[Gemini 2.0 Flash / CloudVisionAdapter]
    StrategySelect -->|OFFLINE| RouteOffline[LocalHeuristicAIProvider]

    RoutePrimary --> CallAPI{Execute Outbound Request}
    RouteGroq --> CallAPI
    RouteHighParam --> CallAPI
    RouteVision --> CallAPI

    CallAPI -- "HTTP 200 OK" --> ProcessResponse[Process Response Stream via SSEParser]
    CallAPI -- "HTTP 429 / 401 / Timeout" --> CircuitBreaker{Engage Circuit Breaker}

    CircuitBreaker --> Backoff[Increment consecutiveFailures & Set Exponential Cooldown]
    Backoff --> FailoverRoute[Select Next Healthy Ranked Provider]
    FailoverRoute --> CallAPI

    CircuitBreaker -- "All Cloud Providers Exhausted" --> RouteOffline
    RouteOffline --> ProcessResponse
```

---

## Diagram 3: DAG-Based Tool Execution Engine

```mermaid
flowchart TD
    AIPlan[AI Plan JSON Received] --> BuildDAG[ToolDependencyGraph: Build Directed Acyclic Graph]
    
    BuildDAG --> CheckBatches{Executable Batches Available?}
    CheckBatches -- Yes --> InspectBatch[Inspect Batch Steps]
    
    InspectBatch --> SafeCheck{All Steps Read-Only and LOW Permission?}
    
    SafeCheck -- Yes --> ConcurrentExec["Concurrent Batch Execution (Promise.all)"]
    ConcurrentExec --> Step1["Step A: system.get_cpu_usage"]
    ConcurrentExec --> Step2["Step B: system.get_memory_usage"]
    Step1 --> CollectResults[Collect Tool Results & Update Step Outputs]
    Step2 --> CollectResults
    
    SafeCheck -- No --> SequentialExec[Sequential Execution with Dynamic Substitution]
    SequentialExec --> SubParams["Substitute ${step.N.output.key} Parameters"]
    SubParams --> ExecSingle[Execute Single Step via ToolService]
    ExecSingle --> PostValidate{ActionValidator Postcondition Check}
    
    PostValidate -- Passed --> CollectResults
    PostValidate -- Failed --> Replan[Trigger Autonomous Recovery & Replanning]
    
    CollectResults --> CheckBatches
    CheckBatches -- No (Finished) --> ResponseSynthesis[ContextBuilder: Wrap Observations for AI Synthesis]
```

---

## Diagram 4: Computer-Use Closed-Loop Pipeline

```mermaid
flowchart TD
    TaskCmd[Natural Language Task Command] --> PlanTask[ComputerActionPlanner]
    PlanTask --> RiskCheck{ActionRiskEvaluator}
    
    RiskCheck -- CRITICAL --> RequireConfirm[Prompt User Confirmation Modal]
    RequireConfirm -- Approved --> PreObserve[ScreenCaptureService: Pre-Action Observation]
    RiskCheck -- LOW / MEDIUM --> PreObserve
    
    PreObserve --> Grounding[ScreenUnderstandingService: Resolve Element Centroid]
    Grounding --> DispatchInput[InputControlService: user32.dll mouse_event / SendKeys]
    
    DispatchInput --> PostObserve[Capture Post-Action Screen State]
    PostObserve --> VerifyDelta[ComputerActionVerifier: Delta & Confidence Scoring]
    
    VerifyDelta -- Confidence >= 0.85 --> Advance[Task Step Marked SUCCESS]
    VerifyDelta -- Confidence < 0.85 --> Recovery[ComputerRecoveryService: Dismiss Dialogs & Refocus]
    Recovery --> PlanTask
```

---

## Diagram 5: Electron Multi-Tier Process & Security Boundary

```mermaid
flowchart LR
    subgraph RendererProcess ["Renderer Process (Chromium Sandbox)"]
        UIApp[React 18 App.tsx]
        HUDViews[Holographic HUD Views]
        UIApp --> HUDViews
    end

    subgraph PreloadBridge ["Preload Boundary (contextBridge)"]
        Bridge["window.orionApi"]
        HUDViews -.->|Strictly Typed Invocations| Bridge
    end

    subgraph MainProcess ["Electron Main Process (Node.js Sovereign)"]
        IPC["ipcMain.handle Routing"]
        Bridge ===|IPC Channel Serialization| IPC
        
        IPC --> OrchestratorCore[OrionOrchestrator]
        IPC --> ToolEngine[ToolService & InputControlService]
        IPC --> EnvSecrets[".env Storage (Quarantined)"]
    end

    subgraph OS ["Operating System & Hardware"]
        ToolEngine --> Win32["Win32 user32.dll / CIM / SAPI"]
        OrchestratorCore --> Network["Outbound TLS to Cloud AI APIs"]
    end
```
