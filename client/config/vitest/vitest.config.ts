import path from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'
import svgr from 'vite-plugin-svgr'

const CLIENT_ROOT = path.resolve(import.meta.dirname, '../..')

export default defineConfig({
  plugins: [react(), svgr({})],
  resolve: {
    alias: {
      src: path.resolve(CLIENT_ROOT, 'src'),
      common: path.resolve(CLIENT_ROOT, '../common/index.ts'),
      '~': path.resolve(CLIENT_ROOT, 'src/shared/config/styles')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['config/vitest/setup.ts'],
    include: ['src/shared/**/*.test.{ts,tsx}'],
    css: true
  }
})
