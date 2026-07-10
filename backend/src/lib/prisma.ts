import { PrismaClient } from '@prisma/client';

// Re-use the same PrismaClient instance across the app.
// In development, hot-reloading can create many connections if a new client
// is instantiated per module; the global singleton pattern prevents that.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
