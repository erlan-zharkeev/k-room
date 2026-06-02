import { getRoomOtherUserIds, isRoomPrivate, type ChatRoom } from 'global-shared'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useRoomCall } from 'src/entities/room-call'
import { useLocalizedDateTime } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { useI18n, useScreen } from 'src/shared/lib'

import { ROOM_CALL_HISTORY_MEDIA_ICON_BY_KIND, ROOM_CALL_HISTORY_STATUS_COLOR_BY_KIND } from '../config/constants'
import { CALLS_PAGE_I18N } from '../config/i18n'
import type { RoomCallHistoryItem } from '../config/types'
import { isRoomCallActive } from '../lib/resolve-room-call-state'
import {
  isRoomCallHistoryItemMatchedBySearchQuery,
  resolveRoomCallHistoryMediaI18n,
  resolveRoomCallHistoryStatusI18n,
  resolveRoomCallHistoryStatusKind,
  sortRoomCallHistoryItems
} from '../lib/room-call-history'

const searchQuery = ref('')

export const useCallsPage = () => {
  const route = useRoute()
  const { isPortraitTabletOrLess } = useScreen()
  const { t } = useI18n()
  const { roomCalls } = useRoomCall()
  const { chatRooms } = useChatRoom()
  const { contactById } = useContact()
  const { knownUserById } = useKnownUser()
  const { user } = useUser()
  const { formatDate, formatTime } = useLocalizedDateTime()

  const roomById = computed(() => new Map(chatRooms.value.map((room) => [room.id, room])))

  const buildChatRoomRoute = (roomId: string) => {
    const query = isPortraitTabletOrLess.value ? { ...route.query, view: 'content' } : route.query

    return {
      path: `${APP_PAGE_ROUTES.chatRooms}/${roomId}`,
      query
    }
  }

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

  const allRoomCallHistoryItems = computed<RoomCallHistoryItem[]>(() =>
    sortRoomCallHistoryItems(
      roomCalls.value.flatMap((roomCall) => {
        const room = roomById.value.get(roomCall.roomId)

        if (!room) {
          return []
        }

        const statusKind = resolveRoomCallHistoryStatusKind(roomCall)

        return {
          id: roomCall.id,
          calledAt: roomCall.calledAt,
          imageId: room.avatarId,
          isActive: isRoomCallActive(roomCall),
          mediaIcon: ROOM_CALL_HISTORY_MEDIA_ICON_BY_KIND[roomCall.mediaKind],
          mediaLabel: t(resolveRoomCallHistoryMediaI18n(roomCall.mediaKind)),
          meta: formatTime(roomCall.calledAt),
          statusColor: ROOM_CALL_HISTORY_STATUS_COLOR_BY_KIND[statusKind],
          statusText: t(resolveRoomCallHistoryStatusI18n(statusKind)),
          timeText: formatDate(roomCall.calledAt),
          title: resolveRoomTitle(room),
          to: buildChatRoomRoute(room.id)
        }
      })
    )
  )
  const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLowerCase())
  const roomCallHistoryItems = computed(() =>
    normalizedSearchQuery.value
      ? allRoomCallHistoryItems.value.filter((item) =>
          isRoomCallHistoryItemMatchedBySearchQuery(item, normalizedSearchQuery.value)
        )
      : allRoomCallHistoryItems.value
  )
  const showNoSearchResults = computed(
    () => Boolean(normalizedSearchQuery.value) && roomCallHistoryItems.value.length === 0
  )
  const showNoCalls = computed(() => !normalizedSearchQuery.value && allRoomCallHistoryItems.value.length === 0)

  return {
    searchQuery,
    roomCallHistoryItems,
    showNoSearchResults,
    showNoCalls
  }
}
