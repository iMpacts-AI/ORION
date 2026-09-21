import { ToolRegistry } from '../ToolRegistry';
import { ToolService } from '../ToolService';
import { MockInputDriver } from '../computer/InputControlService';
import { ComputerUseService } from '../computer/ComputerUseService';

async function runComputerIPCIntegrationTests() {
  console.log('--- RUNNING COMPUTER IPC INTEGRATION TEST SUITE ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: any, testName: string) {
    if (Boolean(condition)) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  const registry = new ToolRegistry();
  const mockDriver = new MockInputDriver();
  const compService = new ComputerUseService(mockDriver);
  const toolService = new ToolService(registry, compService);

  // 1. Tool Registry exposes computer-use tools
  {
    assert(
      Boolean(registry.getTool('computer.observe')) &&
      Boolean(registry.getTool('computer.plan_task')) &&
      Boolean(registry.getTool('computer.execute_action')) &&
      Boolean(registry.getTool('computer.natural_language_command')),
      'ToolRegistry registers all 4 Phase 8 computer-use tool contracts'
    );
  }

  // 2. Dispatch computer.observe via ToolService
  {
    const res = await toolService.executeTool({
      id: 'call_comp_obs',
      toolId: 'computer.observe',
      toolName: 'Computer Observe Desktop Screen',
      arguments: {},
      timestamp: Date.now(),
      requiresUserApproval: false
    });
    assert(
      res.success === true && res.data?.screen?.width > 0,
      'Dispatches computer.observe returning structured screen observation'
    );
  }

  // 3. Dispatch computer.plan_task via ToolService
  {
    const res = await toolService.executeTool({
      id: 'call_comp_plan',
      toolId: 'computer.plan_task',
      toolName: 'Computer Plan Desktop Task',
      arguments: { command: 'Open Spotify' },
      timestamp: Date.now(),
      requiresUserApproval: false
    });
    assert(
      res.success === true && res.data?.actions?.length > 0,
      'Dispatches computer.plan_task returning multi-step execution plan'
    );
  }

  // 4. Dispatch computer.natural_language_command via ToolService
  {
    const res = await toolService.executeTool({
      id: 'call_comp_exec',
      toolId: 'computer.natural_language_command',
      toolName: 'Computer Execute Natural Language Command',
      arguments: { command: 'Scroll down' },
      timestamp: Date.now(),
      requiresUserApproval: false
    });
    assert(
      res.success === true && res.data?.status === 'COMPLETED',
      'Dispatches computer.natural_language_command executing closed-loop plan'
    );
  }

  // 5. Zero Credential Exposure in serialized results
  {
    const res = await toolService.executeTool({
      id: 'call_comp_sec',
      toolId: 'computer.observe',
      toolName: 'Computer Observe Desktop Screen',
      arguments: {},
      timestamp: Date.now(),
      requiresUserApproval: false
    });
    const serialized = JSON.stringify(res);
    assert(
      !serialized.includes('sk-') && !serialized.includes('gsk_') && !serialized.includes('AIza'),
      'Computer-Use IPC serialization contains zero leaked API keys or secret tokens'
    );
  }

  console.log(`\nCOMPUTER IPC INTEGRATION SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runComputerIPCIntegrationTests();
