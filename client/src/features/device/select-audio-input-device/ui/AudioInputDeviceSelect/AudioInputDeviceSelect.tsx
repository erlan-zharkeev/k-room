import './style.scss'
import { useEffect } from 'react'

import { SelectDevice, useInputAudioDevice } from 'src/features/device'

import { useSettings } from 'src/entities/settings'

import { createClassNameWithModifiers } from 'src/shared/utils'

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
  const volumeIndicatorClassName = createClassNameWithModifiers({
    rootClass: 'audio-input-device-select__volume-indicator-wrapper',
    modifiers: [!showMicGrade && 'hide']
  })

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
        <div className={volumeIndicatorClassName}>
          <div ref={volumeIndicator} className="audio-input-device-select__volume-indicator" />
        </div>
      </SelectDevice>
    </div>
  )
}
