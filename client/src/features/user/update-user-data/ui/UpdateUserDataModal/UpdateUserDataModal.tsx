import { useUpdateUserData } from 'src/features/user'

import './style.scss'

import { AppForm } from 'src/shared/ui'

export const UpdateUserDataModal = () => {
  const { updateUserData, isLoading, initialFormData } = useUpdateUserData()

  return (
    <div className="update-user-data-modal">
      <AppForm
        onSubmit={updateUserData}
        fields={{
          avatar: {
            inputType: 'file',
            value: initialFormData.avatarPath,
            design: 'avatar'
          },
          username: {
            inputType: 'text',
            value: initialFormData.username,
            placeholder: 'Username',
            rule: { name: 'username' }
          }
        }}
        submitBtnText="Update"
        actionProcessing={isLoading}
      />
    </div>
  )
}
