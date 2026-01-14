import { z } from 'zod';

export const createExerciseSchema = z.object({
    name: z.string().min(1),
    muscle_group: z.string().optional()
});

export const updateExerciseSchema = z.object({
    name: z.string().min(1),
    muscle_group: z.string().optional()
});

export const exerciseSchema = z.object({
    id: z.string(),
    name: z.string(),
    muscle_group: z.string().optional()
});