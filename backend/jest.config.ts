import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Load .env.test before any test suite runs so DATABASE_URL and
  // JWT_SECRET point at lotwise_test for the entire jest process.
  setupFiles: ['<rootDir>/src/test/loadEnv.ts'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  // Enforce serial execution natively in the config so that running
  // 'npx jest' manually doesn't fall back to parallel execution. Parallel
  // execution against the shared lotwise_test DB causes P2002 collisions.
  maxWorkers: 1,
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          strict: true,
        },
      },
    ],
  },
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
};

export default config;
