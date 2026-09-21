import { AssistantState, AssistantResponse, ToolCall, ToolResult, OrionMode, VisionResult, CommandTelemetryMetrics } from './index';

export type EventType =
  | 'USER_COMMAND'
  | 'FILE_CHANGED'
  | 'APPLICATION_CHANGED'
  | 'SYSTEM_STATE_CHANGED'
  | 'TASK_COMPLETED'
  | 'TASK_FAILED'
  | 'TIMER_EXPIRED';

export interface SystemEvent {
  id: string;
  type: EventType;
  timestamp: number;
  source: string;
  payload: any;
}

export interface AgentExecutionTrace {
  traceId: string;
  timestamp: number;
  query: string;
  stateTransitions: AssistantState[];
  plansGenerated: any[];
  toolCallsExecuted: ToolCall[];
  toolResults: ToolResult[];
  observationsRecorded: any[];
  telemetryMetrics: CommandTelemetryMetrics;
  verificationSuccess: boolean;
  replanningCount: number;
}
