import { useEffect, useMemo, useRef, useState } from 'react'

import { useDispatch } from 'react-redux'

import { ClientNotificationMessage, useNotification } from 'src/entities/notification'
import { updateSelectedVideoInputDeviceId, useSettings } from 'src/entities/settings'
import { showModal } from 'src/entities/system'

import { AppIconName } from 'src/shared/ui'

import { useDevicePermissionRequestAndUpdate } from '../../request-and-update-device-permission'

export const useInputVideoDevice = () => {
  const { getNotification } = useNotification()

  const [videoInputDeviceList, setVideoInputDeviceList] = useState([] as MediaDeviceInfo[])
  const { selectedVideoInputDeviceId } = useSettings()
  const [isVideoLoading, setVideoIsLoading] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const videoStream = useRef<MediaStream | null>(null)

  const { requestAndUpdateCamPermission } = useDevicePermissionRequestAndUpdate()

  const videoEl = useRef<HTMLVideoElement>(null)

  const videoIcon: AppIconName = useMemo(() => {
    return isVideoLoading ? 'loader' : showVideo ? 'cross' : 'thunder'
  }, [isVideoLoading, showVideo])

  const loading = useMemo(() => videoInputDeviceList.length < 0, [videoInputDeviceList])

  const dispatch = useDispatch()

  const changeVideoInputDevice = (value: string = '') => {
    dispatch(updateSelectedVideoInputDeviceId(value))
  }

  const hideVideo = () => {
    const tracks = videoStream.current?.getTracks()
    tracks?.forEach((track) => track.stop())
    setShowVideo(false)
  }

  const cantAccessDeviceNotification = getNotification({
    message: ClientNotificationMessage.CantAccessDevice,
    messageType: 'error'
  })

  const videoDevices = useMemo(() => {
    return videoInputDeviceList.map((device) => ({
      label: device.label,
      value: device.deviceId
    }))
  }, [videoInputDeviceList])

  const updateDeviceList = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoInputs = devices.filter((device) => device.kind === 'videoinput')
    setVideoInputDeviceList(videoInputs)
    const selectedStillExists = videoInputs.some((device) => device.deviceId === selectedVideoInputDeviceId)

    if (!selectedStillExists) {
      changeVideoInputDevice()
      hideVideo()
    }
  }

  const requestInputVideoDeviceList = async () => {
    try {
      const permission = await requestAndUpdateCamPermission()
      if (permission === 'denied') throw new Error('Permission denied')
      if (permission === 'prompt') {
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true })
        tempStream.getTracks().forEach((track) => track.stop())
      }
      updateDeviceList()
    } catch (error) {
      cantAccessDeviceNotification.open()
    }
  }

  const setVideoStreamHandler = async () => {
    try {
      setVideoIsLoading(true)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Get user media not supported')
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedVideoInputDeviceId ? { exact: selectedVideoInputDeviceId } : undefined
        }
      })
      videoStream.current = stream
    } catch (error) {
      console.log('error', error)
      cantAccessDeviceNotification.open()
    } finally {
      setVideoIsLoading(false)
    }
  }

  const testVideo = async () => {
    if (showVideo) {
      hideVideo()
      return
    }

    await setVideoStreamHandler()

    if (videoStream.current && videoEl.current) {
      videoEl.current.srcObject = videoStream.current
      setShowVideo(true)
    } else {
      setShowVideo(false)
    }
  }

  useEffect(() => {
    if (!showModal) {
      const tracks = videoStream.current?.getTracks()
      tracks?.forEach((track) => track.stop())
      setShowVideo(false)
    }
  }, [showModal])

  useEffect(() => {
    if (videoInputDeviceList.length > 0) {
      requestAndUpdateCamPermission()
    }
  }, [videoInputDeviceList])

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', updateDeviceList)

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', updateDeviceList)
    }
  }, [])

  return {
    testVideo,
    videoIcon,
    videoEl,
    loading,
    changeVideoInputDevice,
    videoDevices,
    showVideo,
    videoStream,
    setShowVideo,
    requestInputVideoDeviceList
  }
}
