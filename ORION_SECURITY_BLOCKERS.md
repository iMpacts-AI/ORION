# ORION — SECURITY RELEASE BLOCKERS & REMEDIATION PLAN

**Date:** 2026-09-01  
**Release Target:** ORION v1.0.0 Desktop Release  
**Current Gate Status:** **BLOCKED (4 Criticals, 5 Highs)**  
**Sign-off Authority:** ORION Security Engineering Team  

---

## 1. Release Blocker Summary

ORION cannot be signed or distributed until the following **9 security blockers** are fully resolved, patched, and verified with automated integration tests.

| Blocker ID | Severity | Category | Affected File | Remediation Effort |
|---|---|---|---|---|
| **BLOCKER-01** | `CRITICAL` | Remote Code Execution | `ScreenUnderstandingService.ts` | 4 Hours |
| **BLOCKER-02** | `CRITICAL` | Command Injection | `ComputerActionExecutor.ts` | 3 Hours |
| **BLOCKER-03** | `CRITICAL` | Shell Code Injection | `InputControlService.ts` | 4 Hours |
| **BLOCKER-04** | `CRITICAL` | Path Traversal / Arbitrary File IO | `ToolService.ts`, `ToolRegistry.ts` | 3 Hours |
| **BLOCKER-05** | `HIGH` | Authorization Bypass | `ActionRiskEvaluator.ts`, `ComputerPermissionService.ts` | 3 Hours |
| **BLOCKER-06** | `HIGH` | Whitelist Bypass | `DeveloperAgentProvider.ts` | 2 Hours |
| **BLOCKER-07** | `HIGH` | Shell Code Injection | `WindowManagerService.ts` | 3 Hours |
| **BLOCKER-08** | `HIGH` | Credential Leakage | `InputControlService.ts`, `ComputerActionPlanner.ts` | 4 Hours |
| **BLOCKER-09** | `HIGH` | Emergency Stop Failure | `OrionOrchestrator.ts`, `ComputerUseService.ts` | 4 Hours |

---

## 2. Detailed Blocker Descriptions & Prescribed Patches

---

