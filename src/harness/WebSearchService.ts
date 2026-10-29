import http from 'http';
import https from 'https';
import dns from 'dns';
import net from 'net';
import { URL } from 'url';
import * as cheerio from 'cheerio';
import { UntrustedContentBoundary, UntrustedContentEnvelope } from '../main/services/UntrustedContentBoundary';

export interface WebSearchResultItem {
  title: string;
  url: string;
  snippet: string;
  sourceDomain: string;
}

export interface WebSearchResponse {
  success: boolean;
  query: string;
  provider: 'duckduckgo-live' | 'bing-live' | 'mock-offline';
  isSimulated: boolean;
  results: WebSearchResultItem[];
  fetchedAt: number;
  untrustedEnvelope: UntrustedContentEnvelope<WebSearchResultItem[]>;
  error?: string;
}

export interface WebPageFetchResponse {
  success: boolean;
  requestedUrl: string;
  finalUrl: string;
  statusCode: number;
  title: string;
  textContent: string;
  links: Array<{ text: string; href: string }>;
  contentType: string;
  byteLength: number;
  truncated: boolean;
  isSimulated: boolean;
  untrustedEnvelope?: UntrustedContentEnvelope<{ title: string; textContent: string }>;
  error?: string;
}

export type CustomHttpFetcher = (
  url: string,
  options: { timeoutMs: number; maxBytes: number; headers: Record<string, string> }
) => Promise<{
  statusCode: number;
  headers: Record<string, string | string[] | undefined>;
  body: string;
  byteLength: number;
  truncated: boolean;
}>;

/**
 * Real Web Search & Web Fetch Service (Section 10).
 * - Blocks SSRF, loopback, private IPv4/IPv6, link-local, and cloud metadata endpoints (`169.254.169.254`),
 *   including DNS resolution and redirect re-validation on every hop.
 * - Uses `cheerio` to parse HTML and strip `<script>`, `<style>`, `<noscript>`, `<iframe>`, `<nav>`, `<footer>`.
 * - Wraps all retrieved external content in `UntrustedContentBoundary` (`UNTRUSTED_EXTERNAL`).
 * - Supports a deterministic offline mock adapter for unit tests (`provider: 'mock-offline'`, `isSimulated: true`)
 *   while never claiming mocked results are live internet searches.
 */
export class WebSearchService {
  private readonly defaultTimeoutMs: number;
  private readonly defaultMaxBytes: number;
  private readonly maxRedirects: number;
  private mockSearchHandler?: (query: string, maxResults: number) => Promise<WebSearchResultItem[]>;
  private customHttpFetcher?: CustomHttpFetcher;
  private customDnsLookup?: (hostname: string) => Promise<string[]>;

  constructor(options: {
    defaultTimeoutMs?: number;
    defaultMaxBytes?: number;
    maxRedirects?: number;
    mockSearchHandler?: (query: string, maxResults: number) => Promise<WebSearchResultItem[]>;
    customHttpFetcher?: CustomHttpFetcher;
    customDnsLookup?: (hostname: string) => Promise<string[]>;
  } = {}) {
    this.defaultTimeoutMs = options.defaultTimeoutMs ?? 12_000;
    this.defaultMaxBytes = options.defaultMaxBytes ?? 262_144; // 256 KB
    this.maxRedirects = options.maxRedirects ?? 5;
    this.mockSearchHandler = options.mockSearchHandler;
    this.customHttpFetcher = options.customHttpFetcher;
    this.customDnsLookup = options.customDnsLookup;
  }

  public setMockSearchHandler(
    handler?: (query: string, maxResults: number) => Promise<WebSearchResultItem[]>
  ): void {
    this.mockSearchHandler = handler;
  }

  public setCustomHttpFetcher(fetcher?: CustomHttpFetcher): void {
    this.customHttpFetcher = fetcher;
  }

  public setCustomDnsLookup(lookup?: (hostname: string) => Promise<string[]>): void {
    this.customDnsLookup = lookup;
  }

