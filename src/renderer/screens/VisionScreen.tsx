import React, { useState } from 'react';
import { VisionResult } from '../../shared/types';
import { Eye, Camera, Monitor, ShieldAlert, Sparkles } from 'lucide-react';

interface VisionScreenProps {
  cameraActive: boolean;
}

export const VisionScreen: React.FC<VisionScreenProps> = ({ cameraActive }) => {
  const [visionResult, setVisionResult] = useState<VisionResult | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const handleCapture = async (source: 'CAMERA' | 'SCREENSHOT') => {
    if (source === 'CAMERA' && !cameraActive) {
      setWarningMessage("SECURITY NOTICE: Camera is currently toggled OFF in top privacy header. Enable camera toggle before capture.");
      setTimeout(() => setWarningMessage(null), 5000);
      return;
    }
    setWarningMessage(null);

    const api = window.orionApi || window.arvisApi;
    if (api) {
      setAnalyzing(true);
      const res = await api.captureVision(source);
      setVisionResult(res);
      setAnalyzing(false);
    }
  };

  return (
    <div className="h-full grid grid-cols-2 gap-4 p-4 bg-arvis-card border border-arvis-border overflow-hidden">
      
      {/* Left Frame Preview Area */}
      <div className="bg-black/50 border border-arvis-border p-4 flex flex-col justify-between relative">
        <div className="flex justify-between items-center border-b border-arvis-border pb-2 text-xs">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-arvis-cyan" />
            <span className="font-bold text-arvis-text">OPTICAL SENSOR & DISPLAY FEED</span>
          </div>
          <span className="text-[10px] text-arvis-dim">STATUS: READY</span>
        </div>

        {warningMessage && (
          <div className="mt-2 p-2 bg-amber-500/20 border border-amber-500 text-amber-300 font-mono text-[10px] flex items-center space-x-1.5 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>{warningMessage}</span>
          </div>
        )}

        {/* Optical Sensor HUD Frame */}
        <div className="relative flex-1 my-4 border border-arvis-cyan/30 bg-black flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)]" />
          <div className="absolute top-2 left-2 text-[9px] text-arvis-cyan font-mono">FRAME_BUFFER: 1920x1080</div>
          <div className="absolute bottom-2 right-2 text-[9px] text-arvis-dim font-mono">SENSOR_DEV_MOCK: ONLINE</div>

          {analyzing ? (
            <div className="flex flex-col items-center space-y-2 text-arvis-cyan animate-pulse">
              <Sparkles className="w-8 h-8 animate-spin" />
              <span className="text-xs font-bold">ANALYZING OPTICAL INPUT...</span>
            </div>
          ) : visionResult ? (
            <div className="p-4 text-center space-y-2">
              <div className="inline-block px-3 py-1 bg-arvis-cyan/20 border border-arvis-cyan text-arvis-cyan text-xs font-bold">
                ANALYSIS COMPLETE ({visionResult.analysis.source})
              </div>
              <p className="text-xs text-arvis-text font-mono max-w-sm">{visionResult.analysis.sceneSummary}</p>
            </div>
          ) : (
            <div className="text-center text-xs text-arvis-dim space-y-2">
              <Eye className="w-8 h-8 mx-auto text-arvis-dim opacity-50" />
              <div>TRIGGER OPTICAL CAPTURE FROM CONTROLS BELOW</div>
            </div>
          )}
        </div>

        {/* Capture Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleCapture('CAMERA')}
            className={`py-2.5 border text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all ${
              cameraActive
                ? 'border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan hover:bg-arvis-cyan/30'
                : 'border-arvis-border bg-black/40 text-arvis-dim opacity-50 cursor-not-allowed'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>ANALYZE CAMERA FRAME</span>
          </button>

          <button
            onClick={() => handleCapture('SCREENSHOT')}
            className="py-2.5 border border-arvis-accent bg-arvis-accent/20 text-arvis-accent hover:bg-arvis-accent/30 text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all"
          >
            <Monitor className="w-4 h-4" />
            <span>ANALYZE SCREENSHOT</span>
          </button>
        </div>
      </div>

      {/* Right Analysis Breakdown */}
      <div className="bg-black/50 border border-arvis-border p-4 flex flex-col justify-between overflow-y-auto space-y-4">
        <div className="flex justify-between items-center border-b border-arvis-border pb-2 text-xs">
          <span className="font-bold text-arvis-text">VISION INTELLIGENCE RESULT</span>
          <span className="text-[10px] text-arvis-dim">NON-MISLEADING DEV MOCK</span>
        </div>

        {visionResult ? (
          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="text-arvis-dim text-[10px] uppercase mb-1">DETECTED OBJECTS</div>
              <div className="space-y-1">
                {visionResult.analysis.detectedObjects.map((obj, i) => (
                  <div key={i} className="p-2 bg-black border border-arvis-border flex justify-between">
                    <span className="text-arvis-cyan font-bold">{obj.label}</span>
                    <span className="text-arvis-dim">CONF: {(obj.confidence * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {visionResult.analysis.extractedText && (
              <div>
                <div className="text-arvis-dim text-[10px] uppercase mb-1">EXTRACTED OCR TEXT</div>
                <pre className="p-2 bg-black border border-arvis-border text-arvis-text text-[11px] whitespace-pre-wrap">
                  {visionResult.analysis.extractedText}
                </pre>
              </div>
            )}

            <div>
              <div className="text-arvis-dim text-[10px] uppercase mb-1">SCENE SUMMARY</div>
              <div className="p-2 bg-black border border-arvis-border text-arvis-text">
                {visionResult.analysis.sceneSummary}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-arvis-dim">
            NO VISION RESULT CAPTURED YET
          </div>
        )}

        <div className="p-2 bg-black/60 border border-arvis-border text-[10px] text-arvis-dim flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-arvis-amber shrink-0" />
          <span>PRIVACY GUARANTEE: Camera/Screen analysis only runs on explicit user command.</span>
        </div>
      </div>

    </div>
  );
};
