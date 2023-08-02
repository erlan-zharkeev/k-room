import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import dotenv from 'dotenv'
const ENV = dotenv.config({ path: `.env.${process.env.NODE_ENV}` }).parsed

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  build: {
    outDir: './build'
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
      'common-types': path.resolve(__dirname, './../types')
    }
  },
  server: {
    port: Number(ENV.VITE_CLIENT_PORT),
    proxy: {
      '/api': {
        target: `http://localhost:${ENV.VITE_SERVER_PORT}`,
        changeOrigin: true,
        secure: false
      }
    }
  }
})
