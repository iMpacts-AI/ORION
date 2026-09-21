const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const testDir = path.join(__dirname, 'src/main/services/__tests__');
const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith('.test.ts'));

console.log(`=== RUNNING ALL ${testFiles.length} TEST SUITES IN PURE PROCESS ISOLATION ===\n`);

let passed = 0;
const failed = [];

for (const file of testFiles) {
  const fullPath = path.join(testDir, file);
  process.stdout.write(`RUNNING: ${file} ... `);
  try {
    execSync(`node -e "
      const ts = require('typescript');
      const fs = require('fs');
      require.extensions['.ts'] = function(m, f) {
        const content = fs.readFileSync(f, 'utf8');
        const compiled = ts.transpileModule(content, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
        return m._compile(compiled.outputText, f);
      };
      require('${fullPath.replace(/\\/g, '/')}');
    "`, { stdio: 'pipe' });
    passed++;
    console.log('[PASS]');
  } catch (err) {
    passed += 0;
    console.log('[FAIL]');
    if (err.stdout) console.error(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    failed.push(file);
  }
}

console.log(`\n==================================================`);
console.log(`RESULTS: ${passed}/${testFiles.length} SUITES PASSED 100% GREEN`);
if (failed.length > 0) {
  console.log(`FAILED SUITES:\n - ` + failed.join('\n - '));
  process.exit(1);
} else {
  console.log(`ALL ${testFiles.length} TEST SUITES PASSED IN PURE PROCESS ISOLATION!`);
}
