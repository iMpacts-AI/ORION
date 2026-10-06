const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const Module = require('module');

const origResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, isMain, options) {
  try {
    return origResolve.call(this, request, parent, isMain, options);
  } catch (err) {
    if (request.endsWith('.js')) {
      const tsRequest = request.slice(0, -3) + '.ts';
      try {
        return origResolve.call(this, tsRequest, parent, isMain, options);
      } catch (e) {}
    }
    throw err;
  }
};

require.extensions['.ts'] = function(m, f) {
  const content = fs.readFileSync(f, 'utf8');
  const compiled = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true
    }
  });
  return m._compile(compiled.outputText, f);
};

const testFile = process.argv[2];
if (!testFile) {
  console.error('No test file specified');
  process.exit(1);
}

try {
  const resolvedPath = path.resolve(testFile);
  require(resolvedPath);
} catch (err) {
  console.error(err);
  process.exit(1);
}
