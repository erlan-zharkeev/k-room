import { Howl } from 'howler'

type SoundSources = {
  [key in Sounds]: string
}

export enum Sounds {
  messageDelivered = 'messageDelivered'
}

const soundSrc: SoundSources = {
  messageDelivered: '@/src/assets/sounds/ding.mp3'
}

export const sound = (sound: Sounds) => {
  return new Howl({
    src: [soundSrc[sound]],
    volume: 0.2
  })
}
