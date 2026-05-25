import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { useDevicesList, useEventListener, useTimeoutFn } from '@vueuse/core'
import { isFunction } from 'global-shared'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useI18n } from 'src/shared/lib'

import {
  DEFAULT_AUDIO_OUTPUT_SELECT_VALUE,
  SETTINGS_DEVICES_OUTPUT_INDICATOR_TIME_MS,
  SETTINGS_DEVICES_SOUND_SRC
} from '../../config/constants/devices.constants'
import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'

import { normalizeDeviceSelectValue, syncSelectedDeviceId, useDeviceWarning } from './use-device-settings.model'

export const useAudioOutputDevice = () => {
  const { t } = useI18n()
  const { settings, setByPath } = useSettings()
  const { showDeviceWarning } = useDeviceWarning('Audio output device request failed')
  const { audioOutputs: audioOutputDevices, isSupported: isAudioOutputSupported } = useDevicesList()

  const audioOutputLoading = ref(true)
  const audioOutputTestLoading = ref(false)
  const outputAudio = shallowRef<HTMLAudioElement | null>(null)
  const { start: startOutputIndicatorTimer, stop: stopOutputIndicatorTimer } = useTimeoutFn(
    () => {},
    SETTINGS_DEVICES_OUTPUT_INDICATOR_TIME_MS,
    { immediate: false }
  )

  const audioOutputOptions = computed(() =>
    audioOutputDevices.value.map(({ deviceId, label }, index) => ({
      value: deviceId || DEFAULT_AUDIO_OUTPUT_SELECT_VALUE,
      label: label || t(SETTINGS_PAGE_DEVICES_I18N.deviceLabel)(index + 1)
    }))
  )
  const audioOutputSelectValue = computed(() =>
    settings.value.ioDevices.audioOutputDeviceId || audioOutputOptions.value.length > 0
      ? settings.value.ioDevices.audioOutputDeviceId || DEFAULT_AUDIO_OUTPUT_SELECT_VALUE
      : ''
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

  const stopAudioOutput = () => {
    stopOutputIndicatorTimer()

    if (outputAudio.value) {
      outputAudio.value.pause()
      outputAudio.value.currentTime = 0
      outputAudio.value = null
    }
  }

  const setSelectedAudioOutputDevice = async (value: NmorphSelectModelValueType = '') => {
    stopAudioOutput()
    await setByPath(
      'ioDevices.audioOutputDeviceId',
      normalizeDeviceSelectValue(value, DEFAULT_AUDIO_OUTPUT_SELECT_VALUE)
    )
  }

  const syncSelectedAudioOutputDevice = async () => {
    await syncSelectedDeviceId(audioOutputDevices.value, settings.value.ioDevices.audioOutputDeviceId, '', (deviceId) =>
      setByPath('ioDevices.audioOutputDeviceId', deviceId)
    )
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

      await audio.play()
      startOutputIndicatorTimer()
    } catch (error) {
      stopAudioOutput()
      showDeviceWarning(error)
    } finally {
      audioOutputTestLoading.value = false
    }
  }

  useEventListener(
    outputAudio,
    'ended',
    () => {
      outputAudio.value = null
    },
    { once: true }
  )

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
    audioOutputSelectValue,
    audioOutputLoading,
    audioOutputTestLoading,
    audioOutputPermissionCalloutType,
    audioOutputPermissionStatus,
    setSelectedAudioOutputDevice,
    testAudioOutput
  }
}
