import { useUserMedia } from '@vueuse/core'
import { type RoomCallMediaKind, type RoomCallParticipantMediaState } from 'global-shared'
import { onBeforeUnmount, ref, shallowRef } from 'vue'

import { useSettings } from 'src/entities/setting'

import type { RoomCallVideoFacingMode, StartRoomCallAudioOptions, StartRoomCallVideoOptions } from '../config/types'
import {
  buildRoomCallMediaDeviceConstraints,
  buildRoomCallVideoDeviceConstraints,
  hasEnabledRoomCallMediaTrack,
  resolveRoomCallVideoStreamFacingMode,
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
  const videoFacingMode = ref<RoomCallVideoFacingMode | null>(null)
  const localMediaState = ref<RoomCallParticipantMediaState>({
    audio: false,
    video: false,
    screen: false
  })

  const resolveVideoFacingMode = async (stream: MediaStream | null) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()

      return resolveRoomCallVideoStreamFacingMode(stream, devices)
    } catch {
      return resolveRoomCallVideoStreamFacingMode(stream)
    }
  }

  const refreshLocalMediaState = () => {
    localMediaState.value = {
      audio: hasEnabledRoomCallMediaTrack(audioStream.value, 'audio'),
      video: hasEnabledRoomCallMediaTrack(videoStream.value, 'video'),
      screen: hasEnabledRoomCallMediaTrack(screenStream.value, 'video')
    }
  }

  const stopAudio = (syncState = true) => {
    audioUserMedia.stop()

    if (syncState) {
      refreshLocalMediaState()
    }
  }

  const stopVideo = (syncState = true) => {
    videoUserMedia.stop()
    videoFacingMode.value = null

    if (syncState) {
      refreshLocalMediaState()
    }
  }

  const stopScreen = () => {
    stopRoomCallMediaStream(screenStream.value)
    screenStream.value = null
    refreshLocalMediaState()
  }

  const startAudio = async ({
    deviceId = settings.value.ioDevices.audioInputDeviceId,
    enabled = true
  }: StartRoomCallAudioOptions = {}) => {
    stopAudio(false)
    isAudioLoading.value = true
    audioUserMedia.constraints.value = {
      audio: buildRoomCallMediaDeviceConstraints(deviceId),
      video: false
    }

    try {
      const stream = (await audioUserMedia.start()) ?? null

      setRoomCallMediaStreamTracksEnabled(stream, 'audio', enabled)
      refreshLocalMediaState()

      return stream
    } catch (error) {
      refreshLocalMediaState()
      throw error
    } finally {
      isAudioLoading.value = false
    }
  }

  const startVideo = async ({
    deviceId = settings.value.ioDevices.videoInputDeviceId,
    enabled = true,
    facingMode
  }: StartRoomCallVideoOptions = {}) => {
    stopVideo(false)
    isVideoLoading.value = true
    videoUserMedia.constraints.value = {
      audio: false,
      video: buildRoomCallVideoDeviceConstraints(deviceId, facingMode)
    }

    try {
      const stream = (await videoUserMedia.start()) ?? null

      setRoomCallMediaStreamTracksEnabled(stream, 'video', enabled)
      videoFacingMode.value = await resolveVideoFacingMode(stream)
      refreshLocalMediaState()

      return stream
    } catch (error) {
      videoFacingMode.value = await resolveVideoFacingMode(videoStream.value ?? null)
      refreshLocalMediaState()
      throw error
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

    if (mediaKind === 'video') {
      await startVideo()
    }

    if (mediaKind === 'screen') {
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
    videoFacingMode,
    localMediaState,
    isAudioLoading,
    isVideoLoading,
    isScreenLoading,
    startAudio,
    startVideo,
    startScreen,
    stopScreen,
    startRoomCallLocalMedia,
    stopRoomCallLocalMedia,
    setAudioEnabled,
    setVideoEnabled
  }
}
