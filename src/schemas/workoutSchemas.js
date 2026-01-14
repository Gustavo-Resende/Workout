import { z } from 'zod';

export const createWorkoutSchema = z.object({
    name: z.string().min(1)
});

export const updateWorkoutSchema = z.object({
    name: z.string().min(1)
});

export const workoutSchema = z.object({
    id: z.string(),
    name: z.string()
});