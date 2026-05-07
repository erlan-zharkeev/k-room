<script setup lang="ts">
import { NmorphButton, NmorphIconCaretRight, NmorphProgress, NmorphSelect } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../../config/i18n/devices.i18n'
import { useAudioInputDevice } from '../../../model/devices/use-audio-input-device'
import SettingsCard from '../../SettingsCard.vue'

const {
  settings,
  audioInputOptions,
  audioInputLoading,
  audioInputCheckLoading,
  audioVolume,
  isAudioInputChecking,
  toggleAudioInputCheck,
  setSelectedAudioInputDevice
} = useAudioInputDevice()

const audioInputCheckLabel = computed(() =>
  isAudioInputChecking.value
    ? SETTINGS_PAGE_DEVICES_I18N.stopAudioInputCheck
    : SETTINGS_PAGE_DEVICES_I18N.testAudioInput
)
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_DEVICES_I18N.audioInputDevice)">
    <div class="settings-audio-input-device-card">
      <AppText size="small" :text="$t(SETTINGS_PAGE_DEVICES_I18N.audioInputDeviceDescription)" />

      <div class="settings-audio-input-device-card__control">
        <NmorphSelect
          :key="settings.selectedAudioInputDeviceId"
          class="settings-audio-input-device-card__select"
          :aria-label="$t(SETTINGS_PAGE_DEVICES_I18N.audioInputDevice)"
          :model-value="settings.selectedAudioInputDeviceId"
          :options="audioInputOptions"
          :loading="audioInputLoading"
          :disabled="audioInputLoading || audioInputOptions.length === 0"
          value-required
          fill
          @update:model-value="setSelectedAudioInputDevice"
        />

        <NmorphButton
          :aria-label="$t(audioInputCheckLabel)"
          :loading="audioInputCheckLoading"
          :disabled="audioInputLoading || audioInputOptions.length === 0"
          @click="toggleAudioInputCheck"
        >
          <template #icon-only>
            <span v-if="isAudioInputChecking" class="settings-audio-input-device-card__stop-icon" aria-hidden="true" />
            <NmorphIconCaretRight v-else />
          </template>
        </NmorphButton>
      </div>

      <NmorphProgress :percentage="audioVolume" :value-right-side="false" />

      <AppText
        v-if="!audioInputLoading && audioInputOptions.length === 0"
        size="small"
        color="warn"
        :text="$t(SETTINGS_PAGE_DEVICES_I18N.notAvailable)"
      />
    </div>
  </SettingsCard>
</template>

<style lang="scss">
.settings-audio-input-device-card {
  display: grid;
  gap: 12px;
}

.settings-audio-input-device-card__control {
  display: flex;
  gap: 8px;
}
</style>
