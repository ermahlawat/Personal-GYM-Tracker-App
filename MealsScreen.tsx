// MealsScreen — 5-slot daily meal planner.
// Slots: Breakfast, Mid-Morning Snack, Lunch, Mid-Evening Snack, Dinner.
// Each slot has name, notes, and macro fields (kcal, protein, carbs, fat).
// Daily macro total banner at the top.
// Calendar navigation via swipe left/right (placeholder in this session).

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme';

type MealSlotId =
  | 'breakfast'
  | 'mid_morning'
  | 'lunch'
  | 'mid_evening'
  | 'dinner';

interface MealSlot {
  id: MealSlotId;
  label: string;
  time: string;
  iconLabel: string; // text label used instead of emoji
}

const MEAL_SLOTS: MealSlot[] = [
  { id: 'breakfast', label: 'Breakfast', time: '8:00 AM', iconLabel: 'B' },
  { id: 'mid_morning', label: 'Mid-Morning Snack', time: '10:30 AM', iconLabel: 'S' },
  { id: 'lunch', label: 'Lunch', time: '1:00 PM', iconLabel: 'L' },
  { id: 'mid_evening', label: 'Mid-Evening Snack', time: '4:30 PM', iconLabel: 'S' },
  { id: 'dinner', label: 'Dinner', time: '7:30 PM', iconLabel: 'D' },
];

// Colour accent per slot — not from theme, fixed food-category colours
const SLOT_COLOURS: Record<MealSlotId, string> = {
  breakfast: '#EF9F27',
  mid_morning: '#D4537E',
  lunch: '#639922',
  mid_evening: '#D4537E',
  dinner: '#378ADD',
};

