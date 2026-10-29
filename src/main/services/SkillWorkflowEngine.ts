import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ToolService } from './ToolService';
import { ToolDependencyGraph } from './ExecutionContext';
import { AIPlanStep } from './AIProvider';
import { ToolCall, ToolResult } from '../../shared/types';
import { ActionRiskEvaluator } from './ActionRiskEvaluator';
import { UnifiedMemoryManager } from './UnifiedMemoryManager';
import { eventBus } from '../../shared/events';

export interface WorkflowStepSpec extends Omit<AIPlanStep, 'actionDescription'> {
  actionDescription?: string;
  description?: string;
  maxRetries?: number;
  idempotent?: boolean;
  dependsOnStepNumbers?: number[];
  verifyOutput?: (data: any) => boolean;
}

export type WorkflowStepStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'BLOCKED' | 'SKIPPED';

export interface PersistedWorkflowStepRecord {
  stepNumber: number;
  toolToCall: string;
  description: string;
  toolArguments?: Record<string, any>;
  dependsOnStepNumbers?: number[];
  isReadOnly?: boolean;
  idempotent?: boolean;
  maxRetries?: number;
  status: WorkflowStepStatus;
  attempts: number;
  verified: boolean;
  safeOutput?: any;
  error?: string;
  completedAt?: number;
}

export interface PersistedWorkflowCheckpoint {
  version: number;
  workflowId: string;
  goal: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'BLOCKED' | 'CANCELLED';
  definitionHash: string;
  integrityHash: string;
  createdAt: number;
  updatedAt: number;
  stepsCompleted: number;
  stepsTotal: number;
  verifiedCount: number;
  steps: PersistedWorkflowStepRecord[];
  lastError?: string;
}

export interface WorkflowExecutionResult {
  workflowId: string;
  goal: string;
  status: 'COMPLETED' | 'FAILED' | 'BLOCKED' | 'CANCELLED';
  stepsCompleted: number;
  stepsTotal: number;
  verifiedCount: number;
  results: ToolResult[];
  stepOutputs: Record<number, any>;
  totalDurationMs: number;
  resumedFromStep?: number;
  checkpointPath?: string;
  error?: string;
}

/**
 * Dependency-Aware Composable & Resumable Skill Workflow Engine for ORION.
 * - Validates capability registration, argument schemas, and permission boundaries before execution.
 * - Persists workflow definitions, step statuses, redacted safe outputs, and SHA-256 integrity checkpoints.
 * - Resumes interrupted/failed/cancelled workflows from the last verified checkpoint without repeating
 *   already-verified non-idempotent actions.
 * - Requires renewed explicit authorization when resuming workflows that contain remaining high-risk
 *   or consequential external actions.
 */
export class SkillWorkflowEngine {
  private toolService: ToolService;
  private riskEvaluator: ActionRiskEvaluator;
  private checkpointDir: string;
  private activeWorkflowLocks: Set<string> = new Set();

  constructor(toolService: ToolService, riskEvaluator?: ActionRiskEvaluator, customCheckpointDir?: string) {
    this.toolService = toolService;
    this.riskEvaluator = riskEvaluator || new ActionRiskEvaluator();
    this.checkpointDir = customCheckpointDir || path.resolve(process.cwd(), '.orion_memory', 'workflows');
    if (!fs.existsSync(this.checkpointDir)) {
      try {
        fs.mkdirSync(this.checkpointDir, { recursive: true });
      } catch {}
    }
  }

  public static isValidWorkflowId(workflowId: string): boolean {
    if (!workflowId || typeof workflowId !== 'string' || !workflowId.trim()) return false;
    if (workflowId.includes('..') || workflowId.includes('/') || workflowId.includes('\\') || workflowId.includes('\0')) {
      return false;
    }
    return /^[a-zA-Z0-9_-]{1,128}$/.test(workflowId);
  }

  public getCheckpointDir(): string {
    return this.checkpointDir;
  }

