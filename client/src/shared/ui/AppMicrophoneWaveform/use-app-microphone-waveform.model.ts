import { computed, ref, watch } from 'vue'

import {
  APP_MICROPHONE_WAVEFORM_BARS,
  APP_MICROPHONE_WAVEFORM_DEFAULT_PROPS,
  APP_MICROPHONE_WAVEFORM_DISPLAY_MAX_DB,
  APP_MICROPHONE_WAVEFORM_DISPLAY_MIN_DB,
  APP_MICROPHONE_WAVEFORM_MIN_BAR_SCALE,
  APP_MICROPHONE_WAVEFORM_SMOOTHING
} from './constants'
import type { AppMicrophoneWaveformProps } from './types'

export const useAppMicrophoneWaveform = (props: AppMicrophoneWaveformProps) => {
  const displayedVolume = ref(0)

  const normalizeVolumeDb = (value: number) => {
    if (!Number.isFinite(value)) return 0

    return Math.min(
      Math.max(
        ((value - APP_MICROPHONE_WAVEFORM_DISPLAY_MIN_DB) /
          (APP_MICROPHONE_WAVEFORM_DISPLAY_MAX_DB - APP_MICROPHONE_WAVEFORM_DISPLAY_MIN_DB)) *
          100,
        0
      ),
      100
    )
  }

  const getBarScale = (bar: number) =>
    Math.min(Math.max((displayedVolume.value / 100) * bar, APP_MICROPHONE_WAVEFORM_MIN_BAR_SCALE), 1)

  const normalizedVolume = computed(() => normalizeVolumeDb(props.volumeDb))
  const volumeValue = computed(() => Math.round(displayedVolume.value))
  const waveformColor = computed(() =>
    displayedVolume.value >= (props.loudThreshold ?? APP_MICROPHONE_WAVEFORM_DEFAULT_PROPS.loudThreshold)
      ? 'var(--nmorph-warn-color)'
      : 'var(--nmorph-accent-color)'
  )
  const waveformStyle = computed(() => ({
    color: waveformColor.value
  }))
  const waveformBars = computed(() =>
    APP_MICROPHONE_WAVEFORM_BARS.map((bar) => ({
      transform: `scaleY(${getBarScale(bar)})`
    }))
  )

  watch(
    normalizedVolume,
    (value) => {
      displayedVolume.value += (value - displayedVolume.value) * APP_MICROPHONE_WAVEFORM_SMOOTHING
    },
    { immediate: true }
  )

  return {
    volumeValue,
    waveformBars,
    waveformColor,
    waveformStyle
  }
}
