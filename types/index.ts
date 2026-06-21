export type BloodSugarType = 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type InsulinType = 'rapid' | 'long_acting' | 'premixed';
export type GlucoseLevel = 'low' | 'normal' | 'high';
export type AppTheme = 'light' | 'dark' | 'system';

export interface BloodSugarRecord {
  id: string;
  value: number;
  type: BloodSugarType;
  timestamp: Date;
  note?: string;
}

export interface FoodItem {
  name: string;
  carbs: number;
  amount?: string;
}

export interface MealRecord {
  id: string;
  type: MealType;
  foods: FoodItem[];
  totalCarbs: number;
  timestamp: Date;
  photo?: string;
  note?: string;
}

export interface InsulinRecord {
  id: string;
  type: InsulinType;
  dose: number;
  timestamp: Date;
  note?: string;
}

export interface DailySummary {
  date: string;
  avgGlucose: number;
  minGlucose: number;
  maxGlucose: number;
  inRangeCount: number;
  totalCount: number;
  inRangeRate: number;
  totalCarbs: number;
  insulinDoses: number;
}

export interface UserSettings {
  theme: AppTheme;
  glucoseUnit: 'mmol/L' | 'mg/dL';
  targetRange: {
    fasting: { min: number; max: number };
    beforeMeal: { min: number; max: number };
    afterMeal: { min: number; max: number };
    bedtime: { min: number; max: number };
  };
  reminders: {
    enabled: boolean;
    times: { type: BloodSugarType; hour: number; minute: number }[];
  };
}

export interface TimeRange {
  label: string;
  start: string;
  end: string;
}
