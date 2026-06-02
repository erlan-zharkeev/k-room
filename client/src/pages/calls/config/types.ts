import type { MediaId } from 'global-shared'
import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import type { ROOM_CALL_HISTORY_STATUS_KIND } from './constants'

export type RoomCallHistoryStatusKind =
  (typeof ROOM_CALL_HISTORY_STATUS_KIND)[keyof typeof ROOM_CALL_HISTORY_STATUS_KIND]

export interface RoomCallHistoryItem {
  id: string
  calledAt: number
  imageId?: MediaId
  isActive: boolean
  mediaIcon: Component | string
  mediaLabel: string
  meta: string
  statusColor: string
  statusText: string
  timeText: string
  title: string
  to: RouteLocationRaw
}

export interface RoomCallHistoryItemProps {
  item: RoomCallHistoryItem
}
