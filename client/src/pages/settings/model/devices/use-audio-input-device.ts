import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { useDevicesList, usePermission, useUserMedia } from '@vueuse/core'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { ERROR_TOAST_LIFE_MS, TOAST_I18N } from 'src/shared/config'
import { log, useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib/toast'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'
import type { DevicePermissionStatus } from '../../config/types/devices.types'
import { getDevicePermissionCalloutType } from '../../lib/get-device-permission-callout-type'

export const useAudioInputDevice = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const { settings, setByPath } = useSettings()
  const audioInputPermission = usePermission('microphone')
  const {
    audioInputs: audioInputDevices,
    devices: audioInputAllDevices,
    isSupported: isAudioInputSupported
  } = useDevicesList({
    constraints: { audio: true, video: false }
  })
  const audioInputUserMedia = useUserMedia({
    autoSwitch: false,
    constraints: { audio: false, video: false }
  })

  const audioInputLoading = ref(false)
  const audioInputCheckLoading = ref(false)
  const audioVolumeDb = ref(Number.NEGATIVE_INFINITY)
  const audioFrameId = ref(0)
  const audioContext = shallowRef<AudioContext | null>(null)
  const audioInputStream = audioInputUserMedia.stream

  const audioInputOptions = computed(() =>
    audioInputDevices.value.map(({ deviceId, label }, index) => ({
      value: deviceId,
      label: label || t(SETTINGS_PAGE_DEVICES_I18N.deviceLabel)(index + 1)
    }))
  )

  const getPermissionStatusText = (status: DevicePermissionStatus) => {
    if (!isAudioInputSupported.value) return t(SETTINGS_PAGE_DEVICES_I18N.permissionUnsupported)
    if (status === 'granted') return t(SETTINGS_PAGE_DEVICES_I18N.permissionGranted)
    if (status === 'denied') return t(SETTINGS_PAGE_DEVICES_I18N.permissionDenied)
    if (status === 'prompt') return t(SETTINGS_PAGE_DEVICES_I18N.permissionPrompt)

    return t(SETTINGS_PAGE_DEVICES_I18N.permissionUnknown)
  }
  const isAudioInputChecking = computed(() => Boolean(audioInputStream.value))
  const isAudioInputCheckDisabled = computed(
    () =>
      audioInputCheckLoading.value ||
      !isAudioInputSupported.value ||
      (audioInputPermission.value === 'granted' && audioInputDevices.value.length === 0)
  )
  const audioInputPermissionCalloutType = computed(() =>
    isAudioInputSupported.value ? getDevicePermissionCalloutType(audioInputPermission.value) : 'warning'
  )
  const audioInputPermissionStatus = computed(() =>
    t(SETTINGS_PAGE_DEVICES_I18N.permissionStatus)(getPermissionStatusText(audioInputPermission.value))
  )

  const normalizeSelectValue = (value: NmorphSelectModelValueType) => (Array.isArray(value) ? value[0] ?? '' : value)

  const showDeviceWarning = (error: unknown) => {
    log('warn', 'Audio input device request failed', error)
    toast.add({
      type: 'warning',
      title: t(TOAST_I18N.warn),
      content: t(SETTINGS_PAGE_DEVICES_I18N.cantAccessDevice),
      duration: ERROR_TOAST_LIFE_MS
    })
  }

  const stopAudioVolume = () => {
    if (audioFrameId.value) {
      window.cancelAnimationFrame(audioFrameId.value)
      audioFrameId.value = 0
    }

    audioVolumeDb.value = Number.NEGATIVE_INFINITY

    if (audioContext.value) {
      audioContext.value.close().catch((error) => log('warn', 'Failed to close audio context', error))
      audioContext.value = null
    }
  }

  const updateAudioVolume = (analyser: AnalyserNode, data: Float32Array<ArrayBuffer>) => {
    analyser.getFloatTimeDomainData(data)

    const squareSum = data.reduce((result, item) => {
      return result + item * item
    }, 0)
    const rms = Math.sqrt(squareSum / data.length)
    const db = 20 * Math.log10(Math.max(rms, Number.EPSILON))
    audioVolumeDb.value = db

    audioFrameId.value = window.requestAnimationFrame(() => updateAudioVolume(analyser, data))
  }

  const startAudioVolume = (stream: MediaStream) => {
    stopAudioVolume()

    const context = new AudioContext()
    const source = context.createMediaStreamSource(stream)
    const analyser = context.createAnalyser()

    analyser.fftSize = 512
    analyser.smoothingTimeConstant = 0
    const data: Float32Array<ArrayBuffer> = new Float32Array(analyser.fftSize)

    source.connect(analyser)
    audioContext.value = context
    updateAudioVolume(analyser, data)
  }

  const stopAudioInputCheck = () => {
    audioInputUserMedia.stop()
    stopAudioVolume()
  }

  const getAudioInputConstraints = (deviceId: string) => {
    if (deviceId && audioInputDevices.value.some((device) => device.deviceId === deviceId)) {
      return { deviceId: { exact: deviceId } }
    }

    return true
  }

  const startAudioInputCheck = async (deviceId = settings.value.ioDevices.audioInputDeviceId) => {
    stopAudioInputCheck()

    try {
      audioInputCheckLoading.value = true
      audioInputUserMedia.constraints.value = {
        audio: getAudioInputConstraints(deviceId),
        video: false
      }

      const stream = await audioInputUserMedia.start()

      if (stream) {
        await refreshAudioInputDevices(true)
        startAudioVolume(stream)
      }
    } catch (error) {
      stopAudioInputCheck()
      showDeviceWarning(error)
    } finally {
      audioInputCheckLoading.value = false
    }
  }

  const setAudioInputChecking = async (value: boolean) => {
    if (!value) {
      stopAudioInputCheck()
      return
    }

    await startAudioInputCheck()
  }

  const getSelectedDeviceId = (devices: MediaDeviceInfo[], deviceId: string, emptyDeviceId = '') => {
    if (devices.length === 0) return emptyDeviceId

    return devices.some((device) => device.deviceId === deviceId) ? deviceId : devices[0]?.deviceId ?? ''
  }

  const syncSelectedAudioInputDevice = async (clearMissing = false) => {
    const deviceId = getSelectedDeviceId(
      audioInputDevices.value,
      settings.value.ioDevices.audioInputDeviceId,
      clearMissing ? '' : settings.value.ioDevices.audioInputDeviceId
    )

    if (deviceId !== settings.value.ioDevices.audioInputDeviceId) {
      await setByPath('ioDevices.audioInputDeviceId', deviceId)
    }

    return deviceId
  }

  const refreshAudioInputDevices = async (clearMissing = false) => {
    try {
      audioInputLoading.value = true
      if (isAudioInputSupported.value) {
        audioInputAllDevices.value = await navigator.mediaDevices.enumerateDevices()
      }

      return await syncSelectedAudioInputDevice(clearMissing)
    } finally {
      audioInputLoading.value = false
    }
  }

  const setSelectedAudioInputDevice = async (value: NmorphSelectModelValueType = '') => {
    const deviceId = normalizeSelectValue(value)
    const shouldRestartCheck = isAudioInputChecking.value

    await setByPath('ioDevices.audioInputDeviceId', deviceId)

    if (shouldRestartCheck) {
      await startAudioInputCheck(deviceId)
    }
  }

  onBeforeUnmount(() => {
    stopAudioInputCheck()
  })

  watch(audioInputDevices, () => {
    void syncSelectedAudioInputDevice(audioInputPermission.value === 'granted')
  })

  return {
    settings,
    audioInputOptions,
    audioInputLoading,
    isAudioInputCheckDisabled,
    audioInputPermissionCalloutType,
    audioInputPermissionStatus,
    audioVolumeDb,
    isAudioInputChecking,
    setAudioInputChecking,
    setSelectedAudioInputDevice
  }
}
