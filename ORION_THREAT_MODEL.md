# ORION — SYSTEM THREAT MODEL & SECURITY ARCHITECTURE

**Version:** 1.0.0  
**System:** ORION AI Command System  
**Frameworks:** STRIDE, DREAD, NIST SP 800-53, MITRE ATT&CK  
**Status:** ACTIVE SECURITY REFERENCE  

---

## 1. System Overview & Architecture Decomposition

ORION is an Electron-based desktop AI assistant equipped with universal computer-use automation, closed-loop media production pipelines (Project Titan), multi-provider AI cloud routing, and local system telemetry.

```
+---------------------------------------------------------------------------------------------------+
|                                      UNTRUSTED EXTERNAL WORLD                                     |
|  - Webpages visited in Browser     - Screen Text & OCR         - Documents & Downloaded Files     |
|  - Cloud AI LLM Responses          - External API Endpoints    - Malicious Window Titles          |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| TRUST BOUNDARY 1: Web Content & Vision Ingestion (VisionService, ScreenCaptureService)            |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| TRUST ZONE A: Electron Renderer (Chromium UI - React 18, Tailwind, Three.js)                     |
|  - DOM Tree & Components           - Activity Log Panel        - Key Configuration UI             |
|  - Vite Dev/Prod Bundles           - User Input Prompts        - Audio Visualizers                |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  | (contextBridge / IPC Channels)
                                                  v
+---------------------------------------------------------------------------------------------------+
| TRUST BOUNDARY 2: Electron IPC Gateway (preload.ts / contextIsolation)                            |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| TRUST ZONE B: Electron Main Process (Node.js 22 Runtime)                                          |
|  - OrionOrchestrator               - ToolService & Registry    - OrionAIProviderRouter            |
|  - ComputerUseService              - ActionRiskEvaluator       - ComputerPermissionService        |
|  - MemoryService & UnifiedManager  - TaskSupervisor            - TitanClosedLoopPipeline          |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  | (child_process: spawn / execAsync / PowerShell)
                                                  v
+---------------------------------------------------------------------------------------------------+
| TRUST BOUNDARY 3: Native Host OS Execution Boundary                                               |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| TRUST ZONE C: Host Operating System (Windows 11 / Native APIs)                                    |
|  - PowerShell Host                 - Win32 UI Automation       - Local Filesystem (C:\)           |
|  - Target Applications (VS Code, Chrome, Explorer)            - Hardware & Network Subsystems    |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Trust Zones & Boundaries

| Trust Zone | Integrity Level | Confidentiality Level | Description |
|---|---|---|---|
| **Zone 0: External World** | Untrusted | Public / Untrusted | Webpage DOM, OCR screen text, external API payloads, third-party documents. |
| **Zone 1: Renderer Process** | Low-to-Medium | Medium | UI execution environment. Sandboxed Chromium process without direct Node.js access. |
| **Zone 2: Preload Bridge** | Medium | High | Mediates communication between Renderer and Main process via `contextBridge`. |
| **Zone 3: Main Process** | High | Critical | Node.js privileged runtime. Coordinates orchestration, memory, secrets, and tool dispatch. |
| **Zone 4: Host OS / Subprocesses** | System / Root | Critical | Native Windows binaries, PowerShell engines, direct disk I/O, Win32 input drivers. |

---

## 3. Threat Actor Profiles

| Threat Actor | Capabilities | Motivation | Attack Vector |
|---|---|---|---|
| **Remote Web Attacker** | Can host malicious web pages, craft malicious window titles, embed invisible prompt injections. | RCE, Data Exfiltration, System Compromise | Drives user to browse a malicious site while ORION is observing screen. |
| **Malicious LLM / Prompt Injector** | Generates adversarial tool calls, system prompt overrides, disguised shell commands. | Bypass guardrails, hijack agent tools | Injects instructions via OCR, documents, or poisoned training/API data. |
| **Compromised Dependency (Supply Chain)** | Injected malicious npm package in Renderer or Main. | Steal API keys, execute commands | Exploits missing SRI, insecure dependencies, or disabled sandbox. |
| **Local Low-Privilege Attacker** | Inspects local processes, reads process command lines, monitors event logs. | Steal API keys, capture keystrokes | Reads command-line arguments of spawned PowerShell processes. |

---

## 4. STRIDE Threat Analysis

### 4.1 Spoofing (S)
- **S-1: IPC Invocation Spoofing:** Any compromised script running inside the Chromium renderer can invoke exposed `orionApi` IPC methods (e.g., `executeComputerAction`, `saveProviderKeys`, `runTitanPipeline`).
  - *Mitigation:* Enforce input schema validation with Zod / AJV on all IPC handles in the main process. Validate `senderFrame` and origin.

### 4.2 Tampering (T)
- **T-1: Plaintext `.env` Credential Tampering:** The `ai:save_provider_keys` handler writes arbitrary key-values to `.env` without whitelist filtering.
  - *Mitigation:* Restrict key saving to predefined enum keys. Store credentials in OS keychain via `safeStorage`.
- **T-2: Tool Parameter Injection:** An LLM or attacker manipulates file paths or PowerShell arguments to mutate system files outside the authorized workspace.
  - *Mitigation:* Strict path canonicalization (`path.resolve`) and workspace boundary enforcement.

### 4.3 Repudiation (R)
- **R-1: Unsigned Audit Trail Tampering:** Task and audit logs stored on disk in JSON format can be modified by local processes.
  - *Mitigation:* Compute SHA-256 HMAC on all audit log records and checkpoints using an ephemeral main-process signing key.

### 4.4 Information Disclosure (I)
- **I-1: Credential Exposure in OS Command Lines:** `InputControlService.typeText` and `WindowManagerService` pass sensitive data as command-line arguments to `powershell.exe`, leaking to Event Log 4688 and Sysmon.
  - *Mitigation:* Eliminate PowerShell CLI argument passing for keystrokes; use Win32 `SendInput` API directly.
- **I-2: Unrestricted File Read:** `file.read_text` allows reading arbitrary files up to 512KB across the entire system.
  - *Mitigation:* Sandbox file reading to configured project directories.

### 4.5 Denial of Service (D)
- **D-1: Unbounded In-Memory Telemetry & Task Checkpoints:** State stores and memory services retain unbounded objects without LRU bounds.
  - *Mitigation:* Enforce maximum object retention counts and automatic garbage collection.
- **D-2: Blocking Main Event Loop:** Synchronous `execSync` calls in `SystemMonitorService` can freeze the Electron main thread.
  - *Mitigation:* Replace all synchronous calls with asynchronous non-blocking worker pools.

### 4.6 Elevation of Privilege (EoP)
- **EoP-1: Zero-Click RCE via Window Title Interpolation:** Malicious webpage titles execute arbitrary code when ORION observes the screen.
  - *Mitigation:* Strip all shell meta-characters; never interpolate strings into shell commands.
- **EoP-2: Permission Gate Downgrade:** `ActionRiskEvaluator` marks keyboard, mouse, and app launch actions as `MODERATE_RISK` (no approval needed) unless `dangerFlag` is set.
  - *Mitigation:* Default all mutating OS actions to `HIGH_RISK` requiring explicit user approval.

---

## 5. DREAD Risk Assessment for Top Attack Vectors

| Threat Scenario | Damage (1-10) | Reproducibility (1-10) | Exploitability (1-10) | Affected Users (1-10) | Discoverability (1-10) | DREAD Score | Risk Rating |
|---|---|---|---|---|---|---|---|
| **Zero-Click RCE via Window Title (SEC-CRIT-01)** | 10 | 10 | 9 | 10 | 8 | **9.4** | **CRITICAL** |
| **Command Injection in `OPEN_APP` (SEC-CRIT-02)** | 10 | 10 | 10 | 10 | 7 | **9.4** | **CRITICAL** |
| **PowerShell Subexpression in Typing (SEC-CRIT-03)** | 9 | 9 | 9 | 10 | 8 | **9.0** | **CRITICAL** |
| **Arbitrary File Read/Write (SEC-CRIT-04)** | 9 | 10 | 9 | 10 | 7 | **8.8** | **CRITICAL** |
| **Action Risk Authorization Bypass (SEC-HIGH-01)** | 9 | 9 | 8 | 10 | 8 | **8.8** | **HIGH** |
| **Developer Build Whitelist Bypass (SEC-HIGH-02)** | 8 | 10 | 9 | 8 | 8 | **8.6** | **HIGH** |
| **Process Command-Line Credential Leak (SEC-HIGH-04)** | 8 | 10 | 8 | 10 | 7 | **8.2** | **HIGH** |
| **Incomplete ESTOP Coverage (SEC-HIGH-05)** | 8 | 8 | 7 | 10 | 7 | **8.0** | **HIGH** |

---

## 6. Security Defense-in-Depth Model

```
+---------------------------------------------------------------------------+
| LAYER 1: STRICT BOUNDARY ISOLATION                                        |
| - Electron Context Isolation: ON                                          |
| - Renderer Sandbox: ON (sandbox: true)                                    |
| - SafeStorage Encrypted Secret Store                                      |
+---------------------------------------------------------------------------+
                                     |
                                     v
