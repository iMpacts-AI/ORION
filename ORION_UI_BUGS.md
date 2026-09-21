# ORION UI BUGS & INTERACTION ANOMALIES

**Audit Date:** September 1, 2026  
**Auditor Role:** Independent UX & Product Reliability Tester  
**Repository:** C:\Users\smsaq\Downloads\ORION  

---

### Bug 1: Missing Critical Action User Confirmation Checkbox in Low-Level Tool Dispatch
* **Screen:** `ComputerScreen.tsx` (Right Column: Tool Dispatch Matrix)
* **Action:** Select a tool with `CRITICAL` permission (e.g. file writing, destructive shell execution) and click `[ DISPATCH TOOL ]`.
* **Expected:** A UI checkbox labeled *"I approve critical execution"* should be presented next to the parameters editor allowing the operator to toggle `userConfirmed` before dispatching.
* **Actual:** In `handleExecuteTool` (lines 100–103), the code checks `if (selectedTool.permissionLevel === 'CRITICAL' && !userConfirmed) { setExecutionOutput('[SECURITY BLOCK] Execution refused...'); return; }`. However, there is no checkbox rendered in the JSX to toggle `userConfirmed` to `true`. Thus, CRITICAL tools can never be dispatched from this screen.
* **Severity:** **HIGH**
* **Evidence:** `src/renderer/screens/ComputerScreen.tsx:100-104` vs `src/renderer/screens/ComputerScreen.tsx:298-312`.
* **Recommendation:** Render a confirmation checkbox `<input type="checkbox" checked={userConfirmed} onChange={e => setUserConfirmed(e.target.checked)} /> [CONFIRM CRITICAL TOOL CALL]` when `selectedTool.permissionLevel === 'CRITICAL'`.

---

### Bug 2: Blocking Native JavaScript Alert on Optical Sensor Capture Attempt
* **Screen:** `VisionScreen.tsx` (Optical Sensor & Display Feed)
* **Action:** Click `[ ANALYZE CAMERA FRAME ]` while Camera is toggled OFF in the top privacy bar.
* **Expected:** An in-HUD dismissible notification banner or toast explaining that camera privacy is active.
* **Actual:** The code triggers `alert("SECURITY WARNING: Camera is currently toggled OFF in header privacy settings.");`, freezing Electron rendering and thread execution until the native OS dialog is dismissed.
* **Severity:** **MEDIUM**
* **Evidence:** `src/renderer/screens/VisionScreen.tsx:14-17`.
* **Recommendation:** Replace `alert()` with a reactive state toast banner `<div className="bg-red-500/20 border border-red-500 p-2 text-xs">...</div>` or automatic camera activation prompt.

---

### Bug 3: Ephemeral Memory Storage Claiming Permanent User Preference Bank
* **Screen:** `MemoryScreen.tsx` (User-Controlled Memory Bank)
* **Action:** Add custom explicit memory items (e.g., `preferred_theme: Neon Blue`), reload or relaunch ORION.
* **Expected:** User explicit memories should be persisted to local storage or a local JSON/SQLite file.
* **Actual:** `MemoryService.ts` maintains an in-memory `Map<string, MemoryItem>` seeded only at class instantiation (`this.seedDefaultExplicitMemories()`). Restarting ORION discards all newly added memories and restores the default seeds.
* **Severity:** **MEDIUM**
* **Evidence:** `src/main/services/MemoryService.ts:10-75`.
* **Recommendation:** Back `MemoryService` with disk persistence (e.g., `fs.writeFileSync` to user data directory or SQLite) so user additions survive restarts.

---

### Bug 4: Silent Failure / False Positive Feedback on API Key Configuration
* **Screen:** `ProviderNetworkScreen.tsx` (Credential Manager)
* **Action:** Enter an invalid string into `GROQ_API_KEY` and click `[ SAVE & ACTIVATE CLOUD PROVIDERS ]`.
* **Expected:** The system should validate key format or test connectivity to Groq before declaring activation success.
* **Actual:** The UI immediately flashes `SUCCESSFULLY ACTIVATED PROVIDER KEYS!` without performing an authentication handshake. The user discovers failure only if they separately run a qualification test or attempt a task.
* **Severity:** **MEDIUM**
* **Evidence:** `src/renderer/screens/ProviderNetworkScreen.tsx:71-78`.
* **Recommendation:** Chain `saveProviderKeys` with a targeted ping/handshake to the newly configured provider and display individual provider verification statuses.

---

### Bug 5: No In-Flight Task Cancellation Control in Main HUD Command Bar
* **Screen:** `App.tsx` / `MainContentArea.tsx` (Command Bar & Activity Feed)
* **Action:** Submit a complex query via the bottom text bar that triggers a long multi-tool execution plan.
* **Expected:** The input area or task panel should provide a red `[ CANCEL ]` button to stop orchestrator execution.
* **Actual:** The command bar remains static while `assistantState` is `THINKING` / `EXECUTING`. The user cannot stop execution from the main command bar without navigating to the Computer screen and clicking `EMERGENCY STOP`.
* **Severity:** **MEDIUM**
* **Evidence:** `src/renderer/App.tsx:193-222`.
* **Recommendation:** Render a dynamic `[ STOP / CANCEL ]` button next to the input field whenever `assistantState !== 'STANDBY'`.
