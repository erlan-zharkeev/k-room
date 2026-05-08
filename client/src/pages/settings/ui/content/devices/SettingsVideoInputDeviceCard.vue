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

import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../../config/i18n/devices.i18n'
import { useVideoInputDevice } from '../../../model/devices/use-video-input-device'
import SettingsCard from '../../SettingsCard.vue'

const {
  settings,
  videoInputOptions,
  videoInputLoading,
  isVideoInputCheckDisabled,
  videoInputPermissionCalloutType,
  videoInputPermissionStatus,
  videoElement,
  isVideoInputChecking,
  setVideoInputChecking,
  setSelectedVideoInputDevice
} = useVideoInputDevice()

const videoInputCheckLabel = computed(() =>
  isVideoInputChecking.value
    ? SETTINGS_PAGE_DEVICES_I18N.stopVideoInputCheck
    : SETTINGS_PAGE_DEVICES_I18N.testVideoInput
)
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_DEVICES_I18N.videoInputDevice)">
    <div class="settings-video-input-device-card">
      <AppText size="small" :text="$t(SETTINGS_PAGE_DEVICES_I18N.videoInputDeviceDescription)" />

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

        <NmorphCheckbox
          :model-value="isVideoInputChecking"
          design="button"
          :aria-label="$t(videoInputCheckLabel)"
          :disabled="isVideoInputCheckDisabled"
          @update:model-value="setVideoInputChecking"
        >
          <template #label>
            <NmorphIcon>
              <NmorphIconStop v-if="isVideoInputChecking" />
              <NmorphIconPlay v-else />
            </NmorphIcon>
          </template>
        </NmorphCheckbox>
      </div>

      <div v-if="isVideoInputChecking" class="settings-video-input-device-card__preview-container nmorph--shadow-inset">
        <video
          ref="videoElement"
          class="settings-video-input-device-card__preview"
          :aria-label="$t(SETTINGS_PAGE_DEVICES_I18N.videoPreview)"
          autoplay
          muted
          playsinline
        />
      </div>
    </div>
  </SettingsCard>
</template>

<style lang="scss">
.settings-video-input-device-card {
  display: grid;
  gap: 12px;
}

.settings-video-input-device-card__control {
  display: flex;
  gap: 8px;
  align-items: center;
}

.settings-video-input-device-card__permission {
  display: grid;
  gap: 4px;
}

.settings-video-input-device-card__preview-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 8px;
}

.settings-video-input-device-card__preview {
  transform: scaleX(-1);

  aspect-ratio: 16 / 9;
  width: 100%;
  border-radius: 8px;

  object-fit: cover;
}
</style>
