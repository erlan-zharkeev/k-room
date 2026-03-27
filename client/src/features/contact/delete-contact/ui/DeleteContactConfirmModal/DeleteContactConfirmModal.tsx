import './style.scss'

import { DELETE_CONTACT_I18N } from 'src/features/contact/delete-contact'

import { useI18n } from 'src/entities/system'

import { AppText } from 'src/shared/ui'

export const DeleteContactConfirmModal = () => {
  const { t } = useI18n()

  return (
    <div className="delete-contact-confirm-modal">
      <AppText tag="p">{t(DELETE_CONTACT_I18N.confirmText)}</AppText>
    </div>
  )
}
