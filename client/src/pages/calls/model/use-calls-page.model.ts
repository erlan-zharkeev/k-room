import { getRoomOtherUserIds, isRoomPrivate, type ChatRoom, type RoomCall } from 'global-shared'
import { computed, watch } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { isRoomCallActive, useMissedRoomCall, useRoomCall } from 'src/entities/room-call'
import { useLocalizedDateTime, useSettings } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import { useActiveRoomCallSession } from 'src/features/room-call-session'
import { useI18n } from 'src/shared/lib'

import { ROOM_CALL_HISTORY_MEDIA_ICON_BY_KIND, ROOM_CALL_HISTORY_STATUS_COLOR_BY_KIND } from '../config/constants'
import { CALLS_PAGE_I18N } from '../config/i18n'
import type { RoomCallHistoryItem } from '../config/types'
import {
  resolveRoomCallHistoryMediaI18n,
  resolveRoomCallHistoryStatusI18n,
  resolveRoomCallHistoryStatusKind,
  sortRoomCallHistoryItems
} from '../lib/room-call-history'

import { useRoomCallHistorySearch } from './use-room-call-history-search.model'

export const useCallsPage = () => {
  const { t } = useI18n()
  const { roomCalls } = useRoomCall()
  const { chatRooms } = useChatRoom()
  const { contactById } = useContact()
  const { knownUserById } = useKnownUser()
  const { user } = useUser()
  const { settings, setByPath } = useSettings()
  const { missedRoomCalls, lastMissedRoomCallCalledAt } = useMissedRoomCall(
    () => user.value.id,
    () => settings.value.roomCalls.lastSeenMissedRoomCallCalledAt
  )
  const { formatDate, formatTime } = useLocalizedDateTime()
  const { canStartActiveRoomCall, startActiveRoomCall } = useActiveRoomCallSession()
  const {
    searchQuery,
    normalizedSearchQuery,
    searchedRoomCalls,
    searchHasMore,
    isSearchLoading,
    isSearchLoadingMore,
    loadMoreSearchedRoomCalls
  } = useRoomCallHistorySearch()

  const roomById = computed(() => new Map(chatRooms.value.map((room) => [room.id, room])))

  const resolveRoomTitle = (room: ChatRoom) => {
    if (room.chatName) {
      return room.chatName
    }

    if (isRoomPrivate(room)) {
      const [interlocutorId] = getRoomOtherUserIds(room, user.value.id)
      const interlocutor = contactById.value.get(interlocutorId) ?? knownUserById.value.get(interlocutorId)
      const title = interlocutor?.nickname ?? ''

      return title || t(CALLS_PAGE_I18N.unknownRoom)
    }

    return t(CALLS_PAGE_I18N.unknownRoom)
  }

  const buildRoomCallHistoryItems = (targetRoomCalls: RoomCall[]) =>
    sortRoomCallHistoryItems(
      targetRoomCalls.flatMap((roomCall) => {
        const room = roomById.value.get(roomCall.roomId)

        if (!room) {
          return []
        }

        const statusKind = resolveRoomCallHistoryStatusKind(roomCall)

        return {
          id: roomCall.id,
          calledAt: roomCall.calledAt,
          canStartCall: canStartActiveRoomCall(room.id),
          imageId: room.avatarId,
          isActive: isRoomCallActive(roomCall),
          mediaIcon: ROOM_CALL_HISTORY_MEDIA_ICON_BY_KIND[roomCall.mediaKind],
          mediaLabel: t(resolveRoomCallHistoryMediaI18n(roomCall.mediaKind)),
          mediaKind: roomCall.mediaKind,
          meta: formatTime(roomCall.calledAt),
          roomId: room.id,
          statusColor: ROOM_CALL_HISTORY_STATUS_COLOR_BY_KIND[statusKind],
          statusText: t(resolveRoomCallHistoryStatusI18n(statusKind)),
          timeText: formatDate(roomCall.calledAt),
          title: resolveRoomTitle(room)
        }
      })
    )

  const startRoomCallHistoryItem = async ({ mediaKind, roomId }: RoomCallHistoryItem) =>
    startActiveRoomCall(roomId, mediaKind)
  const markMissedRoomCallsAsSeen = async () => {
    if (lastMissedRoomCallCalledAt.value <= settings.value.roomCalls.lastSeenMissedRoomCallCalledAt) return

    await setByPath('roomCalls.lastSeenMissedRoomCallCalledAt', lastMissedRoomCallCalledAt.value)
  }

  const sourceRoomCalls = computed(() => (normalizedSearchQuery.value ? searchedRoomCalls.value : roomCalls.value))
  const roomCallHistoryItems = computed<RoomCallHistoryItem[]>(() => buildRoomCallHistoryItems(sourceRoomCalls.value))
  const showNoSearchResults = computed(
    () => Boolean(normalizedSearchQuery.value) && !isSearchLoading.value && roomCallHistoryItems.value.length === 0
  )
  const showNoCalls = computed(() => !normalizedSearchQuery.value && roomCallHistoryItems.value.length === 0)

  watch(
    missedRoomCalls,
    () => {
      void markMissedRoomCallsAsSeen()
    },
    { immediate: true }
  )

  return {
    searchQuery,
    roomCallHistoryItems,
    showNoSearchResults,
    showNoCalls,
    searchHasMore,
    isSearchLoading,
    isSearchLoadingMore,
    loadMoreSearchedRoomCalls,
    startRoomCallHistoryItem
  }
}
