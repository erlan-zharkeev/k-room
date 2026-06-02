import type { ChatRoom, RoomCall } from 'global-shared'

import type { CALL_STATUS_KIND } from './constants'

export type CallStatusKind = (typeof CALL_STATUS_KIND)[keyof typeof CALL_STATUS_KIND]

export interface CallStatusItem {
  canAccept: boolean
  canLeave: boolean
  canOpen: boolean
  dotColor: string
  kind: CallStatusKind
  roomCall: RoomCall
  roomId: string
  text: string
  title: string
}

export interface CallStatusRoomTitleUser {
  nickname: string
}

export interface BuildCallStatusRoomTitleParams {
  isPrivateRoom: boolean
  room: ChatRoom
  users: CallStatusRoomTitleUser[]
}

export interface ResolveCallStatusI18nParams {
  isPrivateRoom: boolean
  kind: CallStatusKind
}

export interface ResolveCallStatusKindParams {
  activeRoomCallId: string
  currentUserId: string
  roomCall: RoomCall
}
