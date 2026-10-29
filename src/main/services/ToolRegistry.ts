import { Tool, ToolCall, ToolResult, PermissionLevel } from '../../shared/types';
import { TitanToolProvider } from './titan/TitanToolProvider';

export interface SkillHealthReport {
  toolId: string;
  name: string;
  version: string;
  category: string;
  permissionLevel: PermissionLevel;
  state: 'INSTALLED' | 'CONFIGURED' | 'CONNECTED' | 'HEALTHY' | 'AUTHORIZED' | 'RESTRICTED';
  isReadOnly: boolean;
  requiresApproval: boolean;
  supportsCancellation: boolean;
  timeoutMs: number;
  usageCount: number;
  failureCount: number;
}

export interface IToolRegistry {
  registerTool(tool: Tool): void;
  getTool(id: string): Tool | undefined;
  getAllTools(): Tool[];
  getToolsForPermission(maxLevel: PermissionLevel): Tool[];
}

export class ToolRegistry implements IToolRegistry {
  private tools: Map<string, Tool> = new Map();
  private usageMetrics: Map<string, { calls: number; failures: number; lastDurationMs: number }> = new Map();

  constructor() {
    this.registerBuiltInTools();
  }

  public registerTool(tool: Tool): void {
    if (!tool.id || !tool.name) {
      throw new Error('Tool registration error: Tool must possess an id and a name.');
    }
    const enriched: Tool = {
      ...tool,
      timeoutMs: tool.timeoutMs || 15000,
      supportsCancellation: tool.supportsCancellation ?? true,
      verificationStrategy: tool.verificationStrategy || (tool.isReadOnly ? 'READ_SCHEMA_CHECK' : 'POST_EXECUTION_STATE_VERIFICATION')
    };
    this.tools.set(enriched.id, enriched);
    if (!this.usageMetrics.has(enriched.id)) {
      this.usageMetrics.set(enriched.id, { calls: 0, failures: 0, lastDurationMs: 0 });
    }
  }

