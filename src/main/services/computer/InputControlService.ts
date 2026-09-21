import { ScreenPoint } from '../../../shared/types/action';
import { exec, execFile } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

export function resolveNativeInputExe(): string | null {
  const candidates = [
    path.join(__dirname, '..', '..', 'platform', 'win32-native-input.exe'),
    path.join(__dirname, '..', 'platform', 'win32-native-input.exe'),
    path.resolve(process.cwd(), 'src/main/platform/win32-native-input.exe'),
    path.resolve(process.cwd(), 'dist-electron/main/platform/win32-native-input.exe')
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

export interface IInputDriver {
  mouseMove(x: number, y: number): Promise<void>;
  mouseClick(button?: 'left' | 'right' | 'middle'): Promise<void>;
  mouseDoubleClick(): Promise<void>;
  mouseDown(button?: 'left' | 'right' | 'middle'): Promise<void>;
  mouseUp(button?: 'left' | 'right' | 'middle'): Promise<void>;
  scroll(amount: number): Promise<void>;
  drag(from: ScreenPoint, to: ScreenPoint): Promise<void>;
  typeText(text: string): Promise<void>;
  pressKey(key: string): Promise<void>;
  keyDown(key: string): Promise<void>;
  keyUp(key: string): Promise<void>;
  hotkey(keys: string[]): Promise<void>;
}

export class WindowsNativeInputDriver implements IInputDriver {
  private nativeExePath: string | null = null;

  constructor() {
    if (process.platform === 'win32') {
      this.nativeExePath = resolveNativeInputExe();
    }
  }

  public getNativeExePath(): string | null {
    return this.nativeExePath;
  }

  public async mouseMove(x: number, y: number): Promise<void> {
    if (process.platform === 'win32') {
      const exe = this.nativeExePath || resolveNativeInputExe();
      if (exe) {
        try {
          await execFileAsync(exe, ['setpos', String(Math.round(x)), String(Math.round(y))], { timeout: 2000 });
          return;
        } catch (err) {}
      }
      try {
        const psCommand = `powershell -NoProfile -Command "[System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${Math.round(x)}, ${Math.round(y)})"`;
        await execAsync(psCommand, { timeout: 2000 });
      } catch (err) {}
    }
  }

  public async mouseClick(button: 'left' | 'right' | 'middle' = 'left'): Promise<void> {
    if (process.platform === 'win32') {
      const exe = this.nativeExePath || resolveNativeInputExe();
      if (exe) {
        try {
          await execFileAsync(exe, ['click', button], { timeout: 2000 });
          return;
        } catch (err) {}
      }
      try {
        let flagDown = 0x0002; // MOUSEEVENTF_LEFTDOWN
        let flagUp = 0x0004;   // MOUSEEVENTF_LEFTUP
        if (button === 'right') {
          flagDown = 0x0008;
          flagUp = 0x0010;
        } else if (button === 'middle') {
          flagDown = 0x0020;
          flagUp = 0x0040;
        }
        const psCommand = `powershell -NoProfile -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Mouse { [DllImport(\\"user32.dll\\")] public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo); }'; [Mouse]::mouse_event(${flagDown}, 0, 0, 0, 0); Start-Sleep -Milliseconds 50; [Mouse]::mouse_event(${flagUp}, 0, 0, 0, 0)"`;
        await execAsync(psCommand, { timeout: 2000 });
      } catch (err) {}
    }
  }

  public async mouseDoubleClick(): Promise<void> {
    if (process.platform === 'win32') {
      const exe = this.nativeExePath || resolveNativeInputExe();
      if (exe) {
        try {
          await execFileAsync(exe, ['doubleclick'], { timeout: 2000 });
          return;
        } catch (err) {}
      }
    }
    await this.mouseClick('left');
    await new Promise(r => setTimeout(r, 100));
    await this.mouseClick('left');
  }

  public async mouseDown(button: 'left' | 'right' | 'middle' = 'left'): Promise<void> {
    if (process.platform === 'win32') {
      try {
        const flag = button === 'right' ? 0x0008 : button === 'middle' ? 0x0020 : 0x0002;
        const psCommand = `powershell -NoProfile -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Mouse { [DllImport(\\"user32.dll\\")] public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo); }'; [Mouse]::mouse_event(${flag}, 0, 0, 0, 0)"`;
        await execAsync(psCommand, { timeout: 2000 });
      } catch (err) {}
    }
  }

  public async mouseUp(button: 'left' | 'right' | 'middle' = 'left'): Promise<void> {
    if (process.platform === 'win32') {
      try {
        const flag = button === 'right' ? 0x0010 : button === 'middle' ? 0x0040 : 0x0004;
        const psCommand = `powershell -NoProfile -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Mouse { [DllImport(\\"user32.dll\\")] public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo); }'; [Mouse]::mouse_event(${flag}, 0, 0, 0, 0)"`;
        await execAsync(psCommand, { timeout: 2000 });
      } catch (err) {}
    }
  }

  public async scroll(amount: number): Promise<void> {
    if (process.platform === 'win32') {
      const exe = this.nativeExePath || resolveNativeInputExe();
      if (exe) {
        try {
          await execFileAsync(exe, ['scroll', String(amount)], { timeout: 2000 });
          return;
        } catch (err) {}
      }
      try {
        const clicks = Math.round(amount * 120);
        const psCommand = `powershell -NoProfile -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Mouse { [DllImport(\\"user32.dll\\")] public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo); }'; [Mouse]::mouse_event(0x0800, 0, 0, [uint32]${clicks}, 0)"`;
        await execAsync(psCommand, { timeout: 2000 });
      } catch (err) {}
    }
  }

  public async drag(from: ScreenPoint, to: ScreenPoint): Promise<void> {
    await this.mouseMove(from.x, from.y);
    await this.mouseDown('left');
    await new Promise(r => setTimeout(r, 50));
    await this.mouseMove(to.x, to.y);
    await new Promise(r => setTimeout(r, 50));
    await this.mouseUp('left');
  }

  public async typeText(text: string): Promise<void> {
    if (process.platform === 'win32') {
      try {
        const escaped = text.replace(/[{}+^%~()\[\]]/g, '{$&}').replace(/'/g, "''");
        const psCommand = `powershell -NoProfile -Command "$wshell = New-Object -ComObject Wscript.Shell; $wshell.SendKeys('${escaped}')"`;
        await execAsync(psCommand, { timeout: 4000 });
      } catch (err) {}
    }
  }

  public async pressKey(key: string): Promise<void> {
    if (process.platform === 'win32') {
      try {
        let keyToSend = key;
        if (key.toLowerCase() === 'enter') keyToSend = '{ENTER}';
        else if (key.toLowerCase() === 'tab') keyToSend = '{TAB}';
        else if (key.toLowerCase() === 'escape' || key.toLowerCase() === 'esc') keyToSend = '{ESC}';
        else if (key.toLowerCase() === 'backspace') keyToSend = '{BACKSPACE}';
        else if (key.toLowerCase() === 'delete') keyToSend = '{DEL}';
        else if (key.toLowerCase() === 'up') keyToSend = '{UP}';
        else if (key.toLowerCase() === 'down') keyToSend = '{DOWN}';
        else if (key.toLowerCase() === 'left') keyToSend = '{LEFT}';
        else if (key.toLowerCase() === 'right') keyToSend = '{RIGHT}';

        const psCommand = `powershell -NoProfile -Command "$wshell = New-Object -ComObject Wscript.Shell; $wshell.SendKeys('${keyToSend}')"`;
        await execAsync(psCommand, { timeout: 2000 });
      } catch (err) {}
    }
  }

  public async keyDown(key: string): Promise<void> {
    await this.pressKey(key);
  }

  public async keyUp(key: string): Promise<void> {
    // Windows SendKeys executes instantaneous key stroke
  }

  public async hotkey(keys: string[]): Promise<void> {
    if (process.platform === 'win32') {
      try {
        let prefix = '';
        let mainKey = '';
        for (const k of keys) {
          const l = k.toLowerCase();
          if (l === 'ctrl' || l === 'control') prefix += '^';
          else if (l === 'alt') prefix += '%';
          else if (l === 'shift') prefix += '+';
          else mainKey = k;
        }
        const formatted = `${prefix}${mainKey}`;
        const psCommand = `powershell -NoProfile -Command "$wshell = New-Object -ComObject Wscript.Shell; $wshell.SendKeys('${formatted}')"`;
        await execAsync(psCommand, { timeout: 2000 });
      } catch (err) {}
    }
  }
}

export class MockInputDriver implements IInputDriver {
  public history: Array<{ action: string; args: any }> = [];

  public async mouseMove(x: number, y: number): Promise<void> {
    this.history.push({ action: 'mouseMove', args: { x, y } });
  }
  public async mouseClick(button: 'left' | 'right' | 'middle' = 'left'): Promise<void> {
    this.history.push({ action: 'mouseClick', args: { button } });
  }
  public async mouseDoubleClick(): Promise<void> {
    this.history.push({ action: 'mouseDoubleClick', args: {} });
  }
  public async mouseDown(button: 'left' | 'right' | 'middle' = 'left'): Promise<void> {
    this.history.push({ action: 'mouseDown', args: { button } });
  }
  public async mouseUp(button: 'left' | 'right' | 'middle' = 'left'): Promise<void> {
    this.history.push({ action: 'mouseUp', args: { button } });
  }
  public async scroll(amount: number): Promise<void> {
    this.history.push({ action: 'scroll', args: { amount } });
  }
  public async drag(from: ScreenPoint, to: ScreenPoint): Promise<void> {
    this.history.push({ action: 'drag', args: { from, to } });
  }
  public async typeText(text: string): Promise<void> {
    this.history.push({ action: 'typeText', args: { text } });
  }
  public async pressKey(key: string): Promise<void> {
    this.history.push({ action: 'pressKey', args: { key } });
  }
  public async keyDown(key: string): Promise<void> {
    this.history.push({ action: 'keyDown', args: { key } });
  }
  public async keyUp(key: string): Promise<void> {
    this.history.push({ action: 'keyUp', args: { key } });
  }
  public async hotkey(keys: string[]): Promise<void> {
    this.history.push({ action: 'hotkey', args: { keys } });
  }
}

export class InputControlService {
  private driver: IInputDriver;

  constructor(driver?: IInputDriver) {
    this.driver = driver || new WindowsNativeInputDriver();
  }

  public getDriver(): IInputDriver {
    return this.driver;
  }

  public async moveCursor(x: number, y: number): Promise<void> {
    await this.driver.mouseMove(x, y);
  }

  public async click(x?: number, y?: number, button: 'left' | 'right' | 'middle' = 'left'): Promise<void> {
    if (x !== undefined && y !== undefined) {
      await this.driver.mouseMove(x, y);
    }
    await this.driver.mouseClick(button);
  }

  public async doubleClick(x?: number, y?: number): Promise<void> {
    if (x !== undefined && y !== undefined) {
      await this.driver.mouseMove(x, y);
    }
    await this.driver.mouseDoubleClick();
  }

  public async rightClick(x?: number, y?: number): Promise<void> {
    await this.click(x, y, 'right');
  }

  public async scroll(amount: number): Promise<void> {
    await this.driver.scroll(amount);
  }

  public async drag(from: ScreenPoint, to: ScreenPoint): Promise<void> {
    await this.driver.drag(from, to);
  }

  public async type(text: string): Promise<void> {
    await this.driver.typeText(text);
  }

  public async pressKey(key: string): Promise<void> {
    await this.driver.pressKey(key);
  }

  public async hotkey(keys: string[]): Promise<void> {
    await this.driver.hotkey(keys);
  }

  public async getEnvironmentStatus(): Promise<{
    isInteractive: boolean;
    desktopName: string;
    isAttached: boolean;
    isVerificationAvailable: boolean;
  }> {
    if (process.platform !== 'win32') {
      return { isInteractive: true, desktopName: 'default', isAttached: true, isVerificationAvailable: true };
    }
    const exe = resolveNativeInputExe();
    if (exe) {
      try {
        const { stdout } = await execFileAsync(exe, ['status'], { timeout: 2000 });
        const isInteractive = stdout.includes('STATUS:INTERACTIVE');
        const deskMatch = stdout.match(/DESKTOP:([^|]+)/);
        const desktopName = deskMatch ? deskMatch[1] : 'unknown';
        const isAttached = stdout.includes('ATTACHED:True');
        return {
          isInteractive,
          desktopName,
          isAttached,
          isVerificationAvailable: isInteractive && isAttached
        };
      } catch (err) {}
    }
    return { isInteractive: false, desktopName: 'unknown', isAttached: false, isVerificationAvailable: false };
  }

  public async verifyCursorPosition(expectedX: number, expectedY: number, tolerance = 25): Promise<{
    verified: boolean;
    status: 'INPUT_VERIFIED' | 'INPUT_EXECUTED' | 'INPUT_VERIFICATION_UNAVAILABLE' | 'INPUT_FAILED';
    currentPos?: ScreenPoint;
    delta?: { dx: number; dy: number };
    reason?: string;
  }> {
    const env = await this.getEnvironmentStatus();
    const exe = resolveNativeInputExe();
    if (!exe || !env.isInteractive || !env.isVerificationAvailable) {
      return {
        verified: false,
        status: 'INPUT_VERIFICATION_UNAVAILABLE',
        reason: `Desktop is non-interactive or unattached (${env.desktopName}). Verification unavailable.`
      };
    }
    try {
      const { stdout } = await execFileAsync(exe, ['getpos'], { timeout: 2000 });
      const m = stdout.match(/POS:(-?\d+),(-?\d+)/);
      if (m) {
        const currentPos = { x: parseInt(m[1], 10), y: parseInt(m[2], 10) };
        const dx = Math.abs(currentPos.x - expectedX);
        const dy = Math.abs(currentPos.y - expectedY);
        if (dx <= tolerance && dy <= tolerance) {
          return { verified: true, status: 'INPUT_VERIFIED', currentPos, delta: { dx, dy } };
        } else {
          return {
            verified: false,
            status: 'INPUT_FAILED',
            currentPos,
            delta: { dx, dy },
            reason: `Offset (dx=${dx}, dy=${dy}) exceeded tolerance ${tolerance}.`
          };
        }
      }
      return { verified: false, status: 'INPUT_VERIFICATION_UNAVAILABLE', reason: stdout.trim() };
    } catch (err: any) {
      return { verified: false, status: 'INPUT_FAILED', reason: err.message };
    }
  }
}
