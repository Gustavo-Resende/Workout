import { fastify } from 'fastify';
import { workoutRoutes } from './routes/workoutRoutes.js';

const server = fastify({
    logger: true
});

// Registrar rotas (similar a usar controllers no ASP.NET Core)
server.register(workoutRoutes);

// Iniciar servidor
server.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});