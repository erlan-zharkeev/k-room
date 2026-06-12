import { useTimeoutFn } from '@vueuse/core'
import type { EventRoomCallHandRaisedUpdated, EventRoomCallQuickCommandReceived } from 'global-shared'
import { ref, type Ref } from 'vue'

import { ROOM_CALL_TEMPORARY_QUICK_COMMAND_TTL_MS } from '../config/constants'
import type {
  RoomCallHandRaisedByUserId,
  RoomCallTemporaryQuickCommandByUserId,
  SyncInitialRoomCallParticipantQuickCommandStates
} from '../config/types'

export const useRoomCallQuickCommandSync = (activeRoomCallId: Ref<string>) => {
  const temporaryQuickCommandByUserId = ref<RoomCallTemporaryQuickCommandByUserId>({})
  const handRaisedByUserId = ref<RoomCallHandRaisedByUserId>({})
  const temporaryQuickCommandStopByUserId = new Map<string, () => void>()

  const clearRoomCallTemporaryQuickCommand = (userId: string, quickCommandId: string) => {
    const quickCommand = temporaryQuickCommandByUserId.value[userId]

    if (quickCommand?.id !== quickCommandId) {
      return
    }

    const { [userId]: _quickCommand, ...nextQuickCommandByUserId } = temporaryQuickCommandByUserId.value

    temporaryQuickCommandByUserId.value = nextQuickCommandByUserId
    temporaryQuickCommandStopByUserId.delete(userId)
  }

  const resetRoomCallQuickCommands = () => {
    temporaryQuickCommandStopByUserId.forEach((stopTemporaryQuickCommandTimer) => stopTemporaryQuickCommandTimer())
    temporaryQuickCommandStopByUserId.clear()
    temporaryQuickCommandByUserId.value = {}
    handRaisedByUserId.value = {}
  }

  const syncInitialRoomCallParticipantQuickCommandStates: SyncInitialRoomCallParticipantQuickCommandStates = (
    quickCommandStateByUserId
  ) => {
    const nextHandRaisedByUserId: RoomCallHandRaisedByUserId = {}

    Object.entries(quickCommandStateByUserId).forEach(([userId, quickCommandState]) => {
      nextHandRaisedByUserId[userId] = quickCommandState.handRaised
    })

    handRaisedByUserId.value = nextHandRaisedByUserId
  }

  const syncRoomCallQuickCommandReceived = ({
    createdAt,
    quickCommand,
    roomCallId,
    userId
  }: EventRoomCallQuickCommandReceived) => {
    if (roomCallId !== activeRoomCallId.value) {
      return
    }

    const quickCommandId = [userId, quickCommand, createdAt].join(':')

    temporaryQuickCommandStopByUserId.get(userId)?.()
    temporaryQuickCommandByUserId.value = {
      ...temporaryQuickCommandByUserId.value,
      [userId]: {
        command: quickCommand,
        id: quickCommandId
      }
    }

    const { start, stop } = useTimeoutFn(
      () => clearRoomCallTemporaryQuickCommand(userId, quickCommandId),
      ROOM_CALL_TEMPORARY_QUICK_COMMAND_TTL_MS,
      { immediate: false }
    )

    temporaryQuickCommandStopByUserId.set(userId, stop)
    start()
  }

  const syncRoomCallHandRaisedUpdated = ({ handRaised, roomCallId, userId }: EventRoomCallHandRaisedUpdated) => {
    if (roomCallId !== activeRoomCallId.value) {
      return
    }

    handRaisedByUserId.value = {
      ...handRaisedByUserId.value,
      [userId]: handRaised
    }
  }

  return {
    handRaisedByUserId,
    temporaryQuickCommandByUserId,
    resetRoomCallQuickCommands,
    syncInitialRoomCallParticipantQuickCommandStates,
    syncRoomCallHandRaisedUpdated,
    syncRoomCallQuickCommandReceived
  }
}
