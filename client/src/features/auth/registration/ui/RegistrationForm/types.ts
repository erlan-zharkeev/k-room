import { useRegistration } from '../..'

type UseRegistrationReturnType = ReturnType<typeof useRegistration>

export interface RegistrationFormProps {
  onRegister: UseRegistrationReturnType['onRegister']
  isLoading: UseRegistrationReturnType['isLoading']
}
