import { defineI18n } from 'src/shared/lib'
export const SETTINGS_ACCOUNT_CHANGE_EMAIL_I18N = defineI18n('settingsAccountChangeEmail', {
  changeEmail: {
    en: 'Change email',
    ru: 'Изменить email',
    zh: '修改 email'
  },
  currentEmail: {
    en: 'Current email',
    ru: 'Текущий email',
    zh: '当前 email'
  },
  newEmail: {
    en: 'New email',
    ru: 'Новый email',
    zh: '新 email'
  },
  emailCode: {
    en: 'Code from email',
    ru: 'Код из письма',
    zh: '邮件验证码'
  },
  sendCode: {
    en: 'Send code',
    ru: 'Отправить код',
    zh: '发送验证码'
  },
  validateCode: {
    en: 'Validate code',
    ru: 'Проверить код',
    zh: '验证验证码'
  },
  emailNotChanged: {
    en: 'Enter a different email',
    ru: 'Введите другой email',
    zh: '请输入不同的 email'
  }
})
