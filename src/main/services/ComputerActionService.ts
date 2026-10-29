import { ComputerAction, ActionResult } from '../../shared/types/action';
import { ActionRiskEvaluator } from './ActionRiskEvaluator';
import { ActionValidator } from './ActionValidator';
import { ComputerPerceptionService } from './ComputerPerceptionService';
import { ToolService } from './ToolService';
import { ProcessSupervisor } from './computer/ProcessSupervisor';
import { ComputerPermissionService } from './computer/ComputerPermissionService';
import { SecurityPolicyMiddleware } from './SecurityPolicyMiddleware';
import { ToolCall } from '../../shared/types';
import { eventBus } from '../../shared/events';

export class ComputerActionService {
  private riskEvaluator: ActionRiskEvaluator;
  private validator: ActionValidator;
  private perceptionService: ComputerPerceptionService;
  private toolService: ToolService;
  private permissionService: ComputerPermissionService;

  constructor(
    perceptionService: ComputerPerceptionService,
    toolService: ToolService,
    riskEvaluator?: ActionRiskEvaluator,
    validator?: ActionValidator,
    permissionService?: ComputerPermissionService
  ) {
    this.perceptionService = perceptionService;
    this.toolService = toolService;
    this.riskEvaluator = riskEvaluator || new ActionRiskEvaluator();
    this.validator = validator || new ActionValidator();
    this.permissionService =
      permissionService ||
      this.toolService?.getComputerUseService?.()?.getPermissionService?.() ||
      ComputerPermissionService.getInstance();
  }

  public getPermissionService(): ComputerPermissionService {
    return this.permissionService;
  }

  public async executeAction(action: ComputerAction): Promise<ActionResult> {
    const startTime = Date.now();

    if (!action || typeof action !== 'object' || !action.type || typeof action.type !== 'string') {
      return {
        actionId: (action as any)?.id || 'unknown',
        success: false,
        preconditionsMet: false,
        postconditionsVerified: false,
        error: 'CRITICAL: Malformed or missing ComputerAction representation.',
        timestamp: Date.now()
      };
    }

    // 0. Global Emergency Stop Enforcement
    if (
      ProcessSupervisor.getInstance().isEstopActive() ||
      this.permissionService.isEmergencyStopped() ||
      this.toolService.getComputerUseService().isEmergencyStopped()
    ) {
      eventBus.logActivity('ERROR_EVENT', `Computer Action '${action.type}' BLOCKED by active Emergency Stop`);
      return {
        actionId: action.id,
        success: false,
        preconditionsMet: false,
        postconditionsVerified: false,
        error: 'Execution BLOCKED: ORION Emergency Stop is active.',
        timestamp: Date.now()
      };
    }

    // 1. Authoritative Risk Evaluation (inspecting payload, parameters, and target consistently)
    if (this.riskEvaluator.hasConflictingTargets(action.payload, action.parameters, action.target)) {
      eventBus.logActivity('ERROR_EVENT', `Computer Action '${action.type}' BLOCKED due to conflicting payload vs parameters target values`);
      return {
        actionId: action.id,
        success: false,
        preconditionsMet: false,
        postconditionsVerified: false,
        error: 'CRITICAL: Conflicting target parameters detected between action.payload and action.parameters. Execution blocked.',
        timestamp: Date.now()
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
      eventBus.logActivity('ERROR_EVENT', `Computer Action '${action.type}' BLOCKED by safety policy (CRITICAL rating)`);
      return {
        actionId: action.id,
        success: false,
        preconditionsMet: false,
        postconditionsVerified: false,
        error: 'Critical action prohibited by ORION safety policy (Protected Master / System Directory / Credential protection).',
        timestamp: Date.now()
      };
    }

    // Authoritative central permission gate: setting action.requiresApproval = false can NEVER bypass HIGH_RISK policy
    const permDecision = this.permissionService.evaluateActionPermission(action, { consumeApproval: true });
    if (!permDecision.allowed) {
      eventBus.logActivity('ERROR_EVENT', `Computer Action '${action.type}' BLOCKED awaiting explicit approval (${evaluatedRisk})`);
      return {
        actionId: action.id,
        success: false,
        preconditionsMet: false,
        postconditionsVerified: false,
        error: `AUTHORIZATION REQUIRED: HIGH_RISK action '${action.type}' requires explicit user approval before execution. ${permDecision.reason || ''}`.trim(),
        timestamp: Date.now()
      };
    }

    eventBus.logActivity('TOOL_EXECUTION', `Executing Computer Action '${action.type}' (Risk Rating: ${evaluatedRisk})`);

    // 2. Precondition Validation
    const currentEnv = await this.perceptionService.captureEnvironment('EXECUTING');
    const preCheck = await this.validator.validatePreconditions(action.preconditions, currentEnv);

    if (!preCheck.valid) {
      eventBus.logActivity('ERROR_EVENT', `Computer Action '${action.type}' Precondition Failed: ${preCheck.reason}`);
      return {
        actionId: action.id,
        success: false,
        preconditionsMet: false,
        postconditionsVerified: false,
        error: preCheck.reason,
        timestamp: Date.now()
      };
    }

    // 3. Action Execution via ToolService Sandboxing
    let execData: any;
    let execSuccess = true;
    let execError: string | undefined;

    try {
      if (action.type === 'READ_FILE') {
        const targetFilePath = action.payload?.filePath || action.parameters?.filePath || action.payload?.path || action.parameters?.path || action.target;
        const toolCall: ToolCall = {
          id: 'call_act_' + action.id,
          toolId: 'file.read_text',
          toolName: 'Read Text File',
          arguments: { filePath: targetFilePath },
          timestamp: Date.now(),
          requiresUserApproval: false
        };
        const toolRes = await this.toolService.executeTool(toolCall);
        execSuccess = toolRes.success;
        execData = toolRes.data;
        execError = toolRes.error;
      } else if (action.type === 'WRITE_FILE') {
        const targetFilePath = action.payload?.filePath || action.parameters?.filePath || action.payload?.path || action.parameters?.path || action.target;
        const targetContent = action.payload?.content ?? action.parameters?.content;
        const toolCall: ToolCall = {
          id: 'call_act_' + action.id,
          toolId: 'file.write_text',
          toolName: 'Write Text File',
          arguments: { filePath: targetFilePath, content: targetContent },
          timestamp: Date.now(),
          requiresUserApproval: false
        };
        const toolRes = await this.toolService.executeTool(toolCall);
        execSuccess = toolRes.success;
        execData = toolRes.data;
        execError = toolRes.error;
      } else {
        // Forward all desktop computer actions directly to ComputerUseService executor
        const compService = this.toolService.getComputerUseService();
        const actionRes = await compService.executeSingleAction(action);
        execSuccess = actionRes.success;
        execData = actionRes;
        execError = actionRes.error;
      }
    } catch (err: any) {
      execSuccess = false;
      execError = err.message;
    }

    if (!execSuccess) {
      return {
        actionId: action.id,
        success: false,
        preconditionsMet: true,
        postconditionsVerified: false,
        error: execError || 'Execution failed',
        timestamp: Date.now()
      };
    }

    // 4. Postcondition Verification Check
    const postCheck = await this.validator.verifyPostconditions(action.postconditions);

    return {
      actionId: action.id,
      success: postCheck.verified,
      preconditionsMet: true,
      postconditionsVerified: postCheck.verified,
      data: execData,
      error: postCheck.verified ? undefined : postCheck.reason,
      timestamp: Date.now()
    };
  }
}
