import { AuthRegistrationPayload } from 'common'

export type RegistrationFormData = AuthRegistrationPayload & {
  policy: boolean
}
