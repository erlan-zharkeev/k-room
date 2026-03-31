import './style.scss'
import { useEffect } from 'react'

import { AUDIO_OUTPUT_DEVICE_SELECT_I18N, SelectDevice, useOutputAudioDevice } from 'src/features/device'

import { useSettings, useI18n } from 'src/entities/settings'

import { createClassNameWithModifiers } from 'src/shared/utils'

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
