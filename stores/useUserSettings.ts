import { create } from 'zustand';

interface UserSettingsState {
  userName: string;
  targetMin: number;
  targetMax: number;
  setUserName: (name: string) => void;
  setTargetMin: (val: number) => void;
  setTargetMax: (val: number) => void;
  clearAll: () => void;
}

export const useUserSettings = create<UserSettingsState>((set) => ({
  userName: '',
  targetMin: 3.9,
  targetMax: 10.0,
  setUserName: (name) => set({ userName: name }),
  setTargetMin: (val) => set({ targetMin: val }),
  setTargetMax: (val) => set({ targetMax: val }),
  clearAll: () => set({ userName: '', targetMin: 3.9, targetMax: 10.0 }),
}));