import { useRegistration } from 'src/features/auth/registration'

type UseRegistrationReturnType = ReturnType<typeof useRegistration>

export interface RegistrationFormProps {
  onRegister: UseRegistrationReturnType['onRegister']
  isLoading: UseRegistrationReturnType['isLoading']
}