+---------------------------------------------------------------------------+
| LAYER 2: AUTHORITATIVE HUMAN-IN-THE-LOOP APPROVAL                         |
| - High-Risk & Critical Action Mandatory Confirmation                      |
| - Un-downgradeable Risk Evaluation Engine                                 |
| - Global Asynchronous Emergency Stop (ESTOP) with SIGKILL Broadcast       |
+---------------------------------------------------------------------------+
                                     |
                                     v
+---------------------------------------------------------------------------+
| LAYER 3: SAFE EXECUTION RUNTIMES                                          |
| - Zero Shell String Interpolation (`shell: false`, array arguments only)   |
| - Native C++ Win32 SendInput (No Wscript.Shell SendKeys via CLI)           |
| - Strict Workspace Jail Confinement (`isPathWithinAllowedRoot`)           |
+---------------------------------------------------------------------------+
                                     |
                                     v
+---------------------------------------------------------------------------+
| LAYER 4: AUDITING & REDACTION                                             |
| - Real-time High-Entropy Secret Redaction in Logs & Prompts               |
| - Cryptographically Signed Audit Trails                                   |
| - Structured XML Boundary Tagging for Untrusted Observations               |
+---------------------------------------------------------------------------+
```

---

## 7. Threat Modeling Action Plan

1. **Eliminate All Shell Interpolation:** Replace all `execAsync("powershell ...")` calls with Win32 Native APIs or parameter-bound `spawn` calls with `shell: false`.
2. **Elevate Desktop Action Permissions:** Make all physical input, application launch, and filesystem modification actions `HIGH_RISK` requiring explicit operator approval.
3. **Isolate Filesystem Tools:** Enforce path containment checks on `file.read_text` and `file.write_text`.
4. **Harden ESTOP:** Connect ESTOP to a process-wide cancellation token that aborts HTTP requests, kills child processes, and blocks orchestrator dispatching immediately.
