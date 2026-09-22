import React from 'react';
import { AssistantState, OrionMode, PrivacyState } from '../../shared/types';
import { Mic, Camera, Shield, Radio } from 'lucide-react';

interface HeaderNavProps {
  assistantState: AssistantState;
  currentMode: OrionMode;
  privacy: PrivacyState;
  onModeSelect: (mode: OrionMode) => void;
  onToggleMic: () => void;
  onToggleCamera: () => void;
}

const MODES: OrionMode[] = [
  'COMMAND',
  'DEMO',
  'SYSTEM',
  'VISION',
  'COMPUTER',
  'NETWORK',
  'WORLD',
  'TASK',
  'MEMORY',
  'TITAN'
];


export const HeaderNav: React.FC<HeaderNavProps> = ({
  assistantState,
  currentMode,
  privacy,
  onModeSelect,
  onToggleMic,
  onToggleCamera
}) => {
  const getStateBadge = () => {
    switch (assistantState) {
      case 'LISTENING':
        return <span className="bg-arvis-amber/20 text-arvis-amber border border-arvis-amber/40 px-2 py-0.5 animate-pulse">● LISTENING</span>;
      case 'THINKING':
        return <span className="bg-arvis-cyan/20 text-arvis-cyan border border-arvis-cyan/40 px-2 py-0.5 animate-pulse">◈ THINKING</span>;
      case 'EXECUTING':
        return <span className="bg-arvis-accent/20 text-arvis-accent border border-arvis-accent/40 px-2 py-0.5 animate-pulse">⚡ EXECUTING</span>;
      case 'VISION':
        return <span className="bg-arvis-cyan/20 text-arvis-cyan border border-arvis-cyan/40 px-2 py-0.5 animate-pulse">◉ VISION ACTIVE</span>;
      case 'SPEAKING':
        return <span className="bg-green-500/20 text-green-400 border border-green-500/40 px-2 py-0.5 animate-pulse">🔊 SPEAKING</span>;
      case 'ERROR':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5">⚠️ SYSTEM ERROR</span>;
      default:
        return <span className="bg-white/5 text-arvis-dim border border-arvis-border px-2 py-0.5">STANDBY</span>;
    }
  };

  return (
    <div className="w-full bg-arvis-card border-b border-arvis-border p-3 flex flex-col space-y-3">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        
        {/* ORION Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border border-arvis-accent flex items-center justify-center relative bg-arvis-accent/10">
            <Radio className="w-4 h-4 text-arvis-accent animate-pulse" />
            <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-arvis-accent" />
            <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-arvis-accent" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-arvis-text tracking-widest font-sans">ORION</span>
              <span className="text-[10px] text-arvis-dim tracking-widest">v0.1.0 // FOUNDATION</span>
            </div>
            <div className="text-[9px] text-arvis-dim tracking-wider uppercase font-semibold text-arvis-cyan">AI COMMAND SYSTEM</div>
          </div>
        </div>

        {/* Center: Assistant State & Connection */}
        <div className="flex items-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-arvis-dim text-[10px]">STATE:</span>
            <span className="font-mono text-[11px]">{getStateBadge()}</span>
          </div>

          <div className="flex items-center space-x-2 border-l border-arvis-border pl-4 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span className="text-arvis-text font-mono">LOCAL IPC: ONLINE</span>
          </div>
        </div>

        {/* Right: Privacy Hardware Controls */}
        <div className="flex items-center space-x-3 text-xs">
          
          {/* Microphone Control */}
          <button
            onClick={onToggleMic}
            className={`flex items-center space-x-1.5 px-3 py-1 border transition-all text-[11px] font-mono ${
              privacy.micActive
                ? 'border-arvis-amber bg-arvis-amber/20 text-arvis-amber shadow-[0_0_10px_rgba(255,183,3,0.3)]'
                : 'border-arvis-border bg-black/40 text-arvis-dim hover:border-arvis-border-bright'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{privacy.micActive ? 'MIC ACTIVE' : 'MIC OFF'}</span>
          </button>

          {/* Camera Control */}
          <button
            onClick={onToggleCamera}
            className={`flex items-center space-x-1.5 px-3 py-1 border transition-all text-[11px] font-mono ${
              privacy.cameraActive
                ? 'border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                : 'border-arvis-border bg-black/40 text-arvis-dim hover:border-arvis-border-bright'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{privacy.cameraActive ? 'CAM ACTIVE' : 'CAM OFF'}</span>
          </button>

          {/* User Confirmation Security Shield */}
          <div className="flex items-center space-x-1 px-2 py-1 bg-black/40 border border-arvis-border text-arvis-dim text-[10px]">
            <Shield className="w-3 h-3 text-green-400" />
            <span>SAFETY: ENFORCED</span>
          </div>

        </div>

      </div>

      {/* Screen Mode Navigation Tabs */}
      <div className="flex space-x-1 border-t border-arvis-border/60 pt-2 overflow-x-auto">
        {MODES.map((mode) => {
          const isActive = currentMode === mode;
          const isDemo = mode === 'DEMO';
          return (
            <button
              key={mode}
              onClick={() => onModeSelect(mode)}
              className={`px-4 py-1.5 text-[11px] font-mono font-semibold tracking-wider transition-all border ${
                isActive
                  ? isDemo
                    ? 'border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'border-arvis-accent bg-arvis-accent/20 text-arvis-text shadow-[0_0_12px_rgba(255,42,95,0.25)]'
                  : isDemo
                  ? 'border-arvis-cyan/40 bg-arvis-cyan/5 text-arvis-cyan hover:bg-arvis-cyan/15 hover:border-arvis-cyan'
                  : 'border-arvis-border/40 bg-black/30 text-arvis-dim hover:text-arvis-text hover:border-arvis-border'
              }`}
            >
              [{mode}]
            </button>
          );
        })}
      </div>

    </div>
  );
};
