import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, TextInput, Alert, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../theme';
import { useProfileStore } from '../../store/profileStore';
import {
  saveMeasurement, getLatestMeasurement, getMeasurementsInRange,
  saveGoal, getGoals, type MeasurementEntry,
} from '../../database/queries/measurementQueries';

type SubSection = 'body' | 'photos' | 'charts';

const MEASUREMENT_FIELDS = [
  { key: 'weightKg',     label: 'Weight',      unit: 'kg' },
  { key: 'neckCm',       label: 'Neck',        unit: 'cm' },
  { key: 'shouldersCm',  label: 'Shoulders',   unit: 'cm' },
  { key: 'chestCm',      label: 'Chest',       unit: 'cm' },
  { key: 'upperWaistCm', label: 'Upper Waist', unit: 'cm' },
  { key: 'lowerWaistCm', label: 'Lower Waist', unit: 'cm' },
  { key: 'glutesCm',     label: 'Glutes',      unit: 'cm' },
  { key: 'thighsCm',     label: 'Thighs',      unit: 'cm' },
  { key: 'calvesCm',     label: 'Calves',      unit: 'cm' },
];

const CHART_COLOURS: Record<string, string> = {
  weightKg: '#E24B4A', neckCm: '#378ADD', shouldersCm: '#639922',
  chestCm: '#EF9F27', upperWaistCm: '#D4537E', lowerWaistCm: '#9F67E8',
  glutesCm: '#1D9E75', thighsCm: '#BA7517', calvesCm: '#185FA5',
};

const TIME_RANGES = [
  { label: '2 weeks', days: 14 },
  { label: '1 month', days: 30 },
  { label: '3 months', days: 90 },
  { label: 'All time', days: 3650 },
];

function todayString(): string { return new Date().toISOString().split('T')[0]; }
function toInches(cm: number): string { return (cm / 2.54).toFixed(1); }

