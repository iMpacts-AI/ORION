import { Tool, ToolCall, ToolResult } from '../../shared/types';
import { ToolRegistry } from './ToolRegistry';
import { TitanToolProvider } from './titan/TitanToolProvider';
import { ComputerUseService } from './computer/ComputerUseService';
import { ProcessSupervisor } from './computer/ProcessSupervisor';
import { ActionRiskEvaluator } from './ActionRiskEvaluator';
import { DefaultBrowserProvider } from '../platform/BrowserProvider';
import { MediaControlService } from './MediaControlService';
import { UnifiedMemoryManager } from './UnifiedMemoryManager';
import { SecurityPolicyMiddleware } from './SecurityPolicyMiddleware';
import { UntrustedContentBoundary } from './UntrustedContentBoundary';
import os from 'os';
import fs from 'fs';
import path from 'path';

export interface IToolService {
  getTools(): Tool[];
  executeTool(call: ToolCall, options?: { signal?: AbortSignal }): Promise<ToolResult>;
  getRegistry(): ToolRegistry;
}

export class ToolService implements IToolService {
  private registry: ToolRegistry;
  private titanProvider: TitanToolProvider;
  private computerUseService: ComputerUseService;
  private browserProvider: DefaultBrowserProvider;
  private mediaControlService: MediaControlService;
  private unifiedMemory: UnifiedMemoryManager;
  private riskEvaluator: ActionRiskEvaluator;

  constructor(
    registry?: ToolRegistry,
    computerUseService?: ComputerUseService,
    browserProvider?: DefaultBrowserProvider,
    mediaControlService?: MediaControlService,
    unifiedMemory?: UnifiedMemoryManager
  ) {
    this.registry = registry || new ToolRegistry();
    this.titanProvider = new TitanToolProvider();
    this.computerUseService = computerUseService || new ComputerUseService();
    this.browserProvider = browserProvider || new DefaultBrowserProvider();
    this.mediaControlService = mediaControlService || new MediaControlService();
    this.unifiedMemory = unifiedMemory || new UnifiedMemoryManager();
    this.riskEvaluator = new ActionRiskEvaluator();
  }

  public getComputerUseService(): ComputerUseService {
    return this.computerUseService;
  }

  public getBrowserProvider(): DefaultBrowserProvider {
    return this.browserProvider;
  }

  public getMediaControlService(): MediaControlService {
    return this.mediaControlService;
  }

  public getUnifiedMemory(): UnifiedMemoryManager {
    return this.unifiedMemory;
  }

  public setUnifiedMemory(memory: UnifiedMemoryManager): void {
    this.unifiedMemory = memory;
  }

  public getRegistry(): ToolRegistry {
    return this.registry;
  }

  public getPolicyMiddleware(): SecurityPolicyMiddleware {
    return SecurityPolicyMiddleware.getInstance();
  }

  public getTools(): Tool[] {
    return this.registry.getAllTools();
  }

  private isSensitiveOrRestrictedPath(filePath: string): boolean {
    const lowerPath = filePath.toLowerCase();
    const baseName = lowerPath.split(/[\\/]/).pop() || '';
    return (
      /^(\\\\|\/\/)[^\\/]+[\\/]+[^\\/]+/.test(filePath.trim()) ||
      /^\\\\[?.]\\/.test(filePath.trim()) ||
      lowerPath.includes('do_not_enter') ||
      lowerPath.includes('restricted') ||
      lowerPath.includes('classified') ||
      lowerPath.includes('c:\\windows') ||
      lowerPath.includes('c:/windows') ||
      lowerPath.startsWith('\\windows\\') ||
      lowerPath.startsWith('/windows/') ||
      lowerPath.includes('c:\\program files') ||
      lowerPath.includes('c:/program files') ||
      lowerPath.includes('system32') ||
      lowerPath.includes('/etc/') ||
      lowerPath.includes('5_render_exports') ||
      baseName === '.env' ||
      baseName.startsWith('.env.') ||
      lowerPath.includes('\\.ssh\\') ||
      lowerPath.includes('/.ssh/') ||
      lowerPath.endsWith('\\.ssh') ||
      lowerPath.endsWith('/.ssh') ||
      lowerPath.includes('\\.aws\\') ||
      lowerPath.includes('/.aws/') ||
      lowerPath.includes('\\.gnupg\\') ||
      lowerPath.includes('/.gnupg/') ||
      baseName === 'credentials.json' ||
      baseName === 'gmail_token.json' ||
      baseName === 'id_rsa' ||
      baseName === 'id_ed25519'
    );
  }

