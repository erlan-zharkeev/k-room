import { useState } from 'react'

import { OPEN_DEVICE_SETTINGS_BUTTON_I18N, SelectDevicesModal } from 'src/features/device'

import { useI18n } from 'src/entities/system'

import { AppButton, AppModal, AppTooltip } from 'src/shared/ui'

export const OpenDeviceSettingsButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useI18n()

  return (
    <>
      <AppTooltip text={t(OPEN_DEVICE_SETTINGS_BUTTON_I18N.tooltip)}>
        <AppButton prefixIconName="thunder" color="accent-color" onClick={() => setIsOpen(true)} borderless />
      </AppTooltip>
      <AppModal title={t(OPEN_DEVICE_SETTINGS_BUTTON_I18N.modalTitle)} open={isOpen} onClose={() => setIsOpen(false)}>
        <SelectDevicesModal />
      </AppModal>
    </>
  )
}
