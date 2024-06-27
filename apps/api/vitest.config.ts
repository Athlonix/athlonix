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
          statements: 70,
          branches: 30,
          functions: 40,
          lines: 70,
        },
      },
      ignoreEmptyLines: true,
      exclude: ['**/edm.ts', '**/stripe.ts', '**/storage.ts', ...coverageConfigDefaults.exclude],
      reporter: ['text', 'html', 'json', 'json-summary'],
    },
  },
});
