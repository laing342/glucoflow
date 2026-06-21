import { GlucoseLevel, BloodSugarType } from '../types';

export function mmolLtoMgdL(value: number): number {
  return Math.round(value * 18.0182);
}

export function mgdLtoMmolL(value: number): number {
  return parseFloat((value / 18.0182).toFixed(1));
}

export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export function calcHbA1c(avgGlucose: number): number {
  return parseFloat(((avgGlucose + 2.59) / 1.59).toFixed(1));
}

export function getLevel(value: number): GlucoseLevel {
  if (value < 3.9) return 'low';
  if (value > 10.0) return 'high';
  return 'normal';
}

let _idCounter = 0;

export function genId(): string {
  _idCounter += 1;
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 7);
  return ts + '-' + rand + '-' + _idCounter;
}

export function getTypeLabel(type: BloodSugarType): string {
  const labels: Record<BloodSugarType, string> = {
    fasting: '空腹 Fasting',
    before_meal: '餐前 Before Meal',
    after_meal: '餐后 After Meal',
    bedtime: '睡前 Bedtime',
    random: '随机 Random',
  };
  return labels[type];
}

export function formatTime(date: Date): string {
  const d = new Date(date);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
}
