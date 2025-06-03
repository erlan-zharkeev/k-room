import { AudioInputDeviceSelect, VideoInputDeviceSelect, AudioOutputDeviceSelect } from 'src/features/device'

export const SelectDevicesModal = () => {
  return (
    <div className="select-devices-modal">
      <AudioInputDeviceSelect />
      <VideoInputDeviceSelect />
      <AudioOutputDeviceSelect />
    </div>
  )
}
