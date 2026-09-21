import { ComputerAction, ActionResult } from '../../shared/types/action';
import { ActionRiskEvaluator } from './ActionRiskEvaluator';
import { ActionValidator } from './ActionValidator';
import { ComputerPerceptionService } from './ComputerPerceptionService';
import { ToolService } from './ToolService';
import { ToolCall } from '../../shared/types';
import { eventBus } from '../../shared/events';

export class ComputerActionService {
  private riskEvaluator: ActionRiskEvaluator;
  private validator: ActionValidator;
  private perceptionService: ComputerPerceptionService;
  private toolService: ToolService;

  constructor(
    perceptionService: ComputerPerceptionService,
    toolService: ToolService,
    riskEvaluator?: ActionRiskEvaluator,
    validator?: ActionValidator
  ) {
    this.perceptionService = perceptionService;
    this.toolService = toolService;
    this.riskEvaluator = riskEvaluator || new ActionRiskEvaluator();
    this.validator = validator || new ActionValidator();
  }

  public async executeAction(action: ComputerAction): Promise<ActionResult> {
    const startTime = Date.now();

    // 1. Authoritative Risk Evaluation
    const evaluatedRisk = this.riskEvaluator.evaluateRisk(action.type, action.payload);
    action.riskLevel = evaluatedRisk;

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
        const toolCall: ToolCall = {
          id: 'call_act_' + action.id,
          toolId: 'file.read_text',
          toolName: 'Read Text File',
          arguments: { filePath: action.payload?.filePath },
          timestamp: Date.now(),
          requiresUserApproval: false
        };
        const toolRes = await this.toolService.executeTool(toolCall);
        execSuccess = toolRes.success;
        execData = toolRes.data;
        execError = toolRes.error;
      } else if (action.type === 'WRITE_FILE') {
        const toolCall: ToolCall = {
          id: 'call_act_' + action.id,
          toolId: 'file.write_text',
          toolName: 'Write Text File',
          arguments: { filePath: action.payload?.filePath, content: action.payload?.content },
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
