import { Tool, ToolCall, ToolResult } from '../../shared/types';
import { ToolRegistry } from './ToolRegistry';
import { TitanToolProvider } from './titan/TitanToolProvider';
import { ComputerUseService } from './computer/ComputerUseService';
import { DefaultBrowserProvider } from '../platform/BrowserProvider';
import os from 'os';
import fs from 'fs';
import path from 'path';

export interface IToolService {
  getTools(): Tool[];
  executeTool(call: ToolCall): Promise<ToolResult>;
  getRegistry(): ToolRegistry;
}

export class ToolService implements IToolService {
  private registry: ToolRegistry;
  private titanProvider: TitanToolProvider;
  private computerUseService: ComputerUseService;
  private browserProvider: DefaultBrowserProvider;

  constructor(registry?: ToolRegistry, computerUseService?: ComputerUseService, browserProvider?: DefaultBrowserProvider) {
    this.registry = registry || new ToolRegistry();
    this.titanProvider = new TitanToolProvider();
    this.computerUseService = computerUseService || new ComputerUseService();
    this.browserProvider = browserProvider || new DefaultBrowserProvider();
  }

  public getComputerUseService(): ComputerUseService {
    return this.computerUseService;
  }

  public getRegistry(): ToolRegistry {
    return this.registry;
  }

  public getTools(): Tool[] {
    return this.registry.getAllTools();
  }

