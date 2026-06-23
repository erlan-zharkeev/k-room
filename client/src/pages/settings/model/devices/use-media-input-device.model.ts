import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { useDevicesList, useUserMedia } from '@vueuse/core'
import { computed, onBeforeUnmount, ref, type Ref, watch } from 'vue'

import { useSettings, type IoDevicesSettings } from 'src/entities/setting'
import { useI18n } from 'src/shared/lib'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'
import type { DevicePermissionStatus } from '../../config/types/devices.types'
import {
  resolveSingleSelectValue,
  syncSelectedDeviceId,
  syncSelectedDeviceIdOnDeviceChange
} from '../../lib/device-selection'

import { useDevicePermissionStatus } from './use-device-settings.model'

type MediaInputDeviceKind = 'audio' | 'video'
type MediaInputDeviceSettingKey = Extract<keyof IoDevicesSettings, 'audioInputDeviceId' | 'videoInputDeviceId'>

interface UseMediaInputDeviceOptions {
  kind: MediaInputDeviceKind
  settingKey: MediaInputDeviceSettingKey
  permission: Readonly<Ref<DevicePermissionStatus>>
  startCheckLabel: string
  stopCheckLabel: string
  showDeviceWarning: (error: unknown) => void
  onStopCheck?: () => void
  onStreamStarted?: (stream: MediaStream) => void
}

const buildInputDeviceConstraints = (devices: MediaDeviceInfo[], deviceId: string) => {
  if (deviceId && devices.some((device) => device.deviceId === deviceId)) {
    return { deviceId: { exact: deviceId } }
  }

  return true
}

export const useMediaInputDevice = ({
  kind,
  onStopCheck,
  onStreamStarted,
  permission,
  settingKey,
  showDeviceWarning,
  startCheckLabel,
  stopCheckLabel
}: UseMediaInputDeviceOptions) => {
  const { t } = useI18n()
  const { settings, setByPath } = useSettings()
  const { audioInputs, devices, isSupported, videoInputs } = useDevicesList({
    constraints: {
      audio: kind === 'audio',
      video: kind === 'video'
    }
  })
  const userMedia = useUserMedia({
    autoSwitch: false,
    constraints: { audio: false, video: false }
  })
  const inputDevices = kind === 'audio' ? audioInputs : videoInputs
  const inputLoading = ref(false)
  const inputCheckLoading = ref(false)
  const inputStream = userMedia.stream
  const selectedDeviceId = computed(() => settings.value.ioDevices[settingKey])
  const { permissionCalloutType, permissionStatus } = useDevicePermissionStatus(isSupported, permission)
  const inputOptions = computed(() =>
    inputDevices.value.map(({ deviceId, label }) => ({
      value: deviceId,
      label: label || t(SETTINGS_PAGE_DEVICES_I18N.unknownDevice)
    }))
  )
  const isInputChecking = computed(() => Boolean(inputStream.value))
  const inputCheckLabel = computed(() => (isInputChecking.value ? stopCheckLabel : startCheckLabel))
  const inputCheckButtonLabel = computed(() =>
    isInputChecking.value ? SETTINGS_PAGE_DEVICES_I18N.stopDeviceCheck : SETTINGS_PAGE_DEVICES_I18N.testDeviceCheck
  )
  const isInputCheckDisabled = computed(
    () =>
      inputCheckLoading.value ||
      !isSupported.value ||
      (permission.value === 'granted' && inputDevices.value.length === 0)
  )

  const updateSelectedDeviceId = (deviceId: string) => setByPath(`ioDevices.${settingKey}`, deviceId)

  const stopInputCheck = () => {
    userMedia.stop()
    onStopCheck?.()
  }

  const syncSelectedInputDevice = async (clearMissing = false) => {
    return syncSelectedDeviceId(
      inputDevices.value,
      selectedDeviceId.value,
      clearMissing ? '' : selectedDeviceId.value,
      updateSelectedDeviceId
    )
  }

  const refreshInputDevices = async (clearMissing = false) => {
    try {
      inputLoading.value = true
      if (isSupported.value) {
        devices.value = await navigator.mediaDevices.enumerateDevices()
      }

      return await syncSelectedInputDevice(clearMissing)
    } finally {
      inputLoading.value = false
    }
  }

  const startInputCheck = async (deviceId = selectedDeviceId.value) => {
    stopInputCheck()

    try {
      inputCheckLoading.value = true

      const inputConstraints = buildInputDeviceConstraints(inputDevices.value, deviceId)

      userMedia.constraints.value =
        kind === 'audio' ? { audio: inputConstraints, video: false } : { audio: false, video: inputConstraints }

      const stream = await userMedia.start()

      if (stream) {
        await refreshInputDevices(true)
        onStreamStarted?.(stream)
      }
    } catch (error) {
      stopInputCheck()
      showDeviceWarning(error)
    } finally {
      inputCheckLoading.value = false
    }
  }

  const syncChangedInputDevice = async (
    devices: MediaDeviceInfo[],
    previousDevices: MediaDeviceInfo[],
    clearMissing = false
  ) => {
    const previousDeviceId = selectedDeviceId.value
    const nextDeviceId = await syncSelectedDeviceIdOnDeviceChange(
      devices,
      previousDevices,
      previousDeviceId,
      clearMissing ? '' : previousDeviceId,
      updateSelectedDeviceId
    )

    if (isInputChecking.value && nextDeviceId !== previousDeviceId) {
      await startInputCheck(nextDeviceId)
    }
  }

  const setInputChecking = async (value: boolean) => {
    if (!value) {
      stopInputCheck()
      return
    }

    await startInputCheck()
  }

  const setSelectedInputDevice = async (value: NmorphSelectModelValueType = '') => {
    const deviceId = resolveSingleSelectValue(value)
    const shouldRestartCheck = isInputChecking.value

    await updateSelectedDeviceId(deviceId)

    if (shouldRestartCheck) {
      await startInputCheck(deviceId)
    }
  }

  onBeforeUnmount(stopInputCheck)

  watch(inputDevices, (devices, previousDevices) => {
    void syncChangedInputDevice(devices, previousDevices, permission.value === 'granted')
  })

  return {
    settings,
    inputOptions,
    inputLoading,
    inputCheckLoading,
    isInputCheckDisabled,
    permissionCalloutType,
    permissionStatus,
    inputStream,
    isInputChecking,
    inputCheckLabel,
    inputCheckButtonLabel,
    setInputChecking,
    setSelectedInputDevice
  }
}
