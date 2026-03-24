import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { useTheme } from '../../theme';
import { useProfileStore } from '../../store/profileStore';
import { saveMealSlot, getMealsForDate, type MealPlanEntry } from '../../database/queries/mealQueries';

type MealSlotId = 'breakfast' | 'mid_morning' | 'lunch' | 'mid_evening' | 'dinner';

const MEAL_SLOTS: { id: MealSlotId; label: string; time: string; initial: string }[] = [
  { id: 'breakfast',   label: 'Breakfast',        time: '8:00 AM',  initial: 'B' },
  { id: 'mid_morning', label: 'Mid-Morning Snack', time: '10:30 AM', initial: 'S' },
  { id: 'lunch',       label: 'Lunch',             time: '1:00 PM',  initial: 'L' },
  { id: 'mid_evening', label: 'Mid-Evening Snack', time: '4:30 PM',  initial: 'S' },
  { id: 'dinner',      label: 'Dinner',            time: '7:30 PM',  initial: 'D' },
];

const SLOT_COLOURS: Record<MealSlotId, string> = {
  breakfast: '#EF9F27', mid_morning: '#D4537E', lunch: '#639922',
  mid_evening: '#D4537E', dinner: '#378ADD',
};

interface MealFormState {
  mealName: string; calories: string; protein: string; carbs: string; fat: string;
}

const EMPTY_FORM: MealFormState = { mealName: '', calories: '', protein: '', carbs: '', fat: '' };

function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

