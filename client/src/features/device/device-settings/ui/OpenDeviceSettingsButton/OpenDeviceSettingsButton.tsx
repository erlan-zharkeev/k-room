import { useDeviceSettings } from 'src/features/device/device-settings'

import { useCall } from 'src/entities/call'
import { useSystem, useViewport } from 'src/entities/system'

import { AppButton, AppTooltip } from 'src/shared/ui'

export const OpenDeviceSettingsButton = () => {
  const { greaterOrEqualTablet } = useViewport()
  const { showCallModal } = useCall()
  const { showModal: modalAppearance } = useSystem()
  const { openDeviceSettings } = useDeviceSettings()

  if (!greaterOrEqualTablet) return null

  return (
    <AppTooltip text="Device settings">
      <AppButton
        prefixIconName="thunder"
        color="accent-color"
        onClick={openDeviceSettings}
        disabled={modalAppearance || showCallModal}
        borderless
      />
    </AppTooltip>
  )
}
