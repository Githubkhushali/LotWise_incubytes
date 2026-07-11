/**
 * TESTS: AuthService.register() — unit tests, Prisma mocked
 *
 * The service contains all business logic. Mocking prisma means these
 * tests run in-memory with zero DB I/O — fast and deterministic.
 */
import bcrypt from 'bcryptjs';
import { AuthService } from '../../services/auth.service';
import { prisma } from '../../lib/prisma';
import { ConflictError } from '../../exceptions/AppError';

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
