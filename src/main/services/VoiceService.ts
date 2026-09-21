import { VoiceState } from '../../shared/types';
import { eventBus } from '../../shared/events';

export interface ISpeechToTextProvider {
  id: string;
  name: string;
  isConfigured: boolean;
  startListening(): Promise<void>;
  stopListening(): Promise<void>;
  transcribe(audioBuffer: ArrayBuffer): Promise<string>;
  getStatus(): { isListening: boolean; provider: string };
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

  public async transcribe(audioBuffer: ArrayBuffer): Promise<string> {
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

  public async speak(text: string): Promise<void> {
    await this.stop();
    this.speaking = true;
    eventBus.emit('speech.started', { text });
    eventBus.logActivity('SYSTEM_EVENT', `TTS output active: "${text.slice(0, 60)}..."`);

    if (process.platform === 'win32') {
      try {
        const escaped = text.replace(/'/g, "''").replace(/"/g, '""').replace(/[\r\n]+/g, ' ');
        const psCommand = `powershell -NoProfile -Command "Add-Type -AssemblyName System.Speech; $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer; $synth.Speak('${escaped}')"`;
        const { exec } = require('child_process');
        await new Promise<void>((resolve) => {
          this.currentProcess = exec(psCommand, { timeout: 15000 }, () => {
            this.currentProcess = null;
            resolve();
          });
        });
      } catch (err) {
        // Speech synthesis error handled gracefully
      } finally {
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
