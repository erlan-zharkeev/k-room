import { useEffect, useMemo, useState } from 'react'

import { useDispatch } from 'react-redux'

import { updateSelectedAudioOutputDeviceId, useSettings } from 'src/entities/settings'
import { useSound } from 'src/entities/sound'
import { showModal, useSystem } from 'src/entities/system'

import { useTimeout } from 'src/shared/lib'

export const useOutputAudioDevice = () => {
  const [audioOutputDeviceList, setAudioOutputDeviceList] = useState([] as MediaDeviceInfo[])
  const { camPermission, micPermission } = useSystem()
  const { selectedAudioOutputDeviceId } = useSettings()
  const { startTimeout } = useTimeout()

  const { play, stop } = useSound()
  const dispatch = useDispatch()
  const [showIndicator, setShowIndicator] = useState(false)

  const testAudioOutput = () => {
    setShowIndicator(true)
    stop('message-delivered')
    play('message-delivered')

    startTimeout(() => setShowIndicator(false), 400)
  }

  const loading = useMemo(() => {
    return audioOutputDeviceList.length < 0
  }, [audioOutputDeviceList])

  const outputAudioDevices = useMemo(() => {
    return audioOutputDeviceList.map((device) => ({
      label: device.label,
      value: device.deviceId
    }))
  }, [audioOutputDeviceList])

  const onAudioOutputDeviceChange = (value: string = '') => {
    dispatch(updateSelectedAudioOutputDeviceId(value))
  }

  useEffect(() => {
    if (camPermission === 'granted' || micPermission === 'granted') {
      updateOutputAudioDeviceList()
    }
  }, [camPermission, micPermission])

  const updateOutputAudioDeviceList = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const audioOutputs = devices.filter((device) => device.kind === 'audiooutput')
      const thereAreNoPermissions = audioOutputs.every((device) => device.deviceId === '')
      if (audioOutputs.length === 0 || thereAreNoPermissions) {
        throw new Error('No audio output devices found or there are no permissions')
      }
      setAudioOutputDeviceList(audioOutputs)

      const selectedStillExists = audioOutputs.some((device) => device.deviceId === selectedAudioOutputDeviceId)

      if (!selectedStillExists) onAudioOutputDeviceChange()
    } catch (error) {
      console.error('Error accessing audio output devices:', error)
    }
  }

  useEffect(() => {
    if (!showModal) {
      stop('message-delivered')
    }
  }, [showModal])

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', updateOutputAudioDeviceList)

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', updateOutputAudioDeviceList)
    }
  }, [])

  return {
    testAudioOutput,
    loading,
    outputAudioDevices,
    onAudioOutputDeviceChange,
    updateOutputAudioDeviceList,
    showIndicator
  }
}
