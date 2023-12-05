import { Select } from 'antd'
import { NotificationMessage, NotificationType } from 'common-types'
import { useState, useEffect, useRef } from 'react'
import { UIButton } from 'src/components'
import { $sound, Sounds } from 'src/services'
import { showNotification } from 'src/store'

export const TechSettingsPopup = () => {
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

  const onAudioOutputDeviceChange = async (value: string) => {
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
        message: NotificationMessage.cantAccessDevice,
        messageType: NotificationType.error
      })
      setShowVideo(false)
    } finally {
      setVideoIsLoading(false)
    }
  }

  const outputTestAudioSample = $sound(Sounds.messageDelivered)
  const toggleAudioOutput = () => {
    outputTestAudioSample.stop()
    outputTestAudioSample.play()
  }

  const initAudioVisualizer = (stream: MediaStream) => {
    const audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    source.connect(analyser)
    const updateVolumeIndicator = () => {
      analyser.getByteFrequencyData(dataArray)
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
      }
      const averageVolume = (sum / bufferLength) * 2
      if (volumeIndicator.current) volumeIndicator.current.style.width = averageVolume + 'px'
      requestAnimationFrame(updateVolumeIndicator)
    }
    updateVolumeIndicator()
  }

  const [isMicLoading, setMicIsLoading] = useState(false)
  const [showMicGrade, setMicGrade] = useState(false)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const volumeIndicator = useRef<HTMLDivElement>(null)

  const toggleMic = async () => {
    if (showMicGrade) {
      const tracks = audioStream?.getTracks()
      tracks?.forEach((track) => track.stop())
      setMicGrade(false)
      return
    }

    try {
      setMicIsLoading(true)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!stream) return
      setAudioStream(stream)
      initAudioVisualizer(stream)
      setMicGrade(true)
    } catch {
      showNotification({
        message: NotificationMessage.cantAccessDevice,
        messageType: NotificationType.error
      })
      setMicGrade(false)
    } finally {
      setMicIsLoading(false)
    }
  }

  const micIcon = () => {
    return isMicLoading ? 'loader' : showMicGrade ? 'cross' : 'thunder'
  }

  const videoIcon = () => {
    return isVideoLoading ? 'loader' : showVideo ? 'cross' : 'thunder'
  }

  return (
    <div className="tech-settings-popup">
      <div className="tech-settings-popup__select">
        <div className="paragraph-text paragraph-text--secondary">Audio input device</div>
        <div className="tech-settings-popup__select-wrapper">
          <Select
            disabled
            style={{ width: '100%' }}
            loading={audioInputDevices.length < 0}
            value={selectedAudioInputDeviceValue}
            onChange={onAudioInputDeviceChange}
            options={audioInputDevices.map((device) => ({ label: device.label, value: device.deviceId }))}
          />
          <UIButton onClick={toggleMic} iconName={micIcon()} color={showMicGrade ? 'error' : 'accent'} />
        </div>
        <div
          className={`tech-settings-popup__volume-indicator-wrapper ${
            !showMicGrade && 'tech-settings-popup__volume-indicator-wrapper--hide'
          }`}
        >
          <div ref={volumeIndicator} className="tech-settings-popup__volume-indicator" />
        </div>
      </div>
      <div className="tech-settings-popup__select">
        <div className="paragraph-text paragraph-text--secondary">Video input device</div>
        <div className="tech-settings-popup__select-wrapper">
          <Select
            disabled
            style={{ width: '100%' }}
            loading={videoInputDevices.length < 0}
            value={selectedVideoInputDeviceValue}
            onChange={onVideoInputDeviceChange}
            options={videoInputDevices.map((device) => ({ label: device.label, value: device.deviceId }))}
          />
          <UIButton onClick={toggleVideo} iconName={videoIcon()} color={showVideo ? 'error' : 'accent'} />
        </div>
        <div className={`tech-settings-popup__video ${!showVideo ? 'tech-settings-popup__video--hide' : ''}`}>
          <video ref={videoEl} autoPlay />
        </div>
      </div>
      <div className="tech-settings-popup__select">
        <div className="paragraph-text paragraph-text--secondary">Audio output device</div>
        <div className="tech-settings-popup__select-wrapper">
          <Select
            disabled
            style={{ width: '100%' }}
            loading={audioOutputDevices.length < 0}
            value={selectedAudioOutputDevicesValue}
            onChange={onAudioOutputDeviceChange}
            options={audioOutputDevices.map((device) => ({ label: device.label, value: device.deviceId }))}
          />
          <UIButton onClick={toggleAudioOutput} iconName="thunder" color="accent" />
        </div>
      </div>
    </div>
  )
}
