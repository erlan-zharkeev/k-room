import { ROOM_CALL_MEDIA_KIND, type RoomCallMediaKind } from 'global-shared'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getRoomOtherUserIds, isRoomPrivate, useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useRoomCall } from 'src/entities/room-call'
import { useUser } from 'src/entities/user'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { useActiveRoomCallSession, useRoomCallSession } from 'src/features/room-call-session'
import { useI18n } from 'src/shared/lib'

import { CALL_STATUS_DOT_COLOR_BY_KIND, CALL_STATUS_KIND } from '../config/constants'
import { CALL_STATUS_I18N } from '../config/i18n'
import type { CallStatusItem, CallStatusRoomTitleUser } from '../config/types'
import { buildCallStatusRoomTitle } from '../lib/build-call-status-room-title'
import { isCallStatusRoomCallVisible } from '../lib/is-call-status-room-call-visible'
import { resolveCallStatusI18n } from '../lib/resolve-call-status-i18n'
import { resolveCallStatusKind } from '../lib/resolve-call-status-kind'
import { sortCallStatusRoomCalls } from '../lib/sort-call-status-room-calls'

export const useCallStatus = () => {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const { getById } = useChatRoom()
  const { contactById } = useContact()
  const { knownUserById } = useKnownUser()
  const { roomCalls } = useRoomCall()
  const { user } = useUser()
  const {
    activeRoomCall,
    activeRoomCallId,
    isJoiningRoomCall,
    isLeavingRoomCall,
    isRoomCallSessionBusy,
    joinActiveRoomCall,
    leaveActiveRoomCall
  } = useActiveRoomCallSession()
  const { declineRoomCall } = useRoomCallSession()
  const isDecliningRoomCall = ref(false)

  const resolveUserById = (id: string) => contactById.value.get(id) ?? knownUserById.value.get(id)

  const resolveRoomTitleUsers = (roomId: string) => {
    const room = getById(roomId)

    if (!room) {
      return []
    }

    return getRoomOtherUserIds(room, user.value.id).reduce<CallStatusRoomTitleUser[]>((users, userId) => {
      const roomUser = resolveUserById(userId)

      if (roomUser) {
        users.push(roomUser)
      }

      return users
    }, [])
  }

  const visibleRoomCalls = computed(() => sortCallStatusRoomCalls(roomCalls.value.filter(isCallStatusRoomCallVisible)))
  const activeSessionRoomCall = computed(() => {
    if (!activeRoomCall.value) {
      return
    }

    if (isCallStatusRoomCallVisible(activeRoomCall.value)) {
      return activeRoomCall.value
    }
  })
  const incomingRoomCall = computed(() =>
    visibleRoomCalls.value.find((roomCall) => {
      const kind = resolveCallStatusKind({
        activeRoomCallId: activeRoomCallId.value,
        currentUserId: user.value.id,
        roomCall
      })

      return kind === CALL_STATUS_KIND.INCOMING
    })
  )
  const outgoingRoomCall = computed(() =>
    visibleRoomCalls.value.find((roomCall) => {
      const kind = resolveCallStatusKind({
        activeRoomCallId: activeRoomCallId.value,
        currentUserId: user.value.id,
        roomCall
      })

      return kind === CALL_STATUS_KIND.OUTGOING
    })
  )
  const joinableRoomCall = computed(() =>
    visibleRoomCalls.value.find((roomCall) => {
      const kind = resolveCallStatusKind({
        activeRoomCallId: activeRoomCallId.value,
        currentUserId: user.value.id,
        roomCall
      })

      return kind === CALL_STATUS_KIND.JOINABLE
    })
  )
  const selectedRoomCall = computed(
    () => activeSessionRoomCall.value ?? incomingRoomCall.value ?? outgoingRoomCall.value ?? joinableRoomCall.value
  )
  const callStatusItem = computed<CallStatusItem | undefined>(() => {
    const roomCall = selectedRoomCall.value

    if (!roomCall) {
      return
    }

    const room = getById(roomCall.roomId)

    if (!room) {
      return
    }

    const isPrivateRoom = isRoomPrivate(room)
    const kind = resolveCallStatusKind({
      activeRoomCallId: activeRoomCallId.value,
      currentUserId: user.value.id,
      roomCall
    })
    const users = resolveRoomTitleUsers(room.id)
    const title = buildCallStatusRoomTitle({ isPrivateRoom, room, users }) || t(CALL_STATUS_I18N.unknownRoom)
    const textSource = resolveCallStatusI18n({ isPrivateRoom, kind })
    const canAccept = kind === CALL_STATUS_KIND.INCOMING
    const canLeaveActiveRoomCall = kind === CALL_STATUS_KIND.ACTIVE
    const canLeaveIncomingRoomCall = kind === CALL_STATUS_KIND.INCOMING
    const canLeaveOutgoingRoomCall = kind === CALL_STATUS_KIND.OUTGOING
    const canLeave = canLeaveActiveRoomCall || canLeaveIncomingRoomCall || canLeaveOutgoingRoomCall

    return {
      canAccept,
      canLeave,
      canOpen: kind === CALL_STATUS_KIND.ACTIVE || kind === CALL_STATUS_KIND.JOINABLE,
      dotColor: CALL_STATUS_DOT_COLOR_BY_KIND[kind],
      kind,
      roomCall,
      roomId: room.id,
      text: t(textSource)(title),
      title
    }
  })

  const openRoomCallContent = (roomId: string) =>
    router.push({
      path: `${APP_PAGE_ROUTES.chatRooms}/${roomId}`,
      query: {
        ...route.query,
        view: 'content'
      }
    })

  const openRoomCall = async () => {
    const item = callStatusItem.value

    if (!item) {
      return
    }

    if (!item.canOpen) {
      return
    }

    await openRoomCallContent(item.roomId)
  }

  const acceptIncomingRoomCall = async (mediaKind: RoomCallMediaKind) => {
    const item = callStatusItem.value

    if (!item) {
      return null
    }

    if (!item.canAccept || isRoomCallSessionBusy.value) {
      return null
    }

    const roomCall = await joinActiveRoomCall(item.roomCall.id, mediaKind)

    if (roomCall) {
      await openRoomCallContent(item.roomId)
    }

    return roomCall
  }

  const acceptIncomingAudioRoomCall = () => acceptIncomingRoomCall(ROOM_CALL_MEDIA_KIND.AUDIO)
  const acceptIncomingVideoRoomCall = () => acceptIncomingRoomCall(ROOM_CALL_MEDIA_KIND.VIDEO)
  const leaveRoomCall = async () => {
    const item = callStatusItem.value

    if (!item) {
      return false
    }

    const actionUnavailable = !item.canLeave || isRoomCallSessionBusy.value || isDecliningRoomCall.value

    if (actionUnavailable) {
      return false
    }

    if (item.kind === CALL_STATUS_KIND.INCOMING) {
      isDecliningRoomCall.value = true

      try {
        return await declineRoomCall(item.roomCall.id)
      } finally {
        isDecliningRoomCall.value = false
      }
    }

    return leaveActiveRoomCall()
  }
  const isCallStatusActionLoading = computed(
    () => isDecliningRoomCall.value || isJoiningRoomCall.value || isLeavingRoomCall.value
  )

  return {
    callStatusItem,
    isCallStatusActionLoading,
    acceptIncomingAudioRoomCall,
    acceptIncomingVideoRoomCall,
    leaveRoomCall,
    openRoomCall
  }
}
