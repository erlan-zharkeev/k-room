import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { useDevicesList, usePermission, useUserMedia } from '@vueuse/core'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { ERROR_TOAST_LIFE_MS, TOAST_I18N } from 'src/shared/config'
import { log, useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'
import type { DevicePermissionStatusType } from '../../config/types/devices.types'
import { getDevicePermissionCalloutType } from '../../lib/get-device-permission-callout-type'

export const useVideoInputDevice = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const { settings, setByPath } = useSettings()
  const videoInputPermission = usePermission('camera')
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
  const videoElement = shallowRef<HTMLVideoElement | null>(null)

  const videoInputOptions = computed(() =>
    videoInputDevices.value.map(({ deviceId, label }, index) => ({
      value: deviceId,
      label: label || t(SETTINGS_PAGE_DEVICES_I18N.deviceLabel)(index + 1)
    }))
  )

  const getPermissionStatusText = (status: DevicePermissionStatusType) => {
    if (!isVideoInputSupported.value) return t(SETTINGS_PAGE_DEVICES_I18N.permissionUnsupported)
    if (status === 'granted') return t(SETTINGS_PAGE_DEVICES_I18N.permissionGranted)
    if (status === 'denied') return t(SETTINGS_PAGE_DEVICES_I18N.permissionDenied)
    if (status === 'prompt') return t(SETTINGS_PAGE_DEVICES_I18N.permissionPrompt)

    return t(SETTINGS_PAGE_DEVICES_I18N.permissionUnknown)
  }
  const isVideoInputChecking = computed(() => Boolean(videoInputStream.value))
  const isVideoInputCheckDisabled = computed(
    () =>
      videoInputCheckLoading.value ||
      !isVideoInputSupported.value ||
      (videoInputPermission.value === 'granted' && videoInputDevices.value.length === 0)
  )
  const videoInputPermissionCalloutType = computed(() =>
    isVideoInputSupported.value ? getDevicePermissionCalloutType(videoInputPermission.value) : 'warning'
  )
  const videoInputPermissionStatus = computed(() =>
    t(SETTINGS_PAGE_DEVICES_I18N.permissionStatus)(getPermissionStatusText(videoInputPermission.value))
  )

  const normalizeSelectValue = (value: NmorphSelectModelValueType) => (Array.isArray(value) ? value[0] ?? '' : value)

  const showDeviceWarning = (error: unknown) => {
    log('warn', 'Video input device request failed', error)
    toast.add({
      type: 'warning',
      title: t(TOAST_I18N.warn),
      content: t(SETTINGS_PAGE_DEVICES_I18N.cantAccessDevice),
      duration: ERROR_TOAST_LIFE_MS
    })
  }

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

  const getSelectedDeviceId = (devices: MediaDeviceInfo[], deviceId: string, emptyDeviceId = '') => {
    if (devices.length === 0) return emptyDeviceId

    return devices.some((device) => device.deviceId === deviceId) ? deviceId : devices[0]?.deviceId ?? ''
  }

  const syncSelectedVideoInputDevice = async (clearMissing = false) => {
    const deviceId = getSelectedDeviceId(
      videoInputDevices.value,
      settings.value.ioDevices.videoInputDeviceId,
      clearMissing ? '' : settings.value.ioDevices.videoInputDeviceId
    )

    if (deviceId !== settings.value.ioDevices.videoInputDeviceId) {
      await setByPath('ioDevices.videoInputDeviceId', deviceId)
    }

    return deviceId
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
    const deviceId = normalizeSelectValue(value)
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

  watch([videoInputStream, videoElement], () => {
    if (videoElement.value) {
      videoElement.value.srcObject = videoInputStream.value ?? null
    }
  })

  return {
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
  }
}
