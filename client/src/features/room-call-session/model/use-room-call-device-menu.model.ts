import { computed, ref, watch } from 'vue'

import type { RoomCallDeviceMenuProps } from '../config/types'

import { useActiveRoomCallSession } from './use-active-room-call-session.model'

export const useRoomCallDeviceMenu = (props: RoomCallDeviceMenuProps) => {
  const { localMediaState, switchActiveRoomCallVideoFacingMode } = useActiveRoomCallSession()
  const isRoomCallDeviceSettingsOpen = ref(false)
  const isVideoFacingModeSwitchDisabled = computed(() => Boolean(props.disabled) || !localMediaState.value.video)

  const openRoomCallDeviceSettings = () => {
    if (props.disabled) return

    isRoomCallDeviceSettingsOpen.value = true
  }

  const switchVideoInputFacingMode = async () => {
    if (isVideoFacingModeSwitchDisabled.value) return

    await switchActiveRoomCallVideoFacingMode()
  }

  watch(
    () => props.disabled,
    (isDisabled) => {
      if (isDisabled) {
        isRoomCallDeviceSettingsOpen.value = false
      }
    }
  )

  return {
    isRoomCallDeviceSettingsOpen,
    isVideoFacingModeSwitchDisabled,
    openRoomCallDeviceSettings,
    switchVideoInputFacingMode
  }
}
