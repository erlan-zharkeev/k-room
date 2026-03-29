import { useState } from 'react'

import { OPEN_MODAL_EDIT_USER_DATA_BTN_I18N, EditUserDataModal } from 'src/features/user'

import { useI18n } from 'src/entities/system'

import { AppLink, AppModal } from 'src/shared/ui'

export const OpenModalEditUserDataBtn = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useI18n()

  return (
    <>
      <AppLink prevent text={t(OPEN_MODAL_EDIT_USER_DATA_BTN_I18N.link)} onClick={() => setIsOpen(true)} />
      <AppModal title={t(OPEN_MODAL_EDIT_USER_DATA_BTN_I18N.modalTitle)} open={isOpen} onClose={() => setIsOpen(false)}>
        <EditUserDataModal onSuccess={() => setIsOpen(false)} />
      </AppModal>
    </>
  )
}
