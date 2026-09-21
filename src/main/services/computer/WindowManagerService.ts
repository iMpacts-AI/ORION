import { ScreenBounds } from '../../../shared/types/action';
import { IWindowProvider, DefaultWindowProvider } from '../../platform/WindowProvider';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
      processId: 0,
      bounds: raw.bounds || { x: 0, y: 0, width: 1920, height: 1080 }
    };
  }

  public async getVisibleWindows(): Promise<WindowInfo[]> {
    const rawList = await this.windowProvider.getVisibleWindows();
    return rawList.map((w, idx) => ({
      title: w.title,
      processName: w.processName,
      processId: idx,
      bounds: w.bounds || { x: 0, y: 0, width: 1920, height: 1080 }
    }));
  }

  private sanitizeTitle(titleOrProcess: string): string {
    return (titleOrProcess || '').replace(/[^a-zA-Z0-9_\-\s.]/g, '').substring(0, 100);
  }

  public async focusWindow(titleOrProcess: string): Promise<boolean> {
    if ((this.windowProvider as any).focusWindow) {
      return await (this.windowProvider as any).focusWindow(titleOrProcess);
    }
    if (process.platform === 'win32') {
      try {
        const safe = this.sanitizeTitle(titleOrProcess);
        const psCommand = `powershell -NoProfile -Command "$proc = Get-Process | Where-Object { $_.MainWindowTitle -like '*${safe}*' -or $_.ProcessName -like '*${safe}*' } | Select-Object -First 1; if ($proc) { $wshell = New-Object -ComObject Wscript.Shell; $wshell.AppActivate($proc.Id) } else { exit 1 }"`;
        await execAsync(psCommand, { timeout: 1000 });
        return true;
      } catch (err) {
        return false;
      }
    }
    return true;
  }

  public async minimizeWindow(titleOrProcess: string): Promise<boolean> {
    if (process.platform === 'win32') {
      try {
        const safe = this.sanitizeTitle(titleOrProcess);
        const psCommand = `powershell -NoProfile -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class WinMin { [DllImport(\\"user32.dll\\")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow); }'; $proc = Get-Process | Where-Object { $_.MainWindowTitle -like '*${safe}*' } | Select-Object -First 1; if ($proc) { [WinMin]::ShowWindow($proc.MainWindowHandle, 6); exit 0 } else { exit 1 }"`;
        await execAsync(psCommand, { timeout: 3000 });
        return true;
      } catch (err) {
        return false;
      }
    }
    return true;
  }

  public async maximizeWindow(titleOrProcess: string): Promise<boolean> {
    if (process.platform === 'win32') {
      try {
        const safe = this.sanitizeTitle(titleOrProcess);
        const psCommand = `powershell -NoProfile -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class WinMax { [DllImport(\\"user32.dll\\")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow); }'; $proc = Get-Process | Where-Object { $_.MainWindowTitle -like '*${safe}*' } | Select-Object -First 1; if ($proc) { [WinMax]::ShowWindow($proc.MainWindowHandle, 3); exit 0 } else { exit 1 }"`;
        await execAsync(psCommand, { timeout: 3000 });
        return true;
      } catch (err) {
        return false;
      }
    }
    return true;
  }

  public async closeWindow(titleOrProcess: string): Promise<boolean> {
    if ((this.windowProvider as any).closeWindow) {
      return await (this.windowProvider as any).closeWindow(titleOrProcess);
    }
    if (process.platform === 'win32') {
      try {
        const safe = this.sanitizeTitle(titleOrProcess);
        const psCommand = `powershell -NoProfile -Command "$proc = Get-Process | Where-Object { $_.MainWindowTitle -like '*${safe}*' -or $_.ProcessName -like '*${safe}*' } | Select-Object -First 1; if ($proc) { $proc.CloseMainWindow(); exit 0 } else { exit 1 }"`;
        await execAsync(psCommand, { timeout: 3000 });
        return true;
      } catch (err) {
        return false;
      }
    }
    return true;
  }
}
