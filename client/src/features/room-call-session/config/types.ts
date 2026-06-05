import type {
  ChatRoom,
  EventRoomCallSignalReceived,
  EventSendRoomCallSignal,
  ROOM_CALL_SIGNAL_KIND,
  RoomCall,
  RoomCallMediaKind,
  RoomCallParticipant
} from 'global-shared'
import type { Ref } from 'vue'

import type { ROOM_CALL_ACTIVITY_KIND } from './constants'

export type RoomCallDescriptionSignalKind = typeof ROOM_CALL_SIGNAL_KIND.OFFER | typeof ROOM_CALL_SIGNAL_KIND.ANSWER

export type RoomCallActivityKind = (typeof ROOM_CALL_ACTIVITY_KIND)[keyof typeof ROOM_CALL_ACTIVITY_KIND]

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

export interface RoomCallMediaButtonsProps {
  disabled: boolean
  loading: boolean
  loadingMediaKind?: RoomCallMediaKind | null
}

export interface RoomCallMediaButtonsEmits {
  start: [mediaKind: RoomCallMediaKind]
}

export interface RoomCallActivityItem {
  canJoin: boolean
  canLeave: boolean
  canMute: boolean
  canOpen: boolean
  dotColor: string
  isPrivateRoom: boolean
  kind: RoomCallActivityKind
  roomCall: RoomCall
  roomId: string
  text: string
  title: string
}

export interface RoomCallActivityRoomTitleUser {
  nickname: string
}

export interface BuildRoomCallActivityTitleParams {
  isPrivateRoom: boolean
  room: ChatRoom
  users: RoomCallActivityRoomTitleUser[]
}

export interface ResolveRoomCallActivityI18nParams {
  isPrivateRoom: boolean
  kind: RoomCallActivityKind
}

export interface ResolveRoomCallActivityKindParams {
  activeRoomCallId: string
  currentUserId: string
  roomCall: RoomCall
}

export interface UseRoomCallActivityParams {
  isOpenEnabled: Ref<boolean>
  openRoomCall: (roomId: string) => Promise<void> | void
  roomId?: Ref<string | undefined>
}

export interface RoomCallActivityPanelProps {
  compact?: boolean
  openable?: boolean
  roomId?: string
}

export interface RoomCallActivityPanelEmits {
  'open-room-call': [roomId: string]
}

export interface RoomCallActivityPanelItemProps {
  compact: boolean
  disabled: boolean
  item: RoomCallActivityItem
  leaveLoading: boolean
  loading: boolean
  loadingMediaKind: RoomCallMediaKind | null
}

export interface RoomCallActivityPanelItemEmits {
  'join-audio': []
  'join-video': []
  leave: []
  mute: []
}

export interface RoomCallAudioContextMenuItemProps {
  roomId: string
}

export interface RoomCallAudioContextMenuItemEmits {
  select: []
}

export type RoomCallAudioContextMenuItemEmit = (event: 'select') => void
