import { GeminiProvider, GroqProvider } from '../ProviderAdapters.js';
import { OrionAIProviderRouter } from '../OrionAIProviderRouter.js';
import { VisionService, CloudVisionAdapter } from '../VisionService.js';

class MockVisionAdapter extends GeminiProvider {
  constructor(private mockResponse: string, private shouldFail = false) {
    super();
    this.apiKey = 'mock-gemini-key';
    this.isConfigured = true;
    this.status.isConfigured = true;
    this.status.isHealthy = true;
  }

  public override getStatus() {
    return {
      ...this.status,
      isConfigured: true,
      isHealthy: true
    };
  }

  public async analyzeImage(prompt: string, imageDataUrl: string): Promise<string> {
    if (this.shouldFail) {
      throw new Error('Mock Vision Provider HTTP 500 Failure');
    }
    if (!imageDataUrl || !imageDataUrl.startsWith('data:image/')) {
      throw new Error('Invalid image data URL');
    }
    return this.mockResponse;
  }
}

class MockNonVisionAdapter extends GroqProvider {
  constructor() {
    super();
    this.apiKey = 'mock-groq-key';
    this.isConfigured = true;
    this.status.isConfigured = true;
    this.status.isHealthy = true;
  }

  public override getStatus() {
    return {
      ...this.status,
      isConfigured: true,
      isHealthy: true
    };
  }
}

async function runVisionIntegrationTests() {
  console.log('--- RUNNING PHASE B MULTIMODAL VISION INTEGRATION TESTS ---');
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

  const validDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  // Test 1: Multimodal payload validation & execution
  {
    const visionAdapter = new MockVisionAdapter('Detected: VS Code Editor with TypeScript code.');
    const router = new OrionAIProviderRouter();
    // Inject mock provider
    (router as any).providers = [visionAdapter];

    try {
      const result = await router.analyzeImage('What is on my screen?', validDataUrl);
      assert(result.includes('VS Code Editor'), 'Valid multimodal request returned analysis');
    } catch (e: any) {
      assert(false, `Valid multimodal request failed: ${e.message}`);
    }
  }

  // Test 2: Non-vision provider exclusion
  {
    const nonVision = new MockNonVisionAdapter();
    const router = new OrionAIProviderRouter();
    (router as any).providers = [nonVision];

    try {
      await router.analyzeImage('What is on my screen?', validDataUrl);
      assert(false, 'Non-vision provider should have been excluded from vision routing');
    } catch (e: any) {
      assert(e.message.includes('VISION NOT CONFIGURED'), 'Non-vision provider excluded correctly');
    }
  }

  // Test 3: Vision Provider Failover
  {
    const failingVision = new MockVisionAdapter('', true); // Fails
    const backupVision = new MockVisionAdapter('Backup Analysis: Desktop terminal active.');
    const router = new OrionAIProviderRouter();
    (router as any).providers = [failingVision, backupVision];

    try {
      const result = await router.analyzeImage('What is on my screen?', validDataUrl);
      assert(result.includes('Desktop terminal active'), 'Failed vision provider triggered automatic failover to backup vision provider');
    } catch (e: any) {
      assert(false, `Vision failover failed: ${e.message}`);
    }
  }

  // Test 4: Malformed and Oversized Image Data URL Handling
  {
    const visionAdapter = new MockVisionAdapter('Analysis');
    const router = new OrionAIProviderRouter();
    (router as any).providers = [visionAdapter];

    // Test malformed string
    try {
      await router.analyzeImage('Analyze', 'not-a-data-url');
      assert(false, 'Malformed data URL should be rejected');
    } catch (e: any) {
      assert(e.message.includes('Invalid') || e.message.includes('malformed'), 'Malformed image data URL rejected correctly');
    }

    // Test oversized string
    const giantDataUrl = 'data:image/png;base64,' + 'A'.repeat(16 * 1024 * 1024);
    try {
      await router.analyzeImage('Analyze', giantDataUrl);
      assert(false, 'Oversized image payload should be rejected');
    } catch (e: any) {
      assert(e.message.includes('exceeds maximum safety limit'), 'Oversized image payload rejected correctly');
    }
  }

  // Test 5: CloudVisionAdapter integration with VisionService
  {
    const mockVision = new MockVisionAdapter('Service Test Analysis: Active Chrome Browser window.');
    const router = new OrionAIProviderRouter();
    (router as any).providers = [mockVision];

    const cloudAdapter = new CloudVisionAdapter(router);
    const visionService = new VisionService(cloudAdapter);

    try {
      const res = await cloudAdapter.analyzeScreen(validDataUrl);
      assert(res.analysis.sceneSummary.includes('Active Chrome Browser'), 'CloudVisionAdapter cleanly integrated with VisionService');
    } catch (e: any) {
      assert(false, `CloudVisionAdapter integration failed: ${e.message}`);
    }
  }

  console.log(`\nPHASE B TEST RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runVisionIntegrationTests();
