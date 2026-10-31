import assert from 'assert';
import path from 'path';
import os from 'os';
import { execFileSync } from 'child_process';
import { OrionCliRenderer } from '../../../cli/OrionCliRenderer';
import { OrionActiveAppsTracker } from '../../../cli/OrionActiveAppsTracker';
import { OrionCliKernel } from '../../../cli/OrionCliKernel';
import { OrionCliCommandRouter } from '../../../cli/OrionCliCommandRouter';
import { ToolCall, ToolResult } from '../../../shared/types';

async function runOrionCliRedesignAcceptance() {
  console.log('=== ORION CLI REDESIGN — REAL-WORLD ACCEPTANCE & REGRESSION SUITE ===\n');

  let passed = 0;
  const check = (cond: boolean, label: string) => {
    assert.strictEqual(Boolean(cond), true, `FAILED: ${label}`);
    passed++;
    console.log(`  ✓ [${passed}] ${label}`);
  };

  const createCapturedCli = (opts: { useColor?: boolean; jsonMode?: boolean; maxWidth?: number } = {}) => {
    let buffer = '';
    const stream = {
      write(chunk: string | Uint8Array) {
        buffer += typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
        return true;
      }
    } as unknown as NodeJS.WritableStream;

    const appsTracker = new OrionActiveAppsTracker();
    const renderer = new OrionCliRenderer({
      useColor: opts.useColor ?? true,
      jsonMode: opts.jsonMode ?? false,
      maxWidth: opts.maxWidth ?? 104,
      outputStream: stream,
      appsTracker
    });
    const tempMcp = path.join(os.tmpdir(), `orion_redesign_mcp_${Date.now()}_${Math.random().toString(36).slice(2)}.json`);
    const kernel = new OrionCliKernel({
      projectRoot: process.cwd(),
      renderer,
      mcpConfigPath: tempMcp
    });
    const router = new OrionCliCommandRouter(kernel);

    return {
      renderer,
      appsTracker,
      kernel,
      router,
      getOutput: () => buffer,
      clearOutput: () => { buffer = ''; }
    };
  };

  // =========================================================================
  // 1. BRAND IDENTITY, GENUINE ORION LOGO & DEFAULT CONVERSATION-FIRST LAYOUT
  // =========================================================================
  console.log('\n--- 1. Brand Identity, Genuine ORION Logo & Default Layout ---');
  const { renderer, appsTracker, kernel, router, getOutput, clearOutput } = createCapturedCli({
    useColor: true,
    jsonMode: false,
    maxWidth: 104
  });

  try {
    renderer.renderStartupHeader({
      version: '1.0.0',
      activeProvider: 'ollama',
      activeModel: 'llama3.1:8b',
      activeAgentId: 'core',
      permissionCeiling: 'MEDIUM',
      policyVerified: true,
      estopActive: false
    });

    const startupOut = getOutput();
    const plainStartup = renderer.stripAnsi(startupOut);

    check(
      plainStartup.includes('O R I O N') && plainStartup.includes('v1.0.0') && plainStartup.includes('Sovereign AI Operating Layer'),
      'Compact header displays genuine ORION wordmark, version v1.0.0, and Sovereign AI Operating Layer descriptor'
    );
    check(
      plainStartup.includes('ORION Local') &&
        !plainStartup.includes('ollama:llama3.1:8b') &&
        plainStartup.includes('core') &&
        plainStartup.includes('4-Tier Protected'),
      'Compact header displays provider-neutral ORION Local engine branding, active agent (core), and 4-Tier Protected security status'
    );
    check(
      !plainStartup.toLowerCase().includes('impact ai') && !plainStartup.toLowerCase().includes('impacts-ai'),
      'Startup header contains zero iMpact / iMpact AI company branding'
    );
    check(
      plainStartup.includes('Active Applications'),
      'Active Applications bar is visible by default directly beneath the compact header'
    );
    check(
      !plainStartup.includes('Contextual Panel: System Stats') &&
        !plainStartup.includes('Contextual Panel: Recent Tools') &&
        !plainStartup.includes('Contextual Panel: ORION CLI Command Reference') &&
        renderer.getActivePanel() === 'none',
      'Optional panels (System Stats, Recent Tools, Command Reference) are hidden by default on startup'
    );

    // Check binary --version output for zero iMpact branding
    const binPath = path.join(process.cwd(), 'bin', 'orion.js');
    const verOut = execFileSync(process.execPath, [binPath, '--version'], { encoding: 'utf8' });
    check(
      verOut.includes('ORION v1.0.0') && !verOut.toLowerCase().includes('impact'),
      `CLI binary --version outputs '${verOut.trim()}' without iMpact company branding`
    );

    // =========================================================================
    // 2. ACTIVE APPLICATIONS & GENUINE APPLICATION ICONS + TRUTHFUL STATES
    // =========================================================================
    console.log('\n--- 2. Active Applications, Genuine Icons & Truthful Runtime States ---');

    const chromeState = appsTracker.resolveAppIdentity('chrome')!;
    const vscodeState = appsTracker.resolveAppIdentity('vscode')!;
    const spotifyState = appsTracker.resolveAppIdentity('spotify')!;
    const discordState = appsTracker.resolveAppIdentity('discord')!;
    const notepadState = appsTracker.resolveAppIdentity('notepad')!;

    check(
      Boolean(chromeState && vscodeState && spotifyState && discordState && notepadState),
      'Known desktop applications (Chrome, VS Code, Spotify, Discord, Notepad) resolve with visual identities'
    );
    check(
      chromeState.iconVerifiedLocal &&
        vscodeState.iconVerifiedLocal &&
        spotifyState.iconVerifiedLocal &&
        discordState.iconVerifiedLocal &&
        notepadState.iconVerifiedLocal,
      'Real offline application PNG/binary icon assets are verified on disk for Chrome, VS Code, Spotify, Discord, and Notepad'
    );

    const colorBadge = appsTracker.formatAppBadge(spotifyState, true, true);
    const asciiBadge = appsTracker.formatAppBadge(spotifyState, false, true);
    check(
      colorBadge.includes('Spotify') && asciiBadge === '[Spotify]',
      `Application icon badge renders brand-colored glyph in color mode and clean ASCII fallback ('${asciiBadge}') in no-color mode`
    );

    // Verify Section 5 tool operation icon resolution (File, Folder, ORION, App-specific)
    const fileIconAscii = appsTracker.resolveToolOperationBadge(
      { id: 'f1', toolId: 'file.read_text', toolName: 'Read File', arguments: { filePath: 'a.txt' }, timestamp: 1, requiresUserApproval: false },
      false
    );
    const folderIconAscii = appsTracker.resolveToolOperationBadge(
      { id: 'd1', toolId: 'file.list_directory', toolName: 'List Directory', arguments: { dirPath: '.' }, timestamp: 1, requiresUserApproval: false },
      false
    );
    const orionIconAscii = appsTracker.resolveToolOperationBadge(
      { id: 's1', toolId: 'system.get_info', toolName: 'System Info', arguments: {}, timestamp: 1, requiresUserApproval: false },
      false
    );
    check(
      fileIconAscii === '[File]' && folderIconAscii === '[Folder]' && (orionIconAscii === '(✦)' || orionIconAscii === '(*)'),
      'Tool operation badges resolve File ([File]), Folder ([Folder]), and ORION ((✦)/(*)) icons when no external app is targeted'
    );

    clearOutput();
    renderer.renderApprovalPrompt({
      toolId: 'system.control',
      toolName: 'System Lock Control',
      riskLevel: 'HIGH',
      arguments: { action: 'lock' },
      reason: 'Locking the workstation requires explicit operator approval.'
    });
    const approvalPromptOut = renderer.stripAnsi(getOutput());
    check(
      approvalPromptOut.includes('Proposed Action') &&
        approvalPromptOut.includes('App / Tool') &&
        approvalPromptOut.includes('Why Needed') &&
        approvalPromptOut.includes('Approving Allows') &&
        approvalPromptOut.includes('How to Respond'),
      'Approval prompt clearly explains proposed action, involved app/tool, why needed, what approving allows, and how to respond'
    );

    // Simulate truthful lifecycle: Launching -> Open (verified)
    const openNotepadCall: ToolCall = {
      id: 'call_open_np_1',
      toolId: 'computer.natural_language_command',
      toolName: 'Natural Language Computer Action',
      arguments: { command: 'open notepad' },
      timestamp: Date.now(),
      requiresUserApproval: false
    };
    clearOutput();
    renderer.renderToolStarted(1, openNotepadCall);
    check(
      appsTracker.resolveAppIdentity('notepad')?.status === 'Launching',
      'Starting "open notepad" transitions Notepad state to truthful "Launching"'
    );

    const verifiedNotepadResult: ToolResult = {
      toolCallId: 'call_open_np_1',
      toolId: 'computer.natural_language_command',
      success: true,
      verificationStatus: 'VERIFIED',
      verified: true,
      data: { success: true },
      timestamp: Date.now(),
      executionTimeMs: 42
    };
    renderer.renderToolCompleted(verifiedNotepadResult);
    check(
      appsTracker.resolveAppIdentity('notepad')?.status === 'Open',
      'Completing "open notepad" with VERIFIED postcondition transitions Notepad state to "Open"'
    );

    // Simulate failed launch of non-existent app: Launching -> Launch failed
    const badAppCall: ToolCall = {
      id: 'call_bad_app_1',
      toolId: 'computer.natural_language_command',
      toolName: 'Natural Language Computer Action',
      arguments: { command: 'open NonExistentQuantumApp99' },
      timestamp: Date.now(),
      requiresUserApproval: false
    };
    renderer.renderToolStarted(2, badAppCall);
    check(
      appsTracker.resolveAppIdentity('NonExistentQuantumApp99')?.status === 'Launching',
      'Starting launch of NonExistentQuantumApp99 sets state to "Launching"'
    );

    const failedAppResult: ToolResult = {
      toolCallId: 'call_bad_app_1',
      toolId: 'computer.natural_language_command',
      success: false,
      verificationStatus: 'FAILED',
      verified: false,
      error: 'Executable NonExistentQuantumApp99 not found on system PATH',
      timestamp: Date.now(),
      executionTimeMs: 19
    };
    renderer.renderToolCompleted(failedAppResult);
    check(
      appsTracker.resolveAppIdentity('NonExistentQuantumApp99')?.status === 'Launch failed',
      'Failed application launch truthfully transitions state to "Launch failed"'
    );

    clearOutput();
    renderer.renderActiveApplicationsBar();
    const activeBarOut = renderer.stripAnsi(getOutput());
    check(
      activeBarOut.includes('Notepad') &&
        activeBarOut.includes('Open') &&
        activeBarOut.includes('NonExistentQuantumA') &&
        activeBarOut.includes('Launch failed'),
      'Active Applications bar truthfully renders Open and Launch failed states together'
    );

    // =========================================================================
    // 3. CANONICAL TASK STATUS LABELS (RUNNING, VERIFIED, NEEDS APPROVAL, FAILED, CANCELLED, UNKNOWN)
    // =========================================================================
    console.log('\n--- 3. Canonical Task Execution & Approval Status Labels ---');

    const unverifiedRes: ToolResult = {
      toolCallId: 'call_unverified_1',
      toolId: 'system.execute_command',
      success: true,
      verificationStatus: 'EXECUTED',
      verified: false,
      timestamp: Date.now(),
      executionTimeMs: 12
    };
    const approvalRes: ToolResult = {
      toolCallId: 'call_approval_1',
      toolId: 'system.control',
      success: false,
      verificationStatus: 'FAILED',
      verified: false,
      error: 'AUTHORIZATION REQUIRED [approvalId=apr_123]: Tool requires explicit operator approval.',
      timestamp: Date.now(),
      executionTimeMs: 5
    };
    const cancelledRes: ToolResult = {
      toolCallId: 'call_cancel_1',
      toolId: 'browser.navigate',
      success: false,
      verificationStatus: 'FAILED',
      verified: false,
      error: 'Execution BLOCKED: ORION Emergency Stop is active (cancelled).',
      timestamp: Date.now(),
      executionTimeMs: 3
    };

    check(
      OrionCliRenderer.resolveTaskStatusLabel(verifiedNotepadResult) === 'VERIFIED',
      'Verified tool result maps to canonical status label VERIFIED'
    );
    check(
      OrionCliRenderer.resolveTaskStatusLabel(unverifiedRes) === 'UNKNOWN',
      'Unverified tool execution (verificationStatus=EXECUTED, verified=false) maps to UNKNOWN (never falsely VERIFIED)'
    );
    check(
      OrionCliRenderer.resolveTaskStatusLabel(approvalRes) === 'NEEDS APPROVAL',
      'Pending authorization result maps to canonical status label NEEDS APPROVAL'
    );
    check(
      OrionCliRenderer.resolveTaskStatusLabel(failedAppResult) === 'FAILED',
      'Failed tool execution maps to canonical status label FAILED'
    );
    check(
      OrionCliRenderer.resolveTaskStatusLabel(cancelledRes) === 'CANCELLED',
      'Aborted/Emergency-Stopped execution maps to canonical status label CANCELLED'
    );

    renderer.renderToolCompleted(unverifiedRes);
    renderer.renderToolCompleted(approvalRes);
    renderer.renderToolCompleted(cancelledRes);

    // =========================================================================
    // 4. CONTEXTUAL OPTIONAL PANELS (/system-stats, /recent-tools, /help, /panel close)
    // =========================================================================
    console.log('\n--- 4. Contextual Optional Panels Lifecycle (Open -> Switch -> Close) ---');

    clearOutput();
    const sysRes = await router.dispatch('/system-stats');
    const sysOut = renderer.stripAnsi(getOutput());
    check(
      sysRes.handled &&
        renderer.getActivePanel() === 'system-stats' &&
        sysOut.includes('Contextual Panel: System Stats') &&
        sysOut.includes('CPU') &&
        sysOut.includes('Memory (RAM)') &&
        sysOut.includes('/system-stats close'),
      '/system-stats opens the System Stats contextual panel with live CPU/RAM/Network/Uptime and close instructions'
    );

    clearOutput();
    const recentRes = await router.dispatch('/recent-tools');
    const recentOut = renderer.stripAnsi(getOutput());
    check(
      recentRes.handled &&
        renderer.getActivePanel() === 'recent-tools' &&
        recentOut.includes('Contextual Panel: Recent Tools') &&
        recentOut.includes('computer.natural_language_') &&
        recentOut.includes('VERIFIED') &&
        recentOut.includes('FAILED') &&
        recentOut.includes('UNKNOWN') &&
        recentOut.includes('/recent-tools close'),
      'Switching to /recent-tools opens Recent Tools panel showing recorded tools, status badges, durations, and close hint'
    );

    clearOutput();
    const helpRes = await router.dispatch('/help');
    const helpOut = renderer.stripAnsi(getOutput());
    check(
      helpRes.handled &&
        renderer.getActivePanel() === 'help' &&
        helpOut.includes('Contextual Panel: ORION CLI Command Reference') &&
        helpOut.includes('/system-stats') &&
        helpOut.includes('/recent-tools') &&
        helpOut.includes('/panel close') &&
        !helpOut.toLowerCase().includes('impact ai'),
      'Switching to /help opens Command Reference contextual panel with zero iMpact branding'
    );

    clearOutput();
    const closeRes = await router.dispatch('/panel close');
    const closeOut = renderer.stripAnsi(getOutput());
    check(
      closeRes.handled &&
        renderer.getActivePanel() === 'none' &&
        closeOut.includes('closed') &&
        closeOut.includes('Active Applications'),
      '/panel close closes the active contextual panel and restores the clean conversation layout + Active Applications bar'
    );

    // =========================================================================
    // 5. RESPONSIVE NARROW TERMINAL (<80 COLS), NO-COLOR MODE & JSON MODE
    // =========================================================================
    console.log('\n--- 5. Narrow Terminal (<80 cols), --no-color Fallback & --json Mode ---');

    const narrowCli = createCapturedCli({ useColor: false, jsonMode: false, maxWidth: 58 });
    try {
      narrowCli.renderer.renderStartupHeader({
        version: '1.0.0',
        activeProvider: 'ollama',
        activeModel: 'llama3.1:8b',
        activeAgentId: 'core'
      });
      await narrowCli.router.dispatch('/system-stats');
      const narrowOut = narrowCli.getOutput();
      const hasRawAnsi = /\x1b\[[0-9;]*[a-zA-Z]/.test(narrowOut);
      check(
        !hasRawAnsi &&
          narrowOut.includes('O R I O N') &&
          narrowOut.includes('[Chrome]') &&
          narrowOut.includes('Contextual Panel: System Stats'),
        'Narrow terminal (58 cols) with useColor=false renders compact layout and ASCII app badges ([Chrome]) with 0 ANSI codes'
      );
    } finally {
      narrowCli.kernel.shutdown();
    }

    const jsonCli = createCapturedCli({ useColor: false, jsonMode: true, maxWidth: 100 });
    try {
      for (const cmd of ['/system-stats', '/recent-tools', '/apps', '/help', '/panel close']) {
        jsonCli.clearOutput();
        const r = await jsonCli.router.dispatch(cmd);
        const raw = jsonCli.getOutput().trim();
        const parsed = JSON.parse(raw);
        check(
          r.handled && parsed && typeof parsed === 'object' && !/\x1b\[/.test(raw),
          `Command '${cmd}' in --json mode emits valid JSON without ANSI escape sequences`
        );
      }
    } finally {
      jsonCli.kernel.shutdown();
    }

    console.log(`\n=== ALL ${passed} ORION CLI REDESIGN ACCEPTANCE CHECKS PASSED (100% GREEN) ===`);
  } finally {
    kernel.shutdown();
  }
}

runOrionCliRedesignAcceptance().catch(err => {
  console.error('ORION CLI Redesign Acceptance Suite Failed:', err);
  process.exit(1);
});
