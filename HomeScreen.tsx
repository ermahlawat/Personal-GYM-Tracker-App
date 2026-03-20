// HomeScreen — the main landing screen after onboarding.
// Shows: time-aware greeting, today's plan card, weekly grid,
// quick stats row, and a streak display.
// All colours come from useTheme() — renders correctly in all 3 themes.

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useProfileStore } from '../../store/profileStore';
import { AppText } from '../../components/common/AppText';
import { AppButton } from '../../components/common/AppButton';

// Days of the week for the consistency grid
const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Returns a greeting based on current hour
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Returns today's day index (0 = Monday ... 6 = Sunday)
function getTodayIndex(): number {
  const day = new Date().getDay(); // 0 = Sunday
  return day === 0 ? 6 : day - 1; // convert to Mon-based
}

// Format today's date as "Wednesday, 19 March 2025"
function formatDate(): string {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { getActiveProfile, profiles, setActiveProfile } = useProfileStore();
  const profile = getActiveProfile();
  const todayIndex = getTodayIndex();

  // ── Placeholder data ─────────────────────────────────────────────────────
  // These will be replaced with real SQLite queries in later sessions.
  const todayPlan = {
    splitType: 'Leg Day',
    exercises: [
      'Barbell Squat',
      'Romanian Deadlift',
      'Leg Press',
      'Hip Thrust',
    ],
    totalExercises: 7,
  };

  const quickStats = {
    lastWeight: profile?.goal === 'muscle' ? '80.4 kg' : '64.2 kg',
    weeklyChange: profile?.goal === 'muscle' ? '+0.3 kg' : '−0.8 kg',
    daysThisWeek: 3,
  };

  const streak = 12;

  // Which days have a workout logged (placeholder — will come from SQLite)
  const completedDays = [0, 1, 3]; // Mon, Tue, Thu done

  // The other profile — shown in switcher
  const otherProfile = profiles.find((p) => p.id !== profile?.id);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={theme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* ── Top header ── */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.appName, { color: theme.textLabel }]}>
          VCxPM Fitness
        </Text>

        {/* Avatar — opens profile drawer (navigation placeholder) */}
        <TouchableOpacity
          style={[
            styles.avatar,
            {
              backgroundColor:
                profile?.theme === 'pink' ? '#F4C0D1' : theme.surface,
              borderColor:
                profile?.theme === 'pink' ? '#D4537E' : theme.border,
            },
          ]}
          onPress={() => navigation.navigate('ProfileDrawer')}
          activeOpacity={0.8}
        >
          {profile?.avatarPath ? (
            <Image
              source={{ uri: profile.avatarPath }}
              style={styles.avatarImage}
            />
          ) : (
            <Text
              style={[
                styles.avatarInitials,
                {
                  color:
                    profile?.theme === 'pink' ? '#72243E' : theme.textPrimary,
                },
              ]}
            >
              {profile?.abbreviatedName ?? 'PM'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Greeting ── */}
        <View style={styles.greetingBlock}>
          <Text style={[styles.greeting, { color: theme.textPrimary }]}>
            {getGreeting()},{'\n'}
            {profile?.name.split(' ')[0] ?? 'there'}
          </Text>
          <Text style={[styles.dateText, { color: theme.textLabel }]}>
            {formatDate()}
          </Text>
        </View>

        {/* ── Streak strip ── */}
        <View style={[styles.streakStrip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.streakNumber, { color: theme.textPrimary }]}>
            {streak}
          </Text>
          <Text style={[styles.streakLabel, { color: theme.textLabel }]}>
            DAY STREAK
          </Text>
          <View style={[styles.streakDivider, { backgroundColor: theme.border }]} />
          <Text style={[styles.streakGoal, { color: theme.textSecondary }]}>
            {profile?.goal === 'muscle'
              ? 'Muscle gain'
              : profile?.goal === 'weight_loss'
              ? 'Weight loss'
              : 'General fitness'}
          </Text>
        </View>

        {/* ── Today's workout card ── */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardLabel, { color: theme.textLabel }]}>
              TODAY'S WORKOUT
            </Text>
            <Text style={[styles.splitBadge, { color: theme.textPrimary }]}>
              {todayPlan.splitType}
            </Text>
          </View>

          {/* Exercise preview list */}
          {todayPlan.exercises.slice(0, 3).map((ex, i) => (
            <View
              key={i}
              style={[
                styles.exerciseRow,
                { borderBottomColor: theme.border },
              ]}
            >
              <Text style={[styles.exerciseName, { color: theme.textSecondary }]}>
                {ex}
              </Text>
            </View>
          ))}

          {/* Overflow count */}
          <Text style={[styles.moreText, { color: theme.textLabel }]}>
            +{todayPlan.totalExercises - 3} more exercises
          </Text>

          <AppButton
            label="Start workout"
            onPress={() => navigation.navigate('Workout')}
            style={styles.startBtn}
          />
        </View>

        {/* ── Quick stats row ── */}
        <View style={styles.statsRow}>
          {[
            { label: 'WEIGHT', value: quickStats.lastWeight },
            { label: 'THIS WEEK', value: quickStats.weeklyChange },
            { label: 'DAYS TRAINED', value: String(quickStats.daysThisWeek) },
          ].map((stat, i) => (
            <View
              key={i}
              style={[
                styles.statBox,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textLabel }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Weekly consistency grid ── */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardLabel, { color: theme.textLabel }]}>
            THIS WEEK
          </Text>
          <View style={styles.weekGrid}>
            {WEEK_DAYS.map((day, i) => {
              const isDone = completedDays.includes(i);
              const isToday = i === todayIndex;

              return (
                <View key={i} style={styles.dayCell}>
                  <Text
                    style={[
                      styles.dayLetter,
                      {
                        color: isToday
                          ? theme.textPrimary
                          : theme.textLabel,
                        fontWeight: isToday ? '500' : '400',
                      },
                    ]}
                  >
                    {day}
                  </Text>
                  <View
                    style={[
                      styles.dayDot,
                      isDone && {
                        backgroundColor: theme.accent,
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                      },
                      isToday &&
                        !isDone && {
                          borderWidth: 1,
                          borderColor: theme.textPrimary,
                          backgroundColor: 'transparent',
                        },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Switch profile strip ── */}
        {otherProfile && (
          <TouchableOpacity
            style={[
              styles.switchStrip,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={() => setActiveProfile(otherProfile.id)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.switchAvatar,
                {
                  backgroundColor:
                    otherProfile.theme === 'pink' ? '#F4C0D1' : '#2A2A2A',
                  borderColor:
                    otherProfile.theme === 'pink' ? '#D4537E' : '#444',
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '500',
                  color:
                    otherProfile.theme === 'pink' ? '#72243E' : '#FFFFFF',
                }}
              >
                {otherProfile.abbreviatedName}
              </Text>
            </View>
            <Text style={[styles.switchText, { color: theme.textSecondary }]}>
              Switch to {otherProfile.name.split(' ')[0]}
            </Text>
            <Text style={[styles.switchArrow, { color: theme.textLabel }]}>
              →
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  appName: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: 34, height: 34, borderRadius: 17 },
  avatarInitials: { fontSize: 12, fontWeight: '500' },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 14,
  },

  greetingBlock: { marginBottom: 4 },
  greeting: {
    fontSize: 32,
    fontWeight: '500',
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: 6,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 0.4,
  },

  streakStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  streakNumber: { fontSize: 22, fontWeight: '500', letterSpacing: -0.5 },
  streakLabel: {
    fontSize: 9,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  streakDivider: { width: 0.5, height: 20, marginHorizontal: 4 },
  streakGoal: { fontSize: 12, flex: 1 },

  card: {
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  splitBadge: { fontSize: 13, fontWeight: '500' },

  exerciseRow: {
    paddingVertical: 9,
    borderBottomWidth: 0.5,
  },
  exerciseName: { fontSize: 13 },
  moreText: {
    fontSize: 11,
    marginTop: 10,
    marginBottom: 14,
  },
  startBtn: { width: '100%' },

  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 0.5,
    padding: 12,
    alignItems: 'flex-start',
  },
  statValue: { fontSize: 18, fontWeight: '500', letterSpacing: -0.3, marginBottom: 3 },
  statLabel: {
    fontSize: 8,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  dayCell: { alignItems: 'center', gap: 6 },
  dayLetter: { fontSize: 11 },
  dayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },

  switchStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  switchAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchText: { flex: 1, fontSize: 12 },
  switchArrow: { fontSize: 14 },
});
