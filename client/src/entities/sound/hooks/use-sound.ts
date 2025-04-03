import { useSettings } from 'src/entities/settings'
import { useSystem } from 'src/entities/system'
import { Sound, sound } from 'src/shared/lib'

export const useSound = () => {
  const { soundOn } = useSettings()
  const { allowAudioContext } = useSystem()

  const play = (src: Sound) => {
    if (soundOn && allowAudioContext) {
      const soundInstance = sound(src)
      soundInstance.play()
      return soundInstance
    }
  }

  return { play }
}
