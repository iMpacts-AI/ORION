#!/usr/bin/env node
// =============================================================================
// ORION smoke test — runs against an ORION that was installed by install.sh /
// install.ps1 (i.e. the real `orion` command on PATH, shim included).
//
//   node tests/smoke.mjs
//
// Two groups of checks:
//   core        must pass — any failure exits 1.
//   known-bugs  probes for bugs found in manual testing of v1.2.0. Each is
//               reported as REPRODUCED / FIXED / INCONCLUSIVE and never fails the
//               run unless ORION_SMOKE_STRICT=1 (use that once they're fixed).
//
// Environment:
//   ORION_BIN             command to run (default: `orion` from PATH)
//   ORION_SMOKE_REPORT    write a JSON report to this path
//   ORION_SMOKE_STRICT=1  treat REPRODUCED known bugs as failures
//   ORION_SMOKE_TIMEOUT   per-command timeout in ms (default 90000)
// =============================================================================
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const IS_WIN = process.platform === 'win32';
const BIN = process.env.ORION_BIN || (IS_WIN ? 'orion.cmd' : 'orion');
const TIMEOUT = Number(process.env.ORION_SMOKE_TIMEOUT || 90000);
const STRICT = process.env.ORION_SMOKE_STRICT === '1';
const ANSI = /\x1b\[[0-9;]*m/;

function run(args, { cwd } = {}) {
  // .cmd shims need a shell on Windows; quote each argument for cmd.exe.
  const argv = IS_WIN ? args.map(a => (/[\s"&|<>^]/.test(a) ? `"${a.replace(/"/g, '""')}"` : a)) : args;
  const r = spawnSync(BIN, argv, {
    cwd: cwd || os.tmpdir(),
    encoding: 'utf8',
    timeout: TIMEOUT,
    shell: IS_WIN,
    env: { ...process.env, NO_COLOR: process.env.NO_COLOR ?? '' },
  });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '', error: r.error };
}

function runJson(request, cwd) {
  const r = run(['--json', '--no-color', '--cwd', cwd, request], { cwd });
  let json = null;
  try { json = JSON.parse(r.out); } catch { /* reported by caller */ }
  return { ...r, json };
}

function freshWorkspace(name) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `orion-smoke-${name}-`));
  return fs.realpathSync(dir);
}

const toolIds = j => (j?.toolCallsExecuted || []).map(t => t.toolId);
const summary = r => (r.json ? `success=${r.json.success} tools=[${toolIds(r.json)}] response=${JSON.stringify((r.json.response || '').slice(0, 140))}` : `exit=${r.code} non-JSON output: ${JSON.stringify((r.out + r.err).slice(0, 200))}`);

const results = [];
function record(group, name, status, detail) {
  results.push({ group, name, status, detail });
  const tag = { PASS: '\x1b[32mPASS\x1b[0m', FAIL: '\x1b[31mFAIL\x1b[0m', REPRODUCED: '\x1b[33mREPRODUCED\x1b[0m', FIXED: '\x1b[32mFIXED\x1b[0m', INCONCLUSIVE: '\x1b[90mINCONCLUSIVE\x1b[0m' }[status] || status;
  console.log(`  [${tag}] ${name}${detail ? `\n         ${detail}` : ''}`);
}
function check(name, fn) {
  try {
    const d = fn();
    record('core', name, 'PASS', typeof d === 'string' ? d : '');
  } catch (e) {
    record('core', name, 'FAIL', e.message);
  }
}
function probe(name, fn) {
  try {
    const { status, detail } = fn();
    record('known-bugs', name, status, detail);
  } catch (e) {
    record('known-bugs', name, 'INCONCLUSIVE', `probe error: ${e.message}`);
  }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log(`\nORION smoke test — ${process.platform}/${process.arch}, Node ${process.version}, bin=${BIN}\n`);

// ---------------------------------------------------------------- core checks
console.log('Core checks');
let version = '';
check('`orion --version` prints a semver version', () => {
  const r = run(['--version']);
  assert(r.code === 0, `exit ${r.code} ${r.error?.message || ''} ${r.err}`.trim());
  const m = r.out.match(/ORION v?(\d+\.\d+\.\d+)/);
  assert(m, `unexpected output: ${JSON.stringify(r.out)}`);
  version = m[1];
  return `v${version}`;
});

check('`orion --help` shows usage', () => {
  const r = run(['--help']);
  assert(r.code === 0, `exit ${r.code}`);
  assert(/Usage:/.test(r.out) && /orion doctor/.test(r.out), 'usage text missing');
});

check('`orion doctor` exits 0', () => {
  const r = run(['doctor', '--no-color']);
  assert(r.code === 0, `exit ${r.code}: ${(r.out + r.err).slice(-300)}`);
  assert(/PASS/.test(r.out), 'no PASS lines in doctor output');
});

check('`orion --json doctor` reports HEALTHY', () => {
  const r = run(['--json', 'doctor']);
  assert(r.code === 0, `exit ${r.code}`);
  const j = JSON.parse(r.out);
  assert(j.status === 'HEALTHY', `status=${j.status}`);
  return `node ${j.nodeVersion} on ${j.platform}`;
});

check('`--no-color` output contains no ANSI escapes', () => {
  const r = run(['--no-color', 'doctor']);
  assert(!ANSI.test(r.out), 'ANSI escape found');
});

const wsList = freshWorkspace('list');
fs.writeFileSync(path.join(wsList, 'smoke-marker.txt'), 'orion smoke\n');
let listRun = null;
check('one-shot "list files" returns valid JSON with success=true', () => {
  listRun = runJson('list files', wsList);
  assert(listRun.json, `not JSON (exit ${listRun.code}): ${(listRun.out + listRun.err).slice(0, 300)}`);
  assert(listRun.json.success === true, summary(listRun));
  return `tools=[${toolIds(listRun.json)}]`;
});

check('"list files" result is verified and includes the workspace file', () => {
  assert(listRun?.json, 'previous check produced no JSON');
  const res = (listRun.json.toolResults || []).find(t => t.toolId === 'file.list_directory');
  assert(res, `file.list_directory was not called (tools=[${toolIds(listRun.json)}])`);
  assert(res.success && res.verified, `success=${res.success} verified=${res.verified}`);
  const names = (res.data?.items || []).map(i => i.name);
  assert(names.includes('smoke-marker.txt'), `items=[${names}]`);
});

// ------------------------------------------------------------ known-bug probes
console.log('\nKnown-bug probes (v1.2.0 manual findings)');

probe('"delete notes.txt" neither deletes nor asks for approval', () => {
  const ws = freshWorkspace('delete');
  const f = path.join(ws, 'notes.txt');
  fs.writeFileSync(f, 'keep me\n');
  const r = runJson('delete notes.txt', ws);
  if (!r.json) return { status: 'INCONCLUSIVE', detail: summary(r) };
  const exists = fs.existsSync(f);
  const tools = toolIds(r.json);
  const asked = (r.json.toolCallsExecuted || []).some(t => t.requiresUserApproval) || /\((y\/n|yes\/no)\)|do you want me to|shall I (delete|proceed)/i.test(r.json.response || '');
  const canned = /Security & Permission Architecture/i.test(r.json.response || '');
  const bug = (exists && !asked && tools.length === 0) || canned;
  return { status: bug ? 'REPRODUCED' : 'FIXED', detail: `file ${exists ? 'still exists' : 'deleted'}, approval ${asked ? 'requested' : 'not requested'}${canned ? ', canned security text' : ''}; ${summary(r)}` };
});

probe('no-op request reports success=true', () => {
  const ws = freshWorkspace('noop');
  const r = runJson('look up the best mechanical keyboards', ws);
  if (!r.json) return { status: 'INCONCLUSIVE', detail: summary(r) };
  const noAction = toolIds(r.json).length === 0;
  const bug = noAction && r.json.success === true;
  return { status: bug ? 'REPRODUCED' : 'FIXED', detail: summary(r) };
});

probe('directory listing shows "<workspace>/<workspace>" instead of the real path', () => {
  if (!listRun?.json) return { status: 'INCONCLUSIVE', detail: 'core "list files" produced no JSON' };
  const resp = listRun.json.response || '';
  const bug = /<workspace>\/<workspace>/.test(resp);
  return { status: bug ? 'REPRODUCED' : 'FIXED', detail: JSON.stringify(resp.slice(0, 160)) };
});

probe('state leaks between one-shot runs (same request routed differently)', () => {
  const ws = freshWorkspace('state');
  fs.writeFileSync(path.join(ws, 'notes.txt'), 'x\n');
  const first = runJson('list files', ws);
  runJson('look up the best mechanical keyboards', ws);
  runJson('delete notes.txt', ws);
  const second = runJson('list files', ws);
  if (!first.json || !second.json) return { status: 'INCONCLUSIVE', detail: `first: ${summary(first)} | second: ${summary(second)}` };
  const a = toolIds(first.json).join(','), b = toolIds(second.json).join(',');
  const memory = fs.existsSync(path.join(ws, '.orion_memory'));
  return { status: a === b ? 'FIXED' : 'REPRODUCED', detail: `first=[${a}] after-other-runs=[${b}]; .orion_memory ${memory ? 'present' : 'absent'}` };
});

for (const req of ['open youtube', 'open notepad']) {
  probe(`"${req}" (desktop control on ${process.platform})`, () => {
    const ws = freshWorkspace('open');
    const r = runJson(req, ws);
    if (!r.json) return { status: 'INCONCLUSIVE', detail: summary(r) };
    const errs = (r.json.toolResults || []).map(t => `${t.error || ''} ${JSON.stringify(t.postcondition || t.verification || '')}`).join(' ');
    const electron = /Electron/.test(errs + (r.json.response || ''));
    // Hosted CI runners have no interactive desktop, so a plain failure here is
    // not proof of the bug; the 'Electron' postcondition is.
    const status = electron ? 'REPRODUCED' : r.json.success ? 'FIXED' : 'INCONCLUSIVE';
    return { status, detail: summary(r) };
  });
}

probe('document creation hard-requires Ollama (no fallback)', () => {
  const ws = freshWorkspace('doc');
  const r = runJson('create a document about the history of the bicycle', ws);
  if (!r.json) return { status: 'INCONCLUSIVE', detail: summary(r) };
  const ollama = /ollama/i.test(JSON.stringify(r.json.toolResults || []) + (r.json.response || ''));
  const status = !r.json.success && ollama ? 'REPRODUCED' : r.json.success ? 'FIXED' : 'INCONCLUSIVE';
  return { status, detail: summary(r) };
});

// --------------------------------------------------------------------- report
const core = results.filter(r => r.group === 'core');
const bugs = results.filter(r => r.group === 'known-bugs');
const coreFailed = core.filter(r => r.status === 'FAIL').length;
const reproduced = bugs.filter(r => r.status === 'REPRODUCED').length;
const report = {
  platform: process.platform, arch: process.arch, node: process.version, orion: version || null,
  core: { passed: core.length - coreFailed, total: core.length },
  knownBugs: { reproduced, fixed: bugs.filter(r => r.status === 'FIXED').length, inconclusive: bugs.filter(r => r.status === 'INCONCLUSIVE').length },
  results,
};

console.log(`\nCore: ${report.core.passed}/${report.core.total} passed · Known bugs: ${reproduced} reproduced, ${report.knownBugs.fixed} fixed, ${report.knownBugs.inconclusive} inconclusive`);

if (process.env.ORION_SMOKE_REPORT) fs.writeFileSync(process.env.ORION_SMOKE_REPORT, JSON.stringify(report, null, 2));
if (process.env.GITHUB_STEP_SUMMARY) {
  const esc = s => String(s || '').replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 220);
  const lines = [
    `### ORION v${version || '?'} — ${process.platform}/${process.arch}, Node ${process.version}`,
    `Core **${report.core.passed}/${report.core.total}** · known bugs: ${reproduced} reproduced, ${report.knownBugs.fixed} fixed, ${report.knownBugs.inconclusive} inconclusive`,
    '', '| Group | Check | Result | Detail |', '|---|---|---|---|',
    ...results.map(r => `| ${r.group} | ${esc(r.name)} | ${r.status} | ${esc(r.detail)} |`), '',
  ];
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
}

process.exit(coreFailed > 0 || (STRICT && reproduced > 0) ? 1 : 0);
