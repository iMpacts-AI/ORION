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
import { TitanClosedLoopPipeline } from './services/titan/TitanClosedLoopPipeline';
import { TitanBatchOrchestrator } from './services/titan/TitanBatchOrchestrator';
import { ORION_CONSTANTS } from '../shared/constants';

let mainWindow: BrowserWindow | null = null;

const systemMonitor = new SystemMonitorService();
const memoryService = new MemoryService();
const unifiedMemory = new UnifiedMemoryManager();
const omniRouter = new OrionAIProviderRouter();
const toolService = new ToolService(undefined, undefined);
// Pass omniRouter to ComputerUseService planner
toolService.getComputerUseService().getPlanner().setAIProvider(omniRouter);

const developerAgent = new DefaultDeveloperAgentProvider(toolService);
const browserProvider = new DefaultBrowserProvider();
const voiceService = new VoiceService();
const titanPipeline = new TitanClosedLoopPipeline(toolService);
const titanBatchOrchestrator = new TitanBatchOrchestrator(titanPipeline);

// Phase 4 Omni-Brain AI Router & Phase B Cloud Vision Integration
const cloudVisionAdapter = new CloudVisionAdapter(omniRouter);
const visionService = new VisionService(cloudVisionAdapter);
const orchestrator = new OrionOrchestrator(toolService, visionService, voiceService, omniRouter);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 960,
    minWidth: 1280,
    minHeight: 800,
    title: 'ORION - AI Command System',
    backgroundColor: '#050608',
    frame: true,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  mainWindow.show();
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const candidateHtmlPaths = [
      path.join(__dirname, '../../dist/index.html'),
      path.join(process.cwd(), 'dist/index.html'),
      path.join(process.resourcesPath || '', 'app/dist/index.html'),
      path.join(path.dirname(process.execPath || ''), 'resources/app/dist/index.html'),
      path.resolve(os.homedir(), 'Downloads/ORION/dist/index.html')
    ];
    const targetHtml = candidateHtmlPaths.find(p => fs.existsSync(p)) || candidateHtmlPaths[0];
    mainWindow.loadFile(targetHtml).catch(err => {
      console.error('Failed to load html:', err);
    });
  }

  mainWindow.show();
  mainWindow.focus();

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
    return await orchestrator.processCommand(query, source);
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
    try {
      let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
      let lines = envContent.split(/\r?\n/);
      const envMap: Record<string, string> = {};

      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx > 0) {
            envMap[trimmed.substring(0, idx)] = trimmed.substring(idx + 1);
          }
        }
      });

      // Update values
      Object.entries(keys).forEach(([k, v]) => {
        if (v && v.trim()) {
          process.env[k] = v.trim();
          envMap[k] = v.trim();
        }
      });

      // Write back to .env
      const newEnvLines = Object.entries(envMap).map(([k, v]) => `${k}=${v}`);
      fs.writeFileSync(envPath, newEnvLines.join('\n'), 'utf-8');

      return true;
    } catch (e: any) {
      console.error('Failed to save provider keys:', e);
      return false;
    }
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
}




app.whenReady().then(() => {
  setupIPC();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
