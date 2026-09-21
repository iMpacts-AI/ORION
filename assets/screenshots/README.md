# ORION Screenshot Package & Capture Catalog

This catalog outlines the formal visual assets and screenshot capture specifications for ORION demonstrations, investor briefs, portfolio presentations, and technical documentation.

---

## 1. Screenshot Catalog & Asset Directory

| Asset ID | Target View / Screen | Component File | Description & Key Visual Elements |
| :--- | :--- | :--- | :--- |
| **`01_hud_command_center`** | Holographic Command HUD | `src/renderer/hud/WorldGlobe.tsx`<br>`src/renderer/hud/SystemStatusPanel.tsx` | Full 3D rotating world sphere, live CPU per-core telemetry gauges, activity event log feed, and active task status banner. |
| **`02_system_diagnostics`** | System Diagnostics View | `src/renderer/screens/SystemScreen.tsx`<br>`SystemStatusPanel.tsx` | Complete hardware telemetry view showing CPU model, 24 detected logical cores, 128 GB RAM utilization, and GPU model. |
| **`03_computer_control`** | Desktop Control & Grounding | `src/renderer/screens/ComputerScreen.tsx` | Live desktop screen observation, UI Automation element bounding boxes, action planning input, and red Emergency Stop button. |
| **`04_provider_network`** | Omni-Brain AI Fabric | `src/renderer/screens/ProviderNetworkScreen.tsx` | Multi-provider grid (OpenRouter, Groq, Gemini, DeepSeek), strategy selector, latency metrics, and live qualification ping results. |
| **`05_persistent_memory`** | Semantic & Explicit Memory | `src/renderer/screens/MemoryScreen.tsx` | Local disk-persisted memory records (`.orion_memory/`), category filtering, and memory creation modal. |
| **`06_titan_video_pipeline`**| Titan Video Production HUD | `src/renderer/hud/TitanHUDPanel.tsx` | Closed-loop state progression (Draft Inspection → Plan → Render Approval → QA Retention Score → Release Packaging). |
| **`07_impact_web_platform`** | iMpact Live Website | `https://impacts-ai.com` | Official responsive web platform: editorial typography (*Instrument Sans*), bilingual language toggle, and ORION product overview. |

---

## 2. Capture Protocol & Guidelines

To ensure visual consistency across all portfolio and recognition documents:

1. **Window Dimensions**: Capture at standard resolution **1600 × 960 px** or full desktop **1920 × 1080 px**.
2. **Color Profile**: Dark Mode active (`#050608` background for ORION HUD; `#141417` for `impacts-ai.com`).
3. **Data Integrity**: Ensure live telemetry gauges are displaying active real hardware data (not simulated zeros or flat lines).
4. **Zero Key Exposure**: Confirm that no API tokens or secret strings are visible in screen captures (the Provider Network screen strictly masks keys).
5. **Format**: Save as uncompressed, high-contrast PNG files directly into `assets/screenshots/`.
