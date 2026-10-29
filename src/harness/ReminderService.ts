import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { UnifiedMemoryManager } from '../main/services/UnifiedMemoryManager';

export type ReminderStatus =
  | 'PENDING'
  | 'DELIVERED'
  | 'STORED_NO_ALERT_ADAPTER'
  | 'CANCELLED'
  | 'FAILED';

export interface ReminderRecord {
  id: string;
  message: string;
  dueAtIso: string;
  dueAtEpochMs: number;
  timeZone: string;
  createdAtIso: string;
  createdAtEpochMs: number;
  status: ReminderStatus;
  deliveredAtIso?: string;
  deliveredAtEpochMs?: number;
  deliveryChannel?: 'windows-toast-balloon' | 'terminal-callback' | 'custom-adapter' | 'none';
  deliveryNote?: string;
  deliveryAttempts: number;
}

export type ReminderNotificationAdapter = (
  reminder: ReminderRecord
) => Promise<{
  delivered: boolean;
  channel: 'windows-toast-balloon' | 'terminal-callback' | 'custom-adapter' | 'none';
  note?: string;
}>;

/**
 * Persistent Reminder & Alerting Service (Section 11).
 * - Creates, lists, inspects, cancels, and delivers due reminders.
 * - Persists across restarts in `.orion_memory/reminders_v2.json` via atomic write.
 * - Validates ISO timestamps, relative offsets (`+15m`, `in 2 hours`, `tomorrow 09:00`), and IANA time zones.
 * - Prevents duplicate delivery across ticks and restarts.
 * - Integrates with a real Windows notification adapter (PowerShell NotifyIcon balloon / Toast)
 *   and honestly reports `STORED_NO_ALERT_ADAPTER` if no live notification channel is available.
 */
export class ReminderService {
  private readonly storagePath: string;
  private reminders: ReminderRecord[] = [];
  private notificationAdapter?: ReminderNotificationAdapter;
  private useSystemWindowsAdapter: boolean;
  private schedulerInterval?: NodeJS.Timeout;
  private onReminderTriggeredCallbacks: Array<(reminder: ReminderRecord) => void> = [];

  constructor(options: {
    storagePath?: string;
    notificationAdapter?: ReminderNotificationAdapter;
    useSystemWindowsAdapter?: boolean;
  } = {}) {
    const defaultDir = path.resolve(process.cwd(), '.orion_memory');
    if (!fs.existsSync(defaultDir)) {
      try {
        fs.mkdirSync(defaultDir, { recursive: true });
      } catch {}
    }
    this.storagePath = options.storagePath || path.join(defaultDir, 'reminders_v2.json');
    this.notificationAdapter = options.notificationAdapter;
    this.useSystemWindowsAdapter = options.useSystemWindowsAdapter ?? (process.platform === 'win32');
    this.loadFromDisk();
  }

  public setNotificationAdapter(adapter?: ReminderNotificationAdapter): void {
    this.notificationAdapter = adapter;
  }

  public setUseSystemWindowsAdapter(enabled: boolean): void {
    this.useSystemWindowsAdapter = enabled;
  }

  public onReminderTriggered(cb: (reminder: ReminderRecord) => void): () => void {
    this.onReminderTriggeredCallbacks.push(cb);
    return () => {
      this.onReminderTriggeredCallbacks = this.onReminderTriggeredCallbacks.filter(fn => fn !== cb);
    };
  }

