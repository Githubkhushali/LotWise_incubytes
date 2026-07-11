import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, requireRole } from '../auth.middleware';
import { UnauthorizedError, ForbiddenError } from '../../exceptions/AppError';

describe('Auth Middleware Unit Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {};
    nextFunction = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('authenticate', () => {
    it('throws UnauthorizedError if Authorization header is missing', () => {
      authenticate(mockReq as Request, mockRes as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(nextFunction.mock.calls[0][0].message).toBe('Missing authentication token');
    });

    it('throws UnauthorizedError if header does not start with Bearer', () => {
      mockReq.headers = { authorization: 'Basic sometoken' };
      
      authenticate(mockReq as Request, mockRes as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(nextFunction.mock.calls[0][0].message).toBe('Invalid authentication format');
    });

    it('throws UnauthorizedError if token is expired', () => {
      mockReq.headers = { authorization: 'Bearer expired.token.here' };
      
      const err = new jwt.TokenExpiredError('jwt expired', new Date());
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw err; });
      
      authenticate(mockReq as Request, mockRes as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(nextFunction.mock.calls[0][0].message).toBe('Token expired');
    });

    it('throws UnauthorizedError if token signature is invalid', () => {
      mockReq.headers = { authorization: 'Bearer invalid.token.here' };
      
      const err = new jwt.JsonWebTokenError('invalid signature');
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw err; });
      
      authenticate(mockReq as Request, mockRes as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(nextFunction.mock.calls[0][0].message).toBe('Invalid token');
    });

    it('attaches decoded payload to req.user and calls next() without error if valid', () => {
      const payload = { id: 'user1', email: 'a@a.com', role: 'user' };
      mockReq.headers = { authorization: 'Bearer valid.token.here' };
      
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => payload);
      
      authenticate(mockReq as Request, mockRes as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalledWith(); // Called with no args (success)
      expect(mockReq.user).toEqual(payload);
    });
  });

  describe('requireRole', () => {
    it('throws ForbiddenError if req.user is undefined', () => {
      const middleware = requireRole('admin');
      middleware(mockReq as Request, mockRes as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalledWith(expect.any(ForbiddenError));
      expect(nextFunction.mock.calls[0][0].message).toBe('Insufficient permissions');
    });

    it('throws ForbiddenError if user role does not match required role', () => {
      mockReq.user = { id: '1', email: 'a@a.com', role: 'user' };
      
      const middleware = requireRole('admin');
      middleware(mockReq as Request, mockRes as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalledWith(expect.any(ForbiddenError));
      expect(nextFunction.mock.calls[0][0].message).toBe('Insufficient permissions');
    });

    it('calls next() without error if user role matches', () => {
      mockReq.user = { id: '1', email: 'a@a.com', role: 'admin' };
      
      const middleware = requireRole('admin');
      middleware(mockReq as Request, mockRes as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalledWith(); // success
    });
  });
});
