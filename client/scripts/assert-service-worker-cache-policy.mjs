import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptsDir = dirname(fileURLToPath(import.meta.url))
const clientDir = resolve(scriptsDir, '..')
const swPath = resolve(clientDir, 'build', 'sw.js')

const fail = (message) => {
  console.error(`[service-worker-cache-policy] ${message}`)
  process.exit(1)
}

if (process.env.TAURI_ENV_PLATFORM) {
  console.log('[service-worker-cache-policy] skipped for Tauri build')
  process.exit(0)
}

if (!existsSync(swPath)) {
  fail('build/sw.js is missing. Web builds must generate a service worker for push notifications.')
}

const serviceWorker = readFileSync(swPath, 'utf8')

const forbiddenPatterns = [
  {
    description: 'navigation fallback to cached index.html',
    pattern: /createHandlerBoundToURL\(["']index\.html["']\)/
  },
  {
    description: 'app shell precache entry',
    pattern: /url:["'](?:index\.html|client-recovery\.js|service-worker-register\.js|registerSW\.js)["']/
  },
  {
    description: 'app JS/CSS precache entry',
    pattern: /url:["']assets\/[^"']+\.(?:js|css)["']/
  },
  {
    description: 'document runtime cache',
    pattern: /cacheName:["']html-cache["']/
  },
  {
    description: 'style runtime cache',
    pattern: /cacheName:["']style-cache["']/
  },
  {
    description: 'script runtime cache',
    pattern: /cacheName:["']script-cache["']/
  }
]

const requiredPatterns = [
  {
    description: 'web push handler import',
    pattern: /importScripts\(["']web-push-sw\.js["']\)/
  },
  {
    description: 'immediate service worker activation',
    pattern: /self\.skipWaiting\(\)/
  },
  {
    description: 'service worker client claiming',
    pattern: /(?:self|\w+)\.clientsClaim\(\)/
  }
]

for (const { description, pattern } of forbiddenPatterns) {
  if (pattern.test(serviceWorker)) {
    fail(`Unexpected ${description} in build/sw.js.`)
  }
}

for (const { description, pattern } of requiredPatterns) {
  if (!pattern.test(serviceWorker)) {
    fail(`Missing ${description} in build/sw.js.`)
  }
}

console.log('[service-worker-cache-policy] ok')
