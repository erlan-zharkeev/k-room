import { useRegistration } from 'src/features/auth/registration'

type UseRegistrationReturnType = ReturnType<typeof useRegistration>

export interface IRegistrationFormProps {
  onRegister: UseRegistrationReturnType['onRegister']
  isLoading: UseRegistrationReturnType['isLoading']
}
