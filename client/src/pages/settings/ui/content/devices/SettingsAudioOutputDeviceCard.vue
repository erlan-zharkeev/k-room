<script setup lang="ts">
import { NmorphButton, NmorphIconCaretRight, NmorphSelect } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../../config/i18n/devices.i18n'
import { useAudioOutputDevice } from '../../../model/devices/use-audio-output-device'
import SettingsCard from '../../SettingsCard.vue'

const {
  settings,
  audioOutputOptions,
  audioOutputLoading,
  audioOutputTestLoading,
  setSelectedAudioOutputDevice,
  testAudioOutput
} = useAudioOutputDevice()
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_DEVICES_I18N.audioOutputDevice)">
    <div class="settings-audio-output-device-card">
      <AppText size="small" :text="$t(SETTINGS_PAGE_DEVICES_I18N.audioOutputDeviceDescription)" />

      <div class="settings-audio-output-device-card__control">
        <NmorphSelect
          :key="settings.selectedAudioOutputDeviceId"
          class="settings-audio-output-device-card__select"
          :aria-label="$t(SETTINGS_PAGE_DEVICES_I18N.audioOutputDevice)"
          :model-value="settings.selectedAudioOutputDeviceId"
          :options="audioOutputOptions"
          :loading="audioOutputLoading"
          :disabled="audioOutputLoading || audioOutputOptions.length === 0"
          value-required
          fill
          @update:model-value="setSelectedAudioOutputDevice"
        />

        <NmorphButton
          :aria-label="$t(SETTINGS_PAGE_DEVICES_I18N.testAudioOutput)"
          :loading="audioOutputTestLoading"
          :disabled="audioOutputLoading || audioOutputOptions.length === 0"
          @click="testAudioOutput"
        >
          <template #icon-only>
            <NmorphIconCaretRight />
          </template>
        </NmorphButton>
      </div>

      <AppText
        v-if="!audioOutputLoading && audioOutputOptions.length === 0"
        size="small"
        color="warn"
        :text="$t(SETTINGS_PAGE_DEVICES_I18N.notAvailable)"
      />
    </div>
  </SettingsCard>
</template>

<style lang="scss">
.settings-audio-output-device-card {
  display: grid;
  gap: 12px;
}

.settings-audio-output-device-card__control {
  display: flex;
  gap: 8px;
}
</style>
