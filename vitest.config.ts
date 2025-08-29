import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.tests.unit.{ts,tsx}', '**/*.test.{ts,tsx}'], 
    exclude: [
      '**/*.e2e.*',        
      '**/node_modules/**',
      '**/dist/**',
      '**/.{git,cache,output,temp}/**'
    ],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.e2e.*', 'tests/e2e/**']
    }
  }
})