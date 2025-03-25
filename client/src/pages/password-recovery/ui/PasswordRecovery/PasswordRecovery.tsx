import './style.scss'
import { PasswordRecoveryForm } from 'src/features/password-recovery'

export const PasswordRecovery = () => {
  return (
    <div className="password-recovery">
      <div className="header-text header-text--md header-text--accent">Password recovery</div>
      <PasswordRecoveryForm />
    </div>
  )
}
