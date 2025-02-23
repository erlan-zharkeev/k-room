import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { showModal, useViewport } from 'src/entities/system'
import { useTypedSelector } from 'src/shared/lib'
import { Button } from 'src/shared/ui'

export const CheckDevicesButton = () => {
  const { greaterOrEqualTablet } = useViewport()
  const { showCallModal } = useTypedSelector((state) => state.calls)
  const modalAppearance = useTypedSelector((state) => state.system.showModal)
  const dispatch = useDispatch<AppDispatch>()

  const openTechSettings = () => {
    dispatch(
      showModal({
        title: 'Settings',
        modalContentComponentName: 'tech-settings-popup'
      })
    )
  }

  if (!greaterOrEqualTablet) return null

  return (
    <Button
      iconName="thunder"
      color="accent"
      onClick={openTechSettings}
      tooltip="Check devices"
      disabled={modalAppearance || showCallModal}
    />
  )
}
