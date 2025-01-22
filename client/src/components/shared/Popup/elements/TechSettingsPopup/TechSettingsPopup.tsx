import { Select } from 'antd'
import { NotificationMessage, NotificationType } from 'common-types'
import { useState, useEffect, useRef } from 'react'
import { UIButton } from 'src/components'
import { useNotification, useTypedSelector } from 'src/hooks'
import { $sound, Sounds } from 'src/services'

export const TechSettingsPopup = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])

  const [audioInputDeviceList, setAudioInputDeviceList] = useState([] as MediaDeviceInfo[])
  const [selectedAudioInputDeviceValue, setSelectedAudioInputDeviceValue] = useState('default')

  const [videoInputDeviceList, setVideoInputDeviceList] = useState([] as MediaDeviceInfo[])
  const [selectedVideoInputDeviceValue, setSelectedVideoInputDeviceValue] = useState('default')

  const [audioOutputDeviceList, setAudioOutputDeviceList] = useState([] as MediaDeviceInfo[])
  const [selectedAudioOutputDevicesValue, setSelectedAudioOutputDeviceValue] = useState('default')

  const requiredInputElements = { 'audioinput': { setDeviceByKindListAction: setAudioInputDeviceList, setCurrentDeviceAction: setSelectedAudioInputDeviceValue }, 'videoinput': { setDeviceByKindListAction: setVideoInputDeviceList, setCurrentDeviceAction: setSelectedVideoInputDeviceValue }, 'audiooutput': { setDeviceByKindListAction: setAudioOutputDeviceList, setCurrentDeviceAction: setSelectedAudioOutputDeviceValue } }

  const setDeviceData = (kind: string, setDeviceByKindListAction: React.Dispatch<React.SetStateAction<MediaDeviceInfo[]>>, setCurrentDeviceAction: React.Dispatch<React.SetStateAction<string>>) => {
    const devicesByKind = devices.filter((device) => device.kind === kind)
    setDeviceByKindListAction((oldArray) => [...oldArray, ...devicesByKind])
    if (devicesByKind.length > 0 && devicesByKind[0].deviceId) setCurrentDeviceAction(devicesByKind[0].deviceId)
  }

  const updateAvailableDevices = async () => {
    let availableDevices = await navigator.mediaDevices.enumerateDevices()
    setDevices(availableDevices)
  }

  const { showModal } = useTypedSelector((state) => state.system)

  useEffect(() => {
    if (!showModal) {
      const tracks = videoStream?.getTracks()
      tracks?.forEach((track) => track.stop())
      setShowVideo(false)
      outputTestAudioSample.stop()
    }
  }, [showModal])

  useEffect(() => {
    ['audioinput', 'videoinput', 'audiooutput'].forEach((input) => {
      const { setDeviceByKindListAction, setCurrentDeviceAction } = requiredInputElements[input as keyof typeof requiredInputElements]
      setDeviceData(input, setDeviceByKindListAction, setCurrentDeviceAction)
    })
  }, [devices])

  useEffect(() => {
    updateAvailableDevices()
  }, [])

  const onAudioInputDeviceChange = (value: string) => {
    setSelectedAudioInputDeviceValue(value || 'default')
  }

  const onVideoInputDeviceChange = (value: string) => {
    setSelectedVideoInputDeviceValue(value || 'default')
  }

  const onAudioOutputDeviceChange = async (value: string) => {
    setSelectedAudioOutputDeviceValue(value || 'default')
  }

  const hideVideo = () => {
    const tracks = videoStream?.getTracks()
    tracks?.forEach((track) => track.stop())
    setShowVideo(false)
  }

  const videoEl = useRef<HTMLVideoElement>(null)

  const [isVideoLoading, setVideoIsLoading] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)

  const notifications = useNotification();

  const cantAccessDeviceNotification = notifications.getNotification({
    message: NotificationMessage.cantAccessDevice,
    messageType: NotificationType.error
  })

  const toggleVideo = async () => {
    if (showVideo) {
      hideVideo()
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
      cantAccessDeviceNotification.open()
      setShowVideo(false)
    } finally {
      setVideoIsLoading(false)
      updateAvailableDevices()
    }
  }

  const outputTestAudioSample = $sound(Sounds.messageDelivered)
  const toggleAudioOutput = () => {
    updateAvailableDevices()
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
      cantAccessDeviceNotification.open()
      setMicGrade(false)
    } finally {
      setMicIsLoading(false)
      updateAvailableDevices()
    }
  }

  const micIcon = () => isMicLoading ? 'loader' : showMicGrade ? 'cross' : 'thunder'
  const videoIcon = () => isVideoLoading ? 'loader' : showVideo ? 'cross' : 'thunder'

  return (
    <div className="tech-settings-popup">
      <div className="tech-settings-popup__select">
        <div className="paragraph-text paragraph-text--secondary">Audio input device</div>
        <div className="tech-settings-popup__select-wrapper">
          <Select
            disabled
            style={{ width: '100%' }}
            loading={audioInputDeviceList.length < 0}
            value={selectedAudioInputDeviceValue}
            onChange={onAudioInputDeviceChange}
            options={audioInputDeviceList.map((device) => ({ label: device.label, value: device.deviceId }))}
          />
          <UIButton onClick={toggleMic} iconName={micIcon()} color={showMicGrade ? 'error' : 'accent'} />
        </div>
        <div
          className={`tech-settings-popup__volume-indicator-wrapper ${!showMicGrade && 'tech-settings-popup__volume-indicator-wrapper--hide'
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
            loading={videoInputDeviceList.length < 0}
            value={selectedVideoInputDeviceValue}
            onChange={onVideoInputDeviceChange}
            options={videoInputDeviceList.map((device) => ({ label: device.label, value: device.deviceId }))}
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
            loading={audioOutputDeviceList.length < 0}
            value={selectedAudioOutputDevicesValue}
            onChange={onAudioOutputDeviceChange}
            options={audioOutputDeviceList.map((device) => ({ label: device.label, value: device.deviceId }))}
          />
          <UIButton onClick={toggleAudioOutput} iconName="thunder" color="accent" />
        </div>
      </div>
    </div>
  )
}
