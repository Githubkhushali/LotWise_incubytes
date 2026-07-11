import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../exceptions/AppError';

/**
 * Centralized error handler — must be registered as the last middleware in
 * app.ts (after all routes) so Express's 4-argument signature is recognised.
 *
 * Mapping:
 *   ValidationError  → 400 + field-level errors object
 *   Any other AppError → statusCode from the error + message
 *   Unknown errors   → 500 (details logged server-side only)
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // The 4th parameter is required by Express to identify error-handling
  // middleware — it must be present even if unused.
  _next: NextFunction
): void {
  if (err instanceof ValidationError && err.errors) {
    res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Unexpected errors: log full details server-side, return a generic message
  // so internal stack traces are never exposed to clients.
  console.error('Unexpected error:', err);
  res.status(500).json({ message: 'Internal server error' });
}
