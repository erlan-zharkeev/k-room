<script setup lang="ts">
import { NmorphIcon, NmorphIconMicrophone } from '@nmorph/nmorph-ui-kit'

import { APP_MICROPHONE_WAVEFORM_DEFAULT_PROPS } from './constants'
import type { IAppMicrophoneWaveformProps } from './types'
import { useAppMicrophoneWaveform } from './use-app-microphone-waveform.model'

const props = withDefaults(defineProps<IAppMicrophoneWaveformProps>(), APP_MICROPHONE_WAVEFORM_DEFAULT_PROPS)
const { volumeValue, waveformBars, waveformColor, waveformStyle } = useAppMicrophoneWaveform(props)
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
