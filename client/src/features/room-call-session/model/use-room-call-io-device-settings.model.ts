import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { useDevicesList } from '@vueuse/core'
import { isFunction } from 'global-shared'
import { computed, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import {
  DEFAULT_MEDIA_DEVICE_SELECT_VALUE,
  MEDIA_DEVICE_I18N,
  resolveMediaDeviceSelectOptionValue,
  resolveMediaDeviceSelectValue,
  useMediaDeviceSelectOptions,
  useI18n
} from 'src/shared/lib'

import type { RoomCallIoDeviceSettingsProps } from '../config/types'

import { useActiveRoomCallSession } from './use-active-room-call-session.model'

const canSelectRoomCallAudioOutputDevice = () =>
  typeof HTMLMediaElement !== 'undefined' && isFunction(HTMLMediaElement.prototype.setSinkId)

export const useRoomCallIoDeviceSettings = (props: RoomCallIoDeviceSettingsProps) => {
  const { t } = useI18n()
  const { buildMediaDeviceSelectOptions } = useMediaDeviceSelectOptions()
  const { settings } = useSettings()
  const { setActiveRoomCallAudioInputDevice, setActiveRoomCallAudioOutputDevice, setActiveRoomCallVideoInputDevice } =
    useActiveRoomCallSession()
  const { audioInputs, audioOutputs, devices, isSupported, videoInputs } = useDevicesList({
    constraints: {
      audio: true,
      video: true
    }
  })
  const isAudioOutputSelectionSupported = computed(() => isSupported.value && canSelectRoomCallAudioOutputDevice())

  const buildRoomCallDeviceOptions = (mediaDevices: MediaDeviceInfo[]) =>
    buildMediaDeviceSelectOptions({
      devices: mediaDevices,
      defaultOptionLabel: t(MEDIA_DEVICE_I18N.defaultDevice),
      emptyValue: DEFAULT_MEDIA_DEVICE_SELECT_VALUE,
      unknownOptionLabelWithIndex: true
    })

  const audioInputOptions = computed(() => buildRoomCallDeviceOptions(audioInputs.value))
  const videoInputOptions = computed(() => buildRoomCallDeviceOptions(videoInputs.value))
  const audioOutputOptions = computed(() => buildRoomCallDeviceOptions(audioOutputs.value))
  const audioInputSelectValue = computed(() =>
    resolveMediaDeviceSelectOptionValue(settings.value.ioDevices.audioInputDeviceId, DEFAULT_MEDIA_DEVICE_SELECT_VALUE)
  )
  const videoInputSelectValue = computed(() =>
    resolveMediaDeviceSelectOptionValue(settings.value.ioDevices.videoInputDeviceId, DEFAULT_MEDIA_DEVICE_SELECT_VALUE)
  )
  const audioOutputSelectValue = computed(() =>
    resolveMediaDeviceSelectOptionValue(settings.value.ioDevices.audioOutputDeviceId, DEFAULT_MEDIA_DEVICE_SELECT_VALUE)
  )
  const areInputDeviceSelectsDisabled = computed(() => Boolean(props.disabled) || !isSupported.value)
  const isAudioOutputSelectDisabled = computed(() => Boolean(props.disabled) || !isAudioOutputSelectionSupported.value)

  const refreshRoomCallDevices = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return
    }

    try {
      devices.value = await navigator.mediaDevices.enumerateDevices()
    } catch {
      devices.value = []
    }
  }

  const setSelectedAudioInputDevice = async (value: NmorphSelectModelValueType = '') => {
    if (areInputDeviceSelectsDisabled.value) return

    await setActiveRoomCallAudioInputDevice(resolveMediaDeviceSelectValue(value, DEFAULT_MEDIA_DEVICE_SELECT_VALUE))
  }

  const setSelectedVideoInputDevice = async (value: NmorphSelectModelValueType = '') => {
    if (areInputDeviceSelectsDisabled.value) return

    await setActiveRoomCallVideoInputDevice(resolveMediaDeviceSelectValue(value, DEFAULT_MEDIA_DEVICE_SELECT_VALUE))
  }

  const setSelectedAudioOutputDevice = async (value: NmorphSelectModelValueType = '') => {
    if (isAudioOutputSelectDisabled.value) return

    await setActiveRoomCallAudioOutputDevice(resolveMediaDeviceSelectValue(value, DEFAULT_MEDIA_DEVICE_SELECT_VALUE))
  }

  watch(
    () => props.active,
    (isActive) => {
      if (isActive) {
        void refreshRoomCallDevices()
      }
    },
    { immediate: true }
  )

  return {
    audioInputOptions,
    audioInputSelectValue,
    videoInputOptions,
    videoInputSelectValue,
    audioOutputOptions,
    audioOutputSelectValue,
    areInputDeviceSelectsDisabled,
    isAudioOutputSelectDisabled,
    setSelectedAudioInputDevice,
    setSelectedVideoInputDevice,
    setSelectedAudioOutputDevice
  }
}
