import { ROOM_CALL_STATUS } from 'global-shared'
import { computed } from 'vue'

import { useUser } from 'src/entities/user'

import type { RoomCallPanelEmit, RoomCallPanelProps } from '../config/types'
import { buildRoomCallTileItems } from '../lib/build-room-call-tile-items'

import { useChatRoomUserLookup } from './use-chat-room-user-lookup.model'

export const useRoomCallPanel = (props: RoomCallPanelProps, emit: RoomCallPanelEmit) => {
  const { user } = useUser()
  const { getUserById } = useChatRoomUserLookup()

  const resolveParticipantName = (userId: string) => {
    const participant = getUserById(userId)

    return participant?.nickname ?? userId
  }

  const roomCallTileItems = computed(() =>
    buildRoomCallTileItems({
      currentUserId: user.value.id,
      localMediaState: props.localMediaState,
      remoteStreamsByUserId: props.remoteStreamsByUserId,
      resolveParticipantName,
      roomCall: props.roomCall,
      screenStream: props.screenStream,
      videoStream: props.videoStream
    })
  )
  const isScreenSharingControlVisible = computed(() => props.roomCall.status === ROOM_CALL_STATUS.IN_PROGRESS)

  const updateAudioEnabled = () => {
    emit('set-audio-enabled', !props.localMediaState.audio)
  }

  const updateVideoEnabled = () => {
    emit('set-video-enabled', !props.localMediaState.video)
  }

  const updateScreenSharing = (enabled: boolean) => {
    if (enabled) {
      emit('start-screen')
      return
    }

    emit('stop-screen')
  }

  const toggleScreenSharing = () => {
    updateScreenSharing(!props.localMediaState.screen)
  }

  return {
    isScreenSharingControlVisible,
    roomCallTileItems,
    updateAudioEnabled,
    updateVideoEnabled,
    toggleScreenSharing
  }
}
