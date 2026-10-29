import { VoiceState } from '../../shared/types';
import { eventBus } from '../../shared/events';
import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export interface ISpeechToTextProvider {
  id: string;
  name: string;
  isConfigured: boolean;
  startListening(): Promise<void>;
  stopListening(): Promise<void>;
  transcribe(audioBuffer: ArrayBuffer): Promise<string>;
  getStatus(): { isListening: boolean; provider: string };
}

/**
 * Windows SAPI Native Speech Recognition Provider (`System.Speech.Recognition`)
 * Provides zero-dependency offline voice recognition on Windows without requiring broken pywhispercpp wheels.
 */
export class WindowsNativeSTTProvider implements ISpeechToTextProvider {
  public id = 'windows-sapi-stt';
  public name = 'ORION Windows SAPI Speech Recognition Engine';
  public isConfigured = process.platform === 'win32';
  private listening = false;
  private lastTranscript = '';

  public async startListening(): Promise<void> {
    this.listening = true;
  }

  public async stopListening(): Promise<void> {
    this.listening = false;
  }

  public async listenOnce(timeoutSeconds = 5): Promise<string> {
    if (process.platform !== 'win32') {
      return '';
    }
    const tmpScript = path.join(os.tmpdir(), `orion_stt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.ps1`);
    const psContent = `
try {
  Add-Type -AssemblyName System.Speech
  $rec = New-Object System.Speech.Recognition.SpeechRecognitionEngine
  $rec.LoadGrammar((New-Object System.Speech.Recognition.DictationGrammar))
  $rec.SetInputToDefaultAudioDevice()
  $res = $rec.Recognize([TimeSpan]::FromSeconds(${Math.max(1, Math.min(15, timeoutSeconds))}))
  if ($res -and $res.Text) {
    Write-Output $res.Text
  }
} catch {
  # Microphone unavailable or no speech detected
}
`;
    fs.writeFileSync(tmpScript, psContent, 'utf-8');
    try {
      const transcript = await new Promise<string>((resolve) => {
        execFile(
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', tmpScript],
          { timeout: (timeoutSeconds + 3) * 1000 },
          (_err, stdout) => {
            resolve((stdout || '').trim());
          }
        );
      });
      this.lastTranscript = transcript;
      return transcript;
    } finally {
      try {
        if (fs.existsSync(tmpScript)) fs.unlinkSync(tmpScript);
      } catch {}
    }
  }

  public async transcribe(_audioBuffer: ArrayBuffer): Promise<string> {
    if (!this.isConfigured) {
      return 'STT NOT CONFIGURED';
    }
    return this.lastTranscript || 'WINDOWS_SAPI_READY';
  }

  public getStatus(): { isListening: boolean; provider: string } {
    return { isListening: this.listening, provider: this.name };
  }
}

export class DefaultSTTProvider implements ISpeechToTextProvider {
  public id = 'unconfigured-stt';
  public name = 'ORION STT Provider Interface';
  public isConfigured = false;
  private listening = false;

  public async startListening(): Promise<void> {
    this.listening = true;
  }

  public async stopListening(): Promise<void> {
    this.listening = false;
  }

  public async transcribe(_audioBuffer: ArrayBuffer): Promise<string> {
    return 'STT NOT CONFIGURED';
  }

  public getStatus(): { isListening: boolean; provider: string } {
    return { isListening: this.listening, provider: this.name };
  }
}

export interface ITextToSpeechProvider {
  id: string;
  name: string;
  isConfigured: boolean;
  speak(text: string): Promise<void>;
  stop(): Promise<void>;
  isSpeaking(): boolean;
}

export class SystemTTSProvider implements ITextToSpeechProvider {
  public id = 'system-native-tts';
  public name = 'ORION System Speech Engine (Windows SAPI Native)';
  public isConfigured = true;
  private speaking = false;
  private currentProcess: any = null;
  private cacheDir: string;

