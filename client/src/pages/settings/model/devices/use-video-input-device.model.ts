import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { useDevicesList, useUserMedia } from '@vueuse/core'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useI18n, useMediaDevicePermission } from 'src/shared/lib'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'

import {
  resolveSingleSelectValue,
  syncSelectedDeviceId,
  useDevicePermissionStatus,
  useDeviceWarning
} from './use-device-settings.model'

export const useVideoInputDevice = () => {
  const { t } = useI18n()
  const { settings, setByPath } = useSettings()
  const { videoInputPermission, hasVideoInputPermissionWarning } = useMediaDevicePermission()
  const { showDeviceWarning } = useDeviceWarning('Video input device request failed')
  const {
    devices: videoInputAllDevices,
    isSupported: isVideoInputSupported,
    videoInputs: videoInputDevices
  } = useDevicesList({
    constraints: { audio: false, video: true }
  })
  const videoInputUserMedia = useUserMedia({
    autoSwitch: false,
    constraints: { audio: false, video: false }
  })

  const videoInputLoading = ref(false)
  const videoInputCheckLoading = ref(false)
  const videoInputStream = videoInputUserMedia.stream

  const { permissionCalloutType: videoInputPermissionCalloutType, permissionStatus: videoInputPermissionStatus } =
    useDevicePermissionStatus(isVideoInputSupported, videoInputPermission)
  const videoInputOptions = computed(() =>
    videoInputDevices.value.map(({ deviceId, label }, index) => ({
      value: deviceId,
      label: label || t(SETTINGS_PAGE_DEVICES_I18N.deviceLabel)(index + 1)
    }))
  )

  const isVideoInputChecking = computed(() => Boolean(videoInputStream.value))
  const isVideoInputCheckDisabled = computed(
    () =>
      videoInputCheckLoading.value ||
      !isVideoInputSupported.value ||
      (videoInputPermission.value === 'granted' && videoInputDevices.value.length === 0)
  )

  const stopVideoInputCheck = () => {
    videoInputUserMedia.stop()
  }

  const getVideoInputConstraints = (deviceId: string) => {
    if (deviceId && videoInputDevices.value.some((device) => device.deviceId === deviceId)) {
      return { deviceId: { exact: deviceId } }
    }

    return true
  }

  const startVideoInputCheck = async (deviceId = settings.value.ioDevices.videoInputDeviceId) => {
    stopVideoInputCheck()

    try {
      videoInputCheckLoading.value = true
      videoInputUserMedia.constraints.value = {
        audio: false,
        video: getVideoInputConstraints(deviceId)
      }

      const stream = await videoInputUserMedia.start()

      if (stream) {
        await refreshVideoInputDevices(true)
      }
    } catch (error) {
      stopVideoInputCheck()
      showDeviceWarning(error)
    } finally {
      videoInputCheckLoading.value = false
    }
  }

  const setVideoInputChecking = async (value: boolean) => {
    if (!value) {
      stopVideoInputCheck()
      return
    }

    await startVideoInputCheck()
  }

  const syncSelectedVideoInputDevice = async (clearMissing = false) => {
    return syncSelectedDeviceId(
      videoInputDevices.value,
      settings.value.ioDevices.videoInputDeviceId,
      clearMissing ? '' : settings.value.ioDevices.videoInputDeviceId,
      (deviceId) => setByPath('ioDevices.videoInputDeviceId', deviceId)
    )
  }

  const refreshVideoInputDevices = async (clearMissing = false) => {
    try {
      videoInputLoading.value = true
      if (isVideoInputSupported.value) {
        videoInputAllDevices.value = await navigator.mediaDevices.enumerateDevices()
      }

      return await syncSelectedVideoInputDevice(clearMissing)
    } finally {
      videoInputLoading.value = false
    }
  }

  const setSelectedVideoInputDevice = async (value: NmorphSelectModelValueType = '') => {
    const deviceId = resolveSingleSelectValue(value)
    const shouldRestartCheck = isVideoInputChecking.value

    await setByPath('ioDevices.videoInputDeviceId', deviceId)

    if (shouldRestartCheck) {
      await startVideoInputCheck(deviceId)
    }
  }

  onBeforeUnmount(() => {
    stopVideoInputCheck()
  })

  watch(videoInputDevices, () => {
    void syncSelectedVideoInputDevice(videoInputPermission.value === 'granted')
  })

  return {
    settings,
    videoInputOptions,
    videoInputLoading,
    isVideoInputCheckDisabled,
    videoInputPermissionCalloutType,
    videoInputPermissionStatus,
    hasVideoInputPermissionWarning,
    videoInputStream,
    isVideoInputChecking,
    setVideoInputChecking,
    setSelectedVideoInputDevice
  }
}
