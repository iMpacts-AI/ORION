import { Tool, ToolParameterSchema } from '../shared/types';
import { ToolRegistry as CoreToolRegistry } from '../main/services/ToolRegistry';

export interface SchemaValidationOutcome {
  valid: boolean;
  normalizedArgs: Record<string, any>;
  errors: string[];
}

/**
 * Validates and normalizes tool arguments against both the canonical ORION ToolRegistry
 * and extended harness tool definitions (`atomic.*`, `shell.*`, `web.*`, `git.*`, `reminder.*`).
 */
export class ToolSchemas {
  private coreRegistry: CoreToolRegistry;
  private harnessTools: Map<string, Tool> = new Map();

  constructor(coreRegistry?: CoreToolRegistry) {
    this.coreRegistry = coreRegistry || new CoreToolRegistry();
    this.registerHarnessDefinitions();
  }

  private registerHarnessDefinitions(): void {
    const defs: Tool[] = [
      {
        id: 'atomic.read_file',
        name: 'Atomic Read File',
        category: 'FILE',
        description: 'Reads a workspace file with path containment and SHA-256 hash metadata.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        parameters: {
          filePath: { type: 'string', description: 'Workspace-relative or authorized file path', required: true },
          startLine: { type: 'number', description: 'Optional 1-based start line', required: false },
          endLine: { type: 'number', description: 'Optional 1-based inclusive end line', required: false }
        }
      },
      {
        id: 'atomic.list_dir',
        name: 'Atomic List Directory',
        category: 'FILE',
        description: 'Lists files and directories within an authorized workspace path.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        parameters: {
          dirPath: { type: 'string', description: 'Directory path to list', required: true }
        }
      },
      {
        id: 'atomic.search_files',
        name: 'Search Workspace Files',
        category: 'FILE',
        description: 'Searches file names or glob patterns within the workspace.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        parameters: {
          pattern: { type: 'string', description: 'Substring or glob pattern', required: true }
        }
      },
      {
        id: 'atomic.search_code',
        name: 'Search Workspace Code',
        category: 'FILE',
        description: 'Searches source code lines across workspace files.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        parameters: {
          query: { type: 'string', description: 'Text or regex pattern to search for', required: true }
        }
      },
      {
        id: 'atomic.write_file',
        name: 'Atomic Write File',
        category: 'FILE',
        description: 'Atomically creates or updates a workspace file using temp-file + rename and records a checkpoint.',
        permissionLevel: 'MEDIUM',
        isMutating: true,
        requiresApproval: true,
        parameters: {
          filePath: { type: 'string', description: 'Target workspace file path', required: true },
          content: { type: 'string', description: 'Full UTF-8 file content', required: true },
          expectedSha256: { type: 'string', description: 'Optional expected prior SHA-256 hash for conflict detection', required: false }
        }
      },
      {
        id: 'atomic.replace_string',
        name: 'Atomic Replace String',
        category: 'FILE',
        description: 'Replaces an exact target string in a workspace file after verifying expected match count and optional hash.',
        permissionLevel: 'MEDIUM',
        isMutating: true,
        requiresApproval: true,
        parameters: {
          filePath: { type: 'string', description: 'Target workspace file path', required: true },
          target: { type: 'string', description: 'Exact string to replace', required: true },
          replacement: { type: 'string', description: 'Replacement string', required: true },
          expectedMatches: { type: 'number', description: 'Expected occurrence count (default 1)', required: false },
          expectedSha256: { type: 'string', description: 'Optional expected prior SHA-256 hash', required: false }
        }
      },
      {
        id: 'atomic.apply_patch',
        name: 'Atomic Apply Patch',
        category: 'FILE',
        description: 'Applies a unified diff or multi-hunk patch to a workspace file atomically with conflict detection.',
        permissionLevel: 'MEDIUM',
        isMutating: true,
        requiresApproval: true,
        parameters: {
          filePath: { type: 'string', description: 'Target workspace file path', required: true },
          hunks: { type: 'array', description: 'Array of { target, replacement } hunks', required: true },
          expectedSha256: { type: 'string', description: 'Optional expected prior SHA-256 hash', required: false }
        }
      },
      {
        id: 'shell.execute',
        name: 'Supervised Shell Command',
        category: 'TERMINAL',
        description: 'Executes a command under ProcessSupervisor with bounded timeout, output truncation, and E-Stop control.',
        permissionLevel: 'HIGH',
        isMutating: true,
        requiresApproval: true,
        parameters: {
          command: { type: 'string', description: 'Executable or command to run', required: true },
          args: { type: 'array', description: 'Optional argument array', required: false },
          cwd: { type: 'string', description: 'Optional working directory inside workspace', required: false },
          timeoutMs: { type: 'number', description: 'Execution timeout in milliseconds', required: false }
        }
      },
      {
        id: 'web.search',
        name: 'Real Web Search',
        category: 'BROWSER',
        description: 'Searches the web via configured provider and returns real URLs, titles, and snippets.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        parameters: {
          query: { type: 'string', description: 'Search query', required: true },
          maxResults: { type: 'number', description: 'Maximum results to return', required: false }
        }
      },
      {
        id: 'web.fetch',
        name: 'Safe Web Fetch & Extract',
        category: 'BROWSER',
        description: 'Fetches a public web page with SSRF/private-network blocking, redirect revalidation, and script/style stripping.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        parameters: {
          url: { type: 'string', description: 'Public HTTP/HTTPS URL to fetch', required: true },
          timeoutMs: { type: 'number', description: 'Timeout in milliseconds', required: false }
        }
      },
      {
        id: 'reminder.create',
        name: 'Create Persistent Reminder',
        category: 'SYSTEM',
        description: 'Creates a persistent reminder with due time validation and OS notification scheduling.',
        permissionLevel: 'MEDIUM',
        isMutating: true,
        requiresApproval: false,
        parameters: {
          title: { type: 'string', description: 'Reminder message/title', required: true },
          dueAt: { type: 'string', description: 'ISO 8601 timestamp or relative time string (e.g. "+10m")', required: true },
          timeZone: { type: 'string', description: 'Optional IANA time zone', required: false }
        }
      },
      {
        id: 'reminder.list',
        name: 'List Persistent Reminders',
        category: 'SYSTEM',
        description: 'Lists all stored reminders and their delivery status.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        parameters: {}
      },
      {
        id: 'reminder.cancel',
        name: 'Cancel Persistent Reminder',
        category: 'SYSTEM',
        description: 'Cancels an active reminder by ID.',
        permissionLevel: 'MEDIUM',
        isMutating: true,
        requiresApproval: false,
        parameters: {
          reminderId: { type: 'string', description: 'Reminder ID to cancel', required: true }
        }
      },
      {
        id: 'git.status',
        name: 'Git Repository Status & Diff',
        category: 'DEVELOPER',
        description: 'Inspects Git status and diff without modifying the working tree.',
        permissionLevel: 'LOW',
        isReadOnly: true,
        parameters: {}
      },
      {
        id: 'git.checkpoint',
        name: 'Create Safe Workspace Checkpoint',
        category: 'DEVELOPER',
        description: 'Creates a non-destructive checkpoint of tracked and untracked agent-owned file changes.',
        permissionLevel: 'MEDIUM',
        isMutating: true,
        requiresApproval: false,
        parameters: {
          label: { type: 'string', description: 'Checkpoint description label', required: true }
        }
      }
    ];

    for (const d of defs) {
      this.harnessTools.set(d.id, d);
    }
  }

  public getToolDefinition(toolName: string): Tool | undefined {
    return this.harnessTools.get(toolName) || this.coreRegistry.getTool(toolName);
  }

  public getAllTools(): Tool[] {
    const core = this.coreRegistry.getAllTools();
    const combined = new Map<string, Tool>();
    for (const t of core) combined.set(t.id, t);
    for (const [id, t] of this.harnessTools.entries()) combined.set(id, t);
    return Array.from(combined.values());
  }

  public validateArguments(toolName: string, rawArgs: Record<string, any> | undefined | null): SchemaValidationOutcome {
    const tool = this.getToolDefinition(toolName);
    if (!tool) {
      return {
        valid: false,
        normalizedArgs: {},
        errors: [`UNKNOWN_TOOL: Tool '${toolName}' is not registered (default-deny).`]
      };
    }

    if (rawArgs !== undefined && rawArgs !== null && (typeof rawArgs !== 'object' || Array.isArray(rawArgs))) {
      return {
        valid: false,
        normalizedArgs: {},
        errors: [`SCHEMA_VALIDATION_FAILED: Arguments for '${toolName}' must be a JSON object.`]
      };
    }

    const args = { ...(rawArgs || {}) };
    const errors: string[] = [];
    const schemaParams: Record<string, ToolParameterSchema> = tool.parameters || {};

    for (const [paramName, spec] of Object.entries(schemaParams)) {
      const val = args[paramName];
      if (spec.required && (val === undefined || val === null || val === '')) {
        errors.push(`Missing required parameter '${paramName}' for tool '${toolName}'.`);
        continue;
      }
      if (val !== undefined && val !== null) {
        const actualType = Array.isArray(val) ? 'array' : typeof val;
        if (actualType !== spec.type) {
          errors.push(`Parameter '${paramName}' for tool '${toolName}' expected type '${spec.type}' but received '${actualType}'.`);
        }
        if (spec.enum && typeof val === 'string' && !spec.enum.includes(val)) {
          errors.push(`Parameter '${paramName}' value '${val}' is not in allowed enum [${spec.enum.join(', ')}].`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      normalizedArgs: args,
      errors
    };
  }
}
