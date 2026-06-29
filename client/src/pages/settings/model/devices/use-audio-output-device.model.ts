import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { useDevicesList } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useAppSound, useSettings } from 'src/entities/setting'
import { useI18n } from 'src/shared/lib'

import { DEFAULT_AUDIO_OUTPUT_SELECT_VALUE } from '../../config/constants/devices.constants'
import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'
import {
  resolveSingleSelectValue,
  syncSelectedDeviceId,
  syncSelectedDeviceIdOnDeviceChange
} from '../../lib/device-selection'

import { useDeviceWarning } from './use-device-settings.model'

export const useAudioOutputDevice = () => {
  const { t } = useI18n()
  const { settings, setByPath } = useSettings()
  const { playAppSound, stopAppSound } = useAppSound()
  const { showDeviceWarning } = useDeviceWarning('Audio output device request failed')
  const { audioOutputs: audioOutputDevices, isSupported: isAudioOutputSupported } = useDevicesList()

  const audioOutputLoading = ref(true)
  const audioOutputTestLoading = ref(false)

  const audioOutputOptions = computed(() =>
    audioOutputDevices.value.map(({ deviceId, label }) => ({
      value: deviceId || DEFAULT_AUDIO_OUTPUT_SELECT_VALUE,
      label: label || t(SETTINGS_PAGE_DEVICES_I18N.unknownDevice)
    }))
  )
  const audioOutputSelectValue = computed(() => {
    const deviceId = settings.value.ioDevices.audioOutputDeviceId

    if (audioOutputOptions.value.length === 0) return ''
    if (audioOutputOptions.value.some((option) => option.value === deviceId)) return deviceId

    return audioOutputOptions.value[0]?.value ?? ''
  })
  const audioOutputPermissionStatus = computed(() =>
    t(SETTINGS_PAGE_DEVICES_I18N.permissionStatus, {
      status: t(
        isAudioOutputSupported.value
          ? SETTINGS_PAGE_DEVICES_I18N.permissionBrowserControlled
          : SETTINGS_PAGE_DEVICES_I18N.permissionUnsupported
      )
    })
  )
  const audioOutputPermissionCalloutType = computed(() => (isAudioOutputSupported.value ? 'info' : 'warning'))

  const stopAudioOutput = () => {
    stopAppSound('incoming-message')
  }

  const setSelectedAudioOutputDevice = async (value: NmorphSelectModelValueType = '') => {
    stopAudioOutput()

    const deviceId = resolveSingleSelectValue(value, DEFAULT_AUDIO_OUTPUT_SELECT_VALUE)

    await setByPath('ioDevices.audioOutputDeviceId', deviceId)
  }

  const syncSelectedAudioOutputDevice = async () => {
    if (audioOutputDevices.value.length === 0) return

    await syncSelectedDeviceId(audioOutputDevices.value, settings.value.ioDevices.audioOutputDeviceId, '', (deviceId) =>
      setByPath('ioDevices.audioOutputDeviceId', deviceId)
    )
  }

  const syncChangedAudioOutputDevice = async (devices: MediaDeviceInfo[], previousDevices: MediaDeviceInfo[]) => {
    if (devices.length === 0) return

    await syncSelectedDeviceIdOnDeviceChange(
      devices,
      previousDevices,
      settings.value.ioDevices.audioOutputDeviceId,
      '',
      (deviceId) => setByPath('ioDevices.audioOutputDeviceId', deviceId)
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

      await playAppSound('incoming-message')
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

  watch(audioOutputDevices, (devices, previousDevices) => {
    void syncChangedAudioOutputDevice(devices, previousDevices)
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
