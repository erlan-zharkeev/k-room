import { VALIDATION_I18N, defineI18n } from 'global-shared'

export const AUTH_I18N = defineI18n({
  nonAuthorized: {
    en: 'User not authorized',
    ru: 'Пользователь не авторизован',
    zh: '用户未授权'
  },
  ...VALIDATION_I18N,
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
  confirmationLinkCooldown: {
    en: 'Please wait before requesting a new confirmation email',
    ru: 'Подождите перед повторной отправкой письма с подтверждением',
    zh: '请稍后再请求新的确认邮件'
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
