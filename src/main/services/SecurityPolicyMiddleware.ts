import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Tool, ToolCall, PermissionLevel } from '../../shared/types';
import { ActionRiskEvaluator } from './ActionRiskEvaluator';
import { ProcessSupervisor } from './computer/ProcessSupervisor';
import { ExecutionTraceService } from './ExecutionTraceService';

export interface PendingApprovalRequest {
  approvalId: string;
  toolId: string;
  toolName: string;
  permissionLevel: PermissionLevel;
  evaluatedRisk: string;
  canonicalArgsHash: string;
  argumentsSnapshot: Record<string, any>;
  agentId: string;
  reason: string;
  createdAt: number;
  expiresAt: number;
  status: 'PENDING' | 'APPROVED' | 'DENIED' | 'EXPIRED' | 'CONSUMED';
  approvalToken?: string;
}

export interface PolicyAuthorizationDecision {
  allowed: boolean;
  requiresApproval: boolean;
  evaluatedRisk: string;
  effectivePermissionLevel: PermissionLevel;
  reason?: string;
  pendingApproval?: PendingApprovalRequest;
}

export interface FileBackupRecord {
  backupId: string;
  originalPath: string;
  backupPath: string;
  existedBefore: boolean;
  sha256Before?: string;
  timestamp: number;
}

/**
 * Mandatory Central Policy Middleware & Action-Bound Approval Registry (Section 7B & 7C).
 * - Verifies tool identity, arguments, agent tool allowlists, target paths, conflicting targets,
 *   action risk, E-STOP state, and action-bound human approval tokens immediately before execution.
 * - Approval tokens are cryptographically bound to `(toolId + canonicalizeArgs(arguments))` and
 *   have a strict TTL expiry. Any modification to the tool arguments invalidates the approval.
 * - Provides atomic file backups before mutating existing workspace files.
 */
export class SecurityPolicyMiddleware {
  private static instance: SecurityPolicyMiddleware;
  private riskEvaluator: ActionRiskEvaluator;
  private pendingApprovals: Map<string, PendingApprovalRequest> = new Map();
  private approvedActionTokens: Map<string, PendingApprovalRequest> = new Map();
  private consumedCallFingerprints: Set<string> = new Set();
  private fileBackups: FileBackupRecord[] = [];
  private backupDir: string;
  private approvalsStatePath: string;
  private defaultApprovalTtlMs = 5 * 60 * 1000; // 5 minutes

  constructor(riskEvaluator?: ActionRiskEvaluator, customBackupDir?: string) {
    this.riskEvaluator = riskEvaluator || new ActionRiskEvaluator();
    this.backupDir = customBackupDir || path.resolve(process.cwd(), '.orion_memory', 'backups');
    this.approvalsStatePath = path.resolve(process.cwd(), '.orion_memory', 'approvals_state.json');
    this.loadPersistedApprovals();
  }

  private loadPersistedApprovals(): void {
    try {
      if (!fs.existsSync(this.approvalsStatePath)) return;
      const raw = JSON.parse(fs.readFileSync(this.approvalsStatePath, 'utf-8'));
      if (Array.isArray(raw.pending)) {
        for (const item of raw.pending) {
          if (item && typeof item.approvalId === 'string') {
            this.pendingApprovals.set(item.approvalId, item);
          }
        }
      }
      if (Array.isArray(raw.approved)) {
        for (const [hash, item] of raw.approved) {
          if (typeof hash === 'string' && item) {
            this.approvedActionTokens.set(hash, item);
          }
        }
      }
      if (Array.isArray(raw.consumed)) {
        for (const fp of raw.consumed) {
          if (typeof fp === 'string') this.consumedCallFingerprints.add(fp);
        }
      }
    } catch {}
  }

