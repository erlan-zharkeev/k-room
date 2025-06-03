import './style.scss'
import { CreateNewPasswordBody } from 'src/features/auth/create-new-password'

export const CreateNewPassword = () => {
  return (
    <div className="create-new-password">
      <CreateNewPasswordBody />
    </div>
  )
}
