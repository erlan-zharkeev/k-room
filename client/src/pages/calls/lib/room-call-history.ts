import { type RoomCall, type RoomCallMediaKind } from 'global-shared'

import { isRoomCallActive, isRoomCallMissed } from 'src/entities/room-call'

import { CALLS_PAGE_I18N } from '../config/i18n'
import type { RoomCallHistoryItem, RoomCallHistoryStatusKind } from '../config/types'

export const resolveRoomCallHistoryStatusKind = (roomCall: RoomCall): RoomCallHistoryStatusKind => {
  if (isRoomCallActive(roomCall)) return 'active'
  if (isRoomCallMissed(roomCall)) return 'missed'

  return 'finished'
}

export const resolveRoomCallHistoryStatusI18n = (statusKind: RoomCallHistoryStatusKind) => {
  if (statusKind === 'active') return CALLS_PAGE_I18N.activeCall
  if (statusKind === 'missed') return CALLS_PAGE_I18N.missedCall

  return CALLS_PAGE_I18N.finishedCall
}

export const resolveRoomCallHistoryMediaI18n = (mediaKind: RoomCallMediaKind) => {
  if (mediaKind === 'audio') return CALLS_PAGE_I18N.audioCall
  if (mediaKind === 'video') return CALLS_PAGE_I18N.videoCall

  return CALLS_PAGE_I18N.screenCall
}

export const sortRoomCallHistoryItems = (items: RoomCallHistoryItem[]) =>
  [...items].sort((current, next) => {
    if (current.isActive !== next.isActive) {
      return current.isActive ? -1 : 1
    }

    return next.calledAt - current.calledAt
  })
