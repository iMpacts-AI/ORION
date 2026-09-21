import { ComputerAction, ComputerTaskPlan, ActionRiskLevel } from '../../../shared/types/action';
import { ActionRiskEvaluator } from '../ActionRiskEvaluator';
import { IAIProvider } from '../AIProvider';
import os from 'os';
import path from 'path';

export class ComputerActionPlanner {
  private riskEvaluator: ActionRiskEvaluator;
  private aiProvider?: IAIProvider;

  constructor(riskEvaluator?: ActionRiskEvaluator, aiProvider?: IAIProvider) {
    this.riskEvaluator = riskEvaluator || new ActionRiskEvaluator();
    this.aiProvider = aiProvider;
  }

  public setAIProvider(provider: IAIProvider): void {
    this.aiProvider = provider;
  }

  public async planTask(naturalLanguageCommand: string, options?: { isDryRun?: boolean }): Promise<ComputerTaskPlan> {
    const taskId = `task_comp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const isDryRun = options?.isDryRun === true;
    let actions: ComputerAction[] = [];
    const commandLower = naturalLanguageCommand.trim().toLowerCase();

    // Redact any potential credentials in stored logs / command representation
    const sanitizedCommand = naturalLanguageCommand.replace(/(password|token|secret|key|bearer)[\s:=]+([^\s,;]+)/gi, '$1: ***REDACTED***');

    // Attempt AI LLM Planning if configured provider exists
    if (this.aiProvider && this.aiProvider.isConfigured && this.aiProvider.id !== 'local-heuristic') {
      try {
        const prompt = `You are ORION Desktop Action Planner. Decompose this user command into an array of actions.
Valid Action Types: OPEN_APP, FOCUS_WINDOW, CLOSE_WINDOW, MOUSE_CLICK, KEYBOARD_INPUT, HOTKEY, SCROLL, OBSERVE_SCREEN, WAIT.
Return a valid JSON array of objects with keys: "type", "target" (optional), "parameters" (optional: {appName, text, keys, amount, button}), "reason".
Command: "${naturalLanguageCommand}"`;
        const response = await this.aiProvider.chat(prompt);
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            actions = parsed.map((item: any, idx: number) => ({
              id: `act_${Date.now()}_${idx + 1}`,
              type: item.type || 'OBSERVE_SCREEN',
              target: item.target,
              parameters: item.parameters || {},
              confidence: 0.95,
              riskLevel: 'LOW_RISK',
              reason: item.reason || `AI planned step ${idx + 1}: ${item.type}`
            }));
          }
        }
      } catch (e) {
        // Fall back to deterministic decomposition
      }
    }

    // Deterministic Rule-Based Fallback Decomposition
    if (actions.length === 0) {
      if (
        ((commandLower.includes('open') || commandLower.includes('focus')) && (commandLower.includes('type') || commandLower.includes('write')) && (commandLower.includes('close') || commandLower.includes('verify') || commandLower.includes('replace') || commandLower.includes('observe'))) ||
        commandLower.includes('then') ||
        commandLower.includes('and then') ||
        commandLower.includes('replace')
      ) {
        // Step A: Open App
        const appMatch = naturalLanguageCommand.match(/(?:open|focus)\s+([a-zA-Z0-9_\-]+)/i);
        const appName = appMatch ? appMatch[1].trim().toLowerCase() : 'notepad';
        actions.push({
          id: `act_${Date.now()}_1`,
          type: 'OPEN_APP',
          target: appName,
          parameters: { appName },
          confidence: 0.95,
          riskLevel: 'LOW_RISK',
          reason: `Open disposable application ${appName}`,
          postconditions: {
            verifyActiveApp: appName
          }
        });

      // Step B: Focus App Window
      actions.push({
        id: `act_${Date.now()}_2`,
        type: 'FOCUS_WINDOW',
        target: appName,
        confidence: 0.95,
        riskLevel: 'LOW_RISK',
        reason: `Focus application window ${appName}`,
        postconditions: {
          verifyActiveWindow: appName
        }
      });

      // Step C: Initial Text Type
      const textMatch = naturalLanguageCommand.match(/type\s+["']?([^"',]+)["']?/i);
      const textToType = textMatch ? textMatch[1].trim() : 'ORION_WORKFLOW_TEST';
      actions.push({
        id: `act_${Date.now()}_3`,
        type: 'KEYBOARD_INPUT',
        parameters: { text: textToType },
        confidence: 0.92,
        riskLevel: 'LOW_RISK',
        reason: `Type initial workflow payload "${textToType}"`
      });

      // Step D: Select / Replace if requested (e.g. "select the text, replace it with another message")
      if (commandLower.includes('select') || commandLower.includes('replace')) {
        // Select all text using hotkey (Ctrl+A)
        actions.push({
          id: `act_${Date.now()}_3_select`,
          type: 'HOTKEY',
          parameters: { keys: ['control', 'a'] },
          confidence: 0.95,
          riskLevel: 'LOW_RISK',
          reason: 'Select all text in active document editor'
        });

        // Replacement text payload
        const replaceMatch = naturalLanguageCommand.match(/replace(?:\s+it)?\s+with\s+["']?([^"',]+)["']?/i);
        const replacementText = replaceMatch ? replaceMatch[1].trim() : 'REPLACEMENT_PAYLOAD_VERIFIED';
        actions.push({
          id: `act_${Date.now()}_3_replace`,
          type: 'KEYBOARD_INPUT',
          parameters: { text: replacementText },
          confidence: 0.95,
          riskLevel: 'LOW_RISK',
          reason: `Type replacement text payload "${replacementText}"`
        });
      }

      // Step E: Observe & Verify Text and Application State
      actions.push({
        id: `act_${Date.now()}_4`,
        type: 'OBSERVE_SCREEN',
        confidence: 0.95,
        riskLevel: 'READ_ONLY',
        reason: `Observe desktop and verify ${appName} application state is active`,
        postconditions: {
          verifyActiveApp: appName
        }
      });

      // Step F: Close App if requested
      if (commandLower.includes('close')) {
        actions.push({
          id: `act_${Date.now()}_5`,
          type: 'CLOSE_WINDOW',
          target: appName,
          confidence: 0.95,
          riskLevel: 'LOW_RISK',
          reason: `Close disposable application ${appName}`
        });
      }
    }

    // 1. Browser & Navigation Commands
    else if (commandLower.includes('open chrome') || commandLower.includes('search for') || commandLower.includes('open browser')) {
      actions.push({
        id: `act_${Date.now()}_1`,
        type: 'OPEN_APP',
        target: 'chrome',
        parameters: { appName: 'chrome' },
        confidence: 0.95,
        riskLevel: 'MODERATE_RISK',
        reason: 'Launch Google Chrome browser'
      });

      const searchMatch = naturalLanguageCommand.match(/search (?:for )?["']?([^"']+)["']?/i);
      const query = searchMatch ? searchMatch[1].trim() : 'Nvidia earnings';

      actions.push({
        id: `act_${Date.now()}_2`,
        type: 'MOUSE_CLICK',
        selector: { role: 'input', text: 'Address and search bar' },
        confidence: 0.9,
        riskLevel: 'MODERATE_RISK',
        reason: 'Focus browser URL / Search address bar'
      });

      actions.push({
        id: `act_${Date.now()}_3`,
        type: 'KEYBOARD_INPUT',
        parameters: { text: `https://www.google.com/search?q=${encodeURIComponent(query)}` },
        confidence: 0.95,
        riskLevel: 'MODERATE_RISK',
        reason: 'Type target query URL'
      });

      actions.push({
        id: `act_${Date.now()}_4`,
        type: 'PRESS_KEY',
        parameters: { key: 'enter' },
        confidence: 0.95,
        riskLevel: 'MODERATE_RISK',
        reason: 'Submit search'
      });
    }

    // 2. Open Project / Folder in VS Code / File Explorer
    else if (commandLower.includes('open the orion project in vs code') || commandLower.includes('open vs code') || commandLower.includes('vscode')) {
      actions.push({
        id: `act_${Date.now()}_1`,
        type: 'OPEN_APP',
        target: 'Code',
        parameters: { appName: 'Code', path: process.cwd() },
        confidence: 0.95,
        riskLevel: 'MODERATE_RISK',
        reason: 'Launch Visual Studio Code in ORION project'
      });
    } else if (commandLower.includes('file explorer') || commandLower.includes('titan folder')) {
      actions.push({
        id: `act_${Date.now()}_1`,
        type: 'OPEN_APP',
        target: 'explorer',
        parameters: { appName: 'explorer', path: process.env.TITAN_ROOT || path.join(os.homedir(), 'Project_Titan') },
        confidence: 0.95,
        riskLevel: 'MODERATE_RISK',
        reason: 'Open File Explorer at Project Titan root'
      });
    }

    // 3. Application Switching / Window Control
    else if (commandLower.includes('switch to') || commandLower.includes('focus')) {
      const match = naturalLanguageCommand.match(/(?:switch to|focus)\s+["']?([^"']+)["']?/i);
      const target = match ? match[1].trim() : 'chrome';
      actions.push({
        id: `act_${Date.now()}_1`,
        type: 'FOCUS_WINDOW',
        target,
        confidence: 0.95,
        riskLevel: 'LOW_RISK',
        reason: `Switch window focus to ${target}`
      });
    } else if (commandLower.includes('close window') || commandLower.includes('close app')) {
      const match = naturalLanguageCommand.match(/close\s+(?:window\s+)?["']?([^"']+)["']?/i);
      const target = match ? match[1].trim() : '';
      actions.push({
        id: `act_${Date.now()}_1`,
        type: 'CLOSE_WINDOW',
        target,
        confidence: 0.9,
        riskLevel: 'MODERATE_RISK',
        reason: `Close active application window ${target}`
      });
    }

    // 4. Scrolling
    else if (commandLower.includes('scroll down') || commandLower.includes('scroll')) {
      actions.push({
        id: `act_${Date.now()}_1`,
        type: 'SCROLL',
        parameters: { amount: commandLower.includes('up') ? 3 : -3 },
        confidence: 0.95,
        riskLevel: 'LOW_RISK',
        reason: 'Scroll active desktop viewport'
      });
    }

    // 5. Clicking specific element
    else if (commandLower.includes('click')) {
      const match = naturalLanguageCommand.match(/click\s+(?:the\s+)?["']?([a-zA-Z0-9_\-\s]+?)(?:\s+button)?["']?$/i);
      const targetText = match ? match[1].trim() : 'Button';
      actions.push({
        id: `act_${Date.now()}_1`,
        type: 'MOUSE_CLICK',
        selector: { text: targetText },
        confidence: 0.88,
        riskLevel: 'MODERATE_RISK',
        reason: `Click UI element labeled '${targetText}'`
      });
    }

    // 6. Typing into field
    else if (commandLower.includes('type')) {
      const match = naturalLanguageCommand.match(/type\s+["']?([^"']+)["']?/i);
      const textToType = match ? match[1].trim() : 'Sample text';
      actions.push({
        id: `act_${Date.now()}_1`,
        type: 'KEYBOARD_INPUT',
        parameters: { text: textToType },
        confidence: 0.92,
        riskLevel: 'MODERATE_RISK',
        reason: `Type text string into focused input`
      });
    }

    // 7. Screenshot / Observation
    else if (commandLower.includes('screenshot') || commandLower.includes('what is on screen') || commandLower.includes('observe')) {
      actions.push({
        id: `act_${Date.now()}_1`,
        type: 'OBSERVE_SCREEN',
        confidence: 0.99,
        riskLevel: 'READ_ONLY',
        reason: 'Observe current screen, active window, and UI elements'
      });
    }

    // Generic fallback single observation
    else {
      actions.push({
        id: `act_${Date.now()}_1`,
        type: 'OBSERVE_SCREEN',
        confidence: 0.8,
        riskLevel: 'READ_ONLY',
        reason: `General screen observation for command: ${naturalLanguageCommand}`
      });
    }
    }

    // Determine overall risk
    let overallRisk: ActionRiskLevel = 'READ_ONLY';
    for (const act of actions) {
      if (isDryRun) {
        act.isDryRun = true;
      }
      const risk = this.riskEvaluator.evaluateRisk(act.type, act.payload || act.parameters);
      act.riskLevel = risk;
      if (risk === 'CRITICAL') overallRisk = 'CRITICAL';
      else if (risk === 'HIGH_RISK' && overallRisk !== 'CRITICAL') overallRisk = 'HIGH_RISK';
      else if (risk === 'MODERATE_RISK' && overallRisk !== 'CRITICAL' && overallRisk !== 'HIGH_RISK') overallRisk = 'MODERATE_RISK';
      else if (risk === 'LOW_RISK' && overallRisk === 'READ_ONLY') overallRisk = 'LOW_RISK';
    }

    return {
      taskId,
      naturalLanguageCommand: sanitizedCommand,
      intent: actions[0]?.reason || 'Execute desktop command',
      targetApp: actions.find(a => a.target || a.parameters?.appName)?.target || actions.find(a => a.parameters?.appName)?.parameters?.appName,
      actions,
      overallRisk,
      requiresUserApproval: overallRisk === 'HIGH_RISK' || overallRisk === 'CRITICAL',
      status: 'PLANNING',
      currentActionIndex: 0,
      totalSteps: actions.length,
      isDryRun,
      auditLog: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  /**
   * Phase 10 Dynamic Replanning: Synthesizes corrective action sequence after an unexpected failure.
   */
  public async replanFromFailure(
    failedAction: ComputerAction,
    failureReason: string,
    currentObservation: any,
    remainingActions: ComputerAction[]
  ): Promise<ComputerAction[]> {
    const correctiveActions: ComputerAction[] = [];
    const reasonLower = failureReason.toLowerCase();

    // Replanning Strategy A: Window/App focus loss recovery
    if (reasonLower.includes('active window') || reasonLower.includes('active app') || reasonLower.includes('focus')) {
      const targetApp = failedAction.target || failedAction.parameters?.appName || 'notepad';
      correctiveActions.push({
        id: `act_replan_focus_${Date.now()}`,
        type: 'FOCUS_WINDOW',
        target: targetApp,
        confidence: 0.95,
        riskLevel: 'LOW_RISK',
        reason: `Adaptive Replan: Re-acquire focus on target '${targetApp}'`,
        postconditions: {
          verifyActiveWindow: targetApp
        }
      });
    }

    // Replanning Strategy B: Modal or overlay blocking UI
    else if (reasonLower.includes('not visible') || reasonLower.includes('selector') || reasonLower.includes('element')) {
      correctiveActions.push({
        id: `act_replan_dismiss_${Date.now()}`,
        type: 'PRESS_KEY',
        parameters: { key: 'escape' },
        confidence: 0.88,
        riskLevel: 'LOW_RISK',
        reason: 'Adaptive Replan: Dismiss potential modal or dropdown blocking interaction'
      });
      correctiveActions.push({
        id: `act_replan_obs_${Date.now()}`,
        type: 'OBSERVE_SCREEN',
        confidence: 0.95,
        riskLevel: 'READ_ONLY',
        reason: 'Adaptive Replan: Re-observe desktop state after overlay dismissal'
      });
    }

    // Re-queue the failed action with adjusted parameters
    correctiveActions.push({
      ...failedAction,
      id: `act_replan_retry_${Date.now()}`,
      confidence: Math.max((failedAction.confidence || 0.9) - 0.05, 0.6),
      reason: `Adaptive Replan: Retry action '${failedAction.type}' following environment stabilization`
    });

    // Append remaining actions
    correctiveActions.push(...remainingActions);

    return correctiveActions;
  }
}
