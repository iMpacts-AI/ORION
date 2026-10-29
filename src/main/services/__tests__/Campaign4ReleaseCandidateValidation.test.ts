import http from 'http';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';
import { ActionRiskEvaluator } from '../ActionRiskEvaluator';
import { ComputerPermissionService } from '../computer/ComputerPermissionService';
import { ComputerActionService } from '../ComputerActionService';
import { ComputerPerceptionService } from '../ComputerPerceptionService';
import { ComputerActionExecutor } from '../computer/ComputerActionExecutor';
import { ComputerActionVerifier } from '../computer/ComputerActionVerifier';
import { ComputerRecoveryService } from '../computer/ComputerRecoveryService';
import { ComputerActionPlanner } from '../computer/ComputerActionPlanner';
import { ScreenCaptureService } from '../computer/ScreenCaptureService';
import { ScreenUnderstandingService } from '../computer/ScreenUnderstandingService';
import { InputControlService, MockInputDriver } from '../computer/InputControlService';
import { WindowManagerService } from '../computer/WindowManagerService';
import { MockWindowProvider } from '../../platform/WindowProvider';
import { ProcessSupervisor } from '../computer/ProcessSupervisor';
import { ToolService } from '../ToolService';
import { VisionService } from '../VisionService';
import { SystemMonitorService } from '../SystemMonitorService';
import { ExecutionTraceService } from '../ExecutionTraceService';
import { UnifiedMemoryManager } from '../UnifiedMemoryManager';
import { SkillWorkflowEngine } from '../SkillWorkflowEngine';
import { McpClientService } from '../McpClientService';
import { DefaultBrowserProvider } from '../../platform/BrowserProvider';
import { OpenAICompatibleAdapter } from '../ProviderAdapters';
import { OrionCliKernel } from '../../../cli/OrionCliKernel';
import { OrionCliRenderer } from '../../../cli/OrionCliRenderer';
import { OrionCliCommandRouter } from '../../../cli/OrionCliCommandRouter';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    passed++;
    console.log(`  [PASS] ${message}`);
  } else {
    failed++;
    console.error(`  [FAIL] ${message}`);
  }
}

function computeStats(samples: number[]): { medianMs: number; minMs: number; maxMs: number; samples: number[] } {
  const sorted = [...samples].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 ? sorted[mid] : Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 100) / 100;
  return {
    medianMs: Math.round(median * 100) / 100,
    minMs: Math.round(sorted[0] * 100) / 100,
    maxMs: Math.round(sorted[sorted.length - 1] * 100) / 100,
    samples: samples.map(s => Math.round(s * 100) / 100)
  };
}