  public static redactSensitiveData(value: any): any {
    if (value === null || value === undefined) return value;
    if (typeof value === 'string') {
      return UnifiedMemoryManager.sanitizeSecrets(value);
    }
    if (Array.isArray(value)) {
      return value.map(item => SkillWorkflowEngine.redactSensitiveData(item));
    }
    if (typeof value === 'object') {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(value)) {
        if (/^(password|passwd|secret|api[_-]?key|token|authorization|private[_-]?key|client[_-]?secret)$/i.test(k)) {
          out[k] = '[REDACTED_SECRET]';
        } else {
          out[k] = SkillWorkflowEngine.redactSensitiveData(v);
        }
      }
      return out;
    }
    return value;
  }

  public static computeDefinitionHash(steps: Array<{ stepNumber: number; toolToCall?: string }>): string {
    const canonical = steps.map(s => `${s.stepNumber}:${s.toolToCall || ''}`).join('|');
    return crypto.createHash('sha256').update(canonical, 'utf8').digest('hex');
  }

  public static computeCheckpointIntegrityHash(cp: Omit<PersistedWorkflowCheckpoint, 'integrityHash'>): string {
    const payload = JSON.stringify({
      version: cp.version,
      workflowId: cp.workflowId,
      goal: cp.goal,
      status: cp.status,
      definitionHash: cp.definitionHash,
      stepsCompleted: cp.stepsCompleted,
      stepsTotal: cp.stepsTotal,
      verifiedCount: cp.verifiedCount,
      steps: cp.steps.map(s => ({
        stepNumber: s.stepNumber,
        toolToCall: s.toolToCall,
        status: s.status,
        verified: s.verified,
        safeOutput: s.safeOutput
      }))
    });
    return crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
  }

  private getCheckpointFilePath(workflowId: string): string {
    if (!SkillWorkflowEngine.isValidWorkflowId(workflowId)) {
      throw new Error(`SECURITY POLICY VIOLATION: Invalid or unsafe workflowId '${workflowId}'. Path traversal or special characters are prohibited.`);
    }
    return path.join(this.checkpointDir, `${workflowId}.json`);
  }

  public saveCheckpoint(cp: Omit<PersistedWorkflowCheckpoint, 'integrityHash'>): PersistedWorkflowCheckpoint {
    const filePath = this.getCheckpointFilePath(cp.workflowId);
    const full: PersistedWorkflowCheckpoint = {
      ...cp,
      integrityHash: SkillWorkflowEngine.computeCheckpointIntegrityHash(cp)
    };
    try {
      if (!fs.existsSync(this.checkpointDir)) {
        fs.mkdirSync(this.checkpointDir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(full, null, 2), 'utf8');
    } catch {}
    return full;
  }

  public loadCheckpoint(workflowId: string): {
    valid: boolean;
    checkpoint?: PersistedWorkflowCheckpoint;
    error?: string;
  } {
    if (!SkillWorkflowEngine.isValidWorkflowId(workflowId)) {
      return {
        valid: false,
        error: `SECURITY POLICY VIOLATION: Invalid or unsafe workflowId '${workflowId}' rejected.`
      };
    }
    const filePath = this.getCheckpointFilePath(workflowId);
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: `Workflow checkpoint '${workflowId}' not found.` };
    }

    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw) as PersistedWorkflowCheckpoint;
      if (
        !parsed ||
        typeof parsed !== 'object' ||
        typeof parsed.workflowId !== 'string' ||
        !Array.isArray(parsed.steps) ||
        typeof parsed.integrityHash !== 'string'
      ) {
        return { valid: false, error: `Checkpoint '${workflowId}' is malformed or missing required schema fields.` };
      }

      if (parsed.version !== 1) {
        return {
          valid: false,
          error: `UNSUPPORTED CHECKPOINT VERSION: Checkpoint '${workflowId}' has version '${parsed.version}', expected version 1.`
        };
      }

      if (parsed.workflowId !== workflowId) {
        return {
          valid: false,
          error: `CHECKPOINT INTEGRITY VIOLATION: Checkpoint workflowId '${parsed.workflowId}' does not match requested '${workflowId}'.`
        };
      }

      const { integrityHash, ...rest } = parsed;
      const expectedHash = SkillWorkflowEngine.computeCheckpointIntegrityHash(rest);
      if (integrityHash !== expectedHash) {
        return {
          valid: false,
          error: `CHECKPOINT INTEGRITY VIOLATION: Checkpoint '${workflowId}' failed SHA-256 tamper/corruption verification.`
        };
      }

      return { valid: true, checkpoint: parsed };
    } catch (err: any) {
      return { valid: false, error: `Corrupted checkpoint JSON for '${workflowId}': ${err.message}` };
    }
  }

  public listCheckpoints(): PersistedWorkflowCheckpoint[] {
    if (!fs.existsSync(this.checkpointDir)) return [];
    const out: PersistedWorkflowCheckpoint[] = [];
    for (const file of fs.readdirSync(this.checkpointDir)) {
      if (!file.endsWith('.json')) continue;
      const wfId = file.slice(0, -5);
      const loaded = this.loadCheckpoint(wfId);
      if (loaded.valid && loaded.checkpoint) {
        out.push(loaded.checkpoint);
      }
    }
    return out.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  public async executeWorkflow(
    goal: string,
    steps: WorkflowStepSpec[],
    options?: {
      workflowId?: string;
      allowHighRisk?: boolean;
      signal?: AbortSignal;
      existingCheckpoint?: PersistedWorkflowCheckpoint;
    }
  ): Promise<WorkflowExecutionResult> {
    const startTime = Date.now();
    const existingCp = options?.existingCheckpoint;
    const workflowId = existingCp?.workflowId || options?.workflowId || `wf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    if (!SkillWorkflowEngine.isValidWorkflowId(workflowId)) {
      return {
        workflowId,
        goal,
        status: 'FAILED',
        stepsCompleted: 0,
        stepsTotal: steps?.length || 0,
        verifiedCount: 0,
        results: [],
        stepOutputs: {},
        totalDurationMs: Date.now() - startTime,
        error: `SECURITY POLICY VIOLATION: Invalid or unsafe workflowId '${workflowId}'.`
      };
    }

    if (this.activeWorkflowLocks.has(workflowId)) {
      return {
        workflowId,
        goal,
        status: 'BLOCKED',
        stepsCompleted: existingCp?.stepsCompleted || 0,
        stepsTotal: steps?.length || 0,
        verifiedCount: existingCp?.verifiedCount || 0,
        results: [],
        stepOutputs: {},
        totalDurationMs: Date.now() - startTime,
        error: `CONCURRENT_WORKFLOW_LOCK: Workflow '${workflowId}' is already executing or being resumed.`
      };
    }

    this.activeWorkflowLocks.add(workflowId);
    try {
      return await this._executeWorkflowInternal(workflowId, goal, steps, startTime, options);
    } finally {
      this.activeWorkflowLocks.delete(workflowId);
    }
  }

  private async _executeWorkflowInternal(
    workflowId: string,
    goal: string,
    steps: WorkflowStepSpec[],
    startTime: number,
    options?: {
      workflowId?: string;
      allowHighRisk?: boolean;
      signal?: AbortSignal;
      existingCheckpoint?: PersistedWorkflowCheckpoint;
    }
  ): Promise<WorkflowExecutionResult> {
    const existingCp = options?.existingCheckpoint;
    const registry = this.toolService.getRegistry();
    const results: ToolResult[] = [];
    const stepOutputs: Record<number, any> = {};

    if (!steps || steps.length === 0) {
      return {
        workflowId,
        goal,
        status: 'FAILED',
        stepsCompleted: 0,
        stepsTotal: 0,
        verifiedCount: 0,
        results: [],
        stepOutputs: {},
        totalDurationMs: Date.now() - startTime,
        error: 'Workflow contains zero steps.'
      };
    }

    const definitionHash = SkillWorkflowEngine.computeDefinitionHash(steps);
    if (existingCp && existingCp.definitionHash !== definitionHash) {
      return {
        workflowId,
        goal,
        status: 'FAILED',
        stepsCompleted: existingCp.stepsCompleted,
        stepsTotal: steps.length,
        verifiedCount: existingCp.verifiedCount,
        results: [],
        stepOutputs: {},
        totalDurationMs: Date.now() - startTime,
        error: `WORKFLOW INCOMPATIBLE: Provided workflow steps do not match checkpoint definition hash for '${workflowId}'.`
      };
    }

    // Seed verified steps from checkpoint so non-idempotent completed steps are NEVER blindly repeated
    const alreadyVerifiedStepNums = new Set<number>();
    const stepRecordMap = new Map<number, PersistedWorkflowStepRecord>();

    for (const s of steps) {
      const prior = existingCp?.steps.find(ps => ps.stepNumber === s.stepNumber);
      if (prior && prior.status === 'COMPLETED' && prior.verified) {
        alreadyVerifiedStepNums.add(s.stepNumber);
        stepOutputs[s.stepNumber] = prior.safeOutput;
        stepRecordMap.set(s.stepNumber, { ...prior });
      } else {
        stepRecordMap.set(s.stepNumber, {
          stepNumber: s.stepNumber,
          toolToCall: s.toolToCall || '',
          description: s.actionDescription || s.description || '',
          toolArguments: SkillWorkflowEngine.redactSensitiveData(s.toolArguments || {}),
          dependsOnStepNumbers: s.prerequisites || s.dependsOnStepNumbers,
          isReadOnly: s.isReadOnly,
          idempotent: s.idempotent,
          maxRetries: s.maxRetries,
          status: 'PENDING',
          attempts: prior?.attempts || 0,
          verified: false
        });
      }
    }

    const createdAt = existingCp?.createdAt || Date.now();
    const persistState = (
      status: PersistedWorkflowCheckpoint['status'],
      lastError?: string
    ): PersistedWorkflowCheckpoint => {
      const records = steps.map(s => stepRecordMap.get(s.stepNumber)!);
      const completed = records.filter(r => r.status === 'COMPLETED' && r.verified).length;
      return this.saveCheckpoint({
        version: 1,
        workflowId,
        goal: SkillWorkflowEngine.redactSensitiveData(goal),
        status,
        definitionHash,
        createdAt,
        updatedAt: Date.now(),
        stepsCompleted: completed,
        stepsTotal: steps.length,
        verifiedCount: completed,
        steps: records,
        lastError: lastError ? SkillWorkflowEngine.redactSensitiveData(lastError) : undefined
      });
    };

    // 1. Pre-flight Capability, Argument Schema, and Security Policy Validation for REMAINING steps
    for (const step of steps) {
      if (alreadyVerifiedStepNums.has(step.stepNumber)) {
        continue;
      }

      const toolId = step.toolToCall || '';
      const tool = registry.getTool(toolId);
      if (!tool) {
        const err = `Unregistered skill '${step.toolToCall}' in step ${step.stepNumber}.`;
        persistState('FAILED', err);
        return {
          workflowId,
          goal,
          status: 'FAILED',
          stepsCompleted: alreadyVerifiedStepNums.size,
          stepsTotal: steps.length,
          verifiedCount: alreadyVerifiedStepNums.size,
          results,
          stepOutputs,
          totalDurationMs: Date.now() - startTime,
          checkpointPath: this.getCheckpointFilePath(workflowId),
          error: err
        };
      }

      const args = step.toolArguments || {};
      const hasDynamicRef = Object.values(args).some(
        v => typeof v === 'string' && v.includes('${step.')
      );
      if (!hasDynamicRef) {
        const schemaCheck = registry.validateToolArguments(tool.id, args);
        if (!schemaCheck.valid) {
          const err = schemaCheck.errors.join(' ');
          persistState('FAILED', err);
          return {
            workflowId,
            goal,
            status: 'FAILED',
            stepsCompleted: alreadyVerifiedStepNums.size,
            stepsTotal: steps.length,
            verifiedCount: alreadyVerifiedStepNums.size,
            results,
            stepOutputs,
            totalDurationMs: Date.now() - startTime,
            checkpointPath: this.getCheckpointFilePath(workflowId),
            error: err
          };
        }
      }

      const risk = this.riskEvaluator.evaluateRisk(
        tool.id === 'file.write_text' ? 'WRITE_FILE' : tool.id === 'file.read_text' ? 'READ_FILE' : 'WAIT',
        args
      );
      if (risk === 'CRITICAL' || tool.permissionLevel === 'CRITICAL') {
        const err = `SECURITY POLICY VIOLATION: Step ${step.stepNumber} ('${tool.id}') targets a CRITICAL restricted boundary.`;
        const rec = stepRecordMap.get(step.stepNumber)!;
        rec.status = 'BLOCKED';
        rec.error = err;
        persistState('BLOCKED', err);
        return {
          workflowId,
          goal,
          status: 'BLOCKED',
          stepsCompleted: alreadyVerifiedStepNums.size,
          stepsTotal: steps.length,
          verifiedCount: alreadyVerifiedStepNums.size,
          results,
          stepOutputs,
          totalDurationMs: Date.now() - startTime,
          checkpointPath: this.getCheckpointFilePath(workflowId),
          error: err
        };
      }

      if ((tool.permissionLevel === 'HIGH' || tool.requiresApproval) && !options?.allowHighRisk) {
        const err = `AUTHORIZATION REQUIRED: Step ${step.stepNumber} ('${tool.id}') requires explicit high-risk authorization.`;
        const rec = stepRecordMap.get(step.stepNumber)!;
        rec.status = 'BLOCKED';
        rec.error = err;
        persistState('BLOCKED', err);
        return {
          workflowId,
          goal,
          status: 'BLOCKED',
          stepsCompleted: alreadyVerifiedStepNums.size,
          stepsTotal: steps.length,
          verifiedCount: alreadyVerifiedStepNums.size,
          results,
          stepOutputs,
          totalDurationMs: Date.now() - startTime,
          checkpointPath: this.getCheckpointFilePath(workflowId),
          error: err
        };
      }
    }

    // 2. Build Dependency Graph (validates cycles and forward references)
    const normalizedSteps: AIPlanStep[] = steps.map(s => ({
      ...s,
      actionDescription: s.actionDescription || s.description || `Step ${s.stepNumber}`,
      prerequisites: s.prerequisites || s.dependsOnStepNumbers || []
    }));
    let graph: ToolDependencyGraph;
    try {
      graph = new ToolDependencyGraph(normalizedSteps);
    } catch (err: any) {
      persistState('FAILED', err.message);
      return {
        workflowId,
        goal,
        status: 'FAILED',
        stepsCompleted: alreadyVerifiedStepNums.size,
        stepsTotal: steps.length,
        verifiedCount: alreadyVerifiedStepNums.size,
        results,
        stepOutputs,
        totalDurationMs: Date.now() - startTime,
        checkpointPath: this.getCheckpointFilePath(workflowId),
        error: err.message
      };
    }

    // Pre-mark already verified steps in the DAG so execution resumes cleanly from the first incomplete step
    let resumedFromStep: number | undefined;
    for (const s of steps) {
      if (alreadyVerifiedStepNums.has(s.stepNumber)) {
        graph.markCompleted(s.stepNumber);
      } else if (resumedFromStep === undefined && existingCp) {
        resumedFromStep = s.stepNumber;
      }
    }

    const stepMap = new Map<number, WorkflowStepSpec>(steps.map(s => [s.stepNumber, s]));
    let stepsCompleted = alreadyVerifiedStepNums.size;
    let verifiedCount = alreadyVerifiedStepNums.size;
    persistState('RUNNING');

    // 3. Execute Batches Respecting Dependencies, Parallel Safety, Bounded Retries, & Outcome Verification
    while (!graph.isFinished()) {
      if (options?.signal?.aborted) {
        const err = 'Workflow cancelled via AbortSignal.';
        persistState('CANCELLED', err);
        return {
          workflowId,
          goal,
          status: 'CANCELLED',
          stepsCompleted,
          stepsTotal: steps.length,
          verifiedCount,
          results,
          stepOutputs,
          totalDurationMs: Date.now() - startTime,
          resumedFromStep,
          checkpointPath: this.getCheckpointFilePath(workflowId),
          error: err
        };
      }

      const batches = graph.getExecutableBatches();
      if (batches.length === 0) break;

      for (const batch of batches) {
        if (options?.signal?.aborted) {
          const err = 'Workflow cancelled via AbortSignal.';
          persistState('CANCELLED', err);
          return {
            workflowId,
            goal,
            status: 'CANCELLED',
            stepsCompleted,
            stepsTotal: steps.length,
            verifiedCount,
            results,
            stepOutputs,
            totalDurationMs: Date.now() - startTime,
            resumedFromStep,
            checkpointPath: this.getCheckpointFilePath(workflowId),
            error: err
          };
        }

        const isParallelSafe =
          batch.length > 1 &&
          batch.every(s => {
            const t = registry.getTool(s.toolToCall || '');
            return t && t.permissionLevel === 'LOW' && t.isReadOnly !== false;
          });

        const runSingleStep = async (planStep: AIPlanStep): Promise<{ ok: boolean; cancelled?: boolean; error?: string }> => {
          const spec: WorkflowStepSpec = stepMap.get(planStep.stepNumber) || (planStep as WorkflowStepSpec);
          const rec = stepRecordMap.get(spec.stepNumber)!;
          const tool = registry.getTool(spec.toolToCall || '')!;

          if (options?.signal?.aborted) {
            return { ok: false, cancelled: true, error: 'Workflow cancelled via AbortSignal.' };
          }

          rec.status = 'RUNNING';
          persistState('RUNNING');

          // Resolve ${step.N.output.key} substitutions
          const resolvedArgs: Record<string, any> = { ...(spec.toolArguments || {}) };
          let hadDynamicSubstitution = false;
          for (const [k, v] of Object.entries(resolvedArgs)) {
            if (typeof v === 'string' && v.includes('${step.')) {
              hadDynamicSubstitution = true;
              resolvedArgs[k] = v.replace(/\$\{step\.(\d+)\.output(?:\.([^}]+))?\}/g, (_m, sNum, prop) => {
                const out = stepOutputs[parseInt(sNum, 10)];
                if (out === undefined || out === null) return '';
                if (prop) return out[prop] !== undefined ? String(out[prop]) : '';
                return typeof out === 'object' ? JSON.stringify(out) : String(out);
              });
            }
          }

          // Re-validate argument schema, prompt-injection safety, and risk boundaries AFTER resolving step output substitutions
          if (hadDynamicSubstitution) {
            const postSubSchema = registry.validateToolArguments(tool.id, resolvedArgs);
            if (!postSubSchema.valid) {
              const errMsg = `Step ${spec.stepNumber} substituted arguments failed schema validation: ${postSubSchema.errors.join(' ')}`;
              rec.status = 'FAILED';
              rec.verified = false;
              rec.error = SkillWorkflowEngine.redactSensitiveData(errMsg);
              graph.markFailed(spec.stepNumber);
              persistState('FAILED', errMsg);
              return { ok: false, error: errMsg };
            }

            for (const [argKey, argVal] of Object.entries(resolvedArgs)) {
              if (typeof argVal === 'string' && UnifiedMemoryManager.isPromptInjectionAttempt(argVal)) {
                const errMsg = `SECURITY POLICY VIOLATION: Step ${spec.stepNumber} dynamic argument '${argKey}' contains untrusted prompt-injection payload.`;
                rec.status = 'BLOCKED';
                rec.verified = false;
                rec.error = errMsg;
                graph.markFailed(spec.stepNumber);
                persistState('BLOCKED', errMsg);
                return { ok: false, error: errMsg };
              }
            }

            const postSubRisk = this.riskEvaluator.evaluateRisk(
              tool.id === 'file.write_text' ? 'WRITE_FILE' : tool.id === 'file.read_text' ? 'READ_FILE' : 'WAIT',
              resolvedArgs
            );
            if (postSubRisk === 'CRITICAL') {
              const errMsg = `SECURITY POLICY VIOLATION: Step ${spec.stepNumber} ('${tool.id}') substituted arguments target a CRITICAL restricted boundary.`;
              rec.status = 'BLOCKED';
              rec.verified = false;
              rec.error = errMsg;
              graph.markFailed(spec.stepNumber);
              persistState('BLOCKED', errMsg);
              return { ok: false, error: errMsg };
            }
          }

          const maxAttempts = Math.min(3, Math.max(1, (spec.maxRetries ?? 0) + 1));
          let lastRes: ToolResult | undefined;

          for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            if (options?.signal?.aborted) {
              return { ok: false, cancelled: true, error: 'Workflow cancelled via AbortSignal.' };
            }

            rec.attempts++;
            const call: ToolCall = {
              id: `wf_call_${workflowId}_${spec.stepNumber}_${rec.attempts}`,
              toolId: tool.id,
              toolName: tool.name,
              arguments: resolvedArgs,
              timestamp: Date.now(),
              requiresUserApproval: Boolean(options?.allowHighRisk)
            };

            lastRes = await this.toolService.executeTool(call);

            const customVerified = spec.verifyOutput ? Boolean(spec.verifyOutput(lastRes.data)) : true;
            const stepVerified =
              lastRes.success &&
              lastRes.verificationStatus !== 'FAILED' &&
              lastRes.verified !== false &&
              customVerified;

            if (stepVerified) {
              const redactedData = SkillWorkflowEngine.redactSensitiveData(lastRes.data);
              const safeResult: ToolResult = {
                ...lastRes,
                data: redactedData
              };
              results.push(safeResult);
              stepOutputs[spec.stepNumber] = redactedData;
              rec.status = 'COMPLETED';
              rec.verified = true;
              rec.safeOutput = redactedData;
              rec.error = undefined;
              rec.completedAt = Date.now();
              graph.markCompleted(spec.stepNumber);
              stepsCompleted++;
              verifiedCount++;
              persistState('RUNNING');
              return { ok: true };
            }

            if (!customVerified && lastRes.success) {
              lastRes.success = false;
              lastRes.verificationStatus = 'FAILED';
              lastRes.error = `Step ${spec.stepNumber} output failed workflow verification predicate.`;
            }
          }

          if (lastRes) results.push(lastRes);
          const errMsg = lastRes?.error || `Step ${spec.stepNumber} failed.`;
          rec.status = 'FAILED';
          rec.verified = false;
          rec.error = SkillWorkflowEngine.redactSensitiveData(errMsg);
          graph.markFailed(spec.stepNumber);
          persistState('FAILED', errMsg);
          return { ok: false, error: errMsg };
        };

        if (isParallelSafe) {
          const outcomes = await Promise.all(batch.map(s => runSingleStep(s)));
          const cancelledOutcome = outcomes.find(o => o.cancelled);
          if (cancelledOutcome) {
            persistState('CANCELLED', cancelledOutcome.error);
            return {
              workflowId,
              goal,
              status: 'CANCELLED',
              stepsCompleted,
              stepsTotal: steps.length,
              verifiedCount,
              results,
              stepOutputs,
              totalDurationMs: Date.now() - startTime,
              resumedFromStep,
              checkpointPath: this.getCheckpointFilePath(workflowId),
              error: cancelledOutcome.error
            };
          }
          const failedOutcome = outcomes.find(o => !o.ok);
          if (failedOutcome) {
            persistState('FAILED', failedOutcome.error);
            return {
              workflowId,
              goal,
              status: 'FAILED',
              stepsCompleted,
              stepsTotal: steps.length,
              verifiedCount,
              results,
              stepOutputs,
              totalDurationMs: Date.now() - startTime,
              resumedFromStep,
              checkpointPath: this.getCheckpointFilePath(workflowId),
              error: failedOutcome.error
            };
          }
        } else {
          for (const s of batch) {
            const outcome = await runSingleStep(s);
            if (outcome.cancelled) {
              persistState('CANCELLED', outcome.error);
              return {
                workflowId,
                goal,
                status: 'CANCELLED',
                stepsCompleted,
                stepsTotal: steps.length,
                verifiedCount,
                results,
                stepOutputs,
                totalDurationMs: Date.now() - startTime,
                resumedFromStep,
                checkpointPath: this.getCheckpointFilePath(workflowId),
                error: outcome.error
              };
            }
            if (!outcome.ok) {
              persistState('FAILED', outcome.error);
              return {
                workflowId,
                goal,
                status: 'FAILED',
                stepsCompleted,
                stepsTotal: steps.length,
                verifiedCount,
                results,
                stepOutputs,
                totalDurationMs: Date.now() - startTime,
                resumedFromStep,
                checkpointPath: this.getCheckpointFilePath(workflowId),
                error: outcome.error
              };
            }
          }
        }
      }
    }

    const allVerified = stepsCompleted === steps.length && verifiedCount === steps.length;
    const finalStatus = allVerified ? 'COMPLETED' : 'FAILED';
    persistState(finalStatus, allVerified ? undefined : 'Not all workflow steps completed and verified.');

    eventBus.logActivity(
      allVerified ? 'TASK_COMPLETE' : 'ERROR_EVENT',
      `Workflow [${workflowId}] "${goal}" finished with status ${finalStatus} (${verifiedCount}/${steps.length} verified).`
    );

    return {
      workflowId,
      goal,
      status: finalStatus,
      stepsCompleted,
      stepsTotal: steps.length,
      verifiedCount,
      results,
      stepOutputs,
      totalDurationMs: Date.now() - startTime,
      resumedFromStep,
      checkpointPath: this.getCheckpointFilePath(workflowId),
      error: allVerified ? undefined : 'Not all workflow steps completed and verified.'
    };
  }

  /**
   * Resumes a previously interrupted, failed, or blocked workflow from its last verified checkpoint.
   * - Validates SHA-256 checkpoint integrity and optional step compatibility.
   * - Never repeats already-verified non-idempotent steps.
   * - Requires renewed explicit `allowHighRisk: true` authorization if remaining steps include HIGH-risk actions.
   */
  public async resumeWorkflow(
    workflowId: string,
    options?: {
      steps?: WorkflowStepSpec[];
      allowHighRisk?: boolean;
      allowRetryInDoubtNonIdempotent?: boolean;
      signal?: AbortSignal;
    }
  ): Promise<WorkflowExecutionResult> {
    const startTime = Date.now();
    if (this.activeWorkflowLocks.has(workflowId)) {
      return {
        workflowId,
        goal: '',
        status: 'BLOCKED',
        stepsCompleted: 0,
        stepsTotal: 0,
        verifiedCount: 0,
        results: [],
        stepOutputs: {},
        totalDurationMs: Date.now() - startTime,
        error: `CONCURRENT_WORKFLOW_LOCK: Workflow '${workflowId}' is already executing or being resumed.`
      };
    }

    const loaded = this.loadCheckpoint(workflowId);
    if (!loaded.valid || !loaded.checkpoint) {
      return {
        workflowId,
        goal: '',
        status: 'FAILED',
        stepsCompleted: 0,
        stepsTotal: 0,
        verifiedCount: 0,
        results: [],
        stepOutputs: {},
        totalDurationMs: Date.now() - startTime,
        error: loaded.error || `Cannot resume workflow '${workflowId}'.`
      };
    }

    const cp = loaded.checkpoint;
    if (cp.status === 'COMPLETED') {
      const outputs: Record<number, any> = {};
      for (const s of cp.steps) {
        outputs[s.stepNumber] = s.safeOutput;
      }
      return {
        workflowId: cp.workflowId,
        goal: cp.goal,
        status: 'COMPLETED',
        stepsCompleted: cp.stepsCompleted,
        stepsTotal: cp.stepsTotal,
        verifiedCount: cp.verifiedCount,
        results: [],
        stepOutputs: outputs,
        totalDurationMs: Date.now() - startTime,
        checkpointPath: this.getCheckpointFilePath(workflowId)
      };
    }

    // Detect if a crash occurred while a non-idempotent step was in 'RUNNING' state (after side effect may have executed, before completion checkpoint)
    const inDoubtNonIdempotentStep = cp.steps.find(
      s => s.status === 'RUNNING' && s.idempotent === false
    );
    if (inDoubtNonIdempotentStep && !options?.allowRetryInDoubtNonIdempotent) {
      const err = `IN_DOUBT_SIDE_EFFECT: Step ${inDoubtNonIdempotentStep.stepNumber} ('${inDoubtNonIdempotentStep.toolToCall}') is non-idempotent and was interrupted in RUNNING state before completion could be checkpointed. Explicit confirmation (allowRetryInDoubtNonIdempotent: true) is required before re-executing.`;
      return {
        workflowId: cp.workflowId,
        goal: cp.goal,
        status: 'BLOCKED',
        stepsCompleted: cp.stepsCompleted,
        stepsTotal: cp.stepsTotal,
        verifiedCount: cp.verifiedCount,
        results: [],
        stepOutputs: {},
        totalDurationMs: Date.now() - startTime,
        checkpointPath: this.getCheckpointFilePath(workflowId),
        error: err
      };
    }

    const effectiveSteps: WorkflowStepSpec[] =
      options?.steps ||
      cp.steps.map(s => ({
        stepNumber: s.stepNumber,
        actionDescription: s.description,
        description: s.description,
        toolToCall: s.toolToCall,
        toolArguments: s.toolArguments,
        dependsOnStepNumbers: s.dependsOnStepNumbers,
        isReadOnly: s.isReadOnly,
        idempotent: s.idempotent,
        maxRetries: s.maxRetries
      }));

    return await this.executeWorkflow(cp.goal, effectiveSteps, {
      workflowId: cp.workflowId,
      allowHighRisk: options?.allowHighRisk,
      signal: options?.signal,
      existingCheckpoint: cp
    });
  }
}
