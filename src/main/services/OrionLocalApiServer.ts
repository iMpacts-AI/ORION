import http from 'http';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { OrionAIProviderRouter } from './OrionAIProviderRouter';
import { OllamaProvider } from './ProviderAdapters';
import { UnifiedMemoryManager } from './UnifiedMemoryManager';

export interface LocalApiServerConfig {
  host?: string;
  port?: number;
  requireAuth?: boolean;
  allowLan?: boolean;
  configFilePath?: string;
  requestTimeoutMs?: number;
  maxBodyBytes?: number;
}

export interface PersistedApiKeyConfig {
  keyId: string;
  keyHashSha256: string;
  keyPrefix: string;
  createdAt: number;
  requireAuth: boolean;
  host: string;
  port: number;
}

export interface LocalApiServerStatus {
  running: boolean;
  host: string;
  port: number;
  baseUrl: string;
  requireAuth: boolean;
  keyConfigured: boolean;
  keyPrefix: string;
  activeRequests: number;
  totalRequestsServed: number;
  modelAliases: Record<string, string>;
}

/**
 * Optional OpenAI-Compatible Local API Server backed by ORION & Local Ollama (Section 9).
 * - Binds strictly to `127.0.0.1` by default (LAN exposure requires explicit `allowLan: true`).
 * - Supports `GET /v1/models`, `POST /v1/chat/completions` (both JSON and SSE `stream: true`),
 *   and `GET /health`.
 * - Supports model aliases (`orion-default`, `orion-fast`, `orion-coder`, `orion-coder-fast`,
 *   `orion-reasoner`, `orion-vision`, `gpt-4o`, `gpt-4o-mini`, `claude-3-5-sonnet`) mapped to the
 *   6 installed local Ollama models so external coding harnesses can connect with zero API spend.
 * - Supports local compatibility API key generation, rotation, and SHA-256 verification without
 *   storing raw keys in logs or traces.
 */
export class OrionLocalApiServer {
  private router: OrionAIProviderRouter;
  private server: http.Server | null = null;
  private host: string;
  private port: number;
  private requireAuth: boolean;
  private allowLan: boolean;
  private configFilePath: string;
  private requestTimeoutMs: number;
  private maxBodyBytes: number;
  private activeRequests = 0;
  private totalRequestsServed = 0;
  private keyRecord: PersistedApiKeyConfig | null = null;
  private inMemoryCompatibilityKey: string | null = null;

  public static readonly MODEL_ALIASES: Record<string, string> = {
    'orion-default': 'llama3.1:8b',
    'orion-core': 'llama3.1:8b',
    'orion-fast': 'llama3.1:8b',
    'orion-coder': 'qwen3-coder:30b',
    'orion-coder-fast': 'qwen2.5-coder:7b',
    'orion-engineer': 'qwen2.5-coder:7b',
    'orion-reasoner': 'deepseek-r1:14b',
    'orion-auditor': 'deepseek-r1:14b',
    'orion-research': 'gpt-oss:20b',
    'orion-vision': 'gemma4:26b',
    'gpt-4o': 'qwen3-coder:30b',
    'gpt-4o-mini': 'llama3.1:8b',
    'claude-3-5-sonnet': 'qwen2.5-coder:7b'
  };

  constructor(router: OrionAIProviderRouter, options: LocalApiServerConfig = {}) {
    this.router = router;
    this.allowLan = Boolean(options.allowLan);
    const requestedHost = options.host || '127.0.0.1';
    if (!this.allowLan && requestedHost !== '127.0.0.1' && requestedHost !== 'localhost') {
      throw new Error(
        `SECURITY POLICY VIOLATION: OrionLocalApiServer binds strictly to 127.0.0.1 by default. Refusing to bind to '${requestedHost}' without explicit allowLan=true.`
      );
    }
    this.host = requestedHost === 'localhost' ? '127.0.0.1' : requestedHost;
    this.port = options.port ?? 11435;
    this.requireAuth = options.requireAuth ?? true;
    this.requestTimeoutMs = options.requestTimeoutMs ?? 60000;
    this.maxBodyBytes = options.maxBodyBytes ?? 2 * 1024 * 1024;
    this.configFilePath =
      options.configFilePath || path.resolve(process.cwd(), '.orion_memory', 'local_api_config.json');
    this.loadPersistedConfig();
  }

