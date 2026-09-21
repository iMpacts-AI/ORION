import { EnvironmentState, EnvironmentDiff, ActiveWindowInfo } from '../../shared/types/environment';
import { IWindowProvider, DefaultWindowProvider } from '../platform/WindowProvider';
import { SystemMonitorService } from './SystemMonitorService';
import { VisionService } from './VisionService';
import { AssistantState } from '../../shared/types';

export class ComputerPerceptionService {
  private windowProvider: IWindowProvider;
  private systemMonitor: SystemMonitorService;
  private visionService: VisionService;
  private lastSnapshot?: EnvironmentState;

  constructor(
    systemMonitor: SystemMonitorService,
    visionService: VisionService,
    windowProvider?: IWindowProvider
  ) {
    this.systemMonitor = systemMonitor;
    this.visionService = visionService;
    this.windowProvider = windowProvider || new DefaultWindowProvider();
  }

  public async captureEnvironment(currentState: AssistantState, activeTaskTitle?: string): Promise<EnvironmentState> {
    const activeWindow = await this.windowProvider.getActiveWindow();
    const visibleWindows = await this.windowProvider.getVisibleWindows();
    const systemTelemetry = await this.systemMonitor.getSnapshot();

    const state: EnvironmentState = {
      timestamp: Date.now(),
      activeApp: activeWindow.processName,
      activeWindow,
      visibleWindows,
      displayCount: 1,
      systemTelemetry,
      activeTaskTitle,
      currentAssistantState: currentState
    };

    this.lastSnapshot = state;
    return state;
  }

  public computeDiff(newState: EnvironmentState): EnvironmentDiff {
    if (!this.lastSnapshot) {
      return {
        timestamp: Date.now(),
        activeAppChanged: false,
        activeWindowChanged: false,
        systemStateChanged: false,
        summary: 'Initial environment baseline captured.'
      };
    }

    const appChanged = this.lastSnapshot.activeApp !== newState.activeApp;
    const windowChanged = this.lastSnapshot.activeWindow?.title !== newState.activeWindow?.title;
    const sysChanged = Math.abs((this.lastSnapshot.systemTelemetry?.cpu?.usagePercent || 0) - (newState.systemTelemetry?.cpu?.usagePercent || 0)) > 15;

    const changes: string[] = [];
    if (appChanged) changes.push(`App changed from ${this.lastSnapshot.activeApp} to ${newState.activeApp}`);
    if (windowChanged) changes.push(`Window changed to "${newState.activeWindow?.title}"`);
    if (sysChanged) changes.push(`CPU usage shifted significantly`);

    return {
      timestamp: Date.now(),
      activeAppChanged: appChanged,
      activeWindowChanged: windowChanged,
      systemStateChanged: sysChanged,
      previousApp: this.lastSnapshot.activeApp,
      currentApp: newState.activeApp,
      summary: changes.length > 0 ? changes.join(' | ') : 'Environment state unchanged.'
    };
  }
}
