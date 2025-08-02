import { AuthTabsLayout } from 'src/widgets/auth-tabs-layout'

import { LoginForm } from 'src/features/auth'
import { useLogin, useFirebase } from 'src/features/auth/login/hooks'

export const Login = () => {
  const { onLogin, isLoading } = useLogin()
  const { onFirebaseLogin, isFirebaseLoginLoading } = useFirebase()

  return (
    <AuthTabsLayout blockNavigation={isLoading || isFirebaseLoginLoading}>
      <LoginForm
        onLogin={onLogin}
        isLoading={isLoading}
        onFirebaseLogin={onFirebaseLogin}
        isFirebaseLoginLoading={isFirebaseLoginLoading}
      />
    </AuthTabsLayout>
  )
}
