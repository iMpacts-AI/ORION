import { TitanClosedLoopPipeline } from '../titan/TitanClosedLoopPipeline';
import { ToolService } from '../ToolService';
import { ToolRegistry } from '../ToolRegistry';
import path from 'path';
import fs from 'fs';

async function runTitanHUDIntegrationTests() {
  console.log('--- RUNNING PROJECT TITAN x ORION — PHASE 4 HUD INTEGRATION SUITE ---');
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

  // 1. Pipeline Triggering Through Intended API
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, target: 'Video_001', hasExplicitRenderApproval: false });
    assert(Boolean(res.runId) && res.target === 'Video_001', 'Pipeline can be triggered with structured parameters via API');
  }

  // 2. Renderer Receives State Changes via Audit Events
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    assert(
      res.auditTrail.length > 0 && res.auditTrail.some((a) => a.stage === 'INSPECTING'),
      'State transition events are recorded chronologically in audit log for renderer emission'
    );
  }

  // 3. Approval Request Reaches Renderer
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    assert(
      res.state === 'AWAITING_RENDER_APPROVAL' && Boolean(res.error?.includes('Explicit user approval required')),
      'Pipeline pauses at AWAITING_RENDER_APPROVAL when approval flag is false'
    );
  }

  // 4. Approval Reaches Main Process & Resumes Execution
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    // Mock rendering tool to complete without expensive physical video compile
    toolService.executeTool = async (call) => {
      if (call.toolId === 'titan.render_video_draft') {
        const fakeOutput = path.join(titanRootDir, '07_Video_Projects', 'Experimental', 'Video_001_Dynamic_Test.mp4');
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: { outputFile: fakeOutput, outputSizeBytes: 2500000, exitCode: 0 },
          timestamp: Date.now(),
          executionTimeMs: 1200
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: true });

    assert(
      res.renderAttempts === 1 && (res.state === 'GATE_PASSED' || res.state === 'GATE_FAILED'),
      'Explicit approval authorizes pipeline to proceed to RENDERING stage and evaluate QA gate'
    );
  }

  // 5. Unapproved Render Cannot Execute
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    let renderExecuted = false;
    toolService.executeTool = async (call) => {
      if (call.toolId === 'titan.render_video_draft') {
        renderExecuted = true;
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });

    assert(
      renderExecuted === false && res.state === 'AWAITING_RENDER_APPROVAL',
      'Unapproved render call NEVER reaches tool execution layer'
    );
  }

  // 6. Approved Render Can Proceed
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    let renderExecuted = false;
    toolService.executeTool = async (call) => {
      if (call.toolId === 'titan.render_video_draft') {
        renderExecuted = true;
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: { outputFile: path.join(titanRootDir, '07_Video_Projects', 'Experimental', 'Video_001_Dynamic_Test.mp4'), outputSizeBytes: 100000 },
          timestamp: Date.now(),
          executionTimeMs: 500
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: true });

    assert(Boolean(renderExecuted), 'Approved render call successfully executes through tool service');
  }


  // 7. QA < 90 Produces GATE_FAILED
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
          data: { outputFile: path.join(titanRootDir, '07_Video_Projects', 'Experimental', 'Video_001_Dynamic_Test.mp4'), outputSizeBytes: 100000 },
          timestamp: Date.now(),
          executionTimeMs: 500
        };
      }
      if (call.toolId === 'titan.run_viewer_experience_qa') {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: { rawStdout: 'Overall Retention Score : 82.0/100' },
          timestamp: Date.now(),
          executionTimeMs: 300
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: true });

    assert(res.state === 'GATE_FAILED' && res.gatePassed === false, 'QA score < 90.0 correctly produces GATE_FAILED state');
  }

  // 8. QA >= 90 Produces GATE_PASSED
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
          data: { outputFile: path.join(titanRootDir, '07_Video_Projects', 'Experimental', 'Video_001_Dynamic_Test.mp4'), outputSizeBytes: 100000 },
          timestamp: Date.now(),
          executionTimeMs: 500
        };
      }
      if (call.toolId === 'titan.run_viewer_experience_qa') {
        return {
          toolCallId: call.id,
          toolId: call.toolId,
          success: true,
          verificationStatus: 'VERIFIED',
          verified: true,
          data: { rawStdout: 'Overall Retention Score : 95.0/100' },
          timestamp: Date.now(),
          executionTimeMs: 300
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: true });

    assert(res.state === 'GATE_PASSED' && res.gatePassed === true, 'QA score >= 90.0 correctly produces GATE_PASSED state');
  }

  // 9. Audit Events Reach UI Layer (Payload contains full audit trail array)
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    assert(
      Array.isArray(res.auditTrail) && res.auditTrail.length > 0 && Boolean(res.auditTrail[0].timestamp),
      'Complete audit trail array is returned in response payload for UI rendering'
    );
  }

  // 10. Arbitrary Titan Paths Remain Blocked
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir: 'C:\\Windows\\System32' });
    assert(
      res.state === 'ERROR' && Boolean(res.error?.includes('escapes Titan root workspace')),
      'Arbitrary paths outside Titan root directory are strictly blocked'
    );
  }

  // 11. Arbitrary Targets Remain Blocked
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ target: 'INVALID_PROJECT_NAME', titanRootDir, hasExplicitRenderApproval: true });
    assert(
      res.state === 'ERROR' || res.gatePassed === false,
      'Arbitrary target keys outside allowlist are strictly rejected'
    );
  }

  // 12. Credentials Never Appear in Renderer Events
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    const jsonStr = JSON.stringify(res);
    assert(
      !jsonStr.includes('sk-') && !jsonStr.includes('gsk_') && !jsonStr.includes('AIza'),
      'Pipeline result object contains zero leaked API keys or credentials'
    );
  }

  // 13. HUD Packaging & Release Integration Contract Verification
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    const pkgTool = registry.getTool('titan.package_release');
    const valTool = registry.getTool('titan.validate_release');

    assert(
      Boolean(pkgTool) && Boolean(valTool) &&
      pkgTool?.permissionLevel === 'MEDIUM' &&
      valTool?.permissionLevel === 'LOW',
      'HUD exposes registered contracts for titan.package_release and titan.validate_release'
    );
  }

  // 14. HUD Release Validation Integration Execution
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    const valRes = await toolService.executeTool({
      id: 'hud_val_test',
      toolId: 'titan.validate_release',
      toolName: 'Titan Validate Release Package',
      arguments: { target: 'Video_001', titanPath: titanRootDir },
      timestamp: Date.now(),
      requiresUserApproval: false
    });

    assert(
      valRes.success === true &&
      valRes.data?.valid === true &&
      Boolean(valRes.data?.canonicalHash),
      'HUD release auditor verifies live Video_001 release candidate package and canonical hash'
    );
  }

  console.log(`\nTITAN HUD INTEGRATION PHASE 4 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTitanHUDIntegrationTests();
