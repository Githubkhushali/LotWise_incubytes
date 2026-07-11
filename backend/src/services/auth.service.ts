import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ConflictError, UnauthorizedError } from '../exceptions/AppError';
import { LoginDto } from '../dto/auth.dto';

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

  static async login(dto: LoginDto) {
    const email = dto.email.toLowerCase();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Default to 1h if not specified in env
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    const token = jwt.sign(payload, secret, { expiresIn: expiresIn as any });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
