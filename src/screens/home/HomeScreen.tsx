import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useProfileStore } from '../../store/profileStore';
import { AppButton } from '../../components/common/AppButton';
import {
  getLatestMeasurement,
  getSessionsThisWeek,
  getSessionDates,
  getLatestSession,
} from '../../database';

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

function getTodayIndex(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function calculateStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const sorted = [...dates].sort((a, b) => b.localeCompare(a));
  let streak = 0;
  const current = new Date();
  for (const date of sorted) {
    const expected = current.toISOString().split('T')[0];
    if (date === expected) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else break;
  }
  return streak;
}

function getCompletedDaysThisWeek(dates: string[]): number[] {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  const completed: number[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    if (dates.includes(d.toISOString().split('T')[0])) completed.push(i);
  }
  return completed;
}

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { getActiveProfile, profiles, setActiveProfile } = useProfileStore();
  const profile = getActiveProfile();
  const todayIndex = getTodayIndex();

  const [latestWeight, setLatestWeight] = useState('—');
  const [daysThisWeek, setDaysThisWeek] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [lastSession, setLastSession] = useState<{ splitType: string; date: string } | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      try {
        const latest = getLatestMeasurement(profile.id);
        setLatestWeight(latest?.weightKg ? `${latest.weightKg} kg` : '—');
        setDaysThisWeek(getSessionsThisWeek(profile.id));
        const dates = getSessionDates(profile.id);
        setStreak(calculateStreak(dates));
        setCompletedDays(getCompletedDaysThisWeek(dates));
        setLastSession(getLatestSession(profile.id));
      } catch (e) {
        console.warn('HomeScreen data load failed:', e);
      }
    }, [profile?.id])
  );

  const otherProfile = profiles.find((p) => p.id !== profile?.id);
  const goalLabel = profile?.goal === 'muscle' ? 'Muscle gain' : profile?.goal === 'weight_loss' ? 'Weight loss' : 'General fitness';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} translucent={false} />

      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.appName, { color: theme.textLabel }]}>VCxPM FITNESS</Text>
        <TouchableOpacity
          style={[styles.avatar, { backgroundColor: profile?.theme === 'pink' ? '#F4C0D1' : theme.surface, borderColor: profile?.theme === 'pink' ? '#D4537E' : theme.border }]}
          onPress={() => navigation.navigate('ProfileDrawer')}
          activeOpacity={0.8}
        >
          {profile?.avatarPath ? (
            <Image source={{ uri: profile.avatarPath }} style={styles.avatarImage} />
          ) : (
            <Text style={[styles.avatarInitials, { color: profile?.theme === 'pink' ? '#72243E' : theme.textPrimary }]}>
              {profile?.abbreviatedName ?? 'PM'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.greetingBlock}>
          <Text style={[styles.greeting, { color: theme.textPrimary }]}>
            {getGreeting()},{'\n'}{profile?.name.split(' ')[0] ?? 'there'}
          </Text>
          <Text style={[styles.dateText, { color: theme.textLabel }]}>{formatDate()}</Text>
        </View>

        <View style={[styles.streakStrip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.streakLeft}>
            <Text style={[styles.streakNumber, { color: theme.textPrimary }]}>{streak}</Text>
            <Text style={[styles.streakLabel, { color: theme.textLabel }]}>DAY{'\n'}STREAK</Text>
          </View>
          <View style={[styles.streakDivider, { backgroundColor: theme.border }]} />
          <View style={styles.streakRight}>
            <Text style={[styles.streakGoalLabel, { color: theme.textLabel }]}>GOAL</Text>
            <Text style={[styles.streakGoal, { color: theme.textSecondary }]}>{goalLabel}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardLabel, { color: theme.textLabel }]}>TODAY'S WORKOUT</Text>
            {lastSession && (
              <Text style={[styles.lastSessionText, { color: theme.textLabel }]}>Last: {lastSession.splitType}</Text>
            )}
          </View>
          <Text style={[styles.cardHint, { color: theme.textSecondary }]}>Plan and log today's session</Text>
          <AppButton label="Open workout planner" onPress={() => navigation.navigate('Workout')} style={styles.startBtn} />
          <TouchableOpacity style={styles.historyBtn} onPress={() => navigation.navigate('WorkoutHistory')} activeOpacity={0.7}>
            <Text style={[styles.historyBtnText, { color: theme.textLabel }]}>View workout history</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: 'WEIGHT', value: latestWeight },
            { label: 'THIS WEEK', value: `${daysThisWeek}d` },
            { label: 'STREAK', value: streak > 0 ? `${streak}d` : '—' },
          ].map((stat, i) => (
            <View key={i} style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textLabel }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardLabel, { color: theme.textLabel }]}>THIS WEEK</Text>
          <View style={styles.weekGrid}>
            {WEEK_DAYS.map((day, i) => {
              const isDone = completedDays.includes(i);
              const isToday = i === todayIndex;
              return (
                <View key={i} style={styles.dayCell}>
                  <Text style={[styles.dayLetter, { color: isToday ? theme.textPrimary : theme.textLabel, fontWeight: isToday ? '600' : '400' }]}>{day}</Text>
                  <View style={[styles.dayDot,
                    isDone && { backgroundColor: theme.accent, width: 8, height: 8, borderRadius: 4 },
                    isToday && !isDone && { borderWidth: 1.5, borderColor: theme.accent, backgroundColor: 'transparent', width: 8, height: 8, borderRadius: 4 },
                  ]} />
                </View>
              );
            })}
          </View>
        </View>

        {otherProfile && (
          <TouchableOpacity
            style={[styles.switchStrip, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setActiveProfile(otherProfile.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.switchAvatar, { backgroundColor: otherProfile.theme === 'pink' ? '#F4C0D1' : theme.surfaceSecondary, borderColor: otherProfile.theme === 'pink' ? '#D4537E' : theme.border }]}>
              <Text style={{ fontSize: 10, fontWeight: '600', color: otherProfile.theme === 'pink' ? '#72243E' : theme.textPrimary }}>
                {otherProfile.abbreviatedName}
              </Text>
            </View>
            <Text style={[styles.switchText, { color: theme.textSecondary }]}>Switch to {otherProfile.name.split(' ')[0]}</Text>
            <Text style={[styles.switchArrow, { color: theme.textLabel }]}>→</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 0.5 },
  appName: { fontSize: 10, fontWeight: '600', letterSpacing: 2.5 },
  avatar: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImage: { width: 34, height: 34, borderRadius: 17 },
  avatarInitials: { fontSize: 12, fontWeight: '500' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, gap: 14 },
  greetingBlock: { marginBottom: 4 },
  greeting: { fontSize: 32, fontWeight: '500', letterSpacing: -0.8, lineHeight: 38, marginBottom: 6 },
  dateText: { fontSize: 11, letterSpacing: 0.4 },
  streakStrip: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 0.5, paddingHorizontal: 16, paddingVertical: 14, gap: 16 },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakNumber: { fontSize: 32, fontWeight: '500', letterSpacing: -1 },
  streakLabel: { fontSize: 9, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, lineHeight: 14 },
  streakDivider: { width: 0.5, height: 28 },
  streakRight: { flex: 1 },
  streakGoalLabel: { fontSize: 9, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  streakGoal: { fontSize: 13 },
  card: { borderRadius: 12, borderWidth: 0.5, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardLabel: { fontSize: 9, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1.2 },
  lastSessionText: { fontSize: 10 },
  cardHint: { fontSize: 13, marginBottom: 14, lineHeight: 18 },
  startBtn: { width: '100%', marginBottom: 8 },
  historyBtn: { alignItems: 'center', paddingVertical: 6 },
  historyBtnText: { fontSize: 12 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: { flex: 1, borderRadius: 10, borderWidth: 0.5, padding: 12 },
  statValue: { fontSize: 18, fontWeight: '500', letterSpacing: -0.3, marginBottom: 3 },
  statLabel: { fontSize: 8, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  weekGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  dayCell: { alignItems: 'center', gap: 6 },
  dayLetter: { fontSize: 11 },
  dayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'transparent' },
  switchStrip: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 10, borderWidth: 0.5, paddingHorizontal: 14, paddingVertical: 11 },
  switchAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  switchText: { flex: 1, fontSize: 12 },
  switchArrow: { fontSize: 14 },
});