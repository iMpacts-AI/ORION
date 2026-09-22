import React from 'react';
import { SystemSnapshot } from '../../shared/types';
import { Cpu, HardDrive, Activity, Wifi, ShieldAlert, CpuIcon } from 'lucide-react';

interface SystemStatusPanelProps {
  snapshot: SystemSnapshot | null;
}

export const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ snapshot }) => {
  if (!snapshot) {
    return (
      <div className="h-full flex items-center justify-center text-xs text-slate-400 font-mono animate-pulse">
        CONNECTING_SYSTEM_TELEMETRY...
      </div>
    );
  }

  const { cpu, memory, storage, network, isMock } = snapshot;

  return (
    <div className="h-full flex flex-col justify-between space-y-4 p-4 bg-[#0B0F1A]/85 border border-blue-500/20 hud-corner-tl relative text-xs backdrop-blur-md">
      
      {/* Header with Dev Mock Badge */}
      <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-semibold text-white tracking-wider uppercase font-sans">SYSTEM TELEMETRY</span>
        </div>
        {isMock && (
          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 tracking-wider font-mono">
            DEV MOCK
          </span>
        )}
      </div>

      {/* CPU Usage & Core Distribution */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[11px] font-mono">
          <span className="flex items-center text-slate-300">
            <Cpu className="w-3.5 h-3.5 mr-1.5 text-cyan-400" /> CPU UTILIZATION
          </span>
          <span className="font-bold text-cyan-300">{cpu.usagePercent}%</span>
        </div>
        <div className="w-full bg-blue-950/40 h-2 border border-blue-500/25 p-0.5 overflow-hidden rounded-sm">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-300 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
            style={{ width: `${cpu.usagePercent}%` }}
          />
        </div>
        <div className="grid grid-cols-4 gap-1 pt-1 font-mono">
          {cpu.cores.slice(0, 8).map((core) => (
            <div key={core.id} className="bg-blue-950/30 p-1 border border-blue-500/20 text-[9px] rounded-sm">
              <div className="text-slate-400">C{core.id}</div>
              <div className="text-white font-bold">{core.usagePercent}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* RAM Memory Usage */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[11px] font-mono">
          <span className="flex items-center text-slate-300">
            <CpuIcon className="w-3.5 h-3.5 mr-1.5 text-violet-400" /> SYSTEM MEMORY (RAM)
          </span>
          <span className="font-bold text-violet-300">{memory.usagePercent}%</span>
        </div>
        <div className="w-full bg-blue-950/40 h-2 border border-blue-500/25 p-0.5 overflow-hidden rounded-sm">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 shadow-[0_0_8px_rgba(139,92,246,0.5)]"
            style={{ width: `${memory.usagePercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>USED: {(memory.usedBytes / (1024 * 1024 * 1024)).toFixed(1)} GB</span>
          <span>TOTAL: {(memory.totalBytes / (1024 * 1024 * 1024)).toFixed(1)} GB</span>
        </div>
      </div>

      {/* Storage Devices */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[11px] font-mono">
          <span className="flex items-center text-slate-300">
            <HardDrive className="w-3.5 h-3.5 mr-1.5 text-cyan-400" /> MAIN STORAGE
          </span>
          <span className="font-bold text-white">{storage[0]?.usagePercent || 0}%</span>
        </div>
        <div className="w-full bg-blue-950/40 h-2 border border-blue-500/25 p-0.5 rounded-sm">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
            style={{ width: `${storage[0]?.usagePercent || 0}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>{storage[0]?.driveLabel}</span>
          <span>FREE: {((storage[0]?.freeBytes || 0) / (1024 * 1024 * 1024)).toFixed(0)} GB</span>
        </div>
      </div>

      {/* Network Traffic */}
      <div className="pt-2 border-t border-blue-500/20">
        <div className="flex justify-between items-center text-[11px] mb-1 font-mono">
          <span className="flex items-center text-slate-300">
            <Wifi className="w-3.5 h-3.5 mr-1.5 text-cyan-400" /> NETWORK COMM
          </span>
          <span className="text-[10px] text-cyan-300 font-semibold">{network.ipAddress}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
          <div className="bg-blue-950/30 p-1.5 border border-blue-500/20 rounded-sm">
            <div className="text-slate-400 text-[9px]">DOWN</div>
            <div className="text-white font-bold">{network.downloadKbps} KB/s</div>
          </div>
          <div className="bg-blue-950/30 p-1.5 border border-blue-500/20 rounded-sm">
            <div className="text-slate-400 text-[9px]">UP</div>
            <div className="text-white font-bold">{network.uploadKbps} KB/s</div>
          </div>
          <div className="bg-blue-950/30 p-1.5 border border-blue-500/20 rounded-sm">
            <div className="text-slate-400 text-[9px]">PING</div>
            <div className="text-cyan-300 font-bold">{network.pingMs} ms</div>
          </div>
        </div>
      </div>

      {/* Thermal & Hardware Status */}
      <div className="flex justify-between items-center text-[10px] bg-blue-950/40 p-2 border border-blue-500/20 font-mono rounded-sm">
        <span className="text-slate-400">CPU THERMAL:</span>
        <span className="text-white font-bold">
          {snapshot.cpu.temperatureCelsius !== null ? `${snapshot.cpu.temperatureCelsius}°C` : 'N/A'}
        </span>
        <span className="text-slate-400 border-l border-blue-500/20 pl-2">GPU THERMAL:</span>
        <span className="text-white font-bold">
          {snapshot.gpu.temperatureCelsius !== null ? `${snapshot.gpu.temperatureCelsius}°C` : 'N/A'}
        </span>
      </div>

    </div>
  );
};
