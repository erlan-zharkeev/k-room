<script setup lang="ts">
import {
  NmorphCallout,
  NmorphCheckbox,
  NmorphIcon,
  NmorphIconPlay,
  NmorphIconStop,
  NmorphSelect
} from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { AppMicrophoneWaveform, AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../../config/i18n/devices.i18n'
import { useAudioInputDevice } from '../../../model/devices/use-audio-input-device.model'
import SettingsCard from '../../SettingsCard.vue'

const {
  settings,
  audioInputOptions,
  audioInputLoading,
  isAudioInputCheckDisabled,
  audioInputPermissionCalloutType,
  audioInputPermissionStatus,
  hasAudioInputPermissionWarning,
  audioVolumeDb,
  isAudioInputChecking,
  setAudioInputChecking,
  setSelectedAudioInputDevice
} = useAudioInputDevice()

const audioInputCheckLabel = computed(() =>
  isAudioInputChecking.value
    ? SETTINGS_PAGE_DEVICES_I18N.stopAudioInputCheck
    : SETTINGS_PAGE_DEVICES_I18N.testAudioInput
)
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_DEVICES_I18N.audioInputDevice)" :has-warning="hasAudioInputPermissionWarning">
    <div class="settings-audio-input-device-card">
      <AppText size="small" :text="$t(SETTINGS_PAGE_DEVICES_I18N.audioInputDeviceDescription)" />

      <NmorphCallout :type="audioInputPermissionCalloutType" :content="audioInputPermissionStatus" />
      <AppText
        v-if="!audioInputLoading && audioInputOptions.length === 0"
        size="small"
        color="warn"
        :text="$t(SETTINGS_PAGE_DEVICES_I18N.notAvailable)"
      />

      <div class="settings-audio-input-device-card__control">
        <NmorphSelect
          :key="settings.ioDevices.audioInputDeviceId"
          :aria-label="$t(SETTINGS_PAGE_DEVICES_I18N.audioInputDevice)"
          :model-value="settings.ioDevices.audioInputDeviceId"
          :options="audioInputOptions"
          :loading="audioInputLoading"
          :disabled="audioInputLoading || audioInputOptions.length === 0"
          value-required
          fill
          @update:model-value="setSelectedAudioInputDevice"
        />

        <NmorphCheckbox
          :model-value="isAudioInputChecking"
          height="basic"
          :aria-label="$t(audioInputCheckLabel)"
          :disabled="isAudioInputCheckDisabled"
          @update:model-value="setAudioInputChecking"
        >
          <template #label>
            <NmorphIcon>
              <NmorphIconStop v-if="isAudioInputChecking" />
              <NmorphIconPlay v-else />
            </NmorphIcon>
          </template>
        </NmorphCheckbox>
      </div>

      <AppMicrophoneWaveform
        v-if="isAudioInputChecking"
        :volume-db="audioVolumeDb"
        :label="$t(SETTINGS_PAGE_DEVICES_I18N.audioInputLevel)"
      />
    </div>
  </SettingsCard>
</template>

<style lang="scss">
.settings-audio-input-device-card {
  display: grid;
  gap: 8px;
}

.settings-audio-input-device-card__control {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
