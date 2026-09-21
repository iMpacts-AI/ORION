import { Tool, ToolCall, ToolResult, PermissionLevel } from '../../shared/types';
import { TitanToolProvider } from './titan/TitanToolProvider';
import os from 'os';
import fs from 'fs';
import path from 'path';

export interface IToolRegistry {
  registerTool(tool: Tool): void;
  getTool(id: string): Tool | undefined;
  getAllTools(): Tool[];
  getToolsForPermission(maxLevel: PermissionLevel): Tool[];
}

export class ToolRegistry implements IToolRegistry {
  private tools: Map<string, Tool> = new Map();

  constructor() {
    this.registerBuiltInTools();
  }

  public registerTool(tool: Tool): void {
    if (!tool.id || !tool.name) {
      throw new Error('Tool registration error: Tool must possess an id and a name.');
    }
    this.tools.set(tool.id, tool);
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
        id: 'browser.navigate',
        name: 'Browser Navigate URL',
        category: 'BROWSER',
        description: 'Navigates to a web URL, retrieves page text content, page title, and clickable hyperlinks.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        isDangerous: false,
        supportsCancellation: true,
        parameters: {
          url: { type: 'string', description: 'Target HTTP/HTTPS URL', required: true }
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

