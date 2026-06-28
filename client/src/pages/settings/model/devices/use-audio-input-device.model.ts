import { ref, shallowRef } from 'vue'

import { calculateAudioVolumeDb, createAudioMeterAnalyser, log, useMediaDevicePermission } from 'src/shared/lib'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'

import { useDeviceWarning } from './use-device-settings.model'
import { useMediaInputDevice } from './use-media-input-device.model'

export const useAudioInputDevice = () => {
  const {
    audioInputPermission,
    hasAudioInputPermissionWarning,
    markAudioInputPermissionDenied,
    markAudioInputPermissionGranted
  } = useMediaDevicePermission()
  const { showDeviceWarning } = useDeviceWarning('Audio input device request failed')
  const audioVolumeDb = ref(Number.NEGATIVE_INFINITY)
  const audioFrameId = ref(0)
  const audioContext = shallowRef<AudioContext | null>(null)

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
    audioVolumeDb.value = calculateAudioVolumeDb(data)

    audioFrameId.value = window.requestAnimationFrame(() => updateAudioVolume(analyser, data))
  }

  const startAudioVolume = (stream: MediaStream) => {
    stopAudioVolume()

    const { analyser, context, data } = createAudioMeterAnalyser(stream)

    audioContext.value = context
    updateAudioVolume(analyser, data)
  }

  const {
    inputCheckButtonLabel: audioInputCheckButtonLabel,
    inputCheckLabel: audioInputCheckLabel,
    inputCheckLoading: audioInputCheckLoading,
    inputLoading: audioInputLoading,
    inputOptions: audioInputOptions,
    isInputCheckDisabled: isAudioInputCheckDisabled,
    isInputChecking: isAudioInputChecking,
    permissionCalloutType: audioInputPermissionCalloutType,
    permissionStatus: audioInputPermissionStatus,
    setInputChecking: setAudioInputChecking,
    setSelectedInputDevice: setSelectedAudioInputDevice,
    settings
  } = useMediaInputDevice({
    kind: 'audio',
    onPermissionDenied: markAudioInputPermissionDenied,
    onPermissionGranted: markAudioInputPermissionGranted,
    onStopCheck: stopAudioVolume,
    onStreamStarted: startAudioVolume,
    permission: audioInputPermission,
    settingKey: 'audioInputDeviceId',
    showDeviceWarning,
    startCheckLabel: SETTINGS_PAGE_DEVICES_I18N.testAudioInput,
    stopCheckLabel: SETTINGS_PAGE_DEVICES_I18N.stopAudioInputCheck
  })

  return {
    settings,
    audioInputOptions,
    audioInputLoading,
    audioInputCheckLoading,
    isAudioInputCheckDisabled,
    audioInputPermissionCalloutType,
    audioInputPermissionStatus,
    hasAudioInputPermissionWarning,
    audioVolumeDb,
    isAudioInputChecking,
    audioInputCheckLabel,
    audioInputCheckButtonLabel,
    setAudioInputChecking,
    setSelectedAudioInputDevice
  }
}
