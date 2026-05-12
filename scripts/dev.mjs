import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { chmod } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn, spawnSync } from 'node:child_process'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const isWindows = process.platform === 'win32'
const pnpmCommand = isWindows ? 'pnpm.cmd' : 'pnpm'
const isLan = process.argv.includes('--lan')

if (isLan) {
  process.env.APP_HOST = 'https://192.168.8.7'
  process.env.API_HOST = 'https://192.168.8.7'
}

if (!isWindows && commandExists('zsh')) {
  const child = spawn('zsh', [join(rootDir, 'scripts/dev.sh')], {
    cwd: rootDir,
    env: process.env,
    stdio: 'inherit'
  })

  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal)
    process.exit(code ?? 1)
  })
} else {
  await runWindowsDev()
}

async function runWindowsDev() {
  process.chdir(rootDir)
  loadEnvFile('.env.development')
  loadEnvFile('.env.secret', { fillEmptyOnly: true })
  validateRequiredEnv()

  run(pnpmCommand, ['install'])
  run(pnpmCommand, ['run', 'husky-prepare'])
  await makeHookExecutableIfPossible()
  ensureDevCertificates()

  ensureDockerContainer({
    name: 'db',
    image: 'mongo:latest',
    args: ['-d', '-p', '27017:27017', '--name', 'db']
  })

  ensureDockerContainer({
    name: 'mongo-express',
    image: 'mongo-express:latest',
    args: [
      '-d',
      '-p',
      '47821:8081',
      '--name',
      'mongo-express',
      '-e',
      'ME_CONFIG_BASICAUTH_USERNAME=admin',
      '-e',
      'ME_CONFIG_BASICAUTH_PASSWORD=admin',
      '-e',
      'ME_CONFIG_MONGODB_URL=mongodb://host.docker.internal:27017/k-room-db'
    ]
  })

  ensureDockerContainer({
    name: 'redis',
    image: 'redis:7-alpine',
    args: ['-d', '-p', '6379:6379', '--name', 'redis']
  })

  const sharedEnv = readEnvFile('.env.shared')
  const serverPort = sharedEnv.SERVER_PORT ?? ''
  const clientPort = sharedEnv.CLIENT_PORT ?? ''
  const clientHost = process.env.APP_HOST ?? 'https://localhost'
  const serverHost = process.env.API_HOST ?? 'https://localhost'

  console.log(`Client: ${clientPort ? `${clientHost}:${clientPort}` : ''}`)
  console.log(`Server: ${serverPort ? `${serverHost}:${serverPort}` : ''}`)
  console.log(`Health: ${serverPort ? `${serverHost}:${serverPort}/health` : ''}`)

  run(pnpmCommand, ['--dir', 'global-shared', 'run', 'build'])
  await runPersistent(pnpmCommand, [
    '-r',
    '--parallel',
    '--stream',
    '--filter',
    'global-shared',
    '--filter',
    'k-room-client',
    '--filter',
    'k-room-server',
    'run',
    'serve'
  ])
}

function commandExists(command) {
  const checker = isWindows ? 'where' : 'command'
  const args = isWindows ? [command] : ['-v', command]
  return spawnSync(checker, args, { stdio: 'ignore', shell: !isWindows }).status === 0
}

function readEnvFile(fileName) {
  const filePath = join(rootDir, fileName)
  if (!existsSync(filePath)) return {}

  return readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .reduce((env, rawLine) => {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) return env

      const separatorIndex = line.indexOf('=')
      if (separatorIndex === -1) return env

      const key = line.slice(0, separatorIndex).trim()
      const value = stripQuotes(line.slice(separatorIndex + 1).trim())
      env[key] = value

      return env
    }, {})
}

function loadEnvFile(fileName, { fillEmptyOnly = false } = {}) {
  const env = readEnvFile(fileName)

  Object.entries(env).forEach(([key, value]) => {
    if (fillEmptyOnly) {
      if (!process.env[key] && value) {
        process.env[key] = value
      }

      return
    }

    process.env[key] ??= value
  })
}

function stripQuotes(value) {
  if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
    return value.slice(1, -1)
  }

  return value
}