  public async executeTool(call: ToolCall, options?: { signal?: AbortSignal }): Promise<ToolResult> {
    const startTime = Date.now();
    const signal = options?.signal || (call as any).signal;
    if (signal?.aborted) {
      return {
        toolCallId: call.id,
        toolId: call.toolId,
        success: false,
        outcomeStatus: 'cancelled',
        verificationStatus: 'FAILED',
        verified: false,
        error: 'Execution CANCELLED: Task cancelled by operator via Escape.',
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }

    const tool = this.registry.getTool(call.toolId);

    if (!tool) {
      return {
        toolCallId: call.id,
        toolId: call.toolId,
        success: false,
        outcomeStatus: 'failed',
        verificationStatus: 'FAILED',
        verified: false,
        error: `Tool '${call.toolId}' is not registered in ORION Tool Registry.`,
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }

    // 0. Global Emergency Stop Enforcement at Authoritative Service Layer
    if (ProcessSupervisor.getInstance().isEstopActive() || this.computerUseService.isEmergencyStopped()) {
      return {
        toolCallId: call.id,
        toolId: call.toolId,
        success: false,
        outcomeStatus: 'failed',
        verificationStatus: 'FAILED',
        verified: false,
        error: 'Execution BLOCKED: ORION Emergency Stop is active.',
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }

    // 1. Authoritative ActionRiskEvaluator Enforcement (including nested computer.execute_action payloads)
    const nestedAction = call.arguments?.action;
    const targetCandidate = String(
      call.arguments?.filePath ||
      call.arguments?.dirPath ||
      call.arguments?.path ||
      call.arguments?.command ||
      call.arguments?.selector ||
      nestedAction?.target ||
      nestedAction?.payload?.filePath ||
      nestedAction?.parameters?.filePath ||
      ''
    );
    const { mappedActionType } = this.riskEvaluator.classifyToolEffect(call.toolId, tool, call.arguments);

    const evaluatedRisk = this.riskEvaluator.evaluateRisk(
      mappedActionType as any,
      nestedAction ? nestedAction.payload : call.arguments,
      nestedAction ? nestedAction.parameters : call.arguments,
      targetCandidate
    );

    if (evaluatedRisk === 'CRITICAL') {
      return {
        toolCallId: call.id,
        toolId: call.toolId,
        success: false,
        outcomeStatus: 'failed',
        verificationStatus: 'FAILED',
        verified: false,
        error: `SECURITY POLICY VIOLATION: Critical or restricted target '${targetCandidate || call.toolId}' is strictly blocked by ORION safety policy.`,
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }

    // 2. Mandatory Argument Schema Validation before authorization/execution (never consumes approval tokens on malformed calls)
    if (call.arguments && typeof call.arguments === 'object') {
      if ((call.toolId === 'file.read_text' || call.toolId === 'file.write_text') && !call.arguments.filePath && typeof call.arguments.path === 'string') {
        call.arguments.filePath = call.arguments.path;
      }
      if (call.toolId === 'file.list_directory' && !call.arguments.dirPath && typeof call.arguments.path === 'string') {
        call.arguments.dirPath = call.arguments.path;
      }
    }
    const argValidation = this.registry.validateToolArguments(call.toolId, call.arguments);
    if (!argValidation.valid) {
      this.registry.recordSkillExecution(call.toolId, false, Date.now() - startTime);
      return {
        toolCallId: call.id,
        toolId: call.toolId,
        success: false,
        outcomeStatus: 'failed',
        verificationStatus: 'FAILED',
        verified: false,
        error: `SCHEMA VALIDATION FAILED: ${argValidation.errors.join(' ')}`,
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }

    // 3. Centralized Authorization & Permission Enforcement (with Action-Bound Approval Support)
    const policyMiddleware = SecurityPolicyMiddleware.getInstance();
    const policyDecision = policyMiddleware.verifyToolExecution({
      tool,
      call,
      agentAllowedTools: (call as any).agentAllowedTools,
      agentMaxPermissionLevel: (call as any).agentMaxPermissionLevel,
      isEmergencyStopped: this.computerUseService.isEmergencyStopped(),
      consumeToken: true
    });

    if (!policyDecision.allowed) {
      const errText = policyDecision.reason || `AUTHORIZATION REQUIRED: Tool '${tool.id}' (${tool.permissionLevel}) requires explicit operator approval.`;
      const requiresPerm = /AUTHORIZATION REQUIRED|requires explicit/i.test(errText);
      return {
        toolCallId: call.id,
        toolId: call.toolId,
        success: false,
        outcomeStatus: requiresPerm ? 'permission_required' : 'failed',
        verificationStatus: 'FAILED',
        verified: false,
        error: errText,
        data: policyDecision.pendingApproval ? { pendingApprovalId: policyDecision.pendingApproval.approvalId } : undefined,
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    }

    const onAbortDuringTool = () => {
      if (tool.id.startsWith('browser.')) {
        this.browserProvider.cancelActiveTask();
      } else if (tool.id.startsWith('computer.')) {
        this.computerUseService.cancelActiveTask('Operator Escape-to-Cancel');
      }
    };
    if (signal) {
      signal.addEventListener('abort', onAbortDuringTool, { once: true });
    }

    try {
      let data: any;
      let isVerified = true;
      let explicitOutcomeStatus: import('../../shared/types').TaskOutcomeStatus | undefined;

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
          const primaryDrive = process.platform === 'win32' ? 'C:\\' : '/';
          let totalGB = 0;
          let freeGB = 0;
          let usedGB = 0;
          let usagePercent = 0;

          if (typeof (fs as any).statfsSync === 'function') {
            try {
              const stats = (fs as any).statfsSync(primaryDrive);
              const totalBytes = Number(stats.blocks) * Number(stats.bsize);
              const freeBytes = Number(stats.bfree) * Number(stats.bsize);
              const usedBytes = Math.max(0, totalBytes - freeBytes);
              totalGB = parseFloat((totalBytes / (1024 * 1024 * 1024)).toFixed(2));
              freeGB = parseFloat((freeBytes / (1024 * 1024 * 1024)).toFixed(2));
              usedGB = parseFloat((usedBytes / (1024 * 1024 * 1024)).toFixed(2));
              usagePercent = totalBytes > 0 ? Math.round((usedBytes / totalBytes) * 100) : 0;
            } catch {}
          }

          data = {
            primaryDrive: process.platform === 'win32' ? 'C:' : '/',
            status: 'ONLINE',
            totalGB,
            usedGB,
            freeGB,
            usagePercent,
            summary: `Primary drive (${process.platform === 'win32' ? 'C:' : '/'}) — ${usedGB} GB used / ${totalGB} GB total (${freeGB} GB free, ${usagePercent}% used).`
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

        case 'system.clipboard_read': {
          if (process.platform === 'win32') {
            const { stdout } = await this.mediaControlService.runPowerShellSafe('Get-Clipboard -Raw', 3000);
            data = {
              content: (stdout || '').replace(/\r?\n$/, ''),
              length: (stdout || '').replace(/\r?\n$/, '').length
            };
          } else {
            data = { content: '', length: 0 };
          }
          break;
        }

        case 'system.clipboard_write': {
          const text = String(call.arguments?.text ?? '');
          if (process.platform === 'win32') {
            const b64 = Buffer.from(text, 'utf-8').toString('base64');
            await this.mediaControlService.runPowerShellSafe(
              `$bytes = [System.Convert]::FromBase64String('${b64}'); $str = [System.Text.Encoding]::UTF8.GetString($bytes); Set-Clipboard -Value $str`,
              3000
            );
          }
          data = {
            written: true,
            length: text.length,
            preview: text.slice(0, 100)
          };
          break;
        }

        case 'system.volume': {
          const rawLevel = String(call.arguments?.level ?? '50').trim().toLowerCase();
          if (['up', 'down', 'mute', 'unmute'].includes(rawLevel)) {
            data = await this.mediaControlService.setVolume(rawLevel as any);
          } else {
            const num = parseInt(rawLevel.replace(/[^0-9]/g, ''), 10);
            data = await this.mediaControlService.setVolume(isNaN(num) ? 50 : num);
          }
          isVerified = data.success;
          break;
        }

        case 'system.get_brightness': {
          if (process.platform !== 'win32') {
            throw new Error('UNSUPPORTED_HARDWARE_OPERATION: Display brightness query via WMI is only supported on Windows.');
          }
          const rawRes: any = await this.mediaControlService.runPowerShellSafe(
            `$b = Get-CimInstance -Namespace root/WMI -ClassName WmiMonitorBrightness -ErrorAction SilentlyContinue | Select-Object -First 1; if ($b) { [PSCustomObject]@{ supported = $true; currentBrightness = [int]$b.CurrentBrightness; levels = [int]$b.Levels; instanceName = [string]$b.InstanceName; interface = 'WMI/WmiMonitorBrightness' } | ConvertTo-Json -Compress } else { [PSCustomObject]@{ supported = $false; reason = 'WmiMonitorBrightness not supported by connected display hardware' } | ConvertTo-Json -Compress }`,
            4000
          );
          const rawJson = typeof rawRes === 'string' ? rawRes : String(rawRes?.stdout || '');
          let parsed: any = null;
          try {
            parsed = JSON.parse(rawJson.trim());
          } catch {
            throw new Error(`Display brightness telemetry returned unparseable output: ${rawJson || 'empty'}`);
          }
          if (!parsed || !parsed.supported) {
            throw new Error(parsed?.reason || 'UNSUPPORTED_HARDWARE_OPERATION: Display brightness inspection is not supported on this monitor.');
          }
          data = {
            currentBrightness: parsed.currentBrightness,
            unit: 'percent',
            levels: parsed.levels,
            instanceName: parsed.instanceName,
            interface: parsed.interface,
            postconditionVerified: typeof parsed.currentBrightness === 'number' && parsed.currentBrightness >= 0 && parsed.currentBrightness <= 100
          };
          isVerified = Boolean(data.postconditionVerified);
          break;
        }

        case 'system.set_brightness': {
          const rawVal = call.arguments?.level;
          const numericLevel = typeof rawVal === 'number'
            ? rawVal
            : Number(String(rawVal ?? '').trim().replace(/%$/, ''));
          if (Number.isNaN(numericLevel) || !Number.isFinite(numericLevel) || numericLevel < 0 || numericLevel > 100) {
            throw new Error(`INVALID_BRIGHTNESS_LEVEL: Target brightness level must be between 0 and 100 percent (received: ${rawVal}).`);
          }
          const targetLevel = Math.round(numericLevel);
          if (process.platform !== 'win32') {
            throw new Error('UNSUPPORTED_HARDWARE_OPERATION: Display brightness control via WMI is only supported on Windows.');
          }
          const rawRes: any = await this.mediaControlService.runPowerShellSafe(
            `$beforeObj = Get-CimInstance -Namespace root/WMI -ClassName WmiMonitorBrightness -ErrorAction SilentlyContinue | Select-Object -First 1; $m = Get-CimInstance -Namespace root/WMI -ClassName WmiMonitorBrightnessMethods -ErrorAction SilentlyContinue | Select-Object -First 1; if ($m -and $beforeObj) { $prev = [int]$beforeObj.CurrentBrightness; Invoke-CimMethod -InputObject $m -MethodName WmiSetBrightness -Arguments @{Timeout=1; Brightness=[byte]${targetLevel}} | Out-Null; Start-Sleep -Milliseconds 120; $afterObj = Get-CimInstance -Namespace root/WMI -ClassName WmiMonitorBrightness -ErrorAction SilentlyContinue | Select-Object -First 1; $after = if ($afterObj) { [int]$afterObj.CurrentBrightness } else { -1 }; [PSCustomObject]@{ supported = $true; previousBrightness = $prev; requestedBrightness = ${targetLevel}; currentBrightness = $after; instanceName = [string]$beforeObj.InstanceName; interface = 'WMI/WmiMonitorBrightnessMethods' } | ConvertTo-Json -Compress } else { [PSCustomObject]@{ supported = $false; reason = 'WmiMonitorBrightnessMethods not supported by connected display hardware' } | ConvertTo-Json -Compress }`,
            5000
          );
          const rawJson = typeof rawRes === 'string' ? rawRes : String(rawRes?.stdout || '');
          let parsed: any = null;
          try {
            parsed = JSON.parse(rawJson.trim());
          } catch {
            throw new Error(`Display brightness mutation returned unparseable output: ${rawJson || 'empty'}`);
          }
          if (!parsed || !parsed.supported) {
            throw new Error(parsed?.reason || 'UNSUPPORTED_HARDWARE_OPERATION: Display brightness control is not supported on this monitor.');
          }
          const postconditionVerified = typeof parsed.currentBrightness === 'number' && Math.abs(parsed.currentBrightness - targetLevel) <= 2;
          if (!postconditionVerified) {
            throw new Error(`POSTCONDITION_VERIFICATION_FAILED: Requested brightness ${targetLevel}%, but hardware readback reported ${parsed.currentBrightness}%.`);
          }
          data = {
            previousBrightness: parsed.previousBrightness,
            requestedBrightness: targetLevel,
            currentBrightness: parsed.currentBrightness,
            unit: 'percent',
            instanceName: parsed.instanceName,
            interface: parsed.interface,
            postconditionVerified
          };
          isVerified = postconditionVerified;
          break;
        }

        case 'system.control': {
          const action = String(call.arguments?.action || 'show_desktop').trim().toLowerCase();
          if (action === 'mute' || action === 'unmute') {
            data = await this.mediaControlService.setVolume(action as any);
          } else if (action === 'show_desktop' || action === 'minimize_all') {
            if (process.platform === 'win32') {
              await this.mediaControlService.runPowerShellSafe(
                `(New-Object -ComObject Shell.Application).ToggleDesktop()`,
                3000
              );
            }
            data = { action: 'show_desktop', executed: true };
          } else if (action === 'task_view') {
            if (process.platform === 'win32') {
              await this.mediaControlService.runPowerShellSafe(
                `Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class K { [DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr d); }'; [K]::keybd_event(0x5B,0,0,[UIntPtr]::Zero); [K]::keybd_event(0x09,0,0,[UIntPtr]::Zero); [K]::keybd_event(0x09,0,2,[UIntPtr]::Zero); [K]::keybd_event(0x5B,0,2,[UIntPtr]::Zero)`,
                3000
              );
            }
            data = { action: 'task_view', executed: true };
          } else if (action === 'brightness_up' || action === 'brightness_down') {
            const delta = action === 'brightness_up' ? 15 : -15;
            if (process.platform !== 'win32') {
              throw new Error('UNSUPPORTED_HARDWARE_OPERATION: Display brightness control via WMI is only supported on Windows.');
            }
            const rawRes: any = await this.mediaControlService.runPowerShellSafe(
              `$m = Get-CimInstance -Namespace root/WMI -ClassName WmiMonitorBrightnessMethods -ErrorAction SilentlyContinue | Select-Object -First 1; $b = Get-CimInstance -Namespace root/WMI -ClassName WmiMonitorBrightness -ErrorAction SilentlyContinue | Select-Object -First 1; if ($m -and $b) { $prev = [int]$b.CurrentBrightness; $target = [Math]::Max(0, [Math]::Min(100, $prev + (${delta}))); Invoke-CimMethod -InputObject $m -MethodName WmiSetBrightness -Arguments @{Timeout=1; Brightness=[byte]$target} | Out-Null; Start-Sleep -Milliseconds 120; $afterObj = Get-CimInstance -Namespace root/WMI -ClassName WmiMonitorBrightness -ErrorAction SilentlyContinue | Select-Object -First 1; $after = if ($afterObj) { [int]$afterObj.CurrentBrightness } else { -1 }; [PSCustomObject]@{ supported = $true; previousBrightness = $prev; requestedBrightness = $target; currentBrightness = $after } | ConvertTo-Json -Compress } else { [PSCustomObject]@{ supported = $false } | ConvertTo-Json -Compress }`,
              4000
            );
            const rawJson = typeof rawRes === 'string' ? rawRes : String(rawRes?.stdout || '');
            const parsed = JSON.parse(rawJson.trim());
            if (!parsed?.supported) {
              throw new Error('UNSUPPORTED_HARDWARE_OPERATION: Display brightness control is not supported on this monitor.');
            }
            isVerified = typeof parsed.currentBrightness === 'number' && Math.abs(parsed.currentBrightness - parsed.requestedBrightness) <= 2;
            data = {
              action,
              previousBrightness: parsed.previousBrightness,
              requestedBrightness: parsed.requestedBrightness,
              currentBrightness: parsed.currentBrightness,
              unit: 'percent',
              executed: isVerified
            };
          } else if (action === 'lock') {
            if (!call.requiresUserApproval) {
              throw new Error(`AUTHORIZATION REQUIRED: System action 'lock' requires explicit operator approval.`);
            }
            if (process.platform === 'win32') {
              await this.mediaControlService.runPowerShellSafe(`rundll32.exe user32.dll,LockWorkStation`, 3000);
            }
            data = { action: 'lock', executed: true };
          } else {
            throw new Error(`Unsupported system.control action '${action}'.`);
          }
          break;
        }

        case 'media.status': {
          data = await this.mediaControlService.getNowPlaying();
          break;
        }

        case 'media.control': {
          const action = String(call.arguments?.action || 'toggle').trim().toLowerCase() as any;
          const res = await this.mediaControlService.controlPlayback(action);
          if (!res.success) {
            throw new Error(res.message);
          }
          data = res;
          isVerified = Boolean((res as any).playbackVerified ?? false);
          explicitOutcomeStatus = (res as any).outcomeStatus;
          break;
        }

        case 'media.play_spotify': {
          const query = String(call.arguments?.query || '').trim();
          const res = await this.mediaControlService.playSpotifyQuery(query);
          if (!res.success) {
            throw new Error(res.message);
          }
          data = res;
          isVerified = Boolean((res as any).playbackVerified ?? false);
          explicitOutcomeStatus = (res as any).outcomeStatus;
          break;
        }

        case 'info.weather': {
          const city = String(call.arguments?.city || 'Abu Dhabi').trim();
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          try {
            const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
            const res = await fetch(url, {
              headers: { 'User-Agent': 'ORION-CLI/2.0' },
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!res.ok) {
              throw new Error(`wttr.in returned HTTP ${res.status}`);
            }
            const json: any = await res.json();
            const current = json.current_condition?.[0] || {};
            const area = json.nearest_area?.[0]?.areaName?.[0]?.value || city;
            const country = json.nearest_area?.[0]?.country?.[0]?.value || '';
            data = {
              city: area,
              country,
              tempC: current.temp_C || 'N/A',
              feelsLikeC: current.FeelsLikeC || 'N/A',
              humidity: current.humidity ? `${current.humidity}%` : 'N/A',
              windKmph: current.windspeedKmph ? `${current.windspeedKmph} km/h` : 'N/A',
              condition: current.weatherDesc?.[0]?.value || 'Clear'
            };
          } catch (err: any) {
            clearTimeout(timeoutId);
            data = {
              city,
              status: 'OFFLINE_FALLBACK',
              message: `Live weather API unreachable (${err.message}).`
            };
          }
          break;
        }

        case 'info.prayers': {
          const city = String(call.arguments?.city || 'Abu Dhabi').trim();
          const country = String(call.arguments?.country || 'UAE').trim();
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          try {
            const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=8`;
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!res.ok) {
              throw new Error(`Aladhan API returned HTTP ${res.status}`);
            }
            const json: any = await res.json();
            const timings = json.data?.timings || {};
            const hijri = json.data?.date?.hijri;
            const readableDate = json.data?.date?.readable || new Date().toLocaleDateString();
            data = {
              city,
              country,
              date: readableDate,
              hijriDate: hijri ? `${hijri.day} ${hijri.month?.en || ''} ${hijri.year} AH` : 'N/A',
              timings: {
                Fajr: timings.Fajr,
                Sunrise: timings.Sunrise,
                Dhuhr: timings.Dhuhr,
                Asr: timings.Asr,
                Maghrib: timings.Maghrib,
                Isha: timings.Isha
              }
            };
          } catch (err: any) {
            clearTimeout(timeoutId);
            data = {
              city,
              country,
              status: 'OFFLINE_FALLBACK',
              message: `Prayer times API unreachable (${err.message}).`
            };
          }
          break;
        }

        case 'memory.add_note': {
          const content = String(call.arguments?.content || '').trim();
          if (!content) {
            throw new Error('Parameter "content" is required for memory.add_note.');
          }
          const rec = this.unifiedMemory.addNote(content);
          data = { id: rec.id, content: rec.content, timestamp: rec.timestamp };
          break;
        }

        case 'memory.list_notes': {
          const notes = this.unifiedMemory.listNotes(25);
          data = { count: notes.length, notes };
          break;
        }

        case 'memory.add_reminder': {
          const task = String(call.arguments?.task || '').trim();
          const due = call.arguments?.due ? String(call.arguments.due).trim() : undefined;
          if (!task) {
            throw new Error('Parameter "task" is required for memory.add_reminder.');
          }
          const rec = this.unifiedMemory.addReminder(task, due);
          data = { id: rec.id, content: rec.content, timestamp: rec.timestamp };
          break;
        }

        case 'memory.list_reminders': {
          const reminders = this.unifiedMemory.listReminders(25);
          data = { count: reminders.length, reminders };
          break;
        }

        case 'file.list_directory': {
          const targetDir = call.arguments?.dirPath || process.cwd();
          const resolvedPath = path.resolve(targetDir);
          if (this.isSensitiveOrRestrictedPath(targetDir) || this.isSensitiveOrRestrictedPath(resolvedPath)) {
            throw new Error(`SECURITY POLICY VIOLATION: Directory listing of restricted or sensitive boundary '${targetDir}' is strictly prohibited.`);
          }
          const entries = fs
            .readdirSync(resolvedPath, { withFileTypes: true })
            .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name));
          data = {
            directory: resolvedPath,
            itemCount: entries.length,
            items: entries.slice(0, 250).map(e => ({
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
          if (this.isSensitiveOrRestrictedPath(filePath)) {
            throw new Error(`SECURITY POLICY VIOLATION: Access to restricted or sensitive credential boundary '${filePath}' is strictly prohibited. Security containment enforced.`);
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
          const envelope = UntrustedContentBoundary.ingest('FILE_CONTENT', resolvedPath, content.slice(0, 2000), 'UNTRUSTED_EXTERNAL');
          data = {
            filePath: resolvedPath,
            sizeBytes: stat.size,
            content: envelope.sanitizedText,
            contentSnippet: envelope.sanitizedText,
            provenance: {
              sourceType: envelope.sourceType,
              trustLevel: envelope.trustLevel,
              contentHash: envelope.contentHash,
              containsSuspiciousDirectives: envelope.containsSuspiciousDirectives
            }
          };
          break;
        }

        case 'file.write_text': {
          const filePath = call.arguments?.filePath;
          const content = call.arguments?.content;
          if (!filePath || content === undefined) {
            throw new Error('Parameters "filePath" and "content" are required.');
          }
          if (this.isSensitiveOrRestrictedPath(filePath)) {
            throw new Error(`SECURITY POLICY VIOLATION: Writing into restricted or sensitive credential boundary '${filePath}' is strictly prohibited. Security containment enforced.`);
          }
          const writeRes = SecurityPolicyMiddleware.getInstance().writeFileAtomicallyWithBackup(filePath, String(content));
          const resolvedPath = writeRes.resolvedPath;

          // Verification Engine Step: Re-read file to verify existence and content size
          if (!fs.existsSync(resolvedPath)) {
            isVerified = false;
            throw new Error(`Verification failed: File ${resolvedPath} was not created.`);
          }
          const writtenStat = fs.statSync(resolvedPath);
          data = {
            filePath: resolvedPath,
            sizeBytes: writtenStat.size,
            verified: true,
            backupCreated: Boolean(writeRes.backupRecord),
            backupId: writeRes.backupRecord?.backupId
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
          if (!res.success) {
            throw new Error(res.error || `Desktop action '${action?.type || 'UNKNOWN'}' failed.`);
          }
          data = res;
          isVerified = res.postconditionsVerified;
          break;
        }

        case 'computer.natural_language_command': {
          const command = call.arguments?.command || 'Observe desktop';
          const plan = await this.computerUseService.executeNaturalLanguageCommand(command);
          if (plan.status === 'FAILED' || plan.status === 'ESTOPPED' || plan.status === 'CANCELLED') {
            const failedAudit = Array.isArray(plan.auditLog)
              ? plan.auditLog.find((entry: any) => entry.result === 'FAILURE' || entry.result === 'BLOCKED')
              : undefined;
            const detail = failedAudit?.error || plan.completionReport || `Desktop plan ended in state '${plan.status}'.`;
            throw new Error(detail);
          }
          const allStepsVerified =
            Array.isArray(plan.auditLog) &&
            plan.auditLog.length > 0 &&
            plan.auditLog.every((entry: any) => entry.verification === 'VERIFIED');
          data = plan;
          isVerified = plan.status === 'COMPLETED' && allStepsVerified;
          explicitOutcomeStatus = isVerified ? 'completed_verified' : 'launched_unverified';
          break;
        }

        case 'computer.discover_apps': {
          const resolver = this.computerUseService.getExecutor().getAppResolver();
          const query = call.arguments?.query ? String(call.arguments.query).trim() : undefined;
          const apps = resolver.discoverInstalledApps(query);
          data = {
            query: query || null,
            count: apps.length,
            applications: apps.map(a => ({
              canonicalId: a.canonicalId,
              displayName: a.displayName,
              executableName: a.executableName,
              resolvedExecutablePath: a.resolvedExecutablePath,
              discoverySource: a.discoverySource,
              isProtocolUri: a.isProtocolUri,
              isStoreApp: Boolean(a.isStoreApp)
            }))
          };
          isVerified = true;
          break;
        }

        case 'computer.launch_app': {
          const appName = String(call.arguments?.appName || '').trim();
          const resolver = this.computerUseService.getExecutor().getAppResolver();
          const resolved = resolver.resolveApp(appName);
          const launchAction: any = {
            id: `act_launch_${Date.now()}`,
            type: 'OPEN_APP',
            target: appName,
            parameters: {
              appName,
              args: call.arguments?.args,
              path: call.arguments?.path
            },
            confidence: 0.98,
            riskLevel: 'MODERATE_RISK',
            reason: `Launch Windows application '${resolved.displayName}'`
          };
          const res = await this.computerUseService.executeSingleAction(launchAction);
          if (!res.success) {
            throw new Error(res.error || `Failed to launch application '${resolved.displayName}'.`);
          }
          const windowVerified = Boolean(res.postconditionsVerified);
          const processVerified = Boolean(launchAction.parameters?._processRunningVerified);
          isVerified = windowVerified;
          explicitOutcomeStatus = windowVerified ? 'completed_verified' : 'launched_unverified';
          data = {
            canonicalId: resolved.canonicalId,
            displayName: resolved.displayName,
            resolvedExecutablePath: resolved.resolvedExecutablePath,
            discoverySource: resolved.discoverySource,
            pid: launchAction.parameters?._spawnedPid,
            windowVerified,
            processVerified,
            outcomeStatus: explicitOutcomeStatus,
            activeWindow: res.observedState?.activeWindow
          };
          break;
        }

        case 'browser.navigate': {
          const url = String(call.arguments?.url || 'https://www.google.com').trim().replace(/[.,;]+$/, '');
          if (call.arguments?.openInChromeWindow && !call.arguments?.useCdpAdapter) {
            const openRes = await this.browserProvider.openChromeWindow(url, {
              visibleWindow: true,
              useCdp: false,
              timeoutMs: call.arguments?.timeoutMs
            });
            if ((openRes as any).errorCode === 'PAUSED_FOR_USER_AUTH') {
              throw new Error(openRes.error || 'AUTHENTICATION REQUIRED: Browser paused at sign-in or account chooser.');
            }
            if (!openRes.success) {
              throw new Error(openRes.error || 'Browser launch failed.');
            }
            data = openRes;
            isVerified = openRes.postconditionsVerified;
            explicitOutcomeStatus = isVerified ? 'completed_verified' : 'launched_unverified';
            break;
          }
          if (call.arguments?.openInChromeWindow && call.arguments?.useCdpAdapter) {
            await this.browserProvider.openChromeWindow(url, {
              visibleWindow: true,
              useCdp: true,
              timeoutMs: call.arguments?.timeoutMs
            });
          }
          const res = await this.browserProvider.navigate(url, {
            waitForSelector: call.arguments?.waitForSelector,
            useCdpAdapter: call.arguments?.useCdpAdapter ?? Boolean(call.arguments?.visibleWindow || call.arguments?.openInChromeWindow),
            visibleWindow: call.arguments?.visibleWindow ?? Boolean(call.arguments?.openInChromeWindow),
            pauseOnAuthOrCaptcha: call.arguments?.pauseOnAuthOrCaptcha,
            timeoutMs: call.arguments?.timeoutMs
          });
          if ((res as any).errorCode === 'PAUSED_FOR_USER_AUTH') {
            throw new Error(res.error || 'AUTHENTICATION REQUIRED: Browser paused at sign-in or account chooser.');
          }
          if (!res.success) {
            throw new Error(res.error || 'Browser navigation failed.');
          }
          data = res;
          isVerified = res.postconditionsVerified;
          break;
        }

        case 'browser.click': {
          const selector = String(call.arguments?.selector || '').trim();
          const res = await this.browserProvider.click(selector, {
            explicitAuthorization: Boolean(call.requiresUserApproval || (call as any).operatorApproved)
          });
          if (!res.success) {
            throw new Error(res.error || `Failed to click selector '${selector}'.`);
          }
          data = res;
          isVerified = res.postconditionsVerified;
          break;
        }

        case 'browser.type': {
          const selector = String(call.arguments?.selector || '').trim();
          const text = String(call.arguments?.text ?? '');
          const res = await this.browserProvider.typeText(selector, text, {
            explicitAuthorization: Boolean(call.requiresUserApproval || (call as any).operatorApproved)
          });
          if (!res.success) {
            throw new Error(res.error || `Failed to type into selector '${selector}'.`);
          }
          data = res;
          isVerified = res.postconditionsVerified;
          break;
        }

        case 'browser.search': {
          const query = String(call.arguments?.query || 'mechanical keyboards').trim();
          const wantsVisible = Boolean(call.arguments?.visibleWindow || call.arguments?.openInChromeWindow);
          const res = await this.browserProvider.searchWeb(query, {
            useCdpAdapter: call.arguments?.useCdpAdapter ?? (wantsVisible ? true : undefined),
            visibleWindow: wantsVisible ? true : call.arguments?.visibleWindow,
            searchEngineUrl: call.arguments?.searchEngineUrl,
            timeoutMs: call.arguments?.timeoutMs
          });
          if (!res.success && res.searchResults.length === 0) {
            throw new Error(res.error || `Web search failed for '${query}'.`);
          }
          data = {
            query,
            pageTitle: res.observation?.title || 'Search Results',
            url: res.observation?.url,
            visibleWindowVerified: Boolean(res.observation?.visibleWindowVerified),
            extractedText: (res.observation?.extractedText || '').slice(0, 2000),
            topLinks: (res.observation?.links || []).slice(0, 10),
            searchResults: res.searchResults
          };
          isVerified = res.postconditionsVerified;
          break;
        }

        default:
          throw new Error(`Tool execution handler for '${tool.id}' not implemented.`);
      }

      if (signal?.aborted) {
        throw new Error('Execution CANCELLED: Task cancelled by operator via Escape.');
      }

      const durationMs = Date.now() - startTime;
      this.registry.recordSkillExecution(tool.id, true, durationMs);
      const outcomeStatus = explicitOutcomeStatus || (isVerified ? 'completed_verified' : 'launched_unverified');
      return {
        toolCallId: call.id,
        toolId: call.toolId,
        success: true,
        outcomeStatus,
        verificationStatus: isVerified ? 'VERIFIED' : 'EXECUTED',
        verified: isVerified,
        data,
        timestamp: Date.now(),
        executionTimeMs: durationMs
      };
    } catch (err: any) {
      this.registry.recordSkillExecution(tool.id, false, Date.now() - startTime);
      const errMsg = err?.message || 'Execution error encountered';
      let errOutcome: import('../../shared/types').TaskOutcomeStatus = 'failed';
      if (signal?.aborted || /CANCELLED|aborted by signal|cancelled by operator/i.test(errMsg)) {
        errOutcome = 'cancelled';
      } else if (/TIMEOUT|timed out|exceeded execution limit/i.test(errMsg)) {
        errOutcome = 'timed_out';
      } else if (/AUTHORIZATION REQUIRED|AUTHENTICATION REQUIRED|PAUSED_FOR_USER_AUTH|requires explicit/i.test(errMsg)) {
        errOutcome = 'permission_required';
      }
      return {
        toolCallId: call.id,
        toolId: call.toolId,
        success: false,
        outcomeStatus: errOutcome,
        verificationStatus: 'FAILED',
        verified: false,
        error: errMsg,
        timestamp: Date.now(),
        executionTimeMs: Date.now() - startTime
      };
    } finally {
      if (signal) {
        signal.removeEventListener('abort', onAbortDuringTool);
      }
    }
  }
}
