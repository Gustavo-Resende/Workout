import { z } from 'zod';

export const createWorkoutExerciseSchema = z.object({
    exercise_id: z.string(),
    weight: z.number().min(0),
    sets: z.number().min(1),
    reps: z.number().min(1)
});

export const updateWorkoutExerciseSchema = z.object({
    weight: z.number().min(0),
    sets: z.number().min(1),
    reps: z.number().min(1)
});

export const workoutExerciseSchema = z.object({
    id: z.string(),
    exercise_id: z.string(),
    weight: z.number(),
    sets: z.number(),
    reps: z.number()
});