function validateRequiredEnv() {
  const descriptions = {
    RESEND_API_KEY: 'required for password recovery and email delivery flows.',
    EMAIL_CONFIRM_SECRET: 'required to issue email confirmation tokens.',
    FIREBASE_API_KEY: 'required for Google sign-in on the client.'
  }

  const missing = Object.keys(descriptions).filter((key) => !process.env[key])

  if (missing.length === 0) return

  console.error('Cannot start development environment. Missing required variables in .env.development or .env.secret:')
  missing.forEach((key) => console.error(`  - ${key}: ${descriptions[key]}`))
  process.exit(1)
}

async function makeHookExecutableIfPossible() {
  if (isWindows) return

  try {
    await chmod(join(rootDir, '.husky/pre-commit'), 0o755)
  } catch {}
}

function ensureDevCertificates() {
  const certDir = join(rootDir, 'dev-certs')
  const keyPath = join(certDir, 'k-room-dev-key.pem')
  const certPath = join(certDir, 'k-room-dev.pem')

  if (existsSync(keyPath) && existsSync(certPath)) return

  const opensslCommand = findOpenSslCommand()

  if (!opensslCommand) {
    console.error('Cannot create dev HTTPS certificates because openssl was not found.')
    console.error('Install OpenSSL or Git for Windows, then run pnpm run dev again.')
    process.exit(1)
  }

  mkdirSync(certDir, { recursive: true })

  const configPath = join(certDir, 'k-room-dev.openssl.cnf')
  writeFileSync(
    configPath,
    [
      '[req]',
      'default_bits = 2048',
      'prompt = no',
      'default_md = sha256',
      'distinguished_name = dn',
      'x509_extensions = v3_req',
      '',
      '[dn]',
      'CN = localhost',
      '',
      '[v3_req]',
      'subjectAltName = @alt_names',
      '',
      '[alt_names]',
      'DNS.1 = localhost',
      'IP.1 = 127.0.0.1',
      'IP.2 = ::1',
      'IP.3 = 192.168.8.7',
      ''
    ].join('\n')
  )

  run(opensslCommand, [
    'req',
    '-x509',
    '-nodes',
    '-newkey',
    'rsa:2048',
    '-keyout',
    keyPath,
    '-out',
    certPath,
    '-days',
    '825',
    '-config',
    configPath
  ])
}

function findOpenSslCommand() {
  if (commandExists('openssl')) return 'openssl'

  const candidates = isWindows
    ? [String.raw`C:\Program Files\Git\mingw64\bin\openssl.exe`, String.raw`C:\Program Files\Git\usr\bin\openssl.exe`]
    : []

  return candidates.find((candidate) => existsSync(candidate))
}

function ensureDockerContainer({ name, image, args }) {
  if (isDockerContainerRunning(name)) return

  if (isDockerContainerCreated(name)) {
    run('docker', ['start', name])
    return
  }

  run('docker', ['run', ...args, image])
}

function isDockerContainerRunning(name) {
  return dockerNames(['ps']).includes(name)
}

function isDockerContainerCreated(name) {
  return dockerNames(['ps', '-a']).includes(name)
}

function dockerNames(args) {
  const result = spawnSync('docker', [...args, '--format', '{{.Names}}'], {
    cwd: rootDir,
    encoding: 'utf8'
  })

  if (result.error) {
    throw new Error(`Cannot run docker. ${result.error.message}`)
  }

  if (result.status !== 0) {
    throw new Error(result.stderr || `docker ${args.join(' ')} failed`)
  }

  return result.stdout.split(/\r?\n/).filter(Boolean)
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    env: process.env,
    shell: shouldUseShell(command),
    stdio: 'inherit'
  })

  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function runPersistent(command, args) {
  return new Promise((resolveProcess) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      env: process.env,
      shell: shouldUseShell(command),
      stdio: 'inherit'
    })

    child.on('error', (error) => {
      console.error(error.message)
      process.exit(1)
    })

    child.on('exit', (code, signal) => {
      if (signal) process.kill(process.pid, signal)
      process.exit(code ?? 1)
    })
  })
}

function shouldUseShell(command) {
  return isWindows && command.endsWith('.cmd')
}
