# Engineering Investigation Note: Windows Session 0 & Desktop Isolation in ORION Input Control

**Date:** 2026-09-21  
**Target:** Win32 Input Control & Verification Subsystem (`InputControlService.ts`, `ScreenCaptureService.ts`)  
**Investigation Baseline:** Task 06 Failure (`bench_task_06_mouse_control`: Expected `(100, 100)`, observed `(0, 0)`)

---

## 1. Actual Input Path

In the baseline implementation (`WindowsNativeInputDriver`), cursor repositioning and clicking was implemented via ad-hoc PowerShell invocations:
```typescript
const psCommand = `powershell -NoProfile -Command "[System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${Math.round(x)}, ${Math.round(y)})"`;
await execAsync(psCommand, { timeout: 2000 });
```
and:
```typescript
const psCommand = `powershell -NoProfile -Command "Add-Type -TypeDefinition '...'; [Mouse]::mouse_event(...)";
```

Each input action:
- Spawned a brand-new `powershell.exe` child process (~350ms to 1,200ms overhead).
- Executed inside the security context and thread desktop inherited from the parent process.

---

## 2. Actual Verification Path

Cursor verification was performed in `ScreenCaptureService.getCursorPosition()`:
```typescript
const psCommand = `powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position.X.ToString() + ',' + [System.Windows.Forms.Cursor]::Position.Y.ToString()"`;
const { stdout } = await execAsync(psCommand, { timeout: 2000 });
const parts = stdout.trim().split(',');
return { x: parseInt(parts[0], 10) || 0, y: parseInt(parts[1], 10) || 0 };
```

---

## 3. Interactive vs. Non-Interactive Behavior

Windows isolates processes using Window Stations and Desktops:
- **Interactive Session (Console / RDP):** The process belongs to an interactive Window Station (`WinSta0`) and is assigned to the interactive input desktop (`Default`).
- **Background / Sandbox / Runner Session:** The process belongs to `WinSta0`, but its calling threads are assigned to an isolated non-input desktop (e.g. `exebox-YAHFX3S4LPS6J2SB52TZOVS3KN`).

When a thread is attached to a non-input desktop:
- Win32 `GetCursorPos` returns `FALSE` with Win32 Error 5 (`ERROR_ACCESS_DENIED`).
- Win32 `SetCursorPos` returns `FALSE` with Win32 Error 5 (`ERROR_ACCESS_DENIED`) or has no effect on the physical desktop.
- `[System.Windows.Forms.Cursor]::Position` catches `GetCursorPos` failure internally and silently returns `System.Drawing.Point.Empty` (`{X=0, Y=0}`).

---

## 4. Why `(0, 0)` Occurs

1. `ScreenCaptureService.getCursorPosition()` invoked PowerShell.
2. In PowerShell, `[System.Windows.Forms.Cursor]::Position` attempted to call `user32!GetCursorPos`.
3. Because the child PowerShell thread inherited the sandbox desktop `exebox-...`, `GetCursorPos` failed with Win32 Error 5 (`ERROR_ACCESS_DENIED`).
4. .NET WinForms defaulted the coordinate struct to `(0, 0)`.
5. `parseInt("0")` produced `x: 0, y: 0`.
6. Any movement attempt via `[System.Windows.Forms.Cursor]::Position = ...` also failed silently with Error 5, leaving the physical cursor position unmanipulated and unverifiable.

---

## 5. Safest Production Fix

1. **Native Win32 Input Utility (`win32-native-input`):**
   Replace runtime PowerShell process spawning with a dedicated, compiled C# Win32 utility (`src/main/platform/win32-native-input.exe`).
2. **Explicit Input Desktop Attachment:**
   Call `OpenInputDesktop(0, false, DESKTOP_ALL)`.
   If a valid input desktop handle is acquired, dispatch cursor manipulation and inspection onto a clean worker thread and invoke `SetThreadDesktop(hInput)`.
3. **Explicit State Discrimination:**
   If `OpenInputDesktop` succeeds and `GetCursorPos` succeeds:
   - State: `INPUT_VERIFIED` (Exact coordinates reported).
   - Latency drops from ~1,400ms to <25ms.
   If running in a strictly non-interactive environment where `OpenInputDesktop` returns `IntPtr.Zero`:
   - State: `INPUT_EXECUTED | INPUT_VERIFICATION_UNAVAILABLE`.
   - Do NOT report fake success or false failure; report explicit diagnostic metadata.
