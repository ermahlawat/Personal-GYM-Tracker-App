import { getDatabase } from '../schema';

export interface MeasurementEntry {
  id?: number;
  profileId: string;
  date: string;
  weightKg?: number;
  neckCm?: number;
  shouldersCm?: number;
  chestCm?: number;
  upperWaistCm?: number;
  lowerWaistCm?: number;
  glutesCm?: number;
  thighsCm?: number;
  calvesCm?: number;
  createdAt?: string;
}

export function saveMeasurement(entry: MeasurementEntry): void {
  const db = getDatabase();
  const now = new Date().toISOString();
  db.runSync(
    `INSERT INTO body_measurements (
      profile_id, date, weight_kg, neck_cm, shoulders_cm, chest_cm,
      upper_waist_cm, lower_waist_cm, glutes_cm, thighs_cm, calves_cm, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.profileId, entry.date,
      entry.weightKg ?? null, entry.neckCm ?? null,
      entry.shouldersCm ?? null, entry.chestCm ?? null,
      entry.upperWaistCm ?? null, entry.lowerWaistCm ?? null,
      entry.glutesCm ?? null, entry.thighsCm ?? null,
      entry.calvesCm ?? null, now,
    ]
  );
}

export function getMeasurements(profileId: string): MeasurementEntry[] {
  const db = getDatabase();
  const rows = db.getAllSync<any>(
    `SELECT * FROM body_measurements WHERE profile_id = ? ORDER BY date DESC`,
    [profileId]
  );
  return rows.map(rowToEntry);
}

export function getLatestMeasurement(profileId: string): MeasurementEntry | null {
  const db = getDatabase();
  const row = db.getFirstSync<any>(
    `SELECT * FROM body_measurements WHERE profile_id = ? ORDER BY date DESC LIMIT 1`,
    [profileId]
  );
  return row ? rowToEntry(row) : null;
}

export function getMeasurementsInRange(
  profileId: string, fromDate: string, toDate: string
): MeasurementEntry[] {
  const db = getDatabase();
  const rows = db.getAllSync<any>(
    `SELECT * FROM body_measurements WHERE profile_id = ? AND date >= ? AND date <= ? ORDER BY date ASC`,
    [profileId, fromDate, toDate]
  );
  return rows.map(rowToEntry);
}

export function saveGoal(profileId: string, metricKey: string, targetValue: number): void {
  const db = getDatabase();
  const now = new Date().toISOString();
  db.runSync(
    `INSERT INTO measurement_goals (profile_id, metric_key, target_value, created_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(profile_id, metric_key) DO UPDATE SET target_value = excluded.target_value`,
    [profileId, metricKey, targetValue, now]
  );
}

export function getGoals(profileId: string): Record<string, number> {
  const db = getDatabase();
  const rows = db.getAllSync<any>(
    `SELECT metric_key, target_value FROM measurement_goals WHERE profile_id = ?`,
    [profileId]
  );
  const result: Record<string, number> = {};
  rows.forEach((row: any) => { result[row.metric_key] = row.target_value; });
  return result;
}

function rowToEntry(row: any): MeasurementEntry {
  return {
    id: row.id,
    profileId: row.profile_id,
    date: row.date,
    weightKg: row.weight_kg ?? undefined,
    neckCm: row.neck_cm ?? undefined,
    shouldersCm: row.shoulders_cm ?? undefined,
    chestCm: row.chest_cm ?? undefined,
    upperWaistCm: row.upper_waist_cm ?? undefined,
    lowerWaistCm: row.lower_waist_cm ?? undefined,
    glutesCm: row.glutes_cm ?? undefined,
    thighsCm: row.thighs_cm ?? undefined,
    calvesCm: row.calves_cm ?? undefined,
    createdAt: row.created_at,
  };
}