import { spawn, ChildProcess } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Tool, ToolResult } from '../../shared/types';
import { ToolRegistry } from './ToolRegistry';
import { UnifiedMemoryManager } from './UnifiedMemoryManager';
import { ProcessSupervisor } from './computer/ProcessSupervisor';
import { eventBus } from '../../shared/events';

export type McpServerRuntimeState = 'CONFIGURED' | 'STARTING' | 'CONNECTED' | 'DISCONNECTED' | 'FAILED';

export interface McpServerConfig {
  name: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
  enabled?: boolean;
  trusted?: boolean;
}

export interface McpToolDefinition {
  name: string;
  description?: string;
  inputSchema?: Record<string, any>;
}

export interface McpServerStatus {
  name: string;
  command: string;
  args: string[];
  enabled: boolean;
  trusted: boolean;
  state: McpServerRuntimeState;
  pid?: number;
  protocolVersion?: string;
  serverInfo?: { name: string; version?: string };
  discoveredTools: McpToolDefinition[];
  lastError?: string;
  stderrSnippet?: string;
}

interface PendingRpcRequest {
  resolve: (result: any) => void;
  reject: (error: Error) => void;
  timer: NodeJS.Timeout;
}

interface ActiveMcpConnection {
  config: McpServerConfig;
  state: McpServerRuntimeState;
  process?: ChildProcess;
  protocolVersion?: string;
  serverInfo?: { name: string; version?: string };
  discoveredTools: McpToolDefinition[];
  lastError?: string;
  stderrBuffer: string;
  stdoutBuffer: string;
  nextRpcId: number;
  pending: Map<number, PendingRpcRequest>;
}

export class McpClientService {
  private connections: Map<string, ActiveMcpConnection> = new Map();
  private configPath: string;
  private toolRegistry?: ToolRegistry;
  private rpcTimeoutMs = 8000;

  private static readonly SAFE_CHILD_ENV_KEYS = [
    'PATH',
    'Path',
    'PATHEXT',
    'SystemRoot',
    'SYSTEMROOT',
    'WINDIR',
    'windir',
    'COMSPEC',
    'ComSpec',
    'TEMP',
    'TMP',
    'HOME',
    'USERPROFILE',
    'APPDATA',
    'LOCALAPPDATA',
    'LANG',
    'NODE_ENV'
  ];

  constructor(toolRegistry?: ToolRegistry, customConfigPath?: string) {
    this.toolRegistry = toolRegistry;
    const projectConfig = path.resolve(process.cwd(), '.orion', 'mcp.json');
    const userConfig = path.join(os.homedir(), '.orion', 'mcp.json');
    this.configPath = customConfigPath || (fs.existsSync(projectConfig) ? projectConfig : userConfig);
    this.reloadConfig();
  }

  public setRpcTimeoutMs(timeoutMs: number): void {
    this.rpcTimeoutMs = Math.max(100, timeoutMs);
  }

  public getRpcTimeoutMs(): number {
    return this.rpcTimeoutMs;
  }

