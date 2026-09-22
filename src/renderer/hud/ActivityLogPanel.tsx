import React from 'react';
import { ActivityEvent } from '../../shared/types';
import { Terminal, Mic, Cpu, CheckCircle, AlertTriangle, Play, Sparkles } from 'lucide-react';

interface ActivityLogPanelProps {
  activities: ActivityEvent[];
}

export const ActivityLogPanel: React.FC<ActivityLogPanelProps> = ({ activities }) => {
  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'VOICE_INPUT':
        return <Mic className="w-3.5 h-3.5 text-amber-400" />;
      case 'PROCESSING':
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />;
      case 'TOOL_EXECUTION':
        return <Play className="w-3.5 h-3.5 text-violet-400" />;
      case 'TASK_COMPLETE':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ERROR_EVENT':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const getEventBadgeClass = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'VOICE_INPUT':
        return 'text-amber-300 border-amber-500/30 bg-amber-500/10';
      case 'PROCESSING':
        return 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10';
      case 'TOOL_EXECUTION':
        return 'text-violet-300 border-violet-500/30 bg-violet-500/10';
      case 'TASK_COMPLETE':
        return 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10';
      case 'ERROR_EVENT':
        return 'text-red-300 border-red-500/30 bg-red-500/10';
      default:
        return 'text-slate-400 border-blue-500/20 bg-blue-950/30';
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-[#0B0F1A]/85 border border-blue-500/20 hud-corner-br relative text-xs backdrop-blur-md">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-blue-500/20 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-white tracking-wider uppercase font-sans">ORION ACTIVITY LOG</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          {activities.length} EVENTS
        </span>
      </div>

      {/* Feed Stream */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {activities.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-[11px] font-mono">
            NO_ACTIVE_ACTIVITY_LOGGED
          </div>
        ) : (
          activities.map((act) => (
            <div
              key={act.id}
              className="p-2 bg-blue-950/30 border border-blue-500/20 hover:border-blue-400/40 rounded transition-colors space-y-1 text-[11px]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  {getEventIcon(act.type)}
                  <span className={`px-1.5 py-0.2 text-[9px] border rounded font-semibold font-mono ${getEventBadgeClass(act.type)}`}>
                    {act.type}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              
              <div className="text-slate-200 pl-5 leading-tight font-mono">
                {act.message}
              </div>

              {act.details && (
                <div className="pl-5 text-[10px] text-slate-400 font-mono">
                  {JSON.stringify(act.details)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Activity Status Bar */}
      <div className="pt-3 border-t border-blue-500/20 flex justify-between items-center text-[10px] text-slate-400 font-mono">
        <span className="flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping mr-2" />
          REALTIME STREAM ACTIVE
        </span>
        <span className="uppercase text-blue-400/80">LOG_LEVEL: VERBOSE</span>
      </div>

    </div>
  );
};
