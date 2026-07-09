import { computed } from 'vue'

import { useUser } from 'src/entities/user'

import type { RoomCallAudioOutputItem } from '../config/types'
import { hasRoomCallAudioOutputStream } from '../lib/room-call-audio-output'

import { useActiveRoomCallSession } from './use-active-room-call-session.model'
import { useRoomCallRuntimeState } from './use-room-call-runtime-state.model'

const buildRoomCallAudioOutputItemKey = (userId: string, stream: MediaStream) => {
  const audioTrackIds = stream
    .getAudioTracks()
    .map(({ id }) => id)
    .join(':')

  return [userId, stream.id, audioTrackIds].join(':')
}

export const useRoomCallAudioOutput = () => {
  const { user } = useUser()
  const { activeRoomCall, remoteStreamsByUserId } = useActiveRoomCallSession()
  const { mutedRemoteAudioByUserId } = useRoomCallRuntimeState()

  const roomCallAudioOutputItems = computed<RoomCallAudioOutputItem[]>(() => {
    const roomCall = activeRoomCall.value

    if (!roomCall || roomCall.status !== 'in-progress') {
      return []
    }

    return roomCall.participants.flatMap<RoomCallAudioOutputItem>(({ leftAt, mediaState, userId }) => {
      const isRemoteParticipant = userId !== user.value.id
      const stream = remoteStreamsByUserId.value[userId]

      if (leftAt || !isRemoteParticipant || !mediaState.audio || !hasRoomCallAudioOutputStream(stream)) {
        return []
      }

      return [
        {
          key: buildRoomCallAudioOutputItemKey(userId, stream),
          muted: Boolean(mutedRemoteAudioByUserId.value[userId]),
          stream,
          userId
        }
      ]
    })
  })

  return {
    roomCallAudioOutputItems
  }
}
