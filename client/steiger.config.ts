import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: ['./src/**/types.ts', './src/**/constants.ts'],
    rules: {
      'fsd/segments-by-purpose': 'off'
    }
  },
  {
    files: ['./src/shared/types/**'],
    rules: {
      'fsd/public-api': 'off',
      'fsd/segments-by-purpose': 'off'
    }
  }
])
