import { ActionRiskLevel, ComputerAction } from '../../../shared/types/action';
import { ActionRiskEvaluator } from '../ActionRiskEvaluator';

export class ComputerPermissionService {
  private riskEvaluator: ActionRiskEvaluator;
  private approvalOverrides: Map<string, boolean> = new Map();
  private emergencyStopped: boolean = false;

  constructor(riskEvaluator?: ActionRiskEvaluator) {
    this.riskEvaluator = riskEvaluator || new ActionRiskEvaluator();
  }

  public triggerEmergencyStop(): void {
    this.emergencyStopped = true;
  }

  public resetEmergencyStop(): void {
    this.emergencyStopped = false;
  }

  public isEmergencyStopped(): boolean {
    return this.emergencyStopped;
  }

  public evaluateActionPermission(action: ComputerAction): {
    allowed: boolean;
    requiresExplicitApproval: boolean;
    riskLevel: ActionRiskLevel;
    reason?: string;
  } {
    if (this.emergencyStopped) {
      return {
        allowed: false,
        requiresExplicitApproval: false,
        riskLevel: 'CRITICAL',
        reason: 'Execution BLOCKED: Computer-Use Emergency Stop is active.'
      };
    }

    const evaluatedRisk = this.riskEvaluator.evaluateRisk(action.type, action.payload);
    action.riskLevel = evaluatedRisk;

    if (evaluatedRisk === 'CRITICAL') {
      return {
        allowed: false,
        requiresExplicitApproval: true,
        riskLevel: evaluatedRisk,
        reason: 'Critical action prohibited by ORION safety policy (Protected Master / System Directory protection).'
      };
    }

    const requiresApproval = evaluatedRisk === 'HIGH_RISK';
    const isApproved = this.approvalOverrides.get(action.id) || false;

    if (requiresApproval && !isApproved) {
      return {
        allowed: false,
        requiresExplicitApproval: true,
        riskLevel: evaluatedRisk,
        reason: `Action '${action.type}' requires explicit human authorization.`
      };
    }

    return {
      allowed: true,
      requiresExplicitApproval: false,
      riskLevel: evaluatedRisk
    };
  }

  public setActionApproval(actionId: string, approved: boolean): void {
    this.approvalOverrides.set(actionId, approved);
  }
}
