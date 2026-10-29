import { ActiveWindowInfo } from '../../shared/types/environment';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export interface IWindowProvider {
  getActiveWindow(): Promise<ActiveWindowInfo>;
  getVisibleWindows(): Promise<ActiveWindowInfo[]>;
}

const WIN32_FOREGROUND_SCRIPT = `
Add-Type -TypeDefinition @'
using System;
using System.Text;
using System.Runtime.InteropServices;
public class OrionWin32Fg {
  [StructLayout(LayoutKind.Sequential)]
  public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr hWnd);
}
'@
$hwnd = [OrionWin32Fg]::GetForegroundWindow()
if ($hwnd -eq [IntPtr]::Zero) {
  Write-Output "UNKNOWN|||Unknown|||0|||0,0,1920,1080|||false"
  exit 0
}
$sb = New-Object System.Text.StringBuilder 512
[void][OrionWin32Fg]::GetWindowText($hwnd, $sb, 512)
$winTitle = $sb.ToString()
$procId = [uint32]0
[void][OrionWin32Fg]::GetWindowThreadProcessId($hwnd, [ref]$procId)
$rect = New-Object OrionWin32Fg+RECT
[void][OrionWin32Fg]::GetWindowRect($hwnd, [ref]$rect)
$isMin = [OrionWin32Fg]::IsIconic($hwnd)
$procName = "Unknown"
if ($procId -gt 0) {
  $p = Get-Process -Id $procId -ErrorAction SilentlyContinue
  if ($p) {
    $procName = $p.ProcessName
    if ([string]::IsNullOrWhiteSpace($winTitle)) { $winTitle = $p.MainWindowTitle }
  }
}
$w = [Math]::Max(1, $rect.Right - $rect.Left)
$h = [Math]::Max(1, $rect.Bottom - $rect.Top)
Write-Output "$winTitle|||$procName|||$procId|||$($rect.Left),$($rect.Top),$w,$h|||$isMin"
`.trim();

export class DefaultWindowProvider implements IWindowProvider {
  public async getActiveWindow(): Promise<ActiveWindowInfo> {
    if (process.platform === 'win32') {
      try {
        const { stdout } = await execFileAsync(
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-Command', WIN32_FOREGROUND_SCRIPT],
          { timeout: 1500, windowsHide: true }
        );
        const parts = stdout.trim().split('|||');
        const rawTitle = (parts[0] || '').trim();
        const rawProc = (parts[1] || '').trim();
        const coords = (parts[3] || '0,0,1920,1080').split(',').map(n => parseInt(n, 10));
        const bounds =
          coords.length === 4 && coords.every(n => !Number.isNaN(n))
            ? { x: coords[0], y: coords[1], width: coords[2], height: coords[3] }
            : { x: 0, y: 0, width: 1920, height: 1080 };

        if (rawTitle === 'UNKNOWN' && rawProc === 'Unknown') {
          return {
            title: 'Unknown Foreground Window',
            processName: 'Unknown',
            bounds
          };
        }

        const processName = rawProc
          ? rawProc.toLowerCase().endsWith('.exe')
            ? rawProc
            : `${rawProc}.exe`
          : 'Unknown';

        return {
          title: rawTitle || rawProc || 'Unknown Window',
          processName,
          bounds
        };
      } catch (e) {
        return {
          title: 'Unknown Window (Foreground Query Unavailable)',
          processName: 'Unknown',
          bounds: { x: 0, y: 0, width: 1920, height: 1080 }
        };
      }
    }

    return {
      title: 'ORION AI Command Shell',
      processName: 'Electron',
      bounds: { x: 0, y: 0, width: 1920, height: 1080 }
    };
  }

  public async getVisibleWindows(): Promise<ActiveWindowInfo[]> {
    if (process.platform === 'win32') {
      try {
        const psScript = `$procs = Get-Process | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 25 Id, ProcessName, MainWindowTitle; $procs | ConvertTo-Json -Compress`;
        const { stdout } = await execFileAsync(
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-Command', psScript],
          { timeout: 1500, windowsHide: true }
        );
        if (stdout.trim().startsWith('[') || stdout.trim().startsWith('{')) {
          const parsed = JSON.parse(stdout.trim());
          const items = Array.isArray(parsed) ? parsed : [parsed];

          return items.map((item: any) => ({
            title: item.MainWindowTitle || item.ProcessName,
            processName: `${item.ProcessName}.exe`,
            processId: Number(item.Id || 0)
          }));
        }
      } catch (e) {
        // Return empty array on failure rather than fabricating open windows
        return [];
      }
    }

    return [
      { title: 'ORION AI Command Shell', processName: 'Electron' },
      { title: 'Visual Studio Code', processName: 'Code.exe' }
    ];
  }
}

export class MockWindowProvider implements IWindowProvider {
  public activeWindow: ActiveWindowInfo = {
    title: 'Untitled - Notepad',
    processName: 'notepad.exe',
    bounds: { x: 0, y: 0, width: 1920, height: 1080 }
  };
  public visibleWindows: ActiveWindowInfo[] = [
    { title: 'Untitled - Notepad', processName: 'notepad.exe' },
    { title: 'ORION Command Center', processName: 'electron.exe' }
  ];

  public async getActiveWindow(): Promise<ActiveWindowInfo> {
    return this.activeWindow;
  }

  public async getVisibleWindows(): Promise<ActiveWindowInfo[]> {
    return this.visibleWindows;
  }

  public async closeWindow(target: string): Promise<boolean> {
    this.activeWindow = {
      title: 'ORION Command Center',
      processName: 'electron.exe',
      bounds: { x: 0, y: 0, width: 1920, height: 1080 }
    };
    this.visibleWindows = this.visibleWindows.filter(
      w => !w.processName.toLowerCase().includes(target.toLowerCase()) && !w.title.toLowerCase().includes(target.toLowerCase())
    );
    return true;
  }

  public async focusWindow(target: string): Promise<boolean> {
    const found = this.visibleWindows.find(
      w => w.processName.toLowerCase().includes(target.toLowerCase()) || w.title.toLowerCase().includes(target.toLowerCase())
    );
    if (!found && !target.toLowerCase().includes('notepad') && !target.toLowerCase().includes('electron')) {
      return false;
    }
    this.activeWindow = {
      title: target.includes('notepad') ? 'Untitled - Notepad' : (found?.title || target),
      processName: target.includes('notepad') ? 'notepad.exe' : (found?.processName || `${target}.exe`),
      bounds: { x: 0, y: 0, width: 1920, height: 1080 }
    };
    return true;
  }
}
