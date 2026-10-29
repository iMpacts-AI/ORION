import { ScreenBounds } from '../../../shared/types/action';
import { IWindowProvider, DefaultWindowProvider } from '../../platform/WindowProvider';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export interface WindowInfo {
  handle?: string;
  title: string;
  processName: string;
  processId: number;
  bounds: ScreenBounds;
  isMinimized?: boolean;
  isMaximized?: boolean;
}

export class WindowManagerService {
  private windowProvider: IWindowProvider;

  constructor(windowProvider?: IWindowProvider) {
    this.windowProvider = windowProvider || new DefaultWindowProvider();
  }

  public async getActiveWindow(): Promise<WindowInfo> {
    const raw = await this.windowProvider.getActiveWindow();
    return {
      title: raw.title || 'Unknown Window',
      processName: raw.processName || 'Unknown Process',
      processId: (raw as any).processId || 0,
      bounds: raw.bounds || { x: 0, y: 0, width: 1920, height: 1080 }
    };
  }

  public async getVisibleWindows(): Promise<WindowInfo[]> {
    const rawList = await this.windowProvider.getVisibleWindows();
    return rawList.map((w, idx) => ({
      title: w.title,
      processName: w.processName,
      processId: (w as any).processId ?? idx,
      bounds: w.bounds || { x: 0, y: 0, width: 1920, height: 1080 }
    }));
  }

