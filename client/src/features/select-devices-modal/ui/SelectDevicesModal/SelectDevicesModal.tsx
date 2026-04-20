import { AudioInputDeviceSelect } from 'src/features/select-audio-input-device'
import { AudioOutputDeviceSelect } from 'src/features/select-audio-output-device'
import { VideoInputDeviceSelect } from 'src/features/select-video-input-device'

export const SelectDevicesModal = () => {
  return (
    <div className="select-devices-modal">
      <AudioInputDeviceSelect />
      <VideoInputDeviceSelect />
      <AudioOutputDeviceSelect />
    </div>
  )
}
