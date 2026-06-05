import { computed, useTemplateRef, watch } from 'vue'

import type { RoomCallTileProps } from '../config/types'

export const useRoomCallTile = (props: RoomCallTileProps) => {
  const roomCallTileVideoRef = useTemplateRef<HTMLVideoElement>('roomCallTileVideo')
  const hasStream = computed(() => Boolean(props.item.stream))
  const hasVisibleVideo = computed(() => {
    const hasEnabledVideo = props.item.mediaState.video || props.item.mediaState.screen

    return hasEnabledVideo && hasStream.value
  })

  watch(
    [() => props.item.stream, roomCallTileVideoRef],
    ([stream, video]) => {
      if (!video) return

      video.srcObject = stream ?? null
    },
    { immediate: true }
  )

  return {
    hasStream,
    hasVisibleVideo,
    roomCallTileVideoRef
  }
}
