import { ExerciseRepository } from '../repositories/ExerciseRepository.js';

const exerciseRepository = new ExerciseRepository();

export async function exerciseRoutes(fastify, options) {
    
    fastify.get('/exercises', async (request, reply) => {
        const exercises = await exerciseRepository.list();
        return reply.status(200).send({ exercises });
    });

    fastify.get('/exercises/:id', async (request, reply) => {
        const { id } = request.params;
        
        const exercise = await exerciseRepository.findById(id);
        
        if (!exercise) {
            return reply.status(404).send({ 
                error: 'Exercise not found' 
            });
        }
        
        return reply.status(200).send({ exercise });
    });

    fastify.post('/exercises', async (request, reply) => {
        const { name, muscle_group } = request.body;
        
        if (!name || name.trim() === '') {
            return reply.status(400).send({ 
                error: 'Name is required' 
            });
        }

        const existingExercise = await exerciseRepository.findByName(name);
        if (existingExercise) {
            return reply.status(409).send({ 
                error: 'Exercise with this name already exists' 
            });
        }

        const exercise = await exerciseRepository.create({ name, muscle_group });
        
        return reply.status(201).send({ 
            message: 'Exercise created successfully',
            exercise 
        });
    });

    fastify.put('/exercises/:id', async (request, reply) => {
        const { id } = request.params;
        const { name, muscle_group } = request.body;

        if (!name || name.trim() === '') {
            return reply.status(400).send({ 
                error: 'Name is required' 
            });
        }

        const existingExercise = await exerciseRepository.findById(id);
        if (!existingExercise) {
            return reply.status(404).send({ 
                error: 'Exercise not found' 
            });
        }

        const exerciseWithSameName = await exerciseRepository.findByName(name);
        if (exerciseWithSameName && exerciseWithSameName.id !== id) {
            return reply.status(409).send({ 
                error: 'Exercise with this name already exists' 
            });
        }

        const exercise = await exerciseRepository.update(id, { name, muscle_group });
        
        return reply.status(200).send({ 
            message: 'Exercise updated successfully',
            exercise 
        });
    });

    fastify.delete('/exercises/:id', async (request, reply) => {
        const { id } = request.params;

        const existingExercise = await exerciseRepository.findById(id);
        if (!existingExercise) {
            return reply.status(404).send({ 
                error: 'Exercise not found' 
            });
        }

        await exerciseRepository.delete(id);
        
        return reply.status(204).send();
    });
}