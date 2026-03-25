import { Platform } from 'react-native';

let db: any = null;

export function getDatabase(): any {
  if (Platform.OS === 'web') return null;
  if (!db) {
    const SQLite = require('expo-sqlite');
    db = SQLite.openDatabaseSync('vcxpm.db');
  }
  return db;
}

export function initialiseDatabase(): void {
  if (Platform.OS === 'web') return;
  const database = getDatabase();
  database.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS workout_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, profile_id TEXT NOT NULL, date TEXT NOT NULL, split_type TEXT NOT NULL, duration_seconds INTEGER DEFAULT 0, notes TEXT, completed_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS session_sets (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id INTEGER NOT NULL, exercise_id INTEGER NOT NULL, exercise_name TEXT NOT NULL, set_number INTEGER NOT NULL, reps INTEGER, weight_kg REAL, completed INTEGER DEFAULT 0);
    CREATE TABLE IF NOT EXISTS body_measurements (id INTEGER PRIMARY KEY AUTOINCREMENT, profile_id TEXT NOT NULL, date TEXT NOT NULL, weight_kg REAL, neck_cm REAL, shoulders_cm REAL, chest_cm REAL, upper_waist_cm REAL, lower_waist_cm REAL, glutes_cm REAL, thighs_cm REAL, calves_cm REAL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS measurement_goals (id INTEGER PRIMARY KEY AUTOINCREMENT, profile_id TEXT NOT NULL, metric_key TEXT NOT NULL, target_value REAL NOT NULL, created_at TEXT NOT NULL, UNIQUE(profile_id, metric_key));
    CREATE TABLE IF NOT EXISTS progress_photos (id INTEGER PRIMARY KEY AUTOINCREMENT, profile_id TEXT NOT NULL, date TEXT NOT NULL, file_path TEXT NOT NULL, angle TEXT NOT NULL, notes TEXT, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS meal_plans (id INTEGER PRIMARY KEY AUTOINCREMENT, profile_id TEXT NOT NULL, date TEXT NOT NULL, slot TEXT NOT NULL, meal_name TEXT, notes TEXT, calories REAL, protein_g REAL, carbs_g REAL, fat_g REAL, UNIQUE(profile_id, date, slot));
    CREATE TABLE IF NOT EXISTS personal_records (id INTEGER PRIMARY KEY AUTOINCREMENT, profile_id TEXT NOT NULL, exercise_id INTEGER NOT NULL, exercise_name TEXT NOT NULL, record_type TEXT NOT NULL, value REAL NOT NULL, achieved_at TEXT NOT NULL);
  `);
}
