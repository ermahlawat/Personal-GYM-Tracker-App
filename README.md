# VCxPM Fitness

Personal fitness tracking app for Pradeep Mahlawat (PM) and Vishali Choudhary (VC).

Built with React Native + Expo. Android first. Local SQLite storage. No backend.

---

## Setting up in GitHub Codespaces

### Step 1 — Create the repository

1. Go to github.com and sign in
2. Click the + icon (top right) → New repository
3. Name it: vcxpm-fitness
4. Set to Private
5. Click Create repository

### Step 2 — Upload all files

1. On the repository page, click Add file → Upload files
2. Drag and drop the entire vcxpm-fitness folder
3. Click Commit changes

### Step 3 — Open in Codespaces

1. On the repository page, click the green Code button
2. Click the Codespaces tab
3. Click Create codespace on main
4. Wait ~2 minutes for the environment to load (VS Code opens in the browser)

### Step 4 — Install dependencies

In the Codespaces terminal (bottom panel), run:

```
npm install
```

Wait for all packages to install (~1-2 minutes).

### Step 5 — Install Expo Go on your Android phone

Search for Expo Go on the Google Play Store and install it.
It is free. No account needed to scan and preview.

### Step 6 — Start the development server

In the Codespaces terminal, run:

```
npx expo start --tunnel
```

The --tunnel flag is required in Codespaces so your phone can connect
even though the code is running in a cloud container, not on your local machine.

### Step 7 — Open on your phone

A QR code appears in the terminal.
Open Expo Go on your Android phone.
Tap Scan QR code and scan it.
VCxPM Fitness loads on your phone within a few seconds.

---

## File structure

```
App.tsx                          — root entry point
src/
  theme/
    dark.ts                      — Nike dark theme (Pradeep / PM)
    pink.ts                      — Pink light theme (Vishali / VC)
    clean.ts                     — Clean light theme (shared)
    useTheme.ts                  — hook used by every component
    types.ts                     — Theme interface
    index.ts                     — barrel export
  store/
    profileStore.ts              — Zustand store for both profiles
  navigation/
    RootNavigator.tsx            — onboarding vs main app decision
    OnboardingNavigator.tsx      — 5-screen onboarding stack
    TabNavigator.tsx             — 4-tab bottom navigation
  components/
    common/
      AppButton.tsx              — primary button component
      AppText.tsx                — typography component
  screens/
    onboarding/
      WelcomeScreen.tsx          — Screen 1: hero copy
      ProfileSelectScreen.tsx    — Screen 2: PM or VC
      NameScreen.tsx             — Screen 3: name, age, height
      PhotoScreen.tsx            — Screen 4: profile photo
      GoalScreen.tsx             — Screen 5: fitness goal
      components/
        StepDots.tsx             — progress dots for onboarding
    home/
      HomeScreen.tsx             — main dashboard
    workout/
      WorkoutScreen.tsx          — day planner + exercise selector
    progress/
      ProgressScreen.tsx         — body / photos / charts sub-nav
    meals/
      MealsScreen.tsx            — 5-slot daily meal planner
  data/
    exercises.ts                 — 120 exercises database
```

---

## What is built in this session (v1.0)

- Full onboarding flow (5 screens, dark theme, step dots)
- Both profiles pre-seeded: Pradeep Mahlawat (PM) and Vishali Choudhary (VC)
- Three themes: Nike dark, pink light, clean light
- Theme engine via useTheme() hook — zero hardcoded colours in components
- 4-tab navigation: Home, Workout, Progress, Meals
- Home screen with greeting, today's plan, streak, weekly grid, quick stats
- Workout tab with all 10 category pills and full 120-exercise database
- Progress tab with Body / Photos / Charts sub-navigation
- Meals tab with 5 slots, macro totals banner, expand/collapse per slot
- Session state persisted via AsyncStorage (onboarding complete, active profile)

---

## What comes next (next coding session)

- SQLite database setup and schema creation
- Active workout session screen (logging sets, reps, weight per exercise)
- Swap bottom sheet (intelligent alternatives via swapGroup)
- Exercise detail drawer (description, steps, SVG illustration)
- Rest timer (background, vibration on complete)
- Body measurement saving to SQLite
- Real chart rendering with Victory Native XL
- Progress photo upload and comparison view
- Profile drawer (change photo, name, theme, switch profile)

---

## Profiles

| Field         | Pradeep Mahlawat | Vishali Choudhary |
|---------------|-----------------|-------------------|
| ID            | pm              | vc                |
| Abbreviated   | PM              | VC                |
| Goal          | Muscle gain     | Weight loss       |
| Theme         | Nike dark       | Pink light        |

---

## Units (locked, never change these)

- Body weight: kg only
- Exercise weight: kg only
- Measurements: cm primary, inches always in brackets — 81 cm (31.9 in)
- Height: cm only
- Distance: km only
