import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { chmod } from 'node:fs/promises'
import { isIP } from 'node:net'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn, spawnSync } from 'node:child_process'
import { request as httpRequest } from 'node:http'
import { request as httpsRequest } from 'node:https'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const isWindows = process.platform === 'win32'
const pnpmCommand = isWindows ? 'pnpm.cmd' : 'pnpm'
const LAN_FLAG = '--lan'
const LAN_IP_FLAG = '--lan-ip'
const DEFAULT_LAN_IP = '192.168.8.7'
const isLan = hasArgumentFlag(LAN_FLAG)
const lanIp = isLan ? resolveLanIp() : ''
const DOCKER_START_TIMEOUT_MS = 120_000
const DOCKER_POLL_INTERVAL_MS = 2_000
const DOCKER_STATUS_TIMEOUT_MS = 15_000
const SERVER_READY_TIMEOUT_MS = 120_000
const SERVER_READY_POLL_INTERVAL_MS = 1_000
const SERVER_READY_REQUEST_TIMEOUT_MS = 3_000
const DEV_SERVICE_RESTART_DELAY_MS = 1_000
const TIMING_PREFIX = '[dev-timing]'

if (isLan) {
  process.env.APP_HOST = `https://${lanIp}`
  process.env.API_HOST = `https://${lanIp}`
}

await runDev()

