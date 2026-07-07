import { useMediaDevicePermission } from 'src/shared/lib'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'

import { useDeviceWarning } from './use-device-settings.model'
import { useMediaInputDevice } from './use-media-input-device.model'

export const useVideoInputDevice = () => {
  const {
    hasVideoInputPermissionWarning,
    markVideoInputPermissionDenied,
    markVideoInputPermissionGranted,
    videoInputPermission
  } = useMediaDevicePermission()
  const { showDeviceWarning } = useDeviceWarning('Video input device request failed')
  const {
    inputCheckButtonLabel: videoInputCheckButtonLabel,
    inputCheckLabel: videoInputCheckLabel,
    inputLoading: videoInputLoading,
    inputOptions: videoInputOptions,
    inputSelectValue: videoInputSelectValue,
    inputStream: videoInputStream,
    isInputCheckDisabled: isVideoInputCheckDisabled,
    isInputChecking: isVideoInputChecking,
    permissionCalloutType: videoInputPermissionCalloutType,
    permissionStatus: videoInputPermissionStatus,
    setInputChecking: setVideoInputChecking,
    setSelectedInputDevice: setSelectedVideoInputDevice
  } = useMediaInputDevice({
    kind: 'video',
    onPermissionDenied: markVideoInputPermissionDenied,
    onPermissionGranted: markVideoInputPermissionGranted,
    permission: videoInputPermission,
    settingKey: 'videoInputDeviceId',
    showDeviceWarning,
    startCheckLabel: SETTINGS_PAGE_DEVICES_I18N.testVideoInput,
    stopCheckLabel: SETTINGS_PAGE_DEVICES_I18N.stopVideoInputCheck
  })

  return {
    videoInputSelectValue,
    videoInputOptions,
    videoInputLoading,
    isVideoInputCheckDisabled,
    videoInputPermissionCalloutType,
    videoInputPermissionStatus,
    hasVideoInputPermissionWarning,
    videoInputStream,
    isVideoInputChecking,
    videoInputCheckLabel,
    videoInputCheckButtonLabel,
    setVideoInputChecking,
    setSelectedVideoInputDevice
  }
}
