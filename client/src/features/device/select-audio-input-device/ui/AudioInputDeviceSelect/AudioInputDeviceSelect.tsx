import './style.scss'
import { useEffect } from 'react'

import { SelectDevice, useInputAudioDevice } from 'src/features/device'

import { useSettings } from 'src/entities/settings'

export const AudioInputDeviceSelect = () => {
  const { selectedAudioInputDeviceId } = useSettings()

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
        title="Audio input device"
        prefixIconName={micIcon}
        options={audioDevices}
        loading={loading}
        value={selectedAudioInputDeviceId}
        isErrorColor={showMicGrade}
      >
        <div
          className={`audio-input-device-select__volume-indicator-wrapper${
            showMicGrade ? '' : ' audio-input-device-select__volume-indicator-wrapper--hide'
          }`}
        >
          <div ref={volumeIndicator} className="audio-input-device-select__volume-indicator" />
        </div>
      </SelectDevice>
    </div>
  )
}
