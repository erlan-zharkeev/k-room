import { type RoomCall, type RoomCallMediaKind } from 'global-shared'
import { computed, ref, watch } from 'vue'

import { getRoomOtherUserIds, isRoomPrivate, useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useRoomCall } from 'src/entities/room-call'
import { useUser } from 'src/entities/user'
import { socket, socketStatus } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'

import { ROOM_CALL_ACTIVITY_DOT_COLOR_BY_KIND } from '../config/constants'
import { ROOM_CALL_SESSION_I18N } from '../config/i18n'
import type { RoomCallActivityItem, RoomCallActivityRoomTitleUser, UseRoomCallActivityParams } from '../config/types'
import {
  buildRoomCallActivityText,
  resolveActiveRoomCallParticipantQuantity
} from '../lib/build-room-call-activity-text'
import { buildRoomCallActivityTitle } from '../lib/build-room-call-activity-title'
import { resolveRoomCallActivityI18n } from '../lib/resolve-room-call-activity-i18n'
import { resolveRoomCallActivityKind } from '../lib/resolve-room-call-activity-kind'
import {
  canJoinRoomCallActivity,
  canLeaveRoomCallActivity,
  isCurrentSocketRoomCallParticipant
} from '../lib/room-call-activity-permissions'
import { isRoomCallUnfinished } from '../lib/room-call-start-availability'
import { sortRoomCallActivityRoomCalls } from '../lib/sort-room-call-activity-room-calls'

import { useActiveRoomCallSession } from './use-active-room-call-session.model'
import { useRoomCallSession } from './use-room-call-session.model'

