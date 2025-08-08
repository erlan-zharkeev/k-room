export enum Message {
  UsernameRequired = 'Username is required',
  PasswordCantBeLessThan = 'Password cant be less than 6 letters',
  UserWithCurrentNameAlreadyExist = 'A user with this username is already registered',
  UserWithCurrentEmailAlreadyExist = 'A user with this email address is already registered',
  RegistrationSuccess = 'Registration successful. Please check your email to confirm your account',
  FailedRegistration = 'Registration failed. Please try again later',
  EmailIsRequired = 'Email is required',
  InvalidEmailFormat = 'Invalid email format',
  PasswordMustBeAtLeast = 'Password must be at least 6 characters long',
  PasswordMustContainBoth = 'Password must contain both letters and numbers',
  PasswordNotContainSpaces = 'Password must not contain spaces',
  PasswordMustContainOnlyLatin = 'Password must contain only Latin characters'
}
