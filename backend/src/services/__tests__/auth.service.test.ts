/**
 * TESTS: AuthService.register() — unit tests, Prisma mocked
 *
 * The service contains all business logic. Mocking prisma means these
 * tests run in-memory with zero DB I/O — fast and deterministic.
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../services/auth.service';
import { prisma } from '../../lib/prisma';
import { ConflictError, UnauthorizedError } from '../../exceptions/AppError';

// Mock the entire prisma module so no real DB calls are made
jest.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const mockFindUnique = prisma.user.findUnique as jest.MockedFunction<
  typeof prisma.user.findUnique
>;
const mockCreate = prisma.user.create as jest.MockedFunction<
  typeof prisma.user.create
>;

describe('AuthService.register()', () => {
  const validInput = { email: 'Alice@Example.com', password: 'secret12' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Happy path ─────────────────────────────────────────────────────────────

  it('returns id, email, and role — never the password field', async () => {
    mockFindUnique.mockResolvedValue(null); // email not taken
    mockCreate.mockResolvedValue({
      id: 'cuid-1',
      email: 'alice@example.com',
      password: 'hashed',
      role: 'user',
      createdAt: new Date(),
    });

    const result = await AuthService.register(validInput);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('role');
    expect(result).not.toHaveProperty('password');
  });

  it('stores the email in lowercase regardless of input casing', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: 'cuid-1',
      email: 'alice@example.com',
      password: 'hashed',
      role: 'user',
      createdAt: new Date(),
    });

    await AuthService.register({ email: 'Alice@Example.com', password: 'secret12' });

    const createCall = mockCreate.mock.calls[0][0];
    expect(createCall.data.email).toBe('alice@example.com');
  });

  it('stores a bcrypt hash — not the plaintext password', async () => {
    mockFindUnique.mockResolvedValue(null);

    let capturedHash = '';
    mockCreate.mockImplementation(
      // Cast through unknown: jest returns a Promise but Prisma's type expects
      // PrismaPromise — functionally identical at runtime, TS-incompatible.
      (async (args: Parameters<typeof prisma.user.create>[0]) => {
        capturedHash = args.data.password as string;
        return {
          id: 'cuid-1',
          email: 'alice@example.com',
          password: capturedHash,
          role: 'user' as const,
          createdAt: new Date(),
        };
      }) as unknown as typeof prisma.user.create
    );

    await AuthService.register(validInput);

    expect(capturedHash).not.toBe(validInput.password);
    const isMatch = await bcrypt.compare(validInput.password, capturedHash);
    expect(isMatch).toBe(true);
  });

  it('defaults role to "user" when not provided', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: 'cuid-1',
      email: 'alice@example.com',
      password: 'hashed',
      role: 'user',
      createdAt: new Date(),
    });

    await AuthService.register(validInput);

    const createCall = mockCreate.mock.calls[0][0];
    expect(createCall.data.role).toBe('user');
  });

  // ─── Conflict ────────────────────────────────────────────────────────────────

  it('throws ConflictError when email is already registered', async () => {
    mockFindUnique.mockResolvedValue({
      id: 'existing-id',
      email: 'alice@example.com',
      password: 'hashed',
      role: 'user',
      createdAt: new Date(),
    });

    await expect(AuthService.register(validInput)).rejects.toThrow(ConflictError);
  });

  // ─── Unexpected DB error propagation ────────────────────────────────────────

  it('propagates unexpected DB errors without swallowing them', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockRejectedValue(new Error('DB connection lost'));

    await expect(AuthService.register(validInput)).rejects.toThrow('DB connection lost');
  });
});

/**
 * TESTS: AuthService.login() — unit tests, Prisma mocked, jwt runs for real
 *
 * bcrypt and jwt are NOT mocked here — we let them run so the token returned
 * is a real signed JWT that we can verify. Only Prisma is mocked to keep
 * tests fast and DB-free.
 *
 * Setup: we bcrypt-hash a known password once in beforeAll, then configure
 * the Prisma mock to return a user with that hash.
 */
describe('AuthService.login()', () => {
  const mockUser = {
    id: 'cuid-login-1',
    email: 'alice@example.com',
    role: 'user' as const,
    createdAt: new Date(),
    // knownHash is set in beforeAll — placeholder satisfies TS until then
    password: '',
  };

  beforeAll(async () => {
    // Pre-hash once; bcrypt is slow so we avoid hashing per-test
    mockUser.password = await bcrypt.hash('correct_password', 10);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Happy path ─────────────────────────────────────────────────────────────

  it('returns a token and a user object — no password in user', async () => {
    mockFindUnique.mockResolvedValue({ ...mockUser });

    const result = await AuthService.login({
      email: 'alice@example.com',
      password: 'correct_password',
    });

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('user');
    expect(result.user).not.toHaveProperty('password');
  });

  it('token is a valid JWT that passes jwt.verify with the correct secret', async () => {
    mockFindUnique.mockResolvedValue({ ...mockUser });

    const { token } = await AuthService.login({
      email: 'alice@example.com',
      password: 'correct_password',
    });

    // jwt.verify throws if the token is malformed or signed with the wrong secret
    const secret = process.env.JWT_SECRET!;
    expect(() => jwt.verify(token, secret)).not.toThrow();
  });

  it('decoded token payload contains id, email, and role', async () => {
    mockFindUnique.mockResolvedValue({ ...mockUser });

    const { token } = await AuthService.login({
      email: 'alice@example.com',
      password: 'correct_password',
    });

    const decoded = jwt.decode(token) as { id: string; email: string; role: string };
    expect(decoded.id).toBe(mockUser.id);
    expect(decoded.email).toBe(mockUser.email);
    expect(decoded.role).toBe(mockUser.role);
  });

  it('decoded token has an exp claim set in the future', async () => {
    mockFindUnique.mockResolvedValue({ ...mockUser });

    const { token } = await AuthService.login({
      email: 'alice@example.com',
      password: 'correct_password',
    });

    const decoded = jwt.decode(token) as { exp: number };
    expect(decoded.exp).toBeDefined();
    expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('looks up the user by lowercased email', async () => {
    mockFindUnique.mockResolvedValue({ ...mockUser });

    await AuthService.login({ email: 'Alice@Example.com', password: 'correct_password' });

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: 'alice@example.com' },
    });
  });

  // ─── Failure — anti-enumeration ──────────────────────────────────────────────

  it('throws UnauthorizedError when the email is not registered', async () => {
    mockFindUnique.mockResolvedValue(null);

    await expect(
      AuthService.login({ email: 'unknown@example.com', password: 'correct_password' })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws UnauthorizedError when the password is wrong', async () => {
    mockFindUnique.mockResolvedValue({ ...mockUser });

    await expect(
      AuthService.login({ email: 'alice@example.com', password: 'wrong_password' })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws identical message for not-found and wrong-password (anti-enumeration)', async () => {
    // Case 1: user not found
    mockFindUnique.mockResolvedValue(null);
    let notFoundError!: UnauthorizedError;
    try {
      await AuthService.login({ email: 'ghost@example.com', password: 'pw' });
    } catch (e) {
      notFoundError = e as UnauthorizedError;
    }

    // Case 2: wrong password
    mockFindUnique.mockResolvedValue({ ...mockUser });
    let wrongPwError!: UnauthorizedError;
    try {
      await AuthService.login({ email: 'alice@example.com', password: 'wrong' });
    } catch (e) {
      wrongPwError = e as UnauthorizedError;
    }

    expect(notFoundError.message).toBe(wrongPwError.message);
  });
});
