import { ExerciseRepository } from '../repositories/ExerciseRepository.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { createExerciseSchema, updateExerciseSchema } from '../schemas/exerciseSchemas.js';

const exerciseRepository = new ExerciseRepository();

export async function exerciseRoutes(fastify, options) {
    
    fastify.get('/exercises', async (request, reply) => {
        try {
            const exercises = await exerciseRepository.list();
            return reply.status(200).send({ exercises });
        } catch (error) {
            throw error;
        }
    });

    fastify.get('/exercises/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            
            const exercise = await exerciseRepository.findById(id);
            
            if (!exercise) {
                throw new NotFoundError('Exercise not found');
            }
            
            return reply.status(200).send({ exercise });
        } catch (error) {
            throw error;
        }
    });

    fastify.post('/exercises', async (request, reply) => {
        try {
            const validation = createExerciseSchema.safeParse(request.body);
            if (!validation.success) {
                throw new ValidationError(validation.error.errors[0].message);
            }

            const { name, muscle_group } = validation.data;

            const existingExercise = await exerciseRepository.findByName(name);
            if (existingExercise) {
                throw new ConflictError('Exercise with this name already exists');
            }

            const exercise = await exerciseRepository.create({ name, muscle_group });
            
            return reply.status(201).send({ 
                message: 'Exercise created successfully',
                exercise 
            });
        } catch (error) {
            throw error;
        }
    });

    fastify.put('/exercises/:id', async (request, reply) => {
        try {
            const { id } = request.params;

            const validation = updateExerciseSchema.safeParse(request.body);
            if (!validation.success) {
                throw new ValidationError(validation.error.errors[0].message);
            }

            const { name, muscle_group } = validation.data;

            const existingExercise = await exerciseRepository.findById(id);
            if (!existingExercise) {
                throw new NotFoundError('Exercise not found');
            }

            const exerciseWithSameName = await exerciseRepository.findByName(name);
            if (exerciseWithSameName && exerciseWithSameName.id !== id) {
                throw new ConflictError('Exercise with this name already exists');
            }

            const exercise = await exerciseRepository.update(id, { name, muscle_group });
            
            return reply.status(200).send({ 
                message: 'Exercise updated successfully',
                exercise 
            });
        } catch (error) {
            throw error;
        }
    });

    fastify.delete('/exercises/:id', async (request, reply) => {
        try {
            const { id } = request.params;

            const existingExercise = await exerciseRepository.findById(id);
            if (!existingExercise) {
                throw new NotFoundError('Exercise not found');
            }

            await exerciseRepository.delete(id);
            
            return reply.status(204).send();
        } catch (error) {
            throw error;
        }
    });
}