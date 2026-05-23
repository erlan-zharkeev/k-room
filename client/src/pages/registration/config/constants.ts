import { USER_NICKNAME_MAX_LENGTH } from 'global-shared'

import type { RegistrationInitialFormData } from '../model/types.model'

export const DEFAULT_REGISTRATION_FORM_DATA: RegistrationInitialFormData = {
  nickname: '',
  email: '',
  password: '',
  policy: false
}

export const REGISTRATION_NICKNAME_INPUT_ATTRS = {
  maxLength: USER_NICKNAME_MAX_LENGTH
}
