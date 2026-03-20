// ProgressScreen — the progress tab with three sub-sections.
// Sub-navigation: Body | Photos | Charts (reorderable, hideable — v2).
// Each sub-section is a separate component rendered below the pill nav.

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

type SubSection = 'body' | 'photos' | 'charts';

const SUB_SECTIONS: { id: SubSection; label: string }[] = [
  { id: 'body', label: 'Body' },
  { id: 'photos', label: 'Photos' },
  { id: 'charts', label: 'Charts' },
];

// ── Body section — measurements entry form ────────────────────────────────
function BodySection({ theme }: { theme: ReturnType<typeof useTheme> }) {
  const measurements = [
    { key: 'weight', label: 'Weight', unit: 'kg', value: '' },
    { key: 'neck', label: 'Neck', unit: 'cm', value: '' },
    { key: 'shoulders', label: 'Shoulders', unit: 'cm', value: '' },
    { key: 'chest', label: 'Chest', unit: 'cm', value: '' },
    { key: 'upperWaist', label: 'Upper Waist', unit: 'cm', value: '' },
    { key: 'lowerWaist', label: 'Lower Waist', unit: 'cm', value: '' },
    { key: 'glutes', label: 'Glutes', unit: 'cm', value: '' },
    { key: 'thighs', label: 'Thighs', unit: 'cm', value: '' },
    { key: 'calves', label: 'Calves', unit: 'cm', value: '' },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.sectionPad}>
        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
          Today's measurements
        </Text>
        <Text style={[styles.sectionSub, { color: theme.textLabel }]}>
          {new Date().toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </Text>

        {measurements.map((m) => (
          <View
            key={m.key}
            style={[styles.measRow, { borderBottomColor: theme.border }]}
          >
            <Text style={[styles.measLabel, { color: theme.textSecondary }]}>
              {m.label}
            </Text>
            <View style={styles.measRight}>
              <Text style={[styles.measUnit, { color: theme.textLabel }]}>
                {m.unit}
                {m.unit === 'cm' ? ' (in)' : ''}
              </Text>
              <View
                style={[
                  styles.measInput,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.measPlaceholder, { color: theme.textLabel }]}>
                  —
                </Text>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.saveBtn,
            { backgroundColor: theme.buttonBackground },
          ]}
          activeOpacity={0.8}
        >
          <Text style={[styles.saveBtnText, { color: theme.buttonText }]}>
            Save measurements
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ── Photos section — upload and comparison ────────────────────────────────
function PhotosSection({ theme }: { theme: ReturnType<typeof useTheme> }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.sectionPad}>
        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
          Progress photos
        </Text>

        {/* Upload card */}
        <TouchableOpacity
          style={[
            styles.uploadCard,
            { borderColor: theme.border, backgroundColor: theme.surface },
          ]}
          activeOpacity={0.8}
        >
          <View style={styles.uploadIcon}>
            <View style={[styles.uploadIconBody, { borderColor: theme.border }]} />
          </View>
          <Text style={[styles.uploadLabel, { color: theme.textSecondary }]}>
            Upload today's photo
          </Text>
          <Text style={[styles.uploadSub, { color: theme.textLabel }]}>
            FRONT  ·  SIDE  ·  BACK
          </Text>
        </TouchableOpacity>

        {/* Compare section */}
        <Text style={[styles.compareTitle, { color: theme.textLabel }]}>
          COMPARE TWO DATES
        </Text>
        <View style={styles.compareRow}>
          {['Start date', 'End date'].map((label, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.datePickerBtn,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.datePickerLabel, { color: theme.textLabel }]}>
                {label}
              </Text>
              <Text
                style={[styles.datePickerValue, { color: theme.textPrimary }]}
              >
                Select
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.emptyHint, { color: theme.textLabel }]}>
          Upload your first photo to unlock the comparison view.
        </Text>
      </View>
    </ScrollView>
  );
}

