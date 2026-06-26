<script setup lang="ts">
import { NmorphText, NmorphButton, NmorphCallout, NmorphSelect } from '@nmorph/nmorph-ui-kit'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../../config/i18n/devices.i18n'
import { useAudioOutputDevice } from '../../../model/devices/use-audio-output-device.model'
import SettingsCard from '../../SettingsCard.vue'

const {
  audioOutputOptions,
  audioOutputSelectValue,
  audioOutputLoading,
  audioOutputTestLoading,
  audioOutputPermissionCalloutType,
  audioOutputPermissionStatus,
  setSelectedAudioOutputDevice,
  testAudioOutput
} = useAudioOutputDevice()
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_DEVICES_I18N.audioOutputDevice)">
    <div class="settings-audio-output-device-card">
      <NmorphText variant="body-small">{{ $t(SETTINGS_PAGE_DEVICES_I18N.audioOutputDeviceDescription) }}</NmorphText>

      <NmorphCallout :type="audioOutputPermissionCalloutType" :content="audioOutputPermissionStatus" />
      <NmorphText
        v-if="!audioOutputLoading && audioOutputOptions.length === 0"
        color="var(--nmorph-warn-text-color)"
        variant="body-small"
        >{{ $t(SETTINGS_PAGE_DEVICES_I18N.notAvailable) }}</NmorphText
      >

      <div class="settings-audio-output-device-card__control">
        <NmorphSelect
          :key="audioOutputSelectValue"
          class="settings-audio-output-device-card__select"
          :aria-label="$t(SETTINGS_PAGE_DEVICES_I18N.audioOutputDevice)"
          :model-value="audioOutputSelectValue"
          :options="audioOutputOptions"
          :loading="audioOutputLoading"
          :disabled="audioOutputLoading || audioOutputOptions.length === 0"
          value-required
          fill
          @update:model-value="setSelectedAudioOutputDevice"
        />

        <NmorphButton
          class="settings-audio-output-device-card__check-button"
          :text="$t(SETTINGS_PAGE_DEVICES_I18N.testDeviceCheck)"
          :aria-label="$t(SETTINGS_PAGE_DEVICES_I18N.testAudioOutput)"
          :loading="audioOutputTestLoading"
          :disabled="audioOutputLoading || audioOutputOptions.length === 0"
          @click="testAudioOutput"
        />
      </div>
    </div>
  </SettingsCard>
</template>

<style lang="scss">
.settings-audio-output-device-card {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.settings-audio-output-device-card__control {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.settings-audio-output-device-card__select {
  min-width: 0;
}

.settings-audio-output-device-card__check-button {
  flex: 0 0 auto;
  min-width: 96px;
  white-space: nowrap;
}
</style>
