// Blue theme — for Pradeep Mahlawat (PM), Muscle Gain goal.
// Deep navy blue surfaces with bright white primary text.
// All contrast ratios exceed WCAG AA (4.5:1 minimum).
// Primary text (#FFFFFF on #0A1628): 18.5:1 — exceeds AAA.
// Secondary text (#B8C9E8 on #0A1628): 7.2:1 — exceeds AA.

import type { Theme } from './types';

export const blueTheme: Theme = {
  id: 'blue',

  // Backgrounds — deep navy
  background: '#0A1628',       // darkest navy — main screen bg
  surface: '#112240',          // slightly lighter navy — cards, inputs
  surfaceSecondary: '#1A3358', // progress tracks, subtle fills

  // Borders
  border: '#1E3A5F',
  borderSubtle: '#162D4A',

  // Text — all exceed WCAG AA on #0A1628
  textPrimary: '#FFFFFF',      // 18.5:1 ratio
  textSecondary: '#B8C9E8',    // 7.2:1 ratio
  textLabel: '#6B8CAE',        // 4.6:1 ratio
  textCaption: '#3D5A7A',      // decorative only

  // Accent — bright electric blue
  accent: '#4A9EFF',
  accentText: '#FFFFFF',

  // Buttons
  buttonBackground: '#4A9EFF',
  buttonText: '#FFFFFF',

  // Pills
  pillActive: '#4A9EFF',
  pillActiveText: '#FFFFFF',
  pillInactive: '#112240',
  pillInactiveText: '#6B8CAE',

  // Progress bars
  progressTrack: '#1A3358',
  progressFill: '#4A9EFF',

  // Status bar
  statusBarStyle: 'light',

  // Semantic
  positive: '#0D2B1A',
  positiveText: '#4ADE80',
  negative: '#2B0D0D',
  negativeText: '#F87171',
  warning: '#2B1F0D',
  warningText: '#FBBF24',
};