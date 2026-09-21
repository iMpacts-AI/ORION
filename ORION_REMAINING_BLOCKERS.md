# ORION REMAINING LIMITATIONS & BLOCKERS

## Summary
The core P0, P1, and P2 capabilities have been rebuilt, wired to production IPC channels, and verified 100% green across 38 test suites. The remaining limitations represent intentional boundary and environment constraints rather than system failures:

---

### 1. Cloud AI Provider API Keys Required for Neural Capabilities
- **Status**: EXPECTED / BY DESIGN
- **Limitation**: When no API key is provided in `.env`, ORION operates via its transparent offline rule-based fallback router (`offline-rule-router`). Cloud neural reasoning, multimodal OCR, and dynamic LLM task decomposition require valid API keys (`GEMINI_API_KEY`, `GROQ_API_KEY`, `GITHUB_TOKEN`, `NVIDIA_API_KEY`, `DEEPSEEK_API_KEY`, etc.).
- **Resolution**: Provide API keys in `.env` or configure them via the Settings HUD UI.

---

### 2. Speech-to-Text (STT) Hardware Microphone Hook
- **Status**: HONEST UNAVAILABLE STATE
- **Limitation**: Text-to-Speech (TTS) plays audio through Windows SAPI (`System.Speech.Synthesis`). STT microphone transcription currently returns an unconfigured status unless an external whisper/cloud audio model is hooked up to the audio stream.
- **Safety Guarantee**: ORION never simulates microphone audio or fakes transcription.

---

### 3. Headless vs Native Desktop Environment Constraints
- **Status**: MANAGED / TEST ISOLATED
- **Limitation**: In CI or headless Linux environments lacking an active desktop session or display manager, physical Windows UIAutomation and screen capture drivers fall back to mock drivers.
- **Runtime Reality**: On native Windows desktops, ORION leverages genuine PowerShell UIAutomation and `desktopCapturer` frame buffers.
