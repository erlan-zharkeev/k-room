<script setup lang="ts">
import { NmorphSelect, NmorphText } from '@nmorph/nmorph-ui-kit'

import { MEDIA_DEVICE_I18N } from 'src/shared/lib'

import type { RoomCallIoDeviceSettingsProps } from '../config/types'
import { useRoomCallIoDeviceSettings } from '../model/use-room-call-io-device-settings.model'

const props = defineProps<RoomCallIoDeviceSettingsProps>()
const {
  audioInputOptions,
  audioInputSelectValue,
  videoInputOptions,
  videoInputSelectValue,
  audioOutputOptions,
  audioOutputSelectValue,
  areInputDeviceSelectsDisabled,
  isAudioOutputSelectDisabled,
  setSelectedAudioInputDevice,
  setSelectedVideoInputDevice,
  setSelectedAudioOutputDevice
} = useRoomCallIoDeviceSettings(props)
</script>

<template>
  <div class="room-call-io-device-settings">
    <div class="room-call-io-device-settings__field">
      <NmorphText as="small" variant="body-small">{{ $t(MEDIA_DEVICE_I18N.audioInputDevice) }}</NmorphText>
      <NmorphSelect
        class="room-call-io-device-settings__select"
        :key="audioInputSelectValue"
        :aria-label="$t(MEDIA_DEVICE_I18N.audioInputDevice)"
        :model-value="audioInputSelectValue"
        :options="audioInputOptions"
        :disabled="areInputDeviceSelectsDisabled"
        fill
        value-required
        @update:model-value="setSelectedAudioInputDevice"
      />
    </div>

    <div class="room-call-io-device-settings__field">
      <NmorphText as="small" variant="body-small">{{ $t(MEDIA_DEVICE_I18N.videoInputDevice) }}</NmorphText>
      <NmorphSelect
        class="room-call-io-device-settings__select"
        :key="videoInputSelectValue"
        :aria-label="$t(MEDIA_DEVICE_I18N.videoInputDevice)"
        :model-value="videoInputSelectValue"
        :options="videoInputOptions"
        :disabled="areInputDeviceSelectsDisabled"
        fill
        value-required
        @update:model-value="setSelectedVideoInputDevice"
      />
    </div>

    <div class="room-call-io-device-settings__field">
      <NmorphText as="small" variant="body-small">{{ $t(MEDIA_DEVICE_I18N.audioOutputDevice) }}</NmorphText>
      <NmorphSelect
        class="room-call-io-device-settings__select"
        :key="audioOutputSelectValue"
        :aria-label="$t(MEDIA_DEVICE_I18N.audioOutputDevice)"
        :model-value="audioOutputSelectValue"
        :options="audioOutputOptions"
        :disabled="isAudioOutputSelectDisabled"
        fill
        value-required
        @update:model-value="setSelectedAudioOutputDevice"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.room-call-io-device-settings {
  display: grid;
  gap: 12px;
  box-sizing: border-box;
  min-width: 0;
}

.room-call-io-device-settings__field {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.room-call-io-device-settings__select {
  min-width: 0;
  max-width: 100%;
}

.room-call-io-device-settings__select :deep(.nmorph-select__content) {
  overflow: hidden;
  min-width: 0;
}

.room-call-io-device-settings__select :deep(.nmorph-select__selected-values-line) {
  width: 100%;
  min-width: 0;
}

.room-call-io-device-settings__select :deep(.nmorph-select__selected-value) {
  flex: 1 1 auto;
  min-width: 0;
}

.room-call-io-device-settings__select :deep(.nmorph-select__chevron) {
  flex: 0 0 auto;
}
</style>
