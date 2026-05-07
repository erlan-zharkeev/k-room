import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'

import { useSettings } from 'src/entities/setting'
import { ERROR_TOAST_LIFE_MS, TOAST_I18N } from 'src/shared/config'
import { log, useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib/toast'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'

const stopStream = (stream: MediaStream | null) => {
  stream?.getTracks().forEach((track) => track.stop())
}

export const useVideoInputDevice = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const { settings, shallowUpdate } = useSettings()

  const videoInputDevices = ref<MediaDeviceInfo[]>([])
  const videoInputLoading = ref(true)
  const videoInputCheckLoading = ref(false)
  const videoInputStream = shallowRef<MediaStream | null>(null)
  const videoElement = shallowRef<HTMLVideoElement | null>(null)

  const videoInputOptions = computed(() =>
    videoInputDevices.value.map(({ deviceId, label }, index) => ({
      value: deviceId,
      label: label || t(SETTINGS_PAGE_DEVICES_I18N.deviceLabel)(index + 1)
    }))
  )
  const isVideoInputChecking = computed(() => Boolean(videoInputStream.value))

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

  const getMediaDevices = () => {
    if (!navigator.mediaDevices?.enumerateDevices || !navigator.mediaDevices?.getUserMedia) {
      throw new Error(t(SETTINGS_PAGE_DEVICES_I18N.mediaUnsupported))
    }

    return navigator.mediaDevices
  }

  const requestVideoInputPermission = async () => {
    try {
      if (!navigator.permissions?.query) return

      const permission = await navigator.permissions.query({ name: 'camera' } as PermissionDescriptor)

      if (permission.state === 'denied') {
        throw new Error('Permission denied')
      }

      if (permission.state !== 'prompt') return
    } catch (error) {
      if (error instanceof Error && error.message === 'Permission denied') {
        throw error
      }
    }

    const stream = await getMediaDevices().getUserMedia({ video: true })
    stopStream(stream)
  }

  const stopVideoInputCheck = () => {
    stopStream(videoInputStream.value)
    videoInputStream.value = null

    if (videoElement.value) {
      videoElement.value.srcObject = null
    }
  }

  const startVideoInputCheck = async (deviceId = settings.value.selectedVideoInputDeviceId) => {
    stopVideoInputCheck()

    if (videoInputDevices.value.length === 0) return

    try {
      videoInputCheckLoading.value = true

      const stream = await getMediaDevices().getUserMedia({
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined
        }
      })

      videoInputStream.value = stream

      if (videoElement.value) {
        videoElement.value.srcObject = stream
      }
    } catch (error) {
      stopVideoInputCheck()
      showDeviceWarning(error)
    } finally {
      videoInputCheckLoading.value = false
    }
  }

  const toggleVideoInputCheck = async () => {
    if (isVideoInputChecking.value) {
      stopVideoInputCheck()
      return
    }

    await startVideoInputCheck()
  }

  const getSelectedDeviceId = (devices: MediaDeviceInfo[], deviceId: string) =>
    devices.some((device) => device.deviceId === deviceId) ? deviceId : devices[0]?.deviceId ?? ''

  const requestVideoInputDevices = async () => {
    const shouldRestartCheck = isVideoInputChecking.value

    try {
      videoInputLoading.value = true
      await requestVideoInputPermission()

      const devices = (await getMediaDevices().enumerateDevices()).filter((device) => device.kind === 'videoinput')
      const selectedDeviceId = getSelectedDeviceId(devices, settings.value.selectedVideoInputDeviceId)

      videoInputDevices.value = devices

      if (selectedDeviceId !== settings.value.selectedVideoInputDeviceId) {
        await shallowUpdate({ selectedVideoInputDeviceId: selectedDeviceId })
      }

      if (shouldRestartCheck) {
        await startVideoInputCheck(selectedDeviceId)
      }
    } catch (error) {
      videoInputDevices.value = []
      await shallowUpdate({ selectedVideoInputDeviceId: '' })
      stopVideoInputCheck()
      showDeviceWarning(error)
    } finally {
      videoInputLoading.value = false
    }
  }

  const setSelectedVideoInputDevice = async (value: NmorphSelectModelValueType = '') => {
    const deviceId = normalizeSelectValue(value)
    const shouldRestartCheck = isVideoInputChecking.value

    await shallowUpdate({ selectedVideoInputDeviceId: deviceId })

    if (shouldRestartCheck) {
      await startVideoInputCheck(deviceId)
    }
  }

  onMounted(() => {
    void requestVideoInputDevices()
    navigator.mediaDevices?.addEventListener('devicechange', requestVideoInputDevices)
  })

  onBeforeUnmount(() => {
    navigator.mediaDevices?.removeEventListener('devicechange', requestVideoInputDevices)
    stopVideoInputCheck()
  })

  return {
    settings,
    videoInputOptions,
    videoInputLoading,
    videoInputCheckLoading,
    videoElement,
    isVideoInputChecking,
    toggleVideoInputCheck,
    setSelectedVideoInputDevice
  }
}
