import { useProfileStore } from '../store/profileStore';
import { obsidianTheme } from './obsidian';
import { pearlTheme } from './pearl';
import { slateTheme } from './slate';
import { chalkTheme } from './chalk';
import type { Theme } from './types';

export const useTheme = (): Theme => {
  const { activeProfileId, profiles } = useProfileStore();
  const profile = profiles.find((p) => p.id === activeProfileId);
  if (!profile) return obsidianTheme;
  switch (profile.theme) {
    case 'blue':  return obsidianTheme;
    case 'pink':  return pearlTheme;
    case 'dark':  return slateTheme;
    case 'clean': return chalkTheme;
    default:      return obsidianTheme;
  }
};
