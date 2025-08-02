import { AuthTabsLayout } from 'src/widgets/auth-tabs-layout'

import { RegistrationForm } from 'src/features/auth'
import { useRegistration } from 'src/features/auth/registration/hooks/use-registration'

export const Registration = () => {
  const { onRegister, isLoading } = useRegistration()

  return (
    <AuthTabsLayout blockNavigation={isLoading}>
      <RegistrationForm onRegister={onRegister} isLoading={isLoading} />
    </AuthTabsLayout>
  )
}
