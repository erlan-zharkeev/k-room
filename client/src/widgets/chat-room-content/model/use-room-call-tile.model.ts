import { computed, ref } from 'vue'

import { useLiveMediaUrl } from 'src/shared/lib'

import { ROOM_CALL_TILE_KIND, ROOM_CALL_TILE_REMOTE_ACTION_TEXT } from '../config/constants'
import type { RoomCallTileProps } from '../config/types'

export const useRoomCallTile = (props: RoomCallTileProps) => {
  const isRemoteAudioMuted = ref(false)
  const isRemoteVideoHidden = ref(false)
  const avatarImageSrc = useLiveMediaUrl(() => props.item.avatarId)
  const isScreenTile = computed(() => props.item.kind === ROOM_CALL_TILE_KIND.SCREEN)
  const hasStream = computed(() => Boolean(props.item.stream))
  const hasVisibleVideo = computed(() => {
    const hasEnabledVideo = props.item.mediaState.video || props.item.mediaState.screen
    const hasLocalVideoVisibility = props.self || !isRemoteVideoHidden.value

    return hasEnabledVideo && hasStream.value && hasLocalVideoVisibility
  })
  const remoteHideButtonText = computed(() =>
    isRemoteVideoHidden.value ? ROOM_CALL_TILE_REMOTE_ACTION_TEXT.SHOW : ROOM_CALL_TILE_REMOTE_ACTION_TEXT.HIDE
  )
  const remoteMuteButtonText = computed(() =>
    isRemoteAudioMuted.value ? ROOM_CALL_TILE_REMOTE_ACTION_TEXT.UNMUTE : ROOM_CALL_TILE_REMOTE_ACTION_TEXT.MUTE
  )
  const isMediaTileVideoOff = computed(() => !hasVisibleVideo.value)

  const toggleRemoteAudioMuted = () => {
    isRemoteAudioMuted.value = !isRemoteAudioMuted.value
  }

  const toggleRemoteVideoHidden = () => {
    isRemoteVideoHidden.value = !isRemoteVideoHidden.value
  }

  return {
    avatarImageSrc,
    isRemoteAudioMuted,
    isRemoteVideoHidden,
    isScreenTile,
    isMediaTileVideoOff,
    remoteHideButtonText,
    remoteMuteButtonText,
    toggleRemoteAudioMuted,
    toggleRemoteVideoHidden
  }
}
