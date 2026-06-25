<script setup lang="ts">
import { NmorphText, NmorphButton, NmorphCallout, NmorphSelect, NmorphMediaTile } from '@nmorph/nmorph-ui-kit'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../../config/i18n/devices.i18n'
import { useVideoInputDevice } from '../../../model/devices/use-video-input-device.model'
import SettingsCard from '../../SettingsCard.vue'

const {
  settings,
  videoInputOptions,
  videoInputLoading,
  isVideoInputCheckDisabled,
  videoInputPermissionCalloutType,
  videoInputPermissionStatus,
  hasVideoInputPermissionWarning,
  videoInputStream,
  isVideoInputChecking,
  videoInputCheckLabel,
  videoInputCheckButtonLabel,
  setVideoInputChecking,
  setSelectedVideoInputDevice
} = useVideoInputDevice()
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_DEVICES_I18N.videoInputDevice)" :has-warning="hasVideoInputPermissionWarning">
    <div class="settings-video-input-device-card">
      <NmorphText variant="body-small">{{ $t(SETTINGS_PAGE_DEVICES_I18N.videoInputDeviceDescription) }}</NmorphText>

      <div class="settings-video-input-device-card__permission">
        <NmorphCallout :type="videoInputPermissionCalloutType" :content="videoInputPermissionStatus" />
        <NmorphCallout
          v-if="!videoInputLoading && videoInputOptions.length === 0"
          type="warning"
          :content="$t(SETTINGS_PAGE_DEVICES_I18N.notAvailable)"
        />
      </div>

      <div class="settings-video-input-device-card__control">
        <NmorphSelect
          :key="settings.ioDevices.videoInputDeviceId"
          class="settings-video-input-device-card__select"
          :aria-label="$t(SETTINGS_PAGE_DEVICES_I18N.videoInputDevice)"
          :model-value="settings.ioDevices.videoInputDeviceId"
          :options="videoInputOptions"
          :loading="videoInputLoading"
          :disabled="videoInputLoading || videoInputOptions.length === 0"
          fill
          value-required
          @update:model-value="setSelectedVideoInputDevice"
        />

        <NmorphButton
          class="settings-video-input-device-card__check-button"
          :text="$t(videoInputCheckButtonLabel)"
          :aria-label="$t(videoInputCheckLabel)"
          :disabled="isVideoInputCheckDisabled"
          @click="setVideoInputChecking(!isVideoInputChecking)"
        />
      </div>

      <NmorphMediaTile
        v-if="isVideoInputChecking"
        class="settings-video-input-device-card__preview"
        :src-object="videoInputStream"
        :name="$t(SETTINGS_PAGE_DEVICES_I18N.videoPreview)"
        mirrored
      />
    </div>
  </SettingsCard>
</template>

<style lang="scss">
.settings-video-input-device-card {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.settings-video-input-device-card__control {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.settings-video-input-device-card__select {
  min-width: 0;
}

.settings-video-input-device-card__check-button {
  flex: 0 0 auto;
  min-width: 96px;
  white-space: nowrap;
}

.settings-video-input-device-card__permission {
  display: grid;
  gap: 4px;
}

.settings-video-input-device-card__preview {
  width: 100%;
}
</style>
