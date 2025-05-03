import { useEffect } from 'react'

import { SelectDevice } from 'src/features/device/select-device'

import { useSettings } from 'src/entities/settings'

import { useOutputAudioDevice } from '../../../output-audio-device/hooks/use-output-audio-device'

export const AudioOutputDeviceSelect = () => {
  const { testAudioOutput, updateOutputAudioDeviceList, loading, outputAudioDevices, onAudioOutputDeviceChange } =
    useOutputAudioDevice()
  const { selectedAudioOutputDeviceId } = useSettings()

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
    </div>
  )
}
