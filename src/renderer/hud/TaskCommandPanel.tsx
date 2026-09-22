import React, { useState, useEffect } from 'react';
import { TaskState } from '../../shared/types';
import { ProviderStatusDTO } from '../vite-env';
import { Layers, Loader2, CheckCircle2, AlertCircle, Cpu, Zap, ShieldCheck } from 'lucide-react';

interface TaskCommandPanelProps {
  currentTask: TaskState | null;
}

export const TaskCommandPanel: React.FC<TaskCommandPanelProps> = ({ currentTask }) => {
  const [brainStatus, setBrainStatus] = useState<ProviderStatusDTO | null>(null);
  const [configuredCount, setConfiguredCount] = useState<number>(0);

  useEffect(() => {
    const fetchBrainStatus = async () => {
      const api = window.orionApi || window.arvisApi;
      if (api && api.getAIRouterStatus) {
        try {
          const status = await api.getAIRouterStatus();
          setBrainStatus(status);
          const all = await api.getAllProviderStatuses();
          setConfiguredCount(all.filter(p => p.isConfigured).length);
        } catch (e) {
          // Ignore
        }
      }
    };

    fetchBrainStatus();
    const interval = setInterval(fetchBrainStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex items-center justify-between p-3.5 bg-[#0B0F1A]/85 border border-blue-500/20 rounded-lg text-xs relative overflow-hidden backdrop-blur-md">
      
      {/* Background Accent Scan Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

      {/* Left Section: ORION BRAIN Provider Status */}
      <div className="flex items-center space-x-3.5 min-w-[320px]">
        <div className="p-2 bg-blue-500/10 border border-blue-400/30 text-cyan-300 rounded-md shadow-[0_0_12px_rgba(56,189,248,0.25)]">
          <Zap className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-bold font-mono">ORION NEURAL BRAIN</span>
            <span className={`w-2 h-2 rounded-full ${brainStatus?.isHealthy ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-amber-400 animate-ping'}`} />
          </div>
          <div className="font-semibold text-white text-xs tracking-wide font-mono flex items-center space-x-2">
            <span className="text-cyan-300">{brainStatus ? brainStatus.displayName : 'ORION Native Router'}</span>
          </div>
          <div className="text-[9px] text-slate-400 font-mono">
            MODEL: {brainStatus ? brainStatus.currentModel : 'Offline Heuristic'} | FAILOVER: {configuredCount} CLOUD
          </div>
        </div>
      </div>

      {/* Middle Section: Progress & Action */}
      <div className="flex-1 px-6 space-y-1 max-w-[500px]">
        <div className="flex justify-between items-center text-[10px] font-mono">
          <span className="text-slate-300 uppercase tracking-wider">ACTION: {currentTask ? currentTask.currentAction : 'STANDBY IDLE'}</span>
          <span className="text-cyan-300 font-bold">
            {currentTask ? `${currentTask.progressPercent}%` : '0%'}
          </span>
        </div>

        <div className="w-full bg-blue-950/40 h-2 border border-blue-500/25 p-0.5 overflow-hidden rounded-sm">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-300 shadow-[0_0_10px_rgba(56,189,248,0.4)]"
            style={{ width: `${currentTask ? currentTask.progressPercent : 0}%` }}
          />
        </div>
      </div>

      {/* Right Section: Task Status Indicator */}
      <div className="flex items-center space-x-3 text-right">
        <div>
          <div className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">STATUS</div>
          <div className="font-bold text-cyan-300 font-mono tracking-wider uppercase">
            {currentTask ? currentTask.status : 'STANDBY'}
          </div>
        </div>

        {currentTask?.status === 'RUNNING' && (
          <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
        )}
        {currentTask?.status === 'COMPLETED' && (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
        )}
        {currentTask?.status === 'FAILED' && (
          <AlertCircle className="w-5 h-5 text-red-400" />
        )}
        {!currentTask && (
          <div className="w-2.5 h-2.5 rounded-full bg-slate-500 opacity-60" />
        )}
      </div>

    </div>
  );
};
