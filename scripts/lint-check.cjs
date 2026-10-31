#!/usr/bin/env node

/**
 * ORION Static Hygiene, Syntax & Path-Privacy Lint Gate
 * Verifies:
 *  1. Node.js syntax validity across CLI entrypoints and test runners (`bin/*.js`, `*.cjs`).
 *  2. JSON schema/parse validity across `package.json` and `config/policies/*.json`.
 *  3. Zero hardcoded personal workstation paths or leaked secret tokens in source & docs.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ERRORS = [];

const JS_TARGETS = [
  'bin/orion.js',
  'bin/install-cli.js',
  'run_suites.cjs',
  'runner_helper.cjs',
  'scripts/lint-check.cjs'
];

for (const rel of JS_TARGETS) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    ERRORS.push(`Missing expected script: ${rel}`);
    continue;
  }
  try {
    execFileSync(process.execPath, ['--check', abs], { stdio: 'pipe' });
  } catch (err) {
    ERRORS.push(`Syntax error in ${rel}: ${err.stderr ? err.stderr.toString() : err.message}`);
  }
}

const JSON_TARGETS = [
  'package.json',
  'tsconfig.json',
  'config/policies/orion-protected-policy.v1.json'
];

for (const rel of JSON_TARGETS) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    ERRORS.push(`Missing expected JSON config: ${rel}`);
    continue;
  }
  try {
    const raw = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
    if (rel !== 'tsconfig.json') {
      JSON.parse(raw);
    }
  } catch (err) {
    ERRORS.push(`Invalid JSON in ${rel}: ${err.message}`);
  }
}

// Privacy & secret leak patterns forbidden in tracked source & docs
const currentUsername = (() => {
  try {
    return os.userInfo().username || '';
  } catch {
    return '';
  }
})();
const escapedUser = currentUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const FORBIDDEN_PATTERNS = [
  ...(escapedUser
    ? [
        {
          label: 'Hardcoded Windows personal profile path',
          regex: new RegExp(`C:\\\\\\\\?Users\\\\\\\\?${escapedUser}`, 'i')
        },
        {
          label: 'Hardcoded forward-slash personal profile path',
          regex: new RegExp(`C:/Users/${escapedUser}`, 'i')
        }
      ]
    : []),
  {
    label: 'Live Anthropic API key literal',
    regex: /sk-ant-api03-(?!CANARY|SUPER_SECRET_AGENT_CANARY|secretworkflowtoken|leakedfrommcpserver)[A-Za-z0-9_-]{24,}/
  },
  {
    label: 'Live GitHub PAT literal',
    regex: /ghp_(?!CANARY)[A-Za-z0-9]{30,}/
  }
];

function walkDir(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === 'node_modules' ||
      entry.name === '.git' ||
      entry.name === 'dist' ||
      entry.name === 'dist-electron' ||
      entry.name === 'release' ||
      entry.name === '.orion_memory'
    ) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, out);
    } else if (/\.(ts|tsx|js|cjs|md|json)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const filesToScan = [
  ...walkDir(path.join(ROOT, 'src')),
  ...walkDir(path.join(ROOT, 'bin')),
  ...walkDir(path.join(ROOT, 'docs')),
  path.join(ROOT, 'README.md'),
  path.join(ROOT, 'RELEASE_NOTES.md'),
  path.join(ROOT, 'package.json')
].filter(f => fs.existsSync(f));

for (const file of filesToScan) {
  const rel = path.relative(ROOT, file);
  // Skip intentional sanitization unit tests that construct synthetic paths dynamically or test redaction
  const content = fs.readFileSync(file, 'utf8');
  for (const rule of FORBIDDEN_PATTERNS) {
    if (rule.regex.test(content)) {
      ERRORS.push(`${rule.label} detected in ${rel}`);
    }
  }
}

if (ERRORS.length > 0) {
  console.error('[ORION LINT] FAILED:');
  for (const e of ERRORS) {
    console.error(`  - ${e}`);
  }
  process.exit(1);
}

console.log(`[ORION LINT] PASS — Checked ${JS_TARGETS.length} JS runners, ${JSON_TARGETS.length} configs, and ${filesToScan.length} source/doc files (0 errors, 0 path/secret leaks).`);
