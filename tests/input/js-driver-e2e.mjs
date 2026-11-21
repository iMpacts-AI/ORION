#!/usr/bin/env node
// =============================================================================
// End-to-end test of ORION's JS keyboard/mouse layer (orion.mjs) against the
// real input helper and the input-probe window.
//
// The two input modules are cut out of the given orion.mjs byte-for-byte
// (WindowsNativeInputDriver `cm` and the verified-input client `Jf` + its
// computer.input dispatcher `AA`), so this tests exactly what ships, then drives
// the probe with them and checks what the window received.
//
//   node tests/input/js-driver-e2e.mjs --orion <orion.mjs> --helper <exe or wrapper>
//        --probe <exe> --log <file> [--log-arg <p>] [--runner <wrapper>]
//
// --helper may be a wrapper script that runs the helper (e.g. under Wine).
// =============================================================================
import { spawn, spawnSync, execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
const ORION = arg('orion'), HELPER = arg('helper'), PROBE = arg('probe'), LOG = arg('log');
const LOG_ARG = arg('log-arg', LOG), RUNNER = arg('runner', '');
if (!ORION || !HELPER || !PROBE || !LOG) { console.error('missing arguments'); process.exit(2); }

// ---------------------------------------------------------------- extract modules
const src = fs.readFileSync(ORION, 'utf8');
function block(startMarker) {
  const s = src.indexOf(startMarker);
  if (s < 0) throw new Error(`marker not found: ${startMarker}`);
  let i = src.indexOf('fe(()=>{', s) + 'fe(()=>'.length, depth = 0;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') { // skip strings / templates (no nesting needed here)
      const q = c; i++;
      while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; else if (q === '`' && src[i] === '$' && src[i + 1] === '{') { let d = 1; i += 2; while (d) { if (src[i] === '{') d++; else if (src[i] === '}') d--; i++; } i--; } i++; }
      continue;
    }
    if (c === '/' && src[i + 1] === '/') { while (src[i] !== '\n') i++; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return src.slice(s, i + 2); }
  }
  throw new Error('unbalanced block');
}
const fnSrc = name => {
  const s = src.indexOf(`function ${name}(`);
  let i = src.indexOf('{', s), d = 0;
  for (; i < src.length; i++) { if (src[i] === '{') d++; else if (src[i] === '}' && --d === 0) break; }
  return src.slice(s, i + 1);
};
const dvSrc = block('var vJt,Oi,kn,cm,$E,Kf,dv=fe(');
const heSrc = block('var cze,dze,fse,qE,fze,p6,Jf,HE=fe(');
const aaStart = src.indexOf('async function AA(t,e){');
const aaEnd = src.indexOf('var cze,dze,fse,qE,fze,p6,Jf,HE=fe(');
const moduleSrc = `
import { exec as CGe, execFile as AGe, execFile as uze } from 'node:child_process';
import { promisify as Xne, promisify as lze } from 'node:util';
import * as Zne from 'node:fs';
import * as Aa from 'node:path';
const fe = (t, e) => () => (t && (e = t(t = 0)), e);
const __dirname = ${JSON.stringify(path.dirname(path.resolve(ORION)))};
function ac() { return ${JSON.stringify(HELPER)}; }
${fnSrc('hze')}
${fnSrc('CA')}
${fnSrc('hse')}
${fnSrc('pze')}
${src.slice(aaStart, aaEnd)}
${dvSrc}
${heSrc}
dv(); HE();
export { cm, Kf, kn, Jf, AA };
`;
const tmp = path.join(os.tmpdir(), `orion-input-modules-${process.pid}.mjs`);
fs.writeFileSync(tmp, moduleSrc);
Object.defineProperty(process, 'platform', { value: 'win32' }); // what the code checks; real I/O goes to the helper
const { cm, Jf, AA } = await import(pathToFileURL(tmp).href);
fs.rmSync(tmp);

// ---------------------------------------------------------------- probe + events
const sleep = ms => new Promise(r => setTimeout(r, ms));
const run = (exe, args) => (RUNNER ? [RUNNER, [exe, ...args]] : [exe, args]);
let offset = 0;
const newEvents = () => { const a = fs.existsSync(LOG) ? fs.readFileSync(LOG, 'utf8') : ''; const c = a.slice(offset); offset = a.length; return c.split(/\r?\n/).filter(Boolean); };
async function settle(max = 2500) { const ev = []; let q = 0; for (let t = 0; t < max && q < 250; t += 50) { await sleep(50); const n = newEvents(); if (n.length) { ev.push(...n); q = 0; } else q += 50; } return ev; }
const chars = ev => ev.filter(e => e.startsWith('CHAR|')).map(e => String.fromCharCode(parseInt(e.split('|')[1].slice(2), 16))).join('');
const kd = (ev, k) => ev.find(e => e.startsWith(`KEYDOWN|${k}|`));

