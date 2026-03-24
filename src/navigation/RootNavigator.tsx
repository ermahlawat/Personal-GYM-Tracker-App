import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useProfileStore } from '../store/profileStore';
import { OnboardingNavigator } from './OnboardingNavigator';
import { TabNavigator } from './TabNavigator';
import ProfileDrawerScreen from '../screens/profile/ProfileDrawerScreen';
import WorkoutHistoryScreen from '../screens/workout/WorkoutHistoryScreen';

const ONBOARDING_KEY = 'vcxpm_onboarding_complete';
const ACTIVE_PROFILE_KEY = 'vcxpm_active_profile';
const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { onboardingComplete, setOnboardingComplete, setActiveProfile } = useProfileStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [savedOnboarding, savedProfile] = await Promise.all([
          AsyncStorage.getItem(ONBOARDING_KEY),
          AsyncStorage.getItem(ACTIVE_PROFILE_KEY),
        ]);
        if (savedOnboarding === 'true') setOnboardingComplete(true);
        if (savedProfile) setActiveProfile(savedProfile);
      } catch (error) {
        console.warn('Session restore failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  useEffect(() => {
    if (onboardingComplete) {
      AsyncStorage.setItem(ONBOARDING_KEY, 'true').catch(console.warn);
    }
  }, [onboardingComplete]);

  const { activeProfileId } = useProfileStore();
  useEffect(() => {
    if (activeProfileId) {
      AsyncStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId).catch(console.warn);
    }
  }, [activeProfileId]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A1628', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#4A9EFF" size="small" />
      </View>
    );
  }

  if (!onboardingComplete) {
    return (
      <NavigationContainer>
        <OnboardingNavigator />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="ProfileDrawer"
          component={ProfileDrawerScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="WorkoutHistory"
          component={WorkoutHistoryScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