function BodySection({ theme, profileId }: { theme: any; profileId: string }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [previous, setPrevious] = useState<MeasurementEntry | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try { setPrevious(getLatestMeasurement(profileId)); } catch {}
  }, [profileId]);

  const handleSave = () => {
    const hasValue = Object.values(values).some((v) => v.trim() !== '');
    if (!hasValue) { Alert.alert('Nothing to save', 'Enter at least one measurement.'); return; }
    setSaving(true);
    try {
      saveMeasurement({
        profileId, date: todayString(),
        weightKg:     values.weightKg     ? parseFloat(values.weightKg)     : undefined,
        neckCm:       values.neckCm       ? parseFloat(values.neckCm)       : undefined,
        shouldersCm:  values.shouldersCm  ? parseFloat(values.shouldersCm)  : undefined,
        chestCm:      values.chestCm      ? parseFloat(values.chestCm)      : undefined,
        upperWaistCm: values.upperWaistCm ? parseFloat(values.upperWaistCm) : undefined,
        lowerWaistCm: values.lowerWaistCm ? parseFloat(values.lowerWaistCm) : undefined,
        glutesCm:     values.glutesCm     ? parseFloat(values.glutesCm)     : undefined,
        thighsCm:     values.thighsCm     ? parseFloat(values.thighsCm)     : undefined,
        calvesCm:     values.calvesCm     ? parseFloat(values.calvesCm)     : undefined,
      });
      setPrevious(getLatestMeasurement(profileId));
      setValues({});
      Alert.alert('Saved', 'Measurements saved.');
    } catch { Alert.alert('Error', 'Could not save. Try again.'); }
    finally { setSaving(false); }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.sectionPad}>
        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>Today's measurements</Text>
        <Text style={[styles.sectionSub, { color: theme.textLabel }]}>
          {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
        {MEASUREMENT_FIELDS.map((field) => {
          const prev = previous ? (previous as any)[field.key] : null;
          return (
            <View key={field.key} style={[styles.measRow, { borderBottomColor: theme.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.measLabel, { color: theme.textSecondary }]}>{field.label}</Text>
                {prev != null && (
                  <Text style={[styles.measPrev, { color: theme.textLabel }]}>
                    Last: {prev} {field.unit}{field.unit === 'cm' ? ` (${toInches(prev)} in)` : ''}
                  </Text>
                )}
              </View>
              <View style={styles.measRight}>
                <TextInput
                  style={[styles.measInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
                  placeholder={prev != null ? String(prev) : '—'}
                  placeholderTextColor={theme.textLabel}
                  keyboardType="decimal-pad"
                  value={values[field.key] ?? ''}
                  onChangeText={(v) => setValues((p) => ({ ...p, [field.key]: v }))}
                />
                <Text style={[styles.measUnit, { color: theme.textLabel }]}>{field.unit}</Text>
              </View>
            </View>
          );
        })}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: saving ? theme.surfaceSecondary : theme.buttonBackground }]}
          onPress={handleSave} disabled={saving} activeOpacity={0.8}
        >
          <Text style={[styles.saveBtnText, { color: theme.buttonText }]}>
            {saving ? 'Saving...' : 'Save measurements'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function PhotosSection({ theme }: { theme: any }) {
  const [photos, setPhotos] = useState<{ uri: string; date: string; angle: string }[]>([]);
  const [selectedAngle, setSelectedAngle] = useState('Front');
  const angles = ['Front', 'Side', 'Back'];

  const handleUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Allow access to your photos.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [3, 4], quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      setPhotos((prev) => [{ uri: result.assets[0].uri, date: today, angle: selectedAngle }, ...prev]);
    }
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Allow camera access.'); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [3, 4], quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      setPhotos((prev) => [{ uri: result.assets[0].uri, date: today, angle: selectedAngle }, ...prev]);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.sectionPad}>
        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>Progress photos</Text>
        <View style={styles.angleRow}>
          {angles.map((a) => (
            <TouchableOpacity
              key={a}
              style={[styles.angleBtn, { backgroundColor: selectedAngle === a ? theme.accent : theme.surface, borderColor: selectedAngle === a ? theme.accent : theme.border }]}
              onPress={() => setSelectedAngle(a)}
            >
              <Text style={{ fontSize: 12, fontWeight: '500', color: selectedAngle === a ? '#FFFFFF' : theme.textSecondary }}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.uploadBtns}>
          <TouchableOpacity style={[styles.uploadBtn, { backgroundColor: theme.buttonBackground }]} onPress={handleCamera} activeOpacity={0.8}>
            <Text style={[styles.uploadBtnText, { color: theme.buttonText }]}>Take photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.uploadBtn, { backgroundColor: theme.surface, borderWidth: 0.5, borderColor: theme.border }]} onPress={handleUpload} activeOpacity={0.8}>
            <Text style={[styles.uploadBtnText, { color: theme.textSecondary }]}>Choose from gallery</Text>
          </TouchableOpacity>
        </View>
        {photos.length === 0 ? (
          <Text style={[styles.emptyHint, { color: theme.textLabel }]}>No photos yet. Take your first progress photo above.</Text>
        ) : (
          <View style={styles.photoGrid}>
            {photos.map((p, i) => (
              <View key={i} style={[styles.photoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Image source={{ uri: p.uri }} style={styles.photoThumb} />
                <Text style={[styles.photoLabel, { color: theme.textSecondary }]}>{p.angle}</Text>
                <Text style={[styles.photoDate, { color: theme.textLabel }]}>{p.date}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function ChartsSection({ theme, profileId }: { theme: any; profileId: string }) {
  const [activeRange, setActiveRange] = useState(0);
  const [data, setData] = useState<MeasurementEntry[]>([]);
  const [activeMetrics, setActiveMetrics] = useState<Set<string>>(new Set(['weightKg', 'upperWaistCm']));
  const [goals, setGoals] = useState<Record<string, number>>({});
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [goalInput, setGoalInput] = useState('');

  useEffect(() => {
    try {
      const toDate = todayString();
      const from = new Date();
      from.setDate(from.getDate() - TIME_RANGES[activeRange].days);
      setData(getMeasurementsInRange(profileId, from.toISOString().split('T')[0], toDate));
      setGoals(getGoals(profileId));
    } catch {}
  }, [profileId, activeRange]);

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });
  };

  const handleSaveGoal = (key: string) => {
    const val = parseFloat(goalInput);
    if (isNaN(val)) return;
    saveGoal(profileId, key, val);
    setGoals((p) => ({ ...p, [key]: val }));
    setEditingGoal(null);
    setGoalInput('');
  };

  const firstKey = Array.from(activeMetrics)[0];
  let allValues: number[] = [];
  activeMetrics.forEach((key) => { data.forEach((d) => { const v = (d as any)[key]; if (v != null) allValues.push(v); }); });
  const minVal = allValues.length ? Math.min(...allValues) * 0.97 : 0;
  const maxVal = allValues.length ? Math.max(...allValues) * 1.03 : 100;
  const range = maxVal - minVal || 1;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.sectionPad}>
        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>Measurement trends</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7, paddingBottom: 12 }}>
          {MEASUREMENT_FIELDS.map((f) => {
            const isActive = activeMetrics.has(f.key);
            const colour = CHART_COLOURS[f.key];
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.metricToggle, { backgroundColor: isActive ? colour + '22' : 'transparent', borderColor: isActive ? colour : theme.border }]}
                onPress={() => toggleMetric(f.key)}
              >
                <View style={[styles.metricDot, { backgroundColor: colour }]} />
                <Text style={[styles.metricToggleText, { color: isActive ? theme.textPrimary : theme.textLabel }]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.timeRow}>
          {TIME_RANGES.map((r, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.timeBtn, { backgroundColor: activeRange === i ? theme.pillActive : theme.pillInactive, borderColor: activeRange === i ? theme.pillActive : theme.border }]}
              onPress={() => setActiveRange(i)}
            >
              <Text style={[styles.timeBtnText, { color: activeRange === i ? theme.pillActiveText : theme.pillInactiveText }]}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.chartBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {data.length < 2 ? (
            <View style={styles.chartEmpty}>
              <Text style={[styles.chartEmptyText, { color: theme.textLabel }]}>Log at least 2 measurements to see the chart.</Text>
            </View>
          ) : (
            <View style={{ padding: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 3 }}>
                {data.map((d, i) => {
                  const v = firstKey ? (d as any)[firstKey] : null;
                  if (v == null) return <View key={i} style={{ flex: 1 }} />;
                  const heightPct = Math.max(((v - minVal) / range) * 100, 2);
                  return <View key={i} style={{ flex: 1, height: `${heightPct}%` as any, backgroundColor: CHART_COLOURS[firstKey] || theme.accent, borderRadius: 2, opacity: 0.85 }} />;
                })}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                <Text style={[styles.axisLabel, { color: theme.textLabel }]}>{data[0]?.date.slice(5)}</Text>
                <Text style={[styles.axisLabel, { color: theme.textLabel }]}>{data[data.length - 1]?.date.slice(5)}</Text>
              </View>
            </View>
          )}
        </View>
        <Text style={[styles.goalTitle, { color: theme.textLabel }]}>SET GOALS</Text>
        {MEASUREMENT_FIELDS.map((f) => {
          const currentGoal = goals[f.key];
          const isEditing = editingGoal === f.key;
          return (
            <View key={f.key} style={[styles.goalRow, { borderBottomColor: theme.border }]}>
              <View style={[styles.metricDot, { backgroundColor: CHART_COLOURS[f.key] }]} />
              <Text style={[styles.goalLabel, { color: theme.textSecondary }]}>{f.label}</Text>
              {isEditing ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <TextInput
                    style={[styles.goalInput, { backgroundColor: theme.surface, borderColor: theme.accent, color: theme.textPrimary }]}
                    value={goalInput} onChangeText={setGoalInput}
                    keyboardType="decimal-pad" autoFocus
                    placeholder="Target" placeholderTextColor={theme.textLabel}
                  />
                  <TouchableOpacity onPress={() => handleSaveGoal(f.key)} style={[styles.goalSaveBtn, { backgroundColor: theme.accent }]}>
                    <Text style={{ fontSize: 11, fontWeight: '500', color: theme.buttonText }}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditingGoal(null)}>
                    <Text style={{ fontSize: 11, color: theme.textLabel }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => { setEditingGoal(f.key); setGoalInput(currentGoal ? String(currentGoal) : ''); }}>
                  <Text style={[styles.goalValue, { color: currentGoal ? theme.accent : theme.textLabel }]}>
                    {currentGoal ? `${currentGoal} ${f.unit}` : 'Set goal'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default function ProgressScreen() {
  const theme = useTheme();
  const { getActiveProfile } = useProfileStore();
  const profile = getActiveProfile();
  const [activeSection, setActiveSection] = useState<SubSection>('body');
  if (!profile) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Progress</Text>
      </View>
      <View style={[styles.pillBar, { borderBottomColor: theme.border }]}>
        {([{ id: 'body', label: 'Body' }, { id: 'photos', label: 'Photos' }, { id: 'charts', label: 'Charts' }] as const).map((s) => {
          const isActive = activeSection === s.id;
          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.pill, { backgroundColor: isActive ? theme.accent : theme.surface, borderColor: isActive ? theme.accent : theme.border }]}
              onPress={() => setActiveSection(s.id)} activeOpacity={0.8}
            >
              <Text style={[styles.pillText, { color: isActive ? '#FFFFFF' : theme.textSecondary }]}>{s.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ flex: 1 }}>
        {activeSection === 'body'   && <BodySection   theme={theme} profileId={profile.id} />}
        {activeSection === 'photos' && <PhotosSection theme={theme} />}
        {activeSection === 'charts' && <ChartsSection theme={theme} profileId={profile.id} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: '500', letterSpacing: -0.3 },
  pillBar: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8, borderBottomWidth: 0.5 },
  pill: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 0.5 },
  pillText: { fontSize: 12, fontWeight: '500' },
  sectionPad: { padding: 20, paddingBottom: 40 },
  sectionHeading: { fontSize: 20, fontWeight: '500', letterSpacing: -0.3, marginBottom: 4 },
  sectionSub: { fontSize: 11, marginBottom: 24, textTransform: 'uppercase', letterSpacing: 0.6 },
  measRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 0.5 },
  measLabel: { fontSize: 13, fontWeight: '500' },
  measPrev: { fontSize: 10, marginTop: 2 },
  measRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  measInput: { width: 72, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 7, borderWidth: 0.5, fontSize: 14, fontWeight: '500', textAlign: 'center' },
  measUnit: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4, width: 20 },
  saveBtn: { marginTop: 24, borderRadius: 8, paddingVertical: 13, alignItems: 'center' },
  saveBtnText: { fontSize: 13, fontWeight: '500' },
  angleRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  angleBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 0.5, alignItems: 'center' },
  uploadBtns: { gap: 10, marginBottom: 24 },
  uploadBtn: { borderRadius: 8, paddingVertical: 13, alignItems: 'center' },
  uploadBtnText: { fontSize: 13, fontWeight: '500' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoCard: { width: '47%', borderRadius: 10, borderWidth: 0.5, overflow: 'hidden' },
  photoThumb: { width: '100%', aspectRatio: 3 / 4 },
  photoLabel: { fontSize: 11, fontWeight: '500', paddingHorizontal: 8, paddingTop: 6 },
  photoDate: { fontSize: 10, paddingHorizontal: 8, paddingBottom: 8 },
  emptyHint: { fontSize: 11, textAlign: 'center', lineHeight: 18 },
  metricToggle: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, borderWidth: 0.5 },
  metricDot: { width: 8, height: 8, borderRadius: 4 },
  metricToggleText: { fontSize: 11, fontWeight: '500' },
  timeRow: { flexDirection: 'row', gap: 7, marginBottom: 14, flexWrap: 'wrap' },
  timeBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, borderWidth: 0.5 },
  timeBtnText: { fontSize: 11, fontWeight: '500' },
  chartBox: { borderRadius: 12, borderWidth: 0.5, marginBottom: 14, overflow: 'hidden' },
  chartEmpty: { height: 120, alignItems: 'center', justifyContent: 'center', padding: 20 },
  chartEmptyText: { fontSize: 12, textAlign: 'center', lineHeight: 20 },
  axisLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.3 },
  goalTitle: { fontSize: 9, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 },
  goalRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 0.5, gap: 10 },
  goalLabel: { flex: 1, fontSize: 13 },
  goalValue: { fontSize: 12, fontWeight: '500' },
  goalInput: { width: 70, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 7, borderWidth: 1, fontSize: 13, textAlign: 'center' },
  goalSaveBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
});