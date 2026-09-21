import { AssistantState, OrionMode, VisionResult, SystemSnapshot } from '../types';

export interface ActiveWindowInfo {
  title: string;
  processName: string;
  bounds?: { x: number; y: number; width: number; height: number };
}

export interface EnvironmentState {
  timestamp: number;
  activeApp?: string;
  activeWindow?: ActiveWindowInfo;
  visibleWindows?: ActiveWindowInfo[];
  displayCount: number;
  systemTelemetry?: SystemSnapshot;
  recentVisionSummary?: string;
  visionConfidence?: number;
  activeTaskTitle?: string;
  currentAssistantState: AssistantState;
}

export interface EnvironmentDiff {
  timestamp: number;
  activeAppChanged: boolean;
  activeWindowChanged: boolean;
  systemStateChanged: boolean;
  previousApp?: string;
  currentApp?: string;
  summary: string;
}
