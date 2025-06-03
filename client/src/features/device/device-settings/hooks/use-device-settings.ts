import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { showModal } from 'src/entities/system'

export const useDeviceSettings = () => {
  const dispatch = useDispatch<AppDispatch>()

  const openDeviceSettings = () => {
    dispatch(
      showModal({
        title: 'Devices settings',
        modalContentComponentName: 'select-devices-modal'
      })
    )
  }

  return {
    openDeviceSettings
  }
}