  private loadPersistedConfig(): void {
    if (fs.existsSync(this.configFilePath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(this.configFilePath, 'utf8')) as PersistedApiKeyConfig;
        if (parsed && typeof parsed.keyHashSha256 === 'string') {
          this.keyRecord = parsed;
          this.requireAuth = parsed.requireAuth ?? this.requireAuth;
        }
      } catch {}
    }
  }

  private savePersistedConfig(): void {
    if (!this.keyRecord) return;
    try {
      const dir = path.dirname(this.configFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.configFilePath, JSON.stringify(this.keyRecord, null, 2), 'utf8');
    } catch {}
  }

  /**
   * Generates or rotates a local compatibility API key (`orion-local-...`).
   * Only the SHA-256 digest and a 16-char prefix are persisted to disk.
   */
  public generateOrRotateCompatibilityKey(): {
    rawKey: string;
    keyId: string;
    keyPrefix: string;
    createdAt: number;
  } {
    const randomPart = crypto.randomBytes(18).toString('base64url');
    const rawKey = `orion-local-${randomPart}`;
    const keyHashSha256 = crypto.createHash('sha256').update(rawKey, 'utf8').digest('hex');
    const keyId = `key_${Date.now().toString(36)}`;
    const keyPrefix = `${rawKey.slice(0, 15)}...`;

    this.inMemoryCompatibilityKey = rawKey;
    this.keyRecord = {
      keyId,
      keyHashSha256,
      keyPrefix,
      createdAt: Date.now(),
      requireAuth: this.requireAuth,
      host: this.host,
      port: this.port
    };
    this.savePersistedConfig();

    return {
      rawKey,
      keyId,
      keyPrefix,
      createdAt: this.keyRecord.createdAt
    };
  }

  public setCompatibilityKey(customKey: string): { keyId: string; keyPrefix: string } {
    const trimmed = customKey.trim();
    if (trimmed.length < 8) {
      throw new Error('Local compatibility API key must be at least 8 characters.');
    }
    const keyHashSha256 = crypto.createHash('sha256').update(trimmed, 'utf8').digest('hex');
    const keyId = `key_${Date.now().toString(36)}`;
    const keyPrefix = `${trimmed.slice(0, Math.min(12, trimmed.length))}...`;
    this.inMemoryCompatibilityKey = trimmed;
    this.keyRecord = {
      keyId,
      keyHashSha256,
      keyPrefix,
      createdAt: Date.now(),
      requireAuth: this.requireAuth,
      host: this.host,
      port: this.port
    };
    this.savePersistedConfig();
    return { keyId, keyPrefix };
  }

  public setRequireAuth(enabled: boolean): void {
    this.requireAuth = enabled;
    if (this.keyRecord) {
      this.keyRecord.requireAuth = enabled;
      this.savePersistedConfig();
    }
  }

  public verifyAuthorizationHeader(authHeader?: string): boolean {
    if (!this.requireAuth) return true;
    if (!this.keyRecord) {
      // Auto-initialize a default key if requireAuth is enabled but no key exists yet
      this.generateOrRotateCompatibilityKey();
    }
    if (!authHeader || typeof authHeader !== 'string') return false;
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    const token = match ? match[1].trim() : authHeader.trim();
    if (!token) return false;
    const candidateHash = crypto.createHash('sha256').update(token, 'utf8').digest('hex');
    return candidateHash === this.keyRecord?.keyHashSha256;
  }

  public resolveModelId(requestedModel?: string): string {
    if (!requestedModel || typeof requestedModel !== 'string') {
      return 'llama3.1:8b';
    }
    const trimmed = requestedModel.trim();
    if (OrionLocalApiServer.MODEL_ALIASES[trimmed]) {
      return OrionLocalApiServer.MODEL_ALIASES[trimmed];
    }
    return trimmed;
  }

  public getStatus(): LocalApiServerStatus {
    return {
      running: Boolean(this.server && this.server.listening),
      host: this.host,
      port: this.port,
      baseUrl: `http://${this.host}:${this.port}/v1`,
      requireAuth: this.requireAuth,
      keyConfigured: Boolean(this.keyRecord),
      keyPrefix: this.keyRecord?.keyPrefix || '(not generated)',
      activeRequests: this.activeRequests,
      totalRequestsServed: this.totalRequestsServed,
      modelAliases: { ...OrionLocalApiServer.MODEL_ALIASES }
    };
  }

  public async start(customPort?: number): Promise<LocalApiServerStatus> {
    if (this.server && this.server.listening) {
      return this.getStatus();
    }
    if (customPort !== undefined) {
      this.port = customPort;
    }
    if (this.requireAuth && !this.keyRecord) {
      this.generateOrRotateCompatibilityKey();
    }

    this.server = http.createServer((req, res) => {
      void this.handleRequest(req, res);
    });

    await new Promise<void>((resolve, reject) => {
      this.server!.once('error', reject);
      this.server!.listen(this.port, this.host, () => {
        const addr = this.server!.address();
        if (addr && typeof addr === 'object') {
          this.port = addr.port;
        }
        resolve();
      });
    });

    return this.getStatus();
  }

  public async stop(): Promise<void> {
    if (!this.server) return;
    const srv = this.server;
    this.server = null;
    await new Promise<void>((resolve) => {
      srv.close(() => resolve());
    });
  }

  private sendJson(res: http.ServerResponse, statusCode: number, payload: any): void {
    if (res.writableEnded) return;
    res.writeHead(statusCode, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    });
    res.end(JSON.stringify(payload));
  }

  private async readJsonBody(req: http.IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let bytes = 0;
      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer) => {
        bytes += chunk.length;
        if (bytes > this.maxBodyBytes) {
          req.destroy();
          reject(new Error(`Request body exceeds limit (${this.maxBodyBytes} bytes).`));
          return;
        }
        chunks.push(chunk);
      });
      req.on('end', () => {
        try {
          const raw = Buffer.concat(chunks).toString('utf8');
          resolve(raw ? JSON.parse(raw) : {});
        } catch {
          reject(new Error('Invalid JSON request body.'));
        }
      });
      req.on('error', reject);
    });
  }

  private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const method = (req.method || 'GET').toUpperCase();
    const urlPath = (req.url || '/').split('?')[0];

    if (urlPath === '/health' || urlPath === '/v1/health') {
      this.sendJson(res, 200, {
        status: 'ok',
        service: 'orion-local-openai-api',
        host: this.host,
        port: this.port
      });
      return;
    }

    // Verify local compatibility API key if requireAuth is enabled
    const authHeader = req.headers['authorization'] || (req.headers['x-api-key'] as string | undefined);
    if (!this.verifyAuthorizationHeader(authHeader)) {
      this.sendJson(res, 401, {
        error: {
          message: 'Unauthorized: Missing or invalid ORION local compatibility API key. Generate one with `orion /api key-gen`.',
          type: 'authentication_error',
          code: 'invalid_api_key'
        }
      });
      return;
    }

    if (method === 'GET' && urlPath === '/v1/models') {
      this.totalRequestsServed++;
      const ollama = this.router.getOllamaProvider();
      await ollama?.probeHealth(400);
      const installed = ollama?.getInstalledModels() || [];

      const modelList = [
        {
          id: 'llama3.1:8b',
          object: 'model',
          created: 1729800000,
          owned_by: 'ollama-local',
          capabilities: { completion: true, tools: true, vision: false, max_context_tokens: 131072 }
        },
        {
          id: 'qwen2.5-coder:7b',
          object: 'model',
          created: 1729800000,
          owned_by: 'ollama-local',
          capabilities: { completion: true, tools: true, vision: false, max_context_tokens: 32768 }
        },
        {
          id: 'deepseek-r1:14b',
          object: 'model',
          created: 1729800000,
          owned_by: 'ollama-local',
          capabilities: { completion: true, tools: true, thinking: true, vision: false, max_context_tokens: 131072 }
        },
        {
          id: 'gpt-oss:20b',
          object: 'model',
          created: 1729800000,
          owned_by: 'ollama-local',
          capabilities: { completion: true, tools: true, thinking: true, vision: false, max_context_tokens: 131072 }
        },
        {
          id: 'gemma4:26b',
          object: 'model',
          created: 1729800000,
          owned_by: 'ollama-local',
          capabilities: { completion: true, tools: true, thinking: true, vision: true, max_context_tokens: 262144 }
        },
        {
          id: 'qwen3-coder:30b',
          object: 'model',
          created: 1729800000,
          owned_by: 'ollama-local',
          capabilities: { completion: true, tools: true, vision: false, max_context_tokens: 262144 }
        },
        ...Object.entries(OrionLocalApiServer.MODEL_ALIASES).map(([alias, target]) => ({
          id: alias,
          object: 'model',
          created: 1729800000,
          owned_by: 'orion-alias',
          root: target
        }))
      ];

      this.sendJson(res, 200, {
        object: 'list',
        data: modelList,
        installedCount: installed.length || 6
      });
      return;
    }

    if (method === 'POST' && urlPath === '/v1/chat/completions') {
      this.activeRequests++;
      this.totalRequestsServed++;
      const abortController = new AbortController();
      req.on('close', () => {
        if (!res.writableEnded) {
          abortController.abort();
        }
      });

      const timer = setTimeout(() => {
        abortController.abort();
      }, this.requestTimeoutMs);

      try {
        const body = await this.readJsonBody(req);
        const messages: Array<{ role: string; content: string }> = Array.isArray(body?.messages) ? body.messages : [];
        if (messages.length === 0) {
          this.sendJson(res, 400, {
            error: {
              message: 'Invalid request: `messages` array is required and must be non-empty.',
              type: 'invalid_request_error',
              code: 'missing_messages'
            }
          });
          return;
        }

        const resolvedModel = this.resolveModelId(body.model);
        const isStream = Boolean(body.stream);
        const lastMsg = messages[messages.length - 1];
        const promptText = typeof lastMsg?.content === 'string' ? lastMsg.content : JSON.stringify(lastMsg?.content || '');
        const history = messages.slice(0, -1).map(m => ({
          role: String(m.role || 'user'),
          content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content || '')
        }));

        const ollama = this.router.getOllamaProvider() || new OllamaProvider();
        ollama.setModel(resolvedModel);

        const completionId = `chatcmpl_orion_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
        const created = Math.floor(Date.now() / 1000);

        if (isStream) {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive'
          });

          const writeSseChunk = (deltaObj: Record<string, any>, finishReason: string | null = null) => {
            if (res.writableEnded) return;
            const frame = {
              id: completionId,
              object: 'chat.completion.chunk',
              created,
              model: resolvedModel,
              choices: [
                {
                  index: 0,
                  delta: deltaObj,
                  finish_reason: finishReason
                }
              ]
            };
            res.write(`data: ${JSON.stringify(frame)}\n\n`);
          };

          writeSseChunk({ role: 'assistant' }, null);

          let fullContent = '';
          try {
            const reachable = await ollama.probeHealth(400, abortController.signal);
            if (reachable && body.useHeuristicFallback !== true) {
              fullContent = await ollama.stream(
                promptText,
                (tok) => {
                  writeSseChunk({ content: tok }, null);
                },
                history,
                undefined,
                abortController.signal
              );
            } else {
              fullContent = await this.router.chat(promptText, history);
              writeSseChunk({ content: fullContent }, null);
            }
          } catch (streamErr: any) {
            if (!fullContent) {
              fullContent = await this.router.chat(promptText, history);
              writeSseChunk({ content: fullContent }, null);
            }
          }

          writeSseChunk({}, 'stop');
          if (!res.writableEnded) {
            res.write('data: [DONE]\n\n');
            res.end();
          }
          return;
        }

        // Non-streaming completion
        let replyText = '';
        try {
          const reachable = await ollama.probeHealth(400, abortController.signal);
          if (reachable && body.useHeuristicFallback !== true) {
            replyText = await ollama.chat(promptText, history);
          } else {
            replyText = await this.router.chat(promptText, history);
          }
        } catch {
          replyText = await this.router.chat(promptText, history);
        }

        const sanitizedReply = UnifiedMemoryManager.sanitizeSecrets(replyText);
        const promptTokens = Math.ceil(promptText.length / 4);
        const completionTokens = Math.ceil(sanitizedReply.length / 4);

        this.sendJson(res, 200, {
          id: completionId,
          object: 'chat.completion',
          created,
          model: resolvedModel,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: sanitizedReply
              },
              finish_reason: 'stop'
            }
          ],
          usage: {
            prompt_tokens: promptTokens,
            completion_tokens: completionTokens,
            total_tokens: promptTokens + completionTokens
          }
        });
      } catch (err: any) {
        this.sendJson(res, 400, {
          error: {
            message: UnifiedMemoryManager.sanitizeSecrets(err?.message || 'Request failed'),
            type: 'invalid_request_error'
          }
        });
      } finally {
        clearTimeout(timer);
        this.activeRequests = Math.max(0, this.activeRequests - 1);
      }
      return;
    }

    this.sendJson(res, 404, {
      error: {
        message: `Endpoint '${method} ${urlPath}' not found on ORION Local API Server. Supported: GET /v1/models, POST /v1/chat/completions.`,
        type: 'invalid_request_error',
        code: 'not_found'
      }
    });
  }
}
