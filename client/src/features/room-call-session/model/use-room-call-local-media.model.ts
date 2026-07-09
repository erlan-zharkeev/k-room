import { useUserMedia } from '@vueuse/core'
import { type RoomCallMediaKind, type RoomCallParticipantMediaState } from 'global-shared'
import { onBeforeUnmount, ref, shallowRef } from 'vue'

import { useSettings } from 'src/entities/setting'

import type { RoomCallVideoFacingMode, StartRoomCallAudioOptions, StartRoomCallVideoOptions } from '../config/types'
import {
  buildRoomCallAudioDeviceConstraints,
  buildRoomCallVideoDeviceConstraints,
  hasEnabledRoomCallMediaTrack,
  resolveRoomCallVideoStreamFacingMode,
  setRoomCallMediaStreamTracksEnabled,
  stopRoomCallMediaStream
} from '../lib/room-call-media'
import {
  buildRoomCallErrorDiagnostics,
  buildRoomCallMediaStreamDiagnostics,
  captureRoomCallDiagnostic
} from '../lib/room-call-sentry-diagnostics'

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
    } catch (error) {
      captureRoomCallDiagnostic(
        'local-video-facing-mode-devices-read-failed',
        {
          error: buildRoomCallErrorDiagnostics(error),
          stream: buildRoomCallMediaStreamDiagnostics(stream)
        },
        'warning'
      )
      return resolveRoomCallVideoStreamFacingMode(stream)
    }
  }

  const refreshLocalMediaState = () => {
    const nextLocalMediaState = {
      audio: hasEnabledRoomCallMediaTrack(audioStream.value, 'audio'),
      video: hasEnabledRoomCallMediaTrack(videoStream.value, 'video'),
      screen: hasEnabledRoomCallMediaTrack(screenStream.value, 'video')
    }

    localMediaState.value = nextLocalMediaState
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
      audio: buildRoomCallAudioDeviceConstraints(deviceId),
      video: false
    }

    try {
      const stream = (await audioUserMedia.start()) ?? null

      setRoomCallMediaStreamTracksEnabled(stream, 'audio', enabled)
      refreshLocalMediaState()

      return stream
    } catch (error) {
      refreshLocalMediaState()
      captureRoomCallDiagnostic(
        'local-audio-start-failed',
        {
          deviceId,
          enabled,
          error: buildRoomCallErrorDiagnostics(error)
        },
        'error'
      )
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
      captureRoomCallDiagnostic(
        'local-video-start-failed',
        {
          deviceId,
          enabled,
          error: buildRoomCallErrorDiagnostics(error),
          facingMode,
          stream: buildRoomCallMediaStreamDiagnostics(videoStream.value)
        },
        'error'
      )
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
    } catch (error) {
      refreshLocalMediaState()
      captureRoomCallDiagnostic(
        'local-screen-start-failed',
        {
          error: buildRoomCallErrorDiagnostics(error)
        },
        'error'
      )
      throw error
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
