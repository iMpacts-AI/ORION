import { OrionOrchestrator } from '../OrionOrchestrator.js';
import { ToolService } from '../ToolService.js';
import { VisionService, DefaultVisionProvider } from '../VisionService.js';
import { VoiceService } from '../VoiceService.js';
import { DefaultWindowProvider } from '../../platform/WindowProvider.js';

async function runEndToEndIntegrationTests() {
  console.log('--- RUNNING ORION END-TO-END INTEGRATION TEST SUITE ---');
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

  const toolService = new ToolService();
  const visionService = new VisionService(new DefaultVisionProvider());
  const voiceService = new VoiceService();
  const orchestrator = new OrionOrchestrator(toolService, visionService, voiceService);

  // 1. Natural Conversation Request Path
  {
    const res = await orchestrator.processCommand('Hello ORION, what is your status?');
    assert(res.response.length > 0, 'Natural conversation request returns response cleanly');
    assert(res.state === 'STANDBY', 'Orchestrator returns state to STANDBY upon completion');
  }

  // 2. Multimodal Vision Screen Perception Path
  {
    const res = await orchestrator.processCommand('Look at my screen and tell me what is on it');
    assert(res.visionResult !== undefined, 'Multimodal vision intent triggers screen capture & analysis');
    assert(Boolean(res.suggestedMode === 'VISION'), 'Vision intent suggests VISION mode to UI');
  }

  // 3. Real Active Window Inspection Path
  {
    const windowProvider = new DefaultWindowProvider();
    const activeWin = await windowProvider.getActiveWindow();
    assert(Boolean(activeWin.title && activeWin.processName), 'Real active window provider returns non-stub desktop window title & process name');
  }

  // 4. End-to-End Action Execution Path with Validation & Preconditions
  {
    const actionService = orchestrator.getActionService();
    const actRes = await actionService.executeAction({
      id: 'e2e_act_1',
      type: 'READ_FILE',
      riskLevel: 'READ_ONLY',
      payload: { filePath: './package.json' }
    });

    assert(actRes.success === true && actRes.preconditionsMet === true, 'Computer action executes safely via ToolService sandboxing with precondition checks');
  }

  console.log(`\nORION END-TO-END SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runEndToEndIntegrationTests();
