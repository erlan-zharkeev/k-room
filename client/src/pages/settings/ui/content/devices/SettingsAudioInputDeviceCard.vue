<script setup lang="ts">
import {
  NmorphButton,
  NmorphCallout,
  NmorphAudioMeter,
  NmorphIconPlay,
  NmorphIconStop,
  NmorphSelect
} from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

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
  setAudioInputChecking,
  setSelectedAudioInputDevice
} = useAudioInputDevice()
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
          :aria-label="$t(audioInputCheckLabel)"
          :loading="audioInputCheckLoading"
          :disabled="isAudioInputCheckDisabled"
          @click="setAudioInputChecking(!isAudioInputChecking)"
        >
          <template #icon-only>
            <NmorphIconStop v-if="isAudioInputChecking" />
            <NmorphIconPlay v-else />
          </template>
        </NmorphButton>
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

<style lang="scss">
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

.settings-audio-input-device-card__level-meter.nmorph-audio-meter.nmorph-audio-meter--bars {
  width: 100%;
  margin-top: 4px;
}

.settings-audio-input-device-card__level-meter.nmorph-audio-meter .nmorph-audio-meter__bar {
  flex: 1 1 0;
}
</style>
