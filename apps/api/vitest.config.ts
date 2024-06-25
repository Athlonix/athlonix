/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    maxWorkers: 1,
    minWorkers: 1,
    coverage: {
      provider: 'v8',
      thresholds: {
        global: {
          statements: 20,
          branches: 20,
          functions: 20,
          lines: 20,
        },
      },
      reporter: ['text', 'html', 'json', 'json-summary'],
      reportOnFailure: true,
    },
  },
});
