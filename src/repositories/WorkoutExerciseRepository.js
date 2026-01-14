import { query } from '../database/database-postgres.js';

export class WorkoutExerciseRepository {
    
    // Listar todos os exercícios de um treino (com dados do exercício)
    async listByWorkout(workoutId, userId) {
        const result = await query(
            `SELECT 
                we.id,
                we.workout_id,
                we.exercise_id,
                we.weight,
                we.sets,
                we.reps,
                we.created_at,
                we.updated_at,
                e.name as exercise_name,
                e.muscle_group
             FROM workout_exercises we
             INNER JOIN exercises e ON we.exercise_id = e.id
             WHERE we.workout_id = $1 AND we.user_id = $2
             ORDER BY we.created_at ASC`,
            [workoutId, userId]
        );
        return result.rows;
    }

    async findById(id) {
        const result = await query(
            `SELECT 
                we.*,
                e.name as exercise_name,
                e.muscle_group
             FROM workout_exercises we
             INNER JOIN exercises e ON we.exercise_id = e.id
             WHERE we.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    async findByWorkoutAndExercise(workoutId, exerciseId, userId) {
        const result = await query(
            'SELECT * FROM workout_exercises WHERE workout_id = $1 AND exercise_id = $2 AND user_id = $3',
            [workoutId, exerciseId, userId]
        );
        return result.rows[0];
    }

    async create(workoutExercise) {
        const result = await query(
            `INSERT INTO workout_exercises (workout_id, exercise_id, user_id, weight, sets, reps)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                workoutExercise.workout_id,
                workoutExercise.exercise_id,
                workoutExercise.user_id,
                workoutExercise.weight,
                workoutExercise.sets,
                workoutExercise.reps
            ]
        );
        return result.rows[0];
    }

    async update(id, workoutExercise, userId) {
        const result = await query(
            `UPDATE workout_exercises 
             SET weight = $1, sets = $2, reps = $3, updated_at = CURRENT_TIMESTAMP
             WHERE id = $4 AND user_id = $5
             RETURNING *`,
            [
                workoutExercise.weight,
                workoutExercise.sets,
                workoutExercise.reps,
                id,
                userId
            ]
        );
        return result.rows[0];
    }

    async delete(id, userId) {
        await query('DELETE FROM workout_exercises WHERE id = $1 AND user_id = $2', [id, userId]);
    }
}