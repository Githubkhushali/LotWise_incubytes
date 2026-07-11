import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { errorHandler } from '../middleware/errorHandler';

// Throwaway Express app exclusively for testing middleware logic.
// This ensures dummy test routes are never registered in the production app.
const testApp = express();

testApp.get('/api/test/protected', authenticate, (req, res) => {
  res.status(200).json({ user: req.user });
});

testApp.get('/api/test/admin', authenticate, requireRole('admin'), (req, res) => {
  res.status(200).json({ message: 'Admin access granted' });
});

// Must mount error handler last to catch AppErrors thrown by middleware
testApp.use(errorHandler);

describe('Auth Middleware Integration Tests', () => {
  const SECRET = process.env.JWT_SECRET || 'testsecret';

  const generateToken = (payload: object, expiresIn: string = '1h') => {
    return jwt.sign(payload, SECRET, { expiresIn: expiresIn as any });
  };

  describe('GET /api/test/protected (authenticate)', () => {
    it('returns 401 when Authorization header is missing', async () => {
      const res = await request(testApp).get('/api/test/protected');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Missing authentication token');
    });

    it('returns 401 when token is expired', async () => {
      const expiredToken = generateToken({ id: '1', role: 'user' }, '-1h');
      
      const res = await request(testApp)
        .get('/api/test/protected')
        .set('Authorization', `Bearer ${expiredToken}`);
        
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Token expired');
    });

    it('returns 200 and passes req.user to controller when token is valid', async () => {
      const payload = { id: 'u123', email: 'test@example.com', role: 'user' };
      const validToken = generateToken(payload);
      
      const res = await request(testApp)
        .get('/api/test/protected')
        .set('Authorization', `Bearer ${validToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.user).toMatchObject({ id: 'u123', email: 'test@example.com', role: 'user' });
    });
  });

  describe('GET /api/test/admin (requireRole)', () => {
    it('returns 403 Forbidden when valid user lacks admin role', async () => {
      const userToken = generateToken({ id: 'u123', role: 'user' });
      
      const res = await request(testApp)
        .get('/api/test/admin')
        .set('Authorization', `Bearer ${userToken}`);
        
      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Insufficient permissions');
    });

    it('returns 200 OK when user has admin role', async () => {
      const adminToken = generateToken({ id: 'a456', role: 'admin' });
      
      const res = await request(testApp)
        .get('/api/test/admin')
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Admin access granted');
    });
  });
});
