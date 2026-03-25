import net from 'node:net'

import { E2E_ENV, E2E_TIMEOUTS } from './config'

const checkTcpPort = (host: string, port: number, timeoutMs: number) =>
  new Promise<boolean>((resolve) => {
    const socket = new net.Socket()

    const cleanup = () => {
      socket.removeAllListeners()
      socket.destroy()
    }

    socket.setTimeout(timeoutMs)

    socket.once('connect', () => {
      cleanup()
      resolve(true)
    })

    socket.once('timeout', () => {
      cleanup()
      resolve(false)
    })

    socket.once('error', () => {
      cleanup()
      resolve(false)
    })

    socket.connect(port, host)
  })

const globalSetup = async () => {
  const isMongoRunning = await checkTcpPort(
    E2E_ENV.PLAYWRIGHT_MONGO_HOST,
    E2E_ENV.PLAYWRIGHT_MONGO_PORT,
    E2E_TIMEOUTS.mongoConnection
  )

  if (!isMongoRunning) {
    throw new Error(
      `Playwright e2e requires MongoDB on ${E2E_ENV.PLAYWRIGHT_MONGO_HOST}:${E2E_ENV.PLAYWRIGHT_MONGO_PORT}. Start the local database first, then rerun the test.`
    )
  }
}

export default globalSetup
