import { ActionRiskLevel, ComputerAction } from '../../../shared/types/action';
import { ActionRiskEvaluator } from '../ActionRiskEvaluator';
import { SecurityPolicyMiddleware } from '../SecurityPolicyMiddleware';
import { ProcessSupervisor } from './ProcessSupervisor';

export interface BoundActionApprovalRecord {
  actionId: string;
  approved: boolean;
  boundHash?: string;
  createdAt: number;
  expiresAt: number;
  consumed: boolean;
}

export class ComputerPermissionService {
  private static sharedInstance: ComputerPermissionService;
  private riskEvaluator: ActionRiskEvaluator;
  private approvalOverrides: Map<string, BoundActionApprovalRecord> = new Map();
  private emergencyStopped: boolean = false;
  private defaultApprovalTtlMs = 5 * 60 * 1000; // 5 minutes

  constructor(riskEvaluator?: ActionRiskEvaluator) {
    this.riskEvaluator = riskEvaluator || new ActionRiskEvaluator();
  }

  public static getInstance(): ComputerPermissionService {
    if (!ComputerPermissionService.sharedInstance) {
      ComputerPermissionService.sharedInstance = new ComputerPermissionService();
    }
    return ComputerPermissionService.sharedInstance;
  }

  public static computeActionFingerprint(action: ComputerAction): string {
    const normalizedPayload = action.payload && typeof action.payload === 'object' ? action.payload : {};
    const normalizedParams = action.parameters && typeof action.parameters === 'object' ? action.parameters : {};
    const mergedArgs = {
      ...normalizedParams,
      ...normalizedPayload,
      __target: action.target || ''
    };
    return SecurityPolicyMiddleware.computeActionBindingHash(`computer_action:${action.type}`, mergedArgs);
  }

  public triggerEmergencyStop(): void {
    this.emergencyStopped = true;
  }

  public resetEmergencyStop(): void {
    this.emergencyStopped = false;
  }

  public isEmergencyStopped(): boolean {
    return this.emergencyStopped || ProcessSupervisor.getInstance().isEstopActive();
  }

  public evaluateActionPermission(
    action: ComputerAction,
    options?: { consumeApproval?: boolean }
  ): {
    allowed: boolean;
    requiresExplicitApproval: boolean;
    riskLevel: ActionRiskLevel;
    reason?: string;
  } {
    if (this.isEmergencyStopped()) {
      return {
        allowed: false,
        requiresExplicitApproval: false,
        riskLevel: 'CRITICAL',
        reason: 'Execution BLOCKED: Computer-Use Emergency Stop is active.'
      };
    }

    if (!action || typeof action !== 'object' || !action.type || typeof action.type !== 'string') {
      return {
        allowed: false,
        requiresExplicitApproval: false,
        riskLevel: 'CRITICAL',
        reason: 'Execution BLOCKED: Malformed or missing ComputerAction representation.'
      };
    }

    if (
      (action.payload !== undefined && action.payload !== null && typeof action.payload !== 'object') ||
      (action.parameters !== undefined && action.parameters !== null && typeof action.parameters !== 'object')
    ) {
      return {
        allowed: false,
        requiresExplicitApproval: false,
        riskLevel: 'CRITICAL',
        reason: 'Execution BLOCKED: Malformed action payload or parameters structure.'
      };
    }

    if (this.riskEvaluator.hasConflictingTargets(action.payload, action.parameters, action.target)) {
      action.riskLevel = 'CRITICAL';
      return {
        allowed: false,
        requiresExplicitApproval: true,
        riskLevel: 'CRITICAL',
        reason: 'CRITICAL: Conflicting target parameters detected between action.payload and action.parameters. Execution blocked.'
      };
    }

    const evaluatedRisk = this.riskEvaluator.evaluateRisk(
      action.type,
      action.payload,
      action.parameters,
      action.target
    );
    action.riskLevel = evaluatedRisk;

    if (evaluatedRisk === 'CRITICAL') {
      return {
        allowed: false,
        requiresExplicitApproval: true,
        riskLevel: evaluatedRisk,
        reason: 'Critical action prohibited by ORION safety policy (Protected Master / System Directory protection).'
      };
    }

    // Policy is authoritative: setting action.requiresApproval = false can NEVER bypass HIGH_RISK approval
    const requiresApproval = evaluatedRisk === 'HIGH_RISK' || action.requiresApproval === true;

    if (requiresApproval) {
      const now = Date.now();
      const currentHash = ComputerPermissionService.computeActionFingerprint(action);
      const record = this.approvalOverrides.get(action.id);

      let isApproved = false;
      if (record && record.approved) {
        if (record.consumed) {
          this.approvalOverrides.delete(action.id);
          return {
            allowed: false,
            requiresExplicitApproval: true,
            riskLevel: evaluatedRisk,
            reason: `AUTHORIZATION INVALIDATED: Single-use approval for action '${action.id}' has already been consumed.`
          };
        }
        if (record.expiresAt <= now) {
          this.approvalOverrides.delete(action.id);
          return {
            allowed: false,
            requiresExplicitApproval: true,
            riskLevel: evaluatedRisk,
            reason: `AUTHORIZATION EXPIRED: Approval for action '${action.id}' has expired.`
          };
        }
        if (record.boundHash && record.boundHash !== currentHash) {
          this.approvalOverrides.delete(action.id);
          return {
            allowed: false,
            requiresExplicitApproval: true,
            riskLevel: evaluatedRisk,
            reason: `AUTHORIZATION INVALIDATED: Target or arguments for action '${action.id}' were modified after approval.`
          };
        }

        // Bind to exact action fingerprint on first check
        if (!record.boundHash) {
          record.boundHash = currentHash;
        }
        if (options?.consumeApproval) {
          record.consumed = true;
          this.approvalOverrides.delete(action.id);
        }
        isApproved = true;
      }

      if (!isApproved) {
        // Check central SecurityPolicyMiddleware for a matching bound token
        const middleware = SecurityPolicyMiddleware.getInstance();
        const consumedFromMiddleware = options?.consumeApproval
          ? middleware.consumeMatchingApproval('computer.execute_action', { action })
          : middleware.hasMatchingApproval('computer.execute_action', { action });
        if (consumedFromMiddleware) {
          isApproved = true;
        }
      }

      if (!isApproved) {
        return {
          allowed: false,
          requiresExplicitApproval: true,
          riskLevel: evaluatedRisk,
          reason: `Action '${action.type}' requires explicit human authorization.`
        };
      }
    }

    return {
      allowed: true,
      requiresExplicitApproval: false,
      riskLevel: evaluatedRisk
    };
  }

  public setActionApproval(
    actionId: string,
    approved: boolean,
    actionBinding?: ComputerAction,
    ttlMs: number = this.defaultApprovalTtlMs
  ): void {
    if (!approved) {
      this.approvalOverrides.delete(actionId);
      return;
    }
    const now = Date.now();
    this.approvalOverrides.set(actionId, {
      actionId,
      approved: true,
      boundHash: actionBinding ? ComputerPermissionService.computeActionFingerprint(actionBinding) : undefined,
      createdAt: now,
      expiresAt: now + ttlMs,
      consumed: false
    });
  }

  public clearApprovals(): void {
    this.approvalOverrides.clear();
  }
}
