import type { IAuthRegistrationPayload } from 'global-shared'

export type RegistrationFormDataType = IAuthRegistrationPayload & {
  policy: boolean
}