### BLOCKER-01: Zero-Click RCE via Window Title Interpolation in Screen Perception
- **Severity:** `CRITICAL`
- **Location:** [`src/main/services/computer/ScreenUnderstandingService.ts:78,117`](file:///C:/Users/smsaq/Downloads/ORION/src/main/services/computer/ScreenUnderstandingService.ts#L78)
- **Problem:** `activeWindow.title` (controlled by any open app or browser tab title) is concatenated into a PowerShell script executed via `execAsync("powershell -Command ...")`. PowerShell subexpressions `$()` execute arbitrary code.
- **Prescribed Patch:**
  1. Remove string-based PowerShell construction.
  2. Implement native Windows UI Automation using a compiled C++ Node addon or pass arguments strictly using `spawn` with an array of parameters and `-EncodedCommand` without string concatenation.
  3. Validate and sanitize `windowTitle` to alphanumeric and safe punctuation before any processing.
- **Verification Criterion:** A test suite passing a window title `HackMe$(calc.exe) - Chrome` must execute without triggering any subprocess or throwing an unhandled shell exception.

---

### BLOCKER-02: Command Injection in `OPEN_APP` Computer Action
- **Severity:** `CRITICAL`
- **Location:** [`src/main/services/computer/ComputerActionExecutor.ts:275`](file:///C:/Users/smsaq/Downloads/ORION/src/main/services/computer/ComputerActionExecutor.ts#L275)
- **Problem:** `OPEN_APP` action constructs a PowerShell command `Start-Process '${app}'${extraPath}` with raw parameters from LLM/IPC input.
- **Prescribed Patch:**
  1. Validate `appName` against an authoritative allowlist of registered application names:
  ```typescript
  const ALLOWED_APPS = new Map<string, string>([
    ['notepad', 'notepad.exe'],
    ['chrome', 'chrome.exe'],
    ['code', 'code.cmd'],
    ['explorer', 'explorer.exe']
  ]);
  const execName = ALLOWED_APPS.get(appName.toLowerCase());
  if (!execName) throw new Error(`Disallowed application: ${appName}`);
  ```
  2. Launch applications using Electron's `shell.openPath` or `spawn(execName, args, { shell: false })`.
- **Verification Criterion:** Attempting `OPEN_APP` with `notepad'; calc.exe; '` throws a validation error and spawns zero unauthorized processes.

---

### BLOCKER-03: PowerShell Subexpression Injection in Native Typing & Hotkey Drivers
- **Severity:** `CRITICAL`
- **Location:** [`src/main/services/computer/InputControlService.ts:98,119,146`](file:///C:/Users/smsaq/Downloads/ORION/src/main/services/computer/InputControlService.ts#L98)
- **Problem:** `typeText`, `pressKey`, and `hotkey` pass unescaped variables into double-quoted PowerShell commands. Any text containing `$(...)` evaluates as a shell subexpression.
- **Prescribed Patch:**
  1. Replace PowerShell `Wscript.Shell SendKeys` execution with a native Win32 `SendInput` binding (e.g. via `node-gyp` native addon or safe binary helper).
  2. If using an intermediate script, send keystroke data exclusively over `stdin` stream rather than command-line arguments.
- **Verification Criterion:** Invoking `typeText("$(calc.exe)")` inputs the literal text characters `$ ( c a l c . e x e )` and does not spawn `calc.exe`.

---

### BLOCKER-04: Arbitrary Filesystem Read/Write via Unsandboxed File Tools
- **Severity:** `CRITICAL`
- **Location:** [`src/main/services/ToolService.ts:170-213`](file:///C:/Users/smsaq/Downloads/ORION/src/main/services/ToolService.ts#L170), [`src/main/services/ToolRegistry.ts:146`](file:///C:/Users/smsaq/Downloads/ORION/src/main/services/ToolRegistry.ts#L146)
- **Problem:** `file.read_text` (Permission: `LOW`) and `file.write_text` (Permission: `MEDIUM`, `requiresApproval: false`) accept arbitrary system paths without directory confinement.
- **Prescribed Patch:**
  1. Implement a workspace root directory validator:
  ```typescript
  function validatePathInWorkspace(targetPath: string, allowedRoots: string[]): string {
    const resolved = path.resolve(targetPath);
    const isAllowed = allowedRoots.some(root => resolved.startsWith(path.resolve(root)) && !resolved.includes('..'));
    if (!isAllowed) throw new Error(`SECURITY VIOLATION: Path '${resolved}' escapes allowed workspace directories.`);
    return resolved;
  }
  ```
  2. Elevate `file.write_text` permission level to `HIGH` with `requiresApproval: true`.
- **Verification Criterion:** Tool call to `file.read_text` on `C:\Windows\System32\drivers\etc\hosts` or `C:\Users\smsaq\.ssh\id_rsa` throws an access violation error.

---

### BLOCKER-05: Desktop Action Risk Downgrade Bypassing Human Authorization
- **Severity:** `HIGH`
- **Location:** [`src/main/services/ActionRiskEvaluator.ts:48-60`](file:///C:/Users/smsaq/Downloads/ORION/src/main/services/ActionRiskEvaluator.ts#L48), [`src/main/services/computer/ComputerPermissionService.ts:52`](file:///C:/Users/smsaq/Downloads/ORION/src/main/services/computer/ComputerPermissionService.ts#L52)
- **Problem:** Keystrokes, mouse clicks, and application launches default to `MODERATE_RISK` and require zero human approval unless the caller explicitly sets `payload.dangerFlag`.
- **Prescribed Patch:**
  1. Reclassify all state-mutating desktop actions (`OPEN_APP`, `KEYBOARD_INPUT`, `HOTKEY`, `DRAG`, `WRITE_FILE`) as `HIGH_RISK` by default.
  2. Remove reliance on caller-supplied `dangerFlag` / `isDestructive` fields.
  3. Require explicit operator approval before executing any live action plan unless the plan is explicitly executed in `isDryRun: true` preview mode.
- **Verification Criterion:** Any non-dry-run computer plan containing keystrokes or app opens transitions to `AWAITING_APPROVAL` status.

---

### BLOCKER-06: Command Whitelist Bypass via `startsWith` in Developer Agent
- **Severity:** `HIGH`
- **Location:** [`src/main/platform/DeveloperAgentProvider.ts:71`](file:///C:/Users/smsaq/Downloads/ORION/src/main/platform/DeveloperAgentProvider.ts#L71)
- **Problem:** `allowed.some(cmd => command.startsWith(cmd))` permits command chaining (`npm test & calc.exe`).
- **Prescribed Patch:**
  1. Disallow shell chaining operators (`&`, `&&`, `|`, `||`, `;`, newline).
  2. Tokenize the input string and spawn the executable with discrete array arguments and `shell: false`.
- **Verification Criterion:** Command `npm test & calc.exe` is rejected with a validation error.

---

### BLOCKER-07: PowerShell Subexpression Injection in Window Management Operations
- **Severity:** `HIGH`
- **Location:** [`src/main/services/computer/WindowManagerService.ts:51,64,77,93`](file:///C:/Users/smsaq/Downloads/ORION/src/main/services/computer/WindowManagerService.ts#L51)
- **Problem:** `titleOrProcess` is interpolated into double-quoted PowerShell commands with inadequate single-quote escaping.
- **Prescribed Patch:**
  1. Use Win32 API window handle functions (`FindWindow`, `SetForegroundWindow`, `ShowWindow`) via native bindings.
  2. Pass window titles strictly as bound CLI arguments via `spawn` without shell interpolation.
- **Verification Criterion:** `focusWindow("test$(calc.exe)")` executes safely without invoking `calc.exe`.

---

### BLOCKER-08: Plaintext Credential Exposure in OS Command Lines and Logs
- **Severity:** `HIGH`
- **Location:** [`src/main/services/computer/InputControlService.ts:99`](file:///C:/Users/smsaq/Downloads/ORION/src/main/services/computer/InputControlService.ts#L99), [`src/main/services/computer/ComputerActionPlanner.ts:65`](file:///C:/Users/smsaq/Downloads/ORION/src/main/services/computer/ComputerActionPlanner.ts#L65)
- **Problem:** Passwords and keys typed by ORION appear in PowerShell command-line audit logs (Event ID 4688 / Sysmon) and action reason strings.
- **Prescribed Patch:**
  1. Remove CLI-based keystroke transmission (Native `SendInput`).
  2. Mask all sensitive input values before storing in `plan.actions`, `auditLog`, or emitting to `eventBus`.
- **Verification Criterion:** Typing a simulated password generates zero process creation audit logs containing the secret and redacts it from `auditLog`.

---

### BLOCKER-09: Incomplete Emergency Stop (ESTOP) Coverage
- **Severity:** `HIGH`
- **Location:** [`src/main/services/OrionOrchestrator.ts`](file:///C:/Users/smsaq/Downloads/ORION/src/main/services/OrionOrchestrator.ts), [`src/main/services/computer/ComputerUseService.ts:137`](file:///C:/Users/smsaq/Downloads/ORION/src/main/services/computer/ComputerUseService.ts#L137)
- **Problem:** ESTOP in `ComputerUseService` does not interrupt running tool executions in `OrionOrchestrator` or kill active child processes.
- **Prescribed Patch:**
  1. Introduce a centralized `ProcessLifecycleManager` that registers all active `ChildProcess` and `AbortController` instances.
  2. When `emergencyStop()` is invoked, broadcast an immediate `ESTOP_ACTIVATED` event, issue `SIGKILL` to all tracked child processes, abort all active AI HTTP requests, and halt the orchestrator loop.
- **Verification Criterion:** Triggering ESTOP while an automated multi-step pipeline is running terminates all processes in <50ms and halts subsequent tool dispatches.

---

## 3. Release Sign-Off Checklist

- [ ] **BLOCKER-01 Patched & Verified:** No shell interpolation in `ScreenUnderstandingService.ts`.
- [ ] **BLOCKER-02 Patched & Verified:** Strict app allowlist & safe spawning in `ComputerActionExecutor.ts`.
- [ ] **BLOCKER-03 Patched & Verified:** Safe native keystroke delivery in `InputControlService.ts`.
- [ ] **BLOCKER-04 Patched & Verified:** Workspace containment check in `ToolService.ts`.
- [ ] **BLOCKER-05 Patched & Verified:** `HIGH_RISK` default for all mutating actions in `ActionRiskEvaluator.ts`.
- [ ] **BLOCKER-06 Patched & Verified:** Strict array tokenization in `DeveloperAgentProvider.ts`.
- [ ] **BLOCKER-07 Patched & Verified:** Safe window management in `WindowManagerService.ts`.
- [ ] **BLOCKER-08 Patched & Verified:** Zero password leakage in logs or process args.
- [ ] **BLOCKER-09 Patched & Verified:** Global instantaneous ESTOP coverage across all services.
- [ ] **Full Automated Regression Test Suite Passed:** Zero regressions across Phase 1 to Phase 14 suites.

**FINAL STATUS:** **RELEASE IS NOT PERMITTED UNTIL ALL 9 BLOCKERS ARE SIGNED OFF AS RESOLVED.**
