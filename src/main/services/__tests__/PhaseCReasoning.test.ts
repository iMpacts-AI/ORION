import { ConversationMemoryService } from '../ConversationMemoryService.js';
import { ToolDependencyGraph } from '../ExecutionContext.js';
import { OrionOrchestrator } from '../OrionOrchestrator.js';
import { ToolService } from '../ToolService.js';
import { VisionService, DefaultVisionProvider } from '../VisionService.js';
import { VoiceService, DefaultSTTProvider } from '../VoiceService.js';
import { LocalHeuristicAIProvider } from '../AIProvider.js';

async function runOrchestratorReasoningTests() {
  console.log('--- RUNNING PHASE C REASONING & ORCHESTRATOR SUITE ---');
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

  // 1. Test ConversationMemoryService turn bounds & history formatting
  {
    const memory = new ConversationMemoryService({ maxTurns: 3, maxTotalTokens: 1000, maxTotalChars: 500 });
    memory.addTurn({ role: 'user', content: 'Turn 1' });
    memory.addTurn({ role: 'assistant', content: 'Turn 2' });
    memory.addTurn({ role: 'user', content: 'Turn 3' });
    memory.addTurn({ role: 'assistant', content: 'Turn 4' });

    const turns = memory.getTurns();
    assert(turns.length === 3, 'Turn count bounded correctly to maxTurns (3)');
    assert(turns[0].content === 'Turn 2', 'Oldest turn evicted to maintain ordering');
    assert(turns[2].content === 'Turn 4', 'Newest turn preserved at tail');

    memory.clearMemory();
    assert(memory.getTurns().length === 0, 'Conversation memory clear memory succeeded');
  }

  // 2. Test ToolDependencyGraph DAG validation & Cycle Rejection
  {
    const validSteps = [
      { stepNumber: 1, actionDescription: 'Get CPU', toolToCall: 'system.get_cpu_usage', isReadOnly: true },
      { stepNumber: 2, actionDescription: 'Get RAM', toolToCall: 'system.get_memory_usage', isReadOnly: true },
      { stepNumber: 3, actionDescription: 'Analyze', toolToCall: 'system.get_info', prerequisites: [1, 2], isReadOnly: false }
    ];

    const graph = new ToolDependencyGraph(validSteps);
    const batch1 = graph.getExecutableBatches();
    assert(batch1.length === 1 && batch1[0].length === 2, 'Independent read-only steps 1 and 2 returned in single parallel batch');

    graph.markCompleted(1);
    graph.markCompleted(2);
    const batch2 = graph.getExecutableBatches();
    assert(batch2.length === 1 && batch2[0][0].stepNumber === 3, 'Dependent step 3 executable after steps 1 & 2 completed');

    // Test Circular Dependency Rejection
    try {
      new ToolDependencyGraph([
        { stepNumber: 1, actionDescription: 'Step 1', prerequisites: [2] },
        { stepNumber: 2, actionDescription: 'Step 2', prerequisites: [1] }
      ]);
      assert(false, 'Circular dependency should have thrown an error');
    } catch (e: any) {
      assert(e.message.includes('references forward') || e.message.includes('Circular'), 'Circular dependency detected and rejected cleanly');
    }

    // Test Duplicate Step ID Rejection
    try {
      new ToolDependencyGraph([
        { stepNumber: 1, actionDescription: 'Step A' },
        { stepNumber: 1, actionDescription: 'Step B Duplicate' }
      ]);
      assert(false, 'Duplicate step number should have been rejected');
    } catch (e: any) {
      assert(e.message.includes('Duplicate stepNumber'), 'Duplicate step ID detected and rejected cleanly');
    }
  }

  // 3. Test ConversationMemory Giant Message Truncation
  {
    const memory = new ConversationMemoryService();
    const giantMsg = 'X'.repeat(20000);
    const turn = memory.addTurn({ role: 'user', content: giantMsg });
    assert(turn.content.includes('[TRUNCATED]') && turn.content.length <= 10020, 'Giant message truncated to 10k chars max safety limit');
  }

  // 4. Test Full Orchestrator processCommand Execution & Telemetry Metrics
  {
    const toolService = new ToolService();
    const visionService = new VisionService(new DefaultVisionProvider());
    const voiceService = new VoiceService(new DefaultSTTProvider());
    const orchestrator = new OrionOrchestrator(toolService, visionService, voiceService, new LocalHeuristicAIProvider());

    const result = await orchestrator.processCommand("what's my cpu?");
    assert(result.response.length > 0, 'Orchestrator returned synthesized response');
    assert(result.metrics.totalCommandLatencyMs >= 0, 'Total command latency metric captured');
    assert(result.metrics.intentClassificationLatencyMs >= 0, 'Intent classification latency metric captured');
    assert(result.toolResults.length > 0, 'Tool execution results captured in response object');

    const history = orchestrator.getMemoryService().getTurns();
    assert(history.length === 2, 'User turn and assistant turn recorded in conversation memory');
  }

  console.log(`\nPHASE C SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runOrchestratorReasoningTests();
