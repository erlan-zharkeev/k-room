import type {
  EventRoomCallSignalReceived,
  EventSendRoomCallSignal,
  ROOM_CALL_SIGNAL_KIND,
  RoomCallMediaKind,
  RoomCallParticipant
} from 'global-shared'
import type { Component } from 'vue'

import type { ROOM_CALL_SESSION_I18N } from './i18n'

export type RoomCallDescriptionSignalKind = typeof ROOM_CALL_SIGNAL_KIND.OFFER | typeof ROOM_CALL_SIGNAL_KIND.ANSWER

export type RoomCallLocalMediaStreamList = Array<MediaStream | null | undefined>

export type RoomCallRemoteStreamsByUserId = Record<string, MediaStream | undefined>

export type SendRoomCallSignal = (payload: EventSendRoomCallSignal) => void

export type HandleRoomCallSignalReceived = (payload: EventRoomCallSignalReceived) => void | Promise<void>

export interface RoomCallLocalTrackEntry {
  stream: MediaStream
  track: MediaStreamTrack
}

export interface ConnectRoomCallPeersParams {
  currentUserId: string
  localStreams: RoomCallLocalMediaStreamList
  participants: RoomCallParticipant[]
  roomCallId: string
}

export interface RoomCallStartButton {
  ariaLabel: (typeof ROOM_CALL_SESSION_I18N)[keyof typeof ROOM_CALL_SESSION_I18N]
  icon: Component | string
  mediaKind: RoomCallMediaKind
}

export interface RoomCallStartButtonsProps {
  disabled: boolean
  loading: boolean
}

export interface RoomCallStartButtonsEmits {
  start: [mediaKind: RoomCallMediaKind]
}
