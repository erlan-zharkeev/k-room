import { useState } from 'react'

import { EditUserDataModal } from 'src/features/user/edit-user-data/ui/EditUserDataModal/EditUserDataModal'
import { OPEN_MODAL_EDIT_USER_DATA_BTN_TEXT } from 'src/features/user/edit-user-data/ui/OpenModalEditUserDataBtn/config'

import { useI18n } from 'src/entities/system'

import { AppLink, AppModal } from 'src/shared/ui'

export const OpenModalEditUserDataBtn = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useI18n()

  return (
    <>
      <AppLink prevent text={t(OPEN_MODAL_EDIT_USER_DATA_BTN_TEXT.link)} onClick={() => setIsOpen(true)} />
      <AppModal title={t(OPEN_MODAL_EDIT_USER_DATA_BTN_TEXT.modalTitle)} open={isOpen} onClose={() => setIsOpen(false)}>
        <EditUserDataModal onSuccess={() => setIsOpen(false)} />
      </AppModal>
    </>
  )
}
