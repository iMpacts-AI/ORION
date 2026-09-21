# ORION V1 — COMPLETE FUNCTIONAL AUDIT

## 1. Executive Baseline & Topology
ORION is built on an Electron 33 (Node 24) Main process and React 18 / Three.js Renderer communicating via a context-isolated IPC bridge in src/main/preload.ts.

## 2. Core Functional Subsystems
- **System Telemetry Subsystem**: Queries native Win32_LogicalDisk WMI metrics and Node.js OS APIs. REAL-DESKTOP-VERIFIED.
- **Window Perception Subsystem**: Native User32 DLL GetForegroundWindow / GetWindowText calls via PowerShell. REAL-DESKTOP-VERIFIED.
- **Autonomous Execution Subsystem**: Sequential DAG dependency engine executing registered tools with risk gating and postcondition checks.
- **Multi-Cloud Router Subsystem**: SSE streaming client supporting Groq, Gemini, GitHub, Cerebras, Mistral, NVIDIA, DeepSeek, Cloudflare.
- **Project Titan Subsystem**: Visual director planning and retention QA gate with SHA-256 protected master media integrity enforcement.