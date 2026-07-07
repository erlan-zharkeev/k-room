<script setup lang="ts">
import { NmorphText, NmorphButton, NmorphCallout, NmorphSelect } from '@nmorph/nmorph-ui-kit'

import { MEDIA_DEVICE_I18N } from 'src/shared/lib'
import { AppMediaTile } from 'src/shared/ui'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../../config/i18n/devices.i18n'
import { useVideoInputDevice } from '../../../model/devices/use-video-input-device.model'
import SettingsCard from '../../SettingsCard.vue'

const {
  videoInputSelectValue,
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
  <SettingsCard :title="$t(MEDIA_DEVICE_I18N.videoInputDevice)" :has-warning="hasVideoInputPermissionWarning">
    <div class="settings-video-input-device-card">
      <NmorphText variant="body-small">{{ $t(SETTINGS_PAGE_DEVICES_I18N.videoInputDeviceDescription) }}</NmorphText>

      <NmorphCallout :type="videoInputPermissionCalloutType" :content="videoInputPermissionStatus" />

      <div class="settings-video-input-device-card__control">
        <NmorphSelect
          :key="videoInputSelectValue"
          class="settings-video-input-device-card__select"
          :aria-label="$t(MEDIA_DEVICE_I18N.videoInputDevice)"
          :model-value="videoInputSelectValue"
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

      <AppMediaTile
        v-if="isVideoInputChecking"
        class="settings-video-input-device-card__preview"
        :stream="videoInputStream"
        :name="$t(SETTINGS_PAGE_DEVICES_I18N.videoPreview)"
        mirrored
      />
    </div>
  </SettingsCard>
</template>

<style lang="scss" scoped>
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

.settings-video-input-device-card__preview {
  width: 100%;
}
</style>
