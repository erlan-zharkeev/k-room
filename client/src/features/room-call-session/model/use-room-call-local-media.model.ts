import { useUserMedia } from '@vueuse/core'
import { ROOM_CALL_MEDIA_KIND, type RoomCallMediaKind, type RoomCallParticipantMediaState } from 'global-shared'
import { onBeforeUnmount, ref, shallowRef } from 'vue'

import { useSettings } from 'src/entities/setting'

import {
  buildRoomCallMediaDeviceConstraints,
  hasEnabledRoomCallMediaTrack,
  setRoomCallMediaStreamTracksEnabled,
  stopRoomCallMediaStream
} from '../lib/room-call-media'

export const useRoomCallLocalMedia = () => {
  const { settings } = useSettings()
  const audioUserMedia = useUserMedia({
    autoSwitch: false,
    constraints: { audio: false, video: false }
  })
  const videoUserMedia = useUserMedia({
    autoSwitch: false,
    constraints: { audio: false, video: false }
  })
  const screenStream = shallowRef<MediaStream | null>(null)
  const isAudioLoading = ref(false)
  const isVideoLoading = ref(false)
  const isScreenLoading = ref(false)
  const audioStream = audioUserMedia.stream
  const videoStream = videoUserMedia.stream
  const localMediaState = ref<RoomCallParticipantMediaState>({
    audio: false,
    video: false,
    screen: false
  })

  const refreshLocalMediaState = () => {
    localMediaState.value = {
      audio: hasEnabledRoomCallMediaTrack(audioStream.value, 'audio'),
      video: hasEnabledRoomCallMediaTrack(videoStream.value, 'video'),
      screen: hasEnabledRoomCallMediaTrack(screenStream.value, 'video')
    }
  }

  const stopAudio = () => {
    audioUserMedia.stop()
    refreshLocalMediaState()
  }

  const stopVideo = () => {
    videoUserMedia.stop()
    refreshLocalMediaState()
  }

  const stopScreen = () => {
    stopRoomCallMediaStream(screenStream.value)
    screenStream.value = null
    refreshLocalMediaState()
  }

  const startAudio = async () => {
    stopAudio()
    isAudioLoading.value = true
    audioUserMedia.constraints.value = {
      audio: buildRoomCallMediaDeviceConstraints(settings.value.ioDevices.audioInputDeviceId),
      video: false
    }

    try {
      const stream = (await audioUserMedia.start()) ?? null

      refreshLocalMediaState()

      return stream
    } finally {
      isAudioLoading.value = false
    }
  }

  const startVideo = async () => {
    stopVideo()
    isVideoLoading.value = true
    videoUserMedia.constraints.value = {
      audio: false,
      video: buildRoomCallMediaDeviceConstraints(settings.value.ioDevices.videoInputDeviceId)
    }

    try {
      const stream = (await videoUserMedia.start()) ?? null

      refreshLocalMediaState()

      return stream
    } finally {
      isVideoLoading.value = false
    }
  }

  const startScreen = async () => {
    stopScreen()
    isScreenLoading.value = true

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: true
      })

      screenStream.value = stream
      refreshLocalMediaState()
      stream.getVideoTracks().forEach((track) => {
        track.addEventListener('ended', stopScreen, { once: true })
      })

      return stream
    } finally {
      isScreenLoading.value = false
    }
  }

  const startRoomCallLocalMedia = async (mediaKind: RoomCallMediaKind) => {
    await startAudio()

    if (mediaKind === ROOM_CALL_MEDIA_KIND.VIDEO) {
      await startVideo()
    }

    if (mediaKind === ROOM_CALL_MEDIA_KIND.SCREEN) {
      await startScreen()
    }
  }

  const stopRoomCallLocalMedia = () => {
    stopAudio()
    stopVideo()
    stopScreen()
  }

  const setAudioEnabled = (enabled: boolean) => {
    setRoomCallMediaStreamTracksEnabled(audioStream.value, 'audio', enabled)
    refreshLocalMediaState()
  }

  const setVideoEnabled = (enabled: boolean) => {
    setRoomCallMediaStreamTracksEnabled(videoStream.value, 'video', enabled)
    refreshLocalMediaState()
  }

  onBeforeUnmount(stopRoomCallLocalMedia)

  return {
    audioStream,
    videoStream,
    screenStream,
    localMediaState,
    isAudioLoading,
    isVideoLoading,
    isScreenLoading,
    startAudio,
    stopAudio,
    startVideo,
    stopVideo,
    startScreen,
    stopScreen,
    startRoomCallLocalMedia,
    stopRoomCallLocalMedia,
    setAudioEnabled,
    setVideoEnabled
  }
}
