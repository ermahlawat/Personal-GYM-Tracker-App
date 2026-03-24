// useTheme — the single hook every component uses to get colours.
// No component ever imports a theme file directly.
// All styling reads from this hook's return value.

import { useProfileStore } from '../store/profileStore';
import { darkTheme } from './dark';
import { blueTheme } from './blue';
import { pinkTheme } from './pink';
import { cleanTheme } from './clean';
import type { Theme } from './types';

export const useTheme = (): Theme => {
  const { activeProfileId, profiles } = useProfileStore();
  const profile = profiles.find((p) => p.id === activeProfileId);

  if (!profile) return blueTheme;

  switch (profile.theme) {
    case 'blue':
      return blueTheme;
    case 'pink':
      return pinkTheme;
    case 'clean':
      return cleanTheme;
    case 'dark':
      return darkTheme;
    default:
      return blueTheme;
  }
};