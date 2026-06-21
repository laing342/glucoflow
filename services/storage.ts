import { BloodSugarRecord, MealRecord, InsulinRecord } from '../types';

export async function initDatabase(): Promise<void> {
  return Promise.resolve();
}

export function exportToCSV(records: BloodSugarRecord[]): string {
  const header = 'id,value,type,timestamp,note';
  const rows = records.map(function (r) {
    const id = '"' + r.id + '"';
    const val = r.value.toString();
    const type = '"' + r.type + '"';
    const ts = '"' + new Date(r.timestamp).toISOString() + '"';
    const note = r.note ? '"' + r.note.replace(/"/g, '""') + '"' : '';
    return [id, val, type, ts, note].join(',');
  });
  return [header].concat(rows).join('\n');
}

export function exportMealsToCSV(records: MealRecord[]): string {
  const header = 'id,type,carbs,foods,timestamp,note';
  const rows = records.map(function (r) {
    const id = '"' + r.id + '"';
    const type = '"' + r.type + '"';
    const carbs = r.totalCarbs.toString();
    const foods = '"' + r.foods.map(function (f) { return f.name + ':' + f.carbs + 'g'; }).join('; ') + '"';
    const ts = '"' + new Date(r.timestamp).toISOString() + '"';
    const note = r.note ? '"' + r.note.replace(/"/g, '""') + '"' : '';
    return [id, type, carbs, foods, ts, note].join(',');
  });
  return [header].concat(rows).join('\n');
}
