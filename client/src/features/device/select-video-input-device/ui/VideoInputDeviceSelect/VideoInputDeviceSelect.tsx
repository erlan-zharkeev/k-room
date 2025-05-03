import { useEffect } from 'react'

import './style.scss'
import { SelectDevice, useInputVideoDevice } from 'src/features/device'

import { useSettings } from 'src/entities/settings'

export const VideoInputDeviceSelect = () => {
  const {
    testVideo,
    videoIcon,
    videoEl,
    loading,
    changeVideoInputDevice,
    videoDevices,
    showVideo,
    requestInputVideoDeviceList
  } = useInputVideoDevice()
  const { selectedVideoInputDeviceId } = useSettings()

  useEffect(() => {
    requestInputVideoDeviceList()
  }, [])

  return (
    <div className="video-input-device-select">
      <SelectDevice
        onChange={changeVideoInputDevice}
        actionHandler={testVideo}
        title="Video input device"
        prefixIconName={videoIcon}
        options={videoDevices}
        loading={loading}
        value={selectedVideoInputDeviceId}
        isErrorColor={showVideo}
      >
        <div
          className={`video-input-device-select__video${showVideo ? '' : ' video-input-device-select__video--hide'}`}
        >
          <video ref={videoEl} autoPlay />
        </div>
      </SelectDevice>
    </div>
  )
}
