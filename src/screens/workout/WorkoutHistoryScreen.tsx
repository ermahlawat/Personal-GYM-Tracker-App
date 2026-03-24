import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { useProfileStore } from '../../store/profileStore';
import { getWorkoutSessions, getSessionSets } from '../../database/queries/workoutQueries';

function formatDuration(seconds: number): string {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export default function WorkoutHistoryScreen({ navigation }: { navigation: any }) {
  const theme = useTheme();
  const { getActiveProfile } = useProfileStore();
  const profile = getActiveProfile();
  const [sessions, setSessions] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [setsCache, setSetsCache] = useState<Record<number, any[]>>({});

  useEffect(() => {
    if (!profile) return;
    try { setSessions(getWorkoutSessions(profile.id) as any[]); } catch (e) {}
  }, [profile?.id]);

  const toggleExpand = (id: number) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (!setsCache[id]) {
      try {
        const sets = getSessionSets(id) as any[];
        setSetsCache((prev) => ({ ...prev, [id]: sets }));
      } catch (e) {}
    }
  };

  const groupSets = (sets: any[]) => {
    const groups: Record<string, any[]> = {};
    sets.forEach((s) => {
      if (!groups[s.exercise_name]) groups[s.exercise_name] = [];
      groups[s.exercise_name].push(s);
    });
    return groups;
  };

  if (!profile) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: theme.textSecondary }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Workout History</Text>
        <View style={{ width: 50 }} />
      </View>

      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No sessions yet</Text>
          <Text style={[styles.emptySub, { color: theme.textLabel }]}>Complete your first workout to see it here.</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isExpanded = expandedId === item.id;
            const sets = setsCache[item.id] ?? [];
            const groups = isExpanded ? groupSets(sets) : {};
            return (
              <TouchableOpacity
                style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sessionType, { color: theme.textPrimary }]}>{item.split_type}</Text>
                    <Text style={[styles.sessionDate, { color: theme.textLabel }]}>{formatDate(item.date)}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text style={[styles.duration, { color: theme.textLabel }]}>{formatDuration(item.duration_seconds)}</Text>
                    <Text style={[styles.chevron, { color: theme.textLabel }]}>{isExpanded ? '↑' : '↓'}</Text>
                  </View>
                </View>

                {isExpanded && (
                  <View style={[styles.detail, { borderTopColor: theme.border }]}>
                    {Object.entries(groups).map(([exName, exSets]) => (
                      <View key={exName} style={styles.exGroup}>
                        <Text style={[styles.exName, { color: theme.textPrimary }]}>{exName}</Text>
                        <View style={[styles.setHeaderRow, { borderBottomColor: theme.border }]}>
                          <Text style={[styles.setHeaderText, { color: theme.textLabel, width: 30 }]}>SET</Text>
                          <Text style={[styles.setHeaderText, { color: theme.textLabel, flex: 1 }]}>KG</Text>
                          <Text style={[styles.setHeaderText, { color: theme.textLabel, flex: 1 }]}>REPS</Text>
                        </View>
                        {(exSets as any[]).map((set, i) => (
                          <View key={i} style={[styles.setRow, { borderBottomColor: theme.border }]}>
                            <Text style={[styles.setCell, { color: theme.textLabel, width: 30 }]}>{set.set_number}</Text>
                            <Text style={[styles.setCell, { color: theme.textPrimary, flex: 1 }]}>{set.weight_kg != null ? `${set.weight_kg}` : '—'}</Text>
                            <Text style={[styles.setCell, { color: theme.textPrimary, flex: 1 }]}>{set.reps != null ? set.reps : '—'}</Text>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 0.5 },
  backBtn: { width: 50 },
  backText: { fontSize: 13 },
  headerTitle: { fontSize: 16, fontWeight: '500', letterSpacing: -0.2 },
  list: { padding: 16, gap: 10, paddingBottom: 40 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '500' },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  card: { borderRadius: 12, borderWidth: 0.5, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  sessionType: { fontSize: 14, fontWeight: '500', marginBottom: 3 },
  sessionDate: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  duration: { fontSize: 11 },
  chevron: { fontSize: 14 },
  detail: { borderTopWidth: 0.5, padding: 14, gap: 14 },
  exGroup: { gap: 6 },
  exName: { fontSize: 13, fontWeight: '500', marginBottom: 4 },
  setHeaderRow: { flexDirection: 'row', paddingBottom: 5, borderBottomWidth: 0.5, gap: 8 },
  setHeaderText: { fontSize: 9, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.8 },
  setRow: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 0.5, gap: 8 },
  setCell: { fontSize: 13 },
});
