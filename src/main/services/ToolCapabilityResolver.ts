import { Tool } from '../../shared/types';

export class ToolCapabilityResolver {
  /**
   * Filter and return relevant tool definitions based on task classification query keyword semantics.
   */
  public resolveToolsForTask(query: string, allTools: Tool[]): Tool[] {
    const lower = query.toLowerCase();

    // Fast path: if query is broad or asks for full system diagnostic, return all available tools
    if (lower.includes('all tools') || lower.includes('diagnostic') || lower.includes('full report')) {
      return allTools;
    }

    const categoriesToInclude = new Set<string>();

    if (lower.includes('file') || lower.includes('read') || lower.includes('write') || lower.includes('directory') || lower.includes('folder') || lower.includes('project')) {
      categoriesToInclude.add('FILE');
    }
    if (
      lower.includes('cpu') || lower.includes('ram') || lower.includes('memory') ||
      lower.includes('system') || lower.includes('hardware') || lower.includes('uptime') ||
      lower.includes('spec') || lower.includes('computer') || lower.includes('brightness') ||
      lower.includes('display') || lower.includes('monitor') || lower.includes('backlight') ||
      lower.includes('disk') || lower.includes('weather') || lower.includes('forecast') ||
      lower.includes('prayer') || lower.includes('salah') || lower.includes('namaz') ||
      lower.includes('fajr') || lower.includes('maghrib') || lower.includes('volume') ||
      lower.includes('mute') || lower.includes('clipboard') || lower.includes('note') ||
      lower.includes('reminder') || lower.includes('playing') || lower.includes('song')
    ) {
      categoriesToInclude.add('SYSTEM');
    }
    if (lower.includes('network') || lower.includes('ip') || lower.includes('ping') || lower.includes('connection') || lower.includes('search') || lower.includes('browser') || lower.includes('web') || lower.includes('find') || lower.includes('lookup') || lower.includes('keyboard')) {
      categoriesToInclude.add('BROWSER');
    }
    if (lower.includes('screen') || lower.includes('look') || lower.includes('vision') || lower.includes('image')) {
      categoriesToInclude.add('SCREENSHOT');
    }
    if (
      lower.includes('app') || lower.includes('open') || lower.includes('oprn') ||
      lower.includes('opne') || lower.includes('launch') || lower.includes('lunach') ||
      lower.includes('click') || lower.includes('type') || lower.includes('window') ||
      lower.includes('tab') || lower.includes('sign') || lower.includes('inbox') ||
      lower.includes('automate') || lower.includes('business') || lower.includes('execute') ||
      lower.includes('task') || lower.includes('spotify') || lower.includes('play') ||
      lower.includes('pause') || lower.includes('next') || lower.includes('previous') ||
      lower.includes('skip') || lower.includes('music')
    ) {
      categoriesToInclude.add('AUTOMATION');
      categoriesToInclude.add('COMPUTER');
      categoriesToInclude.add('BROWSER');
      categoriesToInclude.add('SYSTEM');
    }

    // Default safety fallback: If no category matched, include SYSTEM, FILE, BROWSER, and AUTOMATION tools
    if (categoriesToInclude.size === 0) {
      categoriesToInclude.add('SYSTEM');
      categoriesToInclude.add('FILE');
      categoriesToInclude.add('BROWSER');
      categoriesToInclude.add('AUTOMATION');
      categoriesToInclude.add('COMPUTER');
    }

    return allTools.filter(t => categoriesToInclude.has(t.category));
  }
}
