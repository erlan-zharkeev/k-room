<script setup lang="ts">
import { NmorphText, NmorphButton, NmorphCallout, NmorphAudioMeter, NmorphSelect } from '@nmorph/nmorph-ui-kit'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../../config/i18n/devices.i18n'
import { useAudioInputDevice } from '../../../model/devices/use-audio-input-device.model'
import SettingsCard from '../../SettingsCard.vue'

const {
  settings,
  audioInputOptions,
  audioInputLoading,
  audioInputCheckLoading,
  isAudioInputCheckDisabled,
  audioInputPermissionCalloutType,
  audioInputPermissionStatus,
  hasAudioInputPermissionWarning,
  audioVolumeDb,
  isAudioInputChecking,
  audioInputCheckLabel,
  audioInputCheckButtonLabel,
  setAudioInputChecking,
  setSelectedAudioInputDevice
} = useAudioInputDevice()
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_DEVICES_I18N.audioInputDevice)" :has-warning="hasAudioInputPermissionWarning">
    <div class="settings-audio-input-device-card">
      <NmorphText variant="body-small">{{ $t(SETTINGS_PAGE_DEVICES_I18N.audioInputDeviceDescription) }}</NmorphText>

      <NmorphCallout :type="audioInputPermissionCalloutType" :content="audioInputPermissionStatus" />

      <div class="settings-audio-input-device-card__control">
        <NmorphSelect
          :key="settings.ioDevices.audioInputDeviceId"
          class="settings-audio-input-device-card__select"
          :aria-label="$t(SETTINGS_PAGE_DEVICES_I18N.audioInputDevice)"
          :model-value="settings.ioDevices.audioInputDeviceId"
          :options="audioInputOptions"
          :loading="audioInputLoading"
          :disabled="audioInputLoading || audioInputOptions.length === 0"
          value-required
          fill
          @update:model-value="setSelectedAudioInputDevice"
        />

        <NmorphButton
          class="settings-audio-input-device-card__check-button"
          :text="$t(audioInputCheckButtonLabel)"
          :aria-label="$t(audioInputCheckLabel)"
          :loading="audioInputCheckLoading"
          :disabled="isAudioInputCheckDisabled"
          @click="setAudioInputChecking(!isAudioInputChecking)"
        />
      </div>

      <NmorphAudioMeter
        v-if="isAudioInputChecking"
        class="settings-audio-input-device-card__level-meter"
        :label="$t(SETTINGS_PAGE_DEVICES_I18N.audioInputLevel)"
        :volume-db="audioVolumeDb"
        :bars="21"
      />
    </div>
  </SettingsCard>
</template>

<style lang="scss" scoped>
.settings-audio-input-device-card {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.settings-audio-input-device-card__control {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.settings-audio-input-device-card__select {
  min-width: 0;
}

.settings-audio-input-device-card__check-button {
  flex: 0 0 auto;
  min-width: 96px;
  white-space: nowrap;
}

.settings-audio-input-device-card__level-meter.nmorph-audio-meter.nmorph-audio-meter--bars {
  width: 100%;
  margin-top: 4px;
}

.settings-audio-input-device-card__level-meter.nmorph-audio-meter :deep(.nmorph-audio-meter__bar) {
  flex: 1 1 0;
}
</style>
