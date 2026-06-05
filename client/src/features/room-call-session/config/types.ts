import type {
  EventRoomCallSignalReceived,
  EventSendRoomCallSignal,
  ROOM_CALL_SIGNAL_KIND,
  RoomCallMediaKind,
  RoomCallParticipant
} from 'global-shared'

import type { ROOM_CALL_MEDIA_BUTTONS_ACTION } from './constants'

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

export type RoomCallMediaButtonsAction =
  (typeof ROOM_CALL_MEDIA_BUTTONS_ACTION)[keyof typeof ROOM_CALL_MEDIA_BUTTONS_ACTION]

export interface RoomCallMediaButtonsProps {
  action?: RoomCallMediaButtonsAction
  disabled: boolean
  loading: boolean
  loadingMediaKind?: RoomCallMediaKind | null
}

export interface RoomCallMediaButtonsEmits {
  start: [mediaKind: RoomCallMediaKind]
}

export interface RoomCallAudioContextMenuItemProps {
  roomId: string
}

export interface RoomCallAudioContextMenuItemEmits {
  select: []
}

export type RoomCallAudioContextMenuItemEmit = (event: 'select') => void
