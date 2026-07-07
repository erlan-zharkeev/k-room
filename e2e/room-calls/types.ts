import type { BrowserContext, Page } from '@playwright/test'

declare global {
  interface Window {
    __roomCallE2e?: {
      snapshot: () => Promise<RoomCallE2EMediaSnapshot>
    }
    webkitAudioContext?: typeof AudioContext
  }
}

export interface RoomCallE2EUser {
  email: string
  nickname: string
  password: string
}

export interface RoomCallE2ESession {
  context: BrowserContext
  page: Page
  user: RoomCallE2EUser
}

export interface RoomCallE2EPeerConnectionSnapshot {
  bytesReceived: number
  bytesSent: number
  connectionState: RTCPeerConnectionState
  iceConnectionState: RTCIceConnectionState
  inboundAudioPackets: number
  inboundVideoPackets: number
  outboundAudioPackets: number
  outboundVideoPackets: number
  signalingState: RTCSignalingState
}

export interface RoomCallE2EMediaSnapshot {
  displayMediaCalls: unknown[]
  getUserMediaCalls: unknown[]
  peerConnections: RoomCallE2EPeerConnectionSnapshot[]
  setSinkIdCalls: string[]
}
