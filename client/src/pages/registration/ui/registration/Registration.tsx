import { AuthTabsLayout } from 'src/widgets/auth-tabs-layout'

import { RegistrationForm, useRegistration } from 'src/features/auth'

export const Registration = () => {
  const { onRegister, isLoading } = useRegistration()

  return (
    <AuthTabsLayout blockNavigation={isLoading}>
      <RegistrationForm onRegister={onRegister} isLoading={isLoading} />
    </AuthTabsLayout>
  )
}
