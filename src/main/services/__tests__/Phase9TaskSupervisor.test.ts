import { TaskSupervisor } from '../TaskSupervisor.js';

async function runPhase9TaskSupervisorTests() {
  console.log('--- RUNNING PHASE 9 BACKGROUND TASK SUPERVISOR SUITE ---');
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

  const supervisor = new TaskSupervisor();

  // 1. Test Task Lifecycle (QUEUED -> RUNNING -> COMPLETED)
  {
    const task = supervisor.createTask('Sync Repository Data', 'Fetch latest remote git changes', 'HIGH');
    assert(task.status === 'QUEUED', 'Task initialized in QUEUED state');

    const started = supervisor.startTask(task.taskId);
    assert(started && supervisor.getTask(task.taskId)?.status === 'RUNNING', 'Task transitioned cleanly to RUNNING');

    supervisor.updateProgress(task.taskId, 50, { step: 1 });
    assert(supervisor.getTask(task.taskId)?.progressPercent === 50, 'Task progress updated cleanly');

    supervisor.updateProgress(task.taskId, 100);
    assert(supervisor.getTask(task.taskId)?.status === 'COMPLETED' && supervisor.getTask(task.taskId)?.verificationVerified === true, 'Task completed cleanly with verification flag set');
  }

  // 2. Test Retry Budget & Failure Recovery
  {
    const task = supervisor.createTask('Flaky Network Fetch', 'Download asset bundle', 'MEDIUM', undefined, 2);
    supervisor.startTask(task.taskId);

    const willRetry1 = supervisor.handleTaskFailure(task.taskId, 'Connection Reset');
    assert(willRetry1 && supervisor.getTask(task.taskId)?.status === 'RETRYING', 'First failure triggers RETRYING state');

    const willRetry2 = supervisor.handleTaskFailure(task.taskId, 'Connection Timeout');
    assert(willRetry2 && supervisor.getTask(task.taskId)?.retriesAttempted === 2, 'Second failure triggers RETRYING state within retry budget');

    const willRetry3 = supervisor.handleTaskFailure(task.taskId, 'Fatal DNS Failure');
    assert(!willRetry3 && supervisor.getTask(task.taskId)?.status === 'FAILED', 'Exhausted retry budget transitions task to FAILED permanently');
  }

  // 3. Test Task Cancellation
  {
    const task = supervisor.createTask('Long Compute Job', 'Heavy analysis', 'LOW');
    supervisor.startTask(task.taskId);
    const cancelled = supervisor.cancelTask(task.taskId);
    assert(cancelled && supervisor.getTask(task.taskId)?.status === 'CANCELLED', 'Task cancelled cleanly by supervisor');
  }

  console.log(`\nPHASE 9 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase9TaskSupervisorTests();
