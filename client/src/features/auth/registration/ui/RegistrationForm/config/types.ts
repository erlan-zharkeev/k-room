import { useRegistration } from 'src/features/auth'

type UseRegistrationReturnType = ReturnType<typeof useRegistration>

export interface IRegistrationFormProps {
  onRegister: UseRegistrationReturnType['onRegister']
  isLoading: UseRegistrationReturnType['isLoading']
}