fs.rmSync(LOG, { force: true });
const [pc, pa] = run(PROBE, [LOG_ARG, '100', '100', '800', '500']);
const probeErr = process.env.ORION_PROBE_STDERR ? fs.openSync(process.env.ORION_PROBE_STDERR, 'a') : 'ignore';
const probe = spawn(pc, pa, { stdio: ['ignore', probeErr, probeErr], detached: true });
let ready = '';
for (let i = 0; i < 180 && !ready; i++) { await sleep(500); ready = newEvents().find(l => l.startsWith('READY|')) || ''; }
if (!ready) {
  console.error('probe never ready');
  if (process.env.ORION_PROBE_STDERR && fs.existsSync(process.env.ORION_PROBE_STDERR)) console.error(fs.readFileSync(process.env.ORION_PROBE_STDERR, 'utf8').slice(-3000));
  process.exit(1);
}

// Fake PowerShell: records any fallback attempt. Fallbacks must NOT happen while the helper works.
const psLog = path.join(os.tmpdir(), `orion-fake-ps-${process.pid}.log`);
// On Windows the probe exe doubles as a fake PowerShell (see Probe.cs); elsewhere a shell script.
let fakePs = path.join(os.tmpdir(), `orion-fake-ps-${process.pid}.sh`);
if (process.env.OS === 'Windows_NT') { // not os.platform(): process.platform is faked above
  fakePs = PROBE;
  process.env.ORION_FAKE_PS_LOG = psLog;
} else {
  fs.writeFileSync(fakePs, `#!/bin/sh\necho "$@" >> ${psLog}\n`); fs.chmodSync(fakePs, 0o755);
}
const psCalls = () => (fs.existsSync(psLog) ? fs.readFileSync(psLog, 'utf8').split('\n').filter(Boolean).length : 0);

const driver = new cm({ nativeExePathOverride: HELPER, powershellBinaryOverride: fakePs });
const vi = new Jf(); // default runner -> ac() -> HELPER
await driver.mouseMove(500, 350, false); await driver.mouseClick('left'); await settle();

const results = [];
async function test(name, fn, check) {
  newEvents(); const ps0 = psCalls();
  let err = null, ret;
  try { ret = await fn(); } catch (e) { err = e; }
  const ev = await settle();
  let ok = false, why = '';
  try { const v = check(ev, err, ret); ok = v === true; why = v === true ? '' : String(v); } catch (e) { why = e.message; }
  const fellBack = psCalls() - ps0;
  results.push({ name, ok, why, err: err?.message, fellBack, events: ev.slice(0, 30) });
  console.log(`  [${ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m'}] ${name}${ok ? '' : `\n         ${why}\n         error: ${err?.message || '-'}\n         powershell fallbacks: ${fellBack}\n         events: ${JSON.stringify(ev.slice(0, 10))}`}`);
}

console.log(`\nORION JS input layer end-to-end — ${path.basename(ORION)} — probe ${ready}\n`);
console.log('computer.input (verified input, used by the agent)');
await test('click_at left (300,250)', () => AA({ action: 'click_at', x: 300, y: 250 }, vi),
  ev => ev.includes('MOUSEDOWN|Left|300,250') || 'no click at 300,250');
await test('type "Hello ORION — مرحبا"', () => AA({ action: 'type', text: 'Hello ORION — مرحبا' }, vi),
  ev => chars(ev) === 'Hello ORION — مرحبا' || `typed ${JSON.stringify(chars(ev))}`);
await test('key enter', () => AA({ action: 'key', key: 'enter' }, vi), ev => !!kd(ev, 'Enter') || 'no Enter');
await test('hotkey ["ctrl","s"]', () => AA({ action: 'hotkey', keys: ['ctrl', 's'] }, vi),
  ev => (kd(ev, 'S') || '').includes('CTRL:True') || 'no Ctrl+S');
await test('hotkey ["ctrl","space"] (was invalid {SPACE})', () => AA({ action: 'hotkey', keys: ['ctrl', 'space'] }, vi),
  ev => (kd(ev, 'Space') || '').includes('CTRL:True') || 'no Ctrl+Space');
await test('hotkey ["ctrl","pageup"] (was invalid {PAGEUP})', () => AA({ action: 'hotkey', keys: ['ctrl', 'pageup'] }, vi),
  ev => (kd(ev, 'PageUp') || '').includes('CTRL:True') || 'no Ctrl+PageUp');
