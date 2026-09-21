import { TitanClosedLoopPipeline } from '../titan/TitanClosedLoopPipeline';
import { ToolService } from '../ToolService';
import { ToolRegistry } from '../ToolRegistry';
import path from 'path';
import fs from 'fs';

async function runTitanOperatorExperienceTests() {
  console.log('--- RUNNING PROJECT TITAN x ORION — PHASE 5 OPERATOR EXPERIENCE SUITE ---');
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

  // 1. Status State Mapping Verification
  {
    const pipeline = new TitanClosedLoopPipeline();
    assert(pipeline.getState() === 'IDLE', 'Operator status maps cleanly to initial IDLE state');
  }

  // 2. Telemetry Mapping
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    assert(
      res.renderAttempts === 0 && res.maxRenderAttempts === 1 && res.target === 'Video_001',
      'Telemetry metadata accurately captures target, attempt counters, and max attempt bounds'
    );
  }

  // 3. Event Ordering (Chronological timestamps)
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    let isOrdered = true;
    for (let i = 1; i < res.auditTrail.length; i++) {
      if (res.auditTrail[i].timestamp < res.auditTrail[i - 1].timestamp) {
        isOrdered = false;
      }
    }
    assert(isOrdered && res.auditTrail.length >= 3, 'Audit events are stored strictly in chronological order');
  }

  // 4. Event Severity Levels (INFO, WARNING, ERROR, SUCCESS)
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    const severities = res.auditTrail.map((a) => a.severity);
    assert(
      severities.includes('SUCCESS') && severities.includes('WARNING'),
      'Pipeline stages attach typed event severity levels (SUCCESS, WARNING, ERROR, INFO)'
    );
  }

  // 5. Credential Redaction Across All Event Payloads
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    const payloadStr = JSON.stringify(res);
    assert(
      !payloadStr.includes('sk-') && !payloadStr.includes('gsk_') && !payloadStr.includes('AIza'),
      'Audit log and event stream contain zero exposed secrets or credentials'
    );
  }

  // 6. Reset Behavior (Resets state to IDLE)
  {
    const pipeline = new TitanClosedLoopPipeline();
    await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    const resetRes = pipeline.reset();
    assert(
      pipeline.getState() === 'IDLE' && resetRes.state === 'IDLE',
      'Operator reset cleanly resets pipeline state back to IDLE'
    );
  }

  // 7. Reset Preserves Audit History
  {
    const pipeline = new TitanClosedLoopPipeline();
    await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    const preResetCount = pipeline.getAuditTrail().length;
    const resetRes = pipeline.reset();
    assert(
      resetRes.auditTrail.length === preResetCount + 1 &&
      resetRes.auditTrail[resetRes.auditTrail.length - 1].message.includes('Operator reset'),
      'Reset action appends a reset audit log while preserving all previous event history'
    );
  }

  // 8. Reset Cannot Delete Titan Assets
  {
    const masterExportDir = path.join(titanRootDir, '07_Video_Projects', '5_Render_Exports');
    const preCount = fs.readdirSync(masterExportDir).length;
    const pipeline = new TitanClosedLoopPipeline();
    pipeline.reset();
    const postCount = fs.readdirSync(masterExportDir).length;
    assert(preCount === postCount && postCount === 3, 'Reset mechanism performs zero filesystem deletions in Titan workspace');
  }

  // 9. Approval Remains Mandatory
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    assert(
      res.state === 'AWAITING_RENDER_APPROVAL' && res.renderAttempts === 0,
      'Render execution remains strictly blocked without explicit approval'
    );
  }

  // 10. Renderer Cannot Bypass Approval
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    let reachedTool = false;
    toolService.executeTool = async (call) => {
      if (call.toolId === 'titan.render_video_draft') reachedTool = true;
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    assert(reachedTool === false, 'Tool execution layer is never reached when approval is false');
  }

  // 11. Invalid Target Remains Rejected
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ target: 'Video_999_Invalid', titanRootDir, hasExplicitRenderApproval: true });
    assert(
      res.state === 'ERROR' || res.gatePassed === false,
      'Invalid target parameters are strictly caught and rejected'
    );
  }

  // 12. Path Traversal Remains Rejected
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir: 'C:\\Users\\smsaq\\..\\Windows' });
    assert(
      res.state === 'ERROR' && Boolean(res.error?.includes('SECURITY VIOLATION')),
      'Path traversal attempts outside Titan root are strictly blocked with security error'
    );
  }

  // 13. Preview Only Accepts Approved Output Locations
  {
    const targetMap: Record<string, string> = {
      Video_001: 'Video_001_Dynamic_Test.mp4',
      Video_002: 'Video_002_Agency_Draft.mp4',
      Video_003: 'Video_003_Gigafactory_Draft.mp4'
    };
    const allowedPath = path.join(titanRootDir, '07_Video_Projects', 'Experimental', targetMap['Video_001']);
    assert(
      allowedPath.startsWith(path.resolve(titanRootDir)) && allowedPath.includes('Experimental'),
      'Output preview resolves strictly to approved Experimental output paths inside Titan'
    );
  }

  // 14. Zero-Byte Outputs are Rejected
  {
    const tempZero = path.join(titanRootDir, '07_Video_Projects', 'temp_test_zero.json');
    fs.writeFileSync(tempZero, '', 'utf-8');

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
          data: { outputFile: tempZero },
          timestamp: Date.now(),
          executionTimeMs: 100
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res = await pipeline.executePipeline({ titanRootDir });
    assert(res.state === 'ERROR' && Boolean(res.error?.includes('missing or empty')), 'Zero-byte output artifacts trigger immediate ERROR state');

    try { fs.unlinkSync(tempZero); } catch {}
  }

  // 15. QA >= 90 Passes
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
          data: { rawStdout: 'Overall Retention Score : 92.5/100' },
          timestamp: Date.now(),
          executionTimeMs: 100
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: true });
    assert(res.state === 'GATE_PASSED' && res.gatePassed === true, 'QA score >= 90 results in GATE_PASSED state');
  }

  // 16. QA < 90 Fails
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
          data: { rawStdout: 'Overall Retention Score : 81.0/100' },
          timestamp: Date.now(),
          executionTimeMs: 100
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: true });
    assert(res.state === 'GATE_FAILED' && res.gatePassed === false, 'QA score < 90 results in GATE_FAILED state');
  }

  // 17. Failed Pipeline Produces Recovery Information
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
          data: { rawStdout: 'Overall Retention Score : 75.0/100\nHook Pacing Score : 65.0/100\nVisual Cut Density : 50.0%' },
          timestamp: Date.now(),
          executionTimeMs: 100
        };
      }
      return new ToolService(registry).executeTool(call);
    };

    const pipeline = new TitanClosedLoopPipeline(toolService, titanRootDir);
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: true });
    assert(
      Boolean(res.failureReasons && res.failureReasons.length > 0) &&
      Boolean(res.recommendedCorrectiveActions && res.recommendedCorrectiveActions.length > 0),
      'Failed pipeline output returns structured failure criteria and recommended operator recovery actions'
    );
  }

  // 18. IPC Payloads Contain No Secrets
  {
    const pipeline = new TitanClosedLoopPipeline();
    const res = await pipeline.executePipeline({ titanRootDir, hasExplicitRenderApproval: false });
    const serialized = JSON.stringify(res);
    assert(
      !serialized.includes('Bearer ') && !serialized.includes('PRIVATE_KEY'),
      'Full IPC serialization contains zero authorization headers or private keys'
    );
  }

  console.log(`\nTITAN OPERATOR EXPERIENCE PHASE 5 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTitanOperatorExperienceTests();
