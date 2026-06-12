import type {
  ChatRoom,
  EventRoomCallHandRaisedUpdated,
  EventRoomCallQuickCommandReceived,
  EventRoomCallSignalReceived,
  EventSendRoomCallSignal,
  MediaId,
  ROOM_CALL_SIGNAL_KIND,
  RoomCall,
  RoomCallMediaKind,
  RoomCallParticipant,
  RoomCallParticipantQuickCommandStateByUserId,
  RoomCallTemporaryQuickCommand
} from 'global-shared'
import type { Ref } from 'vue'

import type { ROOM_CALL_ACTIVITY_KIND } from './constants'

export type RoomCallDescriptionSignalKind = typeof ROOM_CALL_SIGNAL_KIND.OFFER | typeof ROOM_CALL_SIGNAL_KIND.ANSWER

export type RoomCallActivityKind = (typeof ROOM_CALL_ACTIVITY_KIND)[keyof typeof ROOM_CALL_ACTIVITY_KIND]

export type RoomCallLocalMediaStreamList = Array<MediaStream | null | undefined>

export type RoomCallRemoteStreamsByUserId = Record<string, MediaStream | undefined>

export type SendRoomCallSignal = (payload: EventSendRoomCallSignal) => void

export type HandleRoomCallSignalReceived = (payload: EventRoomCallSignalReceived) => void | Promise<void>

export type HandleRoomCallQuickCommandReceived = (payload: EventRoomCallQuickCommandReceived) => void | Promise<void>

export type HandleRoomCallHandRaisedUpdated = (payload: EventRoomCallHandRaisedUpdated) => void | Promise<void>

export interface RoomCallLocalTrackEntry {
  stream: MediaStream
  track: MediaStreamTrack
}

export interface RoomCallTemporaryQuickCommandState {
  id: string
  command: RoomCallTemporaryQuickCommand
}

export type RoomCallTemporaryQuickCommandByUserId = Record<string, RoomCallTemporaryQuickCommandState | undefined>

export type RoomCallHandRaisedByUserId = Record<string, boolean | undefined>

export type SyncInitialRoomCallParticipantQuickCommandStates = (
  quickCommandStateByUserId: RoomCallParticipantQuickCommandStateByUserId
) => void

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
  avatarId: MediaId
  canJoin: boolean
  canLeave: boolean
  dotColor: string
  isPrivateRoom: boolean
  kind: RoomCallActivityKind
  roomCall: RoomCall
  roomId: string
  text: string
  title: string
}

export interface RoomCallActivityRoomTitleUser {
  avatarId: MediaId
  nickname: string
}

export interface BuildRoomCallActivityTitleParams {
  isPrivateRoom: boolean
  room: ChatRoom
  users: RoomCallActivityRoomTitleUser[]
}

export interface BuildRoomCallActivityTextParams {
  activeParticipantQuantity: number
  isPrivateRoom: boolean
  participantText: string
  text: string
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

export interface CallActivityPanelProps {
  compact?: boolean
  openable?: boolean
  roomId?: string
}

export interface CallActivityPanelEmits {
  'open-room-call': [roomId: string]
}

export interface CallActivityPanelItemProps {
  compact: boolean
  disabled: boolean
  item: RoomCallActivityItem
  leaveLoading: boolean
  loading: boolean
  loadingMediaKind: RoomCallMediaKind | null
}

export interface CallActivityPanelItemEmits {
  'join-audio': []
  'join-video': []
  leave: []
  open: []
}

export interface RoomCallAudioContextMenuItemProps {
  roomId: string
}

export interface RoomCallAudioContextMenuItemEmits {
  select: []
}

export type RoomCallAudioContextMenuItemEmit = (event: 'select') => void
