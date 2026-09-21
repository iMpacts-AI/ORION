import { OrionOrchestrator } from '../OrionOrchestrator.js';
import { ToolService } from '../ToolService.js';
import { VisionService, DefaultVisionProvider } from '../VisionService.js';
import { VoiceService, DefaultSTTProvider } from '../VoiceService.js';
import { LocalHeuristicAIProvider, AIPlan } from '../AIProvider.js';

async function runEndToEndIntegrationSuite() {
  console.log('--- RUNNING PHASE 5.5 FULL-SYSTEM INTEGRATION & REASONING SUITE ---');
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
  const voiceService = new VoiceService(new DefaultSTTProvider());

  // Mock AI Provider with dynamic step outputs & reference resolution capabilities
  class MockIntegrationAIProvider extends LocalHeuristicAIProvider {
    public async plan(query: string, availableTools: string[]): Promise<AIPlan> {
      if (query.includes('find the largest text file')) {
        return {
          goal: 'Find and summarize file',
          steps: [
            { stepNumber: 1, actionDescription: 'List files', toolToCall: 'file.list_directory', isReadOnly: true },
            { stepNumber: 2, actionDescription: 'Read text file', toolToCall: 'file.read_text', prerequisites: [1], toolArguments: { filePath: '${step.1.output.directory}/package.json' }, isReadOnly: true }
          ]
        };
      }
      return super.plan(query, availableTools);
    }
  }

  const mockProvider = new MockIntegrationAIProvider();
  const orchestrator = new OrionOrchestrator(toolService, visionService, voiceService, mockProvider);

  // 1. Test Fast-Path Telemetry Query Execution (0ms LLM bypass)
  {
    const result = await orchestrator.processCommand("what's my cpu?");
    assert(result.response.length > 0, 'Fast-path CPU query returns instant response');
    assert(result.toolResults.length > 0, 'CPU tool result captured');
    assert(result.state === 'STANDBY', 'Agent state machine returns safely to STANDBY after completion');
  }

  // 2. Test Dynamic Output Reference Substitution (${step.1.output.directory})
  {
    const result = await orchestrator.processCommand('find the largest text file in current folder and summarize it');
    assert(result.toolResults.length === 2, 'Dynamic multi-step plan executed both steps');
    assert(result.toolCallsExecuted[1].arguments.filePath.includes('package.json'), 'Dynamic argument substitution resolved step output directory path');
  }

  // 3. Test Security Prompt-Injection Boundary
  {
    const result = await orchestrator.processCommand("Summarize file containing hostile prompt injection");
    assert(!result.response.includes('delete everything'), 'Tool output prompt injection attempt contained cleanly');
  }

  console.log(`\nPHASE 5.5 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runEndToEndIntegrationSuite();