async function runDev() {
  const startupStartedAt = Date.now()
  process.chdir(rootDir)

  await timeStep('environment', () => {
    loadEnvFile('.env.development')
    loadEnvFile('.env.secret', { fillEmptyOnly: true })
    validateRequiredEnv()
  })

  await timeStep('pnpm install', () => run(pnpmCommand, ['install']))
  await timeStep('husky prepare', () => run(pnpmCommand, ['run', 'husky-prepare']))
  await timeStep('husky chmod', () => makeHookExecutableIfPossible())
  await timeStep('dev certificates', () =>
    ensureDevCertificates({
      lanIp: lanIp || DEFAULT_LAN_IP,
      shouldMatchLanIp: isLan
    })
  )
  await timeStep('docker daemon', () => ensureDockerAvailable())

  await timeStep('docker db', () =>
    ensureDockerContainer({
      name: 'db',
      image: 'mongo:latest',
      args: ['-d', '-p', '27017:27017', '--name', 'db']
    })
  )

  await timeStep('docker mongo-express', () =>
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
  )

  await timeStep('docker redis', () =>
    ensureDockerContainer({
      name: 'k-room-redis',
      image: 'redis:7-alpine',
      args: ['-d', '-p', '6380:6379', '--name', 'k-room-redis']
    })
  )

  const sharedEnv = readEnvFile('.env.shared')
  const serverPort = sharedEnv.SERVER_PORT ?? ''
  const clientPort = sharedEnv.CLIENT_PORT ?? ''
  const clientHost = process.env.APP_HOST ?? 'https://localhost'
  const serverHost = process.env.API_HOST ?? 'https://localhost'
  const serverHealthUrl = serverPort ? `${serverHost}:${serverPort}/health` : ''
  const serverReadinessUrl = serverPort ? `https://127.0.0.1:${serverPort}/health` : ''

  console.log(`Client: ${clientPort ? `${clientHost}:${clientPort}` : ''}`)
  console.log(`Server: ${serverPort ? `${serverHost}:${serverPort}` : ''}`)
  console.log(`Health: ${serverHealthUrl}`)
  console.log(`Readiness: ${serverReadinessUrl}`)

  await timeStep('global-shared build', () => run(pnpmCommand, ['--dir', 'global-shared', 'run', 'build']))
  await runDevServices(serverReadinessUrl, startupStartedAt)
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

function hasArgumentFlag(flag) {
  return process.argv.some((argument) => argument === flag || argument.startsWith(`${flag}=`))
}

function resolveLanIp() {
  const candidate = getArgumentValue(LAN_IP_FLAG) || getArgumentValue(LAN_FLAG) || process.env.LAN_IP || DEFAULT_LAN_IP

  if (isIP(candidate) === 4) return candidate

  console.error(`Cannot start LAN development environment. Expected IPv4 address, received "${candidate}".`)
  console.error(`Use "pnpm run dev:lan -- ${DEFAULT_LAN_IP}" or set LAN_IP before running the command.`)
  process.exit(1)
}

function getArgumentValue(flag) {
  const argumentWithValue = process.argv.find((argument) => argument.startsWith(`${flag}=`))

  if (argumentWithValue) {
    return argumentWithValue.slice(flag.length + 1).trim()
  }

  const flagIndex = process.argv.indexOf(flag)

  if (flagIndex === -1) return ''

  const nextArgument = process.argv[flagIndex + 1]

  if (!nextArgument || nextArgument.startsWith('--')) return ''

  return nextArgument.trim()
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

function ensureDevCertificates({ lanIp, shouldMatchLanIp }) {
  const certDir = join(rootDir, 'dev-certs')
  const keyPath = join(certDir, 'k-room-dev-key.pem')
  const certPath = join(certDir, 'k-room-dev.pem')
  const configPath = join(certDir, 'k-room-dev.openssl.cnf')
  const config = buildDevCertificateConfig(lanIp)
  const hasCertificate = existsSync(keyPath) && existsSync(certPath)

  if (hasCertificate && !shouldMatchLanIp) return

  if (hasCertificate && existsSync(configPath) && readFileSync(configPath, 'utf8') === config) {
    return
  }

  const opensslCommand = findOpenSslCommand()

  if (!opensslCommand) {
    console.error('Cannot create dev HTTPS certificates because openssl was not found.')
    console.error('Install OpenSSL or Git for Windows, then run pnpm run dev again.')
    process.exit(1)
  }

  mkdirSync(certDir, { recursive: true })

  writeFileSync(configPath, config)

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

function buildDevCertificateConfig(lanIp) {
  return [
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
    `IP.3 = ${lanIp}`,
    ''
  ].join('\n')
}

function findOpenSslCommand() {
  if (commandExists('openssl')) return 'openssl'

  const candidates = isWindows
    ? [String.raw`C:\Program Files\Git\mingw64\bin\openssl.exe`, String.raw`C:\Program Files\Git\usr\bin\openssl.exe`]
    : []

  return candidates.find((candidate) => existsSync(candidate))
}

async function ensureDockerAvailable() {
  const status = dockerStatus()

  if (status.isReady) return

  if (status.isMissing) {
    console.error('Cannot start development environment because Docker was not found.')
    console.error('Install Docker Desktop, then run pnpm dev again.')
    process.exit(1)
  }

  if (!isWindows || !startDockerDesktopIfPossible()) {
    reportDockerUnavailable(status.message)
    process.exit(1)
  }

  console.log('Docker Desktop is starting. Waiting for the Docker daemon...')

  const deadline = Date.now() + DOCKER_START_TIMEOUT_MS

  while (Date.now() < deadline) {
    await wait(DOCKER_POLL_INTERVAL_MS)

    if (dockerStatus().isReady) return
  }

  console.error('Docker Desktop did not become ready within 120 seconds.')
  console.error('Open Docker Desktop, wait until it finishes starting, then run pnpm dev again.')
  process.exit(1)
}

function dockerStatus() {
  const result = spawnSync('docker', ['info'], {
    cwd: rootDir,
    encoding: 'utf8',
    timeout: DOCKER_STATUS_TIMEOUT_MS
  })

  if (result.error) {
    return {
      isReady: false,
      isMissing: result.error.code === 'ENOENT',
      message: result.error.message
    }
  }

  if (result.status === 0) {
    return {
      isReady: true,
      isMissing: false,
      message: ''
    }
  }

  return {
    isReady: false,
    isMissing: false,
    message: (result.stderr || result.stdout).trim()
  }
}

function startDockerDesktopIfPossible() {
  const candidates = [
    process.env.ProgramFiles ? join(process.env.ProgramFiles, 'Docker', 'Docker', 'Docker Desktop.exe') : '',
    process.env['ProgramFiles(x86)']
      ? join(process.env['ProgramFiles(x86)'], 'Docker', 'Docker', 'Docker Desktop.exe')
      : '',
    process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'Docker', 'Docker Desktop.exe') : ''
  ]

  const executablePath = candidates.find((candidate) => candidate && existsSync(candidate))

  if (!executablePath) return false

  const child = spawn(executablePath, [], {
    detached: true,
    stdio: 'ignore'
  })

  child.on('error', () => {})
  child.unref()

  return true
}

function reportDockerUnavailable(message) {
  console.error('Cannot start development environment because the Docker daemon is not running.')

  if (message) {
    console.error(`Docker reported: ${message}`)
  }

  console.error('Start Docker Desktop, wait until it is ready, then run pnpm dev again.')
}

function wait(duration) {
  return new Promise((resolveTimeout) => {
    setTimeout(resolveTimeout, duration)
  })
}

async function timeStep(label, action) {
  const startedAt = Date.now()

  console.log(`${TIMING_PREFIX} ${label}: started`)

  try {
    return await action()
  } finally {
    reportTiming(label, startedAt)
  }
}

function reportTiming(label, startedAt, details = '') {
  const detailsText = details ? ` ${details}` : ''

  console.log(`${TIMING_PREFIX} ${label}: ${formatDuration(Date.now() - startedAt)}${detailsText}`)
}

function formatDuration(durationMs) {
  if (durationMs < 1_000) return `${durationMs}ms`

  const seconds = Math.round(durationMs / 1_000)

  if (seconds < 60) return `${seconds}s`

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes}m ${String(remainingSeconds).padStart(2, '0')}s`
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

async function runDevServices(serverHealthUrl, startupStartedAt) {
  const services = []
  let isShuttingDown = false

  const shutdown = (code) => {
    if (isShuttingDown) return

    isShuttingDown = true
    stopDevServices(services)
    process.exit(code)
  }

  process.once('SIGINT', () => shutdown(130))
  process.once('SIGTERM', () => shutdown(143))

  const servicesStartedAt = Date.now()

  services.push(startDevService('global-shared', pnpmCommand, ['--dir', 'global-shared', 'run', 'serve']))
  services.push(startDevService('client', pnpmCommand, ['--dir', 'client', 'run', 'serve']))
  services.push(
    startDevService('server', pnpmCommand, ['--dir', 'server', 'run', 'serve'], {
      restartOnExit: true
    })
  )
  reportTiming('dev service processes', servicesStartedAt)

  const startupResult = await Promise.race([
    waitForServerReady(serverHealthUrl).then((isReady) => ({ type: 'server-ready', isReady })),
    waitForDevServiceExit(services).then((exit) => ({ type: 'service-exit', exit }))
  ])

  if (startupResult.type === 'service-exit') {
    reportTiming('dev startup total', startupStartedAt, '(service exited)')
    reportDevServiceExit(startupResult.exit)
    shutdown(exitCodeFromDevServiceExit(startupResult.exit))
    return
  }

  if (!startupResult.isReady) {
    reportTiming('dev startup total', startupStartedAt, '(server readiness timeout)')
    console.error('Server did not become ready within 120 seconds.')
    console.error('Check the server logs above, then run pnpm dev again.')
    shutdown(1)
    return
  }

  reportTiming('dev startup total', startupStartedAt)

  const exit = await waitForDevServiceExit(services)
  reportDevServiceExit(exit)
  shutdown(exitCodeFromDevServiceExit(exit))
}

function startDevService(name, command, args, { restartOnExit = false } = {}) {
  let child
  let isStopping = false
  let startedOnce = false
  let resolveExit

  const exitPromise = new Promise((resolve) => {
    resolveExit = resolve
  })

  const startChild = () => {
    console.log(`${startedOnce ? 'Restarting' : 'Starting'} ${name}...`)
    startedOnce = true

    child = spawn(command, args, {
      cwd: rootDir,
      env: process.env,
      shell: shouldUseShell(command),
      stdio: 'inherit'
    })

    child.on('error', (error) => {
      handleExit({ name, code: 1, signal: null, error })
    })

    child.on('exit', (code, signal) => {
      handleExit({ name, code, signal, error: null })
    })
  }

  const handleExit = (exit) => {
    if (isStopping || !restartOnExit) {
      resolveExit(exit)
      return
    }

    reportDevServiceExit(exit)
    setTimeout(startChild, DEV_SERVICE_RESTART_DELAY_MS)
  }

  startChild()

  return {
    name,
    get child() {
      return child
    },
    stop() {
      isStopping = true
    },
    exitPromise
  }
}

function waitForDevServiceExit(services) {
  return Promise.race(services.map((service) => service.exitPromise))
}

function reportDevServiceExit(exit) {
  if (exit.error) {
    console.error(`${exit.name} failed: ${exit.error.message}`)
    return
  }

  if (exit.signal) {
    console.error(`${exit.name} stopped with signal ${exit.signal}.`)
    return
  }

  console.error(`${exit.name} exited with code ${exit.code ?? 1}.`)
}

function exitCodeFromDevServiceExit(exit) {
  if (exit.signal === 'SIGINT') return 130
  if (exit.signal === 'SIGTERM') return 143

  return exit.code ?? 1
}

function stopDevServices(services) {
  services.forEach((service) => {
    service.stop?.()

    const { child } = service

    if (!child?.pid) return
    if (child.exitCode !== null || child.signalCode !== null) return

    if (isWindows) {
      spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
        stdio: 'ignore'
      })
      return
    }

    child.kill('SIGTERM')
  })
}

async function waitForServerReady(serverHealthUrl) {
  if (!serverHealthUrl) {
    console.error('Cannot wait for server readiness because SERVER_PORT is missing in .env.shared.')
    return false
  }

  const startedAt = Date.now()
  const deadline = Date.now() + SERVER_READY_TIMEOUT_MS
  let checksCount = 0

  while (Date.now() < deadline) {
    checksCount += 1

    if (await requestServerHealth(serverHealthUrl)) {
      reportTiming('server readiness', startedAt, `(${checksCount} checks)`)
      return true
    }

    await wait(SERVER_READY_POLL_INTERVAL_MS)
  }

  reportTiming('server readiness', startedAt, `(${checksCount} checks, timeout)`)

  return false
}

function requestServerHealth(serverHealthUrl) {
  return new Promise((resolveHealth) => {
    let url

    try {
      url = new URL(serverHealthUrl)
    } catch {
      resolveHealth(false)
      return
    }

    const requestClient = url.protocol === 'http:' ? httpRequest : httpsRequest
    const requestOptions =
      url.protocol === 'https:'
        ? {
            method: 'GET',
            rejectUnauthorized: false,
            timeout: SERVER_READY_REQUEST_TIMEOUT_MS
          }
        : {
            method: 'GET',
            timeout: SERVER_READY_REQUEST_TIMEOUT_MS
          }
    const request = requestClient(url, requestOptions, (response) => {
      response.resume()
      resolveHealth(response.statusCode === 200)
    })

    request.on('error', () => resolveHealth(false))
    request.on('timeout', () => {
      request.destroy()
      resolveHealth(false)
    })
    request.end()
  })
}

function shouldUseShell(command) {
  return isWindows && command.endsWith('.cmd')
}
