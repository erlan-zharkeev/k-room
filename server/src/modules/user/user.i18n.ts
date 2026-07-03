import { defineI18n } from 'global-shared'

export const USER_I18N = defineI18n({
  userNotFound: {
    en: 'User not found',
    ru: 'Пользователь не найден',
    zh: '用户未找到'
  },
  userWithCurrentNameAlreadyExist: {
    en: 'A user with this nickname already exists',
    ru: 'Пользователь с таким никнеймом уже существует',
    zh: '该昵称已存在'
  },
  userWithCurrentEmailAlreadyExist: {
    en: 'A user with this email address is already exist',
    ru: 'Пользователь с таким email уже существует',
    zh: '该 email 已存在'
  },
  userWithCurrentIdAlreadyExist: {
    en: 'A user with this id is already exist',
    ru: 'Пользователь с таким id уже существует',
    zh: '该 id 的用户已存在'
  },
  credentialsManagedByProvider: {
    en: 'Email and password are managed by your sign-in provider. Contact support to unlink this account.',
    ru: 'Email и пароль управляются провайдером входа. Чтобы отвязать аккаунт, напишите в поддержку.',
    zh: 'Email 和密码由登录提供商管理。如需解除账号绑定，请联系支持。'
  }
})

export const USER_ADMIN_I18N = defineI18n({
  passwordRequired: {
    en: 'Password is required when creating a user from admin panel',
    ru: 'Пароль обязателен при создании пользователя из админ-панели',
    zh: '从管理面板创建用户时必须填写密码'
  },
  validationFailed: {
    en: 'User form contains validation errors',
    ru: 'Форма пользователя содержит ошибки валидации',
    zh: '用户表单包含验证错误'
  }
})

export const RESET_PASSWORD_I18N = defineI18n({
  failed: {
    en: 'Failed to reset password, try again later',
    ru: 'Не удалось сбросить пароль, попробуйте позже',
    zh: '重置密码失败，请稍后重试'
  },
  codeExpired: {
    en: 'Code expired',
    ru: 'Срок действия кода истёк',
    zh: '验证码已过期'
  },
  codeNotValid: {
    en: 'Code is not valid',
    ru: 'Код недействителен',
    zh: '验证码无效'
  },
  success: {
    en: 'Password changed successfully',
    ru: 'Пароль успешно изменён',
    zh: '密码修改成功'
  }
})

export const CHANGE_PASSWORD_I18N = defineI18n({
  failed: {
    en: 'Failed to change password, try again later',
    ru: 'Не удалось изменить пароль, попробуйте позже',
    zh: '修改密码失败，请稍后重试'
  },
  currentPasswordInvalid: {
    en: 'Current password is invalid',
    ru: 'Текущий пароль неверный',
    zh: '当前密码无效'
  },
  newPasswordSameAsCurrent: {
    en: 'New password must be different from current password',
    ru: 'Новый пароль должен отличаться от текущего',
    zh: '新密码必须与当前密码不同'
  },
  success: {
    en: 'Password changed successfully',
    ru: 'Пароль успешно изменён',
    zh: '密码修改成功'
  }
})

export const UPDATE_USER_DATA_I18N = defineI18n({
  nothingToUpdate: {
    en: 'Required at least one field',
    ru: 'Нужно передать хотя бы одно поле',
    zh: '至少需要提供一个字段'
  },
  failedUpdate: {
    en: 'Failed to update user data',
    ru: 'Не удалось обновить данные пользователя',
    zh: '更新用户数据失败'
  }
})

export const USER_SOCKET_I18N = defineI18n({
  actualizeUserDataFailed: {
    en: 'Failed to actualize user data',
    ru: 'Не удалось актуализировать данные пользователя',
    zh: '同步用户数据失败'
  },
  updateLanguageFailed: {
    en: 'Failed to update language',
    ru: 'Не удалось обновить язык',
    zh: '更新语言失败'
  },
  updateNotificationForegroundFailed: {
    en: 'Failed to update notification activity',
    ru: 'Не удалось обновить активность уведомлений',
    zh: '更新通知活动失败'
  },
  userConnectFailed: {
    en: 'Failed to update online status on connect',
    ru: 'Не удалось обновить онлайн-статус при подключении',
    zh: '连接时更新在线状态失败'
  },
  userDisconnectFailed: {
    en: 'Failed to update online status on disconnect',
    ru: 'Не удалось обновить онлайн-статус при отключении',
    zh: '断开连接时更新在线状态失败'
  }
})
