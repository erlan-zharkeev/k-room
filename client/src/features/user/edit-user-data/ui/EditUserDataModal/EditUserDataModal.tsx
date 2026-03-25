import './style.scss'

import { useEditUserData } from 'src/features/user'
import { EDIT_USER_DATA_MODAL_I18N } from 'src/features/user/edit-user-data/ui/EditUserDataModal/config'

import { useI18n } from 'src/entities/system'

import { AppForm } from 'src/shared/ui'

export const EditUserDataModal = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { editUserData, isLoading, initialFormData } = useEditUserData({ onSuccess })
  const { t } = useI18n()

  return (
    <div className="edit-user-data-modal">
      <AppForm
        key={`${initialFormData.username}-${initialFormData.avatar}`}
        onSubmit={editUserData}
        fields={{
          avatar: {
            inputType: 'file',
            value: initialFormData.avatar ? { name: 'avatar', src: initialFormData.avatar } : null,
            design: 'avatar',
            resetText: t(EDIT_USER_DATA_MODAL_I18N.reset)
          },
          username: {
            inputType: 'text',
            value: initialFormData.username,
            placeholder: t(EDIT_USER_DATA_MODAL_I18N.usernamePlaceholder),
            rule: { name: 'username' }
          }
        }}
        submitBtnText={t(EDIT_USER_DATA_MODAL_I18N.submit)}
        actionProcessing={isLoading}
      />
    </div>
  )
}
