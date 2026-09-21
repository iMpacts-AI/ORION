import { ProcessSupervisor } from '../computer/ProcessSupervisor';
import { spawn } from 'child_process';

async function runEstopProcessTest() {
  console.log('--- RUNNING ADVERSARIAL ESTOP CHILD PROCESS TERMINATION TEST ---');
  const supervisor = ProcessSupervisor.getInstance();
  supervisor.resetEstop();

  // Spawn a background node process that loops indefinitely
  const sleepCode = 'setInterval(() => { process.stdout.write("."); }, 500);';
  const child = spawn('node', ['-e', sleepCode], { shell: false });

  if (!child.pid) {
    throw new Error('Failed to spawn test background process');
  }

  const tracked = supervisor.registerProcess('adversarial_test_proc', 'node sleep', child, undefined, true);
  console.log(`[TEST] Registered process PID: ${child.pid}`);

  let isAliveBefore = false;
  try {
    process.kill(child.pid, 0);
    isAliveBefore = true;
  } catch (e) {
    isAliveBefore = false;
  }
  console.log(`[TEST] Process alive before ESTOP: ${isAliveBefore}`);
  if (!isAliveBefore) throw new Error('Test process failed to start');

  // Trigger Emergency Stop
  console.log('[TEST] Triggering Emergency Stop...');
  const res = await supervisor.triggerEstop();
  console.log(`[TEST] ESTOP result: terminated ${res.terminatedCount} processes, errors: ${res.errors.length}`);

  // Give OS 300ms to process termination signal
  await new Promise(r => setTimeout(r, 300));

  let isAliveAfter = false;
  try {
    process.kill(child.pid, 0);
    isAliveAfter = true;
  } catch (e) {
    isAliveAfter = false;
  }
  console.log(`[TEST] Process alive after ESTOP: ${isAliveAfter}`);

  if (isAliveAfter) {
    console.error('[FAIL] Process is STILL ALIVE after ESTOP! Process termination failed.');
    process.exit(1);
  }

  // Attempt to spawn new process while ESTOP is active
  let rejected = false;
  try {
    await supervisor.runManagedCommand('node', ['-e', 'console.log("bad")']);
  } catch (err: any) {
    if (err.message.includes('EMERGENCY STOP state')) {
      rejected = true;
    }
  }
  console.log(`[TEST] New command rejected while ESTOP active: ${rejected}`);
  if (!rejected) {
    console.error('[FAIL] New command was NOT rejected during active ESTOP!');
    process.exit(1);
  }

  supervisor.resetEstop();
  console.log('[PASS] ADVERSARIAL ESTOP PROCESS TERMINATION & REJECTION VERIFIED 100% GREEN!\n');
}

runEstopProcessTest();
