import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { showModal, useViewport } from 'src/entities/system'
import { useTypedSelector } from 'src/shared/lib'
import { AppButton } from 'src/shared/ui'

export const CheckDevicesButton = () => {
  const { greaterOrEqualTablet } = useViewport()
  const { showCallModal } = useTypedSelector((state) => state.calls)
  const modalAppearance = useTypedSelector((state) => state.system.showModal)
  const dispatch = useDispatch<AppDispatch>()

  const openTechSettings = () => {
    dispatch(
      showModal({
        title: 'Devices settings',
        modalContentComponentName: 'tech-settings-popup'
      })
    )
  }

  if (!greaterOrEqualTablet) return null

  return (
    <AppButton
      prefixIconName="thunder"
      color="accent-color"
      onClick={openTechSettings}
      tooltip="Check devices"
      disabled={modalAppearance || showCallModal}
      borderless
    />
  )
}
