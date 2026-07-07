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
import {
  buildRoomCallErrorDiagnostics,
  buildRoomCallMediaStreamDiagnostics,
  buildRoomCallMediaTrackDiagnostics,
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

  const hasLocalMediaStateChanged = (nextState: RoomCallParticipantMediaState) => {
    const { audio, screen, video } = localMediaState.value

    return audio !== nextState.audio || screen !== nextState.screen || video !== nextState.video
  }

  const captureLocalMediaTrackEvents = (eventPrefix: string, track: MediaStreamTrack) => {
    track.addEventListener('mute', () => {
      captureRoomCallDiagnostic(`${eventPrefix}-track-muted`, {
        track: buildRoomCallMediaTrackDiagnostics(track)
      })
    })
    track.addEventListener('unmute', () => {
      captureRoomCallDiagnostic(`${eventPrefix}-track-unmuted`, {
        track: buildRoomCallMediaTrackDiagnostics(track)
      })
    })
    track.addEventListener(
      'ended',
      () => {
        captureRoomCallDiagnostic(`${eventPrefix}-track-ended`, {
          track: buildRoomCallMediaTrackDiagnostics(track)
        })
      },
      { once: true }
    )
  }

  const captureLocalMediaStreamTrackEvents = (eventPrefix: string, stream: MediaStream | null) => {
    stream?.getTracks().forEach((track) => {
      captureLocalMediaTrackEvents(eventPrefix, track)
    })
  }

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

    if (hasLocalMediaStateChanged(nextLocalMediaState)) {
      captureRoomCallDiagnostic('local-media-state-changed', {
        nextState: nextLocalMediaState,
        previousState: localMediaState.value,
        streams: {
          audio: buildRoomCallMediaStreamDiagnostics(audioStream.value),
          screen: buildRoomCallMediaStreamDiagnostics(screenStream.value),
          video: buildRoomCallMediaStreamDiagnostics(videoStream.value)
        }
      })
    }

    localMediaState.value = nextLocalMediaState
  }

  const stopAudio = (syncState = true) => {
    captureRoomCallDiagnostic('local-audio-stop-requested', {
      stream: buildRoomCallMediaStreamDiagnostics(audioStream.value),
      syncState
    })
    audioUserMedia.stop()

    if (syncState) {
      refreshLocalMediaState()
    }
  }

  const stopVideo = (syncState = true) => {
    captureRoomCallDiagnostic('local-video-stop-requested', {
      stream: buildRoomCallMediaStreamDiagnostics(videoStream.value),
      syncState
    })
    videoUserMedia.stop()
    videoFacingMode.value = null

    if (syncState) {
      refreshLocalMediaState()
    }
  }

  const stopScreen = () => {
    captureRoomCallDiagnostic('local-screen-stop-requested', {
      stream: buildRoomCallMediaStreamDiagnostics(screenStream.value)
    })
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
    captureRoomCallDiagnostic('local-audio-start-requested', {
      deviceId,
      enabled,
      constraints: audioUserMedia.constraints.value
    })

    try {
      const stream = (await audioUserMedia.start()) ?? null

      setRoomCallMediaStreamTracksEnabled(stream, 'audio', enabled)
      captureLocalMediaStreamTrackEvents('local-audio', stream)
      refreshLocalMediaState()
      captureRoomCallDiagnostic('local-audio-started', {
        deviceId,
        enabled,
        stream: buildRoomCallMediaStreamDiagnostics(stream)
      })

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
    captureRoomCallDiagnostic('local-video-start-requested', {
      deviceId,
      enabled,
      facingMode,
      constraints: videoUserMedia.constraints.value
    })

    try {
      const stream = (await videoUserMedia.start()) ?? null

      setRoomCallMediaStreamTracksEnabled(stream, 'video', enabled)
      captureLocalMediaStreamTrackEvents('local-video', stream)
      videoFacingMode.value = await resolveVideoFacingMode(stream)
      refreshLocalMediaState()
      captureRoomCallDiagnostic('local-video-started', {
        deviceId,
        enabled,
        facingMode: videoFacingMode.value,
        stream: buildRoomCallMediaStreamDiagnostics(stream)
      })

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
    captureRoomCallDiagnostic('local-screen-start-requested')

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: true
      })

      screenStream.value = stream
      refreshLocalMediaState()
      stream.getVideoTracks().forEach((track) => {
        captureLocalMediaTrackEvents('local-screen', track)
        track.addEventListener('ended', stopScreen, { once: true })
      })
      captureRoomCallDiagnostic('local-screen-started', {
        stream: buildRoomCallMediaStreamDiagnostics(stream)
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
    captureRoomCallDiagnostic('local-media-start-requested', {
      mediaKind
    })
    await startAudio()

    if (mediaKind === 'video') {
      await startVideo()
    }

    if (mediaKind === 'screen') {
      await startScreen()
    }

    captureRoomCallDiagnostic('local-media-started', {
      mediaKind,
      state: localMediaState.value,
      streams: {
        audio: buildRoomCallMediaStreamDiagnostics(audioStream.value),
        screen: buildRoomCallMediaStreamDiagnostics(screenStream.value),
        video: buildRoomCallMediaStreamDiagnostics(videoStream.value)
      }
    })
  }

  const stopRoomCallLocalMedia = () => {
    captureRoomCallDiagnostic('local-media-stop-requested', {
      state: localMediaState.value,
      streams: {
        audio: buildRoomCallMediaStreamDiagnostics(audioStream.value),
        screen: buildRoomCallMediaStreamDiagnostics(screenStream.value),
        video: buildRoomCallMediaStreamDiagnostics(videoStream.value)
      }
    })
    stopAudio()
    stopVideo()
    stopScreen()
  }

  const setAudioEnabled = (enabled: boolean) => {
    setRoomCallMediaStreamTracksEnabled(audioStream.value, 'audio', enabled)
    refreshLocalMediaState()
    captureRoomCallDiagnostic('local-audio-enabled-set', {
      enabled,
      state: localMediaState.value,
      stream: buildRoomCallMediaStreamDiagnostics(audioStream.value)
    })
  }

  const setVideoEnabled = (enabled: boolean) => {
    setRoomCallMediaStreamTracksEnabled(videoStream.value, 'video', enabled)
    refreshLocalMediaState()
    captureRoomCallDiagnostic('local-video-enabled-set', {
      enabled,
      state: localMediaState.value,
      stream: buildRoomCallMediaStreamDiagnostics(videoStream.value)
    })
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
