import './style.scss'
import { useEffect } from 'react'

import { VIDEO_INPUT_DEVICE_SELECT_I18N, SelectDevice, useInputVideoDevice } from 'src/features/device'

import { useSettings, useI18n } from 'src/entities/settings'

import { createClassNameWithModifiers } from 'src/shared/lib'

export const VideoInputDeviceSelect = () => {
  const { t } = useI18n()
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
        title={t(VIDEO_INPUT_DEVICE_SELECT_I18N.title)}
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
