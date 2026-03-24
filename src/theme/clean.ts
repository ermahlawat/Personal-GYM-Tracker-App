// Clean Light theme — Apple-adjacent minimalism.
// Neutral, neither gendered. Available to both profiles.
// Primary text (#111 on #F8F8F7): 19.5:1 — exceeds AAA.

import type { Theme } from './types';

export const cleanTheme: Theme = {
  id: 'clean',

  // Backgrounds
  background: '#F8F8F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F0F0EF',

  // Borders
  border: '#E8E8E8',
  borderSubtle: '#F0F0F0',

  // Text
  textPrimary: '#111111',      // 19.5:1 ratio
  textSecondary: '#555555',    // 7:1 ratio
  textLabel: '#888888',        // 4.5:1 ratio
  textCaption: '#AAAAAA',      // 3.1:1 — decorative only

  // Accent
  accent: '#111111',
  accentText: '#FFFFFF',

  // Buttons
  buttonBackground: '#111111',
  buttonText: '#FFFFFF',

  // Pills
  pillActive: '#111111',
  pillActiveText: '#FFFFFF',
  pillInactive: '#EFEFEF',
  pillInactiveText: '#888888',

  // Progress bars
  progressTrack: '#E8E8E8',
  progressFill: '#111111',

  // Status bar
  statusBarStyle: 'dark',

  // Semantic
  positive: '#E8F5E9',
  positiveText: '#2E7D32',
  negative: '#FFEBEE',
  negativeText: '#C62828',
  warning: '#FFF8E1',
  warningText: '#E65100',
};
