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
    <div className="h-full flex items-center justify-between p-3 bg-arvis-card border border-arvis-border text-xs relative overflow-hidden">
      
      {/* Background Accent Scan Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-arvis-accent to-transparent opacity-50" />

      {/* Left Section: ORION BRAIN Provider Status */}
      <div className="flex items-center space-x-3 min-w-[320px]">
        <div className="p-2 bg-arvis-cyan/10 border border-arvis-cyan/40 text-arvis-cyan">
          <Zap className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-arvis-dim tracking-wider uppercase font-bold">ORION BRAIN</span>
            <span className={`w-2 h-2 rounded-full ${brainStatus?.isHealthy ? 'bg-green-400' : 'bg-arvis-amber animate-ping'}`} />
          </div>
          <div className="font-semibold text-arvis-text text-xs tracking-wide font-mono flex items-center space-x-2">
            <span className="text-arvis-cyan">{brainStatus ? brainStatus.displayName : 'ORION Native Router'}</span>
          </div>
          <div className="text-[9px] text-arvis-dim font-mono">
            MODEL: {brainStatus ? brainStatus.currentModel : 'Offline Heuristic'} | BACKUPS: {configuredCount} CLOUD
          </div>
        </div>
      </div>

      {/* Middle Section: Progress & Action */}
      <div className="flex-1 px-6 space-y-1 max-w-[500px]">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-arvis-dim uppercase">ACTION: {currentTask ? currentTask.currentAction : 'STANDBY IDLE'}</span>
          <span className="text-arvis-cyan font-bold font-mono">
            {currentTask ? `${currentTask.progressPercent}%` : '0%'}
          </span>
        </div>

        <div className="w-full bg-black/60 h-2 border border-arvis-border p-0.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-arvis-cyan via-arvis-cyan to-arvis-accent transition-all duration-300"
            style={{ width: `${currentTask ? currentTask.progressPercent : 0}%` }}
          />
        </div>
      </div>

      {/* Right Section: Task Status Indicator */}
      <div className="flex items-center space-x-3 text-right">
        <div>
          <div className="text-[9px] text-arvis-dim uppercase">STATUS</div>
          <div className="font-bold text-arvis-cyan font-mono tracking-wider uppercase">
            {currentTask ? currentTask.status : 'STANDBY'}
          </div>
        </div>

        {currentTask?.status === 'RUNNING' && (
          <Loader2 className="w-5 h-5 text-arvis-cyan animate-spin" />
        )}
        {currentTask?.status === 'COMPLETED' && (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        )}
        {currentTask?.status === 'FAILED' && (
          <AlertCircle className="w-5 h-5 text-red-500" />
        )}
        {!currentTask && (
          <div className="w-2.5 h-2.5 rounded-full bg-arvis-dim opacity-50" />
        )}
      </div>

    </div>
  );
};
