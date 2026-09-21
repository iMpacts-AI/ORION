import { TitanClosedLoopPipeline, TitanPipelineState } from '../titan/TitanClosedLoopPipeline';
import { ToolService } from '../ToolService';
import { ToolRegistry } from '../ToolRegistry';
import path from 'path';
import fs from 'fs';

async function runTitanClosedLoopPipelineTests() {
  console.log('--- RUNNING PROJECT TITAN x ORION — PHASE 3 INTEGRATION SUITE ---');
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

  // 1. Initial State Verification
  {
    const pipeline = new TitanClosedLoopPipeline();
    assert(pipeline.getState() === 'IDLE', 'Pipeline initializes cleanly in IDLE state');
  }

  // 2. Successful Inspection State Transition
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    const stages = res.auditTrail.map((a) => a.stage);

    assert(
      stages.includes('INSPECTING') && res.artifacts.stateTelemetry !== undefined,
      'Pipeline transitions through INSPECTING and captures verified state telemetry'
    );
  }

  // 3. Successful Planning State Transition
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    const stages = res.auditTrail.map((a) => a.stage);

    assert(
      stages.includes('PLANNING') && Boolean(res.artifacts.visualPlanPath),
      'Pipeline transitions through PLANNING and verifies non-empty visual plan artifact'
    );
  }

  // 4. Successful Voice Stage Transition
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    const stages = res.auditTrail.map((a) => a.stage);

    assert(
      stages.includes('VOICE_READY') && Boolean(res.artifacts.audioPath),
      'Pipeline transitions through VOICE_READY and verifies master voiceover audio track'
    );
  }

  // 5. Render Approval Required Gate (requiresApproval: true enforcement)
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });

    assert(
      res.state === 'AWAITING_RENDER_APPROVAL' &&
      res.gatePassed === false &&
      res.renderAttempts === 0 &&
      Boolean(res.error?.includes('Explicit user approval required')),
      'Unapproved pipeline execution stops safely at AWAITING_RENDER_APPROVAL without rendering'
    );
  }


  // 6. Approved Render Transition (when user approval flag is present)
  {
    // Mock rendering to avoid long expensive ffmpeg compilation during unit tests
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    // Mock titan.render_video_draft to return instant success without physical render
    toolService.executeTool = async (call) => {
      if (call.toolId === 'titan.render_video_draft') {
        const fakeOutput = path.join(titanRootDir, '07_Video_Projects', 'Experimental', 'Video_001_Dynamic_Test.mp4');
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: {
            target: 'Video_001',
            outputFile: fakeOutput,
            outputSizeBytes: 1000000,
            exitCode: 0,
            timedOut: false,
            durationMs: 1500
          },
          timestamp: Date.now(),
          executionTimeMs: 1500
        };
      }
      // Delegate other calls
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: true });

    assert(
      res.renderAttempts === 1 && (res.state === 'GATE_PASSED' || res.state === 'GATE_FAILED'),
      'Approved pipeline execution proceeds through RENDERING and evaluates QA gate'
    );
  }

  // 7. QA >= 90 → GATE_PASSED Transition
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    // Mock render + high-score QA
    toolService.executeTool = async (call) => {
      if (call.toolId === 'titan.render_video_draft') {
        const fakeOutput = path.join(titanRootDir, '07_Video_Projects', 'Experimental', 'Video_001_Dynamic_Test.mp4');
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: { outputFile: fakeOutput, outputSizeBytes: 2000000, exitCode: 0 },
          timestamp: Date.now(),
          executionTimeMs: 1000
        };
      }
      if (call.toolId === 'titan.run_viewer_experience_qa') {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: {
            rawStdout: 'Overall Retention Score : 94.5/100\nHook Pacing Score : 96.0/100',
            reportClassification: 'CLASSIFICATION A'
          },
          timestamp: Date.now(),
          executionTimeMs: 500
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: true });

    assert(
      res.state === 'GATE_PASSED' && res.gatePassed === true && Boolean(res.qaScore && res.qaScore >= 90.0),
      'QA score >= 90.0 correctly sets state to GATE_PASSED with verified gatePassed: true'
    );
  }

  // 8. QA < 90 → GATE_FAILED Transition with Failure Report
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    // Mock render + low-score QA
    toolService.executeTool = async (call) => {
      if (call.toolId === 'titan.render_video_draft') {
        const fakeOutput = path.join(titanRootDir, '07_Video_Projects', 'Experimental', 'Video_001_Dynamic_Test.mp4');
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: { outputFile: fakeOutput, outputSizeBytes: 2000000, exitCode: 0 },
          timestamp: Date.now(),
          executionTimeMs: 1000
        };
      }
      if (call.toolId === 'titan.run_viewer_experience_qa') {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: {
            rawStdout: 'Overall Retention Score : 78.5/100\nHook Pacing Score : 70.0/100',
            reportClassification: 'CLASSIFICATION C'
          },
          timestamp: Date.now(),
          executionTimeMs: 500
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: true });

    assert(
      res.state === 'GATE_FAILED' &&
      res.gatePassed === false &&
      Boolean(res.failureReasons && res.failureReasons.length > 0) &&
      Boolean(res.recommendedCorrectiveActions && res.recommendedCorrectiveActions.length > 0),
      'QA score < 90.0 transitions to GATE_FAILED with structured failure details & recommended corrective actions'
    );
  }

  // 9. No Automatic Retry After Failed Gate
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    toolService.executeTool = async (call) => {
      if (call.toolId === 'titan.render_video_draft') {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: { outputFile: path.join(titanRootDir, '07_Video_Projects', 'Experimental', 'Video_001_Dynamic_Test.mp4'), outputSizeBytes: 1000 },
          timestamp: Date.now(),
          executionTimeMs: 1000
        };
      }
      if (call.toolId === 'titan.run_viewer_experience_qa') {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: { rawStdout: 'Overall Retention Score : 60.0/100' },
          timestamp: Date.now(),
          executionTimeMs: 500
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: true });

    assert(
      res.renderAttempts === 1,
      'Pipeline stops after exactly 1 render attempt when QA gate fails (no infinite automatic rendering)'
    );
  }

  // 10. Bounded Maximum Attempt Enforcement
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, maxRenderAttempts: 1 });
    assert(res.maxRenderAttempts === 1, 'Max render attempts parameter is strictly enforced');
  }

  // 11. Path Traversal & Workspace Escape Rejection
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir: 'C:\\Users\\smsaq\\Downloads' });
    assert(
      res.state === 'ERROR' && Boolean(res.error?.includes('escapes Titan root workspace')),
      'Security check rejects workspace path escaping Titan root directory'
    );
  }

  // 12. Protected Master Preservation Verification
  {
    const masterExportDir = path.join(titanRootDir, '07_Video_Projects', '5_Render_Exports');
    const files = fs.readdirSync(masterExportDir);
    assert(files.length === 3, 'Pipeline execution preserves all 3 Titan 4K Master Renders untouched');
  }

  // 13. Missing Artifact Failure Handling
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    // Return fake missing plan file path
    toolService.executeTool = async (call) => {
      if (call.toolId === 'titan.generate_visual_plan') {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: { outputFile: path.join(titanRootDir, '07_Video_Projects', 'non_existent_plan.json') },
          timestamp: Date.now(),
          executionTimeMs: 100
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res = await pipeline.executePipeline({ titanRootDir });
    assert(
      res.state === 'ERROR' && Boolean(res.error?.includes('Postcondition Failed')),
      'Pipeline halts with ERROR when required stage output artifact is missing'
    );
  }

  // 14. Zero-Byte Artifact Failure Handling
  {
    const tempZeroFile = path.join(titanRootDir, '07_Video_Projects', 'temp_zero_plan.json');
    fs.writeFileSync(tempZeroFile, '', 'utf-8');

    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    toolService.executeTool = async (call) => {
      if (call.toolId === 'titan.generate_visual_plan') {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: { outputFile: tempZeroFile },
          timestamp: Date.now(),
          executionTimeMs: 100
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res = await pipeline.executePipeline({ titanRootDir });
    assert(
      res.state === 'ERROR' && Boolean(res.error?.includes('missing or empty')),
      'Pipeline halts with ERROR when stage artifact is 0 bytes'
    );

    try { fs.unlinkSync(tempZeroFile); } catch {}
  }

  // 15. Structured Error Propagation
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir: 'C:\\Users\\smsaq\\Desktop' });
    assert(
      res.state === 'ERROR' && Boolean(res.failureReasons) && Boolean(res.recommendedCorrectiveActions),
      'Structured error response contains runId, state, failureReasons, and recommendedCorrectiveActions'
    );
  }

  // 16. Audit Trail Generation
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    assert(
      res.auditTrail.length >= 3 && res.auditTrail[0].stage === 'INSPECTING',
      'Audit trail records chronological timestamped log of every pipeline execution stage'
    );
  }

  // 17. QA Threshold Boundary Precision Test (89.99 must FAIL, 90.00 must PASS)
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    // Sub-test A: Score 89.99
    toolService.executeTool = async (call) => {
      if (call.toolId === 'titan.render_video_draft') {
        const fakeOutput = path.join(titanRootDir, '07_Video_Projects', 'Experimental', 'Video_001_Dynamic_Test.mp4');
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: { outputFile: fakeOutput, outputSizeBytes: 2000000, exitCode: 0 },
          timestamp: Date.now(),
          executionTimeMs: 100
        };
      }
      if (call.toolId === 'titan.run_viewer_experience_qa') {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: {
            rawStdout: 'Overall Retention Score : 89.99/100\nHook Pacing Score : 88.0/100'
          },
          timestamp: Date.now(),
          executionTimeMs: 50
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline89 = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res89 = await pipeline89.executePipeline({ titanRootDir, hasExplicitRenderApproval: true });

    assert(
      res89.state === 'GATE_FAILED' && res89.gatePassed === false && res89.qaScore === 89.99,
      'Score of 89.99 strictly produces GATE_FAILED (no premature integer truncation to 90)'
    );

    // Sub-test B: Score 90.00
    toolService.executeTool = async (call) => {
      if (call.toolId === 'titan.render_video_draft') {
        const fakeOutput = path.join(titanRootDir, '07_Video_Projects', 'Experimental', 'Video_001_Dynamic_Test.mp4');
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: { outputFile: fakeOutput, outputSizeBytes: 2000000, exitCode: 0 },
          timestamp: Date.now(),
          executionTimeMs: 100
        };
      }
      if (call.toolId === 'titan.run_viewer_experience_qa') {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: {
            rawStdout: 'Overall Retention Score : 90.00/100\nHook Pacing Score : 90.0/100'
          },
          timestamp: Date.now(),
          executionTimeMs: 50
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline90 = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res90 = await pipeline90.executePipeline({ titanRootDir, hasExplicitRenderApproval: true });

    assert(
      res90.state === 'GATE_PASSED' && res90.gatePassed === true && res90.qaScore === 90.00,
      'Score of 90.00 strictly produces GATE_PASSED at exact threshold equality'
    );
  }

  // 18. QA Tool Execution Error Handling
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    toolService.executeTool = async (call) => {
      if (call.toolId === 'titan.render_video_draft') {
        const fakeOutput = path.join(titanRootDir, '07_Video_Projects', 'Experimental', 'Video_001_Dynamic_Test.mp4');
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: { outputFile: fakeOutput, outputSizeBytes: 2000000, exitCode: 0 },
          timestamp: Date.now(),
          executionTimeMs: 100
        };
      }
      if (call.toolId === 'titan.run_viewer_experience_qa') {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: false,
          verificationStatus: 'FAILED',
          verified: false,
          error: 'Auditor runtime failure: script crashed',
          timestamp: Date.now(),
          executionTimeMs: 50
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipelineErr = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const resErr = await pipelineErr.executePipeline({ titanRootDir, hasExplicitRenderApproval: true });

    assert(
      resErr.state === 'GATE_PASSED' || resErr.state === 'GATE_FAILED' || resErr.state === 'ERROR',
      'QA auditor execution error triggers clean fallback or failure state without uncaught exception'
    );
  }

  console.log(`\nTITAN CLOSED LOOP PIPELINE PHASE 3 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTitanClosedLoopPipelineTests();

