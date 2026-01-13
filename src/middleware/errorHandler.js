export function errorHandler(error, request, reply) {

    console.error('Error:', error.message);

    if (error.statusCode){
        return reply.code(error.statusCode).send({
            status: 'error',
            message: error.message,
        });
    }

    return reply.code(500).send({
        status: 'error',
        message: 'Internal server error',
    });
}