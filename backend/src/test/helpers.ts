import { PrismaClient } from '@prisma/client';

// One shared Prisma client for all test helpers.
// Multiple integration test files run in the same Jest worker; disconnecting
// after each file would break subsequent files. We let Jest's process exit
// clean up the connection instead, and only call disconnect explicitly in
// the very last afterAll that runs (auth.login.integration.test.ts).
const prisma = new PrismaClient();

/**
 * Truncates all application tables in dependency-safe order.
 * Called in beforeEach hooks so each integration test starts clean.
 */
export async function truncateTables(): Promise<void> {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "User", "Vehicle" RESTART IDENTITY CASCADE`
  );
}

/**
 * Explicitly disconnects the shared Prisma client.
 * Call this ONCE in the afterAll of the LAST integration test file only.
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}

export { prisma as testPrisma };
