import { query } from '../database/database-postgres.js';
import bcrypt from 'bcrypt';

export class UserRepository {
    
    async findByEmail(email) {
        const result = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    async findById(id) {
        const result = await query(
            'SELECT id, name, email, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    async create(user) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        const result = await query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, created_at`,
            [user.name, user.email, hashedPassword]
        );
        return result.rows[0];
    }

    async verifyPassword(email, password) {
        const user = await this.findByEmail(email);
        if (!user) {
            return null;
        }
        
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return null;
        }
        
        return {
            id: user.id,
            name: user.name,
            email: user.email
        };
    }
}