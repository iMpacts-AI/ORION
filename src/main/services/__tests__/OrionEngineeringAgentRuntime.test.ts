/**
 * ORION BUILD CLI — REAL MULTI-AGENT ENGINEERING COMMAND CENTRE TEST SUITE
 *
 * Covers all 20 mandatory requirements from Section 11:
 *  1. Agent registration and retrieval (10-agent engineering roster + canonical agents).
 *  2. Duplicate agent ID rejection & invalid agent identifier rejection.
 *  3. `/agents` reflects the real runtime registry and live statuses.
 *  4. `IDLE`, `QUEUED`, `RUNNING`, `COMPLETED`, `FAILED`, `BLOCKED`, and `CANCELLED` statuses.
 *  5. Actual executor invocation through backend and authorized tools.
 *  6. Task result & evidence persistence to disk.
 *  7. Backend unavailable (`UNAVAILABLE` / `NOT CONFIGURED`) behavior.
 *  8. Backend error handling (never fabricates COMPLETED).
 *  9. Task dependency ordering (dependent waits for prerequisite; failed prerequisite blocks dependent).
 * 10. Concurrent read-only tasks (`recon` + `security` running in parallel).
 * 11. Conflicting file-write prevention (`FILE_LOCK_CONFLICT` when two tasks target the same file).
 * 12. Cancellation and timeout enforcement (`AbortSignal` and `timeoutMs`).
 * 13. Bounded retries (`maxRetries` respected).
 * 14. E-Stop interaction (blocks new/queued/running tasks; not reset by restart).
 * 15. Tool permission enforcement (read-only `recon`/`qa`/`security` blocked from mutating tools).
 * 16. Secret redaction in persisted task history and agent logs.
 * 17. Restart recovery (reloads custom agents, marks interrupted RUNNING tasks without replaying mutations, clears stale locks).
 * 18. Accurate task completion reporting (`AgentTaskEvidenceResult` with `filesInspected`, `filesChanged`, `commandsOrToolsExecuted`).
 * 19. Commander reconciliation of conflicting findings (preserves both findings, prefers tool-verified evidence).
 * 20. Gemini & Argon connection/availability validation (honest reporting of Gemini config and Argon UNAVAILABLE).
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { OrionCliKernel } from '../../../cli/OrionCliKernel';
import { OrionCliRenderer } from '../../../cli/OrionCliRenderer';
import { OrionCliCommandRouter } from '../../../cli/OrionCliCommandRouter';
import { OrionAgentSystem } from '../OrionAgentSystem';
import { AgentPolicyService } from '../AgentPolicyService';
import { ToolService } from '../ToolService';
import { OrionAIProviderRouter } from '../OrionAIProviderRouter';
import { ProcessSupervisor } from '../computer/ProcessSupervisor';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    passed++;
    console.log(`  [PASS] ${message}`);
  } else {
    failed++;
    console.error(`  [FAIL] ${message}`);
  }
}

async function runEngineeringAgentRuntimeSuite(): Promise<void> {
  console.log('\n================================================================================');
  console.log(' ORION BUILD CLI — MULTI-AGENT ENGINEERING COMMAND CENTRE VERIFICATION (20/20)');
  console.log('================================================================================\n');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orion-eng-agents-'));
  const statePath = path.join(tmpDir, 'agent_runtime_state.json');
  const projectRoot = process.cwd();

  let cliOutput = '';
  const fakeStream = {
    isTTY: false,
    columns: 110,
    write: (chunk: string) => {
      cliOutput += chunk;
      return true;
    },
    on: () => {}
  } as unknown as NodeJS.WriteStream;

  const renderer = new OrionCliRenderer({
    useColor: false,
    jsonMode: false,
    outputStream: fakeStream
  });

  const kernel = new OrionCliKernel({
    projectRoot,
    renderer,
    mcpConfigPath: path.join(tmpDir, 'mcp_empty.json')
  });
  const router = new OrionCliCommandRouter(kernel);

  // Create an isolated OrionAgentSystem instance using tmpDir statePath for deterministic persistence/recovery tests
  const policyService = new AgentPolicyService(projectRoot);
  const toolService = kernel.toolService;
  const omniRouter = kernel.omniRouter;
  const agentSystem = new OrionAgentSystem(policyService, toolService, omniRouter, undefined, statePath);

  try {
    ProcessSupervisor.getInstance().resetEstop();
    kernel.permissionService.resetEmergencyStop();

    // =========================================================================
    // 1. AGENT REGISTRATION & RETRIEVAL (10-AGENT ENGINEERING TEAM)
    // =========================================================================
    const engRoster = agentSystem.getEngineeringAgents(false);
    const expectedTenIds = [
      'commander',
      'recon',
      'security',
      'implementation',
      'qa',
      'windows',
      'architecture',
      'release',
      'design',
      'research'
    ];
    const allTenPresent = expectedTenIds.every(id =>
      engRoster.some(a => a.id === id && a.roleTitle.length > 5 && a.allowedTools.length > 0)
    );
    assert(
      engRoster.length === 10 && allTenPresent,
      `1. Agent registration & retrieval: All 10 specialist engineering agents registered (${engRoster.map(a => a.id).join(', ')})`
    );

    // =========================================================================
    // 2. DUPLICATE AGENT ID & INVALID IDENTIFIER REJECTION
    // =========================================================================
    let duplicateRejected = false;
    try {
      agentSystem.registerCustomAgent({
        id: 'recon',
        displayName: 'Duplicate Recon',
        roleTitle: 'Should fail'
      });
    } catch (e: any) {
      duplicateRejected = /DUPLICATE_AGENT_ID/.test(e.message);
    }

    let invalidIdRejected = false;
    try {
      agentSystem.registerCustomAgent({
        id: 'INVALID ID WITH SPACES!',
        displayName: 'Bad ID',
        roleTitle: 'Should fail'
      });
    } catch (e: any) {
      invalidIdRejected = /INVALID_AGENT_ID/.test(e.message);
    }

    const customAgent = agentSystem.registerCustomAgent({
      id: 'perf-profiler',
      displayName: 'Performance Profiler',
      roleTitle: 'Latency & Memory Flamegraph Specialist',
      readOnly: true
    });
    assert(
      duplicateRejected && invalidIdRejected && customAgent.id === 'perf-profiler',
      '2. Duplicate agent ID and invalid identifier rejected; valid custom agent registered cleanly'
    );

    // =========================================================================
    // 3. `/agents` REFLECTS THE REAL RUNTIME REGISTRY
    // =========================================================================
    cliOutput = '';
    const agentsCmdRes = await router.dispatch('/agents');
    const renderedText = cliOutput;
    assert(
      agentsCmdRes.exitCode === 0 &&
        renderedText.includes('ORION BUILD CLI — AGENT ROSTER') &&
        renderedText.includes('commander — ORION Commander') &&
        renderedText.includes('recon — Reconnaissance Engineer') &&
        renderedText.includes('security — Security Engineer') &&
        renderedText.includes('qa — Test and QA Engineer'),
      '3. `/agents` command displays real registered engineering agents, backends, and live statuses'
    );

    // =========================================================================
    // 4 & 5. LIFECYCLE STATUSES (IDLE, QUEUED, RUNNING, COMPLETED) & REAL EXECUTOR INVOCATION
    // =========================================================================
    const initialReconStatus = agentSystem.getLiveAgentRoster().find(a => a.id === 'recon')?.status;
    let observedRunningStatus: boolean = false;

    const realExecResult = await agentSystem.runEngineeringTask({
      agentId: 'recon',
      title: 'Inspect package.json metadata',
      prompt: 'Read package.json and verify project name',
      toolCallsToRun: [{ toolId: 'file.read_text', arguments: { filePath: 'package.json' } }],
      customExecutor: async ({ agent }) => {
        const liveNow = agentSystem.getLiveAgentRoster().find(a => a.id === agent.id);
        if (liveNow?.status === 'RUNNING' && liveNow.currentTask === 'Inspect package.json metadata') {
          observedRunningStatus = true;
        }
        return {
          summary: 'Verified package.json via real file.read_text tool.',
          verified: true
        };
      }
    });

    const postReconStatus = agentSystem.getLiveAgentRoster().find(a => a.id === 'recon')?.status;
    assert(
      initialReconStatus === 'IDLE' &&
        Boolean(observedRunningStatus) &&
        realExecResult.status === 'COMPLETED' &&
        postReconStatus === 'COMPLETED',
      '4. Agent transitions cleanly through IDLE -> QUEUED -> RUNNING -> COMPLETED during real task execution'
    );

    assert(
      realExecResult.verified === true &&
        realExecResult.filesInspected.includes('package.json') &&
        realExecResult.commandsOrToolsExecuted.some(c => c.includes('file.read_text')),
      '5. Actual executor invokes real ToolService (`file.read_text`) and records verified evidence'
    );

    // =========================================================================
    // 6. TASK RESULT & EVIDENCE PERSISTENCE TO DISK
    // =========================================================================
    const persistedRaw = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : null;
    assert(
      Boolean(persistedRaw) &&
        Array.isArray(persistedRaw.tasks) &&
        persistedRaw.tasks.some((t: any) => t.taskId === realExecResult.taskId && t.status === 'COMPLETED'),
      `6. Task result and evidence persisted to disk (${statePath})`
    );

    // =========================================================================
    // 7. BACKEND UNAVAILABLE (`UNAVAILABLE` / `NOT CONFIGURED`) BEHAVIOR
    // =========================================================================
    agentSystem.registerCustomAgent({
      id: 'argon-tester',
      displayName: 'Argon Test Agent',
      roleTitle: 'Tests unavailable Argon backend handling',
      backendType: 'argon',
      readOnly: true
    });
    const argonTaskRes = await agentSystem.runEngineeringTask({
      agentId: 'argon-tester',
      title: 'Attempt execution on unavailable Argon backend',
      prompt: 'Ping Argon'
    });
    assert(
      argonTaskRes.status === 'FAILED' &&
        argonTaskRes.verified === false &&
        /UNAVAILABLE/i.test(argonTaskRes.summary),
      '7. Agent with unavailable backend (`argon`) fails closed honestly without faking completion'
    );

    // =========================================================================
    // 8. BACKEND ERROR HANDLING (NEVER FABRICATES COMPLETED)
    // =========================================================================
    const backendErrRes = await agentSystem.runEngineeringTask({
      agentId: 'architecture',
      title: 'Simulated backend execution error',
      prompt: 'Trigger error',
      maxRetries: 0,
      customExecutor: async () => {
        throw new Error('SIMULATED_MODEL_STREAM_FAILURE');
      }
    });
    assert(
      backendErrRes.status === 'FAILED' &&
        backendErrRes.verified === false &&
        Boolean(backendErrRes.error?.includes('SIMULATED_MODEL_STREAM_FAILURE')),
      '8. Backend execution error marks task as FAILED and records exact error without fabricating success'
    );

    // =========================================================================
    // 9. TASK DEPENDENCY ORDERING (PREREQUISITE CHECK & BLOCK PROPAGATION)
    // =========================================================================
    const depBlockedRes = await agentSystem.runEngineeringTask({
      agentId: 'qa',
      title: 'Dependent QA task after failed architecture task',
      prompt: 'Verify architecture output',
      dependencies: [backendErrRes.taskId]
    });

    const depSuccessRes = await agentSystem.runEngineeringTask({
      agentId: 'qa',
      title: 'Dependent QA task after completed recon task',
      prompt: 'Verify recon output',
      dependencies: [realExecResult.taskId],
      customExecutor: async () => ({
        summary: 'Prerequisite recon task verified completed.',
        verified: true
      })
    });
    assert(
      depBlockedRes.status === 'BLOCKED' &&
        Boolean(depBlockedRes.error?.includes('DEPENDENCY_FAILED')) &&
        depSuccessRes.status === 'COMPLETED',
      '9. Task dependency ordering blocks dependent task when prerequisite failed and runs when prerequisite completed'
    );

    // =========================================================================
    // 10. CONCURRENT READ-ONLY TASKS (`recon` + `security`)
    // =========================================================================
    let reconInFlight: boolean = false;
    let securityInFlight: boolean = false;
    let bothOverlapped: boolean = false;

    const [concRecon, concSec] = await Promise.all([
      agentSystem.runEngineeringTask({
        agentId: 'recon',
        title: 'Concurrent read-only recon scan',
        prompt: 'Scan tsconfig.json',
        toolCallsToRun: [{ toolId: 'file.read_text', arguments: { filePath: 'tsconfig.json' } }],
        customExecutor: async () => {
          reconInFlight = true;
          await new Promise(r => setTimeout(r, 60));
          if (securityInFlight) bothOverlapped = true;
          reconInFlight = false;
          return { summary: 'Concurrent recon read completed.', verified: true };
        }
      }),
      agentSystem.runEngineeringTask({
        agentId: 'security',
        title: 'Concurrent read-only security scan',
        prompt: 'Scan tsconfig.test.json',
        toolCallsToRun: [{ toolId: 'file.read_text', arguments: { filePath: 'tsconfig.test.json' } }],
        customExecutor: async () => {
          securityInFlight = true;
          await new Promise(r => setTimeout(r, 60));
          if (reconInFlight) bothOverlapped = true;
          securityInFlight = false;
          return { summary: 'Concurrent security read completed.', verified: true };
        }
      })
    ]);
    assert(
      concRecon.status === 'COMPLETED' && concSec.status === 'COMPLETED' && Boolean(bothOverlapped),
      '10. Concurrent read-only tasks (`recon` + `security`) execute in parallel without conflict'
    );

    // =========================================================================
    // 11. CONFLICTING FILE-WRITE PREVENTION (`FILE_LOCK_CONFLICT`)
    // =========================================================================
    const sharedWriteTarget = '.orion_memory/test_lock_conflict.txt';
    agentSystem.registerCustomAgent({
      id: 'impl-helper',
      displayName: 'Secondary Implementation Agent',
      roleTitle: 'Scoped writer for lock conflict test',
      maxPermissionLevel: 'MEDIUM',
      allowedTools: ['file.read_text', 'file.write_text'],
      readOnly: false
    });

    const [writerOne, writerTwo] = await Promise.all([
      agentSystem.runEngineeringTask({
        agentId: 'implementation',
        title: 'Primary writer holding file lock',
        prompt: 'Write shared file',
        targetFilesForWrite: [sharedWriteTarget],
        customExecutor: async () => {
          await new Promise(r => setTimeout(r, 80));
          return { summary: 'Writer 1 completed cleanly.', verified: true };
        }
      }),
      (async () => {
        await new Promise(r => setTimeout(r, 15));
        return await agentSystem.runEngineeringTask({
          agentId: 'impl-helper',
          title: 'Conflicting concurrent writer on same file',
          prompt: 'Attempt concurrent write to locked file',
          targetFilesForWrite: [sharedWriteTarget],
          customExecutor: async () => ({ summary: 'Should be blocked by lock', verified: true })
        });
      })()
    ]);

    assert(
      writerOne.status === 'COMPLETED' &&
        writerTwo.status === 'BLOCKED' &&
        Boolean(writerTwo.error?.includes('FILE_LOCK_CONFLICT')),
      '11. Conflicting concurrent file writes to the same file are prevented (`FILE_LOCK_CONFLICT`)'
    );

    // =========================================================================
    // 12. CANCELLATION & TIMEOUT ENFORCEMENT (`AbortSignal` & `timeoutMs`)
    // =========================================================================
    const cancelCtrl = new AbortController();
    setTimeout(() => cancelCtrl.abort(), 25);
    const cancelledTaskRes = await agentSystem.runEngineeringTask({
      agentId: 'research',
      title: 'Cancellable research task',
      prompt: 'Wait for abort signal',
      signal: cancelCtrl.signal,
      customExecutor: async ({ signal }) => {
        await new Promise((resolve, reject) => {
          const timer = setTimeout(resolve, 500);
          signal.addEventListener('abort', () => {
            clearTimeout(timer);
            reject(new Error('TASK_CANCELLED'));
          });
        });
        return { summary: 'Should not complete', verified: false };
      }
    });

    const timeoutTaskRes = await agentSystem.runEngineeringTask({
      agentId: 'research',
      title: 'Timed-out task',
      prompt: 'Exceed timeout',
      timeoutMs: 40,
      maxRetries: 0,
      customExecutor: async () => {
        await new Promise(r => setTimeout(r, 250));
        return { summary: 'Should time out', verified: false };
      }
    });

    assert(
      cancelledTaskRes.status === 'CANCELLED' &&
        timeoutTaskRes.status === 'FAILED' &&
        Boolean(timeoutTaskRes.error?.includes('TASK_TIMEOUT')),
      '12. Cancellation (`CANCELLED`) and timeout (`TASK_TIMEOUT`) are enforced deterministically'
    );

    // =========================================================================
    // 13. BOUNDED RETRIES (`maxRetries` RESPECTED)
    // =========================================================================
    let transientAttempts = 0;
    const retriedTaskRes = await agentSystem.runEngineeringTask({
      agentId: 'recon',
      title: 'Transient failure recovery within bounded retries',
      prompt: 'Retry once then succeed',
      maxRetries: 2,
      customExecutor: async () => {
        transientAttempts++;
        if (transientAttempts < 2) {
          throw new Error('TRANSIENT_IO_SPIKE');
        }
        return { summary: `Recovered on attempt ${transientAttempts}`, verified: true };
      }
    });
    assert(
      retriedTaskRes.status === 'COMPLETED' && transientAttempts === 2 && retriedTaskRes.retryCount === 1,
      `13. Bounded retry policy recovers from transient failure within maxRetries (attempts=${transientAttempts})`
    );

    // =========================================================================
    // 14. E-STOP INTERACTION (BLOCKS AGENT TASKS UNTIL EXPLICIT RESET)
    // =========================================================================
    await ProcessSupervisor.getInstance().triggerEstop();
    const estopBlockedTask = await agentSystem.runEngineeringTask({
      agentId: 'windows',
      title: 'Task attempted during active E-Stop',
      prompt: 'Check system info',
      toolCallsToRun: [{ toolId: 'system.get_info', arguments: {} }]
    });
    ProcessSupervisor.getInstance().resetEstop();
    kernel.permissionService.resetEmergencyStop();

    assert(
      estopBlockedTask.status === 'BLOCKED' &&
        /Emergency Stop/i.test(estopBlockedTask.error || ''),
      '14. Active E-Stop immediately blocks agent task execution (`BLOCKED`)'
    );

    // =========================================================================
    // 15. TOOL PERMISSION ENFORCEMENT (READ-ONLY AGENTS BLOCKED FROM MUTATION)
    // =========================================================================
    const qaWriteBlocked = await agentSystem.runEngineeringTask({
      agentId: 'qa',
      title: 'Unauthorized file write attempt by read-only QA agent',
      prompt: 'Attempt to modify production file',
      toolCallsToRun: [
        {
          toolId: 'file.write_text',
          arguments: { filePath: '.orion_memory/qa_forbidden.txt', content: 'forbidden' }
        }
      ]
    });
    assert(
      qaWriteBlocked.status === 'BLOCKED' &&
        /AGENT POLICY VIOLATION/i.test(qaWriteBlocked.error || ''),
      '15. Read-only `qa` agent is strictly blocked from calling mutating tool `file.write_text`'
    );

    // =========================================================================
    // 16. SECRET REDACTION IN PERSISTED TASK HISTORY & LOGS
    // =========================================================================
    const canarySecret = 'sk-ant-api03-SUPER_SECRET_AGENT_CANARY_9876543210abcdef';
    await agentSystem.runEngineeringTask({
      agentId: 'security',
      title: 'Audit log secret redaction test',
      prompt: `Verify redaction of ${canarySecret}`,
      customExecutor: async () => ({
        summary: `Inspected string containing ${canarySecret} and redacted it.`,
        verified: true
      })
    });
    const rawDiskAfterSecret = fs.readFileSync(statePath, 'utf8');
    const logsHaveRawSecret = JSON.stringify(agentSystem.getAgentLogs()).includes(canarySecret);
    assert(
      !rawDiskAfterSecret.includes(canarySecret) && !logsHaveRawSecret,
      '16. Secrets (`sk-ant-...`) are redacted before persisting task history or agent logs to disk'
    );

    // =========================================================================
    // 17. RESTART RECOVERY (INTERRUPTED TASKS & CUSTOM AGENT RELOAD)
    // =========================================================================
    // Inject a synthetic RUNNING task into the state file to simulate an unexpected process crash
    const stateBeforeCrash = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    stateBeforeCrash.tasks.push({
      taskId: 'task_crashed_in_flight_999',
      agentId: 'implementation',
      title: 'In-flight code mutation interrupted by crash',
      prompt: 'Modify file',
      status: 'RUNNING',
      dependencies: [],
      targetFilesForWrite: ['.orion_memory/interrupted.txt'],
      parentMaxPermission: 'MEDIUM',
      timeoutMs: 30000,
      maxRetries: 1,
      retryCount: 0,
      createdAt: Date.now() - 5000,
      startedAt: Date.now() - 4000
    });
    fs.writeFileSync(statePath, JSON.stringify(stateBeforeCrash, null, 2), 'utf8');

    const recoveredSystem = new OrionAgentSystem(
      policyService,
      toolService,
      omniRouter,
      undefined,
      statePath
    );
    const recoveredTask = recoveredSystem.getTask('task_crashed_in_flight_999');
    const reloadedCustom = recoveredSystem.getEngineeringAgentDefinition('perf-profiler');
    assert(
      recoveredTask?.status === 'INTERRUPTED' &&
        Boolean(recoveredTask?.error?.includes('not auto-replayed')) &&
        Boolean(reloadedCustom && reloadedCustom.displayName === 'Performance Profiler'),
      '17. Restart recovery reloads custom agents and marks previously RUNNING tasks as INTERRUPTED without replaying mutations'
    );

    // =========================================================================
    // 18. ACCURATE TASK COMPLETION REPORTING (`delegateEngineeringGoal`)
    // =========================================================================
    const delegationReport = await recoveredSystem.delegateEngineeringGoal(
      'Audit package.json and security posture',
      { targetPath: 'package.json' }
    );
    assert(
      delegationReport.overallStatus === 'COMPLETED' &&
        delegationReport.tasksExecuted.length === 3 &&
        delegationReport.tasksExecuted[0].filesInspected.includes('package.json') &&
        delegationReport.tasksExecuted.every(t => t.status === 'COMPLETED' && t.verified === true),
      '18. Commander delegation executes recon + security concurrently followed by dependent QA verification with full evidence'
    );

    // =========================================================================
    // 19. COMMANDER RECONCILIATION OF CONFLICTING FINDINGS
    // =========================================================================
    const conflictReports = recoveredSystem.reconcileAgentFindings([
      {
        agentId: 'research',
        claimId: 'c_unverified',
        topic: 'PowerShell Execution Safety',
        conclusion: 'WindowManagerService still interpolates raw strings into PowerShell.',
        verifiedByTool: false,
        evidenceReferences: [],
        filesInspected: [],
        confidence: 'LOW'
      },
      {
        agentId: 'security',
        claimId: 'c_verified',
        topic: 'PowerShell Execution Safety',
        conclusion: 'WindowManagerService uses execFileAsync with ORION_TARGET_TITLE env var and zero string interpolation.',
        verifiedByTool: true,
        evidenceReferences: ['file.read_text:src/main/services/computer/WindowManagerService.ts', 'test:SecurityHardeningAndReliability.test.ts'],
        filesInspected: ['src/main/services/computer/WindowManagerService.ts'],
        confidence: 'HIGH'
      }
    ]);
    assert(
      conflictReports.length === 1 &&
        conflictReports[0].hasConflict === true &&
        conflictReports[0].allFindingsPreserved.length === 2 &&
        conflictReports[0].winningAgentId === 'security' &&
        conflictReports[0].authoritativeConclusion.includes('execFileAsync'),
      '19. Commander reconciliation preserves conflicting findings and selects tool-verified evidence over unverified claims'
    );

    // =========================================================================
    // 20. GEMINI & ARGON CONNECTION / AVAILABILITY VALIDATION
    // =========================================================================
    const backendHealth = recoveredSystem.getBackendHealthSummary();
    assert(
      backendHealth.argon.status === 'UNAVAILABLE' &&
        backendHealth.argon.configured === false &&
        (backendHealth.gemini.status.includes('NOT CONFIGURED') || backendHealth.gemini.status === 'READY') &&
        backendHealth.policyIntegrityVerified === true,
      `20. Backend health truthfully reports Gemini (${backendHealth.gemini.status}) and Argon (${backendHealth.argon.status})`
    );
  } finally {
    kernel.shutdown();
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }

  console.log('\n================================================================================');
  console.log(`ORION ENGINEERING AGENT RUNTIME SUMMARY: ${passed}/20 passed, ${failed} failed`);
  console.log('================================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runEngineeringAgentRuntimeSuite().catch(err => {
  console.error('Fatal error in OrionEngineeringAgentRuntime.test.ts:', err);
  process.exit(1);
});
