import { AuthTabsLayout } from 'src/widgets/auth-tabs-layout'

import { useFirebase } from 'src/pages/login/model/use-firebase'
import { useLogin } from 'src/pages/login/model/use-login'

import { LoginForm } from './LoginForm/LoginForm'

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
