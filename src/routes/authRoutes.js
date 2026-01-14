import { UserRepository } from '../repositories/UserRepository.js';
import { ValidationError } from '../errors/ValidationError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import { generateToken } from '../utils/jwt.js';

const userRepository = new UserRepository();

export async function authRoutes(fastify, options) {
    
    fastify.post('/auth/register', async (request, reply) => {
        try {
            const validation = registerSchema.safeParse(request.body);
            if (!validation.success) {
                throw new ValidationError(validation.error.errors[0].message);
            }
            
            const { name, email, password } = validation.data;
            
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                throw new ConflictError('Email already registered');
            }
            
            const user = await userRepository.create({ name, email, password });
            const token = generateToken(user);
            
            return reply.status(201).send({
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token
            });
        } catch (error) {
            throw error;
        }
    });
    
    fastify.post('/auth/login', async (request, reply) => {
        try {
            const validation = loginSchema.safeParse(request.body);
            if (!validation.success) {
                throw new ValidationError(validation.error.errors[0].message);
            }
            
            const { email, password } = validation.data;
            
            const user = await userRepository.verifyPassword(email, password);
            if (!user) {
                throw new UnauthorizedError('Invalid email or password');
            }
            
            const token = generateToken(user);
            
            return reply.status(200).send({
                message: 'Login successful',
                user,
                token
            });
        } catch (error) {
            throw error;
        }
    });
}