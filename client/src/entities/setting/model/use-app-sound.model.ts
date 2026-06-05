import { createGlobalState } from '@vueuse/core'
import { isFunction } from 'global-shared'
import { watch } from 'vue'

import { APP_SOUND_KIND, APP_SOUND_SRC_BY_KIND, type AppSoundKind } from 'src/shared/lib'

import { useSettings } from './use-settings.model'

export const useAppSound = createGlobalState(() => {
  const { settings } = useSettings()
  const audioByKind: Partial<Record<AppSoundKind, HTMLAudioElement>> = {}

  const resolveAppSoundAudio = (kind: AppSoundKind) => {
    const audio = audioByKind[kind]

    if (audio) return audio

    const nextAudio = new Audio(APP_SOUND_SRC_BY_KIND[kind])
    audioByKind[kind] = nextAudio

    return nextAudio
  }

  const applyAppSoundOutputDevice = async (audio: HTMLAudioElement) => {
    if (!isFunction(audio.setSinkId)) return

    const { audioOutputDeviceId } = settings.value.ioDevices

    try {
      await audio.setSinkId(audioOutputDeviceId)
    } catch (error) {
      if (audioOutputDeviceId) {
        try {
          await audio.setSinkId('')
        } catch (fallbackError) {
          void fallbackError
        }
      }

      void error
    }
  }

  const syncCreatedAppSoundsOutputDevice = async () => {
    await Promise.all(
      Object.values(audioByKind).map(async (audio) => {
        if (audio) {
          await applyAppSoundOutputDevice(audio)
        }
      })
    )
  }

  const stopAppSound = (kind: AppSoundKind) => {
    const audio = audioByKind[kind]

    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    audio.loop = false
  }

  const stopAllAppSounds = () => {
    Object.values(APP_SOUND_KIND).forEach((kind) => stopAppSound(kind))
  }

  const playPreparedAppSound = async (kind: AppSoundKind, loop: boolean) => {
    const audio = resolveAppSoundAudio(kind)

    stopAppSound(kind)
    audio.loop = loop
    await applyAppSoundOutputDevice(audio)

    try {
      await audio.play()
    } catch (error) {
      stopAppSound(kind)
      throw error
    }

    return audio
  }

  const playAppSound = (kind: AppSoundKind) => playPreparedAppSound(kind, false)
  const startLoopAppSound = (kind: AppSoundKind) => playPreparedAppSound(kind, true)

  watch(
    () => settings.value.ioDevices.audioOutputDeviceId,
    () => {
      void syncCreatedAppSoundsOutputDevice()
    }
  )

  return {
    playAppSound,
    startLoopAppSound,
    stopAllAppSounds,
    stopAppSound
  }
})
