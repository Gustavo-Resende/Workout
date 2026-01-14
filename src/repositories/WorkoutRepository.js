import { query } from '../database/database-postgres.js';

export class WorkoutRepository {
    
    async list(userId) {
        const result = await query(
            'SELECT * FROM workouts WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        return result.rows;
    }

    async findById(id, userId) {
        const result = await query(
            'SELECT * FROM workouts WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        return result.rows[0];
    }

    async create(workout) {
        const result = await query(
            `INSERT INTO workouts (name, user_id)
             VALUES ($1, $2)
             RETURNING *`,
            [workout.name, workout.user_id]
        );
        return result.rows[0];
    }

    async update(id, workout, userId) {
        const result = await query(
            `UPDATE workouts 
             SET name = $1
             WHERE id = $2 AND user_id = $3
             RETURNING *`,
            [workout.name, id, userId]
        );
        return result.rows[0];
    }

    async delete(id, userId) {
        await query('DELETE FROM workouts WHERE id = $1 AND user_id = $2', [id, userId]);
    }

    async findByName(name, user_id) {
        const result = await query(
            'SELECT * FROM workouts WHERE name = $1 AND user_id = $2',
            [name, user_id]
        );
        return result.rows[0];
    }
}