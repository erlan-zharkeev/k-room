import type { ChatRoom, RoomCall } from 'global-shared'

import type { CALL_ACTIVITY_PANEL_KIND } from './constants'

export type CallActivityPanelKind = (typeof CALL_ACTIVITY_PANEL_KIND)[keyof typeof CALL_ACTIVITY_PANEL_KIND]

export interface CallActivityPanelItem {
  canAccept: boolean
  canLeave: boolean
  canMute: boolean
  canOpen: boolean
  dotColor: string
  kind: CallActivityPanelKind
  roomCall: RoomCall
  roomId: string
  text: string
  title: string
}

export interface CallActivityPanelRoomTitleUser {
  nickname: string
}

export interface BuildCallActivityPanelRoomTitleParams {
  isPrivateRoom: boolean
  room: ChatRoom
  users: CallActivityPanelRoomTitleUser[]
}

export interface ResolveCallActivityPanelI18nParams {
  isPrivateRoom: boolean
  kind: CallActivityPanelKind
}

export interface ResolveCallActivityPanelKindParams {
  activeRoomCallId: string
  currentUserId: string
  roomCall: RoomCall
}
