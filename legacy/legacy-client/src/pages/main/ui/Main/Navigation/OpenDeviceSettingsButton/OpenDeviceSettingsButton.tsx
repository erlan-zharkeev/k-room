import './open-device-settings-button.scss'

import { useEffect, useState } from 'react'

import { useInputAudioDevice, useInputVideoDevice } from 'src/shared/media-devices'
import { useI18n, useSettings } from 'src/shared/preferences'
import { AppButton, AppModal, AppTooltip, SelectDevice } from 'src/shared/ui'

import {
  AUDIO_INPUT_DEVICE_SELECT_I18N,
  AUDIO_OUTPUT_DEVICE_SELECT_I18N,
  OPEN_DEVICE_SETTINGS_BUTTON_I18N,
  VIDEO_INPUT_DEVICE_SELECT_I18N
} from './i18n.ts'
import { useOutputAudioDevice } from './use-output-audio-device'

const AudioInputDeviceSelect = () => {
  const { selectedAudioInputDeviceId } = useSettings()
  const { t } = useI18n()
  const {
    testMic,
    micIcon,
    changeAudioInputDevice,
    audioDevices,
    loading,
    showMicGrade,
    volumeIndicator,
    requestInputAudioDeviceList
  } = useInputAudioDevice()

  useEffect(() => {
    requestInputAudioDeviceList()
  }, [])

  return (
    <div className="audio-input-device-select">
      <SelectDevice
        onChange={changeAudioInputDevice}
        actionHandler={testMic}
        title={t(AUDIO_INPUT_DEVICE_SELECT_I18N.title)}
        prefixIconName={micIcon}
        options={audioDevices}
        loading={loading}
        value={selectedAudioInputDeviceId}
        isErrorColor={showMicGrade}
      >
        <div
          className={`audio-input-device-select__volume-indicator-wrapper${
            !showMicGrade ? ' audio-input-device-select__volume-indicator-wrapper--hide' : ''
          }`}
        >
          <div ref={volumeIndicator} className="audio-input-device-select__volume-indicator" />
        </div>
      </SelectDevice>
    </div>
  )
}

const VideoInputDeviceSelect = () => {
  const { t } = useI18n()
  const {
    testVideo,
    videoIcon,
    videoEl,
    loading,
    changeVideoInputDevice,
    videoDevices,
    showVideo,
    requestInputVideoDeviceList
  } = useInputVideoDevice()
  const { selectedVideoInputDeviceId } = useSettings()

  useEffect(() => {
    requestInputVideoDeviceList()
  }, [])

  return (
    <div className="video-input-device-select">
      <SelectDevice
        onChange={changeVideoInputDevice}
        actionHandler={testVideo}
        title={t(VIDEO_INPUT_DEVICE_SELECT_I18N.title)}
        prefixIconName={videoIcon}
        options={videoDevices}
        loading={loading}
        value={selectedVideoInputDeviceId}
        isErrorColor={showVideo}
      >
        <div
          className={`video-input-device-select__video${!showVideo ? ' video-input-device-select__video--hide' : ''}`}
        >
          {/* Local camera preview does not provide caption tracks. */}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video ref={videoEl} autoPlay />
        </div>
      </SelectDevice>
    </div>
  )
}

const AudioOutputDeviceSelect = () => {
  const { t } = useI18n()
  const {
    testAudioOutput,
    showIndicator,
    updateOutputAudioDeviceList,
    loading,
    outputAudioDevices,
    onAudioOutputDeviceChange
  } = useOutputAudioDevice()
  const { selectedAudioOutputDeviceId } = useSettings()

  useEffect(() => {
    updateOutputAudioDeviceList()
  }, [])

  return (
    <div className="audio-output-device-select">
      <SelectDevice
        onChange={onAudioOutputDeviceChange}
        actionHandler={testAudioOutput}
        title={t(AUDIO_OUTPUT_DEVICE_SELECT_I18N.title)}
        prefixIconName="thunder"
        options={outputAudioDevices}
        loading={loading}
        value={selectedAudioOutputDeviceId}
        isErrorColor={false}
      />
      <div
        className={`audio-output-device-select__indicator${
          showIndicator ? ' audio-output-device-select__indicator--visible' : ''
        }`}
      />
    </div>
  )
}

const DeviceSettingsModal = () => {
  return (
    <div className="select-devices-modal">
      <AudioInputDeviceSelect />
      <VideoInputDeviceSelect />
      <AudioOutputDeviceSelect />
    </div>
  )
}

export const OpenDeviceSettingsButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useI18n()

  return (
    <>
      <AppTooltip text={t(OPEN_DEVICE_SETTINGS_BUTTON_I18N.tooltip)}>
        <AppButton prefixIconName="thunder" color="accent-color" onClick={() => setIsOpen(true)} borderless />
      </AppTooltip>
      <AppModal title={t(OPEN_DEVICE_SETTINGS_BUTTON_I18N.modalTitle)} open={isOpen} onClose={() => setIsOpen(false)}>
        <DeviceSettingsModal />
      </AppModal>
    </>
  )
}
