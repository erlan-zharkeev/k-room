import './style.scss'
import { useEffect } from 'react'

import { SelectDevice, useOutputAudioDevice } from 'src/features/device'

import { useSettings } from 'src/entities/settings'

import { createClassNameWithModifiers } from 'src/shared/utils'

export const AudioOutputDeviceSelect = () => {
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
        title="Audio output device"
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
