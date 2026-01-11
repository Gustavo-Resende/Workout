import { WorkoutRepository } from '../repositories/WorkoutRepository.js';

const workoutRepository = new WorkoutRepository();

export async function workoutRoutes(fastify, options) {
    
    fastify.get('/workouts', async (request, reply) => {
        const workouts = await workoutRepository.list();
        return reply.status(200).send({ workouts });
    });

    fastify.get('/workouts/:id', async (request, reply) => {
        const { id } = request.params;
        
        const workout = await workoutRepository.findById(id);
        
        if (!workout) {
            return reply.status(404).send({ 
                error: 'Workout not found' 
            });
        }
        
        return reply.status(200).send({ workout });
    });

    fastify.post('/workouts', async (request, reply) => {
        const { name } = request.body;
        
        if (!name || name.trim() === '') {
            return reply.status(400).send({ 
                error: 'Name is required' 
            });
        }

        const existingWorkout = await workoutRepository.findByName(name);
        if (existingWorkout) {
            return reply.status(409).send({ 
                error: 'Workout with this name already exists' 
            });
        }

        const workout = await workoutRepository.create({ name });
        
        return reply.status(201).send({ 
            message: 'Workout created successfully',
            workout 
        });
    });

    fastify.put('/workouts/:id', async (request, reply) => {
        const { id } = request.params;
        const { name } = request.body;

        if (!name || name.trim() === '') {
            return reply.status(400).send({ 
                error: 'Name is required' 
            });
        }

        const existingWorkout = await workoutRepository.findById(id);
        if (!existingWorkout) {
            return reply.status(404).send({ 
                error: 'Workout not found' 
            });
        }

        const workoutWithSameName = await workoutRepository.findByName(name);
        if (workoutWithSameName && workoutWithSameName.id !== id) {
            return reply.status(409).send({ 
                error: 'Workout with this name already exists' 
            });
        }

        const workout = await workoutRepository.update(id, { name });
        
        return reply.status(200).send({ 
            message: 'Workout updated successfully',
            workout 
        });
    });

    fastify.delete('/workouts/:id', async (request, reply) => {
        const { id } = request.params;

        const existingWorkout = await workoutRepository.findById(id);
        if (!existingWorkout) {
            return reply.status(404).send({ 
                error: 'Workout not found' 
            });
        }

        await workoutRepository.delete(id);
        
        return reply.status(204).send();
    });
}