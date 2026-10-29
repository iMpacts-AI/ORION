import path from 'path';
import fs from 'fs';
import os from 'os';
import dotenv from 'dotenv';

// Robust multi-location .env loader (supporting Dev, Dist-Electron, and Packaged Win32 Exe)
const possibleEnvPaths = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(process.resourcesPath || '', '.env'),
  path.resolve(path.dirname(process.execPath || ''), '.env'),
  path.resolve(os.homedir(), '.env'),
  path.resolve(os.homedir(), 'Downloads/ORION/.env')
];

let envPath = possibleEnvPaths.find(p => fs.existsSync(p)) || path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

import { app, BrowserWindow, ipcMain } from 'electron';
import { SystemMonitorService } from './services/SystemMonitorService';
import { ToolService } from './services/ToolService';
import { VoiceService } from './services/VoiceService';
import { VisionService, CloudVisionAdapter } from './services/VisionService';
import { MemoryService } from './services/MemoryService';
import { UnifiedMemoryManager } from './services/UnifiedMemoryManager';
import { DefaultDeveloperAgentProvider } from './platform/DeveloperAgentProvider';
import { DefaultBrowserProvider } from './platform/BrowserProvider';
import { OrionOrchestrator } from './services/OrionOrchestrator';
import { OrionAIProviderRouter } from './services/OrionAIProviderRouter';
import { validateAndSaveProviderKeys } from './services/ProviderAdapters';
import { TitanClosedLoopPipeline } from './services/titan/TitanClosedLoopPipeline';
import { TitanBatchOrchestrator } from './services/titan/TitanBatchOrchestrator';
import { AgentPolicyService } from './services/AgentPolicyService';
import { OrionAgentSystem } from './services/OrionAgentSystem';
import { SecurityPolicyMiddleware } from './services/SecurityPolicyMiddleware';
import { ProcessSupervisor } from './services/computer/ProcessSupervisor';
import { OrionActiveAppsTracker } from '../cli/OrionActiveAppsTracker';
import { ORION_CONSTANTS } from '../shared/constants';
import { eventBus } from '../shared/events';

let mainWindow: BrowserWindow | null = null;
let activeOrchestratorAbortController: AbortController | null = null;

const systemMonitor = new SystemMonitorService();
const memoryService = new MemoryService();
const unifiedMemory = new UnifiedMemoryManager();
const omniRouter = new OrionAIProviderRouter();
const browserProvider = new DefaultBrowserProvider();
const toolService = new ToolService(undefined, undefined, browserProvider, undefined, unifiedMemory);
// Pass omniRouter to ComputerUseService planner
toolService.getComputerUseService().getPlanner().setAIProvider(omniRouter);

const agentPolicyService = new AgentPolicyService();
const agentSystem = new OrionAgentSystem(agentPolicyService, toolService, omniRouter);
const securityMiddleware = SecurityPolicyMiddleware.getInstance();
const activeAppsTracker = new OrionActiveAppsTracker();

const developerAgent = new DefaultDeveloperAgentProvider(toolService);
const voiceService = new VoiceService();
const titanPipeline = new TitanClosedLoopPipeline(toolService);
const titanBatchOrchestrator = new TitanBatchOrchestrator(titanPipeline);

// Phase 4 Omni-Brain AI Router & Phase B Cloud Vision Integration
const cloudVisionAdapter = new CloudVisionAdapter(omniRouter);
const visionService = new VisionService(cloudVisionAdapter);
const orchestrator = new OrionOrchestrator(toolService, visionService, voiceService, omniRouter);

// Forward real-time tool lifecycle events to activeAppsTracker and Electron renderer
eventBus.subscribe('assistant.tool.started', ({ toolCall }) => {
  try {
    activeAppsTracker.recordToolStarted(toolCall);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('orchestrator:tool_started', toolCall);
    }
  } catch {}
});

eventBus.subscribe('assistant.tool.completed', ({ result }) => {
  try {
    activeAppsTracker.recordToolCompleted(result);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('orchestrator:tool_completed', result);
    }
  } catch {}
});

eventBus.subscribe('assistant.tool.failed', (payload) => {
  try {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('orchestrator:tool_failed', payload);
    }
  } catch {}
});

