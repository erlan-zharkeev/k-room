<script setup lang="ts">
import { NmorphButton, NmorphCallout, NmorphIconPlay, NmorphSelect } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

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
      <AppText size="small" :text="$t(SETTINGS_PAGE_DEVICES_I18N.audioOutputDeviceDescription)" />

      <NmorphCallout :type="audioOutputPermissionCalloutType" :content="audioOutputPermissionStatus" />
      <AppText
        v-if="!audioOutputLoading && audioOutputOptions.length === 0"
        size="small"
        color="warn"
        :text="$t(SETTINGS_PAGE_DEVICES_I18N.notAvailable)"
      />

      <div class="settings-audio-output-device-card__control">
        <NmorphSelect
          :key="audioOutputSelectValue"
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
          :aria-label="$t(SETTINGS_PAGE_DEVICES_I18N.testAudioOutput)"
          :loading="audioOutputTestLoading"
          :disabled="audioOutputLoading || audioOutputOptions.length === 0"
          @click="testAudioOutput"
        >
          <template #icon-only>
            <NmorphIconPlay />
          </template>
        </NmorphButton>
      </div>
    </div>
  </SettingsCard>
</template>

<style lang="scss">
.settings-audio-output-device-card {
  display: grid;
  gap: 8px;
}

.settings-audio-output-device-card__control {
  display: flex;
  gap: 8px;
}
</style>
