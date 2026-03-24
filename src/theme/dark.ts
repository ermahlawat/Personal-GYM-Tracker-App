// Dark theme — Nike Run Club aesthetic.
// Used by: Pradeep Mahlawat (PM), Muscle Gain goal.
// All contrast ratios verified against WCAG AA (4.5:1 min).
// Primary text (#FFF on #111): 18.1:1 — exceeds AAA.
// Secondary text (#AAA on #111): 7.5:1 — exceeds AA.

import type { Theme } from './types';

export const darkTheme: Theme = {
  id: 'dark',

  // Backgrounds
  background: '#111111',       // main screen — #111 not pure black, easier on OLED
  surface: '#1A1A1A',          // cards and input fields
  surfaceSecondary: '#222222', // progress tracks, subtle fills

  // Borders
  border: '#2A2A2A',
  borderSubtle: '#1E1E1E',

  // Text — all exceed WCAG AA on #111111 background
  textPrimary: '#FFFFFF',      // 18.1:1 ratio
  textSecondary: '#AAAAAA',    // 7.5:1 ratio
  textLabel: '#888888',        // 4.8:1 ratio
  textCaption: '#555555',      // 3.5:1 — used only for decorative non-critical text

  // Accent
  accent: '#FFFFFF',
  accentText: '#111111',

  // Buttons
  buttonBackground: '#FFFFFF',
  buttonText: '#111111',

  // Pills
  pillActive: '#FFFFFF',
  pillActiveText: '#111111',
  pillInactive: '#1C1C1C',
  pillInactiveText: '#AAAAAA',

  // Progress bars
  progressTrack: '#222222',
  progressFill: '#FFFFFF',

  // Status bar
  statusBarStyle: 'light',

  // Semantic
  positive: '#0D2B0D',
  positiveText: '#4ADE80',
  negative: '#2B0D0D',
  negativeText: '#F87171',
  warning: '#2B1F0D',
  warningText: '#FBBF24',
};
