import { defineI18n } from 'global-shared'

export const API_I18N = defineI18n({
  unknownError: {
    en: 'Unknown error',
    ru: 'Неизвестная ошибка',
    zh: '未知错误'
  },
  genericError: {
    en: (message: string) => `An error has occurred, please try again later. Error: ${message}`,
    ru: (message: string) => `Произошла ошибка, попробуйте позже. Ошибка: ${message}`,
    zh: (message: string) => `发生错误，请稍后重试。错误：${message}`
  }
})

export const TOAST_I18N = defineI18n({
  success: {
    en: 'Success',
    ru: 'Успешно',
    zh: '成功'
  },
  info: {
    en: 'Info',
    ru: 'Информация',
    zh: '信息'
  },
  warn: {
    en: 'Warning',
    ru: 'Предупреждение',
    zh: '警告'
  },
  error: {
    en: 'Error',
    ru: 'Ошибка',
    zh: '错误'
  }
})

export const COMMON_I18N = defineI18n({
  back: {
    en: 'Back',
    ru: 'Назад',
    zh: '返回'
  },
  changePassword: {
    en: 'Change password',
    ru: 'Изменить пароль',
    zh: '修改密码'
  },
  sendCode: {
    en: 'Send code',
    ru: 'Отправить код',
    zh: '发送验证码'
  }
})
