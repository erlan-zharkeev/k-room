import type { Ref } from 'vue'

import type { IoDevicesSettings } from 'src/entities/setting'

import type { DevicePermissionStatus } from '../../config/types/devices.types'

export type MediaInputDeviceKind = 'audio' | 'video'

export type MediaInputDeviceSettingKey = Extract<keyof IoDevicesSettings, 'audioInputDeviceId' | 'videoInputDeviceId'>

export interface UseMediaInputDeviceOptions {
  kind: MediaInputDeviceKind
  settingKey: MediaInputDeviceSettingKey
  permission: Readonly<Ref<DevicePermissionStatus>>
  startCheckLabel: string
  stopCheckLabel: string
  showDeviceWarning: (error: unknown) => void
  onPermissionDenied?: () => void
  onPermissionGranted?: () => void
  onStopCheck?: () => void
  onStreamStarted?: (stream: MediaStream) => void
}
