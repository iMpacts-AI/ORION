import { OpenAICompatibleAdapter } from '../ProviderAdapters.js';
import { StreamTimeoutConfig } from '../SSEParser.js';

class MockStreamAdapter extends OpenAICompatibleAdapter {
  constructor(private mockResponseBody: ReadableStream<Uint8Array> | null, private mockHttpStatus = 200) {
    super({
      id: 'mock-provider',
      displayName: 'Mock Stream Provider',
      envKeyName: 'MOCK_KEY',
      baseUrl: 'https://mock.api',
      defaultModel: 'mock-model',
      capabilities: {
        supportsTools: true,
        supportsVision: false,
        supportsStreaming: true,
        maxContextTokens: 8192,
        taskCategories: ['FAST_CHAT']
      }
    });
    this.apiKey = 'mock-api-key';
    this.isConfigured = true;
  }

  public override reloadCredentials(): void {
    this.apiKey = 'mock-api-key';
    this.isConfigured = true;
    if (this.status) {
      this.status.isConfigured = true;
    }
  }

  // Override fetch execution to simulate HTTP stream behavior deterministically
  protected async fetchImpl(url: string, init?: RequestInit): Promise<Response> {
    if (this.mockHttpStatus !== 200) {
      return new Response('Mock HTTP Error', { status: this.mockHttpStatus });
    }
    return new Response(this.mockResponseBody, {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream' }
    });
  }
}

async function runStreamingIntegrationTests() {
  console.log('--- RUNNING REAL STREAMING & TIMEOUT INTEGRATION TESTS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // Test 1: Real ReadableStream SSE delivery
  {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"ORION"}}]}\n\n'));
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":" STREAM"}}]}\n\n'));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    });

    // Mock global fetch for this test scope
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });

    try {
      const adapter = new MockStreamAdapter(null);
      let tokens = '';
      const result = await adapter.stream('Hello', t => { tokens += t; });

      assert(tokens === 'ORION STREAM', 'Streaming tokens accumulated accurately');
      assert(result === 'ORION STREAM', 'Full stream response string returned');
    } finally {
      globalThis.fetch = originalFetch;
    }
  }

  // Test 2: Connection Timeout Enforcement
  {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (_, init) => {
      // Simulate hanging network connection
      return new Promise((_, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new Error('Aborted by signal'));
        });
      });
    };

    try {
      const adapter = new MockStreamAdapter(null);
      const timeouts: StreamTimeoutConfig = {
        connectionTimeoutMs: 100, // 100ms tight timeout for testing
        ttftTimeoutMs: 1000,
        idleStreamTimeoutMs: 1000
      };

      await adapter.stream('Test Timeout', () => {}, [], timeouts);
      assert(false, 'Connection timeout should have thrown an error');
    } catch (err: any) {
      assert(err.message.includes('Aborted') || err.message.includes('Timeout'), 'Connection timeout aborted hanging request cleanly');
    } finally {
      globalThis.fetch = originalFetch;
    }
  }

  // Test 3: External Cancellation Signal Enforcement
  {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"Start..."}}]}\n\n'));
        // Don't close, keep stream open
      }
    });

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response(stream, { status: 200 });

    try {
      const adapter = new MockStreamAdapter(null);
      const cancelController = new AbortController();

      const streamPromise = adapter.stream('Test Cancel', () => {}, [], undefined, cancelController.signal);

      // Trigger user cancellation after 50ms
      setTimeout(() => cancelController.abort(), 50);

      await streamPromise;
      assert(false, 'Cancelled stream should throw abort error');
    } catch (err: any) {
      assert(err.name === 'AbortError' || err.message.includes('Aborted'), 'External AbortSignal cancelled stream cleanly');
    } finally {
      globalThis.fetch = originalFetch;
    }
  }

  console.log(`\nINTEGRATION TEST RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runStreamingIntegrationTests();
