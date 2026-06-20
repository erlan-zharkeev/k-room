export type AppSoundKind =
  | 'call-connection'
  | 'incoming-call'
  | 'incoming-message'
  | 'interlocutor-busy'
  | 'outgoing-call'

export interface AudioMeterAnalyser {
  analyser: AnalyserNode
  context: AudioContext
  data: Float32Array<ArrayBuffer>
  source: MediaStreamAudioSourceNode
}
