import { BloodSugarRecord, MealRecord, InsulinRecord } from '../types';

const STORAGE_KEYS = {
  bloodSugar: '@glucoflow/blood_sugar',
  meals: '@glucoflow/meals',
  insulin: '@glucoflow/insulin',
};

const memoryStore: {
  bloodSugar: BloodSugarRecord[];
  meals: MealRecord[];
  insulin: InsulinRecord[];
} = {
  bloodSugar: [],
  meals: [],
  insulin: [],
};

export async function saveRecords(
  key: 'bloodSugar' | 'meals' | 'insulin',
  records: BloodSugarRecord[] | MealRecord[] | InsulinRecord[],
): Promise<void> {
  memoryStore[key] = records as any;
}

export async function loadRecords(
  key: 'bloodSugar' | 'meals' | 'insulin',
): Promise<BloodSugarRecord[] | MealRecord[] | InsulinRecord[]> {
  return memoryStore[key] || [];
}

export async function saveAllRecords(data: {
  bloodSugar?: BloodSugarRecord[];
  meals?: MealRecord[];
  insulin?: InsulinRecord[];
}): Promise<void> {
  if (data.bloodSugar) memoryStore.bloodSugar = data.bloodSugar;
  if (data.meals) memoryStore.meals = data.meals;
  if (data.insulin) memoryStore.insulin = data.insulin;
}
