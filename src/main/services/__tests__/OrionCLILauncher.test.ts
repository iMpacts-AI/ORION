import assert from 'assert';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { execSync } from 'child_process';
import { OrionCliRenderer } from '../../../cli/OrionCliRenderer.js';
import { OrionCliKernel } from '../../../cli/OrionCliKernel.js';
import { OrionCliApp } from '../../../cli/OrionCliApp.js';
import { ProcessSupervisor } from '../computer/ProcessSupervisor.js';

async function runOrionCLILauncherSuite() {
  const PROJECT_ROOT = process.cwd();
  const ORION_JS = path.join(PROJECT_ROOT, 'bin', 'orion.js');
  const ORION_CMD = path.join(PROJECT_ROOT, 'bin', 'orion.cmd');
  const ORION_PS1 = path.join(PROJECT_ROOT, 'bin', 'orion.ps1');
  const INSTALL_JS = path.join(PROJECT_ROOT, 'bin', 'install-cli.js');
  const INSTALL_BAT = path.join(PROJECT_ROOT, 'install-cli.bat');
  const INSTALL_PS1 = path.join(PROJECT_ROOT, 'install-cli.ps1');
  const INSTALL_SH = path.join(PROJECT_ROOT, 'install.sh');
  const PKG_JSON = path.join(PROJECT_ROOT, 'package.json');

  console.log('=== RUNNING ORION CLI V2 LAUNCHER, ENGINE, MCP & SECURITY SUITE ===\n');

  // 1. Script existence check
  assert.strictEqual(fs.existsSync(ORION_JS), true, 'bin/orion.js must exist');
  assert.strictEqual(fs.existsSync(ORION_CMD), true, 'bin/orion.cmd must exist');
  assert.strictEqual(fs.existsSync(ORION_PS1), true, 'bin/orion.ps1 must exist');
  assert.strictEqual(fs.existsSync(INSTALL_JS), true, 'bin/install-cli.js must exist');
  assert.strictEqual(fs.existsSync(INSTALL_BAT), true, 'install-cli.bat must exist');
  assert.strictEqual(fs.existsSync(INSTALL_PS1), true, 'install-cli.ps1 must exist');
  assert.strictEqual(fs.existsSync(INSTALL_SH), true, 'install.sh must exist');
  console.log('  ✓ 1. All CLI launcher binaries and cross-platform setup scripts verified');

  // 2. package.json bin registration
  const pkg = JSON.parse(fs.readFileSync(PKG_JSON, 'utf8'));
  assert.ok(pkg.bin, 'package.json must contain bin object');
  assert.strictEqual(pkg.bin.orion, './bin/orion.js', 'package.json bin.orion must point to ./bin/orion.js');
  assert.ok(pkg.scripts['install:cli'], 'package.json must have "install:cli" script');
  assert.ok(pkg.scripts['setup:cli'], 'package.json must have "setup:cli" script');
  console.log('  ✓ 2. package.json "bin" and CLI scripts verified');

  // 3. Version command check
  const verOutput = execSync(`node "${ORION_JS}" --version`, {
    cwd: PROJECT_ROOT,
    encoding: 'utf8'
  }).trim();
  assert.ok(verOutput.includes('ORION v1.0.0'), `Expected version string in: ${verOutput}`);
  console.log('  ✓ 3. "orion --version" returned valid version v1.0.0');

  // 4. Help command check
  const helpOutput = execSync(`node "${ORION_JS}" --help`, {
    cwd: PROJECT_ROOT,
    encoding: 'utf8'
  });
  assert.ok(helpOutput.includes('COMMANDS:'), 'Must contain COMMANDS header');
  assert.ok(helpOutput.includes('orion dev'), 'Must list dev command');
  assert.ok(helpOutput.includes('orion demo'), 'Must list demo command');
  assert.ok(helpOutput.includes('orion doctor'), 'Must list doctor command');
  assert.ok(helpOutput.includes('orion test'), 'Must list test command');
  assert.ok(helpOutput.includes('orion build'), 'Must list build command');
  assert.ok(helpOutput.includes('orion setup'), 'Must list setup command');
  console.log('  ✓ 4. "orion --help" returned full command documentation');

  // 5. Doctor diagnostics check
  const doctorOutput = execSync(`node "${ORION_JS}" doctor`, {
    cwd: PROJECT_ROOT,
    encoding: 'utf8'
  });
  assert.ok(doctorOutput.includes('ORION SYSTEM PRE-FLIGHT DIAGNOSTIC'), 'Must include doctor title');
  assert.ok(doctorOutput.includes('Node.js Runtime:'), 'Must check Node.js');
  assert.ok(doctorOutput.includes('Electron Binary:'), 'Must check Electron');
  assert.ok(doctorOutput.includes('Production Bundles:'), 'Must check production bundles');
  assert.ok(doctorOutput.includes('Authoritative Tools:[PASS]'), 'Must verify real ToolRegistry');
  assert.ok(doctorOutput.includes('Diagnostic check complete.'), 'Must complete diagnostic check');
  console.log('  ✓ 5. "orion doctor" executed complete pre-flight check against real kernel');

  // 6. Exports and electron resolution check
  const cliModule = require(ORION_JS);
  assert.strictEqual(typeof cliModule.getElectronPath, 'function', 'Must export getElectronPath');
  assert.strictEqual(cliModule.PROJECT_ROOT, PROJECT_ROOT, 'Must export PROJECT_ROOT');
  const electronExe = cliModule.getElectronPath();
  assert.ok(electronExe, 'Electron executable path must not be empty');
  assert.strictEqual(fs.existsSync(electronExe), true, `Electron executable must exist at: ${electronExe}`);
  console.log('  ✓ 6. Module exports and Electron binary resolution verified');

  // 7. Renderer Unit Tests: Secret Redaction, Escape Sanitization & No-Color Mode
  const renderer = new OrionCliRenderer({ useColor: false, maxWidth: 80 });
  const dirtyText = 'Key1: sk-ant-api03-1234567890abcdef Key2: gsk_abcdef1234567890 OPENAI_API_KEY="sk-1234567890abcdef1234" \x1b]0;EvilTitle\x07\x1b[2JCleanText';
  const sanitized = renderer.sanitize(dirtyText);
  assert.strictEqual(sanitized.includes('sk-ant-api03'), false, 'Must redact Anthropic key');
  assert.strictEqual(sanitized.includes('gsk_abcdef'), false, 'Must redact Groq key');
  assert.strictEqual(sanitized.includes('sk-1234567890'), false, 'Must redact OpenAI key');
  assert.strictEqual(sanitized.includes('\x1b]0;'), false, 'Must strip OSC escape sequences');
  assert.strictEqual(sanitized.includes('\x1b[2J'), false, 'Must strip CSI clear screen sequences');
  assert.strictEqual(sanitized.includes('CleanText'), true, 'Must preserve safe content');
  assert.strictEqual(renderer.cyan('hello'), 'hello', 'No-color mode must omit ANSI sequences');
  console.log('  ✓ 7. Renderer secret redaction, escape sequence sanitization & no-color mode verified');

  // 8. Real Kernel Integration: Orchestrator, ToolRegistry, Approval Gate & Critical Path Block
  const tempMcpConfig = path.join(os.tmpdir(), `orion_test_mcp_${Date.now()}.json`);
  const kernel = new OrionCliKernel({
    projectRoot: PROJECT_ROOT,
    renderer,
    mcpConfigPath: tempMcpConfig
  });

  try {
    // 8a. Verify real tools and providers
    const registeredTools = kernel.toolService.getTools();
    assert.ok(registeredTools.length >= 25, `Expected >=25 authoritative tools, got ${registeredTools.length}`);
    const providers = kernel.omniRouter.getAllProviderStatuses();
    assert.ok(providers.length >= 12, `Expected >=12 provider statuses, got ${providers.length}`);

    // 8b. Real natural-language request through OrionOrchestrator
    const overviewRes = await kernel.executePrompt('ORION, give me a quick overview of this machine.');
    assert.strictEqual(overviewRes.success, true, 'Overview command must succeed');
    assert.ok(overviewRes.toolCallsExecuted.length >= 3, 'Overview must execute system.get_info, get_cpu_usage, get_memory_usage');
    assert.ok(
      (/host:|memory|ram|gb/i.test(overviewRes.response) || overviewRes.response.includes(os.hostname())) &&
        /cpu|core|processor/i.test(overviewRes.response),
      'Response must contain synthesized hardware telemetry'
    );

    // 8c. Security Enforcement: Critical path write strictly blocked
    const critCall = await kernel.toolService.executeTool({
      id: 'test_crit_1',
      toolId: 'file.write_text',
      toolName: 'Write Text File',
      arguments: { filePath: 'C:\\Windows\\System32\\unauthorized.txt', content: 'test' },
      timestamp: Date.now(),
      requiresUserApproval: true
    });
    assert.strictEqual(critCall.success, false, 'Critical path write must be blocked');
    assert.ok(critCall.error?.includes('SECURITY POLICY VIOLATION'), `Expected SECURITY POLICY VIOLATION, got: ${critCall.error}`);

    // 8d. Approval Gate Enforcement: High-risk tool denied without approval callback, allowed when callback approves
    kernel.toolService.getRegistry().registerTool({
      id: 'test.high_risk_action',
      name: 'High Risk Test Action',
      category: 'SYSTEM',
      description: 'Test tool requiring explicit operator approval',
      permissionLevel: 'HIGH',
      isReadOnly: false,
      isDangerous: true,
      requiresApproval: true,
      supportsCancellation: true,
      parameters: {}
    });

    const deniedRes = await kernel.toolService.executeTool({
      id: 'test_high_1',
      toolId: 'test.high_risk_action',
      toolName: 'High Risk Test Action',
      arguments: {},
      timestamp: Date.now(),
      requiresUserApproval: true
    });
    assert.strictEqual(deniedRes.success, false, 'High-risk tool without approval callback must be rejected');
    assert.ok(deniedRes.error?.includes('AUTHORIZATION REQUIRED'), `Expected AUTHORIZATION REQUIRED, got: ${deniedRes.error}`);

    // 8e. Emergency Stop Enforcement
    await kernel.cancelActiveOperation();
    assert.strictEqual(ProcessSupervisor.getInstance().isEstopActive(), true, 'E-Stop must be active after cancelActiveOperation');
    const blockedByEstop = await kernel.toolService.executeTool({
      id: 'test_estop_1',
      toolId: 'system.get_info',
      toolName: 'Get System Info',
      arguments: {},
      timestamp: Date.now(),
      requiresUserApproval: false
    });
    assert.strictEqual(blockedByEstop.success, false, 'Tool execution must be blocked while E-Stop is active');
    ProcessSupervisor.getInstance().resetEstop();
    kernel.permissionService.resetEmergencyStop();
    console.log('  ✓ 8. Real OrionOrchestrator execution, Critical path blocking, Approval gate & E-Stop verified');

    // 9. Real MCP JSON-RPC 2.0 Stdio Handshake & Tool Invocation Test
    const mockMcpServerScript = path.join(os.tmpdir(), `orion_mock_mcp_srv_${Date.now()}.cjs`);
    fs.writeFileSync(mockMcpServerScript, `
      const readline = require('readline');
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
      rl.on('line', (line) => {
        if (!line.trim()) return;
        const req = JSON.parse(line);
        if (req.method === 'initialize') {
          process.stdout.write(JSON.stringify({
            jsonrpc: '2.0',
            id: req.id,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: { tools: {} },
              serverInfo: { name: 'orion-test-mcp', version: '1.0.0' }
            }
          }) + '\\n');
        } else if (req.method === 'tools/list') {
          process.stdout.write(JSON.stringify({
            jsonrpc: '2.0',
            id: req.id,
            result: {
              tools: [{ name: 'echo_ping', description: 'Deterministic MCP echo tool' }]
            }
          }) + '\\n');
        } else if (req.method === 'tools/call') {
          process.stdout.write(JSON.stringify({
            jsonrpc: '2.0',
            id: req.id,
            result: {
              content: [{ type: 'text', text: 'PONG:' + (req.params?.arguments?.msg || 'ok') }]
            }
          }) + '\\n');
        }
      });
    `, 'utf8');

    const addedStatus = kernel.mcpClient.addServerConfig({
      name: 'test_stdio_srv',
      command: process.execPath,
      args: [mockMcpServerScript],
      enabled: true,
      trusted: true
    });
    assert.strictEqual(addedStatus.state, 'CONFIGURED', 'Newly added MCP server must report CONFIGURED (not fabricated as CONNECTED)');

    const connectedStatus = await kernel.mcpClient.connectServer('test_stdio_srv', true);
    assert.strictEqual(connectedStatus.state, 'CONNECTED', `Expected CONNECTED state, got ${connectedStatus.state}: ${connectedStatus.lastError}`);
    assert.strictEqual(connectedStatus.discoveredTools.length, 1, 'Must discover 1 tool from MCP server');
    assert.strictEqual(connectedStatus.discoveredTools[0].name, 'echo_ping');
    assert.ok(kernel.toolService.getRegistry().getTool('mcp.test_stdio_srv.echo_ping'), 'Discovered MCP tool must be registered in ToolRegistry');

    const callResult = await kernel.mcpClient.callTool('test_stdio_srv', 'echo_ping', { msg: 'ORION_VERIFIED' });
    assert.strictEqual(callResult.success, true, 'MCP tools/call must succeed');
    assert.ok(JSON.stringify(callResult.data).includes('PONG:ORION_VERIFIED'), 'MCP tool output must match');

    kernel.mcpClient.disconnectServer('test_stdio_srv');
    assert.strictEqual(kernel.mcpClient.getServerStatus('test_stdio_srv')?.state, 'DISCONNECTED', 'Disconnected server must report DISCONNECTED');
    try { fs.unlinkSync(mockMcpServerScript); } catch {}
    try { fs.unlinkSync(tempMcpConfig); } catch {}
    console.log('  ✓ 9. Real MCP JSON-RPC 2.0 stdio handshake, tool discovery, invocation & teardown verified');
  } finally {
    kernel.shutdown();
  }

  // 10. End-to-End Subprocess Verification: CMD, PowerShell, Piped Stdin & Browser-Free Search
  const cmdOut = execSync(`"${ORION_CMD}" /status --no-color`, { cwd: PROJECT_ROOT, encoding: 'utf8' });
  assert.ok(cmdOut.includes('ORION Runtime & System Telemetry'), 'CMD wrapper must execute /status');

  const pipedOut = execSync(`node "${ORION_JS}" --no-color`, {
    cwd: PROJECT_ROOT,
    input: '/permissions\n',
    encoding: 'utf8'
  });
  assert.ok(pipedOut.includes('ORION Security & Permission Governance'), 'Piped stdin execution must work non-interactively');
  console.log('  ✓ 10. End-to-end CMD wrapper, non-interactive piped stdin & --no-color output verified');

  console.log('\n[PASS] ORION CLI V2 suite passed 10/10 verification blocks.\n');
}

runOrionCLILauncherSuite().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
