import { create } from 'zustand';
import { BloodSugarRecord, MealRecord, InsulinRecord, DailySummary } from '../types';
import { genId, getLevel, isInRange } from '../utils/glucoseCalc';
import { GLUCOSE_TARGETS } from '../constants/reference';
import { saveAllRecords, loadRecords } from '../utils/storage';

interface RecordsState {
  bloodSugarRecords: BloodSugarRecord[];
  mealRecords: MealRecord[];
  insulinRecords: InsulinRecord[];
  isLoading: boolean;
  
  addBloodSugar: (r: Omit<BloodSugarRecord, 'id'>) => void;
  addMeal: (r: Omit<MealRecord, 'id'>) => void;
  addInsulin: (r: Omit<InsulinRecord, 'id'>) => void;
  removeBloodSugar: (id: string) => void;
  removeMeal: (id: string) => void;
  removeInsulin: (id: string) => void;
  clearAll: () => void;
  getTodayRecords: () => { bloodSugar: BloodSugarRecord[]; meals: MealRecord[]; insulin: InsulinRecord[] };
  getRecordsByDateRange: (days: number) => BloodSugarRecord[];
  getDailySummaries: (days: number) => DailySummary[];
  loadFromStorage: () => Promise<void>;
}

function getDateKey(d: Date): string {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1).toString().padStart(2, '0');
  const day = dt.getDate().toString().padStart(2, '0');
  return y + '-' + m + '-' + day;
}

function isToday(d: Date): boolean {
  return getDateKey(d) === getDateKey(new Date());
}

export const useRecords = create<RecordsState>((set, get) => ({
  bloodSugarRecords: [],
  mealRecords: [],
  insulinRecords: [],
  isLoading: true,

  addBloodSugar: (r) => {
    const record: BloodSugarRecord = { ...r, id: genId() };
    set((state) => ({
      bloodSugarRecords: [record, ...state.bloodSugarRecords],
    }));
    const { bloodSugarRecords } = get();
    saveAllRecords({ bloodSugar: bloodSugarRecords });
  },

  addMeal: (r) => {
    const record: MealRecord = { ...r, id: genId() };
    set((state) => ({
      mealRecords: [record, ...state.mealRecords],
    }));
    const { mealRecords } = get();
    saveAllRecords({ meals: mealRecords });
  },

  addInsulin: (r) => {
    const record: InsulinRecord = { ...r, id: genId() };
    set((state) => ({
      insulinRecords: [record, ...state.insulinRecords],
    }));
    const { insulinRecords } = get();
    saveAllRecords({ insulin: insulinRecords });
  },

  removeBloodSugar: (id) => {
    set((state) => ({
      bloodSugarRecords: state.bloodSugarRecords.filter((r) => r.id !== id),
    }));
    const { bloodSugarRecords } = get();
    saveAllRecords({ bloodSugar: bloodSugarRecords });
  },

  removeMeal: (id) => {
    set((state) => ({
      mealRecords: state.mealRecords.filter((r) => r.id !== id),
    }));
    const { mealRecords } = get();
    saveAllRecords({ meals: mealRecords });
  },

  removeInsulin: (id) => {
    set((state) => ({
      insulinRecords: state.insulinRecords.filter((r) => r.id !== id),
    }));
    const { insulinRecords } = get();
    saveAllRecords({ insulin: insulinRecords });
  },

  clearAll: () => {
    set({
      bloodSugarRecords: [],
      mealRecords: [],
      insulinRecords: [],
    });
    saveAllRecords({ bloodSugar: [], meals: [], insulin: [] });
  },

  getTodayRecords: () => {
    const state = get();
    return {
      bloodSugar: state.bloodSugarRecords.filter((r) => isToday(r.timestamp)),
      meals: state.mealRecords.filter((r) => isToday(r.timestamp)),
      insulin: state.insulinRecords.filter((r) => isToday(r.timestamp)),
    };
  },

  getRecordsByDateRange: (days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return get().bloodSugarRecords.filter((r) => r.timestamp >= cutoff);
  },

  getDailySummaries: (days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const records = get().bloodSugarRecords.filter((r) => r.timestamp >= cutoff);
    const meals = get().mealRecords.filter((r) => r.timestamp >= cutoff);
    const insulin = get().insulinRecords.filter((r) => r.timestamp >= cutoff);
    const grouped: Record<string, BloodSugarRecord[]> = {};
    for (const r of records) {
      const key = getDateKey(r.timestamp);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(r);
    }
    const summaries: DailySummary[] = [];
    for (const [date, items] of Object.entries(grouped)) {
      const values = items.map((i) => i.value);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const inRange = items.filter((i) => {
        const targets = GLUCOSE_TARGETS[i.type] || GLUCOSE_TARGETS.random;
        return isInRange(i.value, targets.min, targets.max);
      }).length;
      const dayMeals = meals.filter((m) => getDateKey(m.timestamp) === date);
      const dayInsulin = insulin.filter((i) => getDateKey(i.timestamp) === date);
      summaries.push({
        date,
        avgGlucose: parseFloat(avg.toFixed(1)),
        minGlucose: min,
        maxGlucose: max,
        inRangeCount: inRange,
        totalCount: items.length,
        inRangeRate: parseFloat(((inRange / items.length) * 100).toFixed(1)),
        totalCarbs: dayMeals.reduce((s, m) => s + m.totalCarbs, 0),
        insulinDoses: dayInsulin.reduce((s, i) => s + i.dose, 0),
      });
    }
    summaries.sort((a, b) => a.date.localeCompare(b.date));
    return summaries;
  },

  loadFromStorage: async () => {
    set({ isLoading: true });
    const bs = (await loadRecords('bloodSugar')) as BloodSugarRecord[];
    const ml = (await loadRecords('meals')) as MealRecord[];
    const ins = (await loadRecords('insulin')) as InsulinRecord[];
    set({
      bloodSugarRecords: bs,
      mealRecords: ml,
      insulinRecords: ins,
      isLoading: false,
    });
  },
}));