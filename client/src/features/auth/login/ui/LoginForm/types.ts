import { useFirebase, useLogin } from 'src/features/auth/login/hooks'

type UseLoginReturnType = ReturnType<typeof useLogin>
type UseFirebaseLoginReturnType = ReturnType<typeof useFirebase>

export interface LoginFormProps {
  onLogin: UseLoginReturnType['onLogin']
  isLoading: UseLoginReturnType['isLoading']
  onFirebaseLogin: UseFirebaseLoginReturnType['onFirebaseLogin']
  isFirebaseLoginLoading: UseFirebaseLoginReturnType['isFirebaseLoginLoading']
}
