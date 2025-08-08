export enum Message {
  Success = 'Logged in successfully',
  EmailNotConfirmed = 'Please confirm your email. The confirmation email may have ended up in your spam folder.',
  InvalidEmailOrPassword = 'Invalid email or password.',
  Failed = 'Login failed. Please try again later',
  EmailIsRequired = 'Email is required',
  InvalidEmailFormat = 'Invalid email format',
  PasswordIsRequired = 'Password is required'
}
