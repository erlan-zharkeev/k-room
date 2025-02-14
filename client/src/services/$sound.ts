import { Howl } from 'howler'
import { Sounds } from 'src/@enums'

const soundSrc: Record<Sounds, string> = {
  'message-delivered': './sounds/ding.mp3',
  calling: './sounds/calling.mp3',
  busy: './sounds/busy.mp3',
  connection: './sounds/connection.mp3',
  ring: './sounds/ring.mp3'
}

export const $sound = (sound: Sounds, loop?: boolean) => {
  return new Howl({
    src: [soundSrc[sound]],
    volume: 0.2,
    loop
  })
}
