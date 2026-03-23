import { useState } from 'react'

import { SelectDevicesModal } from 'src/features/device'

import { AppButton, AppModal, AppTooltip } from 'src/shared/ui'

export const OpenDeviceSettingsButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <AppTooltip text="Device settings">
        <AppButton prefixIconName="thunder" color="accent-color" onClick={() => setIsOpen(true)} borderless />
      </AppTooltip>
      <AppModal title="Devices settings" open={isOpen} onClose={() => setIsOpen(false)}>
        <SelectDevicesModal />
      </AppModal>
    </>
  )
}
