import { useRegistration } from 'src/features/auth/registration/hooks'

type UseRegistrationReturnType = ReturnType<typeof useRegistration>

export interface RegistrationFormProps {
  onRegister: UseRegistrationReturnType['onRegister']
  isLoading: UseRegistrationReturnType['isLoading']
}
