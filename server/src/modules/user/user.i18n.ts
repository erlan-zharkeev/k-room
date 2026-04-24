import { defineI18n } from 'global-shared'

export const USER_I18N = defineI18n({
  userNotFound: {
    en: 'User not found',
    ru: 'Пользователь не найден'
  },
  userWithCurrentNameAlreadyExist: {
    en: 'A user with this username is already exist',
    ru: 'Пользователь с таким именем уже существует'
  },
  userWithCurrentEmailAlreadyExist: {
    en: 'A user with this email address is already exist',
    ru: 'Пользователь с таким email уже существует'
  },
  userWithCurrentIdAlreadyExist: {
    en: 'A user with this id is already exist',
    ru: 'Пользователь с таким id уже существует'
  }
})

export const USER_ADMIN_I18N = defineI18n({
  passwordRequired: {
    en: 'Password is required when creating a user from admin panel',
    ru: 'Пароль обязателен при создании пользователя из админ-панели'
  },
  validationFailed: {
    en: 'User form contains validation errors',
    ru: 'Форма пользователя содержит ошибки валидации'
  }
})

export const RESET_PASSWORD_I18N = defineI18n({
  failed: {
    en: 'Failed to reset password, try again later',
    ru: 'Не удалось сбросить пароль, попробуйте позже'
  },
  codeExpired: {
    en: 'Code expired',
    ru: 'Срок действия кода истёк'
  },
  codeNotValid: {
    en: 'Code is not valid',
    ru: 'Код недействителен'
  },
  success: {
    en: 'Password changed successfully',
    ru: 'Пароль успешно изменён'
  }
})

export const UPDATE_USER_DATA_I18N = defineI18n({
  nothingToUpdate: {
    en: 'Required at least one field',
    ru: 'Нужно передать хотя бы одно поле'
  },
  failedUpdate: {
    en: 'Failed to update user data',
    ru: 'Не удалось обновить данные пользователя'
  }
})

export const USER_SOCKET_I18N = defineI18n({
  actualizeUserDataFailed: {
    en: 'Failed to actualize user data',
    ru: 'Не удалось актуализировать данные пользователя'
  },
  updateLanguageFailed: {
    en: 'Failed to update language',
    ru: 'Не удалось обновить язык'
  },
  userConnectFailed: {
    en: 'Failed to update online status on connect',
    ru: 'Не удалось обновить онлайн-статус при подключении'
  },
  userDisconnectFailed: {
    en: 'Failed to update online status on disconnect',
    ru: 'Не удалось обновить онлайн-статус при отключении'
  }
})
