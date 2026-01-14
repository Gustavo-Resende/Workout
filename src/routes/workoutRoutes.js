import { WorkoutRepository } from '../repositories/WorkoutRepository.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { createWorkoutSchema, updateWorkoutSchema } from '../schemas/workoutSchemas.js';
import { authenticate } from '../middleware/authMiddleware.js';

const workoutRepository = new WorkoutRepository();

export async function workoutRoutes(fastify, options) {
    
    fastify.addHook('onRequest', authenticate);
    
    fastify.get('/workouts', async (request, reply) => {
        try {
            const workouts = await workoutRepository.list(request.userId);
            return reply.status(200).send({ workouts });
        } catch (error) {
            throw error;
        }
    });

    fastify.get('/workouts/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            
            const workout = await workoutRepository.findById(id, request.userId);
            
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
            const validation = createWorkoutSchema.safeParse(request.body);
            if (!validation.success) {
                throw new ValidationError(validation.error.errors[0].message);
            }

            const { name } = validation.data;

            const existingWorkout = await workoutRepository.findByName(name, request.userId);
            if (existingWorkout) {
                throw new ConflictError('Workout with this name already exists');
            }

            const workout = await workoutRepository.create({ 
                name, 
                user_id: request.userId 
            });
            
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

            const validation = updateWorkoutSchema.safeParse(request.body);
            if (!validation.success) {
                throw new ValidationError(validation.error.errors[0].message);
            }

            const { name } = validation.data;

            const existingWorkout = await workoutRepository.findById(id, request.userId);
            if (!existingWorkout) {
                throw new NotFoundError('Workout not found');
            }

            const workoutWithSameName = await workoutRepository.findByName(name, request.userId);
            if (workoutWithSameName && workoutWithSameName.id !== id) {
                throw new ConflictError('Workout with this name already exists');
            }

            const workout = await workoutRepository.update(id, { name }, request.userId);
            
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

            const existingWorkout = await workoutRepository.findById(id, request.userId);
            if (!existingWorkout) {
                throw new NotFoundError('Workout not found');
            }

            await workoutRepository.delete(id, request.userId);
            
            return reply.status(204).send();
        } catch (error) {
            throw error;
        }
    });
}