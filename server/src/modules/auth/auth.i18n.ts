import { PASSWORD_SPECIAL_CHARACTERS, VALIDATION_LIMITS, defineI18n } from 'global-shared'

export const AUTH_I18N = defineI18n({
  nonAuthorized: {
    en: 'User not authorized',
    ru: 'Пользователь не авторизован',
    zh: '用户未授权'
  },
  passwordMustBeAtLeast: {
    en: `Password must be at least ${VALIDATION_LIMITS.passwordMinLength} characters long`,
    ru: `Пароль должен содержать минимум ${VALIDATION_LIMITS.passwordMinLength} символов`,
    zh: `密码长度至少为 ${VALIDATION_LIMITS.passwordMinLength} 个字符`
  },
  passwordMustBeStrong: {
    en: `Password must contain at least one letter, one number, and may include ${PASSWORD_SPECIAL_CHARACTERS} characters.`,
    ru: `Пароль должен содержать хотя бы одну букву, одну цифру и может включать символы ${PASSWORD_SPECIAL_CHARACTERS}.`,
    zh: `密码必须至少包含一个字母和一个数字，可包含 ${PASSWORD_SPECIAL_CHARACTERS} 字符。`
  },
  passwordNotContainSpaces: {
    en: 'Password must not contain spaces',
    ru: 'Пароль не должен содержать пробелы',
    zh: '密码不能包含空格'
  },
  passwordMustContainOnlyLatin: {
    en: 'Password must contain only Latin characters',
    ru: 'Пароль должен содержать только латинские символы',
    zh: '密码只能包含拉丁字符'
  },
  emailIsRequired: {
    en: 'Email is required',
    ru: 'Требуется email',
    zh: '需要填写 email'
  },
  passwordIsRequired: {
    en: 'Password is required',
    ru: 'Требуется пароль',
    zh: '需要填写密码'
  },
  invalidEmailFormat: {
    en: 'Invalid email format',
    ru: 'Неверный формат email',
    zh: 'Email 格式不正确'
  },
  fieldIsRequired: {
    en: 'Field is required',
    ru: 'Поле обязательно',
    zh: '字段为必填项'
  },
  invalidProvider: {
    en: 'Invalid provider',
    ru: 'Неверный провайдер',
    zh: '提供商无效'
  },
  nicknameTooLong: {
    en: 'Nickname is too long',
    ru: 'Никнейм слишком длинный',
    zh: '昵称过长'
  },
  nicknameTooShort: {
    en: 'Nickname is too short',
    ru: 'Никнейм слишком короткий',
    zh: '昵称过短'
  },
  invalidEmailOrPassword: {
    en: 'Invalid login or password',
    ru: 'Неверный логин или пароль',
    zh: '登录名或密码不正确'
  },
  emailNotConfirmed: {
    en: 'Please confirm your email. The confirmation email may have ended up in your spam folder',
    ru: 'Подтвердите email. Письмо с подтверждением могло попасть в спам',
    zh: '请确认你的 email。确认邮件可能进入了垃圾邮件文件夹'
  },
  loginFailed: {
    en: 'Login failed. Please try again later',
    ru: 'Не удалось выполнить вход. Попробуйте позже',
    zh: '登录失败，请稍后重试'
  },
  registrationSuccess: {
    en: 'Registration successful. Please check your email to confirm your account',
    ru: 'Регистрация завершена. Проверьте email и подтвердите аккаунт',
    zh: '注册成功。请检查 email 并确认你的账户'
  },
  registrationFailed: {
    en: 'Registration failed. Please try again later',
    ru: 'Не удалось завершить регистрацию. Попробуйте позже',
    zh: '注册失败，请稍后重试'
  },
  emailConfirmationFailed: {
    en: 'Email confirmation failed',
    ru: 'Не удалось подтвердить email',
    zh: 'Email 确认失败'
  },
  emailConfirmed: {
    en: 'Email has been confirmed',
    ru: 'Email подтверждён',
    zh: 'Email 已确认'
  },
  emailAlreadyConfirmed: {
    en: 'Email already confirmed',
    ru: 'Email уже подтверждён',
    zh: 'Email 已经确认'
  },
  confirmationLinkSent: {
    en: 'Confirmation link has been sent',
    ru: 'Ссылка подтверждения отправлена',
    zh: '确认链接已发送'
  },
  noConfirmationAttemptsLeft: {
    en: 'No confirmation attempts left',
    ru: 'Попытки подтверждения закончились',
    zh: '确认尝试次数已用完'
  },
  sendConfirmationLinkFailed: {
    en: 'Failed to send email confirmation link',
    ru: 'Не удалось отправить письмо с подтверждением',
    zh: '发送 email 确认链接失败'
  },
  signInWithProviderFailed: {
    en: 'Failed to sign in with provider',
    ru: 'Не удалось войти через провайдера',
    zh: '通过提供商登录失败'
  },
  tokensPairUpdated: {
    en: 'Token pair has been updated',
    ru: 'Пара токенов обновлена',
    zh: '令牌对已更新'
  },
  logoutFailed: {
    en: 'Failed to server logout',
    ru: 'Не удалось завершить сессию на сервере',
    zh: '服务器退出登录失败'
  }
})
