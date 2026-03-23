import { useEditUserData } from 'src/features/user'

import './style.scss'

import { AppForm } from 'src/shared/ui'

export const EditUserDataModal = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { editUserData, isLoading, initialFormData } = useEditUserData({ onSuccess })

  return (
    <div className="edit-user-data-modal">
      <AppForm
        key={`${initialFormData.username}-${initialFormData.avatar}`}
        onSubmit={editUserData}
        fields={{
          avatar: {
            inputType: 'file',
            value: initialFormData.avatar,
            design: 'avatar'
          },
          username: {
            inputType: 'text',
            value: initialFormData.username,
            placeholder: 'Username',
            rule: { name: 'username' }
          }
        }}
        submitBtnText="Apply"
        actionProcessing={isLoading}
      />
    </div>
  )
}
