import { useEffect, useState } from 'react'

import { useSettings } from 'src/entities/settings'
import { useSound } from 'src/entities/sound'
import { useSystem } from 'src/entities/system'

import { useTimeout } from 'src/shared/lib'

export const useOutputAudioDevice = () => {
  const [audioOutputDeviceList, setAudioOutputDeviceList] = useState([] as MediaDeviceInfo[])
  const { camPermission, micPermission } = useSystem()
  const settings = useSettings()
  const { startTimeout } = useTimeout()

  const { play, stop } = useSound()
  const [showIndicator, setShowIndicator] = useState(false)

  const testAudioOutput = () => {
    setShowIndicator(true)
    stop('message-delivered')
    play('message-delivered')

    startTimeout(() => setShowIndicator(false), 400)
  }

  const loading = audioOutputDeviceList.length < 0

  const outputAudioDevices = audioOutputDeviceList.map((device) => ({
    label: device.label,
    value: device.deviceId
  }))

  const onAudioOutputDeviceChange = (value: string = '') => {
    settings.update({ selectedAudioOutputDeviceId: value })
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

      const selectedStillExists = audioOutputs.some(
        (device) => device.deviceId === settings.selectedAudioOutputDeviceId
      )

      if (!selectedStillExists) onAudioOutputDeviceChange()
    } catch (error) {
      console.error('Error accessing audio output devices:', error)
    }
  }

  useEffect(() => {
    return () => {
      stop('message-delivered')
    }
  }, [])

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
