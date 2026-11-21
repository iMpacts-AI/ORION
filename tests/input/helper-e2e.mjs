#!/usr/bin/env node
// =============================================================================
// End-to-end keyboard + mouse test for ORION's Windows input helper.
//
// Starts input-probe (a window that logs every input event it receives), drives
// it with win32-native-input.exe, and asserts on what the window really got:
// exact click coordinates, every typed character, modifier state, wheel, drag,
// and that nothing at all arrives when the helper is supposed to refuse.
//
//   node tests/input/helper-e2e.mjs --helper <exe> --probe <exe> --log <file>
//        [--log-arg <path as the probe sees it>] [--runner <wrapper>]
//
// On Windows run the exes directly. On Linux run them under Wine with
// `--runner ./wine-wrapper --log-arg 'Z:\path\probe.log'`.
// Exit code 1 if any check fails. ORION_E2E_REPORT=<file> writes JSON results.
// =============================================================================
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : def;
};
const HELPER = arg('helper');
const PROBE = arg('probe');
const LOG = arg('log');
const LOG_ARG = arg('log-arg', LOG);
const RUNNER = arg('runner', '');
if (!HELPER || !PROBE || !LOG) {
  console.error('usage: helper-e2e.mjs --helper <exe> --probe <exe> --log <file> [--log-arg <p>] [--runner <cmd>]');
  process.exit(2);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const cmdline = (exe, args) => (RUNNER ? [RUNNER, [exe, ...args]] : [exe, args]);

function helper(args, env = {}) {
  const [c, a] = cmdline(HELPER, args);
  const r = spawnSync(c, a, { encoding: 'utf8', timeout: 60000, env: { ...process.env, ...env } });
  return { code: r.status, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}
const b64 = s => Buffer.from(s, 'utf8').toString('base64');

let offset = 0;
// Wait until the probe has logged everything the command caused (quiet for 200 ms).
async function settle(maxMs = 2000) {
  const ev = [];
  let quiet = 0;
  for (let t = 0; t < maxMs && quiet < 200; t += 50) {
    await sleep(50);
    const n = newEvents();
    if (n.length) { ev.push(...n); quiet = 0; } else quiet += 50;
  }
  return ev;
}
function newEvents() {
  const all = fs.existsSync(LOG) ? fs.readFileSync(LOG, 'utf8') : '';
  const chunk = all.slice(offset);
  offset = all.length;
  return chunk.split(/\r?\n/).filter(Boolean);
}
const chars = ev => ev.filter(e => e.startsWith('CHAR|')).map(e => String.fromCharCode(parseInt(e.split('|')[1].slice(2), 16))).join('');
const keydowns = ev => ev.filter(e => e.startsWith('KEYDOWN|'));

const results = [];
async function test(group, name, args, check, env) {
  newEvents(); // discard anything stray
  const r = helper(args, env);
  const ev = await settle();
  const probeErr = ev.find(e => e.startsWith('PROBE_ERROR|'));
  if (probeErr) console.log(`  [probe] ${probeErr}`);
  let ok = false, why = '';
  try {
    const v = await check(ev, r);
    ok = v === true || v === undefined;
    if (typeof v === 'string') { ok = false; why = v; }
  } catch (e) { why = e.message; }
  if (!ok && !why) why = 'check failed';
  results.push({ group, name, ok, why, helper: r.out.slice(0, 200), code: r.code, events: ev.slice(0, 40) });
  console.log(`  [${ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m'}] ${name}${ok ? '' : `\n         ${why}\n         helper(${r.code}): ${r.out.slice(0, 160)}\n         events: ${JSON.stringify(ev.slice(0, 12))}`}`);
}
const expect = (cond, msg) => { if (!cond) throw new Error(msg); };
const hasEvent = (ev, s) => ev.includes(s);
const mouseAt = (ev, kind, btn, x, y) => hasEvent(ev, `${kind}|${btn}|${x},${y}`);
function noTextTyped(ev, forbidden) {
  const c = chars(ev).replace(/[\u0000-\u001f]/g, '');
  return c.length === 0 || `typed text "${c}" (expected only the shortcut${forbidden ? `, never "${forbidden}"` : ''})`;
}
function chord(ev, keyName, mods) {
  // .NET names some keys differently per runtime (Windows: Return / Next, Mono: Enter / PageDown); same key code.
  const ALIASES = { Enter: ['Enter', 'Return'], Next: ['Next', 'PageDown'], PageUp: ['PageUp', 'Prior'], Back: ['Back'] };
  const names = ALIASES[keyName] || [keyName];
  const kd = keydowns(ev).find(e => names.includes(e.split('|')[1]));
  if (!kd) return `no KEYDOWN for ${keyName}; got ${JSON.stringify(keydowns(ev))}`;
  for (const [m, want] of Object.entries(mods)) {
    if (!kd.includes(`${m}:${want ? 'True' : 'False'}`)) return `${keyName} arrived with wrong modifiers: ${kd}`;
  }
  return true;
}

// ------------------------------------------------------------------ start probe
fs.rmSync(LOG, { force: true });
const [pc, pa] = cmdline(PROBE, [LOG_ARG, '100', '100', '800', '500']);
const probeErr = process.env.ORION_PROBE_STDERR ? fs.openSync(process.env.ORION_PROBE_STDERR, 'a') : 'ignore';
const probe = spawn(pc, pa, { stdio: ['ignore', probeErr, probeErr], detached: true });
let ready = '';
for (let i = 0; i < 180 && !ready; i++) {
  await sleep(500);
  ready = newEvents().find(l => l.startsWith('READY|')) || '';
}
if (!ready) {
  console.error('probe window never became ready');
  if (process.env.ORION_PROBE_STDERR && fs.existsSync(process.env.ORION_PROBE_STDERR)) console.error(fs.readFileSync(process.env.ORION_PROBE_STDERR, 'utf8').slice(-3000));
  process.exit(1);
}
const HWND = ready.match(/HWND:(\d+)/)[1];
console.log(`\nORION input helper end-to-end test — probe ${ready}\n`);
helper(['setpos', '500', '350']);
helper(['clickat', '500', '350']); // make sure the probe has focus
await sleep(300);

// ------------------------------------------------------------------ mouse
console.log('Mouse');
await test('mouse', 'setpos moves the cursor exactly (300,250)', ['setpos', '300', '250'], (ev, r) => {
  const g = helper(['getpos']).out;
  return g === 'POS:300,250' || `getpos says ${g}`;
});
await test('mouse', 'left click lands on the exact pixel (300,250)', ['clickat', '300', '250', 'left'],
  ev => mouseAt(ev, 'MOUSEDOWN', 'Left', 300, 250) && mouseAt(ev, 'MOUSEUP', 'Left', 300, 250) || 'no left down/up at 300,250');
await test('mouse', 'right click near the window corner (880,580)', ['clickat', '880', '580', 'right'],
  ev => mouseAt(ev, 'MOUSEDOWN', 'Right', 880, 580) && mouseAt(ev, 'MOUSEUP', 'Right', 880, 580) || 'no right down/up at 880,580');
await test('mouse', 'middle click (450,300)', ['clickat', '450', '300', 'middle'],
  ev => mouseAt(ev, 'MOUSEDOWN', 'Middle', 450, 300) || 'no middle down at 450,300');
await test('mouse', 'double click is seen as a double click (400,300)', ['clickat', '400', '300', 'left', 'double'],
  ev => ev.some(e => e.startsWith('DOUBLECLICK|Left|400,300')) || 'no DOUBLECLICK event');
// Windows sends one wheel event per scroll call, X11 one per notch: compare the total.
const wheel = ev => ev.filter(e => e.startsWith('WHEEL|')).reduce((n, e) => n + Number(e.split('|')[1]), 0);
await test('mouse', 'scroll down 3 notches', ['scroll', '-3'], ev => wheel(ev) === -360 || `wheel total ${wheel(ev)}`);
await test('mouse', 'scroll up 2 notches', ['scroll', '2'], ev => wheel(ev) === 240 || `wheel total ${wheel(ev)}`);
await test('mouse', 'drag (200,200) -> (600,420)', ['drag', '200', '200', '600', '420'],
  ev => hasEvent(ev, 'DRAG|200,200->600,420') || 'no DRAG 200,200->600,420');
await test('mouse', 'mousedown + mouseup as separate commands', ['mousedown', 'left'], async ev => {
  const up = helper(['mouseup', 'left']);
  const after = await settle();
  return (ev.some(e => e.startsWith('MOUSEDOWN|Left')) && after.some(e => e.startsWith('MOUSEUP|Left'))) || `down=${JSON.stringify(ev)} up=${up.out} ${JSON.stringify(after)}`;
});

// ------------------------------------------------------------------ keyboard
console.log('\nKeyboard');
const typed = async (name, text, want = text.replace(/\n/g, '\r')) =>
  test('keyboard', name, ['typeunicode', b64(text)], ev => {
    const got = chars(ev);
    return got === want || `typed ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`;
  });
await typed('types plain ASCII exactly', 'Hello ORION 123');
await typed('types punctuation that SendKeys treats specially', '{a}+b^c%d~e(f)[g]');
await typed('types accented Latin', 'café ñandú über');
await typed('types Arabic', 'مرحبا بالعالم');
await typed('types emoji (surrogate pair)', 'ok 😀');
await typed('types newline as Enter and tab as Tab', 'line1\nline2\tend', 'line1\rline2\tend');

// Characters a key legitimately produces itself (Enter -> CR, Ctrl+Space -> ' ', ...).
const OWN_CHAR = /^CHAR\|U\+00(0D|09|1B|08|20|7F)\|/;
const key = (name, spec, keyName, mods = {}) =>
  test('keyboard', name, ['presskey', spec], ev => {
    const c = chord(ev, keyName, mods);
    if (c !== true) return c;
    return noTextTyped(ev.filter(e => !OWN_CHAR.test(e)), spec);
  });
await key('Enter', 'enter', 'Enter');
await key('{ENTER} (SendKeys spelling)', '{ENTER}', 'Enter');
await key('Tab', 'tab', 'Tab');
await key('Escape', 'esc', 'Escape');
await key('Backspace', 'backspace', 'Back');
await key('F5', 'f5', 'F5');
await key('Page Up', 'pageup', 'PageUp');
await key('{PGDN}', '{PGDN}', 'Next');
await key('Insert', 'insert', 'Insert');
await key('Home', 'home', 'Home');

console.log('\nShortcuts');
await key('ctrl+s', 'ctrl+s', 'S', { CTRL: true, SHIFT: false });
await key('Ctrl + Shift + K (spaces, capitals)', 'Ctrl + Shift + K', 'K', { CTRL: true, SHIFT: true });
await key('^s (SendKeys)', '^s', 'S', { CTRL: true });
await key('^space → Ctrl+Space (was Ctrl+S then "pace")', '^space', 'Space', { CTRL: true });
await key('^{SPACE} → Ctrl+Space', '^{SPACE}', 'Space', { CTRL: true });
await key('^{PAGEUP} → Ctrl+PageUp', '^{PAGEUP}', 'PageUp', { CTRL: true });
await key('ctrl+plus → Ctrl+= (zoom in, was Ctrl+P print)', 'ctrl+plus', 'Oemplus', { CTRL: true });
await key('+{TAB} → Shift+Tab', '+{TAB}', 'Tab', { SHIFT: true, CTRL: false });
await key('cmd+c → Ctrl+C', 'cmd+c', 'C', { CTRL: true });
await key('ctrl+f12', 'ctrl+f12', 'F12', { CTRL: true });
await test('keyboard', 'single "?" is typed as the character', ['presskey', '?'], ev => chars(ev) === '?' || `typed ${JSON.stringify(chars(ev))}`);
await test('keyboard', 'unknown key "foo" is refused and nothing is sent', ['presskey', 'foo'],
  (ev, r) => (r.code === 2 && /ERR_INVALID_KEY/.test(r.out) && ev.length === 0) || `exit ${r.code}, events ${JSON.stringify(ev)}`);
await test('keyboard', 'shortcut with unknown key "ctrl+banana" is refused', ['presskey', 'ctrl+banana'],
  (ev, r) => (r.code === 2 && ev.length === 0) || `exit ${r.code}, events ${JSON.stringify(ev)}`);

// ------------------------------------------------------------------ safety
console.log('\nSafety');
await test('safety', 'focus guard: typing is refused when the expected window is not in front', ['typeunicode', b64('SHOULD NOT APPEAR')],
  (ev, r) => (r.code === 13 && /FOCUS_CHANGED/.test(r.out) && chars(ev) === '') || `exit ${r.code}, typed ${JSON.stringify(chars(ev))}`,
  { ORION_EXPECT_HWND: '1' });
await test('safety', 'focus guard: clicks are refused too', ['clickat', '300', '300'],
  (ev, r) => (r.code === 13 && ev.length === 0) || `exit ${r.code}, events ${JSON.stringify(ev)}`, { ORION_EXPECT_HWND: '1' });
await test('safety', 'focus guard: drag is refused too', ['drag', '200', '200', '300', '300'],
  (ev, r) => (r.code === 13 && ev.length === 0) || `exit ${r.code}, events ${JSON.stringify(ev)}`, { ORION_EXPECT_HWND: '1' });
await test('safety', 'focus guard: correct window → input goes through', ['typeunicode', b64('ok')],
  ev => chars(ev) === 'ok' || `typed ${JSON.stringify(chars(ev))}`, { ORION_EXPECT_HWND: HWND });
await test('safety', 'releaseall lifts a stuck Ctrl', ['keydown', 'ctrl'], async ev => {
  const r = helper(['releaseall']);
  const after = await settle();
  return (/RELEASEALL_OK:[1-9]/.test(r.out) && after.some(e => e === 'KEYUP|ControlKey')) || `releaseall=${r.out} events=${JSON.stringify(after)}`;
});

// ------------------------------------------------------------------ report
try { process.kill(-probe.pid); } catch { try { probe.kill(); } catch {} }
const failed = results.filter(r => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (process.env.ORION_E2E_REPORT) fs.writeFileSync(process.env.ORION_E2E_REPORT, JSON.stringify(results, null, 2));
process.exit(failed.length ? 1 : 0);
