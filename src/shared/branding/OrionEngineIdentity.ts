import os from 'os';
import path from 'path';

export type PublicEngineLabel =
  | 'ORION Local'
  | 'ORION Core'
  | 'ORION Intelligence'
  | 'ORION Engine';

export interface PublicEngineIdentity {
  publicLabel: PublicEngineLabel;
  shortBadge: PublicEngineLabel;
  tierDescription: string;
  isLocal: boolean;
  technicalProviderId: string;
  technicalModelId: string;
  honestDisclosure: string;
}

const CLOUD_PROVIDER_IDS = new Set<string>([
  'anthropic',
  'openai',
  'gemini',
  'openrouter',
  'groq',
  'deepseek',
  'mistral',
  'cerebras',
  'nvidia',
  'github',
  'cloudflare',
  'orca',
  'orcarouter',
  'glm'
]);

/**
 * Resolves an honest, provider-neutral public engine identity for ordinary ORION UI surfaces
 * while preserving full technical provider/model transparency for `/doctor` developer diagnostics.
 * Never claims that ORION operates a proprietary foundation model.
 */
export function resolvePublicEngineIdentity(
  providerId?: string,
  modelId?: string
): PublicEngineIdentity {
  const cleanProvider = String(providerId || 'local-heuristic').trim().toLowerCase();
  const cleanModel = String(modelId || 'default').trim();

  if (cleanProvider === 'ollama') {
    return {
      publicLabel: 'ORION Local',
      shortBadge: 'ORION Local',
      tierDescription: 'On-Device Neural Runtime',
      isLocal: true,
      technicalProviderId: cleanProvider,
      technicalModelId: cleanModel,
      honestDisclosure: `Configured local open-weights runtime (${cleanProvider}:${cleanModel})`
    };
  }

  if (cleanProvider === 'local-heuristic' || cleanProvider === 'heuristic') {
    return {
      publicLabel: 'ORION Core',
      shortBadge: 'ORION Core',
      tierDescription: 'Deterministic Command & Safety Engine',
      isLocal: true,
      technicalProviderId: cleanProvider,
      technicalModelId: cleanModel,
      honestDisclosure: `Deterministic local execution engine (${cleanProvider}:${cleanModel})`
    };
  }

  if (CLOUD_PROVIDER_IDS.has(cleanProvider)) {
    return {
      publicLabel: 'ORION Intelligence',
      shortBadge: 'ORION Intelligence',
      tierDescription: 'Configured Cloud Reasoning Runtime',
      isLocal: false,
      technicalProviderId: cleanProvider,
      technicalModelId: cleanModel,
      honestDisclosure: `Configured external model adapter (${cleanProvider}:${cleanModel})`
    };
  }

  return {
    publicLabel: 'ORION Engine',
    shortBadge: 'ORION Engine',
    tierDescription: 'Adaptive Execution Runtime',
    isLocal: !cleanProvider.includes('cloud'),
    technicalProviderId: cleanProvider,
    technicalModelId: cleanModel,
    honestDisclosure: `Configured runtime adapter (${cleanProvider}:${cleanModel})`
  };
}

/**
 * Formats technical developer diagnostics for `/doctor` and technical inspection views.
 */
export function formatDeveloperEngineDiagnostics(
  providerId?: string,
  modelId?: string
): string {
  const identity = resolvePublicEngineIdentity(providerId, modelId);
  return `${identity.publicLabel} -> ${identity.technicalProviderId}:${identity.technicalModelId} (${identity.tierDescription})`;
}

function normalizeSlashes(p: string): string {
  return p.replace(/\\/g, '/');
}

/**
 * Converts a local filesystem path into a privacy-preserving logical label for ordinary UI display
 * (`<workspace>`, `<workspace>/...`, `<orion-home>/...`, or `~/...`) so personal `C:\Users\<username>\...`
 * paths and usernames are never exposed in status bars, banners, or ordinary chat output.
 */
