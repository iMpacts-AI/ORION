#!/usr/bin/env node
// =============================================================================
// macOS end-to-end: apps, windows, accessibility controls, and ORION itself.
//
//   node tests/input/macos-apps-e2e.mjs --helper <orion-input-macos> --probe <input-probe-macos>
//        --log <file> [--orion <orion.mjs patched, with bin/orion-input-macos next to it>]
//
// Every check asks macOS what really happened (front app, window list, the
// probe window's own log), never just the helper's or ORION's reply.
// Made by iMpact Team.
// =============================================================================
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
const HELPER = arg('helper'), PROBE = arg('probe'), LOG = arg('log'), ORION = arg('orion');
if (!HELPER || !PROBE || !LOG) { console.error('missing arguments'); process.exit(2); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
const b64 = s => Buffer.from(s, 'utf8').toString('base64');
const helper = (args, env = {}) => {
  const r = spawnSync(HELPER, args, { encoding: 'utf8', timeout: 60000, env: { ...process.env, ...env } });
  return { code: r.status, out: (r.stdout || '').trim() };
};
const front = () => {
  const m = helper(['foreground']).out.match(/PROCESS:([^|]*)/);
  return m ? m[1] : '';
};
const quit = app => spawnSync('osascript', ['-e', `tell application "${app}" to quit`], { timeout: 15000 });

const results = [];
async function test(group, name, fn) {
  let ok = false, why = '';
  try { const v = await fn(); ok = v === true; why = v === true ? '' : String(v); } catch (e) { why = e.message; }
  results.push({ group, name, ok, why });
  console.log(`  [${ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m'}] ${name}${ok ? '' : `\n         ${why}`}`);
}

console.log(`\nORION macOS apps + windows + accessibility — ${helper(['status']).out}\n`);

// ------------------------------------------------------------------ apps
console.log('Apps (helper)');
for (const a of ['TextEdit', 'Calculator']) quit(a);
await sleep(1500);
await test('apps', 'launch TextEdit → TextEdit is the front app', async () => {
  const r = helper(['launch', b64('TextEdit')]);
  return (r.code === 0 && /^LAUNCH_OK:TextEdit/m.test(r.out) && front() === 'TextEdit') || `exit ${r.code}: ${r.out} | front=${front()}`;
});
await test('apps', 'launch "calculator" → Calculator is the front app', async () => {
  const r = helper(['launch', b64('calculator')]);
  return (r.code === 0 && front() === 'Calculator') || `exit ${r.code}: ${r.out} | front=${front()}`;
});
await test('apps', 'launch "notepad" (Windows name) → TextEdit comes to the front', async () => {
  const r = helper(['launch', b64('notepad')]);
  return (r.code === 0 && front() === 'TextEdit') || `exit ${r.code}: ${r.out} | front=${front()}`;
});
await test('apps', 'focus Calculator → Calculator is the front app', async () => {
  const r = helper(['focus', b64('Calculator')]);
  return (r.code === 0 && /^FOCUS_OK/m.test(r.out) && front() === 'Calculator') || `exit ${r.code}: ${r.out} | front=${front()}`;
});
await test('apps', 'windows lists the real open windows (TextEdit and Calculator)', async () => {
  const r = helper(['windows']);
  const ws = r.out.split('\n').filter(l => l.startsWith('{')).map(l => JSON.parse(l));
  const names = new Set(ws.map(w => w.process));
  return (names.has('TextEdit') && names.has('Calculator')) || `windows: ${[...names].join(', ')}`;
});
await test('apps', 'an app that is not installed is refused (nothing opens)', async () => {
  const before = front();
  const r = helper(['launch', b64('NoSuchAppOrion123')]);
  return (r.code === 8 && /LAUNCH_NOT_FOUND/.test(r.out) && front() === before) || `exit ${r.code}: ${r.out}`;
});
await test('apps', 'open a website → a browser comes to the front', async () => {
  const r = helper(['launch', b64('https://example.com')]);
  const f = front();
  return (r.code === 0 && /^LAUNCH_OK:/m.test(r.out) && f && f !== 'Calculator') || `exit ${r.code}: ${r.out} | front=${f}`;
});

// ------------------------------------------------------------------ accessibility
console.log('\nAccessibility controls (helper, real AppKit controls)');
fs.rmSync(LOG, { force: true });
const probe = spawn(PROBE, [LOG, '100', '100', '800', '500', '--controls'], { stdio: 'ignore', detached: true });
let ready = '';
for (let i = 0; i < 60 && !ready; i++) { await sleep(500); ready = (fs.existsSync(LOG) ? fs.readFileSync(LOG, 'utf8') : '').split('\n').find(l => l.startsWith('READY|')) || ''; }
const probeLog = () => (fs.existsSync(LOG) ? fs.readFileSync(LOG, 'utf8') : '');
helper(['clickat', '700', '500']); await sleep(400); // focus the probe
await test('ax', 'probe window is in front', async () => (front().startsWith('input-probe') || `front=${front()} ready=${ready}`));
let controls = [];
await test('ax', 'uia-list finds the button, text field and checkbox by name', async () => {
  const r = helper(['uia-list', '50']);
  controls = r.out.split('\n').filter(l => l.startsWith('{')).map(l => JSON.parse(l));
  const has = (n, role) => controls.some(c => c.name === n && c.role === role);
  return (has('Press Me', 'Button') && has('Your name', 'Edit') && has('Remember me', 'CheckBox')) || `exit ${r.code}: ${JSON.stringify(controls).slice(0, 400)} ${r.out.slice(-200)}`;
});
await test('ax', 'uia-invoke "Press Me" presses the real button', async () => {
  const r = helper(['uia-invoke', b64('Press Me')]);
  await sleep(400);
  return (r.code === 0 && probeLog().includes('BUTTON|Press Me')) || `exit ${r.code}: ${r.out}`;
});
await test('ax', 'uia-invoke "Remember me" ticks the checkbox', async () => {
  const r = helper(['uia-invoke', b64('Remember me')]);
  await sleep(400);
  return (r.code === 0 && probeLog().includes('CHECK|Remember me|on')) || `exit ${r.code}: ${r.out}`;
});
await test('ax', 'uia-setvalue "Your name" = "Ada Lovelace" and reads it back', async () => {
  const r = helper(['uia-setvalue', b64('Your name'), b64('Ada Lovelace')]);
  return (r.code === 0 && /VERIFIED:TRUE/.test(r.out)) || `exit ${r.code}: ${r.out}`;
});
await test('ax', 'uia-invoke of a control that does not exist is refused', async () => {
  const r = helper(['uia-invoke', b64('Delete Everything Now')]);
  return (r.code === 8 && /UIA_NOT_FOUND/.test(r.out)) || `exit ${r.code}: ${r.out}`;
});
try { process.kill(-probe.pid); } catch {}

// ------------------------------------------------------------------ ORION itself
if (ORION) {
  console.log('\nORION one-shot requests (patched orion.mjs + bin/orion-input-macos)');
  const ws = fs.mkdtempSync(path.join(os.tmpdir(), 'orion-mac-'));
  const orion = req => {
    const r = spawnSync(process.execPath, [ORION, '--json', '--no-color', '--cwd', ws, req], { encoding: 'utf8', timeout: 120000, cwd: ws });
    try { return JSON.parse(r.stdout); } catch { return { parseError: (r.stdout || r.stderr || '').slice(0, 300) }; }
  };
  const brief = j => j.parseError ? `non-JSON: ${j.parseError}` : `success=${j.success} tools=[${(j.toolCallsExecuted || []).map(t => t.toolId)}] response=${JSON.stringify((j.response || '').slice(0, 200))}`;
  for (const [req, app] of [['open calculator', 'Calculator'], ['open notepad', 'TextEdit']]) {
    quit(app); await sleep(1500);
    if (app === 'TextEdit') { helper(['launch', b64('Calculator')]); await sleep(500); }
    await test('orion', `orion "${req}" → ${app} really opens and ORION says so`, async () => {
      const j = orion(req);
      await sleep(500);
      const f = front();
      return (j.success === true && f === app) || `${brief(j)} | front=${f}`;
    });
  }
  await test('orion', 'orion never reports the made-up "Electron" window', async () => {
    const j = orion('open calculator');
    return !/Electron/.test(JSON.stringify(j)) || 'response mentions Electron';
  });
}

for (const a of ['TextEdit', 'Calculator']) quit(a);
const failed = results.filter(r => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (process.env.ORION_E2E_REPORT) fs.writeFileSync(process.env.ORION_E2E_REPORT, JSON.stringify(results, null, 2));
process.exit(failed.length ? 1 : 0);