  private savePersistedApprovals(): void {
    try {
      const dir = path.dirname(this.approvalsStatePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const payload = {
        pending: Array.from(this.pendingApprovals.values()),
        approved: Array.from(this.approvedActionTokens.entries()),
        consumed: Array.from(this.consumedCallFingerprints)
      };
      fs.writeFileSync(this.approvalsStatePath, JSON.stringify(payload, null, 2), 'utf-8');
    } catch {}
  }

  public static getInstance(): SecurityPolicyMiddleware {
    if (!SecurityPolicyMiddleware.instance) {
      SecurityPolicyMiddleware.instance = new SecurityPolicyMiddleware();
    }
    return SecurityPolicyMiddleware.instance;
  }

  public static canonicalizeArgs(args: Record<string, any> | undefined | null): string {
    if (!args || typeof args !== 'object') return '{}';
    const ignoredKeys = new Set([
      'approvalToken',
      '__agentId',
      '__approvedArgsHash',
      '__approvedExpiresAt',
      'operatorApproved',
      'requiresApproval',
      'requiresUserApproval'
    ]);
    const sortObject = (val: any): any => {
      if (val === null || val === undefined) return null;
      if (Array.isArray(val)) return val.map(sortObject);
      if (typeof val === 'object') {
        const sortedKeys = Object.keys(val)
          .filter(k => !ignoredKeys.has(k))
          .sort();
        const out: Record<string, any> = {};
        for (const k of sortedKeys) {
          out[k] = sortObject(val[k]);
        }
        return out;
      }
      return val;
    };
    return JSON.stringify(sortObject(args));
  }

  public static computeActionBindingHash(toolId: string, args?: Record<string, any> | null): string {
    const canonical = `${toolId}::${SecurityPolicyMiddleware.canonicalizeArgs(args)}`;
    return crypto.createHash('sha256').update(canonical, 'utf8').digest('hex');
  }

  /**
   * Binds a trusted operator approval to a specific ToolCall instance and its exact canonicalized arguments.
   */
  public static bindCallApproval(call: ToolCall, ttlMs: number = 5 * 60 * 1000): string {
    const hash = SecurityPolicyMiddleware.computeActionBindingHash(call.toolId, call.arguments || {});
    (call as any).operatorApproved = true;
    (call as any).__approvedArgsHash = hash;
    (call as any).__approvedExpiresAt = Date.now() + ttlMs;
    return hash;
  }

  public createApprovalRequest(params: {
    tool: Tool;
    arguments: Record<string, any>;
    evaluatedRisk: string;
    agentId?: string;
    reason: string;
    ttlMs?: number;
  }): PendingApprovalRequest {
    const now = Date.now();
    const bindingHash = SecurityPolicyMiddleware.computeActionBindingHash(params.tool.id, params.arguments);

    // Reuse existing pending request if identical action is already queued and not expired
    for (const existing of this.pendingApprovals.values()) {
      if (
        existing.status === 'PENDING' &&
        existing.canonicalArgsHash === bindingHash &&
        existing.expiresAt > now
      ) {
        return existing;
      }
    }

    const approvalId = `appr_${now.toString(36)}_${crypto.randomBytes(3).toString('hex')}`;
    const req: PendingApprovalRequest = {
      approvalId,
      toolId: params.tool.id,
      toolName: params.tool.name,
      permissionLevel: params.tool.permissionLevel,
      evaluatedRisk: params.evaluatedRisk,
      canonicalArgsHash: bindingHash,
      argumentsSnapshot: ExecutionTraceService.redactSensitiveValue(params.arguments || {}),
      agentId: params.agentId || 'core',
      reason: params.reason,
      createdAt: now,
      expiresAt: now + (params.ttlMs || this.defaultApprovalTtlMs),
      status: 'PENDING'
    };

    this.pendingApprovals.set(approvalId, req);
    this.savePersistedApprovals();
    return req;
  }

  public approveRequest(approvalId?: string): PendingApprovalRequest | null {
    this.loadPersistedApprovals();
    const now = Date.now();
    let target: PendingApprovalRequest | undefined;

    if (approvalId) {
      target = this.pendingApprovals.get(approvalId);
    } else {
      // Find most recent pending approval
      const pending = Array.from(this.pendingApprovals.values())
        .filter(r => r.status === 'PENDING' && r.expiresAt > now)
        .sort((a, b) => b.createdAt - a.createdAt);
      target = pending[0];
    }

    if (!target) return null;
    if (target.expiresAt <= now) {
      target.status = 'EXPIRED';
      this.savePersistedApprovals();
      return null;
    }

    target.status = 'APPROVED';
    target.approvalToken = `tok_${crypto.randomBytes(12).toString('hex')}`;
    this.approvedActionTokens.set(target.canonicalArgsHash, target);
    this.savePersistedApprovals();
    return target;
  }

  public denyRequest(approvalId?: string): PendingApprovalRequest | null {
    this.loadPersistedApprovals();
    let target: PendingApprovalRequest | undefined;
    if (approvalId) {
      target = this.pendingApprovals.get(approvalId);
    } else {
      const pending = Array.from(this.pendingApprovals.values())
        .filter(r => r.status === 'PENDING')
        .sort((a, b) => b.createdAt - a.createdAt);
      target = pending[0];
    }
    if (!target) return null;
    target.status = 'DENIED';
    this.approvedActionTokens.delete(target.canonicalArgsHash);
    this.savePersistedApprovals();
    return target;
  }

  public getPendingApprovals(): PendingApprovalRequest[] {
    this.loadPersistedApprovals();
    const now = Date.now();
    let changed = false;
    for (const req of this.pendingApprovals.values()) {
      if (req.status === 'PENDING' && req.expiresAt <= now) {
        req.status = 'EXPIRED';
        changed = true;
      }
    }
    if (changed) this.savePersistedApprovals();
    return Array.from(this.pendingApprovals.values()).filter(r => r.status === 'PENDING');
  }

  public getAllApprovals(): PendingApprovalRequest[] {
    this.loadPersistedApprovals();
    return Array.from(this.pendingApprovals.values());
  }

  public clearApprovals(): void {
    this.pendingApprovals.clear();
    this.approvedActionTokens.clear();
    this.consumedCallFingerprints.clear();
    try {
      if (fs.existsSync(this.approvalsStatePath)) {
        fs.unlinkSync(this.approvalsStatePath);
      }
    } catch {}
  }

  /**
   * Checks whether a valid, unconsumed, non-expired approval exists for the exact toolId + arguments without consuming it.
   */
  public hasMatchingApproval(toolId: string, args?: Record<string, any> | null, explicitToken?: string): boolean {
    this.loadPersistedApprovals();
    const now = Date.now();
    const bindingHash = SecurityPolicyMiddleware.computeActionBindingHash(toolId, args);
    const approved = this.approvedActionTokens.get(bindingHash);
    if (!approved || approved.status !== 'APPROVED') return false;
    if (approved.expiresAt <= now) {
      approved.status = 'EXPIRED';
      this.approvedActionTokens.delete(bindingHash);
      this.savePersistedApprovals();
      return false;
    }
    if (explicitToken && approved.approvalToken && explicitToken !== approved.approvalToken) {
      return false;
    }
    return true;
  }

  /**
   * Verifies whether a valid, unconsumed, non-expired approval exists for the exact toolId + arguments and consumes it (single-use).
   */
  public consumeMatchingApproval(toolId: string, args?: Record<string, any> | null, explicitToken?: string): boolean {
    this.loadPersistedApprovals();
    const now = Date.now();
    const bindingHash = SecurityPolicyMiddleware.computeActionBindingHash(toolId, args);
    const approved = this.approvedActionTokens.get(bindingHash);

    if (approved && approved.status === 'APPROVED') {
      if (approved.expiresAt <= now) {
        approved.status = 'EXPIRED';
        this.approvedActionTokens.delete(bindingHash);
        this.savePersistedApprovals();
        return false;
      }
      if (explicitToken && approved.approvalToken && explicitToken !== approved.approvalToken) {
        return false;
      }
      approved.status = 'CONSUMED';
      this.approvedActionTokens.delete(bindingHash);
      this.savePersistedApprovals();
      return true;
    }
    return false;
  }

  /**
   * Central Pre-Execution Authorization Gate.
   */
  public verifyToolExecution(params: {
    tool: Tool;
    call: ToolCall;
    agentAllowedTools?: string[];
    agentMaxPermissionLevel?: PermissionLevel;
    isEmergencyStopped?: boolean;
    consumeToken?: boolean;
  }): PolicyAuthorizationDecision {
    const {
      tool,
      call,
      agentAllowedTools,
      agentMaxPermissionLevel,
      isEmergencyStopped,
      consumeToken = true
    } = params;

    // 1. E-STOP Check
    if (isEmergencyStopped || ProcessSupervisor.getInstance().isEstopActive()) {
      return {
        allowed: false,
        requiresApproval: false,
        evaluatedRisk: 'CRITICAL',
        effectivePermissionLevel: 'CRITICAL',
        reason: 'Execution BLOCKED: ORION Emergency Stop is active.'
      };
    }

    // 2. Agent Least-Privilege Allowlist Check
    if (Array.isArray(agentAllowedTools) && agentAllowedTools.length > 0 && !agentAllowedTools.includes('*')) {
      const isAllowed = agentAllowedTools.some(pattern => {
        if (pattern.endsWith('.*')) {
          const prefix = pattern.slice(0, -1);
          return tool.id.startsWith(prefix);
        }
        return pattern === tool.id;
      });
      if (!isAllowed) {
        return {
          allowed: false,
          requiresApproval: false,
          evaluatedRisk: 'HIGH_RISK',
          effectivePermissionLevel: tool.permissionLevel,
          reason: `AGENT POLICY VIOLATION: Delegated agent '${(call as any).agentId || 'active-agent'}' is not authorized to invoke tool '${tool.id}'.`
        };
      }
    }

    if (agentMaxPermissionLevel) {
      const rank: Record<PermissionLevel, number> = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
      if (rank[tool.permissionLevel] > rank[agentMaxPermissionLevel]) {
        return {
          allowed: false,
          requiresApproval: false,
          evaluatedRisk: 'HIGH_RISK',
          effectivePermissionLevel: tool.permissionLevel,
          reason: `AGENT PRIVILEGE ESCALATION BLOCKED: Tool '${tool.id}' (${tool.permissionLevel}) exceeds agent max permission level (${agentMaxPermissionLevel}).`
        };
      }
    }

    // 3. Target Path & Conflicting Target Evaluation using authoritative tool classification
    const nestedAction = call.arguments?.action;
    const targetCandidate = String(
      call.arguments?.filePath ||
      call.arguments?.dirPath ||
      call.arguments?.path ||
      call.arguments?.command ||
      call.arguments?.selector ||
      nestedAction?.target ||
      nestedAction?.payload?.filePath ||
      nestedAction?.parameters?.filePath ||
      ''
    );

    const { mappedActionType } = this.riskEvaluator.classifyToolEffect(call.toolId, tool, call.arguments);

    const evaluatedRisk = this.riskEvaluator.evaluateRisk(
      mappedActionType as any,
      nestedAction ? nestedAction.payload : call.arguments,
      nestedAction ? nestedAction.parameters : call.arguments,
      targetCandidate
    );

    if (evaluatedRisk === 'CRITICAL' || tool.permissionLevel === 'CRITICAL') {
      return {
        allowed: false,
        requiresApproval: true,
        evaluatedRisk: 'CRITICAL',
        effectivePermissionLevel: 'CRITICAL',
        reason: `SECURITY POLICY VIOLATION: Critical or restricted target '${targetCandidate || call.toolId}' is strictly blocked by ORION safety policy.`
      };
    }

    // 4. Consequential / High-Risk Approval Verification
    // Never allow a caller-supplied requiresApproval:false / requiresUserApproval:false to bypass policy
    const requiresHumanApproval =
      tool.permissionLevel === 'HIGH' ||
      tool.requiresApproval === true ||
      call.requiresUserApproval === true ||
      (call.toolId === 'system.control' && call.arguments?.action === 'lock') ||
      (call.toolId !== 'file.write_text' && evaluatedRisk === 'HIGH_RISK');

    if (requiresHumanApproval) {
      const recordedHash = (call as any).__approvedArgsHash;
      const currentHash = SecurityPolicyMiddleware.computeActionBindingHash(tool.id, call.arguments);

      // Verify if operatorApproved was tampered with after arguments changed or forged without binding hash
      if (recordedHash && recordedHash !== currentHash) {
        const pending = this.createApprovalRequest({
          tool,
          arguments: call.arguments || {},
          evaluatedRisk,
          agentId: (call as any).agentId,
          reason: `Tool '${tool.id}' arguments were modified after approval; renewed authorization required.`
        });
        return {
          allowed: false,
          requiresApproval: true,
          evaluatedRisk,
          effectivePermissionLevel: tool.permissionLevel,
          pendingApproval: pending,
          reason: `AUTHORIZATION INVALIDATED: Arguments for '${tool.id}' changed after approval. Renewed approval [${pending.approvalId}] required.`
        };
      }

      if ((call as any).operatorApproved && !recordedHash) {
        const pending = this.createApprovalRequest({
          tool,
          arguments: call.arguments || {},
          evaluatedRisk,
          agentId: (call as any).agentId,
          reason: `Forged or unbound operatorApproved flag on '${tool.id}' rejected; cryptographic argument binding required.`
        });
        return {
          allowed: false,
          requiresApproval: true,
          evaluatedRisk,
          effectivePermissionLevel: tool.permissionLevel,
          pendingApproval: pending,
          reason: `AUTHORIZATION INVALIDATED: Forged or unbound operator approval flag on '${tool.id}' rejected [Approval ID: ${pending.approvalId}].`
        };
      }

      const approvedExpiresAt = (call as any).__approvedExpiresAt;
      if (typeof approvedExpiresAt === 'number' && Date.now() >= approvedExpiresAt) {
        const pending = this.createApprovalRequest({
          tool,
          arguments: call.arguments || {},
          evaluatedRisk,
          agentId: (call as any).agentId,
          reason: `Bound approval for '${tool.id}' has expired.`
        });
        return {
          allowed: false,
          requiresApproval: true,
          evaluatedRisk,
          effectivePermissionLevel: tool.permissionLevel,
          pendingApproval: pending,
          reason: `AUTHORIZATION EXPIRED: Approval for '${tool.id}' expired [Approval ID: ${pending.approvalId}].`
        };
      }

      const explicitToken = call.arguments?.approvalToken || (call as any).approvalToken;
      const hasBoundApproval = consumeToken
        ? this.consumeMatchingApproval(tool.id, call.arguments, explicitToken)
        : this.hasMatchingApproval(tool.id, call.arguments, explicitToken);

      const callFingerprint = `${call.id || 'anon'}::${currentHash}`;
      let hasValidBoundCallApproval = Boolean((call as any).operatorApproved && recordedHash && recordedHash === currentHash);

      if (hasValidBoundCallApproval && consumeToken) {
        if (this.consumedCallFingerprints.has(callFingerprint)) {
          hasValidBoundCallApproval = false;
        } else {
          this.consumedCallFingerprints.add(callFingerprint);
        }
      }

      if (!hasBoundApproval && !hasValidBoundCallApproval) {
        const pending = this.createApprovalRequest({
          tool,
          arguments: call.arguments || {},
          evaluatedRisk,
          agentId: (call as any).agentId,
          reason: `High-risk tool '${tool.id}' (${tool.permissionLevel}) requires explicit operator approval.`
        });
        return {
          allowed: false,
          requiresApproval: true,
          evaluatedRisk,
          effectivePermissionLevel: tool.permissionLevel,
          pendingApproval: pending,
          reason: `AUTHORIZATION REQUIRED: High-risk tool '${tool.id}' (${tool.permissionLevel}) requires explicit operator approval [Approval ID: ${pending.approvalId}]. Run '/approve ${pending.approvalId}' or pass operator approval.`
        };
      }
    }

    return {
      allowed: true,
      requiresApproval: false,
      evaluatedRisk,
      effectivePermissionLevel: tool.permissionLevel
    };
  }

  /**
   * Creates an atomic backup before modifying an existing file and writes atomically via temp file + rename.
   */
  public writeFileAtomicallyWithBackup(targetPath: string, content: string): {
    resolvedPath: string;
    sizeBytes: number;
    backupRecord?: FileBackupRecord;
  } {
    const resolvedPath = path.resolve(targetPath);
    const parentDir = path.dirname(resolvedPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    let backupRecord: FileBackupRecord | undefined;
    if (fs.existsSync(resolvedPath)) {
      try {
        const existingBytes = fs.readFileSync(resolvedPath);
        const sha256Before = crypto.createHash('sha256').update(existingBytes).digest('hex');
        if (!fs.existsSync(this.backupDir)) {
          fs.mkdirSync(this.backupDir, { recursive: true });
        }
        const backupId = `bak_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
        const safeBase = path.basename(resolvedPath).replace(/[^a-zA-Z0-9._-]/g, '_');
        const backupPath = path.join(this.backupDir, `${backupId}_${safeBase}`);
        fs.writeFileSync(backupPath, existingBytes);
        backupRecord = {
          backupId,
          originalPath: resolvedPath,
          backupPath,
          existedBefore: true,
          sha256Before,
          timestamp: Date.now()
        };
        this.fileBackups.push(backupRecord);
      } catch {}
    }

    const tmpPath = `${resolvedPath}.orion_tmp_${process.pid}_${Date.now()}`;
    fs.writeFileSync(tmpPath, content, 'utf-8');
    fs.renameSync(tmpPath, resolvedPath);

    const stat = fs.statSync(resolvedPath);
    return {
      resolvedPath,
      sizeBytes: stat.size,
      backupRecord
    };
  }

  public rollbackLastFileWrite(targetPath?: string): { rolledBack: boolean; restoredPath?: string; error?: string } {
    const resolved = targetPath ? path.resolve(targetPath) : undefined;
    for (let i = this.fileBackups.length - 1; i >= 0; i--) {
      const rec = this.fileBackups[i];
      if (!resolved || rec.originalPath === resolved) {
        if (fs.existsSync(rec.backupPath)) {
          fs.copyFileSync(rec.backupPath, rec.originalPath);
          this.fileBackups.splice(i, 1);
          return { rolledBack: true, restoredPath: rec.originalPath };
        }
      }
    }
    return { rolledBack: false, error: 'No matching file backup found to restore.' };
  }

  public getFileBackups(): FileBackupRecord[] {
    return [...this.fileBackups];
  }
}
