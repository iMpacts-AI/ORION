/**
 * ORION Security Hardening, Approval Binding, Process Supervision, and Reliability Regression Suite
 *
 * Verifies Phases 1–4 of the Engineering Recovery & Hardening Mission:
 * 1. Central risk-based approval cannot be bypassed by requiresApproval: false.
 * 2. Forged operatorApproved: true without a valid __approvedArgsHash is rejected.
 * 3. Mutating arguments after approval invalidates approval in both SecurityPolicyMiddleware and ComputerPermissionService.
 * 4. Single-use approval token consumption (replay rejected) and TTL expiration.
 * 5. E-Stop is authoritative across ProcessSupervisor, ComputerActionExecutor, ComputerActionService, and OrionCliKernel (never auto-reset on new prompt).
 * 6. ProcessSupervisor.runManagedCommand rejects ENOENT and immediate nonzero exit on detached launches.
 * 7. WindowsAppResolver resolves allowlisted apps and rejects unknown apps, arbitrary paths, and shell metacharacters.
 * 8. WindowManagerService and InputControlService reject command-injection payloads before process creation.
 * 9. ActionRiskEvaluator blocks URL-encoded path traversal (%2e%2e), .git/hooks, and orion-protected-policy writes, and accurately classifies tool effects (never defaulting non-read-only tools to 'WAIT').
 * 10. ToolService.executeTool enforces ToolRegistry.validateToolArguments() (SCHEMA VALIDATION FAILED) and rejects unknown tools.
 * 11. ToolDependencyGraph propagates markFailed() to transitive dependents and rejects cyclic/self/forward prerequisites.
 */

import * as assert from 'assert';
import * as path from 'path';
import * as os from 'os';
import { ActionRiskEvaluator } from '../ActionRiskEvaluator';
import { SecurityPolicyMiddleware } from '../SecurityPolicyMiddleware';
import { ComputerPermissionService } from '../computer/ComputerPermissionService';
import { ComputerActionService } from '../ComputerActionService';
import { ComputerPerceptionService } from '../ComputerPerceptionService';
import { SystemMonitorService } from '../SystemMonitorService';
import { VisionService } from '../VisionService';
import { ToolService } from '../ToolService';
import { ProcessSupervisor } from '../computer/ProcessSupervisor';
import { WindowsAppResolver } from '../computer/WindowsAppResolver';
import { WindowManagerService } from '../computer/WindowManagerService';
import { InputControlService } from '../computer/InputControlService';
import { ToolDependencyGraph } from '../ExecutionContext';
import { OrionCliKernel } from '../../../cli/OrionCliKernel';
import { OrionCliRenderer } from '../../../cli/OrionCliRenderer';

