import { ToolCall, PermissionLevel } from '../shared/types';
import {
  SecurityPolicyMiddleware,
  PendingApprovalRequest,
  PolicyAuthorizationDecision
} from '../main/services/SecurityPolicyMiddleware';
import { AgentPolicyService } from '../main/services/AgentPolicyService';
import { ActionRiskEvaluator } from '../main/services/ActionRiskEvaluator';
import { ProcessSupervisor } from '../main/services/computer/ProcessSupervisor';
import { ToolRegistry } from './ToolRegistry';
import { HarnessMode, HarnessPermissionTier } from './ExecutionResult';

export interface PermissionGateDecision {
  allowed: boolean;
  tier: HarnessPermissionTier;
  requiresApproval: boolean;
  effectivePermissionLevel: PermissionLevel;
  evaluatedRisk: string;
  reason?: string;
  pendingApproval?: PendingApprovalRequest;
}

/**
 * Authoritative 3-Tier Permission Gateway wrapping `SecurityPolicyMiddleware`, `AgentPolicyService`,
 * `ActionRiskEvaluator`, and `ProcessSupervisor`.
 *
 * - Tier 1 (`TIER_1_READ_ONLY`): Automatic read-only operations (still validated against path/network rules).
 * - Tier 2 (`TIER_2_CONFIRMATION`): Mutating workspace/file/shell/git/MCP operations requiring action-bound confirmation.
 * - Tier 3 (`TIER_3_STRICT_OR_BLOCKED`): Destructive, system-wide, credential, or policy-modifying operations (strictly blocked).
 */
export class PermissionGate {
  public readonly securityMiddleware: SecurityPolicyMiddleware;
  public readonly policyService: AgentPolicyService;
  public readonly riskEvaluator: ActionRiskEvaluator;
  public readonly toolRegistry: ToolRegistry;

  private static readonly DESTRUCTIVE_SHELL_PATTERNS = [
    /\brm\s+(-[rRf]+\s+|.*--no-preserve-root)/i,
    /\bdel\s+\/[fqs]/i,
    /\brmdir\s+\/[sq]/i,
    /\bRemove-Item\b.*-Recurse.*-Force/i,
    /\bformat\s+[a-zA-Z]:/i,
    /\bdiskpart\b/i,
    /\bbcdedit\b/i,
    /\breg\s+delete\b/i,
    /\bgit\s+reset\s+--hard\b/i,
    /\bgit\s+clean\s+-[fxd]+/i,
    /\bInvoke-Expression\b|\biex\b/i,
    /\bcurl\b.*\|\s*(?:sh|bash|pwsh|powershell)/i,
    /\bwget\b.*\|\s*(?:sh|bash|pwsh|powershell)/i
  ];

  constructor(options: {
    securityMiddleware?: SecurityPolicyMiddleware;
    policyService?: AgentPolicyService;
    riskEvaluator?: ActionRiskEvaluator;
    toolRegistry?: ToolRegistry;
    projectRoot?: string;
  } = {}) {
    this.securityMiddleware = options.securityMiddleware || SecurityPolicyMiddleware.getInstance();
    this.policyService = options.policyService || new AgentPolicyService(options.projectRoot);
    this.riskEvaluator = options.riskEvaluator || new ActionRiskEvaluator();
    this.toolRegistry = options.toolRegistry || new ToolRegistry();
  }

  public classifyTier(toolId: string, args?: Record<string, any>): HarnessPermissionTier {
    const tool = this.toolRegistry.getTool(toolId);
    if (!tool) {
      return 'TIER_3_STRICT_OR_BLOCKED';
    }

    const targetCandidate = String(
      args?.filePath ||
      args?.dirPath ||
      args?.path ||
      args?.command ||
      args?.url ||
      args?.selector ||
      ''
    );

    if (toolId === 'shell.execute' || toolId === 'system.execute_command') {
      const fullCmd = `${args?.command || ''} ${Array.isArray(args?.args) ? args.args.join(' ') : ''}`.trim();
      if (PermissionGate.DESTRUCTIVE_SHELL_PATTERNS.some(rx => rx.test(fullCmd))) {
        return 'TIER_3_STRICT_OR_BLOCKED';
      }
    }

    const { mappedActionType } = this.riskEvaluator.classifyToolEffect(toolId, tool, args);
    const risk = this.riskEvaluator.evaluateRisk(mappedActionType as any, args, args, targetCandidate);

    if (risk === 'CRITICAL' || tool.permissionLevel === 'CRITICAL') {
      return 'TIER_3_STRICT_OR_BLOCKED';
    }

    if (
      tool.isReadOnly === true ||
      (tool.permissionLevel === 'LOW' && !tool.isMutating && !tool.requiresApproval)
    ) {
      return 'TIER_1_READ_ONLY';
    }

    return 'TIER_2_CONFIRMATION';
  }

