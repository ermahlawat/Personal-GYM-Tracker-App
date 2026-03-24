import { getDatabase } from '../schema';

export interface WorkoutSession {
  id?: number;
  profileId: string;
  date: string;
  splitType: string;
  durationSeconds: number;
  notes?: string;
  completedAt: string;
}

export interface SessionSet {
  exerciseId: number;
  exerciseName: string;
  setNumber: number;
  reps?: number;
  weightKg?: number;
  completed: boolean;
}

export function saveWorkoutSession(
  session: Omit<WorkoutSession, 'id'>,
  sets: SessionSet[]
): number {
  const db = getDatabase();

  const result = db.runSync(
    `INSERT INTO workout_sessions (profile_id, date, split_type, duration_seconds, notes, completed_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [session.profileId, session.date, session.splitType, session.durationSeconds, session.notes ?? null, session.completedAt]
  );

  const sessionId = result.lastInsertRowId;

  sets.forEach((set) => {
    db.runSync(
      `INSERT INTO session_sets (session_id, exercise_id, exercise_name, set_number, reps, weight_kg, completed)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [sessionId, set.exerciseId, set.exerciseName, set.setNumber, set.reps ?? null, set.weightKg ?? null, set.completed ? 1 : 0]
    );
  });

  // Auto-detect personal records
  checkPersonalRecords(session.profileId, sets);

  return sessionId;
}

export function getWorkoutSessions(profileId: string) {
  const db = getDatabase();
  return db.getAllSync<any>(
    `SELECT * FROM workout_sessions WHERE profile_id = ? ORDER BY date DESC`,
    [profileId]
  );
}

export function getSessionSets(sessionId: number) {
  const db = getDatabase();
  return db.getAllSync<any>(
    `SELECT * FROM session_sets WHERE session_id = ? ORDER BY exercise_id, set_number`,
    [sessionId]
  );
}

// Get the previous session's sets for an exercise — used to pre-fill inputs
export function getLastSetsForExercise(profileId: string, exerciseId: number): any[] {
  const db = getDatabase();
  const lastSession = db.getFirstSync<any>(
    `SELECT ws.id FROM workout_sessions ws
     INNER JOIN session_sets ss ON ss.session_id = ws.id
     WHERE ws.profile_id = ? AND ss.exercise_id = ?
     ORDER BY ws.date DESC LIMIT 1`,
    [profileId, exerciseId]
  );
  if (!lastSession) return [];
  return db.getAllSync<any>(
    `SELECT * FROM session_sets WHERE session_id = ? AND exercise_id = ? ORDER BY set_number`,
    [lastSession.id, exerciseId]
  );
}

export function getPersonalRecords(profileId: string): any[] {
  const db = getDatabase();
  return db.getAllSync<any>(
    `SELECT * FROM personal_records WHERE profile_id = ? ORDER BY achieved_at DESC`,
    [profileId]
  );
}

function checkPersonalRecords(profileId: string, sets: SessionSet[]): void {
  const db = getDatabase();
  const now = new Date().toISOString();

  const byExercise = new Map<number, SessionSet[]>();
  sets.forEach((set) => {
    if (!byExercise.has(set.exerciseId)) byExercise.set(set.exerciseId, []);
    byExercise.get(set.exerciseId)!.push(set);
  });

  byExercise.forEach((exSets, exerciseId) => {
    const completed = exSets.filter((s) => s.completed && s.weightKg && s.reps);
    if (!completed.length) return;

    const best = completed.sort((a, b) => (b.weightKg! * b.reps!) - (a.weightKg! * a.reps!))[0];
    const bestVolume = best.weightKg! * best.reps!;

    const existing = db.getFirstSync<any>(
      `SELECT value FROM personal_records WHERE profile_id = ? AND exercise_id = ? AND record_type = 'best_set' ORDER BY value DESC LIMIT 1`,
      [profileId, exerciseId]
    );

    if (!existing || bestVolume > existing.value) {
      db.runSync(
        `INSERT INTO personal_records (profile_id, exercise_id, exercise_name, record_type, value, achieved_at) VALUES (?, ?, ?, 'best_set', ?, ?)`,
        [profileId, exerciseId, best.exerciseName, bestVolume, now]
      );
    }
  });
}