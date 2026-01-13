import AppError from './AppError.js';

export class ConflictError extends AppError {
    constructor(message = 'Conflict error') {
        super(message, 409);
    }
}