export function formatLogicalPath(rawPath: string, workspaceRoot?: string): string {
  if (!rawPath || typeof rawPath !== 'string') return '<workspace>';
  const trimmed = rawPath.trim();
  if (!trimmed) return '<workspace>';

  try {
    const resolvedTarget = normalizeSlashes(path.resolve(trimmed));

    if (workspaceRoot) {
      const resolvedWorkspace = normalizeSlashes(path.resolve(workspaceRoot));
      const targetCmp =
        process.platform === 'win32' ? resolvedTarget.toLowerCase() : resolvedTarget;
      const wsCmp =
        process.platform === 'win32' ? resolvedWorkspace.toLowerCase() : resolvedWorkspace;

      if (targetCmp === wsCmp) {
        return '<workspace>';
      }
      if (targetCmp.startsWith(`${wsCmp}/`)) {
        const rel = resolvedTarget.slice(resolvedWorkspace.length + 1);
        return `<workspace>/${rel}`;
      }
    }

    const homeDir = os.homedir();
    if (homeDir) {
      const normHome = normalizeSlashes(path.resolve(homeDir));
      const targetCmp =
        process.platform === 'win32' ? resolvedTarget.toLowerCase() : resolvedTarget;
      const homeCmp = process.platform === 'win32' ? normHome.toLowerCase() : normHome;

      const orionDotHome = `${homeCmp}/.orion`;
      const localAppOrion = `${homeCmp}/appdata/local/orion`;
      if (targetCmp === orionDotHome || targetCmp.startsWith(`${orionDotHome}/`)) {
        const suffix = resolvedTarget.slice(normHome.length + '/.orion'.length);
        return `<orion-home>${suffix}`;
      }
      if (targetCmp === localAppOrion || targetCmp.startsWith(`${localAppOrion}/`)) {
        const suffix = resolvedTarget.slice(normHome.length + '/AppData/Local/orion'.length);
        return `<orion-install>${suffix}`;
      }
      if (targetCmp === homeCmp) {
        return '~';
      }
      if (targetCmp.startsWith(`${homeCmp}/`)) {
        return `~/${resolvedTarget.slice(normHome.length + 1)}`;
      }
    }
  } catch {
    // Fall through to regex sanitization
  }

  return sanitizePersonalPathsInText(trimmed, workspaceRoot);
}

/**
 * Redacts personal OS user paths (`C:\Users\<user>\...`, `/Users/<user>/...`, `/home/<user>/...`)
 * embedded inside arbitrary strings, errors, tool results, and transcripts.
 */
