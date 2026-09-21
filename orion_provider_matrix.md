# ORION Provider Matrix Report (Phase 4.2 Qualified)

> [!NOTE]
> Credentials remain 100% isolated within Electron Main (`.env`). All error tracebacks have sensitive authentication keys redacted prior to event logging.

| Provider | Configured? | Auth Status | Current Model ID | TTFT Latency | Stream? | Tools? | Vision? | Status |
| :--- | :---: | :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **ORION Offline Native** | ✅ YES | ✅ VALID | `native-heuristic-v1` | 2 ms | ✅ YES | ✅ YES | ❌ NO | `READY` |
| **Groq LPU** | ⚡ Optional | UNKNOWN | `llama-3.3-70b-versatile` | 0 ms | ✅ YES | ✅ YES | ❌ NO | `NOT CONFIGURED` |
| **Google Gemini** | ⚡ Optional | UNKNOWN | `gemini-2.0-flash` | 0 ms | ✅ YES | ✅ YES | ✅ YES | `NOT CONFIGURED` |
| **GitHub Models** | ⚡ Optional | UNKNOWN | `gpt-4o-mini` | 0 ms | ✅ YES | ✅ YES | ✅ YES | `NOT CONFIGURED` |
| **Cerebras** | ⚡ Optional | UNKNOWN | `llama3.1-8b` | 0 ms | ✅ YES | ✅ YES | ❌ NO | `NOT CONFIGURED` |
| **Mistral AI** | ⚡ Optional | UNKNOWN | `mistral-small-latest` | 0 ms | ✅ YES | ✅ YES | ❌ NO | `NOT CONFIGURED` |
| **NVIDIA NIM** | ⚡ Optional | UNKNOWN | `meta/llama-3.3-70b-instruct` | 0 ms | ✅ YES | ✅ YES | ❌ NO | `NOT CONFIGURED` |
| **DeepSeek Cloud** | ⚡ Optional | UNKNOWN | `deepseek-chat` | 0 ms | ✅ YES | ✅ YES | ❌ NO | `NOT CONFIGURED` |
| **Cloudflare Workers** | ⚡ Optional | UNKNOWN | `@cf/meta/llama-3.1-8b-instruct` | 0 ms | ✅ YES | ❌ NO | ❌ NO | `NOT CONFIGURED` |