  public reloadFromDisk(): void {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.storagePath)) {
        const raw = fs.readFileSync(this.storagePath, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.reminders = parsed;
          return;
        }
      }
    } catch {}
    this.reminders = [];
  }

  private saveToDisk(): void {
    try {
      const dir = path.dirname(this.storagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tmpPath = `${this.storagePath}.tmp.${process.pid}.${Date.now()}`;
      fs.writeFileSync(tmpPath, JSON.stringify(this.reminders, null, 2), 'utf8');
      fs.renameSync(tmpPath, this.storagePath);
    } catch {}
  }

  public static validateTimeZone(tz?: string): { valid: boolean; normalizedTimeZone: string; error?: string } {
    const resolvedTz = (tz || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC').trim();
    try {
      Intl.DateTimeFormat(undefined, { timeZone: resolvedTz });
      return { valid: true, normalizedTimeZone: resolvedTz };
    } catch {
      return {
        valid: false,
        normalizedTimeZone: 'UTC',
        error: `Invalid IANA time zone "${tz}". Examples of valid time zones: "UTC", "Asia/Dubai", "America/New_York".`
      };
    }
  }

  public static parseDueTime(
    dueInput: string,
    nowEpochMs: number = Date.now()
  ): { valid: boolean; epochMs?: number; iso?: string; error?: string } {
    if (!dueInput || typeof dueInput !== 'string' || !dueInput.trim()) {
      return { valid: false, error: 'Reminder dueAt time must be a non-empty string.' };
    }

    const trimmed = dueInput.trim();

    // 1. Relative shorthand: +10s, +15m, +2h, +1d or "in 10 minutes", "in 2 hours", "in 30 seconds"
    const relMatch = trimmed.match(/^(?:\+|in\s+)(\d+)\s*(s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days)$/i);
    if (relMatch) {
      const amount = parseInt(relMatch[1], 10);
      const unit = relMatch[2].toLowerCase();
      if (amount <= 0 || Number.isNaN(amount)) {
        return { valid: false, error: `Relative duration must be positive: "${dueInput}"` };
      }
      let multiplierMs = 60_000;
      if (unit.startsWith('s')) multiplierMs = 1_000;
      else if (unit.startsWith('m')) multiplierMs = 60_000;
      else if (unit.startsWith('h')) multiplierMs = 3_600_000;
      else if (unit.startsWith('d')) multiplierMs = 86_400_000;

      const targetEpoch = nowEpochMs + amount * multiplierMs;
      return {
        valid: true,
        epochMs: targetEpoch,
        iso: new Date(targetEpoch).toISOString()
      };
    }

    // 2. "tomorrow HH:MM"
    const tomorrowMatch = trimmed.match(/^tomorrow(?:\s+at)?\s+(\d{1,2}):(\d{2})$/i);
    if (tomorrowMatch) {
      const hours = parseInt(tomorrowMatch[1], 10);
      const minutes = parseInt(tomorrowMatch[2], 10);
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        const d = new Date(nowEpochMs + 86_400_000);
        d.setHours(hours, minutes, 0, 0);
        return {
          valid: true,
          epochMs: d.getTime(),
          iso: d.toISOString()
        };
      }
      return { valid: false, error: `Invalid time in "${dueInput}". Hours must be 0-23 and minutes 0-59.` };
    }

    // 3. Direct ISO-8601 or standard date string
    const parsedEpoch = Date.parse(trimmed);
    if (Number.isNaN(parsedEpoch)) {
      return {
        valid: false,
        error: `Invalid due date/time "${dueInput}". Provide an ISO-8601 date (e.g., "2026-10-28T09:00:00Z") or relative duration (e.g., "+15m", "in 2 hours").`
      };
    }

    return {
      valid: true,
      epochMs: parsedEpoch,
      iso: new Date(parsedEpoch).toISOString()
    };
  }

  public async createReminder(input: {
    message: string;
    dueAt: string;
    timeZone?: string;
    nowEpochMs?: number;
  }): Promise<{
    success: boolean;
    reminder?: ReminderRecord;
    adapterAvailable: boolean;
    warning?: string;
    error?: string;
  }> {
    const cleanMsg = UnifiedMemoryManager.sanitizeSecrets(String(input.message || '').trim());
    if (!cleanMsg) {
      return {
        success: false,
        adapterAvailable: this.hasNotificationAdapter(),
        error: 'Reminder message must not be empty.'
      };
    }

    const tzCheck = ReminderService.validateTimeZone(input.timeZone);
    if (!tzCheck.valid) {
      return {
        success: false,
        adapterAvailable: this.hasNotificationAdapter(),
        error: tzCheck.error
      };
    }

    const nowMs = input.nowEpochMs ?? Date.now();
    const dueCheck = ReminderService.parseDueTime(input.dueAt, nowMs);
    if (!dueCheck.valid || dueCheck.epochMs === undefined || !dueCheck.iso) {
      return {
        success: false,
        adapterAvailable: this.hasNotificationAdapter(),
        error: dueCheck.error
      };
    }

    const adapterAvailable = this.hasNotificationAdapter();
    const record: ReminderRecord = {
      id: `rem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      message: cleanMsg,
      dueAtIso: dueCheck.iso,
      dueAtEpochMs: dueCheck.epochMs,
      timeZone: tzCheck.normalizedTimeZone,
      createdAtIso: new Date(nowMs).toISOString(),
      createdAtEpochMs: nowMs,
      status: adapterAvailable ? 'PENDING' : 'STORED_NO_ALERT_ADAPTER',
      deliveryNote: adapterAvailable
        ? 'Scheduled for active notification delivery.'
        : 'Reminder stored persistently, but OS notification adapter is disabled/unavailable so it will not reliably alert until an adapter or TUI listener is active.',
      deliveryAttempts: 0
    };

    this.reminders.push(record);
    this.saveToDisk();

    return {
      success: true,
      reminder: record,
      adapterAvailable,
      warning: adapterAvailable ? undefined : record.deliveryNote
    };
  }

  public hasNotificationAdapter(): boolean {
    return Boolean(
      this.notificationAdapter ||
      this.onReminderTriggeredCallbacks.length > 0 ||
      (this.useSystemWindowsAdapter && process.platform === 'win32')
    );
  }

  public listReminders(filterStatus?: ReminderStatus): ReminderRecord[] {
    this.loadFromDisk();
    const list = filterStatus
      ? this.reminders.filter(r => r.status === filterStatus)
      : [...this.reminders];
    return list.sort((a, b) => a.dueAtEpochMs - b.dueAtEpochMs);
  }

  public inspectReminder(id: string): ReminderRecord | null {
    this.loadFromDisk();
    return this.reminders.find(r => r.id === id) || null;
  }

  public cancelReminder(id: string): {
    success: boolean;
    reminder?: ReminderRecord;
    error?: string;
  } {
    this.loadFromDisk();
    const target = this.reminders.find(r => r.id === id);
    if (!target) {
      return { success: false, error: `Reminder "${id}" not found.` };
    }
    if (target.status === 'DELIVERED') {
      return {
        success: false,
        reminder: target,
        error: `Reminder "${id}" has already been delivered at ${target.deliveredAtIso}.`
      };
    }
    target.status = 'CANCELLED';
    target.deliveryNote = `Cancelled by operator at ${new Date().toISOString()}.`;
    this.saveToDisk();
    return { success: true, reminder: target };
  }

  /**
   * Checks all due reminders (`dueAtEpochMs <= nowEpochMs`) that have not yet been delivered
   * or cancelled, delivers them exactly once, and persists their updated state.
   */
  public async checkAndDeliverDueReminders(nowEpochMs: number = Date.now()): Promise<{
    checkedCount: number;
    delivered: ReminderRecord[];
    unalertedStored: ReminderRecord[];
  }> {
    this.loadFromDisk();
    const dueList = this.reminders.filter(
      r =>
        (r.status === 'PENDING' || r.status === 'STORED_NO_ALERT_ADAPTER') &&
        !r.deliveredAtEpochMs &&
        r.dueAtEpochMs <= nowEpochMs
    );

    const delivered: ReminderRecord[] = [];
    const unalertedStored: ReminderRecord[] = [];

    for (const rem of dueList) {
      rem.deliveryAttempts += 1;

      // Notify any active TUI/CLI listeners first
      let notifiedListeners = false;
      for (const cb of this.onReminderTriggeredCallbacks) {
        try {
          cb(rem);
          notifiedListeners = true;
        } catch {}
      }

      if (this.notificationAdapter) {
        try {
          const res = await this.notificationAdapter(rem);
          if (res.delivered) {
            rem.status = 'DELIVERED';
            rem.deliveredAtEpochMs = nowEpochMs;
            rem.deliveredAtIso = new Date(nowEpochMs).toISOString();
            rem.deliveryChannel = res.channel;
            rem.deliveryNote = res.note || 'Delivered via configured notification adapter.';
            delivered.push(rem);
            continue;
          }
        } catch (err: any) {
          rem.deliveryNote = `Custom adapter error: ${err.message}`;
        }
      }

      if (this.useSystemWindowsAdapter && process.platform === 'win32') {
        const winRes = await this.deliverWindowsBalloonNotification(rem);
        if (winRes.delivered) {
          rem.status = 'DELIVERED';
          rem.deliveredAtEpochMs = nowEpochMs;
          rem.deliveredAtIso = new Date(nowEpochMs).toISOString();
          rem.deliveryChannel = 'windows-toast-balloon';
          rem.deliveryNote = winRes.note;
          delivered.push(rem);
          continue;
        }
      }

      if (notifiedListeners) {
        rem.status = 'DELIVERED';
        rem.deliveredAtEpochMs = nowEpochMs;
        rem.deliveredAtIso = new Date(nowEpochMs).toISOString();
        rem.deliveryChannel = 'terminal-callback';
        rem.deliveryNote = 'Delivered to active ORION TUI session.';
        delivered.push(rem);
      } else {
        rem.status = 'STORED_NO_ALERT_ADAPTER';
        rem.deliveryChannel = 'none';
        rem.deliveryNote =
          'Reminder is due and stored persistently, but no active notification adapter was available to display an alert.';
        unalertedStored.push(rem);
      }
    }

    if (dueList.length > 0) {
      this.saveToDisk();
    }

    return {
      checkedCount: this.reminders.length,
      delivered,
      unalertedStored
    };
  }

  private async deliverWindowsBalloonNotification(reminder: ReminderRecord): Promise<{
    delivered: boolean;
    note: string;
  }> {
    return new Promise((resolve) => {
      const safeTitle = 'ORION Reminder';
      const safeMsg = reminder.message.replace(/['"`$]/g, '').slice(0, 200);
      const psScript = [
        'Add-Type -AssemblyName System.Windows.Forms;',
        'Add-Type -AssemblyName System.Drawing;',
        '$n = New-Object System.Windows.Forms.NotifyIcon;',
        '$n.Icon = [System.Drawing.SystemIcons]::Information;',
        '$n.BalloonTipTitle = \'' + safeTitle + '\';',
        '$n.BalloonTipText = \'' + safeMsg + '\';',
        '$n.Visible = $true;',
        '$n.ShowBalloonTip(4000);',
        'Start-Sleep -Milliseconds 350;',
        '$n.Dispose();',
        'Write-Output "BALLOON_DELIVERED"'
      ].join(' ');

      let stdout = '';
      const child = spawn(
        'powershell.exe',
        ['-NoProfile', '-NonInteractive', '-Command', psScript],
        { windowsHide: true }
      );

      const timer = setTimeout(() => {
        try {
          child.kill();
        } catch {}
        resolve({ delivered: false, note: 'Windows notification command timed out.' });
      }, 5000);

      if (child.stdout) {
        child.stdout.on('data', (d: Buffer) => {
          stdout += d.toString('utf8');
        });
      }

      child.on('error', (err) => {
        clearTimeout(timer);
        resolve({ delivered: false, note: `Windows notification error: ${err.message}` });
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        if (code === 0 && stdout.includes('BALLOON_DELIVERED')) {
          resolve({
            delivered: true,
            note: 'Delivered via Windows System.Windows.Forms.NotifyIcon balloon notification.'
          });
        } else {
          resolve({
            delivered: false,
            note: `Windows notification process exited with code ${code}.`
          });
        }
      });
    });
  }

  public startBackgroundScheduler(intervalMs: number = 15_000): void {
    if (this.schedulerInterval) return;
    this.schedulerInterval = setInterval(() => {
      this.checkAndDeliverDueReminders().catch(() => {});
    }, Math.max(1000, intervalMs));
    if (typeof this.schedulerInterval.unref === 'function') {
      this.schedulerInterval.unref();
    }
  }

  public stopBackgroundScheduler(): void {
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = undefined;
    }
  }
}
