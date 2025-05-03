import './style.scss'

import { AudioInputDeviceSelect, VideoInputDeviceSelect, AudioOutputDeviceSelect } from 'src/features/device'

export const DevicesPopup = () => {
  return (
    <div className="device-popup">
      <AudioInputDeviceSelect />
      <VideoInputDeviceSelect />
      <AudioOutputDeviceSelect />
    </div>
  )
}
