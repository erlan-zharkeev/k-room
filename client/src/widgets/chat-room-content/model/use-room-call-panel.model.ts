import { useFullscreen } from '@vueuse/core'
import { ROOM_CALL_STATUS } from 'global-shared'
import { computed, ref, useTemplateRef } from 'vue'

import { useUser } from 'src/entities/user'

import {
  ROOM_CALL_PANEL_DISPLAY_MODE,
  ROOM_CALL_PANEL_DISPLAY_MODE_TOGGLE_I18N,
  ROOM_CALL_QUICK_COMMAND
} from '../config/constants'
import type {
  RoomCallPanelDisplayMode,
  RoomCallPanelEmit,
  RoomCallPanelProps,
  RoomCallQuickCommand,
  RoomCallTileItem
} from '../config/types'
import { buildRoomCallTileItems } from '../lib/build-room-call-tile-items'
import {
  resolveRoomCallPanelGridColumnCount,
  resolveRoomCallPanelGridRowCount
} from '../lib/resolve-room-call-panel-grid-counts'

import { useChatRoomUserLookup } from './use-chat-room-user-lookup.model'

export const useRoomCallPanel = (props: RoomCallPanelProps, emit: RoomCallPanelEmit) => {
  const roomCallPanelRef = useTemplateRef<HTMLElement>('roomCallPanel')
  const roomCallPanelDisplayMode = ref<RoomCallPanelDisplayMode>(ROOM_CALL_PANEL_DISPLAY_MODE.GRID)
  const selectedRoomCallTileId = ref<string>()
  const isRoomCallQuickCommandsExpanded = ref(false)
  const { user } = useUser()
  const { getUserById } = useChatRoomUserLookup()
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
      currentUserId: user.value.id,
      handRaisedByUserId: props.handRaisedByUserId,
      localMediaState: props.localMediaState,
      remoteStreamsByUserId: props.remoteStreamsByUserId,
      resolveParticipantAvatarId,
      resolveParticipantName,
      roomCall: props.roomCall,
      screenStream: props.screenStream,
      temporaryQuickCommandByUserId: props.temporaryQuickCommandByUserId,
      videoStream: props.videoStream
    })
  )
  const isRoomCallFocusDisplayMode = computed(
    () => roomCallPanelDisplayMode.value === ROOM_CALL_PANEL_DISPLAY_MODE.FOCUS
  )
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
  const isScreenSharingControlVisible = computed(() => props.roomCall.status === ROOM_CALL_STATUS.IN_PROGRESS)
  const isScreenSharingControlDisabled = computed(() => {
    const isScreenSharingBlockedByParticipant = !props.localMediaState.screen && isAnotherParticipantScreenSharing.value

    return props.isBusy || isScreenSharingBlockedByParticipant
  })
  const isRoomCallQuickCommandsAvailable = computed(() => props.roomCall.status === ROOM_CALL_STATUS.IN_PROGRESS)
  const isLocalHandRaised = computed(() => Boolean(props.handRaisedByUserId[user.value.id]))

  const updateAudioEnabled = () => {
    emit('set-audio-enabled', !props.localMediaState.audio)
  }

  const updateVideoEnabled = () => {
    emit('set-video-enabled', !props.localMediaState.video)
  }

  const toggleScreenSharing = () => {
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

    isRoomCallQuickCommandsExpanded.value = !isRoomCallQuickCommandsExpanded.value
  }

  const sendRoomCallQuickCommand = (command: RoomCallQuickCommand) => {
    if (!isRoomCallQuickCommandsAvailable.value) {
      return
    }

    if (command === ROOM_CALL_QUICK_COMMAND.RAISE_HAND) {
      emit('set-hand-raised', !isLocalHandRaised.value)
      return
    }

    emit('send-quick-command', command)
  }

  const toggleRoomCallPanelDisplayMode = () => {
    if (isRoomCallFocusDisplayMode.value) {
      roomCallPanelDisplayMode.value = ROOM_CALL_PANEL_DISPLAY_MODE.GRID
      return
    }

    selectedRoomCallTileId.value = user.value.id
    roomCallPanelDisplayMode.value = ROOM_CALL_PANEL_DISPLAY_MODE.FOCUS
  }

  const focusRoomCallTile = (item: RoomCallTileItem) => {
    selectedRoomCallTileId.value = item.id

    roomCallPanelDisplayMode.value = ROOM_CALL_PANEL_DISPLAY_MODE.FOCUS
  }

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
