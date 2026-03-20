// Theme type definition shared across all three themes.
// Every colour value in the app must come from this interface
// via the useTheme() hook — never hardcoded in a component.

export type ThemeId = 'dark' | 'pink' | 'clean';

export interface Theme {
  id: ThemeId;

  // ── Backgrounds ──────────────────────────────────────
  background: string;       // main screen background
  surface: string;          // cards, inputs, elevated surfaces
  surfaceSecondary: string; // progress bar track, subtle fills

  // ── Borders ──────────────────────────────────────────
  border: string;           // card borders, dividers
  borderSubtle: string;     // very faint separators

  // ── Text ─────────────────────────────────────────────
  textPrimary: string;      // main numbers and headings — must exceed 7:1 contrast
  textSecondary: string;    // body text, descriptions
  textLabel: string;        // uppercase labels, captions
  textCaption: string;      // smallest, most subdued text

  // ── Accent ───────────────────────────────────────────
  accent: string;           // primary action colour
  accentText: string;       // text that sits ON the accent colour

  // ── Buttons ──────────────────────────────────────────
  buttonBackground: string;
  buttonText: string;

  // ── Pills (sub-navigation, filters) ──────────────────
  pillActive: string;
  pillActiveText: string;
  pillInactive: string;
  pillInactiveText: string;

  // ── Progress bars ────────────────────────────────────
  progressTrack: string;
  progressFill: string;

  // ── Status bar ───────────────────────────────────────
  statusBarStyle: 'light' | 'dark';

  // ── Semantic colours ─────────────────────────────────
  // Used for delta indicators on measurements and goal progress.
  // Goal-aware logic lives in the component, not the theme.
  positive: string;         // improvement background
  positiveText: string;     // improvement text
  negative: string;         // regression background
  negativeText: string;     // regression text
  warning: string;          // caution background
  warningText: string;      // caution text
}
