import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'

import { log } from 'src/shared/lib'

import type { AppMediaTileProps } from './types'

export const useAppMediaTile = (props: AppMediaTileProps) => {
  const appMediaTileVideoRef = useTemplateRef<HTMLVideoElement>('video')
  const appMediaTileVideoTrackCount = ref(0)

  const updateAppMediaTileVideoTrackCount = (stream: MediaStream | null | undefined) => {
    appMediaTileVideoTrackCount.value = stream?.getVideoTracks().length ?? 0
  }

  const hasAppMediaTileVideoSource = computed(() => Boolean(props.stream && appMediaTileVideoTrackCount.value > 0))
  const isAppMediaTileVideoVisible = computed(() => hasAppMediaTileVideoSource.value && !props.videoOff)
  const isAppMediaTileFallbackVisible = computed(() => !isAppMediaTileVideoVisible.value)
  const appMediaTileInitials = computed(() =>
    props.name
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join('')
  )
  const appMediaTileFallbackLabel = computed(() => appMediaTileInitials.value || props.name || '?')
  const appMediaTileClass = computed(() => ({
    'app-media-tile--mirrored': props.mirrored,
    'app-media-tile--screen-sharing': props.screenSharing,
    'app-media-tile--video-off': props.videoOff
  }))

  const syncAppMediaTileVideo = async () => {
    const video = appMediaTileVideoRef.value

    if (!video) {
      return
    }

    if (!isAppMediaTileVideoVisible.value) {
      video.pause()
      video.srcObject = null
      return
    }

    if (video.srcObject !== props.stream) {
      video.srcObject = props.stream ?? null
    }

    try {
      await video.play()
    } catch (error) {
      log('warn', 'Failed to play app media tile video', error)
    }
  }

  watch(
    () => props.stream,
    (stream, _previousStream, onCleanup) => {
      updateAppMediaTileVideoTrackCount(stream)

      if (!stream) {
        return
      }

      const syncTrackCount = () => {
        updateAppMediaTileVideoTrackCount(stream)
        void syncAppMediaTileVideo()
      }

      stream.addEventListener('addtrack', syncTrackCount)
      stream.addEventListener('removetrack', syncTrackCount)

      onCleanup(() => {
        stream.removeEventListener('addtrack', syncTrackCount)
        stream.removeEventListener('removetrack', syncTrackCount)
      })
    },
    { immediate: true }
  )
  watch(
    () => [appMediaTileVideoRef.value, props.stream, isAppMediaTileVideoVisible.value] as const,
    () => {
      void syncAppMediaTileVideo()
    },
    { flush: 'post', immediate: true }
  )

  onBeforeUnmount(() => {
    const video = appMediaTileVideoRef.value

    if (!video) {
      return
    }

    video.pause()
    video.srcObject = null
  })

  return {
    appMediaTileClass,
    appMediaTileFallbackLabel,
    isAppMediaTileFallbackVisible,
    isAppMediaTileVideoVisible
  }
}
