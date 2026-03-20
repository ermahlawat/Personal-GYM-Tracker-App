// OnboardingNavigator — manages the 5-screen onboarding stack.
// No header shown — each screen handles its own back navigation visually.
// Screens are in strict sequence: Welcome > ProfileSelect > Name > Photo > Goal

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import ProfileSelectScreen from '../screens/onboarding/ProfileSelectScreen';
import NameScreen from '../screens/onboarding/NameScreen';
import PhotoScreen from '../screens/onboarding/PhotoScreen';
import GoalScreen from '../screens/onboarding/GoalScreen';

export type OnboardingStackParams = {
  Welcome: undefined;
  ProfileSelect: undefined;
  Name: undefined;
  Photo: undefined;
  Goal: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParams>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,         // all screens are fully custom — no system header
        animation: 'slide_from_right',
        gestureEnabled: true,       // swipe back works on all screens except Welcome
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ gestureEnabled: false }} // no going back from the first screen
      />
      <Stack.Screen name="ProfileSelect" component={ProfileSelectScreen} />
      <Stack.Screen name="Name" component={NameScreen} />
      <Stack.Screen name="Photo" component={PhotoScreen} />
      <Stack.Screen name="Goal" component={GoalScreen} />
    </Stack.Navigator>
  );
}
