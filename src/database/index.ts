import { Platform } from 'react-native';
export { getDatabase, initialiseDatabase } from './schema';
export { saveMeasurement, getMeasurements, getLatestMeasurement, getMeasurementsInRange, saveGoal, getGoals } from './queries/measurementQueries';
export { saveWorkoutSession, getWorkoutSessions, getSessionSets, getLastSetsForExercise, getPersonalRecords } from './queries/workoutQueries';
export { saveMealSlot, getMealsForDate } from './queries/mealQueries';
import { getDatabase } from './schema';

export function getSessionsThisWeek(profileId: string): number {
  if (Platform.OS === 'web') return 0;
  try {
    const db = getDatabase();
    const now = new Date(); const day = now.getDay(); const monday = new Date(now); monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    const row = db.getFirstSync<{ count: number }>(`SELECT COUNT(DISTINCT date) as count FROM workout_sessions WHERE profile_id = ? AND date >= ? AND date <= ?`, [profileId, monday.toISOString().split('T')[0], now.toISOString().split('T')[0]]);
    return row?.count ?? 0;
  } catch { return 0; }
}

export function getSessionDates(profileId: string): string[] {
  if (Platform.OS === 'web') return [];
  try { return getDatabase().getAllSync<{ date: string }>(`SELECT DISTINCT date FROM workout_sessions WHERE profile_id = ? ORDER BY date DESC`, [profileId]).map((r) => r.date); } catch { return []; }
}

export function getLatestSession(profileId: string): { splitType: string; date: string } | null {
  if (Platform.OS === 'web') return null;
  try {
    const row = getDatabase().getFirstSync<{ split_type: string; date: string }>(`SELECT split_type, date FROM workout_sessions WHERE profile_id = ? ORDER BY date DESC LIMIT 1`, [profileId]);
    return row ? { splitType: row.split_type, date: row.date } : null;
  } catch { return null; }
}
