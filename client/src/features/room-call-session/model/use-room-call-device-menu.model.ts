import { useDevicesList } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

import type { RoomCallDeviceMenuProps } from '../config/types'
import { hasSwitchableRoomCallVideoInputDevice } from '../lib/room-call-media'

import { useActiveRoomCallSession } from './use-active-room-call-session.model'

export const useRoomCallDeviceMenu = (props: RoomCallDeviceMenuProps) => {
  const { localMediaState, switchActiveRoomCallVideoFacingMode } = useActiveRoomCallSession()
  const { devices, videoInputs } = useDevicesList({
    constraints: {
      video: true
    }
  })
  const isRoomCallDeviceSettingsOpen = ref(false)
  const isVideoFacingModeSwitchVisible = computed(
    () => localMediaState.value.video && hasSwitchableRoomCallVideoInputDevice(videoInputs.value)
  )
  const isVideoFacingModeSwitchDisabled = computed(() => Boolean(props.disabled) || !localMediaState.value.video)

  const refreshVideoInputDevices = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return
    }

    try {
      devices.value = await navigator.mediaDevices.enumerateDevices()
    } catch {
      devices.value = []
    }
  }

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
  watch(
    () => localMediaState.value.video,
    (isVideoEnabled) => {
      if (isVideoEnabled) {
        void refreshVideoInputDevices()
      }
    },
    { immediate: true }
  )

  return {
    isRoomCallDeviceSettingsOpen,
    isVideoFacingModeSwitchVisible,
    isVideoFacingModeSwitchDisabled,
    openRoomCallDeviceSettings,
    switchVideoInputFacingMode
  }
}