async function runCampaign4Validation(): Promise<void> {
  console.log('\n====================================================================');
  console.log(' ORION CAMPAIGN 4 — INDEPENDENT VALIDATION & RELEASE CANDIDATE SUITE');
  console.log('====================================================================\n');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orion-campaign4-'));
  const projectRoot = process.cwd();

  try {
    // =========================================================================
    // SECTION 1: INDEPENDENT SECURITY & RED-TEAM AUDIT (C4-D01 through C4-D06)
    // =========================================================================
    console.log('--- Section 1: Independent Security & Red-Team Validation (C4-D01 – C4-D06) ---');

    const evaluator = new ActionRiskEvaluator();
    const toolService = new ToolService();
    const perception = new ComputerPerceptionService(new SystemMonitorService(), new VisionService());
    const actionService = new ComputerActionService(perception, toolService, evaluator);

    // 1.1 Cross-key conflicting targets (C4-D04: payload.filePath vs parameters.path)
    const crossKeyConflictRisk = evaluator.evaluateRisk(
      'WRITE_FILE',
      { filePath: path.join(tmpDir, 'safe_note.txt') },
      { path: 'C:\\Windows\\System32\\drivers\\etc\\hosts' },
      path.join(tmpDir, 'safe_note.txt')
    );
    assert(
      crossKeyConflictRisk === 'CRITICAL',
      `C4-D04: Cross-key conflicting targets (payload.filePath vs parameters.path) blocked as CRITICAL (got ${crossKeyConflictRisk})`
    );

    const nestedConflictRisk = evaluator.evaluateRisk(
      'WRITE_FILE',
      {
        action: {
          payload: { filePath: path.join(tmpDir, 'harmless.txt') },
          parameters: { dirPath: 'C:\\Users\\operator\\.ssh' }
        }
      },
      {},
      path.join(tmpDir, 'harmless.txt')
    );
    assert(
      nestedConflictRisk === 'CRITICAL',
      `C4-D04: Nested action cross-key conflict (action.payload.filePath vs action.parameters.dirPath) blocked as CRITICAL (got ${nestedConflictRisk})`
    );

    // 1.2 Direct ToolService.executeTool security enforcement (C4-D01: simulating Electron IPC / Orchestrator call)
    ProcessSupervisor.getInstance().resetEstop();
    const directNestedCriticalRes = await toolService.executeTool({
      id: 'c4_direct_crit_1',
      toolId: 'computer.execute_action',
      toolName: 'Execute Single Computer Action',
      arguments: {
        action: {
          id: 'act_nested_ssh',
          type: 'WRITE_FILE',
          target: 'C:\\Users\\operator\\.ssh\\authorized_keys',
          payload: { filePath: 'C:\\Users\\operator\\.ssh\\authorized_keys', content: 'ssh-rsa AAA...' }
        }
      },
      timestamp: Date.now(),
      requiresUserApproval: false
    });
    assert(
      directNestedCriticalRes.success === false && /SECURITY POLICY VIOLATION|Critical/i.test(directNestedCriticalRes.error || ''),
      `C4-D01: Direct ToolService.executeTool blocks nested computer.execute_action targeting .ssh (${directNestedCriticalRes.error})`
    );

    // Unapproved HIGH tool called directly on ToolService (without OrionCliKernel wrapper)
    const directHighToolUnapproved = await toolService.executeTool({
      id: 'c4_direct_high_1',
      toolId: 'titan.render_video_draft',
      toolName: 'Titan Render Master Video Draft',
      arguments: { target: 'Video_001' },
      timestamp: Date.now(),
      requiresUserApproval: false
    });
    assert(
      directHighToolUnapproved.success === false && /AUTHORIZATION REQUIRED|requires explicit/i.test(directHighToolUnapproved.error || ''),
      `C4-D01: Direct ToolService.executeTool blocks unapproved HIGH-permission tool (${directHighToolUnapproved.error})`
    );

    // 1.3 Global E-Stop enforcement across ToolService, ComputerActionService, and ComputerPermissionService (C4-D01 & C4-D02)
    await ProcessSupervisor.getInstance().triggerEstop();
    const estopDirectToolRes = await toolService.executeTool({
      id: 'c4_estop_tool_1',
      toolId: 'system.get_info',
      toolName: 'System Info',
      arguments: {},
      timestamp: Date.now(),
      requiresUserApproval: false
    });
    assert(
      estopDirectToolRes.success === false && /Emergency Stop is active/i.test(estopDirectToolRes.error || ''),
      `C4-D01: Direct ToolService.executeTool blocked when ProcessSupervisor E-Stop is active (${estopDirectToolRes.error})`
    );

    const estopActionServiceRes = await actionService.executeAction({
      id: 'c4_estop_act_1',
      type: 'OBSERVE_SCREEN',
      target: 'Desktop',
      riskLevel: 'READ_ONLY',
      requiresApproval: false
    });
    assert(
      estopActionServiceRes.success === false && /Emergency Stop is active/i.test(estopActionServiceRes.error || ''),
      `C4-D02: ComputerActionService.executeAction blocked when ProcessSupervisor E-Stop is active (${estopActionServiceRes.error})`
    );

    const standalonePermService = new ComputerPermissionService(evaluator);
    const estopPermEval = standalonePermService.evaluateActionPermission({
      id: 'c4_estop_perm_1',
      type: 'OBSERVE_SCREEN',
      target: 'Desktop',
      riskLevel: 'READ_ONLY',
      requiresApproval: false
    });
    assert(
      estopPermEval.allowed === false && /Emergency Stop is active/i.test(estopPermEval.reason || ''),
      `C4-D02: ComputerPermissionService.evaluateActionPermission honors global ProcessSupervisor E-Stop (${estopPermEval.reason})`
    );
    ProcessSupervisor.getInstance().resetEstop();

    // 1.4 ComputerActionExecutor payload-to-parameters normalization (C4-D03)
    const mockDriver = new MockInputDriver();
    const inputControl = new InputControlService(mockDriver);
    const winManager = new WindowManagerService(new MockWindowProvider());
    const screenUnd = new ScreenUnderstandingService(new ScreenCaptureService(), winManager, true);
    const executor = new ComputerActionExecutor(
      screenUnd,
      inputControl,
      winManager,
      standalonePermService,
      new ComputerActionVerifier(),
      new ComputerRecoveryService(winManager, screenUnd, inputControl),
      new ComputerActionPlanner()
    );

    const payloadOnlyActionRes = await executor.executeAction({
      id: 'c4_payload_type_1',
      type: 'KEYBOARD_INPUT',
      target: 'Editor',
      payload: { text: 'HelloFromPayloadOnly' },
      riskLevel: 'LOW_RISK',
      requiresApproval: false
    });
    const typedHistory = mockDriver.history.find(h => h.action === 'typeText' && h.args.text === 'HelloFromPayloadOnly');
    assert(
      payloadOnlyActionRes.success === true && Boolean(typedHistory),
      'C4-D03: ComputerActionExecutor normalizes action.payload into action.parameters so payload-only callers execute properly'
    );

    // 1.5 URL Query Secret & Private Key Block Redaction (C4-D06)
    const syntheticQuerySecret = 'https://api.example.com/v1/data?api_key=CANARY_URL_SECRET_9988776655&token=CANARY_TOKEN_11223344';
    const syntheticPemKey = '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA0123456789SYNTHETICKEYDATA\n-----END RSA PRIVATE KEY-----';

    const redactedTraceStr = ExecutionTraceService.redactSensitiveValue(`${syntheticQuerySecret}\n${syntheticPemKey}`);
    assert(
      !redactedTraceStr.includes('CANARY_URL_SECRET_9988776655') &&
        !redactedTraceStr.includes('CANARY_TOKEN_11223344') &&
        !redactedTraceStr.includes('MIIEpAIBAAKCAQEA0123456789SYNTHETICKEYDATA'),
      'C4-D06: ExecutionTraceService redacts URL query-parameter secrets and PEM private key blocks'
    );

    const redactedMemStr = UnifiedMemoryManager.sanitizeSecrets(`${syntheticQuerySecret}\n${syntheticPemKey}`);
    assert(
      !redactedMemStr.includes('CANARY_URL_SECRET_9988776655') &&
        !redactedMemStr.includes('CANARY_TOKEN_11223344') &&
        !redactedMemStr.includes('MIIEpAIBAAKCAQEA0123456789SYNTHETICKEYDATA'),
      'C4-D06: UnifiedMemoryManager.sanitizeSecrets redacts URL query-parameter secrets and PEM private key blocks'
    );

    const cliRenderer = new OrionCliRenderer({ useColor: false, jsonMode: true });
    const redactedCliStr = cliRenderer.sanitize(`${syntheticQuerySecret}\n${syntheticPemKey}`);
    assert(
      !redactedCliStr.includes('CANARY_URL_SECRET_9988776655') &&
        !redactedCliStr.includes('CANARY_TOKEN_11223344') &&
        !redactedCliStr.includes('MIIEpAIBAAKCAQEA0123456789SYNTHETICKEYDATA'),
      'C4-D06: OrionCliRenderer.sanitize redacts URL query-parameter secrets and PEM private key blocks'
    );

    // =========================================================================
    // SECTION 2: COMPLETE WINDOWS APPLICATION & CLI SUBPROCESS VALIDATION
    // =========================================================================
    console.log('\n--- Section 2: Complete Windows Application (CLI Subprocess + Electron GUI + Packaged RC) ---');

    // 2.1 In-process --json mode across slash commands (C4-D05)
    const capturedLines: string[] = [];
    const customStream = {
      isTTY: false,
      columns: 100,
      write: (chunk: string) => {
        capturedLines.push(chunk);
        return true;
      },
      on: () => {}
    } as unknown as NodeJS.WriteStream;

    const jsonKernel = new OrionCliKernel({
      projectRoot,
      renderer: new OrionCliRenderer({ useColor: false, jsonMode: true, outputStream: customStream }),
      mcpConfigPath: path.join(tmpDir, 'mcp_empty.json')
    });
    const jsonRouter = new OrionCliCommandRouter(jsonKernel);

    for (const slashCmd of ['/status', '/providers', '/models', '/tools', '/permissions', '/mcp']) {
      capturedLines.length = 0;
      const dispatchRes = await jsonRouter.dispatch(slashCmd);
      const rawOut = capturedLines.join('').trim();
      let parsedJson: any = null;
      try {
        parsedJson = JSON.parse(rawOut);
      } catch {}
      assert(
        dispatchRes.exitCode === 0 && parsedJson !== null && typeof parsedJson === 'object',
        `C4-D05: '${slashCmd} --json' emits valid machine-readable JSON (keys: ${parsedJson ? Object.keys(parsedJson).join(',') : 'NONE'})`
      );
    }
    jsonKernel.shutdown();

    // 2.2 Real CLI subprocess execution: `node bin/orion.js --version` and `node bin/orion.js /status --json`
    const cliBinPath = path.join(projectRoot, 'bin', 'orion.js');
    const cliVerProc = spawnSync(process.execPath, [cliBinPath, '--version'], {
      cwd: projectRoot,
      encoding: 'utf8',
      timeout: 10000
    });
    assert(
      cliVerProc.status === 0 && /ORION v1\.0\.0/.test(cliVerProc.stdout || ''),
      `Real CLI subprocess 'node bin/orion.js --version' succeeded (${(cliVerProc.stdout || '').trim()})`
    );

    const cliStatusProc = spawnSync(process.execPath, [cliBinPath, '/status', '--json'], {
      cwd: projectRoot,
      encoding: 'utf8',
      timeout: 15000
    });
    let cliStatusJson: any = null;
    try {
      cliStatusJson = JSON.parse((cliStatusProc.stdout || '').trim());
    } catch {}
    assert(
      cliStatusProc.status === 0 && cliStatusJson && cliStatusJson.registeredToolsCount >= 38,
      `Real CLI subprocess 'node bin/orion.js /status --json' returned valid JSON (tools=${cliStatusJson?.registeredToolsCount})`
    );

    // 2.3 Real Electron Desktop Application Startup & Clean Shutdown (`electron .`)
    const electronExePath = require('electron') as string;
    const desktopSmokeMarkerFile = path.join(tmpDir, 'electron_dev_smoke.txt');
    const cleanElectronEnv: NodeJS.ProcessEnv = {
      ...process.env,
      ORION_SMOKE_TEST_EXIT_MS: '200',
      ORION_SMOKE_TEST_OUT_FILE: desktopSmokeMarkerFile
    };
    delete cleanElectronEnv.ELECTRON_RUN_AS_NODE;

    const devElectronStart = performance.now();
    const devElectronProc = spawnSync(electronExePath, ['.'], {
      cwd: projectRoot,
      env: cleanElectronEnv,
      stdio: 'ignore',
      timeout: 12000
    });
    const devElectronMs = Math.round(performance.now() - devElectronStart);
    const devMarkerContent = fs.existsSync(desktopSmokeMarkerFile)
      ? fs.readFileSync(desktopSmokeMarkerFile, 'utf8').trim()
      : '';
    assert(
      devElectronProc.status === 0 && devMarkerContent.startsWith('ORION_DESKTOP_READY'),
      `Real Electron desktop app ('electron .') initialized IPC, loaded BrowserWindow, and exited cleanly in ${devElectronMs}ms (${devMarkerContent})`
    );

    // 2.4 Packaged Windows Release Candidate (`release/win-unpacked/ORION.exe`) Verification
    const packagedExePath = path.join(projectRoot, 'release', 'win-unpacked', 'ORION.exe');
    const packagedDistHtml = path.join(projectRoot, 'release', 'win-unpacked', 'resources', 'app', 'dist', 'index.html');
    const packagedMainJs = path.join(projectRoot, 'release', 'win-unpacked', 'resources', 'app', 'dist-electron', 'main', 'index.js');
    const packagedNativeInputExe = path.join(
      projectRoot,
      'release',
      'win-unpacked',
      'resources',
      'app',
      'src',
      'main',
      'platform',
      'win32-native-input.exe'
    );

    assert(
      fs.existsSync(packagedExePath) &&
        fs.existsSync(packagedDistHtml) &&
        fs.existsSync(packagedMainJs) &&
        fs.existsSync(packagedNativeInputExe),
      'Packaged Windows Release Candidate (release/win-unpacked/ORION.exe) contains all required bundles and win32-native-input.exe'
    );

    const rcSmokeMarkerFile = path.join(tmpDir, 'electron_rc_smoke.txt');
    const rcEnv: NodeJS.ProcessEnv = {
      ...process.env,
      ORION_SMOKE_TEST_EXIT_MS: '200',
      ORION_SMOKE_TEST_OUT_FILE: rcSmokeMarkerFile
    };
    delete rcEnv.ELECTRON_RUN_AS_NODE;

    const rcStart = performance.now();
    const rcProc = spawnSync(packagedExePath, [], {
      cwd: path.dirname(packagedExePath),
      env: rcEnv,
      stdio: 'ignore',
      timeout: 12000
    });
    const rcDurationMs = Math.round(performance.now() - rcStart);
    const rcMarkerContent = fs.existsSync(rcSmokeMarkerFile) ? fs.readFileSync(rcSmokeMarkerFile, 'utf8').trim() : '';
    assert(
      rcProc.status === 0 && rcMarkerContent.startsWith('ORION_DESKTOP_READY'),
      `Packaged Release Candidate ('release/win-unpacked/ORION.exe') launched, loaded UI, and shut down cleanly in ${rcDurationMs}ms (${rcMarkerContent})`
    );

    // =========================================================================
    // SECTION 3: CRASH RECOVERY, BROWSER CDP + FALLBACK, & MCP ISOLATION
    // =========================================================================
    console.log('\n--- Section 3: Crash Recovery, Browser CDP + HTTP Fallback, & MCP Isolation ---');

    // 3.1 Crash recovery: non-idempotent RUNNING step fails closed with IN_DOUBT_SIDE_EFFECT
    const wfStateDir = path.join(tmpDir, 'wf_checkpoints');
    const wfEngine = new SkillWorkflowEngine(toolService, evaluator, wfStateDir);
    const nonIdempotentRunningCp: any = {
      version: 1,
      workflowId: 'wf_c4_indoubt_1',
      goal: 'Mutating workflow interrupted mid-flight',
      status: 'RUNNING' as const,
      createdAt: Date.now() - 5000,
      updatedAt: Date.now() - 1000,
      currentStepIndex: 0,
      definitionHash: 'def_hash_c4',
      stepsCompleted: 0,
      stepsTotal: 1,
      verifiedCount: 0,
      steps: [
        {
          stepNumber: 1,
          title: 'Write external file',
          toolId: 'file.write_text',
          arguments: { filePath: path.join(tmpDir, 'indoubt.txt'), content: 'data' },
          idempotent: false,
          maxRetries: 1,
          status: 'RUNNING' as const,
          attempts: 1
        }
      ]
    };
    wfEngine.saveCheckpoint(nonIdempotentRunningCp);
    const resumedInDoubt = await wfEngine.resumeWorkflow('wf_c4_indoubt_1');
    assert(
      (resumedInDoubt.status === 'BLOCKED' || resumedInDoubt.status === 'FAILED') &&
        /IN_DOUBT_SIDE_EFFECT/.test(resumedInDoubt.error || ''),
      `Workflow interrupted during non-idempotent RUNNING step fails closed with IN_DOUBT_SIDE_EFFECT (status=${resumedInDoubt.status}, err=${resumedInDoubt.error})`
    );

    // 3.2 Browser CDP Headless + HTTP Fallback against local test server
    const browserServer = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><head><title>ORION Campaign 4 Portal</title></head>
        <body>
          <a id="docs-link" href="/docs">Documentation</a>
          <input id="query-box" name="q" type="text" value="" />
          <button id="delete-btn" type="submit">Delete Account</button>
        </body></html>`);
    });
    await new Promise<void>(resolve => browserServer.listen(0, '127.0.0.1', () => resolve()));
    const browserPort = (browserServer.address() as any).port;
    const browserUrl = `http://127.0.0.1:${browserPort}/`;

    const browserProvider = new DefaultBrowserProvider();
    const httpNavRes = await browserProvider.navigate(browserUrl, { useCdpAdapter: false });
    assert(
      httpNavRes.success === true &&
        httpNavRes.observation?.adapterMode === 'HTTP_FETCH' &&
        httpNavRes.observation?.title === 'ORION Campaign 4 Portal',
      `Browser HTTP_FETCH mode navigated and parsed DOM (title="${httpNavRes.observation?.title}", mode=${httpNavRes.observation?.adapterMode})`
    );

    const unapprovedSubmitClick = await browserProvider.click('#delete-btn', { explicitAuthorization: false });
    assert(
      unapprovedSubmitClick.success === false && /AUTHORIZATION REQUIRED|HIGH_RISK_BROWSER_ACTION/i.test(unapprovedSubmitClick.error || ''),
      `Browser Provider blocks unapproved destructive button click (${unapprovedSubmitClick.error})`
    );

    const cdpNavRes = await browserProvider.navigate(browserUrl, { useCdpAdapter: true });
    assert(
      cdpNavRes.success === true && cdpNavRes.observation?.title === 'ORION Campaign 4 Portal',
      `Browser CDP_HEADLESS adapter navigated and verified readiness (adapterMode=${cdpNavRes.observation?.adapterMode})`
    );
    await browserProvider.close();

    // 3.3 MCP stdio child environment isolation & untrusted output sanitization
    const mcpFixtureScript = path.join(tmpDir, 'c4_mcp_server.cjs');
    fs.writeFileSync(
      mcpFixtureScript,
      `const readline = require('readline');
       const rl = readline.createInterface({ input: process.stdin });
       rl.on('line', (line) => {
         if (!line.trim()) return;
         const msg = JSON.parse(line);
         if (msg.method === 'initialize') {
           process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { protocolVersion: '2024-11-05', serverInfo: { name: 'c4-mcp', version: '1.0.0' }, capabilities: {} } }) + '\\n');
         } else if (msg.method === 'tools/list') {
           process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { tools: [{ name: 'check_env', description: 'Check env isolation', inputSchema: { type: 'object', properties: { tag: { type: 'string' } }, required: ['tag'], additionalProperties: false } }] } }) + '\\n');
         } else if (msg.method === 'tools/call') {
           const leaked = process.env.SYNTHETIC_HOST_CANARY_KEY || 'ISOLATED_CLEAN';
           process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text: 'ENV=' + leaked + ' ?api_key=CANARY_MCP_URL_KEY_999' }] } }) + '\\n');
         }
       });`,
      'utf8'
    );

    process.env.SYNTHETIC_HOST_CANARY_KEY = 'HOST_SECRET_SHOULD_NOT_LEAK';
    const mcpConfigFile = path.join(tmpDir, 'c4_mcp_config.json');
    const mcpService = new McpClientService(toolService.getRegistry(), mcpConfigFile);
    mcpService.addServerConfig({
      name: 'c4server',
      command: process.execPath,
      args: [mcpFixtureScript],
      enabled: true,
      trusted: true
    });
    const mcpConn = await mcpService.connectServer('c4server', true);
    assert(mcpConn.state === 'CONNECTED', `MCP server connected via stdio JSON-RPC 2.0 (state=${mcpConn.state})`);

    const mcpInvalidArgRes = await mcpService.callTool('c4server', 'check_env', { unknownField: 123 });
    assert(
      mcpInvalidArgRes.success === false && /MCP argument validation failed/i.test(mcpInvalidArgRes.error || ''),
      `MCP inputSchema validation rejects missing required / unknown arguments (${mcpInvalidArgRes.error})`
    );

    const mcpValidCallRes = await mcpService.callTool('c4server', 'check_env', { tag: 'audit' });
    const mcpOutputStr = JSON.stringify(mcpValidCallRes.data || {});
    assert(
      mcpValidCallRes.success === true &&
        mcpOutputStr.includes('ENV=ISOLATED_CLEAN') &&
        !mcpOutputStr.includes('HOST_SECRET_SHOULD_NOT_LEAK'),
      'MCP child process environment is isolated from host secret environment variables'
    );
    delete process.env.SYNTHETIC_HOST_CANARY_KEY;
    mcpService.shutdownAll();

    // =========================================================================
    // SECTION 4: MULTI-SAMPLE REAL PERFORMANCE BENCHMARKS (5 SAMPLES EACH)
    // =========================================================================
    console.log('\n--- Section 4: Multi-Sample Real Performance Benchmarks (5 Samples Each) ---');

    // 4.1 OrionCliKernel In-Process Initialization (5 samples)
    const kernelInitSamples: number[] = [];
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      const k = new OrionCliKernel({
        projectRoot,
        renderer: new OrionCliRenderer({ useColor: false, jsonMode: true, outputStream: customStream }),
        mcpConfigPath: path.join(tmpDir, 'mcp_bench.json')
      });
      kernelInitSamples.push(performance.now() - t0);
      k.shutdown();
    }
    const kernelInitStats = computeStats(kernelInitSamples);
    console.log(`  [BENCH] OrionCliKernel In-Process Init: median=${kernelInitStats.medianMs}ms (min=${kernelInitStats.minMs}ms, max=${kernelInitStats.maxMs}ms)`);

    // 4.2 Full CLI Process Startup `node bin/orion.js --version` (5 samples)
    const cliVersionStartupSamples: number[] = [];
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      const proc = spawnSync(process.execPath, [cliBinPath, '--version'], { cwd: projectRoot, encoding: 'utf8', timeout: 10000 });
      if (proc.status === 0) {
        cliVersionStartupSamples.push(performance.now() - t0);
      }
    }
    const cliVersionStats = computeStats(cliVersionStartupSamples);
    console.log(`  [BENCH] Full CLI Process ('node bin/orion.js --version'): median=${cliVersionStats.medianMs}ms (min=${cliVersionStats.minMs}ms, max=${cliVersionStats.maxMs}ms)`);

    // 4.3 Full CLI Process with Kernel & Telemetry `node bin/orion.js /permissions --json` (5 samples)
    const cliFullCmdSamples: number[] = [];
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      const proc = spawnSync(process.execPath, [cliBinPath, '/permissions', '--json'], {
        cwd: projectRoot,
        encoding: 'utf8',
        timeout: 15000
      });
      if (proc.status === 0) {
        cliFullCmdSamples.push(performance.now() - t0);
      }
    }
    const cliFullCmdStats = computeStats(cliFullCmdSamples);
    console.log(`  [BENCH] Full CLI Process + TS Kernel ('node bin/orion.js /permissions --json'): median=${cliFullCmdStats.medianMs}ms (min=${cliFullCmdStats.minMs}ms, max=${cliFullCmdStats.maxMs}ms)`);

    // 4.4 Full Electron Desktop Application Startup & Clean Shutdown (3 samples)
    const electronDesktopSamples: number[] = [];
    for (let i = 0; i < 3; i++) {
      const markerFile = path.join(tmpDir, `electron_bench_${i}.txt`);
      const env: NodeJS.ProcessEnv = {
        ...process.env,
        ORION_SMOKE_TEST_EXIT_MS: '50',
        ORION_SMOKE_TEST_OUT_FILE: markerFile
      };
      delete env.ELECTRON_RUN_AS_NODE;
      const t0 = performance.now();
      const proc = spawnSync(electronExePath, ['.'], { cwd: projectRoot, env, stdio: 'ignore', timeout: 12000 });
      if (proc.status === 0 && fs.existsSync(markerFile)) {
        electronDesktopSamples.push(performance.now() - t0);
      }
    }
    const electronDesktopStats = computeStats(electronDesktopSamples);
    console.log(`  [BENCH] Full Electron Desktop Startup & Clean Exit ('electron .'): median=${electronDesktopStats.medianMs}ms (min=${electronDesktopStats.minMs}ms, max=${electronDesktopStats.maxMs}ms)`);

    // 4.5 Streaming TTFT & End-to-End Response Time (Local Deterministic SSE Server, 5 samples)
    const sseServer = http.createServer((req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      });
      res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: 'ORION ' } }] })}\n\n`);
      setTimeout(() => {
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: 'streaming verified.' } }] })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
      }, 15);
    });
    await new Promise<void>(resolve => sseServer.listen(0, '127.0.0.1', () => resolve()));
    const ssePort = (sseServer.address() as any).port;

    process.env.SYNTHETIC_BENCH_API_KEY = 'sk-synth-bench-key-1234567890123456';
    const sseAdapter = new OpenAICompatibleAdapter({
      id: 'local-sse-bench',
      displayName: 'Local Deterministic SSE Benchmark Server',
      envKeyName: 'SYNTHETIC_BENCH_API_KEY',
      baseUrl: `http://127.0.0.1:${ssePort}/v1`,
      defaultModel: 'bench-model-v1',
      capabilities: {
        supportsTools: true,
        supportsVision: false,
        supportsStreaming: true,
        maxContextTokens: 8192,
        taskCategories: ['FAST_CHAT']
      }
    });

    const streamTtftSamples: number[] = [];
    const streamTotalSamples: number[] = [];
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      let ttft = 0;
      await sseAdapter.stream('Benchmark ping', () => {
        if (ttft === 0) ttft = performance.now() - t0;
      });
      streamTtftSamples.push(ttft);
      streamTotalSamples.push(performance.now() - t0);
    }
    delete process.env.SYNTHETIC_BENCH_API_KEY;
    sseServer.close();
    const streamTtftStats = computeStats(streamTtftSamples);
    const streamTotalStats = computeStats(streamTotalSamples);
    console.log(`  [BENCH] Streaming TTFT (Local SSE Adapter): median=${streamTtftStats.medianMs}ms (min=${streamTtftStats.minMs}ms, max=${streamTtftStats.maxMs}ms)`);
    console.log(`  [BENCH] Streaming E2E Response (Local SSE Adapter): median=${streamTotalStats.medianMs}ms (min=${streamTotalStats.minMs}ms, max=${streamTotalStats.maxMs}ms)`);

    // 4.6 Real Windows 1920x1080 Screen Capture Latency (3 fresh samples)
    const screenCaptureService = new ScreenCaptureService();
    const screenCaptureSamples: number[] = [];
    for (let i = 0; i < 3; i++) {
      const t0 = performance.now();
      const cap = await screenCaptureService.captureScreenWithMetadata({ forceFresh: true });
      if (cap.byteLength > 10000 && cap.width >= 100 && cap.height >= 100) {
        screenCaptureSamples.push(performance.now() - t0);
      }
    }
    const screenCaptureStats = computeStats(screenCaptureSamples);
    console.log(`  [BENCH] Real Windows 1920x1080 PNG Screen Capture: median=${screenCaptureStats.medianMs}ms (min=${screenCaptureStats.minMs}ms, max=${screenCaptureStats.maxMs}ms)`);

    // 4.7 Browser Navigation Latency: HTTP_FETCH (5 samples) & CDP_HEADLESS (3 samples)
    const browserHttpSamples: number[] = [];
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      await browserProvider.navigate(browserUrl, { useCdpAdapter: false });
      browserHttpSamples.push(performance.now() - t0);
    }
    const browserHttpStats = computeStats(browserHttpSamples);

    const browserCdpSamples: number[] = [];
    for (let i = 0; i < 3; i++) {
      const t0 = performance.now();
      await browserProvider.navigate(browserUrl, { useCdpAdapter: true });
      browserCdpSamples.push(performance.now() - t0);
    }
    const browserCdpStats = computeStats(browserCdpSamples);
    await browserProvider.close();
    browserServer.close();
    console.log(`  [BENCH] Browser Navigation (HTTP_FETCH): median=${browserHttpStats.medianMs}ms | (CDP_HEADLESS): median=${browserCdpStats.medianMs}ms`);

    // 4.8 Tool Execution Latency (5 samples each: system.get_info, file.write_text, file.read_text)
    const sysInfoSamples: number[] = [];
    const fileWriteSamples: number[] = [];
    const fileReadSamples: number[] = [];
    const benchFilePath = path.join(tmpDir, 'bench_io.txt');
    for (let i = 0; i < 5; i++) {
      let t0 = performance.now();
      await toolService.executeTool({
        id: `bench_sys_${i}`,
        toolId: 'system.get_info',
        toolName: 'System Info',
        arguments: {},
        timestamp: Date.now(),
        requiresUserApproval: false
      });
      sysInfoSamples.push(performance.now() - t0);

      t0 = performance.now();
      await toolService.executeTool({
        id: `bench_write_${i}`,
        toolId: 'file.write_text',
        toolName: 'Write File',
        arguments: { filePath: benchFilePath, content: `Benchmark payload iteration ${i}` },
        timestamp: Date.now(),
        requiresUserApproval: false
      });
      fileWriteSamples.push(performance.now() - t0);

      t0 = performance.now();
      await toolService.executeTool({
        id: `bench_read_${i}`,
        toolId: 'file.read_text',
        toolName: 'Read File',
        arguments: { filePath: benchFilePath },
        timestamp: Date.now(),
        requiresUserApproval: false
      });
      fileReadSamples.push(performance.now() - t0);
    }
    const sysInfoStats = computeStats(sysInfoSamples);
    const fileWriteStats = computeStats(fileWriteSamples);
    const fileReadStats = computeStats(fileReadSamples);

    // 4.9 Memory & Workflow Checkpoint Persistence Latency (5 samples each)
    const benchMemPath = path.join(tmpDir, 'bench_memory.json');
    const benchMemory = new UnifiedMemoryManager(benchMemPath);
    const memWriteSamples: number[] = [];
    const cpWriteSamples: number[] = [];
    for (let i = 0; i < 5; i++) {
      let t0 = performance.now();
      benchMemory.addMemory('WORKING', `Benchmark memory entry #${i}`, ['bench'], 'TRUSTED_SYSTEM');
      memWriteSamples.push(performance.now() - t0);

      t0 = performance.now();
      wfEngine.saveCheckpoint({
        version: 1,
        workflowId: `bench_cp_${i}`,
        goal: 'Benchmark checkpoint write',
        status: 'BLOCKED',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        definitionHash: 'bench_hash',
        stepsCompleted: 0,
        stepsTotal: 0,
        verifiedCount: 0,
        steps: []
      });
      cpWriteSamples.push(performance.now() - t0);
    }
    const memWriteStats = computeStats(memWriteSamples);
    const cpWriteStats = computeStats(cpWriteSamples);

    assert(
      kernelInitStats.medianMs > 0 &&
        cliVersionStats.medianMs > 0 &&
        electronDesktopStats.medianMs > 0 &&
        screenCaptureStats.medianMs > 0,
      'All multi-sample performance benchmarks completed with positive measured timings'
    );

    // Save structured benchmark artifact to docs/audits/evidence/campaign4_benchmarks_2026_10_25.json
    const evidenceDir = path.join(projectRoot, 'docs', 'audits', 'evidence');
    fs.mkdirSync(evidenceDir, { recursive: true });
    const benchmarkReport = {
      generatedAt: new Date().toISOString(),
      environment: {
        os: `${os.platform()} ${os.release()} (${os.arch()})`,
        nodeVersion: process.version,
        cpuModel: os.cpus()[0]?.model || 'Unknown',
        cpuCores: os.cpus().length,
        totalRamGB: Math.round((os.totalmem() / 1024 ** 3) * 10) / 10
      },
      benchmarks: {
        orionCliKernelInProcessInit: { ...kernelInitStats, methodology: 'In-process new OrionCliKernel() instantiation + shutdown (5 samples)' },
        fullCliProcessVersion: { ...cliVersionStats, methodology: 'Full OS child process spawnSync("node", ["bin/orion.js", "--version"]) (5 samples)' },
        fullCliProcessStatusJson: { ...cliFullCmdStats, methodology: 'Full OS child process spawnSync("node", ["bin/orion.js", "/permissions", "--json"]) with TS transpile & kernel init (5 samples)' },
        fullElectronDesktopAppStartupAndExit: { ...electronDesktopStats, methodology: 'Full Electron desktop process ("electron .") startup, IPC registration, BrowserWindow loadFile(dist/index.html), did-finish-load marker, and clean exit (3 samples)' },
        packagedReleaseCandidateStartupAndExit: { medianMs: rcDurationMs, minMs: rcDurationMs, maxMs: rcDurationMs, samples: [rcDurationMs], methodology: 'Packaged release/win-unpacked/ORION.exe full startup, BrowserWindow load, and clean exit' },
        modelStreamingTtftLocalSse: { ...streamTtftStats, methodology: 'OpenAICompatibleAdapter.stream() Time-To-First-Token against local HTTP SSE server (5 samples)' },
        modelStreamingTotalLocalSse: { ...streamTotalStats, methodology: 'OpenAICompatibleAdapter.stream() end-to-end stream completion against local HTTP SSE server (5 samples)' },
        screenCapture1080pPng: { ...screenCaptureStats, methodology: 'ScreenCaptureService.captureScreenWithMetadata({ forceFresh: true }) real 1920x1080 PNG capture on Windows (3 samples)' },
        browserNavigateHttpFetch: { ...browserHttpStats, methodology: 'DefaultBrowserProvider.navigate() in HTTP_FETCH mode against local HTTP server (5 samples)' },
        browserNavigateCdpHeadless: { ...browserCdpStats, methodology: 'DefaultBrowserProvider.navigate() in real Chrome CDP_HEADLESS mode against local HTTP server (3 samples)' },
        toolExecutionSystemGetInfo: { ...sysInfoStats, methodology: 'ToolService.executeTool("system.get_info") (5 samples)' },
        toolExecutionFileWriteText: { ...fileWriteStats, methodology: 'ToolService.executeTool("file.write_text") with post-write verification (5 samples)' },
        toolExecutionFileReadText: { ...fileReadStats, methodology: 'ToolService.executeTool("file.read_text") (5 samples)' },
        unifiedMemoryPersistenceWrite: { ...memWriteStats, methodology: 'UnifiedMemoryManager.addMemory() with synchronous JSON disk flush (5 samples)' },
        workflowCheckpointPersistenceWrite: { ...cpWriteStats, methodology: 'SkillWorkflowEngine.saveCheckpoint() with secret redaction & synchronous JSON disk flush (5 samples)' }
      }
    };
    fs.writeFileSync(
      path.join(evidenceDir, 'campaign4_benchmarks_2026_10_25.json'),
      JSON.stringify(benchmarkReport, null, 2),
      'utf8'
    );
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }

  console.log('\n====================================================================');
  console.log(` CAMPAIGN 4 VALIDATION SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('====================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runCampaign4Validation().catch(err => {
  console.error('Fatal error in Campaign4ReleaseCandidateValidation.test.ts:', err);
  process.exit(1);
});
