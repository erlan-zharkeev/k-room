<script setup lang="ts">
import { NmorphButton, NmorphCallout, NmorphIconCaretRight, NmorphSelect } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../../config/i18n/devices.i18n'
import { useVideoInputDevice } from '../../../model/devices/use-video-input-device'
import SettingsCard from '../../SettingsCard.vue'

const {
  settings,
  videoInputOptions,
  videoInputLoading,
  videoInputCheckLoading,
  videoElement,
  isVideoInputChecking,
  toggleVideoInputCheck,
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

      <div class="settings-video-input-device-card__control">
        <NmorphSelect
          class="settings-video-input-device-card__select"
          :aria-label="$t(SETTINGS_PAGE_DEVICES_I18N.videoInputDevice)"
          :model-value="settings.selectedVideoInputDeviceId"
          :options="videoInputOptions"
          :loading="videoInputLoading"
          :disabled="videoInputLoading || videoInputOptions.length === 0"
          fill
          value-required
          @update:model-value="setSelectedVideoInputDevice"
        />

        <NmorphButton
          :aria-label="$t(videoInputCheckLabel)"
          :loading="videoInputCheckLoading"
          :disabled="videoInputLoading || videoInputOptions.length === 0"
          @click="toggleVideoInputCheck"
        >
          <template #icon-only>
            <span v-if="isVideoInputChecking" class="settings-video-input-device-card__stop-icon" aria-hidden="true" />
            <NmorphIconCaretRight v-else />
          </template>
        </NmorphButton>
      </div>

      <div class="settings-video-input-device-card__preview-container nmorph--shadow-inset">
        <video
          ref="videoElement"
          class="settings-video-input-device-card__preview"
          :aria-label="$t(SETTINGS_PAGE_DEVICES_I18N.videoPreview)"
          autoplay
          muted
          playsinline
        />
      </div>

      <NmorphCallout
        v-if="!videoInputLoading && videoInputOptions.length === 0"
        type="warning"
        :content="$t(SETTINGS_PAGE_DEVICES_I18N.notAvailable)"
      />
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
}

.settings-video-input-device-card__preview-container {
  position: relative;
  width: 100%;
}

.settings-video-input-device-card__preview {
  aspect-ratio: 16 / 9;
  width: 100%;
  object-fit: cover;
}
</style>
