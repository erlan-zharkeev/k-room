import { useEffect, useRef, useState } from 'react'

import { useDevicePermissionRequestAndUpdate } from 'src/features/device/request-and-update-device-permission'

import { NOTIFICATION_I18N, useNotification } from 'src/entities/notification'
import { useSettings, useI18n } from 'src/entities/settings'

import { frontCaptureSentryException } from 'src/shared/lib'
import { AppIconNameType } from 'src/shared/ui'

export const useInputVideoDevice = () => {
  const { getNotification } = useNotification()
  const { t } = useI18n()

  const [videoInputDeviceList, setVideoInputDeviceList] = useState([] as MediaDeviceInfo[])
  const settings = useSettings()
  const [isVideoLoading, setVideoIsLoading] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const videoStream = useRef<MediaStream | null>(null)

  const { requestAndUpdateCamPermission } = useDevicePermissionRequestAndUpdate()

  const videoEl = useRef<HTMLVideoElement>(null)

  const videoIcon: AppIconNameType = isVideoLoading ? 'loader' : showVideo ? 'cross' : 'thunder'

  const loading = videoInputDeviceList.length < 0

  const changeVideoInputDevice = (value: string = '') => {
    settings.update({ selectedVideoInputDeviceId: value })
  }

  const hideVideo = () => {
    const tracks = videoStream.current?.getTracks()
    tracks?.forEach((track) => track.stop())
    setShowVideo(false)
  }

  const cantAccessDeviceNotification = getNotification({
    message: t(NOTIFICATION_I18N.cantAccessDevice),
    messageType: 'error'
  })

  const videoDevices = videoInputDeviceList.map((device) => ({
    label: device.label,
    value: device.deviceId
  }))

  const isExpectedVideoDeviceError = (error: unknown) => {
    if (error instanceof DOMException) {
      return error.name === 'NotAllowedError' || error.name === 'NotFoundError' || error.name === 'AbortError'
    }

    if (error instanceof Error) {
      return error.message === 'Permission denied' || error.message === 'Get user media not supported'
    }

    return false
  }

  const updateDeviceList = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoInputs = devices.filter((device) => device.kind === 'videoinput')
    setVideoInputDeviceList(videoInputs)
    const selectedStillExists = videoInputs.some((device) => device.deviceId === settings.selectedVideoInputDeviceId)

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
          deviceId: settings.selectedVideoInputDeviceId ? { exact: settings.selectedVideoInputDeviceId } : undefined
        }
      })
      videoStream.current = stream
    } catch (error) {
      if (!isExpectedVideoDeviceError(error)) {
        frontCaptureSentryException(error)
      }

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
    return () => {
      const tracks = videoStream.current?.getTracks()
      tracks?.forEach((track) => track.stop())
      setShowVideo(false)
    }
  }, [])

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
