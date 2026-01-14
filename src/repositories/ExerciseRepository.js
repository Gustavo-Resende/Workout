import { query } from '../database/database-postgres.js';

export class ExerciseRepository {
    
    async list(userId) {
        const result = await query(
            'SELECT * FROM exercises WHERE user_id = $1 ORDER BY name ASC',
            [userId]
        );
        return result.rows;
    }

    async findById(id, userId) {
        const result = await query(
            'SELECT * FROM exercises WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        return result.rows[0];
    }

    async create(exercise) {
        const result = await query(
            `INSERT INTO exercises (name, muscle_group, user_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [exercise.name, exercise.muscle_group || null, exercise.user_id]
        );
        return result.rows[0];
    }

    async update(id, exercise, userId) {
        const result = await query(
            `UPDATE exercises 
             SET name = $1, muscle_group = $2
             WHERE id = $3 AND user_id = $4
             RETURNING *`,
            [exercise.name, exercise.muscle_group || null, id, userId]
        );
        return result.rows[0];
    }

    async delete(id, userId) {
        await query('DELETE FROM exercises WHERE id = $1 AND user_id = $2', [id, userId]);
    }

    async findByName(name, userId) {
        const result = await query(
            'SELECT * FROM exercises WHERE name = $1 AND user_id = $2',
            [name, userId]
        );
        return result.rows[0];
    }
}