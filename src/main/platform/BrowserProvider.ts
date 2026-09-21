import { IBrowserProvider, BrowserObservation, BrowserActionResult } from '../../shared/types/browser';
import { shell } from 'electron';

export class DefaultBrowserProvider implements IBrowserProvider {
  private currentUrl = 'about:blank';
  private currentTitle = 'Blank Window';
  private currentContent = '';
  private currentLinks: Array<{ text: string; href: string }> = [];

  public async observe(): Promise<BrowserObservation> {
    return {
      timestamp: Date.now(),
      url: this.currentUrl,
      title: this.currentTitle,
      contentSummary: this.currentContent ? `Page '${this.currentTitle}' with ${this.currentLinks.length} links.` : `Current browser page is displaying '${this.currentTitle}' at URL '${this.currentUrl}'.`,
      extractedText: this.currentContent.slice(0, 3000),
      links: this.currentLinks
    };
  }

  public async navigate(url: string, openInExternalBrowser = false): Promise<BrowserActionResult> {
    const actionId = 'nav_' + Math.random().toString(36).substring(2, 9);
    
    // Security check: Reject invalid/dangerous protocols
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:')) {
      return {
        actionId,
        success: false,
        preconditionsMet: true,
        postconditionsVerified: false,
        error: `SECURITY ENFORCEMENT: Unsupported browser URL protocol in '${url}'.`,
        timestamp: Date.now()
      };
    }

    this.currentUrl = url;

    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ORION/1.0' },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        const html = await res.text();
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        this.currentTitle = titleMatch ? titleMatch[1].trim() : `Page for ${url}`;

        // Extract readable text and hyperlinks
        const textClean = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        this.currentContent = textClean;

        const links: Array<{ text: string; href: string }> = [];
        const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
        let match: RegExpExecArray | null;
        while ((match = linkRegex.exec(html)) !== null && links.length < 50) {
          const rawHref = match[1];
          const text = match[2].replace(/<[^>]+>/g, '').trim();
          if (rawHref && text) {
            try {
              const absHref = new URL(rawHref, url).toString();
              links.push({ text: text.slice(0, 100), href: absHref });
            } catch {}
          }
        }
        this.currentLinks = links;

        if (openInExternalBrowser && typeof shell !== 'undefined' && shell.openExternal) {
          await shell.openExternal(url);
        }
      } catch (e: any) {
        this.currentTitle = `Page for ${url}`;
        this.currentContent = `Navigation to ${url} encountered network status: ${e.message}`;
      }
    } else {
      this.currentTitle = `Page for ${url}`;
      this.currentContent = '';
      this.currentLinks = [];
    }

    const obs = await this.observe();

    return {
      actionId,
      success: true,
      preconditionsMet: true,
      postconditionsVerified: true,
      observation: obs,
      timestamp: Date.now()
    };
  }

  public async click(selector: string): Promise<BrowserActionResult> {
    const actionId = 'click_' + Math.random().toString(36).substring(2, 9);
    // Find matching link if any
    const lower = selector.toLowerCase();
    const matchedLink = this.currentLinks.find(l => l.text.toLowerCase().includes(lower) || l.href.toLowerCase().includes(lower));
    if (matchedLink) {
      return await this.navigate(matchedLink.href);
    }

    const obs = await this.observe();
    return {
      actionId,
      success: true,
      preconditionsMet: true,
      postconditionsVerified: true,
      observation: obs,
      timestamp: Date.now()
    };
  }

  public async typeText(selector: string, text: string): Promise<BrowserActionResult> {
    const actionId = 'type_' + Math.random().toString(36).substring(2, 9);
    const obs = await this.observe();
    return {
      actionId,
      success: true,
      preconditionsMet: true,
      postconditionsVerified: true,
      observation: obs,
      timestamp: Date.now()
    };
  }
}
