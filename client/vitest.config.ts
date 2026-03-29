import path from 'path'

import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vitest/config'

const CLIENT_ROOT = import.meta.dirname

export default defineConfig({
  plugins: [react(), svgr({})],
  resolve: {
    alias: {
      src: path.resolve(CLIENT_ROOT, 'src'),
      common: path.resolve(CLIENT_ROOT, './../common'),
      '~': path.resolve(CLIENT_ROOT, 'src/shared/config/styles')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/shared/**/*.test.{ts,tsx}'],
    css: true
  }
})