  /**
   * Validates window/process target strings and rejects shell metacharacters or wildcards before any OS process starts.
   */
  public static validateWindowTarget(titleOrProcess: string): string {
    if (!titleOrProcess || typeof titleOrProcess !== 'string' || !titleOrProcess.trim()) {
      throw new Error('[SECURITY BLOCKED] Window target must be a non-empty string.');
    }
    const trimmed = titleOrProcess.trim();
    if (/[;&|`$(){}<>'"\r\n*?\0]/.test(trimmed) || trimmed.length > 120) {
      throw new Error(
        `[SECURITY BLOCKED] Invalid or unsafe window target rejected: '${trimmed.slice(0, 60)}'.`
      );
    }
    return trimmed;
  }

  public async focusWindow(titleOrProcess: string): Promise<boolean> {
    const validatedTarget = WindowManagerService.validateWindowTarget(titleOrProcess);
    if ((this.windowProvider as any).focusWindow) {
      return await (this.windowProvider as any).focusWindow(validatedTarget);
    }
    if (process.platform === 'win32') {
      try {
        const psScript = `
$target = $env:ORION_WIN_TARGET
if ([string]::IsNullOrWhiteSpace($target)) { exit 1 }
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public class OrionWin32Focus {
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);
}
'@
$cleanTarget = $target -replace '\\.exe$',''
$candidates = @(Get-Process | Where-Object {
  ($_.MainWindowHandle -ne 0) -and (
    ($_.MainWindowTitle -and $_.MainWindowTitle.IndexOf($target, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) -or
    ($_.ProcessName -and $_.ProcessName.IndexOf($cleanTarget, [System.StringComparison]::OrdinalIgnoreCase) -ge 0)
  )
})
$proc = $candidates | Where-Object { -not [string]::IsNullOrWhiteSpace($_.MainWindowTitle) } | Select-Object -First 1
if (-not $proc) { $proc = $candidates | Select-Object -First 1 }
if ($proc) {
  $hwnd = $proc.MainWindowHandle
  if ([OrionWin32Focus]::IsIconic($hwnd)) {
    [void][OrionWin32Focus]::ShowWindow($hwnd, 9)
  } else {
    [void][OrionWin32Focus]::ShowWindow($hwnd, 5)
  }
  [OrionWin32Focus]::keybd_event(0x12, 0, 0, [UIntPtr]::Zero)
  [void][OrionWin32Focus]::SetForegroundWindow($hwnd)
  [void][OrionWin32Focus]::BringWindowToTop($hwnd)
  [OrionWin32Focus]::keybd_event(0x12, 0, 2, [UIntPtr]::Zero)
  $wshell = New-Object -ComObject Wscript.Shell
  [void]$wshell.AppActivate($proc.Id)
  exit 0
}
exit 1
`.trim();
        await execFileAsync(
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-Command', psScript],
          {
            timeout: 2500,
            windowsHide: true,
            env: { ...process.env, ORION_WIN_TARGET: validatedTarget }
          }
        );
        return true;
      } catch (err) {
        return false;
      }
    }
    return true;
  }

  public async minimizeWindow(titleOrProcess: string): Promise<boolean> {
    const validatedTarget = WindowManagerService.validateWindowTarget(titleOrProcess);
    if (process.platform === 'win32') {
      try {
        const psScript = `
$target = $env:ORION_WIN_TARGET
if ([string]::IsNullOrWhiteSpace($target)) { exit 1 }
Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class WinMin { [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow); }'
$proc = Get-Process | Where-Object {
  ($_.MainWindowHandle -ne 0) -and (
    ($_.MainWindowTitle -and $_.MainWindowTitle.IndexOf($target, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) -or
    ($_.ProcessName -and $_.ProcessName.IndexOf($target, [System.StringComparison]::OrdinalIgnoreCase) -ge 0)
  )
} | Select-Object -First 1
if ($proc) {
  [void][WinMin]::ShowWindow($proc.MainWindowHandle, 6)
  exit 0
}
exit 1
`.trim();
        await execFileAsync(
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-Command', psScript],
          {
            timeout: 3000,
            windowsHide: true,
            env: { ...process.env, ORION_WIN_TARGET: validatedTarget }
          }
        );
        return true;
      } catch (err) {
        return false;
      }
    }
    return true;
  }

  public async maximizeWindow(titleOrProcess: string): Promise<boolean> {
    const validatedTarget = WindowManagerService.validateWindowTarget(titleOrProcess);
    if (process.platform === 'win32') {
      try {
        const psScript = `
$target = $env:ORION_WIN_TARGET
if ([string]::IsNullOrWhiteSpace($target)) { exit 1 }
Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class WinMax { [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow); }'
$proc = Get-Process | Where-Object {
  ($_.MainWindowHandle -ne 0) -and (
    ($_.MainWindowTitle -and $_.MainWindowTitle.IndexOf($target, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) -or
    ($_.ProcessName -and $_.ProcessName.IndexOf($target, [System.StringComparison]::OrdinalIgnoreCase) -ge 0)
  )
} | Select-Object -First 1
if ($proc) {
  [void][WinMax]::ShowWindow($proc.MainWindowHandle, 3)
  exit 0
}
exit 1
`.trim();
        await execFileAsync(
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-Command', psScript],
          {
            timeout: 3000,
            windowsHide: true,
            env: { ...process.env, ORION_WIN_TARGET: validatedTarget }
          }
        );
        return true;
      } catch (err) {
        return false;
      }
    }
    return true;
  }

  public async closeWindow(titleOrProcess: string): Promise<boolean> {
    const validatedTarget = WindowManagerService.validateWindowTarget(titleOrProcess);
    if ((this.windowProvider as any).closeWindow) {
      return await (this.windowProvider as any).closeWindow(validatedTarget);
    }
    if (process.platform === 'win32') {
      try {
        const psScript = `
$target = $env:ORION_WIN_TARGET
if ([string]::IsNullOrWhiteSpace($target)) { exit 1 }
$proc = Get-Process | Where-Object {
  ($_.MainWindowHandle -ne 0) -and (
    ($_.MainWindowTitle -and $_.MainWindowTitle.IndexOf($target, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) -or
    ($_.ProcessName -and $_.ProcessName.IndexOf($target, [System.StringComparison]::OrdinalIgnoreCase) -ge 0)
  )
} | Select-Object -First 1
if ($proc) {
  [void]$proc.CloseMainWindow()
  exit 0
}
exit 1
`.trim();
        await execFileAsync(
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-Command', psScript],
          {
            timeout: 3000,
            windowsHide: true,
            env: { ...process.env, ORION_WIN_TARGET: validatedTarget }
          }
        );
        return true;
      } catch (err) {
        return false;
      }
    }
    return true;
  }
}
