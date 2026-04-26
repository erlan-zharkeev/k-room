import { defineI18n } from 'global-shared'

export const VALIDATE_MEDIA_FILE_I18N = defineI18n({
  uploadFailed: {
    en: 'Upload failed',
    ru: 'Не удалось загрузить файл',
    zh: '上传失败'
  },
  fileIsTooLarge: {
    en: 'File is too large',
    ru: 'Файл слишком большой',
    zh: '文件过大'
  },
  extNotSupported: {
    en: 'The file extension is not supported',
    ru: 'Расширение файла не поддерживается',
    zh: '不支持该文件扩展名'
  },
  fileWithThisNameAlreadyExists: {
    en: 'File with this name already exists',
    ru: 'Файл с таким именем уже существует',
    zh: '同名文件已存在'
  }
})

export const COMMON_MEDIA_I18N = defineI18n({
  fileNotFound: {
    en: 'File not found',
    ru: 'Файл не найден',
    zh: '文件未找到'
  },
  failedToStreamFile: {
    en: 'Failed to stream file',
    ru: 'Не удалось отдать файл',
    zh: '无法传输文件'
  },
  failedToFindBucket: {
    en: 'Failed to find media bucket',
    ru: 'Не удалось найти media bucket',
    zh: '未找到媒体 bucket'
  }
})

export const GET_MEDIA_FILE_I18N = defineI18n({
  idNotProvideOrNotValid: {
    en: 'Id was not provided or is invalid',
    ru: 'Id не передан или некорректен',
    zh: '未提供 Id 或 Id 无效'
  },
  failedToProvideMedia: {
    en: 'Failed to provide media file',
    ru: 'Не удалось отдать медиафайл',
    zh: '无法提供媒体文件'
  }
})
