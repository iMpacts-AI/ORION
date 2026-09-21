import { ScreenBounds, ScreenPoint } from '../../../shared/types/action';
import { desktopCapturer } from 'electron';
import { exec, execFile } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { resolveNativeInputExe } from './InputControlService';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

export interface ScreenMetrics {
  width: number;
  height: number;
  scaleFactor: number;
}

export class ScreenCaptureService {
  private cachedMetrics?: ScreenMetrics;

  public async getScreenMetrics(): Promise<ScreenMetrics> {
    if (this.cachedMetrics) return this.cachedMetrics;

    if (process.platform === 'win32') {
      try {
        const psCommand = `powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Width.ToString() + 'x' + [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Height.ToString()"`;
        const { stdout } = await execAsync(psCommand, { timeout: 3000 });
        const parts = stdout.trim().split('x');
        const width = parseInt(parts[0], 10) || 1920;
        const height = parseInt(parts[1], 10) || 1080;
        this.cachedMetrics = { width, height, scaleFactor: 1.0 };
        return this.cachedMetrics;
      } catch (err) {
        // Fallback
      }
    }

    this.cachedMetrics = { width: 1920, height: 1080, scaleFactor: 1.0 };
    return this.cachedMetrics;
  }

  public async captureFullScreenBase64(): Promise<string> {
    try {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 1920, height: 1080 }
      });

      if (sources.length > 0) {
        return sources[0].thumbnail.toDataURL();
      }
    } catch (err) {
      // Fallback for non-Electron test environments or headless CLI
    }

    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  }

  public async getCursorVerificationStatus(): Promise<{
    available: boolean;
    interactive: boolean;
    desktop: string;
    reason?: string;
  }> {
    if (process.platform !== 'win32') {
      return { available: true, interactive: true, desktop: 'default' };
    }
    const exe = resolveNativeInputExe();
    if (exe) {
      try {
        const { stdout } = await execFileAsync(exe, ['status'], { timeout: 2000 });
        const interactive = stdout.includes('STATUS:INTERACTIVE');
        const attached = stdout.includes('ATTACHED:True');
        const match = stdout.match(/DESKTOP:([^|]+)/);
        const desktop = match ? match[1] : 'unknown';
        return {
          available: interactive && attached,
          interactive,
          desktop,
          reason: interactive && attached ? undefined : `Desktop is not attached (${desktop})`
        };
      } catch (err: any) {
        return { available: false, interactive: false, desktop: 'error', reason: err.message };
      }
    }
    return { available: false, interactive: false, desktop: 'unknown', reason: 'Native utility missing' };
  }

  public async getCursorPosition(): Promise<ScreenPoint> {
    if (process.platform === 'win32') {
      const exe = resolveNativeInputExe();
      if (exe) {
        try {
          const { stdout } = await execFileAsync(exe, ['getpos'], { timeout: 2000 });
          const match = stdout.match(/POS:(-?\d+),(-?\d+)/);
          if (match) {
            return {
              x: parseInt(match[1], 10),
              y: parseInt(match[2], 10)
            };
          }
        } catch (err) {}
      }

      try {
        const psCommand = `powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position.X.ToString() + ',' + [System.Windows.Forms.Cursor]::Position.Y.ToString()"`;
        const { stdout } = await execAsync(psCommand, { timeout: 2000 });
        const parts = stdout.trim().split(',');
        return {
          x: parseInt(parts[0], 10) || 0,
          y: parseInt(parts[1], 10) || 0
        };
      } catch (err) {
        // Fallback
      }
    }
    return { x: 960, y: 540 };
  }
}
