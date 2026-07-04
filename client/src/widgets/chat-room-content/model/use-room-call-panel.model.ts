import { useFullscreen } from '@vueuse/core'
import { isFunction } from 'global-shared'
import { computed, useTemplateRef, watch } from 'vue'

import { useUser } from 'src/entities/user'
import { useRoomCallRuntimeState } from 'src/features/room-call-session'

import { ROOM_CALL_PANEL_DISPLAY_MODE_TOGGLE_I18N } from '../config/constants'
import type { RoomCallPanelEmit, RoomCallPanelProps, RoomCallQuickCommand, RoomCallTileItem } from '../config/types'
import { buildRoomCallTileItems } from '../lib/build-room-call-tile-items'
import {
  resolveRoomCallPanelGridColumnCount,
  resolveRoomCallPanelGridRowCount
} from '../lib/resolve-room-call-panel-grid-counts'
import { createRoomCallDerivedStreamCache } from '../lib/room-call-derived-stream-cache'

import { useChatRoomUserLookup } from './use-chat-room-user-lookup.model'

export const useRoomCallPanel = (props: RoomCallPanelProps, emit: RoomCallPanelEmit) => {
  const roomCallPanelRef = useTemplateRef<HTMLElement>('roomCallPanel')
  const { user } = useUser()
  const { getUserById } = useChatRoomUserLookup()
  const derivedStreamCache = createRoomCallDerivedStreamCache()
  const {
    isRoomCallQuickCommandsExpanded,
    roomCallPanelDisplayMode,
    selectRoomCallTile,
    selectedRoomCallTileId,
    setRoomCallPanelDisplayMode,
    syncRoomCallRuntimeState,
    toggleRoomCallQuickCommandsExpanded
  } = useRoomCallRuntimeState()
  const { isFullscreen: isRoomCallFullscreen, toggle: toggleRoomCallFullscreen } = useFullscreen(roomCallPanelRef, {
    autoExit: true
  })

  const resolveParticipantName = (userId: string) => {
    const participant = getUserById(userId)

    return participant?.nickname ?? userId
  }

  const resolveParticipantAvatarId = (userId: string) => getUserById(userId)?.avatarId

  const roomCallTileItems = computed(() =>
    buildRoomCallTileItems({
      audioStream: props.audioStream,
      connectionQualityByUserId: props.connectionQualityByUserId,
      currentUserId: user.value.id,
      handRaisedByUserId: props.handRaisedByUserId,
      localMediaState: props.localMediaState,
      remoteStreamsByUserId: props.remoteStreamsByUserId,
      resolveMediaStreamFromTracks: derivedStreamCache.resolve,
      resolveParticipantAvatarId,
      resolveParticipantName,
      roomCall: props.roomCall,
      screenStream: props.screenStream,
      temporaryQuickCommandByUserId: props.temporaryQuickCommandByUserId,
      videoFacingMode: props.videoFacingMode,
      videoStream: props.videoStream
    })
  )
  const isRoomCallFocusDisplayMode = computed(() => roomCallPanelDisplayMode.value === 'focus')
  const localRoomCallTileItem = computed(() => roomCallTileItems.value.find(({ isLocal }) => isLocal))
  const roomCallMainTileItem = computed(
    () =>
      roomCallTileItems.value.find(({ id }) => id === selectedRoomCallTileId.value) ??
      localRoomCallTileItem.value ??
      roomCallTileItems.value[0]
  )
  const roomCallSecondaryTileItems = computed(() => {
    const mainTileItem = roomCallMainTileItem.value

    if (!mainTileItem) {
      return []
    }

    return roomCallTileItems.value.filter(({ id }) => id !== mainTileItem.id)
  })
  const roomCallPanelGridColumnCount = computed(() =>
    resolveRoomCallPanelGridColumnCount(roomCallTileItems.value.length)
  )
  const roomCallPanelGridRowCount = computed(() => resolveRoomCallPanelGridRowCount(roomCallTileItems.value.length))
  const roomCallPanelTilesStyle = computed(() => ({
    '--room-call-panel-grid-column-count': roomCallPanelGridColumnCount.value,
    '--room-call-panel-grid-row-count': roomCallPanelGridRowCount.value
  }))
  const roomCallDisplayModeToggleI18n = computed(
    () => ROOM_CALL_PANEL_DISPLAY_MODE_TOGGLE_I18N[roomCallPanelDisplayMode.value]
  )
  const isAnotherParticipantScreenSharing = computed(() =>
    props.roomCall.participants.some(({ leftAt, mediaState, userId }) => {
      const isActiveParticipant = !leftAt
      const isAnotherParticipant = userId !== user.value.id
      const hasScreenSharing = mediaState.screen
      const hasActiveScreenSharing = isActiveParticipant && hasScreenSharing

      return hasActiveScreenSharing && isAnotherParticipant
    })
  )
  const isScreenSharingSupported = computed(() => isFunction(navigator.mediaDevices?.getDisplayMedia))
  const isScreenSharingControlVisible = computed(
    () => props.roomCall.status === 'in-progress' && isScreenSharingSupported.value
  )
  const isScreenSharingControlDisabled = computed(() => {
    const isScreenSharingBlockedByParticipant = !props.localMediaState.screen && isAnotherParticipantScreenSharing.value

    return props.isBusy || isScreenSharingBlockedByParticipant
  })
  const isRoomCallQuickCommandsAvailable = computed(() => props.roomCall.status === 'in-progress')
  const isLocalHandRaised = computed(() => Boolean(props.handRaisedByUserId[user.value.id]))

  const updateAudioEnabled = () => {
    emit('set-audio-enabled', !props.localMediaState.audio)
  }

  const updateVideoEnabled = () => {
    emit('set-video-enabled', !props.localMediaState.video)
  }

  const toggleScreenSharing = () => {
    if (!isScreenSharingSupported.value) {
      return
    }

    if (props.localMediaState.screen) {
      emit('stop-screen')
      return
    }

    emit('start-screen')
  }

  const leaveRoomCall = () => {
    emit('leave')
  }

  const toggleRoomCallQuickCommands = () => {
    if (!isRoomCallQuickCommandsAvailable.value) {
      return
    }

    toggleRoomCallQuickCommandsExpanded()
  }

  const sendRoomCallQuickCommand = (command: RoomCallQuickCommand) => {
    if (!isRoomCallQuickCommandsAvailable.value) {
      return
    }

    if (command === 'raise-hand') {
      emit('set-hand-raised', !isLocalHandRaised.value)
      return
    }

    emit('send-quick-command', command)
  }

  const toggleRoomCallPanelDisplayMode = () => {
    if (isRoomCallFocusDisplayMode.value) {
      setRoomCallPanelDisplayMode('grid')
      return
    }

    selectRoomCallTile(user.value.id)
    setRoomCallPanelDisplayMode('focus')
  }

  const focusRoomCallTile = (item: RoomCallTileItem) => {
    selectRoomCallTile(item.id)

    setRoomCallPanelDisplayMode('focus')
  }

  watch(
    () => props.roomCall.id,
    (roomCallId) => {
      derivedStreamCache.clear()
      syncRoomCallRuntimeState(roomCallId)
    },
    { immediate: true }
  )

  return {
    focusRoomCallTile,
    isRoomCallFocusDisplayMode,
    isRoomCallQuickCommandsExpanded,
    isRoomCallQuickCommandsAvailable,
    isRoomCallFullscreen,
    isLocalHandRaised,
    isScreenSharingControlDisabled,
    isScreenSharingControlVisible,
    leaveRoomCall,
    roomCallDisplayModeToggleI18n,
    roomCallMainTileItem,
    roomCallPanelTilesStyle,
    roomCallSecondaryTileItems,
    roomCallTileItems,
    toggleRoomCallPanelDisplayMode,
    toggleRoomCallQuickCommands,
    toggleRoomCallFullscreen,
    toggleScreenSharing,
    sendRoomCallQuickCommand,
    updateAudioEnabled,
    updateVideoEnabled
  }
}
