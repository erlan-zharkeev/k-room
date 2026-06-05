import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { useDevicesList, useTimeoutFn } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useAppSound, useSettings } from 'src/entities/setting'
import { APP_SOUND_KIND, useI18n } from 'src/shared/lib'

import {
  DEFAULT_AUDIO_OUTPUT_SELECT_VALUE,
  SETTINGS_DEVICES_OUTPUT_INDICATOR_TIME_MS
} from '../../config/constants/devices.constants'
import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'

import { resolveSingleSelectValue, syncSelectedDeviceId, useDeviceWarning } from './use-device-settings.model'

export const useAudioOutputDevice = () => {
  const { t } = useI18n()
  const { settings, setByPath } = useSettings()
  const { playAppSound, stopAppSound } = useAppSound()
  const { showDeviceWarning } = useDeviceWarning('Audio output device request failed')
  const { audioOutputs: audioOutputDevices, isSupported: isAudioOutputSupported } = useDevicesList()

  const audioOutputLoading = ref(true)
  const audioOutputTestLoading = ref(false)
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
    stopAppSound(APP_SOUND_KIND.MESSAGE)
  }

  const setSelectedAudioOutputDevice = async (value: NmorphSelectModelValueType = '') => {
    stopAudioOutput()

    const deviceId = resolveSingleSelectValue(value, DEFAULT_AUDIO_OUTPUT_SELECT_VALUE)

    await setByPath('ioDevices.audioOutputDeviceId', deviceId)
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

      await playAppSound(APP_SOUND_KIND.MESSAGE)
      startOutputIndicatorTimer()
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
    audioOutputSelectValue,
    audioOutputLoading,
    audioOutputTestLoading,
    audioOutputPermissionCalloutType,
    audioOutputPermissionStatus,
    setSelectedAudioOutputDevice,
    testAudioOutput
  }
}
