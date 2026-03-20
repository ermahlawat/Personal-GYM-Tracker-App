// profileStore — Zustand store managing both user profiles.
// This is the central source of truth for who is logged in,
// what their goal is, and which theme to render.

import { create } from 'zustand';
import type { ThemeId } from '../theme/types';

export type GoalId = 'muscle' | 'weight_loss' | 'general';

export interface Profile {
  id: string;
  name: string;
  abbreviatedName: string; // PM or VC — used in space-constrained contexts
  goal: GoalId;
  theme: ThemeId;
  avatarPath?: string;     // local file path after photo is picked
  heightCm?: number;
  age?: number;
  createdAt: string;
}

interface ProfileState {
  profiles: Profile[];
  activeProfileId: string | null;
  onboardingComplete: boolean;

  // Actions
  setActiveProfile: (id: string) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
  setOnboardingComplete: (value: boolean) => void;
  getActiveProfile: () => Profile | undefined;
}

// Both profiles are pre-seeded so they appear on the profile select
// screen during onboarding without any extra setup step.
const DEFAULT_PROFILES: Profile[] = [
  {
    id: 'pm',
    name: 'Pradeep Mahlawat',
    abbreviatedName: 'PM',
    goal: 'muscle',
    theme: 'dark',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vc',
    name: 'Vishali Choudhary',
    abbreviatedName: 'VC',
    goal: 'weight_loss',
    theme: 'pink',
    createdAt: new Date().toISOString(),
  },
];

export const useProfileStore = create<ProfileState>((set, get) => ({
  profiles: DEFAULT_PROFILES,
  activeProfileId: null,
  onboardingComplete: false,

  setActiveProfile: (id) => set({ activeProfileId: id }),

  addProfile: (profile) =>
    set((state) => ({ profiles: [...state.profiles, profile] })),

  updateProfile: (id, updates) =>
    set((state) => ({
      profiles: state.profiles.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  setOnboardingComplete: (value) => set({ onboardingComplete: value }),

  getActiveProfile: () => {
    const { profiles, activeProfileId } = get();
    return profiles.find((p) => p.id === activeProfileId);
  },
}));
