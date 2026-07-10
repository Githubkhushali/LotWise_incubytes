import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom to simulate a browser environment for React component tests.
    environment: 'jsdom',
    // Import @testing-library/jest-dom matchers (toBeInTheDocument, etc.)
    // globally so every test file has them without explicit imports.
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
});
