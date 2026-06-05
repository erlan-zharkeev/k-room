import { ROOM_CALL_MEDIA_KIND, type RoomCall, type RoomCallMediaKind } from 'global-shared'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getRoomOtherUserIds, isRoomPrivate, useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useRoomCall } from 'src/entities/room-call'
import { useUser } from 'src/entities/user'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { useActiveRoomCallSession, useRoomCallSession } from 'src/features/room-call-session'
import { socketStatus } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'

import { CALL_ACTIVITY_PANEL_DOT_COLOR_BY_KIND, CALL_ACTIVITY_PANEL_KIND } from '../config/constants'
import { CALL_ACTIVITY_PANEL_I18N } from '../config/i18n'
import type { CallActivityPanelItem, CallActivityPanelRoomTitleUser } from '../config/types'
import { buildCallActivityPanelRoomTitle } from '../lib/build-call-activity-panel-room-title'
import { isCallActivityPanelRoomCallVisible } from '../lib/is-call-activity-panel-room-call-visible'
import { resolveCallActivityPanelI18n } from '../lib/resolve-call-activity-panel-i18n'
import { resolveCallActivityPanelKind } from '../lib/resolve-call-activity-panel-kind'
import { sortCallActivityPanelRoomCalls } from '../lib/sort-call-activity-panel-room-calls'

