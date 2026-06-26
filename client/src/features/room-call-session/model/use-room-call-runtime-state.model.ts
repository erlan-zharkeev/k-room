import { createGlobalState } from '@vueuse/core'
import { ref, shallowRef } from 'vue'

import type { RoomCallPanelDisplayMode, RoomCallUserFlagByUserId } from '../config/types'
import { toggleRoomCallUserFlag } from '../lib/room-call-runtime-state'

export const useRoomCallRuntimeState = createGlobalState(() => {
  const roomCallRuntimeStateRoomCallId = ref('')
  const roomCallPanelDisplayMode = ref<RoomCallPanelDisplayMode>('grid')
  const selectedRoomCallTileId = ref<string>()
  const isRoomCallQuickCommandsExpanded = ref(false)
  const mutedRemoteAudioByUserId = shallowRef<RoomCallUserFlagByUserId>({})
  const hiddenRemoteVideoByUserId = shallowRef<RoomCallUserFlagByUserId>({})

  const resetRoomCallRuntimeValues = () => {
    roomCallPanelDisplayMode.value = 'grid'
    selectedRoomCallTileId.value = undefined
    isRoomCallQuickCommandsExpanded.value = false
    mutedRemoteAudioByUserId.value = {}
    hiddenRemoteVideoByUserId.value = {}
  }

  const syncRoomCallRuntimeState = (roomCallId: string) => {
    if (roomCallRuntimeStateRoomCallId.value === roomCallId) {
      return
    }

    roomCallRuntimeStateRoomCallId.value = roomCallId
    resetRoomCallRuntimeValues()
  }

  const resetRoomCallRuntimeState = () => {
    roomCallRuntimeStateRoomCallId.value = ''
    resetRoomCallRuntimeValues()
  }

  const setRoomCallPanelDisplayMode = (displayMode: RoomCallPanelDisplayMode) => {
    roomCallPanelDisplayMode.value = displayMode
  }

  const selectRoomCallTile = (tileId: string | undefined) => {
    selectedRoomCallTileId.value = tileId
  }

  const toggleRoomCallQuickCommandsExpanded = () => {
    isRoomCallQuickCommandsExpanded.value = !isRoomCallQuickCommandsExpanded.value
  }

  const toggleRemoteAudioMuted = (userId: string) => {
    mutedRemoteAudioByUserId.value = toggleRoomCallUserFlag(mutedRemoteAudioByUserId.value, userId)
  }

  const toggleRemoteVideoHidden = (userId: string) => {
    hiddenRemoteVideoByUserId.value = toggleRoomCallUserFlag(hiddenRemoteVideoByUserId.value, userId)
  }

  return {
    hiddenRemoteVideoByUserId,
    isRoomCallQuickCommandsExpanded,
    mutedRemoteAudioByUserId,
    resetRoomCallRuntimeState,
    roomCallPanelDisplayMode,
    roomCallRuntimeStateRoomCallId,
    selectRoomCallTile,
    selectedRoomCallTileId,
    setRoomCallPanelDisplayMode,
    syncRoomCallRuntimeState,
    toggleRemoteAudioMuted,
    toggleRemoteVideoHidden,
    toggleRoomCallQuickCommandsExpanded
  }
})
