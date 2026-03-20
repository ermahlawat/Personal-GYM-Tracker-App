// WorkoutScreen — the day planner.
// Shows category selector pills at the top, then a scrollable list of
// exercises for the selected category from the database.
// Multi-select — user picks what their coach recommended today.
// "Start session" CTA at the bottom navigates to ActiveSessionScreen.

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useTheme } from '../../theme';
import { AppText } from '../../components/common/AppText';
import { AppButton } from '../../components/common/AppButton';
import { EXERCISES, ExerciseCategory } from '../../data/exercises';

const CATEGORIES: { id: ExerciseCategory; label: string }[] = [
  { id: 'push', label: 'Push' },
  { id: 'pull', label: 'Pull' },
  { id: 'legs', label: 'Legs' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'arms', label: 'Arms' },
  { id: 'upper', label: 'Upper Body' },
  { id: 'lower', label: 'Lower Body' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'yoga', label: 'Yoga / Mobility' },
  { id: 'rest', label: 'Rest' },
];

export default function WorkoutScreen() {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] =
    useState<ExerciseCategory>('push');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Filter exercises for the selected category
  const categoryExercises = useMemo(
    () => EXERCISES.filter((e) => e.category === selectedCategory),
    [selectedCategory]
  );

  const toggleExercise = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCategoryChange = (cat: ExerciseCategory) => {
    setSelectedCategory(cat);
    // Keep selections across categories so user can mix e.g. Push + Shoulders
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Plan Today
        </Text>
        <Text style={[styles.headerDate, { color: theme.textLabel }]}>
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}
        </Text>
      </View>

      {/* Category pill selector — horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                {
                  backgroundColor: isActive
                    ? theme.pillActive
                    : theme.pillInactive,
                  borderColor: isActive ? theme.pillActive : theme.border,
                },
              ]}
              onPress={() => handleCategoryChange(cat.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  {
                    color: isActive
                      ? theme.pillActiveText
                      : theme.pillInactiveText,
                  },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selection count + section header */}
      <View style={[styles.sectionHeader, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          {CATEGORIES.find((c) => c.id === selectedCategory)?.label} exercises
        </Text>
        <Text style={[styles.selectionCount, { color: theme.textLabel }]}>
          {selectedIds.size} selected
        </Text>
      </View>

      {/* Exercise list */}
      <FlatList
        data={categoryExercises}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <TouchableOpacity
              style={[
                styles.exerciseRow,
                {
                  backgroundColor: isSelected
                    ? theme.surface
                    : 'transparent',
                  borderColor: isSelected ? theme.accent : theme.border,
                  borderBottomColor: theme.border,
                },
              ]}
              onPress={() => toggleExercise(item.id)}
              activeOpacity={0.85}
            >
              {/* Checkbox */}
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: isSelected ? theme.accent : theme.border,
                    backgroundColor: isSelected
                      ? theme.accent
                      : 'transparent',
                  },
                ]}
              >
                {isSelected && (
                  <Text
                    style={{
                      color: theme.buttonText,
                      fontSize: 10,
                      fontWeight: '500',
                    }}
                  >
                    ✓
                  </Text>
                )}
              </View>

              {/* Exercise info */}
              <View style={styles.exerciseInfo}>
                <Text
                  style={[styles.exerciseName, { color: theme.textPrimary }]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.exerciseMuscle,
                    { color: theme.textLabel },
                  ]}
                >
                  {item.primaryMuscle}
                </Text>
              </View>

              {/* Swap icon — two horizontal arrows */}
              <TouchableOpacity
                style={[
                  styles.swapBtn,
                  { borderColor: theme.border },
                ]}
                onPress={() => {
                  // Will open swap bottom sheet in next session
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.swapText, { color: theme.textLabel }]}
                >
                  ⇄
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />

      {/* Add to plan CTA */}
      {selectedIds.size > 0 && (
        <View
          style={[
            styles.ctaBar,
            {
              backgroundColor: theme.background,
              borderTopColor: theme.border,
            },
          ]}
        >
          <AppButton
            label={`Start session with ${selectedIds.size} exercise${selectedIds.size !== 1 ? 's' : ''}`}
            onPress={() => {
              // Navigate to ActiveSessionScreen — built in next session
            }}
            style={styles.ctaBtn}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: 22, fontWeight: '500', letterSpacing: -0.3 },
  headerDate: {
    fontSize: 11,
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  categoryRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 7,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  sectionTitle: { fontSize: 13, fontWeight: '500' },
  selectionCount: { fontSize: 11 },
  listContent: { paddingBottom: 100 },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  exerciseMuscle: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  swapBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 0.5,
  },
  swapText: { fontSize: 14 },
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 0.5,
  },
  ctaBtn: { width: '100%' },
});
