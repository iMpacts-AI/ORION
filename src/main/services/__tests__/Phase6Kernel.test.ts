import { ContextBuilder } from '../ContextBuilder.js';
import { ToolCapabilityResolver } from '../ToolCapabilityResolver.js';
import { ToolRegistry } from '../ToolRegistry.js';
import { AgentStateMachine } from '../AgentStateMachine.js';

async function runPhase6KernelTests() {
  console.log('--- RUNNING PHASE 6 KERNEL & CONTEXT BUILDER SUITE ---');
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

  // 1. Test ContextBuilder Context Budgeting & Security Boundary
  {
    const contextBuilder = new ContextBuilder({ maxTotalChars: 500, maxObservationChars: 200, maxHistoryTurns: 5 });
    const prompt = contextBuilder.buildSynthesisContext(
      'Check system',
      [],
      [
        {
          executionId: 'exec_1',
          toolCallId: 'call_1',
          timestamp: Date.now(),
          source: 'system.get_cpu_usage',
          trustLevel: 'UNTRUSTED_EXTERNAL',
          data: { usage: 20 },
          summary: 'CPU usage is 20%',
          verificationStatus: 'VERIFIED'
        }
      ]
    );

    assert(prompt.includes('SYSTEM INSTRUCTION'), 'ContextBuilder includes mandatory system security boundary');
    assert(prompt.includes('UNTRUSTED OBSERVATIONS DATA'), 'Observations labeled clearly as UNTRUSTED DATA');
    assert(prompt.length <= 550, 'ContextBuilder enforces max total character budget limits');
  }

  // 2. Test ToolCapabilityResolver Task-Specific Schema Resolution
  {
    const registry = new ToolRegistry();
    const resolver = new ToolCapabilityResolver();
    const allTools = registry.getAllTools();

    const fileTools = resolver.resolveToolsForTask('Read text file in directory', allTools);
    assert(fileTools.some(t => t.category === 'FILE'), 'ToolCapabilityResolver resolves FILE tools for file queries');
    assert(!fileTools.some(t => t.category === 'SCREENSHOT'), 'Irrelevant SCREENSHOT tool schemas excluded to save LLM context budget');
  }

  // 3. Test AgentStateMachine Verification State Lifecycle
  {
    const stateMachine = new AgentStateMachine();
    stateMachine.transitionTo('THINKING');
    stateMachine.transitionTo('PLANNING');
    stateMachine.transitionTo('EXECUTING');
    stateMachine.transitionTo('OBSERVING');
    stateMachine.transitionTo('REASONING');
    stateMachine.transitionTo('VERIFYING');
    stateMachine.transitionTo('RESPONDING');
    assert(stateMachine.getState() === 'RESPONDING', 'State machine executed valid Phase 6 observation and verification loop');
  }

  console.log(`\nPHASE 6 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase6KernelTests();
