import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { useDevicesList } from '@vueuse/core'
import { isFunction } from 'lodash'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { TOAST_I18N } from 'src/shared/config'
import { log, useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib'

import {
  SETTINGS_DEVICES_OUTPUT_INDICATOR_TIME_MS,
  SETTINGS_DEVICES_SOUND_SRC
} from '../../config/constants/devices.constants'
import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'

export const useAudioOutputDevice = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const { settings, setByPath } = useSettings()
  const { audioOutputs: audioOutputDevices, isSupported: isAudioOutputSupported } = useDevicesList()

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
  const audioOutputPermissionStatus = computed(() =>
    t(SETTINGS_PAGE_DEVICES_I18N.permissionStatus)(
      t(
        isAudioOutputSupported.value
          ? SETTINGS_PAGE_DEVICES_I18N.permissionBrowserControlled
          : SETTINGS_PAGE_DEVICES_I18N.permissionUnsupported
      )
    )
  )
  const audioOutputPermissionCalloutType = computed(() => (isAudioOutputSupported.value ? 'info' : 'warning'))

  const normalizeSelectValue = (value: NmorphSelectModelValueType) => (Array.isArray(value) ? value[0] ?? '' : value)

  const showDeviceWarning = (error: unknown) => {
    log('warn', 'Audio output device request failed', error)
    toast.add({
      type: 'warning',
      title: t(TOAST_I18N.warn),
      content: t(SETTINGS_PAGE_DEVICES_I18N.cantAccessDevice)
    })
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

  const setSelectedAudioOutputDevice = async (value: NmorphSelectModelValueType = '') => {
    stopAudioOutput()
    await setByPath('ioDevices.audioOutputDeviceId', normalizeSelectValue(value))
  }

  const getSelectedDeviceId = (devices: MediaDeviceInfo[], deviceId: string) =>
    devices.some((device) => device.deviceId === deviceId) ? deviceId : devices[0]?.deviceId ?? ''

  const syncSelectedAudioOutputDevice = async () => {
    const deviceId = getSelectedDeviceId(audioOutputDevices.value, settings.value.ioDevices.audioOutputDeviceId)

    if (deviceId !== settings.value.ioDevices.audioOutputDeviceId) {
      await setByPath('ioDevices.audioOutputDeviceId', deviceId)
    }
  }

  const requestAudioOutputDevices = async () => {
    try {
      audioOutputLoading.value = true
      await syncSelectedAudioOutputDevice()
    } catch (error) {
      await setByPath('ioDevices.audioOutputDeviceId', '')
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

      if (isFunction(audio.setSinkId) && settings.value.ioDevices.audioOutputDeviceId) {
        await audio.setSinkId(settings.value.ioDevices.audioOutputDeviceId)
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
  })

  onBeforeUnmount(() => {
    stopAudioOutput()
  })

  watch(audioOutputDevices, () => {
    void syncSelectedAudioOutputDevice()
  })

  return {
    settings,
    audioOutputOptions,
    audioOutputLoading,
    audioOutputTestLoading,
    audioOutputPermissionCalloutType,
    audioOutputPermissionStatus,
    setSelectedAudioOutputDevice,
    testAudioOutput
  }
}
