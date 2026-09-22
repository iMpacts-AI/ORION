import React, { useState, useEffect } from 'react';
import { AssistantState, OrionMode, SystemSnapshot, ActivityEvent, TaskState, PrivacyState } from '../shared/types';
import { eventBus } from '../shared/events';
import { HeaderNav } from './hud/HeaderNav';
import { MainContentArea } from './hud/MainContentArea';
import { Mic, Send } from 'lucide-react';

const getInitialMode = (): OrionMode => {
  try {
    const params = new URLSearchParams(window.location.search);
    const queryMode = params.get('mode')?.toUpperCase();
    if (queryMode && ['COMMAND', 'VISION', 'TOOLS', 'SETTINGS', 'SYSTEM', 'SUPERVISOR', 'DEMO'].includes(queryMode)) {
      return queryMode as OrionMode;
    }
    const hashMode = window.location.hash.replace('#', '').toUpperCase();
    if (hashMode && ['COMMAND', 'VISION', 'TOOLS', 'SETTINGS', 'SYSTEM', 'SUPERVISOR', 'DEMO'].includes(hashMode)) {
      return hashMode as OrionMode;
    }
  } catch {}
  return 'COMMAND';
};

export const App: React.FC = () => {
  // State Orchestration
  const [assistantState, setAssistantState] = useState<AssistantState>('STANDBY');
  const [currentMode, setCurrentMode] = useState<OrionMode>(getInitialMode);
  const [privacy, setPrivacy] = useState<PrivacyState>({
    micActive: false,
    cameraActive: false,
    screenCaptureActive: false,
    userConfirmationRequired: true
  });

  const [snapshot, setSnapshot] = useState<SystemSnapshot | null>(null);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [currentTask, setCurrentTask] = useState<TaskState | null>(null);

  const [userInput, setUserInput] = useState('');

  // Setup Real-time Telemetry Polling & Event Subscriptions
  useEffect(() => {
    // Initial activity log
    eventBus.logActivity('SYSTEM_EVENT', 'ORION Core Orchestrator Online', { mode: 'COMMAND' }, 'COMMAND');

    // Subscribe to EventBus updates
    const unsubscribeActivity = eventBus.subscribe('activity.logged', () => {
      setActivities(eventBus.getActivityHistory());
    });

    const unsubscribeState = eventBus.subscribe('assistant.state.changed', ({ state }) => {
      setAssistantState(state);
    });

    const unsubscribeMode = eventBus.subscribe('assistant.mode.changed', ({ mode }) => {
      setCurrentMode(mode);
    });

    const apiInitial = window.orionApi || window.arvisApi;
    if (apiInitial && (apiInitial as any).getInitialMode) {
      (apiInitial as any).getInitialMode().then((mode: string) => {
        if (mode && mode === 'DEMO') {
          setCurrentMode('DEMO');
        }
      }).catch(() => {});
    }

    // Real-time Telemetry & Supervisor Task polling loop
    const fetchTelemetry = async () => {
      const api = window.orionApi || window.arvisApi;
      if (api) {
        try {
          const snap = await api.getSystemSnapshot();
          setSnapshot(snap);
          eventBus.emit('system.stats.updated', { snapshot: snap });

          const supTasks = await api.getSupervisorTasks?.();
          if (supTasks && supTasks.length > 0) {
            const activeSup = supTasks[supTasks.length - 1];
            setCurrentTask({
              id: activeSup.taskId,
              title: activeSup.title,
              status: activeSup.status === 'COMPLETED' ? 'COMPLETED' : 'RUNNING',
              progressPercent: activeSup.progressPercent,
              currentAction: activeSup.description,
              startedAt: activeSup.createdAt,
              logs: [activeSup.description, `Status: ${activeSup.status}`, `Retries: ${activeSup.retriesAttempted}`]
            });
          }
        } catch (err) {
          console.error('Error fetching system snapshot:', err);
        }
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 2500);

    return () => {
      clearInterval(interval);
      unsubscribeActivity();
      unsubscribeState();
      unsubscribeMode();
    };
  }, []);

  // Mode Navigation Handler
  const handleModeSelect = (mode: OrionMode) => {
    const prev = currentMode;
    setCurrentMode(mode);
    eventBus.emit('assistant.mode.changed', { mode, previousMode: prev });
    eventBus.logActivity('SYSTEM_EVENT', `Navigated to ${mode} HUD Screen Mode`, { mode });
  };

  // User Privacy Controls
  const toggleMic = async () => {
    const nextState = !privacy.micActive;
    setPrivacy(prev => ({ ...prev, micActive: nextState }));

    const api = window.orionApi || window.arvisApi;
    if (api) {
      await api.controlVoice(nextState ? 'start' : 'stop');
    }

    if (nextState) {
      setAssistantState('LISTENING');
      eventBus.logActivity('VOICE_INPUT', 'Microphone Activated - Listening for Wake Word');
    } else {
      setAssistantState('STANDBY');
      eventBus.logActivity('SYSTEM_EVENT', 'Microphone Deactivated');
    }
  };

  const toggleCamera = () => {
    const nextState = !privacy.cameraActive;
    setPrivacy(prev => ({ ...prev, cameraActive: nextState }));

    if (nextState) {
      setAssistantState('VISION');
      eventBus.logActivity('SYSTEM_EVENT', 'Optical Sensor / Camera Input Activated');
    } else {
      setAssistantState('STANDBY');
      eventBus.logActivity('SYSTEM_EVENT', 'Camera Input Deactivated');
    }
  };

  // Submit Text Request to Real ORION Orchestrator Flow
  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const query = userInput.trim();
    setUserInput('');

    // Immediately display operator input in HUD feed
    eventBus.logActivity('VOICE_INPUT', `Operator: "${query}"`);

    const api = window.orionApi || window.arvisApi;
    if (api) {
      try {
        setAssistantState('THINKING');
        const result = await api.processCommand(query, 'TEXT');
        if (result) {
          if (result.response) {
            // Display ORION response in HUD feed
            eventBus.logActivity('TASK_COMPLETE', result.response);
          }
          if (result.suggestedMode) {
            handleModeSelect(result.suggestedMode);
          }
        }
      } catch (err: any) {
        console.error('Command processing error:', err);
        eventBus.logActivity('ERROR_EVENT', `Error: ${err.message || err}`);
      } finally {
        setAssistantState('STANDBY');
      }
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-between bg-[#0B0F1A] text-white overflow-hidden select-none font-mono relative">
      
      {/* Scanline Visual Overlay */}
      <div className="absolute inset-0 pointer-events-none scanline-overlay z-50 opacity-20" />

      {/* Top Header Navigation */}
      <HeaderNav
        assistantState={assistantState}
        currentMode={currentMode}
        privacy={privacy}
        onModeSelect={handleModeSelect}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
      />

      {/* Main HUD Center Area */}
      <div className="flex-1 overflow-hidden relative">
        <MainContentArea
          currentMode={currentMode}
          assistantState={assistantState}
          snapshot={snapshot}
          activities={activities}
          currentTask={currentTask}
          cameraActive={privacy.cameraActive}
        />
      </div>

      {/* Bottom Command Bar */}
      <div className="p-3 bg-[#0B0F1A]/90 border-t border-blue-500/20 backdrop-blur-md flex items-center space-x-3 z-40">
        <button
          onClick={toggleMic}
          className={`p-2.5 rounded-lg border transition-all ${
            privacy.micActive
              ? 'border-amber-400 bg-amber-400/20 text-amber-300 animate-pulse shadow-lg shadow-amber-500/30'
              : 'border-blue-500/30 bg-[#070A13]/60 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40'
          }`}
          title="Toggle Microphone Voice Command"
        >
          <Mic className="w-4 h-4" />
        </button>

        <form onSubmit={handleCommandSubmit} className="flex-1 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type or speak command (e.g., 'ORION, show system' or 'ORION, what's my CPU usage?')..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full bg-[#070A13]/80 border border-blue-500/30 rounded-lg p-2.5 px-4 text-xs text-cyan-300 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 outline-none transition-all"
          />
          <button
            type="submit"
            className="p-2.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center space-x-1.5"
          >
            <span>SEND</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
