import { ComputerTaskState, TaskStateTransition } from '../../../shared/types/action';
import { eventBus } from '../../../shared/events';

export class TaskStateMachine {
  private currentState: ComputerTaskState;
  private transitions: TaskStateTransition[] = [];
  private taskId: string;

  private static readonly VALID_TRANSITIONS: Record<ComputerTaskState, ComputerTaskState[]> = {
    IDLE: ['UNDERSTANDING', 'OBSERVING', 'PLANNING', 'CANCELLED', 'ESTOPPED'],
    UNDERSTANDING: ['OBSERVING', 'PLANNING', 'FAILED', 'CANCELLED', 'ESTOPPED'],
    OBSERVING: ['PLANNING', 'EXECUTING', 'VERIFYING', 'FAILED', 'CANCELLED', 'ESTOPPED'],
    PLANNING: ['AWAITING_APPROVAL', 'EXECUTING', 'FAILED', 'CANCELLED', 'ESTOPPED'],
    AWAITING_APPROVAL: ['EXECUTING', 'PAUSED', 'FAILED', 'CANCELLED', 'ESTOPPED'],
    EXECUTING: ['VERIFYING', 'RECOVERING', 'PAUSED', 'COMPLETED', 'FAILED', 'CANCELLED', 'ESTOPPED'],
    VERIFYING: ['EXECUTING', 'RECOVERING', 'COMPLETED', 'FAILED', 'CANCELLED', 'ESTOPPED'],
    RECOVERING: ['EXECUTING', 'VERIFYING', 'FAILED', 'CANCELLED', 'ESTOPPED'],
    PAUSED: ['EXECUTING', 'CANCELLED', 'ESTOPPED'],
    COMPLETED: ['IDLE'],
    FAILED: ['IDLE', 'PLANNING'],
    CANCELLED: ['IDLE'],
    ESTOPPED: ['IDLE']
  };

  constructor(taskId: string, initialState: ComputerTaskState = 'IDLE') {
    this.taskId = taskId;
    this.currentState = initialState;
  }

  public getState(): ComputerTaskState {
    return this.currentState;
  }

  public getTransitions(): TaskStateTransition[] {
    return [...this.transitions];
  }

  public transition(toState: ComputerTaskState, reason?: string, actionId?: string): boolean {
    if (this.currentState === toState) {
      return true;
    }

    if (toState === 'ESTOPPED' || toState === 'CANCELLED') {
      const record: TaskStateTransition = {
        fromState: this.currentState,
        toState,
        timestamp: Date.now(),
        reason: reason || ('Preempted by ' + toState),
        actionId
      };
      this.currentState = toState;
      this.transitions.push(record);
      eventBus.logActivity('PROCESSING', 'Task [' + this.taskId + '] transitioned to ' + toState + ': ' + record.reason);
      return true;
    }

    const validTargets = TaskStateMachine.VALID_TRANSITIONS[this.currentState] || [];
    if (!validTargets.includes(toState)) {
      eventBus.logActivity(
        'ERROR_EVENT',
        'Illegal state transition rejected for task [' + this.taskId + ']: ' + this.currentState + ' -> ' + toState
      );
      return false;
    }

    const record: TaskStateTransition = {
      fromState: this.currentState,
      toState,
      timestamp: Date.now(),
      reason,
      actionId
    };
    this.currentState = toState;
    this.transitions.push(record);
    eventBus.logActivity('PROCESSING', 'Task [' + this.taskId + '] state: ' + this.currentState + ' (reason: ' + (reason || 'none') + ')');
    return true;
  }
}