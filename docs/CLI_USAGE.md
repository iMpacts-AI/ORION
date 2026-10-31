# ORION CLI Usage & Interactive Experience Guide

**ORION** provides both a full-screen alternate-buffer terminal user interface (TUI) and deterministic single-shot / JSON automation modes from a single `orion` binary.

---

## 1. Launching ORION

```powershell
# Interactive full-screen TUI (Windows Terminal recommended for 24-bit color & SGR mouse)
orion

# Single-shot natural-language prompt
orion "Hi"
orion "Show my system specifications."

# Single-shot slash command
orion /doctor
orion /status --json
orion /specs --no-color

# Global CLI lifecycle subcommands
orion --version
orion --help
orion doctor
orion upgrade --check
orion upgrade
orion upgrade --rollback
```

---

## 2. Visual Modes & Independent Animation Control

Inspired by clean quiet-mode terminal engineering while preserving ORION's deep-space identity, ORION separates **visual presentation** (`visualMode`) from **high-frequency decorative movement** (`animationsEnabled`). Both preferences persist across launches in `<orion-home>/visual-preferences.json`.

### All 4 Supported Combinations

| Visual Mode | Animations | Resulting Terminal Behavior |
| :--- | :--- | :--- |
| **`vivid`** *(default)* | **`on`** *(default)* | Deep midnight-navy space backdrop, subtle twinkling starfield, occasional diagonal shooting stars, Oris idle breathing/floating/sway + click-jump physics, and active task feedback. |
| **`vivid`** | **`off`** | Retains the deep-space palette, static starfield layout, and canonical pixel-art Oris sprite with **zero** background decorative timers (`0` idle frames/sec). Functional updates (typing, rotating tips, task progress) continue normally. |
| **`minimal`** | **`on`** | Quiet, distraction-free terminal presentation with no background starfield or shooting stars; retains subtle task activity feedback and interactive Oris click responses. |
| **`minimal`** | **`off`** | Maximum efficiency (`0` idle decorative frames/sec, `0 B/s` idle ANSI output); static header/card presentation with instant functional updates only. |

### Visual & Animation Slash Commands

```text
/vivid                Toggle between Vivid and Minimal visual modes (or `/vivid on`, `/vivid off`, `/vivid minimal`)
/animations           Toggle decorative animations independently (`/animations on`, `/animations off`, `/animations status`)
```

### Automatic Unfocused Terminal Pause

ORION enables DECSET `1004` terminal focus reporting (`\x1b[?1004h`). When the terminal window loses focus (`\x1b[O`), ORION automatically pauses starfield timers, Oris idle timers, and Home-screen tip rotation timers — dropping unfocused background output to **`0` frames/sec and `0.00%` CPU** — and resumes seamlessly when focus returns (`\x1b[I`).

---

## 3. Curated Rotating Workflow Tips

On the Home screen, ORION displays a single concise workflow tip in the footer (`Tip: ...`) with highlighted commands/shortcuts:

- **41 Curated ORION-Native Tips Across 11 Categories:** Browser automation, visible desktop control, permission approvals, Emergency Stop (`/stop`), Escape-to-Cancel (`Esc`), slash commands, engine configuration, local privacy, CLI upgrades (`orion upgrade`), verified multi-step execution, and recovery.
- **Weighted, Capability-Aware Selection:** Higher-priority safety and core workflow tips appear proportionally more often; platform- or capability-specific tips filter automatically; consecutive duplicate tips are suppressed.
- **Automatic 10-Second Home Rotation & Clean Teardown:** Tips rotate automatically every ~10 seconds while on the Home screen, pause automatically when the terminal is unfocused, and clean up their timer immediately when leaving Home or unmounting.
- **Manual Tip Cycling (Preserving `Tab`):**
  - Press **`Alt+T`**, click the footer tip line with the mouse, or run **`/tip`** to cycle immediately to the next tip.
  - **`Tab` is intentionally preserved** for `SlashMenu` autocomplete and cycling execution modes (`Build` → `Plan` → `Chat`), and **`Shift+Tab`** cycles reasoning effort (`low` → `medium` → `high` → `max`).

