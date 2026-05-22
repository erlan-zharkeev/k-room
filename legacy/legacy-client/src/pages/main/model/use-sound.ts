import { useRef } from 'react'

import { Howl } from 'howler'

import { useSettings } from 'src/shared/preferences'
import { useSystem } from 'src/shared/system'

import { SOUND_SRC } from './sound/constants.ts'
import { Sound } from './sound/types.ts'

export const useSound = () => {
  const { soundOn } = useSettings()
  const { hasInteracted } = useSystem()
  const { selectedAudioOutputDeviceId } = useSettings()

  const soundInstances = useRef<Partial<Record<Sound, Howl>>>({})

  const play = (key: Sound, loop = false) => {
    if (!soundOn || !hasInteracted) return

    if (soundInstances.current[key]) {
      soundInstances.current[key].stop()
      delete soundInstances.current[key]
    }

    const sound = new Howl({
      src: [SOUND_SRC[key]],
      volume: 0.2,
      html5: true,
      loop,
      onplay: () => {
        // @ts-expect-error Howl internal _sounds property is not typed in the public API
        const audioNode = sound._sounds?.[0]?._node
        if (typeof audioNode?.setSinkId === 'function' && selectedAudioOutputDeviceId) {
          audioNode.setSinkId(selectedAudioOutputDeviceId).catch((err: unknown) => {
            console.warn('Failed to setSinkId:', err)
          })
        }
      },
      onend: () => {
        if (!loop) delete soundInstances.current[key]
      }
    })

    soundInstances.current[key] = sound
    sound.play()
  }

  const stop = (key: Sound) => {
    const sound = soundInstances.current[key]
    if (sound) {
      sound.stop()
      delete soundInstances.current[key]
    }
  }

  const stopAll = () => {
    Object.values(soundInstances.current).forEach((sound) => sound.stop())
    soundInstances.current = {}
  }

  return { play, stop, stopAll }
}
