export interface StreamTimeoutConfig {
  /** Maximum time (ms) to establish network connection and receive response headers */
  connectionTimeoutMs: number;
  /** Maximum time (ms) from request start until the first token/event arrives */
  ttftTimeoutMs: number;
  /** Maximum time (ms) allowed between consecutive tokens before declaring stream stalled */
  idleStreamTimeoutMs: number;
}

export const DEFAULT_STREAM_TIMEOUTS: StreamTimeoutConfig = {
  connectionTimeoutMs: 5000,
  ttftTimeoutMs: 8000,
  idleStreamTimeoutMs: 15000
};

export type SSEEvent = {
  event?: string;
  data: string;
  id?: string;
  retry?: number;
};

/**
 * Robust, spec-compliant Server-Sent Events (SSE) incremental line parser.
 * Handles:
 * - Chunks split across line boundaries (`\n`, `\r\n`)
 * - Multiple SSE events in a single network chunk
 * - `data: [DONE]` markers
 * - `data: {...}` payload extraction
 * - Comments (`: ...`)
 */
export class SSEParser {
  private buffer = '';

  /**
   * Pushes raw incoming string chunk into buffer and yields complete parsed SSE events.
   */
  public parseChunk(chunk: string): SSEEvent[] {
    this.buffer += chunk;
    const events: SSEEvent[] = [];

    // Split on double newlines (event boundary)
    const blocks = this.buffer.split(/\r?\n\r?\n/);
    
    // The last element is incomplete if buffer doesn't end with double newline
    this.buffer = blocks.pop() || '';

    for (const block of blocks) {
      if (!block.trim()) continue;

      let eventType: string | undefined;
      let dataLines: string[] = [];
      let eventId: string | undefined;

      const lines = block.split(/\r?\n/);
      for (const line of lines) {
        if (line.startsWith(':')) {
          // Comment line, ignore
          continue;
        }

        const colonIdx = line.indexOf(':');
        let field = line;
        let value = '';

        if (colonIdx !== -1) {
          field = line.slice(0, colonIdx);
          value = line.slice(colonIdx + 1);
          if (value.startsWith(' ')) {
            value = value.slice(1);
          }
        }

        if (field === 'event') {
          eventType = value;
        } else if (field === 'data') {
          dataLines.push(value);
        } else if (field === 'id') {
          eventId = value;
        }
      }

      if (dataLines.length > 0) {
        events.push({
          event: eventType,
          data: dataLines.join('\n'),
          id: eventId
        });
      }
    }

    return events;
  }

  /**
   * Flushes any remaining non-empty buffer on stream end.
   */
  public flush(): SSEEvent[] {
    if (!this.buffer.trim()) {
      return [];
    }
    const remainingChunk = this.buffer;
    this.buffer = '';
    return this.parseChunk(remainingChunk + '\n\n');
  }
}