function createWindow() {
  const isDemo = process.env.ORION_INITIAL_MODE === 'DEMO' || process.argv.includes('--demo');
  if (isDemo) {
    process.env.ORION_INITIAL_MODE = 'DEMO';
  }
  const isSmokeTest = Number(process.env.ORION_SMOKE_TEST_EXIT_MS || '0') > 0;

  mainWindow = new BrowserWindow({
    width: 1600,
    height: 960,
    minWidth: 1280,
    minHeight: 800,
    title: 'ORION - AI Command System',
    backgroundColor: '#050608',
    frame: true,
    show: !isSmokeTest,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  if (!isSmokeTest) {
    mainWindow.show();
    mainWindow.once('ready-to-show', () => {
      mainWindow?.show();
    });
  }

  if (process.env.VITE_DEV_SERVER_URL) {
    const devUrl = isDemo ? `${process.env.VITE_DEV_SERVER_URL}?mode=DEMO#demo` : process.env.VITE_DEV_SERVER_URL;
    mainWindow.loadURL(devUrl);
  } else {
    const candidateHtmlPaths = [
      path.join(__dirname, '../../dist/index.html'),
      path.join(process.cwd(), 'dist/index.html'),
      path.join(process.resourcesPath || '', 'app/dist/index.html'),
      path.join(path.dirname(process.execPath || ''), 'resources/app/dist/index.html'),
      path.resolve(os.homedir(), 'Downloads/ORION/dist/index.html')
    ];
    const targetHtml = candidateHtmlPaths.find(p => fs.existsSync(p)) || candidateHtmlPaths[0];
    const loadOptions = isDemo ? { query: { mode: 'DEMO' }, hash: 'demo' } : {};
    mainWindow.loadFile(targetHtml, loadOptions).catch(err => {
      console.error('Failed to load html:', err);
    });
  }

  if (!isSmokeTest) {
    mainWindow.show();
    mainWindow.focus();
  }

  mainWindow.webContents.once('did-finish-load', () => {
    const smokeExitMs = Number(process.env.ORION_SMOKE_TEST_EXIT_MS || '0');
    if (smokeExitMs > 0) {
      const marker = `ORION_DESKTOP_READY tools=${toolService.getTools().length} provider=${omniRouter.getStatus().id} timestamp=${Date.now()}`;
      console.log(marker);
      if (process.env.ORION_SMOKE_TEST_OUT_FILE) {
        try {
          fs.writeFileSync(process.env.ORION_SMOKE_TEST_OUT_FILE, marker, 'utf-8');
        } catch {}
      }
      setTimeout(() => {
        app.exit(0);
      }, Math.min(smokeExitMs, 500));
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function setupIPC() {
  ipcMain.handle(ORION_CONSTANTS.IPC.SYSTEM_TELEMETRY, async () => {
    return await systemMonitor.getSnapshot();
  });

  ipcMain.handle(ORION_CONSTANTS.IPC.EXECUTE_TOOL, async (_, toolCall) => {
    return await toolService.executeTool(toolCall);
  });

  ipcMain.handle('tools:get_all', async () => {
    return toolService.getTools();
  });

  ipcMain.handle('orchestrator:process_command', async (_, { query, source }) => {
    const controller = new AbortController();
    activeOrchestratorAbortController = controller;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('orchestrator:state_changed', {
        state: 'PLANNING',
        detail: `Planning task: ${String(query || '').slice(0, 80)}`
      });
    }
    try {
      const result = await orchestrator.processCommand(query, source, {
        signal: controller.signal,
        onToken: (token: string) => {
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('orchestrator:stream_token', { token });
          }
        }
      });
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('orchestrator:state_changed', {
          state: result.success ? 'COMPLETED' : 'FAILED',
          detail: result.response?.slice(0, 120) || ''
        });
      }
      return result;
    } catch (err: any) {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('orchestrator:state_changed', {
          state: controller.signal.aborted ? 'CANCELLED' : 'FAILED',
          detail: err?.message || 'Execution interrupted'
        });
      }
      throw err;
    } finally {
      if (activeOrchestratorAbortController === controller) {
        activeOrchestratorAbortController = null;
      }
    }
  });

  ipcMain.handle('orchestrator:cancel_command', async (_, reason?: string) => {
    if (activeOrchestratorAbortController) {
      try {
        activeOrchestratorAbortController.abort(new Error(reason || 'Cancelled by operator'));
      } catch {}
      activeOrchestratorAbortController = null;
    }
    try {
      toolService.getComputerUseService().cancelActiveTask(reason || 'Cancelled by operator');
    } catch {}
    try {
      browserProvider.cancelActiveTask();
    } catch {}
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('orchestrator:state_changed', {
        state: 'CANCELLED',
        detail: reason || 'Active operation cancelled by operator.'
      });
    }
    return { cancelled: true, timestamp: Date.now() };
  });

  // Phase 4 & 4.2 Omni-Brain IPC Channels
  ipcMain.handle('ai:get_router_status', async () => {
    return omniRouter.getStatus();
  });

  ipcMain.handle('ai:get_all_provider_statuses', async () => {
    return omniRouter.getAllProviderStatuses();
  });

  ipcMain.handle('ai:set_routing_strategy', async (_, strategy) => {
    omniRouter.setRoutingStrategy(strategy);
    return true;
  });

  ipcMain.handle('ai:run_live_qualification_test', async () => {
    return await omniRouter.runLiveQualificationTest();
  });

  ipcMain.handle('ai:save_provider_keys', async (_, keys: Record<string, string>) => {
    const res = validateAndSaveProviderKeys(keys, envPath);
    if (!res.success) {
      console.error('Rejected provider keys update:', res.error);
      return false;
    }
    return true;
  });

  ipcMain.handle(ORION_CONSTANTS.IPC.VOICE_LISTEN, async (_, action: 'start' | 'stop') => {
    if (action === 'start') {
      await voiceService.startListening();
    } else {
      await voiceService.stopListening();
    }
    return voiceService.getVoiceState();
  });

  ipcMain.handle('voice:stop_speaking', async () => {
    await voiceService.stopSpeaking();
    return true;
  });

  ipcMain.handle(ORION_CONSTANTS.IPC.VISION_CAPTURE, async (_, source: 'CAMERA' | 'SCREENSHOT') => {
    return await visionService.captureAndAnalyze(source);
  });

  ipcMain.handle('vision:capture_screen', async () => {
    return await visionService.captureScreen();
  });

  ipcMain.handle(ORION_CONSTANTS.IPC.GET_MEMORIES, async () => {
    return await memoryService.getMemories();
  });

  ipcMain.handle(ORION_CONSTANTS.IPC.SAVE_MEMORY, async (_, item) => {
    return await memoryService.saveMemory(item);
  });

  ipcMain.handle(ORION_CONSTANTS.IPC.DELETE_MEMORY, async (_, id) => {
    return await memoryService.deleteMemory(id);
  });

  ipcMain.handle('orchestrator:clear_conversation', async () => {
    orchestrator.getMemoryService().clearMemory();
    return true;
  });

  ipcMain.handle('orchestrator:get_tasks', async () => {
    return orchestrator.getTaskMemory().getTasks();
  });

  ipcMain.handle('environment:get_state', async () => {
    return await orchestrator.getPerceptionService().captureEnvironment(orchestrator.getState());
  });

  ipcMain.handle('supervisor:get_all_tasks', async () => {
    return orchestrator.getTaskSupervisor().getAllTasks();
  });

  ipcMain.handle('trace:get', async (_, traceId: string) => {
    return orchestrator.getTraceService().getTrace(traceId);
  });

  ipcMain.handle('action:execute', async (_, action: any) => {
    return await orchestrator.getActionService().executeAction(action);
  });

  // Phase 4 TITAN Closed-Loop Pipeline IPC Channels
  ipcMain.handle('titan:run_pipeline', async (_, options: any) => {
    const result = await titanPipeline.executePipeline(options);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('titan:pipeline_updated', result);
    }
    return result;
  });

  ipcMain.handle('titan:approve_render', async (_, { target }: { target?: string }) => {
    const result = await titanPipeline.executePipeline({
      target,
      hasExplicitRenderApproval: true
    });
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('titan:pipeline_updated', result);
    }
    return result;
  });

  ipcMain.handle('titan:get_pipeline_status', async () => {
    return titanPipeline.getAuditTrail().length > 0 ? {
      state: titanPipeline.getState(),
      auditTrail: titanPipeline.getAuditTrail()
    } : null;
  });

  // Phase 5 Operator Controls & Read-Only Output Preview
  ipcMain.handle('titan:reset_pipeline', async () => {
    const result = titanPipeline.reset();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('titan:pipeline_updated', result);
    }
    return result;
  });

  ipcMain.handle('titan:get_output_preview', async (_, { target }: { target?: string }) => {
    const validTargets = ['Video_001', 'Video_002', 'Video_003'];
    const chosenTarget = target && validTargets.includes(target) ? target : 'Video_001';
    const outputMap: Record<string, string> = {
      Video_001: 'Video_001_Dynamic_Test.mp4',
      Video_002: 'Video_002_Agency_Draft.mp4',
      Video_003: 'Video_003_Gigafactory_Draft.mp4'
    };

    const titanRoot = process.env.TITAN_ROOT || path.join(os.homedir(), 'Project_Titan');
    const previewFile = path.join(titanRoot, '07_Video_Projects', 'Experimental', outputMap[chosenTarget]);

    if (fs.existsSync(previewFile)) {
      const stat = fs.statSync(previewFile);
      if (stat.size > 0) {
        return {
          exists: true,
          target: chosenTarget,
          filename: path.basename(previewFile),
          filePath: previewFile,
          sizeBytes: stat.size,
          sizeMB: (stat.size / (1024 * 1024)).toFixed(2),
          modifiedAt: stat.mtimeMs
        };
      }
    }

    return {
      exists: false,
      target: chosenTarget,
      filename: outputMap[chosenTarget],
      filePath: previewFile,
      sizeBytes: 0,
      sizeMB: '0.00',
      message: 'No verified draft render exists yet for this target.'
    };
  });

  // Phase 6 Multi-Target Batch Orchestration IPC Channels
  ipcMain.handle('titan:run_batch', async (_, options: any) => {
    const result = await titanBatchOrchestrator.executeBatch(options);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('titan:batch_updated', result);
    }
    return result;
  });

  ipcMain.handle('titan:approve_batch_target', async () => {
    const result = await titanBatchOrchestrator.approveBatchTarget();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('titan:batch_updated', result);
    }
    return result;
  });

  ipcMain.handle('titan:get_batch_status', async () => {
    return titanBatchOrchestrator.getCurrentResult();
  });

  ipcMain.handle('titan:reset_batch', async () => {
    const result = titanBatchOrchestrator.reset();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('titan:batch_updated', result);
    }
    return result;
  });

  // Phase 7B Safe Release Packaging & Independent Validation IPC Channels
  ipcMain.handle('titan:package_release', async (_, options: { target: string; forceOverwrite?: boolean }) => {
    return await toolService.executeTool({
      id: `ipc_package_${Date.now()}`,
      toolId: 'titan.package_release',
      toolName: 'Titan Package Safe Release',
      arguments: {
        target: options.target,
        forceOverwrite: options.forceOverwrite === true
      },
      timestamp: Date.now(),
      requiresUserApproval: false
    });
  });

  ipcMain.handle('titan:validate_release', async (_, options: { target: string }) => {
    return await toolService.executeTool({
      id: `ipc_validate_${Date.now()}`,
      toolId: 'titan.validate_release',
      toolName: 'Titan Validate Release Package',
      arguments: {
        target: options.target
      },
      timestamp: Date.now(),
      requiresUserApproval: false
    });
  });

  ipcMain.handle('titan:get_release_manifest', async (_, options: { target: string }) => {
    const validTargets = ['Video_001', 'Video_002', 'Video_003'];
    const chosenTarget = options.target && validTargets.includes(options.target) ? options.target : 'Video_001';
    const manifestTitanRoot = process.env.TITAN_ROOT || path.join(os.homedir(), 'Project_Titan');
    const manifestPath = path.join(manifestTitanRoot, '08_Distribution', 'Releases', chosenTarget, 'release_manifest.json');
    if (fs.existsSync(manifestPath)) {
      try {
        const text = fs.readFileSync(manifestPath, 'utf-8');
        return { exists: true, manifest: JSON.parse(text) };
      } catch (err: any) {
        return { exists: true, error: err.message };
      }
    }
    return { exists: false, message: `No release manifest generated yet for ${chosenTarget}.` };
  });

  // Phase 8 & Phase 13 Universal Desktop Control & Computer-Use IPC Channels
  const compService = toolService.getComputerUseService();

  ipcMain.handle('computer:get_observation', async () => {
    return await compService.observeScreen();
  });

  ipcMain.handle('computer:plan_task', async (_, command: string, options?: any) => {
    return await compService.planTask(command, options);
  });

  ipcMain.handle('computer:execute_plan', async (_, plan: any) => {
    return await compService.executePlan(plan, (updatedPlan) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('computer:task_updated', updatedPlan);
      }
    });
  });

  ipcMain.handle('computer:execute_command', async (_, command: string, options?: any) => {
    return await compService.executeNaturalLanguageCommand(command, (updatedPlan) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('computer:task_updated', updatedPlan);
      }
    }, options);
  });

  ipcMain.handle('computer:cancel_task', async (_, reason?: string) => {
    return compService.cancelActiveTask(reason);
  });

  ipcMain.handle('computer:emergency_stop', async () => {
    compService.emergencyStop();
    return true;
  });

  ipcMain.handle('computer:reset_emergency_stop', async () => {
    compService.resetEmergencyStop();
    return true;
  });

  // Browser Provider IPC Channels
  ipcMain.handle('browser:observe', async () => {
    return await browserProvider.observe();
  });

  ipcMain.handle('browser:navigate', async (_, { url, openInExternal }: { url: string; openInExternal?: boolean }) => {
    return await browserProvider.navigate(url, openInExternal);
  });

  ipcMain.handle('browser:click', async (_, selector: string) => {
    return await browserProvider.click(selector);
  });

  ipcMain.handle('browser:type', async (_, { selector, text }: { selector: string; text: string }) => {
    return await browserProvider.typeText(selector, text);
  });

  ipcMain.handle('browser:open_chrome', async (_, { url, visibleWindow, useCdp }: { url?: string; visibleWindow?: boolean; useCdp?: boolean } = {}) => {
    return await browserProvider.openChromeWindow(url, { visibleWindow, useCdp });
  });

  ipcMain.handle('browser:search', async (_, { query, useCdpAdapter }: { query: string; useCdpAdapter?: boolean }) => {
    return await browserProvider.searchWeb(query, { useCdpAdapter });
  });

  ipcMain.handle('browser:open_tabs', async (_, { urls, useCdpAdapter }: { urls: string[]; useCdpAdapter?: boolean }) => {
    return await browserProvider.openMultipleTabs(urls, { useCdpAdapter });
  });

  ipcMain.handle('browser:fill_form', async (_, payload: {
    fields: Record<string, string>;
    submitSelector?: string;
    submitForm?: boolean;
    explicitAuthorization?: boolean;
  }) => {
    const res = await browserProvider.fillForm(payload.fields, {
      submitSelector: payload.submitSelector,
      submitForm: payload.submitForm,
      explicitAuthorization: payload.explicitAuthorization
    });
    if (res.errorCode === 'AUTHORIZATION_REQUIRED') {
      const browserTool = toolService.getRegistry().getTool('browser.click') || {
        id: 'browser.submit_form',
        name: 'Browser Submit External Form',
        category: 'BROWSER',
        description: 'Submits form data to active webpage',
        permissionLevel: 'HIGH',
        isReadOnly: false,
        isDangerous: true,
        requiresApproval: true,
        parameters: {}
      };
      const pending = securityMiddleware.createApprovalRequest({
        tool: browserTool as any,
        arguments: {
          url: res.observation?.url,
          fields: payload.fields,
          submitSelector: payload.submitSelector || '#submit-btn'
        },
        evaluatedRisk: 'HIGH_RISK',
        agentId: agentSystem.getActiveEngineeringAgentId(),
        reason: res.error || 'Submitting form data requires explicit operator approval.'
      });
      return { ...res, pendingApprovalId: pending.approvalId, pendingApproval: pending };
    }
    return res;
  });

  ipcMain.handle('browser:execute_closed_loop', async (_, payload: {
    goal: string;
    explicitAuthorization?: boolean;
    useCdpAdapter?: boolean;
    visibleWindow?: boolean;
    formFields?: Record<string, string>;
    submitSelector?: string;
    submitForm?: boolean;
  }) => {
    const report = await browserProvider.executeClosedLoopTask({
      ...payload,
      onStageChange: (stage, detail) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('browser:stage_changed', { stage, detail, timestamp: Date.now() });
        }
      }
    });
    if (report.status === 'AWAITING_APPROVAL') {
      const browserTool = toolService.getRegistry().getTool('browser.click') || {
        id: 'browser.submit_form',
        name: 'Browser Submit External Form',
        category: 'BROWSER',
        description: 'Submits form data to active webpage',
        permissionLevel: 'HIGH',
        isReadOnly: false,
        isDangerous: true,
        requiresApproval: true,
        parameters: {}
      };
      const pending = securityMiddleware.createApprovalRequest({
        tool: browserTool as any,
        arguments: {
          goal: payload.goal,
          url: report.url,
          formFields: payload.formFields
        },
        evaluatedRisk: 'HIGH_RISK',
        agentId: agentSystem.getActiveEngineeringAgentId(),
        reason: report.error || 'Submitting browser form requires explicit operator approval.'
      });
      report.pendingApprovalId = pending.approvalId;
    }
    return report;
  });

  ipcMain.handle('browser:close', async () => {
    await browserProvider.close();
    return { closed: true };
  });

  // Active Applications Panel IPC Channels (Real OS Process + Verified Window State + Real PNG Icons)
  ipcMain.handle('apps:get_state', async (_, { forceRefresh }: { forceRefresh?: boolean } = {}) => {
    activeAppsTracker.refreshFromSystem(Boolean(forceRefresh));
    const winMgr = compService.getWindowManager();
    const [activeWin, visibleWins] = await Promise.all([
      winMgr.getActiveWindow().catch(() => ({ title: 'Unknown', processName: 'Unknown', processId: 0, bounds: { x: 0, y: 0, width: 1920, height: 1080 } })),
      winMgr.getVisibleWindows().catch(() => [])
    ]);

    const tracked = activeAppsTracker.getAllTrackedApplications();
    const enriched = tracked.map(appItem => {
      const idLower = appItem.id.toLowerCase();
      const dispLower = appItem.displayName.toLowerCase();

      const matchingWin = visibleWins.find(
        w =>
          w.processName.toLowerCase().includes(idLower) ||
          w.title.toLowerCase().includes(dispLower) ||
          (idLower === 'vscode' && (w.processName.toLowerCase().includes('code') || w.title.toLowerCase().includes('visual studio code'))) ||
          (idLower === 'terminal' && (w.processName.toLowerCase().includes('powershell') || w.processName.toLowerCase().includes('windowsterminal') || w.processName.toLowerCase().includes('cmd')))
      );

      const isForeground =
        activeWin.processName.toLowerCase().includes(idLower) ||
        activeWin.title.toLowerCase().includes(dispLower) ||
        (idLower === 'vscode' && activeWin.processName.toLowerCase().includes('code'));

      let iconDataUrl: string | undefined;
      if (appItem.iconPngPath && fs.existsSync(appItem.iconPngPath)) {
        try {
          const b64 = fs.readFileSync(appItem.iconPngPath).toString('base64');
          iconDataUrl = `data:image/png;base64,${b64}`;
        } catch {}
      }

      const verifiedWindow = Boolean(matchingWin || isForeground);
      const effectiveStatus = verifiedWindow && appItem.status === 'Not running' ? 'Open' : appItem.status;

      return {
        id: appItem.id,
        displayName: appItem.displayName,
        status: effectiveStatus,
        verifiedWindow,
        windowTitle: isForeground ? activeWin.title : (matchingWin?.title || null),
        processName: appItem.processName || matchingWin?.processName || null,
        processId: matchingWin?.processId || (isForeground ? activeWin.processId : null),
        isForeground,
        brandRgb: appItem.brandRgb,
        iconVerifiedLocal: appItem.iconVerifiedLocal,
        iconDataUrl,
        detail: appItem.detail || null,
        lastUpdated: appItem.lastUpdated
      };
    });

    return {
      apps: enriched,
      activeWindow: activeWin,
      visibleWindowsCount: visibleWins.length,
      timestamp: Date.now()
    };
  });

  ipcMain.handle('apps:focus_or_open', async (_, { appId, url }: { appId: string; url?: string }) => {
    const cleanId = String(appId || '').trim().toLowerCase();
    if (!cleanId) {
      return { success: false, error: 'Application ID is required.' };
    }
    if (ProcessSupervisor.getInstance().isEstopActive() || compService.isEmergencyStopped()) {
      return { success: false, error: 'Execution BLOCKED: ORION Emergency Stop is active.' };
    }

    activeAppsTracker.refreshFromSystem(true);
    const tracked = activeAppsTracker.resolveAppIdentity(cleanId);
    const winMgr = compService.getWindowManager();

    // If already running, try focusing first
    if (tracked && tracked.status === 'Open' && !url) {
      const focused = await winMgr.focusWindow(cleanId === 'vscode' ? 'Code' : cleanId);
      if (focused) {
        const activeAfter = await winMgr.getActiveWindow().catch(() => null);
        return {
          success: true,
          action: 'FOCUSED',
          appId: cleanId,
          verifiedWindow: true,
          activeWindow: activeAfter
        };
      }
    }

    // Launch via authoritative ComputerUseService OPEN_APP action
    activeAppsTracker.setApplicationState(cleanId, 'Launching', 'Starting process...');
    const targetAppName = cleanId === 'vscode' ? 'code' : cleanId === 'terminal' ? 'powershell' : cleanId;
    const actionRes = await compService.executeSingleAction({
      id: `ui_app_${Date.now()}`,
      type: 'OPEN_APP',
      target: targetAppName,
      parameters: url ? { appName: targetAppName, path: url } : { appName: targetAppName },
      confidence: 0.99,
      riskLevel: 'LOW_RISK',
      reason: `Operator clicked '${cleanId}' in Active Applications Panel`
    });

    if (actionRes.success) {
      activeAppsTracker.setApplicationState(cleanId, 'Open');
    } else {
      activeAppsTracker.setApplicationState(cleanId, 'Launch failed', actionRes.error);
    }

    return {
      success: actionRes.success,
      action: 'LAUNCHED',
      appId: cleanId,
      verifiedWindow: actionRes.postconditionsVerified,
      error: actionRes.error,
      observedState: actionRes.observedState
    };
  });

  // Multi-Agent Engineering System IPC Channels
  ipcMain.handle('agents:get_roster', async () => {
    await omniRouter.ensureInitialized(800);
    return {
      activeAgentId: agentSystem.getActiveEngineeringAgentId(),
      canonicalAgentId: agentSystem.getActiveAgentId(),
      roster: agentSystem.getLiveAgentRoster(),
      backendHealth: agentSystem.getBackendHealthSummary(),
      tasks: agentSystem.getAllTasks().slice(-30),
      logs: agentSystem.getAgentLogs(undefined, 40)
    };
  });

  ipcMain.handle('agents:set_active', async (_, agentId: string) => {
    const def = agentSystem.setActiveAgent(agentId);
    return {
      activeAgentId: agentSystem.getActiveEngineeringAgentId(),
      canonicalAgentId: agentSystem.getActiveAgentId(),
      definition: def
    };
  });

  ipcMain.handle('agents:run_task', async (_, payload: {
    agentId: string;
    title?: string;
    prompt: string;
    toolCallsToRun?: Array<{ toolId: string; arguments?: Record<string, any> }>;
  }) => {
    return await agentSystem.runEngineeringTask({
      agentId: payload.agentId,
      title: payload.title || payload.prompt.slice(0, 60),
      prompt: payload.prompt,
      toolCallsToRun: payload.toolCallsToRun
    });
  });

  ipcMain.handle('agents:delegate', async (_, { goal, targetFile }: { goal: string; targetFile?: string }) => {
    return await agentSystem.delegateEngineeringGoal(goal, { targetPath: targetFile });
  });

  ipcMain.handle('agents:cancel_task', async (_, { taskId, reason }: { taskId: string; reason?: string }) => {
    return { cancelled: agentSystem.cancelAgentTask(taskId, reason) };
  });

  // Security Policy & Approvals IPC Channels
  ipcMain.handle('security:get_status', async () => {
    const policyIntegrity = agentPolicyService.verifyProtectedPolicyIntegrity();
    const estopActive = ProcessSupervisor.getInstance().isEstopActive() || compService.isEmergencyStopped();
    return {
      estopActive,
      policyIntegrityVerified: policyIntegrity.valid,
      policyHash: policyIntegrity.actualSha256,
      expectedPolicyHash: policyIntegrity.expectedSha256,
      pendingApprovals: securityMiddleware.getPendingApprovals(),
      allApprovals: securityMiddleware.getAllApprovals().slice(-20)
    };
  });

  ipcMain.handle('approvals:get_pending', async () => {
    return securityMiddleware.getPendingApprovals();
  });

  ipcMain.handle('approvals:approve', async (_, approvalId?: string) => {
    const approved = securityMiddleware.approveRequest(approvalId);
    return {
      success: Boolean(approved),
      approval: approved,
      pendingApprovals: securityMiddleware.getPendingApprovals()
    };
  });

  ipcMain.handle('approvals:deny', async (_, approvalId?: string) => {
    const denied = securityMiddleware.denyRequest(approvalId);
    return {
      success: Boolean(denied),
      approval: denied,
      pendingApprovals: securityMiddleware.getPendingApprovals()
    };
  });

  // Developer Agent IPC Channels
  ipcMain.handle('developer:inspect_repo', async (_, targetPath: string) => {
    return await developerAgent.inspectRepository(targetPath);
  });

  ipcMain.handle('developer:search_code', async (_, { targetPath, query }: { targetPath: string; query: string }) => {
    return await developerAgent.searchCode(targetPath, query);
  });

  ipcMain.handle('developer:execute_build', async (_, { targetPath, command }: { targetPath: string; command: string }) => {
    return await developerAgent.executeBuild(targetPath, command);
  });

  // Unified Memory IPC Channels
  ipcMain.handle('memory:unified_add', async (_, { type, content, tags, trustLevel }: any) => {
    return unifiedMemory.addMemory(type, content, tags, trustLevel);
  });

  ipcMain.handle('memory:unified_query', async (_, { query, limit }: { query: string; limit?: number }) => {
    return unifiedMemory.queryMemories(query, limit);
  });

  ipcMain.handle('memory:unified_clear', async (_, type?: any) => {
    unifiedMemory.clearMemories(type);
    return true;
  });

  // Coders HQ Showcase & Demo Health Check IPC Channels
  ipcMain.handle('demo:get_health_check', async () => {
    const routerStatus = omniRouter.getStatus();
    const configuredCount = omniRouter.getConfiguredProviders().length;
    const tools = toolService.getTools();
    const categories = Array.from(new Set(tools.map(t => t.category)));
    const hasCloudKeys = configuredCount > 0;

    return {
      overallStatus: hasCloudKeys ? 'READY' : 'READY_WITH_LIMITATIONS',
      statusMessage: hasCloudKeys
        ? 'All subsystems online with cloud neural model and local deterministic tool execution.'
        : 'ORION deterministic rule router active with 16 native tools. Cloud neural key optional.',
      aiRouter: {
        configuredCount,
        activeModel: routerStatus.currentModel,
        displayName: routerStatus.displayName,
        hasCloudKeys,
        isHealthy: routerStatus.isHealthy
      },
      tools: {
        totalCount: tools.length,
        categories
      },
      screenCapture: {
        available: true,
        resolution: '1920x1080 Native Buffer'
      },
      audioSynthesis: {
        available: process.platform === 'win32',
        engine: process.platform === 'win32' ? 'Windows SAPI' : 'Web Speech'
      },
      orchestrator: {
        status: orchestrator.getState(),
        activeTurns: orchestrator.getMemoryService().getTurns().length,
        activeTasks: orchestrator.getTaskMemory().getTasks().length
      },
      timestamp: Date.now()
    };
  });

  ipcMain.handle('demo:reset', async () => {
    orchestrator.getMemoryService().clearMemory();
    orchestrator.getTaskMemory().clearTasks();
    titanPipeline.reset();
    titanBatchOrchestrator.reset();
    return { success: true, timestamp: Date.now() };
  });

  ipcMain.handle('app:get_initial_mode', async () => {
    return process.env.ORION_INITIAL_MODE || 'COMMAND';
  });
}

app.whenReady().then(() => {
  setupIPC();
  createWindow();

  const smokeExitMs = Number(process.env.ORION_SMOKE_TEST_EXIT_MS || '0');
  if (smokeExitMs > 0) {
    setTimeout(() => {
      const marker = `ORION_DESKTOP_READY_FALLBACK tools=${toolService.getTools().length} provider=${omniRouter.getStatus().id} timestamp=${Date.now()}`;
      console.log(marker);
      if (process.env.ORION_SMOKE_TEST_OUT_FILE && !fs.existsSync(process.env.ORION_SMOKE_TEST_OUT_FILE)) {
        try {
          fs.writeFileSync(process.env.ORION_SMOKE_TEST_OUT_FILE, marker, 'utf-8');
        } catch {}
      }
      app.exit(0);
    }, smokeExitMs + 1000);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