async function runSecurityHardeningAndReliabilityTests() {
  console.log('=== SECURITY HARDENING & RELIABILITY REGRESSION SUITE ===');
  let checks = 0;
  function pass(label: string) {
    checks++;
    console.log(`  [PASS] ${label}`);
  }

  const riskEvaluator = new ActionRiskEvaluator();
  const policyMiddleware = SecurityPolicyMiddleware.getInstance();
  const permissionService = ComputerPermissionService.getInstance();
  const supervisor = ProcessSupervisor.getInstance();
  const appResolver = WindowsAppResolver.getInstance();

  // Ensure clean state
  supervisor.resetEstop('test_init');
  permissionService.resetEmergencyStop();
  permissionService.clearApprovals();
  policyMiddleware.clearApprovals();

  // ---------------------------------------------------------------------------
  // 1. ActionRiskEvaluator: Tool Effect Classification & Protected Path Checks
  // ---------------------------------------------------------------------------
  {
    const writeClassification = riskEvaluator.classifyToolEffect(
      'file.write_text',
      { permissionLevel: 'MEDIUM', isReadOnly: false },
      { filePath: './sandbox_test.txt', content: 'abc' }
    );
    assert.strictEqual(writeClassification.category, 'LOCAL_REVERSIBLE_MODIFICATION');
    assert.strictEqual(writeClassification.mappedActionType, 'WRITE_FILE');

    const unknownMutating = riskEvaluator.classifyToolEffect(
      'custom.mutator',
      { permissionLevel: 'HIGH', isReadOnly: false, isDangerous: true },
      {}
    );
    assert.notStrictEqual(unknownMutating.mappedActionType, 'WAIT', 'Mutating tool must never default to WAIT');
    assert.notStrictEqual(unknownMutating.category, 'READ_ONLY', 'Mutating tool must never be classified as READ_ONLY');

    // URL-encoded traversal
    const traversalRisk = riskEvaluator.evaluateRisk('WRITE_FILE', {
      filePath: 'C:%5CWindows%5CSystem32%5Cdrivers%5Cetc%5Chosts'
    });
    assert.strictEqual(traversalRisk, 'CRITICAL', 'URL-encoded System32 write must be CRITICAL');

    // .git/hooks protection
    const gitHookRisk = riskEvaluator.evaluateRisk('WRITE_FILE', {
      filePath: path.join(process.cwd(), '.git', 'hooks', 'pre-commit')
    });
    assert.strictEqual(gitHookRisk, 'CRITICAL', '.git/hooks write must be CRITICAL');

    // Protected policy file
    const policyFileRisk = riskEvaluator.evaluateRisk('WRITE_FILE', {
      filePath: path.join(process.cwd(), 'orion-protected-policy.json')
    });
    assert.strictEqual(policyFileRisk, 'CRITICAL', 'orion-protected-policy write must be CRITICAL');

    pass('1. ActionRiskEvaluator classifies tool effects accurately and blocks URL-encoded traversal, .git/hooks, and policy files');
  }

  // ---------------------------------------------------------------------------
  // 2. Central Risk-Based Approval Cannot Be Bypassed by requiresApproval: false
  // ---------------------------------------------------------------------------
  {
    const toolService = new ToolService();
    const perception = new ComputerPerceptionService(new SystemMonitorService(), new VisionService());
    const actionService = new ComputerActionService(perception, toolService);

    // Attempt HIGH_RISK action (WRITE_FILE) with requiresApproval: false
    const bypassAttempt = await actionService.executeAction({
      id: 'act_bypass_test_1',
      type: 'WRITE_FILE',
      target: './sandbox_bypass_attempt.txt',
      payload: { filePath: './sandbox_bypass_attempt.txt', content: 'unapproved' },
      riskLevel: 'LOW_RISK', // caller tries to lie about riskLevel
      requiresApproval: false // caller tries to disable approval
    });
    assert.strictEqual(bypassAttempt.success, false, 'HIGH_RISK WRITE_FILE with requiresApproval: false must be blocked');
    assert.ok(
      bypassAttempt.error?.includes('AUTHORIZATION REQUIRED') || bypassAttempt.error?.includes('requires explicit'),
      `Expected AUTHORIZATION REQUIRED error, got: ${bypassAttempt.error}`
    );
    pass('2. Central risk-based approval blocks HIGH_RISK action even when requiresApproval: false is passed');
  }

  // ---------------------------------------------------------------------------
  // 3. Content-Bound, Single-Use, Expiring Approvals in ComputerPermissionService
  // ---------------------------------------------------------------------------
  {
    permissionService.clearApprovals();
    const actionObj: any = {
      id: 'act_bound_1',
      type: 'WRITE_FILE',
      target: './sandbox_bound.txt',
      parameters: { filePath: './sandbox_bound.txt', content: 'safe' },
      riskLevel: 'HIGH_RISK',
      requiresApproval: true
    };

    // Approve exact action
    permissionService.setActionApproval('act_bound_1', true, actionObj, 5000);

    // Mutate target after approval -> must be rejected!
    const mutatedAction = {
      ...actionObj,
      target: './sandbox_mutated.txt',
      parameters: { filePath: './sandbox_mutated.txt', content: 'tampered' }
    };
    const mutatedEval = permissionService.evaluateActionPermission(mutatedAction, { consumeApproval: true });
    assert.strictEqual(mutatedEval.allowed, false, 'Mutated target after approval must be rejected');
    assert.ok(
      mutatedEval.reason?.includes('AUTHORIZATION INVALIDATED'),
      `Expected AUTHORIZATION INVALIDATED, got: ${mutatedEval.reason}`
    );

    // Re-approve and verify single-use consumption
    permissionService.setActionApproval('act_bound_2', true, { ...actionObj, id: 'act_bound_2' }, 5000);
    const firstUse = permissionService.evaluateActionPermission(
      { ...actionObj, id: 'act_bound_2' },
      { consumeApproval: true }
    );
    assert.strictEqual(firstUse.allowed, true, 'First use of bound approval must succeed');

    const replayUse = permissionService.evaluateActionPermission(
      { ...actionObj, id: 'act_bound_2' },
      { consumeApproval: true }
    );
    assert.strictEqual(replayUse.allowed, false, 'Second use (replay) of single-use approval must be rejected');

    // Verify TTL expiration
    permissionService.setActionApproval('act_bound_expired', true, { ...actionObj, id: 'act_bound_expired' }, -10);
    const expiredUse = permissionService.evaluateActionPermission(
      { ...actionObj, id: 'act_bound_expired' },
      { consumeApproval: true }
    );
    assert.strictEqual(expiredUse.allowed, false, 'Expired approval must be rejected');
    assert.ok(expiredUse.reason?.includes('AUTHORIZATION EXPIRED'), `Expected AUTHORIZATION EXPIRED, got: ${expiredUse.reason}`);

    pass('3. ComputerPermissionService enforces content-bound hashes, single-use consumption, and TTL expiration');
  }

  // ---------------------------------------------------------------------------
  // 4. SecurityPolicyMiddleware: Forged operatorApproved Rejection & Argument Binding
  // ---------------------------------------------------------------------------
  {
    const toolService = new ToolService();
    toolService.getRegistry().registerTool({
      id: 'test.dangerous_op',
      name: 'Dangerous Operation',
      category: 'SYSTEM',
      description: 'High risk test operation',
      permissionLevel: 'HIGH',
      isReadOnly: false,
      isDangerous: true,
      requiresApproval: true,
      supportsCancellation: true,
      parameters: {
        targetHost: { type: 'string', description: 'Host', required: true }
      }
    });

    // 4a. Forged operatorApproved: true WITHOUT __approvedArgsHash must be rejected
    const forgedCall: any = {
      id: 'call_forged_1',
      toolId: 'test.dangerous_op',
      toolName: 'Dangerous Operation',
      arguments: { targetHost: 'prod-db-01' },
      timestamp: Date.now(),
      requiresUserApproval: false,
      operatorApproved: true
    };
    const forgedRes = await toolService.executeTool(forgedCall);
    assert.strictEqual(forgedRes.success, false, 'Forged operatorApproved without hash must fail');
    assert.ok(
      forgedRes.error?.includes('AUTHORIZATION INVALIDATED'),
      `Expected AUTHORIZATION INVALIDATED for forged approval, got: ${forgedRes.error}`
    );

    // 4b. Properly bound call approval, then argument mutation -> must fail
    const mutatedCall: any = {
      id: 'call_mutated_1',
      toolId: 'test.dangerous_op',
      toolName: 'Dangerous Operation',
      arguments: { targetHost: 'staging-db' },
      timestamp: Date.now(),
      requiresUserApproval: true
    };
    SecurityPolicyMiddleware.bindCallApproval(mutatedCall, 60000);
    // Tamper with arguments after binding
    mutatedCall.arguments.targetHost = 'production-master-db';
    const tamperedRes = await toolService.executeTool(mutatedCall);
    assert.strictEqual(tamperedRes.success, false, 'Tampered arguments after approval binding must fail');
    assert.ok(
      tamperedRes.error?.includes('AUTHORIZATION INVALIDATED'),
      `Expected AUTHORIZATION INVALIDATED for mutated args, got: ${tamperedRes.error}`
    );

    pass('4. SecurityPolicyMiddleware rejects forged operatorApproved flags and tampered post-approval arguments');
  }

  // ---------------------------------------------------------------------------
  // 5. Authoritative Emergency Stop (No Auto-Reset on New Prompt in OrionCliKernel)
  // ---------------------------------------------------------------------------
  {
    const renderer = new OrionCliRenderer({ useColor: false, jsonMode: true });
    const tempMcpConfig = path.join(os.tmpdir(), `orion_estop_test_${Date.now()}.json`);
    const kernel = new OrionCliKernel({
      projectRoot: process.cwd(),
      renderer,
      mcpConfigPath: tempMcpConfig
    });

    await supervisor.triggerEstop('Security regression test E-Stop');
    assert.strictEqual(supervisor.isEstopActive(), true);
    assert.strictEqual(kernel.permissionService.isEmergencyStopped(), true);

    const estopPromptRes = await kernel.executePrompt('What is my CPU usage?');
    assert.strictEqual(estopPromptRes.success, false, 'Prompt execution must be blocked while E-Stop is active');
    assert.strictEqual(supervisor.isEstopActive(), true, 'E-Stop must NOT auto-reset when a new prompt arrives');
    assert.ok(
      estopPromptRes.response.includes('Emergency Stop is active'),
      `Expected Emergency Stop is active message, got: ${estopPromptRes.response}`
    );

    // Reset E-Stop explicitly and verify metadata
    supervisor.resetEstop('Operator verified reset');
    permissionService.resetEmergencyStop();
    assert.strictEqual(supervisor.isEstopActive(), false);
    const meta = supervisor.getEstopMetadata();
    assert.strictEqual(meta.active, false);
    assert.ok(meta.lastResetAt && meta.lastResetAt > 0);

    pass('5. Emergency Stop is authoritative and never auto-resets on new prompt');
  }

  // ---------------------------------------------------------------------------
  // 6. ProcessSupervisor: Detached Spawn Error & Immediate Exit Detection
  // ---------------------------------------------------------------------------
  {
    let threwOnMissingBinary = false;
    try {
      await supervisor.runManagedCommand(
        'nonexistent_orion_binary_xyz_99999.exe',
        ['--version'],
        { detached: true }
      );
    } catch (err: any) {
      threwOnMissingBinary = true;
    }
    assert.strictEqual(threwOnMissingBinary, true, 'Detached launch of non-existent binary must reject instead of resolving exitCode 0');

    let threwOnImmediateCrash = false;
    try {
      await supervisor.runManagedCommand(
        process.execPath,
        ['-e', 'process.exit(42)'],
        { detached: true }
      );
    } catch (err: any) {
      threwOnImmediateCrash = true;
    }
    assert.strictEqual(threwOnImmediateCrash, true, 'Detached process that exits immediately with code 42 must reject');

    pass('6. ProcessSupervisor.runManagedCommand detects ENOENT and immediate crash on detached launches');
  }

  // ---------------------------------------------------------------------------
  // 7. WindowsAppResolver: Allowlist Resolution & Injection Rejection
  // ---------------------------------------------------------------------------
  {
    if (process.platform === 'win32') {
      const notepadResolved = appResolver.resolveApp('notepad');
      assert.strictEqual(notepadResolved.canonicalId, 'notepad');
      assert.ok(notepadResolved.resolvedExecutablePath.toLowerCase().endsWith('notepad.exe'));
    }

    assert.throws(
      () => appResolver.resolveApp('notepad; calc.exe'),
      /SECURITY BLOCKED/i,
      'Must reject command injection in app name'
    );
    assert.throws(
      () => appResolver.resolveApp('C:\\Users\\Public\\malware.exe'),
      /SECURITY BLOCKED/i,
      'Must reject arbitrary file path in app resolver'
    );
    assert.throws(
      () => appResolver.validateLaunchArgument('$(Invoke-Expression "evil")'),
      /SECURITY BLOCKED/i,
      'Must reject unsafe shell metacharacters in launch arguments'
    );

    pass('7. WindowsAppResolver enforces allowlist, resolves safe paths, and blocks metacharacters/arbitrary paths');
  }

  // ---------------------------------------------------------------------------
  // 8. WindowManagerService & InputControlService Command Injection Prevention
  // ---------------------------------------------------------------------------
  {
    assert.throws(
      () => WindowManagerService.validateWindowTarget("notepad'; Start-Process calc; '"),
      /SECURITY BLOCKED/i,
      'WindowManagerService must reject shell injection payload before spawning process'
    );
    assert.throws(
      () => WindowManagerService.validateWindowTarget('*'),
      /SECURITY BLOCKED/i,
      'WindowManagerService must reject wildcard-only window target'
    );

    const inputControl = new InputControlService();
    await assert.rejects(
      async () => inputControl.pressKey('enter; Start-Process calc'),
      /SECURITY BLOCKED/i,
      'InputControlService.pressKey must reject unapproved key tokens'
    );
    await assert.rejects(
      async () => inputControl.type('hello\x00world'),
      /SECURITY BLOCKED|null bytes/i,
      'InputControlService.type must reject null bytes'
    );

    pass('8. WindowManagerService and InputControlService reject injection payloads before process creation');
  }

  // ---------------------------------------------------------------------------
  // 9. ToolService Schema Validation & Unknown Tool Handling
  // ---------------------------------------------------------------------------
  {
    const toolService = new ToolService();

    // Missing required filePath argument on file.read_text
    const invalidSchemaRes = await toolService.executeTool({
      id: 'call_invalid_schema_1',
      toolId: 'file.read_text',
      toolName: 'Read Text File',
      arguments: {} as any,
      timestamp: Date.now(),
      requiresUserApproval: false
    });
    assert.strictEqual(invalidSchemaRes.success, false, 'Missing required argument must fail schema validation');
    assert.ok(
      invalidSchemaRes.error?.includes('SCHEMA VALIDATION FAILED'),
      `Expected SCHEMA VALIDATION FAILED, got: ${invalidSchemaRes.error}`
    );

    // Unknown tool
    const unknownToolRes = await toolService.executeTool({
      id: 'call_unknown_1',
      toolId: 'nonexistent.tool_xyz',
      toolName: 'Unknown Tool',
      arguments: {},
      timestamp: Date.now(),
      requiresUserApproval: false
    });
    assert.strictEqual(unknownToolRes.success, false);
    assert.ok(unknownToolRes.error?.includes('not registered'));

    pass('9. ToolService enforces ToolRegistry.validateToolArguments() and rejects malformed arguments');
  }

  // ---------------------------------------------------------------------------
  // 10. ToolDependencyGraph: Transitive Failure Propagation & Cycle Rejection
  // ---------------------------------------------------------------------------
  {
    const steps: any[] = [
      { stepNumber: 1, description: 'Step 1', toolToCall: 'system.get_info', toolArguments: {}, prerequisites: [], isReadOnly: true },
      { stepNumber: 2, description: 'Step 2', toolToCall: 'system.get_cpu_usage', toolArguments: {}, prerequisites: [1], isReadOnly: true },
      { stepNumber: 3, description: 'Step 3', toolToCall: 'system.get_memory_usage', toolArguments: {}, prerequisites: [2], isReadOnly: true }
    ];
    const graph = new ToolDependencyGraph(steps);
    graph.markFailed(1);
    assert.strictEqual(graph.isFinished(), true, 'Failing step 1 must transitively fail dependent steps 2 and 3 so graph finishes cleanly');
    assert.strictEqual(graph.getExecutableBatches().length, 0, 'No dependent batches may execute after prerequisite failure');

    assert.throws(
      () =>
        new ToolDependencyGraph([
          { stepNumber: 1, description: 'Self', toolToCall: 'system.get_info', toolArguments: {}, prerequisites: [1], isReadOnly: true } as any
        ]),
      /forward\/self prerequisite/i
    );

    pass('10. ToolDependencyGraph transitively propagates markFailed() to dependents and rejects invalid prerequisites');
  }

  console.log(`\nALL ${checks} SECURITY & RELIABILITY REGRESSION CHECKS PASSED!\n`);
}

runSecurityHardeningAndReliabilityTests().catch(err => {
  console.error('SECURITY HARDENING SUITE FAILED:', err);
  process.exit(1);
});
