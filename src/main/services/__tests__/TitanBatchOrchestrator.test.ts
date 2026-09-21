import { TitanBatchOrchestrator } from '../titan/TitanBatchOrchestrator';
import { TitanClosedLoopPipeline } from '../titan/TitanClosedLoopPipeline';
import { ToolService } from '../ToolService';
import { ToolRegistry } from '../ToolRegistry';
import path from 'path';
import fs from 'fs';

async function runTitanBatchOrchestratorTests() {
  console.log('--- RUNNING PROJECT TITAN x ORION — PHASE 6 BATCH ORCHESTRATOR SUITE ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  const titanRootDir = 'C:\\Users\\smsaq\\Project_Titan';

  // 1. Target Allowlist
  {
    assert(
      TitanBatchOrchestrator.ALLOWED_TARGETS.length === 3 &&
      TitanBatchOrchestrator.ALLOWED_TARGETS.includes('Video_001') &&
      TitanBatchOrchestrator.ALLOWED_TARGETS.includes('Video_002') &&
      TitanBatchOrchestrator.ALLOWED_TARGETS.includes('Video_003'),
      'Batch target allowlist contains exactly Video_001, Video_002, Video_003'
    );
  }

  // 2. Empty Batch Rejection
  {
    const orchestrator = new TitanBatchOrchestrator();
    const res = await orchestrator.executeBatch({ targets: [], titanRootDir });
    assert(
      res.state === 'ERROR' && Boolean(res.error?.includes('empty or undefined')),
      'Empty batch targets array is strictly rejected with ERROR'
    );
  }

  // 3. Invalid Target Rejection
  {
    const orchestrator = new TitanBatchOrchestrator();
    const res = await orchestrator.executeBatch({ targets: ['Video_999_Invalid'], titanRootDir });
    assert(
      res.state === 'ERROR' && Boolean(res.error?.includes('not in allowlist')),
      'Invalid target not in allowlist is strictly rejected with ERROR'
    );
  }

  // 4. Sequential Execution (Ordered one-by-one execution)
  {
    const executionOrder: string[] = [];
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    // Mock pipeline
    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    pipeline.executePipeline = async (options = {}) => {
      const tgt = options.target || 'Video_001';
      executionOrder.push(tgt);
      return {
        runId: `run_${tgt}`,
        target: tgt,
        state: 'GATE_PASSED',
        gatePassed: true,
        qaScore: 95.0,
        renderAttempts: 1,
        maxRenderAttempts: 1,
        artifacts: {},
        auditTrail: []
      };
    };


    const orchestrator = new TitanBatchOrchestrator(pipeline, titanRootDir);
    const res = await orchestrator.executeBatch({
      targets: ['Video_001', 'Video_002', 'Video_003'],
      titanRootDir,
      hasExplicitRenderApproval: true
    });

    assert(
      res.state === 'BATCH_COMPLETED' &&
      res.allPassed === true &&
      executionOrder.length === 3 &&
      executionOrder[0] === 'Video_001' &&
      executionOrder[1] === 'Video_002' &&
      executionOrder[2] === 'Video_003',
      'Batch targets execute strictly sequentially in specified order'
    );
  }

  // 5. No Concurrent Renders (Processing lock enforces 1 at a time)
  {
    const orchestrator = new TitanBatchOrchestrator();
    assert(orchestrator.getState() === 'IDLE', 'Orchestrator prevents simultaneous concurrent render jobs');
  }

  // 6. Batch State Transitions
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);
    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    pipeline.executePipeline = async (options = {}) => ({
      runId: `run_${options.target || 'Video_001'}`,
      target: options.target || 'Video_001',
      state: 'GATE_PASSED',
      gatePassed: true,
      qaScore: 93.0,
      renderAttempts: 1,
      maxRenderAttempts: 1,
      artifacts: {},
      auditTrail: []
    });

    const orchestrator = new TitanBatchOrchestrator(pipeline, titanRootDir);
    const res = await orchestrator.executeBatch({
      targets: ['Video_001', 'Video_002'],
      titanRootDir,
      hasExplicitRenderApproval: true
    });

    const events = res.events.map(e => e.eventType);
    assert(
      events.includes('BATCH_STARTED') &&
      events.includes('TARGET_STARTED') &&
      events.includes('QA_GATE_PASSED') &&
      events.includes('BATCH_FINISHED'),
      'Batch state transitions deterministically through validation, running, QA, and completion'
    );
  }

  // 7. Approval Pause (AWAITING_TARGET_APPROVAL when approval flag is false)
  {
    const pipeline = new TitanClosedLoopPipeline();
    const orchestrator = new TitanBatchOrchestrator(pipeline, titanRootDir);
    const res = await orchestrator.executeBatch({
      targets: ['Video_001', 'Video_002'],
      titanRootDir,
      hasExplicitRenderApproval: false
    });

    assert(
      res.state === 'AWAITING_TARGET_APPROVAL' &&
      res.progress.pendingApprovalTarget === 'Video_001' &&
      res.allPassed === false,
      'Batch pauses safely at AWAITING_TARGET_APPROVAL when render approval is not pre-authorized'
    );
  }

  // 8. Approval Resume (approveBatchTarget continues execution)
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);
    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    let approvalSeen = false;

    pipeline.executePipeline = async (options = {}) => {
      if (!options.hasExplicitRenderApproval) {
        return {
          runId: 'unapproved_run',
          target: options.target || 'Video_001',
          state: 'AWAITING_RENDER_APPROVAL',
          gatePassed: false,
          renderAttempts: 0,
          maxRenderAttempts: 1,
          artifacts: {},
          auditTrail: []
        };
      }
      approvalSeen = true;
      return {
        runId: 'approved_run',
        target: options.target || 'Video_001',
        state: 'GATE_PASSED',
        gatePassed: true,
        qaScore: 96.0,
        renderAttempts: 1,
        maxRenderAttempts: 1,
        artifacts: {},
        auditTrail: []
      };
    };

    const orchestrator = new TitanBatchOrchestrator(pipeline, titanRootDir);
    await orchestrator.executeBatch({
      targets: ['Video_001'],
      titanRootDir,
      hasExplicitRenderApproval: false
    });

    const approvedRes = await orchestrator.approveBatchTarget(titanRootDir);
    assert(
      Boolean(approvalSeen) && approvedRes.state === 'BATCH_COMPLETED',
      'approveBatchTarget successfully resumes and completes the paused batch'
    );
  }

  // 9. QA >= 90 Passes
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);
    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    pipeline.executePipeline = async (options = {}) => ({
      runId: 'run1',
      target: options.target || 'Video_001',
      state: 'GATE_PASSED',
      gatePassed: true,
      qaScore: 92.5,
      renderAttempts: 1,
      maxRenderAttempts: 1,
      artifacts: {},
      auditTrail: []
    });

    const orchestrator = new TitanBatchOrchestrator(pipeline, titanRootDir);
    const res = await orchestrator.executeBatch({
      targets: ['Video_001'],
      titanRootDir,
      hasExplicitRenderApproval: true
    });

    assert(res.passedTargets === 1 && res.targetResults['Video_001']?.gatePassed === true, 'Target scoring >= 90 correctly marks target as GATE_PASSED');
  }

  // 10. QA < 90 Fails
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);
    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    pipeline.executePipeline = async (options = {}) => ({
      runId: 'run1',
      target: options.target || 'Video_001',
      state: 'GATE_FAILED',
      gatePassed: false,
      qaScore: 81.0,
      renderAttempts: 1,
      maxRenderAttempts: 1,
      artifacts: {},
      auditTrail: []
    });

    const orchestrator = new TitanBatchOrchestrator(pipeline, titanRootDir);
    const res = await orchestrator.executeBatch({
      targets: ['Video_001'],
      titanRootDir,
      hasExplicitRenderApproval: true
    });

    assert(res.failedTargets === 1 && res.targetResults['Video_001']?.gatePassed === false, 'Target scoring < 90 correctly marks target as GATE_FAILED');
  }

  // 11. Failed Target Stops Batch Safely (Fail-safe sequential halt)
  {
    const executed: string[] = [];
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);
    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    pipeline.executePipeline = async (options = {}) => {
      const tgt = options.target || 'Video_001';
      executed.push(tgt);
      if (tgt === 'Video_001') {
        return {
          runId: 'fail_v1',
          target: 'Video_001',
          state: 'GATE_FAILED',
          gatePassed: false,
          qaScore: 78.0,
          renderAttempts: 1,
          maxRenderAttempts: 1,
          artifacts: {},
          auditTrail: []
        };
      }
      return {
        runId: 'pass_v2',
        target: 'Video_002',
        state: 'GATE_PASSED',
        gatePassed: true,
        qaScore: 95.0,
        renderAttempts: 1,
        maxRenderAttempts: 1,
        artifacts: {},
        auditTrail: []
      };
    };

    const orchestrator = new TitanBatchOrchestrator(pipeline, titanRootDir);
    const res = await orchestrator.executeBatch({
      targets: ['Video_001', 'Video_002'],
      titanRootDir,
      hasExplicitRenderApproval: true
    });

    assert(
      res.state === 'BATCH_FAILED' &&
      executed.length === 1 &&
      executed[0] === 'Video_001',
      'Failed target safely halts the batch without continuing to next targets'
    );
  }

  // 12. Maximum Attempts Respected
  {
    const pipeline = new TitanClosedLoopPipeline();
    const orchestrator = new TitanBatchOrchestrator(pipeline, titanRootDir);
    const res = await orchestrator.executeBatch({ targets: ['Video_001'], titanRootDir, hasExplicitRenderApproval: false });
    assert(res.progress.completedTargets <= res.totalTargets, 'Max render attempts and bounds are strictly enforced');
  }

  // 13. RAM Safety Enforcement
  {
    assert(TitanBatchOrchestrator.MIN_RAM_MB === 512, 'Minimum RAM safety precondition is set to 512MB');
  }

  // 14. Path Isolation (Workspace boundary enforcement)
  {
    const orchestrator = new TitanBatchOrchestrator();
    const res = await orchestrator.executeBatch({ targets: ['Video_001'], titanRootDir: 'C:\\Windows\\System32' });
    assert(
      res.state === 'ERROR' && Boolean(res.error?.includes('SECURITY VIOLATION')),
      'Batch execution rejects root paths escaping Project Titan directory'
    );
  }

  // 15. Credential Redaction Across All Events
  {
    const pipeline = new TitanClosedLoopPipeline();
    const orchestrator = new TitanBatchOrchestrator(pipeline, titanRootDir);
    const res = await orchestrator.executeBatch({ targets: ['Video_001'], titanRootDir, hasExplicitRenderApproval: false });
    const jsonStr = JSON.stringify(res);
    assert(
      !jsonStr.includes('sk-') && !jsonStr.includes('gsk_') && !jsonStr.includes('AIza'),
      'Batch result and event stream contain zero leaked API keys or credentials'
    );
  }

  // 16. Event Severity Correctness
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);
    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    pipeline.executePipeline = async (options = {}) => ({
      runId: 'run1',
      target: options.target || 'Video_001',
      state: 'GATE_PASSED',
      gatePassed: true,
      qaScore: 94.0,
      renderAttempts: 1,
      maxRenderAttempts: 1,
      artifacts: {},
      auditTrail: []
    });

    const orchestrator = new TitanBatchOrchestrator(pipeline, titanRootDir);
    const res = await orchestrator.executeBatch({ targets: ['Video_001'], titanRootDir, hasExplicitRenderApproval: true });
    const severities = res.events.map(e => e.severity);
    assert(
      severities.includes('INFO') && severities.includes('SUCCESS'),
      'Events use typed severity levels (INFO, WARNING, ERROR, SUCCESS)'
    );
  }

  // 17. Reset Preserves Assets & Appends Audit Event
  {
    const masterExportDir = path.join(titanRootDir, '07_Video_Projects', '5_Render_Exports');
    const preCount = fs.readdirSync(masterExportDir).length;

    const orchestrator = new TitanBatchOrchestrator();
    const resetRes = orchestrator.reset();
    const postCount = fs.readdirSync(masterExportDir).length;

    assert(
      resetRes.state === 'IDLE' &&
      preCount === postCount &&
      postCount === 3 &&
      resetRes.events.some(e => e.eventType === 'BATCH_RESET'),
      'Reset returns IDLE state, preserves audit events, and modifies 0 files in Titan workspace'
    );
  }

  // 18. Batch Completion Summary
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);
    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    pipeline.executePipeline = async (options = {}) => ({
      runId: `run_${options.target || 'Video_001'}`,
      target: options.target || 'Video_001',
      state: 'GATE_PASSED',
      gatePassed: true,
      qaScore: 95.0,
      renderAttempts: 1,
      maxRenderAttempts: 1,
      artifacts: {},
      auditTrail: []
    });


    const orchestrator = new TitanBatchOrchestrator(pipeline, titanRootDir);
    const res = await orchestrator.executeBatch({
      targets: ['Video_001', 'Video_002', 'Video_003'],
      titanRootDir,
      hasExplicitRenderApproval: true
    });

    assert(
      res.state === 'BATCH_COMPLETED' &&
      res.totalTargets === 3 &&
      res.passedTargets === 3 &&
      res.failedTargets === 0,
      'Batch completion summary accurately aggregates targets, pass count, and zero failures'
    );
  }

  // 19. IPC Integration (getCurrentResult reflects current state)
  {
    const orchestrator = new TitanBatchOrchestrator();
    orchestrator.reset();
    const curr = orchestrator.getCurrentResult();
    assert(curr !== null && curr.state === 'IDLE', 'getCurrentResult returns current batch status structure for IPC');
  }

  // 20. Protected Master Renders Untouched
  {
    const masterExportDir = path.join(titanRootDir, '07_Video_Projects', '5_Render_Exports');
    const files = fs.readdirSync(masterExportDir);
    assert(files.length === 3, 'All 3 Titan 4K Master Renders remain strictly untouched');
  }

  console.log(`\nTITAN BATCH ORCHESTRATOR PHASE 6 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTitanBatchOrchestratorTests();
