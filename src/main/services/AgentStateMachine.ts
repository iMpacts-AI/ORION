import { AssistantState, OrionMode, ToolCall, ToolResult, VisionResult, CommandTelemetryMetrics } from '../../shared/types';
import { eventBus } from '../../shared/events';

export type AgentLoopState = AssistantState;

export interface AgentLoopConfig {
  maxReasoningIterations: number;
  maxToolCalls: number;
  maxWallClockMs: number;
  maxReplans: number;
  maxContextGrowthChars: number;
}

export const DEFAULT_AGENT_CONFIG: AgentLoopConfig = {
  maxReasoningIterations: 10,
  maxToolCalls: 20,
  maxWallClockMs: 30000,
  maxReplans: 3,
  maxContextGrowthChars: 128000
};

export class AgentStateMachine {
  private currentState: AgentLoopState = 'STANDBY';
  private previousState: AgentLoopState = 'STANDBY';

  // Valid State Transitions Map
  private validTransitions: Map<AgentLoopState, Set<AgentLoopState>> = new Map<AgentLoopState, Set<AgentLoopState>>([
    ['STANDBY', new Set<AgentLoopState>(['IDLE', 'LISTENING', 'UNDERSTANDING', 'THINKING', 'CANCELLED', 'FAILED'])],
    ['IDLE', new Set<AgentLoopState>(['LISTENING', 'UNDERSTANDING', 'PLANNING', 'CANCELLED'])],
    ['LISTENING', new Set<AgentLoopState>(['UNDERSTANDING', 'CANCELLED', 'FAILED'])],
    ['UNDERSTANDING', new Set<AgentLoopState>(['PLANNING', 'THINKING', 'VISION', 'CANCELLED', 'FAILED'])],
    ['PLANNING', new Set<AgentLoopState>(['EXECUTING', 'VISION', 'REASONING', 'CANCELLED', 'FAILED'])],
    ['EXECUTING', new Set<AgentLoopState>(['OBSERVING', 'REASONING', 'REPLANNING', 'VERIFYING', 'CANCELLED', 'FAILED'])],
    ['OBSERVING', new Set<AgentLoopState>(['REASONING', 'VERIFYING', 'CANCELLED', 'FAILED'])],
    ['REASONING', new Set<AgentLoopState>(['PLANNING', 'EXECUTING', 'REPLANNING', 'VERIFYING', 'RESPONDING', 'CANCELLED', 'FAILED'])],
    ['REPLANNING', new Set<AgentLoopState>(['PLANNING', 'EXECUTING', 'CANCELLED', 'FAILED'])],
    ['VERIFYING', new Set<AgentLoopState>(['RESPONDING', 'REPLANNING', 'CANCELLED', 'FAILED'])],
    ['RESPONDING', new Set<AgentLoopState>(['SPEAKING', 'STANDBY', 'IDLE', 'CANCELLED', 'FAILED'])],
    ['SPEAKING', new Set<AgentLoopState>(['STANDBY', 'IDLE', 'CANCELLED', 'FAILED'])],
    ['VISION', new Set<AgentLoopState>(['OBSERVING', 'REASONING', 'PLANNING', 'CANCELLED', 'FAILED'])],
    ['THINKING', new Set<AgentLoopState>(['PLANNING', 'EXECUTING', 'VISION', 'RESPONDING', 'CANCELLED', 'FAILED'])],
    ['WAITING', new Set<AgentLoopState>(['EXECUTING', 'REASONING', 'CANCELLED', 'FAILED'])],
    ['CANCELLED', new Set<AgentLoopState>(['STANDBY', 'IDLE'])],
    ['FAILED', new Set<AgentLoopState>(['STANDBY', 'IDLE', 'ERROR'])],
    ['ERROR', new Set<AgentLoopState>(['STANDBY', 'IDLE'])]
  ]);

  public getState(): AgentLoopState {
    return this.currentState;
  }

  public transitionTo(newState: AgentLoopState): void {
    if (this.currentState === newState) return;

    const allowed = this.validTransitions.get(this.currentState);
    if (allowed && !allowed.has(newState)) {
      eventBus.logActivity('ERROR_EVENT', `Invalid Agent State Transition attempted: ${this.currentState} -> ${newState}. Forcing safe recovery.`);
    }

    this.previousState = this.currentState;
    this.currentState = newState;
    eventBus.emit('assistant.state.changed', { state: newState, previousState: this.previousState });
  }

  public reset(): void {
    this.transitionTo('STANDBY');
  }
}
