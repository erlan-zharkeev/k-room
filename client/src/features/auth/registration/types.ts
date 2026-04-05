import { IAuthRegistrationPayload } from 'common'

export type RegistrationFormDataType = IAuthRegistrationPayload & {
  policy: boolean
}
