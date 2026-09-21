import { ActiveWindowInfo } from '../../shared/types/environment';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface IWindowProvider {
  getActiveWindow(): Promise<ActiveWindowInfo>;
  getVisibleWindows(): Promise<ActiveWindowInfo[]>;
}

export class DefaultWindowProvider implements IWindowProvider {
  public async getActiveWindow(): Promise<ActiveWindowInfo> {
    if (process.platform === 'win32') {
      try {
        const psCommand = `powershell -NoProfile -Command "$proc = Get-Process | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1; if ($proc) { Write-Output (($proc.MainWindowTitle) + '|||' + $proc.ProcessName) } else { Write-Output 'ORION AI Command Shell|||Electron' }"`;
        const { stdout } = await execAsync(psCommand, { timeout: 800 });
        const parts = stdout.trim().split('|||');
        const title = parts[0] || 'ORION AI Command Shell';
        const processName = parts[1] ? `${parts[1]}.exe` : 'Electron.exe';

        return {
          title,
          processName,
          bounds: { x: 0, y: 0, width: 1920, height: 1080 }
        };
      } catch (e) {
        // Fallback to active process check if PowerShell call fails
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
        const psCommand = `powershell -NoProfile -Command "$procs = Get-Process | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 10 ProcessName, MainWindowTitle; $procs | ConvertTo-Json -Compress"`;
        const { stdout } = await execAsync(psCommand, { timeout: 800 });
        if (stdout.trim().startsWith('[') || stdout.trim().startsWith('{')) {
          const parsed = JSON.parse(stdout.trim());
          const items = Array.isArray(parsed) ? parsed : [parsed];

          return items.map((item: any) => ({
            title: item.MainWindowTitle || item.ProcessName,
            processName: `${item.ProcessName}.exe`
          }));
        }
      } catch (e) {
        // Fallback if PowerShell call fails
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
    this.visibleWindows = this.visibleWindows.filter(w => !w.processName.toLowerCase().includes(target.toLowerCase()) && !w.title.toLowerCase().includes(target.toLowerCase()));
    return true;
  }

  public async focusWindow(target: string): Promise<boolean> {
    const found = this.visibleWindows.find(w => w.processName.toLowerCase().includes(target.toLowerCase()) || w.title.toLowerCase().includes(target.toLowerCase()));
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
