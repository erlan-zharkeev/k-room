<script setup lang="ts">
import { NmorphButton, NmorphDialog, NmorphIcon, NmorphIconRefresh, NmorphIconSetting } from '@nmorph/nmorph-ui-kit'

import { ROOM_CALL_SESSION_I18N } from '../config/i18n'
import type { RoomCallDeviceMenuProps } from '../config/types'
import { useRoomCallDeviceMenu } from '../model/use-room-call-device-menu.model'

import RoomCallIoDeviceSettings from './RoomCallIoDeviceSettings.vue'

const props = defineProps<RoomCallDeviceMenuProps>()
const {
  isRoomCallDeviceSettingsOpen,
  isVideoFacingModeSwitchVisible,
  isVideoFacingModeSwitchDisabled,
  openRoomCallDeviceSettings,
  switchVideoInputFacingMode
} = useRoomCallDeviceMenu(props)
</script>

<template>
  <div class="room-call-device-menu">
    <NmorphButton
      v-if="isVideoFacingModeSwitchVisible"
      design="plain"
      borderless
      shape="circle"
      :disabled="isVideoFacingModeSwitchDisabled"
      :aria-label="$t(ROOM_CALL_SESSION_I18N.switchVideoInputFacingMode)"
      @click="switchVideoInputFacingMode"
    >
      <template #icon-only>
        <NmorphIcon width="20px" height="20px">
          <NmorphIconRefresh />
        </NmorphIcon>
      </template>
    </NmorphButton>

    <slot />

    <NmorphButton
      design="plain"
      borderless
      shape="circle"
      :disabled="props.disabled"
      :aria-label="$t(ROOM_CALL_SESSION_I18N.roomCallDevices)"
      @click="openRoomCallDeviceSettings"
    >
      <template #icon-only>
        <NmorphIcon width="16px" height="16px">
          <NmorphIconSetting />
        </NmorphIcon>
      </template>
    </NmorphButton>

    <NmorphDialog
      v-model="isRoomCallDeviceSettingsOpen"
      :title="$t(ROOM_CALL_SESSION_I18N.roomCallDevices)"
      width="360px"
      max-width="calc(100vw - 24px)"
      max-height="calc(100vh - 24px)"
    >
      <RoomCallIoDeviceSettings
        v-if="isRoomCallDeviceSettingsOpen"
        :active="isRoomCallDeviceSettingsOpen"
        :disabled="props.disabled"
      />
    </NmorphDialog>
  </div>
</template>

<style lang="scss" scoped>
.room-call-device-menu {
  display: contents;
}
</style>
