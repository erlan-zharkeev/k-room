import type { AppSoundKind } from './types'

export const APP_SOUND_KIND_VALUES = [
  'busy',
  'calling',
  'call-ring',
  'connection',
  'message'
] as const satisfies readonly AppSoundKind[]

export const APP_SOUND_SRC_BY_KIND = {
  busy: '/sounds/busy.mp3',
  calling: '/sounds/calling.mp3',
  'call-ring': '/sounds/call-ring.mp3',
  connection: '/sounds/connection.mp3',
  message: '/sounds/income-message.mp3'
} as const satisfies Record<AppSoundKind, string>

export const AUDIO_METER_ANALYSER_FFT_SIZE = 512
export const AUDIO_METER_SMOOTHING_TIME_CONSTANT = 0.2
