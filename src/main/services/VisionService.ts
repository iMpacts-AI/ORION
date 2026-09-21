import { VisionResult } from '../../shared/types';
import { desktopCapturer, NativeImage } from 'electron';
import { eventBus } from '../../shared/events';

export interface IVisionProvider {
  id: string;
  name: string;
  isConfigured: boolean;
  analyzeImage(imageDataUrl: string): Promise<VisionResult>;
  analyzeScreen(screenshotDataUrl: string): Promise<VisionResult>;
  extractText(imageDataUrl: string): Promise<string>;
}

export class DefaultVisionProvider implements IVisionProvider {
  public id = 'unconfigured-vision';
  public name = 'ORION Vision Provider Interface';
  public isConfigured = false;

  public async analyzeImage(imageDataUrl: string): Promise<VisionResult> {
    return {
      timestamp: Date.now(),
      isMock: false,
      analysis: {
        timestamp: Date.now(),
        source: 'CAMERA',
        detectedObjects: [],
        sceneSummary: 'VISION NOT CONFIGURED: No external vision model or local OCR engine configured.'
      }
    };
  }

  public async analyzeScreen(screenshotDataUrl: string): Promise<VisionResult> {
    return {
      timestamp: Date.now(),
      isMock: false,
      analysis: {
        timestamp: Date.now(),
        source: 'SCREENSHOT',
        detectedObjects: [],
        extractedText: 'VISION NOT CONFIGURED',
        sceneSummary: 'VISION NOT CONFIGURED: Screen analysis engine not connected to external provider.'
      }
    };
  }

  public async extractText(imageDataUrl: string): Promise<string> {
    return 'VISION NOT CONFIGURED';
  }
}

export class CloudVisionAdapter implements IVisionProvider {
  public id = 'cloud-vision-adapter';
  public name = 'ORION Cloud Multimodal Vision Adapter';

  constructor(private router: import('./AIProvider').IAIProvider) {}

  public get isConfigured(): boolean {
    const status = this.router.getStatus();
    return status.isConfigured && status.capabilities.supportsVision;
  }

  public async analyzeImage(imageDataUrl: string): Promise<VisionResult> {
    return this.analyzeScreen(imageDataUrl);
  }

  public async analyzeScreen(screenshotDataUrl: string): Promise<VisionResult> {
    if (!this.router.analyzeImage) {
      throw new Error('Active AI Provider Router does not support analyzeImage().');
    }

    const summary = await this.router.analyzeImage(
      'Analyze what is visible on this captured screen frame in technical detail.',
      screenshotDataUrl
    );

    return {
      timestamp: Date.now(),
      isMock: false,
      analysis: {
        timestamp: Date.now(),
        source: 'SCREENSHOT',
        detectedObjects: [],
        sceneSummary: summary
      }
    };
  }

  public async extractText(imageDataUrl: string): Promise<string> {
    if (!this.router.analyzeImage) {
      return 'VISION NOT CONFIGURED';
    }
    return await this.router.analyzeImage(
      'Extract all readable text from this image accurately. Return only the extracted text.',
      imageDataUrl
    );
  }
}

export interface IVisionService {
  isConfigured: boolean;
  captureScreen(): Promise<string | null>;
  captureAndAnalyze(source: 'CAMERA' | 'SCREENSHOT'): Promise<VisionResult>;
}

export class VisionService implements IVisionService {
  public isConfigured = false;
  private visionProvider: IVisionProvider;

  constructor(visionProvider?: IVisionProvider) {
    this.visionProvider = visionProvider || new DefaultVisionProvider();
    this.isConfigured = this.visionProvider.isConfigured;
  }

  public setVisionProvider(provider: IVisionProvider): void {
    this.visionProvider = provider;
    this.isConfigured = provider.isConfigured;
  }

  public async captureScreen(): Promise<string | null> {
    eventBus.emit('vision.capture.started', { source: 'SCREENSHOT' });
    try {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 1920, height: 1080 }
      });

      const primarySource = sources[0];
      if (!primarySource) {
        throw new Error('No desktop screen sources available for capture.');
      }

      const dataUrl = primarySource.thumbnail.toDataURL();
      eventBus.emit('vision.captured', { timestamp: Date.now(), imageBufferLength: dataUrl.length });
      eventBus.logActivity('SYSTEM_EVENT', 'Primary screen captured successfully');
      return dataUrl;
    } catch (err: any) {
      eventBus.emit('perception.error', { module: 'VISION', error: err.message || 'Screen capture failed' });
      eventBus.logActivity('ERROR_EVENT', `Screen capture error: ${err.message}`);
      return null;
    }
  }

  public async captureAndAnalyze(source: 'CAMERA' | 'SCREENSHOT'): Promise<VisionResult> {
    eventBus.emit('vision.analysis.started', { source });
    eventBus.logActivity('PROCESSING', `Initiating ${source} optical analysis`);

    if (source === 'SCREENSHOT') {
      const screenshotDataUrl = await this.captureScreen();
      if (!screenshotDataUrl) {
        const result: VisionResult = {
          timestamp: Date.now(),
          isMock: false,
          analysis: {
            timestamp: Date.now(),
            source: 'SCREENSHOT',
            detectedObjects: [],
            sceneSummary: 'ERROR: Desktop screen capture failed.'
          }
        };
        eventBus.emit('vision.analysis.completed', { result });
        return result;
      }

      const result = await this.visionProvider.analyzeScreen(screenshotDataUrl);
      eventBus.emit('vision.analysis.completed', { result });
      eventBus.logActivity('TASK_COMPLETE', `Screen analysis complete: ${result.analysis.sceneSummary}`);
      return result;
    } else {
      // Camera capture
      const result: VisionResult = {
        timestamp: Date.now(),
        isMock: false,
        analysis: {
          timestamp: Date.now(),
          source: 'CAMERA',
          detectedObjects: [],
          sceneSummary: this.visionProvider.isConfigured
            ? 'Camera frame captured.'
            : 'VISION NOT CONFIGURED: Camera optical provider unavailable.'
        }
      };
      eventBus.emit('vision.analysis.completed', { result });
      eventBus.logActivity('TASK_COMPLETE', `Camera analysis: ${result.analysis.sceneSummary}`);
      return result;
    }
  }
}
