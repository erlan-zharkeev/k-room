import type { IAuthRegistrationPayload } from 'global-shared'

export type RegistrationFormDataType = IAuthRegistrationPayload & {
  policy: boolean
}

export interface IRegistrationFormProps {
  onRegister: (payload: RegistrationFormDataType) => void
  isLoading: boolean
}
