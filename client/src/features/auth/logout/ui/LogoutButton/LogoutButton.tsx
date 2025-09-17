import { AppButton } from 'src/shared/ui'

import { useLogout } from '../../hooks'

export const LogoutButton = () => {
  const { logout, isLoading } = useLogout()

  return <AppButton prefixIconName="exit" onClick={logout} borderless loading={isLoading} />
}
