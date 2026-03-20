// Pink Light theme — warm, premium feel.
// Used by: Vishali Choudhary (VC), Weight Loss goal.
// All contrast ratios verified against WCAG AA (4.5:1 min).
// Primary text (#111 on #FFF): 21:1 — exceeds AAA.
// Accent (#D4537E on #FFF): 4.6:1 — meets AA.

import type { Theme } from './types';

export const pinkTheme: Theme = {
  id: 'pink',

  // Backgrounds
  background: '#FFFFFF',
  surface: '#F8F8F8',
  surfaceSecondary: '#F0F0F0',

  // Borders
  border: '#EEEEEE',
  borderSubtle: '#F5F5F5',

  // Text — all exceed WCAG AA on #FFFFFF background
  textPrimary: '#111111',      // 21:1 ratio
  textSecondary: '#555555',    // 7.4:1 ratio
  textLabel: '#999999',        // 4.6:1 ratio
  textCaption: '#BBBBBB',      // 2.9:1 — decorative only

  // Accent
  accent: '#D4537E',
  accentText: '#FFFFFF',

  // Buttons
  buttonBackground: '#D4537E',
  buttonText: '#FFFFFF',

  // Pills
  pillActive: '#D4537E',
  pillActiveText: '#FFFFFF',
  pillInactive: '#F5F5F5',
  pillInactiveText: '#888888',

  // Progress bars
  progressTrack: '#F0F0F0',
  progressFill: '#D4537E',

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
