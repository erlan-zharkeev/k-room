import { formatNickname } from 'global-shared'
import { computed } from 'vue'

import { useUser } from 'src/entities/user'

import type { RoomCallActivePanelEmit, RoomCallActivePanelProps } from '../config/types'
import { buildRoomCallTileItems } from '../lib/build-room-call-tile-items'

import { useChatRoomUserLookup } from './use-chat-room-user-lookup.model'

export const useRoomCallActivePanel = (props: RoomCallActivePanelProps, emit: RoomCallActivePanelEmit) => {
  const { user } = useUser()
  const { getUserById } = useChatRoomUserLookup()

  const resolveParticipantName = (userId: string) => {
    const participant = getUserById(userId)

    return formatNickname(participant?.nickname ?? userId)
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

  const updateScreenSharing = (enabled: boolean) => {
    if (enabled) {
      emit('start-screen')
      return
    }

    emit('stop-screen')
  }

  return {
    roomCallTileItems,
    updateScreenSharing
  }
}
