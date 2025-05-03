import { AuthTabsLayout } from 'src/widgets/auth-tabs-layout'

import { LoginForm } from 'src/features/auth'

export const Login = () => {
  return (
    <AuthTabsLayout>
      <LoginForm />
    </AuthTabsLayout>
  )
}
