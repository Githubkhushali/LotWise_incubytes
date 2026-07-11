import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ConflictError } from '../exceptions/AppError';

export interface RegisterInput {
  email: string;
  password: string;
  role?: Role;
}

export class AuthService {
  static async register(dto: RegisterInput) {
    const email = dto.email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: dto.role ?? Role.user,
      },
    });

    // Never return the hashed password — pick only safe fields explicitly
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
