import { useRef } from 'react'

import { Howl } from 'howler'

import { useSettings } from 'src/entities/settings'
import { useSystem } from 'src/entities/system'

type Sound = 'message-delivered' | 'calling' | 'busy' | 'connection' | 'ring'

const soundSrc: Record<Sound, string> = {
  'message-delivered': './sounds/ding.mp3',
  calling: './sounds/calling.mp3',
  busy: './sounds/busy.mp3',
  connection: './sounds/connection.mp3',
  ring: './sounds/ring.mp3'
}

export const useSound = () => {
  const { soundOn } = useSettings()
  const { hasInteracted } = useSystem()
  const { selectedAudioOutputDeviceId } = useSettings()

  const soundInstances = useRef<Partial<Record<Sound, Howl>>>({})

  const play = (key: Sound, loop = false) => {
    if (!soundOn || !hasInteracted) return

    if (soundInstances.current[key]) {
      soundInstances.current[key].stop()
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete soundInstances.current[key]
    }

    const sound = new Howl({
      src: [soundSrc[key]],
      volume: 0.2,
      html5: true,
      loop,
      onplay: () => {
        // @ts-expect-error
        const audioNode = sound._sounds?.[0]?._node
        if (typeof audioNode?.setSinkId === 'function' && selectedAudioOutputDeviceId) {
          console.log('selectedAudioOutputDeviceId', selectedAudioOutputDeviceId)
          audioNode.setSinkId(selectedAudioOutputDeviceId).catch((err: unknown) => {
            console.warn('Failed to setSinkId:', err)
          })
        }
      },
      onend: () => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
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
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete soundInstances.current[key]
    }
  }

  const stopAll = () => {
    Object.values(soundInstances.current).forEach((sound) => sound.stop())
    soundInstances.current = {}
  }

  return { play, stop, stopAll }
}
