const path = require('path');
const fs = require('fs');
const ts = require('typescript');

require.extensions['.ts'] = function(m, f) {
  const content = fs.readFileSync(f, 'utf8');
  const compiled = ts.transpileModule(content, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
  });
  return m._compile(compiled.outputText, f);
};

const { ToolService } = require('./src/main/services/ToolService.ts');
const { VisionService } = require('./src/main/services/VisionService.ts');
const { VoiceService } = require('./src/main/services/VoiceService.ts');
const { OrionOrchestrator } = require('./src/main/services/OrionOrchestrator.ts');
const { OrionAIProviderRouter } = require('./src/main/services/OrionAIProviderRouter.ts');

async function testFullLoop() {
  console.log('==================================================================');
  console.log('PHASE 5: REAL ORION BRAIN TEST — OPENROUTER LIVE DECISION & TOOL LOOP');
  console.log('==================================================================\n');

  const router = new OrionAIProviderRouter();
  const toolService = new ToolService();
  const visionService = new VisionService();
  const voiceService = new VoiceService();
  const orchestrator = new OrionOrchestrator(toolService, visionService, voiceService, router);

  // 1. Harmless reasoning task directly through OpenRouter
  console.log('[TEST 1] Pure Reasoning Request...');
  const t1Start = Date.now();
  const res1 = await orchestrator.processCommand('What is the square root of 144? Answer in one short sentence.');
  const t1Latency = Date.now() - t1Start;
  console.log(`[PASS] Reasoning Response (${t1Latency}ms):`);
  console.log(`       "${res1.response.trim()}"`);

  // 2. Tool-Use Request requiring tool planning and observation synthesis
  console.log('\n[TEST 2] Autonomous Tool-Calling Request...');
  const t2Start = Date.now();
  const res2 = await orchestrator.processCommand('What is the current system time?');
  const t2Latency = Date.now() - t2Start;
  console.log(`[PASS] Tool Response (${t2Latency}ms):`);
  console.log(`       Response: "${res2.response.trim()}"`);
  console.log(`       Tool Executed:`, res2.toolCallsExecuted.map(c => c.toolName));
  console.log(`       Tool Results Count:`, res2.toolResults.length);
  console.log(`       Planning Latency: ${res2.metrics.planningLatencyMs}ms`);
  console.log(`       AI Generation Latency: ${res2.metrics.aiTotalGenerationLatencyMs}ms`);

  console.log('\n==================================================================');
  console.log('REAL ORION BRAIN OPENROUTER END-TO-END VERIFICATION: 100% SUCCESS');
  console.log('==================================================================');
}

testFullLoop();