  constructor() {
    this.cacheDir = path.join(os.tmpdir(), 'orion_tts_cache');
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }
    } catch {}
  }

  public getCachedAudioPath(text: string): string {
    const hash = crypto.createHash('md5').update(text.trim()).digest('hex').slice(0, 16);
    return path.join(this.cacheDir, `tts_${hash}.wav`);
  }

  /**
   * Hardened TTS synthesis:
   * Never interpolates untrusted text inside double-quoted `powershell -Command "..."` strings.
   * Instead passes base64-encoded UTF-8 text via environment variable `ORION_TTS_B64` to a temporary `.ps1` file,
   * and caches synthesized `.wav` files by MD5 hash in `os.tmpdir()/orion_tts_cache` (inspired by Al-Hikmah's MD5 cache).
   */
  public async speak(text: string): Promise<void> {
    await this.stop();
    const cleanText = (text || '').trim();
    if (!cleanText) return;

    this.speaking = true;
    eventBus.emit('speech.started', { text: cleanText });
    eventBus.logActivity('SYSTEM_EVENT', `TTS output active: "${cleanText.slice(0, 60)}..."`);

    if (process.platform === 'win32') {
      const tmpScript = path.join(os.tmpdir(), `orion_tts_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.ps1`);
      const wavPath = this.getCachedAudioPath(cleanText);
      const b64Text = Buffer.from(cleanText, 'utf-8').toString('base64');
      const b64Wav = Buffer.from(wavPath, 'utf-8').toString('base64');

      const psContent = `
$ErrorActionPreference = 'SilentlyContinue'
Add-Type -AssemblyName System.Speech
$textBytes = [System.Convert]::FromBase64String($env:ORION_TTS_B64)
$plainText = [System.Text.Encoding]::UTF8.GetString($textBytes)
$wavBytes = [System.Convert]::FromBase64String($env:ORION_TTS_WAV_B64)
$wavPath = [System.Text.Encoding]::UTF8.GetString($wavBytes)

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
if (-not (Test-Path $wavPath)) {
  try {
    $synth.SetOutputToWaveFile($wavPath)
    $synth.Speak($plainText)
    $synth.SetOutputToNull()
  } catch {}
}
$synth.SetOutputToDefaultAudioDevice()
$synth.Speak($plainText)
`;

      try {
        fs.writeFileSync(tmpScript, psContent, 'utf-8');
        await new Promise<void>((resolve) => {
          this.currentProcess = execFile(
            'powershell.exe',
            ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', tmpScript],
            {
              timeout: 15000,
              env: {
                ...process.env,
                ORION_TTS_B64: b64Text,
                ORION_TTS_WAV_B64: b64Wav
              }
            },
            () => {
              this.currentProcess = null;
              resolve();
            }
          );
        });
      } catch {
        // Speech synthesis error handled gracefully
      } finally {
        try {
          if (fs.existsSync(tmpScript)) fs.unlinkSync(tmpScript);
        } catch {}
        this.speaking = false;
        eventBus.emit('speech.stopped', { timestamp: Date.now() });
      }
    } else {
      this.speaking = false;
      eventBus.emit('speech.stopped', { timestamp: Date.now() });
    }
  }

  public async stop(): Promise<void> {
    if (this.currentProcess) {
      try {
        this.currentProcess.kill();
      } catch {}
      this.currentProcess = null;
    }
    if (this.speaking) {
      this.speaking = false;
      eventBus.emit('speech.stopped', { timestamp: Date.now() });
      eventBus.logActivity('SYSTEM_EVENT', 'TTS speech interrupted');
    }
  }

  public isSpeaking(): boolean {
    return this.speaking;
  }
}

export interface IVoiceService {
  isConfigured: boolean;
  getVoiceState(): VoiceState;
  startListening(): Promise<void>;
  stopListening(): Promise<void>;
  speak(text: string): Promise<void>;
  stopSpeaking(): Promise<void>;
}

export class VoiceService implements IVoiceService {
  public isConfigured: boolean;
  private sttProvider: ISpeechToTextProvider;
  private ttsProvider: ITextToSpeechProvider;

  private state: VoiceState = {
    isListening: false,
    isSpeaking: false,
    wakeWordDetected: false,
    audioLevel: 0,
    transcriptBuffer: ''
  };

  constructor(sttProvider?: ISpeechToTextProvider, ttsProvider?: ITextToSpeechProvider) {
    this.sttProvider = sttProvider || new DefaultSTTProvider();
    this.ttsProvider = ttsProvider || new SystemTTSProvider();
    this.isConfigured = this.sttProvider.isConfigured;
  }

  public setSTTProvider(provider: ISpeechToTextProvider): void {
    this.sttProvider = provider;
    this.isConfigured = provider.isConfigured;
  }

  public setTTSProvider(provider: ITextToSpeechProvider): void {
    this.ttsProvider = provider;
  }

  public getSTTProvider(): ISpeechToTextProvider {
    return this.sttProvider;
  }

  public getTTSProvider(): ITextToSpeechProvider {
    return this.ttsProvider;
  }

  public getVoiceState(): VoiceState {
    return {
      ...this.state,
      isSpeaking: this.ttsProvider.isSpeaking()
    };
  }

  public async startListening(): Promise<void> {
    this.state.isListening = true;
    this.state.audioLevel = 50;
    eventBus.emit('voice.started', { timestamp: Date.now() });
    eventBus.logActivity('VOICE_INPUT', 'Microphone active — Listening for voice input');

    if (!this.sttProvider.isConfigured) {
      eventBus.logActivity('SYSTEM_EVENT', 'STT NOT CONFIGURED: Using text input or external speech model.');
    }
    await this.sttProvider.startListening();
  }

  public async stopListening(): Promise<void> {
    this.state.isListening = false;
    this.state.audioLevel = 0;
    await this.sttProvider.stopListening();
    eventBus.emit('voice.stopped', { timestamp: Date.now() });
    eventBus.logActivity('SYSTEM_EVENT', 'Microphone deactivated');
  }

  public async speak(text: string): Promise<void> {
    this.state.isSpeaking = true;
    try {
      await this.ttsProvider.speak(text);
    } finally {
      this.state.isSpeaking = false;
    }
  }

  public async stopSpeaking(): Promise<void> {
    await this.ttsProvider.stop();
    this.state.isSpeaking = false;
  }
}
