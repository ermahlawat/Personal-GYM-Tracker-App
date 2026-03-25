// WelcomeScreen — first screen seen on app open.
// Always renders in dark theme regardless of profile settings.
// Copy confirmed: hero / accent line / sub-line three-tier hierarchy.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppButton } from '../../components/common/AppButton';
import { obsidianTheme as darkTheme } from '../../theme/obsidian';

// WelcomeScreen always uses darkTheme — we hardcode it here intentionally
const theme = darkTheme;
const { height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      <View style={styles.container}>

        {/* App name — small, uppercase, wide tracking, subdued */}
        <Text style={styles.appName}>VCxPM Fitness</Text>

        {/* Spacer pushes copy toward vertical centre */}
        <View style={styles.copyBlock}>

          {/* Hero line — largest, boldest, most important */}
          <Text style={styles.hero}>The biggest{'\n'}couple flex</Text>

          {/* Accent line — same weight as hero but smaller, creates a pause */}
          <Text style={styles.accent}>Your partner's health.</Text>

          {/* Sub line — subdued, quiet, emotional */}
          <Text style={styles.sub}>
            The journey to a stronger us starts now.
          </Text>
        </View>

        {/* CTA pinned to bottom */}
        <AppButton
          label="Get started"
          onPress={() => navigation.navigate('ProfileSelect')}
          style={styles.cta}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
  },
  appName: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: '#333333', // intentionally very subdued — this is decoration
    marginBottom: 0,
  },
  copyBlock: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: height * 0.08, // shift slightly above true centre
  },
  hero: {
    fontSize: 52,
    fontWeight: '500',
    color: theme.textPrimary,     // #FFFFFF
    letterSpacing: -1.5,
    lineHeight: 56,
    marginBottom: 14,
  },
  accent: {
    fontSize: 22,
    fontWeight: '500',
    color: theme.textPrimary,     // #FFFFFF — same as hero, creates visual link
    letterSpacing: -0.3,
    lineHeight: 28,
    marginBottom: 18,
  },
  sub: {
    fontSize: 13,
    fontWeight: '400',
    color: '#555555',             // intentionally subdued — quiet, not primary
    lineHeight: 21,
  },
  cta: {
    width: '100%',
  },
});
