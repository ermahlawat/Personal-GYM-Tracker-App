// ProfileSelectScreen — Screen 2 of onboarding.
// Shows PM and VC as selectable profile cards.
// Sets activeProfileId in the store when one is chosen.

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
import { useProfileStore } from '../../store/profileStore';
import { AppButton } from '../../components/common/AppButton';
import { darkTheme } from '../../theme/dark';
import { StepDots } from './components/StepDots';

// Onboarding always uses dark theme
const theme = darkTheme;

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function ProfileSelectScreen({ navigation }: Props) {
  const { profiles, setActiveProfile } = useProfileStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedId) return;
    setActiveProfile(selectedId);
    navigation.navigate('Name');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <StepDots total={5} current={1} />

        <Text style={styles.heading}>Who is setting up?</Text>
        <Text style={styles.sub}>
          Each person gets their own profile, data and theme.
        </Text>

        {/* Profile cards */}
        <View style={styles.cardsContainer}>
          {profiles.map((profile) => {
            const isSelected = selectedId === profile.id;
            const isPink = profile.theme === 'pink';

            return (
              <TouchableOpacity
                key={profile.id}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                  isSelected && isPink && styles.cardSelectedPink,
                ]}
                onPress={() => setSelectedId(profile.id)}
                activeOpacity={0.85}
              >
                {/* Avatar circle */}
                <View
                  style={[
                    styles.avatar,
                    isPink
                      ? styles.avatarPink
                      : styles.avatarDark,
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarText,
                      isPink
                        ? styles.avatarTextPink
                        : styles.avatarTextDark,
                    ]}
                  >
                    {profile.abbreviatedName}
                  </Text>
                </View>

                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileGoal}>
                  {profile.goal === 'muscle'
                    ? 'Muscle gain'
                    : profile.goal === 'weight_loss'
                    ? 'Weight loss'
                    : 'General fitness'}
                </Text>

                {/* Selection indicator */}
                {isSelected && (
                  <View
                    style={[
                      styles.selectedDot,
                      isPink && styles.selectedDotPink,
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <AppButton
          label="Continue"
          onPress={handleContinue}
          disabled={!selectedId}
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
    marginBottom: 36,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  card: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: theme.border,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  cardSelected: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },
  cardSelectedPink: {
    borderColor: '#D4537E',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarDark: {
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#444444',
  },
  avatarPink: {
    backgroundColor: '#F4C0D1',
    borderWidth: 1,
    borderColor: '#D4537E',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '500',
  },
  avatarTextDark: {
    color: '#FFFFFF',
  },
  avatarTextPink: {
    color: '#72243E',
  },
  profileName: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  profileGoal: {
    fontSize: 10,
    color: '#555555',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  selectedDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  selectedDotPink: {
    backgroundColor: '#D4537E',
  },
  cta: {
    width: '100%',
    marginTop: 'auto',
  },
});