export function sanitizePersonalPathsInText(text: string, workspaceRoot?: string): string {
  if (!text || typeof text !== 'string') return '';
  let out = text;

  if (workspaceRoot) {
    try {
      const wsResolved = path.resolve(workspaceRoot);
      const variants = [
        wsResolved,
        wsResolved.replace(/\\/g, '/'),
        wsResolved.replace(/\\/g, '\\\\')
      ];
      for (const variant of variants) {
        if (variant && variant.length > 3) {
          const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          out = out.replace(new RegExp(escaped, 'gi'), '<workspace>');
        }
      }
    } catch {}
  }

  // Windows `C:\Users\<username>\...` or `C:/Users/<username>/...` (including escaped JSON `C:\\Users\\<username>\\...`)
  out = out.replace(
    /[A-Za-z]:(?:\\\\|\\|\/)Users(?:\\\\|\\|\/)([^\\/\s"'<>:|?*]+)((?:(?:\\\\|\\|\/)[^\\/\s"'<>:|?*]+)*)/gi,
    (_full, _username: string, rest: string) => {
      if (!rest) return '~';
      const cleanRest = rest.replace(/\\\\/g, '/').replace(/\\/g, '/');
      return `~${cleanRest}`;
    }
  );

  // macOS `/Users/<username>/...` and Linux `/home/<username>/...`
  out = out.replace(
    /\/(?:Users|home)\/([^/\s"'<>:|?*]+)((?:\/[^/\s"'<>:|?*]+)*)/g,
    (_full, _username: string, rest: string) => {
      if (!rest) return '~';
      return `~${rest}`;
    }
  );

  return out;
}

export function isExplicitPathInspectionQuery(query: string): boolean {
  return /\b(?:where\s+is|full\s+path|exact\s+path|absolute\s+path|show\s+(?:the\s+)?path|what\s+path)\b/i.test(
    String(query || '')
  );
}

/**
 * Strips leaked internal memory metadata, prompt-envelope headers, raw `mem_*` IDs,
 * and personal user paths from ordinary user-facing conversational responses.
 */
export function sanitizeConversationalResponse(
  rawText: string,
  options?: { workspaceRoot?: string; redactProviderIds?: boolean; preserveExplicitPaths?: boolean }
): string {
  if (!rawText || typeof rawText !== 'string') return '';
  let out = rawText;

  // If a small local model echoed an `EXTERNAL DATA ANALYSIS: ... USER RESPONSE:` wrapper, keep only the actual user response
  const userRespIdx = out.search(/\bUSER RESPONSE:\s*/i);
  if (
    userRespIdx >= 0 &&
    /\b(?:ANALYSIS COMPLETE|EXTERNAL DATA ANALYSIS|RETRIEVED PERSISTED MEMORY DATA|CURRENT ENVIRONMENT & SYSTEM CONTEXT)\b/i.test(
      out
    )
  ) {
    out = out.slice(userRespIdx).replace(/^USER RESPONSE:\s*/i, '');
  }

  // Strip standalone robotic diagnostic preambles if echoed without USER RESPONSE
  out = out.replace(
    /^(?:ANALYSIS COMPLETE\.?\s*)?(?:SYSTEM STATUS:\s*[A-Z]+\.?\s*)?(?:EXTERNAL DATA ANALYSIS:\s*)/i,
    ''
  );

  // Remove leaked internal prompt/memory metadata artifacts (`**ORION responds** Memory update. Memory ID. Mem.`, `[MEMORY_DATA ...]`, `mem_...`)
  out = out
    .replace(/\*\*ORION responds\*\*/gi, '')
    .replace(/\[MEMORY_DATA[^\]]*\]/gi, '')
    .replace(/\[UNTRUSTED_[A-Z_]+[^\]]*\]/gi, '')
    .replace(/<UNTRUSTED_DATA[^>]*>/gi, '')
    .replace(/<\/UNTRUSTED_DATA>/gi, '')
    .replace(/\bMemory update\.\s*/gi, '')
    .replace(/\bMemory ID[:.]?\s*(?:mem_[a-z0-9_]+|Mem\.?)?\s*/gi, '')
    .replace(/\bmem_(?:hikmah_)?[a-z0-9_]{1,32}\b/gi, '[saved-memory]')
    .replace(/===\s*CURRENT ENVIRONMENT & SYSTEM CONTEXT\s*===/gi, '')
    .replace(/===\s*UNTRUSTED EXTERNAL DATA[\s\S]*?===/gi, '')
    .replace(/USER OPERATOR QUERY:\s*/gi, '');

  if (options?.redactProviderIds) {
    out = out
      .replace(/\bollama[:/][a-z0-9._:-]+/gi, 'ORION Local')
      .replace(/\b(?:llama3(?:\.\d+)?|qwen2\.5-coder|qwen3-coder|deepseek-r1|gemma4|gpt-oss):[0-9a-z._-]+\b/gi, 'ORION Local')
      .replace(/\blocal-heuristic(?::[a-z0-9._-]+)?\b/gi, 'ORION Core')
      .replace(/\[ORION OFFLINE FALLBACK\]/gi, '');
  }

  if (!options?.preserveExplicitPaths) {
    out = sanitizePersonalPathsInText(out, options?.workspaceRoot);
  }

  // Clean up redundant blank lines or leading/trailing whitespace left after stripping headers
  out = out.replace(/\n{3,}/g, '\n\n').trim();
  return out;
}

export type GreetingStyle =
  | 'hi'
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night'
  | 'how_are_you'
  | 'thanks'
  | 'identity'
  | 'capabilities';

export interface ConversationalTurnClassification {
  isGreetingOrSmallTalk: boolean;
  isExplicitSystemSpecRequest: boolean;
  isExplicitFileRequest: boolean;
  isPureConversational: boolean;
  greetingStyle?: GreetingStyle;
}

/**
 * Returns true ONLY when the user explicitly requests hardware/OS specifications,
 * system diagnostics, CPU/RAM/disk/network telemetry, or current system time.
 * Never matches greetings or casual sentences mentioning words like "time", "memory", or "computer".
 */
export function isExplicitSystemSpecQuery(prompt: string): boolean {
  const lower = String(prompt || '').toLowerCase().trim();
  if (!lower) return false;

  if (/^(?:disk|cpu|ram|uptime|specs|system\s+info|system\s+specs?)$/i.test(lower)) {
    return true;
  }

  if (
    /\b(?:system|hardware|machine|computer|pc|workstation)\s+(?:spec|specs|specification|specifications|diagnostic|diagnostics|info|information|overview|telemetry|posture|report|metrics)\b/i.test(
      lower
    )
  ) {
    return true;
  }

  if (
    /\b(?:show|make|get|run|check|display|give\s+me|inspect|print)\b[\s\S]{0,40}\b(?:system\s+spec|system\s+specs|system\s+specifications?|system\s+diagnostics?|system\s+info|system\s+status|overview\s+of\s+this\s+(?:machine|computer|system)|hardware\s+specs?|machine\s+overview|computer\s+specs?)\b/i.test(
      lower
    )
  ) {
    return true;
  }

  if (
    /\b(?:cpu|processor)\s+(?:usage|load|utilization|status|temp|temperature|info|stats|cores)\b|\bwhat(?:'s|\s+is)\s+my\s+cpu\b|\bcheck\s+(?:current\s+)?cpu\b|\bshow\s+cpu\b/i.test(
      lower
    )
  ) {
    return true;
  }

  if (
    /\b(?:ram|memory)\s+(?:usage|utilization|status|available|free|total|stats|consumption|capacity)\b|\bhow\s+much\s+(?:ram|memory)\b|\bcpu\s+and\s+(?:ram|memory)\b/i.test(
      lower
    )
  ) {
    return true;
  }

  if (
    /\b(?:disk|storage|drive)\s+(?:usage|space|capacity|free|available|status|info|utilization)\b|\bhow\s+much\s+(?:disk|storage)\b/i.test(
      lower
    )
  ) {
    return true;
  }

  if (
    /\b(?:network\s+status|ip\s+address|local\s+ip|what(?:'s|\s+is)\s+my\s+ip|network\s+interface)\b/i.test(
      lower
    )
  ) {
    return true;
  }

  if (
    /\b(?:what\s+time\s+is\s+it|current\s+time|local\s+time|system\s+time|system\s+clock|what(?:'s|\s+is)\s+the\s+time|system\s+uptime)\b/i.test(
      lower
    )
  ) {
    return true;
  }

  return false;
}

/**
 * Returns true only for genuine filesystem read/list/inspection requests, avoiding
 * false triggers on conversational phrases like "list three ideas" or "did you read my message".
 */
export function isExplicitFileOperationQuery(prompt: string): boolean {
  const lower = String(prompt || '').toLowerCase().trim();
  if (!lower) return false;

  if (
    /\b(?:list|show|inspect)\s+(?:the\s+|all\s+)?(?:files|directory|directories|folder|folders|workspace\s+files)\b/i.test(
      lower
    ) ||
    /\bfiles\s+in\s+(?:the\s+|current\s+|this\s+)?(?:directory|folder|workspace|path|\.)/i.test(lower) ||
    /\b(?:find|locate)\b[\s\S]{0,40}\bfiles?\s+in\s+(?:current\s+|this\s+|the\s+)?(?:directory|folder|workspace)\b/i.test(
      lower
    ) ||
    /\bread\s+(?:the\s+)?(?:non-existent\s+)?(?:restricted\s+)?(?:configuration\s+|config\s+|text\s+|markdown\s+|json\s+|source\s+)?file\b/i.test(
      lower
    ) ||
    /\b(?:read|inspect|summarize)\s+(?:file\b|[a-z0-9_./\\-]+\.(?:txt|md|json|ts|tsx|js|cjs|mjs|cfg|yaml|yml|toml|log|csv)\b)/i.test(
      lower
    )
  ) {
    return true;
  }

  return false;
}

/**
 * Classifies greetings, pleasantries, and pure conversational turns so ORION
 * responds naturally and warmly without triggering unwanted tools, hardware specs,
 * or internal memory dumps.
 */
export function classifyConversationalTurn(prompt: string): ConversationalTurnClassification {
  const raw = String(prompt || '').trim();
  const cleaned = raw.replace(/[!?.]+$/g, '').trim();
  const lower = cleaned.toLowerCase();

  const explicitSpec = isExplicitSystemSpecQuery(raw);
  const explicitFile = isExplicitFileOperationQuery(raw);

  if (!lower || explicitSpec || explicitFile) {
    return {
      isGreetingOrSmallTalk: false,
      isExplicitSystemSpecRequest: explicitSpec,
      isExplicitFileRequest: explicitFile,
      isPureConversational: false
    };
  }

  // Never treat explicit computer/browser/system/media mutation commands as small talk
  const hasActionCommand =
    /\b(?:https?:\/\/|open\s+|launch\s+|start\s+|search\s+|navigate\s+|visit\s+|go\s+to\s+|click\s+|right-click|double-click|drag\s+|scroll\s+|type\s+|press\s+|move\s+(?:mouse|cursor)|close\s+(?:window|app|notepad|chrome)|brightness|backlight|volume|mute|unmute|spotify|play\s+music|weather\s+in|prayer\s+time|write\s+.*file|create\s+.*file|delete\s+.*file|clipboard|look\s+at\s+my\s+screen|what\s+is\s+on\s+my\s+screen|screen\s+analysis)\b/i.test(
      lower
    );

  if (hasActionCommand) {
    return {
      isGreetingOrSmallTalk: false,
      isExplicitSystemSpecRequest: false,
      isExplicitFileRequest: false,
      isPureConversational: false
    };
  }

  if (
    /^(?:good\s+morning|morning|gm)(?:[\s,]+orion)?(?:\s+how\s+are\s+you)?$/i.test(lower)
  ) {
    return {
      isGreetingOrSmallTalk: true,
      isExplicitSystemSpecRequest: false,
      isExplicitFileRequest: false,
      isPureConversational: true,
      greetingStyle: 'morning'
    };
  }

  if (/^(?:good\s+afternoon|afternoon)(?:[\s,]+orion)?$/i.test(lower)) {
    return {
      isGreetingOrSmallTalk: true,
      isExplicitSystemSpecRequest: false,
      isExplicitFileRequest: false,
      isPureConversational: true,
      greetingStyle: 'afternoon'
    };
  }

  if (/^(?:good\s+evening|evening)(?:[\s,]+orion)?$/i.test(lower)) {
    return {
      isGreetingOrSmallTalk: true,
      isExplicitSystemSpecRequest: false,
      isExplicitFileRequest: false,
      isPureConversational: true,
      greetingStyle: 'evening'
    };
  }

  if (/^(?:good\s*night|night)(?:[\s,]+orion)?$/i.test(lower)) {
    return {
      isGreetingOrSmallTalk: true,
      isExplicitSystemSpecRequest: false,
      isExplicitFileRequest: false,
      isPureConversational: true,
      greetingStyle: 'night'
    };
  }

  if (
    /^(?:how\s+are\s+you(?:\s+doing|\s+today)?|how'?s\s+it\s+going|how\s+is\s+it\s+going|how\s+are\s+things|what'?s\s+up|whats\s+up|sup)(?:[\s,]+orion)?$/i.test(
      lower
    )
  ) {
    return {
      isGreetingOrSmallTalk: true,
      isExplicitSystemSpecRequest: false,
      isExplicitFileRequest: false,
      isPureConversational: true,
      greetingStyle: 'how_are_you'
    };
  }

  if (
    /^(?:thanks|thank\s+you|thx|many\s+thanks|thanks\s+a\s+lot|appreciate\s+it|thank\s+you\s+so\s+much)(?:[\s,]+orion)?$/i.test(
      lower
    )
  ) {
    return {
      isGreetingOrSmallTalk: true,
      isExplicitSystemSpecRequest: false,
      isExplicitFileRequest: false,
      isPureConversational: true,
      greetingStyle: 'thanks'
    };
  }

  if (
    /^(?:hi|hey|hello|howdy|yo|greetings|hi\s+there|hey\s+there|hello\s+there|nice\s+to\s+meet\s+you)(?:[\s,]+orion)?(?:[\s,]+what\s+is\s+your\s+status)?$/i.test(
      lower
    )
  ) {
    return {
      isGreetingOrSmallTalk: true,
      isExplicitSystemSpecRequest: false,
      isExplicitFileRequest: false,
      isPureConversational: true,
      greetingStyle: 'hi'
    };
  }

  if (/^(?:who\s+are\s+you|what\s+are\s+you|what\s+is\s+orion|introduce\s+yourself)$/i.test(lower)) {
    return {
      isGreetingOrSmallTalk: true,
      isExplicitSystemSpecRequest: false,
      isExplicitFileRequest: false,
      isPureConversational: true,
      greetingStyle: 'identity'
    };
  }

  if (
    /^(?:what\s+can\s+you\s+do|how\s+can\s+you\s+help(?:\s+me)?|help\s+me\s+get\s+started)$/i.test(
      lower
    )
  ) {
    return {
      isGreetingOrSmallTalk: true,
      isExplicitSystemSpecRequest: false,
      isExplicitFileRequest: false,
      isPureConversational: true,
      greetingStyle: 'capabilities'
    };
  }

  const isConversationalQuestionOrChat =
    /^(?:can\s+you\s+explain|explain|summarize|describe|tell\s+me\s+about|what\s+do\s+you\s+think|why\s+|how\s+does\s+|what\s+did\s+i\s+|what\s+[\w\s]{1,40}\bdid\s+i\s+(?:just\s+)?(?:tell|say|ask|mention)|what(?:'s|\s+is)\s+(?:our|my)\s+|please\s+remember\s+that\b|remember\s+that\s+(?:our|my|the)\b|do\s+you\s+remember|let'?s\s+talk|i'?m\s+working\s+on|can\s+we\s+|could\s+you\s+clarify|what\s+do\s+you\s+mean)/i.test(
      lower
    ) &&
    !/\b(?:file|folder|directory|chrome|browser|window|notepad|spotify|click|mouse|screen|screenshot|url|http|ip\s+address)\b/i.test(
      lower
    );

  return {
    isGreetingOrSmallTalk: false,
    isExplicitSystemSpecRequest: false,
    isExplicitFileRequest: false,
    isPureConversational: isConversationalQuestionOrChat
  };
}

/**
 * Generates a natural, friendly, tone-matched response for greetings, pleasantries,
 * follow-ups, and clarifications without exposing system specs or internal metadata.
 */
export function buildFriendlyConversationalReply(
  prompt: string,
  conversationHistory?: Array<{ role: string; content: string }>
): string | null {
  const turn = classifyConversationalTurn(prompt);
  if (turn.isGreetingOrSmallTalk) {
    switch (turn.greetingStyle) {
      case 'morning':
        return "Good morning! Ready when you are. What's on the agenda today?";
      case 'afternoon':
        return 'Good afternoon! What would you like to tackle next?';
      case 'evening':
        return 'Good evening! Let me know what you want to work on.';
      case 'night':
        return 'Good night! Rest well — I will be right here whenever you are ready to pick back up.';
      case 'how_are_you':
        return "Doing well and ready to help! What are we working on today?";
      case 'thanks':
        return 'Happy to help! Let me know if there is anything else you would like to do.';
      case 'identity':
        return 'I am ORION, your local-first desktop AI assistant. I can chat naturally, help with coding and research, inspect files within your workspace, and operate visible browser and desktop workflows with your permission.';
      case 'capabilities':
        return 'I can help you browse and search visibly in Chrome, automate desktop apps with verified mouse and keyboard actions, inspect or edit workspace files, check system diagnostics on request, or talk through ideas. Just tell me what you want to accomplish!';
      case 'hi':
      default:
        return "Hello! I'm ORION — good to see you. What are we working on today?";
    }
  }

  const lower = String(prompt || '').toLowerCase().trim();

  // Context retention for follow-up questions in ORION Core mode
  if (
    conversationHistory &&
    conversationHistory.length > 0 &&
    /\b(?:what\s+did\s+i\s+just\s+(?:say|ask|mention)|do\s+you\s+remember\s+what\s+i\s+said|my\s+name\s+is|what\s+is\s+my\s+name|follow\s*up|earlier\s+i\s+mentioned)\b/i.test(
      lower
    )
  ) {
    const priorUserTurns = conversationHistory
      .filter((t) => t.role === 'user' && t.content.trim().toLowerCase() !== lower)
      .map((t) => sanitizeConversationalResponse(t.content));

    const nameTurn = [...priorUserTurns]
      .reverse()
      .find((c) => /\bmy\s+name\s+is\s+([a-z0-9_-]+)/i.test(c));
    if (/\bwhat(?:'s|\s+is)\s+my\s+name\b/i.test(lower) && nameTurn) {
      const m = nameTurn.match(/\bmy\s+name\s+is\s+([a-z0-9_-]+)/i);
      if (m?.[1]) {
        return `You mentioned your name is ${m[1]}. How can I help you next?`;
      }
    }

    if (priorUserTurns.length > 0) {
      const lastAsked = priorUserTurns[priorUserTurns.length - 1];
      return `Earlier you said: "${lastAsked}". How would you like to build on that?`;
    }
  }

  if (/^my\s+name\s+is\s+([a-z0-9_-]+)/i.test(String(prompt || '').trim())) {
    const m = String(prompt || '').trim().match(/^my\s+name\s+is\s+([a-z0-9_-]+)/i);
    const name = m?.[1] || 'there';
    return `Nice to meet you, ${name}! What would you like to work on together?`;
  }

  // Ambiguous task clarification
  if (/^(?:fix\s+it|do\s+it|run\s+that|open\s+it|change\s+it|update\s+it)[.!?]*$/i.test(lower)) {
    return 'Could you clarify which file, app, or task you would like me to act on so I target the exact right thing?';
  }

  return null;
}

