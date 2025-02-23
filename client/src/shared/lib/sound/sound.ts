import { Howl } from 'howler'
import { Sound } from './types'

const soundSrc: Record<Sound, string> = {
  'message-delivered': './sounds/ding.mp3',
  calling: './sounds/calling.mp3',
  busy: './sounds/busy.mp3',
  connection: './sounds/connection.mp3',
  ring: './sounds/ring.mp3'
}

export const sound = (sound: Sound, loop?: boolean) => {
  return new Howl({
    src: [soundSrc[sound]],
    volume: 0.2,
    loop
  })
}
