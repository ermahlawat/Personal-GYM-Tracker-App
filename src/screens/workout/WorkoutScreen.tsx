import React, { useState, useMemo, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, TextInput, FlatList, Alert,
} from 'react-native';
import { useTheme } from '../../theme';
import { useProfileStore } from '../../store/profileStore';
import { EXERCISES, ExerciseCategory } from '../../data/exercises';
import { saveWorkoutSession, getLastSetsForExercise } from '../../database/queries/workoutQueries';

interface PlannedSet { setNumber: number; reps: string; kg: string; done: boolean; }
interface PlannedExercise { exerciseId: number; name: string; category: string; sets: PlannedSet[]; }
interface DayPlan { dateString: string; label: string; exercises: PlannedExercise[]; isActive: boolean; }

const CATEGORIES: { id: ExerciseCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'push', label: 'Push' },
  { id: 'pull', label: 'Pull' }, { id: 'legs', label: 'Legs' },
  { id: 'shoulders', label: 'Shoulders' }, { id: 'arms', label: 'Arms' },
  { id: 'upper', label: 'Upper Body' }, { id: 'lower', label: 'Lower Body' },
  { id: 'cardio', label: 'Cardio' }, { id: 'yoga', label: 'Yoga' },
];

function buildWeek(): DayPlan[] {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dateString: d.toISOString().split('T')[0],
      label: `${dayNames[d.getDay()]} ${d.getDate()}`,
      exercises: [],
      isActive: false,
    };
  });
}

function makeDefaultSets(count: number, prevSets?: any[]): PlannedSet[] {
  if (prevSets && prevSets.length > 0) {
    return prevSets.map((s, i) => ({
      setNumber: i + 1,
      reps: s.reps != null ? String(s.reps) : '',
      kg: s.weight_kg != null ? String(s.weight_kg) : '',
      done: false,
    }));
  }
  return Array.from({ length: count }, (_, i) => ({ setNumber: i + 1, reps: '', kg: '', done: false }));
}