  public validateToolArguments(toolId: string, args: Record<string, any> | undefined): { valid: boolean; errors: string[] } {
    const tool = this.tools.get(toolId);
    if (!tool) {
      return { valid: false, errors: [`Tool '${toolId}' is not registered.`] };
    }
    const safeArgs = args && typeof args === 'object' ? args : {};
    const errors: string[] = [];

    for (const [paramName, schema] of Object.entries(tool.parameters || {})) {
      const val = safeArgs[paramName];
      if (schema.required && (val === undefined || val === null || val === '')) {
        errors.push(`Missing required parameter '${paramName}' for skill '${toolId}'.`);
        continue;
      }
      if (val !== undefined && val !== null) {
        let actualVal = val;
        if (schema.type === 'number' && typeof actualVal === 'string' && /^-?\d+(?:\.\d+)?%?$/.test(actualVal.trim())) {
          const parsed = Number(actualVal.trim().replace(/%$/, ''));
          if (!Number.isNaN(parsed)) {
            actualVal = parsed;
            if (args && typeof args === 'object') {
              args[paramName] = parsed;
            }
          }
        } else if (schema.type === 'string' && typeof actualVal === 'number') {
          actualVal = String(actualVal);
          if (args && typeof args === 'object') {
            args[paramName] = actualVal;
          }
        }
        const actualType = Array.isArray(actualVal) ? 'array' : typeof actualVal;
        if (actualType !== schema.type) {
          errors.push(`Parameter '${paramName}' for skill '${toolId}' expected type '${schema.type}', got '${actualType}'.`);
        }
        if (schema.enum && !schema.enum.includes(String(actualVal))) {
          errors.push(`Parameter '${paramName}' value '${actualVal}' is not in allowed enum [${schema.enum.join(', ')}].`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  public recordSkillExecution(toolId: string, success: boolean, durationMs: number): void {
    const curr = this.usageMetrics.get(toolId) || { calls: 0, failures: 0, lastDurationMs: 0 };
    curr.calls++;
    if (!success) curr.failures++;
    curr.lastDurationMs = durationMs;
    this.usageMetrics.set(toolId, curr);
  }

  public getSkillHealthReports(): SkillHealthReport[] {
    return this.getAllTools().map(t => {
      const stats = this.usageMetrics.get(t.id) || { calls: 0, failures: 0, lastDurationMs: 0 };
      const state: SkillHealthReport['state'] =
        t.permissionLevel === 'CRITICAL'
          ? 'RESTRICTED'
          : stats.failures > 2 && stats.failures === stats.calls
            ? 'CONFIGURED'
            : 'HEALTHY';
      return {
        toolId: t.id,
        name: t.name,
        version: '2.0.0',
        category: t.category,
        permissionLevel: t.permissionLevel,
        state,
        isReadOnly: Boolean(t.isReadOnly),
        requiresApproval: Boolean(t.requiresApproval || t.permissionLevel === 'HIGH' || t.permissionLevel === 'CRITICAL'),
        supportsCancellation: Boolean(t.supportsCancellation),
        timeoutMs: t.timeoutMs || 15000,
        usageCount: stats.calls,
        failureCount: stats.failures
      };
    });
  }

  public getTool(id: string): Tool | undefined {
    return this.tools.get(id);
  }

  public getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  public getToolsForPermission(maxLevel: PermissionLevel): Tool[] {
    const hierarchy: Record<PermissionLevel, number> = {
      LOW: 1,
      MEDIUM: 2,
      HIGH: 3,
      CRITICAL: 4
    };
    const maxVal = hierarchy[maxLevel] || 1;
    return this.getAllTools().filter(t => (hierarchy[t.permissionLevel] || 1) <= maxVal);
  }

  private registerBuiltInTools(): void {
    const builtIns: Tool[] = [
      {
        id: 'system.get_info',
        name: 'Get System Info',
        category: 'SYSTEM',
        description: 'Returns hardware model, operating system, platform, architecture, and uptime.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {}
      },
      {
        id: 'system.get_cpu_usage',
        name: 'Get CPU Usage',
        category: 'SYSTEM',
        description: 'Returns live CPU utilization breakdown across all detected cores.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {}
      },
      {
        id: 'system.get_memory_usage',
        name: 'Get Memory Usage',
        category: 'SYSTEM',
        description: 'Returns live total, used, free RAM memory and utilization percentage.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {}
      },
      {
        id: 'system.get_disk_usage',
        name: 'Get Disk Usage',
        category: 'SYSTEM',
        description: 'Returns main storage drive labels, total space, free space, and usage percentage.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {}
      },
      {
        id: 'system.get_network_status',
        name: 'Get Network Status',
        category: 'SYSTEM',
        description: 'Returns primary network interface details, local IP address, and connection status.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {}
      },
      {
        id: 'system.get_current_time',
        name: 'Get Current Time',
        category: 'SYSTEM',
        description: 'Returns current local system time, ISO timestamp, and timezone.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {}
      },
      {
        id: 'system.clipboard_read',
        name: 'Read System Clipboard',
        category: 'SYSTEM',
        description: 'Reads current text content from the system clipboard.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {}
      },
      {
        id: 'system.clipboard_write',
        name: 'Write System Clipboard',
        category: 'SYSTEM',
        description: 'Writes text content to the system clipboard.',
        permissionLevel: 'MEDIUM',
        isReadOnly: false,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          text: { type: 'string', description: 'Text content to copy to clipboard', required: true }
        }
      },
      {
        id: 'system.volume',
        name: 'System Audio Volume Control',
        category: 'SYSTEM',
        description: 'Sets master system volume (0-100) or adjusts audio (up, down, mute, unmute).',
        permissionLevel: 'MEDIUM',
        isReadOnly: false,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          level: { type: 'string', description: 'Target volume percentage (0-100) or action (up, down, mute, unmute)', required: true }
        }
      },
      {
        id: 'system.get_brightness',
        name: 'Get Display Brightness',
        category: 'SYSTEM',
        description: 'Reads the current display backlight brightness percentage (0-100) and supported levels via OS hardware interface (WMI WmiMonitorBrightness on Windows).',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {}
      },
      {
        id: 'system.set_brightness',
        name: 'Set Display Brightness',
        category: 'SYSTEM',
        description: 'Sets the display backlight brightness to an exact percentage (0-100) via OS hardware interface (WMI WmiMonitorBrightnessMethods on Windows) and verifies the resulting brightness level.',
        permissionLevel: 'MEDIUM',
        isReadOnly: false,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          level: {
            type: 'number',
            description: 'Target display brightness percentage from 0 to 100',
            required: true
          }
        }
      },
      {
        id: 'system.control',
        name: 'System Power & Display Control',
        category: 'SYSTEM',
        description: 'Executes system-level actions: mute, unmute, show_desktop, task_view, brightness_up, brightness_down, lock.',
        permissionLevel: 'MEDIUM',
        isReadOnly: false,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          action: {
            type: 'string',
            description: 'Control action: mute | unmute | show_desktop | task_view | brightness_up | brightness_down | lock',
            required: true
          }
        }
      },
      {
        id: 'media.status',
        name: 'Media & Spotify Now Playing Status',
        category: 'SYSTEM',
        description: 'Inspects active Spotify / media player windows and reports current track, artist, and playback status.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {}
      },
      {
        id: 'media.control',
        name: 'Media Playback Control',
        category: 'AUTOMATION',
        description: 'Controls system media playback via Windows virtual media keys (play, pause, next, previous, stop, louder, quieter).',
        permissionLevel: 'LOW',
        isReadOnly: false,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          action: {
            type: 'string',
            description: 'Playback action: play | pause | toggle | next | previous | stop | louder | quieter',
            required: true
          }
        }
      },
      {
        id: 'media.play_spotify',
        name: 'Spotify Play or Search Track',
        category: 'AUTOMATION',
        description: 'Launches or focuses Spotify and opens a search/track URI or toggles playback.',
        permissionLevel: 'MEDIUM',
        isReadOnly: false,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          query: { type: 'string', description: 'Song, artist, or playlist to play/search on Spotify', required: false }
        }
      },
      {
        id: 'info.weather',
        name: 'Get Live Weather Forecast',
        category: 'SYSTEM',
        description: 'Fetches live weather telemetry (temperature, humidity, wind, condition) for a city (default: Abu Dhabi).',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          city: { type: 'string', description: 'Target city name (e.g. Abu Dhabi, Dubai, London)', required: false }
        }
      },
      {
        id: 'info.prayers',
        name: 'Get Islamic Prayer Times',
        category: 'SYSTEM',
        description: 'Fetches daily Islamic prayer timings (Fajr, Dhuhr, Asr, Maghrib, Isha) and Hijri date via Aladhan API (UAE Method 8 default).',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          city: { type: 'string', description: 'Target city (default: Abu Dhabi)', required: false },
          country: { type: 'string', description: 'Target country (default: UAE)', required: false }
        }
      },
      {
        id: 'memory.add_note',
        name: 'Save Personal Note',
        category: 'SYSTEM',
        description: 'Saves a persistent note into ORION Unified Memory.',
        permissionLevel: 'LOW',
        isReadOnly: false,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          content: { type: 'string', description: 'Note content to save', required: true }
        }
      },
      {
        id: 'memory.list_notes',
        name: 'List Saved Notes',
        category: 'SYSTEM',
        description: 'Lists saved notes from ORION Unified Memory.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {}
      },
      {
        id: 'memory.add_reminder',
        name: 'Add Reminder or Task',
        category: 'SYSTEM',
        description: 'Saves a persistent reminder or task item into ORION Unified Memory.',
        permissionLevel: 'LOW',
        isReadOnly: false,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          task: { type: 'string', description: 'Reminder or task description', required: true },
          due: { type: 'string', description: 'Optional due time or date', required: false }
        }
      },
      {
        id: 'memory.list_reminders',
        name: 'List Saved Reminders',
        category: 'SYSTEM',
        description: 'Lists saved reminders and tasks from ORION Unified Memory.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {}
      },
      {
        id: 'file.list_directory',
        name: 'List Directory Files',
        category: 'FILE',
        description: 'Lists files and folders within a specified local directory.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          dirPath: { type: 'string', description: 'Target directory path (defaults to current directory)', required: false }
        }
      },
      {
        id: 'file.read_text',
        name: 'Read Text File',
        category: 'FILE',
        description: 'Reads the text contents of a local file safely.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          filePath: { type: 'string', description: 'Absolute or relative file path to read', required: true }
        }
      },
      {
        id: 'file.write_text',
        name: 'Write Text File',
        category: 'FILE',
        description: 'Writes or appends content to a local text file.',
        permissionLevel: 'MEDIUM',
        isReadOnly: false,
        isDangerous: false,
        requiresApproval: false,
        supportsCancellation: true,
        parameters: {
          filePath: { type: 'string', description: 'Target file path', required: true },
          content: { type: 'string', description: 'Text content to write', required: true }
        }
      },
      {
        id: 'computer.observe',
        name: 'Computer Observe Desktop Screen',
        category: 'SCREENSHOT',
        description: 'Captures full desktop screenshot, active window, UI element hierarchy, cursor position, and visible text.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {}
      },
      {
        id: 'computer.plan_task',
        name: 'Computer Plan Desktop Task',
        category: 'AUTOMATION',
        description: 'Decomposes a natural-language desktop command into a structured action plan with risk evaluation and verification steps.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          command: { type: 'string', description: 'Natural-language desktop command', required: true }
        }
      },
      {
        id: 'computer.execute_action',
        name: 'Computer Execute Action',
        category: 'COMPUTER',
        description: 'Executes a single structured computer action (mouse, keyboard, window, screenshot) with closed-loop verification.',
        permissionLevel: 'MEDIUM',
        isReadOnly: false,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          action: { type: 'object', description: 'Structured ComputerAction payload', required: true }
        }
      },
      {
        id: 'computer.natural_language_command',
        name: 'Computer Execute Natural Language Command',
        category: 'AUTOMATION',
        description: 'Executes a multi-step natural language desktop control command through closed-loop Observe-Plan-Act-Verify.',
        permissionLevel: 'MEDIUM',
        isReadOnly: false,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          command: { type: 'string', description: 'Natural-language desktop instruction', required: true }
        }
      },
      {
        id: 'computer.discover_apps',
        name: 'Discover Installed Windows Applications',
        category: 'COMPUTER',
        description: 'Discovers installed Windows 11 applications across Catalog, Registry App Paths, Start Menu shortcuts, Programs/ArtCraft, PATH, and Microsoft Store.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          query: { type: 'string', description: 'Optional application name or keyword filter', required: false }
        }
      },
      {
        id: 'computer.launch_app',
        name: 'Launch Installed Windows Application',
        category: 'COMPUTER',
        description: 'Resolves and launches an installed Windows 11 application with separated argument validation and window/process verification.',
        permissionLevel: 'MEDIUM',
        isReadOnly: false,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          appName: { type: 'string', description: 'Application name or alias (e.g. chrome, notepad, pdfcraft, photocraft)', required: true },
          args: { type: 'array', description: 'Optional array of separated launch arguments (supports paths with spaces)', required: false },
          path: { type: 'string', description: 'Optional single document, folder, or URL argument', required: false }
        }
      },
      {
        id: 'browser.navigate',
        name: 'Browser Navigate URL',
        category: 'BROWSER',
        description: 'Navigates to a web URL, retrieves page text content, page title, interactive DOM elements, and clickable hyperlinks.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          url: { type: 'string', description: 'Target HTTP/HTTPS URL', required: true },
          waitForSelector: { type: 'string', description: 'Optional CSS selector to wait for before completing navigation', required: false },
          useCdpAdapter: { type: 'boolean', description: 'Optional flag to run navigation in headless Chromium CDP mode', required: false }
        }
      },
      {
        id: 'browser.click',
        name: 'Browser Click DOM Element',
        category: 'BROWSER',
        description: 'Clicks a link or button on the active webpage using a validated selector or link text, verifying the postcondition.',
        permissionLevel: 'MEDIUM',
        isReadOnly: false,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          selector: { type: 'string', description: 'CSS selector (#id, [name=...]) or link text to click', required: true }
        }
      },
      {
        id: 'browser.type',
        name: 'Browser Type Text into Field',
        category: 'BROWSER',
        description: 'Enters text into a permitted form input or textarea on the active webpage and verifies the field value.',
        permissionLevel: 'MEDIUM',
        isReadOnly: false,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          selector: { type: 'string', description: 'CSS selector (#id, input[name=...]) of the target input field', required: true },
          text: { type: 'string', description: 'Text to enter into the field', required: true }
        }
      },
      {
        id: 'browser.search',
        name: 'Web Search',
        category: 'BROWSER',
        description: 'Searches the web via search engine query and extracts relevant search result listings and links.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          query: { type: 'string', description: 'Web search query phrase', required: true }
        }
      }
    ];

    builtIns.forEach(t => this.registerTool(t));

    // Register Titan Automation Tools
    const titanProvider = new TitanToolProvider();
    titanProvider.registerTools(this);
  }
}
