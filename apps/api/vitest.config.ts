/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      thresholds: {
        global: {
          statements: 70,
          branches: 30,
          functions: 40,
          lines: 70,
        },
      },
      reporter: ['text', 'html', 'json', 'json-summary'],
    },
  },
});
