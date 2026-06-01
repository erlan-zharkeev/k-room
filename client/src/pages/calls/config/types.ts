import type { MediaId } from 'global-shared'
import type { RouteLocationRaw } from 'vue-router'

export interface RoomCallHistoryItem {
  id: string
  calledAt: number
  description: string
  imageId?: MediaId
  isActive: boolean
  meta: string
  timeText: string
  title: string
  to: RouteLocationRaw
}

export interface RoomCallHistoryItemProps {
  item: RoomCallHistoryItem
}
