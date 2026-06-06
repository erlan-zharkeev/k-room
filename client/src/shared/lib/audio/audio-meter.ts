import { AUDIO_METER_ANALYSER_FFT_SIZE, AUDIO_METER_SMOOTHING_TIME_CONSTANT } from './constants'
import type { AudioMeterAnalyser } from './types'

export const calculateAudioVolumeDb = (data: Float32Array<ArrayBuffer>) => {
  const squareSum = data.reduce((result, item) => result + item * item, 0)
  const rms = Math.sqrt(squareSum / data.length)

  return 20 * Math.log10(Math.max(rms, Number.EPSILON))
}

export const createAudioMeterAnalyser = (stream: MediaStream): AudioMeterAnalyser => {
  const context = new AudioContext()
  const source = context.createMediaStreamSource(stream)
  const analyser = context.createAnalyser()
  const data: Float32Array<ArrayBuffer> = new Float32Array(AUDIO_METER_ANALYSER_FFT_SIZE)

  analyser.fftSize = AUDIO_METER_ANALYSER_FFT_SIZE
  analyser.smoothingTimeConstant = AUDIO_METER_SMOOTHING_TIME_CONSTANT
  source.connect(analyser)

  return {
    analyser,
    context,
    data,
    source
  }
}
