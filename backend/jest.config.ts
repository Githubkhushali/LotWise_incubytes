import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Load .env.test before any test suite runs so DATABASE_URL and
  // JWT_SECRET point at lotwise_test for the entire jest process.
  setupFiles: ['<rootDir>/src/test/loadEnv.ts'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
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
