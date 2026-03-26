import { useLogout } from 'src/features/auth/logout/hooks'

import { AppButton } from 'src/shared/ui'

export const LogoutButton = () => {
  const { logout, isLoading } = useLogout()

  return <AppButton prefixIconName="exit" onClick={logout} borderless loading={isLoading} />
}
