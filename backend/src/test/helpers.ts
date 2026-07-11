import { PrismaClient } from '@prisma/client';

// A dedicated Prisma client for test helpers — isolated from the app singleton
// so teardown doesn't interfere with connection pooling during test runs.
const prisma = new PrismaClient();

/**
 * Truncates all application tables in dependency-safe order.
 * Called in afterEach/afterAll hooks to keep integration tests repeatable.
 * Uses TRUNCATE … CASCADE so foreign-key order doesn't matter.
 */
export async function truncateTables(): Promise<void> {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "User", "Vehicle" RESTART IDENTITY CASCADE`
  );
}

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}

export { prisma as testPrisma };
