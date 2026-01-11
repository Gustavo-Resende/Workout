import { WorkoutExerciseRepository } from '../repositories/WorkoutExerciseRepository.js';
import { WorkoutRepository } from '../repositories/WorkoutRepository.js';
import { ExerciseRepository } from '../repositories/ExerciseRepository.js';

const workoutExerciseRepository = new WorkoutExerciseRepository();
const workoutRepository = new WorkoutRepository();
const exerciseRepository = new ExerciseRepository();

export async function workoutExerciseRoutes(fastify, options) {
    
    fastify.get('/workouts/:workoutId/exercises', async (request, reply) => {
        const { workoutId } = request.params;

        const workout = await workoutRepository.findById(workoutId);
        if (!workout) {
            return reply.status(404).send({ 
                error: 'Workout not found' 
            });
        }

        const exercises = await workoutExerciseRepository.listByWorkout(workoutId);
        return reply.status(200).send({ exercises });
    });

    fastify.post('/workouts/:workoutId/exercises', async (request, reply) => {
        const { workoutId } = request.params;
        const { exercise_id, weight, sets, reps } = request.body;

        const workout = await workoutRepository.findById(workoutId);
        if (!workout) {
            return reply.status(404).send({ 
                error: 'Workout not found' 
            });
        }

        const exercise = await exerciseRepository.findById(exercise_id);
        if (!exercise) {
            return reply.status(404).send({ 
                error: 'Exercise not found' 
            });
        }

        const existing = await workoutExerciseRepository.findByWorkoutAndExercise(workoutId, exercise_id);
        if (existing) {
            return reply.status(409).send({ 
                error: 'Exercise already exists in this workout' 
            });
        }

        if (weight < 0) {
            return reply.status(400).send({ 
                error: 'Weight cannot be negative' 
            });
        }

        if (!sets || sets < 1) {
            return reply.status(400).send({ 
                error: 'Sets must be at least 1' 
            });
        }

        if (!reps || reps < 1) {
            return reply.status(400).send({ 
                error: 'Reps must be at least 1' 
            });
        }

        const workoutExercise = await workoutExerciseRepository.create({
            workout_id: workoutId,
            exercise_id,
            weight,
            sets,
            reps
        });
        
        return reply.status(201).send({ 
            message: 'Exercise added to workout successfully',
            workoutExercise 
        });
    });

    fastify.put('/workouts/:workoutId/exercises/:exerciseId', async (request, reply) => {
        const { workoutId, exerciseId } = request.params;
        const { weight, sets, reps } = request.body;

        const existing = await workoutExerciseRepository.findByWorkoutAndExercise(workoutId, exerciseId);
        if (!existing) {
            return reply.status(404).send({ 
                error: 'Exercise not found in this workout' 
            });
        }

        if (weight !== undefined && weight < 0) {
            return reply.status(400).send({ 
                error: 'Weight cannot be negative' 
            });
        }

        if (sets !== undefined && sets < 1) {
            return reply.status(400).send({ 
                error: 'Sets must be at least 1' 
            });
        }

        if (reps !== undefined && reps < 1) {
            return reply.status(400).send({ 
                error: 'Reps must be at least 1' 
            });
        }

        const workoutExercise = await workoutExerciseRepository.update(existing.id, {
            weight: weight !== undefined ? weight : existing.weight,
            sets: sets !== undefined ? sets : existing.sets,
            reps: reps !== undefined ? reps : existing.reps
        });
        
        return reply.status(200).send({ 
            message: 'Workout exercise updated successfully',
            workoutExercise 
        });
    });

    fastify.delete('/workouts/:workoutId/exercises/:exerciseId', async (request, reply) => {
        const { workoutId, exerciseId } = request.params;

        const existing = await workoutExerciseRepository.findByWorkoutAndExercise(workoutId, exerciseId);
        if (!existing) {
            return reply.status(404).send({ 
                error: 'Exercise not found in this workout' 
            });
        }

        await workoutExerciseRepository.delete(existing.id);
        
        return reply.status(204).send();
    });
}