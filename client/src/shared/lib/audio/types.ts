export type AppSoundKind = 'busy' | 'calling' | 'call-ring' | 'connection' | 'message'

export interface AudioMeterAnalyser {
  analyser: AnalyserNode
  context: AudioContext
  data: Float32Array<ArrayBuffer>
  source: MediaStreamAudioSourceNode
}