export const useRoomCallActivity = ({ isOpenEnabled, openRoomCall, roomId }: UseRoomCallActivityParams) => {
  const { t } = useI18n()
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
  const { declineRoomCall, leaveRoomCall } = useRoomCallSession()
  const activityStepperIndex = ref(0)
  const joiningMediaKind = ref<RoomCallMediaKind | null>(null)
  const isDecliningRoomCall = ref(false)
  const isLeavingVisibleRoomCall = ref(false)

  const resolveUserById = (id: string) => contactById.value.get(id) ?? knownUserById.value.get(id)

  const resolveRoomTitleUsers = (targetRoomId: string) => {
    const room = getById(targetRoomId)

    if (!room) {
      return []
    }

    return getRoomOtherUserIds(room, user.value.id).reduce<RoomCallActivityRoomTitleUser[]>((users, userId) => {
      const roomUser = resolveUserById(userId)

      if (roomUser) {
        const { avatarId, nickname } = roomUser

        users.push({
          avatarId,
          nickname
        })
      }

      return users
    }, [])
  }

  const filteredRoomCalls = computed(() => {
    const selectedRoomId = roomId?.value
    const unfinishedRoomCalls = roomCalls.value.filter(isRoomCallUnfinished)
    const visibleRoomCalls = selectedRoomId
      ? unfinishedRoomCalls.filter((roomCall) => roomCall.roomId === selectedRoomId)
      : unfinishedRoomCalls

    return sortRoomCallActivityRoomCalls(visibleRoomCalls)
  })
  const activeSessionRoomCall = computed(() => {
    if (!activeRoomCall.value || !isRoomCallUnfinished(activeRoomCall.value)) {
      return
    }

    const selectedRoomId = roomId?.value
    const belongsToSelectedRoom = !selectedRoomId || activeRoomCall.value.roomId === selectedRoomId

    return belongsToSelectedRoom ? activeRoomCall.value : undefined
  })
  const incomingRoomCalls = computed(() =>
    filteredRoomCalls.value.filter((roomCall) => {
      const kind = resolveRoomCallActivityKind({
        activeRoomCallId: activeRoomCallId.value,
        currentUserId: user.value.id,
        roomCall
      })

      return kind === 'incoming'
    })
  )
  const outgoingRoomCall = computed(() =>
    filteredRoomCalls.value.find((roomCall) => {
      const kind = resolveRoomCallActivityKind({
        activeRoomCallId: activeRoomCallId.value,
        currentUserId: user.value.id,
        roomCall
      })

      return kind === 'outgoing'
    })
  )
  const joinableRoomCall = computed(() =>
    filteredRoomCalls.value.find((roomCall) => {
      const kind = resolveRoomCallActivityKind({
        activeRoomCallId: activeRoomCallId.value,
        currentUserId: user.value.id,
        roomCall
      })

      return kind === 'joinable'
    })
  )

  const resolveRoomCallActivityItem = (roomCall: RoomCall): RoomCallActivityItem | undefined => {
    const room = getById(roomCall.roomId)

    if (!room) {
      return
    }

    const isPrivateRoom = isRoomPrivate(room)
    const kind = resolveRoomCallActivityKind({
      activeRoomCallId: activeRoomCallId.value,
      currentUserId: user.value.id,
      roomCall
    })
    const users = resolveRoomTitleUsers(room.id)
    const [titleUser] = users
    const title = buildRoomCallActivityTitle({ isPrivateRoom, room, users }) || t(ROOM_CALL_SESSION_I18N.unknownRoom)
    const avatarId = isPrivateRoom ? titleUser?.avatarId ?? null : room.avatarId
    const textSource = resolveRoomCallActivityI18n({ isPrivateRoom, kind })
    const activeParticipantQuantity = resolveActiveRoomCallParticipantQuantity(roomCall)
    const participantText = t(ROOM_CALL_SESSION_I18N.roomCallParticipants, { quantity: activeParticipantQuantity })
    const text = buildRoomCallActivityText({
      activeParticipantQuantity,
      isPrivateRoom,
      participantText,
      text: t(textSource, { title: title })
    })
    const isCurrentSocketParticipant = isCurrentSocketRoomCallParticipant(roomCall, user.value.id, socket.id)
    const isActiveSessionRoomCall = roomCall.id === activeRoomCallId.value
    const canJoin = canJoinRoomCallActivity(kind, isCurrentSocketParticipant)
    const canLeave = canLeaveRoomCallActivity(kind, isCurrentSocketParticipant, isActiveSessionRoomCall)

    return {
      avatarId,
      canJoin,
      canLeave,
      dotColor: ROOM_CALL_ACTIVITY_DOT_COLOR_BY_KIND[kind],
      isPrivateRoom,
      kind,
      roomCall,
      roomId: room.id,
      text,
      title
    }
  }

  const resolveRoomCallActivityItems = (roomCalls: RoomCall[]) =>
    roomCalls.reduce<RoomCallActivityItem[]>((items, roomCall) => {
      const item = resolveRoomCallActivityItem(roomCall)

      if (item) {
        items.push(item)
      }

      return items
    }, [])
  const activityItems = computed<RoomCallActivityItem[]>(() => {
    const prioritizedRoomCalls = [...incomingRoomCalls.value]
    const secondaryRoomCall = activeSessionRoomCall.value ?? outgoingRoomCall.value ?? joinableRoomCall.value

    if (secondaryRoomCall) {
      const hasSecondaryRoomCall = prioritizedRoomCalls.some(({ id }) => id === secondaryRoomCall.id)

      if (!hasSecondaryRoomCall) {
        prioritizedRoomCalls.push(secondaryRoomCall)
      }
    }

    return resolveRoomCallActivityItems(prioritizedRoomCalls)
  })
  const activityItem = computed(() => activityItems.value[activityStepperIndex.value])
  const isActivityDisabled = computed(() => socketStatus.isReconnecting.value)
  const isActivityOpenable = computed(() => Boolean(activityItem.value && isOpenEnabled.value))

  watch(
    activityItems,
    (items) => {
      if (items.length === 0) {
        activityStepperIndex.value = 0
        return
      }

      if (activityStepperIndex.value >= items.length) {
        activityStepperIndex.value = items.length - 1
      }
    },
    { immediate: true }
  )

  const openCurrentRoomCall = async () => {
    const item = activityItem.value

    if (!item || !isOpenEnabled.value) {
      return
    }

    await openRoomCall(item.roomId)
  }

  const joinCurrentRoomCall = async (mediaKind: RoomCallMediaKind) => {
    const item = activityItem.value

    if (!item) {
      return null
    }

    const cannotJoinRoomCall = !item.canJoin
    const isJoinBlockedBySession = isRoomCallSessionBusy.value
    const isJoinBlockedByConnection = isActivityDisabled.value
    const actionUnavailable = cannotJoinRoomCall || isJoinBlockedBySession || isJoinBlockedByConnection

    if (actionUnavailable) {
      return null
    }

    joiningMediaKind.value = mediaKind

    try {
      const roomCall = await joinActiveRoomCall(item.roomCall.id, mediaKind)

      if (roomCall && isOpenEnabled.value) {
        await openRoomCall(item.roomId)
      }

      return roomCall
    } finally {
      joiningMediaKind.value = null
    }
  }

  const joinCurrentRoomCallWithAudio = () => joinCurrentRoomCall('audio')
  const joinCurrentRoomCallWithVideo = () => joinCurrentRoomCall('video')
  const leaveCurrentRoomCall = async () => {
    const item = activityItem.value

    if (!item) {
      return false
    }

    const isIncomingRoomCall = item.kind === 'incoming'
    const isSessionBusyForLeave = isRoomCallSessionBusy.value && !isIncomingRoomCall
    const cannotLeaveRoomCall = !item.canLeave
    const isDeclineInProgress = isDecliningRoomCall.value
    const isVisibleLeaveInProgress = isLeavingVisibleRoomCall.value
    const isLeaveBlockedByConnection = isActivityDisabled.value
    const actionUnavailable =
      cannotLeaveRoomCall ||
      isSessionBusyForLeave ||
      isDeclineInProgress ||
      isVisibleLeaveInProgress ||
      isLeaveBlockedByConnection

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

    if (item.roomCall.id === activeRoomCallId.value) {
      return leaveActiveRoomCall()
    }

    isLeavingVisibleRoomCall.value = true

    try {
      return await leaveRoomCall(item.roomCall.id, 'left')
    } finally {
      isLeavingVisibleRoomCall.value = false
    }
  }
  const isActivityActionLoading = computed(() => {
    const isDeclineInProgress = isDecliningRoomCall.value
    const isJoinInProgress = isJoiningRoomCall.value
    const isLeaveInProgress = isLeavingRoomCall.value
    const isVisibleLeaveInProgress = isLeavingVisibleRoomCall.value

    return isDeclineInProgress || isJoinInProgress || isLeaveInProgress || isVisibleLeaveInProgress
  })
  const isActivityLeaveLoading = computed(() => {
    const item = activityItem.value
    const isIncomingRoomCall = item?.kind === 'incoming'

    return isIncomingRoomCall ? isDecliningRoomCall.value : isLeavingRoomCall.value || isLeavingVisibleRoomCall.value
  })

  return {
    activityItem,
    activityItems,
    activityStepperIndex,
    joiningMediaKind,
    isActivityActionLoading,
    isActivityDisabled,
    isActivityLeaveLoading,
    isActivityOpenable,
    joinCurrentRoomCallWithAudio,
    joinCurrentRoomCallWithVideo,
    leaveCurrentRoomCall,
    openCurrentRoomCall
  }
}
