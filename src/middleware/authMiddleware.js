import { verifyToken } from '../utils/jwt.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export async function authenticate(request, reply) {
    try {
        const authHeader = request.headers.authorization;
        
        if (!authHeader) {
            throw new UnauthorizedError('Token not provided');
        }
        
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new UnauthorizedError('Invalid token format');
        }
        
        const token = parts[1];
        const decoded = verifyToken(token);
        
        if (!decoded) {
            throw new UnauthorizedError('Invalid or expired token');
        }
        
        request.userId = decoded.id;
        
    } catch (error) {
        throw error;
    }
}