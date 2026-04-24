import { PASSWORD_SPECIAL_CHARACTERS, VALIDATION_LIMITS, defineI18n } from 'shared'

export const AUTH_I18N = defineI18n({
  nonAuthorized: {
    en: 'User not authorized',
    ru: 'Пользователь не авторизован'
  },
  passwordMustBeAtLeast: {
    en: `Password must be at least ${VALIDATION_LIMITS.passwordMinLength} characters long`,
    ru: `Пароль должен содержать минимум ${VALIDATION_LIMITS.passwordMinLength} символов`
  },
  passwordMustBeStrong: {
    en: `Password must contain at least one letter, one number, and may include ${PASSWORD_SPECIAL_CHARACTERS} characters.`,
    ru: `Пароль должен содержать хотя бы одну букву, одну цифру и может включать символы ${PASSWORD_SPECIAL_CHARACTERS}.`
  },
  passwordNotContainSpaces: {
    en: 'Password must not contain spaces',
    ru: 'Пароль не должен содержать пробелы'
  },
  passwordMustContainOnlyLatin: {
    en: 'Password must contain only Latin characters',
    ru: 'Пароль должен содержать только латинские символы'
  },
  emailIsRequired: {
    en: 'Email is required',
    ru: 'Требуется email'
  },
  passwordIsRequired: {
    en: 'Password is required',
    ru: 'Требуется пароль'
  },
  invalidEmailFormat: {
    en: 'Invalid email format',
    ru: 'Неверный формат email'
  },
  fieldIsRequired: {
    en: 'Field is required',
    ru: 'Поле обязательно'
  },
  invalidProvider: {
    en: 'Invalid provider',
    ru: 'Неверный провайдер'
  },
  usernameTooLong: {
    en: 'Username is too long',
    ru: 'Имя пользователя слишком длинное'
  },
  usernameTooShort: {
    en: 'Username is too short',
    ru: 'Имя пользователя слишком короткое'
  },
  invalidEmailOrPassword: {
    en: 'Invalid email or password',
    ru: 'Неверный email или пароль'
  },
  emailNotConfirmed: {
    en: 'Please confirm your email. The confirmation email may have ended up in your spam folder',
    ru: 'Подтвердите email. Письмо с подтверждением могло попасть в спам'
  },
  loginFailed: {
    en: 'Login failed. Please try again later',
    ru: 'Не удалось выполнить вход. Попробуйте позже'
  },
  registrationSuccess: {
    en: 'Registration successful. Please check your email to confirm your account',
    ru: 'Регистрация завершена. Проверьте email и подтвердите аккаунт'
  },
  registrationFailed: {
    en: 'Registration failed. Please try again later',
    ru: 'Не удалось завершить регистрацию. Попробуйте позже'
  },
  emailConfirmationFailed: {
    en: 'Email confirmation failed',
    ru: 'Не удалось подтвердить email'
  },
  emailConfirmed: {
    en: 'Email has been confirmed',
    ru: 'Email подтверждён'
  },
  emailAlreadyConfirmed: {
    en: 'Email already confirmed',
    ru: 'Email уже подтверждён'
  },
  confirmationLinkSent: {
    en: 'Confirmation link has been sent',
    ru: 'Ссылка подтверждения отправлена'
  },
  noConfirmationAttemptsLeft: {
    en: 'No confirmation attempts left',
    ru: 'Попытки подтверждения закончились'
  },
  sendConfirmationLinkFailed: {
    en: 'Failed to send email confirmation link',
    ru: 'Не удалось отправить письмо с подтверждением'
  },
  signInWithProviderFailed: {
    en: 'Failed to sign in with provider',
    ru: 'Не удалось войти через провайдера'
  },
  tokensPairUpdated: {
    en: 'Token pair has been updated',
    ru: 'Пара токенов обновлена'
  },
  logoutFailed: {
    en: 'Failed to server logout',
    ru: 'Не удалось завершить сессию на сервере'
  }
})
