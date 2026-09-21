import { AIPlan, AIPlanStep } from './AIProvider';
import { ToolResult, VisionResult, CommandTelemetryMetrics } from '../../shared/types';

export interface ExecutionContext {
  commandId: string;
  userInput: string;
  conversationHistory: Array<{ role: string; content: string }>;
  plan: AIPlan;
  executedToolResults: Map<string, ToolResult>;
  stepOutputs: Map<number, any>;
  visionResult?: VisionResult;
  metrics: CommandTelemetryMetrics;
  startTime: number;
}

export interface DAGNode {
  step: AIPlanStep;
  prerequisites: Set<number>;
  dependents: Set<number>;
  completed: boolean;
  failed: boolean;
}

export class ToolDependencyGraph {
  private nodes: Map<number, DAGNode> = new Map();

  constructor(steps: AIPlanStep[]) {
    this.buildGraph(steps);
  }

  private buildGraph(steps: AIPlanStep[]): void {
    // 1. Initialize nodes with duplicate step ID check
    for (const step of steps) {
      if (this.nodes.has(step.stepNumber)) {
        throw new Error(`Invalid Plan: Duplicate stepNumber ${step.stepNumber} detected.`);
      }
      this.nodes.set(step.stepNumber, {
        step,
        prerequisites: new Set(step.prerequisites || []),
        dependents: new Set(),
        completed: false,
        failed: false
      });
    }

    // 2. Build dependent edges & validate prerequisites
    for (const [stepNum, node] of this.nodes.entries()) {
      for (const prereqNum of node.prerequisites) {
        if (!this.nodes.has(prereqNum)) {
          throw new Error(`Invalid Plan: Step ${stepNum} references non-existent prerequisite Step ${prereqNum}.`);
        }
        if (prereqNum >= stepNum) {
          throw new Error(`Invalid Plan: Step ${stepNum} references forward/self prerequisite Step ${prereqNum}.`);
        }
        this.nodes.get(prereqNum)!.dependents.add(stepNum);
      }
    }

    // 3. Cycle Detection
    this.detectCycles();
  }

  private detectCycles(): void {
    const visited = new Set<number>();
    const recStack = new Set<number>();

    const dfs = (nodeId: number): boolean => {
      visited.add(nodeId);
      recStack.add(nodeId);

      const node = this.nodes.get(nodeId);
      if (node) {
        for (const depId of node.dependents) {
          if (!visited.has(depId)) {
            if (dfs(depId)) return true;
          } else if (recStack.has(depId)) {
            return true; // Cycle detected
          }
        }
      }

      recStack.delete(nodeId);
      return false;
    };

    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        if (dfs(nodeId)) {
          throw new Error(`Circular Dependency Detected in Tool Plan execution graph.`);
        }
      }
    }
  }

  /**
   * Returns steps whose prerequisites are fully completed and ready for execution.
   */
  public getExecutableBatches(): AIPlanStep[][] {
    const readyNodes: AIPlanStep[] = [];
    for (const node of this.nodes.values()) {
      if (!node.completed && !node.failed) {
        const allPrereqsMet = Array.from(node.prerequisites).every(
          pNum => this.nodes.get(pNum)?.completed
        );
        if (allPrereqsMet) {
          readyNodes.push(node.step);
        }
      }
    }

    if (readyNodes.length === 0) return [];

    // Separate into parallel-safe read-only steps vs write/dependent steps
    const parallelBatch = readyNodes.filter(s => s.isReadOnly);
    const sequentialBatch = readyNodes.filter(s => !s.isReadOnly);

    const batches: AIPlanStep[][] = [];
    if (parallelBatch.length > 0) {
      batches.push(parallelBatch);
    }
    if (sequentialBatch.length > 0) {
      // Non-readonly steps run sequentially one by one for safety
      sequentialBatch.forEach(s => batches.push([s]));
    }

    return batches;
  }

  public markCompleted(stepNumber: number): void {
    const node = this.nodes.get(stepNumber);
    if (node) node.completed = true;
  }

  public markFailed(stepNumber: number): void {
    const node = this.nodes.get(stepNumber);
    if (node) node.failed = true;
  }

  public isFinished(): boolean {
    return Array.from(this.nodes.values()).every(n => n.completed || n.failed);
  }
}
