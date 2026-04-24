import { SoundType } from './types.ts'

export const SOUND_SRC: Record<SoundType, string> = {
  'message-delivered': './sounds/ding.mp3',
  calling: './sounds/calling.mp3',
  busy: './sounds/busy.mp3',
  connection: './sounds/connection.mp3',
  ring: './sounds/ring.mp3'
}
