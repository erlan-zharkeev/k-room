import { defineI18n } from 'common'

export const USER_I18N = defineI18n({
  userNotFound: {
    en: 'User not found',
    ru: 'Пользователь не найден'
  },
  userAlreadyExist: {
    en: 'User with same id, email, or username already exists',
    ru: 'Пользователь с таким id, email или именем уже существует'
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