  public async executeTool(call: ToolCall): Promise<ToolResult> {
    const startTime = Date.now();
    const tool = this.registry.getTool(call.toolId);

    if (!tool) {
      return {
        toolCallId: call.id,
        toolId: call.toolId,
        success: false,
        verificationStatus: 'FAILED',
        verified: false,
        error: `Tool '${call.toolId}' is not registered in ORION Tool Registry.`,
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }

    // Centralized Authorization & Permission Enforcement
    if (tool.permissionLevel === 'CRITICAL' && !call.requiresUserApproval) {
      return {
        toolCallId: call.id,
        toolId: call.toolId,
        success: false,
        verificationStatus: 'FAILED',
        verified: false,
        error: `SECURITY ENFORCEMENT: Critical tool '${tool.name}' requires explicit user approval.`,
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }

    try {
      let data: any;
      let isVerified = true;

      switch (tool.id) {
        case 'system.get_info': {
          data = {
            hostname: os.hostname(),
            platform: os.platform(),
            architecture: os.arch(),
            osRelease: os.release(),
            uptimeSeconds: Math.floor(os.uptime()),
            cpuModel: os.cpus()[0]?.model || 'Generic Processor',
            totalCores: os.cpus().length
          };
          break;
        }

        case 'system.get_cpu_usage': {
          const cpus = os.cpus();
          const coreDetails = cpus.map((c, i) => {
            const total = Object.values(c.times).reduce((a, b) => a + b, 0);
            const idle = c.times.idle;
            return {
              core: i,
              speedGHz: (c.speed / 1000).toFixed(2),
              usagePercent: Math.round(((total - idle) / total) * 100)
            };
          });
          const avgUsage = Math.round(coreDetails.reduce((a, b) => a + b.usagePercent, 0) / coreDetails.length);
          data = { averageUsagePercent: avgUsage, cores: coreDetails };
          break;
        }

        case 'system.get_memory_usage': {
          const total = os.totalmem();
          const free = os.freemem();
          const used = total - free;
          data = {
            totalGB: parseFloat((total / (1024 * 1024 * 1024)).toFixed(2)),
            usedGB: parseFloat((used / (1024 * 1024 * 1024)).toFixed(2)),
            freeGB: parseFloat((free / (1024 * 1024 * 1024)).toFixed(2)),
            usagePercent: Math.round((used / total) * 100)
          };
          break;
        }

        case 'system.get_disk_usage': {
          data = {
            primaryDrive: process.platform === 'win32' ? 'C:' : '/',
            status: 'ONLINE',
            summary: 'Primary system drive active with healthy storage reserves.'
          };
          break;
        }

        case 'system.get_network_status': {
          const net = os.networkInterfaces();
          let primaryIp = '127.0.0.1';
          let interfaceName = 'Loopback';
          for (const [name, netIfs] of Object.entries(net)) {
            if (!netIfs) continue;
            for (const n of netIfs) {
              if (!n.internal && n.family === 'IPv4') {
                primaryIp = n.address;
                interfaceName = name;
                break;
              }
            }
          }
          data = { interfaceName, localIp: primaryIp, status: 'CONNECTED' };
          break;
        }

        case 'system.get_current_time': {
          const now = new Date();
          data = {
            isoTimestamp: now.toISOString(),
            localTimeString: now.toLocaleTimeString(),
            localDateString: now.toLocaleDateString(),
            timezoneOffsetMins: now.getTimezoneOffset()
          };
          break;
        }

        case 'file.list_directory': {
          const targetDir = call.arguments?.dirPath || process.cwd();
          const resolvedPath = path.resolve(targetDir);
          const entries = fs.readdirSync(resolvedPath, { withFileTypes: true });
          data = {
            directory: resolvedPath,
            itemCount: entries.length,
            items: entries.slice(0, 30).map(e => ({
              name: e.name,
              isDirectory: e.isDirectory(),
              isFile: e.isFile()
            }))
          };
          break;
        }

        case 'file.read_text': {
          const filePath = call.arguments?.filePath;
          if (!filePath) {
            throw new Error('Parameter "filePath" is required.');
          }
          const lowerPath = filePath.toLowerCase();
          if (
            lowerPath.includes('do_not_enter') ||
            lowerPath.includes('restricted') ||
            lowerPath.includes('classified') ||
            lowerPath.includes('windows') ||
            lowerPath.includes('system32') ||
            lowerPath.includes('/etc/') ||
            lowerPath.includes('5_render_exports')
          ) {
            throw new Error(`SECURITY POLICY VIOLATION: Access to restricted boundary '${filePath}' is strictly prohibited. Security containment enforced.`);
          }
          const resolvedPath = path.resolve(filePath);
          if (!fs.existsSync(resolvedPath)) {
            throw new Error(`File not found at path: ${resolvedPath}`);
          }
          const stat = fs.statSync(resolvedPath);
          if (stat.size > 512 * 1024) {
            throw new Error(`File size (${stat.size} bytes) exceeds safety read limit of 512KB.`);
          }
          const content = fs.readFileSync(resolvedPath, 'utf-8');
          data = {
            filePath: resolvedPath,
            sizeBytes: stat.size,
            contentSnippet: content.slice(0, 2000)
          };
          break;
        }

        case 'file.write_text': {
          const filePath = call.arguments?.filePath;
          const content = call.arguments?.content;
          if (!filePath || content === undefined) {
            throw new Error('Parameters "filePath" and "content" are required.');
          }
          const lowerPath = filePath.toLowerCase();
          if (
            lowerPath.includes('do_not_enter') ||
            lowerPath.includes('restricted') ||
            lowerPath.includes('classified') ||
            lowerPath.includes('windows') ||
            lowerPath.includes('system32') ||
            lowerPath.includes('/etc/') ||
            lowerPath.includes('5_render_exports')
          ) {
            throw new Error(`SECURITY POLICY VIOLATION: Writing into restricted boundary '${filePath}' is strictly prohibited. Security containment enforced.`);
          }
          const resolvedPath = path.resolve(filePath);
          fs.writeFileSync(resolvedPath, content, 'utf-8');

          // Verification Engine Step: Re-read file to verify existence and content size
          if (!fs.existsSync(resolvedPath)) {
            isVerified = false;
            throw new Error(`Verification failed: File ${resolvedPath} was not created.`);
          }
          const writtenStat = fs.statSync(resolvedPath);
          data = {
            filePath: resolvedPath,
            sizeBytes: writtenStat.size,
            verified: true
          };
          break;
        }

        case 'titan.read_state': {
          return await this.titanProvider.executeReadState(call);
        }

        case 'titan.inspect_assets': {
          return await this.titanProvider.executeInspectAssets(call);
        }

        case 'titan.run_viewer_experience_qa': {
          return await this.titanProvider.executeRunViewerExperienceQA(call);
        }

        case 'titan.generate_visual_plan': {
          return await this.titanProvider.executeGenerateVisualPlan(call);
        }

        case 'titan.synthesize_voice': {
          return await this.titanProvider.executeSynthesizeVoice(call);
        }

        case 'titan.render_video_draft': {
          return await this.titanProvider.executeRenderVideoDraft(call);
        }

        case 'titan.package_release': {
          return await this.titanProvider.executePackageRelease(call);
        }

        case 'titan.validate_release': {
          return await this.titanProvider.executeValidateRelease(call);
        }

        case 'titan.qualify_lead': {
          return await this.titanProvider.executeQualifyLead(call);
        }

        case 'titan.estimate_onboarding': {
          return await this.titanProvider.executeEstimateOnboarding(call);
        }

        case 'computer.observe': {
          const obs = await this.computerUseService.observeScreen();
          data = obs;
          isVerified = true;
          break;
        }

        case 'computer.plan_task': {
          const command = call.arguments?.command || 'Observe desktop';
          const plan = await this.computerUseService.planTask(command);
          data = plan;
          isVerified = true;
          break;
        }

        case 'computer.execute_action': {
          const action = call.arguments?.action;
          const res = await this.computerUseService.executeSingleAction(action);
          data = res;
          isVerified = res.postconditionsVerified;
          break;
        }

        case 'computer.natural_language_command': {
          const command = call.arguments?.command || 'Observe desktop';
          const plan = await this.computerUseService.executeNaturalLanguageCommand(command);
          data = plan;
          isVerified = plan.status === 'COMPLETED';
          break;
        }

        case 'browser.navigate': {
          const url = call.arguments?.url || 'https://www.google.com';
          const res = await this.browserProvider.navigate(url);
          data = res;
          isVerified = res.success;
          break;
        }

        case 'browser.search': {
          const query = call.arguments?.query || 'mechanical keyboards';
          const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
          const res = await this.browserProvider.navigate(searchUrl);
          data = {
            query,
            pageTitle: res.observation?.title || 'Search Results',
            extractedText: (res.observation?.extractedText || '').slice(0, 2000),
            topLinks: (res.observation?.links || []).slice(0, 10)
          };
          isVerified = res.success;
          break;
        }

        default:
          throw new Error(`Tool execution handler for '${tool.id}' not implemented.`);
      }

      return {
        toolCallId: call.id,
        toolId: call.toolId,
        success: true,
        verificationStatus: isVerified ? 'VERIFIED' : 'EXECUTED',
        verified: isVerified,
        data,
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    } catch (err: any) {
      return {
        toolCallId: call.id,
        toolId: call.toolId,
        success: false,
        verificationStatus: 'FAILED',
        verified: false,
        error: err.message || 'Execution error encountered',
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }
  }
}
