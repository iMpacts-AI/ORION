import React from 'react';
import { AssistantState, OrionMode, PrivacyState } from '../../shared/types';
import { OrionLogo } from '../components/OrionLogo';
import { Mic, Camera, Shield, Activity, Sparkles, PlayCircle, Layers, Cpu, Eye, Monitor, Network, Globe, Database, Terminal } from 'lucide-react';

interface HeaderNavProps {
  assistantState: AssistantState;
  currentMode: OrionMode;
  privacy: PrivacyState;
  onModeSelect: (mode: OrionMode) => void;
  onToggleMic: () => void;
  onToggleCamera: () => void;
}

const MODE_CONFIG: { mode: OrionMode; label: string; icon: any; isSpecial?: boolean }[] = [
  { mode: 'COMMAND', label: 'COMMAND', icon: Terminal },
  { mode: 'DEMO', label: 'DEMO', icon: PlayCircle, isSpecial: true },
  { mode: 'SYSTEM', label: 'SYSTEM', icon: Cpu },
  { mode: 'VISION', label: 'VISION', icon: Eye },
  { mode: 'COMPUTER', label: 'COMPUTER', icon: Monitor },
  { mode: 'NETWORK', label: 'NETWORK', icon: Network },
  { mode: 'WORLD', label: 'WORLD', icon: Globe },
  { mode: 'TASK', label: 'SUPERVISOR', icon: Layers },
  { mode: 'MEMORY', label: 'MEMORY', icon: Database },
  { mode: 'TITAN', label: 'TITAN', icon: Sparkles }
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
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/40 text-[11px] font-mono flex items-center space-x-1.5 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>LISTENING</span>
          </span>
        );
      case 'THINKING':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/40 text-[11px] font-mono flex items-center space-x-1.5 shadow-[0_0_12px_rgba(59,130,246,0.35)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>THINKING</span>
          </span>
        );
      case 'EXECUTING':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-400/40 text-[11px] font-mono flex items-center space-x-1.5 shadow-[0_0_12px_rgba(139,92,246,0.35)]">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
            <span>EXECUTING</span>
          </span>
        );
      case 'VISION':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 text-[11px] font-mono flex items-center space-x-1.5 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
            <span>VISION ACTIVE</span>
          </span>
        );
      case 'SPEAKING':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 text-[11px] font-mono flex items-center space-x-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SPEAKING</span>
          </span>
        );
      case 'ERROR':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-400/50 text-[11px] font-mono">
            ⚠️ SYSTEM ERROR
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-slate-300 border border-blue-500/25 text-[11px] font-mono flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400/80" />
            <span>STANDBY</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-[#0B0F1A]/90 border-b border-blue-500/20 px-4 py-2.5 flex flex-col space-y-2.5 backdrop-blur-md">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        
        {/* Official ORION Brand Identity */}
        <div className="flex items-center space-x-3.5">
          <OrionLogo size={36} animated={true} glow={true} />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-white tracking-[0.22em] font-sans drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
                ORION
              </span>
              <span className="text-[10px] text-blue-400/80 tracking-widest font-mono border-l border-blue-500/30 pl-2">
                v1.0.0
              </span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono tracking-wider uppercase flex items-center space-x-1.5">
              <span className="text-cyan-400 font-semibold">YOUR AI. YOUR COMPUTER. YOUR WORLD.</span>
            </div>
          </div>
        </div>

        {/* Center: Online Status Pill from Logo Kit HUD Concept */}
        <div className="flex items-center space-x-5 text-xs">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-mono text-[11px] font-bold tracking-widest text-emerald-300">ORION ONLINE</span>
          </div>

          <div className="flex items-center space-x-2 border-l border-blue-500/20 pl-4">
            <span className="text-slate-400 text-[10px] font-mono">STATE:</span>
            {getStateBadge()}
          </div>
        </div>

        {/* Right: Privacy & Security Controls */}
        <div className="flex items-center space-x-2.5 text-xs">
          
          {/* Microphone Control */}
          <button
            onClick={onToggleMic}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded border transition-all text-[11px] font-mono ${
              privacy.micActive
                ? 'border-amber-400/80 bg-amber-500/20 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                : 'border-blue-500/20 bg-blue-950/30 text-slate-400 hover:border-blue-400/40 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{privacy.micActive ? 'MIC ON' : 'MIC OFF'}</span>
          </button>

          {/* Camera Control */}
          <button
            onClick={onToggleCamera}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded border transition-all text-[11px] font-mono ${
              privacy.cameraActive
                ? 'border-cyan-400/80 bg-cyan-500/20 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.35)]'
                : 'border-blue-500/20 bg-blue-950/30 text-slate-400 hover:border-blue-400/40 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{privacy.cameraActive ? 'CAM ON' : 'CAM OFF'}</span>
          </button>

          {/* User Confirmation Security Shield */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-blue-950/40 border border-blue-500/30 text-slate-300 text-[10px] font-mono">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tracking-wider">SAFETY: ENFORCED</span>
          </div>

        </div>

      </div>

      {/* Screen Mode Navigation Tabs */}
      <div className="flex space-x-1.5 border-t border-blue-500/20 pt-2 overflow-x-auto">
        {MODE_CONFIG.map(({ mode, label, icon: Icon, isSpecial }) => {
          const isActive = currentMode === mode;
          return (
            <button
              key={mode}
              onClick={() => onModeSelect(mode)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-[11px] font-mono font-semibold tracking-wider transition-all border ${
                isActive
                  ? isSpecial
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                    : 'border-blue-400 bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-violet-600/30 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                  : isSpecial
                  ? 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/10'
                  : 'border-blue-500/15 bg-blue-950/20 text-slate-400 hover:text-white hover:border-blue-400/40 hover:bg-blue-900/20'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
