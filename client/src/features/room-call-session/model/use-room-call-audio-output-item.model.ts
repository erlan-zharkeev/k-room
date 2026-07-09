import { isFunction } from 'global-shared'
import { onBeforeUnmount, useTemplateRef, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { captureClientSentryException, log, withClientSentryScope } from 'src/shared/lib'

import type { RoomCallAudioOutputItemProps } from '../config/types'

export const useRoomCallAudioOutputItem = (props: RoomCallAudioOutputItemProps) => {
  const audioRef = useTemplateRef<HTMLAudioElement>('audio')
  const { settings } = useSettings()

  const readRoomCallAudioOutputTrackContext = () =>
    props.item.stream.getAudioTracks().map((track) => ({
      enabled: track.enabled,
      id: track.id,
      label: track.label,
      muted: track.muted,
      readyState: track.readyState
    }))

  const captureRoomCallAudioOutputError = (error: unknown, reason: string) => {
    withClientSentryScope((scope) => {
      scope.setTag('room_call.audio_output.reason', reason)
      scope.setContext('room_call_audio_output', {
        audioOutputDeviceId: settings.value.ioDevices.audioOutputDeviceId || null,
        muted: props.item.muted,
        tracks: readRoomCallAudioOutputTrackContext(),
        userId: props.item.userId
      })
      captureClientSentryException(error)
    })
  }

  const resetRoomCallAudioOutputDevice = async (audio: HTMLAudioElement) => {
    try {
      await audio.setSinkId('')
    } catch (error) {
      void error
    }
  }

  const applyRoomCallAudioOutputDevice = async (audio: HTMLAudioElement) => {
    if (!isFunction(audio.setSinkId)) return

    const { audioOutputDeviceId } = settings.value.ioDevices

    if (!audioOutputDeviceId && !audio.sinkId) return

    try {
      await audio.setSinkId(audioOutputDeviceId)
    } catch (error) {
      if (audioOutputDeviceId) {
        await resetRoomCallAudioOutputDevice(audio)
      }

      captureRoomCallAudioOutputError(error, 'set-sink-id')
      log('warn', 'Failed to set room call audio output device', error)
    }
  }

  const playRoomCallAudioOutput = async (audio: HTMLAudioElement) => {
    if (props.item.muted) {
      audio.pause()
      return
    }

    try {
      await audio.play()
    } catch (error) {
      captureRoomCallAudioOutputError(error, 'play')
      log('warn', 'Failed to play room call audio output', error)
    }
  }

  const syncRoomCallAudioOutputItem = async () => {
    const audio = audioRef.value

    if (!audio) {
      return
    }

    if (audio.srcObject !== props.item.stream) {
      audio.srcObject = props.item.stream
    }

    audio.muted = props.item.muted
    await applyRoomCallAudioOutputDevice(audio)
    await playRoomCallAudioOutput(audio)
  }

  watch(
    () => [audioRef.value, props.item.muted, props.item.stream, settings.value.ioDevices.audioOutputDeviceId] as const,
    () => {
      void syncRoomCallAudioOutputItem()
    },
    { flush: 'post', immediate: true }
  )

  onBeforeUnmount(() => {
    const audio = audioRef.value

    if (!audio) {
      return
    }

    audio.pause()
    audio.srcObject = null
  })
}
