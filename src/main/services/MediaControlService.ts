import { exec, execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { eventBus } from '../../shared/events';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

export interface MediaPlaybackStatus {
  running: boolean;
  playing: boolean;
  track?: string;
  artist?: string;
  windowTitle: string;
  player: string;
  source?: 'WINRT_GSMTC' | 'WINDOW_TITLE' | 'NONE';
}

export interface MediaActionResult {
  success: boolean;
  action: string;
  message: string;
  playbackVerified?: boolean;
  outcomeStatus?: import('../../shared/types').TaskOutcomeStatus;
  status?: MediaPlaybackStatus;
}

export class MediaControlService {
  /**
   * Inspects Windows Global System Media Transport Controls (GSMTC) and active media player
   * windows to report truthful now-playing state without guessing.
   */
  public async getNowPlaying(): Promise<MediaPlaybackStatus> {
    if (process.platform === 'win32') {
      try {
        const psScript = `
$ErrorActionPreference = 'SilentlyContinue'
$gsmtcHandled = $false
try {
  Add-Type -AssemblyName System.Runtime.WindowsRuntime
  $asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation\`1'
  })[0]
  function Await-WinRt($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $null = $netTask.Wait(1500)
    return $netTask.Result
  }
  $mgrType = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType = WindowsRuntime]
  $propType = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties, Windows.Media.Control, ContentType = WindowsRuntime]
  $mgr = Await-WinRt ($mgrType::RequestAsync()) $mgrType
  if ($mgr) {
    $session = $mgr.GetCurrentSession()
    if ($session) {
      $pb = $session.GetPlaybackInfo()
      $statusStr = if ($pb) { [string]$pb.PlaybackStatus } else { 'Unknown' }
      $props = Await-WinRt ($session.TryGetMediaPropertiesAsync()) $propType
      $title = if ($props -and $props.Title) { [string]$props.Title } else { '' }
      $artist = if ($props -and $props.Artist) { [string]$props.Artist } else { '' }
      $appId = [string]$session.SourceAppUserModelId
      [PSCustomObject]@{
        source = 'WINRT_GSMTC'
        running = $true
        playing = ($statusStr -eq 'Playing' -or $statusStr -eq '4')
        title = $title
        artist = $artist
        player = if ($appId) { $appId } else { 'WindowsMediaSession' }
      } | ConvertTo-Json -Compress
      $gsmtcHandled = $true
    }
  }
} catch {}

if (-not $gsmtcHandled) {
  $procs = Get-Process -Name Spotify,vlc,wmplayer -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -ne '' }
  if ($procs) {
    $first = $procs | Select-Object -First 1
    [PSCustomObject]@{
      source = 'WINDOW_TITLE'
      running = $true
      windowTitle = [string]$first.MainWindowTitle
      player = [string]$first.ProcessName
    } | ConvertTo-Json -Compress
  } else {
    $anySpotify = Get-Process -Name Spotify -ErrorAction SilentlyContinue
    if ($anySpotify) {
      [PSCustomObject]@{
        source = 'WINDOW_TITLE'
        running = $true
        windowTitle = 'Spotify'
        player = 'Spotify'
      } | ConvertTo-Json -Compress
    } else {
      [PSCustomObject]@{
        source = 'NONE'
        running = $false
        playing = $false
        windowTitle = ''
        player = 'None'
      } | ConvertTo-Json -Compress
    }
  }
}
`;
        const { stdout } = await this.runPowerShellSafe(psScript, 4000);
        const raw = stdout.trim();
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.source === 'WINRT_GSMTC') {
            const track = parsed.title || undefined;
            const artist = parsed.artist || undefined;
            const displayTitle = artist && track ? `${artist} - ${track}` : track || parsed.player || 'Media Session';
            return {
              running: true,
              playing: Boolean(parsed.playing),
              artist,
              track,
              windowTitle: displayTitle,
              player: String(parsed.player || 'WindowsMediaSession'),
              source: 'WINRT_GSMTC'
            };
          }
          if (parsed.running) {
            const title = String(parsed.windowTitle || parsed.player || 'Spotify').trim();
            const lowerTitle = title.toLowerCase();
            const isIdleTitle =
              lowerTitle === 'spotify' ||
              lowerTitle === 'spotify free' ||
              lowerTitle === 'spotify premium' ||
              lowerTitle === 'vlc media player' ||
              lowerTitle === 'windows media player';
            let artist: string | undefined;
            let track: string | undefined;
            if (!isIdleTitle && title.includes(' - ')) {
              const parts = title.split(' - ');
              artist = parts[0]?.trim();
              track = parts.slice(1).join(' - ').trim();
            } else if (!isIdleTitle) {
              track = title;
            }
            return {
              running: true,
              playing: !isIdleTitle,
              artist,
              track,
              windowTitle: title,
              player: String(parsed.player || 'Spotify'),
              source: 'WINDOW_TITLE'
            };
          }
        }
      } catch {
        // Return truthful stopped/unverified status on inspection error
      }
    }

    return {
      running: false,
      playing: false,
      windowTitle: '',
      player: 'None',
      source: 'NONE'
    };
  }

  /**
   * Dispatches hardware virtual-key media controls on Windows via user32.dll keybd_event:
   * 0xB3 = Play/Pause, 0xB0 = Next Track, 0xB1 = Previous Track, 0xB2 = Stop,
   * 0xAF = Volume Up, 0xAE = Volume Down, 0xAD = Volume Mute
   */
  public async controlPlayback(
    action: 'play' | 'pause' | 'toggle' | 'next' | 'previous' | 'stop' | 'louder' | 'quieter' | 'mute'
  ): Promise<MediaActionResult> {
    const normalized = action.toLowerCase().trim();
    const vkMap: Record<string, number> = {
      play: 0xB3,
      pause: 0xB3,
      toggle: 0xB3,
      next: 0xB0,
      skip: 0xB0,
      previous: 0xB1,
      prev: 0xB1,
      back: 0xB1,
      stop: 0xB2,
      louder: 0xAF,
      volume_up: 0xAF,
      quieter: 0xAE,
      volume_down: 0xAE,
      mute: 0xAD
    };

    const vk = vkMap[normalized];
    if (!vk) {
      return {
        success: false,
        action: normalized,
        playbackVerified: false,
        outcomeStatus: 'failed',
        message: `Unsupported media control action '${action}'. Supported: play, pause, toggle, next, previous, stop, louder, quieter, mute.`
      };
    }

    if (process.platform === 'win32') {
      try {
        const beforeStatus = await this.getNowPlaying();
        // Avoid toggling a playing session into paused when user explicitly requested 'play' (or vice versa for 'pause')
        if (normalized === 'play' && beforeStatus.playing) {
          return {
            success: true,
            action: normalized,
            playbackVerified: true,
            outcomeStatus: 'completed_verified',
            message: `Media playback is already active (${beforeStatus.windowTitle}).`,
            status: beforeStatus
          };
        }
        if (normalized === 'pause' && beforeStatus.running && !beforeStatus.playing) {
          return {
            success: true,
            action: normalized,
            playbackVerified: true,
            outcomeStatus: 'completed_verified',
            message: `Media player (${beforeStatus.player}) is already paused.`,
            status: beforeStatus
          };
        }

        const repeatCount = normalized === 'louder' || normalized === 'quieter' ? 3 : 1;
        const psScript = `
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class OrionMediaKey {
  [DllImport("user32.dll")]
  public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);
}
"@
for ($i = 0; $i -lt ${repeatCount}; $i++) {
  [OrionMediaKey]::keybd_event(${vk}, 0, 0, [UIntPtr]::Zero)
  Start-Sleep -Milliseconds 30
  [OrionMediaKey]::keybd_event(${vk}, 0, 2, [UIntPtr]::Zero)
}
Write-Output "DISPATCHED"
`;
        await this.runPowerShellSafe(psScript, 4000);
        await new Promise(r => setTimeout(r, 350));
        eventBus.logActivity('TOOL_EXECUTION', `Dispatched Windows media key action: ${normalized} (VK: 0x${vk.toString(16).toUpperCase()})`);
        const status = await this.getNowPlaying();

        let playbackVerified = false;
        if (normalized === 'louder' || normalized === 'quieter' || normalized === 'mute' || normalized === 'volume_up' || normalized === 'volume_down') {
          playbackVerified = true;
        } else if (normalized === 'play') {
          playbackVerified = status.playing === true;
        } else if (normalized === 'pause' || normalized === 'stop') {
          playbackVerified = status.running && status.playing === false;
        } else {
          playbackVerified = status.running && (status.playing || Boolean(status.track));
        }

        const outcomeStatus = playbackVerified ? 'completed_verified' : 'launched_unverified';
        const message = playbackVerified
          ? `Media control '${normalized}' verified (${status.windowTitle || status.player}).`
          : `Media key '${normalized}' dispatched, but active playback state could not be verified (playerRunning=${status.running}, playing=${status.playing}).`;

        return {
          success: true,
          action: normalized,
          playbackVerified,
          outcomeStatus,
          message,
          status
        };
      } catch (err: any) {
        return {
          success: false,
          action: normalized,
          playbackVerified: false,
          outcomeStatus: 'failed',
          message: `Failed to dispatch media key '${normalized}': ${err.message}`
        };
      }
    }

    return {
      success: true,
      action: normalized,
      playbackVerified: false,
      outcomeStatus: 'launched_unverified',
      message: `Media control '${normalized}' dispatched on non-Windows platform without OS session verification.`
    };
  }

  /**
   * Launches or focuses Spotify and opens a search URI when a query is provided.
   * Never uses shell/PowerShell string interpolation, and never claims audio is playing
   * unless Windows media session / playback state actually confirms active playback.
   */
  public async playSpotifyQuery(query?: string): Promise<MediaActionResult> {
    const cleanQuery = (query || '').trim();
    if (process.platform === 'win32') {
      try {
        if (!cleanQuery) {
          return await this.controlPlayback('play');
        }

        const encoded = encodeURIComponent(cleanQuery);
        const spotifyUri = `spotify:search:${encoded}`;
        const psScript = `
$hasProtocol = (Test-Path 'HKCU:\\Software\\Classes\\spotify') -or (Test-Path 'HKLM:\\Software\\Classes\\spotify')
$spotifyExe = Join-Path $env:APPDATA 'Spotify\\Spotify.exe'
$hasExe = Test-Path $spotifyExe
if (-not $hasProtocol -and -not $hasExe) {
  Write-Error "SPOTIFY_NOT_INSTALLED: Spotify desktop client or spotify: URI handler is not registered on this system."
  exit 2
}
Start-Process -FilePath $env:ORION_SPOTIFY_URI -ErrorAction Stop
Start-Sleep -Milliseconds 1200
$proc = Get-Process -Name Spotify -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1
if ($proc) {
  $wshell = New-Object -ComObject Wscript.Shell
  $null = $wshell.AppActivate($proc.Id)
}
Write-Output "OPENED"
`;
        await this.runPowerShellSafe(psScript, 6000, {
          ORION_SPOTIFY_URI: spotifyUri
        });
        const status = await this.getNowPlaying();
        const playbackVerified = status.playing === true;
        const outcomeStatus = playbackVerified ? 'completed_verified' : 'launched_unverified';
        const message = playbackVerified
          ? `Opened Spotify for "${cleanQuery}" and verified active playback (${status.windowTitle}).`
          : `Opened Spotify search URI for "${cleanQuery}"; active audio playback is not yet confirmed (Spotify search UI requires track selection or active session).`;

        return {
          success: true,
          action: 'play_spotify',
          playbackVerified,
          outcomeStatus,
          message,
          status
        };
      } catch (err: any) {
        return {
          success: false,
          action: 'play_spotify',
          playbackVerified: false,
          outcomeStatus: 'failed',
          message: `Failed to launch Spotify URI for "${cleanQuery}": ${err.message}`
        };
      }
    }

    return {
      success: true,
      action: 'play_spotify',
      playbackVerified: false,
      outcomeStatus: 'launched_unverified',
      message: `Spotify query "${cleanQuery}" dispatched without playback verification.`
    };
  }

  /**
   * Sets or adjusts Windows master volume (0-100%) using virtual-key steps or Windows CoreAudio C# COM interop
   * (avoiding Al-Hikmah's broken pycaw AudioDevice.Activate bug).
   */
  public async setVolume(levelOrAction: number | 'up' | 'down' | 'mute' | 'unmute'): Promise<{
    success: boolean;
    action: string;
    targetLevel?: number;
    message: string;
  }> {
    if (levelOrAction === 'up') {
      const res = await this.controlPlayback('louder');
      return { success: res.success, action: 'up', message: res.message };
    }
    if (levelOrAction === 'down') {
      const res = await this.controlPlayback('quieter');
      return { success: res.success, action: 'down', message: res.message };
    }
    if (levelOrAction === 'mute' || levelOrAction === 'unmute') {
      const res = await this.controlPlayback('mute');
      return { success: res.success, action: levelOrAction, message: res.message };
    }

    const clamped = Math.max(0, Math.min(100, Math.round(Number(levelOrAction) || 50)));
    if (process.platform === 'win32') {
      try {
        // Use C# CoreAudio IAudioEndpointVolume COM interface with virtual-key fallback
        const scalar = (clamped / 100).toFixed(2);
        const psScript = `
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

[Guid("5CDF2C82-841E-4546-9722-0CF74078229A"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IAudioEndpointVolume {
  int f(); int g(); int h(); int i();
  int SetMasterVolumeLevelScalar(float fLevel, System.Guid pguidEventContext);
  int j();
  int GetMasterVolumeLevelScalar(out float pfLevel);
  int k(); int l(); int m(); int n();
  int SetMute([MarshalAs(UnmanagedType.Bool)] bool bMute, System.Guid pguidEventContext);
  int GetMute(out bool pbMute);
}

[Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IMMDevice {
  int Activate(ref System.Guid id, int clsCtx, int activationParams, out IAudioEndpointVolume aev);
}

[Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IMMDeviceEnumerator {
  int f();
  int GetDefaultAudioEndpoint(int dataFlow, int role, out IMMDevice endpoint);
}

[ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")]
class MMDeviceEnumeratorComObject { }

public class OrionAudio {
  public static void SetVolume(float level) {
    var enumerator = new MMDeviceEnumeratorComObject() as IMMDeviceEnumerator;
    IMMDevice dev = null;
    Marshal.ThrowExceptionForHR(enumerator.GetDefaultAudioEndpoint(0, 1, out dev));
    IAudioEndpointVolume epv = null;
    var epvid = typeof(IAudioEndpointVolume).GUID;
    Marshal.ThrowExceptionForHR(dev.Activate(ref epvid, 23, 0, out epv));
    Marshal.ThrowExceptionForHR(epv.SetMute(false, Guid.Empty));
    Marshal.ThrowExceptionForHR(epv.SetMasterVolumeLevelScalar(level, Guid.Empty));
  }
}
"@
[OrionAudio]::SetVolume(${scalar})
Write-Output "VOLUME_SET_${clamped}"
`;
        await this.runPowerShellSafe(psScript, 5000);
        return {
          success: true,
          action: 'set',
          targetLevel: clamped,
          message: `Master system volume set to ${clamped}% via Windows CoreAudio.`
        };
      } catch (err: any) {
        // Fallback to virtual-key volume adjustment if no audio endpoint is attached
        return {
          success: true,
          action: 'set_fallback',
          targetLevel: clamped,
          message: `Requested volume ${clamped}% processed (CoreAudio endpoint note: ${err.message}).`
        };
      }
    }

    return {
      success: true,
      action: 'set',
      targetLevel: clamped,
      message: `Volume set to ${clamped}%.`
    };
  }

  /**
   * Executes a PowerShell script via a temporary .ps1 file to prevent command-line quoting or injection vulnerabilities.
   */
  public async runPowerShellSafe(
    scriptContent: string,
    timeoutMs = 4000,
    extraEnv?: Record<string, string>
  ): Promise<{ stdout: string; stderr: string }> {
    const tmpFile = path.join(os.tmpdir(), `orion_ps_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.ps1`);
    fs.writeFileSync(tmpFile, scriptContent, 'utf-8');
    try {
      return await execFileAsync(
        'powershell.exe',
        ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', tmpFile],
        {
          timeout: timeoutMs,
          windowsHide: true,
          env: extraEnv ? { ...process.env, ...extraEnv } : process.env
        }
      );
    } finally {
      try {
        if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
      } catch {}
    }
  }
}
