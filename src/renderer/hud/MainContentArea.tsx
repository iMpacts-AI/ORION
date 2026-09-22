import React from 'react';
import { OrionMode, AssistantState, SystemSnapshot, ActivityEvent, TaskState } from '../../shared/types';
import { WorldGlobe } from '../hud/WorldGlobe';
import { SystemStatusPanel } from '../hud/SystemStatusPanel';
import { ActivityLogPanel } from '../hud/ActivityLogPanel';
import { TaskCommandPanel } from '../hud/TaskCommandPanel';
import { MemoryScreen } from '../screens/MemoryScreen';
import { ComputerScreen } from '../screens/ComputerScreen';
import { VisionScreen } from '../screens/VisionScreen';
import { ProviderNetworkScreen } from '../screens/ProviderNetworkScreen';
import { DemoScreen } from '../screens/DemoScreen';
import { TitanHUDPanel } from './TitanHUDPanel';
import { Globe, Cpu, Wifi, Layers, Zap } from 'lucide-react';


interface MainContentAreaProps {
  currentMode: OrionMode;
  assistantState: AssistantState;
  snapshot: SystemSnapshot | null;
  activities: ActivityEvent[];
  currentTask: TaskState | null;
  cameraActive: boolean;
}

export const MainContentArea: React.FC<MainContentAreaProps> = ({
  currentMode,
  assistantState,
  snapshot,
  activities,
  currentTask,
  cameraActive
}) => {
  // If in default COMMAND mode, render the futuristic 3D HUD Command Center
  if (currentMode === 'COMMAND') {
    return (
      <div className="h-full grid grid-cols-12 gap-4 p-4 overflow-hidden">
        
        {/* Left Modular Panel: System Telemetry */}
        <div className="col-span-3 h-full overflow-hidden">
          <SystemStatusPanel snapshot={snapshot} />
        </div>

        {/* Center Modular Area: Rotating 3D World Visualization */}
        <div className="col-span-6 h-full flex flex-col justify-between space-y-4">
          <div className="flex-1 bg-[#0B0F1A]/85 border border-blue-500/25 rounded-xl shadow-2xl relative overflow-hidden flex items-center justify-center orion-glass">
            
            {/* Corner HUD Decorators */}
            <div className="absolute top-3 left-3 text-[9px] text-slate-400 font-mono tracking-widest flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
              <span>ORION // CORE_VISUALIZER</span>
            </div>
            <div className="absolute top-3 right-3 text-[9px] text-cyan-300 font-mono tracking-widest px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
              STATE: [{assistantState}]
            </div>

            <WorldGlobe assistantState={assistantState} />
          </div>

          {/* Bottom Task / Command Panel */}
          <div className="h-24">
            <TaskCommandPanel currentTask={currentTask} />
          </div>
        </div>

        {/* Right Modular Panel: Activity Feed Stream */}
        <div className="col-span-3 h-full overflow-hidden">
          <ActivityLogPanel activities={activities} />
        </div>

      </div>
    );
  }

  // Render Dedicated Screen Modes
  switch (currentMode) {
    case 'DEMO':
      return <DemoScreen />;
    case 'MEMORY':
      return <MemoryScreen />;
    case 'COMPUTER':
      return <ComputerScreen />;
    case 'VISION':
      return <VisionScreen cameraActive={cameraActive} />;
    case 'NETWORK':
      return <ProviderNetworkScreen />;
    case 'SYSTEM':
      return (
        <div className="h-full p-6 bg-[#0B0F1A]/85 border border-blue-500/20 rounded-xl overflow-y-auto space-y-6">
          <h2 className="text-lg font-bold text-white tracking-widest mb-4 flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>FULL SYSTEM TELEMETRY DIAGNOSTICS</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <SystemStatusPanel snapshot={snapshot} />
            <div className="bg-[#070A13]/80 border border-blue-500/30 rounded-xl p-5 space-y-3 font-mono text-xs text-slate-300 shadow-xl">
              <div className="text-cyan-400 font-bold border-b border-blue-500/30 pb-2 text-sm tracking-wider">HARDWARE SPECIFICATIONS</div>
              <div className="flex justify-between py-1 border-b border-white/5"><span className="text-slate-400">PROCESSOR:</span> <span className="font-semibold text-white">{snapshot?.cpu.model || 'N/A'}</span></div>
              <div className="flex justify-between py-1 border-b border-white/5"><span className="text-slate-400">CORES DETECTED:</span> <span className="font-semibold text-cyan-300">{snapshot?.cpu.cores.length || 0} CORES</span></div>
              <div className="flex justify-between py-1 border-b border-white/5"><span className="text-slate-400">GRAPHICS:</span> <span className="font-semibold text-indigo-300">{snapshot?.gpu.name || 'N/A'}</span></div>
              <div className="flex justify-between py-1 border-b border-white/5"><span className="text-slate-400">MEMORY TOTAL:</span> <span className="font-semibold text-white">{((snapshot?.memory.totalBytes || 0) / (1024 * 1024 * 1024)).toFixed(2)} GB</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-400">TELEMETRY MODE:</span> <span className="font-semibold text-emerald-400">{snapshot?.isMock ? 'DEVELOPMENT MOCK PROVIDER' : 'NATIVE HARDWARE'}</span></div>
            </div>
          </div>
        </div>
      );
    case 'WORLD':
      return (
        <div className="h-full p-6 bg-[#0B0F1A]/85 border border-blue-500/20 rounded-xl flex flex-col justify-between">
          <h2 className="text-lg font-bold text-white tracking-widest flex items-center space-x-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>GLOBAL INTELLIGENCE & GEOGRAPHIC NETWORK</span>
          </h2>
          <div className="flex-1 my-4 border border-blue-500/30 rounded-xl relative bg-[#070A13] overflow-hidden">
            <WorldGlobe assistantState={assistantState} />
          </div>
          <div className="text-xs text-slate-400 font-mono">
            GLOBAL GEOGRAPHIC DATA ENRICHMENT SERVICE READY FOR API INTEGRATION.
          </div>
        </div>
      );
    case 'TASK':
      return (
        <div className="h-full p-6 bg-[#0B0F1A]/85 border border-blue-500/20 rounded-xl space-y-4">
          <h2 className="text-lg font-bold text-white tracking-widest flex items-center space-x-2">
            <Layers className="w-5 h-5 text-violet-400" />
            <span>AUTOMATION PIPELINE & TASK MANAGER</span>
          </h2>
          <div className="h-28">
            <TaskCommandPanel currentTask={currentTask} />
          </div>
        </div>
      );
    case 'TITAN':
      return <TitanHUDPanel />;

    default:
      return (
        <div className="h-full flex items-center justify-center text-arvis-dim text-xs">
          MODE [{currentMode}] INITIALIZING...
        </div>
      );
  }
};
