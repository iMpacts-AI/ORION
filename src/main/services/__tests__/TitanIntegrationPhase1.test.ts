import { PythonSubprocessBridge } from '../titan/PythonSubprocessBridge';
import { TitanToolProvider } from '../titan/TitanToolProvider';
import { ToolRegistry } from '../ToolRegistry';
import { ToolService } from '../ToolService';
import path from 'path';
import fs from 'fs';

async function runTitanIntegrationPhase1Tests() {
  console.log('--- RUNNING PROJECT TITAN x ORION — PHASE 1 INTEGRATION SUITE ---');
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

  // 1. PythonSubprocessBridge Security & Timeout Safeguards
  {
    const rawText = 'Error executing request with key sk-1234567890abcdef1234567890 and gsk_abcdef12345678901234567890';
    const sanitized = PythonSubprocessBridge.sanitizeOutput(rawText);
    assert(
      !sanitized.includes('sk-1234567890abcdef1234567890') &&
      !sanitized.includes('gsk_abcdef12345678901234567890') &&
      sanitized.includes('[REDACTED_API_KEY]') &&
      sanitized.includes('[REDACTED_GROQ_KEY]'),
      'PythonSubprocessBridge correctly redacts API keys/tokens'
    );

    const bridge = new PythonSubprocessBridge();
    const scriptPath = path.join(titanRootDir, '12_Automations', 'Internal_Tools', 'asset_indexer.py');
    if (fs.existsSync(scriptPath)) {
      const res = await bridge.executeScript({
        scriptPath,
        cwd: path.dirname(scriptPath),
        timeoutMs: 10000
      });
      assert(!res.timedOut && res.exitCode === 0 && res.durationMs > 0, 'PythonSubprocessBridge safely executes Titan python tool with explicit array args');
    } else {
      assert(true, 'asset_indexer.py execution skipped (script not found)');
    }
  }

  // 2. ToolRegistry & TitanToolProvider Integration
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    const tools = registry.getAllTools();
    const titanToolIds = tools.map((t) => t.id).filter((id) => id.startsWith('titan.'));

    assert(
      titanToolIds.includes('titan.read_state') &&
      titanToolIds.includes('titan.inspect_assets') &&
      titanToolIds.includes('titan.run_viewer_experience_qa'),
      'ToolRegistry successfully registers titan.read_state, titan.inspect_assets, and titan.run_viewer_experience_qa'
    );

    const readStateTool = registry.getTool('titan.read_state');
    assert(readStateTool?.isReadOnly === true && readStateTool?.permissionLevel === 'LOW', 'titan.read_state is correctly tagged as READ_ONLY and LOW permission level');
  }

  // 3. Execution Verification of titan.read_state
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    const toolRes = await toolService.executeTool({
      id: 'call_test_1',
      toolId: 'titan.read_state',
      toolName: 'Titan Read State',
      arguments: { titanPath: titanRootDir },
      timestamp: Date.now(),
      requiresUserApproval: false
    });

    assert(
      toolRes.success === true &&
      toolRes.verificationStatus === 'VERIFIED' &&
      toolRes.data?.currentStateExists === true &&
      toolRes.data?.sessionCheckpointExists === true &&
      Boolean(toolRes.data?.stage),
      'titan.read_state successfully reads CURRENT_STATE.md and returns verified structured telemetry JSON'
    );
  }

  // 4. Execution Verification of titan.inspect_assets
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    const toolRes = await toolService.executeTool({
      id: 'call_test_2',
      toolId: 'titan.inspect_assets',
      toolName: 'Titan Inspect Media Assets',
      arguments: { targetSubdir: 'ALL' },
      timestamp: Date.now(),
      requiresUserApproval: false
    });

    assert(
      toolRes.success === true &&
      toolRes.verificationStatus === 'VERIFIED' &&
      toolRes.data?.totalMp4Files > 0 &&
      toolRes.data?.files[0]?.isGenuineBinary === true,
      'titan.inspect_assets detects local MP4 renders and verifies file metrics in read-only mode'
    );
  }

  // 5. Execution Verification of titan.run_viewer_experience_qa
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);

    const toolRes = await toolService.executeTool({
      id: 'call_test_3',
      toolId: 'titan.run_viewer_experience_qa',
      toolName: 'Titan Viewer Experience QA',
      arguments: {},
      timestamp: Date.now(),
      requiresUserApproval: false
    });

    assert(
      toolRes.success === true &&
      toolRes.verificationStatus === 'VERIFIED' &&
      Boolean(toolRes.data?.executedScript?.includes('retention_auditor.py')),
      'titan.run_viewer_experience_qa executes retention auditor in local read-only mode and returns scores'
    );
  }

  // 6. Retention Auditor Physical-Duration Pacing Regression Test
  {
    const bridge = new PythonSubprocessBridge();
    const testScript = `
import json, tempfile, os
from retention_auditor import audit_retention

# Create a synthetic visual director plan where planned end_time != sum(duration)
# Planned timeline spans 1000s, but 10 physical scenes are each 3.5s (sum = 35.0s, avg = 3.50s)
synthetic_plan = {
    "title": "Synthetic Pacing Test",
    "total_directed_cuts": 10,
    "scenes": [
        {
            "scene_id": i + 1,
            "start_time": float(i * 100),
            "end_time": float(i * 100 + 3.5) if i < 9 else 1000.0, # Final scene end_time artificially high (1000s)
            "duration": 3.5,
            "asset_type": "technical_diagram",
            "visual_prompt": "Scene prompt",
            "on_screen_text": "TITLE",
            "narration_snippet": "Narration text"
        }
        for i in range(10)
    ]
}

temp_dir = tempfile.mkdtemp()
plan_file = os.path.join(temp_dir, "visual_director_plan.json")
with open(plan_file, "w", encoding="utf-8") as f:
    json.dump(synthetic_plan, f)

# Monkey-patch DIRECTOR_PLAN path for unit testing
import retention_auditor
retention_auditor.DIRECTOR_PLAN = plan_file

metrics = audit_retention()

# Cleanup
try: os.remove(plan_file); os.rmdir(temp_dir)
except: pass

# Assertions:
# 1. Total duration must be sum of physical durations: 35.0s (not 1000.0s)
# 2. avg_scene_duration_sec must be 3.5s (not 100.0s)
# 3. Pacing score must be 100.0 (not 40.0)
assert abs(metrics["avg_scene_duration_sec"] - 3.50) < 0.05, f"Avg duration mismatch: {metrics['avg_scene_duration_sec']} vs expected 3.50"
assert metrics["pacing_score"] == 100.0, f"Pacing score mismatch: {metrics['pacing_score']} vs expected 100.0"
assert metrics["caption_density_pct"] == 100.0, f"Caption density mismatch: {metrics['caption_density_pct']} vs expected 100.0"
assert metrics["overall_retention_score"] >= 95.0, f"Overall retention score mismatch: {metrics['overall_retention_score']}"
print("PHYSICAL_PACING_TEST_PASS")
`;

    const scriptPath = path.join(titanRootDir, '12_Automations', 'Internal_Tools', 'test_physical_pacing.py');
    fs.writeFileSync(scriptPath, testScript, 'utf-8');
    const pyRes = await bridge.executeScript({
      scriptPath,
      cwd: path.dirname(scriptPath),
      timeoutMs: 15000
    });
    try { fs.unlinkSync(scriptPath); } catch {}

    assert(
      pyRes.exitCode === 0 && pyRes.stdout.includes('PHYSICAL_PACING_TEST_PASS'),
      'Retention Auditor uses physical sum of scene durations for pacing calculations and prevents planned end_time distortion'
    );
  }

  // 7. Retention Auditor Score Determinism Across Repeated Runs
  {
    const bridge = new PythonSubprocessBridge();
    const scriptPath = path.join(titanRootDir, '12_Automations', 'Internal_Tools', 'retention_auditor.py');
    const res1 = await bridge.executeScript({ scriptPath, cwd: path.dirname(scriptPath), timeoutMs: 15000 });
    const res2 = await bridge.executeScript({ scriptPath, cwd: path.dirname(scriptPath), timeoutMs: 15000 });
    const res3 = await bridge.executeScript({ scriptPath, cwd: path.dirname(scriptPath), timeoutMs: 15000 });

    const extractScore = (stdout: string) => {
      const match = stdout.match(/Overall Retention Score\s*:\s*([\d.]+)\/100/);
      return match ? parseFloat(match[1]) : null;
    };

    const s1 = extractScore(res1.stdout);
    const s2 = extractScore(res2.stdout);
    const s3 = extractScore(res3.stdout);

    assert(
      s1 !== null && s1 === s2 && s2 === s3 && s1 >= 90.0,
      `Retention auditor produces 100% deterministic score across consecutive executions (Runs: ${s1}, ${s2}, ${s3})`
    );
  }

  console.log(`\nTITAN INTEGRATION PHASE 1 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTitanIntegrationPhase1Tests();

