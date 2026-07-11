/**
 * TESTS: RegisterDto (Zod schema)
 *
 * These are pure unit tests — no Express, no database, no mocks.
 * We import the schema directly and call .safeParse() to assert
 * that validation rules are enforced at the boundary.
 */
import { registerSchema } from '../../dto/auth.dto';

describe('RegisterDto — Zod schema validation', () => {
  // ─── Happy path ────────────────────────────────────────────────────────────

  it('accepts a valid email + password and defaults role to "user"', () => {
    const result = registerSchema.safeParse({
      email: 'alice@example.com',
      password: 'secret12',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe('user');
      expect(result.data.email).toBe('alice@example.com');
    }
  });

  it('accepts role "admin" when explicitly provided', () => {
    const result = registerSchema.safeParse({
      email: 'admin@example.com',
      password: 'secret12',
      role: 'admin',
    });
    expect(result.success).toBe(true);
  });

  it('strips unknown extra fields silently', () => {
    const result = registerSchema.safeParse({
      email: 'bob@example.com',
      password: 'secret12',
      unknownField: 'should be stripped',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty('unknownField');
    }
  });

  // ─── Email validation ───────────────────────────────────────────────────────

  it('rejects a missing email field', () => {
    const result = registerSchema.safeParse({ password: 'secret12' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.email).toBeDefined();
    }
  });

  it('rejects an invalid email format', () => {
    const result = registerSchema.safeParse({
      email: 'not-an-email',
      password: 'secret12',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.email).toBeDefined();
    }
  });

  it('rejects an empty string email', () => {
    const result = registerSchema.safeParse({ email: '', password: 'secret12' });
    expect(result.success).toBe(false);
  });

  // ─── Password validation ────────────────────────────────────────────────────

  it('rejects a missing password field', () => {
    const result = registerSchema.safeParse({ email: 'alice@example.com' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.password).toBeDefined();
    }
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      email: 'alice@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.password).toBeDefined();
    }
  });

  it('accepts a password of exactly 8 characters (minimum boundary)', () => {
    const result = registerSchema.safeParse({
      email: 'alice@example.com',
      password: '12345678',
    });
    expect(result.success).toBe(true);
  });

  // ─── Role validation ────────────────────────────────────────────────────────

  it('rejects an invalid role value', () => {
    const result = registerSchema.safeParse({
      email: 'alice@example.com',
      password: 'secret12',
      role: 'superuser',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.role).toBeDefined();
    }
  });
});
