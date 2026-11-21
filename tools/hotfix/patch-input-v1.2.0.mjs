#!/usr/bin/env node
// =============================================================================
// Hot-fix for ORION v1.2.0 keyboard + mouse control (orion.mjs side), plus
// macOS wiring: input, real window info, app launch and the accessibility
// tree through native/macos-input (and the Linux X11 helper where it applies).
//
//   node tools/hotfix/patch-input-v1.2.0.mjs <orion.mjs in> <orion.mjs out>
//
// Ships together with the fixed native/win32-native-input helper (which now
// parses shortcuts itself and has mousedown/mouseup/drag). Every patch is an
// exact string replacement that must match exactly once, or nothing is written.
// This exists because ORION's source is not in this repo; port these changes to
// the real source and delete this script.
// =============================================================================
import fs from 'node:fs';
import crypto from 'node:crypto';

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error('usage: patch-input-v1.2.0.mjs <orion.mjs in> <orion.mjs out>');
  process.exit(2);
}

// Helper ran (it printed something) but refused or failed -> report, never fall
// back to PowerShell/SendKeys, which retypes text and ignores the focus guard.
const RAN = q => `String(${q}?.stdout||"").trim()`;

const PATCHES = [
  {
    id: 'K1+K2 typeText: no SendKeys retype after a partial / refused native type',
    find: 'if(/^TYPEUNICODE_OK/m.test(String(n)))return;r=String(n).trim()}catch(n){let s=String(n?.stdout||"");if(/UIPI_BLOCKED/.test(s))throw new kn("typeText","The window in front runs as administrator (or is protected); Windows blocks ORION from typing into it.",{primaryError:s.trim()});r=s.trim()||n?.message||String(n)}',
    replace: 'if(/^TYPEUNICODE_OK/m.test(String(n)))return;r=String(n).trim();throw new kn("typeText","The input helper did not confirm typing: "+r,{primaryError:r})}catch(n){if(n instanceof kn)throw n;let s=String(n?.stdout||"");if(/UIPI_BLOCKED/.test(s))throw new kn("typeText","The window in front runs as administrator (or is protected); Windows blocks ORION from typing into it.",{primaryError:s.trim()});if(s.trim())throw new kn("typeText",/FOCUS_CHANGED/.test(s)?"The window in front changed, so ORION stopped typing instead of typing into the wrong app.":/TYPEUNICODE_PARTIAL/.test(s)?"Typing was interrupted part-way; ORION did not retype it, to avoid duplicate text. "+s.trim():"Typing failed: "+s.trim(),{primaryError:s.trim()});r=n?.message||String(n)}',
  },
  {
    id: 'K6 pressKey: let the helper parse "ctrl+s"/names; no fallback after a refusal; never type unknown key names',
    find: 'let n,s=this.resolveExe();if(s)try{await Oi(s,["presskey",i],{timeout:2e3});return}catch(o){n=o?.message||String(o)}',
    replace: `let n,s=this.resolveExe();if(s)try{await Oi(s,["presskey",e.trim().length?e.trim():i],{timeout:2e3});return}catch(o){if(${RAN('o')})throw new kn("pressKey",\`Key '\${e}' was not pressed: \${String(o.stdout).trim()}\`,{primaryError:String(o.stdout).trim()});n=o?.message||String(o)}if(i===e&&e.trim().length>1)throw new kn("pressKey",\`Unknown key '\${e}'. Nothing was typed.\`);`,
  },
  {
    id: 'K5 cm.hotkey: send the whole chord to the helper ("ctrl+space"), not a SendKeys guess ("^space" = Ctrl+S + "pace")',
    find: 'let o=`${n}${s}`,a,u=this.resolveExe();if(u)try{await Oi(u,["presskey",o],{timeout:2e3});return}catch(c){a=c?.message||String(c)}',
    replace: `let o=\`\${n}\${s}\`,a,u=this.resolveExe();if(u)try{await Oi(u,["presskey",e.map(c=>c.trim()).join("+")],{timeout:2e3});return}catch(c){if(${RAN('c')})throw new kn("hotkey",\`Shortcut [\${e.join("+")}] was not sent: \${String(c.stdout).trim()}\`,{primaryError:String(c.stdout).trim()});a=c?.message||String(c)}if(s.length>1&&!s.startsWith("{"))throw new kn("hotkey",\`Unknown key in shortcut [\${e.join("+")}]. Nothing was sent.\`);`,
  },
  {
    id: 'K3+K4 computer.input hotkey: pass every key to the helper ("ctrl+shift+k"); no invalid {SPACE}/{PAGEUP}, no silently dropped keys',
    find: 'await e.run(["presskey",f+h],3e3)',
    replace: 'await e.run(["presskey",u.join("+")],3e3)',
  },
  {
    id: 'M1 mouseDown: use the helper (fast, DPI-aware) instead of compiling C# in PowerShell each time',
    find: 'async mouseDown(e="left"){this.assertWin32Platform("mouseDown");try{',
    replace: `async mouseDown(e="left"){this.assertWin32Platform("mouseDown");{let x=this.resolveExe();if(x)try{await Oi(x,["mousedown",e],{timeout:2e3});return}catch(q){if(${RAN('q')})throw new kn("mouseDown",String(q.stdout).trim())}}try{`,
  },
  {
    id: 'M1 mouseUp: use the helper; still falls back to PowerShell so a button is never left held',
    find: 'async mouseUp(e="left"){this.assertWin32Platform("mouseUp");try{',
    replace: 'async mouseUp(e="left"){this.assertWin32Platform("mouseUp");{let x=this.resolveExe();if(x)try{await Oi(x,["mouseup",e],{timeout:2e3});return}catch{}}try{',
  },
  {
    id: 'M1 drag: one helper call that presses, moves in steps and always releases',
    find: 'async drag(e,r){await this.mouseMove(e.x,e.y),',
    replace: `async drag(e,r){{let x=this.resolveExe();if(x)try{await Oi(x,["drag",String(Math.round(e.x)),String(Math.round(e.y)),String(Math.round(r.x)),String(Math.round(r.y))],{timeout:8e3});return}catch(q){if(${RAN('q')})throw new kn("drag",String(q.stdout).trim())}}await this.mouseMove(e.x,e.y),`,
  },
  {
    id: 'M4 mouseMove: remember where ORION put the cursor',
    find: 'try{await Oi(a,["setpos",String(n),String(s)],{timeout:2e3});return}',
    replace: 'try{await Oi(a,["setpos",String(n),String(s)],{timeout:2e3});this.__orionPos={x:n,y:s};return}',
  },
  {
    id: 'K2+M4 mouseClick: click at the remembered position in one positioned event (no stale-cursor race); no PowerShell click after a refusal',
    find: 'await Oi(i,["click",e],{timeout:2e3});return}catch(n){r=n?.message||String(n)}',
    replace: `this.__orionPos?await Oi(i,["clickat",String(this.__orionPos.x),String(this.__orionPos.y),e],{timeout:3e3}):await Oi(i,["click",e],{timeout:2e3});return}catch(n){if(${RAN('n')})throw new kn("mouseClick",String(n.stdout).trim());r=n?.message||String(n)}`,
  },
  {
    id: 'M4 mouseDoubleClick: positioned double click',
    find: 'await Oi(e,["doubleclick"],{timeout:2e3});return}catch{}',
    replace: 'this.__orionPos?await Oi(e,["clickat",String(this.__orionPos.x),String(this.__orionPos.y),"left","double"],{timeout:3e3}):await Oi(e,["doubleclick"],{timeout:2e3});return}catch(q){if(String(q?.stdout||"").trim())throw new kn("mouseDoubleClick",String(q.stdout).trim())}',
  },
  {
    id: 'K2 scroll: no PowerShell scroll after the helper refused',
    find: 'await Oi(i,["scroll",String(e)],{timeout:2e3});return}catch(n){r=n?.message||String(n)}',
    replace: `await Oi(i,["scroll",String(e)],{timeout:2e3});return}catch(n){if(${RAN('n')})throw new kn("scroll",String(n.stdout).trim());r=n?.message||String(n)}`,
  },

  // ---------------------------------------------------------------- macOS (+ Linux) wiring
  {
    id: 'MAC1 native helper lookup: bin/orion-input-macos on macOS, bin/orion-input-x11 on Linux; shared async runner',
    find: 'function ac(){let t=process.env.ORION_INSTALL_ROOT?Aa.resolve(process.env.ORION_INSTALL_ROOT):"",e=[',
    replace: 'var __orionMacApps={notepad:"textedit",wordpad:"textedit",calc:"calculator",explorer:"finder",cmd:"terminal",powershell:"terminal",wt:"terminal",control:"system settings",settings:"system settings","ms-settings":"system settings",paint:"preview",mspaint:"preview",snippingtool:"screenshot",taskmgr:"activity monitor",edge:"microsoft edge",msedge:"microsoft edge",chrome:"google chrome",vscode:"code",code:"code",word:"microsoft word",winword:"microsoft word",excel:"microsoft excel",powerpoint:"microsoft powerpoint",powerpnt:"microsoft powerpoint",outlook:"microsoft outlook",onenote:"microsoft onenote",teams:"microsoft teams"};function __orionExpectApp(a){return process.platform==="darwin"&&__orionMacApps[a]||a}function __orionNativeAsync(a,t=8e3){let n=ac();return n?new Promise(r=>require("child_process").execFile(n,a,{timeout:t,maxBuffer:4194304,windowsHide:!0},(x,o)=>r({stdout:String(o||x?.stdout||""),code:x?(typeof x.code=="number"?x.code:1):0}))):Promise.resolve(null)}function ac(){let t=process.env.ORION_INSTALL_ROOT?Aa.resolve(process.env.ORION_INSTALL_ROOT):"";if(process.platform!=="win32"){let m=process.platform==="darwin"?"orion-input-macos":"orion-input-x11";for(let c of[...(t?[Aa.join(t,"bin",m)]:[]),Aa.join(__dirname,"bin",m)])if(Zne.existsSync(c))return c;return null}let e=[',
  },
  {
    id: 'MAC2 input driver: allowed on macOS/Linux when the native helper is installed',
    find: 'assertWin32Platform(e){if(process.platform!=="win32")throw',
    replace: 'assertWin32Platform(e){if(process.platform!=="win32"&&!ac())throw',
  },
  {
    id: 'MAC3 computer.input (verified input used by the agent): run the macOS/Linux helper too',
    find: 'if(!n||process.platform!=="win32")return{stdout:"ERR_UNAVAILABLE:native input helper not found"',
    replace: 'if(!n)return{stdout:"ERR_UNAVAILABLE:native input helper not found"',
  },
  {
    id: 'MAC4 active window: ask the OS (helper "foreground") instead of the hardcoded "ORION AI Command Shell / Electron"',
    find: 'vv=class{async getActiveWindow(){if(process.platform==="win32")try{',
    replace: 'vv=class{async getActiveWindow(){if(process.platform!=="win32"){let q=await __orionNativeAsync(["foreground"],3e3),m=q&&q.stdout.match(/HWND:(\\d+)\\|PID:(\\d+)\\|PROCESS:([^|]*)\\|TITLE:([^|\\r\\n]*)(?:\\|BOUNDS:(-?\\d+),(-?\\d+),(\\d+),(\\d+))?/);if(m)return{title:m[4].trim()||m[3],processName:m[3],processId:Number(m[2]),bounds:m[5]?{x:+m[5],y:+m[6],width:+m[7],height:+m[8]}:{x:0,y:0,width:1920,height:1080}};return{title:"Unknown Window (window information unavailable on this system)",processName:"Unknown",bounds:{x:0,y:0,width:1920,height:1080}}}if(process.platform==="win32")try{',
  },
  {
    id: 'MAC5 never report the made-up "Electron" window',
    find: 'return{title:"ORION AI Command Shell",processName:"Electron",bounds:',
    replace: 'return{title:"Unknown Window",processName:"Unknown",bounds:',
  },
  {
    id: 'MAC6 visible windows on macOS from the OS (helper "windows")',
    find: 'async getVisibleWindows(){if(process.platform==="win32")try{',
    replace: 'async getVisibleWindows(){if(process.platform==="darwin"){let q=await __orionNativeAsync(["windows"],3e3),o=[];for(let l of(q?.stdout||"").split(/\\r?\\n/))if(l.startsWith("{"))try{let w=JSON.parse(l);o.push({title:w.title||w.process,processName:w.process,processId:w.pid,bounds:{x:w.x,y:w.y,width:w.w,height:w.h}})}catch{}return o}if(process.platform==="win32")try{',
  },
  {
    id: 'MAC7 never report made-up visible windows ("Visual Studio Code" ...)',
    find: 'return[{title:"ORION AI Command Shell",processName:"Electron"},{title:"Visual Studio Code",processName:"Code.exe"}]',
    replace: 'return[]',
  },
  {
    id: 'MAC8 focus window: real activation on macOS; no fake success elsewhere',
    find: 'ORION_WIN_TARGET:r}}),!0}catch{return!1}return!0}},TA=class{',
    replace: 'ORION_WIN_TARGET:r}}),!0}catch{return!1}if(process.platform==="darwin"){let q=await __orionNativeAsync(["focus",Buffer.from(r,"utf8").toString("base64")],6e3);return!!q&&q.code===0&&/^FOCUS_OK/m.test(q.stdout)}return!1}},TA=class{',
  },
  {
    id: 'MAC9 open app on macOS: launch via LaunchServices (Windows names mapped: Notepad->TextEdit, ...), verified in front',
    find: '}else await this.windowManager.focusWindow(S.canonicalId||T);this.rememberTyping',
    replace: '}else if(process.platform==="darwin"){let L=S.isProtocolUri?S.resolvedExecutablePath:T,q=await __orionNativeAsync(["launch",Buffer.from(L,"utf8").toString("base64")],15e3),M=(q?.stdout||"").match(/^LAUNCH_OK:([^|\\r\\n]*)/m);if(!q)throw new Error("ORION\'s macOS helper (bin/orion-input-macos) is missing, so apps cannot be opened.");if(/^LAUNCH_NOT_FOUND/m.test(q.stdout))throw new Error(`ENOENT: Application \'${S.displayName||T}\' is not installed on this Mac.`);if(M){let A=M[1].trim();e.parameters._resolvedDisplayName=A,e.parameters._resolvedProcessNames=[...(S.processNames||[]),A];let P=q.stdout.match(/PID:(\\d+)/);P&&(e.parameters._spawnedPid=Number(P[1]))}e.parameters._processRunningVerified=!!M,e.parameters._windowFocusVerified=!!M&&/FRONT:True|URL:/.test(q.stdout)}else await this.windowManager.focusWindow(S.canonicalId||T);this.rememberTyping',
  },
  {
    id: 'MAC10 "is the right app in front" check: on macOS expect the Mac app (calc -> Calculator, notepad -> TextEdit)',
    find: 'if(e.verifyActiveApp&&r){let i=e.verifyActiveApp.toLowerCase(),',
    replace: 'if(e.verifyActiveApp&&r){let i=__orionExpectApp(e.verifyActiveApp.toLowerCase()),',
  },
];

let src = fs.readFileSync(inPath, 'utf8');
const sha = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
console.log(`input  ${inPath} (sha256 ${sha(src)}…)`);
const errors = [];
for (const p of PATCHES) {
  const n = src.split(p.find).length - 1;
  if (n !== 1) errors.push(`${p.id}: expected 1 match, found ${n}`);
}
if (errors.length) {
  console.error('Not patched — this file is not the expected v1.2.0 build:\n  ' + errors.join('\n  '));
  process.exit(1);
}
for (const p of PATCHES) {
  src = src.replace(p.find, () => p.replace);
  console.log(`  patched: ${p.id}`);
}
fs.writeFileSync(outPath, src);
console.log(`output ${outPath} (sha256 ${sha(src)}…)`);
