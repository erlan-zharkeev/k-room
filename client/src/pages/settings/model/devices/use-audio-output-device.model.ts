import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { useDevicesList } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useAppSound, useSettings } from 'src/entities/setting'
import { useI18n } from 'src/shared/lib'

import { DEFAULT_AUDIO_OUTPUT_SELECT_VALUE } from '../../config/constants/devices.constants'
import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'
import { canPlayAudioOutput, canSelectAudioOutputDevice } from '../../lib/audio-output-device'
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
  const isAudioOutputPlaybackSupported = computed(canPlayAudioOutput)
  const isAudioOutputSelectionSupported = computed(() => isAudioOutputSupported.value && canSelectAudioOutputDevice())

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
  const hasAudioOutputOptions = computed(() => audioOutputOptions.value.length > 0)
  const isAudioOutputSelectDisabled = computed(
    () => audioOutputLoading.value || !isAudioOutputSelectionSupported.value || !hasAudioOutputOptions.value
  )
  const isAudioOutputTestDisabled = computed(
    () => audioOutputTestLoading.value || !isAudioOutputPlaybackSupported.value
  )
  const audioOutputPermissionStatus = computed(() =>
    t(SETTINGS_PAGE_DEVICES_I18N.permissionStatus, {
      status: t(
        isAudioOutputPlaybackSupported.value
          ? SETTINGS_PAGE_DEVICES_I18N.permissionBrowserControlled
          : SETTINGS_PAGE_DEVICES_I18N.permissionUnsupported
      )
    })
  )
  const audioOutputPermissionCalloutType = computed(() => (isAudioOutputPlaybackSupported.value ? 'info' : 'warning'))

  const stopAudioOutput = () => {
    stopAppSound('incoming-message')
  }

  const setSelectedAudioOutputDevice = async (value: NmorphSelectModelValueType = '') => {
    if (!isAudioOutputSelectionSupported.value) return

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
      if (isAudioOutputSelectionSupported.value) {
        await syncSelectedAudioOutputDevice()
      }
    } catch (error) {
      await setByPath('ioDevices.audioOutputDeviceId', '')
      stopAudioOutput()
      showDeviceWarning(error)
    } finally {
      audioOutputLoading.value = false
    }
  }

  const testAudioOutput = async () => {
    if (isAudioOutputTestDisabled.value) return

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
    if (!isAudioOutputSelectionSupported.value) return

    void syncChangedAudioOutputDevice(devices, previousDevices)
  })

  return {
    settings,
    audioOutputOptions,
    audioOutputSelectValue,
    audioOutputLoading,
    audioOutputTestLoading,
    isAudioOutputSelectDisabled,
    isAudioOutputTestDisabled,
    audioOutputPermissionCalloutType,
    audioOutputPermissionStatus,
    setSelectedAudioOutputDevice,
    testAudioOutput
  }
}
