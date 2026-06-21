import { BloodSugarType } from '../types';

export const GLUCOSE_TARGETS: Record<BloodSugarType, { min: number; max: number }> = {
  fasting: { min: 3.9, max: 6.1 },
  before_meal: { min: 3.9, max: 7.2 },
  after_meal: { min: 3.9, max: 10.0 },
  bedtime: { min: 3.9, max: 8.3 },
  random: { min: 3.9, max: 11.1 },
};

export const COLORS = {
  primary: '#0EA5E9',
  secondary: '#6366F1',
  warning: '#F59E0B',
  danger: '#EF4444',
  success: '#22C55E',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  text: '#0F172A',
  muted: '#94A3B8',
  border: '#E2E8F0',
};

export const MEAL_CARB_RANGES: Record<string, { min: number; max: number }> = {
  breakfast: { min: 30, max: 60 },
  lunch: { min: 45, max: 75 },
  dinner: { min: 45, max: 75 },
  snack: { min: 10, max: 30 },
};

export const TARGET_HBA1C_RANGE = { min: 4.0, max: 7.0 };
