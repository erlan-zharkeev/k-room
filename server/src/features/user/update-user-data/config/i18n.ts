import { type LocalizedTextMapType } from 'common'

export const MESSAGE = {
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
} as const satisfies LocalizedTextMapType
