import { PythonSubprocessBridge } from '../titan/PythonSubprocessBridge';
import { TitanToolProvider } from '../titan/TitanToolProvider';
import { ToolRegistry } from '../ToolRegistry';
import { ToolService } from '../ToolService';
import path from 'path';
import fs from 'fs';

async function runTitanIntegrationPhase2ATests() {
  console.log('--- RUNNING PROJECT TITAN x ORION — PHASE 2A INTEGRATION SUITE ---');
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

  // 1. Tool Registration Verification
  {
    const registry = new ToolRegistry();
    const tools = registry.getAllTools();
    const toolIds = tools.map((t) => t.id);

    assert(
      toolIds.includes('titan.generate_visual_plan') && toolIds.includes('titan.synthesize_voice'),
      'ToolRegistry registers titan.generate_visual_plan and titan.synthesize_voice'
    );
  }

  // 2. Permission & Risk Level Classification
  {
    const registry = new ToolRegistry();
    const planTool = registry.getTool('titan.generate_visual_plan');
    const voiceTool = registry.getTool('titan.synthesize_voice');

    assert(
      planTool?.permissionLevel === 'MEDIUM' && planTool?.isMutating === true,
      'titan.generate_visual_plan classification is MEDIUM / MUTATING'
    );
    assert(
      voiceTool?.permissionLevel === 'MEDIUM' && voiceTool?.isMutating === true,
      'titan.synthesize_voice classification is MEDIUM / MUTATING'
    );
  }

  // 3. Argument Isolation & Secret Redaction
  {
    const rawSecret = 'Failed processing with API key sk-9999988888777776666655555 and gsk_1111122222333334444455555';
    const redacted = PythonSubprocessBridge.sanitizeOutput(rawSecret);

    assert(
      !redacted.includes('sk-9999988888777776666655555') &&
      !redacted.includes('gsk_1111122222333334444455555') &&
      redacted.includes('[REDACTED_API_KEY]') &&
      redacted.includes('[REDACTED_GROQ_KEY]'),
      'Secret redaction scrubs all potential credentials before returning tool result'
    );
  }

  // 4. Missing Script Handling
  {
    const provider = new TitanToolProvider('C:\\Users\\smsaq\\Project_Titan');
    const fakeCall = {
      id: 'test_missing',
      toolId: 'titan.generate_visual_plan',
      toolName: 'Titan Visual Plan',
      arguments: { titanPath: 'C:\\Users\\smsaq\\Downloads' },
      timestamp: Date.now(),
      requiresUserApproval: false
    };

    const res = await provider.executeGenerateVisualPlan(fakeCall);
    assert(
      res.success === false &&
      res.verificationStatus === 'FAILED' &&
      Boolean(res.error?.includes('escapes Titan root workspace')),
      'Path boundary check blocks execution outside Titan workspace boundary'
    );
  }


  // 5. Timeout Handling (Simulated with 1ms timeout via bridge)
  {
    const bridge = new PythonSubprocessBridge();
    const scriptPath = path.join(titanRootDir, '12_Automations', 'Internal_Tools', 'visual_director.py');
    if (fs.existsSync(scriptPath)) {
      const res = await bridge.executeScript({
        scriptPath,
        cwd: path.dirname(scriptPath),
        timeoutMs: 1
      });
      assert(res.timedOut === true, 'PythonSubprocessBridge detects and cancels timed out scripts cleanly');
    } else {
      assert(true, 'Timeout test skipped (visual_director.py not present)');
    }
  }

  // 6. Invalid Target Handling for Synthesize Voice
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);
    const res = await toolService.executeTool({
      id: 'invalid_target',
      toolId: 'titan.synthesize_voice',
      toolName: 'Titan Synthesize Voice',
      arguments: { target: 'INVALID_PROJECT_NAME' },
      timestamp: Date.now(),
      requiresUserApproval: false
    });

    assert(
      res.success === false && Boolean(res.error?.includes('Invalid TTS target')),
      'titan.synthesize_voice rejects invalid target keys safely'
    );
  }


  // 7. Execution of titan.generate_visual_plan against real Titan workspace
  {
    const registry = new ToolRegistry();
    const toolService = new ToolService(registry);
    const res = await toolService.executeTool({
      id: 'real_visual_plan',
      toolId: 'titan.generate_visual_plan',
      toolName: 'Titan Generate Visual Plan',
      arguments: {},
      timestamp: Date.now(),
      requiresUserApproval: false
    });

    assert(
      res.success === true &&
      res.verificationStatus === 'VERIFIED' &&
      Boolean(res.data?.outputSizeBytes > 0) &&
      Boolean(res.data?.planSummary?.totalCuts > 0),
      'titan.generate_visual_plan safely executes visual_director.py and verifies non-empty plan output'
    );
  }

  // 8. Output non-zero size verification for generated artifacts
  {
    const outputFile = path.join(titanRootDir, '07_Video_Projects', 'visual_director_plan.json');
    const exists = fs.existsSync(outputFile);
    const size = exists ? fs.statSync(outputFile).size : 0;

    assert(
      Boolean(exists && size > 1000),
      'Postcondition verification confirms visual_director_plan.json exists and contains >1KB of structured visual plan data'
    );
  }

  // 9. Visual Director Plan Metadata Preservation (narration_snippet & on_screen_text)
  {
    const outputFile = path.join(titanRootDir, '07_Video_Projects', 'visual_director_plan.json');
    if (fs.existsSync(outputFile)) {
      const plan = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
      const scenes = plan.scenes || [];
      const scenesWithNarration = scenes.filter((s: any) => typeof s.narration_snippet === 'string' && s.narration_snippet.trim().length > 0);
      const scenesWithText = scenes.filter((s: any) => typeof s.on_screen_text === 'string' && s.on_screen_text.trim().length > 0);

      assert(
        scenes.length > 0 && scenesWithNarration.length === scenes.length,
        'Visual Director transformation strictly preserves narration_snippet on 100% of scenes without data drop'
      );
      assert(
        scenesWithText.length > 0,
        'Visual Director transformation strictly preserves on_screen_text when present in storyboard'
      );
    } else {
      assert(false, 'visual_director_plan.json missing for metadata preservation test');
    }
  }

  // 10. Synthetic Storyboard Transformation Determinism & Field Identity Test
  {
    const bridge = new PythonSubprocessBridge();
    const testScript = `
import json, tempfile, os
from visual_director import categorize_and_direct

synthetic_storyboard = {
    "title": "Synthetic Test Storyboard",
    "scenes": [
        {
            "scene_id": 1,
            "start_time": 0.0,
            "end_time": 3.5,
            "duration": 3.5,
            "visual_prompt": "CPU vs GPU technical diagram breakdown",
            "on_screen_text": "HOOK ON-SCREEN TITLE",
            "narration_snippet": "First scene spoken narration line."
        },
        {
            "scene_id": 2,
            "start_time": 3.5,
            "end_time": 7.0,
            "duration": 3.5,
            "visual_prompt": "Python code macro with PyTorch kernel execution",
            "on_screen_text": "",
            "narration_snippet": "Second scene with empty on-screen text."
        },
        {
            "scene_id": 3,
            "start_time": 7.0,
            "end_time": 10.5,
            "duration": 3.5,
            "visual_prompt": "3D motion graphic of silicon wafer chip",
            "on_screen_text": "SILICON METRIC",
            "narration_snippet": ""
        },
        {
            "scene_id": 4,
            "start_time": 10.5,
            "end_time": 14.0,
            "duration": 3.5,
            "visual_prompt": "Documentary stock B-roll footage of server room",
            "on_screen_text": "",
            "narration_snippet": ""
        }
    ]
}

res = categorize_and_direct(synthetic_storyboard)
assert len(res) == 4, "Must produce 4 directed scenes"
assert res[0]["narration_snippet"] == "First scene spoken narration line.", "Scene 1 narration mismatch"
assert res[0]["on_screen_text"] == "HOOK ON-SCREEN TITLE", "Scene 1 on-screen text mismatch"
assert res[0]["asset_type"] == "technical_diagram", "Scene 1 asset type mismatch"

assert res[1]["narration_snippet"] == "Second scene with empty on-screen text.", "Scene 2 narration mismatch"
assert res[1]["on_screen_text"] == "", "Scene 2 on-screen text should be empty string"
assert res[1]["asset_type"] == "code_macro", "Scene 2 asset type mismatch"

assert res[2]["narration_snippet"] == "", "Scene 3 narration should be empty string"
assert res[2]["on_screen_text"] == "SILICON METRIC", "Scene 3 on-screen text mismatch"
assert res[2]["asset_type"] == "3d_motion_graphic", "Scene 3 asset type mismatch"

assert res[3]["narration_snippet"] == "", "Scene 4 narration should be empty"
assert res[3]["on_screen_text"] == "", "Scene 4 on-screen text should be empty"
assert res[3]["asset_type"] == "documentary_stock", "Scene 4 asset type mismatch"
print("SYNTHETIC_DIRECTOR_PASS")
`;

    const scriptPath = path.join(titanRootDir, '12_Automations', 'Internal_Tools', 'test_synthetic_director.py');
    fs.writeFileSync(scriptPath, testScript, 'utf-8');
    const pyRes = await bridge.executeScript({
      scriptPath,
      cwd: path.dirname(scriptPath),
      timeoutMs: 15000
    });
    try { fs.unlinkSync(scriptPath); } catch {}

    assert(
      pyRes.exitCode === 0 && pyRes.stdout.includes('SYNTHETIC_DIRECTOR_PASS'),
      'Synthetic storyboard transformation verifies field identity, partial text, empty strings, and asset categorization'
    );
  }

  console.log(`\nTITAN INTEGRATION PHASE 2A SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTitanIntegrationPhase2ATests();

