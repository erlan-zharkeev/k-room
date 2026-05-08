<script setup lang="ts">
import { NmorphIcon, NmorphIconMicrophone } from '@nmorph/nmorph-ui-kit'
import { computed, ref, watch } from 'vue'

import {
  APP_MICROPHONE_WAVEFORM_BARS,
  APP_MICROPHONE_WAVEFORM_DEFAULT_PROPS,
  APP_MICROPHONE_WAVEFORM_DISPLAY_MAX_DB,
  APP_MICROPHONE_WAVEFORM_DISPLAY_MIN_DB,
  APP_MICROPHONE_WAVEFORM_SMOOTHING,
  APP_MICROPHONE_WAVEFORM_MIN_BAR_SCALE
} from './constants'
import type { IAppMicrophoneWaveformProps } from './types'

const props = withDefaults(defineProps<IAppMicrophoneWaveformProps>(), APP_MICROPHONE_WAVEFORM_DEFAULT_PROPS)

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
  displayedVolume.value >= props.loudThreshold ? 'var(--nmorph-warn-color)' : 'var(--nmorph-accent-color)'
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
</script>

<template>
  <div
    class="app-microphone-waveform nmorph--shadow-inset"
    :style="waveformStyle"
    role="meter"
    :aria-label="props.label"
    :aria-valuenow="volumeValue"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <NmorphIcon v-if="props.showIcon" :color="waveformColor">
      <NmorphIconMicrophone />
    </NmorphIcon>

    <div class="app-microphone-waveform__bars">
      <span
        v-for="(waveformBar, index) in waveformBars"
        :key="index"
        class="app-microphone-waveform__bar"
        :style="waveformBar"
      />
    </div>
  </div>
</template>

<style lang="scss">
.app-microphone-waveform {
  display: flex;
  gap: 10px;
  align-items: center;

  width: max-content;
  min-height: 42px;
  padding: 8px 12px;
}

.app-microphone-waveform__bars {
  display: flex;
  gap: 4px;
  height: 100%;
}

.app-microphone-waveform__bar {
  width: 5px;
  height: 100%;
  border-radius: 8px;
  background: var(--nmorph-text-color);
}
</style>
