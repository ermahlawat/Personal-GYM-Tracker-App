// RootNavigator — top-level routing decision.
// If onboarding is not complete → show OnboardingNavigator.
// If onboarding is complete → show TabNavigator (main app).
// This component also handles persisting onboarding state to AsyncStorage
// so the app remembers between sessions that setup is done.

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { useProfileStore } from '../store/profileStore';
import { OnboardingNavigator } from './OnboardingNavigator';
import { TabNavigator } from './TabNavigator';
import { useTheme } from '../theme';

const ONBOARDING_KEY = 'vcxpm_onboarding_complete';
const ACTIVE_PROFILE_KEY = 'vcxpm_active_profile';

export function RootNavigator() {
  const { onboardingComplete, setOnboardingComplete, setActiveProfile } =
    useProfileStore();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  // On mount: check AsyncStorage to see if onboarding was already completed
  // in a previous session. If yes, restore state silently.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [savedOnboarding, savedProfile] = await Promise.all([
          AsyncStorage.getItem(ONBOARDING_KEY),
          AsyncStorage.getItem(ACTIVE_PROFILE_KEY),
        ]);

        if (savedOnboarding === 'true') {
          setOnboardingComplete(true);
        }
        if (savedProfile) {
          setActiveProfile(savedProfile);
        }
      } catch (error) {
        // AsyncStorage read failed — safe to continue, user re-onboards
        console.warn('Session restore failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Persist onboarding completion and active profile whenever they change
  useEffect(() => {
    if (onboardingComplete) {
      AsyncStorage.setItem(ONBOARDING_KEY, 'true').catch(console.warn);
    }
  }, [onboardingComplete]);

  const { activeProfileId } = useProfileStore();
  useEffect(() => {
    if (activeProfileId) {
      AsyncStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId).catch(
        console.warn
      );
    }
  }, [activeProfileId]);

  // Show a dark loading screen while restoring session — prevents flash
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#111111',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color="#FFFFFF" size="small" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {onboardingComplete ? <TabNavigator /> : <OnboardingNavigator />}
    </NavigationContainer>
  );
}
