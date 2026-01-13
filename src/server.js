import { fastify } from 'fastify';
import cors from '@fastify/cors';
import { workoutRoutes } from './routes/workoutRoutes.js';
import { exerciseRoutes } from './routes/exerciseRoutes.js';
import { workoutExerciseRoutes } from './routes/workoutExerciseRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const server = fastify({
    logger: true
});

server.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false 
});

server.setErrorHandler(errorHandler);
server.register(workoutRoutes);
server.register(exerciseRoutes);
server.register(workoutExerciseRoutes);

server.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});