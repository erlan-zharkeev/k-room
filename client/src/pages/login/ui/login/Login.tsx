import { AuthTabsLayout } from 'src/widgets/auth-tabs-layout'

import { LoginForm, useLogin, useFirebase } from 'src/features/login'

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
