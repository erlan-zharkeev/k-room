import './style.scss'

import { DELETE_CONTACT_I18N } from 'src/features/contact'
import type { IDeleteContactConfirmModalProps } from 'src/features/contact'

import { useI18n } from 'src/entities/system'

import { AppModal, AppText } from 'src/shared/ui'

export const DeleteContactConfirmModal = ({ open, onConfirm, onClose, loading }: IDeleteContactConfirmModalProps) => {
  const { t } = useI18n()

  return (
    <AppModal
      title={t(DELETE_CONTACT_I18N.modalTitle)}
      open={open}
      onClose={onClose}
      cancelAction={{ onClick: onClose }}
      okAction={{
        text: t(DELETE_CONTACT_I18N.confirm),
        color: 'error-color',
        loading,
        onClick: onConfirm
      }}
    >
      <div className="delete-contact-confirm-modal">
        <AppText tag="p">{t(DELETE_CONTACT_I18N.confirmText)}</AppText>
      </div>
    </AppModal>
  )
}
