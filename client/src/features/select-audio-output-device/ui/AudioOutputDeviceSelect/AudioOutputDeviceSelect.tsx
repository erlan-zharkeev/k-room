import './style.scss'
import { useEffect } from 'react'

import { useOutputAudioDevice } from 'src/features/output-audio-device'
import { AUDIO_OUTPUT_DEVICE_SELECT_I18N } from 'src/features/select-audio-output-device'
import { SelectDevice } from 'src/features/select-device'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { useSettings, useI18n } from 'src/shared/preferences'

export const AudioOutputDeviceSelect = () => {
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

  const indicatorClassName = createClassNameWithModifiers({
    rootClass: 'audio-output-device-select__indicator',
    modifiers: [showIndicator && 'visible']
  })

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
      <div className={indicatorClassName} />
    </div>
  )
}
