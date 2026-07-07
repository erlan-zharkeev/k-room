import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { useDevicesList, useUserMedia } from '@vueuse/core'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import {
  resolveMediaDeviceSelectOptionValue,
  resolveMediaDeviceSelectValue,
  syncSelectedDeviceId,
  syncSelectedDeviceIdOnDeviceChange,
  useMediaDeviceSelectOptions
} from 'src/shared/lib'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'
import type { DevicePermissionStatus } from '../../config/types/devices.types'
import {
  buildInputDeviceConstraints,
  canEnumerateMediaDevices,
  canRequestMediaInput,
  isPermissionDeniedError
} from '../../lib/media-input-device'

import type { UseMediaInputDeviceOptions } from './devices.types'
import { useDevicePermissionStatus } from './use-device-settings.model'

export const useMediaInputDevice = ({
  kind,
  onPermissionDenied,
  onPermissionGranted,
  onStopCheck,
  onStreamStarted,
  permission,
  settingKey,
  showDeviceWarning,
  startCheckLabel,
  stopCheckLabel
}: UseMediaInputDeviceOptions) => {
  const { buildMediaDeviceSelectOptions } = useMediaDeviceSelectOptions()
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
  const inputRequestFailed = ref(false)
  const inputStream = userMedia.stream
  const selectedDeviceId = computed(() => settings.value.ioDevices[settingKey])
  const isInputSupported = computed(() => isSupported.value || canRequestMediaInput())
  const isInputDeviceEnumerationSupported = computed(() => isSupported.value || canEnumerateMediaDevices())
  const inputPermission = computed<DevicePermissionStatus>(() =>
    isInputSupported.value ? permission.value ?? 'prompt' : permission.value
  )
  const { permissionCalloutType, permissionStatus } = useDevicePermissionStatus(isInputSupported, inputPermission)
  const inputOptions = computed(() =>
    buildMediaDeviceSelectOptions({
      devices: inputDevices.value
    })
  )
  const inputSelectValue = computed(() => {
    if (inputOptions.value.length === 0) return ''

    const selectedOptionValue = resolveMediaDeviceSelectOptionValue(selectedDeviceId.value)

    if (inputOptions.value.some((option) => option.value === selectedOptionValue)) return selectedOptionValue

    return inputOptions.value[0]?.value ?? ''
  })
  const isInputChecking = computed(() => Boolean(inputStream.value))
  const shouldRequestInputDeviceAccess = computed(
    () => inputPermission.value !== 'granted' || inputRequestFailed.value || inputDevices.value.length === 0
  )
  const inputCheckLabel = computed(() => {
    if (isInputChecking.value) return stopCheckLabel

    return shouldRequestInputDeviceAccess.value ? SETTINGS_PAGE_DEVICES_I18N.requestDeviceAccess : startCheckLabel
  })
  const inputCheckButtonLabel = computed(() => {
    if (isInputChecking.value) return SETTINGS_PAGE_DEVICES_I18N.stopDeviceCheck

    return shouldRequestInputDeviceAccess.value
      ? SETTINGS_PAGE_DEVICES_I18N.requestDeviceAccess
      : SETTINGS_PAGE_DEVICES_I18N.testDeviceCheck
  })
  const isInputDeviceUnavailable = computed(
    () => permission.value === 'granted' && isInputDeviceEnumerationSupported.value && inputDevices.value.length === 0
  )
  const isInputCheckDisabled = computed(
    () =>
      inputCheckLoading.value || (!isInputChecking.value && (!isInputSupported.value || isInputDeviceUnavailable.value))
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
      if (isInputDeviceEnumerationSupported.value) {
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
        inputRequestFailed.value = false
        onPermissionGranted?.()
        await refreshInputDevices(true)
        onStreamStarted?.(stream)
      }
    } catch (error) {
      inputRequestFailed.value = true
      stopInputCheck()
      if (isPermissionDeniedError(error)) {
        onPermissionDenied?.()
      }
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
    if (isInputCheckDisabled.value) return

    if (!value) {
      stopInputCheck()
      return
    }

    await startInputCheck()
  }

  const setSelectedInputDevice = async (value: NmorphSelectModelValueType = '') => {
    const deviceId = resolveMediaDeviceSelectValue(value)
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
    inputOptions,
    inputSelectValue,
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
