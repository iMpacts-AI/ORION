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
          <div className="flex-1 bg-arvis-card border border-arvis-border relative overflow-hidden flex items-center justify-center">
            
            {/* Corner HUD Decorators */}
            <div className="absolute top-2 left-2 text-[9px] text-arvis-dim font-mono tracking-widest">
              HUD_CENTER_NODE // MAIN_VISUALIZER
            </div>
            <div className="absolute top-2 right-2 text-[9px] text-arvis-cyan font-mono tracking-widest">
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
        <div className="h-full p-6 bg-arvis-card border border-arvis-border overflow-y-auto">
          <h2 className="text-lg font-bold text-arvis-text tracking-widest mb-4 flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-arvis-cyan" />
            <span>FULL SYSTEM TELEMETRY DIAGNOSTICS</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <SystemStatusPanel snapshot={snapshot} />
            <div className="bg-black/50 border border-arvis-border p-4 space-y-3 font-mono text-xs">
              <div className="text-arvis-cyan font-bold border-b border-arvis-border pb-2">HARDWARE SPECIFICATIONS</div>
              <div>PROCESSOR: {snapshot?.cpu.model || 'N/A'}</div>
              <div>CORES DETECTED: {snapshot?.cpu.cores.length || 0} CORES</div>
              <div>GRAPHICS: {snapshot?.gpu.name || 'N/A'}</div>
              <div>MEMORY TOTAL: {((snapshot?.memory.totalBytes || 0) / (1024 * 1024 * 1024)).toFixed(2)} GB</div>
              <div>TELEMETRY MODE: {snapshot?.isMock ? 'DEVELOPMENT MOCK PROVIDER' : 'NATIVE HARDWARE'}</div>
            </div>
          </div>
        </div>
      );
    case 'WORLD':
      return (
        <div className="h-full p-6 bg-arvis-card border border-arvis-border flex flex-col justify-between">
          <h2 className="text-lg font-bold text-arvis-text tracking-widest flex items-center space-x-2">
            <Globe className="w-5 h-5 text-arvis-cyan" />
            <span>GLOBAL INTELLIGENCE & GEOGRAPHIC NETWORK</span>
          </h2>
          <div className="flex-1 my-4 border border-arvis-border relative bg-black">
            <WorldGlobe assistantState={assistantState} />
          </div>
          <div className="text-xs text-arvis-dim font-mono">
            GLOBAL GEOGRAPHIC DATA ENRICHMENT SERVICE READY FOR API INTEGRATION.
          </div>
        </div>
      );
    case 'TASK':
      return (
        <div className="h-full p-6 bg-arvis-card border border-arvis-border space-y-4">
          <h2 className="text-lg font-bold text-arvis-text tracking-widest flex items-center space-x-2">
            <Layers className="w-5 h-5 text-arvis-accent" />
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
