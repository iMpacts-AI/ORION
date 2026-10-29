import { ScreenBounds, ScreenPoint } from '../../../shared/types/action';
import { exec, execFile } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { resolveNativeInputExe } from './InputControlService';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

function getElectronDesktopCapturer(): { getSources: (opts: any) => Promise<any[]> } | null {
  try {
    if (!process.versions || !process.versions.electron) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const electronMod = require('electron');
    if (
      electronMod &&
      typeof electronMod === 'object' &&
      electronMod.desktopCapturer &&
      typeof electronMod.desktopCapturer.getSources === 'function'
    ) {
      return electronMod.desktopCapturer;
    }
  } catch {
    // Running in pure Node.js CLI mode
  }
  return null;
}

export interface ScreenMetrics {
  width: number;
  height: number;
  scaleFactor: number;
}

export interface ScreenCapturePayload {
  dataUrl: string;
  width: number;
  height: number;
  byteLength: number;
  source: 'ELECTRON_DESKTOP_CAPTURER' | 'WIN32_GDI_BITMAP' | 'DARWIN_SCREENCAPTURE' | 'LINUX_IMPORT';
  timestamp: number;
}

export class ScreenCaptureService {
  private cachedMetrics?: ScreenMetrics;
  private lastCaptureCache?: { payload: ScreenCapturePayload; capturedAt: number };
  private static readonly CAPTURE_CACHE_TTL_MS = 1000;

  public static parsePngMetadata(buffer: Buffer): { validPng: boolean; width: number; height: number } {
    if (!Buffer.isBuffer(buffer) || buffer.length < 24) {
      return { validPng: false, width: 0, height: 0 };
    }
    const isPngSig =
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a;
    const ihdr = buffer.toString('ascii', 12, 16);
    if (!isPngSig || ihdr !== 'IHDR') {
      return { validPng: false, width: 0, height: 0 };
    }
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { validPng: width > 1 && height > 1, width, height };
  }

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

  public async captureScreenWithMetadata(options?: { forceFresh?: boolean; signal?: AbortSignal }): Promise<ScreenCapturePayload> {
    if (options?.signal?.aborted) {
      throw new Error('Screen capture cancelled via AbortSignal.');
    }

    if (
      !options?.forceFresh &&
      this.lastCaptureCache &&
      Date.now() - this.lastCaptureCache.capturedAt < ScreenCaptureService.CAPTURE_CACHE_TTL_MS
    ) {
      return this.lastCaptureCache.payload;
    }

    // 1. Attempt Electron desktopCapturer when running inside Electron main process
    const desktopCapturer = getElectronDesktopCapturer();
    if (desktopCapturer) {
      try {
        const sources = await desktopCapturer.getSources({
          types: ['screen'],
          thumbnailSize: { width: 1920, height: 1080 }
        });

        if (sources.length > 0) {
          const pngBuf = sources[0].thumbnail.toPNG();
          const meta = ScreenCaptureService.parsePngMetadata(pngBuf);
          if (meta.validPng) {
            const payload: ScreenCapturePayload = {
              dataUrl: `data:image/png;base64,${pngBuf.toString('base64')}`,
              width: meta.width,
              height: meta.height,
              byteLength: pngBuf.length,
              source: 'ELECTRON_DESKTOP_CAPTURER',
              timestamp: Date.now()
            };
            this.lastCaptureCache = { payload, capturedAt: Date.now() };
            return payload;
          }
        }
      } catch {
        // Proceed to native OS capture adapter in pure Node CLI mode
      }
    }

    // 2. Native OS Screen Capture Adapter (Windows win32-native-input.exe OpenInputDesktop / .NET GDI+ / macOS screencapture / Linux import)
    const tmpPngPath = path.join(os.tmpdir(), `orion_screen_${process.pid}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.png`);
    const tmpPs1Path = path.join(os.tmpdir(), `orion_cap_${process.pid}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.ps1`);

    try {
      if (process.platform === 'win32') {
        const nativeExe = resolveNativeInputExe();
        let capturedByExe = false;
        if (nativeExe) {
          try {
            await execFileAsync(nativeExe, ['screenshot', tmpPngPath], {
              timeout: 4000,
              windowsHide: true,
              signal: options?.signal
            });
            capturedByExe = fs.existsSync(tmpPngPath);
          } catch (exeErr: any) {
            if (options?.signal?.aborted) throw exeErr;
          }
        }

        if (!capturedByExe) {
          const psScript = [
            'Add-Type -AssemblyName System.Windows.Forms',
            'Add-Type -AssemblyName System.Drawing',
            '$bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds',
            '$w = if ($bounds.Width -gt 0) { $bounds.Width } else { 1920 }',
            '$h = if ($bounds.Height -gt 0) { $bounds.Height } else { 1080 }',
            '$bmp = New-Object System.Drawing.Bitmap($w, $h)',
            '$g = [System.Drawing.Graphics]::FromImage($bmp)',
            'try { $g.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size) } finally { $g.Dispose() }',
            `$bmp.Save('${tmpPngPath.replace(/'/g, "''")}', [System.Drawing.Imaging.ImageFormat]::Png)`,
            '$bmp.Dispose()'
          ].join('\r\n');

          fs.writeFileSync(tmpPs1Path, psScript, 'utf8');
          await execFileAsync(
            'powershell.exe',
            ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', tmpPs1Path],
            { timeout: 6000, windowsHide: true, signal: options?.signal }
          );
        }
      } else if (process.platform === 'darwin') {
        await execFileAsync('screencapture', ['-x', tmpPngPath], { timeout: 5000, signal: options?.signal });
      } else {
        await execFileAsync('import', ['-window', 'root', tmpPngPath], { timeout: 5000, signal: options?.signal });
      }

      if (!fs.existsSync(tmpPngPath)) {
        throw new Error('Native screen capture failed to produce output PNG file.');
      }

      const pngBuffer = fs.readFileSync(tmpPngPath);
      const meta = ScreenCaptureService.parsePngMetadata(pngBuffer);
      if (!meta.validPng) {
        throw new Error(`Captured buffer failed PNG signature or dimension verification (${pngBuffer.length} bytes).`);
      }

      const payload: ScreenCapturePayload = {
        dataUrl: `data:image/png;base64,${pngBuffer.toString('base64')}`,
        width: meta.width,
        height: meta.height,
        byteLength: pngBuffer.length,
        source: process.platform === 'win32' ? 'WIN32_GDI_BITMAP' : process.platform === 'darwin' ? 'DARWIN_SCREENCAPTURE' : 'LINUX_IMPORT',
        timestamp: Date.now()
      };
      this.cachedMetrics = { width: meta.width, height: meta.height, scaleFactor: 1.0 };
      this.lastCaptureCache = { payload, capturedAt: Date.now() };
      return payload;
    } finally {
      try { if (fs.existsSync(tmpPs1Path)) fs.unlinkSync(tmpPs1Path); } catch {}
      try { if (fs.existsSync(tmpPngPath)) fs.unlinkSync(tmpPngPath); } catch {}
    }
  }

  public async captureFullScreenBase64(options?: { forceFresh?: boolean; signal?: AbortSignal }): Promise<string> {
    const payload = await this.captureScreenWithMetadata(options);
    return payload.dataUrl;
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