// ── Charts section — multi-measure line chart ─────────────────────────────
function ChartsSection({ theme }: { theme: ReturnType<typeof useTheme> }) {
  const measures = [
    { label: 'Weight', colour: '#E24B4A', active: true },
    { label: 'Waist', colour: '#D4537E', active: true },
    { label: 'Chest', colour: '#EF9F27', active: false },
    { label: 'Shoulders', colour: '#639922', active: false },
    { label: 'Thighs', colour: '#BA7517', active: false },
  ];

  const timeRanges = ['2 weeks', '1 month', '3 months', 'All time'];
  const [activeRange, setActiveRange] = useState(0);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.sectionPad}>
        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
          Measurement trends
        </Text>

        {/* Measure toggles */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toggleRow}
        >
          {measures.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.measureToggle,
                {
                  backgroundColor: m.active ? m.colour + '22' : 'transparent',
                  borderColor: m.active ? m.colour : theme.border,
                },
              ]}
            >
              <View
                style={[styles.measureDot, { backgroundColor: m.colour }]}
              />
              <Text
                style={[
                  styles.measureToggleText,
                  { color: m.active ? theme.textPrimary : theme.textLabel },
                ]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time range selector */}
        <View style={styles.timeRow}>
          {timeRanges.map((range, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.timeBtn,
                {
                  backgroundColor:
                    activeRange === i ? theme.pillActive : theme.pillInactive,
                  borderColor:
                    activeRange === i ? theme.pillActive : theme.border,
                },
              ]}
              onPress={() => setActiveRange(i)}
            >
              <Text
                style={[
                  styles.timeBtnText,
                  {
                    color:
                      activeRange === i
                        ? theme.pillActiveText
                        : theme.pillInactiveText,
                  },
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart placeholder — will be replaced with Victory Native XL */}
        <View
          style={[
            styles.chartPlaceholder,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.chartPlaceholderText, { color: theme.textLabel }]}>
            Chart renders here once measurements are logged.{'\n'}
            Victory Native XL — multi-line with goal overlays.
          </Text>
        </View>

        {/* Goal setting */}
        <Text style={[styles.goalTitle, { color: theme.textLabel }]}>
          SET GOALS
        </Text>
        {measures
          .filter((m) => m.active)
          .map((m, i) => (
            <View
              key={i}
              style={[styles.goalRow, { borderBottomColor: theme.border }]}
            >
              <View
                style={[styles.measureDot, { backgroundColor: m.colour }]}
              />
              <Text
                style={[styles.goalLabel, { color: theme.textSecondary }]}
              >
                {m.label}
              </Text>
              <View
                style={[
                  styles.goalInput,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[{ color: theme.textLabel, fontSize: 12 }]}>
                  —
                </Text>
              </View>
              <Text style={[styles.goalUnit, { color: theme.textLabel }]}>
                {m.label === 'Weight' ? 'kg' : 'cm'}
              </Text>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

// ── Main Progress Screen ──────────────────────────────────────────────────
export default function ProgressScreen() {
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState<SubSection>('body');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Progress
        </Text>
      </View>

      {/* Sub-navigation pills */}
      <View
        style={[styles.pillBar, { borderBottomColor: theme.border }]}
      >
        {SUB_SECTIONS.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.pill,
                {
                  backgroundColor: isActive
                    ? theme.pillActive
                    : theme.pillInactive,
                  borderColor: isActive ? theme.pillActive : theme.border,
                },
              ]}
              onPress={() => setActiveSection(s.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.pillText,
                  {
                    color: isActive
                      ? theme.pillActiveText
                      : theme.pillInactiveText,
                  },
                ]}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Section content */}
      <View style={{ flex: 1 }}>
        {activeSection === 'body' && <BodySection theme={theme} />}
        {activeSection === 'photos' && <PhotosSection theme={theme} />}
        {activeSection === 'charts' && <ChartsSection theme={theme} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: 22, fontWeight: '500', letterSpacing: -0.3 },
  pillBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 0.5,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  pillText: { fontSize: 12, fontWeight: '500' },

  sectionPad: { padding: 20, paddingBottom: 40 },
  sectionHeading: { fontSize: 20, fontWeight: '500', letterSpacing: -0.3, marginBottom: 4 },
  sectionSub: { fontSize: 11, marginBottom: 24, textTransform: 'uppercase', letterSpacing: 0.6 },

  measRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 0.5,
  },
  measLabel: { fontSize: 13 },
  measRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  measUnit: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4 },
  measInput: {
    width: 70,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 7,
    borderWidth: 0.5,
    alignItems: 'center',
  },
  measPlaceholder: { fontSize: 13 },
  saveBtn: {
    marginTop: 24,
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
  },
  saveBtnText: { fontSize: 13, fontWeight: '500' },

  uploadCard: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 28,
    alignItems: 'center',
    marginBottom: 28,
  },
  uploadIcon: { marginBottom: 12 },
  uploadIconBody: {
    width: 36,
    height: 28,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  uploadLabel: { fontSize: 14, fontWeight: '500', marginBottom: 5 },
  uploadSub: { fontSize: 10, letterSpacing: 1 },
  compareTitle: {
    fontSize: 9,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  compareRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  datePickerBtn: {
    flex: 1,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  datePickerLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 },
  datePickerValue: { fontSize: 14, fontWeight: '500' },
  emptyHint: { fontSize: 11, textAlign: 'center', lineHeight: 18 },

  toggleRow: { gap: 7, paddingBottom: 14 },
  measureToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 0.5,
  },
  measureDot: { width: 8, height: 8, borderRadius: 4 },
  measureToggleText: { fontSize: 11, fontWeight: '500' },
  timeRow: { flexDirection: 'row', gap: 7, marginBottom: 16, flexWrap: 'wrap' },
  timeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  timeBtnText: { fontSize: 11, fontWeight: '500' },
  chartPlaceholder: {
    height: 180,
    borderRadius: 12,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 24,
  },
  chartPlaceholderText: { fontSize: 12, textAlign: 'center', lineHeight: 20 },
  goalTitle: {
    fontSize: 9,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 0.5,
    gap: 10,
  },
  goalLabel: { flex: 1, fontSize: 13 },
  goalInput: {
    width: 70,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 7,
    borderWidth: 0.5,
    alignItems: 'center',
  },
  goalUnit: { fontSize: 10, width: 24 },
});
