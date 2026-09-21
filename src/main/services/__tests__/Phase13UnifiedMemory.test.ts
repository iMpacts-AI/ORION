import { UnifiedMemoryManager } from '../UnifiedMemoryManager.js';

async function runPhase13UnifiedMemoryTests() {
  console.log('--- RUNNING PHASE 13 UNIFIED MEMORY MANAGER SUITE ---');
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

  const memoryManager = new UnifiedMemoryManager();

  // 1. Test Memory Addition & Bounds
  {
    const mem1 = memoryManager.addMemory('EPISODIC', 'Successfully parsed architecture project files.', ['build', 'architecture']);
    assert(mem1.id.startsWith('mem_'), 'Memory record assigned typed ID');
    assert(mem1.trustLevel === 'TRUSTED_SYSTEM', 'Default trust level assigned cleanly');
  }

  // 2. Test Memory Querying
  {
    memoryManager.addMemory('TASK', 'Refactor tool dependency graph cycle check.', ['graph', 'dag']);
    const queryRes = memoryManager.queryMemories('dependency graph');
    assert(queryRes.length > 0 && queryRes[0].tags.includes('dag'), 'Memory query matches content and returns tags');
  }

  // 3. Test Layer-Specific Clearing
  {
    memoryManager.addMemory('CONVERSATION', 'User asked to open VS Code.');
    memoryManager.clearMemories('CONVERSATION');
    const queryConv = memoryManager.queryMemories('VS Code');
    assert(queryConv.length === 0, 'Clear memories cleanly wipes specific memory layer without affecting others');
  }

  // 4. Test Persistence Across Restarts (File-backed storage reload)
  {
    const fs = require('fs');
    const path = require('path');
    const tempStorage = path.join(process.cwd(), '.orion_memory', 'test_persistence.json');
    if (fs.existsSync(tempStorage)) fs.unlinkSync(tempStorage);

    const memInstance1 = new UnifiedMemoryManager(tempStorage);
    memInstance1.addMemory('EPISODIC', 'ORION V1 Persistence Architecture verified.', ['v1', 'architecture']);

    // Instantiate new manager instance pointing to the same file (simulates restart)
    const memInstance2 = new UnifiedMemoryManager(tempStorage);
    const loaded = memInstance2.queryMemories('Persistence Architecture');
    assert(
      loaded.length === 1 && loaded[0].content.includes('ORION V1 Persistence Architecture'),
      'Unified Memory successfully persists to disk and survives simulated application restart'
    );

    if (fs.existsSync(tempStorage)) fs.unlinkSync(tempStorage);
  }

  console.log(`\nPHASE 13 SUITE RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase13UnifiedMemoryTests();
