import { Howl } from 'howler'

export enum Sounds {
  messageDelivered = 'messageDelivered',
  calling = 'calling',
  busy = 'busy',
  connection = 'connection',
  ring = 'ring'
}

const soundSrc: Record<Sounds, string> = {
  messageDelivered: './sounds/ding.mp3',
  calling: './sounds/calling.mp3',
  busy: './sounds/busy.mp3',
  connection: './sounds/connection.mp3',
  ring: './sounds/ring.mp3'
}

const $sound = (sound: Sounds, loop?: boolean) => {
  return new Howl({
    src: [soundSrc[sound]],
    volume: 0.2,
    loop
  })
}

export default $sound
