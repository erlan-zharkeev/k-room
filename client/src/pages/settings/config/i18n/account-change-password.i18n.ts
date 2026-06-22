import { defineI18n } from 'src/shared/lib'
export const SETTINGS_ACCOUNT_CHANGE_PASSWORD_I18N = defineI18n('settingsAccountChangePassword', {
  changePassword: {
    en: 'Change password',
    ru: 'Изменить пароль',
    zh: '修改密码'
  },
  currentPassword: {
    en: 'Current password',
    ru: 'Текущий пароль',
    zh: '当前密码'
  },
  newPassword: {
    en: 'New password',
    ru: 'Новый пароль',
    zh: '新密码'
  },
  confirmPassword: {
    en: 'Confirm password',
    ru: 'Повторите пароль',
    zh: '确认密码'
  },
  passwordMismatch: {
    en: 'Passwords do not match',
    ru: 'Пароли не совпадают',
    zh: '两次输入的密码不一致'
  },
  newPasswordSameAsCurrent: {
    en: 'New password must be different from current password',
    ru: 'Новый пароль должен отличаться от текущего',
    zh: '新密码必须与当前密码不同'
  }
})
