/**
 * TESTS: POST /api/auth/login — integration tests via Supertest
 *
 * Each test starts with a fresh lotwise_test DB (truncateTables in beforeEach)
 * and registers a known user, then exercises the login route. This means we
 * depend on /register working correctly — a conscious trade-off: if register
 * breaks, login tests will fail too, making the failure obvious.
 */
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import { truncateTables, disconnectPrisma } from './helpers';

const REGISTERED_USER = {
  email: 'alice@example.com',
  password: 'secret12',
};

// beforeAll: clean any stale rows left by a previous run that was killed
// by --forceExit before its afterAll could run.
beforeAll(async () => {
  await truncateTables();
});

// beforeEach: truncate + re-seed a known user for every test.
beforeEach(async () => {
  await truncateTables();
  // Seed a known user for every test that needs valid credentials
  await request(app).post('/api/auth/register').send(REGISTERED_USER);
});

afterAll(async () => {
  await truncateTables();
  await disconnectPrisma();
});

describe('POST /api/auth/login', () => {
  // ─── Happy path ─────────────────────────────────────────────────────────────

  it('returns 200 with a token and user object — no password in user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(REGISTERED_USER);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('user object contains id, email, and role', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(REGISTERED_USER);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe('alice@example.com');
    expect(res.body.user.role).toBe('user');
  });

  it('returned token passes jwt.verify with the server secret', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(REGISTERED_USER);

    const secret = process.env.JWT_SECRET!;
    expect(() => jwt.verify(res.body.token, secret)).not.toThrow();
  });

  it('decoded token has an exp claim set in the future', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(REGISTERED_USER);

    const decoded = jwt.decode(res.body.token) as { exp: number };
    expect(decoded.exp).toBeDefined();
    // With JWT_EXPIRES_IN="15m" in .env.test, exp should be ~15 min from now
    expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('login succeeds with different email casing than registration', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'Alice@Example.com', password: 'secret12' });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('alice@example.com');
  });

  // ─── Validation — 400 responses ─────────────────────────────────────────────

  it('returns 400 with errors.email when email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'secret12' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('email');
  });

  it('returns 400 with errors.password when password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('password');
  });

  it('returns 400 when email format is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'secret12' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('email');
  });

  // ─── Auth failure — 401 responses ───────────────────────────────────────────

  it('returns 401 when the email is not registered', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ghost@example.com', password: 'secret12' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 401 when the password is wrong', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('401 message is identical for not-found vs wrong-password (anti-enumeration)', async () => {
    const notFoundRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ghost@example.com', password: 'secret12' });

    const wrongPwRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@example.com', password: 'wrongpassword' });

    expect(notFoundRes.body.message).toBe(wrongPwRes.body.message);
  });
});
