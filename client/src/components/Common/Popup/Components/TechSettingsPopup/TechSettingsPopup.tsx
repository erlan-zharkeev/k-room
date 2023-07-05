import { Select } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { UIButton } from 'src/components/UI'
import { showNotification } from 'src/store/systemSlice'

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

  const videoEl = useRef<HTMLVideoElement>(null)

  const [isVideoLoading, setVideoIsLoading] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)

  const toggleVideo = async () => {
    if (showVideo) {
      const tracks = videoStream?.getTracks()
      tracks?.forEach((track) => track.stop())
      setShowVideo(false)
      return
    }

    try {
      setVideoIsLoading(true)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (!stream) return
      setVideoStream(stream)
      const video = videoEl.current
      video!.srcObject = stream
      setShowVideo(true)
    } catch {
      showNotification({
        message: 'Cant get access to video device',
        messageType: 'error'
      })
      setShowVideo(false)
    } finally {
      setVideoIsLoading(false)
    }
  }

  const videoButtonText = () => {
    return showVideo ? 'Hide video' : 'Check video'
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
        <div className="tech-settings-popup__video-select">
          <Select
            style={{ width: '100%' }}
            loading={videoInputDevices.length < 0}
            value={selectedVideoInputDeviceValue}
            onChange={onVideoInputDeviceChange}
            options={videoInputDevices.map((device) => ({ label: device.label, value: device.deviceId }))}
          />
          <UIButton
            text={videoButtonText()}
            onClick={toggleVideo}
            border="border-default"
            loading={isVideoLoading}
            color={isVideoLoading ? 'accent' : 'default'}
          />
        </div>
      </div>
      <div className={`tech-settings-popup__video ${!showVideo ? 'tech-settings-popup__video--hide' : ''}`}>
        <video ref={videoEl} autoPlay />
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
