import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log(env)
  const VITE_FIREBASE_API_KEY = JSON.stringify(env.VITE_FIREBASE_API_KEY)
  return {
    define: {
      VITE_FIREBASE_API_KEY
    },
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
      port: Number(env.VITE_CLIENT_PORT),
      proxy: {
        '/api': {
          target: `http://localhost:${env.VITE_SERVER_PORT}`,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
