import { WorkoutRepository } from '../repositories/WorkoutRepository.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { createWorkoutSchema, updateWorkoutSchema } from '../schemas/workoutSchemas.js';

const workoutRepository = new WorkoutRepository();

export async function workoutRoutes(fastify, options) {
    
    fastify.get('/workouts', async (request, reply) => {
        try {
            const workouts = await workoutRepository.list();
            return reply.status(200).send({ workouts });
        } catch (error) {
            throw error;
        }
    });

    fastify.get('/workouts/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            
            const workout = await workoutRepository.findById(id);
            
            if (!workout) {
                throw new NotFoundError('Workout not found');
            }
            
            return reply.status(200).send({ workout });
        } catch (error) {
            throw error;
        }
    });

    fastify.post('/workouts', async (request, reply) => {
        try {
            // Validação com Zod
            const validation = createWorkoutSchema.safeParse(request.body);
            if (!validation.success) {
                throw new ValidationError(validation.error.errors[0].message);
            }

            const { name } = validation.data;

            const existingWorkout = await workoutRepository.findByName(name);
            if (existingWorkout) {
                throw new ConflictError('Workout with this name already exists');
            }

            const workout = await workoutRepository.create({ name });
            
            return reply.status(201).send({ 
                message: 'Workout created successfully',
                workout 
            });
        } catch (error) {
            throw error;
        }
    });

    fastify.put('/workouts/:id', async (request, reply) => {
        try {
            const { id } = request.params;

            // Validação com Zod
            const validation = updateWorkoutSchema.safeParse(request.body);
            if (!validation.success) {
                throw new ValidationError(validation.error.errors[0].message);
            }

            const { name } = validation.data;

            const existingWorkout = await workoutRepository.findById(id);
            if (!existingWorkout) {
                throw new NotFoundError('Workout not found');
            }

            const workoutWithSameName = await workoutRepository.findByName(name);
            if (workoutWithSameName && workoutWithSameName.id !== id) {
                throw new ConflictError('Workout with this name already exists');
            }

            const workout = await workoutRepository.update(id, { name });
            
            return reply.status(200).send({ 
                message: 'Workout updated successfully',
                workout 
            });
        } catch (error) {
            throw error;
        }
    });

    fastify.delete('/workouts/:id', async (request, reply) => {
        try {
            const { id } = request.params;

            const existingWorkout = await workoutRepository.findById(id);
            if (!existingWorkout) {
                throw new NotFoundError('Workout not found');
            }

            await workoutRepository.delete(id);
            
            return reply.status(204).send();
        } catch (error) {
            throw error;
        }
    });
}