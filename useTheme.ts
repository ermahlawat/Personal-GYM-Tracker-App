// useTheme — the single hook every component uses to get colours.
// No component ever imports a theme file directly.
// All styling reads from this hook's return value.

import { useProfileStore } from '../store/profileStore';
import { darkTheme } from './dark';
import { pinkTheme } from './pink';
import { cleanTheme } from './clean';
import type { Theme } from './types';

export const useTheme = (): Theme => {
  const { activeProfileId, profiles } = useProfileStore();

  // Find the active profile — fall back to dark if nothing is set
  const profile = profiles.find((p) => p.id === activeProfileId);

  if (!profile) return darkTheme;

  switch (profile.theme) {
    case 'pink':
      return pinkTheme;
    case 'clean':
      return cleanTheme;
    case 'dark':
    default:
      return darkTheme;
  }
};
