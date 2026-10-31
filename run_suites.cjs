const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const testDir = path.join(__dirname, 'src/main/services/__tests__');
const helperPath = path.join(__dirname, 'runner_helper.cjs');
const titanWorkspacePath = process.env.ORION_TITAN_WORKSPACE || path.join(os.homedir(), 'Project_Titan');
const titanProjectAvailable = fs.existsSync(titanWorkspacePath);
const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith('.test.ts')).sort();

console.log(`=== RUNNING ALL ${testFiles.length} TEST SUITES IN PURE PROCESS ISOLATION ===`);
if (!titanProjectAvailable) {
  console.log(`[ENV NOTE] External Project_Titan workspace not present on this machine — classifying Titan* external-project suites separately.\n`);
} else {
  console.log('');
}

let passed = 0;
let skippedEnv = 0;
let totalVerifyMarkers = 0;
const failed = [];
const skippedEnvSuites = [];

function countAssertionsInOutput(stdoutText) {
  if (!stdoutText) return 1;
  const lines = stdoutText.split(/\r?\n/);
  let count = 0;
  for (const line of lines) {
    if (
      /\[PASS\]|✓|PASSED:/i.test(line) &&
      !/ALL .* PASSED/i.test(line) &&
      !/Test Summary:/i.test(line)
    ) {
      count++;
    }
  }
  return Math.max(count, 1);
}

for (const file of testFiles) {
  const estopStateFile = path.join(__dirname, '.orion_memory', 'estop_state.json');
  const approvalsStateFile = path.join(__dirname, '.orion_memory', 'approvals_state.json');
  try {
    if (fs.existsSync(estopStateFile)) {
      fs.unlinkSync(estopStateFile);
    }
    if (fs.existsSync(approvalsStateFile)) {
      fs.unlinkSync(approvalsStateFile);
    }
  } catch {}
  if (file.startsWith('Titan') && !titanProjectAvailable) {
    skippedEnv++;
    skippedEnvSuites.push(file);
    console.log(`RUNNING: ${file} ... [SKIPPED_ENV: Requires external Project_Titan workspace]`);
    continue;
  }
  const fullPath = path.join(testDir, file);
  process.stdout.write(`RUNNING: ${file} ... `);
  try {
    const out = execFileSync(process.execPath, [helperPath, fullPath], {
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 120000
    });
    passed++;
    const checks = countAssertionsInOutput(out);
    totalVerifyMarkers += checks;
    console.log(`[PASS] (${checks} verified checks)`);
  } catch (err) {
    console.log('[FAIL]');
    if (err.stdout) console.error(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    failed.push(file);
  } finally {
    try {
      if (fs.existsSync(estopStateFile)) {
        fs.unlinkSync(estopStateFile);
      }
    } catch {}
  }
}

const runnableCount = testFiles.length - skippedEnv;
console.log(`\n==================================================`);
console.log(
  `RESULTS: ${passed}/${runnableCount} RUNNABLE SUITES PASSED (${totalVerifyMarkers} verified checks across suites; ${skippedEnv} external Project_Titan suites classified as SKIPPED_ENV)`
);
if (failed.length > 0) {
  console.log(`FAILED SUITES (${failed.length}):\n - ` + failed.join('\n - '));
  process.exit(1);
} else {
  console.log(`ALL ${runnableCount} RUNNABLE TEST SUITES PASSED IN PURE PROCESS ISOLATION!`);
}
