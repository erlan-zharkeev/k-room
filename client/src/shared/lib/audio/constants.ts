import type { AppSoundKind } from './types'

export const APP_SOUND_KIND_VALUES = [
  'call-connection',
  'incoming-call',
  'incoming-message',
  'interlocutor-busy',
  'outgoing-call'
] as const satisfies readonly AppSoundKind[]

export const APP_SOUND_SRC_BY_KIND = {
  'call-connection': '/sounds/call-connection.mp3',
  'incoming-call': '/sounds/incoming-call.mp3',
  'incoming-message': '/sounds/incoming-message.mp3',
  'interlocutor-busy': '/sounds/interlocutor-busy.mp3',
  'outgoing-call': '/sounds/outgoing-call.mp3'
} as const satisfies Record<AppSoundKind, string>

export const AUDIO_METER_ANALYSER_FFT_SIZE = 512
export const AUDIO_METER_SMOOTHING_TIME_CONSTANT = 0.2
