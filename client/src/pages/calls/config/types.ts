import type { MediaId, RoomCallMediaKind } from 'global-shared'
import type { Component } from 'vue'

import type { ROOM_CALL_HISTORY_STATUS_KIND } from './constants'

export type RoomCallHistoryStatusKind =
  (typeof ROOM_CALL_HISTORY_STATUS_KIND)[keyof typeof ROOM_CALL_HISTORY_STATUS_KIND]

export interface RoomCallHistoryItem {
  id: string
  calledAt: number
  canStartCall: boolean
  imageId?: MediaId
  isActive: boolean
  mediaIcon: Component | string
  mediaLabel: string
  mediaKind: RoomCallMediaKind
  meta: string
  roomId: string
  statusColor: string
  statusText: string
  timeText: string
  title: string
}

export interface RoomCallHistoryItemProps {
  item: RoomCallHistoryItem
}

export interface RoomCallHistoryItemEmits {
  'start-room-call': [item: RoomCallHistoryItem]
}

export type RoomCallHistoryItemEmit = (event: 'start-room-call', item: RoomCallHistoryItem) => void