  public static sanitizeUntrustedMcpString(raw: string): string {
    if (!raw) return '';
    const secretRedacted = UnifiedMemoryManager.sanitizeSecrets(String(raw));
    return secretRedacted
      .replace(/\x1b\][\s\S]*?(?:\x07|\x1b\\)/g, '')
      .replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '')
      .replace(/(?:ignore|disregard|forget)\s+(?:all\s+)?(?:previous\s+|prior\s+)?(?:instructions|directives|system\s+prompt)/gi, '[SANITIZED_MCP_UNTRUSTED_TEXT]')
      .replace(/system\s*override/gi, '[SANITIZED_MCP_UNTRUSTED_TEXT]')
      .replace(/developer\s+mode\s+enabled/gi, '[SANITIZED_MCP_UNTRUSTED_TEXT]')
      .replace(/you\s+now\s+have\s+unrestricted/gi, '[SANITIZED_MCP_UNTRUSTED_TEXT]');
  }

  public static sanitizeUntrustedMcpData(data: any): any {
    if (data === null || data === undefined) return data;
    if (typeof data === 'string') {
      return McpClientService.sanitizeUntrustedMcpString(data);
    }
    if (Array.isArray(data)) {
      return data.map(item => McpClientService.sanitizeUntrustedMcpData(item));
    }
    if (typeof data === 'object') {
      const cleaned: Record<string, any> = {};
      for (const [k, v] of Object.entries(data)) {
        cleaned[k] = McpClientService.sanitizeUntrustedMcpData(v);
      }
      return cleaned;
    }
    return data;
  }

  public static convertInputSchemaToParameters(inputSchema?: Record<string, any>): Record<
    string,
    { type: 'string' | 'number' | 'boolean' | 'object' | 'array'; description: string; required?: boolean; enum?: string[] }
  > {
    if (!inputSchema || typeof inputSchema !== 'object' || typeof inputSchema.properties !== 'object') {
      return {};
    }
    const requiredSet = new Set<string>(Array.isArray(inputSchema.required) ? inputSchema.required.map(String) : []);
    const params: Record<
      string,
      { type: 'string' | 'number' | 'boolean' | 'object' | 'array'; description: string; required?: boolean; enum?: string[] }
    > = {};

    for (const [propName, propSpec] of Object.entries<any>(inputSchema.properties)) {
      if (!propSpec || typeof propSpec !== 'object') continue;
      const rawType = String(propSpec.type || 'string').toLowerCase();
      const mappedType: 'string' | 'number' | 'boolean' | 'object' | 'array' =
        rawType === 'integer' || rawType === 'number'
          ? 'number'
          : rawType === 'boolean'
            ? 'boolean'
            : rawType === 'array'
              ? 'array'
              : rawType === 'object'
                ? 'object'
                : 'string';

      params[propName] = {
        type: mappedType,
        description: McpClientService.sanitizeUntrustedMcpString(propSpec.description || `Parameter ${propName}`),
        required: requiredSet.has(propName),
        ...(Array.isArray(propSpec.enum) ? { enum: propSpec.enum.map(String) } : {})
      };
    }

    return params;
  }

  public static validateMcpToolArguments(
    toolDef: McpToolDefinition,
    args: Record<string, any> | undefined
  ): { valid: boolean; errors: string[] } {
    const schema = toolDef.inputSchema;
    if (!schema || typeof schema !== 'object') {
      return { valid: true, errors: [] };
    }
    const safeArgs = args && typeof args === 'object' ? args : {};
    const errors: string[] = [];
    const requiredList: string[] = Array.isArray(schema.required) ? schema.required.map(String) : [];
    const properties: Record<string, any> = schema.properties && typeof schema.properties === 'object' ? schema.properties : {};

    for (const reqKey of requiredList) {
      const val = safeArgs[reqKey];
      if (val === undefined || val === null || val === '') {
        errors.push(`Missing required MCP argument '${reqKey}' for tool '${toolDef.name}'.`);
      }
    }

    for (const [argKey, argVal] of Object.entries(safeArgs)) {
      if (argVal === undefined || argVal === null) continue;
      const propSchema = properties[argKey];
      if (!propSchema || typeof propSchema !== 'object') {
        if (schema.additionalProperties === false) {
          errors.push(`Unknown argument '${argKey}' is not allowed by inputSchema for tool '${toolDef.name}'.`);
        }
        continue;
      }
      if (propSchema.type) {
        const expected = String(propSchema.type).toLowerCase();
        const actual = Array.isArray(argVal) ? 'array' : typeof argVal;
        const typeMatches =
          (expected === 'integer' && typeof argVal === 'number' && Number.isInteger(argVal)) ||
          (expected === 'number' && typeof argVal === 'number') ||
          expected === actual;
        if (!typeMatches) {
          errors.push(`MCP argument '${argKey}' for tool '${toolDef.name}' expected type '${expected}', got '${actual}'.`);
        }
      }
      if (Array.isArray(propSchema.enum) && !propSchema.enum.includes(argVal)) {
        errors.push(`MCP argument '${argKey}' value '${argVal}' is not in allowed enum [${propSchema.enum.join(', ')}].`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private buildMinimalChildEnv(customEnv?: Record<string, string>): NodeJS.ProcessEnv {
    const childEnv: NodeJS.ProcessEnv = {};
    for (const key of McpClientService.SAFE_CHILD_ENV_KEYS) {
      if (process.env[key] !== undefined) {
        childEnv[key] = process.env[key];
      }
    }
    if (customEnv && typeof customEnv === 'object') {
      for (const [k, v] of Object.entries(customEnv)) {
        if (typeof v === 'string') {
          childEnv[k] = v;
        }
      }
    }
    return childEnv;
  }

  public getConfigPath(): string {
    return this.configPath;
  }

  public reloadConfig(): void {
    if (!fs.existsSync(this.configPath)) {
      return;
    }

    try {
      const raw = fs.readFileSync(this.configPath, 'utf-8');
      const parsed = JSON.parse(raw);
      const serversObj = parsed.mcpServers || parsed;

      if (!serversObj || typeof serversObj !== 'object') {
        return;
      }

      for (const [name, entry] of Object.entries<any>(serversObj)) {
        if (!entry || typeof entry !== 'object' || typeof entry.command !== 'string') {
          continue;
        }
        // Only recognize authentic stdio server configs; ignore legacy mock entries with "orion-internal"
        if (entry.command === 'orion-internal' || entry.builtIn === true) {
          continue;
        }

        const existing = this.connections.get(name);
        if (!existing || existing.state === 'CONFIGURED' || existing.state === 'DISCONNECTED' || existing.state === 'FAILED') {
          this.connections.set(name, {
            config: {
              name,
              command: entry.command,
              args: Array.isArray(entry.args) ? entry.args.map(String) : [],
              env: entry.env && typeof entry.env === 'object' ? entry.env : undefined,
              cwd: typeof entry.cwd === 'string' ? entry.cwd : undefined,
              enabled: entry.enabled !== false,
              trusted: entry.trusted === true
            },
            state: 'CONFIGURED',
            discoveredTools: [],
            stderrBuffer: '',
            stdoutBuffer: '',
            nextRpcId: 1,
            pending: new Map()
          });
        }
      }
    } catch (err: any) {
      eventBus.logActivity('ERROR_EVENT', `Failed to parse MCP configuration at ${this.configPath}: ${err.message}`);
    }
  }

  public saveConfig(): void {
    const dir = path.dirname(this.configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const mcpServers: Record<string, any> = {};
    for (const [name, conn] of this.connections.entries()) {
      mcpServers[name] = {
        command: conn.config.command,
        args: conn.config.args || [],
        enabled: conn.config.enabled !== false,
        trusted: conn.config.trusted === true,
        ...(conn.config.cwd ? { cwd: conn.config.cwd } : {})
      };
    }
    fs.writeFileSync(this.configPath, JSON.stringify({ mcpServers }, null, 2), 'utf-8');
  }

  public addServerConfig(config: McpServerConfig): McpServerStatus {
    if (!config.name || !/^[a-zA-Z0-9_-]+$/.test(config.name)) {
      throw new Error('Invalid MCP server name. Use alphanumeric characters, hyphens, or underscores.');
    }
    if (!config.command || /[;&|`$\r\n]/.test(config.command)) {
      throw new Error('Invalid or unsafe MCP server command.');
    }

    const conn: ActiveMcpConnection = {
      config: {
        name: config.name,
        command: config.command,
        args: config.args || [],
        env: config.env,
        cwd: config.cwd,
        enabled: config.enabled !== false,
        trusted: config.trusted === true
      },
      state: 'CONFIGURED',
      discoveredTools: [],
      stderrBuffer: '',
      stdoutBuffer: '',
      nextRpcId: 1,
      pending: new Map()
    };

    this.connections.set(config.name, conn);
    this.saveConfig();
    return this.toStatus(conn);
  }

  public removeServerConfig(name: string): boolean {
    const conn = this.connections.get(name);
    if (!conn) return false;
    this.disconnectServer(name);
    this.connections.delete(name);
    this.saveConfig();
    return true;
  }

  public getAllStatuses(): McpServerStatus[] {
    return Array.from(this.connections.values()).map(c => this.toStatus(c));
  }

  public getServerStatus(name: string): McpServerStatus | undefined {
    const conn = this.connections.get(name);
    return conn ? this.toStatus(conn) : undefined;
  }

  public async connectServer(name: string, explicitUserApproval = false): Promise<McpServerStatus> {
    const conn = this.connections.get(name);
    if (!conn) {
      throw new Error(`MCP server '${name}' is not configured.`);
    }
    if (conn.state === 'CONNECTED') {
      return this.toStatus(conn);
    }
    if (!conn.config.trusted && !explicitUserApproval) {
      conn.state = 'FAILED';
      conn.lastError = `SECURITY ENFORCEMENT: MCP server '${name}' (${conn.config.command}) requires explicit operator approval before spawning an external process.`;
      return this.toStatus(conn);
    }

    conn.state = 'STARTING';
    conn.lastError = undefined;
    conn.stderrBuffer = '';
    conn.stdoutBuffer = '';

    try {
      const cmd = process.platform === 'win32' && conn.config.command === 'npx' ? 'npx.cmd' :
                  (process.platform === 'win32' && conn.config.command === 'npm' ? 'npm.cmd' : conn.config.command);

      const child = spawn(cmd, conn.config.args || [], {
        cwd: conn.config.cwd || process.cwd(),
        env: this.buildMinimalChildEnv(conn.config.env),
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: false
      });

      conn.process = child;
      ProcessSupervisor.getInstance().registerProcess(`mcp_${name}`, `${cmd} ${(conn.config.args || []).join(' ')}`, child);

      child.stderr?.on('data', (chunk: Buffer) => {
        conn.stderrBuffer = (conn.stderrBuffer + chunk.toString('utf8')).slice(-2000);
      });

      child.stdout?.on('data', (chunk: Buffer) => {
        this.handleStdoutChunk(conn, chunk.toString('utf8'));
      });

      child.on('error', (err: Error) => {
        conn.state = 'FAILED';
        conn.lastError = `Process spawn error: ${err.message}`;
        this.rejectAllPending(conn, new Error(conn.lastError));
      });

      child.on('exit', (code: number | null) => {
        if (conn.state === 'CONNECTED' || conn.state === 'STARTING') {
          conn.state = 'FAILED';
          conn.lastError = `MCP process exited unexpectedly with code ${code}`;
        }
        this.rejectAllPending(conn, new Error(conn.lastError || 'MCP process exited'));
      });

      // 1. JSON-RPC 2.0 initialize handshake
      const initResult = await this.sendRpcRequest(conn, 'initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'ORION-CLI', version: '2.0.0' }
      });

      conn.protocolVersion = initResult?.protocolVersion || '2024-11-05';
      conn.serverInfo = initResult?.serverInfo;

      // 2. Send notifications/initialized
      this.sendRpcNotification(conn, 'notifications/initialized', {});

      // 3. Discover tools via tools/list and sanitize untrusted descriptions
      const toolsResp = await this.sendRpcRequest(conn, 'tools/list', {});
      const rawTools = Array.isArray(toolsResp?.tools) ? toolsResp.tools : [];
      conn.discoveredTools = rawTools
        .filter((t: any) => t && typeof t.name === 'string')
        .map((t: any) => ({
          name: String(t.name),
          description:
            typeof t.description === 'string'
              ? `[UNTRUSTED_MCP_TOOL] ${McpClientService.sanitizeUntrustedMcpString(t.description)}`
              : '[UNTRUSTED_MCP_TOOL] MCP server tool',
          inputSchema: t.inputSchema && typeof t.inputSchema === 'object' ? t.inputSchema : {}
        }));

      conn.state = 'CONNECTED';

      // Register discovered tools in ORION ToolRegistry with namespaced IDs and converted parameter schemas
      if (this.toolRegistry) {
        for (const t of conn.discoveredTools) {
          const toolId = `mcp.${name}.${t.name}`;
          const registeredTool: Tool = {
            id: toolId,
            name: `[MCP:${name}] ${t.name}`,
            category: 'AUTOMATION',
            description: t.description || `MCP tool ${t.name} from server ${name}`,
            permissionLevel: 'HIGH',
            isReadOnly: false,
            isDangerous: false,
            requiresApproval: true,
            supportsCancellation: true,
            parameters: McpClientService.convertInputSchemaToParameters(t.inputSchema)
          };
          this.toolRegistry.registerTool(registeredTool);
        }
      }

      eventBus.logActivity('SYSTEM_EVENT', `Connected MCP server '${name}' (${conn.discoveredTools.length} tools discovered).`);
      return this.toStatus(conn);
    } catch (err: any) {
      conn.state = 'FAILED';
      conn.lastError = err.message;
      this.disconnectServer(name, true);
      return this.toStatus(conn);
    }
  }

  public async callTool(serverName: string, toolName: string, args: Record<string, any> = {}): Promise<ToolResult> {
    const startTime = Date.now();
    const conn = this.connections.get(serverName);
    if (!conn) {
      return {
        toolCallId: `mcp_${Date.now()}`,
        toolId: `mcp.${serverName}.${toolName}`,
        success: false,
        verificationStatus: 'FAILED',
        verified: false,
        error: `MCP server '${serverName}' is not configured.`,
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }

    if (conn.state !== 'CONNECTED') {
      return {
        toolCallId: `mcp_${Date.now()}`,
        toolId: `mcp.${serverName}.${toolName}`,
        success: false,
        verificationStatus: 'FAILED',
        verified: false,
        error: `MCP server '${serverName}' is ${conn.state} (not CONNECTED). Connect it first via '/mcp connect ${serverName}'.`,
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }

    // Validate tool existence and argument schema before dispatching over stdio
    const toolDef = conn.discoveredTools.find(t => t.name === toolName);
    if (!toolDef) {
      return {
        toolCallId: `mcp_${Date.now()}`,
        toolId: `mcp.${serverName}.${toolName}`,
        success: false,
        verificationStatus: 'FAILED',
        verified: false,
        error: `MCP tool '${toolName}' is not advertised by server '${serverName}'.`,
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }

    const argValidation = McpClientService.validateMcpToolArguments(toolDef, args);
    if (!argValidation.valid) {
      return {
        toolCallId: `mcp_${Date.now()}`,
        toolId: `mcp.${serverName}.${toolName}`,
        success: false,
        verificationStatus: 'FAILED',
        verified: false,
        error: `MCP argument validation failed: ${argValidation.errors.join(' ')}`,
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }

    try {
      const response = await this.sendRpcRequest(conn, 'tools/call', {
        name: toolName,
        arguments: args
      });

      const isError = response?.isError === true;
      const sanitizedData = McpClientService.sanitizeUntrustedMcpData(response?.content || response);
      return {
        toolCallId: `mcp_${Date.now()}`,
        toolId: `mcp.${serverName}.${toolName}`,
        success: !isError,
        verificationStatus: !isError ? 'VERIFIED' : 'FAILED',
        verified: !isError,
        data: sanitizedData,
        error: isError ? JSON.stringify(sanitizedData || 'MCP tool returned error') : undefined,
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    } catch (err: any) {
      return {
        toolCallId: `mcp_${Date.now()}`,
        toolId: `mcp.${serverName}.${toolName}`,
        success: false,
        verificationStatus: 'FAILED',
        verified: false,
        error: `MCP tool invocation failed: ${err.message}`,
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }
  }

  public disconnectServer(name: string, preserveFailedState = false): void {
    const conn = this.connections.get(name);
    if (!conn) return;

    this.rejectAllPending(conn, new Error(`MCP server '${name}' disconnected.`));
    if (conn.process) {
      try {
        conn.process.kill();
      } catch {}
      ProcessSupervisor.getInstance().unregisterProcess(`mcp_${name}`);
      conn.process = undefined;
    }
    if (!preserveFailedState) {
      conn.state = 'DISCONNECTED';
    }
  }

  public shutdownAll(): void {
    for (const name of this.connections.keys()) {
      this.disconnectServer(name);
    }
  }

  private handleStdoutChunk(conn: ActiveMcpConnection, chunk: string): void {
    conn.stdoutBuffer += chunk;
    let newlineIdx: number;
    while ((newlineIdx = conn.stdoutBuffer.indexOf('\n')) !== -1) {
      const line = conn.stdoutBuffer.slice(0, newlineIdx).trim();
      conn.stdoutBuffer = conn.stdoutBuffer.slice(newlineIdx + 1);
      if (!line) continue;

      try {
        const msg = JSON.parse(line);
        if (typeof msg.id === 'number' && conn.pending.has(msg.id)) {
          const req = conn.pending.get(msg.id)!;
          clearTimeout(req.timer);
          conn.pending.delete(msg.id);
          if (msg.error) {
            req.reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          } else {
            req.resolve(msg.result);
          }
        }
      } catch {
        // Ignore non-JSON stdout banner lines
      }
    }
  }

  private sendRpcRequest(conn: ActiveMcpConnection, method: string, params: Record<string, any>): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!conn.process || !conn.process.stdin || conn.process.killed) {
        return reject(new Error(`MCP server '${conn.config.name}' stdin is not writable.`));
      }

      const id = conn.nextRpcId++;
      const timer = setTimeout(() => {
        conn.pending.delete(id);
        reject(new Error(`MCP RPC '${method}' timed out after ${this.rpcTimeoutMs}ms.`));
      }, this.rpcTimeoutMs);

      conn.pending.set(id, { resolve, reject, timer });

      const payload = JSON.stringify({
        jsonrpc: '2.0',
        id,
        method,
        params
      }) + '\n';

      conn.process.stdin.write(payload, 'utf8', (err) => {
        if (err) {
          clearTimeout(timer);
          conn.pending.delete(id);
          reject(err);
        }
      });
    });
  }

  private sendRpcNotification(conn: ActiveMcpConnection, method: string, params: Record<string, any>): void {
    if (!conn.process || !conn.process.stdin || conn.process.killed) return;
    const payload = JSON.stringify({
      jsonrpc: '2.0',
      method,
      params
    }) + '\n';
    conn.process.stdin.write(payload, 'utf8');
  }

  private rejectAllPending(conn: ActiveMcpConnection, error: Error): void {
    for (const [, req] of conn.pending.entries()) {
      clearTimeout(req.timer);
      req.reject(error);
    }
    conn.pending.clear();
  }

  private toStatus(conn: ActiveMcpConnection): McpServerStatus {
    return {
      name: conn.config.name,
      command: conn.config.command,
      args: conn.config.args || [],
      enabled: conn.config.enabled !== false,
      trusted: conn.config.trusted === true,
      state: conn.state,
      pid: conn.process?.pid,
      protocolVersion: conn.protocolVersion,
      serverInfo: conn.serverInfo,
      discoveredTools: [...conn.discoveredTools],
      lastError: conn.lastError,
      stderrSnippet: conn.stderrBuffer ? conn.stderrBuffer.trim().slice(-300) : undefined
    };
  }
}
