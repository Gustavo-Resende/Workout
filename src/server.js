import { fastify } from 'fastify';
import { workoutRoutes } from './routes/workoutRoutes.js';
import { exerciseRoutes } from './routes/exerciseRoutes.js';

const server = fastify({
    logger: true
});

server.register(workoutRoutes);
server.register(exerciseRoutes);

server.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});