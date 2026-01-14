import { WorkoutExerciseRepository } from '../repositories/WorkoutExerciseRepository.js';
import { WorkoutRepository } from '../repositories/WorkoutRepository.js';
import { ExerciseRepository } from '../repositories/ExerciseRepository.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { createWorkoutExerciseSchema, updateWorkoutExerciseSchema } from '../schemas/workoutExerciseSchemas.js';
import { authenticate } from '../middleware/authMiddleware.js';

const workoutExerciseRepository = new WorkoutExerciseRepository();
const workoutRepository = new WorkoutRepository();
const exerciseRepository = new ExerciseRepository();

export async function workoutExerciseRoutes(fastify, options) {
    
    fastify.addHook('onRequest', authenticate);
    
    fastify.get('/workouts/:workoutId/exercises', async (request, reply) => {
        try {
            const { workoutId } = request.params;

            const workout = await workoutRepository.findById(workoutId, request.userId);
            if (!workout) {
                throw new NotFoundError('Workout not found');
            }

            const exercises = await workoutExerciseRepository.listByWorkout(workoutId, request.userId);
            return reply.status(200).send({ exercises });
        } catch (error) {
            throw error;
        }
    });

    fastify.post('/workouts/:workoutId/exercises', async (request, reply) => {
        try {
            const { workoutId } = request.params;

            const validation = createWorkoutExerciseSchema.safeParse(request.body);
            if (!validation.success) {
                throw new ValidationError(validation.error.errors[0].message);
            }

            const { exercise_id, weight, sets, reps } = validation.data;

            const workout = await workoutRepository.findById(workoutId, request.userId);
            if (!workout) {
                throw new NotFoundError('Workout not found');
            }

            const exercise = await exerciseRepository.findById(exercise_id, request.userId);
            if (!exercise) {
                throw new NotFoundError('Exercise not found');
            }

            const existing = await workoutExerciseRepository.findByWorkoutAndExercise(workoutId, exercise_id, request.userId);
            if (existing) {
                throw new ConflictError('Exercise already exists in this workout');
            }

            const workoutExercise = await workoutExerciseRepository.create({
                workout_id: workoutId,
                exercise_id,
                user_id: request.userId,
                weight,
                sets,
                reps
            });
            
            return reply.status(201).send({ 
                message: 'Exercise added to workout successfully',
                workoutExercise 
            });
        } catch (error) {
            throw error;
        }
    });

    fastify.put('/workouts/:workoutId/exercises/:exerciseId', async (request, reply) => {
        try {
            const { workoutId, exerciseId } = request.params;

            const validation = updateWorkoutExerciseSchema.partial().safeParse(request.body);
            if (!validation.success) {
                throw new ValidationError(validation.error.errors[0].message);
            }

            const workout = await workoutRepository.findById(workoutId, request.userId);
            if (!workout) {
                throw new NotFoundError('Workout not found');
            }

            const existing = await workoutExerciseRepository.findByWorkoutAndExercise(workoutId, exerciseId, request.userId);
            if (!existing) {
                throw new NotFoundError('Exercise not found in this workout');
            }

            const updateData = {
                weight: validation.data.weight !== undefined ? validation.data.weight : existing.weight,
                sets: validation.data.sets !== undefined ? validation.data.sets : existing.sets,
                reps: validation.data.reps !== undefined ? validation.data.reps : existing.reps
            };

            const workoutExercise = await workoutExerciseRepository.update(existing.id, updateData, request.userId);
            
            return reply.status(200).send({ 
                message: 'Workout exercise updated successfully',
                workoutExercise 
            });
        } catch (error) {
            throw error;
        }
    });

    fastify.delete('/workouts/:workoutId/exercises/:exerciseId', async (request, reply) => {
        try {
            const { workoutId, exerciseId } = request.params;

            const workout = await workoutRepository.findById(workoutId, request.userId);
            if (!workout) {
                throw new NotFoundError('Workout not found');
            }

            const existing = await workoutExerciseRepository.findByWorkoutAndExercise(workoutId, exerciseId, request.userId);
            if (!existing) {
                throw new NotFoundError('Exercise not found in this workout');
            }

            await workoutExerciseRepository.delete(existing.id, request.userId);
            
            return reply.status(204).send();
        } catch (error) {
            throw error;
        }
    });
}