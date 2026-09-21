# ORION V1 — RELEASE BLOCKERS & DEFECT CLASSIFICATION

## 1. Top 10 Release Blockers (Pre-V1 Requirements)
1. **Browser DOM Interaction**: Lacks Playwright/CDP driver for in-page button clicks and form filling.
2. **Offline Visual OCR**: Relies on Cloud Vision API; lacks bundled lightweight local OCR model (e.g. Tesseract.js / ONNX).
3. **Durable Cross-Session Memory**: Unified memory manager stores records in JS RAM; conversation history resets upon app close.
4. **Window Focus Drift in Keystroke Automation**: PowerShell SendKeys requires target window to maintain active focus.
5. **Crash Auto-Restart Daemon**: Main process unhandled exceptions log to console without supervisor daemon relaunch.
6. **Document Ingestion Tools**: No native PDF, Word DOCX, or Excel spreadsheet parser tools bundled in ToolRegistry.
7. **Drag-and-Drop Verification**: Coordinate interpolation exists but is unverified on real Windows shell objects.
8. **Voice Wake-Word Engine**: Microphone toggles speech synthesis, but continuous passive wake-word detection (Porcupine/Snowboy) is stubbed.
9. **Code Signing Certificate**: Unsigned executable triggers Windows SmartScreen warning on clean installations.
10. **Interactive In-App Restart Action**: No UI button to trigger Electron app.relaunch() directly from Settings.