/// <reference types="vitest" />
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      thresholds: {
        global: {
          statements: 80,
          branches: 35,
          functions: 60,
          lines: 80,
        },
      },
      ignoreEmptyLines: true,
      exclude: ['**/edm.ts', '**/stripe.ts', '**/storage.ts', ...coverageConfigDefaults.exclude],
      reporter: ['text', 'html', 'json', 'json-summary'],
    },
  },
});
