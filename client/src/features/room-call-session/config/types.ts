import type {
  EventRoomCallSignalReceived,
  EventSendRoomCallSignal,
  ROOM_CALL_SIGNAL_KIND,
  RoomCallParticipant
} from 'global-shared'

export type RoomCallDescriptionSignalKind =
  | typeof ROOM_CALL_SIGNAL_KIND.OFFER
  | typeof ROOM_CALL_SIGNAL_KIND.ANSWER

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
