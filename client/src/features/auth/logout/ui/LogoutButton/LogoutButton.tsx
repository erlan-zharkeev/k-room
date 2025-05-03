import { AppButton } from 'src/shared/ui'

import { useLogout } from '../../hooks'

export const LogoutButton = () => {
  const { logout } = useLogout()

  return <AppButton prefixIconName="exit" onClick={logout} borderless />
}
