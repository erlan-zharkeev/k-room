import './style.scss'

import { PasswordRecoveryBody } from 'src/features/auth'

export const PasswordRecovery = () => {
  return (
    <div className="password-recovery">
      <h2 className="password-recovery__title header-text header-text--md header-text--accent">Password recovery</h2>
      <PasswordRecoveryBody />
    </div>
  )
}