  /**
   * Checks whether an IPv4 or IPv6 literal belongs to loopback, private, link-local,
   * unspecified, multicast, or cloud metadata ranges.
   */
  public static isPrivateOrReservedIp(ip: string): { blocked: boolean; reason?: string } {
    const cleanIp = ip.trim().replace(/^\[|\]$/g, '');
    const version = net.isIP(cleanIp);
    if (version === 0) {
      return { blocked: true, reason: `Invalid IP address literal: "${ip}"` };
    }

    if (version === 4) {
      const parts = cleanIp.split('.').map(n => parseInt(n, 10));
      if (parts.length !== 4 || parts.some(p => Number.isNaN(p) || p < 0 || p > 255)) {
        return { blocked: true, reason: `Malformed IPv4 address: "${cleanIp}"` };
      }
      const [a, b] = parts;
      if (a === 0) return { blocked: true, reason: 'Unspecified IPv4 range (0.0.0.0/8)' };
      if (a === 127) return { blocked: true, reason: 'Loopback IPv4 range (127.0.0.0/8)' };
      if (a === 10) return { blocked: true, reason: 'Private network IPv4 range (10.0.0.0/8)' };
      if (a === 172 && b >= 16 && b <= 31) {
        return { blocked: true, reason: 'Private network IPv4 range (172.16.0.0/12)' };
      }
      if (a === 192 && b === 168) {
        return { blocked: true, reason: 'Private network IPv4 range (192.168.0.0/16)' };
      }
      if (a === 169 && b === 254) {
        return { blocked: true, reason: 'Link-local / Cloud Metadata IPv4 range (169.254.0.0/16)' };
      }
      if (a === 100 && b >= 64 && b <= 127) {
        return { blocked: true, reason: 'Carrier-grade NAT range (100.64.0.0/10)' };
      }
      if (a >= 224) {
        return { blocked: true, reason: 'Multicast or reserved IPv4 range (224.0.0.0+)' };
      }
      return { blocked: false };
    }

    // IPv6 checks
    const lower = cleanIp.toLowerCase();
    if (lower === '::1' || lower === '0:0:0:0:0:0:0:1') {
      return { blocked: true, reason: 'Loopback IPv6 address (::1)' };
    }
    if (lower === '::' || lower === '0:0:0:0:0:0:0:0') {
      return { blocked: true, reason: 'Unspecified IPv6 address (::)' };
    }
    if (lower.startsWith('::ffff:')) {
      const mappedIpv4 = lower.slice('::ffff:'.length);
      if (net.isIP(mappedIpv4) === 4) {
        return WebSearchService.isPrivateOrReservedIp(mappedIpv4);
      }
    }
    if (lower.startsWith('fc') || lower.startsWith('fd')) {
      return { blocked: true, reason: 'Unique Local IPv6 range (fc00::/7)' };
    }
    if (
      lower.startsWith('fe8') ||
      lower.startsWith('fe9') ||
      lower.startsWith('fea') ||
      lower.startsWith('feb')
    ) {
      return { blocked: true, reason: 'Link-local IPv6 range (fe80::/10)' };
    }
    if (lower.startsWith('ff')) {
      return { blocked: true, reason: 'Multicast IPv6 range (ff00::/8)' };
    }

    return { blocked: false };
  }

  /**
   * Validates a URL against SSRF rules, including protocol check, hostname blocklist,
   * and DNS resolution check.
   */
  public async validateSafeUrl(rawUrl: string): Promise<{
    safe: boolean;
    parsedUrl?: URL;
    resolvedIps?: string[];
    reason?: string;
  }> {
    if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
      return { safe: false, reason: 'URL must be a non-empty string.' };
    }

