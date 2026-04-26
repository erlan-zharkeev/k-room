import { defineI18n } from 'global-shared'

export const CREATE_NEW_PASSWORD_I18N = defineI18n({
  title: {
    en: 'Create new password',
    ru: 'Создание нового пароля',
    zh: '创建新密码'
  },
  enterNewPasswordHint: {
    en: 'Enter a new password for your account.',
    ru: 'Введите новый пароль для вашего аккаунта.',
    zh: '请输入您的新密码。'
  },
  repeatPasswordHint: {
    en: 'Repeat the password to confirm the change.',
    ru: 'Повторите пароль, чтобы подтвердить изменение.',
    zh: '请再次输入密码以确认修改。'
  },
  firstPasswordPlaceholder: {
    en: 'Password',
    ru: 'Пароль',
    zh: '密码'
  },
  secondPasswordPlaceholder: {
    en: 'Confirm password',
    ru: 'Подтвердите пароль',
    zh: '确认密码'
  },
  submit: {
    en: 'Change password',
    ru: 'Изменить пароль',
    zh: '修改密码'
  },
  mismatch: {
    en: "Passwords don't match",
    ru: 'Пароли не совпадают',
    zh: '两次输入的密码不一致'
  },
  success: {
    en: 'Password changed successfully',
    ru: 'Пароль успешно изменён',
    zh: '密码修改成功'
  },
  toLogin: {
    en: 'Go to login page',
    ru: 'Перейти ко входу',
    zh: '前往登录页'
  },
  back: {
    en: 'Back',
    ru: 'Назад',
    zh: '返回'
  }
})
