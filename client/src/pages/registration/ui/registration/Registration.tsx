import { RegistrationForm } from 'src/features/auth'
import { AuthTabsLayout } from 'src/widgets/auth-tabs-layout'

export const Registration = () => {
  return (
    <AuthTabsLayout>
      <RegistrationForm />
    </AuthTabsLayout>
  )
}
