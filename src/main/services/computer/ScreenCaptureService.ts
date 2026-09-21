import { ScreenBounds, ScreenPoint } from '../../../shared/types/action';
import { desktopCapturer } from 'electron';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

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

  public async getCursorPosition(): Promise<ScreenPoint> {
    if (process.platform === 'win32') {
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
