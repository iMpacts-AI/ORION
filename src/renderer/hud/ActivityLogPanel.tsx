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
        return <Mic className="w-3.5 h-3.5 text-arvis-amber" />;
      case 'PROCESSING':
        return <Sparkles className="w-3.5 h-3.5 text-arvis-cyan animate-pulse" />;
      case 'TOOL_EXECUTION':
        return <Play className="w-3.5 h-3.5 text-arvis-accent" />;
      case 'TASK_COMPLETE':
        return <CheckCircle className="w-3.5 h-3.5 text-green-400" />;
      case 'ERROR_EVENT':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-500" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-arvis-dim" />;
    }
  };

  const getEventBadgeClass = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'VOICE_INPUT':
        return 'text-arvis-amber border-arvis-amber/30 bg-arvis-amber/10';
      case 'PROCESSING':
        return 'text-arvis-cyan border-arvis-cyan/30 bg-arvis-cyan/10';
      case 'TOOL_EXECUTION':
        return 'text-arvis-accent border-arvis-accent/30 bg-arvis-accent/10';
      case 'TASK_COMPLETE':
        return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'ERROR_EVENT':
        return 'text-red-400 border-red-500/30 bg-red-500/10';
      default:
        return 'text-arvis-dim border-arvis-border bg-black/40';
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-arvis-card border border-arvis-border hud-corner-br relative text-xs">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-arvis-border pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-arvis-cyan" />
          <span className="font-semibold text-arvis-text tracking-wider uppercase">ORION ACTIVITY LOG</span>
        </div>
        <span className="text-[10px] text-arvis-dim font-mono">
          {activities.length} EVENTS
        </span>
      </div>

      {/* Feed Stream */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {activities.length === 0 ? (
          <div className="h-full flex items-center justify-center text-arvis-dim text-[11px]">
            NO_ACTIVE_ACTIVITY_LOGGED
          </div>
        ) : (
          activities.map((act) => (
            <div
              key={act.id}
              className="p-2 bg-black/40 border border-arvis-border/60 hover:border-arvis-border transition-colors space-y-1 text-[11px]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  {getEventIcon(act.type)}
                  <span className={`px-1.5 py-0.2 text-[9px] border font-semibold ${getEventBadgeClass(act.type)}`}>
                    {act.type}
                  </span>
                </div>
                <span className="text-[9px] text-arvis-dim font-mono">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              
              <div className="text-arvis-text pl-5 leading-tight font-mono">
                {act.message}
              </div>

              {act.details && (
                <div className="pl-5 text-[10px] text-arvis-dim font-mono">
                  {JSON.stringify(act.details)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Activity Status Bar */}
      <div className="pt-3 border-t border-arvis-border/50 flex justify-between items-center text-[10px] text-arvis-dim">
        <span className="flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-arvis-cyan animate-ping mr-2" />
          REALTIME STREAM ACTIVE
        </span>
        <span className="uppercase">LOG_LEVEL: VERBOSE</span>
      </div>

    </div>
  );
};
