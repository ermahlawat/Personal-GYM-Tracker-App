// exercises.ts — the complete exercise database.
// 120 exercises across 9 categories, bundled with the app (no internet needed).
// Each exercise has a swap_group so the swap feature knows which exercises
// are interchangeable for the same movement pattern.

export type ExerciseCategory =
  | 'push'
  | 'pull'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'upper'
  | 'lower'
  | 'cardio'
  | 'yoga'
  | 'rest';

export interface Exercise {
  id: number;
  name: string;
  category: ExerciseCategory;
  primaryMuscle: string;
  secondaryMuscles: string;
  equipment: string;
  swapGroup: string; // exercises with the same swapGroup are interchangeable
  custom: boolean;
}

export const EXERCISES: Exercise[] = [
  // ── PUSH (18) ───────────────────────────────────────────────────────────
  { id: 1,  name: 'Barbell Bench Press',        category: 'push', primaryMuscle: 'Pectorals, Triceps',          secondaryMuscles: 'Front Deltoids',          equipment: 'Barbell, Flat bench',      swapGroup: 'horizontal-press',  custom: false },
  { id: 2,  name: 'Incline Barbell Press',       category: 'push', primaryMuscle: 'Upper Pectorals, Triceps',   secondaryMuscles: 'Front Deltoids',          equipment: 'Barbell, Incline bench',   swapGroup: 'incline-press',     custom: false },
  { id: 3,  name: 'Decline Barbell Press',       category: 'push', primaryMuscle: 'Lower Pectorals, Triceps',   secondaryMuscles: 'Front Deltoids',          equipment: 'Barbell, Decline bench',   swapGroup: 'horizontal-press',  custom: false },
  { id: 4,  name: 'Dumbbell Bench Press',        category: 'push', primaryMuscle: 'Pectorals, Triceps',          secondaryMuscles: 'Front Deltoids',          equipment: 'Dumbbells, Flat bench',    swapGroup: 'horizontal-press',  custom: false },
  { id: 5,  name: 'Incline Dumbbell Press',      category: 'push', primaryMuscle: 'Upper Pectorals',             secondaryMuscles: 'Front Deltoids, Triceps', equipment: 'Dumbbells, Incline bench', swapGroup: 'incline-press',     custom: false },
  { id: 6,  name: 'Overhead Press (OHP)',        category: 'push', primaryMuscle: 'Deltoids, Triceps',           secondaryMuscles: 'Upper Traps, Core',       equipment: 'Barbell',                  swapGroup: 'vertical-press',    custom: false },
  { id: 7,  name: 'Dumbbell Shoulder Press',     category: 'push', primaryMuscle: 'Deltoids, Triceps',           secondaryMuscles: 'Upper Traps',             equipment: 'Dumbbells, Bench',         swapGroup: 'vertical-press',    custom: false },
  { id: 8,  name: 'Cable Chest Fly',             category: 'push', primaryMuscle: 'Pectorals',                   secondaryMuscles: 'Front Deltoids',          equipment: 'Cable machine',            swapGroup: 'chest-fly',         custom: false },
  { id: 9,  name: 'Pec Deck Machine',            category: 'push', primaryMuscle: 'Pectorals',                   secondaryMuscles: 'Front Deltoids',          equipment: 'Pec deck machine',         swapGroup: 'chest-fly',         custom: false },
  { id: 10, name: 'Dips',                         category: 'push', primaryMuscle: 'Pectorals, Triceps',          secondaryMuscles: 'Front Deltoids',          equipment: 'Dip bars',                 swapGroup: 'horizontal-press',  custom: false },
  { id: 11, name: 'Push-Up',                      category: 'push', primaryMuscle: 'Pectorals, Triceps',          secondaryMuscles: 'Front Deltoids, Core',    equipment: 'Bodyweight',               swapGroup: 'horizontal-press',  custom: false },
  { id: 12, name: 'Tricep Pushdown',              category: 'push', primaryMuscle: 'Triceps',                     secondaryMuscles: '',                        equipment: 'Cable machine',            swapGroup: 'tricep-isolation',  custom: false },
  { id: 13, name: 'Skull Crusher',                category: 'push', primaryMuscle: 'Triceps',                     secondaryMuscles: '',                        equipment: 'Barbell or EZ bar, Bench', swapGroup: 'tricep-isolation',  custom: false },
  { id: 14, name: 'Overhead Tricep Extension',    category: 'push', primaryMuscle: 'Triceps (long head)',          secondaryMuscles: '',                        equipment: 'Dumbbell or cable',        swapGroup: 'tricep-isolation',  custom: false },
  { id: 15, name: 'Close-Grip Bench Press',       category: 'push', primaryMuscle: 'Triceps, Inner Chest',        secondaryMuscles: 'Front Deltoids',          equipment: 'Barbell, Flat bench',      swapGroup: 'tricep-compound',   custom: false },
  { id: 16, name: 'Lateral Raise',                category: 'push', primaryMuscle: 'Lateral Deltoids',            secondaryMuscles: '',                        equipment: 'Dumbbells',                swapGroup: 'lateral-delt',      custom: false },
  { id: 17, name: 'Cable Lateral Raise',          category: 'push', primaryMuscle: 'Lateral Deltoids',            secondaryMuscles: '',                        equipment: 'Cable machine',            swapGroup: 'lateral-delt',      custom: false },
  { id: 18, name: 'Machine Chest Press',          category: 'push', primaryMuscle: 'Pectorals, Triceps',          secondaryMuscles: 'Front Deltoids',          equipment: 'Chest press machine',      swapGroup: 'horizontal-press',  custom: false },

  // ── PULL (18) ───────────────────────────────────────────────────────────
  { id: 19, name: 'Conventional Deadlift',        category: 'pull', primaryMuscle: 'Hamstrings, Glutes, Erectors', secondaryMuscles: 'Traps, Lats, Core',     equipment: 'Barbell',                  swapGroup: 'hip-hinge',         custom: false },
  { id: 20, name: 'Pull-Up',                       category: 'pull', primaryMuscle: 'Lats, Biceps',                secondaryMuscles: 'Rhomboids, Traps',       equipment: 'Pull-up bar',              swapGroup: 'vertical-pull',     custom: false },
  { id: 21, name: 'Chin-Up',                       category: 'pull', primaryMuscle: 'Lats, Biceps',                secondaryMuscles: 'Rhomboids',              equipment: 'Pull-up bar',              swapGroup: 'vertical-pull',     custom: false },
  { id: 22, name: 'Lat Pulldown',                  category: 'pull', primaryMuscle: 'Latissimus Dorsi',            secondaryMuscles: 'Biceps, Rhomboids',      equipment: 'Cable machine',            swapGroup: 'vertical-pull',     custom: false },
  { id: 23, name: 'Seated Cable Row',              category: 'pull', primaryMuscle: 'Mid Back, Rhomboids',         secondaryMuscles: 'Biceps, Rear Delts',     equipment: 'Cable machine',            swapGroup: 'horizontal-pull',   custom: false },
  { id: 24, name: 'Barbell Bent-Over Row',         category: 'pull', primaryMuscle: 'Lats, Rhomboids, Biceps',     secondaryMuscles: 'Erectors, Rear Delts',   equipment: 'Barbell',                  swapGroup: 'horizontal-pull',   custom: false },
  { id: 25, name: 'Dumbbell Single-Arm Row',       category: 'pull', primaryMuscle: 'Lats, Rhomboids',             secondaryMuscles: 'Biceps',                 equipment: 'Dumbbell, Bench',          swapGroup: 'horizontal-pull',   custom: false },
  { id: 26, name: 'T-Bar Row',                     category: 'pull', primaryMuscle: 'Mid Back, Lats',              secondaryMuscles: 'Biceps, Rear Delts',     equipment: 'T-bar or landmine',        swapGroup: 'horizontal-pull',   custom: false },
  { id: 27, name: 'Face Pull',                     category: 'pull', primaryMuscle: 'Rear Deltoids, Rotator Cuff', secondaryMuscles: 'Mid Traps',              equipment: 'Cable machine',            swapGroup: 'rear-delt',         custom: false },
  { id: 28, name: 'Rear Delt Fly',                 category: 'pull', primaryMuscle: 'Rear Deltoids',               secondaryMuscles: 'Rhomboids',              equipment: 'Dumbbells or cables',      swapGroup: 'rear-delt',         custom: false },
  { id: 29, name: 'Shrugs',                        category: 'pull', primaryMuscle: 'Trapezius',                   secondaryMuscles: '',                       equipment: 'Barbell or dumbbells',     swapGroup: 'trap-isolation',    custom: false },
  { id: 30, name: 'Barbell Curl',                  category: 'pull', primaryMuscle: 'Biceps',                      secondaryMuscles: 'Brachialis',             equipment: 'Barbell or EZ bar',        swapGroup: 'bicep-curl',        custom: false },
  { id: 31, name: 'Hammer Curl',                   category: 'pull', primaryMuscle: 'Biceps, Brachialis',          secondaryMuscles: '',                       equipment: 'Dumbbells',                swapGroup: 'bicep-curl',        custom: false },
  { id: 32, name: 'Preacher Curl',                 category: 'pull', primaryMuscle: 'Biceps (short head)',          secondaryMuscles: '',                       equipment: 'EZ bar, Preacher bench',   swapGroup: 'bicep-curl',        custom: false },
  { id: 33, name: 'Concentration Curl',            category: 'pull', primaryMuscle: 'Biceps peak',                 secondaryMuscles: '',                       equipment: 'Dumbbell',                 swapGroup: 'bicep-curl',        custom: false },
  { id: 34, name: 'Cable Curl',                    category: 'pull', primaryMuscle: 'Biceps',                      secondaryMuscles: '',                       equipment: 'Cable machine',            swapGroup: 'bicep-curl',        custom: false },
  { id: 35, name: 'Chest-Supported Row',           category: 'pull', primaryMuscle: 'Mid Back, Rhomboids',         secondaryMuscles: 'Biceps',                 equipment: 'Incline bench, Dumbbells', swapGroup: 'horizontal-pull',   custom: false },
  { id: 36, name: 'Machine Row',                   category: 'pull', primaryMuscle: 'Mid Back, Lats',              secondaryMuscles: 'Biceps',                 equipment: 'Row machine',              swapGroup: 'horizontal-pull',   custom: false },

  // ── LEGS (18) ───────────────────────────────────────────────────────────
  { id: 37, name: 'Barbell Back Squat',            category: 'legs', primaryMuscle: 'Quadriceps, Glutes',          secondaryMuscles: 'Hamstrings, Core',       equipment: 'Barbell, Squat rack',      swapGroup: 'quad-compound',     custom: false },
  { id: 38, name: 'Front Squat',                   category: 'legs', primaryMuscle: 'Quadriceps, Core',            secondaryMuscles: 'Glutes',                 equipment: 'Barbell, Squat rack',      swapGroup: 'quad-compound',     custom: false },
  { id: 39, name: 'Leg Press',                     category: 'legs', primaryMuscle: 'Quadriceps, Glutes',          secondaryMuscles: 'Hamstrings',             equipment: 'Leg press machine',        swapGroup: 'quad-compound',     custom: false },
  { id: 40, name: 'Romanian Deadlift',             category: 'legs', primaryMuscle: 'Hamstrings, Glutes',          secondaryMuscles: 'Erector Spinae',         equipment: 'Barbell or dumbbells',     swapGroup: 'hamstring-hinge',   custom: false },
  { id: 41, name: 'Bulgarian Split Squat',         category: 'legs', primaryMuscle: 'Quadriceps, Glutes',          secondaryMuscles: 'Hip Flexors',            equipment: 'Dumbbells, Bench',         swapGroup: 'unilateral-leg',    custom: false },
  { id: 42, name: 'Lunges',                        category: 'legs', primaryMuscle: 'Quadriceps, Glutes',          secondaryMuscles: 'Hamstrings',             equipment: 'Bodyweight or dumbbells',  swapGroup: 'unilateral-leg',    custom: false },
  { id: 43, name: 'Walking Lunges',                category: 'legs', primaryMuscle: 'Quadriceps, Glutes, Balance', secondaryMuscles: 'Hamstrings, Core',       equipment: 'Bodyweight or dumbbells',  swapGroup: 'unilateral-leg',    custom: false },
  { id: 44, name: 'Hip Thrust',                    category: 'legs', primaryMuscle: 'Gluteus Maximus',             secondaryMuscles: 'Hamstrings, Core',       equipment: 'Barbell, Bench',           swapGroup: 'glute-isolation',   custom: false },
  { id: 45, name: 'Glute Bridge',                  category: 'legs', primaryMuscle: 'Gluteus Maximus',             secondaryMuscles: 'Hamstrings',             equipment: 'Bodyweight or barbell',    swapGroup: 'glute-isolation',   custom: false },
  { id: 46, name: 'Leg Curl (Lying)',              category: 'legs', primaryMuscle: 'Hamstrings',                  secondaryMuscles: '',                       equipment: 'Leg curl machine',         swapGroup: 'hamstring-isolation',custom: false },
  { id: 47, name: 'Leg Curl (Seated)',             category: 'legs', primaryMuscle: 'Hamstrings',                  secondaryMuscles: '',                       equipment: 'Seated leg curl machine',  swapGroup: 'hamstring-isolation',custom: false },
  { id: 48, name: 'Leg Extension',                 category: 'legs', primaryMuscle: 'Quadriceps',                  secondaryMuscles: '',                       equipment: 'Leg extension machine',    swapGroup: 'quad-isolation',    custom: false },
  { id: 49, name: 'Goblet Squat',                  category: 'legs', primaryMuscle: 'Quadriceps, Glutes, Core',    secondaryMuscles: 'Hamstrings',             equipment: 'Dumbbell or kettlebell',   swapGroup: 'quad-compound',     custom: false },
  { id: 50, name: 'Sumo Deadlift',                 category: 'legs', primaryMuscle: 'Inner Thighs, Glutes',        secondaryMuscles: 'Hamstrings, Erectors',   equipment: 'Barbell',                  swapGroup: 'hamstring-hinge',   custom: false },
  { id: 51, name: 'Step-Up',                       category: 'legs', primaryMuscle: 'Quadriceps, Glutes',          secondaryMuscles: 'Hamstrings',             equipment: 'Box or bench, Dumbbells',  swapGroup: 'unilateral-leg',    custom: false },
  { id: 52, name: 'Calf Raise (Standing)',         category: 'legs', primaryMuscle: 'Gastrocnemius',               secondaryMuscles: '',                       equipment: 'Machine or bodyweight',    swapGroup: 'calf-isolation',    custom: false },
  { id: 53, name: 'Calf Raise (Seated)',           category: 'legs', primaryMuscle: 'Soleus',                      secondaryMuscles: '',                       equipment: 'Seated calf raise machine',swapGroup: 'calf-isolation',    custom: false },
  { id: 54, name: 'Nordic Hamstring Curl',         category: 'legs', primaryMuscle: 'Hamstrings (eccentric)',       secondaryMuscles: '',                       equipment: 'Partner or anchor',        swapGroup: 'hamstring-isolation',custom: false },

  // ── SHOULDERS (14) ──────────────────────────────────────────────────────
  { id: 55, name: 'Arnold Press',                  category: 'shoulders', primaryMuscle: 'All three deltoid heads',  secondaryMuscles: 'Triceps',              equipment: 'Dumbbells',                swapGroup: 'vertical-press',    custom: false },
  { id: 56, name: 'Barbell Overhead Press',        category: 'shoulders', primaryMuscle: 'Deltoids, Triceps',        secondaryMuscles: 'Upper Traps, Core',    equipment: 'Barbell',                  swapGroup: 'vertical-press',    custom: false },
  { id: 57, name: 'Dumbbell Lateral Raise',        category: 'shoulders', primaryMuscle: 'Lateral Deltoids',         secondaryMuscles: '',                     equipment: 'Dumbbells',                swapGroup: 'lateral-delt',      custom: false },
  { id: 58, name: 'Front Raise',                   category: 'shoulders', primaryMuscle: 'Anterior Deltoids',        secondaryMuscles: '',                     equipment: 'Dumbbells or plate',       swapGroup: 'front-delt',        custom: false },
  { id: 59, name: 'Upright Row',                   category: 'shoulders', primaryMuscle: 'Lateral Delts, Traps',     secondaryMuscles: '',                     equipment: 'Barbell or dumbbells',     swapGroup: 'lateral-delt',      custom: false },
  { id: 60, name: 'Cable Face Pull',               category: 'shoulders', primaryMuscle: 'Rear Delts, Rotator Cuff', secondaryMuscles: 'Mid Traps',            equipment: 'Cable machine',            swapGroup: 'rear-delt',         custom: false },
  { id: 61, name: 'Machine Shoulder Press',        category: 'shoulders', primaryMuscle: 'Deltoids, Triceps',        secondaryMuscles: '',                     equipment: 'Shoulder press machine',   swapGroup: 'vertical-press',    custom: false },
  { id: 62, name: 'Behind-Neck Press',             category: 'shoulders', primaryMuscle: 'Deltoids (all heads)',     secondaryMuscles: 'Triceps',              equipment: 'Barbell — advanced only',  swapGroup: 'vertical-press',    custom: false },
  { id: 63, name: 'Cable Lateral Raise',           category: 'shoulders', primaryMuscle: 'Lateral Deltoids',         secondaryMuscles: '',                     equipment: 'Cable machine',            swapGroup: 'lateral-delt',      custom: false },
  { id: 64, name: 'Dumbbell Rear Delt Fly',        category: 'shoulders', primaryMuscle: 'Rear Deltoids',            secondaryMuscles: 'Rhomboids',            equipment: 'Dumbbells',                swapGroup: 'rear-delt',         custom: false },
  { id: 65, name: 'Plate Front Raise',             category: 'shoulders', primaryMuscle: 'Anterior Deltoids',        secondaryMuscles: '',                     equipment: 'Weight plate',             swapGroup: 'front-delt',        custom: false },
  { id: 66, name: 'Seated Dumbbell Press',         category: 'shoulders', primaryMuscle: 'Deltoids, Triceps',        secondaryMuscles: 'Upper Traps',          equipment: 'Dumbbells, Upright bench', swapGroup: 'vertical-press',    custom: false },
  { id: 67, name: 'Landmine Press',                category: 'shoulders', primaryMuscle: 'Anterior Delts, Upper Chest',secondaryMuscles: 'Triceps',            equipment: 'Barbell, Landmine',        swapGroup: 'incline-press',     custom: false },
  { id: 68, name: 'Push Press',                    category: 'shoulders', primaryMuscle: 'Deltoids, Triceps, Legs',  secondaryMuscles: 'Core',                 equipment: 'Barbell',                  swapGroup: 'vertical-press',    custom: false },

  // ── ARMS (14) ───────────────────────────────────────────────────────────
  { id: 69, name: 'Barbell Curl',                  category: 'arms', primaryMuscle: 'Biceps brachii',              secondaryMuscles: 'Brachialis',             equipment: 'Barbell or EZ bar',        swapGroup: 'bicep-curl',        custom: false },
  { id: 70, name: 'Dumbbell Curl',                 category: 'arms', primaryMuscle: 'Biceps brachii',              secondaryMuscles: 'Brachialis',             equipment: 'Dumbbells',                swapGroup: 'bicep-curl',        custom: false },
  { id: 71, name: 'Hammer Curl',                   category: 'arms', primaryMuscle: 'Brachialis, Biceps',          secondaryMuscles: 'Forearms',               equipment: 'Dumbbells',                swapGroup: 'bicep-curl',        custom: false },
  { id: 72, name: 'Preacher Curl',                 category: 'arms', primaryMuscle: 'Biceps (short head)',          secondaryMuscles: '',                       equipment: 'EZ bar, Preacher bench',   swapGroup: 'bicep-curl',        custom: false },
  { id: 73, name: 'Cable Curl',                    category: 'arms', primaryMuscle: 'Biceps',                      secondaryMuscles: '',                       equipment: 'Cable machine',            swapGroup: 'bicep-curl',        custom: false },
  { id: 74, name: 'Concentration Curl',            category: 'arms', primaryMuscle: 'Biceps peak',                 secondaryMuscles: '',                       equipment: 'Dumbbell',                 swapGroup: 'bicep-curl',        custom: false },
  { id: 75, name: 'Tricep Pushdown',               category: 'arms', primaryMuscle: 'Triceps',                     secondaryMuscles: '',                       equipment: 'Cable machine',            swapGroup: 'tricep-isolation',  custom: false },
  { id: 76, name: 'Overhead Tricep Extension',     category: 'arms', primaryMuscle: 'Triceps long head',           secondaryMuscles: '',                       equipment: 'Dumbbell or cable',        swapGroup: 'tricep-isolation',  custom: false },
  { id: 77, name: 'Skull Crusher',                 category: 'arms', primaryMuscle: 'Triceps',                     secondaryMuscles: '',                       equipment: 'EZ bar or barbell, Bench', swapGroup: 'tricep-isolation',  custom: false },
  { id: 78, name: 'Diamond Push-Up',               category: 'arms', primaryMuscle: 'Triceps, Inner Chest',        secondaryMuscles: 'Front Deltoids',         equipment: 'Bodyweight',               swapGroup: 'tricep-compound',   custom: false },
  { id: 79, name: 'Dips (Tricep Focus)',           category: 'arms', primaryMuscle: 'Triceps',                     secondaryMuscles: 'Chest, Shoulders',       equipment: 'Parallel bars or bench',   swapGroup: 'tricep-compound',   custom: false },
  { id: 80, name: 'Reverse Curl',                  category: 'arms', primaryMuscle: 'Brachialis, Forearms',        secondaryMuscles: '',                       equipment: 'Barbell or dumbbells',     swapGroup: 'forearm-curl',      custom: false },
  { id: 81, name: 'Wrist Curl',                    category: 'arms', primaryMuscle: 'Forearm flexors',             secondaryMuscles: '',                       equipment: 'Barbell or dumbbells',     swapGroup: 'forearm-curl',      custom: false },
  { id: 82, name: 'Zottman Curl',                  category: 'arms', primaryMuscle: 'Biceps and Brachialis',       secondaryMuscles: 'Forearms',               equipment: 'Dumbbells',                swapGroup: 'bicep-curl',        custom: false },

  // ── UPPER BODY (10) ─────────────────────────────────────────────────────
  { id: 83, name: 'Bench Press',                   category: 'upper', primaryMuscle: 'Chest, Triceps, Front Delts', secondaryMuscles: '',                      equipment: 'Barbell, Flat bench',      swapGroup: 'horizontal-press',  custom: false },
  { id: 84, name: 'Overhead Press',                category: 'upper', primaryMuscle: 'Deltoids, Triceps',           secondaryMuscles: 'Core',                  equipment: 'Barbell',                  swapGroup: 'vertical-press',    custom: false },
  { id: 85, name: 'Pull-Up',                       category: 'upper', primaryMuscle: 'Lats, Biceps',                secondaryMuscles: 'Rhomboids',             equipment: 'Pull-up bar',              swapGroup: 'vertical-pull',     custom: false },
  { id: 86, name: 'Barbell Row',                   category: 'upper', primaryMuscle: 'Back, Biceps',                secondaryMuscles: 'Erectors',              equipment: 'Barbell',                  swapGroup: 'horizontal-pull',   custom: false },
  { id: 87, name: 'Dip',                           category: 'upper', primaryMuscle: 'Chest, Triceps',              secondaryMuscles: 'Front Deltoids',        equipment: 'Dip bars',                 swapGroup: 'horizontal-press',  custom: false },
  { id: 88, name: 'Cable Row',                     category: 'upper', primaryMuscle: 'Mid Back, Biceps',            secondaryMuscles: 'Rear Delts',            equipment: 'Cable machine',            swapGroup: 'horizontal-pull',   custom: false },
  { id: 89, name: 'Lat Pulldown',                  category: 'upper', primaryMuscle: 'Lats',                        secondaryMuscles: 'Biceps',                equipment: 'Cable machine',            swapGroup: 'vertical-pull',     custom: false },
  { id: 90, name: 'Dumbbell Shoulder Press',       category: 'upper', primaryMuscle: 'Deltoids',                    secondaryMuscles: 'Triceps',               equipment: 'Dumbbells',                swapGroup: 'vertical-press',    custom: false },
  { id: 91, name: 'Face Pull',                     category: 'upper', primaryMuscle: 'Rear Delts, Rotator Cuff',    secondaryMuscles: 'Mid Traps',             equipment: 'Cable machine',            swapGroup: 'rear-delt',         custom: false },
  { id: 92, name: 'Incline Dumbbell Press',        category: 'upper', primaryMuscle: 'Upper Chest, Triceps',        secondaryMuscles: 'Front Deltoids',        equipment: 'Dumbbells, Incline bench', swapGroup: 'incline-press',     custom: false },

  // ── LOWER BODY (8) ──────────────────────────────────────────────────────
  { id: 93, name: 'Barbell Squat',                 category: 'lower', primaryMuscle: 'Quads, Glutes',               secondaryMuscles: 'Hamstrings, Core',      equipment: 'Barbell, Squat rack',      swapGroup: 'quad-compound',     custom: false },
  { id: 94, name: 'Romanian Deadlift',             category: 'lower', primaryMuscle: 'Hamstrings, Glutes',          secondaryMuscles: 'Erectors',              equipment: 'Barbell',                  swapGroup: 'hamstring-hinge',   custom: false },
  { id: 95, name: 'Leg Press',                     category: 'lower', primaryMuscle: 'Quads, Glutes',               secondaryMuscles: 'Hamstrings',            equipment: 'Leg press machine',        swapGroup: 'quad-compound',     custom: false },
  { id: 96, name: 'Hip Thrust',                    category: 'lower', primaryMuscle: 'Glutes',                      secondaryMuscles: 'Hamstrings',            equipment: 'Barbell, Bench',           swapGroup: 'glute-isolation',   custom: false },
  { id: 97, name: 'Leg Curl',                      category: 'lower', primaryMuscle: 'Hamstrings',                  secondaryMuscles: '',                      equipment: 'Leg curl machine',         swapGroup: 'hamstring-isolation',custom: false },
  { id: 98, name: 'Leg Extension',                 category: 'lower', primaryMuscle: 'Quadriceps',                  secondaryMuscles: '',                      equipment: 'Leg extension machine',    swapGroup: 'quad-isolation',    custom: false },
  { id: 99, name: 'Bulgarian Split Squat',         category: 'lower', primaryMuscle: 'Quads, Glutes',               secondaryMuscles: 'Hip Flexors',           equipment: 'Dumbbells, Bench',         swapGroup: 'unilateral-leg',    custom: false },
  { id: 100,name: 'Calf Raise',                    category: 'lower', primaryMuscle: 'Gastrocnemius, Soleus',       secondaryMuscles: '',                      equipment: 'Machine or step',          swapGroup: 'calf-isolation',    custom: false },

  // ── CARDIO (10) ─────────────────────────────────────────────────────────
  { id: 101,name: 'Treadmill Run',                 category: 'cardio', primaryMuscle: 'Cardiovascular, Legs',       secondaryMuscles: 'Core',                  equipment: 'Treadmill',                swapGroup: 'steady-cardio',     custom: false },
  { id: 102,name: 'Outdoor Run',                   category: 'cardio', primaryMuscle: 'Cardiovascular, Legs',       secondaryMuscles: 'Core',                  equipment: 'None',                     swapGroup: 'steady-cardio',     custom: false },
  { id: 103,name: 'Stationary Bike',               category: 'cardio', primaryMuscle: 'Cardiovascular, Quads',      secondaryMuscles: 'Glutes',                equipment: 'Stationary bike',          swapGroup: 'steady-cardio',     custom: false },
  { id: 104,name: 'Rowing Machine',                category: 'cardio', primaryMuscle: 'Cardiovascular, Full body',  secondaryMuscles: '',                      equipment: 'Rowing ergometer',         swapGroup: 'cardio-machine',    custom: false },
  { id: 105,name: 'Stair Climber',                 category: 'cardio', primaryMuscle: 'Cardiovascular, Glutes',     secondaryMuscles: 'Quads, Calves',         equipment: 'Stair climber machine',    swapGroup: 'cardio-machine',    custom: false },
  { id: 106,name: 'Jump Rope',                     category: 'cardio', primaryMuscle: 'Cardiovascular, Calves',     secondaryMuscles: 'Shoulders',             equipment: 'Jump rope',                swapGroup: 'hiit-cardio',       custom: false },
  { id: 107,name: 'HIIT Circuit',                  category: 'cardio', primaryMuscle: 'Cardiovascular, Full body',  secondaryMuscles: '',                      equipment: 'Varies',                   swapGroup: 'hiit-cardio',       custom: false },
  { id: 108,name: 'Elliptical',                    category: 'cardio', primaryMuscle: 'Cardiovascular, Low impact', secondaryMuscles: 'Full body',             equipment: 'Elliptical machine',       swapGroup: 'steady-cardio',     custom: false },
  { id: 109,name: 'Battle Ropes',                  category: 'cardio', primaryMuscle: 'Cardiovascular, Upper body', secondaryMuscles: 'Core',                  equipment: 'Battle ropes',             swapGroup: 'hiit-cardio',       custom: false },
  { id: 110,name: 'Incline Walk',                  category: 'cardio', primaryMuscle: 'Cardiovascular, Glutes',     secondaryMuscles: 'Calves',                equipment: 'Treadmill (incline)',       swapGroup: 'steady-cardio',     custom: false },

  // ── YOGA / MOBILITY (10) ────────────────────────────────────────────────
  { id: 111,name: 'Sun Salutation (Surya A)',      category: 'yoga', primaryMuscle: 'Full body mobility',          secondaryMuscles: '',                      equipment: 'Yoga mat',                 swapGroup: 'yoga-flow',         custom: false },
  { id: 112,name: 'Downward Dog',                  category: 'yoga', primaryMuscle: 'Hamstrings, Calves',          secondaryMuscles: 'Shoulders, Core',       equipment: 'Yoga mat',                 swapGroup: 'yoga-stretch',      custom: false },
  { id: 113,name: 'Pigeon Pose',                   category: 'yoga', primaryMuscle: 'Hip flexors, Glutes',         secondaryMuscles: '',                      equipment: 'Yoga mat',                 swapGroup: 'hip-mobility',      custom: false },
  { id: 114,name: 'Hip Flexor Stretch',            category: 'yoga', primaryMuscle: 'Iliopsoas, Quads',            secondaryMuscles: '',                      equipment: 'Yoga mat',                 swapGroup: 'hip-mobility',      custom: false },
  { id: 115,name: 'Thoracic Spine Rotation',       category: 'yoga', primaryMuscle: 'Thoracic spine, Obliques',    secondaryMuscles: '',                      equipment: 'Yoga mat',                 swapGroup: 'spine-mobility',    custom: false },
  { id: 116,name: 'Warrior I Sequence',            category: 'yoga', primaryMuscle: 'Legs, Hip flexors',           secondaryMuscles: 'Shoulders',             equipment: 'Yoga mat',                 swapGroup: 'yoga-flow',         custom: false },
  { id: 117,name: 'Warrior II Sequence',           category: 'yoga', primaryMuscle: 'Legs, Core',                  secondaryMuscles: 'Shoulders',             equipment: 'Yoga mat',                 swapGroup: 'yoga-flow',         custom: false },
  { id: 118,name: 'Cat-Cow Stretch',               category: 'yoga', primaryMuscle: 'Lumbar spine, Core',          secondaryMuscles: '',                      equipment: 'Yoga mat',                 swapGroup: 'spine-mobility',    custom: false },
  { id: 119,name: 'Foam Rolling — Legs',           category: 'yoga', primaryMuscle: 'Myofascial release, Legs',    secondaryMuscles: '',                      equipment: 'Foam roller',              swapGroup: 'recovery',          custom: false },
  { id: 120,name: 'Foam Rolling — Upper Back',     category: 'yoga', primaryMuscle: 'Thoracic myofascial release', secondaryMuscles: '',                      equipment: 'Foam roller',              swapGroup: 'recovery',          custom: false },
];
