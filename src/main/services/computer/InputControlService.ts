import { ScreenPoint } from '../../../shared/types/action';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
  public async mouseMove(x: number, y: number): Promise<void> {
    if (process.platform === 'win32') {
      try {
        const psCommand = `powershell -NoProfile -Command "[System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${Math.round(x)}, ${Math.round(y)})"`;
        await execAsync(psCommand, { timeout: 2000 });
      } catch (err) {}
    }
  }

  public async mouseClick(button: 'left' | 'right' | 'middle' = 'left'): Promise<void> {
    if (process.platform === 'win32') {
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
}
