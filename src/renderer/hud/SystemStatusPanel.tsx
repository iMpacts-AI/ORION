import React from 'react';
import { SystemSnapshot } from '../../shared/types';
import { Cpu, HardDrive, Activity, Wifi, ShieldAlert, CpuIcon } from 'lucide-react';

interface SystemStatusPanelProps {
  snapshot: SystemSnapshot | null;
}

export const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ snapshot }) => {
  if (!snapshot) {
    return (
      <div className="h-full flex items-center justify-center text-xs text-arvis-dim animate-pulse">
        CONNECTING_SYSTEM_TELEMETRY...
      </div>
    );
  }

  const { cpu, memory, storage, network, isMock } = snapshot;

  return (
    <div className="h-full flex flex-col justify-between space-y-4 p-4 bg-arvis-card border border-arvis-border hud-corner-tl relative text-xs">
      
      {/* Header with Dev Mock Badge */}
      <div className="flex items-center justify-between border-b border-arvis-border pb-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-arvis-accent animate-pulse" />
          <span className="font-semibold text-arvis-text tracking-wider uppercase">SYSTEM TELEMETRY</span>
        </div>
        {isMock && (
          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-arvis-amber/20 text-arvis-amber border border-arvis-amber/40 tracking-wider">
            DEV MOCK
          </span>
        )}
      </div>

      {/* CPU Usage & Core Distribution */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[11px]">
          <span className="flex items-center text-arvis-dim">
            <Cpu className="w-3.5 h-3.5 mr-1.5 text-arvis-cyan" /> CPU UTILIZATION
          </span>
          <span className="font-bold text-arvis-cyan">{cpu.usagePercent}%</span>
        </div>
        <div className="w-full bg-black/50 h-2 border border-arvis-border p-0.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-arvis-cyan via-arvis-cyan to-arvis-accent transition-all duration-300"
            style={{ width: `${cpu.usagePercent}%` }}
          />
        </div>
        <div className="grid grid-cols-4 gap-1 pt-1">
          {cpu.cores.slice(0, 8).map((core) => (
            <div key={core.id} className="bg-black/30 p-1 border border-arvis-border/40 text-[9px]">
              <div className="text-arvis-dim">C{core.id}</div>
              <div className="text-arvis-text font-bold">{core.usagePercent}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* RAM Memory Usage */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[11px]">
          <span className="flex items-center text-arvis-dim">
            <CpuIcon className="w-3.5 h-3.5 mr-1.5 text-arvis-accent" /> SYSTEM MEMORY (RAM)
          </span>
          <span className="font-bold text-arvis-accent">{memory.usagePercent}%</span>
        </div>
        <div className="w-full bg-black/50 h-2 border border-arvis-border p-0.5 overflow-hidden">
          <div
            className="h-full bg-arvis-accent transition-all duration-300"
            style={{ width: `${memory.usagePercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-arvis-dim">
          <span>USED: {(memory.usedBytes / (1024 * 1024 * 1024)).toFixed(1)} GB</span>
          <span>TOTAL: {(memory.totalBytes / (1024 * 1024 * 1024)).toFixed(1)} GB</span>
        </div>
      </div>

      {/* Storage Devices */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[11px]">
          <span className="flex items-center text-arvis-dim">
            <HardDrive className="w-3.5 h-3.5 mr-1.5 text-arvis-cyan" /> MAIN STORAGE
          </span>
          <span className="font-bold text-arvis-text">{storage[0]?.usagePercent || 0}%</span>
        </div>
        <div className="w-full bg-black/50 h-2 border border-arvis-border p-0.5">
          <div
            className="h-full bg-arvis-cyan/80 transition-all duration-300"
            style={{ width: `${storage[0]?.usagePercent || 0}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-arvis-dim">
          <span>{storage[0]?.driveLabel}</span>
          <span>FREE: {((storage[0]?.freeBytes || 0) / (1024 * 1024 * 1024)).toFixed(0)} GB</span>
        </div>
      </div>

      {/* Network Traffic */}
      <div className="pt-2 border-t border-arvis-border/50">
        <div className="flex justify-between items-center text-[11px] mb-1">
          <span className="flex items-center text-arvis-dim">
            <Wifi className="w-3.5 h-3.5 mr-1.5 text-arvis-cyan" /> NETWORK COMM
          </span>
          <span className="text-[10px] text-arvis-cyan font-semibold">{network.ipAddress}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[10px]">
          <div className="bg-black/40 p-1.5 border border-arvis-border/60">
            <div className="text-arvis-dim text-[9px]">DOWN</div>
            <div className="text-arvis-text font-bold">{network.downloadKbps} KB/s</div>
          </div>
          <div className="bg-black/40 p-1.5 border border-arvis-border/60">
            <div className="text-arvis-dim text-[9px]">UP</div>
            <div className="text-arvis-text font-bold">{network.uploadKbps} KB/s</div>
          </div>
          <div className="bg-black/40 p-1.5 border border-arvis-border/60">
            <div className="text-arvis-dim text-[9px]">PING</div>
            <div className="text-arvis-cyan font-bold">{network.pingMs} ms</div>
          </div>
        </div>
      </div>

      {/* Thermal & Hardware Status */}
      <div className="flex justify-between items-center text-[10px] bg-black/60 p-2 border border-arvis-border">
        <span className="text-arvis-dim">CPU THERMAL:</span>
        <span className="text-arvis-text font-mono font-bold">
          {snapshot.cpu.temperatureCelsius !== null ? `${snapshot.cpu.temperatureCelsius}°C` : 'N/A'}
        </span>
        <span className="text-arvis-dim border-l border-arvis-border pl-2">GPU THERMAL:</span>
        <span className="text-arvis-text font-mono font-bold">
          {snapshot.gpu.temperatureCelsius !== null ? `${snapshot.gpu.temperatureCelsius}°C` : 'N/A'}
        </span>
      </div>

    </div>
  );
};