export const useCallActivityPanel = () => {
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
  const pendingAcceptRoomCallMediaKind = ref<RoomCallMediaKind | null>(null)
  const mutedIncomingRoomCallIds = reactive(new Set<string>())

  const resolveUserById = (id: string) => contactById.value.get(id) ?? knownUserById.value.get(id)

  const resolveRoomTitleUsers = (roomId: string) => {
    const room = getById(roomId)

    if (!room) {
      return []
    }

    return getRoomOtherUserIds(room, user.value.id).reduce<CallActivityPanelRoomTitleUser[]>((users, userId) => {
      const roomUser = resolveUserById(userId)

      if (roomUser) {
        users.push(roomUser)
      }

      return users
    }, [])
  }

  const visibleRoomCalls = computed(() =>
    sortCallActivityPanelRoomCalls(roomCalls.value.filter(isCallActivityPanelRoomCallVisible))
  )
  const activeSessionRoomCall = computed(() => {
    if (!activeRoomCall.value) {
      return
    }

    if (isCallActivityPanelRoomCallVisible(activeRoomCall.value)) {
      return activeRoomCall.value
    }
  })
  const incomingRoomCalls = computed(() =>
    visibleRoomCalls.value.filter((roomCall) => {
      const kind = resolveCallActivityPanelKind({
        activeRoomCallId: activeRoomCallId.value,
        currentUserId: user.value.id,
        roomCall
      })

      return kind === CALL_ACTIVITY_PANEL_KIND.INCOMING && !mutedIncomingRoomCallIds.has(roomCall.id)
    })
  )
  const outgoingRoomCall = computed(() =>
    visibleRoomCalls.value.find((roomCall) => {
      const kind = resolveCallActivityPanelKind({
        activeRoomCallId: activeRoomCallId.value,
        currentUserId: user.value.id,
        roomCall
      })

      return kind === CALL_ACTIVITY_PANEL_KIND.OUTGOING
    })
  )
  const joinableRoomCall = computed(() =>
    visibleRoomCalls.value.find((roomCall) => {
      const kind = resolveCallActivityPanelKind({
        activeRoomCallId: activeRoomCallId.value,
        currentUserId: user.value.id,
        roomCall
      })

      return kind === CALL_ACTIVITY_PANEL_KIND.JOINABLE
    })
  )
  const callActivityPanelStepperIndex = ref(0)
  const resolveCallActivityPanelItem = (roomCall: RoomCall): CallActivityPanelItem | undefined => {
    const room = getById(roomCall.roomId)

    if (!room) {
      return
    }

    const isPrivateRoom = isRoomPrivate(room)
    const kind = resolveCallActivityPanelKind({
      activeRoomCallId: activeRoomCallId.value,
      currentUserId: user.value.id,
      roomCall
    })
    const users = resolveRoomTitleUsers(room.id)
    const title =
      buildCallActivityPanelRoomTitle({ isPrivateRoom, room, users }) || t(CALL_ACTIVITY_PANEL_I18N.unknownRoom)
    const textSource = resolveCallActivityPanelI18n({ isPrivateRoom, kind })
    const canAccept = kind === CALL_ACTIVITY_PANEL_KIND.INCOMING
    const canLeaveActiveRoomCall = kind === CALL_ACTIVITY_PANEL_KIND.ACTIVE
    const canLeaveIncomingRoomCall = kind === CALL_ACTIVITY_PANEL_KIND.INCOMING
    const canLeaveOutgoingRoomCall = kind === CALL_ACTIVITY_PANEL_KIND.OUTGOING
    const canLeave = canLeaveActiveRoomCall || canLeaveIncomingRoomCall || canLeaveOutgoingRoomCall

    return {
      canAccept,
      canLeave,
      canMute: kind === CALL_ACTIVITY_PANEL_KIND.INCOMING,
      canOpen: kind === CALL_ACTIVITY_PANEL_KIND.ACTIVE || kind === CALL_ACTIVITY_PANEL_KIND.JOINABLE,
      dotColor: CALL_ACTIVITY_PANEL_DOT_COLOR_BY_KIND[kind],
      kind,
      roomCall,
      roomId: room.id,
      text: t(textSource)(title),
      title
    }
  }
  const resolveCallActivityPanelItems = (roomCalls: RoomCall[]) =>
    roomCalls.reduce<CallActivityPanelItem[]>((items, roomCall) => {
      const item = resolveCallActivityPanelItem(roomCall)

      if (item) {
        items.push(item)
      }

      return items
    }, [])
  const callActivityPanelItems = computed<CallActivityPanelItem[]>(() => {
    const prioritizedRoomCalls = [...incomingRoomCalls.value]
    const secondaryRoomCall = activeSessionRoomCall.value ?? outgoingRoomCall.value ?? joinableRoomCall.value

    if (secondaryRoomCall) {
      const hasSecondaryRoomCall = prioritizedRoomCalls.some(({ id }) => id === secondaryRoomCall.id)

      if (!hasSecondaryRoomCall) {
        prioritizedRoomCalls.push(secondaryRoomCall)
      }
    }

    return resolveCallActivityPanelItems(prioritizedRoomCalls)
  })
  const callActivityPanelItem = computed(() => callActivityPanelItems.value[callActivityPanelStepperIndex.value])
  const isCallActivityPanelDisabled = computed(() => socketStatus.isReconnecting.value)
  const isCallActivityPanelOpenable = computed(() => {
    const item = callActivityPanelItem.value

    if (!item) {
      return false
    }

    return item.canOpen && !isCallActivityPanelDisabled.value
  })

  watch(
    callActivityPanelItems,
    (items) => {
      if (items.length === 0) {
        callActivityPanelStepperIndex.value = 0
        return
      }

      if (callActivityPanelStepperIndex.value >= items.length) {
        callActivityPanelStepperIndex.value = items.length - 1
      }
    },
    { immediate: true }
  )

  const openRoomCallContent = (roomId: string) =>
    router.push({
      path: `${APP_PAGE_ROUTES.chatRooms}/${roomId}`,
      query: {
        ...route.query,
        view: 'content'
      }
    })

  const openRoomCall = async () => {
    const item = callActivityPanelItem.value

    if (!item) {
      return
    }

    if (!isCallActivityPanelOpenable.value) {
      return
    }

    await openRoomCallContent(item.roomId)
  }

  const acceptIncomingRoomCall = async (mediaKind: RoomCallMediaKind) => {
    const item = callActivityPanelItem.value

    if (!item) {
      return null
    }

    const cannotAcceptRoomCall = !item.canAccept
    const isAcceptInProgress = Boolean(pendingAcceptRoomCallMediaKind.value)
    const actionUnavailable =
      cannotAcceptRoomCall || isAcceptInProgress || isRoomCallSessionBusy.value || isCallActivityPanelDisabled.value

    if (actionUnavailable) {
      return null
    }

    pendingAcceptRoomCallMediaKind.value = mediaKind

    try {
      const roomCall = await joinActiveRoomCall(item.roomCall.id, mediaKind)

      if (roomCall) {
        await openRoomCallContent(item.roomId)
      }

      return roomCall
    } finally {
      pendingAcceptRoomCallMediaKind.value = null
    }
  }

  const acceptIncomingAudioRoomCall = () => acceptIncomingRoomCall(ROOM_CALL_MEDIA_KIND.AUDIO)
  const acceptIncomingVideoRoomCall = () => acceptIncomingRoomCall(ROOM_CALL_MEDIA_KIND.VIDEO)
  const muteIncomingRoomCall = () => {
    const item = callActivityPanelItem.value

    if (!item?.canMute || isCallActivityPanelDisabled.value) {
      return false
    }

    mutedIncomingRoomCallIds.add(item.roomCall.id)

    return true
  }
  const leaveRoomCall = async () => {
    const item = callActivityPanelItem.value

    if (!item) {
      return false
    }

    const cannotLeaveRoomCall = !item.canLeave
    const isIncomingRoomCall = item.kind === CALL_ACTIVITY_PANEL_KIND.INCOMING
    const isSessionBusyForLeave = isRoomCallSessionBusy.value && !isIncomingRoomCall
    const isDeclineInProgress = isDecliningRoomCall.value
    const actionUnavailable =
      cannotLeaveRoomCall || isSessionBusyForLeave || isDeclineInProgress || isCallActivityPanelDisabled.value

    if (actionUnavailable) {
      return false
    }

    if (isIncomingRoomCall) {
      isDecliningRoomCall.value = true

      try {
        return await declineRoomCall(item.roomCall.id)
      } finally {
        isDecliningRoomCall.value = false
      }
    }

    return leaveActiveRoomCall()
  }
  const isCallActivityPanelActionLoading = computed(() => {
    const isDeclineInProgress = isDecliningRoomCall.value
    const isJoinInProgress = isJoiningRoomCall.value
    const isLeaveInProgress = isLeavingRoomCall.value

    return isDeclineInProgress || isJoinInProgress || isLeaveInProgress
  })
  const isCallActivityPanelAcceptAudioLoading = computed(
    () => pendingAcceptRoomCallMediaKind.value === ROOM_CALL_MEDIA_KIND.AUDIO
  )
  const isCallActivityPanelAcceptVideoLoading = computed(
    () => pendingAcceptRoomCallMediaKind.value === ROOM_CALL_MEDIA_KIND.VIDEO
  )
  const isCallActivityPanelLeaveLoading = computed(() => {
    const item = callActivityPanelItem.value
    const isIncomingRoomCall = item?.kind === CALL_ACTIVITY_PANEL_KIND.INCOMING

    return isIncomingRoomCall ? isDecliningRoomCall.value : isLeavingRoomCall.value
  })

  return {
    callActivityPanelItem,
    callActivityPanelItems,
    callActivityPanelStepperIndex,
    isCallActivityPanelAcceptAudioLoading,
    isCallActivityPanelAcceptVideoLoading,
    isCallActivityPanelActionLoading,
    isCallActivityPanelDisabled,
    isCallActivityPanelLeaveLoading,
    isCallActivityPanelOpenable,
    acceptIncomingAudioRoomCall,
    acceptIncomingVideoRoomCall,
    leaveRoomCall,
    muteIncomingRoomCall,
    openRoomCall
  }
}
