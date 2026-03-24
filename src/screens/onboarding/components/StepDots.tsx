// StepDots — progress indicator shown at the top of onboarding screens 2–5.
// Current step shows as an elongated pill; completed steps are dim dots.

import React from 'react';
import { View, StyleSheet } from 'react-native';

interface StepDotsProps {
  total: number;   // total number of steps
  current: number; // zero-indexed current step
}

export const StepDots: React.FC<StepDotsProps> = ({ total, current }) => {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const isDone = i < current;
        const isActive = i === current;

        return (
          <View
            key={i}
            style={[
              styles.dot,
              isDone && styles.dotDone,
              isActive && styles.dotActive,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 28,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2A2A2A', // future step — very dark
  },
  dotDone: {
    backgroundColor: '#444444', // completed — mid grey
  },
  dotActive: {
    width: 18,           // elongated pill for active step
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
});
