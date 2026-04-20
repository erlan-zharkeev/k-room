import { useRegistration } from 'src/features/registration'

type UseRegistrationReturnType = ReturnType<typeof useRegistration>

export interface IRegistrationFormProps {
  onRegister: UseRegistrationReturnType['onRegister']
  isLoading: UseRegistrationReturnType['isLoading']
}
