import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { isFunction } from 'lodash'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'

import { useSettings } from 'src/entities/setting'
import { ERROR_TOAST_LIFE_MS, TOAST_I18N } from 'src/shared/config'
import { log, useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib/toast'

import {
  SETTINGS_DEVICES_OUTPUT_INDICATOR_TIME_MS,
  SETTINGS_DEVICES_SOUND_SRC
} from '../../config/constants/devices.constants'
import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'

export const useAudioOutputDevice = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const { settings, shallowUpdate } = useSettings()

  const audioOutputDevices = ref<MediaDeviceInfo[]>([])
  const audioOutputLoading = ref(true)
  const audioOutputTestLoading = ref(false)
  const outputAudio = shallowRef<HTMLAudioElement | null>(null)
  const outputIndicatorTimerId = ref<number>()

  const audioOutputOptions = computed(() =>
    audioOutputDevices.value.map(({ deviceId, label }, index) => ({
      value: deviceId,
      label: label || t(SETTINGS_PAGE_DEVICES_I18N.deviceLabel)(index + 1)
    }))
  )

  const normalizeSelectValue = (value: NmorphSelectModelValueType) => (Array.isArray(value) ? value[0] ?? '' : value)

  const showDeviceWarning = (error: unknown) => {
    log('warn', 'Audio output device request failed', error)
    toast.add({
      type: 'warning',
      title: t(TOAST_I18N.warn),
      content: t(SETTINGS_PAGE_DEVICES_I18N.cantAccessDevice),
      duration: ERROR_TOAST_LIFE_MS
    })
  }

  const getMediaDevices = () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      throw new Error(t(SETTINGS_PAGE_DEVICES_I18N.mediaUnsupported))
    }

    return navigator.mediaDevices
  }

  const clearOutputIndicatorTimer = () => {
    if (outputIndicatorTimerId.value) {
      window.clearTimeout(outputIndicatorTimerId.value)
      outputIndicatorTimerId.value = undefined
    }
  }

  const stopAudioOutput = () => {
    clearOutputIndicatorTimer()

    if (outputAudio.value) {
      outputAudio.value.pause()
      outputAudio.value.currentTime = 0
      outputAudio.value = null
    }
  }

  const setSelectedAudioOutputDevice = (value: NmorphSelectModelValueType = '') => {
    stopAudioOutput()
    shallowUpdate({ selectedAudioOutputDeviceId: normalizeSelectValue(value) })
  }

  const getSelectedDeviceId = (devices: MediaDeviceInfo[], deviceId: string) =>
    devices.some((device) => device.deviceId === deviceId) ? deviceId : devices[0]?.deviceId ?? ''

  const requestAudioOutputDevices = async () => {
    try {
      audioOutputLoading.value = true

      const devices = (await getMediaDevices().enumerateDevices()).filter((device) => device.kind === 'audiooutput')
      const selectedDeviceId = getSelectedDeviceId(devices, settings.value.selectedAudioOutputDeviceId)

      audioOutputDevices.value = devices

      if (selectedDeviceId !== settings.value.selectedAudioOutputDeviceId) {
        await shallowUpdate({ selectedAudioOutputDeviceId: selectedDeviceId })
      }
    } catch (error) {
      audioOutputDevices.value = []
      await shallowUpdate({ selectedAudioOutputDeviceId: '' })
      stopAudioOutput()
      showDeviceWarning(error)
    } finally {
      audioOutputLoading.value = false
    }
  }

  const testAudioOutput = async () => {
    try {
      audioOutputTestLoading.value = true
      stopAudioOutput()

      const audio = new Audio(SETTINGS_DEVICES_SOUND_SRC)
      outputAudio.value = audio

      if (isFunction(audio.setSinkId) && settings.value.selectedAudioOutputDeviceId) {
        await audio.setSinkId(settings.value.selectedAudioOutputDeviceId)
      }

      audio.addEventListener(
        'ended',
        () => {
          if (outputAudio.value === audio) {
            outputAudio.value = null
          }
        },
        { once: true }
      )

      await audio.play()
      outputIndicatorTimerId.value = window.setTimeout(() => {}, SETTINGS_DEVICES_OUTPUT_INDICATOR_TIME_MS)
    } catch (error) {
      stopAudioOutput()
      showDeviceWarning(error)
    } finally {
      audioOutputTestLoading.value = false
    }
  }

  onMounted(() => {
    void requestAudioOutputDevices()
    navigator.mediaDevices?.addEventListener('devicechange', requestAudioOutputDevices)
  })

  onBeforeUnmount(() => {
    navigator.mediaDevices?.removeEventListener('devicechange', requestAudioOutputDevices)
    stopAudioOutput()
  })

  return {
    settings,
    audioOutputOptions,
    audioOutputLoading,
    audioOutputTestLoading,
    setSelectedAudioOutputDevice,
    testAudioOutput
  }
}
