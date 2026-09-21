import React, { useState, useEffect } from 'react';
import { AssistantState, OrionMode, SystemSnapshot, ActivityEvent, TaskState, PrivacyState } from '../shared/types';
import { eventBus } from '../shared/events';
import { HeaderNav } from './hud/HeaderNav';
import { MainContentArea } from './hud/MainContentArea';
import { Mic, Send } from 'lucide-react';

export const App: React.FC = () => {
  // State Orchestration
  const [assistantState, setAssistantState] = useState<AssistantState>('STANDBY');
  const [currentMode, setCurrentMode] = useState<OrionMode>('COMMAND');
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
    <div className="w-screen h-screen flex flex-col justify-between bg-[#050608] text-[#e1e7ec] overflow-hidden select-none font-mono relative">
      
      {/* Scanline Visual Overlay */}
      <div className="absolute inset-0 pointer-events-none scanline-overlay z-50 opacity-30" />

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
      <div className="p-3 bg-arvis-card border-t border-arvis-border flex items-center space-x-3 z-40">
        <button
          onClick={toggleMic}
          className={`p-2 border transition-all ${
            privacy.micActive
              ? 'border-arvis-amber bg-arvis-amber/20 text-arvis-amber animate-pulse'
              : 'border-arvis-border text-arvis-dim hover:text-arvis-text'
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
            className="w-full bg-black/60 border border-arvis-border p-2 px-3 text-xs text-arvis-cyan placeholder:text-arvis-dim focus:border-arvis-cyan outline-none"
          />
          <button
            type="submit"
            className="p-2 bg-arvis-cyan/20 border border-arvis-cyan text-arvis-cyan hover:bg-arvis-cyan/30 text-xs font-bold transition-all flex items-center space-x-1"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