export default function WorkoutScreen() {
  const theme = useTheme();
  const { getActiveProfile } = useProfileStore();
  const profile = getActiveProfile();

  const [view, setView] = useState<'planner' | 'browse' | 'session'>('planner');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [week, setWeek] = useState<DayPlan[]>(buildWeek);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const sessionStartRef = useRef<Date>(new Date());

  const activeDay = week[activeDayIndex];

  const filteredExercises = useMemo(() => {
    let list = EXERCISES;
    if (selectedCategory !== 'all') list = list.filter((e) => e.category === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(q) || e.primaryMuscle.toLowerCase().includes(q));
    }
    return list;
  }, [selectedCategory, search]);

  const toggleExercise = (id: number) => {
    setSelectedIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const addSelectedToDay = () => {
    if (!profile) return;
    const toAdd: PlannedExercise[] = [];
    selectedIds.forEach((id) => {
      if (activeDay.exercises.some((e) => e.exerciseId === id)) return;
      const ex = EXERCISES.find((e) => e.id === id);
      if (!ex) return;
      let prevSets: any[] = [];
      try { prevSets = getLastSetsForExercise(profile.id, id); } catch {}
      toAdd.push({
        exerciseId: id, name: ex.name, category: ex.category,
        sets: makeDefaultSets(prevSets.length > 0 ? prevSets.length : 3, prevSets),
      });
    });
    setWeek((prev) => prev.map((d, i) => i !== activeDayIndex ? d : { ...d, exercises: [...d.exercises, ...toAdd] }));
    setSelectedIds(new Set());
    setView('planner');
  };

  const addSet = (exerciseId: number) => {
    setWeek((prev) => prev.map((d, i) => i !== activeDayIndex ? d : {
      ...d, exercises: d.exercises.map((ex) => ex.exerciseId !== exerciseId ? ex : {
        ...ex, sets: [...ex.sets, { setNumber: ex.sets.length + 1, reps: '', kg: '', done: false }],
      }),
    }));
  };

  const removeLastSet = (exerciseId: number) => {
    setWeek((prev) => prev.map((d, i) => i !== activeDayIndex ? d : {
      ...d, exercises: d.exercises.map((ex) => {
        if (ex.exerciseId !== exerciseId || ex.sets.length <= 1) return ex;
        return { ...ex, sets: ex.sets.slice(0, -1) };
      }),
    }));
  };

  const removeExercise = (exerciseId: number) => {
    Alert.alert('Remove exercise', 'Remove from this day?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () =>
        setWeek((prev) => prev.map((d, i) => i !== activeDayIndex ? d : {
          ...d, exercises: d.exercises.filter((ex) => ex.exerciseId !== exerciseId),
        }))
      },
    ]);
  };

  const swapExercise = (exerciseId: number) => {
    const current = EXERCISES.find((e) => e.id === exerciseId);
    if (!current) return;
    const alternatives = EXERCISES.filter(
      (e) => e.id !== exerciseId && e.category === current.category && !activeDay.exercises.some((p) => p.exerciseId === e.id)
    ).slice(0, 5);
    if (!alternatives.length) { Alert.alert('No alternatives', 'No similar exercises to swap with.'); return; }
    Alert.alert('Swap exercise', `Replace ${current.name} with:`, [
      ...alternatives.map((alt) => ({
        text: alt.name,
        onPress: () => setWeek((prev) => prev.map((d, i) => i !== activeDayIndex ? d : {
          ...d, exercises: d.exercises.map((ex) => ex.exerciseId !== exerciseId ? ex : {
            ...ex, exerciseId: alt.id, name: alt.name, category: alt.category,
          }),
        })),
      })),
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const updateSet = (exerciseId: number, setIndex: number, field: 'kg' | 'reps' | 'done', value: string | boolean) => {
    setWeek((prev) => prev.map((d, i) => i !== activeDayIndex ? d : {
      ...d, exercises: d.exercises.map((ex) => ex.exerciseId !== exerciseId ? ex : {
        ...ex, sets: ex.sets.map((s, si) => si === setIndex ? { ...s, [field]: value } : s),
      }),
    }));
  };

  const startSession = () => {
    sessionStartRef.current = new Date();
    setView('session');
  };

  const handleFinishSession = () => {
    if (!profile) return;
    const completedSets = activeDay.exercises.flatMap((ex) =>
      ex.sets.filter((s) => s.done).map((s) => ({
        exerciseId: ex.exerciseId, exerciseName: ex.name, setNumber: s.setNumber,
        reps: s.reps ? parseInt(s.reps) : undefined,
        weightKg: s.kg ? parseFloat(s.kg) : undefined,
        completed: true,
      }))
    );
    if (!completedSets.length) { Alert.alert('No sets logged', 'Mark at least one set as Done.'); return; }
    const durationSeconds = Math.round((new Date().getTime() - sessionStartRef.current.getTime()) / 1000);
    const firstEx = EXERCISES.find((e) => e.id === activeDay.exercises[0].exerciseId);
    const splitType = firstEx ? firstEx.category.charAt(0).toUpperCase() + firstEx.category.slice(1) : 'Workout';
    try {
      saveWorkoutSession(
        { profileId: profile.id, date: activeDay.dateString, splitType, durationSeconds, completedAt: new Date().toISOString() },
        completedSets
      );
      Alert.alert('Session saved', `${completedSets.length} sets logged.`, [{
        text: 'Done', onPress: () => {
          setWeek((prev) => prev.map((d, i) => i !== activeDayIndex ? d : {
            ...d, exercises: d.exercises.map((ex) => ({ ...ex, sets: ex.sets.map((s) => ({ ...s, done: false })) })),
          }));
          setView('planner');
        },
      }]);
    } catch { Alert.alert('Error', 'Could not save. Try again.'); }
  };

  const doneSetsCount = activeDay.exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.done).length, 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} translucent={false} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Workout</Text>
        <View style={styles.headerTabs}>
          {(['planner', 'browse'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.headerTab, view === t && { borderBottomWidth: 2, borderBottomColor: theme.accent }]}
              onPress={() => { if (view === 'session' && t === 'planner') setView('planner'); else if (t !== 'session') setView(t); }}
            >
              <Text style={[styles.headerTabText, { color: view === t ? theme.accent : theme.textLabel }]}>
                {t === 'planner' ? 'Planner' : 'Browse'}
              </Text>
            </TouchableOpacity>
          ))}
          {view === 'session' && (
            <View style={[styles.headerTab, { borderBottomWidth: 2, borderBottomColor: theme.accent }]}>
              <Text style={[styles.headerTabText, { color: theme.accent }]}>Session</Text>
            </View>
          )}
        </View>
      </View>

      {/* ── PLANNER VIEW ── */}
      {view === 'planner' && (
        <>
          {/* Day selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayRow}>
            {week.map((day, i) => {
              const isActive = i === activeDayIndex;
              const hasEx = day.exercises.length > 0;
              return (
                <TouchableOpacity
                  key={day.dateString}
                  style={[styles.dayBtn, { backgroundColor: isActive ? theme.accent : theme.surface, borderColor: isActive ? theme.accent : hasEx ? theme.accent + '66' : theme.border }]}
                  onPress={() => setActiveDayIndex(i)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dayBtnText, { color: isActive ? '#FFFFFF' : hasEx ? theme.accent : theme.textSecondary }]}>
                    {day.label}
                  </Text>
                  {hasEx && !isActive && <View style={[styles.dayDot, { backgroundColor: theme.accent }]} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <ScrollView contentContainerStyle={styles.planScroll} showsVerticalScrollIndicator={false}>
            {activeDay.exercises.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No exercises for {activeDay.label}</Text>
                <Text style={[styles.emptySub, { color: theme.textLabel }]}>Tap Browse to add exercises to this day.</Text>
                <TouchableOpacity style={[styles.emptyBtn, { borderColor: theme.accent }]} onPress={() => setView('browse')}>
                  <Text style={[styles.emptyBtnText, { color: theme.accent }]}>Browse exercises</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Plan cards — NO kg/reps inputs, just exercise + set count */}
                {activeDay.exercises.map((ex) => (
                  <View key={ex.exerciseId} style={[styles.planCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.planCardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.planCardName, { color: theme.textPrimary }]}>{ex.name}</Text>
                        <Text style={[styles.planCardCategory, { color: theme.textLabel }]}>
                          {ex.category.charAt(0).toUpperCase() + ex.category.slice(1)}
                        </Text>
                      </View>
                      <View style={styles.planCardActions}>
                        <TouchableOpacity style={[styles.planActionBtn, { borderColor: theme.border }]} onPress={() => swapExercise(ex.exerciseId)}>
                          <Text style={[styles.planActionText, { color: theme.textSecondary }]}>Swap</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.planActionBtn, { borderColor: theme.border }]} onPress={() => removeExercise(ex.exerciseId)}>
                          <Text style={[styles.planActionText, { color: theme.textLabel }]}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={[styles.setCountRow, { borderTopColor: theme.border }]}>
                      <Text style={[styles.setCountText, { color: theme.textSecondary }]}>
                        {ex.sets.length} set{ex.sets.length !== 1 ? 's' : ''}
                      </Text>
                      <View style={styles.setCountBtns}>
                        <TouchableOpacity style={[styles.setCountBtn, { borderColor: theme.border }]} onPress={() => removeLastSet(ex.exerciseId)} disabled={ex.sets.length <= 1}>
                          <Text style={[styles.setCountBtnText, { color: ex.sets.length <= 1 ? theme.textLabel : theme.textPrimary }]}>- Set</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.setCountBtn, { borderColor: theme.border }]} onPress={() => addSet(ex.exerciseId)}>
                          <Text style={[styles.setCountBtnText, { color: theme.textPrimary }]}>+ Set</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}

                <TouchableOpacity style={[styles.addMoreBtn, { borderColor: theme.border }]} onPress={() => setView('browse')}>
                  <Text style={[styles.addMoreText, { color: theme.textSecondary }]}>+ Add more exercises</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.startSessionBtn, { backgroundColor: theme.buttonBackground }]} onPress={startSession}>
                  <Text style={[styles.startSessionText, { color: theme.buttonText }]}>Start session — {activeDay.label}</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </>
      )}

      {/* ── SESSION VIEW — weights/reps visible here ── */}
      {view === 'session' && (
        <>
          <View style={[styles.sessionBanner, { backgroundColor: theme.surfaceSecondary, borderBottomColor: theme.border }]}>
            <Text style={[styles.sessionBannerText, { color: theme.textPrimary }]}>Session in progress — {activeDay.label}</Text>
            <TouchableOpacity onPress={() => setView('planner')}>
              <Text style={[styles.sessionBannerLink, { color: theme.textLabel }]}>Edit plan</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.planScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {activeDay.exercises.map((ex) => (
              <View key={ex.exerciseId} style={[styles.planCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.planCardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.planCardName, { color: theme.textPrimary }]}>{ex.name}</Text>
                  </View>
                  <TouchableOpacity style={[styles.planActionBtn, { borderColor: theme.border }]} onPress={() => swapExercise(ex.exerciseId)}>
                    <Text style={[styles.planActionText, { color: theme.textSecondary }]}>Swap</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.colHeaders, { borderTopColor: theme.border, borderBottomColor: theme.border }]}>
                  <Text style={[styles.colHeader, { color: theme.textLabel, width: 32 }]}>SET</Text>
                  <Text style={[styles.colHeader, { color: theme.textLabel, flex: 1 }]}>KG</Text>
                  <Text style={[styles.colHeader, { color: theme.textLabel, flex: 1 }]}>REPS</Text>
                  <View style={{ width: 48 }} />
                </View>

                {ex.sets.map((set, si) => (
                  <View key={si} style={[styles.setRow, { borderBottomColor: theme.border, backgroundColor: set.done ? theme.surfaceSecondary : 'transparent' }]}>
                    <Text style={[styles.setNum, { color: theme.textLabel }]}>{set.setNumber}</Text>
                    <TextInput
                      style={[styles.setInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.textPrimary }]}
                      placeholder="0" placeholderTextColor={theme.textLabel}
                      keyboardType="decimal-pad" value={set.kg}
                      onChangeText={(v) => updateSet(ex.exerciseId, si, 'kg', v)}
                      editable={!set.done}
                    />
                    <TextInput
                      style={[styles.setInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.textPrimary }]}
                      placeholder="0" placeholderTextColor={theme.textLabel}
                      keyboardType="number-pad" value={set.reps}
                      onChangeText={(v) => updateSet(ex.exerciseId, si, 'reps', v)}
                      editable={!set.done}
                    />
                    <TouchableOpacity
                      style={[styles.doneBtn, { backgroundColor: set.done ? theme.accent : 'transparent', borderColor: set.done ? theme.accent : theme.border }]}
                      onPress={() => updateSet(ex.exerciseId, si, 'done', !set.done)}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '600', color: set.done ? '#FFFFFF' : theme.textLabel }}>
                        {set.done ? 'Done' : 'Log'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity style={[styles.addSetBtn, { borderTopColor: theme.border }]} onPress={() => addSet(ex.exerciseId)}>
                  <Text style={[styles.addSetText, { color: theme.accent }]}>+ Add set</Text>
                </TouchableOpacity>
              </View>
            ))}

            {doneSetsCount > 0 && (
              <TouchableOpacity style={[styles.startSessionBtn, { backgroundColor: theme.buttonBackground }]} onPress={handleFinishSession}>
                <Text style={[styles.startSessionText, { color: theme.buttonText }]}>
                  Save session — {doneSetsCount} set{doneSetsCount !== 1 ? 's' : ''} logged
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </>
      )}

      {/* ── BROWSE VIEW ── */}
      {view === 'browse' && (
        <>
          <View style={[styles.browseHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.browseHint, { color: theme.textLabel }]}>
              Adding to: <Text style={{ color: theme.accent, fontWeight: '600' }}>{activeDay.label}</Text>
            </Text>
            <TouchableOpacity onPress={() => setView('planner')}>
              <Text style={[styles.browseCancel, { color: theme.textLabel }]}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <TextInput
              style={[styles.searchInput, { color: theme.textPrimary }]}
              placeholder="Search exercise or muscle..."
              placeholderTextColor={theme.textLabel}
              value={search} onChangeText={setSearch}
              autoCorrect={false} autoCapitalize="none"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Text style={[styles.clearBtn, { color: theme.textLabel }]}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.pill, { backgroundColor: isActive ? theme.accent : theme.surface, borderColor: isActive ? theme.accent : theme.border }]}
                  onPress={() => setSelectedCategory(cat.id as ExerciseCategory | 'all')}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 13, fontWeight: '500', color: isActive ? '#FFFFFF' : theme.textPrimary }}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={[styles.resultsBar, { borderBottomColor: theme.border }]}>
            <Text style={[styles.resultsText, { color: theme.textLabel }]}>{filteredExercises.length} exercises</Text>
            {selectedIds.size > 0 && <Text style={{ fontSize: 12, fontWeight: '600', color: theme.accent }}>{selectedIds.size} selected</Text>}
          </View>

          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const isSelected = selectedIds.has(item.id);
              const inPlan = activeDay.exercises.some((e) => e.exerciseId === item.id);
              return (
                <TouchableOpacity
                  style={[styles.exRow, { backgroundColor: isSelected ? theme.surface : 'transparent', borderBottomColor: theme.border }]}
                  onPress={() => !inPlan && toggleExercise(item.id)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.checkbox, { borderColor: inPlan ? theme.textLabel : isSelected ? theme.accent : theme.border, backgroundColor: inPlan ? theme.surfaceSecondary : isSelected ? theme.accent : 'transparent' }]}>
                    {(isSelected || inPlan) && <Text style={{ color: inPlan ? theme.textLabel : '#FFFFFF', fontSize: 11, fontWeight: '700' }}>{inPlan ? '·' : '+'}</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.exName, { color: inPlan ? theme.textLabel : theme.textPrimary }]}>{item.name}{inPlan ? '  · in plan' : ''}</Text>
                    <Text style={[styles.exMuscle, { color: theme.textLabel }]}>{item.primaryMuscle}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {selectedIds.size > 0 && (
            <View style={[styles.ctaBar, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
              <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: theme.buttonBackground }]} onPress={addSelectedToDay} activeOpacity={0.8}>
                <Text style={[styles.ctaBtnText, { color: theme.buttonText }]}>Add {selectedIds.size} exercise{selectedIds.size !== 1 ? 's' : ''} to {activeDay.label}</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 0, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: '500', letterSpacing: -0.3, paddingBottom: 12 },
  headerTabs: { flexDirection: 'row' },
  headerTab: { paddingHorizontal: 16, paddingVertical: 12 },
  headerTabText: { fontSize: 13, fontWeight: '500' },
  dayRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  dayBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, alignItems: 'center', minWidth: 72 },
  dayBtnText: { fontSize: 13, fontWeight: '500' },
  dayDot: { width: 5, height: 5, borderRadius: 3, marginTop: 3 },
  planScroll: { padding: 16, paddingBottom: 40, gap: 12 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '500', letterSpacing: -0.3 },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 20, paddingHorizontal: 30 },
  emptyBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10, marginTop: 8 },
  emptyBtnText: { fontSize: 13, fontWeight: '500' },
  planCard: { borderRadius: 12, borderWidth: 0.5, overflow: 'hidden' },
  planCardHeader: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  planCardName: { fontSize: 14, fontWeight: '500', marginBottom: 2 },
  planCardCategory: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6 },
  planCardActions: { flexDirection: 'row', gap: 6 },
  planActionBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth: 0.5 },
  planActionText: { fontSize: 10, fontWeight: '500' },
  setCountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 0.5 },
  setCountText: { fontSize: 13 },
  setCountBtns: { flexDirection: 'row', gap: 8 },
  setCountBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 0.5 },
  setCountBtnText: { fontSize: 12, fontWeight: '500' },
  addMoreBtn: { borderWidth: 0.5, borderRadius: 8, padding: 13, alignItems: 'center' },
  addMoreText: { fontSize: 13 },
  startSessionBtn: { borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  startSessionText: { fontSize: 14, fontWeight: '500' },
  sessionBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 0.5 },
  sessionBannerText: { fontSize: 13, fontWeight: '500' },
  sessionBannerLink: { fontSize: 12 },
  colHeaders: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 6, borderTopWidth: 0.5, borderBottomWidth: 0.5, gap: 8 },
  colHeader: { fontSize: 9, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  setRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: 0.5, gap: 8 },
  setNum: { width: 32, fontSize: 13, fontWeight: '500' },
  setInput: { flex: 1, borderWidth: 0.5, borderRadius: 7, paddingVertical: 7, paddingHorizontal: 8, fontSize: 14, fontWeight: '500', textAlign: 'center' },
  doneBtn: { width: 48, height: 34, borderRadius: 7, borderWidth: 0.5, alignItems: 'center', justifyContent: 'center' },
  addSetBtn: { padding: 12, borderTopWidth: 0.5, alignItems: 'center' },
  addSetText: { fontSize: 12, fontWeight: '500' },
  browseHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 0.5 },
  browseHint: { fontSize: 13 },
  browseCancel: { fontSize: 13 },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 10, borderRadius: 10, borderWidth: 0.5, paddingHorizontal: 12, paddingVertical: 9, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  clearBtn: { fontSize: 12, fontWeight: '500' },
  pillRow: { paddingHorizontal: 16, paddingBottom: 10, gap: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, alignItems: 'center', minWidth: 52 },
  resultsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8, borderBottomWidth: 0.5 },
  resultsText: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6 },
  exRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 13, borderBottomWidth: 0.5, gap: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  exName: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  exMuscle: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6 },
  ctaBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, borderTopWidth: 0.5 },
  ctaBtn: { borderRadius: 8, paddingVertical: 13, alignItems: 'center' },
  ctaBtnText: { fontSize: 13, fontWeight: '500' },
});
