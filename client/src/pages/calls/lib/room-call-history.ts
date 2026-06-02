import { ROOM_CALL_MEDIA_KIND, type RoomCall, type RoomCallMediaKind } from 'global-shared'

import { ROOM_CALL_HISTORY_STATUS_KIND } from '../config/constants'
import { CALLS_PAGE_I18N } from '../config/i18n'
import type { RoomCallHistoryItem, RoomCallHistoryStatusKind } from '../config/types'

import { isRoomCallActive, isRoomCallMissed } from './resolve-room-call-state'

export const resolveRoomCallHistoryStatusKind = (roomCall: RoomCall): RoomCallHistoryStatusKind => {
  if (isRoomCallActive(roomCall)) return ROOM_CALL_HISTORY_STATUS_KIND.ACTIVE
  if (isRoomCallMissed(roomCall)) return ROOM_CALL_HISTORY_STATUS_KIND.MISSED

  return ROOM_CALL_HISTORY_STATUS_KIND.FINISHED
}

export const resolveRoomCallHistoryStatusI18n = (statusKind: RoomCallHistoryStatusKind) => {
  if (statusKind === ROOM_CALL_HISTORY_STATUS_KIND.ACTIVE) return CALLS_PAGE_I18N.activeCall
  if (statusKind === ROOM_CALL_HISTORY_STATUS_KIND.MISSED) return CALLS_PAGE_I18N.missedCall

  return CALLS_PAGE_I18N.finishedCall
}

export const resolveRoomCallHistoryMediaI18n = (mediaKind: RoomCallMediaKind) => {
  if (mediaKind === ROOM_CALL_MEDIA_KIND.AUDIO) return CALLS_PAGE_I18N.audioCall
  if (mediaKind === ROOM_CALL_MEDIA_KIND.VIDEO) return CALLS_PAGE_I18N.videoCall

  return CALLS_PAGE_I18N.screenCall
}

export const isRoomCallHistoryItemMatchedBySearchQuery = (item: RoomCallHistoryItem, normalizedSearchQuery: string) =>
  item.title.toLowerCase().includes(normalizedSearchQuery)

export const sortRoomCallHistoryItems = (items: RoomCallHistoryItem[]) =>
  [...items].sort((current, next) => {
    if (current.isActive !== next.isActive) {
      return current.isActive ? -1 : 1
    }

    return next.calledAt - current.calledAt
  })
