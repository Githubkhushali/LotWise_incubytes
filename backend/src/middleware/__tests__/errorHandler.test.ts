/**
 * TESTS: errorHandler middleware — unit tests
 *
 * Verifies every branch: ValidationError with field errors, other AppErrors
 * by statusCode, and unknown errors → 500 with a generic message.
 */
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../errorHandler';
import {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../../exceptions/AppError';

/** Helper to build a minimal mock Response with spied methods. */
function mockResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

const mockReq = {} as Request;
const mockNext = jest.fn() as NextFunction;

describe('errorHandler middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('ValidationError', () => {
    it('returns 400 with message and field-level errors object', () => {
      const err = new ValidationError('Validation failed', { email: ['Must be a valid email'] });
      const res = mockResponse();

      errorHandler(err, mockReq, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: { email: ['Must be a valid email'] },
      });
    });

    it('falls through to AppError handler when errors property is absent', () => {
      // ValidationError without the errors dict — should hit the AppError branch
      const err = new ValidationError('Simple validation error');
      const res = mockResponse();

      errorHandler(err, mockReq, res, mockNext);

      // ValidationError extends AppError so it still matches the AppError branch
      // but err.errors is undefined so the first branch is skipped
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Simple validation error' });
    });
  });

  describe('Other AppError subclasses', () => {
    it.each([
      ['UnauthorizedError', new UnauthorizedError('Token missing'), 401],
      ['ForbiddenError', new ForbiddenError('No access'), 403],
      ['NotFoundError', new NotFoundError('Resource gone'), 404],
      ['ConflictError', new ConflictError('Already exists'), 409],
    ])('%s → correct status + message', (_name, err, expectedStatus) => {
      const res = mockResponse();
      errorHandler(err, mockReq, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ message: (err as any).message });
    });
  });

  describe('Unexpected / unknown errors', () => {
    it('returns 500 with generic message for a plain Error', () => {
      const err = new Error('Unexpected DB crash');
      const res = mockResponse();
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      errorHandler(err, mockReq, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
      // Confirm the real error was logged server-side
      expect(spy).toHaveBeenCalledWith('Unexpected error:', err);
      spy.mockRestore();
    });

    it('returns 500 for a thrown string', () => {
      const err = 'Something went very wrong';
      const res = mockResponse();
      jest.spyOn(console, 'error').mockImplementation(() => {});

      errorHandler(err, mockReq, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});
