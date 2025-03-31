import { CreateNewPasswordForm } from 'src/features/create-new-password'

export const CreateNewPassword = () => {
  return (
    <div className="create-new-password">
      <div className="header-text header-text--md header-text--accent">Create new password</div>
      <CreateNewPasswordForm />
    </div>
  )
}
