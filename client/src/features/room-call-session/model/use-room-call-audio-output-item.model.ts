import { isFunction } from 'global-shared'
import { onBeforeUnmount, useTemplateRef, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { log } from 'src/shared/lib'

import type { RoomCallAudioOutputItemProps } from '../config/types'

export const useRoomCallAudioOutputItem = (props: RoomCallAudioOutputItemProps) => {
  const audioRef = useTemplateRef<HTMLAudioElement>('audio')
  const { settings } = useSettings()

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
