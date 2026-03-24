// settingsStore — per-profile preferences including macro targets.
// Stored in AsyncStorage so they persist across app restarts.

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface ProfileSettings {
  macroTargets: MacroTargets;
  weightUnitKg: boolean;
  measurementUnitCm: boolean;
  restTimerSeconds: number;
}

const DEFAULT_SETTINGS: ProfileSettings = {
  macroTargets: {
    calories: 2000,
    proteinG: 150,
    carbsG: 200,
    fatG: 65,
  },
  weightUnitKg: true,
  measurementUnitCm: true,
  restTimerSeconds: 90,
};

const SETTINGS_KEY = (profileId: string) => `vcxpm_settings_${profileId}`;

interface SettingsState {
  settings: Record<string, ProfileSettings>;
  getSettings: (profileId: string) => ProfileSettings;
  updateMacroTargets: (profileId: string, targets: Partial<MacroTargets>) => Promise<void>;
  updateRestTimer: (profileId: string, seconds: number) => Promise<void>;
  loadSettings: (profileId: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {},

  getSettings: (profileId) => {
    return get().settings[profileId] ?? DEFAULT_SETTINGS;
  },

  updateMacroTargets: async (profileId, targets) => {
    const current = get().getSettings(profileId);
    const updated: ProfileSettings = {
      ...current,
      macroTargets: { ...current.macroTargets, ...targets },
    };
    set((state) => ({ settings: { ...state.settings, [profileId]: updated } }));
    try {
      await AsyncStorage.setItem(SETTINGS_KEY(profileId), JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  },

  updateRestTimer: async (profileId, seconds) => {
    const current = get().getSettings(profileId);
    const updated: ProfileSettings = { ...current, restTimerSeconds: seconds };
    set((state) => ({ settings: { ...state.settings, [profileId]: updated } }));
    try {
      await AsyncStorage.setItem(SETTINGS_KEY(profileId), JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  },

  loadSettings: async (profileId) => {
    try {
      const saved = await AsyncStorage.getItem(SETTINGS_KEY(profileId));
      if (saved) {
        const parsed: ProfileSettings = JSON.parse(saved);
        set((state) => ({ settings: { ...state.settings, [profileId]: parsed } }));
      }
    } catch (e) {
      console.warn('Failed to load settings:', e);
    }
  },
}));