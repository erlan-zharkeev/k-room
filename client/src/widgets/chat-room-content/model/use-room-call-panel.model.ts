import { useFullscreen } from '@vueuse/core'
import { ROOM_CALL_STATUS } from 'global-shared'
import { computed, ref, useTemplateRef } from 'vue'

import { useUser } from 'src/entities/user'

import { ROOM_CALL_PANEL_DISPLAY_MODE, ROOM_CALL_PANEL_DISPLAY_MODE_TOGGLE_I18N } from '../config/constants'
import type { RoomCallPanelDisplayMode, RoomCallPanelEmit, RoomCallPanelProps, RoomCallTileItem } from '../config/types'
import { buildRoomCallTileItems } from '../lib/build-room-call-tile-items'

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
      currentUserId: user.value.id,
      localMediaState: props.localMediaState,
      remoteStreamsByUserId: props.remoteStreamsByUserId,
      resolveParticipantAvatarId,
      resolveParticipantName,
      roomCall: props.roomCall,
      screenStream: props.screenStream,
      videoStream: props.videoStream
    })
  )
  const isRoomCallFocusDisplayMode = computed(
    () => roomCallPanelDisplayMode.value === ROOM_CALL_PANEL_DISPLAY_MODE.FOCUS
  )
  const roomCallMainTileItem = computed(
    () => roomCallTileItems.value.find(({ id }) => id === selectedRoomCallTileId.value) ?? roomCallTileItems.value[0]
  )
  const roomCallSecondaryTileItems = computed(() => {
    const mainTileItem = roomCallMainTileItem.value

    if (!mainTileItem) {
      return []
    }

    return roomCallTileItems.value.filter(({ id }) => id !== mainTileItem.id)
  })
  const roomCallDisplayModeToggleI18n = computed(
    () => ROOM_CALL_PANEL_DISPLAY_MODE_TOGGLE_I18N[roomCallPanelDisplayMode.value]
  )
  const isScreenSharingControlVisible = computed(() => props.roomCall.status === ROOM_CALL_STATUS.IN_PROGRESS)

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
    isRoomCallQuickCommandsExpanded.value = !isRoomCallQuickCommandsExpanded.value
  }

  const toggleRoomCallPanelDisplayMode = () => {
    roomCallPanelDisplayMode.value = isRoomCallFocusDisplayMode.value
      ? ROOM_CALL_PANEL_DISPLAY_MODE.GRID
      : ROOM_CALL_PANEL_DISPLAY_MODE.FOCUS
  }

  const focusRoomCallTile = (item: RoomCallTileItem) => {
    selectedRoomCallTileId.value = item.id
    roomCallPanelDisplayMode.value = ROOM_CALL_PANEL_DISPLAY_MODE.FOCUS
  }

  return {
    focusRoomCallTile,
    isRoomCallFocusDisplayMode,
    isRoomCallQuickCommandsExpanded,
    isRoomCallFullscreen,
    isScreenSharingControlVisible,
    leaveRoomCall,
    roomCallDisplayModeToggleI18n,
    roomCallMainTileItem,
    roomCallSecondaryTileItems,
    roomCallTileItems,
    toggleRoomCallPanelDisplayMode,
    toggleRoomCallQuickCommands,
    toggleRoomCallFullscreen,
    toggleScreenSharing,
    updateAudioEnabled,
    updateVideoEnabled
  }
}
