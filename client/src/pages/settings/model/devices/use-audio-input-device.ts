import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'

import { useSettings } from 'src/entities/setting'
import { ERROR_TOAST_LIFE_MS, TOAST_I18N } from 'src/shared/config'
import { log, useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib/toast'

import { SETTINGS_DEVICES_AUDIO_VOLUME_SCALE } from '../../config/constants/devices.constants'
import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'

const stopStream = (stream: MediaStream | null) => {
  stream?.getTracks().forEach((track) => track.stop())
}

export const useAudioInputDevice = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const { settings, shallowUpdate } = useSettings()

  const audioInputDevices = ref<MediaDeviceInfo[]>([])
  const audioInputLoading = ref(true)
  const audioInputCheckLoading = ref(false)
  const audioVolume = ref(0)
  const audioFrameId = ref(0)
  const audioInputStream = shallowRef<MediaStream | null>(null)
  const audioContext = shallowRef<AudioContext | null>(null)

  const audioInputOptions = computed(() =>
    audioInputDevices.value.map(({ deviceId, label }, index) => ({
      value: deviceId,
      label: label || t(SETTINGS_PAGE_DEVICES_I18N.deviceLabel)(index + 1)
    }))
  )
  const isAudioInputChecking = computed(() => Boolean(audioInputStream.value))

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

  const getMediaDevices = () => {
    if (!navigator.mediaDevices?.enumerateDevices || !navigator.mediaDevices?.getUserMedia) {
      throw new Error(t(SETTINGS_PAGE_DEVICES_I18N.mediaUnsupported))
    }

    return navigator.mediaDevices
  }

  const requestAudioInputPermission = async () => {
    try {
      if (!navigator.permissions?.query) return

      const permission = await navigator.permissions.query({ name: 'microphone' } as PermissionDescriptor)

      if (permission.state === 'denied') {
        throw new Error('Permission denied')
      }

      if (permission.state !== 'prompt') return
    } catch (error) {
      if (error instanceof Error && error.message === 'Permission denied') {
        throw error
      }
    }

    const stream = await getMediaDevices().getUserMedia({ audio: true })
    stopStream(stream)
  }

  const stopAudioVolume = () => {
    if (audioFrameId.value) {
      window.cancelAnimationFrame(audioFrameId.value)
      audioFrameId.value = 0
    }

    audioVolume.value = 0

    if (audioContext.value) {
      audioContext.value.close().catch((error) => log('warn', 'Failed to close audio context', error))
      audioContext.value = null
    }
  }

  const updateAudioVolume = (analyser: AnalyserNode, data: Uint8Array<ArrayBuffer>) => {
    analyser.getByteFrequencyData(data)

    const sum = data.reduce((total, item) => total + item, 0)
    const nextVolume = (sum / data.length) * SETTINGS_DEVICES_AUDIO_VOLUME_SCALE

    audioVolume.value = Math.min(nextVolume, 100)
    audioFrameId.value = window.requestAnimationFrame(() => updateAudioVolume(analyser, data))
  }

  const startAudioVolume = (stream: MediaStream) => {
    stopAudioVolume()

    const context = new AudioContext()
    const source = context.createMediaStreamSource(stream)
    const analyser = context.createAnalyser()
    const data: Uint8Array<ArrayBuffer> = new Uint8Array(analyser.frequencyBinCount)

    analyser.fftSize = 256
    source.connect(analyser)
    audioContext.value = context
    updateAudioVolume(analyser, data)
  }

  const stopAudioInputCheck = () => {
    stopStream(audioInputStream.value)
    audioInputStream.value = null
    stopAudioVolume()
  }

  const startAudioInputCheck = async (deviceId = settings.value.selectedAudioInputDeviceId) => {
    stopAudioInputCheck()

    if (audioInputDevices.value.length === 0) return

    try {
      audioInputCheckLoading.value = true

      const stream = await getMediaDevices().getUserMedia({
        audio: {
          deviceId: deviceId ? { exact: deviceId } : undefined
        }
      })

      audioInputStream.value = stream
      startAudioVolume(stream)
    } catch (error) {
      stopAudioInputCheck()
      showDeviceWarning(error)
    } finally {
      audioInputCheckLoading.value = false
    }
  }

  const toggleAudioInputCheck = async () => {
    if (isAudioInputChecking.value) {
      stopAudioInputCheck()
      return
    }

    await startAudioInputCheck()
  }

  const getSelectedDeviceId = (devices: MediaDeviceInfo[], deviceId: string) =>
    devices.some((device) => device.deviceId === deviceId) ? deviceId : devices[0]?.deviceId ?? ''

  const requestAudioInputDevices = async () => {
    const shouldRestartCheck = isAudioInputChecking.value

    try {
      audioInputLoading.value = true
      await requestAudioInputPermission()

      const devices = (await getMediaDevices().enumerateDevices()).filter((device) => device.kind === 'audioinput')
      const selectedDeviceId = getSelectedDeviceId(devices, settings.value.selectedAudioInputDeviceId)

      audioInputDevices.value = devices

      if (selectedDeviceId !== settings.value.selectedAudioInputDeviceId) {
        await shallowUpdate({ selectedAudioInputDeviceId: selectedDeviceId })
      }

      if (shouldRestartCheck) {
        await startAudioInputCheck(selectedDeviceId)
      }
    } catch (error) {
      audioInputDevices.value = []
      await shallowUpdate({ selectedAudioInputDeviceId: '' })
      stopAudioInputCheck()
      showDeviceWarning(error)
    } finally {
      audioInputLoading.value = false
    }
  }

  const setSelectedAudioInputDevice = async (value: NmorphSelectModelValueType = '') => {
    const deviceId = normalizeSelectValue(value)
    const shouldRestartCheck = isAudioInputChecking.value

    await shallowUpdate({ selectedAudioInputDeviceId: deviceId })

    if (shouldRestartCheck) {
      await startAudioInputCheck(deviceId)
    }
  }

  onMounted(() => {
    void requestAudioInputDevices()
    navigator.mediaDevices?.addEventListener('devicechange', requestAudioInputDevices)
  })

  onBeforeUnmount(() => {
    navigator.mediaDevices?.removeEventListener('devicechange', requestAudioInputDevices)
    stopAudioInputCheck()
  })

  return {
    settings,
    audioInputOptions,
    audioInputLoading,
    audioInputCheckLoading,
    audioVolume,
    isAudioInputChecking,
    toggleAudioInputCheck,
    setSelectedAudioInputDevice
  }
}
