import './style.scss'
import { useEffect } from 'react'

import { useInputAudioDevice } from 'src/features/input-audio-device'
import { AUDIO_INPUT_DEVICE_SELECT_I18N } from 'src/features/select-audio-input-device'
import { SelectDevice } from 'src/features/select-device'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { useSettings, useI18n } from 'src/shared/preferences'

export const AudioInputDeviceSelect = () => {
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
        title={t(AUDIO_INPUT_DEVICE_SELECT_I18N.title)}
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
