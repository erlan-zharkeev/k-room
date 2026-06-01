import {
  formatNickname,
  getRoomOtherUserIds,
  isRoomPrivate,
  ROOM_CALL_MEDIA_KIND,
  type ChatRoom,
  type RoomCall,
  type RoomCallMediaKind
} from 'global-shared'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useRoomCall } from 'src/entities/room-call'
import { useLocalizedDateTime } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { useI18n, useScreen } from 'src/shared/lib'

import { CALLS_PAGE_I18N } from '../config/i18n'
import type { RoomCallHistoryItem } from '../config/types'
import { isRoomCallActive, isRoomCallMissed } from '../lib/resolve-room-call-state'
import {
  resolveRoomCallHistoryDescription,
  resolveRoomCallParticipantQuantity,
  sortRoomCallHistoryItems
} from '../lib/room-call-history'

export const useCallsPage = () => {
  const route = useRoute()
  const { isPortraitTabletOrLess } = useScreen()
  const { t } = useI18n()
  const { roomCalls } = useRoomCall()
  const { chatRooms } = useChatRoom()
  const { contactById } = useContact()
  const { knownUserById } = useKnownUser()
  const { user } = useUser()
  const { formatDateTime } = useLocalizedDateTime()

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
      const title = formatNickname(interlocutor?.nickname ?? '')

      return title || t(CALLS_PAGE_I18N.unknownRoom)
    }

    return t(CALLS_PAGE_I18N.unknownRoom)
  }

  const resolveCallMediaKindText = (mediaKind: RoomCallMediaKind) => {
    if (mediaKind === ROOM_CALL_MEDIA_KIND.AUDIO) return t(CALLS_PAGE_I18N.audioCall)
    if (mediaKind === ROOM_CALL_MEDIA_KIND.VIDEO) return t(CALLS_PAGE_I18N.videoCall)

    return t(CALLS_PAGE_I18N.screenCall)
  }

  const resolveCallStatusText = (roomCall: RoomCall) => {
    if (isRoomCallActive(roomCall)) return t(CALLS_PAGE_I18N.activeCall)
    if (isRoomCallMissed(roomCall)) return t(CALLS_PAGE_I18N.missedCall)

    return t(CALLS_PAGE_I18N.finishedCall)
  }

  const roomCallHistoryItems = computed<RoomCallHistoryItem[]>(() =>
    sortRoomCallHistoryItems(
      roomCalls.value.flatMap((roomCall) => {
        const room = roomById.value.get(roomCall.roomId)

        if (!room) {
          return []
        }

        const participantsQuantity = resolveRoomCallParticipantQuantity(roomCall)
        const meta = t(CALLS_PAGE_I18N.callParticipants)(participantsQuantity)
        const statusText = resolveCallStatusText(roomCall)
        const mediaKindText = resolveCallMediaKindText(roomCall.mediaKind)

        return {
          id: roomCall.id,
          calledAt: roomCall.calledAt,
          description: resolveRoomCallHistoryDescription(statusText, mediaKindText),
          imageId: room.avatarId,
          isActive: isRoomCallActive(roomCall),
          meta,
          timeText: formatDateTime(roomCall.calledAt),
          title: resolveRoomTitle(room),
          to: buildChatRoomRoute(room.id)
        }
      })
    )
  )

  return {
    roomCallHistoryItems
  }
}
