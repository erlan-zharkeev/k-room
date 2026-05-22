import { RegistrationFormData } from '../../model/types'

export interface RegistrationFormProps {
  onRegister: (payload: RegistrationFormData) => void
  isLoading: boolean
}

export interface PrivacyPolicySwitchProps {
  disabled: boolean
}
