import { describe, expect, it, vi } from 'vitest'

const envMock = vi.hoisted(() => ({
  SERVER_ENV: {
    secret: {
      accessTokenSecret: 'access-secret'
    }
  }
}))

const jwtMock = vi.hoisted(() => ({
  verify: vi.fn((_token: string, _secret: string, callback: (error: unknown, decoded?: unknown) => void) => {
    callback(null, { id: 'user-1' })
  })
}))

vi.mock('src/app/env', () => envMock)
vi.mock('jsonwebtoken', () => ({
  default: jwtMock
}))

const { socketAuthMiddleware } = await import('./auth.socket')

describe('auth.socket', () => {
  it('authenticates native desktop sockets from handshake auth tokens', async () => {
    const socket = {
      data: {},
      disconnect: vi.fn(),
      emit: vi.fn(),
      handshake: {
        auth: {
          accessToken: 'access-token',
          deviceId: 'device-1',
          language: 'ru'
        },
        headers: {}
      }
    }

    await expect(socketAuthMiddleware(socket as never)).resolves.toBe(true)

    expect(socket.data).toEqual({
      userId: 'user-1',
      deviceId: 'device-1',
      language: 'ru'
    })
    expect(socket.disconnect).not.toHaveBeenCalled()
  })
})
