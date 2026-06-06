import type { APP_SOUND_KIND } from './constants'

export type AppSoundKind = (typeof APP_SOUND_KIND)[keyof typeof APP_SOUND_KIND]

export interface AudioMeterAnalyser {
  analyser: AnalyserNode
  context: AudioContext
  data: Float32Array<ArrayBuffer>
  source: MediaStreamAudioSourceNode
}
