import { AuthTabsLayout } from 'src/widgets/auth-tabs-layout'

import { useRegistration } from 'src/pages/registration/model/use-registration'

import { RegistrationForm } from './RegistrationForm/RegistrationForm'

export const Registration = () => {
  const { onRegister, isLoading } = useRegistration()

  return (
    <AuthTabsLayout blockNavigation={isLoading}>
      <RegistrationForm onRegister={onRegister} isLoading={isLoading} />
    </AuthTabsLayout>
  )
}
