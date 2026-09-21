import { AssistantState, OrionMode, SystemSnapshot, VisionResult, TaskState, ActivityEvent, MemoryItem, ToolCall, ToolResult } from '../types';

export interface EventMap {
  'assistant.state.changed': { state: AssistantState; previousState: AssistantState };
  'assistant.mode.changed': { mode: OrionMode; previousMode: OrionMode };
  'assistant.voice.detected': { audioLevel: number; transcript?: string };
  'assistant.command.received': { query: string; source: 'TEXT' | 'VOICE' };
  'assistant.thinking.started': { query: string };
  'assistant.tool.started': { toolCall: ToolCall };
  'assistant.tool.completed': { result: ToolResult };
  'assistant.tool.failed': { toolCallId: string; error: string };
  'system.stats.updated': { snapshot: SystemSnapshot };
  'vision.started': { source: 'CAMERA' | 'SCREENSHOT' };
  'vision.result': { result: VisionResult };
  'task.started': { task: TaskState };
  'task.progress': { taskId: string; progressPercent: number; currentAction: string };
  'task.completed': { taskId: string };
  'activity.logged': { event: ActivityEvent };
  'memory.updated': { memories: MemoryItem[] };

  // Phase 3 Perception Pipeline Events
  'voice.started': { timestamp: number };
  'voice.transcript': { transcript: string; isFinal: boolean };
  'voice.stopped': { timestamp: number };
  'vision.capture.started': { source: 'CAMERA' | 'SCREENSHOT' };
  'vision.captured': { timestamp: number; imageBufferLength?: number };
  'vision.analysis.started': { source: 'CAMERA' | 'SCREENSHOT' };
  'vision.analysis.completed': { result: VisionResult };
  'speech.started': { text: string };
  'speech.stopped': { timestamp: number };
  'perception.error': { module: 'VOICE' | 'VISION' | 'SPEECH'; error: string };

  // Phase 4 & 4.2 AI Fabric & Streaming Events
  'ai.request.started': { prompt: string; category: string };
  'ai.provider.selected': { providerId: string; model: string };
  'ai.stream.started': { providerId: string };
  'ai.stream.delta': { token: string };
  'ai.stream.completed': { providerId: string };
  'ai.provider.failed': { providerId: string; error: string };
  'ai.failover.started': { failedProviderId: string };
  'ai.failover.completed': { activeProviderId: string };
}

type EventCallback<K extends keyof EventMap> = (data: EventMap[K]) => void;

class OrionEventBus {
  private listeners: { [K in keyof EventMap]?: EventCallback<K>[] } = {};
  private history: ActivityEvent[] = [];
  private maxHistory = 100;

  public subscribe<K extends keyof EventMap>(event: K, callback: EventCallback<K>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    (this.listeners[event] as any[]).push(callback);

    // Return unsubscribe callback
    return () => {
      if (this.listeners[event]) {
        this.listeners[event] = (this.listeners[event] as any[]).filter(cb => cb !== callback);
      }
    };
  }

  public emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const callbacks = this.listeners[event];
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in event listener for ${String(event)}:`, err);
        }
      });
    }
  }

  public logActivity(type: ActivityEvent['type'], message: string, details?: Record<string, any>, mode?: OrionMode): ActivityEvent {
    const activityEvent: ActivityEvent = {
      id: 'act_' + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      type,
      message,
      details,
      mode
    };
    this.history.unshift(activityEvent);
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }
    this.emit('activity.logged', { event: activityEvent });
    return activityEvent;
  }

  public getActivityHistory(): ActivityEvent[] {
    return [...this.history];
  }
}

export const eventBus = new OrionEventBus();
export const arvisEventBus = eventBus;