interface MealData {
  name: string;
  notes: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

const EMPTY_MEAL: MealData = {
  name: '',
  notes: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
};

export default function MealsScreen() {
  const theme = useTheme();
  const [meals, setMeals] = useState<Record<MealSlotId, MealData>>({
    breakfast: { ...EMPTY_MEAL },
    mid_morning: { ...EMPTY_MEAL },
    lunch: { ...EMPTY_MEAL },
    mid_evening: { ...EMPTY_MEAL },
    dinner: { ...EMPTY_MEAL },
  });
  const [expandedSlot, setExpandedSlot] = useState<MealSlotId | null>(null);

  // Calculate daily totals from all logged meals
  const totals = Object.values(meals).reduce(
    (acc, m) => ({
      calories: acc.calories + (parseFloat(m.calories) || 0),
      protein: acc.protein + (parseFloat(m.protein) || 0),
      carbs: acc.carbs + (parseFloat(m.carbs) || 0),
      fat: acc.fat + (parseFloat(m.fat) || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Daily targets — will come from profile goals in a future session
  const targets = { calories: 1800, protein: 140, carbs: 180, fat: 60 };

  const toggleSlot = (id: MealSlotId) => {
    setExpandedSlot((prev) => (prev === id ? null : id));
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
          Meals
        </Text>
        <Text style={[styles.headerDate, { color: theme.textLabel }]}>
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'short', day: 'numeric', month: 'short',
          })}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Daily macro total banner ── */}
        <View style={[styles.macrosBanner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.macrosTitle, { color: theme.textLabel }]}>
            TODAY'S TOTALS
          </Text>
          <View style={styles.macrosRow}>
            {[
              { label: 'KCAL', value: Math.round(totals.calories), target: targets.calories },
              { label: 'PROTEIN', value: Math.round(totals.protein), target: targets.protein, unit: 'g' },
              { label: 'CARBS', value: Math.round(totals.carbs), target: targets.carbs, unit: 'g' },
              { label: 'FAT', value: Math.round(totals.fat), target: targets.fat, unit: 'g' },
            ].map((macro, i) => {
              const pct = Math.min((macro.value / macro.target) * 100, 100);
              return (
                <View key={i} style={styles.macroCol}>
                  <Text style={[styles.macroValue, { color: theme.textPrimary }]}>
                    {macro.value}
                    {macro.unit ?? ''}
                  </Text>
                  <Text style={[styles.macroLabel, { color: theme.textLabel }]}>
                    {macro.label}
                  </Text>
                  {/* Progress bar */}
                  <View
                    style={[
                      styles.macroTrack,
                      { backgroundColor: theme.progressTrack },
                    ]}
                  >
                    <View
                      style={[
                        styles.macroFill,
                        {
                          backgroundColor: theme.progressFill,
                          width: `${pct}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.macroTarget, { color: theme.textLabel }]}>
                    /{macro.target}{macro.unit ?? ''}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Meal slots ── */}
        {MEAL_SLOTS.map((slot) => {
          const isExpanded = expandedSlot === slot.id;
          const meal = meals[slot.id];
          const hasData = meal.name.trim().length > 0;
          const slotColour = SLOT_COLOURS[slot.id];

          return (
            <View
              key={slot.id}
              style={[
                styles.slotCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              {/* Slot header — always visible */}
              <TouchableOpacity
                style={styles.slotHeader}
                onPress={() => toggleSlot(slot.id)}
                activeOpacity={0.8}
              >
                {/* Coloured initial circle */}
                <View
                  style={[
                    styles.slotIcon,
                    { backgroundColor: slotColour + '22' },
                  ]}
                >
                  <Text
                    style={[styles.slotIconText, { color: slotColour }]}
                  >
                    {slot.iconLabel}
                  </Text>
                </View>

                <View style={styles.slotInfo}>
                  <Text
                    style={[styles.slotLabel, { color: theme.textLabel }]}
                  >
                    {slot.label.toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.slotName,
                      { color: hasData ? theme.textPrimary : theme.textLabel },
                    ]}
                  >
                    {hasData ? meal.name : slot.time}
                  </Text>
                  {hasData && meal.calories ? (
                    <Text
                      style={[styles.slotCalories, { color: theme.textLabel }]}
                    >
                      {meal.calories} kcal
                    </Text>
                  ) : null}
                </View>

                {/* Expand/collapse indicator */}
                <Text style={[styles.chevron, { color: theme.textLabel }]}>
                  {isExpanded ? '↑' : '↓'}
                </Text>
              </TouchableOpacity>

              {/* Expanded edit form */}
              {isExpanded && (
                <View
                  style={[
                    styles.slotForm,
                    { borderTopColor: theme.border },
                  ]}
                >
                  {/* Meal name field */}
                  <View style={styles.formRow}>
                    <Text
                      style={[styles.formLabel, { color: theme.textLabel }]}
                    >
                      MEAL NAME
                    </Text>
                    <View
                      style={[
                        styles.formInput,
                        {
                          backgroundColor: theme.background,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.formInputText,
                          { color: meal.name ? theme.textPrimary : theme.textLabel },
                        ]}
                      >
                        {meal.name || 'Tap to enter meal name'}
                      </Text>
                    </View>
                  </View>

                  {/* Macro fields in a 2x2 grid */}
                  <Text style={[styles.formLabel, { color: theme.textLabel, marginBottom: 8 }]}>
                    MACROS
                  </Text>
                  <View style={styles.macroGrid}>
                    {[
                      { key: 'calories', label: 'Calories', unit: 'kcal' },
                      { key: 'protein', label: 'Protein', unit: 'g' },
                      { key: 'carbs', label: 'Carbs', unit: 'g' },
                      { key: 'fat', label: 'Fat', unit: 'g' },
                    ].map((macro) => (
                      <View
                        key={macro.key}
                        style={[
                          styles.macroField,
                          {
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.macroFieldVal,
                            { color: theme.textLabel },
                          ]}
                        >
                          —
                        </Text>
                        <Text
                          style={[
                            styles.macroFieldLabel,
                            { color: theme.textLabel },
                          ]}
                        >
                          {macro.label} ({macro.unit})
                        </Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.slotSaveBtn,
                      { backgroundColor: theme.buttonBackground },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.slotSaveBtnText,
                        { color: theme.buttonText },
                      ]}
                    >
                      Save {slot.label}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {/* Copy yesterday link */}
        <TouchableOpacity style={styles.copyBtn} activeOpacity={0.7}>
          <Text style={[styles.copyBtnText, { color: theme.textLabel }]}>
            Copy yesterday's plan
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerDate: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 },
  scroll: { padding: 16, gap: 10, paddingBottom: 40 },

  macrosBanner: {
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 16,
    marginBottom: 4,
  },
  macrosTitle: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  macrosRow: { flexDirection: 'row', justifyContent: 'space-between' },
  macroCol: { alignItems: 'center', flex: 1 },
  macroValue: { fontSize: 17, fontWeight: '500', letterSpacing: -0.3 },
  macroLabel: { fontSize: 8, fontWeight: '500', letterSpacing: 0.6, marginTop: 2 },
  macroTrack: {
    width: '80%',
    height: 3,
    borderRadius: 2,
    marginTop: 5,
    overflow: 'hidden',
  },
  macroFill: { height: 3, borderRadius: 2 },
  macroTarget: { fontSize: 9, marginTop: 2 },

  slotCard: {
    borderRadius: 12,
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  slotIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  slotIconText: { fontSize: 15, fontWeight: '500' },
  slotInfo: { flex: 1 },
  slotLabel: {
    fontSize: 8,
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 3,
  },
  slotName: { fontSize: 13, fontWeight: '500' },
  slotCalories: { fontSize: 10, marginTop: 2 },
  chevron: { fontSize: 14, fontWeight: '300' },

  slotForm: {
    padding: 14,
    borderTopWidth: 0.5,
    gap: 12,
  },
  formRow: { gap: 6 },
  formLabel: {
    fontSize: 8,
    fontWeight: '500',
    letterSpacing: 1,
  },
  formInput: {
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  formInputText: { fontSize: 13 },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  macroField: {
    width: '47%',
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  macroFieldVal: { fontSize: 18, fontWeight: '500', marginBottom: 2 },
  macroFieldLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 },
  slotSaveBtn: {
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 4,
  },
  slotSaveBtnText: { fontSize: 12, fontWeight: '500' },

  copyBtn: { alignItems: 'center', paddingVertical: 16 },
  copyBtnText: { fontSize: 12 },
});
