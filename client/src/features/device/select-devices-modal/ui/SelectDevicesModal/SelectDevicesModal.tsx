import { AudioInputDeviceSelect, VideoInputDeviceSelect, AudioOutputDeviceSelect } from '../../..'

export const SelectDevicesModal = () => {
  return (
    <div className="select-devices-modal">
      <AudioInputDeviceSelect />
      <VideoInputDeviceSelect />
      <AudioOutputDeviceSelect />
    </div>
  )
}
