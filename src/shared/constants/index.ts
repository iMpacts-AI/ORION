export const ORION_CONSTANTS = {
  APP_NAME: 'ORION',
  APP_LONG_NAME: 'ORION AI Command System',
  VERSION: '0.1.0',
  IPC: {
    SYSTEM_TELEMETRY: 'system:telemetry',
    EXECUTE_TOOL: 'tool:execute',
    VOICE_LISTEN: 'voice:listen',
    VISION_CAPTURE: 'vision:capture',
    GET_MEMORIES: 'memory:get',
    SAVE_MEMORY: 'memory:save',
    DELETE_MEMORY: 'memory:delete'
  },
  DEFAULT_MODE: 'COMMAND' as const,
  DEFAULT_STATE: 'STANDBY' as const
};

// Backwards compatibility alias
export const ARVIS_CONSTANTS = ORION_CONSTANTS;
