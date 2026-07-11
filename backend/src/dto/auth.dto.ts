import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  // Zod strips unknown keys by default; explicit .strip() makes intent clear
  role: z.enum(['user', 'admin']).default('user'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