---

## 4. Oris Mascot Personality & Interaction Physics

Oris uses ORION's canonical `18x18` pixel-art sprite (`assets/mascot/oris-sprite.json`), rendered via memoized 24-bit ANSI half-blocks (`9` terminal rows, plus deterministic `--no-color` ASCII fallback):

- **Idle Presence (when `animationsEnabled=true`):** Calm ~2.4s breathing cycle, gentle floating, cursor-aware eye tracking, and an occasional 3-beat cosmic sway dance.
- **Readable Click Reaction (~1,140ms 6-Stage Arc):** Left-clicking Oris triggers a smooth eased arc (`anticipation` crouch → `ascent` → `apex` hang with `✦`/`✧` sparkles → `descent` → `landing` cushion → `idle`), while 3 rapid clicks trigger an acrobatic tumble-flip.
- **Task Lifecycle Reactions:** Oris reflects `thinking`, `executing`, `verifying`, `completed`, `attention` (approval/auth pause), and `error` states without blocking prompt typing.

---

## 5. Keyboard Shortcuts & Core Slash Commands

| Key / Command | Function |
| :--- | :--- |
| `Tab` | Autocomplete selected slash command (when `/` menu is open) or cycle `BUILD` → `PLAN` → `CHAT` mode |
| `Shift+Tab` | Cycle reasoning effort (`LOW` → `MEDIUM` → `HIGH` → `MAX`) |
| `Alt+T` / `/tip` | Cycle immediately to the next curated ORION tip |
| `Ctrl+P` | Open live Runtime Settings, Visual Mode & Security Governance status card |
| `Esc` | Cancel active generation/browser/tool task cleanly (or close open menu / deny pending prompt) |
| `/vivid` | Switch visual presentation mode (`vivid` \| `minimal`) |
| `/animations` | Enable or disable decorative animations independently (`on` \| `off`) |
| `/doctor` | Run full system, policy, tool, path-privacy, and underlying provider/model diagnostic |
| `/status`, `/specs` | Inspect runtime health or explicitly request workstation hardware specifications |
| `/models`, `/providers` | Inspect or switch configured local Ollama or cloud model adapters |
| `/permissions` | View 4-tier risk governance and SHA-256 protected policy status |
| `/approve <id>`, `/deny <id>` | Approve or deny a pending single-use action-bound Tier-2 request |
| `/stop` | Engage authoritative Emergency Stop across managed subprocess trees |
| `/undo`, `/redo`, `/rewind` | SHA-256 conflict-checked workspace file undo, redo, and checkpoint rewind |
| `/clear`, `/exit` | Reset conversation view to Home hero card or cleanly exit ORION |

---

## 6. Engine Identity & Path Privacy

- **Honest Provider-Neutral Public Labels:** Ordinary UI badges and task headers display clean ORION runtime labels without leaking raw internal model identifiers:
  - `ORION Local` — Configured local open-weights runtime via Ollama (e.g., `ollama:llama3.1:8b`).
  - `ORION Core` — Deterministic local command & safety fallback engine (`local-heuristic`).
  - `ORION Intelligence` — Configured external cloud model adapter (`anthropic`, `openai`, `gemini`, `openrouter`, etc.).
  - Running `/doctor` or `orion doctor` transparently discloses the exact underlying provider and model ID (`ORION Local -> ollama:llama3.1:8b`). ORION never claims to operate a proprietary foundation model.
- **Zero Personal Path Leakage:** Ordinary status bars, startup banners, tool summaries, transcripts, and error messages normalize local paths into `<workspace>`, `<orion-home>`, `<orion-install>`, or `~/...` so personal OS usernames and `C:\Users\<user>\...` paths are never exposed.
