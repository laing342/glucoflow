import { BloodSugarType } from '../types';

interface ScheduledReminder {
  type: BloodSugarType;
  hour: number;
  minute: number;
}

const scheduledReminders: ScheduledReminder[] = [];

export async function scheduleBloodSugarReminder(
  type: BloodSugarType,
  hour: number,
  minute: number,
): Promise<void> {
  scheduledReminders.push({ type, hour, minute });
}

export async function cancelAllReminders(): Promise<void> {
  scheduledReminders.length = 0;
}

export function getScheduledReminders(): ScheduledReminder[] {
  return [...scheduledReminders];
}
