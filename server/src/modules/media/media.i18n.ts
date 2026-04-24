import { defineI18n } from 'global-shared'

export const VALIDATE_MEDIA_FILE_I18N = defineI18n({
  uploadFailed: {
    en: 'Upload failed',
    ru: 'Не удалось загрузить файл'
  },
  fileIsTooLarge: {
    en: 'File is too large',
    ru: 'Файл слишком большой'
  },
  extNotSupported: {
    en: 'The file extension is not supported',
    ru: 'Расширение файла не поддерживается'
  },
  fileWithThisNameAlreadyExists: {
    en: 'File with this name already exists',
    ru: 'Файл с таким именем уже существует'
  }
})

export const COMMON_MEDIA_I18N = defineI18n({
  fileNotFound: {
    en: 'File not found',
    ru: 'Файл не найден'
  },
  failedToStreamFile: {
    en: 'Failed to stream file',
    ru: 'Не удалось отдать файл'
  },
  failedToFindBucket: {
    en: 'Failed to find media bucket',
    ru: 'Не удалось найти media bucket'
  }
})

export const GET_MEDIA_FILE_I18N = defineI18n({
  idNotProvideOrNotValid: {
    en: 'Id was not provided or is invalid',
    ru: 'Id не передан или некорректен'
  },
  failedToProvideMedia: {
    en: 'Failed to provide media file',
    ru: 'Не удалось отдать медиафайл'
  }
})
