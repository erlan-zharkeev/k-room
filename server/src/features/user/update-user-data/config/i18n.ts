import { defineI18n } from 'common'

export const UPDATE_USER_DATA_I18N = defineI18n({
  nothingToUpdate: {
    en: 'Required at least one field',
    ru: 'Нужно передать хотя бы одно поле'
  },
  onlyImageFileAllowed: {
    en: 'The file is not an image or does not exist',
    ru: 'Файл не является изображением или не существует'
  },
  failedUpdate: {
    en: 'Failed to update user data',
    ru: 'Не удалось обновить данные пользователя'
  }
})
