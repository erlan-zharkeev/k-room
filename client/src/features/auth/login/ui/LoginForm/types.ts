import { useFirebase, useLogin } from 'src/features/auth/login'

type UseLoginReturnType = ReturnType<typeof useLogin>
type UseFirebaseLoginReturnType = ReturnType<typeof useFirebase>

export interface ILoginFormProps {
  onLogin: UseLoginReturnType['onLogin']
  isLoading: UseLoginReturnType['isLoading']
  onFirebaseLogin: UseFirebaseLoginReturnType['onFirebaseLogin']
  isFirebaseLoginLoading: UseFirebaseLoginReturnType['isFirebaseLoginLoading']
}
