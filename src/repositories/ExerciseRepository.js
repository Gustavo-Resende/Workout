import { query } from '../database/database-postgres.js';

export class ExerciseRepository {
    
    async list() {
        const result = await query(
            'SELECT * FROM exercises ORDER BY name ASC'
        );
        return result.rows;
    }

    async findById(id) {
        const result = await query(
            'SELECT * FROM exercises WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    async create(exercise) {
        const result = await query(
            `INSERT INTO exercises (name, muscle_group)
             VALUES ($1, $2)
             RETURNING *`,
            [exercise.name, exercise.muscle_group || null]
        );
        return result.rows[0];
    }

    async update(id, exercise) {
        const result = await query(
            `UPDATE exercises 
             SET name = $1, muscle_group = $2
             WHERE id = $3
             RETURNING *`,
            [exercise.name, exercise.muscle_group || null, id]
        );
        return result.rows[0];
    }

    async delete(id) {
        await query('DELETE FROM exercises WHERE id = $1', [id]);
    }

    async findByName(name) {
        const result = await query(
            'SELECT * FROM exercises WHERE name = $1',
            [name]
        );
        return result.rows[0];
    }
}