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

    if (lower.includes('file') || lower.includes('read') || lower.includes('write') || lower.includes('directory') || lower.includes('folder')) {
      categoriesToInclude.add('FILE');
    }
    if (lower.includes('cpu') || lower.includes('ram') || lower.includes('memory') || lower.includes('system') || lower.includes('hardware') || lower.includes('uptime') || lower.includes('disk')) {
      categoriesToInclude.add('SYSTEM');
    }
    if (lower.includes('network') || lower.includes('ip') || lower.includes('ping') || lower.includes('connection') || lower.includes('search') || lower.includes('browser') || lower.includes('web') || lower.includes('find') || lower.includes('lookup') || lower.includes('keyboard')) {
      categoriesToInclude.add('BROWSER');
    }
    if (lower.includes('screen') || lower.includes('look') || lower.includes('vision') || lower.includes('image')) {
      categoriesToInclude.add('SCREENSHOT');
    }
    if (lower.includes('app') || lower.includes('open') || lower.includes('launch') || lower.includes('click') || lower.includes('type') || lower.includes('window') || lower.includes('tab') || lower.includes('sign') || lower.includes('inbox') || lower.includes('automate') || lower.includes('business') || lower.includes('execute') || lower.includes('task')) {
      categoriesToInclude.add('AUTOMATION');
      categoriesToInclude.add('COMPUTER');
      categoriesToInclude.add('BROWSER');
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
