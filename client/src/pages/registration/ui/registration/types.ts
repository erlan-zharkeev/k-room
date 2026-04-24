import type { RegistrationFormDataType } from '../../model/types'

export interface IRegistrationFormProps {
  onRegister: (payload: RegistrationFormDataType) => void
  isLoading: boolean
}

export interface IPrivacyPolicySwitchProps {
  disabled: boolean
}
