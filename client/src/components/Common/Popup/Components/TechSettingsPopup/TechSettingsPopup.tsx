import { Select } from 'antd'
import { useEffect, useState } from 'react'

const TechSettingsPopup = () => {
  const [audioInputDevices, setAudioInputDevices] = useState([] as MediaDeviceInfo[])
  const [selectedAudioInputDeviceValue, setSelectedAudioInputDeviceValue] = useState('default')

  const [videoInputDevices, setVideoInputDevices] = useState([] as MediaDeviceInfo[])
  const [selectedVideoInputDeviceValue, setSelectedVideoInputDeviceValue] = useState('default')

  const [audioOutputDevices, setAudioOutputDevices] = useState([] as MediaDeviceInfo[])
  const [selectedAudioOutputDevicesValue, setSelectedAudioOutputDeviceValue] = useState('default')

  const getAvailableAudioDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const availableInputAudioDevices = devices.filter((device) => device.kind === 'audioinput')
    setAudioInputDevices((oldArray) => [...oldArray, ...availableInputAudioDevices])

    const availableVideoInputDevices = devices.filter((device) => device.kind === 'videoinput')
    setVideoInputDevices((oldArray) => [...oldArray, ...availableVideoInputDevices])
    setSelectedVideoInputDeviceValue(availableVideoInputDevices[0].deviceId)

    const availableAudioOutputDevices = devices.filter((device) => device.kind === 'audiooutput')
    setAudioOutputDevices((oldArray) => [...oldArray, ...availableAudioOutputDevices])
  }

  useEffect(() => {
    getAvailableAudioDevices()
  }, [])

  const onAudioInputDeviceChange = (value: string) => {
    setSelectedAudioInputDeviceValue(value)
  }

  const onVideoInputDeviceChange = (value: string) => {
    setSelectedVideoInputDeviceValue(value)
  }

  const onAudioOutputDeviceChange = (value: string) => {
    setSelectedAudioOutputDeviceValue(value)
  }

  return (
    <div className="tech-settings-popup">
      <div className="tech-settings-popup__select">
        <div className="paragraph-text paragraph-text--secondary">Audio input device</div>
        <Select
          style={{ width: '100%' }}
          loading={audioInputDevices.length < 0}
          value={selectedAudioInputDeviceValue}
          onChange={onAudioInputDeviceChange}
          options={audioInputDevices.map((device) => ({ label: device.label, value: device.deviceId }))}
        />
      </div>
      <div className="tech-settings-popup__select">
        <div className="paragraph-text paragraph-text--secondary">Video input device</div>
        <Select
          style={{ width: '100%' }}
          loading={videoInputDevices.length < 0}
          value={selectedVideoInputDeviceValue}
          onChange={onVideoInputDeviceChange}
          options={videoInputDevices.map((device) => ({ label: device.label, value: device.deviceId }))}
        />
      </div>
      <div className="tech-settings-popup__select">
        <div className="paragraph-text paragraph-text--secondary">Audio output device</div>
        <Select
          style={{ width: '100%' }}
          loading={audioOutputDevices.length < 0}
          value={selectedAudioOutputDevicesValue}
          onChange={onAudioOutputDeviceChange}
          options={audioOutputDevices.map((device) => ({ label: device.label, value: device.deviceId }))}
        />
      </div>
    </div>
  )
}

export default TechSettingsPopup
