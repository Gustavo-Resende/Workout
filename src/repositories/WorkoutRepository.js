import { query } from '../database/database-postgres.js';

export class WorkoutRepository {
    
    async list() {
        const result = await query(
            'SELECT * FROM workouts ORDER BY created_at DESC'
        );
        return result.rows;
    }

    async findById(id) {
        const result = await query(
            'SELECT * FROM workouts WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    async create(workout) {
        const result = await query(
            `INSERT INTO workouts (name, user_id)
             VALUES ($1, $2)
             RETURNING *`,
            [workout.name, workout.user_id || null]
        );
        return result.rows[0];
    }

    async update(id, workout) {
        const result = await query(
            `UPDATE workouts 
             SET name = $1
             WHERE id = $2
             RETURNING *`,
            [workout.name, id]
        );
        return result.rows[0];
    }

    async delete(id) {
        await query('DELETE FROM workouts WHERE id = $1', [id]);
    }

    // Verificar se já existe treino com o mesmo nome (para o mesmo usuário)
    async findByName(name, user_id = null) {
        const result = await query(
            'SELECT * FROM workouts WHERE name = $1 AND (user_id = $2 OR user_id IS NULL)',
            [name, user_id]
        );
        return result.rows[0];
    }
}