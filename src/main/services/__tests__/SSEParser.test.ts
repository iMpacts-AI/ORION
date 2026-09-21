import { SSEParser } from '../SSEParser.js';

function runTests() {
  console.log('--- RUNNING SSE PARSER & STREAM TIMEOUT TESTS ---');
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

  // Test 1: Single event in one chunk
  {
    const parser = new SSEParser();
    const events = parser.parseChunk('data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n');
    assert(events.length === 1 && events[0].data.includes('Hello'), 'Single event in single chunk');
  }

  // Test 2: Multiple events in single chunk
  {
    const parser = new SSEParser();
    const events = parser.parseChunk(
      'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\ndata: {"choices":[{"delta":{"content":" World"}}]}\n\n'
    );
    assert(events.length === 2, 'Multiple events in single chunk');
  }

  // Test 3: Event split across multiple network chunks
  {
    const parser = new SSEParser();
    const chunk1 = parser.parseChunk('data: {"choices":[{"delta":');
    assert(chunk1.length === 0, 'Partial chunk 1 yields 0 events');
    const chunk2 = parser.parseChunk('{"content":"Split"}}]}\n\n');
    assert(chunk2.length === 1 && chunk2[0].data.includes('Split'), 'Completing chunk yields event');
  }

  // Test 4: [DONE] marker
  {
    const parser = new SSEParser();
    const events = parser.parseChunk('data: [DONE]\n\n');
    assert(events.length === 1 && events[0].data === '[DONE]', '[DONE] marker parsing');
  }

  // Test 5: Malformed event handling & comments
  {
    const parser = new SSEParser();
    const events = parser.parseChunk(': ping comment\ndata: valid\n\n');
    assert(events.length === 1 && events[0].data === 'valid', 'Comments ignored, valid event extracted');
  }

  // Test 6: Flush incomplete buffer on stream end
  {
    const parser = new SSEParser();
    parser.parseChunk('data: trailing');
    const flushed = parser.flush();
    assert(flushed.length === 1 && flushed[0].data === 'trailing', 'Flushing yields trailing event');
  }

  console.log(`\nRESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests();