  public evaluate(params: {
    actionId: string;
    toolName: string;
    args: Record<string, any>;
    mode: HarnessMode;
    agentId?: string;
    agentAllowedTools?: string[];
    agentMaxPermissionLevel?: PermissionLevel;
    approvalToken?: string;
    operatorApproved?: boolean;
    approvedArgsHash?: string;
    consumeToken?: boolean;
  }): PermissionGateDecision {
    try {
      // 1. Authoritative E-Stop check
      if (ProcessSupervisor.getInstance().isEstopActive()) {
        return {
          allowed: false,
          tier: 'TIER_3_STRICT_OR_BLOCKED',
          requiresApproval: false,
          effectivePermissionLevel: 'CRITICAL',
          evaluatedRisk: 'CRITICAL',
          reason: 'Execution BLOCKED: ORION Emergency Stop is active. Explicit reset required.'
        };
      }

      // 2. Protected Policy Integrity verification (fail closed if tampered)
      const integrity = this.policyService.verifyProtectedPolicyIntegrity();
      if (!integrity.valid && !integrity.failedSafeToCanonical) {
        return {
          allowed: false,
          tier: 'TIER_3_STRICT_OR_BLOCKED',
          requiresApproval: false,
          effectivePermissionLevel: 'CRITICAL',
          evaluatedRisk: 'CRITICAL',
          reason: `SECURITY POLICY INTEGRITY FAILURE: ${integrity.error || 'Protected policy tampered.'}`
        };
      }

      // 3. Default-deny for unknown tools
      const tool = this.toolRegistry.getTool(params.toolName);
      if (!tool) {
        return {
          allowed: false,
          tier: 'TIER_3_STRICT_OR_BLOCKED',
          requiresApproval: false,
          effectivePermissionLevel: 'CRITICAL',
          evaluatedRisk: 'CRITICAL',
          reason: `UNKNOWN_TOOL: Tool '${params.toolName}' is not registered in ORION ToolRegistry (default-deny).`
        };
      }

      // 4. Schema validation before any authorization/execution
      const validation = this.toolRegistry.validate(params.toolName, params.args);
      if (!validation.valid) {
        return {
          allowed: false,
          tier: 'TIER_3_STRICT_OR_BLOCKED',
          requiresApproval: false,
          effectivePermissionLevel: tool.permissionLevel,
          evaluatedRisk: 'HIGH_RISK',
          reason: `SCHEMA VALIDATION FAILED: ${validation.errors.join('; ')}`
        };
      }

      const tier = this.classifyTier(params.toolName, params.args);

      // 5. Enforce Plan Mode read-only guarantee
      if (params.mode === 'Plan' && tier !== 'TIER_1_READ_ONLY') {
        return {
          allowed: false,
          tier,
          requiresApproval: false,
          effectivePermissionLevel: tool.permissionLevel,
          evaluatedRisk: 'HIGH_RISK',
          reason: `PLAN MODE RESTRICTION: Tool '${params.toolName}' is mutating (${tier}) and cannot execute while in Plan (read-only) mode.`
        };
      }

      // 6. Tier 3 absolute prohibition check
      if (tier === 'TIER_3_STRICT_OR_BLOCKED') {
        return {
          allowed: false,
          tier: 'TIER_3_STRICT_OR_BLOCKED',
          requiresApproval: false,
          effectivePermissionLevel: 'CRITICAL',
          evaluatedRisk: 'CRITICAL',
          reason: `SECURITY POLICY VIOLATION (Tier 3 Prohibited): Tool '${params.toolName}' with target/arguments is strictly blocked by ORION safety policy.`
        };
      }

      // 7. Delegate to canonical SecurityPolicyMiddleware
      const call: ToolCall & Record<string, any> = {
        id: params.actionId,
        toolId: tool.id,
        toolName: tool.name,
        arguments: {
          ...params.args,
          ...(params.approvalToken ? { approvalToken: params.approvalToken } : {})
        },
        timestamp: Date.now(),
        requiresUserApproval: tier === 'TIER_2_CONFIRMATION',
        agentId: params.agentId || 'commander',
        operatorApproved: params.operatorApproved,
        __approvedArgsHash: params.approvedArgsHash
      };

      const middlewareDecision: PolicyAuthorizationDecision = this.securityMiddleware.verifyToolExecution({
        tool: {
          ...tool,
          requiresApproval: tier === 'TIER_2_CONFIRMATION'
        },
        call,
        agentAllowedTools: params.agentAllowedTools,
        agentMaxPermissionLevel: params.agentMaxPermissionLevel,
        isEmergencyStopped: ProcessSupervisor.getInstance().isEstopActive(),
        consumeToken: params.consumeToken ?? true
      });

      return {
        allowed: middlewareDecision.allowed,
        tier,
        requiresApproval: middlewareDecision.requiresApproval,
        effectivePermissionLevel: middlewareDecision.effectivePermissionLevel,
        evaluatedRisk: middlewareDecision.evaluatedRisk,
        reason: middlewareDecision.reason,
        pendingApproval: middlewareDecision.pendingApproval
      };
    } catch (err: any) {
      // Fail closed on any policy evaluation error
      return {
        allowed: false,
        tier: 'TIER_3_STRICT_OR_BLOCKED',
        requiresApproval: false,
        effectivePermissionLevel: 'CRITICAL',
        evaluatedRisk: 'CRITICAL',
        reason: `POLICY ENGINE ERROR (Fail-Closed): ${err?.message || String(err)}`
      };
    }
  }
}