export default function MealsScreen() {
  const theme = useTheme();
  const { getActiveProfile } = useProfileStore();
  const profile = getActiveProfile();

  const [meals, setMeals] = useState<Record<MealSlotId, MealFormState>>({
    breakfast: { ...EMPTY_FORM }, mid_morning: { ...EMPTY_FORM },
    lunch: { ...EMPTY_FORM }, mid_evening: { ...EMPTY_FORM }, dinner: { ...EMPTY_FORM },
  });
  const [expandedSlot, setExpandedSlot] = useState<MealSlotId | null>(null);
  const [saving, setSaving] = useState<MealSlotId | null>(null);

  useEffect(() => {
    if (!profile) return;
    try {
      const entries = getMealsForDate(profile.id, todayString());
      if (!entries.length) return;
      const loaded = { breakfast: { ...EMPTY_FORM }, mid_morning: { ...EMPTY_FORM }, lunch: { ...EMPTY_FORM }, mid_evening: { ...EMPTY_FORM }, dinner: { ...EMPTY_FORM } };
      entries.forEach((e) => {
        const slotId = e.slot as MealSlotId;
        if (loaded[slotId] !== undefined) {
          loaded[slotId] = {
            mealName: e.mealName ?? '', calories: e.calories != null ? String(e.calories) : '',
            protein: e.proteinG != null ? String(e.proteinG) : '',
            carbs: e.carbsG != null ? String(e.carbsG) : '',
            fat: e.fatG != null ? String(e.fatG) : '',
          };
        }
      });
      setMeals(loaded);
    } catch (e) {}
  }, [profile?.id]);

  const totals = Object.values(meals).reduce(
    (acc, m) => ({
      calories: acc.calories + (parseFloat(m.calories) || 0),
      protein: acc.protein + (parseFloat(m.protein) || 0),
      carbs: acc.carbs + (parseFloat(m.carbs) || 0),
      fat: acc.fat + (parseFloat(m.fat) || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const targets = { calories: 1800, protein: 140, carbs: 180, fat: 60 };

  const handleSaveSlot = (slotId: MealSlotId) => {
    if (!profile) return;
    setSaving(slotId);
    try {
      const form = meals[slotId];
      saveMealSlot({
        profileId: profile.id, date: todayString(), slot: slotId,
        mealName: form.mealName || undefined,
        calories: form.calories ? parseFloat(form.calories) : undefined,
        proteinG: form.protein ? parseFloat(form.protein) : undefined,
        carbsG: form.carbs ? parseFloat(form.carbs) : undefined,
        fatG: form.fat ? parseFloat(form.fat) : undefined,
      });
      setExpandedSlot(null);
    } catch (e) {
      Alert.alert('Error', 'Could not save. Try again.');
    } finally { setSaving(null); }
  };

  const updateField = (slotId: MealSlotId, field: keyof MealFormState, value: string) => {
    setMeals((prev) => ({ ...prev, [slotId]: { ...prev[slotId], [field]: value } }));
  };

  if (!profile) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Meals</Text>
        <Text style={[styles.headerDate, { color: theme.textLabel }]}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <View style={[styles.macrosBanner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.macrosTitle, { color: theme.textLabel }]}>TODAY'S TOTALS</Text>
          <View style={styles.macrosRow}>
            {([
              { label: 'KCAL', value: Math.round(totals.calories), target: targets.calories, unit: '' },
              { label: 'PROTEIN', value: Math.round(totals.protein), target: targets.protein, unit: 'g' },
              { label: 'CARBS', value: Math.round(totals.carbs), target: targets.carbs, unit: 'g' },
              { label: 'FAT', value: Math.round(totals.fat), target: targets.fat, unit: 'g' },
            ] as const).map((macro, i) => {
              const pct = Math.min((macro.value / macro.target) * 100, 100);
              return (
                <View key={i} style={styles.macroCol}>
                  <Text style={[styles.macroValue, { color: theme.textPrimary }]}>{macro.value}{macro.unit}</Text>
                  <Text style={[styles.macroLabel, { color: theme.textLabel }]}>{macro.label}</Text>
                  <View style={[styles.macroTrack, { backgroundColor: theme.progressTrack }]}>
                    <View style={[styles.macroFill, { backgroundColor: theme.progressFill, width: `${pct}%` as any }]} />
                  </View>
                  <Text style={[styles.macroTarget, { color: theme.textLabel }]}>/{macro.target}{macro.unit}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {MEAL_SLOTS.map((slot) => {
          const isExpanded = expandedSlot === slot.id;
          const form = meals[slot.id];
          const hasData = form.mealName.trim().length > 0;
          const colour = SLOT_COLOURS[slot.id];
          return (
            <View key={slot.id} style={[styles.slotCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <TouchableOpacity style={styles.slotHeader} onPress={() => setExpandedSlot(isExpanded ? null : slot.id)} activeOpacity={0.8}>
                <View style={[styles.slotIcon, { backgroundColor: colour + '22' }]}>
                  <Text style={[styles.slotIconText, { color: colour }]}>{slot.initial}</Text>
                </View>
                <View style={styles.slotInfo}>
                  <Text style={[styles.slotLabel, { color: theme.textLabel }]}>{slot.label.toUpperCase()}</Text>
                  <Text style={[styles.slotName, { color: hasData ? theme.textPrimary : theme.textLabel }]}>
                    {hasData ? form.mealName : slot.time}
                  </Text>
                  {hasData && form.calories ? (
                    <Text style={[styles.slotCalories, { color: theme.textLabel }]}>{form.calories} kcal</Text>
                  ) : null}
                </View>
                <Text style={[styles.chevron, { color: theme.textLabel }]}>{isExpanded ? '↑' : '↓'}</Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={[styles.slotForm, { borderTopColor: theme.border }]}>
                  <Text style={[styles.formLabel, { color: theme.textLabel }]}>MEAL NAME</Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.textPrimary }]}
                    placeholder="e.g. Oats with banana"
                    placeholderTextColor={theme.textLabel}
                    value={form.mealName}
                    onChangeText={(v) => updateField(slot.id, 'mealName', v)}
                    autoCapitalize="sentences"
                  />
                  <Text style={[styles.formLabel, { color: theme.textLabel, marginTop: 10 }]}>MACROS</Text>
                  <View style={styles.macroGrid}>
                    {([
                      { field: 'calories', label: 'Calories', unit: 'kcal' },
                      { field: 'protein', label: 'Protein', unit: 'g' },
                      { field: 'carbs', label: 'Carbs', unit: 'g' },
                      { field: 'fat', label: 'Fat', unit: 'g' },
                    ] as const).map((macro) => (
                      <View key={macro.field} style={[styles.macroField, { backgroundColor: theme.background, borderColor: theme.border }]}>
                        <TextInput
                          style={[styles.macroFieldInput, { color: theme.textPrimary }]}
                          placeholder="0" placeholderTextColor={theme.textLabel}
                          keyboardType="decimal-pad"
                          value={(form as any)[macro.field]}
                          onChangeText={(v) => updateField(slot.id, macro.field as keyof MealFormState, v)}
                        />
                        <Text style={[styles.macroFieldLabel, { color: theme.textLabel }]}>{macro.label} ({macro.unit})</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={[styles.slotSaveBtn, { backgroundColor: saving === slot.id ? theme.surfaceSecondary : theme.buttonBackground }]}
                    onPress={() => handleSaveSlot(slot.id)} disabled={saving === slot.id} activeOpacity={0.8}
                  >
                    <Text style={[styles.slotSaveBtnText, { color: theme.buttonText }]}>
                      {saving === slot.id ? 'Saving...' : `Save ${slot.label}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        <TouchableOpacity style={styles.copyBtn} activeOpacity={0.7}>
          <Text style={[styles.copyBtnText, { color: theme.textLabel }]}>Copy yesterday's plan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: '500', letterSpacing: -0.3 },
  headerDate: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 },
  scroll: { padding: 16, gap: 10, paddingBottom: 40 },
  macrosBanner: { borderRadius: 12, borderWidth: 0.5, padding: 16, marginBottom: 4 },
  macrosTitle: { fontSize: 9, fontWeight: '500', letterSpacing: 1.2, marginBottom: 12 },
  macrosRow: { flexDirection: 'row', justifyContent: 'space-between' },
  macroCol: { alignItems: 'center', flex: 1 },
  macroValue: { fontSize: 17, fontWeight: '500', letterSpacing: -0.3 },
  macroLabel: { fontSize: 8, fontWeight: '500', letterSpacing: 0.6, marginTop: 2 },
  macroTrack: { width: '80%', height: 3, borderRadius: 2, marginTop: 5, overflow: 'hidden' },
  macroFill: { height: 3, borderRadius: 2 },
  macroTarget: { fontSize: 9, marginTop: 2 },
  slotCard: { borderRadius: 12, borderWidth: 0.5, overflow: 'hidden' },
  slotHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  slotIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  slotIconText: { fontSize: 15, fontWeight: '500' },
  slotInfo: { flex: 1 },
  slotLabel: { fontSize: 8, fontWeight: '500', letterSpacing: 1, marginBottom: 3 },
  slotName: { fontSize: 13, fontWeight: '500' },
  slotCalories: { fontSize: 10, marginTop: 2 },
  chevron: { fontSize: 14 },
  slotForm: { padding: 14, borderTopWidth: 0.5, gap: 8 },
  formLabel: { fontSize: 8, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase' },
  formInput: { borderWidth: 0.5, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13 },
  macroGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  macroField: { width: '47%', borderWidth: 0.5, borderRadius: 8, padding: 10, alignItems: 'center' },
  macroFieldInput: { fontSize: 18, fontWeight: '500', marginBottom: 2, textAlign: 'center', width: '100%' },
  macroFieldLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 },
  slotSaveBtn: { borderRadius: 8, paddingVertical: 11, alignItems: 'center', marginTop: 4 },
  slotSaveBtnText: { fontSize: 12, fontWeight: '500' },
  copyBtn: { alignItems: 'center', paddingVertical: 16 },
  copyBtnText: { fontSize: 12 },
});
