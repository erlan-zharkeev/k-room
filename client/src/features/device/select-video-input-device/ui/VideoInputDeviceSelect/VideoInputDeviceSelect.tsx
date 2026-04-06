import './style.scss'
import { useEffect } from 'react'

import { VIDEO_INPUT_DEVICE_SELECT_I18N, SelectDevice, useInputVideoDevice } from 'src/features/device'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { useSettings, useI18n } from 'src/shared/settings'

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
          {/* Local camera preview does not provide caption tracks. */}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video ref={videoEl} autoPlay />
        </div>
      </SelectDevice>
    </div>
  )
}