await test('hotkey ["ctrl","shift","k"]', () => AA({ action: 'hotkey', keys: ['ctrl', 'shift', 'k'] }, vi),
  ev => /CTRL:True\|SHIFT:True/.test(kd(ev, 'K') || '') || 'no Ctrl+Shift+K');
await test('hotkey ["ctrl","k","c"] is refused, not silently sent as Ctrl+K', () => AA({ action: 'hotkey', keys: ['ctrl', 'k', 'c'] }, vi),
  (ev, err) => (err && !kd(ev, 'K')) || `err=${err?.message} events=${JSON.stringify(ev)}`);

console.log('\nWindowsNativeInputDriver (cm: execute_action, drag, scroll)');
await test('mouseMove + click right (700,450)', async () => { await driver.mouseMove(700, 450, false); await driver.mouseClick('right'); },
  ev => ev.some(e => e.startsWith('MOUSEDOWN|Right|700,450')) || 'no right click at 700,450');
await test('scroll -2', () => driver.scroll(-2), ev => ev.some(e => e.startsWith('WHEEL|-240')) || 'no wheel -240');
await test('drag (200,200)->(600,420) via helper', () => driver.drag({ x: 200, y: 200 }, { x: 600, y: 420 }),
  (ev, err) => (ev.includes('DRAG|200,200->600,420') && psCalls() === 0) || `err=${err?.message}`);
await test('typeText unicode', () => driver.typeText('naïve 😀'), ev => chars(ev) === 'naïve 😀' || `typed ${JSON.stringify(chars(ev))}`);
await test('pressKey "insert" (named key)', () => driver.pressKey('insert'), ev => !!kd(ev, 'Insert') && chars(ev) === '' || `typed ${JSON.stringify(chars(ev))}`);
await test('pressKey "ctrl+s" → Ctrl+S, not the text "ctrlS"', () => driver.pressKey('ctrl+s'),
  ev => ((kd(ev, 'S') || '').includes('CTRL:True') && !/ctrl/i.test(chars(ev))) || `typed ${JSON.stringify(chars(ev))}`);
await test('hotkey ["ctrl","space"] → Ctrl+Space, not Ctrl+S + "pace"', () => driver.hotkey(['ctrl', 'space']),
  ev => ((kd(ev, 'Space') || '').includes('CTRL:True') && !kd(ev, 'S') && !/pace/.test(chars(ev))) || `events ${JSON.stringify(ev.slice(0, 8))}`);
await test('hotkey ["ctrl","plus"] → Ctrl+=, not Ctrl+P (print)', () => driver.hotkey(['ctrl', 'plus']),
  ev => ((kd(ev, 'Oemplus') || '').includes('CTRL:True') && !kd(ev, 'P')) || `events ${JSON.stringify(ev.slice(0, 8))}`);
await test('pressKey "foo" is refused and nothing is typed', () => driver.pressKey('foo'),
  (ev, err) => (err && ev.length === 0) || `err=${err?.message} events=${JSON.stringify(ev)}`);

console.log('\nSafety: refusals are final (no PowerShell retry)');
process.env.ORION_EXPECT_HWND = '1'; // pretend the user switched windows
await test('typeText after focus change: refused, nothing typed, no SendKeys retry', () => driver.typeText('SHOULD NOT APPEAR'),
  (ev, err) => (err && chars(ev) === '' && psCalls() === 0) || `err=${err?.message} typed=${JSON.stringify(chars(ev))} ps=${psCalls()}`);
await test('click after focus change: refused, no PowerShell click', () => driver.mouseClick('left'),
  (ev, err) => (err && ev.length === 0 && psCalls() === 0) || `err=${err?.message} events=${JSON.stringify(ev)} ps=${psCalls()}`);
await test('hotkey after focus change: refused', () => driver.hotkey(['ctrl', 'a']),
  (ev, err) => (err && ev.length === 0 && psCalls() === 0) || `err=${err?.message} events=${JSON.stringify(ev)} ps=${psCalls()}`);
delete process.env.ORION_EXPECT_HWND;

try { process.kill(-probe.pid); } catch {}
if (fakePs !== PROBE) fs.rmSync(fakePs, { force: true }); fs.rmSync(psLog, { force: true });
const failed = results.filter(r => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (process.env.ORION_E2E_REPORT) fs.writeFileSync(process.env.ORION_E2E_REPORT, JSON.stringify(results, null, 2));
process.exit(failed.length ? 1 : 0);