    let parsed: URL;
    try {
      parsed = new URL(rawUrl.trim());
    } catch {
      return { safe: false, reason: `Malformed URL: "${rawUrl}"` };
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        safe: false,
        reason: `SECURITY POLICY VIOLATION: Unsupported URL scheme "${parsed.protocol}". Only http: and https: are permitted.`
      };
    }

    if (parsed.username || parsed.password) {
      return {
        safe: false,
        reason: 'SECURITY POLICY VIOLATION: Credentials embedded in URLs are blocked.'
      };
    }

    const hostname = parsed.hostname.replace(/^\[|\]$/g, '').toLowerCase();
    if (
      !hostname ||
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname === 'metadata.google.internal' ||
      hostname === 'instance-data'
    ) {
      return {
        safe: false,
        reason: `SECURITY POLICY VIOLATION: Blocked local or internal hostname "${hostname}".`
      };
    }

    // Check IP literal directly
    if (net.isIP(hostname) !== 0) {
      const ipCheck = WebSearchService.isPrivateOrReservedIp(hostname);
      if (ipCheck.blocked) {
        return {
          safe: false,
          reason: `SECURITY POLICY VIOLATION (SSRF Blocked): ${ipCheck.reason} (${hostname})`
        };
      }
      return { safe: true, parsedUrl: parsed, resolvedIps: [hostname] };
    }

    // Resolve DNS and verify all resolved A/AAAA addresses are public
    let addresses: string[] = [];
    try {
      if (this.customDnsLookup) {
        addresses = await this.customDnsLookup(hostname);
      } else {
        const lookupResults = await dns.promises.lookup(hostname, { all: true });
        addresses = lookupResults.map(r => r.address);
      }
    } catch (err: any) {
      return {
        safe: false,
        reason: `DNS resolution failed for "${hostname}": ${err.message}`
      };
    }

    if (!addresses || addresses.length === 0) {
      return {
        safe: false,
        reason: `DNS resolution returned no addresses for "${hostname}".`
      };
    }

    for (const addr of addresses) {
      const ipCheck = WebSearchService.isPrivateOrReservedIp(addr);
      if (ipCheck.blocked) {
        return {
          safe: false,
          reason: `SECURITY POLICY VIOLATION (DNS Rebinding / SSRF Blocked): Host "${hostname}" resolved to restricted IP ${addr} (${ipCheck.reason}).`
        };
      }
    }

    return { safe: true, parsedUrl: parsed, resolvedIps: addresses };
  }

  private async defaultHttpFetch(
    url: string,
    options: { timeoutMs: number; maxBytes: number; headers: Record<string, string> }
  ): Promise<{
    statusCode: number;
    headers: Record<string, string | string[] | undefined>;
    body: string;
    byteLength: number;
    truncated: boolean;
  }> {
    const parsed = new URL(url);
    const client = parsed.protocol === 'https:' ? https : http;

    return new Promise((resolve, reject) => {
      let settled = false;
      const req = client.request(
        parsed,
        {
          method: 'GET',
          headers: options.headers,
          timeout: options.timeoutMs
        },
        (res) => {
          const chunks: Buffer[] = [];
          let totalBytes = 0;
          let truncated = false;

          res.on('data', (chunk: Buffer) => {
            const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            if (totalBytes < options.maxBytes) {
              const remaining = options.maxBytes - totalBytes;
              if (buf.length > remaining) {
                chunks.push(buf.subarray(0, remaining));
                totalBytes += remaining;
                truncated = true;
                res.destroy();
              } else {
                chunks.push(buf);
                totalBytes += buf.length;
              }
            } else {
              truncated = true;
              res.destroy();
            }
          });

          const finalize = () => {
            if (settled) return;
            settled = true;
            const body = Buffer.concat(chunks).toString('utf8');
            resolve({
              statusCode: res.statusCode || 0,
              headers: res.headers,
              body,
              byteLength: totalBytes,
              truncated
            });
          };

          res.on('end', finalize);
          res.on('close', finalize);
          res.on('error', (err) => {
            if (truncated) {
              finalize();
            } else if (!settled) {
              settled = true;
              reject(err);
            }
          });
        }
      );

      req.on('timeout', () => {
        req.destroy(new Error(`HTTP request timed out after ${options.timeoutMs}ms`));
      });

      req.on('error', (err) => {
        if (!settled) {
          settled = true;
          reject(err);
        }
      });

      req.end();
    });
  }

  /**
   * Fetches and extracts readable text from a web page using `cheerio`, validating SSRF
   * rules before the initial request and before every redirect hop.
   */
  public async fetchPage(
    rawUrl: string,
    options: { timeoutMs?: number; maxBytes?: number } = {}
  ): Promise<WebPageFetchResponse> {
    const timeoutMs = Math.max(1000, Math.min(options.timeoutMs ?? this.defaultTimeoutMs, 60_000));
    const maxBytes = Math.max(2048, Math.min(options.maxBytes ?? this.defaultMaxBytes, 2_097_152));
    const fetcher = this.customHttpFetcher || this.defaultHttpFetch.bind(this);

    let currentUrl = rawUrl;
    let redirectCount = 0;

    while (redirectCount <= this.maxRedirects) {
      const validation = await this.validateSafeUrl(currentUrl);
      if (!validation.safe || !validation.parsedUrl) {
        return {
          success: false,
          requestedUrl: rawUrl,
          finalUrl: currentUrl,
          statusCode: 0,
          title: '',
          textContent: '',
          links: [],
          contentType: '',
          byteLength: 0,
          truncated: false,
          isSimulated: Boolean(this.customHttpFetcher),
          error: validation.reason
        };
      }

      let rawResp: Awaited<ReturnType<CustomHttpFetcher>>;
      try {
        rawResp = await fetcher(validation.parsedUrl.toString(), {
          timeoutMs,
          maxBytes,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ORION-CLI/2.0',
            Accept: 'text/html,application/xhtml+xml,text/plain,application/json;q=0.9,*/*;q=0.5',
            'Accept-Language': 'en-US,en;q=0.9'
          }
        });
      } catch (err: any) {
        return {
          success: false,
          requestedUrl: rawUrl,
          finalUrl: currentUrl,
          statusCode: 0,
          title: '',
          textContent: '',
          links: [],
          contentType: '',
          byteLength: 0,
          truncated: false,
          isSimulated: Boolean(this.customHttpFetcher),
          error: `Network fetch failed: ${err.message}`
        };
      }

      if ([301, 302, 303, 307, 308].includes(rawResp.statusCode)) {
        const locationHeader = rawResp.headers['location'] || rawResp.headers['Location'];
        const location = Array.isArray(locationHeader) ? locationHeader[0] : locationHeader;
        if (!location) {
          return {
            success: false,
            requestedUrl: rawUrl,
            finalUrl: currentUrl,
            statusCode: rawResp.statusCode,
            title: '',
            textContent: '',
            links: [],
            contentType: '',
            byteLength: 0,
            truncated: false,
            isSimulated: Boolean(this.customHttpFetcher),
            error: `HTTP redirect (${rawResp.statusCode}) missing Location header.`
          };
        }

        redirectCount++;
        if (redirectCount > this.maxRedirects) {
          return {
            success: false,
            requestedUrl: rawUrl,
            finalUrl: currentUrl,
            statusCode: rawResp.statusCode,
            title: '',
            textContent: '',
            links: [],
            contentType: '',
            byteLength: 0,
            truncated: false,
            isSimulated: Boolean(this.customHttpFetcher),
            error: `Exceeded maximum redirect limit (${this.maxRedirects}).`
          };
        }

        currentUrl = new URL(location, validation.parsedUrl).toString();
        continue;
      }

      const contentTypeHeader = rawResp.headers['content-type'] || rawResp.headers['Content-Type'] || 'text/html';
      const contentType = String(Array.isArray(contentTypeHeader) ? contentTypeHeader[0] : contentTypeHeader);

      if (rawResp.statusCode < 200 || rawResp.statusCode >= 400) {
        return {
          success: false,
          requestedUrl: rawUrl,
          finalUrl: currentUrl,
          statusCode: rawResp.statusCode,
          title: '',
          textContent: '',
          links: [],
          contentType,
          byteLength: rawResp.byteLength,
          truncated: rawResp.truncated,
          isSimulated: Boolean(this.customHttpFetcher),
          error: `HTTP status ${rawResp.statusCode}`
        };
      }

      const extracted = this.extractReadableContent(rawResp.body, currentUrl, contentType);
      const envelope = UntrustedContentBoundary.ingest(
        'WEB_PAGE',
        currentUrl,
        { title: extracted.title, textContent: extracted.textContent },
        'UNTRUSTED_EXTERNAL'
      );

      return {
        success: true,
        requestedUrl: rawUrl,
        finalUrl: currentUrl,
        statusCode: rawResp.statusCode,
        title: extracted.title,
        textContent: extracted.textContent,
        links: extracted.links,
        contentType,
        byteLength: rawResp.byteLength,
        truncated: rawResp.truncated,
        isSimulated: Boolean(this.customHttpFetcher),
        untrustedEnvelope: envelope
      };
    }

    return {
      success: false,
      requestedUrl: rawUrl,
      finalUrl: currentUrl,
      statusCode: 0,
      title: '',
      textContent: '',
      links: [],
      contentType: '',
      byteLength: 0,
      truncated: false,
      isSimulated: Boolean(this.customHttpFetcher),
      error: 'Maximum redirects exceeded.'
    };
  }

  public extractReadableContent(
    rawBody: string,
    baseUrl: string,
    contentType: string = 'text/html'
  ): {
    title: string;
    textContent: string;
    links: Array<{ text: string; href: string }>;
  } {
    if (contentType.includes('application/json') || contentType.includes('text/plain')) {
      const cleaned = UntrustedContentBoundary.stripTerminalControlCodes(rawBody).trim();
      return {
        title: baseUrl,
        textContent: cleaned.slice(0, 20_000),
        links: []
      };
    }

    const $ = cheerio.load(rawBody);
    $('script, style, noscript, iframe, svg, canvas, nav, footer, header, form, aside').remove();

    const title = UntrustedContentBoundary.stripTerminalControlCodes($('title').first().text() || '')
      .replace(/\s+/g, ' ')
      .trim();

    const links: Array<{ text: string; href: string }> = [];
    $('a[href]').each((_, el) => {
      if (links.length >= 25) return;
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      const rawHref = $(el).attr('href');
      if (!text || !rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:')) return;
      try {
        const resolved = new URL(rawHref, baseUrl).toString();
        if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
          links.push({ text: text.slice(0, 120), href: resolved });
        }
      } catch {}
    });

    const bodyText = UntrustedContentBoundary.stripTerminalControlCodes($('body').text() || $.root().text() || '')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n+/g, '\n\n')
      .trim()
      .slice(0, 20_000);

    return {
      title: title || baseUrl,
      textContent: bodyText,
      links
    };
  }

  /**
   * Executes a web search. Uses the deterministic offline mock handler ONLY when explicitly configured
   * (and marks `provider: 'mock-offline'`, `isSimulated: true`); otherwise queries live DuckDuckGo HTML/Lite
   * with Bing RSS fallback.
   */
  public async search(
    query: string,
    options: { maxResults?: number; timeoutMs?: number } = {}
  ): Promise<WebSearchResponse> {
    const cleanQuery = String(query || '').trim();
    const maxResults = Math.max(1, Math.min(options.maxResults ?? 6, 15));

    if (!cleanQuery) {
      const emptyEnv = UntrustedContentBoundary.ingest('WEB_PAGE', 'search:empty', [], 'UNTRUSTED_EXTERNAL');
      return {
        success: false,
        query: '',
        provider: this.mockSearchHandler ? 'mock-offline' : 'duckduckgo-live',
        isSimulated: Boolean(this.mockSearchHandler),
        results: [],
        fetchedAt: Date.now(),
        untrustedEnvelope: emptyEnv,
        error: 'Search query must be a non-empty string.'
      };
    }

    if (this.mockSearchHandler) {
      try {
        const results = (await this.mockSearchHandler(cleanQuery, maxResults)).slice(0, maxResults);
        const envelope = UntrustedContentBoundary.ingest(
          'WEB_PAGE',
          `mock-search:${cleanQuery}`,
          results,
          'UNTRUSTED_EXTERNAL'
        );
        return {
          success: true,
          query: cleanQuery,
          provider: 'mock-offline',
          isSimulated: true,
          results,
          fetchedAt: Date.now(),
          untrustedEnvelope: envelope
        };
      } catch (err: any) {
        const emptyEnv = UntrustedContentBoundary.ingest('WEB_PAGE', `mock-search:${cleanQuery}`, [], 'UNTRUSTED_EXTERNAL');
        return {
          success: false,
          query: cleanQuery,
          provider: 'mock-offline',
          isSimulated: true,
          results: [],
          fetchedAt: Date.now(),
          untrustedEnvelope: emptyEnv,
          error: `Mock search handler failed: ${err.message}`
        };
      }
    }

    // 1. Try DuckDuckGo HTML search
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(cleanQuery)}`;
    const fetcher = this.customHttpFetcher || this.defaultHttpFetch.bind(this);
    const timeoutMs = options.timeoutMs ?? this.defaultTimeoutMs;

    try {
      const ddgValidation = await this.validateSafeUrl(ddgUrl);
      if (ddgValidation.safe) {
        const resp = await fetcher(ddgUrl, {
          timeoutMs,
          maxBytes: this.defaultMaxBytes,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml'
          }
        });

        if (resp.statusCode >= 200 && resp.statusCode < 300 && resp.body) {
          const parsedResults = this.parseDuckDuckGoHtml(resp.body, maxResults);
          if (parsedResults.length > 0) {
            const envelope = UntrustedContentBoundary.ingest(
              'WEB_PAGE',
              ddgUrl,
              parsedResults,
              'UNTRUSTED_EXTERNAL'
            );
            return {
              success: true,
              query: cleanQuery,
              provider: 'duckduckgo-live',
              isSimulated: Boolean(this.customHttpFetcher),
              results: parsedResults,
              fetchedAt: Date.now(),
              untrustedEnvelope: envelope
            };
          }
        }
      }
    } catch {}

    // 2. Fallback: Bing RSS search (`format=rss` is clean XML/HTML)
    const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(cleanQuery)}&format=rss`;
    try {
      const bingValidation = await this.validateSafeUrl(bingUrl);
      if (bingValidation.safe) {
        const resp = await fetcher(bingUrl, {
          timeoutMs,
          maxBytes: this.defaultMaxBytes,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ORION-CLI/2.0',
            Accept: 'application/rss+xml,application/xml,text/xml,text/html'
          }
        });

        if (resp.statusCode >= 200 && resp.statusCode < 300 && resp.body) {
          const parsedResults = this.parseBingRss(resp.body, maxResults);
          const envelope = UntrustedContentBoundary.ingest(
            'WEB_PAGE',
            bingUrl,
            parsedResults,
            'UNTRUSTED_EXTERNAL'
          );
          return {
            success: parsedResults.length > 0,
            query: cleanQuery,
            provider: 'bing-live',
            isSimulated: Boolean(this.customHttpFetcher),
            results: parsedResults,
            fetchedAt: Date.now(),
            untrustedEnvelope: envelope,
            error: parsedResults.length === 0 ? 'No search results returned from live search providers.' : undefined
          };
        }
      }
    } catch (err: any) {
      const emptyEnv = UntrustedContentBoundary.ingest('WEB_PAGE', `search:${cleanQuery}`, [], 'UNTRUSTED_EXTERNAL');
      return {
        success: false,
        query: cleanQuery,
        provider: 'duckduckgo-live',
        isSimulated: Boolean(this.customHttpFetcher),
        results: [],
        fetchedAt: Date.now(),
        untrustedEnvelope: emptyEnv,
        error: `Live web search failed: ${err.message}`
      };
    }

    const emptyEnv = UntrustedContentBoundary.ingest('WEB_PAGE', `search:${cleanQuery}`, [], 'UNTRUSTED_EXTERNAL');
    return {
      success: false,
      query: cleanQuery,
      provider: 'duckduckgo-live',
      isSimulated: Boolean(this.customHttpFetcher),
      results: [],
      fetchedAt: Date.now(),
      untrustedEnvelope: emptyEnv,
      error: 'Web search returned no results or network is unreachable.'
    };
  }

  public parseDuckDuckGoHtml(html: string, maxResults: number): WebSearchResultItem[] {
    const $ = cheerio.load(html);
    const results: WebSearchResultItem[] = [];

    $('.result, .web-result').each((_, el) => {
      if (results.length >= maxResults) return;
      const titleAnchor = $(el).find('a.result__a').first();
      const title = UntrustedContentBoundary.stripTerminalControlCodes(titleAnchor.text() || '').trim();
      let rawHref = titleAnchor.attr('href') || '';
      const snippet = UntrustedContentBoundary.stripTerminalControlCodes(
        $(el).find('.result__snippet').first().text() || ''
      )
        .replace(/\s+/g, ' ')
        .trim();

      if (rawHref.includes('uddg=')) {
        try {
          const parsedLink = new URL(rawHref, 'https://html.duckduckgo.com');
          const uddg = parsedLink.searchParams.get('uddg');
          if (uddg) rawHref = decodeURIComponent(uddg);
        } catch {}
      }

      if (title && (rawHref.startsWith('http://') || rawHref.startsWith('https://'))) {
        let domain = '';
        try {
          domain = new URL(rawHref).hostname;
        } catch {}
        results.push({
          title,
          url: rawHref,
          snippet,
          sourceDomain: domain
        });
      }
    });

    return results;
  }

  public parseBingRss(xml: string, maxResults: number): WebSearchResultItem[] {
    const $ = cheerio.load(xml, { xmlMode: true });
    const results: WebSearchResultItem[] = [];

    $('item').each((_, el) => {
      if (results.length >= maxResults) return;
      const title = UntrustedContentBoundary.stripTerminalControlCodes($(el).find('title').first().text() || '').trim();
      const link = ($(el).find('link').first().text() || '').trim();
      const description = UntrustedContentBoundary.stripTerminalControlCodes(
        $(el).find('description').first().text() || ''
      )
        .replace(/\s+/g, ' ')
        .trim();

      if (title && (link.startsWith('http://') || link.startsWith('https://'))) {
        let domain = '';
        try {
          domain = new URL(link).hostname;
        } catch {}
        results.push({
          title,
          url: link,
          snippet: description,
          sourceDomain: domain
        });
      }
    });

    return results;
  }
}
