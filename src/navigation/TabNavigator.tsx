import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { AppText } from '../components/common/AppText';
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

function HomeIcon({ colour }: { colour: string }) {
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', bottom: 0, width: 12, height: 10, borderRadius: 1, borderWidth: 1.5, borderColor: colour }} />
      <View style={{ position: 'absolute', top: 0, width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: colour }} />
    </View>
  );
}

function WorkoutIcon({ colour }: { colour: string }) {
  return (
    <View style={{ width: 22, height: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 5, height: 14, borderRadius: 2, backgroundColor: colour }} />
      <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: colour, marginHorizontal: 1 }} />
      <View style={{ width: 5, height: 14, borderRadius: 2, backgroundColor: colour }} />
    </View>
  );
}

function ProgressIcon({ colour }: { colour: string }) {
  return (
    <View style={{ width: 22, height: 22, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 3 }}>
      <View style={{ width: 4, height: 8, borderRadius: 1, backgroundColor: colour }} />
      <View style={{ width: 4, height: 13, borderRadius: 1, backgroundColor: colour }} />
      <View style={{ width: 4, height: 18, borderRadius: 1, backgroundColor: colour }} />
    </View>
  );
}

function MealsIcon({ colour }: { colour: string }) {
  return (
    <View style={{ width: 22, height: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
      <View style={{ width: 2, height: 18, borderRadius: 1, backgroundColor: colour }} />
      <View style={{ width: 3, height: 18, borderRadius: 1, backgroundColor: colour }} />
    </View>
  );
}

export function TabNavigator() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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
        tabBarLabel: ({ color }) => (
          <AppText variant="caption" style={{ color, letterSpacing: 0.6, marginTop: 2, fontSize: 8 }}>
            {route.name}
          </AppText>
        ),
        tabBarIcon: ({ color }) => {
          switch (route.name) {
            case 'Home':     return <HomeIcon colour={color} />;
            case 'Workout':  return <WorkoutIcon colour={color} />;
            case 'Progress': return <ProgressIcon colour={color} />;
            case 'Meals':    return <MealsIcon colour={color} />;
            default:         return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home"     component={HomeScreen} />
      <Tab.Screen name="Workout"  component={WorkoutScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Meals"    component={MealsScreen} />
    </Tab.Navigator>
  );
}
