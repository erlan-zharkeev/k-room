import { useEffect } from 'react'

import './style.scss'
import { SelectDevice, useInputVideoDevice } from 'src/features/device'

import { useSettings } from 'src/entities/settings'
import { createClassNameWithModifiers } from 'src/shared/utils'

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
  const videoClassName = createClassNameWithModifiers({
    rootClass: 'video-input-device-select__video',
    modifiers: [!showVideo && 'hide']
  })

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
        <div className={videoClassName}>
          <video ref={videoEl} autoPlay />
        </div>
      </SelectDevice>
    </div>
  )
}
