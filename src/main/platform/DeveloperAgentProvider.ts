import { IDeveloperAgentProvider, CodeRepositorySummary, CodeSearchResult, BuildExecutionResult } from '../../shared/types/developerAgent';
import { ToolService } from '../services/ToolService';
import { ProcessSupervisor } from '../services/computer/ProcessSupervisor';
import { ToolCall } from '../../shared/types';
import fs from 'fs';
import path from 'path';

export class DefaultDeveloperAgentProvider implements IDeveloperAgentProvider {
  private toolService: ToolService;

  constructor(toolService?: ToolService) {
    this.toolService = toolService || new ToolService();
  }

  public async inspectRepository(targetPath: string): Promise<CodeRepositorySummary> {
    const resolved = path.resolve(targetPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Target path '${resolved}' does not exist.`);
    }

    const languagesDetected = new Set<string>();
    let totalFiles = 0;
    let hasPackageJson = false;

    const walk = (dir: string, depth = 0) => {
      if (depth > 5) return;
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'dist-electron' || entry.name === 'release') {
            continue;
          }
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            walk(full, depth + 1);
          } else if (entry.isFile()) {
            totalFiles++;
            if (entry.name === 'package.json') hasPackageJson = true;
            if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
              languagesDetected.add('TypeScript/JavaScript');
            }
            if (entry.name.endsWith('.py')) {
              languagesDetected.add('Python');
            }
            if (entry.name.endsWith('.rs')) {
              languagesDetected.add('Rust');
            }
            if (entry.name.endsWith('.go')) {
              languagesDetected.add('Go');
            }
          }
        }
      } catch {}
    };

    walk(resolved);

    return {
      rootPath: resolved,
      totalFiles,
      languagesDetected: Array.from(languagesDetected),
      hasPackageJson
    };
  }

  public async searchCode(targetPath: string, query: string): Promise<CodeSearchResult[]> {
    const resolved = path.resolve(targetPath);
    const results: CodeSearchResult[] = [];

    if (!fs.existsSync(resolved)) return results;

    const searchableExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.py', '.html', '.css'];

    const searchWalk = (dir: string, depth = 0) => {
      if (depth > 5 || results.length >= 100) return;
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'dist-electron' || entry.name === 'release') {
            continue;
          }
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            searchWalk(fullPath, depth + 1);
          } else if (entry.isFile() && searchableExtensions.some(ext => entry.name.endsWith(ext))) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n');
            lines.forEach((line, idx) => {
              if (line.toLowerCase().includes(query.toLowerCase()) && results.length < 100) {
                results.push({
                  filePath: fullPath,
                  lineNumber: idx + 1,
                  lineContent: line.trim()
                });
              }
            });
          }
        }
      } catch {}
    };

    searchWalk(resolved);
    return results;
  }

  public async executeBuild(targetPath: string, command: string): Promise<BuildExecutionResult> {
    const startTime = Date.now();
    const resolvedPath = path.resolve(targetPath);
    
    // Disallow shell chaining operators
    if (/[&|;`$\r\n]/.test(command)) {
      return {
        command,
        success: false,
        exitCode: 1,
        output: 'SECURITY ENFORCEMENT: Command chaining operators (&, &&, |, ;, $, backticks, newlines) are strictly prohibited.',
        durationMs: Date.now() - startTime
      };
    }

    const trimmed = command.trim();
    // Strict command allowlist
    const ALLOWED_COMMANDS: Record<string, { cmd: string; args: string[] }> = {
      'npm run build': { cmd: 'npm', args: ['run', 'build'] },
      'npm test': { cmd: 'npm', args: ['test'] },
      'npx tsc': { cmd: 'npx', args: ['tsc', '--noEmit'] },
      'cargo check': { cmd: 'cargo', args: ['check'] }
    };

    const targetExec = ALLOWED_COMMANDS[trimmed];
    if (!targetExec) {
      return {
        command,
        success: false,
        exitCode: 1,
        output: `SECURITY ENFORCEMENT: Command '${command}' is not in the allowed developer build whitelist.`,
        durationMs: Date.now() - startTime
      };
    }

    try {
      const runnerCmd = process.platform === 'win32' && targetExec.cmd === 'npm' ? 'npm.cmd' :
                        (process.platform === 'win32' && targetExec.cmd === 'npx' ? 'npx.cmd' : targetExec.cmd);

      const res = await ProcessSupervisor.getInstance().runManagedCommand(
        runnerCmd,
        targetExec.args,
        { cwd: resolvedPath },
        60000
      );

      return {
        command,
        success: res.exitCode === 0,
        exitCode: res.exitCode,
        output: res.stdout || res.stderr,
        durationMs: Date.now() - startTime
      };
    } catch (err: any) {
      return {
        command,
        success: false,
        exitCode: 1,
        output: `Execution error: ${err.message}`,
        durationMs: Date.now() - startTime
      };
    }
  }
}
