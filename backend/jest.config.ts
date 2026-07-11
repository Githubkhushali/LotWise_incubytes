import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Load .env.test before any test suite runs so DATABASE_URL and
  // JWT_SECRET point at lotwise_test for the entire jest process.
  setupFiles: ['<rootDir>/src/test/loadEnv.ts'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  // ts-jest reads our tsconfig but relaxes strict for test files only
  // so that test helpers don't need full type annotations
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          // Keep strict on for application code; test files may import
          // from src so we still want most checks, but allow implicit any
          // in test utilities.
          strict: true,
        },
      },
    ],
  },
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
};

export default config;
