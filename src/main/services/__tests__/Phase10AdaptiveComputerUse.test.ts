import { ComputerUseService } from '../computer/ComputerUseService';
import { MockInputDriver } from '../computer/InputControlService';
import { ComputerTaskPlan, ComputerAction } from '../../../shared/types/action';

async function runPhase10AdaptiveTests() {
  console.log('=== RUNNING PHASE 10: ADAPTIVE COMPUTER USE TEST SUITE ===');
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

  const mockDriver = new MockInputDriver();
  const service = new ComputerUseService(mockDriver);

  // 1. Dynamic Screen Reasoning & Semantic Grounding (Synonym & Multi-Attribute Matching)
  {
    const observation = await service.observeScreen();
    // Simulate UI elements with synonyms
    observation.interactiveElements = [
      {
        id: 'el_btn_export',
        role: 'button',
        text: 'Export File',
        bounds: { x: 100, y: 100, width: 80, height: 30 },
        enabled: true,
        visible: true,
        confidence: 0.9,
        source: 'ACCESSIBILITY'
      }
    ];

    const located = service.getScreenUnderstanding().locateElement(observation, {
      text: 'Save',
      role: 'button',
      minConfidence: 0.6
    });

    assert(
      located.element?.id === 'el_btn_export' && (located.centerPoint?.x ?? 0) > 0,
      'Locates UI elements through semantic synonym grounding (Save -> Export File)'
    );
  }

  // 2. Adaptive Replanning from Action Failure
  {
    const planner = service.getPlanner();
    const failedAction: ComputerAction = {
      id: 'act_failed_focus',
      type: 'FOCUS_WINDOW',
      target: 'notepad',
      confidence: 0.9,
      riskLevel: 'LOW_RISK'
    };

    const correctiveActions = await planner.replanFromFailure(
      failedAction,
      'Active window title does not match target',
      {},
      []
    );

    assert(
      correctiveActions.length >= 2 &&
      correctiveActions[0].type === 'FOCUS_WINDOW' &&
      correctiveActions.some(a => a.reason?.includes('Adaptive Replan')),
      'Adaptive replanner synthesizes corrective sub-actions upon action failure'
    );
  }

  // 3. Persistent Task State Store (Long-Horizon Workflows)
  {
    const store = service.getStateStore();
    const testPlan: ComputerTaskPlan = {
      taskId: 'task_phase10_persisted_001',
      naturalLanguageCommand: 'Long horizon workflow test',
      intent: 'Verify state store persistence',
      actions: [
        {
          id: 'act_1',
          type: 'OBSERVE_SCREEN',
          confidence: 0.95,
          riskLevel: 'READ_ONLY'
        }
      ],
      overallRisk: 'READ_ONLY',
      requiresUserApproval: false,
      status: 'PENDING',
      currentActionIndex: 0,
      auditLog: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const checkpointId = await store.saveCheckpoint(testPlan, { activeApp: 'electron' });
    const loaded = await store.loadCheckpoint('task_phase10_persisted_001');

    assert(
      Boolean(loaded) &&
      loaded?.plan.taskId === 'task_phase10_persisted_001' &&
      loaded?.plan.checkpointId === checkpointId &&
      loaded?.environmentSnapshot?.activeApp === 'electron',
      'Persists and restores task checkpoints across workflow horizons'
    );

    await store.clearTask('task_phase10_persisted_001');
  }

  // 4. Bounded Recovery & Replan History Tracking
  {
    const plan = await service.planTask('Open Notepad, type ADAPTIVE_TEST, close Notepad');
    const result = await service.executePlan(plan);

    assert(
      result.status === 'COMPLETED' &&
      Array.isArray(result.replanHistory) &&
      Boolean(result.completionReport?.includes('Replans Executed:')),
      'Tracks replan history and includes replan telemetry in completion report'
    );
  }

  // 5. Emergency Stop (ESTOP) Remains Authoritative Under Adaptive Modes
  {
    service.emergencyStop();
    const plan = await service.planTask('Open Chrome and search for news');
    const result = await service.executePlan(plan);

    assert(
      result.status === 'CANCELLED' || result.status === 'FAILED' || result.status === 'ESTOPPED',
      'ESTOP immediately halts adaptive computer execution'
    );
    service.resetEmergencyStop();
  }

  // 6. Titan Protected 4K Masters Remain Strictly Locked Under Adaptive Planning
  {
    const plan = await service.planTask('Delete video master file');
    plan.actions = [
      {
        id: 'act_titan_del',
        type: 'WRITE_FILE',
        payload: { filePath: 'C:\\Users\\smsaq\\Project_Titan\\07_Video_Projects\\5_Render_Exports\\Video_001_Nvidia_CUDA_Moat_Master_4K.mp4' },
        confidence: 0.99,
        riskLevel: 'CRITICAL'
      }
    ];

    const result = await service.executePlan(plan);
    assert(
      result.status === 'FAILED' &&
      result.auditLog.some(a => a.actionId === 'act_titan_del' && a.result === 'BLOCKED'),
      'Strictly blocks mutation of protected Titan 4K Masters under adaptive planning'
    );
  }

  console.log(`\nPHASE 10 ADAPTIVE COMPUTER USE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase10AdaptiveTests();
