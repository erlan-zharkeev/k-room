import { LoginForm } from 'src/features/auth'
import { AuthTabsLayout } from 'src/widgets/auth-tabs-layout'

export const Login = () => {
  return (
    <AuthTabsLayout>
      <LoginForm />
    </AuthTabsLayout>
  )
}
