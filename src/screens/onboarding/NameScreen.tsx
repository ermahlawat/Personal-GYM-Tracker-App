// NameScreen — Screen 3 of onboarding.
// Collects name (keyboard), age (spinner), height in cm (spinner).
// All three on one screen — but visually separated so it feels light.
// Pre-fills known values from the selected profile (Pradeep or Vishali).

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProfileStore } from '../../store/profileStore';
import { AppButton } from '../../components/common/AppButton';
import { obsidianTheme as darkTheme } from '../../theme/obsidian';
import { StepDots } from './components/StepDots';

const theme = darkTheme;

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

// Spinner — tap + / - to increment a numeric value within bounds
interface SpinnerProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  unit: string;
}

function Spinner({ value, onIncrement, onDecrement, unit }: SpinnerProps) {
  return (
    <View style={styles.spinnerRow}>
      <TouchableOpacity
        style={styles.spinnerBtn}
        onPress={onDecrement}
        activeOpacity={0.7}
      >
        <Text style={styles.spinnerBtnText}>-</Text>
      </TouchableOpacity>

      <View style={styles.spinnerValueBox}>
        <Text style={styles.spinnerValue}>{value}</Text>
        <Text style={styles.spinnerUnit}>{unit}</Text>
      </View>

      <TouchableOpacity
        style={styles.spinnerBtn}
        onPress={onIncrement}
        activeOpacity={0.7}
      >
        <Text style={styles.spinnerBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function NameScreen({ navigation }: Props) {
  const { activeProfileId, profiles, updateProfile } = useProfileStore();
  const profile = profiles.find((p) => p.id === activeProfileId);

  // Pre-fill name from the selected profile
  const [name, setName] = useState(profile?.name ?? '');
  const [age, setAge] = useState(profile?.age ?? 28);
  const [height, setHeight] = useState(profile?.heightCm ?? 170);

  const handleContinue = () => {
    if (!activeProfileId || !name.trim()) return;
    updateProfile(activeProfileId, {
      name: name.trim(),
      age,
      heightCm: height,
    });
    navigation.navigate('Photo');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <StepDots total={5} current={2} />

        <Text style={styles.heading}>What should we{'\n'}call you?</Text>
        <Text style={styles.sub}>
          This appears on your home screen and export cards.
        </Text>

        {/* Name input */}
        <Text style={styles.fieldLabel}>Your name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#333333"
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="done"
        />

        {/* Age spinner */}
        <Text style={styles.fieldLabel}>Age</Text>
        <Spinner
          value={age}
          unit="years"
          onIncrement={() => setAge((v) => Math.min(v + 1, 99))}
          onDecrement={() => setAge((v) => Math.max(v - 1, 10))}
        />

        {/* Height spinner */}
        <Text style={styles.fieldLabel}>Height</Text>
        <Spinner
          value={height}
          unit="cm"
          onIncrement={() => setHeight((v) => Math.min(v + 1, 250))}
          onDecrement={() => setHeight((v) => Math.max(v - 1, 100))}
        />

        <AppButton
          label="Continue"
          onPress={handleContinue}
          disabled={!name.trim()}
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
    lineHeight: 34,
    marginBottom: 8,
  },
  sub: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 32,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#555555',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.surface,
    borderWidth: 0.5,
    borderColor: theme.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    fontWeight: '500',
    color: theme.textPrimary,
    marginBottom: 28,
  },
  spinnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  spinnerBtn: {
    width: 44,
    height: 44,
    backgroundColor: theme.surface,
    borderWidth: 0.5,
    borderColor: theme.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerBtnText: {
    fontSize: 20,
    fontWeight: '300',
    color: theme.textPrimary,
    lineHeight: 24,
  },
  spinnerValueBox: {
    flex: 1,
    backgroundColor: theme.surface,
    borderWidth: 0.5,
    borderColor: '#FFFFFF',   // active field highlight
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  spinnerValue: {
    fontSize: 22,
    fontWeight: '500',
    color: theme.textPrimary,
    letterSpacing: -0.5,
  },
  spinnerUnit: {
    fontSize: 12,
    color: '#555555',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    alignSelf: 'flex-end',
    marginBottom: 2,
  },
  cta: {
    marginTop: 12,
    width: '100%',
  },
});
