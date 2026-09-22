import { contextBridge, ipcRenderer } from 'electron';
import { ORION_CONSTANTS } from '../shared/constants';

const api = {
  getSystemSnapshot: () => ipcRenderer.invoke(ORION_CONSTANTS.IPC.SYSTEM_TELEMETRY),
  getTools: () => ipcRenderer.invoke('tools:get_all'),
  executeTool: (toolCall: any) => ipcRenderer.invoke(ORION_CONSTANTS.IPC.EXECUTE_TOOL, toolCall),
  processCommand: (query: string, source: 'TEXT' | 'VOICE' = 'TEXT') => ipcRenderer.invoke('orchestrator:process_command', { query, source }),
  getAIRouterStatus: () => ipcRenderer.invoke('ai:get_router_status'),
  getAllProviderStatuses: () => ipcRenderer.invoke('ai:get_all_provider_statuses'),
  setAIRoutingStrategy: (strategy: string) => ipcRenderer.invoke('ai:set_routing_strategy', strategy),
  saveProviderKeys: (keys: Record<string, string>) => ipcRenderer.invoke('ai:save_provider_keys', keys),
  runLiveQualificationTest: () => ipcRenderer.invoke('ai:run_live_qualification_test'),
  controlVoice: (action: 'start' | 'stop') => ipcRenderer.invoke(ORION_CONSTANTS.IPC.VOICE_LISTEN, action),
  stopSpeaking: () => ipcRenderer.invoke('voice:stop_speaking'),
  captureVision: (source: 'CAMERA' | 'SCREENSHOT') => ipcRenderer.invoke(ORION_CONSTANTS.IPC.VISION_CAPTURE, source),
  captureScreen: () => ipcRenderer.invoke('vision:capture_screen'),
  getMemories: () => ipcRenderer.invoke(ORION_CONSTANTS.IPC.GET_MEMORIES),
  saveMemory: (item: any) => ipcRenderer.invoke(ORION_CONSTANTS.IPC.SAVE_MEMORY, item),
  deleteMemory: (id: string) => ipcRenderer.invoke(ORION_CONSTANTS.IPC.DELETE_MEMORY, id),
  clearConversation: () => ipcRenderer.invoke('orchestrator:clear_conversation'),
  getTasks: () => ipcRenderer.invoke('orchestrator:get_tasks'),
  getEnvironmentState: () => ipcRenderer.invoke('environment:get_state'),
  getSupervisorTasks: () => ipcRenderer.invoke('supervisor:get_all_tasks'),
  getTrace: (traceId: string) => ipcRenderer.invoke('trace:get', traceId),
  executeComputerAction: (action: any) => ipcRenderer.invoke('action:execute', action),
  runTitanPipeline: (options?: any) => ipcRenderer.invoke('titan:run_pipeline', options),
  approveTitanRender: (options?: { target?: string }) => ipcRenderer.invoke('titan:approve_render', options),
  getTitanPipelineStatus: () => ipcRenderer.invoke('titan:get_pipeline_status'),
  resetTitanPipeline: () => ipcRenderer.invoke('titan:reset_pipeline'),
  getTitanOutputPreview: (options?: { target?: string }) => ipcRenderer.invoke('titan:get_output_preview', options),
  onTitanPipelineUpdated: (callback: (data: any) => void) => {
    const listener = (_: any, data: any) => callback(data);
    ipcRenderer.on('titan:pipeline_updated', listener);
    return () => ipcRenderer.removeListener('titan:pipeline_updated', listener);
  },
  runTitanBatch: (options?: any) => ipcRenderer.invoke('titan:run_batch', options),
  approveTitanBatchTarget: () => ipcRenderer.invoke('titan:approve_batch_target'),
  getTitanBatchStatus: () => ipcRenderer.invoke('titan:get_batch_status'),
  resetTitanBatch: () => ipcRenderer.invoke('titan:reset_batch'),
  onTitanBatchUpdated: (callback: (data: any) => void) => {
    const listener = (_: any, data: any) => callback(data);
    ipcRenderer.on('titan:batch_updated', listener);
    return () => ipcRenderer.removeListener('titan:batch_updated', listener);
  },
  packageTitanRelease: (options: { target: string; forceOverwrite?: boolean }) => ipcRenderer.invoke('titan:package_release', options),
  validateTitanRelease: (options: { target: string }) => ipcRenderer.invoke('titan:validate_release', options),
  getTitanReleaseManifest: (options: { target: string }) => ipcRenderer.invoke('titan:get_release_manifest', options),
  // Phase 8 & Phase 13 Universal Desktop Control / Computer-Use IPC
  getComputerObservation: () => ipcRenderer.invoke('computer:get_observation'),
  planComputerTask: (command: string, options?: any) => ipcRenderer.invoke('computer:plan_task', command, options),
  executeComputerPlan: (plan: any) => ipcRenderer.invoke('computer:execute_plan', plan),
  executeComputerCommand: (command: string, options?: any) => ipcRenderer.invoke('computer:execute_command', command, options),
  cancelComputerTask: (reason?: string) => ipcRenderer.invoke('computer:cancel_task', reason),
  emergencyStopComputer: () => ipcRenderer.invoke('computer:emergency_stop'),
  resetEmergencyStopComputer: () => ipcRenderer.invoke('computer:reset_emergency_stop'),
  onComputerTaskUpdated: (callback: (data: any) => void) => {
    const listener = (_: any, data: any) => callback(data);
    ipcRenderer.on('computer:task_updated', listener);
    return () => ipcRenderer.removeListener('computer:task_updated', listener);
  },
  // Unified Memory Preload Wiring
  unifiedMemoryAdd: (item: { type: string; content: string; tags?: string[]; trustLevel?: string }) =>
    ipcRenderer.invoke('memory:unified_add', item),
  unifiedMemoryQuery: (query: string, limit?: number) =>
    ipcRenderer.invoke('memory:unified_query', { query, limit }),
  unifiedMemoryClear: (type?: string) =>
    ipcRenderer.invoke('memory:unified_clear', type),
  // Developer Agent Preload Wiring
  developerInspectRepo: (targetPath: string) =>
    ipcRenderer.invoke('developer:inspect_repo', targetPath),
  developerSearchCode: (targetPath: string, query: string) =>
    ipcRenderer.invoke('developer:search_code', { targetPath, query }),
  developerExecuteBuild: (targetPath: string, command: string) =>
    ipcRenderer.invoke('developer:execute_build', { targetPath, command }),
  // Browser Provider Preload Wiring
  browserObserve: () => ipcRenderer.invoke('browser:observe'),
  browserNavigate: (url: string, openInExternal?: boolean) =>
    ipcRenderer.invoke('browser:navigate', { url, openInExternal }),
  browserClick: (selector: string) => ipcRenderer.invoke('browser:click', selector),
  browserType: (selector: string, text: string) =>
    ipcRenderer.invoke('browser:type', { selector, text }),
  // Coders HQ Showcase & Demo Preload Channels
  getDemoHealthCheck: () => ipcRenderer.invoke('demo:get_health_check'),
  resetDemo: () => ipcRenderer.invoke('demo:reset'),
  getInitialMode: () => ipcRenderer.invoke('app:get_initial_mode')
};




contextBridge.exposeInMainWorld('orionApi', api);
contextBridge.exposeInMainWorld('arvisApi', api); // Backwards compatibility alias
