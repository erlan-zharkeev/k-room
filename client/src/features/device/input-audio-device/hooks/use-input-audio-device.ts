import { useEffect, useRef, useState } from 'react'

import { useNotification, NOTIFICATION_I18N } from 'src/entities/notification'
import { useSettings } from 'src/entities/settings'
import { useI18n } from 'src/entities/system'

import { frontCaptureSentryException } from 'src/shared/lib'
import { AppIconNameType } from 'src/shared/ui'

import { useDevicePermissionRequestAndUpdate } from '../..'

export const useInputAudioDevice = () => {
  const { t } = useI18n()
  const [audioInputDeviceList, setAudioInputDeviceList] = useState<MediaDeviceInfo[]>([])
  const settings = useSettings()
  const [isMicLoading, setMicIsLoading] = useState(false)
  const [showMicGrade, setMicGrade] = useState(false)
  const audioStream = useRef<MediaStream | null>(null)
  const { getNotification } = useNotification()
  const { requestAndUpdateMicPermission } = useDevicePermissionRequestAndUpdate()

  const updateDeviceList = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const audioInputs = devices.filter((device) => device.kind === 'audioinput')
    setAudioInputDeviceList(audioInputs)
    const selectedStillExists = audioInputs.some((device) => device.deviceId === settings.selectedAudioInputDeviceId)

    if (!selectedStillExists) {
      changeAudioInputDevice()
      setMicGrade(false)
    }
  }

  const requestInputAudioDeviceList = async () => {
    try {
      const micPermission = await requestAndUpdateMicPermission()
      if (micPermission === 'denied') throw new Error('Permission denied')
      if (micPermission === 'prompt') {
        const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        tempStream.getTracks().forEach((track) => track.stop())
      }
      updateDeviceList()
    } catch (error) {
      cantAccessDeviceNotification.open()
    }
  }

  const changeAudioInputDevice = (value: string = '') => {
    settings.update({ selectedAudioInputDeviceId: value })
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

  const cantAccessDeviceNotification = getNotification({
    message: t(NOTIFICATION_I18N.cantAccessDevice),
    messageType: 'error'
  })

  const isExpectedAudioDeviceError = (error: unknown) => {
    if (error instanceof DOMException) {
      return error.name === 'NotAllowedError' || error.name === 'NotFoundError' || error.name === 'AbortError'
    }

    if (error instanceof Error) {
      return error.message === 'Permission denied' || error.message === 'Get user media not supported'
    }

    return false
  }

  const setAudioStreamHandler = async () => {
    try {
      setMicIsLoading(true)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Get user media not supported')
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: settings.selectedAudioInputDeviceId ? { exact: settings.selectedAudioInputDeviceId } : undefined
        }
      })
      audioStream.current = stream
    } catch (error) {
      if (!isExpectedAudioDeviceError(error)) {
        frontCaptureSentryException(error)
      }

      cantAccessDeviceNotification.open()
    } finally {
      setMicIsLoading(false)
    }
  }

  const testMic = async () => {
    if (showMicGrade) {
      const tracks = audioStream.current?.getTracks()
      tracks?.forEach((track) => track.stop())
      setMicGrade(false)
      return
    }

    await setAudioStreamHandler()
    if (audioStream.current) {
      initAudioVisualizer(audioStream.current)
      setMicGrade(true)
    } else {
      setMicGrade(false)
    }
  }

  const micIcon: AppIconNameType = isMicLoading ? 'loader' : (showMicGrade ? 'cross' : 'thunder')

  const audioDevices = audioInputDeviceList.map((device) => ({
    label: device.label,
    value: device.deviceId
  }))

  const loading = audioInputDeviceList.length === 0

  const volumeIndicator = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      const tracks = audioStream.current?.getTracks()
      tracks?.forEach((track) => track.stop())
      setMicGrade(false)
    }
  }, [])

  useEffect(() => {
    if (audioInputDeviceList.length > 0) {
      requestAndUpdateMicPermission()
    }
  }, [audioDevices])

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', updateDeviceList)

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', updateDeviceList)
    }
  }, [])

  return {
    requestInputAudioDeviceList,
    testMic,
    audioDevices,
    micIcon,
    changeAudioInputDevice,
    loading,
    showMicGrade,
    volumeIndicator
  }
}
