import { createHmac } from 'node:crypto'

import { afterEach, describe, expect, it, vi } from 'vitest'

const serverEnvMock = vi.hoisted(() => ({
  roomCalls: {
    turn: {
      credentialTtlSeconds: 3_600,
      sharedSecret: '',
      urls: [] as string[]
    }
  }
}))

vi.mock('src/app/env', () => ({ SERVER_ENV: serverEnvMock }))

const { buildRoomCallRtcConfiguration } = await import('./build-room-call-rtc-configuration')

describe('buildRoomCallRtcConfiguration', () => {
  afterEach(() => {
    vi.useRealTimers()
    serverEnvMock.roomCalls.turn.sharedSecret = ''
    serverEnvMock.roomCalls.turn.urls = []
  })

  it('returns STUN-only configuration when TURN is not configured', () => {
    expect(buildRoomCallRtcConfiguration('user-1')).toEqual({
      iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
    })
  })

  it('builds short-lived TURN REST credentials without exposing the shared secret', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-10T00:00:00.000Z'))
    serverEnvMock.roomCalls.turn.sharedSecret = 'turn-secret'
    serverEnvMock.roomCalls.turn.urls = ['turn:example.com:3478?transport=udp', 'turns:example.com:5349']

    const configuration = buildRoomCallRtcConfiguration('user-1')
    const turnServer = configuration.iceServers[1]
    const expiresAtSeconds = Math.floor(Date.now() / 1_000) + 3_600
    const username = `${expiresAtSeconds}:user-1`

    expect(turnServer).toEqual({
      credential: createHmac('sha1', 'turn-secret').update(username).digest('base64'),
      urls: ['turn:example.com:3478?transport=udp', 'turns:example.com:5349'],
      username
    })
    expect(JSON.stringify(configuration)).not.toContain('turn-secret')
  })
})
