import { VALIDATION_LIMITS } from 'common-types'

export const MESSAGE = {
  nonAuthorized: 'User not authorized',
  usernameRequired: 'Username is required',
  passwordMustBeAtLeast: `Password must be at least ${VALIDATION_LIMITS.passwordMinLength} characters long`,
  passwordMustBeStrong: '"Password must contain at least one letter, one number, and may include @$!%*?& characters."',
  passwordNotContainSpaces: 'Password must not contain spaces',
  passwordMustContainOnlyLatin: 'Password must contain only Latin characters',
  emailIsRequired: 'Email is required',
  passwordIsRequired: 'Password is required',
  invalidEmailFormat: 'Invalid email format',
  fieldIsRequired: 'Field is required',
  invalidProvider: 'Invalid provider',
  atLeastOneRequired: 'Require at least one field',
  usernameIsRequired: 'Username is required',
  usernameTooLong: 'Username is too long',
  usernameTooShort: 'Username is too short'
}
