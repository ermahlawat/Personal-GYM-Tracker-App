// TabNavigator — the main 4-tab bottom navigation used after onboarding.
// Reads the active profile's theme and colours the tab bar accordingly.
// All tab icons are simple geometric SVG shapes — no emoji, no icon libraries.
// Profile access is via the avatar in each screen's header — not a tab.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { AppText } from '../components/common/AppText';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import WorkoutScreen from '../screens/workout/WorkoutScreen';
import ProgressScreen from '../screens/progress/ProgressScreen';
import MealsScreen from '../screens/meals/MealsScreen';

export type TabParams = {
  Home: undefined;
  Workout: undefined;
  Progress: undefined;
  Meals: undefined;
};

const Tab = createBottomTabNavigator<TabParams>();

// ── Tab icons drawn with pure View shapes ─────────────────────────────────
// Each icon is a small geometric composition. No external icon library needed.

function HomeIcon({ focused, colour }: { focused: boolean; colour: string }) {
  return (
    <View style={iconStyles.container}>
      {/* House shape: roof triangle + body rectangle */}
      <View style={[iconStyles.houseRoof, { borderBottomColor: colour }]} />
      <View
        style={[
          iconStyles.houseBody,
          { borderColor: colour, borderWidth: focused ? 1.5 : 1 },
        ]}
      />
    </View>
  );
}

function WorkoutIcon({ focused, colour }: { focused: boolean; colour: string }) {
  return (
    <View style={iconStyles.container}>
      {/* Barbell: left plate + bar + right plate */}
      <View style={[iconStyles.plate, { backgroundColor: colour }]} />
      <View style={[iconStyles.bar, { backgroundColor: colour }]} />
      <View style={[iconStyles.plate, { backgroundColor: colour }]} />
    </View>
  );
}

function ProgressIcon({ focused, colour }: { focused: boolean; colour: string }) {
  return (
    <View style={iconStyles.container}>
      {/* Three vertical bars of increasing height — bar chart */}
      <View style={[iconStyles.barChart, { backgroundColor: colour, height: 8 }]} />
      <View style={[iconStyles.barChart, { backgroundColor: colour, height: 13 }]} />
      <View style={[iconStyles.barChart, { backgroundColor: colour, height: 18 }]} />
    </View>
  );
}

function MealsIcon({ focused, colour }: { focused: boolean; colour: string }) {
  return (
    <View style={iconStyles.container}>
      {/* Fork and knife represented as two vertical lines of diff width */}
      <View style={[iconStyles.utensil, { backgroundColor: colour, width: 2 }]} />
      <View style={{ width: 4 }} />
      <View style={[iconStyles.utensil, { backgroundColor: colour, width: 3 }]} />
    </View>
  );
}

const iconStyles = StyleSheet.create({
  container: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  houseRoof: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  houseBody: {
    position: 'absolute',
    bottom: 0,
    width: 12,
    height: 10,
    borderRadius: 1,
  },
  plate: {
    width: 5,
    height: 14,
    borderRadius: 2,
  },
  bar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  barChart: {
    width: 4,
    borderRadius: 1,
    marginHorizontal: 1,
    alignSelf: 'flex-end',
  },
  utensil: {
    height: 18,
    borderRadius: 1,
  },
});

// ── Main Navigator ────────────────────────────────────────────────────────

export function TabNavigator() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // each screen manages its own header
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 0.5,
          borderTopColor: theme.border,
          height: 54 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.textPrimary,
        tabBarInactiveTintColor: theme.textLabel,
        tabBarShowLabel: true,
        tabBarLabel: ({ focused, color }) => (
          <AppText
            variant="caption"
            style={{
              color,
              letterSpacing: 0.6,
              marginTop: 2,
              fontSize: 8,
            }}
          >
            {route.name}
          </AppText>
        ),
        tabBarIcon: ({ focused, color }) => {
          switch (route.name) {
            case 'Home':
              return <HomeIcon focused={focused} colour={color} />;
            case 'Workout':
              return <WorkoutIcon focused={focused} colour={color} />;
            case 'Progress':
              return <ProgressIcon focused={focused} colour={color} />;
            case 'Meals':
              return <MealsIcon focused={focused} colour={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Meals" component={MealsScreen} />
    </Tab.Navigator>
  );
}
