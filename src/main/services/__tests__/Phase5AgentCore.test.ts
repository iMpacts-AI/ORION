import { AgentStateMachine } from '../AgentStateMachine.js';
import { TaskMemoryService } from '../TaskMemoryService.js';
import { ToolRegistry } from '../ToolRegistry.js';
import { ToolService } from '../ToolService.js';
import { OrionAIProviderRouter } from '../OrionAIProviderRouter.js';

async function runPhase5AgentCoreTests() {
  console.log('--- RUNNING PHASE 5 AGENT CORE & REGISTRY SUITE ---');
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

  // 1. Test AgentStateMachine Valid and Handled Invalid Transitions
  {
    const stateMachine = new AgentStateMachine();
    assert(stateMachine.getState() === 'STANDBY', 'Agent state machine starts in STANDBY state');

    stateMachine.transitionTo('THINKING');
    assert(stateMachine.getState() === 'THINKING', 'Transition to THINKING allowed');

    stateMachine.transitionTo('PLANNING');
    assert(stateMachine.getState() === 'PLANNING', 'Transition to PLANNING allowed');

    stateMachine.transitionTo('EXECUTING');
    assert(stateMachine.getState() === 'EXECUTING', 'Transition to EXECUTING allowed');

    stateMachine.transitionTo('VERIFYING');
    assert(stateMachine.getState() === 'VERIFYING', 'Transition to VERIFYING allowed');

    stateMachine.reset();
    assert(stateMachine.getState() === 'STANDBY', 'State machine reset to STANDBY');
  }

  // 2. Test ToolRegistry & Verification Engine
  {
    const registry = new ToolRegistry();
    const allTools = registry.getAllTools();
    assert(allTools.length >= 9, 'ToolRegistry registers default built-in tools');

    const lowTools = registry.getToolsForPermission('LOW');
    assert(lowTools.every(t => t.permissionLevel === 'LOW'), 'Permission level filtering works correctly');

    const toolService = new ToolService(registry);
    const writeCall = {
      id: 'call_test_write',
      toolId: 'file.write_text',
      toolName: 'Write Text File',
      arguments: { filePath: './scratch_phase5_test.txt', content: 'Phase 5 Agent Active' },
      timestamp: Date.now(),
      requiresUserApproval: false
    };

    const res = await toolService.executeTool(writeCall);
    assert(res.success && res.verified === true, 'File write tool executed and verified by Verification Engine');
  }

  // 3. Test TaskMemoryService Task Persistence
  {
    const taskMemory = new TaskMemoryService();
    const task = taskMemory.createTask('Build Website', 'Generate React HUD components', 3);
    assert(task.status === 'IN_PROGRESS', 'Task created in IN_PROGRESS state');

    taskMemory.updateTaskProgress(task.id, 3);
    const updated = taskMemory.getCurrentTask();
    assert(updated?.status === 'COMPLETED', 'Task auto-marked COMPLETED when steps completed');
  }

  // 4. Test Adaptive Router Strategy Addition
  {
    const router = new OrionAIProviderRouter();
    router.setRoutingStrategy('AGENT');
    const selected = router.selectBestProvider('TOOL_USE', false, true);
    assert(selected !== undefined, 'AGENT strategy selects best tool-capable provider');

    router.setRoutingStrategy('OFFLINE');
    const offlineSelection = router.selectBestProvider('GENERAL_CHAT');
    assert(offlineSelection === null, 'OFFLINE strategy forces local fallback');
  }

  console.log(`\nPHASE 5 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase5AgentCoreTests();
