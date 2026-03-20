// GoalScreen — Screen 5 and final screen of onboarding.
// User selects their fitness goal — this affects chart delta colours,
// workout emphasis, and how progress is framed throughout the app.
// On "Finish setup", marks onboarding as complete and transitions to
// the main tab navigator, which then renders in the correct theme.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProfileStore, GoalId } from '../../store/profileStore';
import { AppButton } from '../../components/common/AppButton';
import { darkTheme } from '../../theme/dark';
import { StepDots } from './components/StepDots';

const theme = darkTheme;

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

interface GoalOption {
  id: GoalId;
  title: string;
  description: string;
}

const GOALS: GoalOption[] = [
  {
    id: 'muscle',
    title: 'Build muscle',
    description: 'Track volume, PRs and progressive overload',
  },
  {
    id: 'weight_loss',
    title: 'Lose weight',
    description: 'Track weight trend, measurements and calorie target',
  },
  {
    id: 'general',
    title: 'General fitness',
    description: 'Balanced tracking across all metrics',
  },
];

export default function GoalScreen({ navigation }: Props) {
  const { activeProfileId, profiles, updateProfile, setOnboardingComplete } =
    useProfileStore();

  const profile = profiles.find((p) => p.id === activeProfileId);
  const [selectedGoal, setSelectedGoal] = useState<GoalId>(
    profile?.goal ?? 'muscle'
  );

  const handleFinish = () => {
    if (!activeProfileId) return;

    // Persist the chosen goal
    updateProfile(activeProfileId, { goal: selectedGoal });

    // Mark onboarding as complete — RootNavigator will switch to TabNavigator
    setOnboardingComplete(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <StepDots total={5} current={4} />

        <Text style={styles.heading}>What is your goal?</Text>
        <Text style={styles.sub}>
          This shapes how we display your progress data.
        </Text>

        <View style={styles.optionsList}>
          {GOALS.map((goal) => {
            const isSelected = selectedGoal === goal.id;
            return (
              <TouchableOpacity
                key={goal.id}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => setSelectedGoal(goal.id)}
                activeOpacity={0.85}
              >
                {/* Selection indicator circle */}
                <View
                  style={[
                    styles.radio,
                    isSelected && styles.radioSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>

                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{goal.title}</Text>
                  <Text style={styles.optionDesc}>{goal.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <AppButton
          label="Finish setup"
          onPress={handleFinish}
          style={styles.cta}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: '500',
    color: theme.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  sub: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 32,
  },
  optionsList: {
    flex: 1,
    gap: 10,
    marginBottom: 40,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.surface,
    borderWidth: 0.5,
    borderColor: theme.border,
    borderRadius: 10,
    padding: 16,
  },
  optionSelected: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
    backgroundColor: '#1A1A1A',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#444444',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioSelected: {
    borderColor: '#FFFFFF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textPrimary,
    marginBottom: 3,
  },
  optionDesc: {
    fontSize: 11,
    color: '#555555',
    lineHeight: 16,
  },
  cta: {
    width: '100%',
  },
});
