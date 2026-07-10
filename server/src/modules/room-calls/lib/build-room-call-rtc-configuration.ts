import { createHmac } from 'node:crypto'

import { ROOM_CALL_STUN_URLS, type RoomCallIceServer, type RoomCallRtcConfiguration } from 'global-shared'

import { SERVER_ENV } from 'src/app/env'

const buildRoomCallTurnIceServer = (userId: string): RoomCallIceServer | null => {
  const { credentialTtlSeconds, sharedSecret, urls } = SERVER_ENV.roomCalls.turn

  if (!sharedSecret || !urls.length) {
    return null
  }

  const expiresAtSeconds = Math.floor(Date.now() / 1_000) + credentialTtlSeconds
  const username = `${expiresAtSeconds}:${userId}`

  return {
    credential: createHmac('sha1', sharedSecret).update(username).digest('base64'),
    urls: [...urls],
    username
  }
}

export const buildRoomCallRtcConfiguration = (userId: string): RoomCallRtcConfiguration => {
  const iceServers: RoomCallIceServer[] = [{ urls: [...ROOM_CALL_STUN_URLS] }]
  const turnIceServer = buildRoomCallTurnIceServer(userId)

  if (turnIceServer) {
    iceServers.push(turnIceServer)
  }

  return { iceServers }
}
