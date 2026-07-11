/**
 * TESTS: POST /api/auth/register — integration tests via Supertest
 *
 * These tests hit the full Express stack (middleware → controller → service →
 * real Prisma → lotwise_test DB). The DB is truncated before each test so
 * each case starts clean.
 */
import request from 'supertest';
import app from '../app';
import { truncateTables } from './helpers';

beforeEach(async () => {
  await truncateTables();
});

afterAll(async () => {
  await truncateTables();
});

describe('POST /api/auth/register', () => {
  const validBody = { email: 'alice@example.com', password: 'secret12' };

  // ─── Happy path ─────────────────────────────────────────────────────────────

  it('returns 201 with id, email, role — and no password field', async () => {
    const res = await request(app).post('/api/auth/register').send(validBody);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('alice@example.com');
    expect(res.body.role).toBe('user');
    expect(res.body).not.toHaveProperty('password');
  });

  it('lowercases the email before storing and echoes it lowercased', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'Alice@Example.com', password: 'secret12' });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('alice@example.com');
  });

  // ─── Validation — 400 responses ─────────────────────────────────────────────

  it('returns 400 with errors.email when email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ password: 'secret12' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('email');
  });

  it('returns 400 with errors.password when password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'alice@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('password');
  });

  it('returns 400 when email format is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'secret12' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('email');
  });

  it('returns 400 when password is shorter than 8 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'alice@example.com', password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('password');
  });

  it('returns 400 when body is empty', async () => {
    const res = await request(app).post('/api/auth/register').send({});

    expect(res.status).toBe(400);
  });

  // ─── Conflict — 409 ─────────────────────────────────────────────────────────

  it('returns 409 when the email is already registered', async () => {
    // First registration succeeds
    await request(app).post('/api/auth/register').send(validBody);

    // Second registration with same email must fail
    const res = await request(app).post('/api/auth/register').send(validBody);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('message');
  });
});
