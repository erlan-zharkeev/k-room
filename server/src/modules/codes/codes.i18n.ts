import { defineI18n } from 'global-shared'

export const SEND_CHANGE_EMAIL_CODE_I18N = defineI18n({
  codeSent: {
    en: 'Email change code has been sent',
    ru: 'Код для смены email отправлен',
    zh: '邮箱修改验证码已发送'
  },
  sendFailed: {
    en: 'Failed to send email change code',
    ru: 'Не удалось отправить код для смены email',
    zh: '发送邮箱修改验证码失败'
  },
  tooManyRequests: {
    en: 'Please wait before requesting a new code',
    ru: 'Подождите перед повторной отправкой кода',
    zh: '请稍后再请求新的验证码'
  }
})

export const VALIDATE_CHANGE_EMAIL_CODE_I18N = defineI18n({
  validated: {
    en: 'Email changed successfully',
    ru: 'Email успешно изменён',
    zh: '邮箱修改成功'
  },
  invalidCode: {
    en: 'The email change code is invalid',
    ru: 'Код смены email недействителен',
    zh: '邮箱修改验证码无效'
  },
  expiredCode: {
    en: 'The email change code has expired',
    ru: 'Срок действия кода смены email истёк',
    zh: '邮箱修改验证码已过期'
  },
  validationFailed: {
    en: 'Failed to validate email change code',
    ru: 'Не удалось проверить код смены email',
    zh: '验证邮箱修改验证码失败'
  },
  emailNotChanged: {
    en: 'Enter a different email',
    ru: 'Введите другой email',
    zh: '请输入不同的 email'
  }
})

export const SEND_PASSWORD_RECOVERY_CODE_I18N = defineI18n({
  codeSent: {
    en: 'Password recovery code has been sent',
    ru: 'Код для восстановления пароля отправлен',
    zh: '密码恢复验证码已发送'
  },
  sendFailed: {
    en: 'Failed to send password recovery code',
    ru: 'Не удалось отправить код для восстановления пароля',
    zh: '发送密码恢复验证码失败'
  },
  tooManyRequests: {
    en: 'Please wait before requesting a new code',
    ru: 'Подождите перед повторной отправкой кода',
    zh: '请稍后再请求新的验证码'
  }
})

export const VALIDATE_PASSWORD_RECOVERY_CODE_I18N = defineI18n({
  validated: {
    en: 'The password recovery code is valid',
    ru: 'Код восстановления пароля подтверждён',
    zh: '密码恢复验证码有效'
  },
  invalidCode: {
    en: 'The password recovery code is invalid',
    ru: 'Код восстановления пароля недействителен',
    zh: '密码恢复验证码无效'
  },
  expiredCode: {
    en: 'The password recovery code has expired',
    ru: 'Срок действия кода восстановления пароля истёк',
    zh: '密码恢复验证码已过期'
  },
  validationFailed: {
    en: 'Failed to validate password recovery code',
    ru: 'Не удалось проверить код восстановления пароля',
    zh: '验证密码恢复验证码失败'
  }
})
