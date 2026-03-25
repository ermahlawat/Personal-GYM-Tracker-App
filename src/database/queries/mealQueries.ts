import { Platform } from 'react-native';
import { getDatabase } from '../schema';

export interface MealPlanEntry { profileId: string; date: string; slot: string; mealName?: string; notes?: string; calories?: number; proteinG?: number; carbsG?: number; fatG?: number; }

export function saveMealSlot(entry: MealPlanEntry): void {
  if (Platform.OS === 'web') return;
  const db = getDatabase();
  db.runSync(`INSERT INTO meal_plans (profile_id, date, slot, meal_name, notes, calories, protein_g, carbs_g, fat_g) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(profile_id, date, slot) DO UPDATE SET meal_name = excluded.meal_name, notes = excluded.notes, calories = excluded.calories, protein_g = excluded.protein_g, carbs_g = excluded.carbs_g, fat_g = excluded.fat_g`, [entry.profileId, entry.date, entry.slot, entry.mealName ?? null, entry.notes ?? null, entry.calories ?? null, entry.proteinG ?? null, entry.carbsG ?? null, entry.fatG ?? null]);
}

export function getMealsForDate(profileId: string, date: string): MealPlanEntry[] {
  if (Platform.OS === 'web') return [];
  const rows = getDatabase().getAllSync<any>(`SELECT * FROM meal_plans WHERE profile_id = ? AND date = ?`, [profileId, date]);
  return rows.map((row: any) => ({ profileId: row.profile_id, date: row.date, slot: row.slot, mealName: row.meal_name ?? undefined, notes: row.notes ?? undefined, calories: row.calories ?? undefined, proteinG: row.protein_g ?? undefined, carbsG: row.carbs_g ?? undefined, fatG: row.fat_g ?? undefined }));
}
