// App.tsx — the root entry point of VCxPM Fitness.
// Wraps the entire app in:
//   GestureHandlerRootView — required by React Native Gesture Handler
//   SafeAreaProvider        — required by safe-area-context
//   RootNavigator           — decides onboarding vs main tabs
// Nothing else lives here — all logic is in RootNavigator.

import 'react-native-gesture-handler'; // must be the very first import
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
