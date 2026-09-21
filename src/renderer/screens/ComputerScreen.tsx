import React, { useState, useEffect } from 'react';
import { Tool, ToolCall } from '../../shared/types';
import { ComputerTaskPlan, ComputerObservation } from '../../shared/types/action';
import { Terminal, AlertTriangle, ShieldCheck, Play, StopCircle, Eye, RefreshCw, Send, CheckCircle2, XCircle } from 'lucide-react';

export const ComputerScreen: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [paramsInput, setParamsInput] = useState<string>('{}');
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [userConfirmed, setUserConfirmed] = useState<boolean>(false);
  
  // Phase 8 Universal Desktop Control State
  const [naturalCommand, setNaturalCommand] = useState<string>('Open Chrome and search for the latest Nvidia earnings.');
  const [activePlan, setActivePlan] = useState<ComputerTaskPlan | null>(null);
  const [liveObservation, setLiveObservation] = useState<ComputerObservation | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [emergencyStopped, setEmergencyStopped] = useState<boolean>(false);

  const [isDryRun, setIsDryRun] = useState<boolean>(false);

  useEffect(() => {
    const api = window.orionApi || window.arvisApi;
    let unsub: (() => void) | undefined;
    if (api) {
      api.getTools().then(setTools);
      if (api.onComputerTaskUpdated) {
        unsub = api.onComputerTaskUpdated((plan: ComputerTaskPlan) => {
          setActivePlan(plan);
          if (plan.status === 'COMPLETED' || plan.status === 'FAILED' || plan.status === 'CANCELLED' || plan.status === 'ESTOPPED') {
            setIsExecuting(false);
          }
        });
      }
    }
    return () => {
      if (unsub) unsub();
    };
  }, []);

  const handleObserve = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!api || !api.getComputerObservation) return;
    try {
      const obs = await api.getComputerObservation();
      setLiveObservation(obs);
    } catch (err: any) {
      setExecutionOutput(`[OBSERVATION ERROR] ${err.message}`);
    }
  };

  const handleRunCommand = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!api || !api.executeComputerCommand || !naturalCommand.trim()) return;
    setIsExecuting(true);
    setEmergencyStopped(false);
    try {
      const plan = await (api as any).executeComputerCommand(naturalCommand, { isDryRun });
      setActivePlan(plan);
      if (plan.status !== 'RUNNING' && plan.status !== 'EXECUTING') {
        setIsExecuting(false);
      }
    } catch (err: any) {
      setExecutionOutput(`[COMMAND ERROR] ${err.message}`);
      setIsExecuting(false);
    }
  };

  const handleEmergencyStop = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!api || !api.emergencyStopComputer) return;
    await api.emergencyStopComputer();
    setEmergencyStopped(true);
    setIsExecuting(false);
  };

  const handleResetEmergencyStop = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!api || !api.resetEmergencyStopComputer) return;
    await api.resetEmergencyStopComputer();
    setEmergencyStopped(false);
  };

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    setExecutionOutput(null);
    setUserConfirmed(false);

    const defaultParams: Record<string, any> = {};
    Object.keys(tool.parameters).forEach(k => {
      defaultParams[k] = tool.parameters[k].type === 'string' ? 'example_val' : true;
    });
    setParamsInput(JSON.stringify(defaultParams, null, 2));
  };

  const handleExecuteTool = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!selectedTool || !api) return;

    if (selectedTool.permissionLevel === 'CRITICAL' && !userConfirmed) {
      setExecutionOutput(`[SECURITY BLOCK] Execution refused. Critical action requires manual confirmation checkbox.`);
      return;
    }

    try {
      const parsedArgs = JSON.parse(paramsInput);
      const call: ToolCall = {
        id: 'call_' + Math.random().toString(36).substring(2, 9),
        toolId: selectedTool.id,
        toolName: selectedTool.name,
        arguments: parsedArgs,
        timestamp: Date.now(),
        requiresUserApproval: userConfirmed
      };

      setExecutionOutput(`Executing tool '${selectedTool.name}'...`);
      const result = await api.executeTool(call);
      setExecutionOutput(JSON.stringify(result, null, 2));
    } catch (err: any) {
      setExecutionOutput(`[ERROR] Invalid parameters format or execution error: ${err.message}`);
    }
  };

  return (
    <div className="h-full grid grid-cols-12 gap-4 p-4 bg-arvis-card border border-arvis-border overflow-hidden">
      
      {/* Left Column: Natural Language Computer-Use Command Center */}
      <div className="col-span-7 bg-black/40 border border-arvis-border p-4 flex flex-col justify-between space-y-4 overflow-y-auto">
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-arvis-border pb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-arvis-cyan" />
              <div>
                <h3 className="font-bold text-sm text-arvis-text font-mono">UNIVERSAL DESKTOP CONTROL HUD</h3>
                <p className="text-[10px] text-arvis-dim">Closed-Loop Autonomous Observe → Plan → Act → Verify Engine</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {emergencyStopped ? (
                <button
                  onClick={handleResetEmergencyStop}
                  className="px-2.5 py-1 bg-red-500/20 border border-red-500 text-red-400 text-[10px] font-mono font-bold flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>RESET ESTOP</span>
                </button>
              ) : (
                <button
                  onClick={handleEmergencyStop}
                  className="px-2.5 py-1 bg-red-600/30 border border-red-500 text-red-300 text-[10px] font-mono font-bold flex items-center space-x-1 hover:bg-red-600/50"
                >
                  <StopCircle className="w-3.5 h-3.5" />
                  <span>EMERGENCY STOP</span>
                </button>
              )}
              <button
                onClick={handleObserve}
                className="px-2.5 py-1 bg-arvis-cyan/10 border border-arvis-cyan/40 text-arvis-cyan text-[10px] font-mono font-bold flex items-center space-x-1 hover:bg-arvis-cyan/20"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>OBSERVE SCREEN</span>
              </button>
            </div>
          </div>

          {/* Natural Language Command Bar & Dry-Run Toggle */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] text-arvis-dim font-mono uppercase">NATURAL LANGUAGE DESKTOP INSTRUCTION</label>
              <label className="flex items-center space-x-1.5 cursor-pointer text-[10px] font-mono text-arvis-cyan">
                <input
                  type="checkbox"
                  checked={isDryRun}
                  onChange={(e) => setIsDryRun(e.target.checked)}
                  className="rounded bg-black border-arvis-border text-arvis-cyan focus:ring-0"
                />
                <span className={isDryRun ? "text-amber-400 font-bold" : "text-arvis-dim"}>
                  {isDryRun ? "DRY-RUN (PREVIEW ONLY)" : "LIVE EXECUTION"}
                </span>
              </label>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={naturalCommand}
                onChange={(e) => setNaturalCommand(e.target.value)}
                placeholder="e.g. Open Chrome and search for latest Nvidia earnings."
                className="flex-1 bg-black border border-arvis-border px-3 py-2 text-xs font-mono text-arvis-cyan focus:border-arvis-cyan outline-none"
              />
              <button
                onClick={handleRunCommand}
                disabled={isExecuting || emergencyStopped}
                className={`px-4 py-2 border font-mono font-bold text-xs flex items-center space-x-1 disabled:opacity-50 ${
                  isDryRun
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 hover:bg-amber-500/30"
                    : "bg-arvis-cyan/20 border-arvis-cyan text-arvis-cyan hover:bg-arvis-cyan/30"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isDryRun ? "PREVIEW" : "RUN"}</span>
              </button>
            </div>
          </div>

          {/* Live Task Execution Stream Panel */}
          {activePlan && (
            <div className="p-3 bg-black/70 border border-arvis-border space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-arvis-border pb-1.5">
                <span className="text-arvis-cyan font-bold">TASK EXECUTION PLAN: {activePlan.taskId}</span>
                <div className="flex items-center space-x-1.5">
                  {activePlan.isDryRun && (
                    <span className="px-1.5 py-0.5 text-[8px] font-bold border border-amber-500 bg-amber-500/20 text-amber-400">
                      DRY-RUN
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-[9px] font-bold border ${
                    activePlan.status === 'COMPLETED' ? 'border-green-500 bg-green-500/20 text-green-400' :
                    activePlan.status === 'RUNNING' || activePlan.status === 'EXECUTING' ? 'border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan animate-pulse' :
                    activePlan.status === 'AWAITING_APPROVAL' ? 'border-amber-500 bg-amber-500/20 text-amber-400' :
                    activePlan.status === 'ESTOPPED' ? 'border-red-600 bg-red-600/30 text-red-300' :
                    'border-red-500 bg-red-500/20 text-red-400'
                  }`}>
                    {activePlan.status}
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-arvis-dim">Intent: {activePlan.intent}</div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {activePlan.actions.map((act, idx) => (
                  <div
                    key={act.id}
                    className={`p-1.5 border text-[10px] flex justify-between items-center ${
                      idx === activePlan.currentActionIndex
                        ? 'border-arvis-cyan bg-arvis-cyan/15 text-arvis-text'
                        : idx < activePlan.currentActionIndex
                        ? 'border-green-500/40 bg-black/40 text-arvis-dim'
                        : 'border-arvis-border/40 bg-black/20 text-arvis-dim'
                    }`}
                  >
                    <span>{idx + 1}. [{act.type}] {act.reason || act.target}</span>
                    <span className="text-[9px]">{act.riskLevel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desktop Observation Telemetry */}
          {liveObservation && (
            <div className="p-3 bg-black/70 border border-arvis-border space-y-1.5 font-mono text-[11px]">
              <div className="text-arvis-cyan font-bold border-b border-arvis-border pb-1 flex justify-between">
                <span>DESKTOP OBSERVATION SNAPSHOT</span>
                {liveObservation.observationId && (
                  <span className="text-arvis-dim text-[9px]">{liveObservation.observationId}</span>
                )}
              </div>
              <div>Active App: <span className="text-arvis-text">{liveObservation.activeWindow.processName}</span></div>
              <div>Window Title: <span className="text-arvis-text">{liveObservation.activeWindow.title}</span></div>
              <div>Resolution: <span className="text-arvis-text">{liveObservation.screen.width}x{liveObservation.screen.height}</span></div>
              <div>Interactive Elements Detected: <span className="text-arvis-text">{liveObservation.interactiveElements.length} elements</span></div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Registered Tools & Low-Level Execution */}
      <div className="col-span-5 bg-black/40 border border-arvis-border p-3 flex flex-col space-y-3 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-arvis-border pb-2 text-xs font-bold text-arvis-text">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-arvis-cyan" />
            <span>TOOL DISPATCH MATRIX</span>
          </div>
          <span className="text-[9px] text-arvis-dim font-mono">{tools.length} TOOLS</span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => handleToolSelect(t)}
              className={`w-full text-left p-2 border transition-all text-[11px] space-y-0.5 ${
                selectedTool?.id === t.id
                  ? 'border-arvis-accent bg-arvis-accent/15 text-arvis-text'
                  : 'border-arvis-border/60 bg-black/20 text-arvis-dim hover:border-arvis-border hover:text-arvis-text'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold font-mono">{t.name}</span>
                <span className="text-[8px] font-bold border px-1 py-0.2 border-arvis-cyan/40 text-arvis-cyan">
                  {t.permissionLevel}
                </span>
              </div>
            </button>
          ))}
        </div>

        {selectedTool && (
          <div className="space-y-2 border-t border-arvis-border pt-2 font-mono text-xs">
            <textarea
              value={paramsInput}
              onChange={(e) => setParamsInput(e.target.value)}
              className="w-full h-20 bg-black border border-arvis-border p-2 text-[10px] text-arvis-cyan outline-none resize-none"
            />
            <button
              onClick={handleExecuteTool}
              className="w-full py-1.5 bg-arvis-accent/20 border border-arvis-accent text-arvis-accent font-bold text-[11px] flex items-center justify-center space-x-1 hover:bg-arvis-accent/30"
            >
              <Play className="w-3.5 h-3.5" />
              <span>DISPATCH TOOL</span>
            </button>
          </div>
        )}

        {executionOutput && (
          <div className="p-2 bg-black border border-arvis-border text-[10px] font-mono text-arvis-cyan max-h-32 overflow-y-auto whitespace-pre-wrap">
            {executionOutput}
          </div>
        )}
      </div>

    </div>
  );
};

